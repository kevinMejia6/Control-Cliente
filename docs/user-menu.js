/* Account menu on the header avatar: account, name, theme, backups, install and sign out. */
(function(){
  'use strict';
  const trigger=document.querySelector('#user-menu-button');if(!trigger)return;
  const menu=document.createElement('div');menu.id='user-menu';menu.className='user-menu';menu.setAttribute('role','menu');menu.setAttribute('aria-labelledby','user-menu-button');menu.hidden=true;document.body.append(menu);
  const item=(id,iconName,label,extra='')=>`<button type="button" role="menuitem" class="user-menu-item ${extra}" data-menu="${id}"><i class="fa-solid fa-${iconName} fa-fw" aria-hidden="true"></i><span>${label}</span></button>`;
  function build(){
    const dark=document.documentElement.dataset.theme==='dark',install=document.querySelector('#install-app'),email=window.NexoCloud?.email()||'';
    menu.innerHTML=`<div class="user-menu-head"><span class="avatar purple">${esc(initials(data.profile))}</span><div><strong>${esc(data.profile)}</strong>${email?`<small>${esc(email)}</small>`:''}</div></div>`
      +item('account','cloud','Mi cuenta y guardado')
      +item('name','pen','Cambiar mi nombre')
      +item('theme',dark?'sun':'moon',dark?'Modo claro':'Modo oscuro')
      +'<div class="user-menu-sep" role="separator"></div>'
      +item('backup','download','Descargar respaldo')
      +item('restore','file-import','Restaurar respaldo')
      +(install&&!install.hidden?item('install','mobile-screen-button','Instalar aplicación'):'')
      +'<div class="user-menu-sep" role="separator"></div>'
      +item('signout','right-from-bracket','Cerrar sesión','danger-item');
  }
  function place(){const r=trigger.getBoundingClientRect(),width=Math.min(280,window.innerWidth-16);menu.style.width=width+'px';menu.style.top=Math.round(r.bottom+8)+'px';menu.style.left=Math.round(Math.max(8,Math.min(r.right-width,window.innerWidth-width-8)))+'px';}
  const items=()=>[...menu.querySelectorAll('[role=menuitem]')];
  function open(){build();menu.hidden=false;place();trigger.setAttribute('aria-expanded','true');items()[0]?.focus();}
  function close(focus=true){if(menu.hidden)return;menu.hidden=true;trigger.setAttribute('aria-expanded','false');if(focus)trigger.focus();}
  const actions={
    account:()=>window.NexoCloud?.panel(),
    name:()=>document.querySelector('#profile-edit')?.click(),
    theme:()=>document.querySelector('#theme-toggle')?.click(),
    backup:()=>document.querySelector('#backup')?.click(),
    restore:()=>document.querySelector('#restore')?.click(),
    install:()=>document.querySelector('#install-app')?.click(),
    signout:()=>window.NexoCloud?.signOut()
  };
  trigger.addEventListener('click',e=>{e.stopPropagation();menu.hidden?open():close();});
  menu.addEventListener('click',e=>{const b=e.target.closest('[data-menu]');if(!b)return;close(false);actions[b.dataset.menu]?.();});
  menu.addEventListener('keydown',e=>{const list=items(),i=list.indexOf(document.activeElement);if(e.key==='ArrowDown'){e.preventDefault();list[(i+1)%list.length].focus();}else if(e.key==='ArrowUp'){e.preventDefault();list[(i-1+list.length)%list.length].focus();}else if(e.key==='Home'){e.preventDefault();list[0].focus();}else if(e.key==='End'){e.preventDefault();list.at(-1).focus();}else if(e.key==='Tab'){close(false);}});
  document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!menu.hidden)close();});
  document.addEventListener('click',e=>{if(!menu.hidden&&!menu.contains(e.target))close(false);});
  window.addEventListener('resize',()=>{if(!menu.hidden)place();});
  window.addEventListener('scroll',()=>close(false),{passive:true});
})();
