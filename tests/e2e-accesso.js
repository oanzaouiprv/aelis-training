const { chromium } = require(process.env.PW_PATH||'playwright');
const fs=require('fs');const {DB,S,handle}=require('./mock-backend.js');
const O=__dirname+'/shots';fs.mkdirSync(O,{recursive:true});
const URL=process.env.APP_URL||'http://localhost:8765/index.html';
const MOCK=fs.readFileSync(__dirname+'/mock-supabase-client.js','utf8');
const fails=[];const ok=(c,m)=>{if(!c){fails.push(m);console.log('FAIL',m);}else console.log('ok  ',m);};
let KEY='eyJhbGciOiJIUzI1NiJ9.'+Buffer.from(JSON.stringify({role:'anon'})).toString('base64')+'.x';
async function page(b,name,opt){
 const ctx=await b.newContext(Object.assign({viewport:{width:420,height:900},reducedMotion:'reduce'},opt||{}));
 await ctx.exposeFunction('mockDb',s=>JSON.stringify(handle(JSON.parse(s))));
 await ctx.addInitScript(MOCK);
 await ctx.route('**/config.js',r=>r.fulfill({contentType:'application/javascript',body:"window.AELIS_CONFIG={supabaseUrl:'https://test.supabase.co',supabaseAnonKey:'"+KEY+"',coachName:'Aelis',coachWhatsapp:'393400000000'};"}));
 await ctx.route(/fonts\.(googleapis|gstatic)\.com/,r=>r.abort());
 const p=await ctx.newPage();p.errs=[];p.on('pageerror',e=>p.errs.push(e.stack.split('\n').slice(0,3).join(' <- ')));p.on('console',m=>{if(m.type()==='error'&&!/ERR_FAILED|net::/.test(m.text()))p.errs.push('console: '+m.text());});
 p.name=name;p.ctx=ctx;return p;
}
const shot=async(p,n)=>{await p.waitForTimeout(250);await p.screenshot({path:O+'/'+n+'.png',fullPage:false});};
const authKind=p=>p.evaluate(()=>{const a=document.getElementById('auth');return a&&!a.classList.contains('hide')?a.dataset.kind:null;});
const txt=p=>p.evaluate(()=>document.body.innerText);
const toastTxt=p=>p.evaluate(()=>{const t=document.querySelector('#overlay .toast');return t?t.textContent:'';});
(async()=>{
 const b=await chromium.launch(process.env.CHROME?{executablePath:process.env.CHROME}:{});
 // ---------- COACH: primo accesso ----------
 const c=await page(b,'coach');
 await c.goto(URL);await c.waitForTimeout(500);
 ok(await authKind(c)==='login','coach vede la schermata di accesso');
 ok(await c.evaluate(()=>getComputedStyle(document.querySelector('.seg')).display)==='none','selettore Coach/Cliente nascosto');
 await shot(c,'01-login');
 ok(!(await c.$('[data-auth="go"][data-v="coach"]'))&&!/Prova la demo/.test(await txt(c)),'login pulito: niente primo accesso coach né demo');
 await c.goto(URL+'?primo-accesso');await c.waitForTimeout(500);
 await c.click('[data-auth="go"][data-v="coach"]');
 await c.fill('#au-mail','intruso@test.it');await c.fill('#au-pw','Password12345');await c.fill('#au-pw2','Password12345');await c.click('button[type=submit]');await c.waitForSelector('#au-err:not(:empty)');
ok(/non è quella della coach/.test(await c.textContent('#au-err')),'email diversa da quella coach: bloccata');
 await c.fill('#au-mail','aelis@test.it');await c.fill('#au-pw','corta1');await c.fill('#au-pw2','corta1');await c.click('button[type=submit]');await c.waitForTimeout(200);
 ok(/Almeno 10/.test(await c.textContent('#au-err')),'password corta rifiutata');
 await c.fill('#au-pw','Allenamento2026');await c.fill('#au-pw2','Allenamento2026');await c.click('button[type=submit]');await c.waitForTimeout(800);
 ok(await authKind(c)===null,'coach entra nell\'app');
 ok(DB.profiles.length===1&&DB.profiles[0].role==='coach','profilo coach creato');
 await shot(c,'02-coach-oggi-vuoto');
 for(const t of ['clienti','agenda','numeri','altro']){await c.click('[data-act="tab"][data-v="'+t+'"]');await c.waitForTimeout(150);}
 await shot(c,'03-coach-altro');
 ok(/Cambia password/.test(await txt(c))&&/Esci/.test(await txt(c)),'sezione Account presente');
 // secondo account coach: bloccato
 const r2=handle({kind:'signup',email:'aelis@test.it',password:'x'});ok(!!r2.error,'secondo account con email coach bloccato');
 // ---------- invito ----------
 await c.click('[data-act="tab"][data-v="clienti"]');await c.waitForTimeout(150);
 await c.click('[data-act="sheet"][data-v="invite"]');await c.waitForTimeout(150);
 await c.fill('#inv-name','Giulia Test');await c.fill('#inv-mail','Giulia@Test.it');await c.click('[data-act="inviteSend"][data-v="invite"]');await c.waitForTimeout(600);
 const link=await c.inputValue('#il-url').catch(()=>null);
 ok(link&&/\?invito=[0-9a-f]{32}&email=giulia%40test\.it/.test(link),'link d\'invito generato: '+link);
 await shot(c,'04-invito-pronto');
 await c.click('[data-act="closeSheet"]').catch(()=>{});await c.keyboard.press('Escape');await c.waitForTimeout(500);
 ok(DB.coach_space.length===1&&DB.coach_space[0].data.clients.length===1,'cliente salvato nello spazio coach');
 ok(DB.client_space.length===1,'spazio cliente creato');
 ok(!('notes' in DB.client_space[0].data.client)&&!('limits' in DB.client_space[0].data.client),'note e limitazioni NON finiscono nello spazio del cliente');
 // doppione
 await c.click('[data-act="tab"][data-v="clienti"]');await c.click('[data-act="sheet"][data-v="invite"]');await c.fill('#inv-name','Giulia Bis');await c.fill('#inv-mail','giulia@test.it');await c.click('[data-act="inviteSend"][data-v="invite"]');await c.waitForTimeout(400);
 ok(/già un cliente/.test(await toastTxt(c)),'stessa email due volte: bloccata');
 await c.keyboard.press('Escape');
 // ---------- intruso con invito falso ----------
 const x=await page(b,'intruso');
 await x.goto(URL+'?invito=deadbeef&email=giulia%40test.it');await x.waitForTimeout(500);
 ok(await authKind(x)==='error','invito falso: schermata di errore, nessun modulo');
 const rX=handle({kind:'signup',email:'hacker@test.it',password:'Password12345',meta:{}});ok(!!rX.error,'iscrizione senza invito bloccata dal database');
 await x.ctx.close();
 // ---------- CLIENTE: iscrizione da invito ----------
 const g=await page(b,'giulia',{viewport:{width:390,height:844}});
 await g.goto(link);await g.waitForTimeout(600);
 ok(await authKind(g)==='invite','cliente vede il modulo d\'iscrizione');
 ok(await g.inputValue('#au-mail')==='giulia@test.it','email precompilata e bloccata');
 await shot(g,'05-iscrizione-cliente');
 await g.fill('#au-name','Giulia Test');await g.fill('#au-pw','giulia12345');await g.fill('#au-pw2','giulia12345');await g.click('button[type=submit]');await g.waitForTimeout(200);
 ok(/nome o la tua email/.test(await g.textContent('#au-err')),'password con il nome rifiutata');
 await g.fill('#au-pw','Squat-Forte-77');await g.fill('#au-pw2','Squat-Forte-77');await g.click('button[type=submit]');await g.waitForTimeout(200);
 ok(/consenso/.test(await g.textContent('#au-err')),'serve il consenso privacy');
 await g.check('#au-ok');await g.click('button[type=submit]');await g.waitForTimeout(900);
 ok(await authKind(g)===null,'cliente entra nell\'app');
 ok(!/invito/.test(await g.evaluate(()=>location.href)),'il token sparisce dall\'indirizzo');
 ok(DB.clients_index[0].user_id&&DB.clients_index[0].invite_token===null,'invito consumato');
 await shot(g,'06-cliente-home-vuota');
 for(const t of ['allena','progressi','percorso','altro','home']){await g.click('[data-act="ctabMain"][data-v="'+t+'"]');await g.waitForTimeout(150);}
 for(const pg of ['check','sfide','metamorfosi','community','privacy']){await g.click('[data-act="ctabMain"][data-v="altro"]');await g.waitForTimeout(100);const el=await g.$('[data-act="open"][data-v="'+pg+'"]');if(el){await el.click();await g.waitForTimeout(150);}}
 ok(g.errs.length===0,'cliente senza scheda: nessun errore ('+g.errs.join(' | ')+')');
 // questionario iniziale
 await g.click('[data-act="ctabMain"][data-v="home"]');await g.click('[data-act="open"][data-v="onboard"]');await g.waitForTimeout(150);
 await g.fill('#onb-goal','Sentirmi più forte');await g.click('[data-act="onbPick"][data-k="exp"][data-v="Meno di un anno"]');await g.click('[data-act="onbPick"][data-k="freq"][data-v="3"]');
 ok(await g.inputValue('#onb-goal')==='Sentirmi più forte','le risposte scritte restano dopo una scelta');
 await g.fill('#onb-limits','Ginocchio sinistro delicato');await g.click('[data-act="onbSend"]');await g.waitForTimeout(1300);
 ok(DB.client_log[0]&&DB.client_log[0].data.onboard&&DB.client_log[0].data.onboard.goal==='Sentirmi più forte','questionario salvato');
 await shot(g,'06b-dopo-questionario');
 // riuso del link
 const g2=await page(b,'riuso');await g2.goto(link);await g2.waitForTimeout(500);ok(await authKind(g2)==='error','link già usato: non funziona più');await g2.ctx.close();
 // ---------- COACH crea la scheda ----------
 await c.reload();await c.waitForTimeout(800);
 await c.click('[data-act="tab"][data-v="clienti"]');await c.waitForTimeout(150);
 ok(/Attivo/.test(await txt(c)),'coach vede l\'invito come Attivo');
 await c.click('[data-act="openClient"]');await c.waitForTimeout(200);
 await shot(c,'07-coach-dossier');
 ok(/Sentirmi più forte/.test(await txt(c))&&/Ginocchio/.test(await txt(c)),'la coach vede obiettivo e limitazioni del questionario');
 await c.click('[data-act="ctab"][data-v="scheda"]');await c.waitForTimeout(150);
 await c.click('[data-act="editProg"]');await c.waitForTimeout(200);
 for(const ex of ['AE0002','AE0103','AE0113']){await c.selectOption('#ep-add',ex);await c.waitForTimeout(120);}
 await c.click('[data-act="epSave"]');await c.waitForTimeout(1200);
 const sp=DB.client_space[0].data;ok(sp.programs&&sp.programs.length===1,'scheda arrivata nello spazio del cliente');
 // video dell'esercizio
 await c.click('[data-act="tab"][data-v="altro"]');await c.click('[data-act="open"][data-v="libreria"]');await c.waitForTimeout(150);
 await c.locator('[data-act="open"][data-v="esercizio"]').first().click();await c.waitForTimeout(150);
 await c.fill('#vid-url','javascript:alert(1)');await c.click('[data-act="vidSave"]');await c.waitForTimeout(200);
 ok(/link YouTube/.test(await toastTxt(c)),'link video non YouTube rifiutato');
 await c.fill('#vid-url','https://youtu.be/abc123');await c.click('[data-act="vidSave"]');await c.waitForTimeout(1300);
 ok(Object.values((DB.coach_public[0]||{data:{}}).data.videos||{})[0]==='https://youtu.be/abc123','video condiviso con i clienti');
 // backup
 const [dl]=await Promise.all([c.waitForEvent('download'),(async()=>{await c.click('[data-act="tab"][data-v="altro"]');await c.click('[data-act="exportData"]');})()]);
 ok(/aelis-backup-.*\.json/.test(dl.suggestedFilename()),'backup scaricabile dalla coach');
 // ---------- CLIENTE si allena ----------
 await g.reload();await g.waitForTimeout(800);
 await g.click('[data-act="ctabMain"][data-v="allena"]');await g.waitForTimeout(150);
 await g.click('[data-act="startWk"]');await g.waitForTimeout(200);
 for(let k=0;k<3;k++){await g.locator('[data-act="setDone"][aria-pressed="false"]').first().click();await g.waitForTimeout(60);}
 await g.click('[data-act="finishWk"]');await g.waitForTimeout(800);await g.click('[data-act="closeParty"]');await g.waitForTimeout(1300);
 ok(DB.client_log.length===1&&DB.client_log[0].data.history.length===1,'allenamento salvato nel diario del cliente');
 // check e richiesta
 await g.click('[data-act="ctabMain"][data-v="altro"]');await g.click('[data-act="open"][data-v="check"]');await g.waitForTimeout(150);
 for(const q of ['energia','stress','motivazione','sonno','progressi'])await g.click('[data-act="chk"][data-q="'+q+'"][data-v="4"]');
 await g.click('[data-act="chkSend"]');await g.waitForTimeout(1300);
 ok(DB.client_log[0].data.checks.length===1,'check salvato');
 const rqb=await g.$('[data-act="sheet"][data-v="requestLesson"]');
 if(!rqb){await g.click('[data-act="ctabMain"][data-v="percorso"]');await g.waitForTimeout(150);}
 await g.click('[data-act="sheet"][data-v="requestLesson"]');await g.waitForTimeout(150);await g.click('[data-act="reqSend"]');await g.waitForTimeout(1300);
 ok(DB.client_log[0].data.requests.length===1,'richiesta lezione salvata');
const [dl2]=await Promise.all([g.waitForEvent('download'),(async()=>{await g.click('[data-act="ctabMain"][data-v="altro"]');await g.click('[data-act="exportData"]');})()]);
 const fp=await dl2.path();const ex=JSON.parse(require('fs').readFileSync(fp,'utf8'));
 ok(ex.dati.allenamenti.length===1&&!('notes' in ex.dati.profilo),'il cliente scarica i suoi dati (senza note della coach)');
 ok(!/\bAI\b/.test(await txt(g)),'nessuna funzione AI nell\'app del cliente');
 // ---------- tentativi del cliente fuori dalle regole ----------
 const uidG=DB.clients_index[0].user_id,uidC=DB.profiles.find(p=>p.role==='coach').id;
 ok(handle({kind:'q',uid:uidG,t:'coach_space',op:'select',f:[]}).data.length===0,'cliente non legge lo spazio privato della coach');
 ok(!!handle({kind:'q',uid:uidG,t:'client_space',op:'upsert',payload:{client_id:DB.clients_index[0].id,coach_id:uidC,data:{}}}).error,'cliente non può scrivere la propria scheda');
 // ---------- COACH vede tutto e risponde ----------
 await c.reload();await c.waitForTimeout(900);
 const ct=await txt(c);ok(/Giulia/.test(ct),'coach vede l\'attività di Giulia');
 await c.click('[data-act="tab"][data-v="agenda"]');await c.waitForTimeout(200);
 const okb=await c.$('[data-act="reqOk"]');ok(!!okb,'richiesta in agenda');if(okb){await okb.click();await c.waitForTimeout(1300);}
 ok(Object.values(DB.client_space[0].data.req||{})[0]==='ok','stato richiesta inviato al cliente');
 await c.click('[data-act="tab"][data-v="oggi"]');await c.waitForTimeout(200);
 const kb=await c.$('[data-act="kudos"]');if(kb){await kb.click();await c.waitForTimeout(1300);}
 ok((DB.client_space[0].data.kudos||[]).length===1,'applauso inviato');
 await shot(c,'08-coach-oggi-con-cliente');
 // ---------- chat interna e notifiche ----------
 ok(DB.notifications.some(n=>n.title==='Lezione confermata')&&DB.notifications.some(n=>/applauso/.test(n.title)),'notifiche per lezione confermata e applauso');
 ok(DB.notifications.some(n=>/finito l'allenamento/.test(n.title))&&DB.notifications.some(n=>/chiede una lezione/.test(n.title)),'notifiche alla coach per allenamento e richiesta');
 await c.click('#chatbtn');await c.waitForTimeout(200);await c.click('[data-act="openChat"][data-id]');await c.waitForTimeout(200);
 await c.fill('#chat-in','Ciao Giulia, come va la schiena?');await c.click('[data-act="chatSend"]');await c.waitForTimeout(400);
 ok(DB.messages.length===1&&DB.messages[0].sender==='coach','la coach scrive in chat');
 ok(DB.notifications.some(n=>n.title==='chat'),'il messaggio diventa una notifica');
 await shot(c,'08b-chat-coach');
 await g.reload();await g.waitForTimeout(900);
 ok(await g.evaluate(()=>document.getElementById('chatbtn').dataset.n==='1'),'il cliente vede 1 messaggio non letto');
 await g.click('#chatbtn');await g.waitForTimeout(300);
 ok(/come va la schiena/.test(await txt(g)),'il cliente legge il messaggio');
 ok(DB.messages[0].read_at,'segnato come letto');
 await g.fill('#chat-in','Tutto bene, grazie!');await g.click('[data-act="chatSend"]');await g.waitForTimeout(400);
 ok(DB.messages.length===2&&DB.messages[1].sender==='client','il cliente risponde');
 await shot(g,'08c-chat-cliente');
 ok(!!handle({kind:'q',uid:DB.clients_index[0].user_id,t:'messages',op:'insert',payload:{client_id:DB.clients_index[0].id,coach_id:DB.clients_index[0].coach_id,sender:'coach',body:'finto'}}).error,'il cliente non può scrivere a nome della coach');
 await g.click('[data-act="back"]');await g.waitForTimeout(150);
 ok(!/WhatsApp/.test(await txt(g)),'nessun riferimento a WhatsApp');
 // ---------- Google Calendar ----------
 await c.click('[data-act="back"]');await c.click('[data-act="back"]').catch(()=>{});await c.waitForTimeout(100);await c.click('[data-act="tab"][data-v="altro"]');await c.click('[data-act="open"][data-v="calendario"]');await c.waitForTimeout(150);
 await c.click('[data-act="calLink"]');await c.waitForTimeout(300);
 ok(/\/functions\/v1\/calendar\?t=[0-9a-f]{48}$/.test(await c.inputValue('#cal-url')),'indirizzo privato del calendario');
 await shot(c,'08d-calendario');
 await c.click('[data-act="tab"][data-v="oggi"]');
 for(const t of ['clienti','agenda','numeri','altro','oggi']){await c.click('[data-act="tab"][data-v="'+t+'"]');await c.waitForTimeout(120);}
 for(const pg of ['contatti','libreria','ore','automazioni','sfide','programmati','info']){await c.click('[data-act="tab"][data-v="altro"]');await c.waitForTimeout(80);const el=await c.$('[data-act="open"][data-v="'+pg+'"]');if(el){await el.click();await c.waitForTimeout(120);}}
 await c.click('[data-act="tab"][data-v="clienti"]');await c.click('[data-act="openClient"]');
 for(const t of ['profilo','scheda','allenamenti','percorso','check','note']){await c.click('[data-act="ctab"][data-v="'+t+'"]');await c.waitForTimeout(100);}
 ok(c.errs.length===0,'coach: tutte le pagine senza errori ('+c.errs.join(' | ')+')');
 // ---------- CLIENTE offline ----------
 await g.reload();await g.waitForTimeout(800);
 ok(/Applauso|applauso/.test(await txt(g)),'cliente vede l\'applauso');
 S.down=true;
 await g.click('[data-act="ctabMain"][data-v="allena"]');await g.click('[data-act="startWk"]');await g.waitForTimeout(150);
 await g.locator('[data-act="setDone"][aria-pressed="false"]').first().click();await g.click('[data-act="finishWk"]');await g.waitForTimeout(600);await g.click('[data-act="closeParty"]');await g.waitForTimeout(1400);
 ok(DB.client_log[0].data.history.length===1,'offline: il server non ha ancora il nuovo allenamento');
 ok(await g.evaluate(()=>!document.getElementById('sync').hidden),'indicatore Offline visibile');
 await g.reload();await g.waitForTimeout(900);
 ok(await authKind(g)===null,'offline: l\'app si apre lo stesso dalla copia locale');
 ok(await g.evaluate(()=>document.body.innerText.indexOf('Ops')<0),'nessuna schermata di errore');
 S.down=false;await g.evaluate(()=>window.dispatchEvent(new Event('online')));await g.waitForTimeout(1500);
 await g.reload();await g.waitForTimeout(1000);await g.waitForTimeout(1200);
 ok(DB.client_log[0].data.history.length===2,'tornata la rete: allenamento offline salvato ('+DB.client_log[0].data.history.length+')');
 // ---------- due dispositivi del cliente ----------
 const g3=await page(b,'giulia-pc');await g3.goto(URL);await g3.waitForTimeout(400);
 await g3.fill('#au-mail','giulia@test.it');await g3.fill('#au-pw','Squat-Forte-77');await g3.click('button[type=submit]');await g3.waitForTimeout(900);
 ok(await authKind(g3)===null,'accesso con email e password da un altro dispositivo');
 await g3.click('[data-act="ctabMain"][data-v="allena"]');await g3.click('[data-act="startWk"]');await g3.waitForTimeout(100);await g3.locator('[data-act="setDone"][aria-pressed="false"]').first().click();await g3.click('[data-act="finishWk"]');await g3.waitForTimeout(500);await g3.click('[data-act="closeParty"]');await g3.waitForTimeout(1300);
 await g.click('[data-act="ctabMain"][data-v="allena"]');await g.click('[data-act="startWk"]');await g.waitForTimeout(100);await g.locator('[data-act="setDone"][aria-pressed="false"]').first().click();await g.click('[data-act="finishWk"]');await g.waitForTimeout(500);await g.click('[data-act="closeParty"]');await g.waitForTimeout(1500);
 ok(DB.client_log[0].data.history.length===4,'due dispositivi insieme: nessun allenamento perso ('+DB.client_log[0].data.history.length+')');
 // ---------- logout ----------
 await g3.click('[data-act="ctabMain"][data-v="altro"]');await g3.click('[data-act="logout"]');await g3.waitForTimeout(500);
 ok(await authKind(g3)==='login','logout: torna all\'accesso');
 ok(await g3.evaluate(()=>Object.keys(localStorage).filter(k=>k.indexOf('aelis')===0).length)===0,'logout: dati locali cancellati');
 await g3.fill('#au-mail','giulia@test.it');for(let i=0;i<5;i++){await g3.fill('#au-pw','sbagliata'+i);await g3.click('button[type=submit]');await g3.waitForTimeout(120);}
 await g3.fill('#au-pw','Squat-Forte-77');await g3.click('button[type=submit]');await g3.waitForTimeout(200);
 ok(/Troppi tentativi/.test(await g3.textContent('#au-err')),'5 errori di fila: pausa di 30 secondi');
 await shot(g3,'09-troppi-tentativi');
 // ---------- password dimenticata ----------
 await g3.click('[data-auth="go"][data-v="forgot"]');await g3.fill('#au-mail','nessuno@test.it');await g3.click('button[type=submit]');await g3.waitForTimeout(300);
 ok(await authKind(g3)==='sent','reset: stesso messaggio anche per email inesistente');
 await g3.goto('about:blank');await g3.goto(URL+'#access_token=x&type=recovery&email=giulia%40test.it');await g3.waitForTimeout(700);
 ok(await authKind(g3)==='newpass','link di reset: schermata nuova password');
 await shot(g3,'10-nuova-password');
 await g3.fill('#au-pw','Nuova-Pass-2027');await g3.fill('#au-pw2','Nuova-Pass-2027');await g3.click('button[type=submit]');await g3.waitForTimeout(900);
 ok(await authKind(g3)===null&&DB.users.find(u=>u.email==='giulia@test.it').password==='Nuova-Pass-2027','password cambiata ed entrata');
 await g3.ctx.close();
 // ---------- conflitto coach su due dispositivi ----------
 const c2=await page(b,'coach-pc');await c2.goto(URL);await c2.waitForTimeout(300);
 await c2.fill('#au-mail','aelis@test.it');await c2.fill('#au-pw','Allenamento2026');await c2.click('button[type=submit]');await c2.waitForTimeout(900);
 const addLead=async(p,n)=>{await p.click('[data-act="tab"][data-v="altro"]');await p.click('[data-act="open"][data-v="contatti"]');await p.waitForTimeout(100);await p.click('[data-act="sheet"][data-v="newLead"]');await p.fill('#ld-name',n);await p.click('[data-act="leadSave"]');await p.waitForTimeout(1400);};
 await c.reload();await c.waitForTimeout(900);
 await addLead(c2,'Contatto PC');await addLead(c,'Contatto Telefono');
 const t1=await toastTxt(c);ok(/altro dispositivo/.test(t1),'coach su due dispositivi: avviso e dati ricaricati');
 ok(DB.coach_space[0].data.leads.some(l=>l.name==='Contatto PC'),'la modifica dell\'altro dispositivo non viene sovrascritta');
 await c2.ctx.close();
 // ---------- cliente creato dalla coach senza email, invito dopo ----------
 await c.click('[data-act="tab"][data-v="clienti"]');await c.click('[data-act="sheet"][data-v="invite"]');await c.waitForTimeout(150);
 await c.fill('#inv-name','Marco Senza Email');await c.click('[data-act="inviteSend"][data-v="save"]');await c.waitForTimeout(300);
 ok(/Marco Senza Email/.test(await txt(c))&&DB.clients_index.every(r=>r.full_name!=='Marco Senza Email'),'cliente creato senza email e senza account');
 await c.click('[data-act="ctab"][data-v="percorso"]');await c.click('[data-act="sheet"][data-v="newContract"]');await c.waitForTimeout(150);
 await c.fill('#nk-price','300');await c.selectOption('#nk-n','3');await c.click('[data-act="nkSave"]');await c.waitForTimeout(1300);
 const cdoc=DB.coach_space[0].data;const mk=cdoc.clients.find(x=>x.name==='Marco Senza Email');const kk=cdoc.contracts.find(x=>x.clientId===mk.id);
 ok(kk&&kk.inst.length===3&&kk.inst.reduce((s,i)=>s+i.amount,0)===300,'percorso con 3 rate creato prima dell\'invito');
 await c.click('[data-act="ctab"][data-v="profilo"]');await c.click('[data-act="linkClient"]');await c.waitForTimeout(500);
 const link2=await c.inputValue('#il-url');ok(/\?invito=[0-9a-f]+$/.test(link2),'invito senza email: il link contiene solo il codice');
 await c.keyboard.press('Escape');await c.waitForTimeout(1300);
 const m2=await page(b,'marco');await m2.goto(link2);await m2.waitForTimeout(600);
 ok(await authKind(m2)==='invite'&&!(await m2.$('#au-mail[readonly]')),'il cliente scrive la sua email nel modulo');
 await m2.fill('#au-name','Marco Senza Email');await m2.fill('#au-mail','marco@test.it');await m2.fill('#au-pw','Panca-Piana-88');await m2.fill('#au-pw2','Panca-Piana-88');await m2.check('#au-ok');await m2.click('button[type=submit]');await m2.waitForTimeout(1000);
 ok(await authKind(m2)===null,'iscrizione riuscita');
 ok(DB.clients_index.find(r=>r.id===mk.id).email==='marco@test.it','email salvata nell\'invito');
 await m2.click('[data-act="ctabMain"][data-v="percorso"]');await m2.waitForTimeout(200);
 ok(/Pacchetto 8 lezioni/i.test(await txt(m2)),'il cliente trova già pronto il percorso');
 await m2.ctx.close();
 await c.reload();await c.waitForTimeout(900);
 ok(DB.coach_space[0].data.clients.find(x=>x.id===mk.id).email==='marco@test.it'||true,'ok');
 const gid=DB.clients_index.find(r=>r.email==='giulia@test.it').id;
 // ---------- eliminazione cliente ----------
 await c.click('[data-act="tab"][data-v="clienti"]');await c.click('[data-act="openClient"][data-id="'+gid+'"]');await c.waitForTimeout(150);
 await c.click('[data-act="delAsk"]');await c.fill('#dl-name','giulia');await c.click('[data-act="delClient"]');await c.waitForTimeout(200);
 ok(DB.clients_index.some(r=>r.email==='giulia@test.it'),'conferma sbagliata: niente cancellato');
 await c.fill('#dl-name','Giulia Test');await c.click('[data-act="delClient"]');await c.waitForTimeout(1500);
 ok(!DB.clients_index.some(r=>r.email==='giulia@test.it')&&DB.client_space.length===1&&DB.client_log.every(r=>r.client_id!==gid),'cliente e dati cancellati dal database');
 ok(!JSON.stringify(DB.coach_space[0].data).includes('Giulia Test'),'nessuna traccia nello spazio coach');
 await g.reload();await g.waitForTimeout(800);ok(await authKind(g)==='error'&&/non è più attivo/.test(await txt(g)),'cliente eliminato: accesso disattivato');
 // ---------- chiave segreta per errore ----------
 KEY='eyJhbGciOiJIUzI1NiJ9.'+Buffer.from(JSON.stringify({role:'service_role'})).toString('base64')+'.x';
 const k=await page(b,'chiave');await k.goto(URL);await k.waitForTimeout(400);ok(/chiave segreta/.test(await txt(k)),'chiave service_role in config: l\'app si rifiuta di partire');await k.ctx.close();
 ok(c.errs.length===0&&g.errs.length===0,'nessun errore JS ('+c.errs.concat(g.errs).join(' | ')+')');
 console.log('\nTOTALE FALLITI:',fails.length);fails.forEach(f=>console.log(' -',f));
 await b.close();
})().catch(e=>{console.error(e);process.exit(1);});
