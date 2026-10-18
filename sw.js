const C="voyage-v2",H=["fonts.googleapis.com","fonts.gstatic.com","www.gstatic.com"];
self.addEventListener("install",()=>self.skipWaiting());
self.addEventListener("activate",e=>e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==C).map(x=>caches.delete(x)))).then(()=>clients.claim())));
self.addEventListener("fetch",e=>{
  const r=e.request,u=new URL(r.url),same=u.origin===location.origin;
  if(r.method!=="GET"||!(same||H.includes(u.hostname)))return;
  e.respondWith(caches.open(C).then(async c=>{
    const hit=await c.match(r);
    const net=fetch(r,same?{cache:"no-cache"}:{}).then(res=>{if(res&&(res.ok||res.type==="opaque"))c.put(r,res.clone());return res});
    net.catch(()=>{});
    if(!same)return hit||net;
    return Promise.race([net,new Promise((_,j)=>setTimeout(j,3000))]).catch(()=>hit||net);
  }));
});
