# Guida: mettere online AELIS Training, gratis e in modo sicuro

Si fa una volta sola e richiede circa un'ora e mezza. Servono un computer, l'email di Oussama e l'email di Aelis.
Segui i passi in ordine: ognuno si chiude con un **controllo** che dice se è andato bene.

> Regola d'oro: le password e la chiave segreta di Supabase non si mandano a nessuno, nemmeno a Claude.
> A Claude servono solo due cose pubbliche: l'indirizzo del progetto e la chiave *publishable*.

---

## Passo 0 · Prima di iniziare (5 minuti)
1. Installa un gestore di password (Bitwarden è gratuito) e usalo per tutti gli account qui sotto.
2. Decidi l'email della coach: è quella con cui Aelis entrerà nell'app. Solo quell'email potrà diventare coach.

## Passo 1 · GitHub: il sito (gratis)
1. Crea un account su github.com e **attiva la verifica in due passaggi** (Settings → Password and authentication).
2. Crea un repository **pubblico** chiamato `aelis-training`, vuoto.
   Con il piano gratuito GitHub Pages pubblica solo da repository pubblici. Va bene così: è anche il tuo portfolio e nel codice non c'è niente di segreto.
3. Carica i file: o colleghi GitHub a Claude e li carica lui, o usi **Add file → Upload files** e trascini tutto il contenuto della cartella.
4. **Settings → Pages → Branch: `main`, cartella `/ (root)` → Save.**

**Controllo:** dopo un paio di minuti `https://TUONOME.github.io/aelis-training/` apre la schermata di accesso. Con `?demo` alla fine dell'indirizzo si apre la demo con dati inventati.

## Passo 2 · Supabase: database e accessi (gratis)
1. Crea un account su supabase.com e **attiva la verifica in due passaggi** (Account → Security).
2. **New project**:
   - nome `aelis-training`;
   - regione **Europe (Frankfurt)**, così i dati restano nell'Unione Europea;
   - una password del database lunga, generata dal gestore di password.
3. Apri il file `supabase/schema.sql`, cerca `EMAIL-DI-ALICE@esempio.it` e sostituiscilo con **l'email vera di Aelis**.
4. In Supabase apri **SQL Editor**, incolla tutto il file e premi **Run**.
   **Controllo:** in basso compare "Success. No rows returned".
5. Apri **Authentication → Sign In / Providers → Email** e imposta:
   - **Confirm email: attivo.** Così nessuno può iscriversi con l'email di un altro.
   - **Minimum password length: 10.**
   - **Password requirements: lettere e numeri.** Sono le stesse regole che l'app controlla già.
   - Tutti gli altri metodi di accesso (telefono, Google, Apple…) restano **spenti**.
   - "Allow new users to sign up" resta **acceso**: il database fa entrare solo la coach e chi ha un invito valido, tutti gli altri vengono rifiutati.
6. Apri **Authentication → URL Configuration**:
   - **Site URL:** `https://TUONOME.github.io/aelis-training/`;
   - **Redirect URLs:** lo stesso indirizzo, e nient'altro.
7. Apri **Project Settings → API Keys** e copia due cose:
   - il **Project URL**;
   - la chiave **publishable** (inizia con `sb_publishable_`).

   Mandale a Claude, che le inserisce in `config.js`. La chiave **secret** (`sb_secret_…`, o la vecchia `service_role`) **non va mai copiata da nessuna parte**. Se finisse in `config.js` per errore, l'app si rifiuta di partire.

Limiti del piano gratuito:
- **Spazio:** 500 MB di database, che bastano per anni di allenamenti di decine di clienti.
- **Pausa:** il progetto va in pausa dopo 7 giorni senza attività. Con l'uso quotidiano non succede; se capita, si riattiva con un clic dalla dashboard.
- **Backup:** non ci sono backup scaricabili, quindi una volta al mese esporta le tabelle (**Table Editor → tabella → Export → CSV**).

## Passo 3 · Email di conferma e nuova password (gratis)
L'email integrata di Supabase invia pochissimi messaggi e solo agli indirizzi del team, quindi per i clienti non basta. Si usa Brevo, che nel piano gratuito invia 300 email al giorno.
1. Crea un account su brevo.com, con la verifica in due passaggi.
2. In **Senders, domains & dedicated IPs** aggiungi e verifica l'email mittente, per esempio l'email di lavoro di Aelis.
3. In **SMTP & API → SMTP** genera una chiave SMTP.
4. In Supabase vai su **Authentication → Emails → SMTP Settings**, attiva *Custom SMTP* e compila:
   - Host `smtp-relay.brevo.com`, porta `587`;
   - Username: il login SMTP che mostra Brevo;
   - Password: la chiave SMTP;
   - Sender name `AELIS Training`, sender email: quella verificata al punto 2.
