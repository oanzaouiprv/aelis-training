-- =====================================================================
-- AELIS Training · database v4: promemoria automatici
--  * al cliente: promemoria 24 ore prima di ogni appuntamento confermato
--    (non per quelli provvisori, annullati o già svolti)
--  * alla coach: avviso quando una rata risulta scaduta (non blocca nulla)
-- Gira ogni 15 minuti con pg_cron. Da eseguire DOPO v2 e v3.
-- =====================================================================

create extension if not exists pg_cron;

-- cosa è già stato avvisato, per non mandare doppioni
create table if not exists private.sent_alerts (
  key text primary key,
  created_at timestamptz not null default now()
);
revoke all on private.sent_alerts from public, anon, authenticated;

create or replace function private.run_alerts() returns void
language plpgsql security definer set search_path = public as $$
declare
  r record;
  now_rome timestamp := (now() at time zone 'Europe/Rome');
  oggi date := (now() at time zone 'Europe/Rome')::date;
begin
  -- 1) promemoria 24 ore prima, solo appuntamenti confermati con un cliente che ha l'app
  for r in
    select cs.coach_id, a->>'id' as appt_id, a->>'clientId' as client_id, ci.user_id,
           (a->>'date') as d, (a->>'time') as t, coalesce(p.full_name, 'Aelis') as coach
    from coach_space cs
    cross join lateral jsonb_array_elements(coalesce(cs.data->'appts', '[]'::jsonb)) a
    join clients_index ci on ci.id = a->>'clientId' and ci.coach_id = cs.coach_id and ci.user_id is not null
    left join profiles p on p.id = cs.coach_id
    where coalesce(a->>'status', '') = 'previsto'
      and coalesce((a->>'prov')::boolean, false) = false
      and (a->>'date') ~ '^\d{4}-\d{2}-\d{2}$' and (a->>'time') ~ '^\d{2}:\d{2}$'
      and ((a->>'date') || ' ' || (a->>'time'))::timestamp > now_rome
      and ((a->>'date') || ' ' || (a->>'time'))::timestamp <= now_rome + interval '24 hours'
  loop
    if not exists (select 1 from private.sent_alerts where key = 'appt:' || r.appt_id || ':' || r.d || r.t) then
      insert into private.sent_alerts(key) values ('appt:' || r.appt_id || ':' || r.d || r.t);
      insert into notifications(to_user, from_user, title, body, url)
      values (r.user_id, r.coach_id, 'Promemoria lezione',
              (case when r.d::date = oggi then 'Oggi' else 'Domani' end) || ' ' || to_char(r.d::date, 'DD/MM') || ' alle ' || r.t || ' hai lezione con ' || left(r.coach, 40) || '.',
              '?go=percorso');
    end if;
  end loop;

  -- 2) rate scadute: un avviso alla coach per ogni rata, di giorno
  if extract(hour from now_rome) between 8 and 20 then
    for r in
      select cs.coach_id, k->>'id' as kid, i->>'n' as n, k->>'clientId' as client_id,
             (i->>'amount')::numeric - coalesce(nullif(i->>'paid', '')::numeric, 0) as resto, (i->>'due') as due,
             (select c->>'name' from jsonb_array_elements(coalesce(cs.data->'clients', '[]'::jsonb)) c where c->>'id' = k->>'clientId' limit 1) as nome
      from coach_space cs
      cross join lateral jsonb_array_elements(coalesce(cs.data->'contracts', '[]'::jsonb)) k
      cross join lateral jsonb_array_elements(coalesce(k->'inst', '[]'::jsonb)) i
      where (i->>'due') ~ '^\d{4}-\d{2}-\d{2}$' and (i->>'due')::date < oggi
        and (i->>'amount') ~ '^-?\d+(\.\d+)?$'
        and (i->>'amount')::numeric - coalesce(nullif(i->>'paid', '')::numeric, 0) > 0.009
        and coalesce(k->>'status', '') <> 'chiuso'
  loop
      if not exists (select 1 from private.sent_alerts where key = 'rata:' || r.kid || ':' || r.n) then
        insert into private.sent_alerts(key) values ('rata:' || r.kid || ':' || r.n);
        insert into notifications(to_user, from_user, title, body, url)
        values (r.coach_id, null, 'Rata scaduta',
                left(coalesce(r.nome, 'Un cliente'), 60) || ': rata ' || r.n || ' di ' || to_char(r.resto, 'FM999990.00') || ' € scaduta il ' || to_char(r.due::date, 'DD/MM') || '.',
                '?go=numeri');
      end if;
    end loop;
  end if;

  delete from private.sent_alerts where created_at < now() - interval '120 days';
end $$;
revoke execute on function private.run_alerts() from public, anon, authenticated;

-- ogni 15 minuti
select cron.unschedule('aelis-promemoria') where exists (select 1 from cron.job where jobname = 'aelis-promemoria');
select cron.schedule('aelis-promemoria', '*/15 * * * *', 'select private.run_alerts()');
