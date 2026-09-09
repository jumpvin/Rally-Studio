import { resolvePageTemplate } from './page-template-service.js';

const supportedSettings = new Set(['primaryColor','secondaryColor','radius','spacing','fontFamily']);
const slugBase = name => `/${String(name).trim().toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'') || 'page'}`;

export function resolveStarterPackage(library, itemId, registry) {
  const item = library.resolve(itemId);
  if (item.type !== 'starter-package') throw new Error('Library item is not a starter package');
  if (item.status !== 'certified') throw new Error(`Starter package is not insertable: ${item.status}`);
  const recipe = item.payload;
  if (!recipe?.executable || !recipe.recommendedWebsiteName || !Array.isArray(recipe.pageTemplates) || !recipe.pageTemplates.length) throw new Error('Malformed executable starter package');
  const seen = new Set(), slugs = new Set();
  const pages = recipe.pageTemplates.map((reference, index) => {
    if (!reference?.pageTemplateId) throw new Error(`Starter package page ${index} missing pageTemplateId`);
    if (seen.has(reference.pageTemplateId)) throw new Error(`Duplicate Page Template reference: ${reference.pageTemplateId}`);
    seen.add(reference.pageTemplateId);
    const resolved = resolvePageTemplate(library, reference.pageTemplateId, registry);
    const name = String(reference.name || resolved.defaultPageName).trim();
    if (!name) throw new Error(`Starter package page ${index} missing name`);
    let slug = slugBase(name), suffix = 2; while (slugs.has(slug)) slug = `${slugBase(name)}-${suffix++}`; slugs.add(slug);
    return { ...resolved, name, slug };
  });
  const designSettings = structuredClone(recipe.designSettings || {});
  for (const [key, value] of Object.entries(designSettings)) {
    if (!supportedSettings.has(key)) throw new Error(`Unsupported design setting: ${key}`);
    if ((key === 'primaryColor' || key === 'secondaryColor' || key === 'fontFamily') && typeof value !== 'string') throw new Error(`Invalid design setting: ${key}`);
    if ((key === 'radius' || key === 'spacing') && (!Number.isFinite(value) || value < 0)) throw new Error(`Invalid design setting: ${key}`);
  }
  return { item, websiteName: recipe.recommendedWebsiteName, pages, designSettings };
}
