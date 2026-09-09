export function activePage(state) {
  return state.pages[state.workspace?.activePageId || state.website.pageIds[0]];
}

export function validateStudioState(state) {
  const errors = [];
  if (!state?.website?.id) errors.push('website.id is required');
  const pageIds = state?.website?.pageIds;
  if (!Array.isArray(pageIds)) errors.push('website.pageIds must be an array');
  else {
    if (!pageIds.length) errors.push('website must contain at least one page');
    if (new Set(pageIds).size !== pageIds.length) errors.push('website page references must be unique');
  }
  const pages = state?.pages || {};
  const instances = state?.componentInstances || {};
  const slugs = new Set();
  const ownedInstances = new Set();
  for (const pageId of pageIds || []) {
    const page = pages[pageId];
    if (!page) { errors.push(`missing page: ${pageId}`); continue; }
    if (page.id !== pageId) errors.push(`page identity mismatch: ${pageId}`);
    if (page.websiteId !== state.website.id) errors.push(`page must belong to website: ${pageId}`);
    if (!page.slug || slugs.has(page.slug)) errors.push(`page slug must be unique: ${page.slug || pageId}`);
    slugs.add(page.slug);
    if (!Array.isArray(page.componentInstanceIds)) { errors.push(`page component references must be an array: ${pageId}`); continue; }
    if (new Set(page.componentInstanceIds).size !== page.componentInstanceIds.length) errors.push(`page component references must be unique: ${pageId}`);
    for (const id of page.componentInstanceIds) {
      if (!instances[id]) errors.push(`missing component instance: ${id}`);
      if (ownedInstances.has(id)) errors.push(`component instance belongs to multiple pages: ${id}`);
      ownedInstances.add(id);
    }
  }
  for (const [id, instance] of Object.entries(instances)) {
    if (instance.id !== id) errors.push(`component identity mismatch: ${id}`);
    if (!ownedInstances.has(id)) errors.push(`orphaned component instance: ${id}`);
  }
  if (!state?.designSettings?.primaryColor || !state.designSettings?.secondaryColor) errors.push('design colors are required');
  if (state?.workspace?.activePageId && !pages[state.workspace.activePageId]) errors.push(`unknown active page: ${state.workspace.activePageId}`);
  return errors;
}

export function orderedInstances(state, pageId = state.workspace?.activePageId || state.website.pageIds[0]) {
  return state.pages[pageId].componentInstanceIds.map((id) => state.componentInstances[id]);
}
