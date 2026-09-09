const clone = value => structuredClone(value);
const STATUSES = Object.freeze(['open','waiting-on-rally','waiting-on-client','resolved']);

export function createConversationStore(documentStore) {
  let conversations = {}, order = [], selectedId = null, activeReviewSessionId = null, sequence = 0, filters = { page: 'all', status: 'open', session: 'all' };
  const listeners = new Set(), notify = () => listeners.forEach(listener => listener(api.getState()));
  const actor = id => ({ id: id || 'local-user', name: id === 'client' ? 'Client' : id === 'rally-staff' ? 'Rally staff' : 'Local user' });
  const message = (body, author) => { const text = String(body || '').trim(); if (!text) throw new Error('Message body is required'); return { id: `message-${Date.now().toString(36)}-${++sequence}`, author: actor(author), createdAt: new Date().toISOString(), body: text }; };
  const anchorState = conversation => { const document = documentStore.getState(), websiteAvailable = document.website.id === conversation.websiteId, page = websiteAvailable ? document.pages[conversation.pageId] : null, componentAvailable = !conversation.componentInstanceId || !!document.componentInstances[conversation.componentInstanceId] && page?.componentInstanceIds.includes(conversation.componentInstanceId); return { websiteAvailable, pageAvailable: !!page, componentAvailable: !!componentAvailable, available: !!page && !!componentAvailable }; };
  const api = {
    statuses: STATUSES,
    subscribe(listener) { listeners.add(listener); return () => listeners.delete(listener); },
    getState() { return { conversations: clone(conversations), order: [...order], selectedId, activeReviewSessionId, filters: { ...filters } }; },
    list() { const document = documentStore.getState(); return order.map(id => conversations[id]).filter(item => filters.page === 'all' || item.pageId === document.workspace.activePageId).filter(item => filters.session === 'all' || item.reviewSessionId === filters.session).filter(item => filters.status === 'all' || (filters.status === 'open' ? item.status !== 'resolved' : item.status === 'resolved')).map(item => ({ ...clone(item), anchorState: anchorState(item) })); },
    get(id) { const item = conversations[id]; if (!item) throw new Error(`Unknown conversation: ${id}`); return { ...clone(item), anchorState: anchorState(item) }; },
    create({ pageId, componentInstanceId = null, body, author = 'local-user', reviewSessionId = activeReviewSessionId }) { const document = documentStore.getState(), page = document.pages[pageId]; if (!page) throw new Error(`Unknown page: ${pageId}`); if (componentInstanceId && !page.componentInstanceIds.includes(componentInstanceId)) throw new Error(`Component is not on page: ${componentInstanceId}`); const id = `conversation-${Date.now().toString(36)}-${++sequence}`; conversations[id] = { id, websiteId: document.website.id, pageId, componentInstanceId, reviewSessionId: reviewSessionId || null, linkedTaskIds: [], anchor: componentInstanceId ? { kind: 'component' } : { kind: 'page' }, status: 'open', createdAt: new Date().toISOString(), createdBy: actor(author), messages: [message(body, author)] }; order.push(id); selectedId = id; notify(); return id; },
    reply(id, body, author = 'local-user') { const item = conversations[id]; if (!item) throw new Error(`Unknown conversation: ${id}`); item.messages.push(message(body, author)); notify(); },
    setStatus(id, status) { if (!STATUSES.includes(status)) throw new Error(`Unsupported conversation status: ${status}`); const item = conversations[id]; if (!item) throw new Error(`Unknown conversation: ${id}`); item.status = status; notify(); },
    resolve(id) { api.setStatus(id, 'resolved'); },
    reopen(id) { api.setStatus(id, 'open'); },
    select(id, navigate = true) { const item = conversations[id]; if (!item) throw new Error(`Unknown conversation: ${id}`); selectedId = id; if (navigate) { const anchor = anchorState(item); if (anchor.pageAvailable) { documentStore.selectPage(item.pageId); if (item.componentInstanceId && anchor.componentAvailable) documentStore.selectComponent(item.componentInstanceId); } } notify(); return anchorState(item); },
    associate(id, reviewSessionId) { const item = conversations[id]; if (!item) throw new Error(`Unknown conversation: ${id}`); item.reviewSessionId = reviewSessionId || null; notify(); },
    linkTask(id, taskId) { const item = conversations[id]; if (!item) throw new Error(`Unknown conversation: ${id}`); item.linkedTaskIds ||= []; if (!item.linkedTaskIds.includes(taskId)) item.linkedTaskIds.push(taskId); notify(); },
    setActiveReviewSession(id) { activeReviewSessionId = id || null; notify(); },
    setFilters(patch) { filters = { ...filters, ...patch }; notify(); }
  };
  return api;
}
