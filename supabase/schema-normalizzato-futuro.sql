-- AELIS Training · schema del database (Supabase / Postgres)
-- Come usarlo: Supabase → SQL Editor → incolla tutto il file → Run.
-- Regola di base: la coach vede e modifica tutto ciò che è suo;
-- ogni cliente vede solo i propri dati e può registrare solo i propri allenamenti e check.

-- ============ PROFILI ============
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role text not null default 'client' check (role in ('coach','client')),
  full_name text,
  created_at timestamptz not null default now()
);

-- ============ CLIENTI ============
create table if not exists public.clients (
  id uuid primary key default gen_random_uuid(),
  coach_id uuid not null references public.profiles(id) on delete cascade,
  user_id uuid unique references public.profiles(id) on delete set null, -- collegato quando il cliente accetta l'invito
  full_name text not null,
  email text,
  goal text,
  level text default 'Principiante',
  status text not null default 'attivo' check (status in ('attivo','sospeso','concluso')),
  source text check (source in ('Social','Sala','Esterno')),
  source_detail text,
  since date default current_date,
  availability text,
  check_every int default 7,
  show_photos boolean default true,
  community boolean default false,
  onboarding jsonb default '{"questionario":false,"foto":false,"scheda":false}',
  answers jsonb default '[]',
  created_at timestamptz not null default now()
);

-- dati privati del cliente: SOLO la coach (limitazioni fisiche, anamnesi, note)
create table if not exists public.client_private (
  client_id uuid primary key references public.clients(id) on delete cascade,
  coach_id uuid not null references public.profiles(id) on delete cascade,
  limits text,
  coach_notes text
);

-- ============ INVITI ============
create table if not exists public.invites (
  id uuid primary key default gen_random_uuid(),
  coach_id uuid not null references public.profiles(id) on delete cascade,
  client_id uuid not null references public.clients(id) on delete cascade,
  email text not null,
  token text not null unique default replace(gen_random_uuid()::text,'-',''),
  accepted_at timestamptz,
  created_at timestamptz not null default now()
);

-- ============ ESERCIZI E SCHEDE ============
create table if not exists public.exercises (
  id uuid primary key default gen_random_uuid(),
  coach_id uuid not null references public.profiles(id) on delete cascade,
  name text not null,
  mode text default 'Esterno' check (mode in ('Esterno','Corpo libero','Tempo')),
  muscles_primary text[] default '{}',
  muscles_secondary text[] default '{}',
  technique_note text,
  video_url text
);

create table if not exists public.programs (
  id uuid primary key default gen_random_uuid(),
  coach_id uuid not null references public.profiles(id) on delete cascade,
  client_id uuid not null references public.clients(id) on delete cascade,
  version int not null default 1,
  assigned_on date default current_date,
  sessions jsonb not null default '[]',   -- [{key,name,items:[{exercise_id,sets,rmin,rmax,rest,rir,alternatives[]}]}]
  active boolean default true,
  created_at timestamptz not null default now()
);

-- ============ ALLENAMENTI ============
create table if not exists public.workouts (
  id uuid primary key default gen_random_uuid(),
  coach_id uuid not null references public.profiles(id) on delete cascade,
  client_id uuid not null references public.clients(id) on delete cascade,
  date date not null default current_date,
  session_key text,
  kind text default 'autonomo' check (kind in ('coach','autonomo')),
  minutes int,
  sets jsonb not null default '{}',       -- {exercise_id:[{kg,reps,rir,done}]}
  feel int check (feel between 1 and 5),
  note text,
  kudos boolean default false,
  created_at timestamptz not null default now()
);

-- ============ AGENDA ============
create table if not exists public.appointments (
  id uuid primary key default gen_random_uuid(),
  coach_id uuid not null references public.profiles(id) on delete cascade,
  client_id uuid references public.clients(id) on delete set null,
  date date not null,
  time time not null,
  duration int default 60,
  kind text not null check (kind in ('pt','free','consulenza','corso','personale')),
  status text not null default 'previsto' check (status in ('previsto','attesa','svolto','annullato')),
  title text,
  created_at timestamptz not null default now()
);

