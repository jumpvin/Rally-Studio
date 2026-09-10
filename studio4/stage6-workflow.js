const current=(store,reader)=>{const id=store.getState().selectedId;return id?reader(id):null;};

export function deriveStage6Summary({documentStore,discoveryStore,strategyStore,recommendationStore,reviewSessionStore}){
  const document=documentStore.getState(),discovery=current(discoveryStore,id=>discoveryStore.get(id)),strategy=current(strategyStore,id=>strategyStore.get(id)),recommendations=recommendationStore.list(),statuses=recommendations.map(item=>item.status),reviews=reviewSessionStore.listCurrentWebsite();
  let recommendationState='not-generated';
  if(statuses.includes('stale'))recommendationState='stale';
  else if(statuses.includes('applied')&&(statuses.includes('proposed')||statuses.includes('dismissed')))recommendationState='partially-applied';
  else if(statuses.includes('applied'))recommendationState='applied';
  else if(statuses.includes('proposed'))recommendationState='proposed';
  else if(statuses.length)recommendationState='dismissed';
  const activeReview=reviews.find(item=>item.status==='active'),approved=reviews.some(item=>reviewSessionStore.get(item.id).currentApproval);
  const summary={discovery:discovery?.progress.state||'draft',strategy:strategy?.progress.state||'draft',recommendations:recommendationState,website:{pageCount:document.website.pageIds.length,activePageId:document.workspace.activePageId},review:approved?'approved':activeReview?'active':reviews.length?'draft':'not-started'};
  summary.nextAction=summary.discovery!=='completed'?'discovery':summary.strategy!=='ready'?'strategy':summary.recommendations==='not-generated'||summary.recommendations==='stale'?'recommendations':'packet';
  return summary;
}
