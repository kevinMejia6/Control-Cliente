(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.NexoCloudCore=api;})(typeof globalThis!=='undefined'?globalThis:this,()=>{
  'use strict';
  function parse(record){if(!record||!Number.isInteger(record.revision)||record.revision<1||typeof record.payload!=='string'||record.payload.length>4000000)throw Error('Respaldo de nube inválido');const value=JSON.parse(record.payload);if(value.schema!==1||!value.data||value.data.version!==1)throw Error('Formato de nube inválido');return value;}
  function action(remote,meta,uid){if(!remote)return meta?.uid===uid&&meta.revision>0?'conflict':'choose-local';if(meta?.uid!==uid)return 'choose-cloud';if(remote.revision===meta.revision)return meta.dirty?'push':'pull';if(remote.revision>meta.revision)return meta.dirty?'conflict':'pull';return 'conflict';}
  function proposal(current,expected,payload,updatedAt){if((current?.revision||0)!==expected)return undefined;if(typeof payload!=='string'||payload.length>4000000)throw Error('El respaldo excede el límite de la nube');return{payload,revision:expected+1,updatedAt};}
  return{parse,action,proposal};
});
