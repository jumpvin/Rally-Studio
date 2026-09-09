import { validateStudioState } from './model.js';

export function createStudioStore(initialState) {
  let state = structuredClone(initialState);
  const listeners = new Set();
  const assertValid = (candidate) => {
    const errors = validateStudioState(candidate);
    if (errors.length) throw new Error(errors.join('; '));
  };
  assertValid(state);
  return {
    getState: () => structuredClone(state),
    updateDesignSettings(patch) {
      const next = { ...state, designSettings: { ...state.designSettings, ...patch } };
      assertValid(next);
      state = next;
      listeners.forEach((listener) => listener(this.getState()));
    },
    subscribe(listener) { listeners.add(listener); return () => listeners.delete(listener); },
    exportSnapshot: () => JSON.stringify(state, null, 2)
  };
}
