# AELIS Training

**L'app della personal trainer, a costo zero.** Schede, allenamenti, progressi, agenda, pagamenti e motivazione dei clienti in un'unica web app installabile sul telefono.

> *EN — A zero-cost, installable web app (PWA) for an independent personal trainer and her clients: workout plans, live workout logging, progress tracking, scheduling, payments and retention features. Concept, UX and product design by Oussama Anzaoui.*

![Animazione di apertura: l'attrattore di Lorenz diventa il logo](screenshots/animazione-apertura.png)

## Il problema
Una personal trainer che lavora in palestra gestisce clienti, schede, pagamenti e messaggi tra WhatsApp, fogli Excel e note sul telefono. Si perde tempo, si dimenticano rate e scadenze, e i clienti abbandonano senza che nessuno se ne accorga in tempo.

## La soluzione
Una web app con due aree:

| Coach | Cliente |
|---|---|
| Agenda del giorno e registro ore | Allenamento di oggi con serie, carichi e recuperi |
| **Da fare oggi**: clienti a rischio abbandono, record, feedback, rate | Dettatura vocale delle serie e cambio esercizio se la macchina è occupata |
| Dossier cliente, schede, percorsi e lezioni | **La tua trasformazione**: Origine, Ritmo, Potenziale, Trasformazione |
| Contatti e provenienza dei clienti (social, sala, esterni) | Riepilogo del mese in 7 storie da condividere |
| Inviti con link personale, video degli esercizi, backup | Questionario iniziale, trofei, sfide, check settimanale |

## Il concetto
Il logo è la **farfalla di Lorenz**: in matematica un cambiamento minuscolo può produrre conseguenze enormi. È l'idea del brand: *piccoli cambiamenti, grandi risultati*. L'animazione di apertura calcola davvero le equazioni di Lorenz: due traiettorie che partono a un millesimo di distanza si separano e disegnano la farfalla, che diventa il logo.

## Schermate
| Coach · Oggi | Cliente · Home | Effetto farfalla |
|---|---|---|
| ![](screenshots/coach-oggi.png) | ![](screenshots/cliente-home.png) | ![](screenshots/effetto-farfalla.png) |

| Riepilogo del mese | Fine allenamento |
|---|---|
| ![](screenshots/riepilogo-mese.png) | ![](screenshots/fine-allenamento.png) |

## Come è fatta
- **Web app installabile (PWA)**: si apre da un link e si aggiunge alla schermata Home; funziona anche senza connessione.
- **Nessuna compilazione**: HTML, CSS e JavaScript puri (`index.html`, `app.js`, `cloud.js`), facili da modificare.
- **Database Supabase** (piano gratuito): dati in Europa, regole di sicurezza per riga. La coach vede i suoi clienti, ogni cliente solo i propri dati, e le note private non lasciano mai il telefono della coach. Schema in [`supabase/schema.sql`](supabase/schema.sql), testato con Postgres 16.
- **Iscrizione solo su invito**: la coach manda un link personale (monouso, 14 giorni) e il cliente crea la sua password. Il controllo avviene nel database, quindi non si aggira dalla pagina.
- **Funziona anche senza campo**: gli allenamenti registrati offline si salvano appena torna la rete, e due dispositivi dello stesso cliente non si sovrascrivono.
- **Sicurezza**: Content Security Policy rigorosa, password robuste, nessun dato in cache dopo il logout, eliminazione completa del cliente (GDPR). Dettagli in [`docs/SICUREZZA.md`](docs/SICUREZZA.md).
- **Test automatici**: attacchi al database su Postgres e più di 50 scenari dell'app in un browser vero ([`tests/`](tests/)).
- **Hosting GitHub Pages** (gratuito).
- **Modalità demo**: aggiungendo `?demo` all'indirizzo l'app parte con dati di esempio inventati, salvati solo nel browser, così chiunque può provarla senza account: [demo pubblica](https://oanzaouiprv.github.io/aelis-training/?demo).

## Costi
0 € per partire: GitHub Pages, Supabase Free e Brevo Free per le email di conferma e di nuova password. Dettagli e limiti in [`docs/GUIDA.md`](docs/GUIDA.md).

## Stato del progetto
- [x] Prototipo completo e demo pubblica
- [x] Schema del database con regole di sicurezza
- [x] Accesso reale: coach, inviti, iscrizione clienti, password dimenticata
- [x] Area coach e area cliente collegate al database, anche offline
- [ ] Pilota con 3–5 clienti veri

Roadmap completa in [`docs/ROADMAP.md`](docs/ROADMAP.md).

## Crediti
Concept, UX/UI e prodotto: **Oussama Anzaoui**. Sviluppo con l'aiuto di Claude (Anthropic).
Marchio e logo AELIS Training appartengono ai rispettivi proprietari: il codice è pubblico per portfolio, il marchio non è riutilizzabile.
