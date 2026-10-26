// Finto Supabase in memoria, con le stesse regole di accesso dello schema SQL (per testare l'app).
const crypto=require('crypto');
const DB={users:[],profiles:[],clients_index:[],coach_space:[],coach_public:[],client_space:[],client_log:[]};
const S={coach_email:'aelis@test.it',down:false,confirm:false,log:[]};
const PK={profiles:'id',clients_index:'id',coach_space:'coach_id',coach_public:'coach_id',client_space:'client_id',client_log:'client_id'};
let tick=0;const ts=()=>{tick++;return new Date(Date.now()+tick).toISOString().replace('Z',String(tick%1000).padStart(3,'0'))+'+00:00';};
const clone=o=>JSON.parse(JSON.stringify(o));
const err=(message,code,status)=>({data:null,error:{message,code,status}});
function can(t,op,row,uid){
 const pr=DB.profiles.find(p=>p.id===uid),coach=pr&&pr.role==='coach',mc=DB.clients_index.find(r=>r.user_id===uid&&uid);
 switch(t){
  case 'profiles':return op==='select'&&row.id===uid;
  case 'clients_index':if(coach&&row.coach_id===uid)return true;return op==='select'&&!!uid&&row.user_id===uid;
  case 'coach_space':return !!coach&&row.coach_id===uid;
  case 'coach_public':if(coach&&row.coach_id===uid)return true;return op==='select'&&!!mc&&row.coach_id===mc.coach_id;
  case 'client_space':if(coach&&row.coach_id===uid&&(op==='select'||op==='delete'||DB.clients_index.some(r=>r.id===row.client_id&&r.coach_id===uid)))return true;return op==='select'&&!!mc&&row.client_id===mc.id;
  case 'client_log':if(op==='select'&&coach&&row.coach_id===uid)return true;if(!mc)return false;if(op==='select')return row.client_id===mc.id;if(op==='insert'||op==='update')return row.client_id===mc.id&&row.coach_id===mc.coach_id;return false;
 }return false;
}
const match=(r,f)=>f.every(([k,c,v])=>k==='eq'?String(r[c])===String(v):k==='is'?r[c]==v:true);
function finish(rows,one){if(one==='single'){if(rows.length!==1)return err('JSON object requested, multiple (or no) rows returned','PGRST116',406);return {data:rows[0],error:null};}
 if(one==='maybe'){if(rows.length>1)return err('multiple rows','PGRST116',406);return {data:rows[0]||null,error:null};}return {data:rows,error:null};}
function defaults(t,o){o=Object.assign({},o);
 if(t==='clients_index'){if(!('invite_token' in o))o.invite_token=crypto.randomUUID().replace(/-/g,'');if(!('invite_expires' in o))o.invite_expires=new Date(Date.now()+14*864e5).toISOString();if(!('user_id' in o))o.user_id=null;o.created_at=ts();}
 if(t!=='profiles'&&t!=='clients_index'){if(!('data' in o))o.data={};if(!o.updated_at)o.updated_at=ts();}
 return o;}
