# Roadmap

Regola: una fase alla volta, e ogni fase si prova con Aelis prima di passare alla successiva.

## Fatto
- Prototipo completo in modalità demo (coach e cliente).
- Identità: logo "effetto farfalla", palette blu, animazione di apertura, barra in stile Instagram.
- App installabile (PWA), funziona offline.
- Database v1 con regole di sicurezza e iscrizione solo su invito, testato su Postgres.
- Accesso con email e password, primo accesso della coach, inviti via link (WhatsApp o email), password dimenticata, logout.
- Chat interna coach-cliente in tempo reale (al posto di WhatsApp), notifiche push sul telefono, calendario privato per Google Calendar.
- Visualizzazione stabile su ogni telefono, avviso per installare l'app.
- Tutta l'app collegata al database: dossier, schede, agenda, percorsi, allenamenti, check, richieste, applausi, sfide, community.
- Salvataggio offline e unione automatica tra più dispositivi.
- Eliminazione completa del cliente, backup per la coach e "Scarica i miei dati" per i clienti, informativa privacy da completare.
- Questionario iniziale del cliente, video degli esercizi (link YouTube), demo pubblica con `?demo`.
- Tolte le funzioni di intelligenza artificiale: restano solo regole sui dati.

## Adesso · Messa online (1 ora e mezza, vedi GUIDA.md)
- Account GitHub, Supabase, Brevo; schema con l'email di Aelis; chiavi in `config.js`.
- Prova generale con un cliente finto.

## Fase 3 · Pilota (2–4 settimane)
- Aelis lo usa con 3–5 clienti veri.
- Si misura una cosa sola, per esempio le ore risparmiate a settimana o la costanza dei clienti.
- Si correggono solo i problemi trovati.

## Dopo il pilota (solo se serve)
- Backup automatico.
- Promemoria automatici ("domani hai lezione") tramite le notifiche.
- Foto di confronto private (Supabase Storage).
- Automazioni via email o notifiche push.
- CAPTCHA invisibile (Cloudflare Turnstile) se arrivano tentativi automatici.
- Sfide di gruppo e riepilogo del mese.
- Foto di confronto compresse e private.
- Dominio personalizzato.
- Versione per altri personal trainer.

## Fuori dalla prima versione
App negli store · nutrizione · chat interna · pagamenti online · AI generativa a pagamento.
