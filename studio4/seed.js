export const seedState = {
  website: { id: 'website-rally-demo', name: 'Northstar Advisory', pageIds: ['page-home'] },
  pages: {
    'page-home': { id: 'page-home', websiteId: 'website-rally-demo', name: 'Home', slug: '/', componentInstanceIds: ['instance-hero', 'instance-services', 'instance-cta'] }
  },
  designSettings: { primaryColor: '#4f46e5', secondaryColor: '#172554', radius: 18, spacing: 28, fontFamily: 'Inter, ui-sans-serif, system-ui, sans-serif' },
  componentInstances: {
    'instance-hero': { id: 'instance-hero', definitionType: 'hero', variantId: 'default', content: { eyebrow: 'Clear direction. Confident growth.', heading: 'Strategy that moves your business forward.', body: 'Northstar helps ambitious teams turn complexity into a focused path for growth.', actionLabel: 'Start a conversation' } },
    'instance-services': { id: 'instance-services', definitionType: 'services', variantId: 'cards', content: { heading: 'A practical partner at every turn', items: [{ title: 'Find the signal', body: 'Research and positioning that reveal the clearest opportunity.' }, { title: 'Shape the system', body: 'A useful plan connecting brand, product, and customer experience.' }, { title: 'Build momentum', body: 'Focused execution that makes the next right action obvious.' }] } },
    'instance-cta': { id: 'instance-cta', definitionType: 'cta', variantId: 'default', content: { heading: 'Ready for a clearer path?', body: 'Let’s find the work that will matter most.', actionLabel: 'Plan your next move' } }
  }
};
