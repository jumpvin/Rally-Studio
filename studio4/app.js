import { createStudioStore } from './state-store.js';
import { createComponentRegistry } from './component-registry.js';
import { componentDefinitions } from './components.js';
import { activePage, orderedInstances } from './model.js';
import { seedState } from './seed.js';

for (const href of ['/studio4/responsive.css','/studio4/history.css','/studio4/library.css']) document.head.append(Object.assign(document.createElement('link'), { rel: 'stylesheet', href }));
const store = createStudioStore(seedState), registry = createComponentRegistry(), $ = selector => document.querySelector(selector), canvas = $('#page-canvas');
componentDefinitions.forEach(definition => registry.register(definition));
let insertionIndex = 0;
const read = (object, path) => path.split('.').reduce((value, key) => value?.[key], object);

const deviceBar = document.createElement('nav');
deviceBar.className = 'device-switch';
deviceBar.innerHTML = '<button data-device="desktop">Desktop</button><button data-device="tablet">Tablet</button><button data-device="mobile">Mobile</button>';
document.querySelector('.mode-switch').before(deviceBar);
import('./library-ui.js').then(({ initLibraryUI }) => initLibraryUI({ store, registry }));

document.querySelectorAll('[data-setting]').forEach(control => control.addEventListener('change', () => {
  const value = control.type === 'range' ? Number(control.value) : control.value;
  store.updateDesignSettings({ [control.dataset.setting]: value });
  const output = control.parentElement.querySelector('output'); if (output) output.value = value;
}));

const historyDock = document.createElement('aside');
historyDock.className = 'history-dock';
historyDock.innerHTML = '<header><strong>Workspace History</strong><button data-close-history>×</button></header><div class="history-actions"><button data-undo>Undo</button><button data-redo>Redo</button></div><ol data-history-list></ol>';
document.body.append(historyDock);
const historyToggle = document.createElement('button'); historyToggle.className = 'history-toggle'; historyToggle.textContent = 'History'; document.querySelector('.mode-switch').after(historyToggle);
historyToggle.onclick = () => historyDock.classList.toggle('open'); historyDock.querySelector('[data-close-history]').onclick = () => historyDock.classList.remove('open'); historyDock.querySelector('[data-undo]').onclick = () => store.undo(); historyDock.querySelector('[data-redo]').onclick = () => store.redo();

function renderHistory() {
  const history = store.getHistory(), list = historyDock.querySelector('[data-history-list]');
  historyDock.querySelector('[data-undo]').disabled = !history.canUndo; historyDock.querySelector('[data-redo]').disabled = !history.canRedo;
  list.replaceChildren(...history.entries.map((entry, index) => { const item = document.createElement('li'), button = document.createElement('button'); item.classList.toggle('current', index === history.cursor); button.innerHTML = `<strong>${entry.label}</strong><small>${new Date(entry.timestamp).toLocaleTimeString()} · ${entry.affectedObject}</small>`; button.onclick = () => store.restoreTo(entry.id); item.append(button); return item; }).reverse());
}
store.subscribe(renderHistory); renderHistory();

function moveControls(item, index, count, move) {
  const box = document.createElement('div'); box.className = 'move-controls';
  [['↑', -1], ['↓', 1]].forEach(([text, delta]) => { const button = document.createElement('button'); button.textContent = text; button.disabled = index + delta < 0 || index + delta >= count; button.onclick = event => { event.stopPropagation(); move(item.id, index + delta); }; box.append(button); });
  return box;
}

function openPageDialog({ title, value = '', danger = false, action }) {
  const overlay = document.createElement('div'); overlay.className = 'page-dialog';
  overlay.innerHTML = `<form><h2>${title}</h2>${danger ? `<p>Delete “${value}” and all of its sections? You can undo this action.</p>` : `<label>Page name<input value="${value.replaceAll('&','&amp;').replaceAll('"','&quot;')}"></label>`}<div><button type="button">Cancel</button><button type="submit" class="${danger ? 'danger' : ''}">${danger ? 'Delete page' : 'Save'}</button></div></form>`;
  document.body.append(overlay); const form = overlay.querySelector('form'), input = overlay.querySelector('input');
  overlay.querySelector('[type="button"]').onclick = () => overlay.remove();
  form.onsubmit = event => { event.preventDefault(); action(input ? input.value : true); overlay.remove(); };
  input?.focus(); input?.select();
}

