export function createComponentRegistry() {
  const definitions = new Map();
  return {
    register(definition) {
      if (!definition?.type || typeof definition.render !== 'function') throw new Error('Component definition requires type and render');
      if (definitions.has(definition.type)) throw new Error(`Component already registered: ${definition.type}`);
      definitions.set(definition.type, Object.freeze({ ...definition }));
      return this;
    },
    resolve(type) {
      const definition = definitions.get(type);
      if (!definition) throw new Error(`Unknown component type: ${type}`);
      return definition;
    },
    list: () => [...definitions.values()]
  };
}
