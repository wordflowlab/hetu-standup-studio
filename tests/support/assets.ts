import {managed} from './creative.ts';
import {sha} from './scenario.ts';
export async function importAsset(c:any,bytes:Buffer,filename:string,key:string){
 const inline={filename,base64:bytes.toString('base64'),sha256:sha(bytes)};
 const scan=await c.ok('hetu_managed_assets_inspect',{management_ref:c.management,work_ref:c.work,inline_source:inline});
 const result=await managed(c,'assets.import',{work_ref:c.work,inline_source:inline,expected_file:{sha256:scan.sha256,size_bytes:scan.size_bytes},title:filename,source:{source_type:'author_supplied',creator_statement:'本Codex隔离测试原创合成节拍，仅验证音频链路，不是真实演唱或商业音乐'},rights_status:'unknown',redistribution_allowed:false,rights_statement:'',operation_key:key},key);
 return {kind:'asset',work_ref:c.work,asset_id:result.asset.asset_id,revision:result.asset.revision,sha256:result.sha256};
}
