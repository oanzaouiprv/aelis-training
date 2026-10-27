(function(){
 const call=op=>window.mockDb(JSON.stringify(op)).then(JSON.parse);
 const SKEY='aelis-auth';let listeners=[];
 const getU=()=>{try{return JSON.parse(localStorage.getItem(SKEY)||'null');}catch(e){return null;}};
 const setU=u=>{if(u)localStorage.setItem(SKEY,JSON.stringify(u));else localStorage.removeItem(SKEY);};
 function Q(t){this.t=t;this.f=[];this.op='select';this.one=null;this.payload=null;this.ret=false;}
 Q.prototype.select=function(){if(this.op!=='select')this.ret=true;return this;};
 Q.prototype.eq=function(c,v){this.f.push(['eq',c,v]);return this;};
 Q.prototype.is=function(c,v){this.f.push(['is',c,v]);return this;};
 ['insert','update','upsert'].forEach(k=>{Q.prototype[k]=function(o){this.op=k;this.payload=o;return this;};});
 Q.prototype.delete=function(){this.op='delete';return this;};
 Q.prototype.order=function(c,o){this.ord=[c,!(o&&o.ascending===false)];return this;};
 Q.prototype.limit=function(n){this.lim=n;return this;};
 Q.prototype.maybeSingle=function(){this.one='maybe';return this;};
 Q.prototype.single=function(){this.one='single';return this;};
 Q.prototype.then=function(res,rej){const u=getU();return call({kind:'q',uid:u&&u.id,t:this.t,op:this.op,f:this.f,payload:this.payload,one:this.one,ret:this.ret,order:this.ord,limit:this.lim}).then(res,rej);};
 window.supabase={createClient(){return {
  from:t=>new Q(t),rpc:(n,a)=>{const u=getU();return call({kind:'rpc',name:n,args:a,uid:u&&u.id});},
  channel(){const ch={on(){return ch;},subscribe(){return ch;}};return ch;},removeChannel(){},
  auth:{
   onAuthStateChange(cb){listeners.push(cb);return {data:{subscription:{unsubscribe(){}}}};},
   async getSession(){if(/type=recovery/.test(location.hash)){const r=await call({kind:'recovery',hash:location.hash});if(r.user){setU(r.user);history.replaceState(null,'',location.pathname);setTimeout(()=>listeners.forEach(l=>l('PASSWORD_RECOVERY',{user:r.user})),0);}}
    const u=getU();return {data:{session:u?{user:u}:null},error:null};},
   async signInWithPassword(o){const r=await call({kind:'signin',email:o.email,password:o.password});if(r.data&&r.data.user)setU(r.data.user);return r;},
   async signUp(o){const r=await call({kind:'signup',email:o.email,password:o.password,meta:o.options&&o.options.data});if(r.data&&r.data.session)setU(r.data.user);return r;},
   async signOut(){setU(null);listeners.forEach(l=>l('SIGNED_OUT',null));return {error:null};},
   async resetPasswordForEmail(e){return call({kind:'reset',email:e});},
   async updateUser(o){const u=getU();return call({kind:'updpw',uid:u&&u.id,password:o.password});}
 }};}};
})();
