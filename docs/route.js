/* Keeps the current screen in the address (#/caso/<id>, #/cliente/<id>, #/pendientes…)
   so reloading stays on the same case and the browser's back button works. */
(function(){
  'use strict';
  const names={clients:'clientes',cases:'pendientes',reminders:'recordatorios',activity:'actividad',overview:'resumen'};
  const pages=Object.fromEntries(Object.entries(names).map(([page,slug])=>[slug,page]));
  function address(){
    if(page==='detail'&&selectedCase)return '#/caso/'+encodeURIComponent(selectedCase);
    if(page==='client'&&selectedClient)return '#/cliente/'+encodeURIComponent(selectedClient);
    return '#/'+(names[page]||'clientes');
  }
  function open(hash){
    const match=/^#\/([a-z]+)(?:\/(.+))?$/.exec(hash||'');if(!match)return false;
    let id='';try{id=match[2]?decodeURIComponent(match[2]):''}catch{return false}
    if(match[1]==='caso'){const c=data.cases.find(x=>x.id===id);if(!c)return false;selectedCase=id;selectedClient=c.clientId;page='detail';return true}
    if(match[1]==='cliente'){if(!data.clients.some(x=>x.id===id))return false;selectedClient=id;clientView='open';clientPointGroup='';page='client';return true}
    const next=pages[match[1]];if(!next)return false;
    if(next==='cases')filters={q:'',status:'__open',client:'',priority:''};
    selectedClient='';page=next;return true;
  }
  let restoring=false;
  const draw=render;
  render=function(){
    draw.apply(this,arguments);
    if(restoring)return;
    const next=address();if(location.hash===next)return;
    if(location.hash&&location.hash!=='#')history.pushState(null,'',next);else history.replaceState(null,'',next);
  };
  function restore(){restoring=true;try{render()}finally{restoring=false}history.replaceState(null,'',address());}
  if(open(location.hash))restore();else history.replaceState(null,'',address());
  window.addEventListener('popstate',()=>{if(modal.open)modal.close();if(open(location.hash)){restore();window.scrollTo(0,0)}else{page='clients';selectedClient='';restore()}});
})();
