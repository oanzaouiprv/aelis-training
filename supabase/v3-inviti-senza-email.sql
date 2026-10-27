-- =====================================================================
-- AELIS Training · v3: clienti creati dalla coach anche senza email.
-- L'invito può essere legato a un'email (come prima) oppure no: in quel caso
-- vale solo il codice segreto del link, e l'email la scrive il cliente all'iscrizione.
-- =====================================================================
alter table public.clients_index alter column email drop not null;

create or replace function public.gate_signup() returns trigger language plpgsql security definer set search_path=public as $$
declare ce text; tok text; ok boolean;
begin
  select value into ce from app_settings where key = 'coach_email';
  if lower(new.email) = lower(ce) and not exists(select 1 from profiles where role = 'coach') then
    return new;
  end if;
  tok := coalesce(new.raw_user_meta_data->>'invite_token','');
  select exists(select 1 from clients_index where invite_token = tok and user_id is null and invite_expires > now()
                and (email is null or lower(email) = lower(new.email))) into ok;
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
    update clients_index set user_id = new.id, invite_token = null, email = coalesce(email, lower(new.email))
      where invite_token = new.raw_user_meta_data->>'invite_token' and user_id is null
        and (email is null or lower(email) = lower(new.email));
  end if;
  return new;
end $$;

create or replace function public.check_invite(p_email text, p_token text) returns boolean language sql stable security definer set search_path=public as $$
  select exists(select 1 from clients_index where invite_token = p_token and user_id is null and invite_expires > now()
    and (case when coalesce(p_email,'') = '' then email is null else (email is null or lower(email) = lower(p_email)) end));
$$;
