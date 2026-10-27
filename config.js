/* Configurazione di AELIS Training.
   Senza chiavi l'app parte in MODALITÀ DEMO: dati di esempio salvati solo nel browser.
   Per usarla davvero segui docs/GUIDA.md: crea un progetto gratuito su Supabase e incolla qui
   "Project URL" e la chiave pubblica ("publishable", sb_publishable_...). È pubblica per natura:
   la sicurezza dei dati la fanno le regole in supabase/schema.sql.
   NON incollare mai qui la chiave segreta ("secret" sb_secret_... o "service_role"): scavalca tutte le regole.
   Se la incolli per errore l'app si rifiuta di partire. */
window.AELIS_CONFIG = {
  supabaseUrl: 'https://sxqahpavqoyfmmxwgwdz.supabase.co',
  supabaseAnonKey: 'sb_publishable__YE96ZE3beyxrqOhe3H7kg_6IkOyyTh',  // chiave publishable: pubblica per natura
  coachName: 'Aelis',
  coachWhatsapp: ''       // es. '393401234567' (prefisso internazionale, senza + e spazi)
};