-- ============ PERCORSI, RATE E LEZIONI ============
create table if not exists public.contracts (
  id uuid primary key default gen_random_uuid(),
  coach_id uuid not null references public.profiles(id) on delete cascade,
  client_id uuid not null references public.clients(id) on delete cascade,
  name text not null,
  start_date date not null,
  end_date date,
  price numeric(10,2),
  with_lessons boolean default true,
  status text default 'attivo' check (status in ('attivo','sospeso','concluso'))
);
create table if not exists public.installments (
  id uuid primary key default gen_random_uuid(),
  coach_id uuid not null references public.profiles(id) on delete cascade,
  contract_id uuid not null references public.contracts(id) on delete cascade,
  n int not null,
  due date not null,
  amount numeric(10,2) not null,
  paid numeric(10,2) default 0,
  paid_on date,
  method text
);
create table if not exists public.lesson_moves (
  id uuid primary key default gen_random_uuid(),
  coach_id uuid not null references public.profiles(id) on delete cascade,
  contract_id uuid not null references public.contracts(id) on delete cascade,
  date date not null default current_date,
  kind text check (kind in ('pagata','omaggio')),
  delta int not null,
  reason text not null,
  by_who text default 'Coach'
);

-- ============ CHECK, MISURE, MESSAGGI ============
create table if not exists public.checks (
  id uuid primary key default gen_random_uuid(),
  coach_id uuid not null references public.profiles(id) on delete cascade,
  client_id uuid not null references public.clients(id) on delete cascade,
  date date not null default current_date,
  answers jsonb not null,                  -- {energia,stress,motivazione,sonno,progressi}
  note text
);
create table if not exists public.measures (
  id uuid primary key default gen_random_uuid(),
  coach_id uuid not null references public.profiles(id) on delete cascade,
  client_id uuid not null references public.clients(id) on delete cascade,
  date date not null default current_date,
  values jsonb not null                    -- {peso,vita,fianchi,braccio,...}
);
create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  coach_id uuid not null references public.profiles(id) on delete cascade,
  client_id uuid references public.clients(id) on delete cascade,
  from_coach boolean not null default true,
  kind text default 'messaggio',
  body text not null,
  send_at timestamptz,                     -- messaggi programmati
  read_at timestamptz,
  created_at timestamptz not null default now()
);

-- ============ SOLO COACH: CONTATTI, ORE, AUTOMAZIONI ============
create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  coach_id uuid not null references public.profiles(id) on delete cascade,
  full_name text not null, source text, source_detail text,
  stage text default 'contattare' check (stage in ('contattare','fissata','svolta','cliente','perso')),
  next_step text, interest text, trial_at timestamptz,
  created_at timestamptz not null default now()
);
create table if not exists public.shifts (
  id uuid primary key default gen_random_uuid(),
  coach_id uuid not null references public.profiles(id) on delete cascade,
  date date not null, time_in time not null, time_out time, fix_reason text
);
create table if not exists public.automations (
  id uuid primary key default gen_random_uuid(),
  coach_id uuid not null references public.profiles(id) on delete cascade,
  code text not null, enabled boolean default true, message text not null
);

-- ============ SFIDE ============
create table if not exists public.challenges (
  id uuid primary key default gen_random_uuid(),
  coach_id uuid not null references public.profiles(id) on delete cascade,
  title text not null, kind text check (kind in ('personale','squadra')),
  metric text check (metric in ('n','vol')), target numeric not null,
  start_date date not null, end_date date not null, prize text
);
create table if not exists public.challenge_members (
  challenge_id uuid references public.challenges(id) on delete cascade,
  client_id uuid references public.clients(id) on delete cascade,
  anonymous boolean default false,
  primary key (challenge_id, client_id)
);

-- ============ FUNZIONI DI SUPPORTO ============
create or replace function public.is_coach() returns boolean language sql stable security definer set search_path=public as $$
  select exists(select 1 from profiles where id = auth.uid() and role = 'coach');
$$;
create or replace function public.my_client_id() returns uuid language sql stable security definer set search_path=public as $$
  select id from clients where user_id = auth.uid() limit 1;
$$;

-- nuovo utente: crea il profilo (cliente per default; la coach si imposta a mano una volta)
create or replace function public.handle_new_user() returns trigger language plpgsql security definer set search_path=public as $$
begin
  insert into profiles(id, full_name) values (new.id, coalesce(new.raw_user_meta_data->>'full_name', new.email)) on conflict do nothing;
  -- se esiste un invito per questa email, collega il cliente
  update clients c set user_id = new.id
    from invites i where i.client_id = c.id and lower(i.email) = lower(new.email) and c.user_id is null;
  update invites set accepted_at = now() where lower(email) = lower(new.email) and accepted_at is null;
  return new;
end $$;
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users for each row execute function public.handle_new_user();

