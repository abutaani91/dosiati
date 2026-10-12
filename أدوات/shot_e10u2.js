const {chromium}=require('/home/claude/.npm-global/lib/node_modules/playwright-core');
const U=process.argv[2]||'e10u2',G=process.argv[3]||'10',N=+(process.argv[4]||15),only=process.argv[5]?process.argv[5].split(',').map(Number):null;
(async()=>{
const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome'});
const p=await (await b.newContext({viewport:{width:390,height:2400},deviceScaleFactor:1,serviceWorkers:'block'})).newPage();
await p.goto('http://localhost:8799/',{waitUntil:'networkidle'});await p.waitForTimeout(800);
await p.evaluate(g=>{setUser({code:'TV',grade:g,no:'1',name:'ط'});openStore();S.screenLogin=false},G);
for(let i=1;i<=N;i++){ if(only&&!only.includes(i))continue;
 await p.evaluate(a=>{location.hash='#'+a[0]+'/lrn/seg/'+a[1];route()},[U,i]);await p.waitForTimeout(500);
 const el=await p.$('.simbox'); if(el) await el.screenshot({path:'shots/'+U+'_'+i+'.png'});}
await b.close();})();
