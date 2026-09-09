const provenance={source:'rally-studio-seed',kind:'curated-default'};
export const librarySeeds=[
 {id:'component.hero',type:'component',name:'Hero',status:'certified',version:'1.0.0',tags:['marketing','intro'],description:'Primary page introduction component.',provenance,payload:{definitionType:'hero'}},
 {id:'component.services',type:'component',name:'Services',status:'certified',version:'1.0.0',tags:['marketing','services'],description:'Structured service offering component.',provenance,payload:{definitionType:'services'}},
 {id:'component.cta',type:'component',name:'Call to action',status:'certified',version:'1.0.0',tags:['marketing','conversion'],description:'Focused conversion prompt.',provenance,payload:{definitionType:'cta'}},
 {id:'token.color.primary',type:'token',name:'Primary color token',status:'certified',version:'1.0.0',tags:['design','color'],description:'Project primary color reference.',provenance,payload:{tokenPath:'designSettings.primaryColor'}},
 {id:'composition.service-home',type:'composition',name:'Service business home',status:'certified',version:'0.1.0',tags:['page','services'],description:'Representative page composition metadata.',provenance,payload:{componentTypes:['hero','services','cta']}},
 {id:'blueprint.lead-generation',type:'blueprint',name:'Lead generation blueprint',status:'experimental',version:'0.1.0',tags:['strategy','lead-generation'],description:'Non-executable structural blueprint example.',provenance,payload:{purpose:'lead-generation'}},
 {id:'starter.consulting',type:'starter-package',name:'Consulting foundation',status:'specialty',version:'0.1.0',tags:['consulting','starter'],description:'Non-executable starter package example.',provenance,payload:{compositionIds:['composition.service-home']}},
 {id:'token.legacy-accent',type:'token',name:'Legacy accent token',status:'deprecated',version:'0.8.0',tags:['legacy','color'],description:'Retained compatibility token.',provenance:{source:'studio-v3',kind:'legacy-reference'},payload:{tokenPath:'legacy.accent'}},
 {id:'composition.archive-demo',type:'composition',name:'Archived campaign page',status:'archived',version:'0.4.0',tags:['archive'],description:'Archived catalog visibility example.',provenance:{source:'studio-v3',kind:'legacy-reference'},payload:{componentTypes:[]}}
];
