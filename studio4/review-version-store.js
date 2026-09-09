const clone = value => structuredClone(value);
const actor = id => ({ id: id || 'local-user', name: id === 'rally-staff' ? 'Rally staff' : id === 'client' ? 'Client' : 'Local user' });
const fingerprint = text => { let hash = 2166136261; for (const character of text) hash = Math.imul(hash ^ character.charCodeAt(0), 16777619); return `version-${(hash >>> 0).toString(16).padStart(8,'0')}`; };

export function createReviewVersionStore(documentStore) {
  let versions = {}, order = [], selectedId = null, inspectingId = null, sequence = 0;
  const listeners = new Set(), notify = () => listeners.forEach(listener => listener(api.getState()));
  const version = id => { const value = versions[id]; if (!value) throw new Error(`Unknown review version: ${id}`); return value; };
  const api = {
    subscribe(listener) { listeners.add(listener); return () => listeners.delete(listener); },
    getState() { return { versions: clone(versions), order: [...order], selectedId, inspectingId }; },
    get(id) { const value = version(id); return { ...clone(value), isCurrent: value.documentFingerprint === api.currentFingerprint() }; },
    list() { return order.map(id => api.get(id)); },
    currentFingerprint() { return fingerprint(documentStore.exportSnapshot()); },
    create({ label, createdBy = 'local-user', source = 'manual', reviewSessionId = null } = {}) { const snapshotText = documentStore.exportSnapshot(), snapshot = JSON.parse(snapshotText), id = `version-${Date.now().toString(36)}-${++sequence}`, now = new Date().toISOString(); versions[id] = { id, websiteId: snapshot.website.id, label: String(label || `Website version ${order.length + 1}`).trim(), createdAt: now, createdBy: actor(createdBy), source, reviewSessionId, documentFingerprint: fingerprint(snapshotText), snapshot, pageCount: snapshot.website.pageIds.length, componentCount: Object.keys(snapshot.componentInstances).length }; order.push(id); selectedId = id; notify(); return id; },
    rename(id, label) { const value = version(id), text = String(label || '').trim(); if (!text) throw new Error('Version label is required'); value.label = text; notify(); },
    inspect(id) { version(id); selectedId = id; inspectingId = id; notify(); return clone(version(id).snapshot); },
    exitInspection() { inspectingId = null; notify(); },
    restore(id, confirmed = false) { const value = version(id); if (!confirmed) throw new Error('Review Version restore requires confirmation'); documentStore.restoreDocument(value.snapshot, `Restore review version: ${value.label}`); selectedId = id; inspectingId = null; notify(); },
    select(id) { version(id); selectedId = id; notify(); }
  };
  return api;
}
