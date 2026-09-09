const clone = value => structuredClone(value);
const SESSION_STATUSES = Object.freeze(['draft','active','completed']);
const actor = id => ({ id: id || 'local-user', name: id === 'client' ? 'Client' : id === 'rally-staff' ? 'Rally staff' : 'Local user' });
const fingerprint = text => { let hash = 2166136261; for (const character of text) hash = Math.imul(hash ^ character.charCodeAt(0), 16777619); return `checkpoint-${(hash >>> 0).toString(16).padStart(8,'0')}`; };

export function createReviewSessionStore(documentStore, conversationStore) {
  let sessions = {}, order = [], selectedId = null, sequence = 0;
  const listeners = new Set(), notify = () => listeners.forEach(listener => listener(api.getState()));
  const syncConversationIds = () => { const conversations = conversationStore.getState(); for (const session of Object.values(sessions)) session.conversationIds = conversations.order.filter(id => conversations.conversations[id].reviewSessionId === session.id); notify(); };
  conversationStore.subscribe(syncConversationIds);
  const session = id => { const value = sessions[id]; if (!value) throw new Error(`Unknown review session: ${id}`); return value; };
  const summary = id => { const value = session(id), conversations = conversationStore.getState().conversations, counts = { open: 0, 'waiting-on-rally': 0, 'waiting-on-client': 0, resolved: 0 }; for (const conversationId of value.conversationIds) if (conversations[conversationId]) counts[conversations[conversationId].status]++; const unresolved = counts.open + counts['waiting-on-rally'] + counts['waiting-on-client']; return { counts, unresolved, ready: unresolved === 0, total: value.conversationIds.length }; };
  const currentApproval = value => { const records = value.approvalRecords; return records.length && records.at(-1).action === 'approved' ? records.at(-1) : null; };
  const api = {
    statuses: SESSION_STATUSES,
    subscribe(listener) { listeners.add(listener); return () => listeners.delete(listener); },
    getState() { return { sessions: clone(sessions), order: [...order], selectedId }; },
    listCurrentWebsite() { const websiteId = documentStore.getState().website.id; return order.map(id => sessions[id]).filter(item => item.websiteId === websiteId).map(item => clone(item)); },
    get(id) { const value = session(id); return { ...clone(value), summary: summary(id), currentApproval: clone(currentApproval(value)) }; },
    create(title, createdBy = 'local-user') { const document = documentStore.getState(), label = String(title || '').trim(); if (!label) throw new Error('Review Session title is required'); const id = `review-${Date.now().toString(36)}-${++sequence}`; sessions[id] = { id, websiteId: document.website.id, title: label, status: 'draft', createdAt: new Date().toISOString(), createdBy: actor(createdBy), startedAt: null, completedAt: null, checkpoint: null, conversationIds: [], approvalRecords: [] }; order.push(id); selectedId = id; notify(); return id; },
    select(id) { const value = session(id); selectedId = id; conversationStore.setActiveReviewSession(value.status === 'active' ? id : null); notify(); },
    start(id) { const value = session(id); if (value.status === 'completed') throw new Error('Completed Review Session cannot be restarted'); if (!value.checkpoint) { const document = documentStore.getState(), capturedAt = new Date().toISOString(), snapshot = documentStore.exportSnapshot(); value.checkpoint = { id: `${id}-${fingerprint(snapshot)}`, websiteId: document.website.id, capturedAt, pageCount: document.website.pageIds.length, componentCount: Object.keys(document.componentInstances).length, documentFingerprint: fingerprint(snapshot) }; value.startedAt = capturedAt; } value.status = 'active'; selectedId = id; conversationStore.setActiveReviewSession(id); notify(); },
    complete(id) { const value = session(id); if (value.status !== 'active') throw new Error('Only an active Review Session can be completed'); value.status = 'completed'; value.completedAt = new Date().toISOString(); if (selectedId === id) conversationStore.setActiveReviewSession(null); notify(); },
    associateConversation(id, conversationId) { session(id); conversationStore.associate(conversationId, id); },
    summary,
    approve(id, { approvedBy = 'local-user', note = '', overrideReason = '' } = {}) { const value = session(id); if (!value.checkpoint) throw new Error('Review Session must be started before approval'); const readiness = summary(id); if (!readiness.ready && !String(overrideReason).trim()) throw new Error('Unresolved conversations require an override reason'); const record = { id: `approval-${Date.now().toString(36)}-${++sequence}`, reviewSessionId: id, websiteId: value.websiteId, checkpointId: value.checkpoint.id, actor: actor(approvedBy), createdAt: new Date().toISOString(), action: 'approved', note: String(note), overrideReason: String(overrideReason).trim() || null }; value.approvalRecords.push(record); notify(); return clone(record); },
    revoke(id, { revokedBy = 'local-user', note = '' } = {}) { const value = session(id); if (!currentApproval(value)) throw new Error('Review Session is not currently approved'); const record = { id: `approval-${Date.now().toString(36)}-${++sequence}`, reviewSessionId: id, websiteId: value.websiteId, checkpointId: value.checkpoint.id, actor: actor(revokedBy), createdAt: new Date().toISOString(), action: 'revoked', note: String(note), overrideReason: null }; value.approvalRecords.push(record); notify(); return clone(record); }
  };
  return api;
}
