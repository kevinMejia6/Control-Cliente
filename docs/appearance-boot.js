/* Apply preferences before styles render, without changing the case data. */
(function(){
  const key='nexo-appearance';
  function read(){
    let value={};
    try{value=JSON.parse(localStorage.getItem(key))||{}}catch{}
    return {theme:['light','dark'].includes(value.theme)?value.theme:null,sidebarOpen:typeof value.sidebarOpen==='boolean'?value.sidebarOpen:true};
  }
  function save(patch){
    try{localStorage.setItem(key,JSON.stringify({...read(),...patch}));return true}catch{return false}
  }
  const preference=read();
  document.documentElement.dataset.theme=preference.theme||(window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light');
  document.documentElement.dataset.sidebar=preference.sidebarOpen?'open':'closed';
  window.NexoAppearance={key,read,save};
})();
