import {managed} from './creative.ts';
/** 独立视频的文字制作参考使用宿主有归属资料；不把小说文稿身份伪装为视频正文。 */
export async function fixedScript(c:any,content:string,key:string){
 const preview=await c.ok('hetu_preview_creative_task',{management_ref:c.management,work_ref:c.work,scope_ref:c.management.scope_ref,task_kind:'resource_organize',brief:'保存本轮隔离创作的固定专业创作参考，不采纳或定稿。',input_refs:[],client_adapter:'codex',language_tag:'zh-CN',resource_scope:{resource_refs:[],editable_resource_ids:[],allow_create:true}});
 const task=await managed(c,'creative_tasks.prepare',{...preview.prepare_input,operation_key:key+'-task'},key+'-task'),opened=await c.ok('hetu_open_collaboration_task',{task_locator:task.task_locator});
 const saved=await c.ok('hetu_create_resource',{task_ref:opened.task_ref,title:'雨港人物与来信参考',category:'research',body:content,tags:['人物','隔离创作参考'],project_id:null,entity_refs:[],source_notes:'本轮原创虚构人物材料，仅供专业创作验收，不是真实采访或正式正文。',operation_key:key+'-resource'});
 const read=await c.ok('hetu_read_resource',{task_ref:opened.task_ref,resource_id:saved.resource.resource_id,revision:saved.resource.revision});
 return {content:read.resource.body,source_ref:{kind:'resource',work_ref:c.work,resource_id:saved.resource.resource_id,revision:saved.resource.revision,sha256:saved.sha256}};
}