function pageActions(page) {
  const actions = document.createElement('div'); actions.className = 'page-actions';
  const rename = document.createElement('button'); rename.textContent = 'Rename'; rename.title = 'Rename page'; rename.onclick = event => { event.stopPropagation(); openPageDialog({ title: 'Rename page', value: page.name, action: name => store.renamePage(page.id, name) }); };
  const duplicate = document.createElement('button'); duplicate.textContent = 'Copy'; duplicate.title = 'Duplicate page'; duplicate.onclick = event => { event.stopPropagation(); store.duplicatePage(page.id); };
  const remove = document.createElement('button'); remove.textContent = 'Delete'; remove.title = 'Delete page'; remove.disabled = store.getState().website.pageIds.length === 1; remove.onclick = event => { event.stopPropagation(); openPageDialog({ title: 'Confirm page deletion', value: page.name, danger: true, action: () => store.deletePage(page.id, true) }); };
  actions.append(rename, duplicate, remove); return actions;
}

function explorer(state) {
  const current = activePage(state), items = orderedInstances(state);
  $('#workspace-identity').textContent = `${state.website.name} / ${current.name}`; $('#website-name').textContent = state.website.name; $('#browser-path').textContent = `northstar.example${current.slug}`;
  $('#page-list').replaceChildren(...state.website.pageIds.map((id, index) => { const page = state.pages[id], row = document.createElement('div'), button = document.createElement('button'); row.className = `page-row ${id === current.id ? 'active' : ''}`; button.className = 'page-select'; button.innerHTML = `<strong>${page.name}</strong><small>${page.slug}${id === current.id ? ' · Active' : ''}</small>`; button.onclick = () => store.selectPage(id); row.append(button, moveControls(page, index, state.website.pageIds.length, (pageId, target) => store.movePage(pageId, target)), pageActions(page)); return row; }));
  $('#component-list').replaceChildren(...items.map((instance, index) => { const row = document.createElement('div'), button = document.createElement('button'), definition = registry.resolve(instance.definitionType), variant = registry.resolveVariant(instance.definitionType, instance.variantId), hidden = instance.responsiveOverrides?.[state.workspace.previewDevice]?.visibility === false; row.className = 'explorer-row'; button.className = `component-item ${instance.id === state.workspace.selectedComponentId ? 'selected' : ''}`; button.innerHTML = `<span>${definition.name}${instance.hidden || hidden ? ' · Hidden' : ''}</span><small>${variant.name}</small>`; button.onclick = () => store.selectComponent(instance.id); row.append(button, moveControls(instance, index, items.length, (id, target) => store.moveComponent(id, target))); return row; }));
}

function responsiveControls(instance, definition, variant, device) {
  const caps = { ...(definition.responsiveCapabilities || {}), ...(variant.responsiveCapabilities || {}) }, values = instance.responsiveOverrides?.[device] || {}, section = document.createElement('section'); section.className = 'responsive-controls'; section.innerHTML = `<header><div><small>Responsive · ${device}</small><strong>Automatic by default</strong></div><button type="button">Reset</button></header>`; section.querySelector('button').onclick = () => store.clearResponsiveOverride(instance.id, device);
  for (const [key, label] of [['visibility','Visibility'],['alignment','Alignment'],['spacing','Spacing'],['layout','Layout']]) if (caps[key]) { const row = document.createElement('label'), select = document.createElement('select'); row.textContent = label; select.append(new Option('Automatic', ''), ...caps[key].map(value => { const option = new Option(key === 'visibility' ? (value ? 'Visible' : 'Hidden') : value, String(value)); option.selected = values[key] === value; return option; })); select.onchange = () => select.value === '' ? store.clearResponsiveOverride(instance.id, device, key) : store.setResponsiveOverride(instance.id, definition, variant, device, key, key === 'visibility' ? select.value === 'true' : select.value); row.append(select); section.append(row); }
  if (caps.mobileHeading && device === 'mobile') { const row = document.createElement('label'), input = document.createElement('input'); row.textContent = 'Short mobile heading'; input.value = values.mobileHeading || ''; input.placeholder = 'Use canonical heading'; input.onchange = () => input.value ? store.setResponsiveOverride(instance.id, definition, variant, device, 'mobileHeading', input.value) : store.clearResponsiveOverride(instance.id, device, 'mobileHeading'); row.append(input); section.append(row); }
  return section;
}

