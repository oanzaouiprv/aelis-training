-- =====================================================================
-- AELIS Training · database v1 (Supabase / Postgres)
-- Come usarlo: Supabase → SQL Editor → incolla tutto il file → Run.
-- PRIMA di eseguirlo cambia l'email della coach qui sotto (riga "coach_email").
--
-- Modello semplice a "documenti", sicuro con Row Level Security:
--   coach_space   → dati privati della coach (contatti, ore, automazioni...)   solo coach
--   coach_public  → dati che la coach mostra a tutti i suoi clienti (sfide)    coach scrive, clienti leggono
--   client_space  → scheda, agenda, percorso di UN cliente                     coach scrive, quel cliente legge
--   client_log    → allenamenti, check, richieste di UN cliente                quel cliente scrive, coach legge
--   clients_index → elenco clienti + invito                                    coach; il cliente vede solo la sua riga
-- Iscrizioni: SOLO la coach (email configurata) e i clienti con un invito valido.
-- =====================================================================

create table if not exists public.app_settings (
  key text primary key,
  value text not null
);
insert into public.app_settings(key, value) values ('coach_email', 'EMAIL-DI-ALICE@esempio.it')
  on conflict (key) do nothing;
alter table public.app_settings enable row level security;   -- nessuna policy: illeggibile dall'app

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role text not null default 'client' check (role in ('coach','client')),
  full_name text,
  created_at timestamptz not null default now()
);

create table if not exists public.clients_index (
  id text primary key,
  coach_id uuid not null references public.profiles(id) on delete cascade,
  user_id uuid unique references public.profiles(id) on delete set null,
  email text not null,
  full_name text,
  invite_token text unique default replace(gen_random_uuid()::text,'-',''),
  invite_expires timestamptz default now() + interval '14 days',
  created_at timestamptz not null default now()
);
create unique index if not exists clients_index_email on public.clients_index (coach_id, lower(email));

create table if not exists public.coach_space (
  coach_id uuid primary key references public.profiles(id) on delete cascade,
  data jsonb not null default '{}',
  updated_at timestamptz not null default now()
);
create table if not exists public.coach_public (
  coach_id uuid primary key references public.profiles(id) on delete cascade,
  data jsonb not null default '{}',
  updated_at timestamptz not null default now()
);
create table if not exists public.client_space (
  client_id text primary key references public.clients_index(id) on delete cascade,
  coach_id uuid not null references public.profiles(id) on delete cascade,
  data jsonb not null default '{}',
  updated_at timestamptz not null default now()
);
create table if not exists public.client_log (
  client_id text primary key references public.clients_index(id) on delete cascade,
  coach_id uuid not null references public.profiles(id) on delete cascade,
  data jsonb not null default '{}',
  updated_at timestamptz not null default now()
);

-- limite di dimensione dei documenti (anti abuso: max ~1 MB ciascuno)
do $$ declare t text; begin
  foreach t in array array['coach_space','coach_public','client_space','client_log'] loop
    execute format('alter table public.%I drop constraint if exists %I', t, t||'_size');
    execute format('alter table public.%I add constraint %I check (pg_column_size(data) < 1000000)', t, t||'_size');
  end loop;
end $$;

-- ===== funzioni di supporto (security definer: leggono senza passare dalle policy) =====
-- stanno nello schema "private", che non è esposto alle API: le usano solo le policy
create schema if not exists private;
revoke all on schema private from public, anon;
grant usage on schema private to authenticated;
create or replace function private.is_coach() returns boolean language sql stable security definer set search_path=public as $$
  select exists(select 1 from profiles where id = auth.uid() and role = 'coach');
$$;
create or replace function private.my_client_id() returns text language sql stable security definer set search_path=public as $$
  select id from clients_index where user_id = auth.uid() limit 1;
$$;
create or replace function private.my_coach_id() returns uuid language sql stable security definer set search_path=public as $$
  select coach_id from clients_index where user_id = auth.uid() limit 1;
$$;

-- ===== iscrizione: solo coach configurata o cliente con invito valido =====
create or replace function public.gate_signup() returns trigger language plpgsql security definer set search_path=public as $$
declare ce text; tok text; ok boolean;
begin
  select value into ce from app_settings where key = 'coach_email';
  if lower(new.email) = lower(ce) and not exists(select 1 from profiles where role = 'coach') then
    return new;
  end if;
  tok := coalesce(new.raw_user_meta_data->>'invite_token','');
  select exists(select 1 from clients_index where lower(email) = lower(new.email) and invite_token = tok
                and user_id is null and invite_expires > now()) into ok;
  if not ok then
    raise exception 'Iscrizione solo su invito';
  end if;
  return new;
end $$;

