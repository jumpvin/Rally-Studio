import { validateStudioState } from './model.js';
function setAtPath(source,path,value){const clone=structuredClone(source);const parts=path.split('.');let cursor=clone;for(const part of parts.slice(0,-1))cursor=cursor[part];cursor[parts.at(-1)]=value;return clone}
export function createStudioStore(initialState){
  let state={...structuredClone(initialState),workspace:{mode:'edit',selectedComponentId:null}};
  const listeners=new Set();
  const assertValid=candidate=>{const errors=validateStudioState(candidate);if(errors.length)throw new Error(errors.join('; '))};
  const publish=next=>{assertValid(next);state=next;listeners.forEach(listener=>listener(structuredClone(state)))};
  assertValid(state);
  return {
    getState:()=>structuredClone(state),
    updateDesignSettings:patch=>publish({...state,designSettings:{...state.designSettings,...patch}}),
    selectComponent:id=>publish({...state,workspace:{...state.workspace,selectedComponentId:id}}),
    setMode(mode){if(!['edit','preview'].includes(mode))throw new Error(`Invalid workspace mode: ${mode}`);publish({...state,workspace:{mode,selectedComponentId:mode==='preview'?null:state.workspace.selectedComponentId}})},
    updateComponentContent(instanceId,path,value){if(!state.componentInstances[instanceId])throw new Error(`Unknown component instance: ${instanceId}`);const content=setAtPath(state.componentInstances[instanceId].content,path,value);publish({...state,componentInstances:{...state.componentInstances,[instanceId]:{...state.componentInstances[instanceId],content}}})},
    subscribe(listener){listeners.add(listener);return()=>listeners.delete(listener)},
    exportSnapshot:()=>JSON.stringify(state,null,2)
  }
}
