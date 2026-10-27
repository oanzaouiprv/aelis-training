/* AELIS Training · app (generato separando lo script da index.html, per una Content Security Policy rigorosa) */
(function(){
'use strict';
const CFG=window.AELIS_CONFIG||{};const REAL=!!(CFG.supabaseUrl&&CFG.supabaseAnonKey)&&!/[?&]demo\b/.test(location.search);
const TODAY=REAL?(d=>d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0'))(new Date()):'2026-10-19';
const KEY='aelistraining-proto-v2';
const MESI=['gennaio','febbraio','marzo','aprile','maggio','giugno','luglio','agosto','settembre','ottobre','novembre','dicembre'];
const CM=TODAY.slice(0,7);const mAdd=(m,k)=>{const d=new Date(+m.slice(0,4),+m.slice(5,7)-1+k,1);return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0');};const PM=mAdd(CM,-1);const MN=MESI[+CM.slice(5)-1];
const GG=['domenica','lunedì','martedì','mercoledì','giovedì','venerdì','sabato'];
const GGS=['dom','lun','mar','mer','gio','ven','sab'];
const RM=matchMedia('(prefers-reduced-motion: reduce)').matches;
const esc=s=>String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const D=s=>{const p=s.split('-').map(Number);return new Date(p[0],p[1]-1,p[2]);};
const iso=d=>d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');
const addDays=(s,n)=>{const d=D(s);d.setDate(d.getDate()+n);return iso(d);};
const diff=(a,b)=>Math.round((D(b)-D(a))/864e5);
const fd=s=>{const d=D(s);return d.getDate()+' '+MESI[d.getMonth()].slice(0,3);};
const fl=s=>{const d=D(s);return GG[d.getDay()]+' '+d.getDate()+' '+MESI[d.getMonth()];};
const cap=s=>s.charAt(0).toUpperCase()+s.slice(1);
const eur=n=>Number(n).toLocaleString('it-IT',{style:'currency',currency:'EUR',minimumFractionDigits:0,maximumFractionDigits:2});
const nf=n=>Number(n).toLocaleString('it-IT');
const kgf=n=>(n===''||n==null)?'–':String(n).replace('.',',');
const hm=d=>String(d.getHours()).padStart(2,'0')+':'+String(d.getMinutes()).padStart(2,'0');
const mins=t=>{const p=t.split(':').map(Number);return p[0]*60+p[1];};
const dur=m=>{m=Math.max(0,Math.round(m));const h=Math.floor(m/60),r=m%60;return h?(h+' h'+(r?' '+r+' min':'')):r+' min';};
const uid=()=>Math.random().toString(36).slice(2,9);
const monday=s=>{const d=D(s);d.setDate(d.getDate()-((d.getDay()+6)%7));return iso(d);};
const pct=(a,b)=>b?Math.round(a/b*100):0;

const I={
out:'<path d="M15 4h3a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-3"/><path d="M10 17l-5-5 5-5"/><path d="M5 12h11"/>',
home:'<path d="M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"/>',
users:'<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20c.8-3.6 3.4-5.5 6.5-5.5s5.7 1.9 6.5 5.5"/><path d="M16 4.8a3.5 3.5 0 0 1 0 6.4M18 14.8c1.8.7 3 2.4 3.5 5.2"/>',
cal:'<rect x="3" y="4.5" width="18" height="16.5" rx="2.5"/><path d="M3 9.5h18M8 2.5v4M16 2.5v4"/>',
wallet:'<path d="M4 7.5h15a2 2 0 0 1 2 2V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h11"/><circle cx="16.5" cy="14.2" r="1.2"/>',
more:'<circle cx="5" cy="12" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="19" cy="12" r="1.5"/>',
dumbbell:'<path d="M6.5 6.5v11M17.5 6.5v11M3.5 9v6M20.5 9v6M6.5 12h11"/>',
chart:'<path d="M4 20V10M10 20V4M16 20v-7M21 20H3"/>',
pie:'<path d="M12 3a9 9 0 1 0 9 9h-9z"/><path d="M15 3.5A9 9 0 0 1 20.5 9H15z"/>',
check:'<path d="m5 12.5 4.5 4.5L19 7.5"/>',
play:'<path d="M8 5.5v13l11-6.5z"/>',
clock:'<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/>',
msg:'<path d="M4 5h16v11H9l-5 4z"/>',
bell:'<path d="M6 16v-5a6 6 0 0 1 12 0v5l1.5 2h-15zM10 20.5a2 2 0 0 0 4 0"/>',
plus:'<path d="M12 5v14M5 12h14"/>',
chev:'<path d="m9 5 7 7-7 7"/>',
back:'<path d="m15 5-7 7 7 7"/>',
spark:'<path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M6 18l2.5-2.5M15.5 8.5 18 6"/>',
heart:'<path d="M12 20s-7.5-4.6-7.5-10.2A4.3 4.3 0 0 1 12 7a4.3 4.3 0 0 1 7.5 2.8C19.5 15.4 12 20 12 20z"/>',
x:'<path d="M6 6l12 12M18 6 6 18"/>',
lock:'<rect x="5" y="10.5" width="14" height="10" rx="2"/><path d="M8 10.5V8a4 4 0 0 1 8 0v2.5"/>',
book:'<path d="M5 4h10a3 3 0 0 1 3 3v13H8a3 3 0 0 1-3-3z"/><path d="M5 17a3 3 0 0 1 3-3h10"/>',
link:'<path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"/>',
target:'<circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="4.5"/><circle cx="12" cy="12" r="1"/>',
send:'<path d="M4 12 20 4l-6 16-3-7z"/>',
info:'<circle cx="12" cy="12" r="8.5"/><path d="M12 11v5M12 8h.01"/>',
video:'<rect x="3" y="6" width="13" height="12" rx="2"/><path d="m16 10 5-3v10l-5-3"/>',
trophy:'<path d="M7 4h10v5a5 5 0 0 1-10 0zM7 6H4a3 3 0 0 0 3 4M17 6h3a3 3 0 0 1-3 4M12 14v4M8 21h8"/>',
user:'<circle cx="12" cy="8" r="4"/><path d="M4 21c1-4.2 4.2-6.5 8-6.5s7 2.3 8 6.5"/>',
pause:'<path d="M9 5v14M15 5v14"/>',
edit:'<path d="M4 20h4L19 9l-4-4L4 16z"/>',
flame:'<path d="M12 21c-4 0-6.5-2.7-6.5-6.2 0-3.3 2.4-5 3.6-7.8.4 1.9 1.4 3 2.6 3.6C11.6 7 13 4.5 15.6 3c-.3 3 1.1 4.6 2.3 6.4 1 1.5 1.6 3 1.6 4.8C19.5 18.3 16 21 12 21z"/>',
star:'<path d="m12 3.5 2.6 5.3 5.8.8-4.2 4.1 1 5.8L12 16.8l-5.2 2.7 1-5.8-4.2-4.1 5.8-.8z"/>',
bolt:'<path d="M13 2.5 5 13.5h6l-1 8 8-11h-6z"/>',
weight:'<path d="M5.5 20h13l-2-10h-9z"/><circle cx="12" cy="6.5" r="2.5"/>',
clap:'<path d="M7.5 12.5 5 10a1.5 1.5 0 0 1 2.1-2.1l3.4 3.4M9 9 7.6 7.6a1.5 1.5 0 0 1 2.1-2.1l4.6 4.6M11.2 7.2l-.3-.3a1.5 1.5 0 0 1 2.1-2.1l4.4 4.4c2.6 2.6 2.6 6.2 0 8.7s-6.1 2.6-8.7 0l-3.2-3.2a1.5 1.5 0 0 1 2.1-2.1l1 1"/><path d="M16 2.5 16.5 1M19.5 4 21 3M18.5 6.5l1.5.2"/>',
share:'<path d="M12 15V3M7 8l5-5 5 5M5 13v6a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-6"/>',
leaf:'<path d="M5 19c0-8 5-14 15-14 0 10-6 15-14 15M5 19l8-8"/>',
mic:'<rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5.5 11a6.5 6.5 0 0 0 13 0M12 17.5V21"/>',
alert:'<path d="M12 3 2.5 20h19z"/><path d="M12 10v4.5M12 17.5v.01"/>',
swap:'<path d="M4 8h13l-3.5-3.5M20 16H7l3.5 3.5"/>',
gift:'<rect x="3.5" y="9" width="17" height="11" rx="1.5"/><path d="M12 9v11M3.5 13h17M12 9C9 9 7 7.8 7 6.3S8.3 4 9.6 4.6C11 5.3 12 9 12 9zm0 0c3 0 5-1.2 5-2.7S15.7 4 14.4 4.6C13 5.3 12 9 12 9z"/>'
};
const ic=(n,s)=>'<svg class="ic" width="'+(s||20)+'" height="'+(s||20)+'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+I[n]+'</svg>';
const chev=()=>'<span class="chev">'+ic('chev',18)+'</span>';
const ph=p=>'<span class="chip ph">'+p+'</span>';

/* ---------- provenienza ---------- */
const SRC={Social:{l:'Social',v:'--s-social',d:['Instagram','TikTok','Facebook','Sito web']},Sala:{l:'Sala',v:'--s-sala',d:['Incontro in sala','Lezione di prova','Corso di gruppo','Reception']},Esterno:{l:'Esterno',v:'--s-ext',d:['Passaparola','Amico di un cliente','Collaborazione','Altro']}};
const SRCK=['Social','Sala','Esterno'];
const srcDot=s=>s?'<span class="srcdot" style="background:var('+SRC[s].v+')" title="'+s+'"></span>':'';
const srcChip=s=>s?'<span class="chip"><span class="sw" style="background:var('+SRC[s].v+');border-radius:50%"></span>'+s+'</span>':'<span class="chip warn">Provenienza mancante</span>';

/* ---------- esercizi ---------- */
const MUSCLES={petto:'Petto',spalle:'Spalle',bicipiti:'Bicipiti',tricipiti:'Tricipiti',dorsali:'Dorsali',addome:'Addome',lombari:'Lombari',glutei:'Glutei',quadricipiti:'Quadricipiti',femorali:'Femorali',polpacci:'Polpacci',trapezi:'Trapezi'};
const EX=[
 {id:'hip',name:'Hip thrust al macchinario',mode:'Esterno',pri:['glutei'],sec:['femorali'],note:'Solleva il bacino senza perdere la curva lombare. Mento verso il petto, un secondo di pausa in alto.'},
 {id:'bulg',name:'Affondo bulgaro su panca',mode:'Esterno',pri:['glutei','quadricipiti'],sec:['femorali'],note:'Per spostare il lavoro sul gluteo, in discesa porta il busto leggermente avanti.'},
 {id:'latm',name:'Lat machine presa larga',mode:'Esterno',pri:['dorsali'],sec:['bicipiti'],note:'Petto alto, porta la barra verso lo sterno e controlla la risalita.'},
 {id:'pull',name:'Pulley basso',mode:'Esterno',pri:['dorsali'],sec:['bicipiti','lombari','trapezi'],note:'Schiena neutra, tira con i gomiti vicino al corpo.'},
 {id:'curl',name:'Curl manubri su panca 45°',mode:'Esterno',pri:['bicipiti'],sec:[],note:'Extraruota i polsi anche arrivando in alto.'},
 {id:'legp',name:'Leg press orizzontale',mode:'Esterno',pri:['quadricipiti'],sec:['glutei'],note:'Scegli il carico prima di iniziare. Non bloccare le ginocchia in spinta.'},
 {id:'legx',name:'Leg extension',mode:'Esterno',pri:['quadricipiti'],sec:[],note:'Due serie pesanti e una di ripetizioni, controlla la discesa.'},
 {id:'lento',name:'Lento avanti manubri',mode:'Esterno',pri:['spalle'],sec:['tricipiti'],note:'Gomiti mai troppo larghi, addome attivo.'},
 {id:'chest',name:'Chest press',mode:'Esterno',pri:['petto'],sec:['tricipiti','spalle'],note:'Scapole addotte, spingi senza staccare la schiena.'},
 {id:'push',name:'Pushdown alla corda',mode:'Esterno',pri:['tricipiti'],sec:[],note:'Gomiti fermi ai fianchi, apri la corda in basso.'},
 {id:'traz',name:'Trazioni assistite con elastico',mode:'Assistito',pri:['dorsali'],sec:['bicipiti'],note:'Tutte le ripetizioni che riesci con buona tecnica. Segna i kg di assistenza.'},
 {id:'legc',name:'Leg curl',mode:'Esterno',pri:['femorali'],sec:['polpacci'],note:'Bacino ben appoggiato, risalita lenta.'},
 {id:'step',name:'Step up su panca',mode:'Esterno',pri:['quadricipiti','glutei'],sec:[],note:'Spingi con la gamba in alto, non con quella a terra.'},
 {id:'hyper',name:'Hyperextension',mode:'Corpo libero',pri:['lombari','glutei'],sec:['femorali'],note:'Movimento controllato, non andare oltre la linea del corpo.'},
 {id:'alz',name:'Alzate laterali',mode:'Esterno',pri:['spalle'],sec:['trapezi'],note:'Prima serie con il carico massimo per 6 ripetizioni, poi scala.'},
 {id:'pushup',name:'Push up',mode:'Corpo libero',pri:['petto','tricipiti'],sec:['spalle','addome'],note:'Corpo in linea, scendi fino a sfiorare il pavimento.'},
 {id:'plank',name:'Plank',mode:'Tempo',pri:['addome'],sec:['spalle'],note:'Glutei attivi, non far cedere il bacino.'}
];
const MODES=[['Esterno','Con pesi o macchina'],['Corpo libero','A corpo libero'],['Assistito','Assistito (elastico o macchina)'],['Tempo','A tempo (es. plank)']];
// esercizi della libreria: quelli di base, con le modifiche della coach, più quelli creati da lei
function allEx(){const ed=(S.db&&S.db.exEdits)||{};return EX.map(e=>ed[e.id]?Object.assign({},e,ed[e.id],{id:e.id}):e).concat(((S.db&&S.db.customEx)||[]).filter(e=>!e.deleted));}
const exById=id=>allEx().find(e=>e.id===id)||((S.db&&S.db.customEx)||[]).find(e=>e.id===id)||{id:id,name:'Esercizio non più in libreria',mode:'Esterno',pri:[],sec:[],note:''};

/* ---------- dati di esempio ---------- */
function emptyDb(){return {v:2,clients:[],contracts:[],programs:[],history:[],appts:[],leads:[],inbox:[],checks:[],measures:[],shifts:[],shift:null,weekly:[],requests:[],scheduled:[],coachMsg:{},posts:[],invites:[],seenBadges:{},autos:defAutos().map(a=>Object.assign(a,{log:[]})),challenges:[],videos:{},customEx:[],exEdits:{}};}
function inits(n){return String(n||'?').trim().split(/\s+/).slice(0,2).map(x=>x[0]||'').join('').toUpperCase()||'?';}
function clientDefaults(o){const c=Object.assign({age:'',email:'',goal:'',level:'Principiante',status:'attivo',since:TODAY,ob:{q:false,foto:false,scheda:false},avail:'',limits:'',notes:'',lastCheck:null,checkEvery:7,program:null,contract:null,showPhotos:true,community:false,answers:[],src:null,srcD:''},o);if(!c.ini)c.ini=inits(c.name);return c;}
function pWhen(p){if(!p.date)return p.when||'';const d=diff(p.date,TODAY);return d<=0?'oggi':d===1?'ieri':d+' giorni fa';}
function seed(){
 const program={id:'p1',clientId:'c1',version:2,assigned:'2026-10-12',sessions:[
  {key:'A',name:'Gambe e glutei',items:[{ex:'hip',sets:4,rmin:8,rmax:10,rest:120,rir:2,alt:[]},{ex:'bulg',sets:3,rmin:8,rmax:10,rest:120,rir:2,alt:['step','legp']},{ex:'latm',sets:3,rmin:8,rmax:10,rest:90,rir:2,alt:['traz']},{ex:'pull',sets:3,rmin:10,rmax:12,rest:90,rir:2,alt:[]},{ex:'curl',sets:3,rmin:10,rmax:12,rest:60,rir:1,alt:[]}]},
  {key:'B',name:'Spinta e quadricipiti',items:[{ex:'legp',sets:3,rmin:10,rmax:12,rest:120,rir:2,alt:[]},{ex:'legx',sets:3,rmin:10,rmax:12,rest:90,rir:1,alt:[]},{ex:'lento',sets:3,rmin:8,rmax:10,rest:90,rir:2,alt:[]},{ex:'chest',sets:3,rmin:10,rmax:12,rest:90,rir:2,alt:['pushup']},{ex:'push',sets:3,rmin:10,rmax:12,rest:60,rir:1,alt:[]}]},
  {key:'C',name:'Tirata e femorali',items:[{ex:'traz',sets:3,rmin:5,rmax:8,rest:90,rir:1,alt:['latm']},{ex:'legc',sets:3,rmin:10,rmax:12,rest:90,rir:2,alt:[]},{ex:'step',sets:3,rmin:10,rmax:12,rest:90,rir:2,alt:['bulg']},{ex:'hyper',sets:3,rmin:12,rmax:15,rest:60,rir:2,alt:[]},{ex:'alz',sets:3,rmin:10,rmax:12,rest:60,rir:1,alt:[]}]}
 ]};
 const base={hip:40,bulg:6,latm:25,pull:25,curl:5,legp:60,legx:20,lento:5,chest:15,push:12.5,traz:25,legc:17.5,step:4,hyper:0,alz:3};
 const inc={hip:2.5,bulg:.5,latm:1.25,pull:1.25,curl:.25,legp:5,legx:1.25,lento:.5,chest:1.25,push:.75,traz:-1.25,legc:1.25,step:.5,hyper:0,alz:.25};
 const dates={A:['2026-09-15','2026-09-22','2026-09-29','2026-10-06','2026-10-13'],B:['2026-09-17','2026-09-24','2026-10-01','2026-10-08','2026-10-15'],C:['2026-09-19','2026-09-26','2026-10-03','2026-10-10','2026-10-17']};
 const history=[];
 ['A','B','C'].forEach(k=>{const ses=program.sessions.find(s=>s.key===k);dates[k].forEach((dt,i)=>{
   const sets={};ses.items.forEach(it=>{const kg=Math.round((base[it.ex]+inc[it.ex]*i)*2)/2;const arr=[];
     for(let j=0;j<it.sets;j++){let reps=it.rmax-(j===it.sets-1&&i%2===0?1:0);if(it.ex==='traz')reps=5+Math.min(2,Math.floor(i/2))-(j>0?1:0);arr.push({kg:it.ex==='hyper'?'':kg,reps:reps,rir:it.rir,done:true});}
     sets[it.ex]=arr;});
   history.push({id:uid(),clientId:'c1',date:dt,key:k,type:i%2===0?'coach':'autonomo',min:52+((i*7)%14),sets:sets,feel:null,kudos:i===4&&k==='B'});
 });});
 history.sort((a,b)=>a.date<b.date?-1:1);
 // un paio di allenamenti di altri clienti per il feed
 history.push({id:uid(),clientId:'c5',date:'2026-10-18',key:'A',type:'autonomo',min:64,sets:{legp:[{kg:140,reps:8,done:true},{kg:140,reps:8,done:true},{kg:150,reps:6,done:true}],chest:[{kg:60,reps:8,done:true},{kg:60,reps:8,done:true},{kg:60,reps:7,done:true}],latm:[{kg:65,reps:10,done:true},{kg:65,reps:9,done:true}]},feel:5,kudos:false,pr:'Leg press 150 kg'});
 history.push({id:uid(),clientId:'c3',date:'2026-10-18',key:'B',type:'autonomo',min:41,sets:{lento:[{kg:6,reps:10,done:true},{kg:6,reps:10,done:true},{kg:6,reps:9,done:true}],alz:[{kg:4,reps:12,done:true},{kg:4,reps:12,done:true},{kg:4,reps:11,done:true}],push:[{kg:15,reps:12,done:true},{kg:15,reps:12,done:true}]},feel:4,kudos:false});
 history.sort((a,b)=>a.date<b.date?-1:1);

 const ins=arr=>arr.map((x,i)=>({n:i+1,due:x[0],amount:x[1],paid:x[2]||0,paidOn:x[3]||null,method:x[4]||null}));
 const contracts=[
  {id:'k1',clientId:'c1',name:'Percorso 3 mesi · 2 lezioni PT a settimana',start:'2026-09-14',end:'2026-12-14',price:840,status:'attivo',lessons:true,inst:ins([['2026-09-14',280,280,'2026-09-14','Bonifico'],['2026-10-14',280,280,'2026-10-13','Contanti'],['2026-11-14',280]]),
   mov:[{date:'2026-09-14',type:'pagata',delta:24,reason:'Acquisto percorso',by:'Coach'},{date:'2026-09-14',type:'omaggio',delta:2,reason:'Lezioni omaggio di benvenuto',by:'Coach'},{date:'2026-09-15',type:'omaggio',delta:-1,reason:'Lezione svolta 15 set',by:'Sistema'},{date:'2026-09-19',type:'omaggio',delta:-1,reason:'Lezione svolta 19 set',by:'Sistema'},{date:'2026-10-17',type:'pagata',delta:-7,reason:'Lezioni svolte dal 22 set al 17 ott',by:'Sistema'}],adj:[]},
  {id:'k2',clientId:'c2',name:'Pacchetto 8 lezioni',start:'2026-10-12',end:'2026-12-12',price:200,status:'attivo',lessons:true,inst:ins([['2026-10-12',25,25,'2026-10-12','Contanti'],['2026-10-19',25],['2026-10-26',25],['2026-11-02',25],['2026-11-09',25],['2026-11-16',25],['2026-11-23',25],['2026-11-30',25]]),
   mov:[{date:'2026-10-12',type:'pagata',delta:8,reason:'Acquisto pacchetto',by:'Coach'},{date:'2026-10-15',type:'pagata',delta:-1,reason:'Lezione svolta 15 ott',by:'Sistema'}],adj:[]},
  {id:'k3',clientId:'c3',name:'Scheda online 8 settimane',start:'2026-10-05',end:'2026-11-30',price:80,status:'attivo',lessons:false,inst:ins([['2026-10-05',80,80,'2026-10-05','Bonifico']]),mov:[],adj:[]},
  {id:'k4',clientId:'c4',name:'Pacchetto 12 lezioni',start:'2026-10-06',end:'2027-01-06',price:400,status:'attivo',lessons:true,inst:ins([['2026-10-06',200,200,'2026-10-06','POS'],['2026-10-31',200]]),
   mov:[{date:'2026-10-06',type:'pagata',delta:12,reason:'Acquisto pacchetto',by:'Coach'},{date:'2026-10-06',type:'omaggio',delta:1,reason:'Lezione omaggio',by:'Coach'},{date:'2026-10-08',type:'omaggio',delta:-1,reason:'Lezione svolta 8 ott',by:'Sistema'},{date:'2026-10-15',type:'pagata',delta:-2,reason:'Lezioni svolte 13 e 15 ott',by:'Sistema'}],adj:[]},
  {id:'k5',clientId:'c5',name:'Percorso 6 mesi · 2 lezioni PT a settimana',start:'2026-09-01',end:'2027-03-01',price:1500,status:'attivo',lessons:true,inst:ins([['2026-09-01',250,250,'2026-09-01','Bonifico'],['2026-10-01',250],['2026-11-01',250],['2026-12-01',250],['2027-01-01',250],['2027-02-01',250]]),
   mov:[{date:'2026-09-01',type:'pagata',delta:48,reason:'Acquisto percorso',by:'Coach'},{date:'2026-10-17',type:'pagata',delta:-13,reason:'Lezioni svolte dal 2 set al 17 ott',by:'Sistema'}],adj:[]},
  {id:'k6',clientId:'c6',name:'Percorso 3 mesi · 1 lezione PT a settimana',start:'2026-08-25',end:'2026-11-25',price:450,status:'sospeso',suspendedOn:'2026-10-06',lessons:true,inst:ins([['2026-08-25',150,150,'2026-08-25','Bonifico'],['2026-09-25',150,150,'2026-09-25','Bonifico'],['2026-10-25',150]]),
   mov:[{date:'2026-08-25',type:'pagata',delta:12,reason:'Acquisto percorso',by:'Coach'},{date:'2026-10-01',type:'pagata',delta:-6,reason:'Lezioni svolte fino al 1 ott',by:'Sistema'}],adj:[{date:'2026-10-06',old:'2026-11-25',neu:null,reason:'Sospeso su richiesta della cliente, ripresa da concordare'}]},
  {id:'k7',clientId:'c7',name:'Scheda online 8 settimane',start:'2026-09-08',end:'2026-11-03',price:80,status:'attivo',lessons:false,inst:ins([['2026-09-08',80,80,'2026-09-08','Satispay']]),mov:[],adj:[]},
  {id:'k8',clientId:'c8',name:'Pacchetto 8 lezioni',start:'2026-10-14',end:'2026-12-14',price:220,status:'attivo',lessons:true,inst:ins([['2026-10-14',110,110,'2026-10-14','POS'],['2026-11-14',110]]),mov:[{date:'2026-10-14',type:'pagata',delta:8,reason:'Acquisto pacchetto',by:'Coach'},{date:'2026-10-14',type:'omaggio',delta:1,reason:'Promo 8+1',by:'Coach'}],adj:[]}
 ];
 const C=(o)=>Object.assign({age:30,email:'',level:'Intermedio',status:'attivo',ob:{q:true,foto:true,scheda:true},avail:'',limits:'Nessuna',notes:'',lastCheck:null,checkEvery:7,program:null,showPhotos:true,community:false,answers:[],src:null,srcD:''},o);
 const clients=[
  C({id:'c1',name:'Giulia Rossi',ini:'GR',age:29,email:'giulia.r@esempio.it',goal:'Tonificazione, forza di gambe e glutei',since:'2026-09-14',avail:'Lun · Mer · Ven, dalle 17',limits:'Nessuna limitazione dichiarata',notes:'Molto motivata, ama lavorare sui glutei. Prossimo obiettivo: hip thrust 4×10 con 55 kg.',lastCheck:'2026-10-13',contract:'k1',program:'p1',src:'Social',srcD:'Instagram',
   answers:[['Obiettivo principale','Tonificare e sentirmi più forte'],['Perché è importante','Voglio avere più energia nelle giornate di lavoro'],['Esperienza','Palestra da sola per un anno, mai con un trainer'],['Sedute sostenibili','3 a settimana, 60 minuti'],['Come preferisce essere seguita','Messaggi brevi e correzioni dirette']]}),
  C({id:'c2',name:'Luca Bianchi',ini:'LB',age:34,email:'luca.b@esempio.it',goal:'Ricomposizione corporea',level:'Principiante',since:'2026-10-12',ob:{q:true,foto:true,scheda:false},avail:'Mar · Gio mattina',limits:'Fastidio alla spalla destra nelle spinte sopra la testa',notes:'Partire con carichi leggeri sui movimenti sopra la testa.',contract:'k2',src:'Sala',srcD:'Incontro in sala',answers:[['Obiettivo principale','Perdere grasso e mettere un po\' di muscolo'],['Esperienza','Calcetto, mai pesi']]}),
  C({id:'c3',name:'Martina Verdi',ini:'MV',age:31,email:'martina.v@esempio.it',goal:'Preparazione per il matrimonio di giugno',since:'2026-10-05',avail:'Si allena da sola, sera',notes:'Scheda online, sente la coach solo in chat.',lastCheck:'2026-10-05',contract:'k3',showPhotos:false,community:true,src:'Social',srcD:'TikTok'}),
  C({id:'c4',name:'Elena Conti',ini:'EC',age:45,email:'elena.c@esempio.it',goal:'Postura e mobilità',level:'Principiante',since:'2026-10-06',ob:{q:true,foto:false,scheda:true},avail:'Lun · Gio mattina',limits:'Rigidità lombare al mattino',notes:'Preferisce lezioni presto. Foto e misure alla prossima lezione.',lastCheck:'2026-10-16',contract:'k4',src:'Esterno',srcD:'Passaparola'}),
  C({id:'c5',name:'Davide Neri',ini:'DN',age:38,email:'davide.n@esempio.it',goal:'Forza e dimagrimento',level:'Avanzato',since:'2026-09-01',avail:'Mer · Sab mattina, Lun sera',notes:'Paga sempre a fine mese, ricordarglielo con gentilezza.',lastCheck:'2026-10-12',contract:'k5',community:true,src:'Sala',srcD:'Corso di gruppo'}),
  C({id:'c6',name:'Sara Galli',ini:'SG',age:27,email:'sara.g@esempio.it',goal:'Tornare ad allenarsi con costanza',status:'sospeso',since:'2026-08-25',avail:'Da definire',limits:'Ripresa solo dopo il via libera del fisioterapista',notes:'Percorso sospeso dal 6 ottobre. Risentirla a fine mese.',lastCheck:'2026-10-01',checkEvery:14,contract:'k6',src:'Esterno',srcD:'Amico di un cliente'}),
  C({id:'c7',name:'Anna Ferri',ini:'AF',age:26,email:'anna.f@esempio.it',goal:'Prima esperienza in palestra',level:'Principiante',since:'2026-09-08',avail:'Si allena da sola',lastCheck:'2026-10-15',contract:'k7',src:'Social',srcD:'Instagram'}),
  C({id:'c8',name:'Matteo Costa',ini:'MC',age:41,email:'matteo.c@esempio.it',goal:'Mal di schiena da scrivania, più mobilità',level:'Principiante',since:'2026-10-14',ob:{q:true,foto:true,scheda:true},avail:'Mar · Ven pausa pranzo',lastCheck:null,contract:'k8',src:null,srcD:''})
 ];
 const A=(date,time,durm,type,extra)=>Object.assign({id:uid(),date:date,time:time,dur:durm,type:type,status:date<TODAY?'svolto':'previsto'},extra);
 const appts=[
  A('2026-10-13','17:00',60,'pt',{clientId:'c1'}),A('2026-10-14','08:00',60,'pt',{clientId:'c5'}),A('2026-10-14','13:00',45,'pt',{clientId:'c8'}),A('2026-10-15','09:00',45,'pt',{clientId:'c2'}),A('2026-10-15','17:00',60,'pt',{clientId:'c1'}),A('2026-10-16','17:00',60,'corso',{title:'Total Body'}),A('2026-10-16','18:00',60,'corso',{title:'Hybrid Blast'}),A('2026-10-17','10:00',60,'pt',{clientId:'c5'}),
  A('2026-10-19','08:00',60,'pt',{clientId:'c4'}),A('2026-10-19','12:00',30,'free',{title:'Chiara Moretti',leadId:'l1'}),A('2026-10-19','17:00',60,'pt',{clientId:'c1'}),A('2026-10-19','18:30',60,'pt',{clientId:'c5'}),
  A('2026-10-20','09:00',45,'pt',{clientId:'c2'}),A('2026-10-20','13:00',45,'pt',{clientId:'c8'}),A('2026-10-20','15:00',60,'personale',{title:'Allenamento personale'}),A('2026-10-20','18:00',30,'free',{title:'Paolo Rinaldi',leadId:'l2'}),
  A('2026-10-21','08:00',60,'pt',{clientId:'c5'}),A('2026-10-21','11:00',30,'consulenza',{title:'Call conoscitiva · Federica Lodi',leadId:'l3'}),A('2026-10-21','17:00',60,'pt',{clientId:'c1'}),
  A('2026-10-22','09:00',45,'pt',{clientId:'c2'}),A('2026-10-22','15:00',60,'pt',{clientId:'c4'}),A('2026-10-22','19:00',60,'personale',{title:'Corso di aggiornamento'}),
  A('2026-10-23','13:00',45,'pt',{clientId:'c8'}),A('2026-10-23','17:00',60,'corso',{title:'Total Body'}),A('2026-10-23','18:00',60,'corso',{title:'Hybrid Blast'}),A('2026-10-23','19:15',60,'pt',{clientId:'c1'}),
  A('2026-10-24','10:00',60,'pt',{clientId:'c5'}),A('2026-10-25','13:00',120,'personale',{title:'Pranzo in famiglia'}),
  A('2026-10-26','17:00',60,'pt',{clientId:'c1'}),A('2026-10-27','09:00',45,'pt',{clientId:'c2'}),A('2026-10-28','17:00',60,'pt',{clientId:'c1'})
 ];
 const leads=[
  {id:'l1',name:'Chiara Moretti',src:'Social',srcD:'Instagram',contacted:'2026-10-10',stage:'fissata',free:'2026-10-19 12:00',next:'Lezione di prova oggi',interest:'Pacchetto 8 lezioni'},
  {id:'l2',name:'Paolo Rinaldi',src:'Sala',srcD:'Incontro in sala',contacted:'2026-10-14',stage:'fissata',free:'2026-10-20 18:00',next:'Lezione di prova',interest:'Da capire'},
  {id:'l3',name:'Federica Lodi',src:'Social',srcD:'Instagram',contacted:'2026-10-16',stage:'fissata',free:'2026-10-21 11:00',next:'Call conoscitiva',interest:'Scheda online'},
  {id:'l4',name:'Marco Serra',src:'Sala',srcD:'Corso di gruppo',contacted:'2026-10-03',stage:'svolta',free:'2026-10-14 18:00',next:'Chiedere un feedback',interest:'Possibile 8+1 lezioni'},
  {id:'l5',name:'Irene Fabbri',src:'Esterno',srcD:'Passaparola',contacted:'2026-10-05',stage:'svolta',free:'2026-10-09 10:00',next:'Inviare la proposta',interest:'Scheda online'},
  {id:'l6',name:'Nadia Pace',src:'Social',srcD:'TikTok',contacted:'2026-10-12',stage:'contattare',free:null,next:'Nessuna risposta, richiamare',interest:''},
  {id:'l7',name:'Stefano Riva',src:'Sala',srcD:'Reception',contacted:'2026-10-17',stage:'contattare',free:null,next:'Chiamare',interest:''},
  {id:'l8',name:'Tommaso Gallo',src:'Sala',srcD:'Incontro in sala',contacted:'2026-10-01',stage:'perso',free:'2026-10-06 18:00',next:'Segue già un altro PT',interest:''},
  {id:'l9',name:'Laura Bassi',src:'Social',srcD:'Instagram',contacted:'2026-09-22',stage:'perso',free:'2026-09-29 18:00',next:'Prezzo troppo alto',interest:'Pacchetto 8 lezioni'},
  {id:'l10',name:'Giorgio Testa',src:'Social',srcD:'Facebook',contacted:'2026-09-15',stage:'contattare',free:null,next:'Non ha più risposto',interest:''},
  {id:'l11',name:'Silvia Neri',src:'Esterno',srcD:'Collaborazione',contacted:'2026-09-28',stage:'perso',free:null,next:'Si è trasferita',interest:''}
 ];
 const inbox=[
  {id:uid(),kind:'messaggio',clientId:'c3',date:'2026-10-18',text:'Posso spostare la seduta di giovedì a venerdì? Ho una cena di lavoro.',read:false},
  {id:uid(),kind:'feedback',clientId:'c2',date:'2026-10-18',text:'Feedback: con il lento leggero la spalla va bene, nessun fastidio.',read:false}
 ];
 const checks=[
  {clientId:'c1',date:'2026-10-13',v:{energia:4,stress:2,motivazione:5,sonno:3,progressi:4},note:'Settimana intensa al lavoro ma allenamenti tutti fatti.'},
  {clientId:'c1',date:'2026-10-06',v:{energia:3,stress:3,motivazione:4,sonno:3,progressi:3},note:''},
  {clientId:'c1',date:'2026-09-29',v:{energia:3,stress:3,motivazione:4,sonno:2,progressi:3},note:''},
  {clientId:'c4',date:'2026-10-16',v:{energia:3,stress:2,motivazione:4,sonno:4,progressi:3},note:'La schiena al mattino va meglio.'}
 ];
 const measures=[{clientId:'c1',date:'2026-09-14',peso:62.0,vita:72,fianchi:98,cosciaDx:56,cosciaSx:56,braccio:27},{clientId:'c1',date:'2026-10-14',peso:61.4,vita:70.5,fianchi:97,cosciaDx:56.5,cosciaSx:56,braccio:27}];
 const shifts=[{date:'2026-10-13',in:'07:40',out:'18:20'},{date:'2026-10-14',in:'07:45',out:'19:10'},{date:'2026-10-15',in:'08:30',out:'18:05'},{date:'2026-10-16',in:'08:50',out:'19:15'},{date:'2026-10-17',in:'09:30',out:'13:00'},
   {date:'2026-10-06',in:'07:50',out:'18:00'},{date:'2026-10-07',in:'08:00',out:'19:30'},{date:'2026-10-08',in:'08:15',out:'17:45'},{date:'2026-10-09',in:'08:40',out:'19:20'},{date:'2026-10-10',in:'09:00',out:'12:30'}];
 const weekly=[{w:'2026-08-24',pt:11},{w:'2026-08-31',pt:13},{w:'2026-09-07',pt:14},{w:'2026-09-14',pt:16},{w:'2026-09-21',pt:15},{w:'2026-09-28',pt:17},{w:'2026-10-05',pt:18},{w:'2026-10-12',pt:17}];
 const requests=[{id:'r1',clientId:'c2',date:'2026-10-22',from:'09:00',to:'18:00',note:'Giovedì mattina ho una riunione, possiamo fare alle 18?',status:'attesa'}];
 const scheduled=[
  {id:uid(),to:'tutti',when:'2026-10-20 07:30',trigger:null,text:'Buona settimana! Ricordatevi di bere e di dormire almeno 7 ore: si vede anche in sala.'},
  {id:uid(),to:'c1',when:null,trigger:'1 mese di allenamento',text:'Un mese di allenamenti fatto! Sono fiera della costanza che stai mettendo.'},
  {id:uid(),to:'c2',when:'2026-10-22 08:00',trigger:null,text:'Oggi niente fretta sulla spalla: carichi leggeri e tecnica pulita.'}
 ];
 const coachMsg={c1:'Oggi spingiamo sull\'hip thrust: se l\'ultima volta le serie erano pulite, prova 52,5 kg nelle prime due.',c2:'Questa settimana lavoriamo sulla tecnica, niente carichi alti.',c4:'Ricordati le scarpe pulite per le foto di controllo.'};
 const posts=[
  {id:uid(),who:'Martina',ini:'MV',when:'ieri',text:'Terza settimana completata! Le braccia iniziano a vedersi.',stat:'3 esercizi · 41 min',likes:6,liked:false},
  {id:uid(),who:'Davide',ini:'DN',when:'ieri',text:'Nuovo record alla leg press, grazie coach!',stat:'Record personale',likes:9,liked:false},
  {id:uid(),who:'Coach Aelis',ini:'AE',when:'2 giorni fa',text:'Sfida di ottobre: 9 allenamenti nel mese. Chi c\'è?',stat:'Sfida',likes:12,liked:false}
 ];
 const iso=(d,t)=>d+'T'+t+':00';
 const chat=[
  {id:'m1',client_id:'c1',coach_id:'demo',sender:'client',body:'Ciao Aelis! Giovedì posso arrivare alle 19:15 invece delle 19?',created_at:iso('2026-10-17','16:02'),read_at:iso('2026-10-17','16:10')},
  {id:'m2',client_id:'c1',coach_id:'demo',sender:'coach',body:'Certo, nessun problema. Ti sposto io la lezione in agenda.',created_at:iso('2026-10-17','16:11'),read_at:iso('2026-10-17','16:12')},
  {id:'m3',client_id:'c1',coach_id:'demo',sender:'coach',body:'Ottimo lavoro oggi sull\'hip thrust: la prossima volta proviamo 52,5 kg.',created_at:iso('2026-10-18','18:40'),read_at:null},
  {id:'m4',client_id:'c3',coach_id:'demo',sender:'client',body:'Posso spostare la seduta di giovedì a venerdì? Ho una cena di lavoro.',created_at:iso('2026-10-18','21:05'),read_at:null},
  {id:'m5',client_id:'c2',coach_id:'demo',sender:'client',body:'Con il lento leggero la spalla va bene, nessun fastidio.',created_at:iso('2026-10-18','09:30'),read_at:iso('2026-10-18','10:00')}
 ];
 return {v:2,chat:chat,clients:clients,contracts:contracts,programs:[program],history:history,appts:appts,leads:leads,inbox:inbox,checks:checks,measures:measures,shifts:shifts,shift:null,weekly:weekly,requests:requests,scheduled:scheduled,coachMsg:coachMsg,posts:posts,invites:[],seenBadges:{},autos:defAutos(),challenges:defChallenges()};
}
function load(){try{const t=localStorage.getItem(KEY);if(!t)return null;const d=JSON.parse(t);return d&&d.v===2?d:null;}catch(e){return null;}}
function save(){if(REAL){if(window.AelisCloud)AelisCloud.changed();return;}try{localStorage.setItem(KEY,JSON.stringify(S.db));}catch(e){}}

const S={db:REAL?emptyDb():(load()||seed()),ui:{role:'coach',tab:'oggi',page:null,ctab:'profilo',day:TODAY,sheet:null,asClient:'c1',search:'',cfilter:'tutti',csrc:null,lsrc:'tutti',wk:null,party:null,chat:[],chartEx:'hip',cprog:'hip',ptab:'stat',ntab:'panoramica',aperiod:'tutto',asrc:null,editProg:null,ctabMain:'home'}};
if(!S.db.seenBadges)S.db.seenBadges={};
if(!S.db.autos)S.db.autos=defAutos();
if(!S.db.challenges)S.db.challenges=defChallenges();

/* ---------- logica ---------- */
const client=id=>S.db.clients.find(c=>c.id===id);
const contractOf=c=>c?S.db.contracts.find(k=>k.id===c.contract):null;
const programOf=c=>c&&c.program?S.db.programs.find(p=>p.id===c.program):null;
function credits(k){let paid=0,gift=0;if(!k)return{paid:0,gift:0,total:0};k.mov.forEach(m=>{if(m.type==='omaggio')gift+=m.delta;else paid+=m.delta;});return{paid:paid,gift:gift,total:paid+gift};}
function instStatus(i){if(i.paid>=i.amount)return{k:'pagata',l:'Pagata',c:'good'};const d=diff(TODAY,i.due);if(i.paid>0&&d<0)return{k:'scaduta',l:'Parziale, scaduta',c:'crit'};if(i.paid>0)return{k:'parziale',l:'Acconto '+eur(i.paid),c:'warn'};if(d<0)return{k:'scaduta',l:'Scaduta',c:'crit'};if(d<=7)return{k:'scadenza',l:d===0?'Scade oggi':'Tra '+d+' gg',c:'warn'};return{k:'programma',l:'In programma',c:''};}
function apptTitle(a){if(a.clientId){const c=client(a.clientId);return c?c.name:'Cliente';}return a.title||'Impegno';}
const AT={pt:{l:'Lezione PT',v:'--c-pt'},free:{l:'Lezione di prova',v:'--c-free'},consulenza:{l:'Consulenza',v:'--c-cons'},corso:{l:'Corso',v:'--c-corso'},personale:{l:'Personale',v:'--c-pers'}};
const histOf=cid=>S.db.history.filter(h=>h.clientId===cid);
function lastSetsFor(cid,exId){const h=histOf(cid);for(let i=h.length-1;i>=0;i--){if(h[i].sets[exId])return{date:h[i].date,sets:h[i].sets[exId]};}return null;}
const sesMax=(h,ex)=>Math.max.apply(null,h.sets[ex].filter(s=>s.done).map(s=>+s.kg||0).concat([0]));
function maxKg(cid,exId,exceptId){let m=0;histOf(cid).forEach(h=>{if(h.id!==exceptId&&h.sets[exId])m=Math.max(m,sesMax(h,exId));});return m;}
function volume(sets){let v=0;Object.keys(sets).forEach(k=>{const e=exById(k);if(!e||e.mode!=='Esterno')return;sets[k].forEach(s=>{if(s.done&&s.kg!==''&&s.reps)v+=(+s.kg)*(+s.reps);});});return Math.round(v);}
function nextKey(c){const p=programOf(c);if(!p)return null;const h=histOf(c.id);if(!h.length)return p.sessions[0].key;const last=h[h.length-1].key;const i=p.sessions.findIndex(s=>s.key===last);return p.sessions[(i+1)%p.sessions.length].key;}
function weekStreak(cid){let w=monday(TODAY),n=0;const has=w0=>histOf(cid).some(h=>h.date>=w0&&h.date<addDays(w0,7));if(has(w))n++;w=addDays(w,-7);while(has(w)){n++;w=addDays(w,-7);}return n;}
// rank Strava: posizione del carico max di questa seduta tra tutte le sedute (1 = record)
function rankOf(cid,h,ex){const mx=sesMax(h,ex);if(!mx)return 0;const all=histOf(cid).filter(x=>x.sets[ex]&&x.id!==h.id).map(x=>sesMax(x,ex));const better=all.filter(v=>v>mx).length;const equalPrev=all.filter(v=>v===mx).length;if(better===0&&equalPrev===0)return 1;if(better===0)return 0;return better+1<=3?better+1:0;}
function prCount(cid){let n=0;const best={};histOf(cid).forEach(h=>{Object.keys(h.sets).forEach(ex=>{const e=exById(ex);if(!e||e.mode!=='Esterno')return;const m=sesMax(h,ex);if(best[ex]!=null&&m>best[ex])n++;best[ex]=Math.max(best[ex]||0,m);});});return n;}
const VOLEQ=[[1500,'un\'utilitaria'],[6000,'un elefante'],[12000,'un autobus'],[100000,'una balenottera']];
function volEq(v){let r=null;VOLEQ.forEach(x=>{if(v>=x[0])r=x;});return r;}

/* ---------- dettatura ---------- */
const NUMW={zero:0,uno:1,una:1,due:2,tre:3,quattro:4,cinque:5,sei:6,sette:7,otto:8,nove:9,dieci:10,undici:11,dodici:12,tredici:13,quattordici:14,quindici:15,sedici:16,diciassette:17,diciotto:18,diciannove:19,venti:20,trenta:30,quaranta:40,cinquanta:50,sessanta:60,settanta:70,ottanta:80,novanta:90,cento:100};
function parseSpoken(t){t=(t||'').toLowerCase().replace(/[“”"]/g,' ');t=t.replace(/[a-zà]+/g,w=>NUMW[w]!=null?String(NUMW[w]):w);t=t.replace(/(\d+)\s*e\s*mezzo/g,(m,a)=>a+'.5').replace(/(\d+),(\d+)/g,'$1.$2');
 const n=(t.match(/\d+(?:\.\d+)?/g)||[]).map(Number);if(!n.length)return null;
 if(n.length===1){const r=Math.round(n[0]);return r>0&&r<=100?{kg:null,reps:r}:null;}
 const kg=n[0],reps=Math.round(n[1]);if(!(reps>0&&reps<=100)||kg>500)return null;return{kg:kg,reps:reps};}

/* ---------- metamorfosi ---------- */
const STAGE=[
 {k:'origine',n:'Origine',min:0,t:'Il primo passo.',d:'Il primo allenamento: da qui parte tutto.',gift:'Badge di benvenuto'},
 {k:'ritmo',n:'Ritmo',min:8,t:'La costanza prende forma.',d:'I piccoli gesti si ripetono e diventano abitudine.',gift:'Card digitale personalizzata'},
 {k:'potenziale',n:'Potenziale',min:25,t:'Scopri ciò di cui sei capace.',d:'I risultati si sommano: forza, energia, postura.',gift:'Check speciale con confronto progressi'},
 {k:'trasformazione',n:'Trasformazione',min:50,t:'Una nuova versione di te.',d:'Piccoli cambiamenti, risultati enormi. E si continua.',gift:'Maglia esclusiva AELIS Training'}];
function stageOf(cid){const hs=histOf(cid);const n=hs.length;let i=0;STAGE.forEach((s,j)=>{if(n>=s.min)i=j;});const nx=STAGE[i+1];
 const at=STAGE.map(s=>s.min===0?(hs[0]?hs[0].date:null):(hs[s.min-1]?hs[s.min-1].date:null));
 return{i:i,s:STAGE[i],n:n,next:nx,left:nx?nx.min-n:0,p:nx?(n-STAGE[i].min)/(nx.min-STAGE[i].min):1,at:at};}
function stageIcon(i,sz,foil){sz=sz||30;
 const sv=(vb,inner)=>'<svg width="'+sz+'" height="'+sz+'" viewBox="'+vb+'" aria-hidden="true" class="sti">'+inner+'</svg>';
 if(i===0)return sv('0 0 60 60','<circle cx="30" cy="30" r="17" fill="none" stroke="currentColor" stroke-width="1" opacity=".35"/><circle cx="30" cy="30" r="6.5" fill="currentColor"/>');
 if(i===1)return sv('0 0 60 60','<path d="M6 40 C14 40 16 14 26 14 C36 14 36 44 46 44 C52 44 54 36 56 30" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/><path d="M8 42 C16 42 18 18 27 18 C37 18 36 46 47 46" fill="none" stroke="currentColor" stroke-width=".8" opacity=".4"/><circle cx="19" cy="22" r="3.2" fill="currentColor"/><circle cx="44" cy="43.5" r="3.2" fill="currentColor"/>');
 if(i===2)return sv('0 0 60 60','<path d="M30 30 C24 22 16 18 10 22 C4 26 4 34 10 38 C16 42 24 38 30 30 C36 22 44 18 50 22 C56 26 56 34 50 38 C44 42 36 38 30 30 Z" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="M30 30 C25 24 18 21 13 24 C9 27 9 33 13 36 C18 39 25 36 30 30 C35 24 42 21 47 24 C51 27 51 33 47 36 C42 39 35 36 30 30" fill="none" stroke="currentColor" stroke-width=".8" opacity=".45"/><circle cx="30" cy="30" r="3.4" fill="currentColor"/>');
 return '<svg width="'+sz+'" height="'+sz+'" viewBox="-720 -720 1440 1400" aria-hidden="true" class="sti"><use href="#'+(foil?'bfDb':'bfMb')+'" fill="currentColor"></use></svg>';}
function metaTrack(cid){const sg=stageOf(cid);const prog=Math.min(1,(sg.i+sg.p)/3);
 return '<div class="mtrack"><span class="fill" style="width:calc(75% * '+prog.toFixed(3)+')"></span>'+STAGE.map((s,j)=>'<div class="mnode '+(j<sg.i?'done':j===sg.i?'cur':'lock')+'"><span class="ico">'+stageIcon(j,j>=1?40:30,j===sg.i)+'</span>'+s.n+'</div>').join('')+'</div>';}

/* ---------- riepilogo del mese ---------- */
const MESEN=['gennaio','febbraio','marzo','aprile','maggio','giugno','luglio','agosto','settembre','ottobre','novembre','dicembre'];
function monthStats(cid,ym){
 const all=histOf(cid);const hs=all.filter(x=>x.date.slice(0,7)===ym);
 const pm=new Date(+ym.slice(0,4),+ym.slice(5,7)-2,1);const pym=pm.getFullYear()+'-'+String(pm.getMonth()+1).padStart(2,'0');
 const prev=all.filter(x=>x.date.slice(0,7)===pym).length;
 const vol=hs.reduce((s,x)=>s+volume(x.sets),0),min=hs.reduce((s,x)=>s+x.min,0);
 const prs=[];hs.forEach(h=>Object.keys(h.sets).forEach(ex=>{const e=exById(ex);if(!e||e.mode!=='Esterno')return;const m=sesMax(h,ex);let before=0;all.forEach(o=>{if(o.date<h.date&&o.sets[ex])before=Math.max(before,sesMax(o,ex));});if(before>0&&m>before)prs.push({ex:ex,name:e.name,kg:m,prev:before,gain:(m-before)/before});}));
 const best={};prs.forEach(p=>{if(!best[p.ex]||p.kg>best[p.ex].kg)best[p.ex]=Object.assign({},p,{from:best[p.ex]?best[p.ex].from:p.prev});});
 const top=Object.keys(best).map(k=>best[k]).sort((a,b)=>(b.kg-b.from)/b.from-(a.kg-a.from)/a.from)[0]||null;
 const wd=[0,0,0,0,0,0,0];hs.forEach(h=>wd[D(h.date).getDay()]++);const fav=wd.indexOf(Math.max.apply(null,wd));
 const mc={};hs.forEach(h=>Object.keys(h.sets).forEach(ex=>{const e=exById(ex);if(e)e.pri.forEach(m=>{mc[m]=(mc[m]||0)+h.sets[ex].filter(z=>z.done).length;});}));
 const mus=Object.keys(mc).sort((a,b)=>mc[b]-mc[a]);
 const days=[];const y=+ym.slice(0,4),mo=+ym.slice(5,7);const nd=new Date(y,mo,0).getDate();for(let d=1;d<=nd;d++){const ds=ym+'-'+String(d).padStart(2,'0');days.push({d:ds,on:hs.some(h=>h.date===ds),fut:ds>TODAY});}
 return{ym:ym,label:MESEN[mo-1],plabel:MESEN[pm.getMonth()],n:hs.length,prev:prev,vol:vol,min:min,prs:prs.length,top:top,fav:fav,mus:mus,days:days};
}
const WRAPN=7;
function wrapHTML(){
 const w=S.ui.wrap;if(!w)return '';const c=me();const m=monthStats(c.id,TODAY.slice(0,7));const sg=stageOf(c.id);const i=w.i;const nm=esc(c.name.split(' ')[0]);
 const BG=['radial-gradient(70% 50% at 50% 40%,rgb(255 255 255 / .09),transparent 70%)','radial-gradient(90% 60% at 100% 0%,rgb(255 255 255 / .010),transparent 65%),radial-gradient(70% 50% at 0% 100%,rgb(255 255 255 / .04),transparent 70%)','radial-gradient(80% 60% at 0% 10%,rgb(255 255 255 / .06),transparent 65%)','radial-gradient(90% 60% at 50% 100%,rgb(255 255 255 / .010),transparent 70%)','radial-gradient(80% 60% at 100% 50%,rgb(255 255 255 / .04),transparent 70%)','radial-gradient(80% 60% at 20% 20%,rgb(255 255 255 / .08),transparent 70%)','radial-gradient(70% 50% at 50% 30%,rgb(255 255 255 / .21),transparent 70%)'];
 let b='';
 if(i===0)b='<svg class="bfw" viewBox="-720 -720 1440 1400" aria-hidden="true"><use href="#bfD"></use></svg><p class="eb" style="text-align:center">Il tuo '+m.label+'</p><h2 style="text-align:center">'+nm+', guarda cosa<br>hai costruito.</h2><p class="l" style="text-align:center">Tocca a destra per andare avanti.</p>';
 if(i===1){const d=m.n-m.prev;b='<p class="eb">Allenamenti</p><p class="huge">'+m.n+'</p><h2>'+(m.n===1?'allenamento':'allenamenti')+' a '+m.label+'.</h2><p class="l">'+(d>0?d+' in più di '+m.plabel+'. La costanza sta diventando un\'abitudine.':d===0?'Come a '+m.plabel+': la costanza è già un risultato.':'Qualcuno in meno di '+m.plabel+': ogni mese ha il suo ritmo.')+'</p><div class="dots" aria-hidden="true">'+m.days.map(x=>'<i class="'+(x.on?'on':'')+'" style="'+(x.fut?'opacity:.35':'')+'"></i>').join('')+'</div>';}
 if(i===2){const t=m.vol/1000;const eq=volEq(m.vol);b='<p class="eb">Peso sollevato</p><p class="huge">'+(t>=10?Math.round(t):kgf(Math.round(t*10)/10))+'<span style="font-size:.4em">t</span></p><h2>'+nf(m.vol)+' kg spostati in '+Math.round(m.min/60)+' ore di lavoro.</h2>'+(eq?'<p class="l">Come sollevare '+eq[1]+'. Più volte.</p>':'');}
 if(i===3){b='<p class="eb">Record personali</p><p class="huge">'+m.prs+'</p><h2>volte hai alzato<br>l\'asticella.</h2>'+(m.top?'<p class="l">Il salto più grande: <b>'+esc(m.top.name)+'</b>, da '+kgf(m.top.from)+' a '+kgf(m.top.kg)+' kg (+'+Math.round((m.top.kg-m.top.from)/m.top.from*100)+'%).</p>':'');}
 if(i===4){b='<p class="eb">I muscoli del mese</p><h2>'+m.mus.slice(0,2).map(x=>MUSCLES[x]).join(' e ')+'<br>hanno lavorato più di tutti.</h2><div style="max-width:300px;align-self:center;width:100%">'+bodyMap(m.mus.slice(0,3),m.mus.slice(3,6),'Muscoli più allenati del mese',true,true)+'</div>';}
 if(i===5){b='<p class="eb">La tua trasformazione</p><div style="color:#BCD7F7;align-self:flex-start">'+stageIcon(sg.i,sg.i>=2?150:110,true)+'</div><h2>Sei in fase<br>'+sg.s.n+'.</h2><p class="l">'+esc(sg.s.d)+(sg.next?' Ancora '+sg.left+' allenament'+(sg.left===1?'o':'i')+' per la fase '+sg.next.n+'.':'')+'</p>';}
 if(i===6){b='<div class="story" style="max-width:260px;aspect-ratio:auto;align-self:center;gap:14px"><svg class="sbf" viewBox="-720 -720 1440 1400" aria-hidden="true"><use href="#bfD"></use></svg><div><svg width="90" height="20" viewBox="-20 -80 420 90" aria-label="AELIS"><use href="#wmT" fill="url(#foilT)"></use><use href="#wmS" fill="#BCD7F7"></use></svg><p class="bigs" style="margin-top:12px">Il mio<br>'+m.label+'</p></div><div class="mini" style="border-top-color:rgb(255 255 255 / .15)"><div><b>'+m.n+'</b><span>allenamenti</span></div><div><b>'+(m.vol>=10000?Math.round(m.vol/1000):kgf(Math.round(m.vol/100)/10))+' t</b><span>sollevate</span></div><div><b>'+m.prs+'</b><span>record</span></div></div><p style="font-size:12px;opacity:.7">Fase '+sg.s.n+' · @aelistraining</p></div><p class="l" style="text-align:center;font-family:var(--display);font-weight:600;font-size:16px;letter-spacing:.06em;color:#BCD7F7">Diventa ciò che sei.</p>';}
 const last=i===WRAPN-1;
 return '<div class="wrp" role="dialog" aria-modal="true" aria-label="Il tuo '+m.label+'"><div class="st"><div class="bg" style="background:'+BG[i]+'"></div><div class="bars" aria-hidden="true">'+Array.from({length:WRAPN},(_,k)=>'<i class="'+(k<i?'done':k===i&&!last?'on':k===i?'done':'')+'"><b></b></i>').join('')+'</div>'+
  '<div class="top2"><span class="row" style="gap:8px"><svg width="26" height="25" viewBox="-720 -720 1440 1400" aria-hidden="true"><use href="#bfDb"></use></svg><span class="xs" style="letter-spacing:.2em;text-transform:uppercase;color:#AFC0DA">Il tuo '+m.label+'</span></span><button class="x" data-act="wrapClose" aria-label="Chiudi">'+ic('x',18)+'</button></div>'+
  (i>0?'<button class="tap l" data-act="wrapPrev" aria-label="Indietro"></button>':'')+(!last?'<button class="tap r" data-act="wrapNext" aria-label="Avanti"></button>':'')+
  '<div class="sl" data-k="'+i+'">'+b+'</div>'+(last?'<div class="acts"><button class="btn rose lg block" data-act="shareMonth">'+ic('share',18)+' Condividi nelle storie</button><button class="btn lg block" data-act="wrapClose">Chiudi</button></div>':'')+'</div></div>';
}

/* ---------- rischio abbandono ---------- */
function lastActivity(c){let d=null;const up=x=>{if(x&&x<=TODAY&&(!d||x>d))d=x;};histOf(c.id).forEach(h=>up(h.date));S.db.appts.forEach(a=>{if(a.clientId===c.id&&a.status==='svolto')up(a.date);});const k=contractOf(c);if(k)k.mov.forEach(m=>{if(m.by==='Sistema'&&m.delta<0)up(m.date);});return d;}
function risk(c){const k=contractOf(c);let sc=0;const why=[];
 if(c.status==='sospeso'){const dd=k&&k.suspendedOn?diff(k.suspendedOn,TODAY):0;sc+=35+(dd>10?20:0);why.push('Percorso sospeso da '+dd+' giorni');}
 else{const la=lastActivity(c);const dd=diff(la||c.since,TODAY);
  if(dd>=14){sc+=40;why.push(la?'Nessun allenamento da '+dd+' giorni':'Nessun allenamento registrato in '+dd+' giorni');}else if(dd>=8){sc+=20;why.push('Ultimo allenamento '+dd+' giorni fa');}
  if(!c.lastCheck&&diff(c.since,TODAY)>7){sc+=12;why.push('Primo check mai inviato');}else if(c.lastCheck&&diff(c.lastCheck,TODAY)>c.checkEvery+3){sc+=12;why.push('Nessun check da '+diff(c.lastCheck,TODAY)+' giorni');}
  const lc=S.db.checks.filter(x=>x.clientId===c.id).sort((a,b)=>a.date<b.date?1:-1)[0];if(lc&&lc.v.motivazione<=2){sc+=20;why.push('Motivazione bassa nell\'ultimo check');}
  if(k&&k.status==='attivo'){const de=diff(TODAY,k.end);if(de>=0&&de<=21){sc+=18;why.push('Il percorso finisce tra '+de+' giorni: proponi il rinnovo');}}
  if(k&&k.inst.some(i=>instStatus(i).k==='scaduta')){sc+=10;why.push('Una rata è scaduta');}}
 sc=Math.min(100,sc);return{sc:sc,lvl:sc>=50?'alto':sc>=25?'medio':'basso',why:why};}
const riskList=()=>S.db.clients.map(c=>({c:c,r:risk(c)})).filter(x=>x.r.lvl!=='basso').sort((a,b)=>b.r.sc-a.r.sc);
const riskChip=r=>r.lvl==='basso'?'':'<span class="chip '+(r.lvl==='alto'?'crit':'warn')+'">'+ic('alert',12)+' Rischio '+r.lvl+'</span>';
function nudgeText(c){const n=c.name.split(' ')[0];const r=risk(c);
 if(c.status==='sospeso')return 'Ciao '+n+'! Come va? Volevo sapere come stai. Quando te la senti, ripartiamo con calma: anche un allenamento leggero conta.';
 if(r.why.some(w=>w.indexOf('rinnovo')>=0))return 'Ciao '+n+'! Il tuo percorso sta per finire e i progressi si vedono. Alla prossima lezione parliamo di come continuare?';
 return 'Ciao '+n+'! È un po\' che non ti vedo in sala: come stai? Se ti va troviamo insieme un orario comodo questa settimana, anche solo 30 minuti.';}

/* ---------- promemoria di oggi (regole sui dati) ---------- */
function aiWeekly(){const out=[];const w7=addDays(TODAY,-7);
 riskList().slice(0,2).forEach(x=>out.push({c:'crit',ic:'alert',t:'<b>'+esc(x.c.name.split(' ')[0])+'</b>: '+esc(x.r.why[0].charAt(0).toLowerCase()+x.r.why[0].slice(1))+(x.r.why[1]?', e '+esc(x.r.why[1].charAt(0).toLowerCase()+x.r.why[1].slice(1)):'')+'. Rischio abbandono '+x.r.lvl+'.',a:'<button class="lnk" data-act="sheet" data-v="nudge" data-id="'+x.c.id+'">Prepara un messaggio</button>'}));
 const rec=S.db.history.filter(h=>h.date>=w7&&h.pr).slice(-1)[0];if(rec){const c=client(rec.clientId);out.push({c:'good',ic:'star',t:'<b>'+esc(c.name.split(' ')[0])+'</b> ha battuto un record: '+esc(rec.pr)+'.'+(rec.kudos?' Hai già mandato l\'applauso.':' Un applauso fa la differenza.'),a:rec.kudos?'':'<button class="lnk" data-act="kudos" data-id="'+rec.id+'">Manda un applauso</button>'});}
 const cnt={};S.db.history.filter(h=>h.date>=w7).forEach(h=>{cnt[h.clientId]=(cnt[h.clientId]||0)+1;});const topId=Object.keys(cnt).sort((a,b)=>cnt[b]-cnt[a])[0];
 if(topId){const c=client(topId);const hs=histOf(topId);const ex='hip';const pts=hs.filter(x=>x.sets[ex]).slice(-4).map(x=>sesMax(x,ex));out.push({c:'',ic:'flame',t:'<b>'+esc(c.name.split(' ')[0])+'</b>: '+cnt[topId]+' allenamenti in 7 giorni.'+(pts.length>2&&pts[pts.length-1]>pts[0]?' L\'hip thrust sale da '+pts.length+' sedute di fila ('+kgf(pts[0])+' → '+kgf(pts[pts.length-1])+' kg): si può alzare il carico.':''),a:'<button class="lnk" data-act="openClient" data-id="'+topId+'">Apri il dossier</button>'});}
 const fb=S.db.inbox.filter(m=>!m.read&&m.kind==='feedback').slice(-1)[0];if(fb){const c=client(fb.clientId);out.push({c:'',ic:'msg',t:'<b>'+esc(c.name.split(' ')[0])+'</b> ti ha lasciato un feedback: “'+esc(fb.text.replace(/^Feedback:\s*/,''))+'”',a:'<button class="lnk" data-act="readMsg" data-id="'+fb.id+'">Leggi e rispondi</button>'});}
 const due=[];S.db.contracts.forEach(k=>k.inst.forEach(i=>{const st=instStatus(i);if(st.k==='scadenza'||st.k==='scaduta')due.push(i.amount-i.paid);}));if(due.length)out.push({c:'warn',ic:'wallet',t:due.length+' rate da incassare tra scadute e in scadenza, per '+eur(due.reduce((a,b)=>a+b,0))+'. I promemoria automatici sono attivi.',a:'<button class="lnk" data-act="numeri" data-v="incassi">Vedi gli incassi</button>'});
 return out.slice(0,5);}

/* ---------- automazioni ---------- */
function defAutos(){return [
 {id:'a1',on:true,ic:'star',t:'Nuovo record',w:'Quando un cliente batte un suo record',to:'Cliente',msg:'Nuovo record! Si vede tutto il lavoro di queste settimane. Continua così.',log:[['c5','2026-10-18']]},
 {id:'a2',on:true,ic:'heart',t:'Ci manchi',w:'Dopo 7 giorni senza allenamenti',to:'Cliente',msg:'Ciao {nome}! Come stai? Quando vuoi ripartire io ci sono: anche 30 minuti contano.',log:[['c7','2026-10-16']]},
 {id:'a3',on:true,ic:'cal',t:'Rinnovo in arrivo',w:'14 giorni prima della fine del percorso',to:'Cliente e Aelis',msg:'Il tuo percorso finisce il {data}. Ne parliamo alla prossima lezione?',log:[]},
 {id:'a4',on:true,ic:'wallet',t:'Promemoria rata',w:'3 giorni prima della scadenza',to:'Cliente',msg:'Promemoria gentile: la rata {n} scade il {data}. Grazie!',log:[['c2','2026-10-16']]},
 {id:'a5',on:true,ic:'leaf',t:'Nuova fase',w:'Quando un cliente passa di fase nel percorso',to:'Cliente',msg:'Nuova fase raggiunta: {fase}! Sono orgogliosa del tuo percorso.',log:[['c1','2026-10-03']]},
 {id:'a6',on:true,ic:'flame',t:'Un mese insieme',w:'Dopo 4 settimane di allenamenti',to:'Cliente',msg:'Un mese di allenamenti fatto! Sono fiera della costanza che stai mettendo.',log:[['c1','2026-10-13']]},
 {id:'a7',on:false,ic:'check',t:'Check del lunedì',w:'Ogni lunedì alle 8:00',to:'Tutti i clienti',msg:'Buongiorno! Hai un minuto per il check della settimana?',log:[]},
 {id:'a8',on:false,ic:'gift',t:'Compleanno',w:'Il giorno del compleanno',to:'Cliente',msg:'Buon compleanno {nome}! Oggi allenamento facoltativo, festa obbligatoria.',log:[]}];}

/* ---------- sfide di gruppo ---------- */
function defChallenges(){return [
 {id:'ch1',kind:'personale',title:'Ottobre in movimento',goal:'9 allenamenti nel mese',target:9,metric:'n',start:'2026-10-01',end:'2026-10-31',prize:'Trofeo edizione limitata',joined:['c1','c3','c5','c7','c4'],base:{c3:5,c5:6,c7:2,c4:3},anon:['c7']},
 {id:'ch2',kind:'squadra',title:'Ottobre di squadra',goal:'80.000 kg sollevati insieme',target:80000,metric:'vol',start:'2026-10-01',end:'2026-10-31',prize:'Sfida sbloccata per tutti',joined:['c1','c3','c5','c4'],base:{c3:6200,c5:21800,c4:4100},anon:[]},
 {id:'ch3',kind:'personale',title:'Novembre senza scuse',goal:'12 allenamenti nel mese',target:12,metric:'n',start:'2026-11-01',end:'2026-11-30',prize:'Trofeo edizione limitata',joined:['c5'],base:{},anon:[]}];}
function chVal(ch,cid){const hs=histOf(cid).filter(x=>x.date>=ch.start&&x.date<=ch.end);return (ch.base[cid]||0)+(ch.metric==='n'?hs.length:hs.reduce((s,x)=>s+volume(x.sets),0));}
function chBoard(ch){if(ch.board){const mine=S.ui.asClient;const arr=ch.board.filter(e=>e.id!==mine).map(e=>({c:{id:e.id,name:e.name,ini:e.ini},v:e.v}));if(ch.joined.indexOf(mine)>=0&&client(mine))arr.push({c:client(mine),v:chVal(ch,mine)});return arr.sort((a,b)=>b.v-a.v);}return ch.joined.map(id=>({c:client(id),v:chVal(ch,id)})).filter(x=>x.c).sort((a,b)=>b.v-a.v);}
function chTotal(ch){return chBoard(ch).reduce((s,x)=>s+x.v,0);}
const chState=ch=>TODAY<ch.start?'prossima':TODAY>ch.end?'finita':'attiva';

/* ---------- trofei ---------- */
const TIERS={bronze:{l:'Bronzo',v:'--t-bronze'},silver:{l:'Argento',v:'--t-silver'},gold:{l:'Oro',v:'--t-gold'},plat:{l:'Platino',v:'--t-plat'},rose:{l:'Edizione limitata',v:'--t-rose'}};
function weeklyPT(){if(S.db.weekly&&S.db.weekly.length>1)return S.db.weekly;const out=[];const m0=monday(TODAY);for(let k=8;k>=1;k--){const w=addDays(m0,-7*k);out.push({w:w,pt:S.db.appts.filter(a=>a.type==='pt'&&a.status==='svolto'&&a.date>=w&&a.date<addDays(w,7)).length});}return out;}
function stats(cid){const h=histOf(cid);const vol=h.reduce((s,x)=>s+volume(x.sets),0);return{n:h.length,streak:weekStreak(cid),pr:prCount(cid),vol:vol,checks:S.db.checks.filter(x=>x.clientId===cid).length,oct:h.filter(x=>x.date.slice(0,7)===CM).length,coach:h.filter(x=>x.type==='coach').length,auto:h.filter(x=>x.type==='autonomo').length};}
const BADGES=[
 {id:'first',n:'Primo passo',d:'Primo allenamento',t:'bronze',i:'play',g:s=>[s.n,1]},
 {id:'n10',n:'Doppia cifra',d:'10 allenamenti',t:'silver',i:'dumbbell',g:s=>[s.n,10]},
 {id:'n25',n:'Quarto di cento',d:'25 allenamenti',t:'gold',i:'dumbbell',g:s=>[s.n,25]},
 {id:'n50',n:'Mezzo centinaio',d:'50 allenamenti',t:'plat',i:'star',g:s=>[s.n,50]},
 {id:'st4',n:'Un mese pieno',d:'4 settimane di fila',t:'silver',i:'flame',g:s=>[s.streak,4]},
 {id:'st8',n:'Inarrestabile',d:'8 settimane di fila',t:'gold',i:'flame',g:s=>[s.streak,8]},
 {id:'pr1',n:'Primo record',d:'Batti un tuo record',t:'bronze',i:'bolt',g:s=>[s.pr,1]},
 {id:'pr10',n:'Collezionista',d:'10 record personali',t:'gold',i:'bolt',g:s=>[s.pr,10]},
 {id:'v1',n:'Utilitaria',d:'1.500 kg sollevati',t:'bronze',i:'weight',g:s=>[s.vol,1500]},
 {id:'v2',n:'Elefante',d:'6.000 kg sollevati',t:'silver',i:'weight',g:s=>[s.vol,6000]},
 {id:'v3',n:'Balenottera',d:'100.000 kg sollevati',t:'plat',i:'weight',g:s=>[s.vol,100000]},
 {id:'chk',n:'In ascolto',d:'4 check inviati',t:'bronze',i:'heart',g:s=>[s.checks,4]},
 {id:'solo',n:'In autonomia',d:'5 allenamenti senza coach',t:'silver',i:'leaf',g:s=>[s.auto,5]},
 {id:'oct',n:'Sfida di ottobre',d:'9 allenamenti a ottobre',t:'rose',i:'target',g:s=>[s.oct,9]}
];
function badgeState(cid){const s=stats(cid);return BADGES.map(b=>{const g=b.g(s);return Object.assign({},b,{cur:Math.min(g[0],g[1]),goal:g[1],ok:g[0]>=g[1]});});}
function medal(b,size,opts){
 opts=opts||{};const t=TIERS[b.t];const ok=b.ok;const s=size||64;const col=ok?'var('+t.v+')':'var(--line)';const id='m'+uid();
 return '<svg width="'+s+'" height="'+s+'" viewBox="0 0 64 64" role="img" aria-label="'+esc(b.n+(ok?'':' (da sbloccare)'))+'">'+
  '<defs><linearGradient id="'+id+'" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff" stop-opacity="'+(ok?.45:0)+'"/><stop offset=".55" stop-color="#fff" stop-opacity="0"/></linearGradient></defs>'+
  '<path d="M20 2h9l3 12-6 4zM44 2h-9l-3 12 6 4z" fill="'+(ok?'var(--accent-ink)':'var(--line)')+'" opacity="'+(ok?.85:1)+'"/>'+
  '<path d="M32 9 51.1 20v22L32 53 12.9 42V20z" transform="translate(0 4)" fill="'+col+'"/>'+
  '<path d="M32 9 51.1 20v22L32 53 12.9 42V20z" transform="translate(0 4)" fill="url(#'+id+')"/>'+
  '<path d="M32 15.5 45.5 23.3v15.4L32 46.5 18.5 38.7V23.3z" transform="translate(0 4)" fill="none" stroke="'+(ok?'rgb(255 255 255 / .55)':'var(--bg)')+'" stroke-width="1.5"/>'+
  '<g transform="translate(22 25)" stroke="'+(ok?'#fff':'var(--faint)')+'" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><svg width="20" height="20" viewBox="0 0 24 24">'+I[b.i]+'</svg></g>'+
  (!ok?'<circle cx="49" cy="51" r="8" fill="var(--bg)"/><g transform="translate(43 45)" stroke="var(--muted)" fill="none" stroke-width="2.2" stroke-linecap="round"><svg width="12" height="12" viewBox="0 0 24 24">'+I.lock+'</svg></g>':'')+
 '</svg>';
}
function prMedal(r,s){const map={1:['--t-gold','PR'],2:['--t-silver','2°'],3:['--t-bronze','3°']};const m=map[r];s=s||36;
 return '<svg width="'+s+'" height="'+s+'" viewBox="0 0 36 36" role="img" aria-label="'+(r===1?'Record personale':r+'° miglior risultato')+'"><path d="M11 1h6l2 9-5 3zM25 1h-6l-2 9 5 3z" fill="var(--accent-ink)" opacity=".8"/><circle cx="18" cy="22" r="12" fill="var('+m[0]+')"/><circle cx="18" cy="22" r="9" fill="none" stroke="rgb(255 255 255 / .55)" stroke-width="1.2"/><text x="18" y="26" text-anchor="middle" font-size="10" font-weight="800" fill="#fff" font-family="Archivo,system-ui">'+m[1]+'</text></svg>';}

/* ---------- attenzione ---------- */
function attention(){
 const out=[];
 S.db.clients.forEach(c=>{
  if(c.status!=='attivo')return;const k=contractOf(c);
  if(k)k.inst.forEach(i=>{if(instStatus(i).k==='scaduta')out.push({c:c,lvl:3,chip:'crit',t:'Rata '+i.n+' scaduta il '+fd(i.due)});});
  if(!c.ob.scheda)out.push({c:c,lvl:2,chip:'warn',t:'Scheda da preparare'});
  if(!c.ob.foto)out.push({c:c,lvl:1,chip:'',t:'Foto e misure da fare'});
  if(!c.lastCheck)out.push({c:c,lvl:2,chip:'warn',t:'Primo check mancante'});
  else if(diff(c.lastCheck,TODAY)>c.checkEvery+2)out.push({c:c,lvl:2,chip:'warn',t:'Nessun check da '+diff(c.lastCheck,TODAY)+' gg'});
  if(k&&k.lessons){const cr=credits(k);if(cr.total<=2)out.push({c:c,lvl:2,chip:'warn',t:cr.total<=0?'Lezioni finite':'Restano '+cr.total+' lezioni'});}
  if(k&&diff(TODAY,k.end)<=14&&diff(TODAY,k.end)>=0)out.push({c:c,lvl:2,chip:'warn',t:'Percorso finisce il '+fd(k.end)});
  if(!c.src)out.push({c:c,lvl:0,chip:'',t:'Indica la provenienza'});
 });
 return out.sort((a,b)=>b.lvl-a.lvl);
}
const unread=()=>S.db.inbox.filter(x=>!x.read);
const unreadForClient=()=>histOf(S.ui.asClient).filter(x=>x.kudos&&!x.kudosSeen).length;

/* ---------- grafici ---------- */
function bodyMap(pri,sec,label,small,story){
 pri=pri||[];sec=sec||[];
 const P=story?{skin:'rgb(255 255 255 / .07)',mus:'rgb(255 255 255 / .14)',sep:'#081C42',pri:'#C8D6EA',hi:'#FFFFFF',sec:'rgb(255 255 255 / .25)',txt:'rgb(255 255 255 / .6)'}:{skin:'var(--skin)',mus:'var(--mus)',sep:'var(--bg)',pri:'var(--accent-ink)',hi:'var(--pri-hi)',sec:'var(--accent)',txt:'var(--muted)'};
 const gid='bm'+uid();
 const isP=k=>k&&pri.indexOf(k)>=0,isS=k=>k&&!isP(k)&&sec.indexOf(k)>=0;
 const M=(d,k)=>'<path d="'+d+'" fill="'+(isP(k)?'url(#'+gid+')':isS(k)?P.sec:P.mus)+'" stroke="'+P.sep+'" stroke-width="1.5" stroke-linejoin="round"'+(k?' data-tip="'+MUSCLES[k]+(isP(k)?' · principale':isS(k)?' · secondario':'')+'"':'')+'/>';
 const mir=s=>s+'<g transform="matrix(-1 0 0 1 200 0)">'+s+'</g>';
 const sil='<g fill="'+P.skin+'"><path d="M100 50 L91 50 L90 70 C84 76 72 80 60 83 C50 86 44 94 43 106 L46 128 C52 124 56 120 58 118 C60 140 63 162 64 180 C62 192 58 200 58 212 L100 228 Z"/><path d="M47 98 C40 108 37 126 37 146 C36 166 34 180 33 192 C29 212 25 232 23 250 C21 260 19 268 21 278 C23 290 30 294 34 287 C36 279 34 271 36 263 C40 247 46 227 50 207 C52 196 55 184 57 172 C59 156 60 136 58 118 Z"/><path d="M58 206 C53 230 51 260 55 292 C57 302 57 310 55 320 C51 340 55 362 63 382 C63 390 58 395 62 399 L87 399 C89 393 84 387 82 381 C84 363 88 341 86 319 C86 309 88 301 90 291 C96 267 100 245 100 226 Z"/></g>';
 const head='<ellipse cx="100" cy="402" rx="44" ry="4" fill="'+P.mus+'" opacity=".55"/><ellipse cx="100" cy="30" rx="18" ry="22" fill="'+P.skin+'"/>';
 const abs=[[134,150],[153,169],[172,188],[191,214]].map(r=>M('M89.5 '+r[0]+' H98.5 V'+r[1]+' H89.5 Q86.5 '+r[1]+' 86.5 '+(r[1]-3)+' V'+(r[0]+3)+' Q86.5 '+r[0]+' 89.5 '+r[0]+' Z','addome')).join('');
 const fore='M38 190 C31 208 26 228 25 246 C25 254 31 256 35 250 C41 232 47 212 51 196 C48 186 41 184 38 190 Z';
 const delt='M60 84 C50 86 44 96 44 110 C44 118 46 124 48 128 C52 118 57 108 64 100 C66 94 64 88 60 84 Z';
 const front=mir(sil+M('M90 70 C84 76 74 80 64 83 C74 86 84 85 92 80 Z','trapezi')+M(delt,'spalle')+M('M65 98 C71 91 86 89 99 91 L99 126 C88 132 74 132 65 124 C59 118 59 106 65 98 Z','petto')+
  M('M44 132 C39 146 38 160 40 174 C42 184 50 186 55 178 C58 162 58 146 56 132 C52 124 47 124 44 132 Z','bicipiti')+M(fore,null)+abs+
  M('M66 130 C72 142 78 152 83 162 L84 198 C76 202 69 198 65 190 C65 172 63 152 66 130 Z','addome')+
  M('M60 214 C54 236 52 262 56 290 C58 298 64 302 70 300 C72 284 72 258 70 232 C68 222 64 216 60 214 Z','quadricipiti')+M('M71 218 C79 228 85 250 84 276 C83 290 79 298 74 300 C72 284 71 258 70 236 C70 228 70 222 71 218 Z','quadricipiti')+M('M86 262 C91 272 92 286 88 296 C85 300 80 300 78 298 C82 290 85 276 86 262 Z','quadricipiti')+
  M('M88 228 C95 240 97 254 94 266 C91 258 88 248 86 238 Z',null)+M('M57 320 C52 336 54 352 60 366 C63 354 64 336 63 320 Z','polpacci')+M('M65 322 C66 340 68 360 70 376 C74 360 77 340 76 322 C72 318 68 318 65 322 Z',null)+M('M78 322 C84 334 86 348 82 362 C80 350 79 336 78 322 Z','polpacci'));
 const back=mir(sil+M('M100 58 L100 134 C93 121 85 105 74 94 C68 89 63 86 60 83 C72 80 84 74 91 62 Z','trapezi')+M(delt,'spalle')+
  M('M42 132 C37 148 37 164 40 178 C43 186 50 186 54 178 C57 162 57 146 55 132 C51 124 45 124 42 132 Z','tricipiti')+M(fore,null)+
  M('M59 104 C70 108 81 116 88 124 C88 140 86 156 82 170 C74 176 67 174 65 166 C62 148 60 128 59 104 Z','dorsali')+M('M92 134 C96 150 98 170 99 204 C94 206 90 204 88 200 C86 180 86 156 92 134 Z','lombari')+
  M('M59 208 C56 222 58 242 68 252 C79 258 92 256 99 247 L99 214 C90 205 72 202 59 208 Z','glutei')+
  M('M57 256 C53 272 54 292 59 304 L72 304 C74 288 74 270 71 256 C67 252 60 252 57 256 Z','femorali')+M('M75 256 C77 272 79 290 78 304 L89 302 C94 286 96 268 93 256 C88 252 79 252 75 256 Z','femorali')+
  M('M56 318 C51 334 54 352 63 362 C69 352 70 334 69 316 C65 311 59 312 56 318 Z','polpacci')+M('M71 316 C73 332 75 350 71 364 C80 358 87 340 85 318 C81 311 75 311 71 316 Z','polpacci'));
 const svg='<svg viewBox="0 0 420 424" width="100%" style="max-width:'+(small?210:330)+'px;overflow:visible" role="img" aria-label="'+esc(label||'Mappa muscolare')+'"><defs><linearGradient id="'+gid+'" x1="0" y1="0" x2=".35" y2="1"><stop offset="0" stop-color="'+P.hi+'"/><stop offset=".55" stop-color="'+P.pri+'"/></linearGradient></defs>'+
  '<g>'+head+front+'</g><g transform="translate(220 0)">'+head+back+'</g>'+
  '<text x="100" y="421" text-anchor="middle" font-size="12" font-weight="600" letter-spacing="1.5" fill="'+P.txt+'">FRONTE</text><text x="320" y="421" text-anchor="middle" font-size="12" font-weight="600" letter-spacing="1.5" fill="'+P.txt+'">RETRO</text></svg>';
 if(small)return '<div class="stack" style="align-items:center">'+svg+'</div>';
 const ch=(arr,cls)=>arr.map(k=>'<span class="chip '+cls+'">'+MUSCLES[k]+'</span>').join('');
 const secOnly=sec.filter(k=>pri.indexOf(k)<0);
 return '<div class="stack" style="align-items:center;gap:14px">'+svg+
  '<div class="stack" style="width:100%;gap:8px"><div class="row wrap" style="gap:6px"><span class="xs muted" style="width:76px">Principali</span>'+ch(pri,'mus-p')+'</div>'+(secOnly.length?'<div class="row wrap" style="gap:6px"><span class="xs muted" style="width:76px">Secondari</span>'+ch(secOnly,'mus-s')+'</div>':'')+'<p class="xs muted">Coinvolgimento stimato, non una misura dello sforzo. Tocca un muscolo per il nome.</p></div></div>';
}
function niceStep(r){const p=Math.pow(10,Math.floor(Math.log10(r)));const n=r/p;return(n<=1?1:n<=2?2:n<=2.5?2.5:n<=5?5:10)*p;}
function lineChart(pts,unit,label){
 if(pts.length<2)return '<p class="muted small">Servono almeno due allenamenti per il grafico.</p>';
 const W=340,H=180,pl=34,pr=48,pt=14,pb=26;
 const ys=pts.map(p=>p.y);let lo=Math.min.apply(null,ys),hi=Math.max.apply(null,ys);if(lo===hi){lo-=1;hi+=1;}
 const step=niceStep((hi-lo)/3||1);lo=Math.max(0,Math.floor(lo/step)*step);hi=Math.ceil(hi/step)*step;
 const X=i=>pl+i*(W-pl-pr)/(pts.length-1),Y=v=>pt+(hi-v)/(hi-lo)*(H-pt-pb);
 let g='';for(let v=lo;v<=hi+1e-9;v+=step)g+='<line x1="'+pl+'" x2="'+(W-pr)+'" y1="'+Y(v)+'" y2="'+Y(v)+'" stroke="var(--line)"/><text x="'+(pl-6)+'" y="'+(Y(v)+3.5)+'" text-anchor="end" font-size="10" fill="var(--muted)">'+kgf(+v.toFixed(1))+'</text>';
 const line=pts.map((p,i)=>(i?'L':'M')+X(i).toFixed(1)+' '+Y(p.y).toFixed(1)).join(' ');
 const L=pts.length-1;const area=line+' L'+X(L)+' '+(H-pb)+' L'+X(0)+' '+(H-pb)+' Z';
 const gid='lg'+uid();
 const dots=pts.map((p,i)=>'<circle cx="'+X(i)+'" cy="'+Y(p.y)+'" r="'+(i===L?5:3)+'" fill="'+(i===L?'var(--accent-ink)':'var(--bg)')+'" stroke="var(--accent-ink)" stroke-width="2"/>').join('');
 const hits=pts.map((p,i)=>'<rect x="'+(X(i)-(W-pl-pr)/(2*L))+'" y="'+pt+'" width="'+((W-pl-pr)/L)+'" height="'+(H-pt-pb)+'" fill="transparent" data-tip="'+esc(p.x)+' · '+kgf(p.y)+' '+unit+'"/>').join('');
 const mid=Math.floor(L/2);const xl=[0,mid,L].filter((v,i,a)=>a.indexOf(v)===i).map(i=>'<text x="'+X(i)+'" y="'+(H-8)+'" text-anchor="middle" font-size="10" fill="var(--muted)">'+esc(pts[i].x)+'</text>').join('');
 return '<svg viewBox="0 0 '+W+' '+H+'" width="100%" role="img" aria-label="'+esc(label)+'"><defs><linearGradient id="'+gid+'" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="var(--accent)" stop-opacity=".55"/><stop offset="1" stop-color="var(--accent)" stop-opacity="0"/></linearGradient></defs>'+g+'<path d="'+area+'" fill="url(#'+gid+')"/><path d="'+line+'" fill="none" stroke="var(--accent-ink)" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"/>'+dots+xl+
  '<text x="'+(X(L)+9)+'" y="'+(Y(pts[L].y)+4)+'" font-size="11.5" font-weight="700" fill="var(--ink)">'+kgf(pts[L].y)+' '+unit+'</text>'+hits+'</svg>';
}
function barChart(rows,opts){ // rows [{x,y,tip,hl,soft}]
 const W=340,H=170,pl=28,pr=8,pt=18,pb=24;const mx=Math.max.apply(null,rows.map(r=>r.y).concat([1]));const step=niceStep(mx/3);const hi=Math.ceil(mx/step)*step;
 const bw=(W-pl-pr)/rows.length;const Y=v=>pt+(hi-v)/hi*(H-pt-pb);
 let g='';for(let v=0;v<=hi+1e-9;v+=step)g+='<line x1="'+pl+'" x2="'+(W-pr)+'" y1="'+Y(v)+'" y2="'+Y(v)+'" stroke="var(--line)"/><text x="'+(pl-6)+'" y="'+(Y(v)+3.5)+'" text-anchor="end" font-size="10" fill="var(--muted)">'+(opts&&opts.money?(v>=1000?(v/1000)+'k':v):v)+'</text>';
 const bars=rows.map((r,i)=>{const x=pl+i*bw+bw*.18,w=bw*.64,y=Y(r.y),h=Math.max(0,H-pb-y);const rr=Math.min(4,w/2,h);
  const path=h>0?'M'+x+' '+(H-pb)+'V'+(y+rr)+'Q'+x+' '+y+' '+(x+rr)+' '+y+'H'+(x+w-rr)+'Q'+(x+w)+' '+y+' '+(x+w)+' '+(y+rr)+'V'+(H-pb)+'Z':'';
  return '<g data-tip="'+esc(r.tip)+'"><rect x="'+(pl+i*bw)+'" y="'+pt+'" width="'+bw+'" height="'+(H-pt-pb)+'" fill="transparent"/><path d="'+path+'" fill="'+(r.hl?'var(--accent-ink)':'var(--accent)')+'" opacity="'+(r.soft?.45:1)+'"/>'+(r.hl||r.label?'<text x="'+(x+w/2)+'" y="'+(y-5)+'" text-anchor="middle" font-size="10.5" font-weight="700" fill="var(--ink)">'+esc(r.label||r.y)+'</text>':'')+'<text x="'+(x+w/2)+'" y="'+(H-8)+'" text-anchor="middle" font-size="10" fill="var(--muted)">'+esc(r.x)+'</text></g>';}).join('');
 return '<svg viewBox="0 0 '+W+' '+H+'" width="100%" role="img" aria-label="'+esc(opts&&opts.label||'Grafico a barre')+'">'+g+bars+'</svg>';
}
function sparkline(vals,w,h){w=w||84;h=h||28;const mx=Math.max.apply(null,vals),mn=Math.min.apply(null,vals);const X=i=>2+i*(w-4)/(vals.length-1),Y=v=>h-3-(v-mn)/((mx-mn)||1)*(h-6);
 const d=vals.map((v,i)=>(i?'L':'M')+X(i).toFixed(1)+' '+Y(v).toFixed(1)).join(' ');
 return '<svg width="'+w+'" height="'+h+'" viewBox="0 0 '+w+' '+h+'" aria-hidden="true"><path d="'+d+'" fill="none" stroke="var(--accent-ink)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><circle cx="'+X(vals.length-1)+'" cy="'+Y(vals[vals.length-1])+'" r="3" fill="var(--accent-ink)"/></svg>';}
function ring(p,size,stroke,col,inner){size=size||120;stroke=stroke||12;const r=(size-stroke)/2,c=2*Math.PI*r;const off=c*(1-Math.max(0,Math.min(1,p)));
 return '<svg width="'+size+'" height="'+size+'" viewBox="0 0 '+size+' '+size+'" role="img" aria-label="'+Math.round(p*100)+'%"><circle cx="'+size/2+'" cy="'+size/2+'" r="'+r+'" fill="none" stroke="'+(col&&col.track||'var(--line)')+'" stroke-width="'+stroke+'"/><circle class="ringarc" cx="'+size/2+'" cy="'+size/2+'" r="'+r+'" fill="none" stroke="'+(col&&col.fg||'url(#ringG)')+'" stroke-width="'+stroke+'" stroke-linecap="round" stroke-dasharray="'+c.toFixed(2)+'" stroke-dashoffset="'+(RM?off:c).toFixed(2)+'" data-off="'+off.toFixed(2)+'" transform="rotate(-90 '+size/2+' '+size/2+')" style="transition:stroke-dashoffset 1.1s cubic-bezier(.2,.7,.2,1)"/>'+(inner||'')+'</svg>';}
function donut(parts,sel){ // parts [{k,v,col,label}]
 const tot=parts.reduce((s,p)=>s+p.v,0)||1;const cx=110,cy=110,R=96,r=62;let a0=-Math.PI/2;
 const arc=(a,b)=>{const lg=b-a>Math.PI?1:0;const p=(rad,ang)=>[cx+rad*Math.cos(ang),cy+rad*Math.sin(ang)];const A1=p(R,a),A2=p(R,b),B1=p(r,b),B2=p(r,a);return 'M'+A1+'A'+R+' '+R+' 0 '+lg+' 1 '+A2+'L'+B1+'A'+r+' '+r+' 0 '+lg+' 0 '+B2+'Z';};
 const segs=parts.filter(p=>p.v>0).map(p=>{const a1=a0+p.v/tot*Math.PI*2;const d=parts.filter(x=>x.v>0).length===1?'M'+(cx)+' '+(cy-R)+'A'+R+' '+R+' 0 1 1 '+(cx-.01)+' '+(cy-R)+'L'+(cx-.01)+' '+(cy-r)+'A'+r+' '+r+' 0 1 0 '+cx+' '+(cy-r)+'Z':arc(a0,a1);a0=a1;
  return '<path class="donut-seg'+(sel&&sel!==p.k?' dim':'')+'" d="'+d+'" fill="'+p.col+'" stroke="var(--bg)" stroke-width="3" data-act="asrc" data-v="'+p.k+'" data-tip="'+esc(p.label+': '+p.v+' ('+pct(p.v,tot)+'%)')+'"/>';}).join('');
 const s=sel?parts.find(p=>p.k===sel):null;
 return '<svg viewBox="0 0 220 220" width="100%" style="max-width:220px" role="img" aria-label="Clienti per provenienza">'+segs+
  '<text x="110" y="106" text-anchor="middle" font-family="Archivo,system-ui" font-weight="850" font-size="34" fill="var(--ink)">'+(s?s.v:tot)+'</text><text x="110" y="128" text-anchor="middle" font-size="12" fill="var(--muted)">'+(s?esc(s.label):'clienti')+'</text></svg>';
}

/* ---------- elementi comuni ---------- */
function head(title,sub){return '<div class="pagehead"><button class="backb" data-act="back" aria-label="Indietro">'+ic('back')+'</button><div class="grow"><h1>'+title+'</h1>'+(sub?'<p class="muted small">'+sub+'</p>':'')+'</div></div>';}
const empty=t=>'<div class="note">'+ic('info',18)+'<span>'+t+'</span></div>';
const sec=(t,link)=>'<h2 class="sec"><span>'+t+'</span>'+(link||'')+'</h2>';
const cnt=(n,fmt)=>'<span data-count="'+n+'" data-fmt="'+(fmt||'int')+'">'+(fmt==='eur'?eur(n):nf(n))+'</span>';
const kpi=(v,l,extra,act)=>(act?'<button class="kpi" '+act+'>':'<div class="kpi">')+'<span class="v">'+v+'</span><span class="l">'+l+'</span>'+(extra||'')+(act?'</button>':'</div>');

/* ================= COACH ================= */
function vOggi(){
 const att=attention();const ur=unread();
 const today=S.db.appts.filter(a=>a.date===TODAY).sort((a,b)=>a.time<b.time?-1:1);
 const sh=S.db.shift;
 const pays=[];S.db.contracts.forEach(k=>{const c=client(k.clientId);k.inst.forEach(i=>{const st=instStatus(i);if(st.k==='scaduta'||st.k==='scadenza'||(st.k==='parziale'&&diff(TODAY,i.due)<=14))pays.push({k:k,c:c,i:i,st:st});});});
 pays.sort((a,b)=>a.i.due<b.i.due?-1:1);
 const w0=monday(TODAY);const wkMin=S.db.shifts.filter(r=>r.date>=w0).reduce((s,r)=>s+mins(r.out)-mins(r.in),0)+(sh?(Date.now()-sh.ts)/60000:0);
 const months=[mAdd(CM,-2),PM,CM];const allI=[];S.db.contracts.forEach(k=>k.inst.forEach(i=>allI.push(i)));const mv=months.map(m=>allI.filter(i=>i.paidOn&&i.paidOn.slice(0,7)===m).reduce((s,i)=>s+i.paid,0));
 let h='<div class="row between" style="align-items:flex-end"><div><h1 class="hello">Ciao Aelis</h1><p class="date">'+cap(fl(TODAY))+'</p></div><span class="av lg" aria-hidden="true">AE</span></div>';
 h+=installCard()+pushCard();
 h+='<section class="hero'+(sh?' night':'')+'">'+(sh?
   '<div class="row"><span class="pulse" aria-hidden="true"></span><div class="grow"><div class="k">Giornata in corso</div><h3>In palestra dalle '+sh.in+'</h3><p class="small muted" id="elapsed">'+dur((Date.now()-sh.ts)/60000)+' finora</p></div></div><button class="btn primary lg block" data-act="shift">'+ic('pause')+' Fine giornata</button>'
  :'<div><div class="k">Registro ore</div><h3>Pronta a iniziare?</h3><p class="small muted" style="margin-top:6px">Un tocco quando arrivi, uno quando esci: le ore si sommano da sole.</p></div><button class="btn primary lg block" data-act="shift">'+ic('play')+' Inizia giornata</button>')+'</section>';
 h+='<section class="stack">'+sec('Oggi in agenda','<button class="lnk" data-act="tab" data-v="agenda">Settimana</button>')+(today.length?'<div class="list">'+today.map(apptRow).join('')+'</div>':empty('Nessun appuntamento oggi.'))+'</section>';
 {const ai=aiWeekly();if(ai.length)h+='<section class="aisum"><div class="row between" style="align-items:flex-start"><div class="row"><span class="aiico">'+ic('bell',20)+'</span><div><div class="k">Promemoria</div><h3>Da fare oggi</h3></div></div></div><ol>'+ai.map(x=>'<li><span class="n '+x.c+'">'+ic(x.ic,16)+'</span><div><p>'+x.t+'</p>'+x.a+'</div></li>').join('')+'</ol><p class="xs muted">Calcolato dai dati dell\'app.</p></section>';}
 if(ur.length)h+='<section class="stack">'+sec('Da leggere','<span class="chip">'+ur.length+'</span>')+'<div class="list">'+ur.slice(0,3).map(m=>{const c=client(m.clientId);return '<button class="li" data-act="readMsg" data-id="'+m.id+'"><span class="av">'+(c?c.ini:'?')+'</span><span class="grow"><span class="t">'+esc(c?c.name:'')+'</span><br><span class="s">'+esc(m.text)+'</span></span><span class="s num">'+fd(m.date)+'</span></button>';}).join('')+'</div></section>';
 h+='<div class="grid3">'+kpi(cnt(today.filter(a=>a.status!=='annullato').length),'Appuntamenti oggi','','data-act="tab" data-v="agenda"')+kpi(dur(wkMin),'Ore questa settimana','','data-act="open" data-v="ore"')+kpi(cnt(mv[2],'eur'),'Incassi '+MN,sparkline(mv,70,22),'data-act="tab" data-v="numeri"')+'</div>';
 const feed=S.db.history.slice().sort((a,b)=>a.date<b.date?1:-1).slice(0,3);
 h+='<section class="stack">'+sec('Attività dei clienti')+feed.map(feedCard).join('')+'</section>';
 return h;
}
function feedCard(x){const c=client(x.clientId);const p=programOf(c);const ses=p?p.sessions.find(s=>s.key===x.key):null;const nSets=Object.keys(x.sets).reduce((s,k)=>s+x.sets[k].filter(z=>z.done).length,0);
 let prs=[];if(x.pr)prs=[x.pr];else Object.keys(x.sets).forEach(ex=>{if(exById(ex).mode==='Esterno'&&rankOf(c.id,x,ex)===1&&maxKg(c.id,ex,x.id)>0)prs.push(exById(ex).name+' '+kgf(sesMax(x,ex))+' kg');});
 return '<article class="feed"><div class="row"><span class="av">'+c.ini+srcDot(c.src)+'</span><div class="grow"><p style="font-weight:650">'+esc(c.name)+'</p><p class="xs muted">'+cap(fl(x.date))+' · '+(x.type==='coach'?'con Aelis':'in autonomia')+'</p></div>'+(x.feel?'<span class="chip">'+['','Dura','Così così','Bene','Benissimo','Al top'][x.feel]+'</span>':'')+'</div>'+
  '<h3 class="ft">'+(ses?(ses.name==='Seduta '+x.key?esc(ses.name):'Seduta '+x.key+' · '+esc(ses.name)):'Allenamento')+'</h3>'+
  (prs.length?'<div class="row" style="gap:8px">'+prMedal(1,30)+'<span class="small"><b>'+prs.length+' record</b> · '+esc(prs[0])+'</span></div>':'')+
  '<div class="stats"><div><b class="num">'+x.min+'\'</b><span>Durata</span></div><div><b class="num">'+nSets+'</b><span>Serie</span></div><div><b class="num">'+nf(volume(x.sets))+'</b><span>Volume kg</span></div></div>'+
  '<div class="row"><button class="btn sm kudos" aria-pressed="'+!!x.kudos+'" data-act="kudos" data-id="'+x.id+'">'+ic('clap',17)+(x.kudos?' Applauso inviato':' Applauso')+'</button><button class="btn sm ghost" data-act="openClient" data-id="'+c.id+'">Dossier</button></div></article>';}
function apptRow(a){
 const m=AT[a.type];const cls=a.status==='svolto'?'done':a.status==='annullato'?'cancel':'';
 const st=a.status==='svolto'?'<span class="chip good">Svolta</span>':a.status==='annullato'?'<span class="chip">Annullata</span>':a.status==='attesa'?'<span class="chip warn">Da confermare</span>':'';
 return '<button class="appt '+cls+'" data-act="apptOpen" data-id="'+a.id+'"><span class="tm">'+a.time+'</span><span class="stripe" style="background:var('+m.v+')"></span><span class="grow"><span class="t" style="font-weight:650">'+esc(apptTitle(a))+'</span><br><span class="small muted">'+m.l+' · '+a.dur+' min</span></span>'+st+'</button>';
}

function vClienti(){
 const q=S.ui.search.toLowerCase();const f=S.ui.cfilter;const sf=S.ui.csrc;
 const list=S.db.clients.filter(c=>(!q||c.name.toLowerCase().indexOf(q)>=0)&&(!sf||(sf==='none'?!c.src:c.src===sf))&&(f==='tutti'||(f==='attivi'&&c.status==='attivo')||(f==='sospesi'&&c.status==='sospeso')||(f==='completare'&&(!c.ob.q||!c.ob.foto||!c.ob.scheda))));
 let h='<div class="row between"><h1 class="h2">Clienti</h1><button class="btn sm primary" data-act="sheet" data-v="invite">'+ic('plus',16)+' Invita</button></div>';
 h+='<input class="in" id="search" type="search" placeholder="Cerca per nome" value="'+esc(S.ui.search)+'" data-bind="search" aria-label="Cerca cliente">';
 h+='<div class="tabs" role="group" aria-label="Stato">'+[['tutti','Tutti'],['attivi','Attivi'],['completare','Da completare'],['sospesi','Sospesi']].map(x=>'<button aria-pressed="'+(f===x[0])+'" data-act="cfilter" data-v="'+x[0]+'">'+x[1]+'</button>').join('')+'</div>';
 h+='<div class="tabs" role="group" aria-label="Provenienza"><button aria-pressed="'+(!sf)+'" data-act="csrc" data-v="">Ogni provenienza</button>'+SRCK.map(k=>'<button aria-pressed="'+(sf===k)+'" data-act="csrc" data-v="'+k+'"><span class="sw" style="background:var('+SRC[k].v+');border-radius:50%"></span>'+k+'</button>').join('')+'<button aria-pressed="'+(sf==='none')+'" data-act="csrc" data-v="none">Senza provenienza</button></div>';
 h+=list.length?'<div class="list">'+list.map(c=>{const k=contractOf(c);const cr=credits(k);const bs=badgeState(c.id).filter(b=>b.ok).length;
   const ob=[['q','Questionario'],['foto','Foto'],['scheda','Scheda']].map(o=>'<span class="chip '+(c.ob[o[0]]?'good':'warn')+'">'+(c.ob[o[0]]?'✓ ':'')+o[1]+'</span>').join('');
   return '<button class="li" data-act="openClient" data-id="'+c.id+'"><span class="av">'+c.ini+srcDot(c.src)+'</span><span class="grow stack" style="gap:5px"><span class="row between"><span class="t">'+esc(c.name)+'</span>'+(c.status==='sospeso'?'<span class="chip">Sospeso</span>':(k&&k.lessons?'<span class="small muted num">'+cr.total+' lezioni</span>':'<span class="small muted">Online</span>'))+'</span><span class="s">'+esc(k?k.name:'')+(c.src?' · '+c.src+(c.srcD?' ('+esc(c.srcD)+')':''):'')+'</span><span class="row wrap" style="gap:4px">'+ob+(bs?'<span class="chip pink">'+ic('trophy',12)+' '+bs+'</span>':'')+(c.src?'':'<span class="chip warn">Provenienza?</span>')+riskChip(risk(c))+'</span></span></button>';}).join('')+'</div>':empty('Nessun cliente con questi filtri.');
 if(S.db.invites.length)h+='<section class="stack">'+sec('Inviti inviati')+'<div class="list">'+S.db.invites.map(i=>'<div class="li"><span class="av">'+ic('send',16)+'</span><span class="grow"><span class="t">'+esc(i.name)+'</span><br><span class="s">'+esc(i.email)+' · '+fd(i.date)+(i.src?' · '+i.src:'')+'</span></span>'+invChip(i)+'</div>').join('')+'</div></section>';
 return h;
}

function srcPicker(c){
 return '<div class="card"><div class="row between"><h3>Come è arrivato/a</h3>'+srcChip(c.src)+'</div><div class="segbar" role="group" aria-label="Provenienza">'+SRCK.map(k=>'<button aria-pressed="'+(c.src===k)+'" data-act="setSrc" data-v="'+k+'"><span class="sw" style="background:var('+SRC[k].v+');border-radius:50%;margin-right:6px"></span>'+k+'</button>').join('')+'</div>'+
  (c.src?'<div class="row wrap" style="gap:6px">'+SRC[c.src].d.map(d=>'<button class="btn sm" aria-pressed="'+(c.srcD===d)+'" style="'+(c.srcD===d?'background:var(--ink);color:var(--bg);border-color:var(--ink)':'')+'" data-act="setSrcD" data-v="'+esc(d)+'">'+esc(d)+'</button>').join('')+'</div>':'<p class="small muted">Serve per capire quale canale porta più clienti: lo trovi in Numeri → Acquisizione.</p>')+'</div>';
}
/* ---------- chat interna ---------- */
function chatAll(){if(REAL)return AelisCloud.chatList();if(!S.db.chat)S.db.chat=[];return S.db.chat;}
const demoNow=()=>TODAY+'T'+hm(new Date())+':00';
const chatOf=cid=>chatAll().filter(m=>m.client_id===cid);
function chatUnreadFor(cid){const other=S.ui.role==='coach'?'client':'coach';return chatOf(cid).filter(m=>m.sender===other&&!m.read_at).length;}
function chatUnreadTotal(){if(S.ui.role==='coach')return chatAll().filter(m=>m.sender==='client'&&!m.read_at).length;const c=me();return c?chatUnreadFor(c.id):0;}
const ldate=iso=>{const d=new Date(iso);return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');};
const chatTime=iso=>{const d=new Date(iso);return hm(d);};
function chatDay(day){const t=TODAY;if(day===t)return 'Oggi';if(day===addDays(t,-1))return 'Ieri';return cap(fl(day));}
function chatCid(){return S.ui.role==='coach'?(S.ui.page&&S.ui.page.id):(me()&&me().id);}
function vChats(){
 let h=head('Messaggi','Chat private con i tuoi clienti');
 const rows=S.db.clients.map(c=>{const ms=chatOf(c.id);return {c:c,last:ms[ms.length-1],un:chatUnreadFor(c.id)};}).filter(x=>x.last||!REAL||AelisCloud.chatCanWrite(x.c.id));
 rows.sort((a,b)=>((b.last?b.last.created_at:'')>(a.last?a.last.created_at:''))?1:-1);
 if(!rows.length)return h+empty('Qui trovi le chat con i clienti che hanno l\'app. Invita un cliente dalla sezione Clienti per iniziare.');
 h+='<div class="list">'+rows.map(x=>'<button class="li" data-act="openChat" data-id="'+x.c.id+'"><span class="av">'+esc(x.c.ini)+'</span><span class="grow"><span class="t">'+esc(x.c.name)+'</span><br><span class="s one"'+(x.un?' style="color:var(--ink);font-weight:650"':'')+'>'+(x.last?(x.last.sender==='coach'?'Tu: ':'')+esc(x.last.body.slice(0,70)):'Nessun messaggio')+'</span></span>'+(x.un?'<span class="chip pink">'+x.un+'</span>':(x.last?'<span class="xs muted">'+(ldate(x.last.created_at)===TODAY?chatTime(x.last.created_at):fd(ldate(x.last.created_at)))+'</span>':''))+'</button>').join('')+'</div>';
 return h;
}
function vChat(){
 const coach=S.ui.role==='coach';const cid=chatCid();const c=client(cid);
 if(!c)return head('Chat','')+empty('Chat non disponibile.');
 const ms=chatOf(cid);
 let h=coach?head(esc(c.name),'Chat privata'):head('Aelis','La tua coach · chat privata');
 h+='<div class="chatlog" id="chatlog" aria-live="polite">';
 if(!ms.length)h+=empty(coach?'Scrivi il primo messaggio a '+esc(c.name.split(' ')[0])+'. Lo riceve anche come notifica, se le ha attivate.':'Scrivi ad Aelis: domande, dubbi, spostamenti. Ti risponde qui, senza bisogno di WhatsApp.');
 let lastDay='';
 ms.forEach(m=>{const day=ldate(m.created_at);if(day!==lastDay){h+='<p class="chatday">'+chatDay(day)+'</p>';lastDay=day;}
  const mine=m.sender===(coach?'coach':'client');
  h+='<div class="cmsg '+(mine?'me':'them')+'"><span>'+esc(m.body)+'</span><time>'+chatTime(m.created_at)+(mine&&m.read_at?' · letto':'')+'</time></div>';});
 h+='</div>';
 if(!REAL||AelisCloud.chatCanWrite(cid))h+='<div class="composer"><textarea class="in" id="chat-in" rows="1" maxlength="2000" placeholder="Scrivi un messaggio…" aria-label="Messaggio" data-bind="chatDraft">'+esc(S.ui.chatDraft||'')+'</textarea><button class="btn primary" data-act="chatSend" aria-label="Invia">'+ic('send',18)+'</button></div>';
 else h+=empty(esc(c.name.split(' ')[0])+' non ha ancora l\'app: invitalo dal suo profilo per chattare.');
 return h;
}
function chatAfterRender(){
 const pg=S.ui.page;if(!pg||(pg.name!=='chat'))return;
 const cid=chatCid();if(!cid)return;
 if(chatUnreadFor(cid)){if(REAL)AelisCloud.chatRead(cid).then(()=>updateChatBadge());else{const other=S.ui.role==='coach'?'client':'coach';chatOf(cid).forEach(m=>{if(m.sender===other&&!m.read_at)m.read_at=new Date().toISOString();});save();updateChatBadge();}}
 const log=document.getElementById('chatlog');if(log){const last=log.lastElementChild;if(last)last.scrollIntoView({block:'end'});window.scrollTo(0,document.body.scrollHeight);}
}
function updateChatBadge(){const b=document.getElementById('chatbtn');if(!b)return;const n=chatUnreadTotal();if(n)b.dataset.n=n>9?'9+':n;else delete b.dataset.n;b.setAttribute('aria-label',n?'Messaggi, '+n+' non letti':'Messaggi');}
function pushTo(cid,title,body,url){if(REAL&&window.AelisCloud)AelisCloud.notify(cid,title,body,url);}

/* ---------- installazione e notifiche ---------- */
let instEvt=null;window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();instEvt=e;if(REAL)render();});
const isStandalone=()=>(window.matchMedia&&matchMedia('(display-mode: standalone)').matches)||navigator.standalone===true;
const isIOSdev=()=>/iphone|ipad|ipod/i.test(navigator.userAgent)||(navigator.platform==='MacIntel'&&navigator.maxTouchPoints>1);
function dismissed(k){try{return localStorage.getItem('aelis-x-'+k)==='1';}catch(e){return false;}}
function installCard(){
 if(!REAL||isStandalone()||dismissed('inst'))return '';
 const ios=isIOSdev();if(!ios&&!instEvt)return '';
 return '<div class="card tip"><div class="row"><span class="av">'+ic('plus',18)+'</span><div class="grow"><h3>Mettila sul telefono</h3><p class="small muted">'+(ios?'In Safari tocca <b>Condividi</b> e poi <b>Aggiungi alla schermata Home</b>: si apre come un\'app, resti collegato/a e ricevi le notifiche.':'Installala come app: si apre a schermo intero, resti collegato/a e ricevi le notifiche.')+'</p></div><button class="xbtn" data-act="dismiss" data-v="inst" aria-label="Chiudi">'+ic('x',16)+'</button></div>'+(ios?'':'<button class="btn primary block" data-act="installApp">Installa l\'app</button>')+'</div>';
}
function pushLabel(){
 if(!REAL)return ['Notifiche','Nella versione reale arrivano sul telefono'];
 const st=AelisCloud.pushState();
 return ({on:['Notifiche attive','Su questo dispositivo · tocca per disattivare'],granted:['Attiva le notifiche','Messaggi, lezioni confermate, applausi'],default:['Attiva le notifiche','Messaggi, lezioni confermate, applausi'],denied:['Notifiche bloccate','Riattivale dalle impostazioni del telefono, alla voce di questo sito o app'],install:['Notifiche','Su iPhone arrivano solo con l\'app sulla schermata Home'],unsupported:['Notifiche','Questo browser non le supporta']})[st];
}
function pushCard(){
 if(!REAL||dismissed('push'))return '';const st=AelisCloud.pushState();if(st!=='default'&&st!=='granted')return '';
 const l=S.ui.role==='coach'?'Ti avvisiamo quando un cliente ti scrive, chiede una lezione o finisce un allenamento.':'Ti avvisiamo quando Aelis ti scrive, conferma una lezione o ti manda un applauso.';
 return '<div class="card tip"><div class="row"><span class="av">'+ic('bell',18)+'</span><div class="grow"><h3>Attiva le notifiche</h3><p class="small muted">'+l+'</p></div><button class="xbtn" data-act="dismiss" data-v="push" aria-label="Chiudi">'+ic('x',16)+'</button></div><button class="btn primary block" data-act="pushToggle">Attiva</button></div>';
}

/* ---------- Google Calendar (coach) ---------- */
function vCalendario(){
 let h=head('Google Calendar','Le tue lezioni nel tuo calendario');
 if(!REAL)return h+empty('Nella versione reale qui crei il collegamento privato al tuo Google Calendar.');
 const l=S.ui.calLink;
 h+='<div class="card stack"><p>Lezioni, prove e appuntamenti dell\'agenda compaiono da soli nel tuo Google Calendar, in un calendario chiamato <b>AELIS Training</b>. Le lezioni annullate spariscono, quelle da confermare hanno la scritta "Da confermare".</p>'+(l?'<input class="in linkbox" id="cal-url" readonly value="'+esc(l)+'" aria-label="Indirizzo del calendario"><button class="btn primary lg block" data-act="calCopy">Copia l\'indirizzo</button>':'<button class="btn primary lg block" data-act="calLink">'+ic('cal',18)+' Mostra il mio collegamento</button>')+'</div>';
 h+='<section class="stack">'+sec('Come aggiungerlo, una volta sola')+'<ol class="steps"><li>Premi <b>Copia l\'indirizzo</b>.</li><li>Dal <b>computer</b> apri <a href="https://calendar.google.com/calendar/u/0/r/settings/addbyurl" target="_blank" rel="noopener">Google Calendar → Aggiungi calendario → Da URL</a>. Dal telefono Google non lo permette.</li><li>Incolla l\'indirizzo e premi <b>Aggiungi calendario</b>.</li><li>In pochi minuti "AELIS Training" compare anche nell\'app Google Calendar del telefono.</li></ol></section>';
 h+=empty('Google aggiorna i calendari collegati da solo, di solito ogni qualche ora: una lezione appena spostata può comparire con un po\' di ritardo. Nell\'app è sempre aggiornata.');
 if(l)h+='<a class="btn block" href="'+esc(l.replace(/^https:/,'webcal:'))+'">Aggiungi al Calendario di iPhone</a><p class="xs muted">L\'indirizzo è privato: chi lo ha vede i nomi dei tuoi appuntamenti. Se l\'hai condiviso per errore, rigeneralo.</p><button class="btn sm danger" style="align-self:flex-start" data-act="calReset">Rigenera l\'indirizzo</button>';
 return h;
}

function invChip(i){if(!REAL||!i.cid)return '<span class="chip warn">In attesa</span>';const f=AelisCloud.inviteInfo(i.cid);if(!f)return '<span class="chip">Eliminato</span>';if(f.linked)return '<span class="chip good">Attivo</span>';return '<button class="btn sm" data-act="showLink" data-id="'+i.cid+'">'+(f.expired?'Nuovo link':'Link')+'</button>';}
function appCard(c){
 let st='',btn='';
 if(REAL){const f=AelisCloud.inviteInfo(c.id);
  if(!f){st='Non ha ancora l\'app';btn='<button class="btn sm primary" data-act="linkClient" data-id="'+c.id+'">Invita nell\'app</button>';}
  else if(f.linked){st='Usa l\'app con il suo account';}
  else{st=f.expired?'Invito scaduto':'Invito inviato, account non ancora creato';btn='<button class="btn sm" data-act="showLink" data-id="'+c.id+'">'+(f.expired?'Nuovo link':'Link d\'invito')+'</button>';}}
 else st='Nella versione reale qui vedi se ha creato l\'account';
 return '<div class="card"><div class="row between"><div><h3>Accesso all\'app</h3><p class="small muted">'+st+'</p></div>'+btn+'</div><button class="btn sm danger" style="align-self:flex-start" data-act="delAsk" data-id="'+c.id+'">Elimina cliente e dati</button></div>';
}
function vCliente(){
 const c=client(S.ui.page.id);const k=contractOf(c);const cr=credits(k);const t=S.ui.ctab;
 let h=head(esc(c.name),esc(c.goal));
 h+='<div class="row wrap" style="gap:6px"><span class="chip '+(c.status==='attivo'?'good':'')+'">'+cap(c.status)+'</span><span class="chip">'+esc(c.level)+'</span><span class="chip">Dal '+fd(c.since)+'</span>'+srcChip(c.src)+(k&&k.lessons?'<span class="chip pink num">'+cr.total+' lezioni</span>':'')+'<span class="chip pink">'+ic('leaf',12)+' Fase '+stageOf(c.id).s.n+'</span>'+riskChip(risk(c))+'</div>';
 h+='<div class="tabs" role="group" aria-label="Sezioni dossier">'+[['profilo','Profilo'],['scheda','Scheda'],['allenamenti','Allenamenti'],['percorso','Percorso'],['check','Check e misure'],['note','Note']].map(x=>'<button aria-pressed="'+(t===x[0])+'" data-act="ctab" data-v="'+x[0]+'">'+x[1]+'</button>').join('')+'</div>';
 if(t==='profilo'){
  {const r=risk(c);if(r.lvl!=='basso')h+='<div class="card" style="border-color:'+(r.lvl==='alto'?'var(--crit)':'var(--warn)')+'"><div class="row between"><h3>Rischio abbandono '+r.lvl+'</h3><span class="num small muted">'+r.sc+'/100</span></div><div class="meter"><i style="width:'+r.sc+'%;background:'+(r.lvl==='alto'?'var(--crit)':'var(--warn)')+'"></i></div><ul class="small" style="margin:0;padding-left:18px">'+r.why.map(w=>'<li>'+esc(w)+'</li>').join('')+'</ul><button class="btn sm primary" style="align-self:flex-start" data-act="sheet" data-v="nudge" data-id="'+c.id+'">'+ic('send',14)+' Prepara un messaggio</button></div>';}
  h+=srcPicker(c);
  const bs=badgeState(c.id).filter(b=>b.ok);
  if(bs.length)h+='<div class="card"><div class="row between"><h3>Trofei di '+esc(c.name.split(' ')[0])+'</h3><span class="chip pink">'+bs.length+' di '+BADGES.length+'</span></div><div class="shelf">'+bs.map(b=>'<div class="badge">'+medal(b,52)+'<span class="bn">'+esc(b.n)+'</span></div>').join('')+'</div></div>';
  h+='<div class="card"><div class="grid2"><div><p class="xs muted">Obiettivo</p><p>'+esc(c.goal)+'</p></div><div><p class="xs muted">Disponibilità</p><p>'+esc(c.avail||'–')+'</p></div><div><p class="xs muted">Età</p><p>'+(c.age?c.age+' anni':'–')+'</p></div><div><p class="xs muted">Email</p><p style="overflow-wrap:anywhere">'+esc(c.email)+'</p></div></div><button class="btn sm" style="align-self:flex-start" data-act="viewAs" data-id="'+c.id+'">'+ic('user',16)+' Vedi l\'app come '+esc(c.name.split(' ')[0])+'</button></div>';
  h+='<div class="card flat"><div class="row between"><h3>Limitazioni e anamnesi</h3><span class="chip">'+ic('lock',13)+' Solo coach</span></div><p>'+esc(c.limits)+'</p><p class="xs muted">Dato sanitario: visibile solo a te, mai al cliente né alla community.</p></div>';
  h+='<section class="stack">'+sec('Avvio del percorso')+'<div class="list">'+[['q','Questionario iniziale','Compilato dal cliente'],['foto','Foto e misure iniziali','Alla prima lezione'],['scheda','Scheda assegnata','Dalla libreria esercizi']].map(o=>'<button class="li" data-act="obToggle" data-k="'+o[0]+'"><span class="tick" aria-pressed="'+(!!c.ob[o[0]])+'">'+ic('check',18)+'</span><span class="grow"><span class="t">'+o[1]+'</span><br><span class="s">'+o[2]+'</span></span></button>').join('')+'</div></section>';
  h+=appCard(c);
  if(c.answers.length)h+='<section class="stack">'+sec('Risposte al questionario')+'<div class="list">'+c.answers.map(a=>'<div class="li"><span class="grow"><span class="s">'+esc(a[0])+'</span><br><span>'+esc(a[1])+'</span></span></div>').join('')+'</div></section>';
 }
 if(t==='scheda'){
  const p=programOf(c);
  if(!p)h+=empty('Nessuna scheda assegnata.')+'<button class="btn primary block" data-act="editProg" data-id="'+c.id+'">'+ic('plus',18)+' Crea la scheda</button>';
  else{
   h+='<div class="row between"><p class="small muted">Versione '+p.version+' · assegnata il '+fd(p.assigned)+'</p><button class="btn sm" data-act="editProg" data-id="'+c.id+'">'+ic('edit',16)+' Modifica</button></div>';
   p.sessions.forEach(s=>{h+='<div class="card"><div class="row between"><h3>Seduta '+s.key+' · '+esc(s.name)+'</h3><span class="chip">'+s.items.length+' esercizi</span></div><table class="tbl"><tbody>'+s.items.map(it=>{const e=exById(it.ex);return '<tr><td style="padding-left:0">'+esc(e.name)+(it.alt.length?'<br><span class="xs muted">Alternative: '+it.alt.map(a=>esc(exById(a).name)).join(', ')+'</span>':'')+'</td><td class="num r" style="white-space:nowrap;padding-right:0">'+it.sets+' × '+it.rmin+'–'+it.rmax+'<br><span class="xs muted">rec '+it.rest+'" · RIR '+it.rir+'</span></td></tr>';}).join('')+'</tbody></table></div>';});
   h+=empty('Ogni modifica salva una nuova versione: gli allenamenti passati restano legati alla scheda di quel giorno.');
  }
 }
 if(t==='allenamenti'){
  const hs=histOf(c.id).slice().reverse();
  if(!hs.length)h+=empty('Ancora nessun allenamento registrato.');
  else{
   const exs=[];hs.forEach(x=>Object.keys(x.sets).forEach(e=>{if(exs.indexOf(e)<0&&exById(e).mode==='Esterno')exs.push(e);}));
   const ex=exs.indexOf(S.ui.chartEx)>=0?S.ui.chartEx:exs[0];const pts=histOf(c.id).filter(x=>x.sets[ex]).map(x=>({x:fd(x.date),y:sesMax(x,ex)}));
   h+='<div class="card"><div class="row between wrap"><h3>Progressione</h3><select class="in" style="width:auto;max-width:100%" data-bind="chartEx" aria-label="Esercizio">'+exs.map(e=>'<option value="'+e+'"'+(e===ex?' selected':'')+'>'+esc(exById(e).name)+'</option>').join('')+'</select></div>'+lineChart(pts,'kg','Carico massimo per seduta')+'<p class="xs muted">Carico più alto di ogni seduta. Tocca un punto per il valore.</p></div>';
   h+=hs.slice(0,5).map(feedCard).join('');
  }
 }
 if(t==='percorso'){
  if(!k)h+=empty('Nessun percorso.');
  else{
   h+='<div class="card"><div class="row between"><h3>'+esc(k.name)+'</h3><span class="chip '+(k.status==='attivo'?'good':'warn')+'">'+cap(k.status)+'</span></div><p class="small muted num">Dal '+fd(k.start)+' al '+fd(k.end)+(k.status==='sospeso'?' · sospeso dal '+fd(k.suspendedOn):'')+' · valore '+eur(k.price)+'</p>';
   if(k.lessons){const used=k.mov.filter(m=>m.delta<0).reduce((s,m)=>s-m.delta,0);const tot=used+cr.total;h+='<div class="row" style="gap:16px">'+ring(tot?used/tot:0,96,10,null,'<text x="48" y="50" text-anchor="middle" font-family="Archivo,system-ui" font-weight="850" font-size="22" fill="var(--ink)">'+cr.total+'</text><text x="48" y="66" text-anchor="middle" font-size="10" fill="var(--muted)">rimaste</text>')+'<div class="stack" style="gap:4px"><p><b>'+used+'</b> lezioni svolte su '+tot+'</p><p class="small muted">'+cr.gift+' omaggio · '+cr.paid+' incluse</p><p class="xs muted">Le omaggio si usano per prime.</p></div></div>';}
   h+='<div class="row wrap" style="gap:6px"><button class="btn sm" data-act="sheet" data-v="proroga">Proroga</button><button class="btn sm" data-act="suspend">'+(k.status==='sospeso'?'Riattiva':'Sospendi')+'</button>'+(k.lessons?'<button class="btn sm" data-act="sheet" data-v="rettifica">Rettifica lezioni</button>':'')+'</div></div>';
   h+='<section class="stack">'+sec('Rate')+'<div class="list">'+k.inst.map(i=>{const st=instStatus(i);return '<button class="li" data-act="payOpen" data-k="'+k.id+'" data-n="'+i.n+'"><span class="grow"><span class="t num">Rata '+i.n+' · '+eur(i.amount)+'</span><br><span class="s">'+(i.paidOn?'Pagata il '+fd(i.paidOn)+(i.method?' · '+i.method:''):'Scadenza '+fd(i.due))+'</span></span><span class="chip '+st.c+'">'+st.l+'</span></button>';}).join('')+'</div></section>';
   if(k.lessons)h+='<section class="stack">'+sec('Registro lezioni')+'<div class="list">'+k.mov.slice().reverse().map(m=>'<div class="li"><span class="chip '+(m.delta>0?'good':'')+' num" style="min-width:44px;justify-content:center">'+(m.delta>0?'+':'')+m.delta+'</span><span class="grow"><span>'+esc(m.reason)+'</span><br><span class="s">'+fd(m.date)+' · '+(m.type==='omaggio'?'omaggio':'incluse')+' · '+esc(m.by)+'</span></span></div>').join('')+'</div></section>';
   if(k.adj.length)h+='<section class="stack">'+sec('Proroghe e sospensioni')+'<div class="list">'+k.adj.map(a=>'<div class="li"><span class="grow"><span>'+esc(a.reason)+'</span><br><span class="s">'+fd(a.date)+(a.neu?' · da '+fd(a.old)+' a '+fd(a.neu):'')+'</span></span></div>').join('')+'</div></section>';
   h+=empty('Registro di incassi e lezioni. Ricevute e fatture restano dove le emetti oggi.');
  }
 }
 if(t==='check'){
  const ch=S.db.checks.filter(x=>x.clientId===c.id);
  h+='<section class="stack">'+sec('Check benessere '+ph('P1'))+(ch.length?ch.slice(0,3).map(x=>'<div class="card"><div class="row between"><h3>'+fd(x.date)+'</h3><span class="xs muted">scala 1–5</span></div>'+Object.keys(CHECKQ).map(q=>'<div class="row"><span class="small" style="width:132px">'+CHECKQ[q].l+'</span><span class="bar grow"><i style="width:'+(x.v[q]*20)+'%"></i></span><span class="num small" style="width:14px">'+x.v[q]+'</span></div>').join('')+(x.note?'<p class="quote">'+esc(x.note)+'</p>':'')+'</div>').join(''):empty('Nessun check inviato.'))+'</section>';
  const ms=S.db.measures.filter(m=>m.clientId===c.id);
  h+='<section class="stack">'+sec('Misure')+(ms.length?'<div class="card scroll"><table class="tbl"><thead><tr><th>Data</th><th>Peso kg</th><th>Vita</th><th>Fianchi</th><th>Coscia dx/sx</th></tr></thead><tbody>'+ms.map(m=>'<tr><td>'+fd(m.date)+'</td><td>'+kgf(m.peso)+'</td><td>'+kgf(m.vita)+'</td><td>'+kgf(m.fianchi)+'</td><td>'+kgf(m.cosciaDx)+' / '+kgf(m.cosciaSx)+'</td></tr>').join('')+'</tbody></table></div>':empty('Misure non ancora registrate.'))+'<button class="btn" data-act="sheet" data-v="misure">'+ic('plus',16)+' Aggiungi misure</button></section>';
  h+='<section class="stack">'+sec('Foto dei progressi')+'<div class="grid2"><div class="photo">Mese 1<br>foto privata</div><div class="photo">Mese 2<br>foto privata</div></div><p class="xs muted">'+(c.showPhotos?'Il cliente ha scelto di vedere i confronti nell\'app.':'Il cliente ha scelto di non vedere i confronti. Può sempre chiedere i suoi dati.')+'</p></section>';
 }
 if(t==='note'){
  h+='<div class="card"><div class="row between"><h3>Note private</h3><span class="chip">'+ic('lock',13)+' Solo coach</span></div><textarea class="in" id="cnotes" data-bind="cnotes" aria-label="Note private">'+esc(c.notes)+'</textarea><p class="xs muted">Si salvano da sole. Il cliente non le vede mai.</p></div>';
  h+='<div class="card"><h3>Messaggio di oggi per '+esc(c.name.split(' ')[0])+'</h3><p class="xs muted">Compare nella sua home prima dell\'allenamento.</p><textarea class="in" id="cmsg" data-bind="cmsg" aria-label="Messaggio">'+esc(S.db.coachMsg[c.id]||'')+'</textarea></div>';
 }
 return h;
}

function vEditProg(){
 const c=client(S.ui.page.id);const e=S.ui.editProg;
 let h=head('Scheda di '+esc(c.name.split(' ')[0]),'Bozza · versione '+e.version);
 h+='<div class="tabs" role="group" aria-label="Sedute">'+e.sessions.map((s,i)=>'<button aria-pressed="'+(e.sel===i)+'" data-act="epSel" data-v="'+i+'">Seduta '+s.key+'</button>').join('')+'<button data-act="epAddSes" aria-label="Aggiungi seduta">'+ic('plus',14)+'</button></div>';
 const s=e.sessions[e.sel];
 h+='<label class="f">Nome della seduta<input class="in" id="ep-name" data-bind="epName" value="'+esc(s.name)+'"></label>';
 h+=s.items.map((it,j)=>{const x=exById(it.ex);return '<div class="ex"><div class="row between"><h3 class="grow">'+esc(x.name)+'</h3><button class="btn sm ghost danger" data-act="epDel" data-v="'+j+'" aria-label="Rimuovi">'+ic('x',16)+'</button></div><div class="grid2" style="grid-template-columns:repeat(4,minmax(0,1fr))">'+
  [['sets','Serie'],['rmin','Rip. min'],['rmax','Rip. max'],['rest','Rec. s']].map(f=>'<label class="f">'+f[1]+'<input class="in num" type="number" inputmode="numeric" id="ep-'+j+'-'+f[0]+'" data-ep="'+j+','+f[0]+'" value="'+it[f[0]]+'"></label>').join('')+'</div><p class="xs muted">'+esc(x.note)+'</p></div>';}).join('');
 if(!s.items.length)h+=empty('Aggiungi il primo esercizio dalla libreria.');
 h+='<label class="f">Aggiungi esercizio dalla libreria<select class="in" id="ep-add" data-bind="epAdd"><option value="">Scegli…</option>'+allEx().map(x=>'<option value="'+x.id+'">'+esc(x.name)+'</option>').join('')+'</select></label>';
 h+='<button class="btn primary lg block" data-act="epSave">'+ic('check',18)+' '+(e.ai?'Approva e assegna':'Salva e assegna')+'</button>';
 return h;
}

function vAgenda(){
 const w0=monday(S.ui.day);
 let h='<div class="row between"><h1 class="h2">Agenda</h1><button class="btn sm primary" data-act="sheet" data-v="newAppt">'+ic('plus',16)+' Nuovo</button></div>';
 const req=S.db.requests.filter(r=>r.status==='attesa');
 if(req.length)h+='<section class="stack">'+sec('Richieste da approvare','<span class="chip warn">'+req.length+'</span>')+req.map(r=>{const c=client(r.clientId);return '<div class="card pink"><div class="row"><span class="av" style="background:var(--bg)">'+c.ini+'</span><div class="grow"><p style="font-weight:650">'+esc(c.name)+'</p><p class="small">'+cap(fl(r.date))+': '+(r.from?'dalle '+r.from+' alle '+r.to:'nuova lezione alle '+r.to)+'</p></div></div><p class="quote small">'+esc(r.note)+'</p><div class="row"><button class="btn sm primary" data-act="reqOk" data-id="'+r.id+'">Approva</button><button class="btn sm" data-act="reqNo" data-id="'+r.id+'">Rifiuta</button></div></div>';}).join('')+'</section>';
 h+='<div class="row between"><button class="btn sm" data-act="week" data-v="-7" aria-label="Settimana precedente">'+ic('back',16)+'</button><span class="small" style="font-weight:650">'+fd(w0)+' – '+fd(addDays(w0,6))+'</span><button class="btn sm" data-act="week" data-v="7" aria-label="Settimana successiva">'+ic('chev',16)+'</button></div>';
 h+='<div class="week">';for(let i=0;i<7;i++){const d=addDays(w0,i);const as=S.db.appts.filter(a=>a.date===d&&a.status!=='annullato');h+='<button aria-pressed="'+(d===S.ui.day)+'" class="'+(d===TODAY?'today':'')+'" data-act="day" data-v="'+d+'"><span class="d">'+GGS[D(d).getDay()]+'</span><span class="n">'+D(d).getDate()+'</span><span class="dots">'+as.slice(0,4).map(a=>'<i style="background:var('+AT[a.type].v+')"></i>').join('')+'</span></button>';}h+='</div>';
 const list=S.db.appts.filter(a=>a.date===S.ui.day).sort((a,b)=>a.time<b.time?-1:1);
 h+='<section class="stack">'+sec(cap(fl(S.ui.day)),'<span class="small muted num">'+dur(list.filter(a=>a.status!=='annullato'&&a.type!=='personale').reduce((s,a)=>s+a.dur,0))+' di lavoro</span>')+(list.length?'<div class="list">'+list.map(apptRow).join('')+'</div>':empty('Giornata libera.'))+'</section>';
 h+='<div class="row wrap xs muted" style="gap:12px">'+Object.keys(AT).map(k=>'<span class="row" style="gap:5px"><i class="sw" style="background:var('+AT[k].v+')"></i>'+AT[k].l+'</span>').join('')+'</div>';
 h+=empty('I clienti vedono gli impegni personali solo come “occupato”.');
 return h;
}

/* ---------- NUMERI ---------- */
function allInst(){const a=[];S.db.contracts.forEach(k=>k.inst.forEach(i=>a.push({k:k,c:client(k.clientId),i:i,st:instStatus(i)})));return a;}
function vNumeri(){
 const t=S.ui.ntab;
 let h='<h1 class="h2">Numeri</h1><div class="segbar" role="group" aria-label="Sezione">'+[['panoramica','Panoramica'],['acquisizione','Acquisizione'],['incassi','Incassi']].map(x=>'<button aria-pressed="'+(t===x[0])+'" data-act="numeri" data-v="'+x[0]+'">'+x[1]+'</button>').join('')+'</div>';
 if(t==='panoramica')h+=nPanoramica();if(t==='acquisizione')h+=nAcquisizione();if(t==='incassi')h+=nIncassi();
 return h;
}
function nPanoramica(){
 const act=S.db.clients.filter(c=>c.status==='attivo').length;const newOct=S.db.clients.filter(c=>(c.since||'').slice(0,7)===CM).length;
 const wk=weeklyPT();const last=wk[wk.length-1].pt,prev=wk[wk.length-2].pt;
 const curW=monday(TODAY);const curDone=S.db.appts.filter(a=>a.type==='pt'&&a.date>=curW&&a.status==='svolto').length;const curPlan=S.db.appts.filter(a=>a.type==='pt'&&a.date>=curW&&a.date<addDays(curW,7)&&a.status!=='annullato').length;
 const all=allInst();const oct=all.filter(x=>x.i.paidOn&&x.i.paidOn.slice(0,7)===CM).reduce((s,x)=>s+x.i.paid,0),sep=all.filter(x=>x.i.paidOn&&x.i.paidOn.slice(0,7)===PM).reduce((s,x)=>s+x.i.paid,0);
 const auto=S.db.history.filter(x=>x.type==='autonomo'&&x.date>=addDays(TODAY,-14)).length;
 const dl=(a,b,u)=>{const d=a-b;return '<span class="delta '+(d>=0?'up':'down')+'">'+(d>=0?'▲ ':'▼ ')+(u==='eur'?eur(Math.abs(d)):Math.abs(d))+' vs prima</span>';};
 let h='<div class="grid2">'+kpi(cnt(act),'Clienti attivi','<span class="delta up">+'+newOct+' nuovi a '+MN+'</span>','data-act="tab" data-v="clienti"')+kpi(cnt(last),'Lezioni PT sett. scorsa',dl(last,prev))+kpi(cnt(oct,'eur'),'Incassi '+MN,dl(oct,sep,'eur'),'data-act="numeri" data-v="incassi"')+kpi(cnt(auto),'Allenamenti autonomi in 14 gg','<span class="delta" style="color:var(--muted)">registrati dai clienti</span>')+'</div>';
 const rows=wk.map((w,i)=>({x:D(w.w).getDate()+'/'+(D(w.w).getMonth()+1),y:w.pt,tip:'Settimana del '+fd(w.w)+': '+w.pt+' lezioni',hl:i===wk.length-1}));
 rows.push({x:'ora',y:curDone,tip:'Questa settimana: '+curDone+' svolte su '+curPlan+' previste',soft:true,label:curDone+'/'+curPlan});
 h+='<div class="card"><div class="row between"><h3>Lezioni PT a settimana</h3><span class="xs muted">tocca le barre</span></div>'+barChart(rows,{label:'Lezioni PT a settimana'})+'<p class="xs muted">L\'ultima barra è la settimana in corso: svolte su previste.</p></div>';
 // ore
 const days=[];for(let i=0;i<14;i++){const d=addDays(addDays(curW,-7),i);const r=S.db.shifts.find(s=>s.date===d);days.push({d:d,m:r?mins(r.out)-mins(r.in):0});}
 h+='<div class="card"><div class="row between"><h3>Ore in palestra</h3><button class="btn sm ghost" data-act="open" data-v="ore">Registro</button></div>'+barChart(days.map(x=>({x:GGS[D(x.d).getDay()].charAt(0).toUpperCase(),y:Math.round(x.m/6)/10,tip:cap(fl(x.d))+': '+(x.m?dur(x.m):'nessuna timbratura'),hl:x.d===TODAY})),{label:'Ore al giorno'})+'<p class="xs muted">Ultime due settimane, ore al giorno.</p></div>';
 return h;
}
function funnelFor(src,since){
 const inP=d=>!since||d>=since;
 const leads=S.db.leads.filter(l=>(!src||l.src===src)&&inP(l.contacted));const cl=S.db.clients.filter(c=>(!src||c.src===src)&&inP(c.since));
 const contatti=leads.length+cl.length;const prove=leads.filter(l=>l.free&&(l.stage==='svolta'||l.stage==='perso'||l.stage==='cliente')).length+cl.length;const clienti=cl.length+leads.filter(l=>l.stage==='cliente').length;
 const valore=cl.reduce((s,c)=>{const k=contractOf(c);return s+(k?k.price:0);},0);
 return{contatti:contatti,prove:prove,clienti:clienti,valore:valore,cl:cl};
}
function nAcquisizione(){
 const per=S.ui.aperiod;const since=per==='30'?addDays(TODAY,-30):per==='90'?addDays(TODAY,-90):null;const sel=S.ui.asrc;
 const parts=SRCK.map(k=>({k:k,v:S.db.clients.filter(c=>c.src===k&&(!since||c.since>=since)).length,col:'var('+SRC[k].v+')',label:k}));
 const tot=parts.reduce((s,p)=>s+p.v,0);
 let h='<div class="tabs" role="group" aria-label="Periodo">'+[['tutto','Da sempre'],['90','Ultimi 90 giorni'],['30','Ultimi 30 giorni']].map(x=>'<button aria-pressed="'+(per===x[0])+'" data-act="aperiod" data-v="'+x[0]+'">'+x[1]+'</button>').join('')+'</div>';
 const best=parts.slice().sort((a,b)=>b.v-a.v)[0];
 h+='<div class="card"><div><h3>Da dove arrivano i clienti</h3><p class="small muted">'+(tot?'<b>'+best.k+'</b> porta più clienti: '+best.v+' su '+tot+' ('+pct(best.v,tot)+'%).':'Nessun cliente nel periodo.')+'</p></div>';
 h+='<div class="row wrap" style="justify-content:center;gap:18px"><div style="flex:0 1 200px;min-width:160px">'+donut(parts,sel)+'</div><div class="stack" style="flex:1 1 140px;gap:6px">'+parts.map(p=>'<button class="li" style="border:1px solid var(--line);border-radius:12px;padding:9px 11px;'+(sel&&sel!==p.k?'opacity:.5':'')+'" data-act="asrc" data-v="'+p.k+'" aria-pressed="'+(sel===p.k)+'"><span class="sw" style="background:'+p.col+';width:12px;height:12px;border-radius:50%"></span><span class="grow t">'+p.k+'</span><span class="num" style="font-weight:750">'+p.v+'</span><span class="xs muted num" style="width:34px;text-align:right">'+pct(p.v,tot)+'%</span></button>').join('')+'</div></div>';
 h+='<p class="xs muted" style="text-align:center">Tocca una fetta o una riga per filtrare'+(sel?' · <button class="btn sm ghost" style="min-height:0;padding:0" data-act="asrc" data-v="'+sel+'">mostra tutte</button>':'')+'</p></div>';
 // funnel
 const f=funnelFor(sel,since);const steps=[['Contatti',f.contatti],['Lezione di prova',f.prove],['Diventati clienti',f.clienti]];const mx=Math.max(1,f.contatti);
 h+='<div class="card"><div class="row between"><h3>Dal contatto al cliente</h3><span class="chip">'+(sel||'Tutti i canali')+'</span></div>'+steps.map((s,i)=>'<div class="stack" style="gap:4px"><div class="row between small"><span>'+s[0]+'</span><span class="num" style="font-weight:750">'+s[1]+(i?' <span class="xs muted">· '+pct(s[1],steps[i-1][1])+'% del passaggio prima</span>':'')+'</span></div><div class="bar" style="height:14px;border-radius:7px" data-tip="'+s[0]+': '+s[1]+'"><i style="width:'+pct(s[1],mx)+'%;background:'+(sel?'var('+SRC[sel].v+')':'var(--accent-ink)')+';border-radius:7px"></i></div></div>').join('')+'<p class="small"><b>'+pct(f.clienti,f.contatti)+'%</b> dei contatti diventa cliente'+(sel?' da '+sel:'')+'.</p></div>';
 // tabella per canale
 const rowsT=SRCK.map(k=>{const x=funnelFor(k,since);return{k:k,x:x};});
 h+='<div class="card scroll"><h3>Confronto canali</h3><table class="tbl"><thead><tr><th>Canale</th><th class="r">Contatti</th><th class="r">Clienti</th><th class="r">Conv.</th><th class="r">Valore</th></tr></thead><tbody>'+rowsT.map(r=>'<tr><td><span class="row" style="gap:6px"><span class="sw" style="background:var('+SRC[r.k].v+');border-radius:50%"></span>'+r.k+'</span></td><td class="r">'+r.x.contatti+'</td><td class="r">'+r.x.clienti+'</td><td class="r">'+pct(r.x.clienti,r.x.contatti)+'%</td><td class="r">'+eur(r.x.valore)+'</td></tr>').join('')+'</tbody></table><p class="xs muted">Valore = somma dei percorsi venduti ai clienti di quel canale.</p></div>';
 // dettagli
 const det={};S.db.clients.filter(c=>(!sel||c.src===sel)&&c.src&&(!since||c.since>=since)).forEach(c=>{const kk=c.src+' · '+(c.srcD||'non indicato');det[kk]=(det[kk]||0)+1;});
 const dk=Object.keys(det).sort((a,b)=>det[b]-det[a]);
 if(dk.length)h+='<div class="card"><h3>Nel dettaglio</h3>'+dk.map(k=>'<div class="row"><span class="small grow">'+esc(k)+'</span><span class="bar" style="width:40%"><i style="width:'+pct(det[k],det[dk[0]])+'%;background:var('+SRC[k.split(' · ')[0]].v+')"></i></span><span class="num small" style="width:18px;text-align:right">'+det[k]+'</span></div>').join('')+'</div>';
 const miss=S.db.clients.filter(c=>!c.src);
 if(miss.length)h+='<div class="card pink"><h3>'+miss.length+' cliente senza provenienza</h3>'+miss.map(c=>'<div class="stack" style="gap:8px"><p class="small"><b>'+esc(c.name)+'</b>: da dove è arrivato?</p><div class="segbar">'+SRCK.map(k=>'<button data-act="quickSrc" data-id="'+c.id+'" data-v="'+k+'">'+k+'</button>').join('')+'</div></div>').join('')+'</div>';
 h+='<button class="btn" data-act="open" data-v="contatti">'+ic('target',16)+' Vai ai contatti e alle prove</button>';
 return h;
}
function nIncassi(){
 const all=allInst();
 const inc=all.filter(x=>x.i.paidOn&&x.i.paidOn.slice(0,7)===CM).reduce((s,x)=>s+x.i.paid,0);
 const due30=all.filter(x=>x.st.k!=='pagata'&&diff(TODAY,x.i.due)<=30&&diff(TODAY,x.i.due)>=0).reduce((s,x)=>s+x.i.amount-x.i.paid,0);
 const over=all.filter(x=>x.st.k==='scaduta').reduce((s,x)=>s+x.i.amount-x.i.paid,0);
 const months=[mAdd(CM,-2),PM,CM,mAdd(CM,1),mAdd(CM,2)];
 let h='<div class="grid3">'+kpi(cnt(inc,'eur'),'Incassato a '+MN)+kpi(cnt(due30,'eur'),'Da incassare in 30 gg')+kpi('<span style="color:'+(over?'var(--crit)':'inherit')+'">'+eur(over)+'</span>','Scaduto')+'</div>';
 const rows=months.map(m=>{const paid=all.filter(x=>x.i.paidOn&&x.i.paidOn.slice(0,7)===m).reduce((s,x)=>s+x.i.paid,0);const exp=all.filter(x=>x.i.due.slice(0,7)===m&&x.st.k!=='pagata').reduce((s,x)=>s+x.i.amount-x.i.paid,0);const fut=m>CM;const nm=cap(MESI[+m.slice(5)-1].slice(0,3));
  return{x:nm,y:fut?exp:paid,label:eur(fut?exp:paid),soft:fut,hl:m===CM,tip:nm+': '+(fut?'previsti '+eur(exp):'incassati '+eur(paid)+(exp?' · da incassare '+eur(exp):''))};});
 h+='<div class="card"><div class="row between"><h3>Incassi per mese</h3><span class="xs muted">chiari = previsti</span></div>'+barChart(rows,{money:true,label:'Incassi per mese'})+'</div>';
 const order={scaduta:0,scadenza:1,parziale:2,programma:3,pagata:4};
 const open=all.filter(x=>x.st.k!=='pagata').sort((a,b)=>order[a.st.k]-order[b.st.k]||(a.i.due<b.i.due?-1:1));
 h+='<section class="stack">'+sec('Rate da incassare')+'<div class="list">'+open.slice(0,8).map(x=>'<button class="li" data-act="payOpen" data-k="'+x.k.id+'" data-n="'+x.i.n+'"><span class="av">'+x.c.ini+'</span><span class="grow"><span class="t">'+esc(x.c.name)+'</span><br><span class="s num">Rata '+x.i.n+'/'+x.k.inst.length+' · '+eur(x.i.amount-x.i.paid)+' · '+fd(x.i.due)+'</span></span><span class="chip '+x.st.c+'">'+x.st.l+'</span></button>').join('')+'</div></section>';
 const paid=all.filter(x=>x.i.paidOn).sort((a,b)=>a.i.paidOn<b.i.paidOn?1:-1);
 h+='<section class="stack">'+sec('Ultimi incassi')+'<div class="list">'+paid.slice(0,5).map(x=>'<div class="li"><span class="av">'+x.c.ini+'</span><span class="grow"><span class="t">'+esc(x.c.name)+'</span><br><span class="s">'+fd(x.i.paidOn)+' · '+esc(x.i.method||'')+'</span></span><span class="num" style="font-weight:700">'+eur(x.i.paid)+'</span></div>').join('')+'</div></section>';
 h+=empty('Registro degli incassi, non fatturazione. Pagamenti online: possibili più avanti.');
 return h;
}

function accountHTML(){const cl=S.ui.role==='client';const ex='<button class="li" data-act="exportData"><span class="av">'+ic('book',18)+'</span><span class="grow"><span class="t">'+(cl?'Scarica i miei dati':'Backup di tutti i dati')+'</span><br><span class="s">'+(cl?'Un file con tutto quello che l\'app sa di te':'Scaricalo una volta al mese')+'</span></span></button>';
 if(!REAL)return '<section class="stack">'+sec('Dati')+'<div class="list">'+ex+'</div></section>';
 const pl=pushLabel();const nt='<button class="li" data-act="pushToggle"><span class="av">'+ic('bell',18)+'</span><span class="grow"><span class="t">'+pl[0]+'</span><br><span class="s">'+pl[1]+'</span></span></button>';
 return '<section class="stack">'+sec('Account')+'<div class="list">'+nt+ex+'<button class="li" data-act="changePw"><span class="av">'+ic('lock',18)+'</span><span class="grow"><span class="t">Cambia password</span></span>'+chev()+'</button><button class="li" data-act="logout"><span class="av">'+ic('out',18)+'</span><span class="grow"><span class="t">Esci</span><br><span class="s">Da questo dispositivo</span></span></button></div></section><p class="xs muted" style="text-align:center"><a href="privacy.html" target="_blank" rel="noopener">Informativa privacy</a></p>';}
function vAltro(){
 const nl=S.db.leads.filter(l=>l.stage==='contattare'||l.stage==='svolta').length;
 const items=[['chats','msg','Messaggi','Chat private con i clienti',chatUnreadTotal()?'<span class="chip pink">'+chatUnreadTotal()+'</span>':''],['calendario','cal','Google Calendar','Le lezioni nel tuo calendario',''],['contatti','target','Contatti e lezioni di prova','Da contattare → prova → cliente',nl?'<span class="chip pink">'+nl+'</span>':''],['libreria','book','Libreria esercizi',EX.length+' esercizi con note e muscoli',''],['ore','clock','Registro ore','Ingressi, uscite e totali',''],['automazioni','bolt','Automazioni','Messaggi e promemoria che partono da soli',ph('P1')],['sfide','trophy','Sfide di gruppo','Crea sfide e guarda le classifiche',ph('P2')],['programmati','send','Messaggi programmati','Scritti da te, inviati quando decidi',ph('P1')],['booking','link','Prenotazioni da Instagram','Anteprima della pagina pubblica',ph('Subito')],['info','info','Info prototipo','Cosa è simulato, ripristina i dati','']];
 const HIDE=['info','booking','automazioni'];
 return '<h1 class="h2">Altro</h1><div class="list">'+items.filter(x=>!REAL||HIDE.indexOf(x[0])<0).map(x=>'<button class="li" data-act="open" data-v="'+x[0]+'"><span class="av">'+ic(x[1],18)+'</span><span class="grow"><span class="t">'+x[2]+'</span><br><span class="s">'+x[3]+'</span></span>'+x[4]+chev()+'</button>').join('')+'</div>'+accountHTML();
}
const STAGES=[['contattare','Da contattare'],['fissata','Prova fissata'],['svolta','Prova svolta'],['cliente','Diventati clienti'],['perso','Persi']];
function vContatti(){
 const src=S.ui.lsrc;const ls=S.db.leads.filter(l=>src==='tutti'||l.src===src);
 let h=head('Contatti','Dal primo contatto alla lezione di prova');
 h+='<div class="grid3">'+kpi(ls.filter(l=>l.stage==='contattare').length,'Da contattare')+kpi(ls.filter(l=>l.stage==='fissata').length,'Prove fissate')+kpi(ls.filter(l=>l.stage==='svolta').length,'Da chiudere')+'</div>';
 h+='<div class="row between" style="gap:8px"><div class="tabs" role="group" aria-label="Provenienza">'+['tutti'].concat(SRCK).map(x=>'<button aria-pressed="'+(src===x)+'" data-act="lsrc" data-v="'+x+'">'+(x==='tutti'?'Tutti':'<span class="sw" style="background:var('+SRC[x].v+');border-radius:50%"></span>'+x)+'</button>').join('')+'</div><button class="btn sm primary" data-act="sheet" data-v="newLead" aria-label="Nuovo contatto">'+ic('plus',16)+'</button></div>';
 h+=STAGES.map((st,si)=>{const g=ls.filter(l=>l.stage===st[0]);if(!g.length&&si>2)return '';return '<section class="stack">'+sec(st[1],'<span class="chip">'+g.length+'</span>')+(g.length?'<div class="list">'+g.map(l=>'<div class="li" style="align-items:flex-start"><span class="av">'+l.name.split(' ').map(x=>x[0]).join('')+srcDot(l.src)+'</span><span class="grow stack" style="gap:4px"><span class="row between"><span class="t">'+esc(l.name)+'</span><span class="xs muted">'+esc(l.src)+(l.srcD?' · '+esc(l.srcD):'')+'</span></span><span class="s">'+esc(l.next)+(l.free?' · prova '+fd(l.free.slice(0,10))+' '+l.free.slice(11):'')+'</span>'+(l.interest?'<span class="s">Interesse: '+esc(l.interest)+'</span>':'')+(si<3?'<span class="row wrap" style="gap:6px;margin-top:4px">'+(si===0?'<button class="btn sm" data-act="leadFix" data-id="'+l.id+'">Fissa prova</button>':'')+(si===1?'<button class="btn sm" data-act="leadMove" data-id="'+l.id+'" data-v="svolta">Prova svolta</button>':'')+(si===2?'<button class="btn sm primary" data-act="leadConvert" data-id="'+l.id+'">Diventa cliente</button>':'')+'<button class="btn sm ghost" data-act="leadMove" data-id="'+l.id+'" data-v="perso">Perso</button></span>':'')+'</span></div>').join('')+'</div>':'<p class="small muted">Nessuno.</p>')+'</section>';}).join('');
 return h;
}
function vLibreria(){
 const q=(S.ui.exq||'').toLowerCase();
 let h=head('Libreria esercizi','Un nome per ogni esercizio, usato in tutte le schede');
 h+='<input class="in" type="search" id="exq" placeholder="Cerca esercizio o muscolo" value="'+esc(S.ui.exq||'')+'" data-bind="exq" aria-label="Cerca esercizio">';
 const list=allEx().filter(e=>!q||e.name.toLowerCase().indexOf(q)>=0||e.pri.concat(e.sec).some(m=>MUSCLES[m].toLowerCase().indexOf(q)>=0));
 h+='<div class="list">'+list.map(e=>'<button class="li" data-act="open" data-v="esercizio" data-id="'+e.id+'"><span class="av">'+ic('dumbbell',18)+'</span><span class="grow"><span class="t">'+esc(e.name)+'</span><br><span class="s">'+(e.pri.map(m=>MUSCLES[m]).join(', ')||'Senza muscoli')+' · '+e.mode+(e.custom?' · tuo':'')+'</span></span>'+chev()+'</button>').join('')+'</div>';
 h+='<button class="btn primary lg block" data-act="exNew">'+ic('plus',18)+' Nuovo esercizio</button>';
 return h;
}
function vEsercizio(){
 const e=exById(S.ui.page.id);
 let h=head(esc(e.name),e.mode+(e.custom?' · creato da te':''));
 if(S.ui.role==='coach')h+='<button class="btn" style="align-self:flex-start" data-act="exEdit" data-id="'+e.id+'">'+ic('edit',16)+' Modifica esercizio</button>';
 h+='<div class="card">'+bodyMap(e.pri,e.sec,'Muscoli coinvolti: '+e.name)+'</div>';
 h+='<div class="card pink"><h3>Nota tecnica di Aelis</h3><p>'+esc(e.note)+'</p></div>';
 {const v0=(S.db.videos||{})[e.id];const v=/^https:\/\//.test(v0||'')?v0:null;const coach=S.ui.role==='coach';
  h+='<div class="card"><div class="row"><span class="av">'+ic('video',18)+'</span><div class="grow"><h3>Video dimostrativo</h3><p class="small muted">'+(v?'Registrato da Aelis':coach?'Incolla il link di un video YouTube “non in elenco”: costo zero.':'Aelis non ha ancora caricato il video di questo esercizio.')+'</p></div></div>'+(v?'<a class="btn primary block" href="'+esc(v)+'" target="_blank" rel="noopener">'+ic('play',18)+' Guarda il video</a>':'')+(coach?'<div class="row" style="gap:8px"><input class="in" id="vid-url" inputmode="url" placeholder="https://youtu.be/…" value="'+esc(v||'')+'" aria-label="Link del video"><button class="btn" data-act="vidSave" data-id="'+e.id+'">Salva</button></div>':'')+'</div>';}
 h+='<div class="card"><h3>Muscoli</h3><p><b>Principali:</b> '+e.pri.map(m=>MUSCLES[m]).join(', ')+'</p>'+(e.sec.length?'<p><b>Secondari:</b> '+e.sec.map(m=>MUSCLES[m]).join(', ')+'</p>':'')+'</div>';
 return h;
}
function vOre(){
 const w0=monday(TODAY);const rows=S.db.shifts.slice().sort((a,b)=>a.date<b.date?1:-1);
 const sum=(a,b)=>rows.filter(r=>r.date>=a&&r.date<b).reduce((s,r)=>s+mins(r.out)-mins(r.in),0);
 let h=head('Registro ore','Somma automatica di Inizia e Fine giornata');
 h+='<div class="grid2">'+kpi(dur(sum(w0,addDays(w0,7))),'Questa settimana')+kpi(dur(sum(addDays(w0,-7),w0)),'Settimana scorsa')+'</div>';
 h+='<div class="list">'+rows.map(r=>'<button class="li" data-act="sheet" data-v="shiftEdit" data-id="'+S.db.shifts.indexOf(r)+'"><span class="grow"><span class="t">'+cap(fl(r.date))+'</span><br><span class="s num">'+r.in+' – '+r.out+(r.fix?' · corretto: '+esc(r.fix):'')+'</span></span><span class="num" style="font-weight:700">'+dur(mins(r.out)-mins(r.in))+'</span></button>').join('')+'</div>';
 h+=empty('Dimenticata una timbratura? Tocca il giorno e correggila: il motivo resta salvato.');
 return h;
}

function vAutomazioni(){
 const au=S.db.autos;const on=au.filter(a=>a.on).length;const sent=au.reduce((s,a)=>s+a.log.length,0);
 let h=head('Automazioni','Messaggi che partono da soli, scritti da te');
 h+='<div class="grid2">'+kpi(on+' di '+au.length,'Automazioni attive')+kpi(cnt(sent),'Messaggi inviati a ottobre')+'</div>';
 h+=empty('Il cliente vede che è un messaggio automatico. I testi sono tuoi: {nome}, {data} e {fase} si compilano da soli. '+ph('P1'));
 h+=au.map(a=>{const l=a.log[a.log.length-1];return '<div class="card" style="gap:10px"><div class="row" style="align-items:flex-start"><span class="av">'+ic(a.ic,18)+'</span><div class="grow"><h3>'+esc(a.t)+'</h3><p class="small muted">'+esc(a.w)+' · a: '+esc(a.to)+'</p></div><button class="sw2" aria-pressed="'+a.on+'" data-act="autoTog" data-id="'+a.id+'" aria-label="Attiva '+esc(a.t)+'"></button></div><p class="quote small">'+esc(a.msg)+'</p><div class="row between"><span class="xs muted">'+(l?'Ultimo invio: '+esc((client(l[0])||{name:'–'}).name.split(' ')[0])+' · '+fd(l[1]):'Nessun invio finora')+'</span><button class="btn sm ghost" data-act="sheet" data-v="autoEdit" data-id="'+a.id+'">'+ic('edit',14)+' Modifica testo</button></div></div>';}).join('');
 return h;
}
function vSfideCoach(){
 let h=head('Sfide di gruppo','Più costanza, più passaparola '+ph('P2'));
 h+='<button class="btn primary block" data-act="sheet" data-v="newCh">'+ic('plus',16)+' Nuova sfida</button>';
 S.db.challenges.forEach(ch=>{const st=chState(ch);const bd=chBoard(ch);const done=ch.kind==='personale'?bd.filter(x=>x.v>=ch.target).length:0;
  h+='<section class="card"><div class="row between" style="align-items:flex-start"><div><span class="chip '+(st==='attiva'?'pink':'')+'">'+(ch.kind==='squadra'?'Di squadra':'Personale')+' · '+(st==='attiva'?'in corso':st==='prossima'?'dal '+fd(ch.start):'finita')+'</span><h3 style="font-family:var(--display);font-size:20px;font-weight:800;margin-top:8px">'+esc(ch.title)+'</h3><p class="small muted">'+esc(ch.goal)+' · '+fd(ch.start)+' – '+fd(ch.end)+'</p></div></div>'+
   '<div class="grid3">'+kpi(bd.length,'Iscritti')+(ch.kind==='squadra'?kpi(pct(chTotal(ch),ch.target)+'%','Obiettivo'):kpi(done,'Completata'))+kpi(bd[0]?esc(bd[0].c.name.split(' ')[0]):'–','In testa')+'</div>'+
   (ch.kind==='squadra'?'<div class="teambar"><i style="width:'+Math.min(100,pct(chTotal(ch),ch.target))+'%"></i></div>':'')+'</section>';});
 h+=empty('Nella classifica i clienti vedono solo chi partecipa, e possono partecipare in anonimo. Le sfide di squadra non hanno perdenti.');
 return h;
}
function vProgrammati(){
 let h=head('Messaggi programmati','Scritti da te, inviati quando decidi');
 h+=empty('Il cliente vede l\'etichetta “programmato”: nessuno pensa che tu stia scrivendo in quel momento. '+ph('P1'));
 h+='<div class="list">'+S.db.scheduled.map(m=>{const to=m.to==='tutti'?'Tutti i clienti':(client(m.to)||{}).name;return '<div class="li" style="align-items:flex-start"><span class="av">'+ic('send',16)+'</span><span class="grow"><span class="t">'+esc(to)+'</span><br><span class="s">'+(m.when?fd(m.when.slice(0,10))+' alle '+m.when.slice(11):'Al traguardo: '+esc(m.trigger))+'</span><p style="margin-top:4px">'+esc(m.text)+'</p></span></div>';}).join('')+'</div>';
 h+='<button class="btn primary block" data-act="sheet" data-v="newSched">'+ic('plus',16)+' Nuovo messaggio</button>';
 return h;
}
function freeSlots(){const out=[];for(let i=1;i<=6&&out.length<6;i++){const d=addDays(TODAY,i);if(D(d).getDay()===0)continue;['10:00','12:30','16:00','19:30'].forEach(t=>{const busy=S.db.appts.some(a=>a.date===d&&a.status!=='annullato'&&mins(t)<mins(a.time)+a.dur&&mins(t)+30>mins(a.time));if(!busy&&out.length<6)out.push({d:d,t:t});});}return out;}
function vBooking(){
 const sl=freeSlots();const b=S.ui.book||{type:'prova',slot:null,done:false};
 let h=head('Prenotazioni da Instagram','Così la vede chi tocca il link nella bio');
 h+=empty('Attivabile subito con uno strumento gratuito. Più avanti la integriamo: gli orari arrivano dalla tua agenda e chi prenota finisce in Contatti come “Social”.');
 h+='<div class="card" style="border-color:var(--accent)">';
 if(b.done)h+='<div class="stack" style="align-items:center;text-align:center;padding:12px 0"><span class="av lg">'+ic('check',26)+'</span><h3>Richiesta inviata</h3><p class="small muted">Aelis ti scriverà per confermare. Nel prototipo la trovi in Contatti e in Agenda.</p><button class="btn sm" data-act="bookReset">Prova di nuovo</button></div>';
 else{
  h+='<div class="row"><span class="av lg">AE</span><div><p class="brand" style="margin-bottom:4px"><svg width="84" height="18" viewBox="-20 -80 420 90" aria-label="AELIS"><use href="#wmT" fill="currentColor"></use><use href="#wmS" fill="#9DB0CF"></use></svg></p><h3>Allenati con Aelis</h3><p class="small muted">Personal trainer · Genova</p></div></div>';
  h+='<div class="segbar" role="group" aria-label="Tipo">'+[['prova','Prova · 30 min'],['call','Chiacchierata · 15 min']].map(x=>'<button aria-pressed="'+(b.type===x[0])+'" data-act="bookType" data-v="'+x[0]+'">'+x[1]+'</button>').join('')+'</div>';
  h+='<p class="small" style="font-weight:650">Scegli un orario</p><div class="grid3">'+sl.map((s,i)=>'<button class="btn sm" style="'+(b.slot===i?'background:var(--ink);color:var(--bg);border-color:var(--ink)':'')+'" aria-pressed="'+(b.slot===i)+'" data-act="bookSlot" data-v="'+i+'">'+GGS[D(s.d).getDay()]+' '+D(s.d).getDate()+' · '+s.t+'</button>').join('')+'</div>';
  h+='<label class="f">Nome<input class="in" id="bk-name" placeholder="Il tuo nome"></label><label class="f">Telefono o Instagram<input class="in" id="bk-contact" placeholder="@nomeutente"></label><button class="btn rose lg block" data-act="bookSend"'+(b.slot==null?' disabled':'')+'>Richiedi l\'appuntamento</button>';
 }
 return h+'</div>';
}
function vInfo(){
 return head('Info prototipo','AELIS Training · versione 3')+'<div class="card stack"><p>'+(REAL?'Versione collegata al database.':'<b>Modalità demo</b>: dati di esempio inventati, salvati solo in questo browser. Puoi provare tutto liberamente.')+'</p><p><b>P0</b> prima versione · <b>P1</b> versione estesa · <b>P2</b> seconda fase. Dove non c\'è etichetta, è P0.</p><p>Simulati: inviti ed email, notifiche, notifiche e foto.</p></div><button class="btn danger block" data-act="reset">Ripristina i dati di esempio</button>';
}

/* ================= CLIENTE ================= */
const CHECKQ={energia:{l:'Energia',lo:'pochissima',hi:'tantissima'},stress:{l:'Stress',lo:'nullo',hi:'molto alto'},motivazione:{l:'Motivazione',lo:'bassa',hi:'altissima'},sonno:{l:'Sonno',lo:'pessimo',hi:'ottimo'},progressi:{l:'Progressi percepiti',lo:'fermi',hi:'evidenti'}};
const me=()=>client(S.ui.asClient);
function weekDots(cid){const w0=monday(TODAY);let h='<div class="wkdays">';for(let i=0;i<7;i++){const d=addDays(w0,i);const on=histOf(cid).some(x=>x.date===d);h+='<div><div class="c'+(on?' on':'')+(d===TODAY?' today':'')+'" data-tip="'+cap(fl(d))+(on?': allenamento fatto':'')+'">'+(on?ic('check',14):'')+'</div><div class="l">'+GGS[D(d).getDay()].charAt(0).toUpperCase()+'</div></div>';}return h+'</div>';}
function cHome(){
 const c=me();const p=programOf(c);
 const key=nextKey(c);const ses=p?p.sessions.find(s=>s.key===key):null;
 const st=stats(c.id);const doneToday=histOf(c.id).some(x=>x.date===TODAY);
 const next=S.db.appts.filter(a=>a.clientId===c.id&&a.date>=TODAY&&a.status==='previsto').sort((a,b)=>(a.date+a.time)<(b.date+b.time)?-1:1).slice(0,2);
 const kud=histOf(c.id).filter(x=>x.kudos&&!x.kudosSeen).slice(-1)[0];
 let h='<div class="row between" style="align-items:flex-end"><div><h1 class="hello">Ciao '+esc(c.name.split(' ')[0])+'</h1><p class="date">'+cap(fl(TODAY))+'</p></div>'+(st.streak?'<span class="chip pink" style="font-size:13px;padding:5px 11px" data-tip="Settimane consecutive con almeno un allenamento">'+ic('flame',16)+' '+st.streak+' sett.</span>':'')+'</div>';
 h+=installCard()+pushCard();
 if(!(c.answers&&c.answers.length))h+='<button class="card onb" data-act="open" data-v="onboard" style="text-align:left;cursor:pointer"><div class="row"><span class="av">'+ic('user',18)+'</span><div class="grow"><h3>Raccontaci di te</h3><p class="small muted">6 domande, 2 minuti: così Aelis prepara la scheda giusta per te.</p></div>'+chev()+'</div></button>';
 if(kud)h+='<button class="card pink" style="text-align:left;flex-direction:row;align-items:center;cursor:pointer" data-act="seeKudos" data-id="'+kud.id+'"><span class="av" style="background:var(--accent);color:var(--on-accent)">'+ic('clap',20)+'</span><span class="grow"><b>Aelis ti ha fatto un applauso</b><br><span class="small">per la seduta '+kud.key+' del '+fd(kud.date)+'</span></span>'+ic('x',16)+'</button>';
 if(ses&&!doneToday){
  const mus={pri:[],sec:[]};ses.items.forEach(it=>{const e=exById(it.ex);e.pri.forEach(m=>{if(mus.pri.indexOf(m)<0)mus.pri.push(m);});});
  h+='<section class="hero night"><div class="row between" style="align-items:flex-start"><div class="stack" style="gap:6px"><div class="k">Allenamento di oggi</div><h3>Seduta '+ses.key+'<br>'+esc(ses.name)+'</h3><p class="small muted">'+ses.items.length+' esercizi · circa 55 min</p><p class="small muted">'+mus.pri.slice(0,3).map(m=>MUSCLES[m]).join(' · ')+'</p></div></div><button class="btn primary lg block" data-act="startWk" data-v="'+ses.key+'">'+ic('play',18)+' Inizia allenamento</button></section>';
 }else if(doneToday)h+='<section class="hero"><div class="k">Oggi</div><h3>Allenamento fatto. Grande lavoro!</h3><p class="small muted">Recupera bene: la prossima è la seduta '+key+'.</p></section>';
 else h+='<section class="hero"><div class="k">La tua scheda</div><h3>Aelis sta preparando la tua scheda</h3><p class="small muted">Ti arriva qui appena è pronta.</p></section>';
 const msg=S.db.coachMsg[c.id];
 if(msg&&!doneToday)h+='<section class="card pink"><div class="row"><span class="av" style="background:var(--bg)">AE</span><div><p style="font-weight:650">Messaggio di Aelis</p><p class="xs muted">oggi</p></div></div><p class="quote">'+esc(msg)+'</p></section>';
 h+='<section class="card"><div class="row between"><h3>Questa settimana</h3><span class="small muted">'+histOf(c.id).filter(x=>x.date>=monday(TODAY)).length+' allenamenti</span></div>'+weekDots(c.id)+'</section>';
 {const sg=stageOf(c.id);h+='<button class="card meta" data-act="open" data-v="metamorfosi"><span class="row between"><span><span class="xs muted" style="letter-spacing:.24em;text-transform:uppercase;font-weight:650">La tua metamorfosi</span><br><span style="font-family:var(--display);font-size:20px;font-weight:800">Fase '+sg.s.n+'</span></span>'+chev()+'</span>'+metaTrack(c.id)+(sg.next?'<span class="small muted">Ancora <b style="color:var(--ink)">'+sg.left+' allenament'+(sg.left===1?'o':'i')+'</b> per la fase '+sg.next.n+'.</span>':'<span class="small muted">Hai completato la metamorfosi. Si continua a volare.</span>')+'</button>';}
 // sfide di gruppo
 {const act=S.db.challenges.filter(ch=>chState(ch)==='attiva'&&ch.joined.indexOf(c.id)>=0);const ch=act.find(x=>x.kind==='personale');const tm=act.find(x=>x.kind==='squadra');
  if(ch){const bd=chBoard(ch);const pos=bd.findIndex(x=>x.c.id===c.id)+1;const v=chVal(ch,c.id);
   h+='<section class="card"><div class="row" style="gap:16px">'+ring(Math.min(1,v/ch.target),92,10,null,'<text x="46" y="52" text-anchor="middle" font-family="Archivo,system-ui" font-weight="800" font-size="28" fill="var(--ink)">'+Math.min(v,ch.target)+'/'+ch.target+'</text>')+'<div class="stack grow" style="gap:5px"><span class="chip pink" style="align-self:flex-start">'+ic('trophy',12)+' Sfida di gruppo</span><h3>'+esc(ch.title)+'</h3><p class="small muted">'+(v>=ch.target?'Completata! Il trofeo è nella tua bacheca.':'Posizione '+pos+' di '+bd.length+' · ne mancano '+(ch.target-v)+' entro il '+fd(ch.end)+'.')+'</p></div></div>'+(tm?'<div class="stack" style="gap:6px;border-top:1px solid var(--line);padding-top:12px"><div class="row between small"><span><b>'+esc(tm.title)+'</b></span><span class="num muted">'+pct(chTotal(tm),tm.target)+'%</span></div><div class="teambar"><i style="width:'+Math.min(100,pct(chTotal(tm),tm.target))+'%"></i></div><p class="xs muted">Il tuo contributo: '+nf(chVal(tm,c.id))+' kg su '+nf(chTotal(tm))+'</p></div>':'')+'<button class="btn sm" style="align-self:flex-start" data-act="open" data-v="sfide">Classifica e altre sfide</button></section>';}
  else h+='<button class="card" style="text-align:left;cursor:pointer" data-act="open" data-v="sfide"><span class="row"><span class="av">'+ic('trophy',18)+'</span><span class="grow"><b>Sfide di gruppo</b><br><span class="small muted">Allenati insieme agli altri clienti di Aelis</span></span>'+chev()+'</span></button>';}
 h+='<button class="wrapcard" data-act="wrapOpen"><svg class="wmk" viewBox="-720 -720 1440 1400" aria-hidden="true"><use href="#bfDb"></use></svg><span class="grow"><span class="k">Riepilogo del mese</span><h3>Il tuo '+MESEN[+TODAY.slice(5,7)-1]+' è pronto</h3></span>'+ic('play',18)+'</button>';
 if(next.length)h+='<div class="list"><div class="li"><span class="av">'+ic('cal',18)+'</span><span class="grow"><span class="s">Prossima lezione con Aelis</span><br><span class="t">'+cap(fl(next[0].date))+' · '+next[0].time+'</span></span></div></div>';
 if(!c.lastCheck||diff(c.lastCheck,TODAY)>=c.checkEvery)h+='<button class="card" style="text-align:left;cursor:pointer" data-act="open" data-v="check"><span class="row"><span class="av">'+ic('heart',18)+'</span><span class="grow"><b>Check della settimana</b> '+ph('P1')+'<br><span class="small muted">5 domande, meno di un minuto</span></span>'+chev()+'</span></button>';
 return h;
}
function cAllena(){
 const c=me();const p=programOf(c);
 if(!p)return '<h1 class="h2">Allenamento</h1>'+empty('La tua scheda non è ancora pronta.');
 const sel=S.ui.cses||nextKey(c);const ses=p.sessions.find(s=>s.key===sel)||p.sessions[0];
 let h='<h1 class="h2">La tua scheda</h1><div class="segbar" role="group" aria-label="Sedute">'+p.sessions.map(s=>'<button aria-pressed="'+(s.key===ses.key)+'" data-act="cses" data-v="'+s.key+'">Seduta '+s.key+(s.key===nextKey(c)?' · oggi':'')+'</button>').join('')+'</div>';
 const mus={pri:[],sec:[]};ses.items.forEach(it=>{const e=exById(it.ex);e.pri.forEach(m=>{if(mus.pri.indexOf(m)<0)mus.pri.push(m);});e.sec.forEach(m=>{if(mus.sec.indexOf(m)<0&&mus.pri.indexOf(m)<0)mus.sec.push(m);});});
 h+='<div class="card"><h3>'+esc(ses.name)+'</h3>'+bodyMap(mus.pri,mus.sec,'Muscoli della seduta '+ses.key)+'</div>';
 h+='<div class="list">'+ses.items.map(it=>{const e=exById(it.ex);const l=lastSetsFor(c.id,it.ex);const best=maxKg(c.id,it.ex);return '<button class="li" data-act="open" data-v="esercizio" data-id="'+e.id+'"><span class="grow"><span class="t">'+esc(e.name)+'</span><br><span class="s num">'+it.sets+' × '+it.rmin+'–'+it.rmax+' · rec '+it.rest+'" · RIR '+it.rir+(l&&l.sets[0].kg!==''?' · ultima '+kgf(l.sets[0].kg)+' kg':'')+'</span></span>'+(best&&e.mode==='Esterno'?'<span class="chip" data-tip="Il tuo record">'+ic('bolt',12)+' '+kgf(best)+'</span>':'')+chev()+'</button>';}).join('')+'</div>';
 h+='<button class="btn primary lg block" data-act="startWk" data-v="'+ses.key+'">'+ic('play',18)+' Inizia seduta '+ses.key+'</button>';
 return h;
}
function cLive(){
 const w=S.ui.wk;const c=me();const p=programOf(c);const ses=p.sessions.find(s=>s.key===w.key);
 const tot=w.items.reduce((s,i)=>s+i.sets.length,0),dn=w.items.reduce((s,i)=>s+i.sets.filter(x=>x.done).length,0);
 let h='<div class="row" style="gap:14px">'+ring(tot?dn/tot:0,64,7,null,'<text x="32" y="37" text-anchor="middle" font-family="Archivo,system-ui" font-weight="800" font-size="14" fill="var(--ink)">'+pct(dn,tot)+'%</text>')+'<div class="grow"><p class="small muted">Seduta '+w.key+' · in corso · <span class="num" id="wk-time">'+dur((Date.now()-w.start)/60000)+'</span></p><h1 class="h2" style="font-size:24px">'+esc(ses.name)+'</h1></div></div>';
 const msg=S.db.coachMsg[c.id];if(msg)h+='<p class="quote small">'+esc(msg)+'</p>';
 h+=w.items.map((it,i)=>{const e=exById(it.ex);const pr=ses.items[i];const l=lastSetsFor(c.id,it.ex);const all=it.sets.every(s=>s.done);const best=maxKg(c.id,it.ex);
  return '<div class="ex '+(all?'alldone':'')+'"><div class="row between" style="align-items:flex-start"><div class="grow"><h3>'+esc(e.name)+'</h3><p class="small muted num">'+pr.sets+' × '+pr.rmin+'–'+pr.rmax+' · recupero '+pr.rest+'" · RIR '+pr.rir+(best&&e.mode==='Esterno'?' · record '+kgf(best)+' kg':'')+'</p></div><span class="row" style="gap:2px"><button class="btn sm ghost mic'+(S.ui.listen===i?' listening':'')+'" data-act="voice" data-v="'+i+'" aria-label="Detta la serie a voce">'+ic('mic',18)+'</button><button class="btn sm ghost" data-act="toggleNote" data-v="'+i+'" aria-label="Nota tecnica">'+ic('info',18)+'</button></span></div>'+
  (it.showNote?'<p class="note">'+esc(e.note)+'</p>':'')+
  (pr.alt.length?'<div class="altrow"><span class="xs muted row" style="gap:5px">'+ic('swap',14)+' Macchina occupata? Alternative approvate da Aelis</span><div class="row wrap" style="gap:6px">'+[pr.ex].concat(pr.alt).map(a=>'<button class="chip alt" aria-pressed="'+(it.ex===a)+'" data-act="altPick" data-i="'+i+'" data-v="'+a+'">'+esc(exById(a).name)+(a===pr.ex?' · prevista':'')+'</button>').join('')+'</div></div>':'')+
  '<div class="setrow hd"><span>#</span><span>Prima</span><span>Kg</span><span>Rip.</span><span></span></div>'+
  it.sets.map((s,j)=>{const ls=l&&l.sets[j];const isPR=s.done&&e.mode==='Esterno'&&best&&+s.kg>best;return '<div class="setrow '+(s.done?'done':'')+'"><span class="num" style="font-weight:750">'+(j+1)+'</span><span class="prev">'+(isPR?'<b style="color:var(--t-gold)">Nuovo record!</b>':(ls?(ls.kg!==''?kgf(ls.kg)+' × ':'')+ls.reps:'–'))+'</span><input type="text" inputmode="decimal" id="w-'+i+'-'+j+'-kg" data-w="'+i+','+j+',kg" value="'+(s.kg===''?'':kgf(s.kg))+'" aria-label="Kg serie '+(j+1)+'"'+(e.mode==='Corpo libero'||e.mode==='Tempo'?' placeholder="–"':'')+'><input type="text" inputmode="numeric" id="w-'+i+'-'+j+'-reps" data-w="'+i+','+j+',reps" value="'+s.reps+'" aria-label="Ripetizioni serie '+(j+1)+'"><button class="tick'+(w.popped===i+'-'+j?' pop':'')+'" aria-pressed="'+s.done+'" data-act="setDone" data-i="'+i+'" data-j="'+j+'" aria-label="Serie '+(j+1)+' fatta">'+ic('check',18)+'</button></div>';}).join('')+
  '<button class="btn sm ghost" style="align-self:flex-start" data-act="addSet" data-v="'+i+'">'+ic('plus',14)+' Aggiungi serie</button></div>';}).join('');
 h+='<label class="f">Note per Aelis (facoltative)<textarea class="in" id="wk-note" data-bind="wkNote" placeholder="Com\'è andata, fastidi, dubbi…">'+esc(w.note||'')+'</textarea></label>';
 if(w.rest){const left=Math.max(0,Math.ceil((w.rest.until-Date.now())/1000));h+='<div class="restbar" id="restbar">'+ring(left/w.rest.total,40,4,{track:'rgb(255 255 255 / .15)',fg:'var(--accent)'})+'<span class="grow">Recupero <span class="num big" style="font-size:20px" id="rest-left">'+left+'</span> s</span><button class="btn" data-act="restPlus">+15 s</button><button class="btn" data-act="skipRest">Salta</button></div>';}
 return h;
}

/* ---------- festa di fine allenamento ---------- */
function partyHTML(){
 const s=S.ui.party;if(!s)return '';const c=me();
 const p=programOf(c);const ses=p.sessions.find(x=>x.key===s.key);
 const eq=volEq(s.vol);
 let h='<div class="party" role="dialog" aria-modal="true" aria-label="Allenamento completato"><canvas id="confetti"></canvas><div class="in-p">';
 if(s.share){
  h+='<div class="row between"><button class="btn sm" data-act="shareOff">'+ic('back',16)+' Indietro</button><span class="small muted">Anteprima storia</span></div>';
  h+='<div class="story"><svg class="sbf" viewBox="-720 -720 1440 1400" aria-hidden="true"><use href="#bfD"></use></svg><div><svg width="96" height="21" viewBox="-20 -80 420 90" aria-label="AELIS"><use href="#wmT" fill="url(#foilT)"></use><use href="#wmS" fill="#BCD7F7"></use></svg><p style="margin-top:14px;opacity:.75;font-size:13px">'+cap(fl(TODAY))+'</p><p class="bigs" style="margin-top:6px">Seduta '+s.key+'</p><p style="font-size:16px;font-weight:650">'+esc(ses.name)+'</p></div>'+
   '<div>'+bodyMap(s.mus.pri,s.mus.sec,'Muscoli allenati',true,true)+'</div>'+
   '<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px"><div><p class="bigs" style="font-size:26px">'+s.min+'\'</p><p style="font-size:11px;opacity:.7">durata</p></div><div><p class="bigs" style="font-size:26px">'+s.sets+'</p><p style="font-size:11px;opacity:.7">serie</p></div><div><p class="bigs" style="font-size:26px">'+nf(s.vol)+'</p><p style="font-size:11px;opacity:.7">kg sollevati</p></div></div>'+
   (s.prs.length?'<p style="font-size:13px;font-weight:700;color:#BCD7F7">'+s.prs.filter(x=>x.r===1).length+' record personali oggi</p>':'')+'<p style="font-size:12px;opacity:.7">@aelistraining</p></div>';
  h+='<p class="small muted" style="text-align:center">Fai uno screenshot e condividilo nelle storie taggando la coach. Nell\'app vera ci sarà il pulsante “Condividi”.</p></div></div>';
  return h;
 }
 h+='<div class="stack stg" style="align-items:center;text-align:center;gap:12px"><div class="pbf"><svg class="bfly" viewBox="-720 -720 1440 1400" aria-hidden="true"><use href="#bfD"></use></svg>'+ring(s.sets/s.tot,150,12,{track:'rgb(255 255 255 / .12)',fg:'url(#foilI2)'},'<text x="75" y="72" text-anchor="middle" font-family="Archivo,system-ui" font-weight="800" font-size="44" fill="#fff" data-count="'+pct(s.sets,s.tot)+'" data-fmt="pct">'+pct(s.sets,s.tot)+'%</text><text x="75" y="94" text-anchor="middle" font-size="12" fill="rgb(255 255 255 / .65)">serie completate</text>')+'</div>'+
  '<p class="small muted" style="letter-spacing:.14em;text-transform:uppercase;font-family:Archivo,system-ui;font-stretch:118%">Allenamento completato</p><h1 class="hello" style="color:#fff">Seduta '+s.key+'<br>'+esc(ses.name)+'</h1></div>';
 h+='<div class="grid3 stg" style="animation-delay:.15s">'+[[s.min,'min','Durata'],[s.sets,'','Serie'],[s.vol,'kg','Volume']].map(x=>'<div class="pcard" style="padding:12px;gap:2px"><span class="big" style="font-size:28px" data-count="'+x[0]+'" data-fmt="int">'+nf(x[0])+'</span><span class="xs muted">'+x[2]+(x[1]?' ('+x[1]+')':'')+'</span></div>').join('')+'</div>';
 if(eq)h+='<div class="pcard stg" style="animation-delay:.25s;flex-direction:row;align-items:center"><span class="av" style="background:rgb(255 255 255 / .1);color:var(--accent)">'+ic('weight',20)+'</span><p>Oggi hai sollevato più di <b>'+eq[1]+'</b>.</p></div>';
 if(s.prs.length)h+='<div class="pcard stg" style="animation-delay:.35s"><p style="font-weight:700">Risultati di oggi</p>'+s.prs.map(x=>'<div class="medal-row">'+prMedal(x.r,40)+'<div class="grow"><p style="font-weight:650">'+esc(x.name)+'</p><p class="xs muted">'+(x.r===1?'Record personale · '+kgf(x.kg)+' kg (prima '+kgf(x.prev)+' kg)':x.r+'° miglior risultato di sempre · '+kgf(x.kg)+' kg')+'</p></div></div>').join('')+'</div>';
 if(s.stageUp!=null){const st=STAGE[s.stageUp];h+='<div class="pcard stg" style="animation-delay:.4s;align-items:center;text-align:center;border-color:rgb(255 255 255 / .24)"><span style="color:#BCD7F7">'+stageIcon(s.stageUp,120,true)+'</span><p class="small muted" style="letter-spacing:.2em;text-transform:uppercase">Nuova fase sbloccata</p><h2 style="font-family:var(--display);font-weight:800;font-size:34px;margin:0;line-height:1">'+st.n+'</h2><p class="small">'+esc(st.d)+'</p><p class="gift" style="color:#BCD7F7">'+ic('gift',16)+' '+esc(st.gift)+'</p></div>';}
 else if(s.stage&&s.stage.next)h+='<div class="pcard stg" style="animation-delay:.4s;flex-direction:row;align-items:center"><span style="color:#BCD7F7;flex:none">'+stageIcon(s.stage.i,s.stage.i>=2?56:40,true)+'</span><div class="grow stack" style="gap:6px"><p><b>Fase '+s.stage.s.n+'</b> · ancora '+s.stage.left+' per la fase '+s.stage.next.n+'</p><div class="bar" style="background:rgb(255 255 255 / .12)"><i style="width:'+Math.round(s.stage.p*100)+'%;background:var(--foil)"></i></div></div></div>';
 if(s.newBadges.length)h+='<div class="pcard stg" style="animation-delay:.45s"><p style="font-weight:700">'+(s.newBadges.length===1?'Nuovo trofeo sbloccato':s.newBadges.length+' nuovi trofei sbloccati')+'</p><div class="row wrap" style="justify-content:center;gap:16px">'+s.newBadges.map(b=>'<div class="badge new" style="color:#fff">'+medal(b,84)+'<span class="bn">'+esc(b.n)+'</span><span class="bs" style="color:rgb(255 255 255 / .6)">'+TIERS[b.t].l+' · '+esc(b.d)+'</span></div>').join('')+'</div></div>';
 h+='<div class="pcard stg" style="animation-delay:.55s"><p style="font-weight:700">Com\'è andata?</p><div class="scale" role="group" aria-label="Sensazione">'+['Dura','Così così','Bene','Benissimo','Al top'].map((t,i)=>'<button aria-pressed="'+(s.feel===i+1)+'" data-act="feel" data-v="'+(i+1)+'" style="font-size:12px;font-weight:650">'+t+'</button>').join('')+'</div><p class="xs muted">Aelis riceve il riepilogo. Allenamento autonomo: non usa le lezioni del percorso.</p></div>';
 h+='<div class="stack stg" style="animation-delay:.65s"><button class="btn rose lg block" data-act="shareOn">'+ic('share',18)+' Crea la card per Instagram</button><button class="btn lg block" data-act="closeParty">Fatto</button></div>';
 return h+'</div></div>';
}
function confetti(){
 if(RM)return;const cv=document.getElementById('confetti');if(!cv)return;const ctx=cv.getContext('2d');const dpr=window.devicePixelRatio||1;
 const W=cv.clientWidth,H=cv.clientHeight;cv.width=W*dpr;cv.height=H*dpr;ctx.scale(dpr,dpr);
 const cols=['#FFFFFF','#BCD7F7','#2929FD','#7FB2F0','#FFFFFF','#5A5AFF'];const P=[];
 for(let i=0;i<160;i++)P.push({x:W/2+(Math.random()-.5)*60,y:H*.28,vx:(Math.random()-.5)*11,vy:-Math.random()*11-4,s:4+Math.random()*6,r:Math.random()*6,vr:(Math.random()-.5)*.3,c:cols[i%cols.length],sh:i%3});
 const t0=performance.now();
 (function f(t){const el=t-t0;ctx.clearRect(0,0,W,H);P.forEach(p=>{p.vy+=.28;p.vx*=.99;p.x+=p.vx;p.y+=p.vy;p.r+=p.vr;ctx.save();ctx.globalAlpha=Math.max(0,1-el/3200);ctx.translate(p.x,p.y);ctx.rotate(p.r);ctx.fillStyle=p.c;if(p.sh===0)ctx.fillRect(-p.s/2,-p.s/4,p.s,p.s/2);else if(p.sh===1){ctx.beginPath();ctx.arc(0,0,p.s/3,0,7);ctx.fill();}else{const k=p.s*.9;ctx.beginPath();ctx.moveTo(0,-k);ctx.quadraticCurveTo(k*.12,-k*.12,k*.45,0);ctx.quadraticCurveTo(k*.12,k*.12,0,k);ctx.quadraticCurveTo(-k*.12,k*.12,-k*.45,0);ctx.quadraticCurveTo(-k*.12,-k*.12,0,-k);ctx.fill();}ctx.restore();});if(el<3300&&document.getElementById('confetti'))requestAnimationFrame(f);else ctx.clearRect(0,0,W,H);})(t0);
}

function cProgressi(){
 const c=me();const t=S.ui.ptab;
 let h='<h1 class="h2">Progressi</h1><div class="segbar" role="group" aria-label="Sezione">'+[['stat','Statistiche'],['trofei','Trofei'],['cal','Calendario']].map(x=>'<button aria-pressed="'+(t===x[0])+'" data-act="ptab" data-v="'+x[0]+'">'+x[1]+'</button>').join('')+'</div>';
 const hs=histOf(c.id);
 if(t==='trofei'){
  const bs=badgeState(c.id);const got=bs.filter(b=>b.ok).length;
  h+='<div class="card pink" style="flex-direction:row;align-items:center;gap:16px">'+ring(got/bs.length,84,9,{fg:'var(--accent-ink)',track:'var(--bg)'},'<text x="42" y="47" text-anchor="middle" font-family="Archivo,system-ui" font-weight="850" font-size="19" fill="var(--ink)">'+got+'/'+bs.length+'</text>')+'<div><h3>La tua bacheca</h3><p class="small">Ogni trofeo racconta una parte del tuo percorso. Toccali per i dettagli.</p></div></div>';
  [['Traguardi',['first','n10','n25','n50']],['Costanza',['st4','st8','solo','chk']],['Forza',['pr1','pr10','v1','v2','v3']],['Sfide',['oct']]].forEach(g=>{
   h+='<section class="stack">'+sec(g[0])+'<div class="card"><div class="badges">'+g[1].map(id=>{const b=bs.find(x=>x.id===id);return '<button class="badge'+(b.ok?'':' locked')+'" data-act="badgeOpen" data-id="'+b.id+'">'+medal(b,66)+'<span class="bn">'+esc(b.n)+'</span><span class="bs">'+(b.ok?TIERS[b.t].l:nf(b.cur)+'/'+nf(b.goal))+'</span></button>';}).join('')+'</div></div></section>';});
  return h;
 }
 if(t==='cal'){
  const start=addDays(monday(TODAY),-77);
  h+='<div class="card"><div class="row between"><h3>Ultime 12 settimane</h3><span class="small muted">'+hs.filter(x=>x.date>=start).length+' allenamenti</span></div><div class="heat" role="img" aria-label="Calendario degli allenamenti">';
  for(let d=0;d<7;d++){h+='<span>'+['L','M','M','G','V','S','D'][d]+'</span>';for(let w=0;w<12;w++){const day=addDays(start,w*7+d);const x=hs.find(z=>z.date===day);const fut=day>TODAY;h+='<i style="'+(x?'background:'+(x.type==='coach'?'var(--d1)':'var(--d2)'):fut?'background:transparent':'')+'" data-tip="'+cap(fl(day))+(x?': seduta '+x.key+(x.type==='coach'?' con Aelis':' in autonomia'):fut?'':': riposo')+'"></i>';}}
  h+='</div><div class="row xs muted" style="gap:12px"><span class="row" style="gap:5px"><i class="sw" style="background:var(--d1)"></i>Con Aelis</span><span class="row" style="gap:5px"><i class="sw" style="background:var(--d2)"></i>In autonomia</span><span class="row" style="gap:5px"><i class="sw" style="background:var(--line)"></i>Riposo</span></div></div>';
  h+='<div class="grid2">'+kpi(weekStreak(c.id)+' sett.','Serie in corso')+kpi(hs.length?Math.round(hs.reduce((s,x)=>s+x.min,0)/hs.length)+' min':'–','Durata media')+'</div>';
  return h;
 }
 const p=programOf(c);if(!p)return h+empty('I progressi compaiono dopo i primi allenamenti.');
 h+='<button class="wrapcard" data-act="wrapOpen"><svg class="wmk" viewBox="-720 -720 1440 1400" aria-hidden="true"><use href="#bfDb"></use></svg><span class="grow"><span class="k">Riepilogo del mese</span><h3>Il tuo '+MESEN[+TODAY.slice(5,7)-1]+' è pronto</h3></span>'+ic('play',18)+'</button>';
 const exs=[];hs.forEach(x=>Object.keys(x.sets).forEach(e=>{if(exs.indexOf(e)<0&&exById(e).mode==='Esterno')exs.push(e);}));
 const ex=exs.indexOf(S.ui.cprog)>=0?S.ui.cprog:exs[0];const pts=hs.filter(x=>x.sets[ex]).map(x=>({x:fd(x.date),y:sesMax(x,ex)}));
 const first=pts.length?pts[0].y:0,last=pts.length?pts[pts.length-1].y:0;
 h+='<div class="card"><select class="in" data-bind="cprog" aria-label="Esercizio">'+exs.map(e=>'<option value="'+e+'"'+(e===ex?' selected':'')+'>'+esc(exById(e).name)+'</option>').join('')+'</select>';
 if(pts.length>1)h+='<div class="row" style="align-items:baseline;gap:8px"><span class="big" style="font-size:34px;color:var(--accent-ink)">'+(last>=first?'+':'')+kgf(Math.round((last-first)*10)/10)+' kg</span><span class="muted small">dal '+pts[0].x+' · +'+pct(last-first,first)+'%</span></div>';
 h+=lineChart(pts,'kg','Carico massimo per seduta')+'</div>';
 const vols=[];for(let i=5;i>=0;i--){const w=addDays(monday(TODAY),-7*i);vols.push({x:fd(w).replace(' ',''),y:hs.filter(x=>x.date>=w&&x.date<addDays(w,7)).reduce((s,x)=>s+volume(x.sets),0)});}
 h+='<div class="card"><h3>Volume a settimana</h3>'+barChart(vols.map((v,i)=>({x:v.x,y:Math.round(v.y),tip:'Settimana del '+v.x+': '+nf(Math.round(v.y))+' kg',hl:i===vols.length-2,soft:i===vols.length-1})),{label:'Volume settimanale in kg'})+'<p class="xs muted">Kg × ripetizioni degli esercizi con carico. L\'ultima barra è la settimana in corso.</p></div>';
 h+='<section class="stack">'+sec('Ultimi allenamenti')+hs.slice().reverse().slice(0,3).map(x=>{const rk=Object.keys(x.sets).filter(e=>exById(e).mode==='Esterno').map(e=>rankOf(c.id,x,e)).filter(r=>r>0);return '<div class="li" style="border:1px solid var(--line);border-radius:14px"><span class="grow"><span class="t">Seduta '+x.key+' · '+fd(x.date)+'</span><br><span class="s num">'+x.min+' min · '+nf(volume(x.sets))+' kg</span></span><span class="row" style="gap:2px">'+rk.slice(0,3).map(r=>prMedal(r,26)).join('')+'</span><span class="chip '+(x.type==='coach'?'pink':'')+'">'+(x.type==='coach'?'Con Aelis':'In autonomia')+'</span></div>';}).join('')+'</section>';
 h+='<section class="stack">'+sec('Misure e foto')+(c.showPhotos?(function(){const ms=S.db.measures.filter(m=>m.clientId===c.id);if(ms.length<2)return empty('Le misure arrivano con il primo check.');const a=ms[0],b=ms[ms.length-1];const r=(l,k,u)=>'<tr><td>'+l+'</td><td class="r">'+kgf(a[k])+'</td><td class="r">'+kgf(b[k])+'</td><td class="r" style="color:'+(b[k]<a[k]?'var(--good)':'var(--muted)')+';font-weight:650">'+(b[k]-a[k]>0?'+':'')+kgf(Math.round((b[k]-a[k])*10)/10)+' '+u+'</td></tr>';return '<div class="card scroll"><table class="tbl"><thead><tr><th></th><th class="r">'+fd(a.date)+'</th><th class="r">'+fd(b.date)+'</th><th class="r">Diff.</th></tr></thead><tbody>'+r('Peso','peso','kg')+r('Vita','vita','cm')+r('Fianchi','fianchi','cm')+'</tbody></table></div><div class="grid2"><div class="photo">Mese 1</div><div class="photo">Mese 2</div></div>';})():empty('Hai scelto di non vedere misure e foto qui. Puoi cambiare idea in Altro → Privacy.'))+'</section>';
 return h;
}
function cPercorso(){
 const c=me();const k=contractOf(c);const cr=credits(k);
 let h='<h1 class="h2">Il mio percorso</h1>';
 if(!k)return h+empty('Nessun percorso attivo per ora: Aelis lo prepara dopo il primo incontro.')+'<button class="btn primary lg block" data-act="sheet" data-v="requestLesson">'+ic('cal',18)+' Richiedi una lezione</button>';
 const elapsed=Math.max(0,diff(k.start,TODAY)),total=Math.max(1,diff(k.start,k.end));
 h+='<section class="hero"><div class="k">'+esc(k.name)+'</div><div class="row" style="gap:16px">'+ring(Math.min(1,elapsed/total),92,10,{track:'var(--bg)'},'<text x="46" y="44" text-anchor="middle" font-family="Archivo,system-ui" font-weight="850" font-size="20" fill="var(--ink)">'+Math.max(0,diff(TODAY,k.end))+'</text><text x="46" y="60" text-anchor="middle" font-size="10" fill="var(--muted)">giorni</text>')+'<div class="stack" style="gap:4px"><p class="small">Dal '+fd(k.start)+' al '+fd(k.end)+'</p>'+(k.lessons?'<p><b class="big" style="font-size:28px">'+cr.total+'</b> lezioni con Aelis</p><p class="xs muted">'+cr.gift+' omaggio, usate per prime</p>':'<p class="small muted">Scheda online, senza lezioni in presenza</p>')+'</div></div></section>';
 const next=S.db.appts.filter(a=>a.clientId===c.id&&a.date>=TODAY&&a.status!=='annullato').sort((a,b)=>(a.date+a.time)<(b.date+b.time)?-1:1).slice(0,4);
 h+='<section class="stack">'+sec('Prossime lezioni','<button class="lnk" data-act="sheet" data-v="requestLesson">Richiedi</button>')+(next.length?'<div class="list">'+next.map(a=>'<div class="li"><span class="av">'+ic('cal',18)+'</span><span class="grow"><span class="t">'+cap(fl(a.date))+'</span><br><span class="s">'+a.time+' · '+a.dur+' min</span></span>'+(a.status==='attesa'?'<span class="chip warn">In attesa</span>':'')+'</div>').join('')+'</div>':empty('Nessuna lezione in programma.'))+'</section>';
 h+='<section class="stack">'+sec('Le mie rate')+'<div class="list">'+k.inst.map(i=>{const st=instStatus(i);const lab=st.k==='pagata'?'Pagata':st.k==='scaduta'||st.k==='scadenza'?'Da pagare':st.k==='parziale'?'Acconto versato':'In programma';const cc=st.k==='pagata'?'good':st.k==='programma'?'':'warn';return '<div class="li"><span class="tick" aria-pressed="'+(st.k==='pagata')+'" style="pointer-events:none">'+ic('check',16)+'</span><span class="grow"><span class="t">Rata '+i.n+'</span><br><span class="s">'+(i.paidOn?'il '+fd(i.paidOn):'entro il '+fd(i.due))+'</span></span><span class="chip '+cc+'">'+lab+'</span></div>';}).join('')+'</div>';
 h+=S.ui.showAmounts?'<div class="card"><p class="xs muted">Dettagli economici</p><table class="tbl"><tbody><tr><td>Valore del percorso</td><td class="r">'+eur(k.price)+'</td></tr>'+k.inst.map(i=>'<tr><td>Rata '+i.n+'</td><td class="r">'+eur(i.amount)+'</td></tr>').join('')+'</tbody></table></div>':'<button class="btn sm ghost" style="align-self:flex-start" data-act="showAmounts">Mostra i dettagli economici</button>';
 return h+'</section>';
}
function cAltro(){
 const items=[['check','heart','Check della settimana','5 domande per Aelis',ph('P1')],['sfide','trophy','Sfide di gruppo','Classifiche e sfide di squadra',ph('P2')],['metamorfosi','leaf','La tua trasformazione','Le 4 fasi del tuo percorso',''],['community','users','Community','Condividi solo quello che scegli',ph('P2')],['privacy','lock','Privacy e dati','Cosa vedi, cosa condividi, i tuoi diritti','']];
 const HIDE=['info','booking','automazioni'];
 return '<h1 class="h2">Altro</h1><div class="list">'+items.filter(x=>!REAL||HIDE.indexOf(x[0])<0).map(x=>'<button class="li" data-act="open" data-v="'+x[0]+'"><span class="av">'+ic(x[1],18)+'</span><span class="grow"><span class="t">'+x[2]+'</span><br><span class="s">'+x[3]+'</span></span>'+x[4]+chev()+'</button>').join('')+'</div>'+
  '<button class="card" style="text-align:left;cursor:pointer" data-act="openChat"><div class="row"><span class="av">'+ic('msg',18)+'</span><div class="grow"><p style="font-weight:650">Scrivi ad Aelis</p><p class="small muted">Chat privata dentro l\'app</p></div>'+(chatUnreadTotal()?'<span class="chip pink">'+chatUnreadTotal()+'</span>':chev())+'</div></button>'+accountHTML();
}
const ONB=[['goal','Qual è il tuo obiettivo principale?','text','Es. sentirmi più forte, tonificare, perdere qualche chilo'],
 ['why','Perché è importante per te, adesso?','text','Quello che ti motiva davvero'],
 ['exp','Che esperienza hai in palestra?','pick',['Mai allenato/a','Meno di un anno','1–3 anni','Più di 3 anni']],
 ['freq','Quante volte a settimana riesci ad allenarti?','pick',['1','2','3','4','5 o più']],
 ['avail','In quali giorni e orari sei disponibile?','text','Es. lun e mer dopo le 18'],
 ['limits','Dolori, infortuni o limitazioni da sapere?','text','Scrivi “nessuna” se non ce ne sono. Lo legge solo Aelis.']];
function cOnboard(){
 const v=S.ui.onb||(S.ui.onb={});
 let h=head('Raccontaci di te','Le risposte le legge solo Aelis');
 h+=ONB.map((q,i)=>'<div class="card"><p style="font-weight:650">'+(i+1)+'. '+q[1]+'</p>'+(q[2]==='pick'?'<div class="tabs" role="group" aria-label="'+esc(q[1])+'">'+q[3].map(o=>'<button aria-pressed="'+(v[q[0]]===o)+'" data-act="onbPick" data-k="'+q[0]+'" data-v="'+esc(o)+'">'+esc(o)+'</button>').join('')+'</div>':'<textarea class="in" style="min-height:64px" id="onb-'+q[0]+'" data-bind="onb-'+q[0]+'" placeholder="'+esc(q[3])+'">'+esc(v[q[0]]||'')+'</textarea>')+'</div>').join('');
 h+='<button class="btn primary lg block" data-act="onbSend">Invia ad Aelis</button>';
 return h;
}
function cCheck(){
 const v=S.ui.chk||(S.ui.chk={});
 let h=head('Check della settimana','Meno di un minuto '+ph('P1'));
 h+=Object.keys(CHECKQ).map(q=>'<div class="card"><p style="font-weight:650">'+CHECKQ[q].l+'</p><div class="scale" role="group" aria-label="'+CHECKQ[q].l+'">'+[1,2,3,4,5].map(n=>'<button aria-pressed="'+(v[q]===n)+'" data-act="chk" data-q="'+q+'" data-v="'+n+'">'+n+'</button>').join('')+'</div><div class="row between xs muted"><span>'+CHECKQ[q].lo+'</span><span>'+CHECKQ[q].hi+'</span></div></div>').join('');
 h+='<label class="f">Qualcosa da raccontare ad Aelis? (facoltativo)<textarea class="in" id="chk-note" data-bind="chkNote">'+esc(S.ui.chkNote||'')+'</textarea></label>';
 h+='<button class="btn primary lg block" data-act="chkSend"'+(Object.keys(CHECKQ).every(q=>v[q])?'':' disabled')+'>Invia ad Aelis</button><p class="xs muted">Uno strumento di riflessione, non un test psicologico.</p>';
 return h;
}

function aiReply(q){const t=q.toLowerCase();if(/dolor|male|fastidi|infortun|gonfi|formicol/.test(t))return{warn:true,a:'Questo non posso valutarlo io. Ho avvisato Aelis, che ti scriverà. Se il dolore è forte o improvviso, fermati e senti un medico o un fisioterapista.'};const m=AI_ANS.find(x=>x.k.some(k=>t.indexOf(k)>=0));return{a:m?m.a:'Posso rispondere sugli esercizi della tua scheda e sulle spiegazioni di Aelis. Per tutto il resto inoltro la domanda a lei.'};}
function cCommunity(){
 const c=me();let h=head('Community','Solo per chi sceglie di partecipare '+ph('P2'));
 if(!c.community)return h+'<div class="card pink"><h3>Vuoi entrare nella community?</h3><p>Vedi gli allenamenti degli altri clienti di Aelis e condividi i tuoi, se vuoi.</p><ul class="small" style="margin:0;padding-left:18px"><li>Non pubblichiamo mai niente in automatico</li><li>Scheda, carichi, misure e foto restano privati</li><li>Puoi uscire quando vuoi</li></ul><button class="btn primary block" data-act="commOn">Partecipa</button></div>';
 h+='<div class="card"><p style="font-weight:650">Condividi il tuo ultimo allenamento</p><p class="small muted">Scegli tu cosa mostrare:</p><label class="row small"><input type="checkbox" id="sh-dur" checked> Durata</label><label class="row small"><input type="checkbox" id="sh-ex" checked> Numero di esercizi</label><label class="row small"><input type="checkbox" id="sh-kg"> Carichi (di solito restano privati)</label><input class="in" id="sh-txt" placeholder="Scrivi qualcosa (facoltativo)"><button class="btn primary" data-act="post">Pubblica</button></div>';
 h+=S.db.posts.map(p=>'<div class="feed"><div class="row"><span class="av">'+p.ini+'</span><div class="grow"><p style="font-weight:650">'+esc(p.who)+'</p><p class="xs muted">'+esc(pWhen(p))+'</p></div></div><p>'+esc(p.text)+'</p><span class="chip" style="align-self:flex-start">'+esc(p.stat)+'</span><div class="row"><button class="btn sm kudos" data-act="like" data-id="'+p.id+'" aria-pressed="'+p.liked+'">'+ic('clap',16)+' '+p.likes+'</button></div></div>').join('');
 return h+'<button class="btn sm ghost danger" data-act="commOff">Esci dalla community</button>';
}

function cMeta(){
 const c=me();const sg=stageOf(c.id);const nx=sg.next;const goal=nx?nx.min:sg.n;const p=nx?Math.min(1,sg.n/goal):1;
 let h='<div class="trs"><div class="pagehead"><button class="backb" data-act="back" aria-label="Indietro">'+ic('back')+'</button></div>';
 h+='<h1 class="trs-t">La tua <em>trasformazione</em></h1><p class="trs-s">Ogni allenamento conta.</p>';
 h+='<div class="trs-steps">'+STAGE.map((st,j)=>'<div class="trs-step '+(j<sg.i?'done':j===sg.i?'cur':'lock')+'"><span class="ico">'+stageIcon(j,j===3?64:48)+'</span><span class="num">0'+(j+1)+'</span><span class="nm">'+st.n+'</span><span class="ds">'+esc(st.t)+'</span></div>').join('')+'</div>';
 h+='<section class="trs-card"><div class="row between" style="align-items:flex-start"><div><p class="trs-k">'+ic('chart',16)+' Il tuo percorso</p><h2 class="trs-h">'+sg.s.n+'</h2><p class="trs-acc">'+esc(sg.s.t)+'</p></div><span class="trs-pill">Fase '+(sg.i+1)+' / 4</span></div>'+
  '<div class="row" style="gap:12px;align-items:center"><div class="trs-bar"><i style="width:'+Math.round(p*100)+'%"></i></div><b class="trs-pc">'+Math.round(p*100)+'%</b></div>'+
  '<div class="trs-nums"><div><p><b>'+sg.n+'</b> <span>/ '+goal+'</span></p><p class="trs-l">Allenamenti completati</p></div>'+(nx?'<div><p><b>'+sg.left+'</b> <span>al prossimo traguardo</span></p><p class="trs-l">'+nx.n+'</p></div>':'<div><p class="trs-l">Hai completato tutte le fasi</p></div>')+'</div></section>';
 h+='<section class="trs-card"><p class="trs-k">'+ic('gift',16)+' Le ricompense</p><div class="trs-rw">'+STAGE.map((st,j)=>'<div class="trs-r '+(j<=sg.i?'ok':'lock')+(j===sg.i?' cur':'')+'"><span class="ico">'+stageIcon(j,j===3?52:40)+'</span><p class="nm"><span>0'+(j+1)+'</span> '+st.n+'</p><p class="ds">'+esc(st.gift)+'</p><span class="st">'+(j<=sg.i?ic('check',14):ic('lock',14))+'</span></div>').join('')+'</div></section>';
 if(nx)h+='<section class="trs-card trs-next"><span class="trs-tg">'+ic('target',22)+'</span><div class="grow"><p class="trs-k" style="margin:0">Prossimo traguardo</p><p class="trs-nn">'+nx.n+'</p><p class="trs-l">Hai completato '+sg.n+' allenamenti. Te ne mancano '+sg.left+' per sbloccare il prossimo traguardo.</p></div><button class="trs-btn" data-act="ctabMain" data-v="allena">Vai agli allenamenti '+ic('chev',16)+'</button></section>';
 return h+'</div>';
}
function cSfide(){
 const c=me();let h=head('Sfide di gruppo','Con gli altri clienti di Aelis '+ph('P2'));
 h+=empty('In classifica vedi solo chi ha scelto di partecipare. Niente carichi, misure o foto: solo il numero della sfida.');
 S.db.challenges.forEach(ch=>{const st=chState(ch);const inn=ch.joined.indexOf(c.id)>=0;const bd=chBoard(ch);
  h+='<section class="card"><div class="row between" style="align-items:flex-start"><div><span class="chip '+(st==='attiva'?'pink':'')+'">'+(ch.kind==='squadra'?ic('users',12)+' Di squadra':ic('trophy',12)+' Personale')+' · '+(st==='attiva'?'fino al '+fd(ch.end):st==='prossima'?'dal '+fd(ch.start):'finita')+'</span><h3 style="font-family:var(--display);font-size:20px;font-weight:800;margin-top:8px">'+esc(ch.title)+'</h3><p class="small muted">'+esc(ch.goal)+' · '+esc(ch.prize)+'</p></div></div>';
  if(st==='prossima')h+='<div class="row between"><div class="avs">'+bd.slice(0,5).map(x=>'<span class="av">'+x.c.ini+'</span>').join('')+'</div><span class="small muted">'+bd.length+' iscritt'+(bd.length===1?'o':'i')+'</span></div><button class="btn '+(inn?'':'primary')+' block" data-act="chJoin" data-id="'+ch.id+'">'+(inn?ic('check',16)+' Partecipi · tocca per uscire':'Partecipa')+'</button>';
  else if(ch.kind==='squadra'){const tot=chTotal(ch);h+='<div class="stack" style="gap:6px"><div class="row between" style="align-items:baseline"><span class="big" style="font-size:30px">'+nf(tot)+' kg</span><span class="small muted num">su '+nf(ch.target)+'</span></div><div class="teambar"><i style="width:'+Math.min(100,pct(tot,ch.target))+'%"></i></div></div><div class="lb">'+bd.map(x=>'<div class="r'+(x.c.id===c.id?' me':'')+'"><span></span><span class="av">'+x.c.ini+'</span><span class="small">'+(x.c.id===c.id?'<b>Tu</b>':esc(x.c.name.split(' ')[0]))+'</span><span class="small num muted">'+nf(x.v)+' kg</span></div>').join('')+'</div>'+(inn?'':'<button class="btn primary block" data-act="chJoin" data-id="'+ch.id+'">Partecipa</button>');}
  else{h+='<div class="lb">'+bd.map((x,k)=>{const an=ch.anon.indexOf(x.c.id)>=0&&x.c.id!==c.id;return '<div class="r'+(x.c.id===c.id?' me':'')+'"><span class="pos">'+(k+1)+'</span><span class="av">'+(an?'?':x.c.ini)+'</span><span class="stack" style="gap:4px;min-width:0"><span class="small">'+(x.c.id===c.id?'<b>Tu</b>':an?'Partecipante anonimo':esc(x.c.name.split(' ')[0]))+'</span><span class="bar" style="height:6px"><i style="width:'+Math.min(100,pct(x.v,ch.target))+'%"></i></span></span><span class="small num" style="font-weight:700">'+Math.min(x.v,ch.target)+'/'+ch.target+'</span></div>';}).join('')+'</div>';
   if(inn)h+='<label class="row small" style="gap:8px"><button class="sw2" aria-pressed="'+(ch.anon.indexOf(c.id)>=0)+'" data-act="chAnon" data-id="'+ch.id+'" aria-label="Partecipa in anonimo"></button>Partecipa in anonimo</label>';else h+='<button class="btn primary block" data-act="chJoin" data-id="'+ch.id+'">Partecipa</button>';}
  h+='</section>';});
 return h;
}
function cPrivacy(){
 const c=me();const tg=(id,on,t,s)=>'<button class="li" data-act="'+id+'"><span class="grow"><span class="t">'+t+'</span><br><span class="s">'+s+'</span></span><span class="tick" aria-pressed="'+on+'">'+ic('check',16)+'</span></button>';
 return head('Privacy e dati','Decidi tu cosa vedere e cosa condividere')+'<div class="list">'+tg('togPhotos',c.showPhotos,'Mostrami misure e confronti foto','Aelis li vede comunque per seguirti')+tg('togComm',c.community,'Partecipa alla community','Niente viene pubblicato senza il tuo ok')+'</div>'+
  '<div class="card"><h3>I tuoi dati</h3><p class="small muted">Puoi chiedere una copia dei tuoi dati o la loro cancellazione quando vuoi.</p><div class="row wrap"><button class="btn sm" data-act="exportData">Scarica una copia</button><button class="btn sm danger" data-act="askDelete">Chiedi la cancellazione</button></div></div>';
}

/* ---------- fogli ---------- */
function srcFields(pre){return '<label class="f">Da dove arriva<select class="in" id="'+pre+'-src">'+SRCK.map(k=>'<option>'+k+'</option>').join('')+'</select></label><label class="f">Dettaglio<select class="in" id="'+pre+'-srcd">'+SRCK.map(k=>'<optgroup label="'+k+'">'+SRC[k].d.map(d=>'<option>'+esc(d)+'</option>').join('')+'</optgroup>').join('')+'</select></label>';}
function sheetHTML(){
 const s=S.ui.sheet;if(!s)return '';let b='';
 if(s.kind==='appt'){
  const a=S.db.appts.find(x=>x.id===s.id);const m=AT[a.type];const c=a.clientId?client(a.clientId):null;const k=contractOf(c);const cr=credits(k);
  b='<h2>'+esc(apptTitle(a))+'</h2><p class="muted">'+cap(fl(a.date))+' · '+a.time+' · '+a.dur+' min · '+m.l+'</p>';
  if(c&&k&&k.lessons)b+=empty('Lezioni rimaste: '+cr.total+(cr.gift?' ('+cr.gift+' omaggio, usate per prime)':'')+'. Si scala solo quando segni la lezione come svolta.');
  if(a.status==='previsto'||a.status==='attesa'){
   b+='<button class="btn primary lg block" data-act="apptDone" data-id="'+a.id+'">'+ic('check',18)+' Segna come svolta</button>';
   b+=(c&&k&&k.lessons)?'<div class="grid2"><button class="btn" data-act="apptCancel" data-id="'+a.id+'" data-v="0">Annulla, non scalare</button><button class="btn" data-act="apptCancel" data-id="'+a.id+'" data-v="1">Annulla e scala</button></div><p class="xs muted">Le cancellazioni le decidi caso per caso.</p>':'<button class="btn block" data-act="apptCancel" data-id="'+a.id+'" data-v="0">Annulla appuntamento</button>';
   if(c)b+='<button class="btn ghost block" data-act="openClient" data-id="'+c.id+'">Apri il dossier di '+esc(c.name.split(' ')[0])+'</button>';
  }else b+='<span class="chip '+(a.status==='svolto'?'good':'')+'" style="align-self:flex-start">'+cap(a.status)+'</span>';
 }
 if(s.kind==='pay'){
  const k=S.db.contracts.find(x=>x.id===s.k);const i=k.inst.find(x=>x.n===+s.n);const c=client(k.clientId);const rest=i.amount-i.paid;
  b='<h2>Rata '+i.n+' · '+esc(c.name)+'</h2><p class="muted num">'+esc(k.name)+'<br>Importo '+eur(i.amount)+(i.paid?' · già versati '+eur(i.paid):'')+' · scadenza '+fd(i.due)+'</p>';
  b+=rest>0?'<label class="f">Importo ricevuto<input class="in num" id="pay-amt" type="number" inputmode="decimal" value="'+rest+'"></label><label class="f">Metodo<select class="in" id="pay-met"><option>Contanti</option><option>Bonifico</option><option>POS</option><option>Satispay</option></select></label><button class="btn primary lg block" data-act="paySave">Registra pagamento</button><p class="xs muted">Un importo più basso viene salvato come acconto.</p>':'<span class="chip good" style="align-self:flex-start">Pagata il '+fd(i.paidOn)+'</span>';
 }
 if(s.kind==='exForm'){const f=S.ui.exf;const chips=(k)=>'<div class="chipset" role="group">'+Object.keys(MUSCLES).map(m=>'<button type="button" aria-pressed="'+(f[k].indexOf(m)>=0)+'" data-act="exMus" data-k="'+k+'" data-v="'+m+'">'+MUSCLES[m]+'</button>').join('')+'</div>';
  b='<h2>'+(f.id?'Modifica esercizio':'Nuovo esercizio')+'</h2><label class="f">Nome<input class="in" id="exf-name" maxlength="60" value="'+esc(f.name)+'" placeholder="Es. Squat al multipower"></label>'+
   '<label class="f">Tipo<select class="in" id="exf-mode">'+MODES.map(m=>'<option value="'+m[0]+'"'+(f.mode===m[0]?' selected':'')+'>'+m[1]+'</option>').join('')+'</select></label>'+
   '<div class="f"><span>Muscoli principali</span>'+chips('pri')+'</div><div class="f"><span>Muscoli secondari (facoltativo)</span>'+chips('sec')+'</div>'+
   '<label class="f">Nota tecnica per i clienti<textarea class="in" id="exf-note" maxlength="400" placeholder="Come eseguirlo bene, in due righe">'+esc(f.note)+'</textarea></label>'+
   '<label class="f">Video YouTube (facoltativo)<input class="in" id="exf-vid" inputmode="url" placeholder="https://youtu.be/…" value="'+esc(f.vid||'')+'"></label>'+
   '<button class="btn primary lg block" data-act="exSave">Salva esercizio</button>'+(f.id&&f.custom?'<button class="btn danger block" data-act="exDel">Elimina dalla libreria</button>':'')+(f.id&&!f.custom?'<p class="xs muted">È un esercizio di base: le tue modifiche valgono per tutte le schede.</p>':'');}
 if(s.kind==='inviteLink'){const fn=String(s.name||'').split(' ')[0];const msg='Ciao '+fn+'! Ecco il tuo accesso personale ad AELIS Training: '+s.link+' (vale 14 giorni). A presto, Aelis';
  b='<h2>Invito pronto</h2><p class="muted">Manda questo link a '+esc(s.name)+'. È personale, vale 14 giorni e si usa una volta sola: crea il suo account con la sua email.</p><input class="in linkbox" id="il-url" readonly value="'+esc(s.link)+'" aria-label="Link d\'invito"><button class="btn primary lg block" data-act="copyLink">Copia il link</button><div class="grid2"><a class="btn" href="https://wa.me/?text='+encodeURIComponent(msg)+'" target="_blank" rel="noopener">WhatsApp</a><a class="btn" href="mailto:'+encodeURIComponent(s.email||'')+'?subject='+encodeURIComponent('Il tuo accesso ad AELIS Training')+'&body='+encodeURIComponent(msg)+'">Email</a></div><p class="xs muted">Non condividere il link nei gruppi: chi lo apre per primo può usarlo.</p>';}
 if(s.kind==='delClient'){const c=client(s.id);b='<h2>Eliminare '+esc(c?c.name:'')+'?</h2><p class="muted">Si cancellano per sempre scheda, allenamenti, check, misure, pagamenti e l\'accesso all\'app. Non si può annullare.</p><label class="f">Per confermare scrivi il nome: <b>'+esc(c?c.name:'')+'</b><input class="in" id="dl-name" autocomplete="off"></label><button class="btn danger lg block" data-act="delClient">Elimina definitivamente</button>';}
 if(s.kind==='invite')b='<h2>Invita un cliente</h2><p class="muted">Riceve un link personale per creare l\'account e compilare il questionario.</p><label class="f">Nome e cognome<input class="in" id="inv-name" value="'+esc(s.name||'')+'"></label><label class="f">Email<input class="in" id="inv-mail" type="email" inputmode="email"></label>'+srcFields('inv')+'<button class="btn primary lg block" data-act="inviteSend">'+ic('send',18)+' Invia invito</button>';
 if(s.kind==='newAppt')b='<h2>Nuovo appuntamento</h2><label class="f">Tipo<select class="in" id="na-type">'+Object.keys(AT).map(t=>'<option value="'+t+'">'+AT[t].l+'</option>').join('')+'</select></label><label class="f">Cliente (per le lezioni PT)<select class="in" id="na-client"><option value="">—</option>'+S.db.clients.filter(c=>c.status==='attivo').map(c=>'<option value="'+c.id+'">'+esc(c.name)+'</option>').join('')+'</select></label><label class="f">Titolo (per gli altri tipi)<input class="in" id="na-title" placeholder="Es. Total Body"></label><div class="grid2"><label class="f">Giorno<input class="in" id="na-date" type="date" value="'+S.ui.day+'"></label><label class="f">Ora<input class="in" id="na-time" type="time" value="10:00"></label></div><label class="f">Durata<select class="in" id="na-dur"><option>30</option><option>45</option><option selected>60</option><option>90</option></select></label><label class="row small"><input type="checkbox" id="na-rep"> Ripeti ogni settimana per 4 settimane</label><button class="btn primary lg block" data-act="apptSave">Salva</button>';
 if(s.kind==='proroga'){const k=contractOf(client(S.ui.page.id));b='<h2>Proroga scadenza</h2><p class="muted">Scadenza attuale: '+fd(k.end)+'</p><label class="f">Nuova scadenza<input class="in" id="pr-date" type="date" value="'+addDays(k.end,14)+'"></label><label class="f">Motivo (obbligatorio)<input class="in" id="pr-why" placeholder="Es. due settimane di malattia"></label><button class="btn primary lg block" data-act="prorogaSave">Salva proroga</button>';}
 if(s.kind==='rettifica')b='<h2>Rettifica lezioni</h2><div class="grid2"><label class="f">Variazione<select class="in" id="rt-d"><option value="1">+1 lezione</option><option value="-1">−1 lezione</option></select></label><label class="f">Tipo<select class="in" id="rt-t"><option value="pagata">Incluse</option><option value="omaggio">Omaggio</option></select></label></div><label class="f">Motivo (obbligatorio)<input class="in" id="rt-why" placeholder="Es. lezione recuperata"></label><button class="btn primary lg block" data-act="rettificaSave">Salva rettifica</button>';
 if(s.kind==='misure')b='<h2>Nuove misure</h2><div class="grid2">'+[['peso','Peso kg'],['vita','Vita cm'],['fianchi','Fianchi cm'],['braccio','Braccio cm'],['cosciaDx','Coscia dx cm'],['cosciaSx','Coscia sx cm']].map(f=>'<label class="f">'+f[1]+'<input class="in num" id="ms-'+f[0]+'" type="number" inputmode="decimal" step="0.1"></label>').join('')+'</div><button class="btn primary lg block" data-act="misureSave">Salva</button>';
 if(s.kind==='shiftEdit'){const r=S.db.shifts[+s.id];b='<h2>Correggi '+fd(r.date)+'</h2><div class="grid2"><label class="f">Ingresso<input class="in" id="se-in" type="time" value="'+r.in+'"></label><label class="f">Uscita<input class="in" id="se-out" type="time" value="'+r.out+'"></label></div><label class="f">Motivo<input class="in" id="se-why" placeholder="Es. dimenticato di timbrare"></label><button class="btn primary lg block" data-act="shiftSave">Salva correzione</button>';}
 if(s.kind==='newLead')b='<h2>Nuovo contatto</h2><label class="f">Nome<input class="in" id="ld-name"></label>'+srcFields('ld')+'<label class="f">Interesse<input class="in" id="ld-int" placeholder="Es. pacchetto 8 lezioni"></label><button class="btn primary lg block" data-act="leadSave">Aggiungi</button>';
 if(s.kind==='newSched')b='<h2>Messaggio programmato</h2><label class="f">A chi<select class="in" id="sc-to"><option value="tutti">Tutti i clienti</option>'+S.db.clients.map(c=>'<option value="'+c.id+'">'+esc(c.name)+'</option>').join('')+'</select></label><div class="grid2"><label class="f">Giorno<input class="in" id="sc-d" type="date" value="'+addDays(TODAY,1)+'"></label><label class="f">Ora<input class="in" id="sc-t" type="time" value="07:30"></label></div><label class="f">Testo<textarea class="in" id="sc-txt"></textarea></label><button class="btn primary lg block" data-act="schedSave">Programma</button>';
 if(s.kind==='requestLesson')b='<h2>Richiedi una lezione</h2><p class="muted">Aelis conferma o propone un altro orario.</p><div class="grid2"><label class="f">Giorno<input class="in" id="rq-d" type="date" value="'+addDays(TODAY,2)+'"></label><label class="f">Ora<input class="in" id="rq-t" type="time" value="18:00"></label></div><label class="f">Nota<input class="in" id="rq-n" placeholder="Facoltativa"></label><button class="btn primary lg block" data-act="reqSend">Invia richiesta</button>';

 if(s.kind==='nudge'){const c=client(s.id);b='<h2>Messaggio per '+esc(c.name.split(' ')[0])+'</h2><p class="muted">Messaggio pronto, pensato per riavvicinare senza mettere pressione. Modificala come vuoi.</p><label class="f">Testo<textarea class="in" id="nd-txt">'+esc(nudgeText(c))+'</textarea></label><button class="btn primary lg block" data-act="nudgeSend" data-id="'+c.id+'">'+ic('send',18)+' Invia</button>';}
 if(s.kind==='voice')b='<h2>Detta la serie</h2><p class="muted">Qui il microfono non è disponibile: scrivi la frase come la diresti, oppure tocca un esempio. Nell\'app vera basta parlare.</p><input class="in" id="vc-in" placeholder="Es. 80 chili per 8"><div class="row wrap" style="gap:6px">'+['50 chili per 10','52 e mezzo per 8','dodici ripetizioni'].map(x=>'<button class="btn sm" data-act="voiceTry" data-v="'+x+'">“'+x+'”</button>').join('')+'</div><button class="btn primary lg block" data-act="voiceSend">'+ic('check',18)+' Segna la serie</button>';
 if(s.kind==='autoEdit'){const a=S.db.autos.find(x=>x.id===s.id);b='<h2>'+esc(a.t)+'</h2><p class="muted">'+esc(a.w)+'</p><label class="f">Testo del messaggio<textarea class="in" id="ae-txt">'+esc(a.msg)+'</textarea></label><p class="xs muted">Puoi usare {nome}, {data}, {n} e {fase}.</p><button class="btn primary lg block" data-act="autoSave" data-id="'+a.id+'">Salva</button>';}
 if(s.kind==='newCh')b='<h2>Nuova sfida</h2><label class="f">Nome<input class="in" id="nc-t" placeholder="Es. Dicembre senza scuse"></label><div class="grid2"><label class="f">Tipo<select class="in" id="nc-k"><option value="personale">Personale (classifica)</option><option value="squadra">Di squadra (obiettivo comune)</option></select></label><label class="f">Misura<select class="in" id="nc-m"><option value="n">Allenamenti</option><option value="vol">Kg sollevati</option></select></label></div><label class="f">Obiettivo<input class="in num" id="nc-g" type="number" inputmode="numeric" value="12"></label><div class="grid2"><label class="f">Inizio<input class="in" id="nc-s" type="date" value="2026-12-01"></label><label class="f">Fine<input class="in" id="nc-e" type="date" value="2026-12-31"></label></div><label class="f">Premio<input class="in" id="nc-p" value="Trofeo edizione limitata"></label><button class="btn primary lg block" data-act="chSave">Crea e annuncia</button>';
 if(s.kind==='badge'){const b0=badgeState(S.ui.asClient).find(x=>x.id===s.id);b='<div class="stack" style="align-items:center;text-align:center"><div class="badge new">'+medal(b0,120)+'</div><h2>'+esc(b0.n)+'</h2><span class="chip pink">'+TIERS[b0.t].l+'</span><p class="muted">'+esc(b0.d)+'</p>'+(b0.ok?'<p class="small">Sbloccato! Fa parte della tua bacheca.</p>':'<div class="bar" style="width:100%"><i style="width:'+pct(b0.cur,b0.goal)+'%"></i></div><p class="small num">'+nf(b0.cur)+' / '+nf(b0.goal)+'</p>')+'</div>';}
 return '<div class="scrim" data-act="closeSheet"><div class="sheet" role="dialog" aria-modal="true"><span class="grab"></span>'+b+'<button class="btn ghost block" data-act="closeSheet">Chiudi</button></div></div>';
}

/* ---------- render ---------- */
let toastT=null,lastRoute='',wrapT=null;
function route(){const u=S.ui;return u.role+'|'+u.tab+'|'+(u.page?u.page.name+u.page.id:'')+'|'+u.ctab+'|'+u.ctabMain+'|'+u.ntab+'|'+u.ptab+'|'+(u.wk?'wk':'')+'|'+u.aperiod;}
function render(){
 const r=S.ui.role;
 document.getElementById('r-coach').setAttribute('aria-pressed',r==='coach');
 document.getElementById('r-client').setAttribute('aria-pressed',r==='client');
 const main=document.getElementById('main'),nav=document.getElementById('nav'),wkbar=document.getElementById('wkbar');
 let html='';const pg=S.ui.page;
 if(r==='coach'){
  html=pg?(({cliente:vCliente,editProg:vEditProg,contatti:vContatti,libreria:vLibreria,esercizio:vEsercizio,ore:vOre,programmati:vProgrammati,booking:vBooking,info:vInfo,chats:vChats,chat:vChat,calendario:vCalendario,automazioni:vAutomazioni,sfide:vSfideCoach})[pg.name]||vOggi)():(({oggi:vOggi,clienti:vClienti,agenda:vAgenda,numeri:vNumeri,altro:vAltro})[S.ui.tab]||vOggi)();
  const ur=unread().length;
  const ME='AE';nav.innerHTML=[['oggi','home','Oggi',ur||''],['clienti','users','Clienti',''],['agenda','cal','Agenda',S.db.requests.filter(x=>x.status==='attesa').length||''],['numeri','pie','Numeri',''],['altro','more','Profilo','']].map(t=>'<button data-act="tab" data-v="'+t[0]+'" aria-current="'+(S.ui.tab===t[0]&&!pg?'page':'false')+'" aria-label="'+t[2]+'">'+(t[0]==='altro'?'<span class="pill"'+(t[3]?' data-n="'+t[3]+'"':'')+'><span class="me">'+ME+'</span></span>':'<span class="pill"'+(t[3]?' data-n="'+t[3]+'"':'')+'>'+ic(t[1],26).replace('class="ic"',t[1]==='home'?'class="ic fillable"':'class="ic"')+'</span>')+'<span class="vh">'+t[2]+'</span></button>').join('');
  nav.classList.remove('hide');wkbar.innerHTML='';
 }else{
  if(S.ui.wk)html=cLive();
  else if(pg)html=(({check:cCheck,community:cCommunity,privacy:cPrivacy,esercizio:vEsercizio,metamorfosi:cMeta,onboard:cOnboard,chat:vChat,sfide:cSfide})[pg.name]||cHome)();
  else html=(({home:cHome,allena:cAllena,progressi:cProgressi,percorso:cPercorso,altro:cAltro})[S.ui.ctabMain]||cHome)();
  if(S.ui.wk){nav.classList.add('hide');const w=S.ui.wk;const tot=w.items.reduce((s,i)=>s+i.sets.length,0),dn=w.items.reduce((s,i)=>s+i.sets.filter(x=>x.done).length,0);
   wkbar.innerHTML='<div class="wkbar"><button class="btn" data-act="quitWk">Esci</button><div class="grow small"><b class="num">'+dn+'/'+tot+'</b> serie<div class="bar" style="margin-top:5px"><i style="width:'+pct(dn,tot)+'%"></i></div></div><button class="btn primary" data-act="finishWk"'+(dn?'':' disabled')+'>Completa</button></div>';}
  else{wkbar.innerHTML='';nav.classList.remove('hide');
   const ME=me().ini;const nd=unreadForClient();nav.innerHTML=[['home','home','Home',nd||''],['allena','dumbbell','Allenamento'],['progressi','chart','Progressi'],['percorso','wallet','Percorso'],['altro','more','Profilo','']].map(t=>'<button data-act="ctabMain" data-v="'+t[0]+'" aria-current="'+(S.ui.ctabMain===t[0]&&!pg?'page':'false')+'" aria-label="'+t[2]+'">'+(t[0]==='altro'?'<span class="pill"'+(t[3]?' data-n="'+t[3]+'"':'')+'><span class="me">'+ME+'</span></span>':'<span class="pill"'+(t[3]?' data-n="'+t[3]+'"':'')+'>'+ic(t[1],26).replace('class="ic"',t[1]==='home'?'class="ic fillable"':'class="ic"')+'</span>')+'<span class="vh">'+t[2]+'</span></button>').join('');}
 }
 const rt=route();const changed=rt!==lastRoute;lastRoute=rt;
 html=html.replace(/<section class="hero night"([^>]*)>/g,'$&<svg class="wmk" viewBox="-720 -720 1440 1400" aria-hidden="true"><use href="#bfD"></use></svg>').replace(/<section class="hero"([^>]*)>/g,'$&<svg class="wmk" viewBox="-720 -720 1440 1400" aria-hidden="true"><use href="#bfL"></use></svg>');
 main.innerHTML=html;
 if(changed&&!RM){main.classList.remove('enter');void main.offsetWidth;main.classList.add('enter');}else if(!changed)main.classList.remove('enter');
 document.getElementById('overlay').innerHTML=sheetHTML()+(S.ui.toast?'<div class="toast" role="status">'+esc(S.ui.toast)+'</div>':'');
 const pt=document.getElementById('party');const ph0=partyHTML();
 if(ph0!==pt._last){pt.innerHTML=ph0;pt._last=ph0;}
 const wr=document.getElementById('wrap');const wh=wrapHTML();if(wh!==wr._last){wr.innerHTML=wh;wr._last=wh;clearTimeout(wrapT);if(S.ui.wrap&&!RM&&S.ui.wrap.i<WRAPN-1)wrapT=setTimeout(()=>A.wrapNext(),6000);}
 document.body.style.overflow=(S.ui.party||S.ui.wrap)?'hidden':'';
 if(changed||S.ui.party)requestAnimationFrame(()=>{document.querySelectorAll('.ringarc').forEach(el=>{el.style.strokeDashoffset=el.dataset.off;});});
 else document.querySelectorAll('.ringarc').forEach(el=>{el.style.transition='none';el.style.strokeDashoffset=el.dataset.off;});
 if(changed)countUp(main);
 if(pg&&pg.name==='chat'&&!S.ui.wk){nav.classList.add('hide');}
 updateChatBadge();chatAfterRender();
}
function countUp(root){if(RM)return;root.querySelectorAll('[data-count]').forEach(el=>{const to=+el.dataset.count,fmt=el.dataset.fmt;if(!to)return;const t0=performance.now(),d=900;
 (function f(t){const p=Math.min(1,(t-t0)/d),e=1-Math.pow(1-p,3),v=to*e;el.textContent=fmt==='eur'?eur(Math.round(v)):fmt==='pct'?Math.round(v)+'%':nf(Math.round(v));if(p<1)requestAnimationFrame(f);})(t0);});}
function toast(t){S.ui.toast=t;render();clearTimeout(toastT);toastT=setTimeout(()=>{S.ui.toast=null;const el=document.querySelector('#overlay .toast');if(el)el.remove();},2800);}
const go=()=>window.scrollTo(0,0);
const val=id=>{const e=document.getElementById(id);return e?e.value.trim():'';};

/* ---------- azioni ---------- */
const A={
 role(d){if(REAL)return;S.ui.role=d.v;S.ui.page=null;S.ui.sheet=null;render();go();},
 tab(d){S.ui.role='coach';S.ui.tab=d.v;S.ui.page=null;render();go();},
 numeri(d){S.ui.role='coach';S.ui.tab='numeri';S.ui.page=null;S.ui.ntab=d.v;render();},
 ctabMain(d){S.ui.ctabMain=d.v;S.ui.page=null;render();go();},
 ptab(d){S.ui.ctabMain='progressi';S.ui.page=null;S.ui.ptab=d.v;render();},
 open(d){S.ui.page={name:d.v,id:d.id,prev:S.ui.page};S.ui.sheet=null;render();go();},
 back(){S.ui.page=S.ui.page&&S.ui.page.prev||null;S.ui.editProg=null;render();go();},
 openClient(d){S.ui.role='coach';S.ui.sheet=null;S.ui.page={name:'cliente',id:d.id,prev:S.ui.page&&S.ui.page.name!=='cliente'?S.ui.page:null};S.ui.ctab='profilo';render();go();},
 ctab(d){S.ui.ctab=d.v;render();},
 cfilter(d){S.ui.cfilter=d.v;render();},
 csrc(d){S.ui.csrc=d.v||null;render();},
 lsrc(d){S.ui.lsrc=d.v;render();},
 aperiod(d){S.ui.aperiod=d.v;render();},
 asrc(d){S.ui.asrc=S.ui.asrc===d.v?null:d.v;render();},
 day(d){S.ui.day=d.v;render();},
 week(d){S.ui.day=addDays(monday(S.ui.day),+d.v);render();},
 cses(d){S.ui.cses=d.v;render();},
 sheet(d){S.ui.sheet={kind:d.v,id:d.id};render();},
 badgeOpen(d){S.ui.sheet={kind:'badge',id:d.id};render();},
 closeSheet(){S.ui.sheet=null;render();},
 toast(d){toast(d.v);},
 shift(){const now=new Date();if(S.db.shift){const sh=S.db.shift;S.db.shifts.push({date:TODAY,in:sh.in,out:hm(now)});S.db.shift=null;save();toast('Giornata chiusa: '+dur((Date.now()-sh.ts)/60000)+' registrate');}else{S.db.shift={in:hm(now),ts:Date.now()};save();toast('Buona giornata! Ingresso alle '+hm(now));}},
 readMsg(d){const m=S.db.inbox.find(x=>x.id===d.id);m.read=true;save();A.openClient({id:m.clientId});},
 kudos(d){const h=S.db.history.find(x=>x.id===d.id);h.kudos=!h.kudos;h.kudosSeen=false;save();toast(h.kudos?'Applauso inviato a '+client(h.clientId).name.split(' ')[0]:'Applauso tolto');},
 seeKudos(d){const h=S.db.history.find(x=>x.id===d.id);h.kudosSeen=true;save();render();},
 setSrc(d){const c=client(S.ui.page.id);c.src=d.v;if(SRC[d.v].d.indexOf(c.srcD)<0)c.srcD='';save();render();},
 setSrcD(d){const c=client(S.ui.page.id);c.srcD=d.v;save();render();},
 quickSrc(d){const c=client(d.id);c.src=d.v;save();toast(c.name+': provenienza '+d.v);},
 apptOpen(d){S.ui.sheet={kind:'appt',id:d.id};render();},
 apptDone(d){const a=S.db.appts.find(x=>x.id===d.id);a.status='svolto';let msg='Segnata come svolta';
  if(a.type==='pt'&&a.clientId){const k=contractOf(client(a.clientId));if(k&&k.lessons){const cr=credits(k);if(cr.total>0){const type=cr.gift>0?'omaggio':'pagata';k.mov.push({date:TODAY,type:type,delta:-1,reason:'Lezione svolta '+fd(a.date),by:'Sistema'});msg='Lezione svolta: scalata 1 lezione '+(type==='omaggio'?'omaggio':'inclusa')+'. Ne restano '+credits(k).total+'.';}else msg='Svolta, ma il percorso non ha più lezioni: valuta una rettifica.';}}
  if(a.type==='free'&&a.leadId){const l=S.db.leads.find(x=>x.id===a.leadId);if(l){l.stage='svolta';l.next='Chiedere un feedback';}msg='Prova svolta: il contatto passa a “Prova svolta”.';}
  S.ui.sheet=null;save();toast(msg);},
 apptCancel(d){const a=S.db.appts.find(x=>x.id===d.id);a.status='annullato';let msg='Appuntamento annullato';if(d.v==='1'&&a.clientId){const k=contractOf(client(a.clientId));const cr=credits(k);if(cr.total>0){k.mov.push({date:TODAY,type:cr.gift>0?'omaggio':'pagata',delta:-1,reason:'Cancellazione tardiva '+fd(a.date),by:'Coach'});msg='Annullato e scalata 1 lezione';}}S.ui.sheet=null;save();toast(msg);},
 apptSave(){const type=val('na-type'),cid=val('na-client'),title=val('na-title'),date=val('na-date'),time=val('na-time'),du=+val('na-dur');const rep=document.getElementById('na-rep').checked;
  if(type==='pt'&&!cid){toast('Scegli il cliente per la lezione PT');return;}if(type!=='pt'&&!title){toast('Scrivi un titolo');return;}if(!date||!time){toast('Indica giorno e ora');return;}
  for(let i=0;i<(rep?4:1);i++)S.db.appts.push({id:uid(),date:addDays(date,7*i),time:time,dur:du,type:type,status:'previsto',clientId:type==='pt'?cid:undefined,title:type==='pt'?undefined:title});
  S.ui.sheet=null;S.ui.day=date;save();toast(rep?'4 appuntamenti aggiunti':'Appuntamento aggiunto');},
 reqOk(d){const r=S.db.requests.find(x=>x.id===d.id);r.status='ok';if(r.from){const a=S.db.appts.find(x=>x.clientId===r.clientId&&x.date===r.date&&x.time===r.from);if(a)a.time=r.to;}else{const a=S.db.appts.find(x=>x.reqId===r.id);if(a)a.status='previsto';}save();toast('Approvata: '+client(r.clientId).name.split(' ')[0]+' riceve la conferma');},
 reqNo(d){const r=S.db.requests.find(x=>x.id===d.id);r.status='no';const a=S.db.appts.find(x=>x.reqId===r.id);if(a)a.status='annullato';save();toast('Richiesta rifiutata');},
 payOpen(d){S.ui.sheet={kind:'pay',k:d.k,n:d.n};render();},
 paySave(){const s=S.ui.sheet;const k=S.db.contracts.find(x=>x.id===s.k);const i=k.inst.find(x=>x.n===+s.n);const amt=parseFloat(val('pay-amt').replace(',','.'));if(!(amt>0)){toast('Inserisci un importo');return;}i.paid=Math.min(i.amount,i.paid+amt);i.paidOn=TODAY;i.method=val('pay-met');S.ui.sheet=null;save();toast(i.paid>=i.amount?'Rata '+i.n+' saldata':'Acconto registrato: mancano '+eur(i.amount-i.paid));},
 inviteSend(){const n=val('inv-name'),m=val('inv-mail');if(!n||m.indexOf('@')<1){toast('Servono nome ed email valida');return;}
  if(REAL){const src=val('inv-src'),srcd=val('inv-srcd'),lead=S.ui.sheet&&S.ui.sheet.lead;
   AelisCloud.invite({name:n,email:m}).then(r=>{S.db.clients.push(clientDefaults({id:r.id,name:n,email:m.toLowerCase(),src:src||null,srcD:srcd||''}));S.db.invites.push({name:n,email:m.toLowerCase(),date:TODAY,src:src,srcD:srcd,cid:r.id});
    if(lead){const l=S.db.leads.find(x=>x.id===lead);if(l){l.stage='cliente';l.next='Invito inviato';}}
    save();S.ui.sheet={kind:'inviteLink',id:r.id,link:r.link,name:n,email:m.toLowerCase()};render();}).catch(e=>toast(e.message||'Invito non riuscito'));return;}
  S.db.invites.push({name:n,email:m,date:TODAY,src:val('inv-src'),srcD:val('inv-srcd')});S.ui.sheet=null;save();toast('Invito inviato a '+n+' (simulazione)');},
 obToggle(d){const c=client(S.ui.page.id);c.ob[d.k]=!c.ob[d.k];save();render();},
 viewAs(d){if(REAL){toast('Anteprima disponibile nella versione demo');return;}S.ui.asClient=d.id;S.ui.role='client';S.ui.page=null;S.ui.ctabMain='home';render();go();toast('Stai vedendo l\'app di '+client(d.id).name.split(' ')[0]);},
 suspend(){const c=client(S.ui.page.id);const k=contractOf(c);if(k.status==='sospeso'){k.status='attivo';c.status='attivo';k.adj.push({date:TODAY,old:k.end,neu:null,reason:'Percorso riattivato'});toast('Percorso riattivato. Imposta la nuova scadenza con “Proroga”.');}else{k.status='sospeso';k.suspendedOn=TODAY;c.status='sospeso';k.adj.push({date:TODAY,old:k.end,neu:null,reason:'Percorso sospeso dalla coach'});toast('Percorso sospeso: lo storico resta salvato');}save();},
 prorogaSave(){const k=contractOf(client(S.ui.page.id));const d=val('pr-date'),w=val('pr-why');if(!d||!w){toast('Servono data e motivo');return;}k.adj.push({date:TODAY,old:k.end,neu:d,reason:w});k.end=d;S.ui.sheet=null;save();toast('Nuova scadenza: '+fd(d));},
 rettificaSave(){const k=contractOf(client(S.ui.page.id));const w=val('rt-why');if(!w){toast('Il motivo è obbligatorio');return;}k.mov.push({date:TODAY,type:val('rt-t'),delta:+val('rt-d'),reason:w,by:'Coach'});S.ui.sheet=null;save();toast('Rettifica salvata nel registro');},
 misureSave(){const c=client(S.ui.page.id);const m={clientId:c.id,date:TODAY};['peso','vita','fianchi','braccio','cosciaDx','cosciaSx'].forEach(k=>{const v=parseFloat(val('ms-'+k).replace(',','.'));m[k]=isNaN(v)?'':v;});S.db.measures.push(m);c.ob.foto=true;S.ui.sheet=null;save();toast('Misure salvate');},
 shiftSave(){const r=S.db.shifts[+S.ui.sheet.id];const w=val('se-why');if(!w){toast('Scrivi il motivo della correzione');return;}r.in=val('se-in');r.out=val('se-out');r.fix=w;S.ui.sheet=null;save();toast('Correzione salvata');},
 leadMove(d){const l=S.db.leads.find(x=>x.id===d.id);l.stage=d.v;if(d.v==='perso')l.next='Non interessato';if(d.v==='svolta')l.next='Chiedere un feedback';save();render();},
 leadFix(d){const l=S.db.leads.find(x=>x.id===d.id);const sl=freeSlots()[0];if(!sl)return;l.stage='fissata';l.free=sl.d+' '+sl.t;l.next='Lezione di prova';S.db.appts.push({id:uid(),date:sl.d,time:sl.t,dur:30,type:'free',status:'previsto',title:l.name,leadId:l.id});save();toast('Prova fissata '+GGS[D(sl.d).getDay()]+' '+fd(sl.d)+' alle '+sl.t);},
 leadConvert(d){const l=S.db.leads.find(x=>x.id===d.id);if(REAL){S.ui.sheet={kind:'invite',lead:l.id,name:l.name};render();return;}l.stage='cliente';l.next='Invito inviato';S.db.invites.push({name:l.name,email:l.name.toLowerCase().split(' ')[0]+'@esempio.it',date:TODAY,src:l.src,srcD:l.srcD});save();toast(l.name+' è cliente: invito inviato con provenienza '+l.src+' (simulazione)');},
 leadSave(){const n=val('ld-name');if(!n){toast('Scrivi il nome');return;}S.db.leads.push({id:uid(),name:n,src:val('ld-src'),srcD:val('ld-srcd'),contacted:TODAY,stage:'contattare',free:null,next:'Chiamare',interest:val('ld-int')});S.ui.sheet=null;save();toast('Contatto aggiunto');},
 schedSave(){const t=val('sc-txt');if(!t){toast('Scrivi il testo');return;}S.db.scheduled.push({id:uid(),to:val('sc-to'),when:val('sc-d')+' '+val('sc-t'),trigger:null,text:t});S.ui.sheet=null;save();toast('Messaggio programmato');},
 bookType(d){S.ui.book=Object.assign({slot:null},S.ui.book||{},{type:d.v});render();},
 bookSlot(d){S.ui.book=Object.assign({type:'prova'},S.ui.book||{},{slot:+d.v});render();},
 bookSend(){const b=S.ui.book;const sl=freeSlots()[b.slot];const n=val('bk-name')||'Nuovo contatto';const id=uid();S.db.leads.push({id:id,name:n,src:'Social',srcD:'Instagram',contacted:TODAY,stage:'fissata',free:sl.d+' '+sl.t,next:b.type==='prova'?'Prova da confermare':'Chiacchierata da confermare',interest:val('bk-contact')});S.db.appts.push({id:uid(),date:sl.d,time:sl.t,dur:b.type==='prova'?30:15,type:b.type==='prova'?'free':'consulenza',status:'attesa',title:n,leadId:id});S.ui.book={type:b.type,slot:null,done:true};save();render();},
 bookReset(){S.ui.book=null;render();},
 reset(){if(REAL)return;try{localStorage.removeItem(KEY);}catch(e){}S.db=seed();S.ui.page=null;S.ui.tab='oggi';S.ui.wk=null;S.ui.party=null;toast('Dati di esempio ripristinati');},
 editProg(d){const c=client(d.id);const p=programOf(c);S.ui.editProg={clientId:c.id,version:p?p.version+1:1,sel:0,ai:false,sessions:p?JSON.parse(JSON.stringify(p.sessions)):[{key:'A',name:'Seduta A',items:[]}]};S.ui.page={name:'editProg',id:c.id,prev:S.ui.page};render();go();},
 epSel(d){S.ui.editProg.sel=+d.v;render();},
 epAddSes(){const e=S.ui.editProg;const k=String.fromCharCode(65+e.sessions.length);e.sessions.push({key:k,name:'Seduta '+k,items:[]});e.sel=e.sessions.length-1;render();},
 epDel(d){S.ui.editProg.sessions[S.ui.editProg.sel].items.splice(+d.v,1);render();},
 epSave(){const e=S.ui.editProg;const c=client(e.clientId);if(!e.sessions.some(s=>s.items.length)){toast('Aggiungi almeno un esercizio');return;}let p=programOf(c);if(p){p.sessions=e.sessions;p.version=e.version;p.assigned=TODAY;}else{p={id:'p'+uid(),clientId:c.id,version:e.version,assigned:TODAY,sessions:e.sessions};S.db.programs.push(p);c.program=p.id;}c.ob.scheda=true;S.ui.editProg=null;S.ui.page=S.ui.page.prev;S.ui.ctab='scheda';save();toast('Scheda v'+p.version+' assegnata a '+c.name.split(' ')[0]);},
 startWk(d){const c=me();const p=programOf(c);const ses=p.sessions.find(s=>s.key===d.v);
  S.ui.wk={key:d.v,start:Date.now(),note:'',rest:null,items:ses.items.map(it=>{const l=lastSetsFor(c.id,it.ex);return{ex:it.ex,showNote:false,sets:Array.from({length:it.sets},(_,j)=>{const ls=l&&(l.sets[j]||l.sets[l.sets.length-1]);return{kg:ls?ls.kg:'',reps:ls?ls.reps:it.rmax,rir:it.rir,done:false};})};})};render();go();},
 setDone(d){const w=S.ui.wk;const s=w.items[+d.i].sets[+d.j];s.done=!s.done;w.popped=s.done?d.i+'-'+d.j:null;if(s.done){const pr=programOf(me()).sessions.find(x=>x.key===w.key).items[+d.i];w.rest={until:Date.now()+pr.rest*1000,total:pr.rest};if(navigator.vibrate)try{navigator.vibrate(15);}catch(e){}}render();},
 addSet(d){const it=S.ui.wk.items[+d.v];const last=it.sets[it.sets.length-1];it.sets.push({kg:last.kg,reps:last.reps,rir:last.rir,done:false});render();},
 toggleNote(d){const it=S.ui.wk.items[+d.v];it.showNote=!it.showNote;render();},
 skipRest(){S.ui.wk.rest=null;render();},
 restPlus(){const r=S.ui.wk.rest;if(r){r.until+=15000;r.total+=15;}render();},
 quitWk(){S.ui.wk=null;render();toast('Allenamento non salvato');},
 finishWk(){const w=S.ui.wk;const c=me();const before=badgeState(c.id).filter(b=>b.ok).map(b=>b.id);const stB=stageOf(c.id).i;const sets={};let n=0,tot=0;
  w.items.forEach(it=>{tot+=it.sets.length;const done=it.sets.filter(s=>s.done);if(!done.length)return;n+=done.length;sets[it.ex]=it.sets.map(s=>({kg:s.kg,reps:s.reps,rir:s.rir,done:s.done}));});
  const m=Math.max(1,Math.round((Date.now()-w.start)/60000));
  const h={id:uid(),clientId:c.id,date:TODAY,key:w.key,type:'autonomo',min:m,sets:sets,feel:null,kudos:false};
  const prs=[];Object.keys(sets).forEach(ex=>{const e=exById(ex);if(e.mode!=='Esterno')return;const prev=maxKg(c.id,ex);const r=rankOf(c.id,h,ex);if(r&&prev>0)prs.push({name:e.name,r:r,kg:sesMax(h,ex),prev:prev});});
  prs.sort((a,b)=>a.r-b.r);
  S.db.history.push(h);
  const newB=badgeState(c.id).filter(b=>b.ok&&before.indexOf(b.id)<0);
  const mus={pri:[],sec:[]};Object.keys(sets).forEach(ex=>{const e=exById(ex);e.pri.forEach(x=>{if(mus.pri.indexOf(x)<0)mus.pri.push(x);});e.sec.forEach(x=>{if(mus.sec.indexOf(x)<0&&mus.pri.indexOf(x)<0)mus.sec.push(x);});});
  S.db.inbox.push({id:uid(),kind:'sessione',clientId:c.id,date:TODAY,text:'Ha completato la seduta '+w.key+': '+n+' serie in '+m+' min.'+(prs.filter(x=>x.r===1).length?' Record: '+prs[0].name+' '+kgf(prs[0].kg)+' kg.':'')+(w.note?' Nota: '+w.note:''),read:false});
  const stA=stageOf(c.id).i;S.ui.party={key:w.key,sets:n,tot:tot,min:m,vol:volume(sets),prs:prs,newBadges:newB,feel:null,hid:h.id,mus:mus,share:false,stageUp:stA>stB?stA:null,stage:stageOf(c.id)};S.ui.wk=null;save();render();go();setTimeout(confetti,60);setTimeout(()=>countUp(document.getElementById('party')),120);},
 feel(d){S.ui.party.feel=+d.v;const h=S.db.history.find(x=>x.id===S.ui.party.hid);if(h)h.feel=+d.v;save();render();},
 shareOn(){S.ui.party.share=true;render();document.querySelector('.party').scrollTop=0;},
 shareOff(){S.ui.party.share=false;render();},
 closeParty(){S.ui.party=null;S.ui.ctabMain='home';render();go();},
 chk(d){S.ui.chk=S.ui.chk||{};S.ui.chk[d.q]=+d.v;render();},
 chkSend(){const c=me();S.db.checks.unshift({clientId:c.id,date:TODAY,v:Object.assign({},S.ui.chk),note:S.ui.chkNote||''});c.lastCheck=TODAY;S.db.inbox.push({id:uid(),kind:'feedback',clientId:c.id,date:TODAY,text:'Check della settimana: energia '+S.ui.chk.energia+'/5, stress '+S.ui.chk.stress+'/5, motivazione '+S.ui.chk.motivazione+'/5.'+(S.ui.chkNote?' “'+S.ui.chkNote+'”':''),read:false});S.ui.chk={};S.ui.chkNote='';S.ui.page=null;save();toast('Check inviato ad Aelis');},
 commOn(){me().community=true;save();render();},
 commOff(){me().community=false;save();render();toast('Hai lasciato la community');},
 togPhotos(){const c=me();c.showPhotos=!c.showPhotos;save();render();},
 togComm(){const c=me();c.community=!c.community;save();render();},
 post(){const c=me();const last=histOf(c.id).slice(-1)[0];const parts=[];if(document.getElementById('sh-ex').checked&&last)parts.push(Object.keys(last.sets).length+' esercizi');if(document.getElementById('sh-dur').checked&&last)parts.push(last.min+' min');if(document.getElementById('sh-kg').checked&&last){const k0=Object.keys(last.sets)[0];parts.push(exById(k0).name+' '+kgf(last.sets[k0][0].kg)+' kg');}
  S.db.posts.unshift({id:uid(),date:TODAY,who:c.name.split(' ')[0],ini:c.ini,when:'adesso',text:val('sh-txt')||'Allenamento fatto!',stat:parts.join(' · ')||'Allenamento',likes:0,liked:false});save();render();toast('Pubblicato');},
 copyLink(){const l=S.ui.sheet&&S.ui.sheet.link;if(!l)return;const fb=()=>{const i=document.getElementById('il-url');if(i){i.focus();i.select();}toast('Tieni premuto sul link per copiarlo');};try{navigator.clipboard.writeText(l).then(()=>toast('Link copiato'),fb);}catch(e){fb();}},
 showLink(d){const f=REAL&&AelisCloud.inviteInfo(d.id);const c=client(d.id);if(f&&f.link){S.ui.sheet={kind:'inviteLink',id:d.id,link:f.link,name:c?c.name:'',email:c?c.email:''};render();}else A.reinvite(d);},
 reinvite(d){AelisCloud.reinvite(d.id).then(link=>{const c=client(d.id);S.ui.sheet={kind:'inviteLink',id:d.id,link:link,name:c?c.name:'',email:c?c.email:''};render();}).catch(e=>toast(e.message));},
 linkClient(d){const c=client(d.id);AelisCloud.linkExisting(c).then(link=>{S.ui.sheet={kind:'inviteLink',id:c.id,link:link,name:c.name,email:c.email};render();}).catch(e=>toast(e.message));},
 delAsk(d){S.ui.sheet={kind:'delClient',id:d.id};render();},
 delClient(){const id=S.ui.sheet.id;const c=client(id);if(!c)return;if(val('dl-name').toLowerCase()!==c.name.toLowerCase()){toast('Scrivi il nome esatto per confermare');return;}
  const done=()=>{const keep=x=>x.clientId!==id;['contracts','programs','history','appts','inbox','checks','measures','requests'].forEach(k=>{S.db[k]=S.db[k].filter(keep);});S.db.clients=S.db.clients.filter(x=>x.id!==id);delete S.db.coachMsg[id];S.db.invites=S.db.invites.filter(i=>i.cid!==id&&i.email!==c.email);S.db.scheduled=S.db.scheduled.filter(x=>x.to!==id);S.db.challenges.forEach(ch=>{ch.joined=ch.joined.filter(x=>x!==id);ch.anon=ch.anon.filter(x=>x!==id);});S.ui.sheet=null;S.ui.page=null;S.ui.tab='clienti';save();render();go();toast(c.name.split(' ')[0]+' e tutti i suoi dati sono stati eliminati');};
  if(REAL)AelisCloud.removeClient(id).then(done).catch(e=>toast(e.message));else done();},
 logout(){if(REAL)AelisCloud.logout();},
 changePw(){if(REAL)AelisCloud.changePassword();},
 vidSave(d){const u=val('vid-url');S.db.videos=S.db.videos||{};if(!u){delete S.db.videos[d.id];save();render();toast('Video rimosso');return;}if(!/^https:\/\/(www\.|m\.)?(youtube\.com|youtu\.be)\//.test(u)){toast('Serve un link YouTube che inizi con https://');return;}S.db.videos[d.id]=u;save();render();toast('Video salvato: lo vedono anche i clienti');},
 exportData(){const cl=S.ui.role==='client';let d=S.db;
  if(cl){const id=me().id,own=x=>x.clientId===id,c=Object.assign({},me());delete c.notes;delete c.limits;delete c.src;delete c.srcD;
   d={profilo:c,percorsi:S.db.contracts.filter(own),schede:S.db.programs.filter(own),allenamenti:S.db.history.filter(own),check:S.db.checks.filter(own),misure:S.db.measures.filter(own),appuntamenti:S.db.appts.filter(own),richieste:S.db.requests.filter(own),messaggi:S.db.inbox.filter(own)};}
  const blob=new Blob([JSON.stringify({app:'AELIS Training',esportato:new Date().toISOString(),dati:d},null,2)],{type:'application/json'});
  const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=(cl?'aelis-i-miei-dati-':'aelis-backup-')+TODAY+'.json';document.body.appendChild(a);a.click();setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove();},800);toast(cl?'Ecco i tuoi dati':'Backup scaricato: conservalo in un posto sicuro');},
 onbPick(d){ONB.forEach(q=>{if(q[2]==='text'){const e=document.getElementById('onb-'+q[0]);if(e)S.ui.onb[q[0]]=e.value;}});S.ui.onb[d.k]=d.v;render();},
 onbSend(){const v=S.ui.onb||{};ONB.forEach(q=>{if(q[2]==='text')v[q[0]]=val('onb-'+q[0]);});
  if(!v.goal||!v.exp||!v.freq){toast('Rispondi almeno a obiettivo, esperienza e frequenza');return;}
  const c=me();c.answers=ONB.filter(q=>v[q[0]]).map(q=>[q[1],v[q[0]]]);
  c._onboard={goal:v.goal,avail:v.avail||'',limits:v.limits||'',exp:v.exp,freq:v.freq,answers:c.answers,at:TODAY};
  S.db.inbox.push({id:uid(),kind:'messaggio',clientId:c.id,date:TODAY,text:'Ha compilato il questionario iniziale: '+v.goal,read:false});
  S.ui.onb=null;S.ui.page=null;save();render();go();toast('Grazie! Aelis ha ricevuto le tue risposte');},
 openChat(d){const coach=S.ui.role==='coach';S.ui.sheet=null;S.ui.chatDraft='';
  S.ui.page=coach?(d&&d.id?{name:'chat',id:d.id,prev:S.ui.page&&S.ui.page.name==='chat'?null:S.ui.page}:{name:'chats',prev:S.ui.page}):{name:'chat',prev:S.ui.page&&S.ui.page.name==='chat'?null:S.ui.page};render();go();},
 chatSend(){const t=val('chat-in');if(!t)return;const cid=chatCid();if(!cid)return;S.ui.chatDraft='';
  const done=()=>{render();const i=document.getElementById('chat-in');if(i)i.focus();};
  if(REAL){const i=document.getElementById('chat-in');if(i)i.value='';AelisCloud.chatSend(cid,t).then(done).catch(e=>{S.ui.chatDraft=t;toast(e.message||'Messaggio non inviato');render();});}
  else{chatAll().push({id:uid(),client_id:cid,coach_id:'demo',sender:S.ui.role,body:t.slice(0,2000),created_at:demoNow(),read_at:null});save();done();}},
 dismiss(d){try{localStorage.setItem('aelis-x-'+d.v,'1');}catch(e){}render();},
 installApp(){if(!instEvt)return;instEvt.prompt();instEvt.userChoice.finally(()=>{instEvt=null;render();});},
 pushToggle(){if(!REAL){toast('Nella versione reale le notifiche arrivano sul telefono');return;}
  const st=AelisCloud.pushState();
  if(st==='on'){AelisCloud.disablePush().then(()=>{render();toast('Notifiche disattivate su questo dispositivo');});return;}
  if(st==='install'){toast('Prima aggiungi l\'app alla schermata Home, poi riaprila da lì');return;}
  if(st==='denied'){toast('Le hai bloccate: riattivale dalle impostazioni del telefono');return;}
  if(st==='unsupported'){toast('Questo browser non supporta le notifiche');return;}
  AelisCloud.enablePush().then(r=>{render();toast(r==='on'?'Notifiche attive':r==='denied'?'Notifiche non consentite':'Notifiche non attivate');}).catch(()=>toast('Non sono riuscito ad attivarle: riprova'));},
 calLink(){AelisCloud.calendarLink(false).then(l=>{S.ui.calLink=l;render();}).catch(e=>toast(e.message));},
 calReset(){AelisCloud.calendarLink(true).then(l=>{S.ui.calLink=l;render();toast('Nuovo indirizzo: aggiornalo in Google Calendar');}).catch(e=>toast(e.message));},
 calCopy(){const l=S.ui.calLink;if(!l)return;try{navigator.clipboard.writeText(l).then(()=>toast('Indirizzo copiato'),()=>toast('Tieni premuto sull\'indirizzo per copiarlo'));}catch(e){toast('Tieni premuto sull\'indirizzo per copiarlo');}},
 exNew(){S.ui.exf={id:null,custom:true,name:'',mode:'Esterno',pri:[],sec:[],note:'',vid:''};S.ui.sheet={kind:'exForm'};render();},
 exEdit(d){const e=exById(d.id);S.ui.exf={id:e.id,custom:!!e.custom,name:e.name,mode:e.mode,pri:e.pri.slice(),sec:e.sec.slice(),note:e.note||'',vid:(S.db.videos||{})[e.id]||''};S.ui.sheet={kind:'exForm'};render();},
 exMus(d){const f=S.ui.exf;['name','note','vid'].forEach(k=>{const el=document.getElementById('exf-'+k);if(el)f[k]=el.value;});const m=document.getElementById('exf-mode');if(m)f.mode=m.value;
  const a=f[d.k],o=f[d.k==='pri'?'sec':'pri'];const i=a.indexOf(d.v);if(i>=0)a.splice(i,1);else{a.push(d.v);const j=o.indexOf(d.v);if(j>=0)o.splice(j,1);}render();},
 exSave(){const f=S.ui.exf;const name=val('exf-name'),note=val('exf-note'),vid=val('exf-vid'),mode=val('exf-mode');
  if(name.length<2){toast('Scrivi il nome dell\'esercizio');return;}if(!f.pri.length){toast('Scegli almeno un muscolo principale');return;}
  if(vid&&!/^https:\/\/(www\.|m\.)?(youtube\.com|youtu\.be)\//.test(vid)){toast('Il video deve essere un link YouTube che inizia con https://');return;}
  if(allEx().some(e=>e.id!==f.id&&e.name.toLowerCase()===name.toLowerCase())){toast('Esiste già un esercizio con questo nome');return;}
  const data={name:name,mode:mode||'Esterno',pri:f.pri.slice(),sec:f.sec.slice(),note:note};
  let id=f.id;
  if(!id){id='x'+uid();S.db.customEx=S.db.customEx||[];S.db.customEx.push(Object.assign({id:id,custom:true},data));}
  else if(f.custom){const e=S.db.customEx.find(x=>x.id===id);Object.assign(e,data);}
  else{S.db.exEdits=S.db.exEdits||{};S.db.exEdits[id]=data;}
  S.db.videos=S.db.videos||{};if(vid)S.db.videos[id]=vid;else delete S.db.videos[id];
  S.ui.sheet=null;S.ui.exf=null;save();render();toast(f.id?'Esercizio aggiornato':'Esercizio aggiunto alla libreria');},
 exDel(){const f=S.ui.exf;const used=S.db.programs.some(p=>p.sessions.some(se=>se.items.some(it=>it.ex===f.id)));
  if(used){toast('È in una scheda: toglilo prima dalla scheda');return;}
  const e=S.db.customEx.find(x=>x.id===f.id);if(e)e.deleted=true;S.ui.sheet=null;S.ui.exf=null;S.ui.page=S.ui.page&&S.ui.page.prev||null;save();render();toast('Esercizio eliminato');},
 shareMonth(){const c=me();const n=c?histOf(c.id).filter(x=>x.date.slice(0,7)===TODAY.slice(0,7)).length:0;const t='Questo mese '+n+' allenamenti con AELIS Training. Piccoli cambiamenti, grandi risultati.';
  if(navigator.share)navigator.share({title:'AELIS Training',text:t}).catch(()=>{});else{try{navigator.clipboard.writeText(t).then(()=>toast('Testo copiato: incollalo nella tua storia'));}catch(e){toast(t);}}},
 askDelete(){const c=me();if(!c)return;const t='Ciao Aelis, vorrei che i miei dati venissero cancellati dall\'app.';
  if(REAL){AelisCloud.chatSend(c.id,t).then(()=>toast('Richiesta inviata ad Aelis in chat')).catch(e=>toast(e.message));}else{chatAll().push({id:uid(),client_id:c.id,coach_id:'demo',sender:'client',body:t,created_at:demoNow(),read_at:null});save();toast('Richiesta inviata ad Aelis in chat');}},
 like(d){const p=S.db.posts.find(x=>x.id===d.id);p.liked=!p.liked;p.likes+=p.liked?1:-1;save();render();},

 wrapOpen(){S.ui.wrap={i:0};render();},
 wrapNext(){const w=S.ui.wrap;if(w&&w.i<WRAPN-1){w.i++;render();}},
 wrapPrev(){const w=S.ui.wrap;if(w&&w.i>0){w.i--;render();}},
 wrapClose(){S.ui.wrap=null;clearTimeout(wrapT);render();},
 altPick(d){const it=S.ui.wk.items[+d.i];if(it.ex===d.v)return;it.ex=d.v;const l=lastSetsFor(me().id,d.v);it.sets.forEach((s,j)=>{if(!s.done){const ls=l&&(l.sets[j]||l.sets[0]);s.kg=ls?ls.kg:'';}});render();toast('Cambio: '+exById(d.v).name+'. Aelis lo vedrà nel riepilogo.');},
 voice(d){const i=+d.v;const SR=window.SpeechRecognition||window.webkitSpeechRecognition;
  if(SR){try{const r=new SR();r.lang='it-IT';r.interimResults=false;r.maxAlternatives=1;let got=false;
   r.onresult=e=>{got=true;S.ui.listen=null;A._dict(i,e.results[0][0].transcript);};
   r.onerror=()=>{got=true;S.ui.listen=null;S.ui.sheet={kind:'voice',id:i};render();};
   r.onend=()=>{if(!got){S.ui.listen=null;render();}};r.start();S.ui.listen=i;render();toast('Ti ascolto: “80 chili per 8”');return;}catch(e){}}
  S.ui.sheet={kind:'voice',id:i};render();},
 _dict(i,t){const p=parseSpoken(t);if(!p){S.ui.sheet={kind:'voice',id:i};render();toast('Non ho capito “'+t+'”. Prova “80 chili per 8”.');return;}
  const it=S.ui.wk.items[i];const j=it.sets.findIndex(x=>!x.done);if(j<0){S.ui.sheet=null;toast('Le serie di questo esercizio sono già tutte fatte');return;}
  const st=it.sets[j];if(p.kg!=null)st.kg=p.kg;st.reps=p.reps;S.ui.sheet=null;A.setDone({i:String(i),j:String(j)});toast('Serie '+(j+1)+' segnata: '+(p.kg!=null?kgf(p.kg)+' kg × ':'')+p.reps);},
 voiceTry(d){A._dict(+S.ui.sheet.id,d.v);},
 voiceSend(){A._dict(+S.ui.sheet.id,val('vc-in'));},
 nudgeSend(d){const c=client(d.id);const t=val('nd-txt');if(!t){toast('Scrivi il messaggio');return;}if(REAL&&!AelisCloud.chatCanWrite(c.id)){toast(c.name.split(' ')[0]+' non ha ancora l\'app: invitalo per scrivergli');return;}S.ui.sheet=null;const ok=()=>{save();render();toast('Messaggio inviato in chat a '+c.name.split(' ')[0]);};if(REAL)AelisCloud.chatSend(c.id,t).then(ok).catch(e=>toast(e.message));else{chatAll().push({id:uid(),client_id:c.id,coach_id:'demo',sender:'coach',body:t,created_at:demoNow(),read_at:null});ok();}},
 autoTog(d){const a=S.db.autos.find(x=>x.id===d.id);a.on=!a.on;save();render();toast(a.t+(a.on?': attiva':': in pausa'));},
 autoSave(d){const a=S.db.autos.find(x=>x.id===d.id);const t=val('ae-txt');if(!t){toast('Il testo non può essere vuoto');return;}a.msg=t;S.ui.sheet=null;save();toast('Testo salvato');},
 chJoin(d){const ch=S.db.challenges.find(x=>x.id===d.id);const id=me().id;const k=ch.joined.indexOf(id);if(k>=0)ch.joined.splice(k,1);else ch.joined.push(id);save();render();toast(k>=0?'Non partecipi più a '+ch.title:'Partecipi a '+ch.title+'!');},
 chAnon(d){const ch=S.db.challenges.find(x=>x.id===d.id);const id=me().id;const k=ch.anon.indexOf(id);if(k>=0)ch.anon.splice(k,1);else ch.anon.push(id);save();render();},
 chSave(){const t=val('nc-t'),g=+val('nc-g');if(!t||!(g>0)){toast('Servono nome e obiettivo');return;}const m=val('nc-m');S.db.challenges.push({id:'ch'+uid(),kind:val('nc-k'),title:t,goal:(m==='n'?g+' allenamenti':nf(g)+' kg')+(val('nc-k')==='squadra'?' insieme':' nel periodo'),target:g,metric:m,start:val('nc-s'),end:val('nc-e'),prize:val('nc-p')||'Trofeo edizione limitata',joined:[],base:{},anon:[]});S.ui.sheet=null;save();toast('Sfida creata: i clienti la vedono nell\'app');},
 showAmounts(){S.ui.showAmounts=true;render();},
 reqSend(){const c=me();const id=uid();const d=val('rq-d'),t=val('rq-t');S.db.requests.push({id:id,clientId:c.id,date:d,from:null,to:t,note:val('rq-n')||'Nuova lezione richiesta dall\'app',status:'attesa'});S.db.appts.push({id:uid(),date:d,time:t,dur:60,type:'pt',status:'attesa',clientId:c.id,reqId:id});S.ui.sheet=null;save();toast('Richiesta inviata: Aelis la trova in Agenda');}
};

/* ---------- eventi ---------- */
document.addEventListener('click',e=>{
 const t=e.target.closest('[data-act]');if(!t)return;
 if(t.classList.contains('scrim')&&e.target!==t)return;
 const fn=A[t.dataset.act];if(fn){e.preventDefault();fn(t.dataset);}
});
/* notifiche push collegate alle azioni (solo versione reale) */
(function(){
 const wrap=(k,fn)=>{const o=A[k];A[k]=function(d){const pre=fn.pre?fn.pre(d):null;const r=o.apply(A,arguments);try{fn.post(d,pre);}catch(e){}return r;};};
 wrap('kudos',{post:d=>{const h=S.db.history.find(x=>x.id===d.id);if(h&&h.kudos)pushTo(h.clientId,'Aelis ti ha fatto un applauso','Per l\'allenamento del '+fd(h.date)+'. Continua così!','?go=home');}});
 wrap('reqOk',{post:d=>{const r=S.db.requests.find(x=>x.id===d.id);if(r)pushTo(r.clientId,'Lezione confermata',cap(fl(r.date))+' alle '+(r.to||r.from||''),'?go=percorso');}});
 wrap('reqNo',{post:d=>{const r=S.db.requests.find(x=>x.id===d.id);if(r)pushTo(r.clientId,'Lezione non confermata','Il '+fd(r.date)+' Aelis non può: scrivile in chat per un altro orario.','?chat=1');}});
 wrap('epSave',{pre:()=>S.ui.editProg&&S.ui.editProg.clientId,post:(d,cid)=>{if(cid&&!S.ui.editProg)pushTo(cid,'La tua scheda è pronta','Aelis ha preparato la scheda: aprila e inizia ad allenarti.','?go=allena');}});
 wrap('finishWk',{pre:()=>S.ui.wk&&S.ui.wk.key,post:(d,key)=>{const p=S.ui.party;if(key&&p)pushTo('',me().name.split(' ')[0]+' ha finito l\'allenamento','Seduta '+key+': '+p.sets+' serie in '+p.min+' min.','?go=oggi');}});
 wrap('reqSend',{pre:()=>({d:val('rq-d'),t:val('rq-t')}),post:(d,x)=>{if(!S.ui.sheet)pushTo('',me().name.split(' ')[0]+' chiede una lezione',fd(x.d)+' alle '+x.t,'?go=agenda');}});
 wrap('chkSend',{post:()=>{const c=me();if(c&&!S.ui.page)pushTo('','Check di '+c.name.split(' ')[0],'Ha compilato il check della settimana.','?go=oggi');}});
 wrap('onbSend',{pre:()=>val('onb-goal'),post:(d,goal)=>{const c=me();if(c&&!S.ui.page)pushTo('',c.name.split(' ')[0]+' ha compilato il questionario',goal||'Obiettivo e disponibilità nel suo profilo','?go=clienti');}});
})();
document.addEventListener('input',e=>{
 const t=e.target;
 if(t.dataset.bind){const b=t.dataset.bind;
  if(b==='search'||b==='exq'){S.ui[b]=t.value;const pos=t.selectionStart,id=t.id;render();const s=document.getElementById(id);if(s){s.focus();try{s.setSelectionRange(pos,pos);}catch(x){}}return;}
  if(b==='cnotes'){client(S.ui.page.id).notes=t.value;save();return;}
  if(b==='cmsg'){S.db.coachMsg[S.ui.page.id]=t.value;save();return;}
  if(b==='wkNote'){S.ui.wk.note=t.value;return;}
  if(b==='chkNote'){S.ui.chkNote=t.value;return;}
  if(b==='chatDraft'){S.ui.chatDraft=t.value;t.style.height='auto';t.style.height=Math.min(140,t.scrollHeight)+'px';return;}
  if(b==='epName'){S.ui.editProg.sessions[S.ui.editProg.sel].name=t.value;return;}
 }
 if(t.dataset.w){const p=t.dataset.w.split(',');const s=S.ui.wk.items[+p[0]].sets[+p[1]];const v=t.value.replace(',','.');s[p[2]]=v===''?'':(isNaN(+v)?s[p[2]]:+v);return;}
 if(t.dataset.ep){const p=t.dataset.ep.split(',');const v=parseInt(t.value,10);if(!isNaN(v))S.ui.editProg.sessions[S.ui.editProg.sel].items[+p[0]][p[1]]=v;}
});
document.addEventListener('change',e=>{
 const t=e.target;
 if(t.dataset.bind==='chartEx'){S.ui.chartEx=t.value;render();}
 if(t.dataset.bind==='cprog'){S.ui.cprog=t.value;render();}
 if(t.dataset.bind==='epAdd'&&t.value){S.ui.editProg.sessions[S.ui.editProg.sel].items.push({ex:t.value,sets:3,rmin:8,rmax:12,rest:90,rir:2,alt:[]});render();}
 if(t.dataset.alt){const it=S.ui.wk.items[+t.dataset.alt];it.ex=t.value;const l=lastSetsFor(me().id,t.value);it.sets.forEach((s,j)=>{const ls=l&&(l.sets[j]||l.sets[0]);s.kg=ls?ls.kg:'';});render();}
 if(t.id==='inv-src'||t.id==='ld-src'){const pre=t.id.split('-')[0];const sel=document.getElementById(pre+'-srcd');const g=[].slice.call(sel.querySelectorAll('optgroup')).find(o=>o.label===t.value);if(g)sel.value=g.querySelector('option').value;}
});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&S.ui.wrap&&!S.ui.sheet){A.wrapClose();return;}if(S.ui.wrap&&!S.ui.sheet&&(e.key==='ArrowRight'||e.key==='ArrowLeft')){A[e.key==='ArrowRight'?'wrapNext':'wrapPrev']();return;}if(e.key==='Escape'&&S.ui.sheet){S.ui.sheet=null;render();}if(e.key==='Enter'&&e.target.id==='vc-in'){e.preventDefault();A.voiceSend();}});
// tooltip
const tip=document.getElementById('tip');
function showTip(el,x,y){tip.textContent=el.dataset.tip;tip.classList.add('on');const r=tip.getBoundingClientRect();let L=x+12,T=y-r.height-12;if(L+r.width>innerWidth-8)L=x-r.width-12;if(L<8)L=8;if(T<8)T=y+16;tip.style.left=L+'px';tip.style.top=T+'px';}
document.addEventListener('pointermove',e=>{const el=e.target.closest&&e.target.closest('[data-tip]');if(el&&e.pointerType==='mouse')showTip(el,e.clientX,e.clientY);else if(e.pointerType==='mouse')tip.classList.remove('on');});
document.addEventListener('pointerdown',e=>{const el=e.target.closest&&e.target.closest('[data-tip]');if(el&&e.pointerType!=='mouse'){showTip(el,e.clientX,e.clientY);clearTimeout(tip._t);tip._t=setTimeout(()=>tip.classList.remove('on'),2200);}else if(e.pointerType!=='mouse')tip.classList.remove('on');});
document.addEventListener('scroll',()=>tip.classList.remove('on'),{passive:true});
setInterval(()=>{
 const w=S.ui.wk;
 if(w){const el=document.getElementById('wk-time');if(el)el.textContent=dur((Date.now()-w.start)/60000);
  if(w.rest){const left=Math.ceil((w.rest.until-Date.now())/1000);if(left<=0){w.rest=null;const b=document.getElementById('restbar');if(b){b.querySelector('.grow').textContent='Recupero finito: prossima serie!';setTimeout(()=>{if(b.parentNode)b.remove();},2200);}if(navigator.vibrate)try{navigator.vibrate([30,60,30]);}catch(e){}}else{const r=document.getElementById('rest-left');if(r)r.textContent=left;const arc=document.querySelector('#restbar .ringarc');if(arc){const C=+arc.getAttribute('stroke-dasharray');arc.style.transition='stroke-dashoffset 1s linear';arc.style.strokeDashoffset=(C*(1-left/w.rest.total)).toFixed(2);}}}}
 const sh=S.db.shift;if(sh){const e2=document.getElementById('elapsed');if(e2)e2.textContent=dur((Date.now()-sh.ts)/60000)+' finora';}
},1000);
if(REAL&&window.AelisCloud)AelisCloud.start({S:S,emptyDb:emptyDb,clientDefaults:clientDefaults,setDb:db=>{S.db=db;},reset:()=>{S.db=emptyDb();S.ui.role='coach';S.ui.page=null;S.ui.sheet=null;S.ui.wk=null;S.ui.party=null;S.ui.wrap=null;['main','nav','overlay','wkbar','party','wrap'].forEach(id=>{const e=document.getElementById(id);if(e){e.innerHTML='';e._last=null;}});},rerender:()=>render(),toast:toast,chBoard:chBoard,
 ready:(role,cid)=>{S.ui.role=role;if(cid)S.ui.asClient=cid;S.ui.page=null;S.ui.sheet=null;S.ui.wk=null;S.ui.party=null;S.ui.tab='oggi';S.ui.ctabMain='home';render();go();openFromUrl(location.search);try{if(/[?&](chat|go)=/.test(location.search))history.replaceState(null,'',location.pathname);}catch(e){}},
 chatChanged:(m)=>{const pg=S.ui.page;
  if(m&&m.sender!==S.ui.role&&!(pg&&pg.name==='chat'&&chatCid()===m.client_id)){const c=client(m.client_id);toast(S.ui.role==='coach'?'Nuovo messaggio da '+(c?c.name.split(' ')[0]:'un cliente'):'Nuovo messaggio da Aelis');}
  if(pg&&(pg.name==='chat'||pg.name==='chats')&&!S.ui.sheet){const a=document.activeElement;const typing=a&&a.id==='chat-in';render();if(typing){const i=document.getElementById('chat-in');if(i){i.focus();const n=i.value.length;try{i.setSelectionRange(n,n);}catch(e){}}}}
  else updateChatBadge();}});
else render();
function openFromUrl(q){
 const p=new URLSearchParams(q||'');const ch=p.get('chat'),g=p.get('go');
 if(ch){if(S.ui.role==='coach'&&client(ch))A.openChat({id:ch});else if(S.ui.role==='client')A.openChat({});return;}
 if(g){if(S.ui.role==='coach'&&['oggi','clienti','agenda','numeri','altro'].indexOf(g)>=0)A.tab({v:g});else if(S.ui.role==='client'&&['home','allena','progressi','percorso','altro'].indexOf(g)>=0)A.ctabMain({v:g});}
}
if('serviceWorker' in navigator)navigator.serviceWorker.addEventListener('message',e=>{if(e.data&&e.data.type==='open')openFromUrl(e.data.url||'');});
(function(){const sp=document.getElementById('splash');let seen=false;try{seen=sessionStorage.getItem('aelis-splash4')==='1';}catch(e){}
 if(RM||seen||!sp)return;sp.classList.remove('hide');try{sessionStorage.setItem('aelis-splash4','1');}catch(e){}
 const cv=document.getElementById('sp-cv');const ctx=cv.getContext('2d');const dpr=Math.min(2,window.devicePixelRatio||1);
 const W=cv.clientWidth,H=cv.clientHeight;cv.width=W*dpr;cv.height=H*dpr;ctx.scale(dpr,dpr);ctx.lineCap='round';ctx.lineJoin='round';
 const box=sp.querySelector('.sp').getBoundingClientRect();const cx=box.left+box.width/2,cy=box.top+box.height/2;const k=box.width/52;
 // Lorenz: sigma 10, rho 28, beta 8/3 - due partenze che differiscono di un millesimo
 const T=[{p:[1,1,1],c:'rgba(255,255,255,.55)',h:'#FFFFFF'},{p:[1.001,1,1],c:'rgba(160,160,160,.45)',h:'#C8D6EA'}];
 const map=p=>[cx+p[0]*k,cy-(p[2]-25)*k*.92];
 const step=(p,dt)=>{const f=q=>[10*(q[1]-q[0]),q[0]*(28-q[2])-q[1],q[0]*q[1]-8/3*q[2]];const k1=f(p),a=p.map((v,i)=>v+k1[i]*dt/2),k2=f(a),b=p.map((v,i)=>v+k2[i]*dt/2),k3=f(b),c=p.map((v,i)=>v+k3[i]*dt),k4=f(c);return p.map((v,i)=>v+dt/6*(k1[i]+2*k2[i]+2*k3[i]+k4[i]));};
 // salta il transitorio iniziale per partire vicino all'attrattore
 T.forEach(t=>{for(let i=0;i<2600;i++)t.p=step(t.p,.01);});T[1].p=[T[0].p[0]+.001,T[0].p[1],T[0].p[2]];
 const t0=performance.now();let done=false,faded=false;
 (function f(now){const el=(now-t0)/1000;const n=el<.5?8:el<1.3?18:28;
  ctx.fillStyle='rgba(0,14,41,.02)';ctx.fillRect(0,0,W,H);
  T.forEach(t=>{ctx.strokeStyle=t.c;ctx.lineWidth=1.1;ctx.beginPath();let q=map(t.p);ctx.moveTo(q[0],q[1]);for(let i=0;i<n;i++){t.p=step(t.p,.0075);q=map(t.p);ctx.lineTo(q[0],q[1]);}ctx.stroke();ctx.fillStyle=t.h;ctx.beginPath();ctx.arc(q[0],q[1],2.2,0,7);ctx.fill();});
  if(el>2.55&&!faded){faded=true;cv.classList.add('fade');}
  if(!done&&el<3.6)requestAnimationFrame(f);})(t0);
 const end=()=>{if(done)return;done=true;sp.classList.add('out');setTimeout(()=>sp.classList.add('hide'),650);};sp.addEventListener('click',end);setTimeout(end,4700);})();
})();
if('serviceWorker' in navigator&&location.protocol==='https:')navigator.serviceWorker.register('sw.js').catch(()=>{});
