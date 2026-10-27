-- =====================================================================
-- AELIS Training · database v2: chat interna, notifiche push, calendario
-- Da eseguire DOPO schema.sql. I valori segreti (chiavi VAPID, segreto push)
-- NON sono in questo file: si inseriscono a parte in private.kv.
-- =====================================================================

create extension if not exists pg_net with schema extensions;

-- valori segreti, leggibili solo dal database (schema "private", non esposto alle API)
create table if not exists private.kv (key text primary key, value text not null);
revoke all on private.kv from public, anon, authenticated;

-- ===================== CHAT =====================
create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  client_id text not null references public.clients_index(id) on delete cascade,
  coach_id uuid not null references public.profiles(id) on delete cascade,
  sender text not null check (sender in ('coach','client')),
  body text not null check (char_length(btrim(body)) between 1 and 2000),
  created_at timestamptz not null default now(),
  read_at timestamptz
);
create index if not exists messages_client on public.messages (client_id, created_at desc);
create index if not exists messages_coach on public.messages (coach_id, created_at desc);
alter table public.messages enable row level security;

drop policy if exists "coach: legge chat" on public.messages;
create policy "coach: legge chat" on public.messages for select using (coach_id = auth.uid() and private.is_coach());
drop policy if exists "coach: scrive chat" on public.messages;
create policy "coach: scrive chat" on public.messages for insert with check (
  coach_id = auth.uid() and private.is_coach() and sender = 'coach'
  and client_id in (select id from public.clients_index where coach_id = auth.uid()));
drop policy if exists "coach: segna letto" on public.messages;
create policy "coach: segna letto" on public.messages for update
  using (coach_id = auth.uid() and private.is_coach() and sender = 'client')
  with check (coach_id = auth.uid() and sender = 'client');
drop policy if exists "cliente: legge chat" on public.messages;
create policy "cliente: legge chat" on public.messages for select using (client_id = private.my_client_id());
drop policy if exists "cliente: scrive chat" on public.messages;
create policy "cliente: scrive chat" on public.messages for insert with check (
  client_id = private.my_client_id() and coach_id = private.my_coach_id() and sender = 'client');
drop policy if exists "cliente: segna letto" on public.messages;
create policy "cliente: segna letto" on public.messages for update
  using (client_id = private.my_client_id() and sender = 'coach')
  with check (client_id = private.my_client_id() and sender = 'coach');

revoke all on public.messages from anon, authenticated;
grant select, insert on public.messages to authenticated;
grant update (read_at) on public.messages to authenticated;

-- ora del server, mai quella del telefono; massimo 20 messaggi al minuto per conversazione e mittente
create or replace function private.msg_before() returns trigger language plpgsql security definer set search_path = public as $$
begin
  new.created_at := now();
  new.read_at := null;
  new.body := btrim(new.body);
  if (select count(*) from messages where client_id = new.client_id and sender = new.sender and created_at > now() - interval '1 minute') >= 20 then
    raise exception 'Troppi messaggi: aspetta un attimo';
  end if;
  return new;
end $$;
drop trigger if exists messages_before on public.messages;
create trigger messages_before before insert on public.messages for each row execute function private.msg_before();

-- tempo reale: i messaggi arrivano subito (le regole RLS valgono anche qui)
do $$ begin
  if not exists (select 1 from pg_publication_tables where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'messages') then
    alter publication supabase_realtime add table public.messages;
  end if;
end $$;

-- ===================== NOTIFICHE PUSH =====================
create table if not exists public.push_subs (
  endpoint text primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  p256dh text not null,
  auth text not null,
  created_at timestamptz not null default now()
);
alter table public.push_subs enable row level security;   -- nessuna policy: si usa solo dalle funzioni qui sotto
revoke all on public.push_subs from anon, authenticated;

