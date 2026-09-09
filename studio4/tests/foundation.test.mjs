import test from 'node:test';
import assert from 'node:assert/strict';
import { createComponentRegistry } from '../component-registry.js';
import { orderedInstances, validateStudioState } from '../model.js';
import { createStudioStore } from '../state-store.js';
import { seedState } from '../seed.js';

test('website page and ordered component references are structurally valid',()=>{assert.deepEqual(validateStudioState(seedState),[]);assert.deepEqual(orderedInstances(seedState).map(item=>item.id),['instance-hero','instance-services','instance-cta'])});
test('registry resolves definitions independently from instance content',()=>{const registry=createComponentRegistry().register({type:'example',contentSchema:['title'],render:content=>content.title});assert.equal(registry.resolve('example').render({title:'Reusable content'}),'Reusable content');assert.throws(()=>registry.resolve('missing'),/Unknown component type/)});
test('global settings update atomically and notify subscribers',()=>{const store=createStudioStore(seedState);let observed;store.subscribe(state=>{observed=state.designSettings});store.updateDesignSettings({primaryColor:'#ff0066',radius:24});assert.equal(observed.primaryColor,'#ff0066');assert.equal(observed.radius,24);assert.match(store.exportSnapshot(),/"componentInstanceIds"/)});
test('canvas and Explorer share one selected instance identity',()=>{const store=createStudioStore(seedState);store.selectComponent('instance-services');assert.equal(store.getState().workspace.selectedComponentId,'instance-services');store.setMode('preview');assert.equal(store.getState().workspace.selectedComponentId,null);assert.equal(store.getState().workspace.mode,'preview');store.setMode('edit');assert.equal(store.getState().workspace.mode,'edit')});
test('inline and panel editors share the structured content update path',()=>{const store=createStudioStore(seedState);store.updateComponentContent('instance-hero','heading','A clearer heading');store.updateComponentContent('instance-services','items.0.title','Updated service');assert.equal(store.getState().componentInstances['instance-hero'].content.heading,'A clearer heading');assert.equal(store.getState().componentInstances['instance-services'].content.items[0].title,'Updated service');assert.throws(()=>store.updateComponentContent('missing','heading','No'),/Unknown component instance/)});
