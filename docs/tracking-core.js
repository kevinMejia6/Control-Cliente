/* Calendar time, computed from saved timestamps. No running timer is persisted. */
(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.NexoTracking=api;})(typeof globalThis!=='undefined'?globalThis:this,function(){
  'use strict';
  const states=['Nuevo','En desarrollo','Para pruebas','En corrección','Capacitación','Finalizado','En curso','Por revisar','Escalado a desarrollo'];
  const groups=[['new','Nuevos',['Nuevo']],['dev','En desarrollo',['En desarrollo','Escalado a desarrollo']],['test','Para pruebas',['Para pruebas','Por revisar']],['fix','Por corregir',['En corrección']],['training','Capacitación',['Capacitación']],['progress','En curso',['En curso']]];
  const stamp=value=>{const ms=typeof value==='number'?value:Date.parse(value);if(!Number.isFinite(ms))throw Error('Fecha de medición inválida');return ms;};
  function valid(c){
    const t=c.timing;if(!t)return true;
    if(t.version!==1||typeof t.legacy!=='boolean'||!Array.isArray(t.segments)||!t.segments.length)return false;
    try{let end=stamp(t.startedAt);for(let i=0;i<t.segments.length;i++){const s=t.segments[i],start=stamp(s.startedAt);if(!states.includes(s.status)||start!==end||typeof s.by!=='string'||(s.endedAt===null&&i!==t.segments.length-1))return false;end=s.endedAt===null?start:stamp(s.endedAt);if(end<start)return false;}const last=t.segments.at(-1);return last.status===c.status&&last.endedAt===null;}catch{return false;}
  }
  function start(c,now=Date.now(),legacy=false,by=''){if(c.timing){if(!valid(c))throw Error('Medición inválida');return false;}if(!states.includes(c.status))throw Error('Estado inválido');const at=new Date(stamp(now)).toISOString();c.timing={version:1,startedAt:at,legacy,segments:[{status:c.status,startedAt:at,endedAt:null,by}]};return true;}
  function transition(c,next,now=Date.now(),by=''){
    if(!states.includes(next))throw Error('Estado inválido');start(c,now,true,by);if(next===c.status)return null;
    const last=c.timing.segments.at(-1),end=Math.max(stamp(now),stamp(last.startedAt)),at=new Date(end).toISOString(),from=c.status;
    last.endedAt=at;c.timing.segments.push({status:next,startedAt:at,endedAt:null,by});c.status=next;
    return {fromStatus:from,toStatus:next,at,durationMs:end-stamp(last.startedAt)};
  }
  function summary(c,now=Date.now()){
    const byState=Object.fromEntries(states.map(s=>[s,0]));if(!c.timing)return{byState,totalMs:0,currentMs:0,partial:true,startedAt:null};
    if(!valid(c))throw Error('Medición inválida');const current=stamp(now);
    for(const s of c.timing.segments){if(s.status==='Finalizado')continue;byState[s.status]+=Math.max(0,(s.endedAt===null?current:stamp(s.endedAt))-stamp(s.startedAt));}
    const last=c.timing.segments.at(-1);return{byState,totalMs:Object.values(byState).reduce((a,b)=>a+b,0),currentMs:c.status==='Finalizado'?0:Math.max(0,current-stamp(last.startedAt)),partial:c.timing.legacy,startedAt:c.timing.startedAt};
  }
  function metrics(cases,clientId,now=Date.now()){
    const rows=cases.filter(c=>c.clientId===clientId),open=rows.filter(c=>c.status!=='Finalizado');
    const points=groups.map(([id,label,statuses])=>({id,label,statuses,count:open.filter(c=>statuses.includes(c.status)).length}));
    const complete=rows.filter(c=>c.status==='Finalizado'&&c.timing&&!c.timing.legacy),times=rows.map(c=>summary(c,now));
    return{points,total:rows.length,open:open.length,done:rows.length-open.length,measuredClosures:complete.length,averageCloseMs:complete.length?complete.reduce((n,c)=>n+summary(c,now).totalMs,0)/complete.length:null,developmentMs:times.reduce((n,t)=>n+t.byState['En desarrollo']+t.byState['Escalado a desarrollo'],0),partial:times.some(t=>t.partial)};
  }
  return{states,groups,start,transition,summary,metrics,valid};
});
