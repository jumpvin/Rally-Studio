export function validateStudioState(state) {
  const errors = [];
  if (!state?.website?.id) errors.push('website.id is required');
  if (!state?.page?.id || state.page.websiteId !== state.website?.id) errors.push('page must belong to website');
  if (!Array.isArray(state?.page?.componentInstanceIds)) errors.push('page.componentInstanceIds must be an array');
  if (!state?.designSettings?.primaryColor || !state.designSettings?.secondaryColor) errors.push('design colors are required');
  const ids = new Set(Object.keys(state?.componentInstances || {}));
  const references = state?.page?.componentInstanceIds || [];
  if (new Set(references).size !== references.length) errors.push('page component references must be unique');
  for (const id of state?.page?.componentInstanceIds || []) if (!ids.has(id)) errors.push(`missing component instance: ${id}`);
  for (const [id, instance] of Object.entries(state?.componentInstances || {})) if (instance.id !== id) errors.push(`component identity mismatch: ${id}`);
  return errors;
}

export function orderedInstances(state) {
  return state.page.componentInstanceIds.map((id) => state.componentInstances[id]);
}
