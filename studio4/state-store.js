import { activePage, validateStudioState } from './model.js';

const clone = value => structuredClone(value);
const LIMIT = 50;

function setPath(source, path, value) {
  const next = clone(source);
  const parts = path.split('.');
  let cursor = next;
  for (const part of parts.slice(0, -1)) cursor = cursor[part];
  cursor[parts.at(-1)] = value;
  return next;
}

function slugBase(name) {
  const value = String(name || '').trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  return value ? `/${value}` : '/page';
}

export function createStudioStore(initial) {
  const migrated = initial.page && !initial.pages
    ? { ...clone(initial), pages: { [initial.page.id]: clone(initial.page) } }
    : clone(initial);
  delete migrated.page;
  let state = { ...migrated, workspace: { mode: 'edit', previewDevice: 'desktop', selectedComponentId: null, activePageId: migrated.website.pageIds[0] } };
  let entries = [], cursor = -1, sequence = 0;
  const listeners = new Set();
  const documentOf = source => ({ website: clone(source.website), pages: clone(source.pages), designSettings: clone(source.designSettings), componentInstances: clone(source.componentInstances) });
  const reconcileWorkspace = (source, document) => {
    const activePageId = document.pages[source.workspace.activePageId] ? source.workspace.activePageId : document.website.pageIds[0];
    const page = document.pages[activePageId];
    return { ...source, ...clone(document), workspace: { ...source.workspace, activePageId, selectedComponentId: page.componentInstanceIds.includes(source.workspace.selectedComponentId) ? source.workspace.selectedComponentId : null } };
  };
  const valid = source => { const errors = validateStudioState(source); if (errors.length) throw new Error(errors.join('; ')); };
  const notify = () => listeners.forEach(listener => listener(clone(state)));
  const publish = next => { valid(next); state = next; notify(); };
  const uniqueSlug = (name, excludePageId, source = state) => {
    const used = new Set(source.website.pageIds.filter(id => id !== excludePageId).map(id => source.pages[id].slug));
    const base = slugBase(name); let candidate = base, suffix = 2;
    while (used.has(candidate)) candidate = `${base}-${suffix++}`;
    return candidate;
  };
  const uniqueName = (name, source = state) => {
    const used = new Set(source.website.pageIds.map(id => source.pages[id].name));
    if (!used.has(name)) return name;
    let suffix = 2; while (used.has(`${name} ${suffix}`)) suffix++;
    return `${name} ${suffix}`;
  };
  const transact = (label, affectedObject, fn) => {
    const before = documentOf(state);
    let draft = reconcileWorkspace(state, before);
    fn(draft);
    draft = reconcileWorkspace(draft, documentOf(draft));
    valid(draft);
    const after = documentOf(draft);
    if (JSON.stringify(before) === JSON.stringify(after)) return;
    entries = entries.slice(0, cursor + 1);
    entries.push({ id: `edit-${Date.now().toString(36)}-${++sequence}`, type: 'edit', label, timestamp: new Date().toISOString(), actor: { id: 'local-system', name: 'Local Studio user' }, affectedObject, before, after });
    if (entries.length > LIMIT) entries.shift();
    cursor = entries.length - 1;
    state = reconcileWorkspace(draft, after);
    notify();
  };
  const page = () => activePage(state);
  const idx = id => page().componentInstanceIds.indexOf(id);
  valid(state);

  return {
    getState: () => clone(state),
    getActivePage: () => clone(page()),
    getHistory: () => ({ entries: clone(entries.map(({ before, after, ...meta }) => meta)), cursor, limit: LIMIT, canUndo: cursor >= 0, canRedo: cursor < entries.length - 1 }),
    subscribe(listener) { listeners.add(listener); return () => listeners.delete(listener); },
    exportSnapshot: () => JSON.stringify(documentOf(state), null, 2),
    selectPage(pageId) { if (!state.pages[pageId]) throw new Error(`Unknown page: ${pageId}`); publish({ ...state, workspace: { ...state.workspace, activePageId: pageId, selectedComponentId: null } }); },
    selectComponent(id) { if (id && !page().componentInstanceIds.includes(id)) throw new Error(`Component is not on active page: ${id}`); publish({ ...state, workspace: { ...state.workspace, selectedComponentId: id } }); },
    setMode(mode) { publish({ ...state, workspace: { ...state.workspace, mode, selectedComponentId: mode === 'preview' ? null : state.workspace.selectedComponentId } }); },
    setPreviewDevice(device) { if (!['desktop', 'tablet', 'mobile'].includes(device)) throw new Error(`Invalid preview device: ${device}`); publish({ ...state, workspace: { ...state.workspace, previewDevice: device } }); },
    createPage(name = 'Untitled Page') {
      const finalName = uniqueName(String(name).trim() || 'Untitled Page');
      const id = `page-${Date.now().toString(36)}-${++sequence}`;
      transact('Create page', id, next => { next.pages[id] = { id, websiteId: next.website.id, name: finalName, slug: uniqueSlug(finalName, null, next), componentInstanceIds: [] }; next.website.pageIds.push(id); });
      publish({ ...state, workspace: { ...state.workspace, activePageId: id, selectedComponentId: null } });
      return id;
    },
    createPageFromTemplate(resolved, requestedName) {
      if (!resolved?.item?.id || !resolved?.members?.length) throw new Error('Resolved page template required');
      const finalName = uniqueName(String(requestedName || resolved.defaultPageName).trim() || resolved.defaultPageName);
      const pageId = `page-${Date.now().toString(36)}-${++sequence}`;
      const instanceIds = resolved.members.map(member => `instance-${member.definitionType}-${Date.now().toString(36)}-${++sequence}`);
      transact(`Create page from template: ${resolved.item.name}`, pageId, next => {
        resolved.members.forEach((member, index) => { const id = instanceIds[index]; next.componentInstances[id] = { id, ...clone(member) }; });
        next.pages[pageId] = { id: pageId, websiteId: next.website.id, name: finalName, slug: uniqueSlug(finalName, null, next), componentInstanceIds: instanceIds, sourceLibraryItemId: resolved.item.id, sourceLibraryVersion: resolved.item.version };
        next.website.pageIds.push(pageId);
      });
      publish({ ...state, workspace: { ...state.workspace, activePageId: pageId, selectedComponentId: null } });
      return pageId;
    },
    renamePage(pageId, name) {
      if (!state.pages[pageId]) throw new Error(`Unknown page: ${pageId}`);
      const finalName = String(name).trim(); if (!finalName) throw new Error('Page name is required');
      transact('Rename page', pageId, next => { next.pages[pageId].name = finalName; next.pages[pageId].slug = uniqueSlug(finalName, pageId, next); });
    },
    duplicatePage(pageId) {
      const source = state.pages[pageId]; if (!source) throw new Error(`Unknown page: ${pageId}`);
      const id = `page-${Date.now().toString(36)}-${++sequence}`;
      const name = uniqueName(`${source.name} Copy`);
      transact('Duplicate page', pageId, next => {
        const componentInstanceIds = source.componentInstanceIds.map(oldId => {
          const newId = `${oldId}-copy-${++sequence}`;
          next.componentInstances[newId] = { ...clone(source.componentInstanceIds.includes(oldId) ? state.componentInstances[oldId] : next.componentInstances[oldId]), id: newId };
          return newId;
        });
        next.pages[id] = { ...clone(source), id, name, slug: uniqueSlug(name, null, next), componentInstanceIds };
        next.website.pageIds.splice(next.website.pageIds.indexOf(pageId) + 1, 0, id);
      });
      publish({ ...state, workspace: { ...state.workspace, activePageId: id, selectedComponentId: null } });
      return id;
    },
    movePage(pageId, target) {
      const from = state.website.pageIds.indexOf(pageId); if (from < 0) throw new Error(`Unknown page: ${pageId}`);
      const to = Math.max(0, Math.min(target, state.website.pageIds.length - 1)); if (from === to) return;
      transact('Move page', pageId, next => next.website.pageIds.splice(to, 0, next.website.pageIds.splice(from, 1)[0]));
    },
    deletePage(pageId, confirmed = false) {
      if (!confirmed) throw new Error('Page deletion requires confirmation');
      if (state.website.pageIds.length === 1) throw new Error('Website must contain at least one page');
      const source = state.pages[pageId]; if (!source) throw new Error(`Unknown page: ${pageId}`);
      transact('Delete page', pageId, next => { next.website.pageIds.splice(next.website.pageIds.indexOf(pageId), 1); for (const id of source.componentInstanceIds) delete next.componentInstances[id]; delete next.pages[pageId]; });
    },
    updateDesignSettings(patch) { transact('Update design settings', 'design-settings', next => { next.designSettings = { ...next.designSettings, ...patch }; }); },
    updateComponentContent(id, path, value) { if (!page().componentInstanceIds.includes(id)) throw new Error(`Unknown component instance on active page: ${id}`); transact('Edit component content', `${page().id}:${id}`, next => { next.componentInstances[id].content = setPath(next.componentInstances[id].content, path, value); }); },
    setComponentVariant(id, definition, variantId) { if (!definition.variants.some(v => v.id === variantId)) throw new Error(`Unknown variant for ${definition.type}: ${variantId}`); transact('Change component variant', `${page().id}:${id}`, next => { next.componentInstances[id].variantId = variantId; }); },
    setResponsiveOverride(id, definition, variant, device, key, value) { const caps = { ...(definition.responsiveCapabilities || {}), ...(variant.responsiveCapabilities || {}) }, allowed = caps[key]; if (!allowed) throw new Error(`Unsupported responsive override: ${key}`); if (Array.isArray(allowed) && !allowed.includes(value)) throw new Error(`Invalid responsive value: ${key}`); if (key === 'mobileHeading' && (device !== 'mobile' || typeof value !== 'string')) throw new Error('Mobile heading is mobile-only'); transact('Set responsive override', `${page().id}:${id}`, next => { const instance = next.componentInstances[id], overrides = clone(instance.responsiveOverrides || {}); overrides[device] = { ...(overrides[device] || {}), [key]: value }; instance.responsiveOverrides = overrides; }); },
    clearResponsiveOverride(id, device, key) { transact('Clear responsive override', `${page().id}:${id}`, next => { const overrides = clone(next.componentInstances[id].responsiveOverrides || {}); if (key && overrides[device]) delete overrides[device][key]; else delete overrides[device]; if (overrides[device] && !Object.keys(overrides[device]).length) delete overrides[device]; next.componentInstances[id].responsiveOverrides = overrides; }); },
    moveComponent(id, target) { const from = idx(id), to = Math.max(0, Math.min(target, page().componentInstanceIds.length - 1)); if (from === to) return; transact('Move section', `${page().id}:${id}`, next => { const ids = next.pages[state.workspace.activePageId].componentInstanceIds; ids.splice(to, 0, ids.splice(from, 1)[0]); }); },
    insertComponent(definition, index) { const id = `instance-${definition.type}-${Date.now().toString(36)}-${++sequence}`, pageId = page().id; transact('Add section', `${pageId}:${id}`, next => { next.componentInstances[id] = { id, definitionType: definition.type, variantId: definition.defaultVariantId, content: clone(definition.defaultContent), responsiveOverrides: {}, hidden: false }; next.pages[pageId].componentInstanceIds.splice(index, 0, id); }); publish({ ...state, workspace: { ...state.workspace, selectedComponentId: id } }); return id; },
    insertComposition(item, members, index, pageId = page().id) { if (!members?.length) throw new Error('Composition members required'); if (!state.pages[pageId]) throw new Error(`Unknown page: ${pageId}`); const ids = members.map(member => `instance-${member.definitionType}-${Date.now().toString(36)}-${++sequence}`); transact(`Add composition: ${item.name}`, `${pageId}:${item.id}`, next => { members.forEach((member, offset) => { const id = ids[offset]; next.componentInstances[id] = { id, ...clone(member) }; next.pages[pageId].componentInstanceIds.splice(index + offset, 0, id); }); }); if (pageId === state.workspace.activePageId) publish({ ...state, workspace: { ...state.workspace, selectedComponentId: ids[0] } }); return ids; },
    duplicateComponent(id) { const copy = `${id}-copy-${++sequence}`, at = idx(id), pageId = page().id; transact('Duplicate section', `${pageId}:${id}`, next => { next.componentInstances[copy] = { ...clone(next.componentInstances[id]), id: copy }; next.pages[pageId].componentInstanceIds.splice(at + 1, 0, copy); }); publish({ ...state, workspace: { ...state.workspace, selectedComponentId: copy } }); return copy; },
    setComponentHidden(id, hidden) { transact(hidden ? 'Hide section' : 'Show section', `${page().id}:${id}`, next => { next.componentInstances[id].hidden = !!hidden; }); },
    deleteComponent(id) { const at = idx(id), pageId = page().id; transact('Delete section', `${pageId}:${id}`, next => { next.pages[pageId].componentInstanceIds.splice(at, 1); delete next.componentInstances[id]; }); },
    undo() { if (cursor < 0) return; state = reconcileWorkspace(state, entries[cursor].before); cursor--; notify(); },
    redo() { if (cursor >= entries.length - 1) return; cursor++; state = reconcileWorkspace(state, entries[cursor].after); notify(); },
    restoreTo(entryId) { const target = entries.findIndex(entry => entry.id === entryId); if (target < 0) throw new Error('Unknown history entry'); state = reconcileWorkspace(state, entries[target].after); cursor = target; notify(); }
  };
}