function insertRow(t,o,uid){
 o=defaults(t,o);
 if(DB[t].some(r=>r[PK[t]]===o[PK[t]]))return err('duplicate key value violates unique constraint','23505',409);
 if(t==='clients_index'&&DB[t].some(r=>r.coach_id===o.coach_id&&r.email.toLowerCase()===String(o.email).toLowerCase()))return err('duplicate key value violates unique constraint "clients_index_email"','23505',409);
 if((t==='client_space'||t==='client_log')&&!DB.clients_index.some(r=>r.id===o.client_id))return err('violates foreign key constraint','23503',409);
 if(!can(t,'insert',o,uid))return err('new row violates row-level security policy for table "'+t+'"','42501',403);
 if(o.data&&JSON.stringify(o.data).length>=1000000)return err('check constraint size','23514',400);
 DB[t].push(o);return {data:o,error:null};
}
function q(op){
 const {uid,t,f,payload,one,ret}=op;if(!DB[t])return err('relation does not exist','42P01',404);
 if(op.op==='select')return finish(clone(DB[t].filter(r=>match(r,f)&&can(t,'select',r,uid))),one);
 if(op.op==='insert'){const arr=[].concat(payload),out=[];for(const o of arr){const r=insertRow(t,o,uid);if(r.error)return r;out.push(r.data);}return ret?finish(clone(out),one):{data:null,error:null};}
 if(op.op==='update'){const rows=DB[t].filter(r=>match(r,f)&&can(t,'select',r,uid)&&can(t,'update',r,uid));const out=[];
  for(const r of rows){const n=Object.assign({},r,payload);if(!can(t,'update',n,uid))return err('new row violates row-level security policy','42501',403);Object.assign(r,payload);out.push(r);}
  return ret?finish(clone(out),one):{data:null,error:null};}
 if(op.op==='upsert'){const o=payload;const ex=DB[t].find(r=>r[PK[t]]===o[PK[t]]);
  if(ex){if(!can(t,'update',ex,uid))return err('new row violates row-level security policy (upsert)','42501',403);const n=Object.assign({},ex,o);if(!can(t,'update',n,uid))return err('rls','42501',403);Object.assign(ex,o);return {data:null,error:null};}
  const r=insertRow(t,o,uid);return r.error?r:{data:null,error:null};}
 if(op.op==='delete'){const rows=DB[t].filter(r=>match(r,f)&&can(t,'delete',r,uid));DB[t]=DB[t].filter(r=>rows.indexOf(r)<0);
  if(t==='clients_index'){const ids=rows.map(r=>r.id);DB.client_space=DB.client_space.filter(r=>ids.indexOf(r.client_id)<0);DB.client_log=DB.client_log.filter(r=>ids.indexOf(r.client_id)<0);}
  return {data:null,error:null};}
 return err('op?');
}
function handle(op){
 S.log.push(op.kind+(op.t?':'+op.op+':'+op.t:''));
 if(S.down)return err('TypeError: Failed to fetch');
 switch(op.kind){
  case 'q':return q(op);
  case 'rpc':if(op.name==='check_invite'){const a=op.args;return {data:DB.clients_index.some(r=>r.email.toLowerCase()===String(a.p_email).toLowerCase()&&r.invite_token===a.p_token&&!r.user_id&&new Date(r.invite_expires)>new Date()),error:null};}return err('no rpc');
  case 'signup':{const email=String(op.email).toLowerCase(),meta=op.meta||{};
   if(DB.users.some(u=>u.email===email))return err('User already registered','user_already_exists',422);
   const isCoach=email===S.coach_email&&!DB.profiles.some(p=>p.role==='coach');
   const inv=DB.clients_index.find(r=>r.email.toLowerCase()===email&&r.invite_token===(meta.invite_token||'')&&!r.user_id&&new Date(r.invite_expires)>new Date());
   if(!isCoach&&!inv)return err('Database error saving new user','unexpected_failure',500);
   const u={id:crypto.randomUUID(),email};DB.users.push(Object.assign({password:op.password,meta},u));
   DB.profiles.push({id:u.id,role:isCoach?'coach':'client',full_name:meta.full_name||email});
   if(inv){inv.user_id=u.id;inv.invite_token=null;}
   return {data:{user:u,session:S.confirm?null:{user:u}},error:null};}
  case 'signin':{const u=DB.users.find(x=>x.email===String(op.email).toLowerCase()&&x.password===op.password);if(!u)return err('Invalid login credentials','invalid_credentials',400);return {data:{user:{id:u.id,email:u.email},session:{user:{id:u.id,email:u.email}}},error:null};}
  case 'reset':return {data:{},error:null};
  case 'recovery':{const m=/email=([^&]+)/.exec(op.hash);const u=m&&DB.users.find(x=>x.email===decodeURIComponent(m[1]));return {user:u?{id:u.id,email:u.email}:null};}
  case 'updpw':{const u=DB.users.find(x=>x.id===op.uid);if(!u)return err('Auth session missing','session_missing',401);if(u.password===op.password)return err('New password should be different from the old password.','same_password',422);u.password=op.password;return {data:{user:{id:u.id,email:u.email}},error:null};}
 }
 return err('kind?');
}
module.exports={DB,S,handle};
