import {artifact} from './artifact.ts';
import {find} from './shared.ts';
import {requireValue as need} from '../../vendor/project-store.ts';
import * as engine from './engine.ts';
export {validateDomain,validateTransition} from './engine.ts';
export async function checkSources(_p:any,_s:any[],_r:any){}
export async function pureAction(_a:string,_i:any){return undefined;}
export async function writeProfessional(a:string,p:any,_s:any[],i:any,..._rest:any[]){
 if(a==='apply_variant'){engine.applyVariant(p,i.variant_id);return;}
 if(a==='record_rehearsal'){const set=find(p.sets,i.set_id);need(!engine.setView(p,set.id).stale,'段单已过期。');need(!p.rehearsals.some((x:any)=>x.id===i.record_id),'手记ID重复。');p.rehearsals.push({id:i.record_id,title:i.title,set_id:set.id,basis_sha256:set.basis_sha256,snapshot:engine.snapshot(p,set.id),outcomes:i.outcomes,declaration:i.declaration});return;}
throw Error('未知专业写动作。');}
export function summaries(p:any){return [{title:'完整阅读本',lines:[engine.reading(p)]},{title:'专业复核',lines:[JSON.stringify(engine.check(p),null,2)]},...Object.entries(p).filter(([k,v])=>Array.isArray(v)).map(([k,v])=>({title:k,lines:[JSON.stringify(v,null,2)]}))];}
export async function readProfessional(a:string,p:any,_s:any[],i:any,_r:any){
 if(a==='target_digest')return {target_sha256:engine.targetDigest(p,i.target_kind,i.target_id)};
 if(a==='check_standup')return engine.check(p);

 if(a==='callback_basis')return {basis_sha256:engine.callbackBasis(p,i.seed_bit_id,i.return_bit_id)};
 if(a==='set_basis')return {basis_sha256:engine.setBasis(p,i.items)};
 if(a==='set_view')return engine.setView(p,i.set_id);
 if(a==='compare_sets')return {from:engine.setView(p,i.from_id),to:engine.setView(p,i.to_id)};
 if(a==='rehearsal_view')return {rehearsal:find(p.rehearsals,i.rehearsal_id)};

 if(a==='export_reading')return artifact(engine.reading(p),'脱口秀工坊阅读本.txt','text/plain',i);
 if(a==='export_review'){const {reportHTML}=await import('./report.ts');return artifact(reportHTML({project:p}),'脱口秀工坊审核本.html','text/html',i);}
}
