const clone = value => structuredClone(value);
const actor = id => ({ id: id || 'local-user', name: id === 'client' ? 'Client' : id === 'rally-staff' ? 'Rally staff' : 'Local user' });
const questions = [
  { id:'business-summary',sectionId:'business',label:'What does the business or organization do?',type:'long-text',required:true,position:1,semanticKey:'business.summary' },
  { id:'audience-primary',sectionId:'business',label:'Who is the primary audience?',type:'short-text',required:true,position:2,semanticKey:'audience.primary' },
  { id:'service-area',sectionId:'business',label:'What geographic or service area matters?',type:'short-text',required:false,position:3,semanticKey:'business.serviceArea' },
  { id:'goal-primary',sectionId:'goals',label:'What is the primary Website goal?',type:'single-choice',required:true,position:1,choices:['generate-leads','sell-online','inform','build-trust'],semanticKey:'goals.primary' },
  { id:'action-primary',sectionId:'goals',label:'What should visitors do first?',type:'short-text',required:true,position:2,semanticKey:'actions.primary' },
  { id:'required-pages',sectionId:'content',label:'Which pages are already known to be needed?',type:'multi-choice',required:true,position:1,choices:['home','about','services','contact','work'],semanticKey:'content.requiredPages' },
  { id:'proof-available',sectionId:'content',label:'Are testimonials or case studies available?',type:'yes-no',required:false,position:2,choices:['yes','no'],semanticKey:'content.proofAvailable' },
  { id:'brand-direction',sectionId:'brand',label:'Which direction should the brand convey?',type:'multi-choice',required:true,position:1,choices:['confident','approachable','premium','energetic','minimal'],semanticKey:'brand.direction' },
  { id:'brand-notes',sectionId:'brand',label:'Any visual preferences or avoidances?',type:'long-text',required:false,position:2,semanticKey:'brand.notes' },
  { id:'features',sectionId:'practical',label:'Which functional needs are known?',type:'multi-choice',required:false,position:1,choices:['contact-form','scheduling','ecommerce','newsletter'],semanticKey:'requirements.features' },
  { id:'deadline',sectionId:'practical',label:'Are there known launch constraints?',type:'long-text',required:false,position:2,semanticKey:'requirements.constraints' }
];
export const websiteDiscoveryQuestionnaire = Object.freeze({ id:'website-discovery',domain:'discovery',version:'1.0.0',title:'Website Discovery',description:'Business and project context for future strategy and recommendations.',sections:[
  {id:'business',title:'Business & Audience',position:1,questionIds:['business-summary','audience-primary','service-area']},
  {id:'goals',title:'Goals & Actions',position:2,questionIds:['goal-primary','action-primary']},
  {id:'content',title:'Content & Proof',position:3,questionIds:['required-pages','proof-available']},
  {id:'brand',title:'Brand & Direction',position:4,questionIds:['brand-direction','brand-notes']},
  {id:'practical',title:'Practical Requirements',position:5,questionIds:['features','deadline']}
],questions });

const answered = value => Array.isArray(value) ? value.length > 0 : String(value ?? '').trim() !== '';
export function createDiscoveryStore(documentStore) {
  let sets={}, order=[], selectedId=null, selectedSectionId=websiteDiscoveryQuestionnaire.sections[0].id, sequence=0; const listeners=new Set(), notify=()=>listeners.forEach(listener=>listener(api.getState()));
  const set=id=>{const value=sets[id];if(!value)throw new Error(`Unknown Discovery response set: ${id}`);return value;};
  const progress=id=>{const value=set(id), responseQuestions=websiteDiscoveryQuestionnaire.questions, answeredQuestions=responseQuestions.filter(q=>answered(value.responses[q.id]?.answer)), required=responseQuestions.filter(q=>q.required), requiredAnswered=required.filter(q=>answered(value.responses[q.id]?.answer)); const sections=websiteDiscoveryQuestionnaire.sections.map(section=>{const scoped=responseQuestions.filter(q=>q.sectionId===section.id),done=scoped.filter(q=>answered(value.responses[q.id]?.answer)),requiredScoped=scoped.filter(q=>q.required),requiredDone=requiredScoped.filter(q=>answered(value.responses[q.id]?.answer));return{id:section.id,answered:done.length,total:scoped.length,requiredAnswered:requiredDone.length,requiredTotal:requiredScoped.length,complete:requiredDone.length===requiredScoped.length};});return{state:answeredQuestions.length===0?'draft':requiredAnswered.length===required.length?'completed':'in-progress',answered:answeredQuestions.length,total:responseQuestions.length,requiredAnswered:requiredAnswered.length,requiredTotal:required.length,sections};};
  const api={
    definition:clone(websiteDiscoveryQuestionnaire),subscribe(listener){listeners.add(listener);return()=>listeners.delete(listener);},getState(){return{sets:clone(sets),order:[...order],selectedId,selectedSectionId};},
    create(createdBy='local-user'){const document=documentStore.getState(),id=`discovery-${Date.now().toString(36)}-${++sequence}`,now=new Date().toISOString();sets[id]={id,websiteId:document.website.id,questionnaireId:websiteDiscoveryQuestionnaire.id,questionnaireVersion:websiteDiscoveryQuestionnaire.version,createdAt:now,createdBy:actor(createdBy),updatedAt:now,responses:{}};order.push(id);selectedId=id;notify();return id;},
    ensureCurrent(){const websiteId=documentStore.getState().website.id,existing=order.find(id=>sets[id].websiteId===websiteId);return existing||(api.create(),selectedId);},
    get(id){const value=set(id);return{...clone(value),contextAvailable:value.websiteId===documentStore.getState().website.id,progress:progress(id)};},progress,
    selectSection(id){if(!websiteDiscoveryQuestionnaire.sections.some(section=>section.id===id))throw new Error(`Unknown Discovery section: ${id}`);selectedSectionId=id;notify();},
    respond(id,questionId,answer,answeredBy='local-user'){const value=set(id),question=questions.find(item=>item.id===questionId);if(!question)throw new Error(`Unknown Discovery question: ${questionId}`);let normalized=question.type==='multi-choice'?[...new Set((Array.isArray(answer)?answer:[]).filter(choice=>question.choices.includes(choice)))]:String(answer??'').trim();if(question.type!=='multi-choice'&&question.choices&&normalized&&!question.choices.includes(normalized))throw new Error(`Unsupported Discovery answer: ${questionId}`);const now=new Date().toISOString(),existing=value.responses[questionId];if(!answered(normalized))delete value.responses[questionId];else value.responses[questionId]={id:existing?.id||`discovery-response-${Date.now().toString(36)}-${++sequence}`,responseSetId:id,questionId,answer:clone(normalized),answeredBy:actor(answeredBy),createdAt:existing?.createdAt||now,updatedAt:now};value.updatedAt=now;notify();return value.responses[questionId]?clone(value.responses[questionId]):null;},
    getRecommendationInputs(id){const value=set(id),result={};for(const question of questions){const response=value.responses[question.id];if(!response)continue;const parts=question.semanticKey.split('.');let cursor=result;for(const part of parts.slice(0,-1))cursor=cursor[part]||=( {});cursor[parts.at(-1)]=clone(response.answer);}return result;}
  };return api;
}
