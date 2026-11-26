// Allenamento dal vivo (versione demo): timer sempre visibile, coach che allena il cliente, vista a 360°.
// python3 -m http.server 8765  (dalla cartella principale)  poi  node tests/e2e-allenamento.js
const { chromium } = require(process.env.PW_PATH||'playwright');
const fs=require('fs');
const O=__dirname+'/shots';fs.mkdirSync(O,{recursive:true});
const URL=(process.env.APP_URL||'http://localhost:8765/index.html')+'?demo';
const fails=[];const ok=(c,m)=>{if(!c){fails.push(m);console.log('FAIL',m);}else console.log('ok  ',m);};
const shot=async(p,n,full)=>{await p.waitForTimeout(300);await p.screenshot({path:O+'/'+n+'.png',fullPage:!!full});};
const txt=p=>p.evaluate(()=>document.body.innerText);
const inView=(p,sel)=>p.evaluate(s=>{const e=document.querySelector(s);if(!e)return false;const r=e.getBoundingClientRect();return r.height>0&&r.top>=0&&r.bottom<=innerHeight+1;},sel);
(async()=>{
 const b=await chromium.launch(process.env.CHROME?{executablePath:process.env.CHROME}:{});
 const ctx=await b.newContext({viewport:{width:400,height:860},deviceScaleFactor:2,reducedMotion:'reduce'});
 await ctx.route(/fonts\.(googleapis|gstatic)\.com/,r=>r.abort());
 const p=await ctx.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
 await p.goto(URL);await p.evaluate(()=>{try{localStorage.clear();sessionStorage.setItem('aelis-splash4','1');}catch(e){}});await p.goto(URL);await p.waitForTimeout(600);
 // ---------- COACH: dossier, vista a 360° ----------
 await p.click('[data-act="tab"][data-v="clienti"]');await p.waitForTimeout(200);
 await p.evaluate(()=>{document.querySelector('[data-act="openClient"][data-id="c1"]')||0;});
 await p.evaluate(()=>{const b=document.createElement('button');b.dataset.act='openTrain';b.dataset.id='c1';document.body.appendChild(b);b.click();b.remove();});
 await p.waitForTimeout(300);
 let t=await txt(p);
 ok(/Allena .* adesso/.test(t),'dossier: riquadro "Allena adesso"');
 ok(/Sedute negli ultimi 30 giorni/.test(t)&&/Settimane attive/.test(t)&&/Volume 4 settimane/.test(t),'360°: indicatori principali');
 ok(/Massimale stimato/.test(t)&&/Record personali/i.test(t),'360°: record e massimale stimato');
 ok(/Ogni allenamento nel dettaglio/i.test(t),'360°: elenco sedute');
 await shot(p,'a01-coach-360',true);
 await p.click('details.sesd summary');await p.waitForTimeout(200);
 ok(await p.$$eval('details.sesd[open] .setchip',e=>e.length)>0,'dettaglio seduta: ogni serie con kg e ripetizioni');
 await shot(p,'a02-coach-dettaglio-seduta');
 // ---------- COACH allena il cliente ----------
 const k=await p.getAttribute('[data-act="coachWk"].primary','data-v');
 await p.click('[data-act="coachWk"].primary');await p.waitForTimeout(300);
 t=await txt(p);
 ok(/Stai allenando/.test(t),'coach: modalità allenamento del cliente');
 ok(await p.evaluate(()=>document.getElementById('nav').classList.contains('hide')),'coach: barra in basso nascosta durante l\'allenamento');
 ok(await inView(p,'#wkbar .wkbar'),'barra "Salva" sempre visibile in basso');
 await shot(p,'a03-coach-allena');
 // recupero personalizzato dal coach
 const r0=await p.textContent('#rc-0');
 await p.click('[data-act="restAdj"][data-i="0"][data-v="15"]');await p.waitForTimeout(100);
 const r1=await p.textContent('#rc-0');
 ok(r0!==r1,'coach cambia il recupero: '+r0+' → '+r1);
 await p.fill('#w-0-0-kg','62,5');await p.fill('#w-0-0-reps','9');
 await p.click('[data-act="setDone"][data-i="0"][data-j="0"]');await p.waitForTimeout(250);
 ok(!!(await p.$('#restbar')),'timer di recupero compare dopo la serie');
 ok(await inView(p,'#restbar'),'timer visibile senza scorrere (in alto sulla pagina)');
 ok(/Poi: /.test(await p.textContent('#restbar')),'timer mostra la prossima serie');
 ok(/^\d+:\d\d$/.test((await p.textContent('#rest-left')).trim()),'timer in minuti:secondi');
 await shot(p,'a04-coach-timer');
 await p.evaluate(()=>window.scrollTo(0,document.body.scrollHeight));await p.waitForTimeout(150);
 ok(await inView(p,'#restbar'),'timer visibile anche in fondo alla pagina');
 await p.evaluate(()=>window.scrollTo(0,0));
 await p.click('[data-act="restMinus"]');await p.click('[data-act="skipRest"]');await p.waitForTimeout(100);
 ok(!(await p.$('#restbar')),'salta recupero');
 // cambio ed aggiunta esercizio
 await p.click('[data-act="wkPick"][data-v="add"]');await p.waitForTimeout(150);
 await p.type('#wkq','hip thrust');await p.waitForTimeout(200);
 ok(await p.$$eval('[data-act="wkPickEx"]',e=>e.length)>0,'ricerca esercizi nel foglio');
 await shot(p,'a05-coach-aggiungi-esercizio');
 const nBefore=await p.$$eval('.ex',e=>e.length);
 await p.click('[data-act="wkPickEx"]');await p.waitForTimeout(200);
 ok(await p.$$eval('.ex',e=>e.length)===nBefore+1,'esercizio aggiunto alla seduta');
 await p.fill('#w-1-0-kg','40');await p.click('[data-act="setDone"][data-i="1"][data-j="0"]');await p.waitForTimeout(100);
 await p.fill('#wk-note','Ottima tecnica oggi');await p.fill('#wk-pnote','Ginocchio sinistro da osservare');
 // esci per errore: chiede conferma
 await p.click('[data-act="quitWk"]');await p.waitForTimeout(100);
 ok(/Esci senza salvare/.test(await txt(p)),'uscita chiede conferma se ci sono serie fatte');
 await p.click('[data-act="finishWk"]');await p.waitForTimeout(400);
 t=await txt(p);
 ok(/registrato/.test(t),'riepilogo dopo il salvataggio');
 await shot(p,'a06-coach-salvato');
 const h=await p.evaluate(()=>{const x=JSON.parse(localStorage.getItem(Object.keys(localStorage).find(k=>/aelis/.test(k)&&!/wk/.test(k)))).history;return x[x.length-1];});
 ok(h&&h.type==='coach'&&h.by==='coach'&&h.clientId==='c1','storico: seduta "con la coach" salvata nel profilo del cliente');
 ok(h&&Object.values(h.sets).some(a=>a.some(s=>s.kg===62.5&&s.reps===9&&s.done)),'storico: peso e ripetizioni inseriti dal coach');
 ok(h&&h.note==='Ottima tecnica oggi'&&h.pnote==='Ginocchio sinistro da osservare','storico: nota per il cliente e nota privata');
 ok(h&&Object.values(h.rest).some(v=>v===+r1.split(':')[0]*60+ +r1.split(':')[1]),'storico: recupero scelto dal coach');
 await p.click('.sheet [data-act="closeSheet"]');await p.waitForTimeout(150);
 ok(/Con te/.test(await txt(p)),'dossier mostra subito la nuova seduta "con te"');
 // ---------- CLIENTE ----------
 await p.evaluate(()=>{const b=document.createElement('button');b.dataset.act='viewAs';b.dataset.id='c1';document.body.appendChild(b);b.click();b.remove();});await p.waitForTimeout(300);
 await p.click('[data-act="ctabMain"][data-v="progressi"]');await p.waitForTimeout(250);
 t=await txt(p);
 ok(/Il tuo diario/i.test(t)&&/Con Aelis/.test(t),'cliente: vede la seduta fatta con la coach nel diario');
 await p.click('details.sesd summary');await p.waitForTimeout(150);
 t=await txt(p);
 ok(/Ottima tecnica oggi/.test(t),'cliente: vede la nota della coach');
 ok(!/Ginocchio sinistro/.test(t),'cliente: NON vede la nota privata');
 await shot(p,'a07-cliente-diario');
 await p.click('[data-act="ctabMain"][data-v="allena"]');await p.waitForTimeout(200);
 await p.click('[data-act="startWk"]');await p.waitForTimeout(300);
 ok(!/Stai allenando/.test(await txt(p)),'cliente: allenamento normale');
 await shot(p,'a08-cliente-allenamento');
 await p.click('[data-act="setDone"][data-i="0"][data-j="0"]');await p.waitForTimeout(250);
 ok(await inView(p,'#restbar'),'cliente: timer visibile subito');
 await shot(p,'a09-cliente-timer');
 await p.evaluate(()=>window.scrollTo(0,document.body.scrollHeight));await p.waitForTimeout(150);
 ok(await inView(p,'#restbar')&&await inView(p,'#wkbar .wkbar'),'cliente: timer e "Completa" visibili anche a fine pagina');
 await shot(p,'a10-cliente-timer-fondo');
 // il recupero finisce da solo
 await p.evaluate(()=>{});await p.click('[data-act="restMinus"]');
 await p.evaluate(()=>{/* accorcia per il test */});
 await p.waitForTimeout(200);
 ok(errs.length===0,'nessun errore JS ('+errs.join(' | ')+')');
 await b.close();
 console.log('\nTOTALE FALLITI: '+fails.length);process.exit(fails.length?1:0);
})().catch(e=>{console.error(e);process.exit(1);});
