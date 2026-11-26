/* Pure scheduling rules shared by the app and its verification checks. */
(function(root){
  function collectReminders(cases,now=Date.now()) {
    const result=[];
    for(const c of cases){
      if(c.status==='Finalizado')continue;
      const deliveryId='delivery:'+c.due;
      if(/^\d{4}-\d{2}-\d{2}$/.test(c.due||'')){
        const state=(c.deliveryReminders||{})[deliveryId]||{};
        if(!state.dismissed){const scheduledAt=c.due+'T09:00:00-06:00';result.push({id:deliveryId,caseId:c.id,title:'Entrega del caso',scheduledAt,at:state.snoozedUntil||scheduledAt,lastAlertAt:state.lastAlertAt||null,kind:'delivery',...{due:new Date(state.snoozedUntil||scheduledAt).getTime()<=now}});}
      }
      for(const r of c.reminders||[]){
        if(r.dismissed||!Number.isFinite(Date.parse(r.at)))continue;
        result.push({...r,caseId:c.id,kind:'custom',scheduledAt:r.at,at:r.snoozedUntil||r.at,due:Date.parse(r.snoozedUntil||r.at)<=now});
      }
    }
    return result.sort((a,b)=>Date.parse(a.at)-Date.parse(b.at));
  }
  root.NexoReminders={collect:collectReminders,pending:(cases,now)=>collectReminders(cases,now).filter(r=>r.due)};
})(typeof module==='object'?module.exports:globalThis);