-- ============ SICUREZZA (Row Level Security) ============
do $$ declare t text; begin
  foreach t in array array['profiles','clients','client_private','invites','exercises','programs','workouts','appointments','contracts','installments','lesson_moves','checks','measures','messages','leads','shifts','automations','challenges','challenge_members']
  loop execute format('alter table public.%I enable row level security', t); end loop;
end $$;

-- profili: ognuno vede il proprio
create policy "profilo proprio" on public.profiles for select using (id = auth.uid());
create policy "aggiorna profilo proprio" on public.profiles for update using (id = auth.uid()) with check (role = case when public.is_coach() then 'coach' else 'client' end);

-- la coach gestisce tutto ciò che è suo
do $$ declare t text; begin
  foreach t in array array['clients','client_private','invites','exercises','programs','workouts','appointments','contracts','installments','lesson_moves','checks','measures','messages','leads','shifts','automations','challenges']
  loop execute format('create policy "coach: tutto il suo" on public.%I for all using (coach_id = auth.uid()) with check (coach_id = auth.uid())', t); end loop;
end $$;
create policy "coach: iscrizioni sfide" on public.challenge_members for all
  using (exists(select 1 from challenges ch where ch.id = challenge_id and ch.coach_id = auth.uid()));

-- il cliente: legge i propri dati (le note private della coach restano nascoste tramite la vista client_self)
create policy "cliente: scheda propria" on public.programs for select using (client_id = public.my_client_id());
create policy "cliente: esercizi della coach" on public.exercises for select using (coach_id = (select coach_id from clients where id = public.my_client_id()));
create policy "cliente: allenamenti propri" on public.workouts for select using (client_id = public.my_client_id());
create policy "cliente: registra allenamento" on public.workouts for insert with check (client_id = public.my_client_id() and coach_id = (select coach_id from clients where id = public.my_client_id()));
create policy "cliente: lezioni proprie" on public.appointments for select using (client_id = public.my_client_id());
create policy "cliente: richiede lezione" on public.appointments for insert with check (client_id = public.my_client_id() and status = 'attesa');
create policy "cliente: percorso proprio" on public.contracts for select using (client_id = public.my_client_id());
create policy "cliente: rate proprie" on public.installments for select using (contract_id in (select id from contracts where client_id = public.my_client_id()));
create policy "cliente: check propri" on public.checks for select using (client_id = public.my_client_id());
create policy "cliente: invia check" on public.checks for insert with check (client_id = public.my_client_id());
create policy "cliente: misure proprie" on public.measures for select using (client_id = public.my_client_id());
create policy "cliente: messaggi propri" on public.messages for select using (client_id = public.my_client_id() and (send_at is null or send_at <= now()));
create policy "cliente: scrive alla coach" on public.messages for insert with check (client_id = public.my_client_id() and from_coach = false);
create policy "cliente: sfide della coach" on public.challenges for select using (coach_id = (select coach_id from clients where id = public.my_client_id()));
create policy "cliente: si iscrive" on public.challenge_members for all using (client_id = public.my_client_id()) with check (client_id = public.my_client_id());
create policy "cliente: vede iscritti" on public.challenge_members for select using (challenge_id in (select id from challenges where coach_id = (select coach_id from clients where id = public.my_client_id())));

-- il cliente legge la propria riga (le informazioni sensibili stanno in client_private, che non vede)
create policy "cliente: riga propria" on public.clients for select using (user_id = auth.uid());
-- preferenze privacy del cliente (foto, community): solo quelle due colonne, tramite funzione
create or replace function public.set_my_privacy(p_show_photos boolean, p_community boolean) returns void language sql security definer set search_path=public as $$
  update clients set show_photos = p_show_photos, community = p_community where user_id = auth.uid();
$$;
grant execute on function public.set_my_privacy(boolean, boolean) to authenticated;

-- ============ FOTO (Storage) ============
-- crea un bucket privato chiamato "foto" da Supabase → Storage, poi:
-- percorso file: <client_id>/<data>.jpg
create policy "coach: foto dei suoi clienti" on storage.objects for all
  using (bucket_id = 'foto' and (storage.foldername(name))[1]::uuid in (select id from public.clients where coach_id = auth.uid()));
create policy "cliente: foto proprie" on storage.objects for select
  using (bucket_id = 'foto' and (storage.foldername(name))[1]::uuid = public.my_client_id());

-- ============ PRIMO AVVIO ============
-- dopo il primo accesso della coach con la sua email, esegui UNA volta:
-- update public.profiles set role = 'coach' where id = (select id from auth.users where email = 'EMAIL-DELLA-COACH');
