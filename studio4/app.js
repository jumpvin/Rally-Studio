import { createStudioStore } from './state-store.js';
import { createComponentRegistry } from './component-registry.js';
import { componentDefinitions } from './components.js';
import { orderedInstances } from './model.js';
import { seedState } from './seed.js';

const store = createStudioStore(seedState);
const registry = createComponentRegistry();
componentDefinitions.forEach((definition) => registry.register(definition));
const canvas = document.querySelector('#page-canvas');
const identity = document.querySelector('#workspace-identity');

function render(state) {
  const settings = state.designSettings;
  for (const [name, value] of Object.entries({ '--primary': settings.primaryColor, '--secondary': settings.secondaryColor, '--radius': `${settings.radius}px`, '--space': `${settings.spacing}px`, '--font': settings.fontFamily })) canvas.style.setProperty(name, value);
  identity.textContent = `${state.website.name} / ${state.page.name}`;
  canvas.replaceChildren(...orderedInstances(state).map((instance) => {
    const node = registry.resolve(instance.definitionType).render(instance.content, settings);
    node.dataset.instanceId = instance.id;
    node.dataset.definitionType = instance.definitionType;
    return node;
  }));
}

document.querySelectorAll('[data-setting]').forEach((control) => control.addEventListener('input', () => {
  const value = control.type === 'range' ? Number(control.value) : control.value;
  store.updateDesignSettings({ [control.dataset.setting]: value });
  const output = control.parentElement.querySelector('output');
  if (output) output.value = value;
}));
store.subscribe(render);
render(store.getState());
