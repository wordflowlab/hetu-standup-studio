import {useState,useEffect} from 'react';
/** 同一固定内容跨页复用报告；明确刷新或新修订才重读，不覆盖用户操作反馈。 */
export function useProfessionalReport({selection,invoke,p}:any,action:string) {
  const [state,setState]=useState<any>(),[failure,setFailure]=useState<any>();
  const ref=selection(),key=ref.object_id+':'+ref.revision;
  useEffect(()=>{
    let active=true;
    void invoke(action,ref).then((value:any)=>{
      if(active){setState({key,value});setFailure(undefined);}
    },(error:unknown)=>{
      if(active)setFailure({key,message:error instanceof Error?error.message:String(error)});
    });
    return()=>{active=false;};
  },[key,action,p]);
  return {report:state?.key===key?state.value:undefined,error:failure?.key===key?failure.message:undefined};
}