5. In **Authentication → Emails → Templates** traduci le due email che servono.
   - **Confirm signup**
     - oggetto: `Conferma il tuo account AELIS Training`
     - testo: `Ciao! Per attivare il tuo account AELIS Training apri questo link: {{ .ConfirmationURL }} — Se non sei stato/a tu, ignora questa email.`
   - **Reset password**
     - oggetto: `Scegli una nuova password`
     - testo: `Hai chiesto una nuova password per AELIS Training. Apri questo link per sceglierla: {{ .ConfirmationURL }} — Se non l'hai chiesta tu, ignora questa email: la password attuale resta valida.`

**Controllo:** dall'app, "Password dimenticata?" con la tua email fa arrivare l'email entro un minuto. Controlla anche lo spam.

## Passo 4 · Primo accesso di Aelis
1. Aelis apre il sito e sceglie **Primo accesso della coach**.
2. Inserisce la sua email (quella scritta nello schema) e una password di almeno 10 caratteri con lettere e numeri.
3. Apre il link di conferma nell'email ed entra.
4. Sul telefono installa l'app:
   - iPhone: Safari → Condividi → *Aggiungi alla schermata Home*;
   - Android: Chrome → menu → *Installa app*.

Questo passaggio funziona **una volta sola**: dopo, nessun altro può diventare coach, nemmeno con la stessa email.

## Passo 5 · Prova generale con un cliente finto
1. Aelis: **Clienti → Invita**, con il nome e l'email di Oussama.
2. Si apre "Invito pronto": copia il link o mandalo su WhatsApp. Vale 14 giorni e si usa una volta sola.
3. Oussama apre il link, crea la password, dà il consenso privacy, conferma l'email ed entra.
4. Aelis crea la scheda; Oussama fa un allenamento, un check e una richiesta di lezione; Aelis approva e manda un applauso.
5. Alla fine Aelis elimina il cliente di prova: **dossier → Elimina cliente e dati**.

**Controllo:** ogni passo compare dall'altra parte dopo aver riaperto l'app.

## Passo 6 · Privacy, prima dei clienti veri
1. Completa `privacy.html` (nome, contatti, date) e falla controllare da un consulente: l'app tratta dati sulla salute (sonno, stress, misure, limitazioni), che per legge richiedono il consenso esplicito. L'app lo chiede già all'iscrizione.
2. I clienti scrivono ad Aelis nella **chat interna** dell'app: niente numeri di telefono da condividere.

## Cosa costa davvero
| Voce | Costo |
|---|---|
| GitHub Pages | 0 € |
| Supabase Free | 0 € |
| Email (Brevo Free, 300 al giorno) | 0 € |
| Dominio tipo aelistraining.it | facoltativo, circa 10–15 € l'anno |
| App negli store (Apple/Google) | non serve: l'app si installa dal browser |

Nell'app non c'è intelligenza artificiale: promemoria del giorno, rischio abbandono e messaggi pronti sono regole calcolate sui dati, non mandano dati a nessuno e non costano niente.

## Se qualcosa non va
| Sintomo | Causa probabile |
|---|---|
| "Non riesco a caricare l'accesso" | Manca la connessione, oppure la libreria di accesso non si carica: scrivi a Claude. |
| "Configurazione non sicura" | In `config.js` c'è la chiave segreta: sostituiscila con la publishable e rigenera la secret in Supabase. |
| "Questo invito non è valido" | Il link è già stato usato o è scaduto: dal dossier del cliente → **Nuovo link**. |
| Le email non arrivano | Controlla lo spam e il mittente verificato su Brevo (Passo 3). |
| L'app è ferma su "Carico i tuoi dati…" | Il progetto Supabase è in pausa: riattivalo dalla dashboard. |

## Notifiche sul telefono
- Funzionano su Android (Chrome) e su iPhone con iOS 16.4 o successivo, **solo con l'app aggiunta alla schermata Home**.
- Ognuno le attiva da **Profilo → Attiva le notifiche** (o dal riquadro in Home) e deve dire "Consenti".
- Arrivano per: messaggi in chat, lezione confermata o rifiutata, applausi, scheda nuova (cliente); messaggi, richieste di lezione, allenamenti finiti, check e questionari (coach).
- Le spedisce la funzione `push` su Supabase (gratis). Le chiavi segrete stanno solo nel database, nella tabella privata `private.kv`.

## Google Calendar (coach)
1. Nell'app: **Profilo → Google Calendar → Mostra il mio collegamento → Copia l'indirizzo**.
2. Dal computer: Google Calendar → **Altri calendari → + → Da URL**, incolla e conferma.
3. Compare il calendario "AELIS Training" anche sul telefono. Google lo aggiorna da solo ogni qualche ora.
4. Se l'indirizzo finisce nelle mani sbagliate: **Rigenera l'indirizzo** e ripeti il punto 2.
