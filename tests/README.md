# Test

## Sicurezza del database (Postgres locale)
`sql-stub-supabase.sql` ricrea le parti di Supabase che servono (utenti, `auth.uid()`, ruoli).
Poi si esegue `../supabase/schema.sql` e `sql-test-sicurezza.sql`, che prova:
intruso senza invito, secondo account coach, invito sbagliato o riusato, isolamento tra clienti,
cliente che prova a diventare coach o a scrivere la scheda, coach che non può riscrivere i diari.

## Accesso e salvataggio nell'app (browser)
`e2e-accesso.js` apre l'app vera in Chromium con un finto Supabase in memoria
(`mock-backend.js`, stesse regole dello schema) e prova più di 50 scenari: primo accesso della coach,
invito, iscrizione del cliente, password deboli, consenso privacy, scheda, allenamento, check,
richieste, offline, due dispositivi, logout, password dimenticata, eliminazione del cliente.

```
python3 -m http.server 8765        # dalla cartella principale
node tests/e2e-accesso.js          # in un altro terminale (serve Playwright)
```
