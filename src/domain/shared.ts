import {canonical,requireValue as need} from '../../vendor/project-store.ts';
import {hash} from './artifact.ts';
export const digest=(value:any)=>hash(canonical(value));
export const find=(rows:any[],id:string,label='记录')=>{const row=rows.find(r=>r.id===id);need(row,label+'不存在。');return row;};
export const ordered=(rows:any[])=>[...rows].sort((a,b)=>a.order-b.order);
export const unique=(values:any[],message:string)=>need(new Set(values).size===values.length,message);
export function fixedHistory(next:any,prev:any,fields:string[]){if(!prev)return;for(const field of fields)for(const old of prev[field])need(next[field].some((x:any)=>x.id===old.id&&canonical(x)===canonical(old)),field+'原始记录不可移除或改写，请追加新记录。');}
export function checkNotes(p:any,resolve:(kind:string,id:string)=>any){for(const n of p.notes){resolve(n.target_kind,n.target_id);need(n.status!=='resolved'||n.resolution.trim(),'处理意见须保留说明。');}}
