/* =====================================================================
   AELIS Training · accesso, iscrizioni e salvataggio sul database (Supabase)

   Si attiva solo se config.js contiene supabaseUrl e supabaseAnonKey.
   Senza chiavi l'app resta in modalità demo e questo file non fa nulla.

   Sicurezza in breve
   - La chiave "anon" è pubblica per natura: chi può leggere o scrivere cosa
     lo decidono le regole del database (Row Level Security, supabase/schema.sql).
   - Iscrizione solo con invito (i clienti) o con l'email configurata (la coach):
     il controllo è nel database, non qui, quindi non si aggira modificando la pagina.
   - Le password non passano mai da questo codice se non verso Supabase Auth.
   - Al logout si cancellano i dati salvati nel browser.
   ===================================================================== */
(function(){
'use strict';
const CFG=window.AELIS_CONFIG||{};
// con ?demo nell'indirizzo l'app resta in modalità demo (portfolio): dati inventati, nessun accesso al database
const REAL=!!(CFG.supabaseUrl&&CFG.supabaseAnonKey)&&!/[?&]demo\b/.test(location.search);
// versione fissata: una versione pubblicata su npm non può più cambiare
const LIB='https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.111.0/dist/umd/supabase.js';
const PW_MIN=10;
const COMMON=['password','password1','1234567890','qwertyuiop','aelistraining','palestra123','allenamento','0123456789'];

let sb=null,api=null,user=null,role=null,M=newMeta(),boxEl=null,fails=0,lockUntil=0;
function newMeta(){return {sent:{},index:{},ver:null,pending:false};}

/* ---------- utilità ---------- */
const $=id=>document.getElementById(id);
const esc=s=>String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const clone=o=>JSON.parse(JSON.stringify(o));
const rand=n=>{const a=new Uint8Array(n);crypto.getRandomValues(a);return Array.from(a,b=>b.toString(16).padStart(2,'0')).join('');};
const base=()=>location.origin+location.pathname;
const initials=n=>String(n||'?').trim().split(/\s+/).slice(0,2).map(x=>x[0]||'').join('').toUpperCase()||'?';
const strip=(o,ks)=>{const r=Object.assign({},o);ks.forEach(k=>delete r[k]);return r;};
const byDate=(a,b)=>a.date<b.date?-1:a.date>b.date?1:0;
const okMail=m=>/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(m);

function secretKey(k){
 k=String(k||'');if(/^sb_secret_/.test(k))return true;
 try{const p=JSON.parse(atob(k.split('.')[1].replace(/-/g,'+').replace(/_/g,'/')));return p.role==='service_role';}catch(e){return false;}
}
function loadLib(){
 if(window.supabase&&window.supabase.createClient)return Promise.resolve();
 return new Promise((res,rej)=>{const s=document.createElement('script');s.src=LIB;s.crossOrigin='anonymous';s.referrerPolicy='no-referrer';
  if(CFG.supabaseSri)s.integrity=CFG.supabaseSri;
  s.onload=()=>window.supabase?res():rej(new Error('lib'));s.onerror=()=>rej(new Error('lib'));document.head.appendChild(s);});
}

/* errori di Supabase → messaggi chiari, senza dire se un'email esiste o no */
function human(e){
 const m=String((e&&(e.message||e.error_description))||e||'');const st=e&&e.status;
 if(st===429||/rate limit|too many/i.test(m))return 'Troppi tentativi. Riprova tra qualche minuto.';
 if(/invalid login credentials/i.test(m))return 'Email o password non corretti.';
 if(/email not confirmed/i.test(m))return 'Prima conferma l\'email: apri il link che ti abbiamo inviato (controlla anche lo spam).';
 if(/already registered|already exists/i.test(m))return 'Esiste già un account con questa email: accedi.';
 if(/invito|database error saving new user|unexpected_failure|unexpected failure/i.test(m)||e&&e.code==='unexpected_failure')return 'Questo invito non è valido o è scaduto. Chiedi ad Aelis un nuovo link.';
 if(/weak|pwned|password should/i.test(m))return 'Password troppo debole: usane una più lunga e meno comune.';
 if(/same password|different from the old/i.test(m))return 'La nuova password deve essere diversa da quella attuale.';
 if(/fetch|network|failed to fetch|load failed/i.test(m))return 'Connessione assente. Riprova quando sei online.';
 return 'Qualcosa non ha funzionato. Riprova.';
}
function pwProblem(p,mail){
 if(p.length<PW_MIN)return 'Almeno '+PW_MIN+' caratteri.';
 const low=p.toLowerCase();
 if(COMMON.indexOf(low)>=0||/^(.)\1+$/.test(p))return 'Questa password è troppo facile da indovinare.';
 if(mail&&low.indexOf(mail.split('@')[0].toLowerCase())>=0)return 'Non usare il tuo nome o la tua email nella password.';
 if(!/[a-zA-Z]/.test(p)||!/[0-9]/.test(p))return 'Usa sia lettere sia numeri.';
 return '';
}

/* ---------- schermate di accesso ---------- */
const LOGO='<svg class="mk" viewBox="-720 -720 1440 1400" aria-hidden="true"><use href="#bfD"></use></svg>';
function mount(){
 if(boxEl)return;boxEl=document.createElement('div');boxEl.id='auth';boxEl.setAttribute('role','dialog');boxEl.setAttribute('aria-modal','true');boxEl.setAttribute('aria-label','Accesso');
 document.body.appendChild(boxEl);
 boxEl.addEventListener('click',e=>{const b=e.target.closest('[data-auth]');if(!b)return;e.preventDefault();ACT[b.dataset.auth]&&ACT[b.dataset.auth](b);});
 boxEl.addEventListener('submit',e=>{e.preventDefault();const f=e.target;SUB[f.dataset.form]&&SUB[f.dataset.form](f);});
}
function field(id,label,type,extra){return '<label class="f">'+label+'<span class="pw"><input class="in" id="'+id+'" type="'+type+'" '+(extra||'')+'>'+(type==='password'?'<button type="button" class="eye" data-auth="eye" data-for="'+id+'" aria-label="Mostra password">Mostra</button>':'')+'</span></label>';}
function frame(title,sub,body){return '<div class="box">'+LOGO+'<p class="wm">AELIS TRAINING</p><div class="card stack"><h1>'+title+'</h1>'+(sub?'<p class="muted small">'+sub+'</p>':'')+body+'</div><p class="foot"><a href="privacy.html" target="_blank" rel="noopener">Privacy</a></p><p class="foot">Piccoli cambiamenti, grandi risultati</p></div>';}
const ERR='<p class="err" id="au-err" role="alert" aria-live="assertive"></p>';
function show(kind,o){
 o=o||{};mount();boxEl.classList.remove('hide');document.body.classList.add('locked');let h='';
 if(kind==='loading')h='<div class="box">'+LOGO+'<p class="wm">AELIS TRAINING</p><p class="wait">'+esc(o.msg||'Un attimo…')+'</p></div>';
 else if(kind==='login')h=frame('Accedi','',
  '<form data-form="login" class="stack" novalidate>'+field('au-mail','Email','email','autocomplete="username" inputmode="email" required value="'+esc(o.mail||'')+'"')+field('au-pw','Password','password','autocomplete="current-password" required')+ERR+
  '<button class="btn primary lg block" type="submit">Accedi</button></form>'+
  '<button class="lnk" data-auth="go" data-v="forgot">Password dimenticata?</button>'+
  '<p class="xs muted">Sei cliente e non hai ancora un account? Ti serve il link d\'invito di Aelis.</p>'+
  (/[?&]primo-accesso\b/.test(location.search)?'<button class="lnk xs" data-auth="go" data-v="coach">Primo accesso della coach</button>':''));
 else if(kind==='forgot')h=frame('Nuova password','Ti mandiamo un link per sceglierne una nuova.',
  '<form data-form="forgot" class="stack" novalidate>'+field('au-mail','Email','email','autocomplete="username" inputmode="email" required')+ERR+'<button class="btn primary lg block" type="submit">Invia il link</button></form><button class="lnk" data-auth="go" data-v="login">Torna all\'accesso</button>');
 else if(kind==='sent')h=frame('Controlla la posta',esc(o.msg),'<p class="small muted">Non trovi l\'email? Guarda nello spam o nelle promozioni.</p><button class="btn block" data-auth="go" data-v="login">Torna all\'accesso</button>');
 else if(kind==='newpass')h=frame('Scegli la nuova password','Almeno '+PW_MIN+' caratteri, con lettere e numeri.',
  '<form data-form="newpass" class="stack" novalidate>'+field('au-pw','Nuova password','password','autocomplete="new-password" required minlength="'+PW_MIN+'"')+field('au-pw2','Ripeti la password','password','autocomplete="new-password" required')+ERR+'<button class="btn primary lg block" type="submit">Salva la password</button></form>'+(o.cancel?'<button class="lnk" data-auth="close">Annulla</button>':''));
 else if(kind==='invite')h=frame('Ti diamo il benvenuto','Crea il tuo accesso personale ad AELIS Training.',
  '<form data-form="invite" class="stack" novalidate>'+field('au-name','Nome e cognome','text','autocomplete="name" required value="'+esc(o.name||'')+'"')+field('au-mail','Email','email','autocomplete="username" readonly value="'+esc(o.mail)+'"')+field('au-pw','Crea una password','password','autocomplete="new-password" required minlength="'+PW_MIN+'"')+field('au-pw2','Ripeti la password','password','autocomplete="new-password" required')+
  '<label class="chk"><input type="checkbox" id="au-ok"> <span>Ho letto l\'<a href="privacy.html" target="_blank" rel="noopener">informativa privacy</a> e acconsento al trattamento dei miei dati di allenamento e salute per seguire il percorso.</span></label>'+ERR+
  '<button class="btn primary lg block" type="submit">Crea il mio account</button></form><button class="lnk" data-auth="go" data-v="login">Ho già un account</button>');
 else if(kind==='coach')h=frame('Primo accesso della coach','Funziona una volta sola e solo con l\'email della coach impostata nel database.',
  '<form data-form="coach" class="stack" novalidate>'+field('au-name','Nome','text','autocomplete="name" required value="'+esc(CFG.coachName||'')+'"')+field('au-mail','Email','email','autocomplete="username" inputmode="email" required')+field('au-pw','Password','password','autocomplete="new-password" required minlength="'+PW_MIN+'"')+field('au-pw2','Ripeti la password','password','autocomplete="new-password" required')+ERR+
  '<button class="btn primary lg block" type="submit">Crea l\'account coach</button></form><button class="lnk" data-auth="go" data-v="login">Torna all\'accesso</button>');
 else if(kind==='error')h=frame('Ops',esc(o.msg),(o.retry?'<button class="btn primary block" data-auth="retry">Riprova</button>':'')+(o.logout?'<button class="btn block" data-auth="logout">Esci</button>':'<button class="lnk" data-auth="go" data-v="login">Torna all\'accesso</button>'));
 boxEl.innerHTML=h;boxEl.dataset.kind=kind;
 const f=boxEl.querySelector('input:not([readonly])');if(f&&kind!=='loading')setTimeout(()=>{try{f.focus({preventScroll:true});}catch(e){}},30);
}
function hide(){if(boxEl){boxEl.classList.add('hide');boxEl.innerHTML='';}document.body.classList.remove('locked');}
function err(t){const e=$('au-err');if(e)e.textContent=t||'';}
function busy(f,on){const b=f.querySelector('button[type=submit]');if(b){b.disabled=on;b.classList.toggle('busy',on);}}
const v=id=>{const e=$(id);return e?e.value.trim():'';};
const vRaw=id=>{const e=$(id);return e?e.value:'';};

const ACT={
 go(b){show(b.dataset.v,{mail:v('au-mail')});},
 eye(b){const i=$(b.dataset.for);if(!i)return;const s=i.type==='password';i.type=s?'text':'password';b.textContent=s?'Nascondi':'Mostra';b.setAttribute('aria-label',s?'Nascondi password':'Mostra password');},
 retry(){location.reload();},
 logout(){logout(true);},
 close(){hide();}
};
const SUB={
 async login(f){
  const mail=v('au-mail').toLowerCase(),pw=vRaw('au-pw');
  if(Date.now()<lockUntil){err('Troppi tentativi: aspetta qualche secondo.');return;}
  if(!okMail(mail)||!pw){err('Inserisci email e password.');return;}
  busy(f,true);err('');
  const r=await sb.auth.signInWithPassword({email:mail,password:pw});
  busy(f,false);
  if(r.error){fails++;if(fails>=5){lockUntil=Date.now()+30000;fails=0;}err(human(r.error));return;}
  fails=0;await boot(r.data.user);
 },
 async forgot(f){
  const mail=v('au-mail').toLowerCase();if(!okMail(mail)){err('Scrivi un\'email valida.');return;}
  busy(f,true);const r=await sb.auth.resetPasswordForEmail(mail,{redirectTo:base()});busy(f,false);
  if(r.error&&r.error.status===429){err(human(r.error));return;}
  // stesso messaggio sia che l'email esista sia che no
  show('sent',{msg:'Se '+mail+' è registrata, tra poco riceverai il link per scegliere una nuova password.'});
 },
 async newpass(f){
  const p=vRaw('au-pw'),p2=vRaw('au-pw2');const pb=pwProblem(p,user&&user.email);if(pb){err(pb);return;}if(p!==p2){err('Le due password non coincidono.');return;}
  busy(f,true);const r=await sb.auth.updateUser({password:p});busy(f,false);
  if(r.error){err(human(r.error));return;}
  try{history.replaceState(null,'',base());}catch(e){}
  if(api&&role){hide();api.toast('Password aggiornata');}else{const s=await sb.auth.getSession();if(s.data.session)await boot(s.data.session.user);else show('login');}
 },
 async invite(f){
  const name=v('au-name'),mail=v('au-mail').toLowerCase(),p=vRaw('au-pw'),p2=vRaw('au-pw2');
  if(name.length<2){err('Scrivi nome e cognome.');return;}
  const pb=pwProblem(p,mail);if(pb){err(pb);return;}if(p!==p2){err('Le due password non coincidono.');return;}
  if(!$('au-ok').checked){err('Per continuare serve il consenso privacy.');return;}
  busy(f,true);err('');
  const tok=M.inviteToken;
  const r=await sb.auth.signUp({email:mail,password:p,options:{emailRedirectTo:base(),data:{invite_token:tok,full_name:name,privacy_ok:new Date().toISOString()}}});
  busy(f,false);
  // l'invito è già stato controllato: un errore 500 qui di solito è l'email di conferma che non parte
  if(r.error){err(r.error.status===500||/sending|smtp|email/i.test(r.error.message||'')?'Non riesco a spedirti l\'email di conferma in questo momento. Non è un problema tuo: avvisa Aelis e riprova più tardi con lo stesso link.':human(r.error));return;}
  try{history.replaceState(null,'',base());}catch(e){}
  if(r.data.session)await boot(r.data.user);
  else show('sent',{msg:'Ti abbiamo mandato un\'email a '+mail+': apri il link per attivare l\'account, poi accedi.'});
 },
 async coach(f){
  const name=v('au-name'),mail=v('au-mail').toLowerCase(),p=vRaw('au-pw'),p2=vRaw('au-pw2');
  if(!okMail(mail)){err('Scrivi un\'email valida.');return;}
  const pb=pwProblem(p,mail);if(pb){err(pb);return;}if(p!==p2){err('Le due password non coincidono.');return;}
  busy(f,true);err('');
  const r=await sb.auth.signUp({email:mail,password:p,options:{emailRedirectTo:base(),data:{full_name:name||'Coach'}}});
  busy(f,false);
  if(r.error){err((/invito|database error|unexpected/i.test(r.error.message||'')||r.error.status===500)?'Questa email non è quella della coach, oppure l\'account coach esiste già.':human(r.error));return;}
  if(r.data.session)await boot(r.data.user);
  else show('sent',{msg:'Ti abbiamo mandato un\'email a '+mail+': apri il link per attivare l\'account coach.'});
 }
};

async function showInvite(tok,mail){
 show('loading',{msg:'Controllo l\'invito…'});
 const r=await sb.rpc('check_invite',{p_email:mail,p_token:tok});
 if(r.error){show('error',{msg:human(r.error),retry:true});return;}
 if(!r.data){show('error',{msg:'Questo invito non è valido, è già stato usato o è scaduto. Se hai già un account, accedi; altrimenti chiedi ad Aelis un nuovo link.'});return;}
 M.inviteToken=tok;show('invite',{mail:mail});
}

/* ---------- avvio ---------- */
async function start(a){
 api=a;if(!REAL)return false;
 document.body.classList.add('real');mount();show('loading');
 if(secretKey(CFG.supabaseAnonKey)){show('error',{msg:'Configurazione non sicura: in config.js c\'è la chiave segreta (service_role). Va usata solo la chiave "anon public". Cambia la chiave e rigenera quella segreta in Supabase.'});return true;}
 const recovery=/type=recovery/.test(location.hash);
 const q=new URLSearchParams(location.search);const inv=q.get('invito'),invMail=(q.get('email')||'').toLowerCase();
 try{await loadLib();}catch(e){
  if(!tryCache(null)){show('error',{msg:'Non riesco a caricare l\'accesso. Controlla la connessione e riprova.',retry:true});}
  return true;
 }
 sb=window.supabase.createClient(CFG.supabaseUrl,CFG.supabaseAnonKey,{auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:true,storageKey:'aelis-auth'}});
 sb.auth.onAuthStateChange((ev,session)=>{
  if(ev==='PASSWORD_RECOVERY'){user=session&&session.user||user;setTimeout(()=>show('newpass'),0);}
  else if(ev==='SIGNED_OUT'&&role){role=null;user=null;M=newMeta();api.reset();show('login');}
 });
 const s=await sb.auth.getSession();
 const sess=s.data&&s.data.session;
 if(recovery){user=sess&&sess.user;show('newpass');return true;}
 if(inv&&okMail(invMail)){if(sess)await sb.auth.signOut({scope:'local'});await showInvite(inv,invMail);return true;}
 if(sess)await boot(sess.user);else show('login');
 return true;
}

async function boot(u){
 user=u;show('loading',{msg:'Carico i tuoi dati…'});
 const pr=await sb.from('profiles').select('role,full_name').eq('id',u.id).maybeSingle();
 if(pr.error){if(tryCache(u.id))return;show('error',{msg:human(pr.error),retry:true});return;}
 if(!pr.data){show('error',{msg:'Questo account non è abilitato.',logout:true});return;}
 role=pr.data.role;const cached=readCache(u.id);M=newMeta();
 try{
  if(role==='coach')await loadCoach(cached);else await loadClient(cached);
 }catch(e){
  if(e&&e.message==='noclient'){show('error',{msg:'Il tuo accesso non è più attivo. Per riattivarlo scrivi ad Aelis.',logout:true});return;}
  if(tryCache(u.id))return;
  show('error',{msg:human(e),retry:true});return;
 }
 hide();api.ready(role,M.cid);
 if(M.pending)push();else if(role==='coach')schedulePush();
 startLive();
}

/* ---------- cache locale (per aprire l'app anche senza rete) ---------- */
const CK=id=>'aelis-cache:'+id;
function readCache(id){try{const c=JSON.parse(localStorage.getItem(CK(id))||'null');return c&&c.db&&c.db.v===2?c:null;}catch(e){return null;}}
function cache(){if(!user||!role)return;try{localStorage.setItem(CK(user.id),JSON.stringify({role:role,db:api.S.db,M:{ver:M.ver,cid:M.cid,coach:M.coach,index:M.index,sp:M.sp,pub:M.pub,ix:M.ix,sent:M.sent},pending:M.pending,at:Date.now()}));}catch(e){}}
function tryCache(id){
 let c=null;
 if(id)c=readCache(id);
 else{try{for(let i=0;i<localStorage.length;i++){const k=localStorage.key(i);if(k&&k.indexOf('aelis-cache:')===0){c=readCache(k.slice(12));if(c){user={id:k.slice(12)};break;}}}}catch(e){}}
 if(!c)return false;
 role=c.role;M=Object.assign(newMeta(),c.M,{pending:c.pending});api.setDb(c.db);hide();api.ready(role,M.cid);
 setStatus('offline');api.toast('Sei offline: vedi gli ultimi dati salvati');return true;
}

/* ---------- COACH: compone e scompone i documenti ---------- */
const SAFE=['id','name','ini','age','email','goal','level','status','since','avail','ob','checkEvery','program','contract','answers'];
const reqAppt=r=>({id:'rq-'+r.id,date:r.date,time:r.to,dur:60,type:'pt',status:r.status==='attesa'?'attesa':r.status==='ok'?'previsto':'annullato',clientId:r.clientId,reqId:r.id});

async function loadCoach(cached){
 const uid=user.id;
 const [cs,ix,lg]=await Promise.all([
  sb.from('coach_space').select('data,updated_at').eq('coach_id',uid).maybeSingle(),
  sb.from('clients_index').select('id,email,full_name,user_id,invite_token,invite_expires').eq('coach_id',uid),
  sb.from('client_log').select('client_id,data,updated_at').eq('coach_id',uid)]);
 [cs,ix,lg].forEach(r=>{if(r.error)throw r.error;});
 M.ver=cs.data?cs.data.updated_at:null;
 M.index={};(ix.data||[]).forEach(r=>{M.index[r.id]=r;});
 let doc=cs.data&&cs.data.data&&cs.data.data.v===2?cs.data.data:api.emptyDb();
 // modifiche fatte offline e non ancora salvate: valgono se nessun altro dispositivo ha scritto nel frattempo
 if(cached&&cached.pending&&cached.M&&cached.M.ver===M.ver){api.setDb(cached.db);doc=decomposeCoach().coach;M.pending=true;}
 else if(cached&&cached.pending){setTimeout(()=>api.toast('Alcune modifiche fatte offline non sono state salvate: i dati sono cambiati da un altro dispositivo.'),400);}
 api.setDb(composeCoach(doc,lg.data||[]));
 M.sent.coach=M.pending?null:JSON.stringify(decomposeCoach().coach);
 M.loadedAt=Date.now();cache();
}
function composeCoach(doc,logs){
 const db=clone(doc);const ov=db._ov||{};delete db._ov;
 ov.kudos=ov.kudos||{};ov.req=ov.req||{};ov.read=ov.read||{};ov.liked=ov.liked||{};
 ['clients','contracts','programs','history','appts','leads','inbox','checks','measures','shifts','requests','scheduled','posts','invites','challenges','autos'].forEach(k=>{if(!Array.isArray(db[k]))db[k]=[];});
 db.coachMsg=db.coachMsg||{};db.seenBadges=db.seenBadges||{};db.videos=db.videos||{};
 const byId={};db.clients.forEach(c=>{byId[c.id]=c;});
 db.challenges.forEach(ch=>{ch.joined=[];ch.anon=[];ch.base=ch.base||{};});
 const likes={};
 logs.forEach(r=>{
  const cid=r.client_id,l=r.data||{},c=byId[cid];if(!c)return;
  (l.history||[]).forEach(h=>db.history.push(Object.assign({},h,{clientId:cid,_c:1,kudos:!!ov.kudos[h.id],kudosSeen:(l.seenKudos||[]).indexOf(h.id)>=0})));
  (l.checks||[]).forEach(x=>db.checks.push(Object.assign({},x,{clientId:cid,_c:1})));
  (l.requests||[]).forEach(x=>db.requests.push(Object.assign({},x,{clientId:cid,_c:1,status:ov.req[x.id]||'attesa'})));
  (l.msgs||[]).forEach(x=>db.inbox.push(Object.assign({},x,{clientId:cid,_c:1,read:!!ov.read[x.id]})));
  const p=l.prefs||{};if('showPhotos' in p)c.showPhotos=!!p.showPhotos;if('community' in p)c.community=!!p.community;
  const lc=(l.checks||[]).map(x=>x.date).sort().pop();if(lc)c.lastCheck=lc;
  const ob=l.onboard;if(ob&&ob.answers){c.answers=ob.answers;if(!c.goal)c.goal=ob.goal||'';if(!c.avail)c.avail=ob.avail||'';if(!c.limits)c.limits=ob.limits||'';c.ob=Object.assign({},c.ob,{q:true});}
  if(c.community)(l.posts||[]).forEach(x=>db.posts.push(Object.assign({},x,{_c:1,cid:cid,liked:!!ov.liked[x.id]})));
  (l.likes||[]).forEach(id=>{(likes[id]=likes[id]||[]).push(cid);});
  db.challenges.forEach(ch=>{if((l.joins||[]).indexOf(ch.id)>=0)ch.joined.push(cid);if((l.anon||[]).indexOf(ch.id)>=0)ch.anon.push(cid);});
 });
 db.posts.forEach(x=>{x.by=likes[x.id]||[];x.likes=x.by.length+(x.liked?1:0);});
 db.posts.sort((a,b)=>(b.date||'')<(a.date||'')?-1:(b.date||'')>(a.date||'')?1:0);
 db.requests.filter(r=>r._c).forEach(r=>{if(!db.appts.some(a=>a.reqId===r.id))db.appts.push(reqAppt(r));});
 db.history.sort(byDate);db.checks.sort((a,b)=>-byDate(a,b));db.inbox.sort(byDate);
 return db;
}
function decomposeCoach(){
 const db=api.S.db,ov={kudos:{},req:{},read:{},liked:{}};
 db.history.forEach(h=>{if(h._c&&h.kudos)ov.kudos[h.id]=1;});
 db.requests.forEach(r=>{if(r._c&&r.status&&r.status!=='attesa')ov.req[r.id]=r.status;});
 db.inbox.forEach(m=>{if(m._c&&m.read)ov.read[m.id]=1;});
 db.posts.forEach(p=>{if(p._c&&p.liked)ov.liked[p.id]=1;});
 const own=a=>(a||[]).filter(x=>!x._c);
 const coach=Object.assign({},db,{history:own(db.history),checks:own(db.checks),requests:own(db.requests),inbox:own(db.inbox),
  posts:own(db.posts).map(p=>strip(p,['by'])),challenges:db.challenges.map(ch=>Object.assign({},ch,{joined:[],anon:[]})),_ov:ov});
 const spaces={};const byId={};db.clients.forEach(c=>{byId[c.id]=c;});
 Object.keys(M.index).forEach(cid=>{const c=byId[cid];if(c)spaces[cid]=clientSpace(c);});
 const pub={
  videos:db.videos||{},customEx:db.customEx||[],exEdits:db.exEdits||{},
  challenges:db.challenges.map(ch=>({id:ch.id,kind:ch.kind,title:ch.title,goal:ch.goal,target:ch.target,metric:ch.metric,start:ch.start,end:ch.end,prize:ch.prize,
   board:api.chBoard(ch).map(x=>{const an=ch.anon.indexOf(x.c.id)>=0;return {id:x.c.id,name:an?'Anonimo':String(x.c.name).split(' ')[0],ini:an?'?':x.c.ini,v:x.v,anon:an};})})),
  posts:db.posts.slice(0,80).map(p=>({id:p.id,who:p.who,ini:p.ini,when:p.when,date:p.date||null,text:p.text,stat:p.stat,by:p.by||[],cl:!!p.liked}))
 };
 return {coach:coach,spaces:spaces,pub:pub};
}
function nowStr(){const d=new Date();return d.toISOString().slice(0,10)+' '+String(d.getHours()).padStart(2,'0')+':'+String(d.getMinutes()).padStart(2,'0');}
function clientSpace(c){
 const db=api.S.db,cid=c.id,pick={};SAFE.forEach(k=>{if(k in c)pick[k]=c[k];});
 const req={};db.requests.forEach(r=>{if(r.clientId===cid&&r._c&&r.status!=='attesa')req[r.id]=r.status;});
 return {client:pick,
  contracts:db.contracts.filter(k=>k.clientId===cid),
  programs:db.programs.filter(p=>p.clientId===cid),
  appts:db.appts.filter(a=>a.clientId===cid).map(a=>({id:a.id,date:a.date,time:a.time,dur:a.dur,type:a.type,status:a.status,clientId:cid,reqId:a.reqId||null})),
  measures:db.measures.filter(m=>m.clientId===cid),
  coachMsg:(db.coachMsg||{})[cid]||null,
  kudos:db.history.filter(h=>h.clientId===cid&&h.kudos).map(h=>h.id),
  req:req,
  msgs:db.scheduled.filter(x=>(x.to===cid||x.to==='tutti')&&x.when&&x.when<=nowStr()).slice(-20).map(x=>({id:x.id,when:x.when,text:x.text}))
 };
}

/* ---------- CLIENTE ---------- */
async function loadClient(cached){
 const ix=await sb.from('clients_index').select('id,coach_id,full_name,email').eq('user_id',user.id).maybeSingle();
 if(ix.error)throw ix.error;if(!ix.data)throw new Error('noclient');
 M.cid=ix.data.id;M.coach=ix.data.coach_id;M.ix=ix.data;
 const [sp,lg,pb]=await Promise.all([
  sb.from('client_space').select('data').eq('client_id',M.cid).maybeSingle(),
  sb.from('client_log').select('data,updated_at').eq('client_id',M.cid).maybeSingle(),
  sb.from('coach_public').select('data').eq('coach_id',M.coach).maybeSingle()]);
 [sp,lg,pb].forEach(r=>{if(r.error)throw r.error;});
 M.sp=sp.data&&sp.data.data||{};M.pub=pb.data&&pb.data.data||{};M.ver=lg.data?lg.data.updated_at:null;
 let log=lg.data&&lg.data.data||{};
 if(cached&&cached.pending&&cached.M&&cached.M.cid===M.cid){
  // allenamenti registrati senza rete: si uniscono a quelli sul server, niente va perso
  api.setDb(cached.db);log=mergeLog(log,decomposeClient());M.pending=true;
 }
 api.setDb(composeClient(M.ix,M.sp,log,M.pub));
 M.sent.log=M.pending?null:JSON.stringify(decomposeClient());
 M.loadedAt=Date.now();cache();
}
function composeClient(ix,sp,l,pub){
 const cid=ix.id,db=api.emptyDb();db.autos=[];
 const c=api.clientDefaults(Object.assign({id:cid,name:ix.full_name||ix.email.split('@')[0],email:ix.email},sp.client||{}));
 c.ini=c.ini||initials(c.name);
 const p=l.prefs||{};if('showPhotos' in p)c.showPhotos=!!p.showPhotos;if('community' in p)c.community=!!p.community;
 if(l.onboard&&l.onboard.answers){c.answers=l.onboard.answers;c._onboard=l.onboard;}
 db.clients=[c];
 db.contracts=sp.contracts||[];db.programs=sp.programs||[];db.measures=sp.measures||[];
 const msgs=(sp.msgs||[]).slice().sort((a,b)=>a.when<b.when?-1:1);const lastMsg=msgs[msgs.length-1];
 if(lastMsg&&lastMsg.when.slice(0,10)>=new Date(Date.now()-3*864e5).toISOString().slice(0,10))db.coachMsg[cid]=lastMsg.text;else if(sp.coachMsg)db.coachMsg[cid]=sp.coachMsg;
 const kud=sp.kudos||[],seen=l.seenKudos||[];
 db.history=(l.history||[]).map(h=>Object.assign({},h,{clientId:cid,kudos:kud.indexOf(h.id)>=0,kudosSeen:seen.indexOf(h.id)>=0})).sort(byDate);
 db.checks=(l.checks||[]).map(x=>Object.assign({},x,{clientId:cid})).sort((a,b)=>-byDate(a,b));
 const lc=db.checks[0];if(lc)c.lastCheck=lc.date;
 const rs=sp.req||{};
 db.requests=(l.requests||[]).map(r=>Object.assign({},r,{clientId:cid,status:rs[r.id]||'attesa'}));
 db.appts=(sp.appts||[]).slice();db.requests.forEach(r=>{if(!db.appts.some(a=>a.reqId===r.id))db.appts.push(reqAppt(r));});
 db.inbox=(l.msgs||[]).map(m=>Object.assign({},m,{clientId:cid}));
 const likes=l.likes||[];const own=(l.posts||[]).map(x=>Object.assign({},x,{_own:1}));
 db.posts=own.concat((pub.posts||[]).filter(x=>!own.some(o=>o.id===x.id)).map(x=>Object.assign({},x,{_pub:1})));
 db.posts.forEach(x=>{x.liked=likes.indexOf(x.id)>=0;x.likes=(x.by||[]).filter(i=>i!==cid).length+(x.cl?1:0)+(x.liked?1:0);});
 db.seenBadges=l.seenBadges||{};db.videos=pub.videos||{};db.customEx=pub.customEx||[];db.exEdits=pub.exEdits||{};
 db.challenges=(pub.challenges||[]).map(ch=>{const j=(l.joins||[]).indexOf(ch.id)>=0,an=(l.anon||[]).indexOf(ch.id)>=0;
  return Object.assign({},ch,{base:{},joined:j?[cid]:[],anon:(ch.board||[]).filter(e=>e.anon&&e.id!==cid).map(e=>e.id).concat(an?[cid]:[]),board:ch.board||[]});});
 return db;
}
function decomposeClient(){
 const db=api.S.db,cid=M.cid,c=db.clients.find(x=>x.id===cid)||{};
 return {
  history:db.history.filter(h=>h.clientId===cid).map(h=>strip(h,['clientId','kudos','kudosSeen','_c'])),
  seenKudos:db.history.filter(h=>h.clientId===cid&&h.kudosSeen).map(h=>h.id),
  checks:db.checks.filter(x=>x.clientId===cid).map(x=>Object.assign(strip(x,['clientId']),{id:x.id||('k'+x.date)})),
  requests:db.requests.filter(x=>x.clientId===cid).map(x=>Object.assign(strip(x,['clientId']),{status:'attesa'})),
  msgs:db.inbox.filter(m=>m.clientId===cid).map(m=>strip(m,['clientId','read'])),
  prefs:{showPhotos:!!c.showPhotos,community:!!c.community},
  joins:db.challenges.filter(ch=>ch.joined.indexOf(cid)>=0).map(ch=>ch.id),
  anon:db.challenges.filter(ch=>ch.anon.indexOf(cid)>=0).map(ch=>ch.id),
  posts:db.posts.filter(p=>!p._pub).map(p=>strip(p,['liked','likes','_own','by','cl','_pub'])),
  likes:db.posts.filter(p=>p.liked).map(p=>p.id),
  seenBadges:db.seenBadges||{},
  onboard:c._onboard||null
 };
}
/* unione di due diari: nessun allenamento, check o messaggio va perso */
function mergeLog(a,b){
 a=a||{};b=b||{};
 const u=(x,y,key)=>{const m=new Map();(x||[]).forEach(i=>m.set(key(i),i));(y||[]).forEach(i=>m.set(key(i),i));return Array.from(m.values());};
 const id=i=>i.id,ck=i=>i.id||('k'+i.date);
 const set=(x,y)=>Array.from(new Set([].concat(x||[],y||[])));
 return {history:u(a.history,b.history,id).sort(byDate),seenKudos:set(a.seenKudos,b.seenKudos),checks:u(a.checks,b.checks,ck),requests:u(a.requests,b.requests,id),
  msgs:u(a.msgs,b.msgs,id),prefs:Object.assign({},a.prefs,b.prefs),onboard:b.onboard||a.onboard||null,joins:b.joins||a.joins||[],anon:b.anon||a.anon||[],posts:u(a.posts,b.posts,id),
  likes:b.likes||a.likes||[],seenBadges:Object.assign({},a.seenBadges,b.seenBadges)};
}

/* ---------- salvataggio ---------- */
let tPush=null,pushing=false,again=false;
function changed(){if(!role)return;M.pending=true;cache();schedulePush();}
function schedulePush(){clearTimeout(tPush);tPush=setTimeout(push,900);}
async function push(){
 if(!role||!sb)return;if(pushing){again=true;return;}pushing=true;setStatus('saving');
 try{if(role==='coach')await pushCoach();else await pushClient();M.pending=false;cache();setStatus('ok');M.warned=false;}
 catch(e){M.pending=true;cache();setStatus('offline');if(!M.warned){M.warned=true;api.toast('Sei offline: salvo appena torna la connessione');}}
 pushing=false;if(again){again=false;push();}
}
function chk(r){if(r.error)throw r.error;return r;}
async function pushCoach(){
 const d=decomposeCoach(),uid=user.id,now=new Date().toISOString();
 const cs=JSON.stringify(d.coach);
 if(cs!==M.sent.coach){
  if(M.ver){
   const r=chk(await sb.from('coach_space').update({data:d.coach,updated_at:now}).eq('coach_id',uid).eq('updated_at',M.ver).select('updated_at'));
   if(!r.data||!r.data.length){await coachConflict();return;}
   M.ver=r.data[0].updated_at;
  }else{
   const r=await sb.from('coach_space').insert({coach_id:uid,data:d.coach}).select('updated_at').single();
   if(r.error){if(r.error.code==='23505'){await coachConflict();return;}throw r.error;}
   M.ver=r.data.updated_at;
  }
  M.sent.coach=cs;
 }
 for(const cid of Object.keys(d.spaces)){
  const s=JSON.stringify(d.spaces[cid]);if(s===M.sent['s:'+cid])continue;
  chk(await sb.from('client_space').upsert({client_id:cid,coach_id:uid,data:d.spaces[cid],updated_at:now}));M.sent['s:'+cid]=s;
 }
 const ps=JSON.stringify(d.pub);
 if(ps!==M.sent.pub){chk(await sb.from('coach_public').upsert({coach_id:uid,data:d.pub,updated_at:now}));M.sent.pub=ps;}
}
async function coachConflict(){
 await loadCoach(null);api.rerender();
 api.toast('L\'app era aperta anche su un altro dispositivo: ho caricato i dati più recenti. Ripeti l\'ultima modifica.');
}
async function pushClient(){
 let l=decomposeClient();const now=new Date().toISOString();
 const s=JSON.stringify(l);if(s===M.sent.log)return;
 for(let tries=0;tries<3;tries++){
  if(M.ver){
   const r=chk(await sb.from('client_log').update({data:l,updated_at:now}).eq('client_id',M.cid).eq('updated_at',M.ver).select('updated_at'));
   if(r.data&&r.data.length){M.ver=r.data[0].updated_at;break;}
  }else{
   const r=await sb.from('client_log').insert({client_id:M.cid,coach_id:M.coach,data:l}).select('updated_at').single();
   if(!r.error){M.ver=r.data.updated_at;break;}
   if(r.error.code!=='23505')throw r.error;
  }
  // un altro dispositivo ha scritto nel frattempo: unisco e riprovo
  const rem=chk(await sb.from('client_log').select('data,updated_at').eq('client_id',M.cid).maybeSingle());
  l=mergeLog(rem.data&&rem.data.data,l);M.ver=rem.data?rem.data.updated_at:null;
  const ui=api.S.ui.wk;api.setDb(composeClient(M.ix,M.sp,l,M.pub));api.S.ui.wk=ui;api.rerender();
 }
 M.sent.log=JSON.stringify(decomposeClient());
}

/* ---------- aggiornamento quando si torna sull'app ---------- */
document.addEventListener('visibilitychange',async()=>{
 if(document.visibilityState!=='visible'||!role||!sb||pushing||M.pending)return;
 if(Date.now()-(M.loadedAt||0)<60000)return;
 const ui=api.S.ui;if(ui.sheet||ui.wk||ui.editProg||ui.party)return;
 try{if(role==='coach')await loadCoach(null);else await loadClient(null);api.rerender();}catch(e){}
});
window.addEventListener('online',()=>{if(M.pending)push();});

let stEl=null;
function setStatus(s){document.body.dataset.sync=s;if(!stEl)stEl=document.getElementById('sync');if(stEl){stEl.textContent=s==='offline'?'Offline':s==='saving'?'Salvo…':'';stEl.hidden=s==='ok';}}

/* ---------- funzioni usate dall'app ---------- */
async function logout(force){
 if(M.pending&&!force){api.toast('Ci sono modifiche non ancora salvate: collegati a internet prima di uscire.');push();return false;}
 try{if(user)localStorage.removeItem(CK(user.id));}catch(e){}
 stopLive();try{await disablePushHere(true);}catch(e){}
 role=null;M=newMeta();
 try{await sb.auth.signOut();}catch(e){}
 try{localStorage.removeItem('aelis-auth');}catch(e){}
 api.reset();show('login');return true;
}
function inviteLink(r){return base()+'?invito='+encodeURIComponent(r.invite_token)+'&email='+encodeURIComponent(r.email);}
function inviteInfo(cid){
 const r=M.index[cid];if(!r)return null;
 const live=!r.user_id&&r.invite_token&&new Date(r.invite_expires)>new Date();
 return {linked:!!r.user_id,link:live?inviteLink(r):null,expired:!r.user_id&&!live,expires:r.invite_expires};
}
async function invite(o){
 const email=String(o.email||'').trim().toLowerCase();
 if(!okMail(email))throw new Error('Email non valida.');
 const id='c'+rand(8);
 const r=await sb.from('clients_index').insert({id:id,coach_id:user.id,email:email,full_name:o.name}).select('id,email,full_name,user_id,invite_token,invite_expires').single();
 if(r.error){if(r.error.code==='23505')throw new Error('C\'è già un cliente con questa email.');throw new Error(human(r.error));}
 M.index[id]=r.data;cache();
 return {id:id,link:inviteLink(r.data)};
}
async function reinvite(cid){
 const exp=new Date(Date.now()+14*864e5).toISOString();
 const r=await sb.from('clients_index').update({invite_token:rand(16),invite_expires:exp}).eq('id',cid).is('user_id',null).select('id,email,full_name,user_id,invite_token,invite_expires').maybeSingle();
 if(r.error)throw new Error(human(r.error));if(!r.data)throw new Error('Questo cliente ha già creato l\'account.');
 M.index[cid]=r.data;cache();return inviteLink(r.data);
}
async function linkExisting(c){
 // cliente già presente in app (per esempio da un contatto): crea solo la riga d'invito
 const email=String(c.email||'').trim().toLowerCase();if(!okMail(email))throw new Error('Aggiungi prima un\'email valida al cliente.');
 const r=await sb.from('clients_index').insert({id:c.id,coach_id:user.id,email:email,full_name:c.name}).select('id,email,full_name,user_id,invite_token,invite_expires').single();
 if(r.error){if(r.error.code==='23505')throw new Error('C\'è già un cliente con questa email.');throw new Error(human(r.error));}
 M.index[c.id]=r.data;cache();schedulePush();return inviteLink(r.data);
}
async function removeClient(cid){
 if(M.index[cid]){const r=await sb.from('clients_index').delete().eq('id',cid);if(r.error)throw new Error(human(r.error));}
 delete M.index[cid];delete M.sent['s:'+cid];cache();return true;
}
function changePassword(){show('newpass',{cancel:true});}

/* ===================== CHAT (tempo reale) ===================== */
let chan=null;
const chatAll=[];   // messaggi caricati: {id,client_id,coach_id,sender,body,created_at,read_at}
function chatMerge(list){list.forEach(m=>{const i=chatAll.findIndex(x=>x.id===m.id);if(i>=0)chatAll[i]=m;else chatAll.push(m);});chatAll.sort((a,b)=>a.created_at<b.created_at?-1:1);}
async function chatRefresh(){
 if(!sb||!role)return;
 const r=await sb.from('messages').select('id,client_id,coach_id,sender,body,created_at,read_at').order('created_at',{ascending:false}).limit(600);
 if(!r.error){chatAll.length=0;chatMerge(r.data||[]);api.chatChanged&&api.chatChanged();}
}
function startLive(){
 chatRefresh();
 try{
  stopLive();
  chan=sb.channel('aelis-chat').on('postgres_changes',{event:'*',schema:'public',table:'messages'},p=>{
   if(p.new&&p.new.id){chatMerge([p.new]);api.chatChanged&&api.chatChanged(p.eventType==='INSERT'?p.new:null);}
  }).subscribe();
 }catch(e){}
 refreshPush();
}
function stopLive(){try{if(chan&&sb)sb.removeChannel(chan);}catch(e){}chan=null;chatAll.length=0;}
async function chatSend(cid,text){
 const body=String(text||'').trim();if(!body)return null;
 const row={client_id:role==='coach'?cid:M.cid,coach_id:role==='coach'?user.id:M.coach,sender:role,body:body.slice(0,2000)};
 const r=await sb.from('messages').insert(row).select('id,client_id,coach_id,sender,body,created_at,read_at').single();
 if(r.error)throw new Error(/Troppi/.test(r.error.message||'')?'Troppi messaggi: aspetta un attimo':human(r.error));
 chatMerge([r.data]);return r.data;
}
async function chatRead(cid){
 const other=role==='coach'?'client':'coach';const id=role==='coach'?cid:M.cid;
 const unread=chatAll.filter(m=>m.client_id===id&&m.sender===other&&!m.read_at);if(!unread.length)return;
 const now=new Date().toISOString();unread.forEach(m=>{m.read_at=now;});
 try{await sb.from('messages').update({read_at:now}).eq('client_id',id).eq('sender',other).is('read_at',null);}catch(e){}
}
function chatList(){return chatAll;}
function chatCanWrite(cid){if(role!=='coach')return true;return !!M.index[cid];}

/* ===================== NOTIFICHE ===================== */
const isIOS=()=>/iphone|ipad|ipod/i.test(navigator.userAgent)||(navigator.platform==='MacIntel'&&navigator.maxTouchPoints>1);
const standalone=()=>window.matchMedia&&matchMedia('(display-mode: standalone)').matches||navigator.standalone===true;
function b64u(s){const p='='.repeat((4-s.length%4)%4);const b=atob((s+p).replace(/-/g,'+').replace(/_/g,'/'));return Uint8Array.from(b,c=>c.charCodeAt(0));}
function pushState(){
 if(!('serviceWorker' in navigator)||!('PushManager' in window)||!('Notification' in window))return isIOS()&&!standalone()?'install':'unsupported';
 if(!CFG.vapidPublicKey)return 'unsupported';
 return Notification.permission==='granted'?(M.pushOn?'on':'granted'):Notification.permission==='denied'?'denied':'default';
}
async function swReg(){try{return await navigator.serviceWorker.getRegistration()||await navigator.serviceWorker.register('sw.js');}catch(e){return null;}}
async function currentSub(){try{const reg=await navigator.serviceWorker.getRegistration();return reg&&reg.pushManager?await reg.pushManager.getSubscription():null;}catch(e){return null;}}
async function saveSub(sub){const j=sub.toJSON();const r=await sb.rpc('save_push_sub',{p_endpoint:j.endpoint,p_p256dh:j.keys.p256dh,p_auth:j.keys.auth});if(r.error)throw r.error;M.pushOn=true;}
async function enablePush(){
 const st=pushState();if(st==='install'||st==='unsupported')return st;
 const perm=await Notification.requestPermission();if(perm!=='granted')return perm;
 const reg=await swReg();if(!reg)return 'unsupported';
 let sub=await reg.pushManager.getSubscription();
 if(!sub)sub=await reg.pushManager.subscribe({userVisibleOnly:true,applicationServerKey:b64u(CFG.vapidPublicKey)});
 await saveSub(sub);return 'on';
}
async function disablePushHere(silent){const sub=await currentSub();if(sub){try{await sb.rpc('delete_push_sub',{p_endpoint:sub.endpoint});}catch(e){}try{await sub.unsubscribe();}catch(e){}}M.pushOn=false;}
async function refreshPush(){try{if(pushState()==='granted'||pushState()==='on'){const sub=await currentSub();if(sub)await saveSub(sub);}}catch(e){}api.chatChanged&&api.chatChanged();}
async function notify(cid,title,body,url){
 if(!sb||!role)return;try{await sb.rpc('notify',{p_client_id:cid||'',p_title:String(title).slice(0,80),p_body:String(body).slice(0,240),p_url:url||null});}catch(e){}
}

/* ===================== CALENDARIO GOOGLE ===================== */
async function calendarLink(reset){
 const r=await sb.rpc('calendar_token',{p_reset:!!reset});if(r.error)throw new Error(human(r.error));
 return CFG.supabaseUrl.replace(/\/$/,'')+'/functions/v1/calendar?t='+r.data;
}

window.AelisCloud={real:REAL,chatSend:chatSend,chatRead:chatRead,chatList:chatList,chatRefresh:chatRefresh,chatCanWrite:chatCanWrite,
 pushState:pushState,enablePush:enablePush,disablePush:disablePushHere,notify:notify,calendarLink:calendarLink,isIOS:isIOS,standalone:standalone,start:start,changed:changed,logout:logout,invite:invite,reinvite:reinvite,inviteInfo:inviteInfo,linkExisting:linkExisting,removeClient:removeClient,changePassword:changePassword,
 _test:{composeCoach:composeCoach,decomposeCoach:decomposeCoach,composeClient:composeClient,decomposeClient:decomposeClient,mergeLog:mergeLog,pwProblem:pwProblem,push:push}};
})();
