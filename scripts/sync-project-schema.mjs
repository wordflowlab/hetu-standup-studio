import {readFile,writeFile} from 'node:fs/promises';
import {config} from '../src/domain/config.ts';
// 专业数据Schema是唯一字段Owner，完整保存及集合动作从它派生。
const file='contracts/plugin-manifest.json',before=await readFile(file,'utf8'),manifest=JSON.parse(before),project=manifest.contributions.data[0].schema;
const action=id=>{const value=manifest.contributions.actions.find(a=>a.id===id);if(!value)throw Error('缺少动作 '+id);return value;};
action('save_project').input_schema.properties.content=project;
for(const [item,field] of Object.entries(config.fields)){const schema=project.properties[field]?.items;if(!schema)throw Error('缺少专业集合 '+field);action('put_'+item).input_schema.properties[item]=schema;}
const after=JSON.stringify(manifest,null,2)+'\n';if(after!==before)await writeFile(file,after);
