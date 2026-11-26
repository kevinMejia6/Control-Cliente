const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const original={version:1,clients:[{id:'1',name:'Cliente guardado'}],cases:[],attachmentFiles:[]};
let value=JSON.stringify(original),reject=false;
const toastElement={textContent:'',classList:{add(){},remove(){}}};
const context=vm.createContext({data:structuredClone(original),localStorage:{getItem:()=>value,setItem:(k,v)=>{if(reject)throw Error('QuotaExceededError');value=v}},$:()=>toastElement,window:{},setTimeout:()=>1,clearTimeout:()=>{}});
const app=fs.readFileSync('docs/app.js','utf8');vm.runInContext(app.slice(app.indexOf("let saveFailure="),app.indexOf('const client=')),context);
reject=true;context.data.clients[0].name='Cambio que no cabe';assert.equal(context.persist(),false);assert.equal(context.data.clients[0].name,'Cliente guardado');context.toast('Cliente guardado.');assert.match(toastElement.textContent,/No se pudo guardar/,'A failed save must never show a success toast');assert.equal(value,JSON.stringify(original));
reject=false;context.data.clients[0].name='Cambio confirmado';assert.equal(context.persist(),true);assert.equal(JSON.parse(value).clients[0].name,'Cambio confirmado');context.toast('Cliente guardado.');assert.equal(toastElement.textContent,'Cliente guardado.');
console.log('Storage checks passed: quota rollback, preserved data, truthful errors and recovery.');