create table if not exists public.notifications (
  id bigint generated always as identity primary key,
  to_user uuid not null references auth.users(id) on delete cascade,
  from_user uuid,
  title text not null check (char_length(title) between 1 and 80),
  body text not null check (char_length(body) between 1 and 240),
  url text check (url is null or url ~ '^\?[a-zA-Z0-9=&_-]{0,80}$'),
  created_at timestamptz not null default now(),
  sent_at timestamptz
);
alter table public.notifications enable row level security;   -- nessuna policy
revoke all on public.notifications from anon, authenticated;

-- il telefono registra la sua "iscrizione" alle notifiche
create or replace function public.save_push_sub(p_endpoint text, p_p256dh text, p_auth text) returns void
language plpgsql security definer set search_path = public as $$
begin
  if auth.uid() is null then raise exception 'Serve l''accesso'; end if;
  if p_endpoint !~ '^https://' or char_length(p_endpoint) > 1000 or char_length(p_p256dh) > 200 or char_length(p_auth) > 100 then
    raise exception 'Iscrizione non valida';
  end if;
  delete from push_subs where endpoint = p_endpoint;
  insert into push_subs(endpoint, user_id, p256dh, auth) values (p_endpoint, auth.uid(), p_p256dh, p_auth);
end $$;
create or replace function public.delete_push_sub(p_endpoint text) returns void
language sql security definer set search_path = public as $$
  delete from push_subs where endpoint = p_endpoint and user_id = auth.uid();
$$;

-- invia una notifica: la coach solo ai suoi clienti, il cliente solo alla sua coach
create or replace function public.notify(p_client_id text, p_title text, p_body text, p_url text default null) returns void
language plpgsql security definer set search_path = public as $$
declare target uuid;
begin
  if auth.uid() is null then return; end if;
  if private.is_coach() then
    select user_id into target from clients_index where id = p_client_id and coach_id = auth.uid();
  else
    target := private.my_coach_id();
  end if;
  if target is null then return; end if;
  if (select count(*) from notifications where from_user = auth.uid() and created_at > now() - interval '1 minute') >= 20 then return; end if;
  insert into notifications(to_user, from_user, title, body, url)
    values (target, auth.uid(), left(p_title, 80), left(p_body, 240), p_url);
end $$;

-- ogni nuovo messaggio in chat diventa anche una notifica per chi lo riceve
create or replace function private.msg_after() returns trigger language plpgsql security definer set search_path = public as $$
declare target uuid; ttl text;
begin
  if new.sender = 'client' then
    target := new.coach_id;
    select coalesce(full_name, 'Cliente') into ttl from clients_index where id = new.client_id;
  else
    select user_id into target from clients_index where id = new.client_id;
    select coalesce(full_name, 'Aelis') into ttl from profiles where id = new.coach_id;
  end if;
  if target is not null then
    insert into notifications(to_user, from_user, title, body, url)
      values (target, auth.uid(), left(ttl, 80), left(new.body, 240), '?chat=' || new.client_id);
  end if;
  return new;
end $$;
drop trigger if exists messages_after on public.messages;
create trigger messages_after after insert on public.messages for each row execute function private.msg_after();

-- ogni nuova notifica chiama la funzione "push" che la spedisce ai telefoni
create or replace function private.push_dispatch() returns trigger language plpgsql security definer set search_path = public, extensions as $$
declare sec text; base text;
begin
  select value into sec from private.kv where key = 'push_secret';
  select value into base from private.kv where key = 'functions_url';
  if sec is null or base is null then return new; end if;
  perform net.http_post(
    url := base || '/push',
    body := jsonb_build_object('id', new.id, 'secret', sec),
    headers := '{"Content-Type":"application/json"}'::jsonb,
    timeout_milliseconds := 8000);
  return new;
end $$;
drop trigger if exists notifications_push on public.notifications;
create trigger notifications_push after insert on public.notifications for each row execute function private.push_dispatch();

