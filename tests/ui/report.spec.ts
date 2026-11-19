import {test,expect} from '@playwright/test';
import {build} from 'esbuild';

async function mount(page:any) {
  const built=await build({stdin:{loader:'tsx',resolveDir:process.cwd(),contents:`
    import React,{useState} from 'react';
    import {createRoot} from 'react-dom/client';
    import {useProfessionalReport} from './src/view/professional-state.ts';
    let count=0,fail=false,slow=false,release;
    function Harness(){
      const [p,setP]=useState({revision:1}),[tab,setTab]=useState(0),[goal,setGoal]=useState('');
      const invoke=async(action,ref)=>{count++;document.documentElement.dataset.calls=String(count);if(fail)throw Error('暂时无法读取');if(slow){slow=false;return await new Promise(resolve=>release=()=>resolve({revision:ref.revision}));}return {revision:ref.revision};};
      const {report,error}=useProfessionalReport({p,tab,selection:()=>({object_id:'fixed-project',revision:p.revision}),invoke},'check');
      return <><output aria-label="报告修订">{report?.revision??'待读取'}</output>{error&&<p role="alert">{error}</p>}
        <button onClick={()=>setTab(tab+1)}>切页</button><button onClick={()=>setGoal(goal+'新目标')}>修改目标</button>
        <button onClick={()=>setP({...p})}>明确刷新</button><button onClick={()=>setP({revision:p.revision+1})}>新修订</button>
        <button onClick={()=>{fail=true;setP({...p});}}>模拟读取失败</button><button onClick={()=>{fail=false;setP({...p});}}>恢复读取</button>
        <button onClick={()=>{slow=true;setP({...p});}}>延迟旧请求</button><button onClick={()=>release?.()}>交回旧结果</button></>;
    }
    createRoot(document.getElementById('root')).render(<Harness/>);
  `},bundle:true,write:false,format:'iife',platform:'browser',jsx:'automatic'});
  await page.setContent('<div id="root"></div>');
  await page.addScriptTag({content:built.outputFiles[0].text});
  await expect(page.getByLabel('报告修订')).toHaveText('1');
}

test('固定修订跨页复用，明确刷新能重试读取错误',async({page})=>{
  await mount(page);
  for(let n=0;n<5;n++)await page.getByRole('button',{name:'切页',exact:true}).click();
  await page.getByRole('button',{name:'修改目标',exact:true}).click();
  expect(await page.locator('html').getAttribute('data-calls')).toBe('1');
  await page.getByRole('button',{name:'明确刷新',exact:true}).click();
  await expect(page.locator('html')).toHaveAttribute('data-calls','2');
  await page.getByRole('button',{name:'模拟读取失败',exact:true}).click();
  await expect(page.getByRole('alert')).toContainText('暂时无法读取');
  await page.getByRole('button',{name:'恢复读取',exact:true}).click();
  await expect(page.getByRole('alert')).toHaveCount(0);
  await expect(page.locator('html')).toHaveAttribute('data-calls','4');
});

test('较晚返回的旧请求不能覆盖新修订报告',async({page})=>{
  await mount(page);
  await page.getByRole('button',{name:'延迟旧请求',exact:true}).click();
  await expect(page.locator('html')).toHaveAttribute('data-calls','2');
  await page.getByRole('button',{name:'新修订',exact:true}).click();
  await expect(page.getByLabel('报告修订')).toHaveText('2');
  await page.getByRole('button',{name:'交回旧结果',exact:true}).click();
  await expect(page.getByLabel('报告修订')).toHaveText('2');
  await expect(page.locator('html')).toHaveAttribute('data-calls','3');
});