function context(state) {
  const instance = state.componentInstances[state.workspace.selectedComponentId]; $('#context-panel').hidden = !instance || state.workspace.mode === 'preview'; $('#context-empty').hidden = !!instance || state.workspace.mode === 'preview'; if (!instance || state.workspace.mode === 'preview') return;
  const definition = registry.resolve(instance.definitionType), variant = registry.resolveVariant(instance.definitionType, instance.variantId); $('#context-title').textContent = definition.name; $('#context-id').textContent = instance.id; $('#toggle-hidden').textContent = instance.hidden ? 'Show' : 'Hide'; document.querySelectorAll('.variant-controls,.responsive-controls').forEach(node => node.remove());
  const controls = document.createElement('section'); controls.className = 'variant-controls'; controls.innerHTML = '<small>Presentation variant</small>'; if (definition.variants.length > 1) { const select = document.createElement('select'); definition.variants.forEach(item => { const option = new Option(item.name, item.id); option.selected = item.id === variant.id; select.add(option); }); select.onchange = () => store.setComponentVariant(instance.id, definition, select.value); controls.append(select); } else controls.append(Object.assign(document.createElement('strong'), { textContent: variant.name }));
  $('#context-panel .inheritance-note').before(controls, responsiveControls(instance, definition, variant, state.workspace.previewDevice)); $('#context-form').replaceChildren(...definition.editableFields.map(field => { const label = document.createElement('label'), input = document.createElement(field.multiline ? 'textarea' : 'input'); label.textContent = field.label; input.value = read(instance.content, field.path); input.onchange = () => store.updateComponentContent(instance.id, field.path, input.value); label.append(input); return label; }));
}

function addButton(index) { const button = document.createElement('button'); button.className = 'add-between'; button.textContent = '＋'; button.onclick = () => openChooser(index); return button; }
function renderPage(state) {
  const device = state.workspace.previewDevice, settings = state.designSettings, items = orderedInstances(state), nodes = []; canvas.parentElement.dataset.device = device;
  for (const [name, value] of Object.entries({ '--primary': settings.primaryColor, '--secondary': settings.secondaryColor, '--radius': `${settings.radius}px`, '--space': `${settings.spacing}px` })) canvas.style.setProperty(name, value);
  items.forEach((instance, index) => { if (state.workspace.mode === 'edit') nodes.push(addButton(index)); const override = instance.responsiveOverrides?.[device] || {}, hidden = instance.hidden || override.visibility === false; if (hidden && state.workspace.mode === 'preview') return; const variant = registry.resolveVariant(instance.definitionType, instance.variantId), content = structuredClone(instance.content); if (device === 'mobile' && override.mobileHeading) content.heading = override.mobileHeading; const node = variant.render(content, settings); node.dataset.instanceId = instance.id; node.dataset.device = device; node.dataset.alignment = override.alignment || 'auto'; node.dataset.spacing = override.spacing || 'auto'; node.dataset.layout = override.layout || 'auto'; node.classList.toggle('selected', instance.id === state.workspace.selectedComponentId); node.classList.toggle('is-hidden', hidden); if (state.workspace.mode === 'edit') { node.append(moveControls(instance, index, items.length, (id, target) => store.moveComponent(id, target))); node.onclick = () => store.selectComponent(instance.id); node.querySelectorAll('[data-edit-field]').forEach(editable => { editable.contentEditable = 'true'; editable.onclick = event => event.stopPropagation(); editable.onblur = () => store.updateComponentContent(instance.id, editable.dataset.editField, editable.textContent.trim()); }); } nodes.push(node); });
  if (state.workspace.mode === 'edit') nodes.push(addButton(items.length)); canvas.replaceChildren(...nodes);
}

function render(state) { document.body.dataset.mode = state.workspace.mode; document.querySelectorAll('[data-mode]').forEach(button => button.classList.toggle('active', button.dataset.mode === state.workspace.mode)); document.querySelectorAll('[data-device]').forEach(button => button.classList.toggle('active', button.dataset.device === state.workspace.previewDevice)); explorer(state); renderPage(state); context(state); }
function openChooser(index) { insertionIndex = index; $('#add-chooser').hidden = false; }
$('#definition-list').replaceChildren(...registry.list().map(definition => { const button = document.createElement('button'); button.textContent = definition.name; button.onclick = () => { store.insertComponent(definition, insertionIndex); $('#add-chooser').hidden = true; }; return button; }));
document.querySelectorAll('[data-mode]').forEach(button => button.onclick = () => store.setMode(button.dataset.mode)); document.querySelectorAll('[data-device]').forEach(button => button.onclick = () => store.setPreviewDevice(button.dataset.device)); $('[data-add-index]').onclick = () => openChooser(store.getActivePage().componentInstanceIds.length); $('#add-page').onclick = () => openPageDialog({ title: 'Create page', value: 'Untitled Page', action: name => store.createPage(name) }); $('#close-chooser').onclick = () => $('#add-chooser').hidden = true; $('#close-context').onclick = () => store.selectComponent(null); $('#duplicate').onclick = () => store.duplicateComponent(store.getState().workspace.selectedComponentId); $('#toggle-hidden').onclick = () => { const state = store.getState(), id = state.workspace.selectedComponentId; store.setComponentHidden(id, !state.componentInstances[id].hidden); }; $('#delete').onclick = () => store.deleteComponent(store.getState().workspace.selectedComponentId); $('#undo').onclick = () => store.undo();
store.subscribe(render); render(store.getState());
