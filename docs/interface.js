'use strict';
const menuButton=$('#menu'),sidebarOverlay=$('#sidebar-overlay');
const uiIcons={overview:'grid',cases:'cases',clients:'users',activity:'clock',reminders:'bell'};
const uiNames={overview:'Inicio',cases:'Casos',clients:'Clientes',activity:'Actividad',reminders:'Avisos'};
const sidebarBreakpoint=window.matchMedia('(max-width:900px)');
function syncSidebar(){
  const mobile=sidebarBreakpoint.matches;
  const open=mobile?$('#sidebar').classList.contains('open'):document.documentElement.dataset.sidebar!=='closed';
  $('#sidebar').inert=!open;
  sidebarOverlay.hidden=!mobile||!open;
  menuButton.setAttribute('aria-expanded',String(open));
  const label=open?'Cerrar barra lateral':'Abrir barra lateral';
  menuButton.setAttribute('aria-label',label);
  menuButton.title=label;
  document.body.classList.toggle('menu-open',mobile&&open);
}
function closeSidebar(){
  $('#sidebar').classList.remove('open');
  syncSidebar();
}
function setDesktopSidebar(open){
  document.documentElement.dataset.sidebar=open?'open':'closed';
  if(!NexoAppearance.save({sidebarOpen:open}))toast('No se pudo guardar la preferencia de la barra lateral.');
  syncSidebar();
}
menuButton.onclick=()=>{
  if(sidebarBreakpoint.matches){$('#sidebar').classList.toggle('open');syncSidebar()}
  else setDesktopSidebar(document.documentElement.dataset.sidebar==='closed');
};
$('#sidebar-close').onclick=()=>{
  if(sidebarBreakpoint.matches)closeSidebar();else setDesktopSidebar(false);
  menuButton.focus();
};
sidebarOverlay.onclick=closeSidebar;
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&sidebarBreakpoint.matches&&$('#sidebar').classList.contains('open')){closeSidebar();menuButton.focus()}});
function updateThemeButton(){
  const dark=document.documentElement.dataset.theme==='dark';
  const label=dark?'Activar modo claro':'Activar modo oscuro';
  $('#theme-toggle').innerHTML=`<i class="fa-solid fa-${dark?'sun':'moon'} fa-fw" aria-hidden="true"></i><span>Modo ${dark?'claro':'oscuro'}</span>`;
  $('#theme-toggle').setAttribute('aria-label',label);
  $('#theme-toggle').setAttribute('aria-pressed',String(dark));
  $('#theme-toggle').title=label;
}
function setTheme(theme,persistChoice=false){
  document.documentElement.dataset.theme=theme;
  updateThemeButton();
  if(persistChoice&&!NexoAppearance.save({theme}))toast('El cambio se aplicó, pero no se pudo guardar la preferencia.');
}
$('#theme-toggle').onclick=()=>setTheme(document.documentElement.dataset.theme==='dark'?'light':'dark',true);
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change',event=>{
  if(!NexoAppearance.read().theme)setTheme(event.matches?'dark':'light');
});
window.addEventListener('storage',event=>{
  if(event.key!==NexoAppearance.key&&event.key!==null)return;
  const pref=NexoAppearance.read();
  setTheme(pref.theme||(window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'));
  document.documentElement.dataset.sidebar=pref.sidebarOpen?'open':'closed';
  syncSidebar();
});
updateThemeButton();
$('.brand').onclick=e=>{e.preventDefault();go('overview')};
function polishInterface(){
  closeSidebar();
  if(page==='detail'&&!$('.case-jumps')){
    const grid=$('.detail-grid');
    const links=[['Detalle','.detail-grid > div > .panel'],['Archivos','.attachments-panel'],['Seguimiento','.detail-grid > .panel']];
    if(grid){grid.insertAdjacentHTML('beforebegin',`<div class="case-jumps">${links.map(([title,target])=>`<button data-jump="${target}">${title}</button>`).join('')}</div>`);
      $$('[data-jump]').forEach(b=>b.onclick=()=>$(b.dataset.jump)?.scrollIntoView({behavior:window.matchMedia('(prefers-reduced-motion:reduce)').matches?'instant':'smooth',block:'start'}));
    }
  }
  const current=page==='detail'?'cases':page==='client'?'clients':page;
  $('#mobile-navigation').innerHTML=Object.keys(uiNames).map(p=>`<button data-mobile-page="${p}" class="${p===current?'active':''}" ${p===current?'aria-current="page"':''}>${icon(uiIcons[p])}<span>${uiNames[p]}</span></button>`).join('');
  $$('[data-mobile-page]').forEach(b=>b.onclick=()=>go(b.dataset.mobilePage));
  $$('[data-stat]').forEach(b=>b.onclick=()=>{
    filters={q:'',status:'',client:'',priority:''};
    if(b.dataset.stat==='users'){go('clients');return}
    if(b.dataset.stat==='check')filters.status='Finalizado';
    if(b.dataset.stat==='clock')filters.status='__review';
    if(b.dataset.stat==='folder')filters.status='__open';
    go('cases');
  });
}
polishInterface();

sidebarBreakpoint.addEventListener('change',closeSidebar);
