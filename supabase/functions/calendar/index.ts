// AELIS Training · calendario privato della coach in formato iCalendar (.ics),
// da aggiungere a Google Calendar con "Da URL". L'indirizzo contiene un token segreto di 192 bit.
const SUPABASE_URL = "https://sxqahpavqoyfmmxwgwdz.supabase.co";
const PUBLIC_KEY = "sb_publishable__YE96ZE3beyxrqOhe3H7kg_6IkOyyTh";

type Appt = { id: string; date: string; time: string; dur?: number; type?: string; status?: string; clientId?: string; leadId?: string; title?: string };

const esc = (s: string) => String(s ?? "").replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\r?\n/g, "\\n");
const fold = (line: string) => {
  const out: string[] = []; let cur = "";
  for (const ch of line) { if (new TextEncoder().encode(cur + ch).length > 74) { out.push(cur); cur = " " + ch; } else cur += ch; }
  out.push(cur); return out.join("\r\n");
};
const pad = (n: number) => String(n).padStart(2, "0");
function local(date: string, time: string, addMin = 0) {
  const [y, m, d] = date.split("-").map(Number); const [h, mi] = (time || "00:00").split(":").map(Number);
  const t = new Date(Date.UTC(y, m - 1, d, h, mi) + addMin * 60000);
  return `${t.getUTCFullYear()}${pad(t.getUTCMonth() + 1)}${pad(t.getUTCDate())}T${pad(t.getUTCHours())}${pad(t.getUTCMinutes())}00`;
}
const TYPE: Record<string, string> = { pt: "Lezione PT", free: "Lezione di prova", consulenza: "Consulenza", corso: "Corso", personale: "" };

Deno.serve(async (req) => {
  const token = new URL(req.url).searchParams.get("t") || "";
  if (!/^[0-9a-f]{48}$/.test(token)) return new Response("Non trovato", { status: 404 });
  const r = await fetch(`${SUPABASE_URL}/rest/v1/rpc/calendar_feed`, {
    method: "POST", headers: { apikey: PUBLIC_KEY, "Content-Type": "application/json" }, body: JSON.stringify({ p_token: token }),
  });
  const feed = r.ok ? await r.json() : null;
  if (!feed) return new Response("Non trovato", { status: 404 });

  const names: Record<string, string> = {};
  for (const c of feed.clients || []) names[c.id] = c.name;
  for (const l of feed.leads || []) names[l.id] = l.name;
  const from = new Date(Date.now() - 60 * 864e5).toISOString().slice(0, 10);
  const now = new Date().toISOString().replace(/[-:]/g, "").slice(0, 15) + "Z";

  const lines = [
    "BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//AELIS Training//Agenda//IT", "CALSCALE:GREGORIAN", "METHOD:PUBLISH",
    "X-WR-CALNAME:AELIS Training", "X-WR-TIMEZONE:Europe/Rome", "REFRESH-INTERVAL;VALUE=DURATION:PT1H", "X-PUBLISHED-TTL:PT1H",
    "BEGIN:VTIMEZONE", "TZID:Europe/Rome",
    "BEGIN:DAYLIGHT", "TZOFFSETFROM:+0100", "TZOFFSETTO:+0200", "TZNAME:CEST", "DTSTART:19700329T020000", "RRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=-1SU", "END:DAYLIGHT",
    "BEGIN:STANDARD", "TZOFFSETFROM:+0200", "TZOFFSETTO:+0100", "TZNAME:CET", "DTSTART:19701025T030000", "RRULE:FREQ=YEARLY;BYMONTH=10;BYDAY=-1SU", "END:STANDARD",
    "END:VTIMEZONE",
  ];
  for (const a of (feed.appts || []) as Appt[]) {
    if (!a.date || a.date < from || a.status === "annullato") continue;
    const who = (a.clientId && names[a.clientId]) || (a.leadId && names[a.leadId]) || a.title || "";
    const kind = TYPE[a.type || ""] ?? "";
    let summary = kind && who ? `${kind} · ${who}` : (who || kind || "Appuntamento");
    if (a.status === "attesa") summary = "Da confermare: " + summary;
    lines.push("BEGIN:VEVENT",
      `UID:${esc(a.id)}@aelis-training`, `DTSTAMP:${now}`,
      `DTSTART;TZID=Europe/Rome:${local(a.date, a.time)}`, `DTEND;TZID=Europe/Rome:${local(a.date, a.time, a.dur || 60)}`,
      fold(`SUMMARY:${esc(summary)}`), `STATUS:${a.status === "attesa" ? "TENTATIVE" : "CONFIRMED"}`, "TRANSP:OPAQUE", "END:VEVENT");
  }
  lines.push("END:VCALENDAR");
  return new Response(lines.join("\r\n") + "\r\n", {
    headers: { "Content-Type": "text/calendar; charset=utf-8", "Content-Disposition": 'inline; filename="aelis.ics"', "Cache-Control": "private, max-age=300" },
  });
});
