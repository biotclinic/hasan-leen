// Hassan & Leen service worker: push notifications only (no caching)
self.addEventListener('install',()=>self.skipWaiting());
self.addEventListener('activate',e=>e.waitUntil(self.clients.claim()));
self.addEventListener('push',e=>{
  let d={};try{d=e.data?e.data.json():{}}catch(x){d={body:e.data?e.data.text():''}}
  const title=d.title||'حسن ولين 🤍';
  const opts={body:d.body||'',tag:d.tag||'hl',renotify:true,data:{url:d.url||'./?open=chat'},lang:'ar',dir:'rtl'};
  e.waitUntil((async()=>{
    await self.registration.showNotification(title,opts);
    try{if(self.navigator&&self.navigator.setAppBadge)await self.navigator.setAppBadge()}catch(x){}
  })());
});
self.addEventListener('notificationclick',e=>{
  e.notification.close();
  const url=new URL((e.notification.data&&e.notification.data.url)||'./',self.registration.scope).href;
  e.waitUntil((async()=>{
    const all=await self.clients.matchAll({type:'window',includeUncontrolled:true});
    for(const c of all){if(c.url.startsWith(self.registration.scope)){try{await c.focus()}catch(x){}c.postMessage({open:'chat'});return}}
    await self.clients.openWindow(url);
  })());
});
