(function(){
  const script=document.currentScript,assets=new URL('.',script.src),root=new URL('../',assets),button=document.querySelector('#install-app');let promptEvent=null;
  const standalone=()=>window.matchMedia('(display-mode: standalone)').matches||navigator.standalone===true;
  button.hidden=standalone();
  window.addEventListener('beforeinstallprompt',event=>{event.preventDefault();promptEvent=event;button.hidden=false;});
  window.addEventListener('appinstalled',()=>{promptEvent=null;button.hidden=true;toast('Nexo ya está instalada.');});
  button.onclick=async()=>{if(promptEvent){const event=promptEvent;promptEvent=null;await event.prompt();const choice=await event.userChoice;if(choice.outcome==='accepted')button.hidden=true;return;}showModal('Instalar Nexo',`<p>Lleva tus clientes y puntos en una ventana propia, con acceso desde el inicio.</p><ul class="install-help"><li><strong>Android o computadora:</strong> abre el menú de Chrome o Edge y elige «Instalar Nexo» o «Instalar aplicación».</li><li><strong>iPhone o iPad:</strong> abre este sitio en Safari, toca Compartir y elige «Agregar a pantalla de inicio».</li><li><strong>Mac con Safari:</strong> usa Archivo → Agregar al Dock.</li></ul><p class="feature-hint">La sincronización necesita internet. Los recordatorios con sonido requieren que Nexo permanezca abierta.</p>`,()=>true);$('#modal-form [type=submit]').textContent='Entendido';};
  if('serviceWorker' in navigator)navigator.serviceWorker.register(new URL('sw.js',root),{scope:root.pathname}).catch(()=>{button.title='Instalar desde el menú del navegador';});
})();
