import test from 'node:test';
import assert from 'node:assert/strict';
import { createComponentRegistry } from '../component-registry.js';
import { orderedInstances, validateStudioState } from '../model.js';
import { createStudioStore } from '../state-store.js';
import { seedState } from '../seed.js';

test('website page and ordered component references are structurally valid',()=>{assert.deepEqual(validateStudioState(seedState),[]);assert.deepEqual(orderedInstances(seedState).map(item=>item.id),['instance-hero','instance-services','instance-cta'])});
test('registry resolves definitions independently from instance content',()=>{const registry=createComponentRegistry().register({type:'example',contentSchema:['title'],render:content=>content.title});assert.equal(registry.resolve('example').render({title:'Reusable content'}),'Reusable content');assert.throws(()=>registry.resolve('missing'),/Unknown component type/)});
test('global settings update atomically and notify subscribers',()=>{const store=createStudioStore(seedState);let observed;store.subscribe(state=>{observed=state.designSettings});store.updateDesignSettings({primaryColor:'#ff0066',radius:24});assert.equal(observed.primaryColor,'#ff0066');assert.equal(observed.radius,24);assert.match(store.exportSnapshot(),/"componentInstanceIds"/)});
