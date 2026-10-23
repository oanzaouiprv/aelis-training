# Guida: mettere online AELIS Training a costo zero

Tempo totale: circa 1 ora, una volta sola. Servono solo un computer e un'email.

## 1. GitHub: codice e sito (gratis)
1. Crea un account su github.com.
2. Crea un repository **pubblico** chiamato `aelis-training` (vuoto, senza README).
   Con il piano gratuito GitHub Pages pubblica solo da repository pubblici: va bene, è anche il tuo portfolio. Nel codice non ci sono password.
3. Collegalo a Claude: Claude carica tutti i file.
4. Nel repository: **Settings → Pages → Branch: `main` / cartella `/ (root)` → Save**.
5. Dopo un paio di minuti l'app è online su `https://TUONOME.github.io/aelis-training/`, in **modalità demo**.

Da qui in poi ogni modifica fatta da Claude arriva online da sola in 1-2 minuti.

## 2. Supabase: il database (gratis)
1. Crea un account su supabase.com → **New project**.
   - Nome `aelis-training`.
   - Regione **Europe (Frankfurt)**.
   - Una password lunga, da salvare.
2. **SQL Editor** → incolla tutto `supabase/schema.sql` → **Run**.
3. **Storage → New bucket** chiamato `foto`, **privato**.
4. **Project Settings → API**: copia `Project URL` e la chiave `anon public`, e mandale a Claude. Finiscono in `config.js`. La chiave anon è pubblica per natura: la sicurezza la fanno le regole del database.
5. **Authentication → URL Configuration**: imposta come Site URL l'indirizzo GitHub Pages.

Limiti del piano gratuito da conoscere:
- **Spazio:** 500 MB di database e 1 GB di file. Le foto vanno compresse: l'app lo farà da sola.
- **Pausa per inattività:** il progetto **va in pausa dopo 7 giorni senza attività**. Con l'uso quotidiano non succede; se capita, si riattiva con un clic.

## 3. Email per i link di accesso (gratis)
L'email integrata di Supabase invia solo **2 email all'ora** e solo agli indirizzi del team, quindi non basta per i clienti. Si collega un servizio SMTP gratuito, per esempio Brevo, che ha un piano gratuito giornaliero:
1. Crea un account su brevo.com → **SMTP & API** → copia server, porta, utente e chiave SMTP.
2. In Supabase vai su **Authentication → Emails → SMTP Settings**, incolla quei dati e imposta come mittente un'email del progetto.

## 4. Primo accesso della coach
1. Apri l'app e accedi con l'email della coach.
2. In Supabase → SQL Editor esegui una volta sola, con la sua email:
   `update public.profiles set role = 'coach' where id = (select id from auth.users where email = 'EMAIL-DELLA-COACH');`
3. Da quel momento la coach invita i clienti dall'app. Ognuno riceve il suo link e vede solo i propri dati.

## Cosa costa davvero
| Voce | Costo |
|---|---|
| GitHub Pages | 0 € |
| Supabase Free | 0 € |
| Email (Brevo Free) | 0 € |
| Dominio tipo aelistraining.it | facoltativo, circa 10–15 €/anno |
| App negli store (Apple/Google) | non serve: l'app si installa dal browser |

Le funzioni "AI" del prototipo (priorità di oggi, rischio abbandono, messaggi pronti) sono calcolate da regole sui dati: **non usano servizi a pagamento**. Un vero modello AI si può aggiungere più avanti, solo se serve.