create or replace function public.handle_new_user() returns trigger language plpgsql security definer set search_path=public as $$
declare ce text;
begin
  select value into ce from app_settings where key = 'coach_email';
  if lower(new.email) = lower(ce) and not exists(select 1 from profiles where role = 'coach') then
    insert into profiles(id, role, full_name) values (new.id, 'coach', coalesce(new.raw_user_meta_data->>'full_name', 'Coach'));
  else
    insert into profiles(id, role, full_name) values (new.id, 'client', coalesce(new.raw_user_meta_data->>'full_name', new.email));
    update clients_index set user_id = new.id, invite_token = null
      where lower(email) = lower(new.email) and invite_token = new.raw_user_meta_data->>'invite_token' and user_id is null;
  end if;
  return new;
end $$;

drop trigger if exists gate_signup on auth.users;
create trigger gate_signup before insert on auth.users for each row execute function public.gate_signup();
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users for each row execute function public.handle_new_user();

-- ===== Row Level Security =====
alter table public.profiles enable row level security;
alter table public.clients_index enable row level security;
alter table public.coach_space enable row level security;
alter table public.coach_public enable row level security;
alter table public.client_space enable row level security;
alter table public.client_log enable row level security;

drop policy if exists "profilo: leggo il mio" on public.profiles;
create policy "profilo: leggo il mio" on public.profiles for select using (id = auth.uid());
-- nessuna policy di update/insert/delete: il ruolo non si può cambiare dall'app

drop policy if exists "coach: i miei clienti" on public.clients_index;
create policy "coach: i miei clienti" on public.clients_index for all
  using (coach_id = auth.uid() and private.is_coach()) with check (coach_id = auth.uid() and private.is_coach());
drop policy if exists "cliente: la mia riga" on public.clients_index;
create policy "cliente: la mia riga" on public.clients_index for select using (user_id = auth.uid());

drop policy if exists "coach: spazio privato" on public.coach_space;
create policy "coach: spazio privato" on public.coach_space for all
  using (coach_id = auth.uid() and private.is_coach()) with check (coach_id = auth.uid() and private.is_coach());

drop policy if exists "coach: spazio pubblico" on public.coach_public;
create policy "coach: spazio pubblico" on public.coach_public for all
  using (coach_id = auth.uid() and private.is_coach()) with check (coach_id = auth.uid() and private.is_coach());
drop policy if exists "cliente: legge spazio pubblico" on public.coach_public;
create policy "cliente: legge spazio pubblico" on public.coach_public for select using (coach_id = private.my_coach_id());

drop policy if exists "coach: spazi clienti" on public.client_space;
create policy "coach: spazi clienti" on public.client_space for all
  using (coach_id = auth.uid() and private.is_coach())
  with check (coach_id = auth.uid() and private.is_coach() and client_id in (select id from clients_index where coach_id = auth.uid()));
drop policy if exists "cliente: legge il suo spazio" on public.client_space;
create policy "cliente: legge il suo spazio" on public.client_space for select using (client_id = private.my_client_id());

drop policy if exists "coach: legge i diari" on public.client_log;
create policy "coach: legge i diari" on public.client_log for select using (coach_id = auth.uid() and private.is_coach());
drop policy if exists "cliente: il mio diario" on public.client_log;
create policy "cliente: il mio diario" on public.client_log for select using (client_id = private.my_client_id());
drop policy if exists "cliente: scrive il diario" on public.client_log;
create policy "cliente: scrive il diario" on public.client_log for insert
  with check (client_id = private.my_client_id() and coach_id = private.my_coach_id());
drop policy if exists "cliente: aggiorna il diario" on public.client_log;
create policy "cliente: aggiorna il diario" on public.client_log for update
  using (client_id = private.my_client_id()) with check (client_id = private.my_client_id() and coach_id = private.my_coach_id());

-- ===== controllo invito prima dell'iscrizione (la pagina mostra "invito non valido" senza creare account) =====
create or replace function public.check_invite(p_email text, p_token text) returns boolean language sql stable security definer set search_path=public as $$
  select exists(select 1 from clients_index where lower(email) = lower(p_email) and invite_token = p_token and user_id is null and invite_expires > now());
$$;
revoke all on function public.check_invite(text,text) from public;
grant execute on function public.check_invite(text,text) to anon, authenticated;

-- ===== permessi di base per i ruoli di Supabase =====
grant select on public.profiles to authenticated;
grant select, insert, update, delete on public.clients_index, public.coach_space, public.coach_public, public.client_space to authenticated;
grant select, insert, update on public.client_log to authenticated;
revoke all on public.app_settings from anon, authenticated;

-- ===== chi non ha fatto l'accesso (anon) non tocca nessuna tabella =====
revoke all on public.profiles, public.clients_index, public.coach_space, public.coach_public, public.client_space, public.client_log from anon;
revoke execute on function private.is_coach(), private.my_client_id(), private.my_coach_id() from public, anon;
grant execute on function private.is_coach(), private.my_client_id(), private.my_coach_id() to authenticated;
-- check_invite resta chiamabile senza accesso di proposito: risponde solo sì/no e serve il codice d'invito (128 bit)
revoke execute on function public.gate_signup(), public.handle_new_user() from public, anon, authenticated;
