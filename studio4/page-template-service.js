import { resolveComponentMember, resolveComposition } from './composition-service.js';

export function resolvePageTemplate(library, itemId, registry) {
  const item = library.resolve(itemId);
  if (item.type !== 'composition' || item.payload?.kind !== 'page-template') throw new Error('Library item is not a page template');
  if (item.status !== 'certified') throw new Error(`Page template is not insertable: ${item.status}`);
  if (!item.payload?.executable || !item.payload.defaultPageName || !Array.isArray(item.payload.members) || !item.payload.members.length) throw new Error('Malformed executable page template');
  const members = item.payload.members.flatMap((member, index) => {
    if (member?.compositionId) {
      const composition = library.resolve(member.compositionId);
      if (composition.payload?.kind === 'page-template') throw new Error(`Cyclic page template reference at member ${index}`);
      return resolveComposition(library, member.compositionId, registry).members;
    }
    if (member?.definitionType) return [resolveComponentMember(member, registry, { sourceLibraryItemId: item.id, sourceLibraryVersion: item.version })];
    throw new Error(`Page template member ${index} requires compositionId or definitionType`);
  });
  return { item, defaultPageName: item.payload.defaultPageName, members };
}
