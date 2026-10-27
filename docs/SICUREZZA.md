# Sicurezza di AELIS Training

In breve: **ogni regola importante vive nel database**, non nella pagina. Anche chi modifica l'app dal browser o chiama direttamente il server trova le stesse porte chiuse.

## Chi può fare cosa
| | Coach | Cliente | Chiunque altro |
|---|---|---|---|
| Iscriversi | una volta sola, con l'email scritta nello schema | solo con un invito valido (14 giorni, monouso, legato alla sua email) | no |
| Note private, limitazioni, contatti, incassi, ore | legge e scrive | **no** | no |
| Scheda, agenda, percorso di un cliente | legge e scrive | legge solo i suoi | no |
| Allenamenti, check, richieste | legge (non può riscriverli) | scrive solo i suoi | no |
| Sfide e community | pubblica | vede solo il nome di battesimo degli altri, o "Anonimo" | no |
| Cambiare ruolo | no | no | no |

Il ruolo non si può cambiare dall'app: non esiste nessuna regola che lo permetta.

## Cosa è già attivo
**Database**
- Row Level Security su tutte le tabelle, testata su Postgres con più di 10 scenari di attacco (`tests/sql-test-sicurezza.sql`).
- Iscrizione bloccata da un trigger nel database, se manca un invito valido.
- Le funzioni interne delle regole stanno in uno schema privato, non raggiungibile dalle API. L'unica funzione aperta a chi non ha fatto l'accesso è il controllo dell'invito, che risponde solo sì o no ed è inutile senza il codice.
- Gli inviti sono codici casuali da 128 bit, legati all'email, che scadono in 14 giorni e si consumano al primo uso.
- Limite di circa 1 MB per documento, contro gli abusi.

**Accesso**
- Password di almeno 10 caratteri, con lettere e numeri, che non contengano il nome o l'email; si rifiutano quelle più comuni.
- Dopo 5 tentativi sbagliati l'app si ferma 30 secondi, oltre ai limiti del server.
- I messaggi non rivelano mai se un'email è registrata.
- Conferma dell'email obbligatoria (impostazione di Supabase).
- Al logout si cancellano dal dispositivo i dati e la sessione.

**Pagina**
- Content Security Policy: la pagina esegue solo i propri file e la libreria di accesso, a una versione fissa.
- Niente script dentro l'HTML; tutto il testo inserito dagli utenti viene "ripulito" prima di essere mostrato.
- `no-referrer`: il link d'invito non finisce mai nei log di altri siti.
- Il service worker non salva in cache né i dati del database né gli indirizzi con l'invito.
- Se in `config.js` c'è per errore la chiave segreta, l'app si rifiuta di partire.

**Privacy (GDPR)**
- Dati in Europa (Supabase, Francoforte).
- Consenso esplicito ai dati sulla salute al momento dell'iscrizione, con data salvata.
- Note e limitazioni fisiche non arrivano mai nel telefono del cliente.
- "Elimina cliente e dati" cancella davvero tutto, con conferma scrivendo il nome.
- Informativa privacy pronta da completare (`privacy.html`).

## Da fare una volta (vedi GUIDA.md)
- [ ] Verifica in due passaggi su GitHub, Supabase e Brevo.
- [ ] Email vera della coach nello schema, prima di eseguirlo.
- [ ] Confirm email attivo, password minima 10, solo accesso con email.
- [ ] Site URL e Redirect URLs solo con l'indirizzo del sito.
- [ ] In `config.js` solo la chiave publishable.
- [ ] Informativa privacy completata e controllata.

## Da fare ogni mese (10 minuti)
- [ ] Supabase → **Advisors → Security Advisor**: ci devono essere solo i due avvisi noti e voluti (tabella `app_settings` senza regole, controllo dell'invito aperto).
- [ ] Scarica il backup da **Profilo → Backup di tutti i dati**.
- [ ] Esporta un backup delle tabelle in CSV.
- [ ] Authentication → Users: ci sono solo persone che conosci?
- [ ] Clienti che hanno smesso: eliminali, se non servono più per obblighi fiscali.

## Se qualcosa va storto
- **Password della coach rubata:** "Password dimenticata?" subito, poi in Supabase → Authentication → Users → Aelis → *Sign out user*.
- **Chiave segreta finita online:** Project Settings → API Keys → rigenera la secret. La publishable può restare.
- **Telefono di un cliente perso:** il cliente cambia password da un altro dispositivo; se serve, in Supabase *Sign out user*.

## Prossimi passi possibili (gratis)
- CAPTCHA invisibile Cloudflare Turnstile sui moduli di accesso, se arrivano tentativi automatici.
- Hosting su Cloudflare Pages, per usare le intestazioni di sicurezza del file `_headers` (blocco dell'app dentro altri siti, HSTS).
- Accesso con passkey (impronta o Face ID) quando Supabase lo renderà disponibile nel piano gratuito.