-- usata solo dalla funzione "push": restituisce cosa spedire e a quali telefoni (serve il segreto)
create or replace function public.push_job(p_id bigint, p_secret text) returns jsonb
language plpgsql security definer set search_path = public as $$
declare n notifications; out jsonb;
begin
  if p_secret is null or p_secret <> (select value from private.kv where key = 'push_secret') then return null; end if;
  select * into n from notifications where id = p_id and sent_at is null;
  if n.id is null then return null; end if;
  update notifications set sent_at = now() where id = n.id;
  select jsonb_build_object(
    'title', n.title, 'body', n.body, 'url', n.url, 'tag', 'n' || n.id,
    'subs', coalesce((select jsonb_agg(jsonb_build_object('endpoint', endpoint, 'keys', jsonb_build_object('p256dh', p256dh, 'auth', auth))) from push_subs where user_id = n.to_user), '[]'::jsonb),
    'vapid', jsonb_build_object(
      'public', (select value from private.kv where key = 'vapid_public'),
      'private', (select value from private.kv where key = 'vapid_private'),
      'subject', (select value from private.kv where key = 'vapid_subject'))) into out;
  delete from notifications where sent_at < now() - interval '30 days';
  return out;
end $$;
create or replace function public.push_gone(p_endpoint text, p_secret text) returns void
language sql security definer set search_path = public as $$
  delete from push_subs where endpoint = p_endpoint and p_secret = (select value from private.kv where key = 'push_secret');
$$;

-- ===================== CALENDARIO (Google Calendar) =====================
create table if not exists private.cal_tokens (
  coach_id uuid primary key references public.profiles(id) on delete cascade,
  token text not null unique
);
revoke all on private.cal_tokens from public, anon, authenticated;

-- la coach ottiene (o rigenera) il suo indirizzo privato del calendario
create or replace function public.calendar_token(p_reset boolean default false) returns text
language plpgsql security definer set search_path = public, extensions as $$
declare t text;
begin
  if not private.is_coach() then raise exception 'Solo la coach'; end if;
  if p_reset then delete from private.cal_tokens where coach_id = auth.uid(); end if;
  select token into t from private.cal_tokens where coach_id = auth.uid();
  if t is null then
    t := encode(gen_random_bytes(24), 'hex');
    insert into private.cal_tokens(coach_id, token) values (auth.uid(), t);
  end if;
  return t;
end $$;

-- usata dalla funzione "calendar": con il token giusto restituisce appuntamenti e nomi
create or replace function public.calendar_feed(p_token text) returns jsonb
language sql stable security definer set search_path = public as $$
  select jsonb_build_object(
    'appts', coalesce(cs.data->'appts', '[]'::jsonb),
    'clients', coalesce((select jsonb_agg(jsonb_build_object('id', c->>'id', 'name', c->>'name')) from jsonb_array_elements(coalesce(cs.data->'clients', '[]'::jsonb)) c), '[]'::jsonb),
    'leads', coalesce((select jsonb_agg(jsonb_build_object('id', l->>'id', 'name', l->>'name')) from jsonb_array_elements(coalesce(cs.data->'leads', '[]'::jsonb)) l), '[]'::jsonb))
  from private.cal_tokens t join coach_space cs on cs.coach_id = t.coach_id
  where p_token is not null and char_length(p_token) = 48 and t.token = p_token;
$$;

-- ===================== permessi delle funzioni =====================
revoke all on function public.save_push_sub(text,text,text), public.delete_push_sub(text), public.notify(text,text,text,text), public.calendar_token(boolean) from public, anon;
grant execute on function public.save_push_sub(text,text,text), public.delete_push_sub(text), public.notify(text,text,text,text), public.calendar_token(boolean) to authenticated;
-- push_job, push_gone e calendar_feed sono chiamate dalle funzioni del server senza accesso utente:
-- sono protette dal segreto (push) o dal token di 192 bit (calendario)
revoke all on function public.push_job(bigint,text), public.push_gone(text,text), public.calendar_feed(text) from public;
grant execute on function public.push_job(bigint,text), public.push_gone(text,text), public.calendar_feed(text) to anon;
revoke execute on function private.msg_before(), private.msg_after(), private.push_dispatch() from public, anon, authenticated;
