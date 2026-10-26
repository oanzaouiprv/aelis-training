\set ON_ERROR_STOP 0
\echo '--- intruso senza invito'
insert into auth.users(id,email) values ('00000000-0000-0000-0000-00000000dead','hacker@x.it');
\echo '--- Alice (coach) si iscrive'
insert into auth.users(id,email) values ('00000000-0000-0000-0000-0000000000c0','Alice@aelis.it');
select role from public.profiles;
\echo '--- secondo account con email coach: bloccato'
insert into auth.users(id,email) values ('00000000-0000-0000-0000-0000000000c1','alice@aelis.it');
-- come coach: crea due clienti e i loro spazi
set role authenticated; set request.jwt.claim.sub='00000000-0000-0000-0000-0000000000c0';
insert into public.clients_index(id,coach_id,email,full_name) values ('cA','00000000-0000-0000-0000-0000000000c0','giulia@x.it','Giulia'),('cB','00000000-0000-0000-0000-0000000000c0','luca@x.it','Luca');
insert into public.client_space(client_id,coach_id,data) values ('cA','00000000-0000-0000-0000-0000000000c0','{"program":"A"}'),('cB','00000000-0000-0000-0000-0000000000c0','{"program":"B"}');
insert into public.coach_space(coach_id,data) values ('00000000-0000-0000-0000-0000000000c0','{"leads":["segreto"]}');
insert into public.coach_public(coach_id,data) values ('00000000-0000-0000-0000-0000000000c0','{"sfide":1}');
select 'token giulia' t, invite_token is not null from public.clients_index where id='cA';
\gset
reset role;
select invite_token as tok from public.clients_index where id='cA' \gset
\echo '--- Giulia con token sbagliato: bloccata'
insert into auth.users(id,email,raw_user_meta_data) values ('00000000-0000-0000-0000-0000000000a1','giulia@x.it','{"invite_token":"sbagliato"}');
\echo '--- check_invite'
select public.check_invite('giulia@x.it', :'tok') ok_giusto, public.check_invite('giulia@x.it','x') ok_sbagliato;
\echo '--- Giulia con token giusto'
insert into auth.users(id,email,raw_user_meta_data) values ('00000000-0000-0000-0000-0000000000a1','giulia@x.it',jsonb_build_object('invite_token',:'tok'));
select id, user_id is not null collegata, invite_token is null token_consumato from public.clients_index order by id;
\echo '--- riuso dello stesso token per altro account: bloccato'
insert into auth.users(id,email,raw_user_meta_data) values ('00000000-0000-0000-0000-0000000000a2','giulia@x.it',jsonb_build_object('invite_token',:'tok'));
-- come GIULIA
set role authenticated; set request.jwt.claim.sub='00000000-0000-0000-0000-0000000000a1';
select 'giulia: client_space visibili' t, count(*) from public.client_space;
select 'giulia: coach_space visibili' t, count(*) from public.coach_space;
select 'giulia: coach_public visibili' t, count(*) from public.coach_public;
select 'giulia: clients_index visibili' t, count(*) from public.clients_index;
insert into public.client_log(client_id,coach_id,data) values ('cA','00000000-0000-0000-0000-0000000000c0','{"history":[1]}');
\echo '--- Giulia scrive nel diario di Luca: bloccato'
insert into public.client_log(client_id,coach_id,data) values ('cB','00000000-0000-0000-0000-0000000000c0','{"history":[666]}');
\echo '--- Giulia modifica la sua scheda: nessuna riga toccata'
update public.client_space set data='{"program":"hack"}' where client_id='cA';
\echo '--- Giulia prova a diventare coach'
update public.profiles set role='coach';
select role from public.profiles;
-- come COACH
reset role; set role authenticated; set request.jwt.claim.sub='00000000-0000-0000-0000-0000000000c0';
select 'coach: diari' t, count(*) from public.client_log;
select 'coach: scheda giulia' t, data->>'program' from public.client_space where client_id='cA';
\echo '--- coach scrive nel diario cliente: bloccato'
update public.client_log set data='{}' ;
select 'diario intatto' t, data from public.client_log;
