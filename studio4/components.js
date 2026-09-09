function element(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text) node.textContent = text;
  return node;
}

export const componentDefinitions = [
  { type: 'hero', name: 'Hero', contentSchema: ['eyebrow', 'heading', 'body', 'actionLabel'], render(content) { const root = element('section', 'component hero'); root.append(element('p', 'eyebrow', content.eyebrow), element('h1', '', content.heading), element('p', 'lede', content.body), element('a', 'button', content.actionLabel)); return root; } },
  { type: 'services', name: 'Services', contentSchema: ['heading', 'items'], render(content) { const root = element('section', 'component services'); root.append(element('p', 'eyebrow', 'What we do'), element('h2', '', content.heading)); const grid = element('div', 'service-grid'); content.items.forEach((item) => { const card = element('article', 'service-card'); card.append(element('h3', '', item.title), element('p', '', item.body)); grid.append(card); }); root.append(grid); return root; } },
  { type: 'cta', name: 'Call to action', contentSchema: ['heading', 'body', 'actionLabel'], render(content) { const root = element('section', 'component cta'); const copy = element('div'); copy.append(element('h2', '', content.heading), element('p', '', content.body)); root.append(copy, element('a', 'button button-secondary', content.actionLabel)); return root; } }
];
