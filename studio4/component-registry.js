export function createComponentRegistry(){
 const definitions=new Map();
 return{
  register(input){if(!input?.type)throw new Error('Component definition requires type');if(definitions.has(input.type))throw new Error(`Component already registered: ${input.type}`);const variants=input.variants?.length?input.variants:[{id:'default',name:'Default',render:input.render}];if(variants.some(v=>!v.id||typeof v.render!=='function'))throw new Error('Variant requires id and render');if(new Set(variants.map(v=>v.id)).size!==variants.length)throw new Error('Variant identities must be unique');const defaultVariantId=input.defaultVariantId||variants[0].id;if(!variants.some(v=>v.id===defaultVariantId))throw new Error(`Unknown default variant: ${defaultVariantId}`);definitions.set(input.type,Object.freeze({...input,defaultVariantId,variants:Object.freeze(variants.map(v=>Object.freeze({...v})))}));return this},
  resolve(type){const definition=definitions.get(type);if(!definition)throw new Error(`Unknown component type: ${type}`);return definition},
  resolveVariant(type,variantId){const definition=this.resolve(type),id=variantId||definition.defaultVariantId,variant=definition.variants.find(item=>item.id===id);if(!variant)throw new Error(`Unknown variant for ${type}: ${id}`);return variant},
  list:()=>[...definitions.values()]
 }
}
