const CACHE='nexo-app-20261126-menu-v1';
const ASSETS=["./", "./index.html", "./manifest.webmanifest", "./docs/typography.css", "./docs/interface.js", "./docs/interface.css", "./docs/app-experience.css", "./docs/index.html", "./docs/reminder-core.js", "./docs/features.js", "./docs/styles.css", "./docs/tracking.css", "./docs/tracking-ui.js", "./docs/cloud.js", "./docs/.nojekyll", "./docs/install.js", "./docs/user-menu.js", "./docs/appearance.css", "./docs/appearance-boot.js", "./docs/bootstrap-utilities.min.css", "./docs/tracking-core.js", "./docs/simple.css", "./docs/cloud-core.js", "./docs/firebase-config.js", "./docs/app.js", "./docs/route.js", "./docs/icons/nexo-512.png", "./docs/icons/nexo-180.png", "./docs/icons/nexo-192.png", "./docs/fonts/Inter-LICENSE.txt", "./docs/fonts/inter-latin.woff2", "./docs/fonts/inter-latin-ext.woff2", "./docs/vendor/fontawesome/LICENSE.txt", "./docs/vendor/fontawesome/css/fontawesome.min.css", "./docs/vendor/fontawesome/css/solid.min.css", "./docs/vendor/fontawesome/webfonts/fa-solid-900.woff2"];
const BASE=new URL('./',self.location.href);
self.addEventListener('install',event=>event.waitUntil((async()=>{const cache=await caches.open(CACHE);await cache.addAll(ASSETS);})()));
self.addEventListener('activate',event=>event.waitUntil((async()=>{for(const key of await caches.keys())if(key.startsWith('nexo-app-')&&key!==CACHE)await caches.delete(key);await self.clients.claim();})()));
self.addEventListener('fetch',event=>{
 const req=event.request,url=new URL(req.url);
 if(req.method!=='GET')return;
 if(url.origin!==BASE.origin){
  if(url.origin==='https://www.gstatic.com'&&/^\/firebasejs\/11\.10\.0\/firebase-(app|auth|database)-compat\.js$/.test(url.pathname))event.respondWith((async()=>{const cache=await caches.open(CACHE),hit=await cache.match(req);if(hit)return hit;const response=await fetch(req);if(response.ok)await cache.put(req,response.clone());return response;})());
  return;
 }
 if(!url.pathname.startsWith(BASE.pathname))return;
 const relative='./'+url.pathname.slice(BASE.pathname.length);
 if(req.mode==='navigate'){
  event.respondWith((async()=>{try{const response=await fetch(req);if(response.ok){const cache=await caches.open(CACHE);await cache.put(req,response.clone());}return response;}catch{return(await caches.match(req,{ignoreSearch:true}))||(await caches.match(new URL('./',BASE)));}})());return;
 }
 if(!ASSETS.includes(relative))return;
 event.respondWith((async()=>{const cache=await caches.open(CACHE);try{const response=await fetch(req);if(response.ok)await cache.put(req,response.clone());return response;}catch{const hit=await cache.match(req,{ignoreSearch:true});return hit||Response.error();}})());
});
