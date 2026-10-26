/* Configurazione di AELIS Training.
   Senza chiavi l'app parte in MODALITÀ DEMO: dati di esempio salvati solo nel browser.
   Per usarla davvero segui docs/GUIDA.md: crea un progetto gratuito su Supabase e incolla qui
   "Project URL" e la chiave pubblica ("publishable", sb_publishable_...). È pubblica per natura:
   la sicurezza dei dati la fanno le regole in supabase/schema.sql.
   NON incollare mai qui la chiave segreta ("secret" sb_secret_... o "service_role"): scavalca tutte le regole.
   Se la incolli per errore l'app si rifiuta di partire. */
window.AELIS_CONFIG = {
  supabaseUrl: '',        // es. 'https://abcdefgh.supabase.co'
  supabaseAnonKey: '',    // la chiave publishable (sb_publishable_...)
  coachName: 'Aelis',
  coachWhatsapp: ''       // es. '393401234567' (prefisso internazionale, senza + e spazi)
};
