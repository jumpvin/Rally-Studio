const clone = value => structuredClone(value);
const STATUSES = Object.freeze(['todo','in-progress','blocked','done']);
const actor = id => id ? ({ id, name: id === 'client' ? 'Client' : id === 'rally-staff' ? 'Rally staff' : 'Local user' }) : null;

export function createTaskStore(documentStore, conversationStore) {
  let tasks = {}, order = [], selectedId = null, filter = 'all', sequence = 0;
  const listeners = new Set(), notify = () => listeners.forEach(listener => listener(api.getState()));
  const task = id => { const value = tasks[id]; if (!value) throw new Error(`Unknown task: ${id}`); return value; };
  const sourceState = value => { let conversation; try { conversation = conversationStore.get(value.sourceConversationId); } catch { return { conversationAvailable: false, websiteAvailable: false, pageAvailable: false, componentAvailable: false, available: false }; } return { conversationAvailable: true, ...conversation.anchorState }; };
  const api = {
    statuses: STATUSES,
    subscribe(listener) { listeners.add(listener); return () => listeners.delete(listener); },
    getState() { return { tasks: clone(tasks), order: [...order], selectedId, filter }; },
    get(id) { const value = task(id); return { ...clone(value), sourceState: sourceState(value) }; },
    list(currentWebsiteOnly = true) { const websiteId = documentStore.getState().website.id; return order.map(id => tasks[id]).filter(item => !currentWebsiteOnly || item.websiteId === websiteId).filter(item => filter === 'all' || item.status === filter).map(item => ({ ...clone(item), sourceState: sourceState(item) })); },
    setFilter(status) { if (status !== 'all' && !STATUSES.includes(status)) throw new Error(`Unsupported task filter: ${status}`); filter = status; notify(); },
    createFromConversation(conversationId, { title, description = '', createdBy = 'local-user', assignedTo = null } = {}) { const conversation = conversationStore.get(conversationId), label = String(title || conversation.messages[0]?.body || '').trim(); if (!label) throw new Error('Task title is required'); const id = `task-${Date.now().toString(36)}-${++sequence}`, now = new Date().toISOString(); tasks[id] = { id, websiteId: conversation.websiteId, sourceConversationId: conversation.id, reviewSessionId: conversation.reviewSessionId || null, pageId: conversation.pageId, componentInstanceId: conversation.componentInstanceId || null, title: label, description: String(description), status: 'todo', createdAt: now, createdBy: actor(createdBy), assignedTo: actor(assignedTo), updatedAt: now, completedAt: null }; order.push(id); selectedId = id; conversationStore.linkTask(conversationId, id); notify(); return id; },
    update(id, patch) { const value = task(id); if (patch.title !== undefined) { const title = String(patch.title).trim(); if (!title) throw new Error('Task title is required'); value.title = title; } if (patch.description !== undefined) value.description = String(patch.description); if (patch.assignedTo !== undefined) value.assignedTo = actor(patch.assignedTo); value.updatedAt = new Date().toISOString(); notify(); },
    setStatus(id, status) { if (!STATUSES.includes(status)) throw new Error(`Unsupported task status: ${status}`); const value = task(id), now = new Date().toISOString(); value.status = status; value.updatedAt = now; value.completedAt = status === 'done' ? now : null; notify(); },
    select(id, navigate = true) { const value = task(id); selectedId = id; const source = sourceState(value); if (navigate && source.conversationAvailable) conversationStore.select(value.sourceConversationId, true); notify(); return source; }
  };
  return api;
}
