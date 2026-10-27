// AELIS Training · spedisce le notifiche push ai telefoni.
// La chiama il database (pg_net) a ogni nuova notifica, con un segreto condiviso.
// Senza il segreto giusto push_job non restituisce niente, quindi la funzione non fa nulla.
import webpush from "npm:web-push@3.6.7";

const SUPABASE_URL = "https://sxqahpavqoyfmmxwgwdz.supabase.co";
const PUBLIC_KEY = "sb_publishable__YE96ZE3beyxrqOhe3H7kg_6IkOyyTh"; // chiave pubblica: la sicurezza è nel segreto

async function rpc(name: string, args: Record<string, unknown>) {
  const r = await fetch(`${SUPABASE_URL}/rest/v1/rpc/${name}`, {
    method: "POST",
    headers: { apikey: PUBLIC_KEY, "Content-Type": "application/json" },
    body: JSON.stringify(args),
  });
  if (!r.ok) return null;
  const t = await r.text();
  return t ? JSON.parse(t) : null;
}

Deno.serve(async (req) => {
  if (req.method !== "POST") return new Response("Metodo non permesso", { status: 405 });
  let b: { id?: number; secret?: string };
  try { b = await req.json(); } catch { return new Response("Richiesta non valida", { status: 400 }); }
  if (!b.id || !b.secret) return new Response("Richiesta non valida", { status: 400 });

  const job = await rpc("push_job", { p_id: b.id, p_secret: b.secret });
  if (!job || !job.vapid?.private) return Response.json({ sent: 0 });

  webpush.setVapidDetails(job.vapid.subject, job.vapid.public, job.vapid.private);
  const payload = JSON.stringify({ title: job.title, body: job.body, url: job.url, tag: job.tag });
  let sent = 0;
  await Promise.all((job.subs || []).map(async (s: { endpoint: string; keys: { p256dh: string; auth: string } }) => {
    try {
      await webpush.sendNotification(s, payload, { TTL: 86400, urgency: "high" });
      sent++;
    } catch (e) {
      const code = (e as { statusCode?: number }).statusCode;
      // telefono disiscritto o app disinstallata: si cancella l'iscrizione
      if (code === 404 || code === 410) await rpc("push_gone", { p_endpoint: s.endpoint, p_secret: b.secret });
      console.log("push non consegnata", code);
    }
  }));
  return Response.json({ sent, of: (job.subs || []).length });
});
