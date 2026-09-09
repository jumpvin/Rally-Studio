import {validateStudioState} from './model.js';
const clone=value=>structuredClone(value);
function setAtPath(source,path,value){const next=clone(source),parts=path.split('.');let cursor=next;for(const part of parts.slice(0,-1))cursor=cursor[part];cursor[parts.at(-1)]=value;return next}
export function createStudioStore(initialState){
 let state={...clone(initialState),workspace:{mode:'edit',selectedComponentId:null,undo:null}},sequence=0;const listeners=new Set();
 const assertValid=candidate=>{const errors=validateStudioState(candidate);if(errors.length)throw new Error(errors.join('; '))};
 const publish=next=>{assertValid(next);state=next;listeners.forEach(listener=>listener(clone(state)))};
 const snapshot=label=>({label,page:clone(state.page),componentInstances:clone(state.componentInstances),selectedComponentId:state.workspace.selectedComponentId});
 const structural=(label,mutate)=>{const undo=snapshot(label);const next=mutate(clone(state));next.workspace.undo=undo;publish(next)};
 const indexOf=id=>state.page.componentInstanceIds.indexOf(id);
 assertValid(state);
 return{
  getState:()=>clone(state),subscribe(listener){listeners.add(listener);return()=>listeners.delete(listener)},exportSnapshot:()=>JSON.stringify(state,null,2),
  updateDesignSettings:patch=>publish({...state,designSettings:{...state.designSettings,...patch}}),
  selectComponent:id=>publish({...state,workspace:{...state.workspace,selectedComponentId:id}}),
  setMode(mode){if(!['edit','preview'].includes(mode))throw new Error(`Invalid workspace mode: ${mode}`);publish({...state,workspace:{...state.workspace,mode,selectedComponentId:mode==='preview'?null:state.workspace.selectedComponentId}})},
  updateComponentContent(id,path,value){if(!state.componentInstances[id])throw new Error(`Unknown component instance: ${id}`);const content=setAtPath(state.componentInstances[id].content,path,value);publish({...state,componentInstances:{...state.componentInstances,[id]:{...state.componentInstances[id],content}}})},
  moveComponent(id,targetIndex){const from=indexOf(id);if(from<0)throw new Error(`Unknown page instance: ${id}`);const bounded=Math.max(0,Math.min(targetIndex,state.page.componentInstanceIds.length-1));if(from===bounded)return;structural('Move section',next=>{const ids=next.page.componentInstanceIds;ids.splice(bounded,0,ids.splice(from,1)[0]);return next})},
  insertComponent(definition,index){if(!definition?.type||!definition.defaultContent)throw new Error('Registered definition defaults required');const id=`instance-${definition.type}-${Date.now().toString(36)}-${++sequence}`;structural('Add section',next=>{next.componentInstances[id]={id,definitionType:definition.type,content:clone(definition.defaultContent),hidden:false};next.page.componentInstanceIds.splice(Math.max(0,Math.min(index,next.page.componentInstanceIds.length)),0,id);next.workspace.selectedComponentId=id;return next});return id},
  duplicateComponent(id){const source=state.componentInstances[id],at=indexOf(id);if(!source||at<0)throw new Error(`Unknown page instance: ${id}`);const copyId=`${id}-copy-${Date.now().toString(36)}-${++sequence}`;structural('Duplicate section',next=>{next.componentInstances[copyId]={...clone(source),id:copyId};next.page.componentInstanceIds.splice(at+1,0,copyId);next.workspace.selectedComponentId=copyId;return next});return copyId},
  setComponentHidden(id,hidden){if(!state.componentInstances[id])throw new Error(`Unknown component instance: ${id}`);structural(hidden?'Hide section':'Show section',next=>{next.componentInstances[id].hidden=Boolean(hidden);return next})},
  deleteComponent(id){const at=indexOf(id);if(at<0)throw new Error(`Unknown page instance: ${id}`);structural('Delete section',next=>{next.page.componentInstanceIds.splice(at,1);delete next.componentInstances[id];next.workspace.selectedComponentId=null;return next})},
  undoLastStructuralAction(){const undo=state.workspace.undo;if(!undo)return;publish({...state,page:undo.page,componentInstances:undo.componentInstances,workspace:{...state.workspace,selectedComponentId:undo.selectedComponentId,undo:null}})}
 }
}
