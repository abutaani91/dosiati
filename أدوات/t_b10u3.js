const {chromium}=require('/home/claude/.npm-global/lib/node_modules/playwright-core');
const U='b10u3',G='10',N=18;
(async()=>{
const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome'});
const p=await (await b.newContext({viewport:{width:430,height:2600},serviceWorkers:'block'})).newPage();
const errs=[];p.on('pageerror',e=>errs.push(String(e)));p.on('console',m=>{if(m.type()==='error')errs.push(m.text())});
await p.goto('http://localhost:8799/',{waitUntil:'networkidle'});await p.waitForTimeout(900);
console.log('وحدات:',await p.evaluate(()=>Object.keys(LRN).length),'| SIMS:',await p.evaluate(()=>Object.keys(window.SIMS).length));
await p.evaluate(g=>{setUser({code:'TV',grade:g,no:'1',name:'ط'});openStore();S.screenLogin=false;location.hash='#b10u3/lrn';route()},G);await p.waitForTimeout(600);
const go=async i=>{await p.evaluate(x=>{location.hash='#b10u3/lrn/seg/'+x;route()},i);await p.waitForTimeout(400)};
const click=t=>p.evaluate(x=>{const bs=[...document.querySelectorAll('.simbox button')];const b=bs.find(b=>b.textContent.trim()===x)||bs.find(b=>b.textContent.indexOf(x)>=0);if(!b)throw new Error('no button '+x);b.click()},t);
const verd=()=>p.evaluate(()=>[...document.querySelectorAll('.simbox .acv')].map(x=>x.querySelector('b').textContent).join(' | '));
/* قرد : 60 نقرة عشوائية في كلّ محاكاة */
for(let i=1;i<=N;i++){await go(i);const ok=await p.evaluate(()=>!!document.querySelector('.simbox'));if(!ok){console.log('م'+i,'بلا محاكاة');continue}
 for(let k=0;k<60;k++)await p.evaluate(()=>{const bs=[...document.querySelectorAll('.simbox button')];if(bs.length)bs[Math.floor(Math.random()*bs.length)].click()});
 const e=errs.length;process.stdout.write('م'+i+(e?' ✗':' ✓')+'  ')}
console.log();
await go(4);let ok4=0;for(let k=0;k<8;k++){const r=await p.evaluate(()=>{const n=document.querySelector('.simbox .kzname');const h=n.innerHTML;const t=n.textContent;const w=t.replace(/^[^A-Za-z]*/,'').trim().split(/\s+/);let e;if(!/<i>|<u>/.test(h))e=3;else if(w[1]&&w[1][0]===w[1][0].toUpperCase())e=1;else if(w[0][0]===w[0][0].toLowerCase())e=2;else e=0;document.querySelectorAll('.simbox .kzseg .kzb')[e].click();return e});if((await verd()).indexOf('صحيح')===0)ok4++;await click('اسم آخر')}console.log('kzname',ok4,'/8');
await go(8);await click('قارن الأحجام');await p.evaluate(()=>{const i=document.querySelector('.simbox .kzinp');i.value='40';i.dispatchEvent(new Event('input'))});await click('تحقّق');console.log('kzshape 6µm/150nm=40 →',await verd());
await go(9);await click('تضاعف العدد');for(let k=0;k<3;k++)await click('انشطار');console.log('kzfiss 3 →',await p.evaluate(()=>document.querySelectorAll('.simbox .kzdots i').length));
await go(12);console.log('kzres →',await verd());
for(const w of [320,360,390,430]){await p.setViewportSize({width:w,height:2400});const bad=[];
 for(let i=1;i<=N;i++){await go(i);const r=await p.evaluate(()=>({ov:document.documentElement.scrollWidth>document.documentElement.clientWidth,sb:[...document.querySelectorAll('.simbox')].some(x=>x.scrollWidth>x.clientWidth+1)}));if(r.ov||r.sb)bad.push(i+(r.ov?'p':'')+(r.sb?'s':''))}
 console.log('عرض '+w+' → تجاوز:',bad.length?bad.join(','):'لا شيء')}
await p.setViewportSize({width:430,height:2600});
for(let k=0;k<6;k++){const r=await p.evaluate(u=>{const L=lrnOf(u);lrStartTest(S.unit,L);const ids=lp(S.unit).test.ids,its=ids.map(i=>L.items.find(x=>x.id===i));
 const o={},l={},s={};its.forEach(t=>{o[t.o]=(o[t.o]||0)+1;l[t.lvl]=(l[t.lvl]||0)+1;s[t.s]=(s[t.s]||0)+1});const spec=L.selftest.byOutcome;
 return {n:ids.length,bloom:[l['ت']||0,l['ط']||0,l['ح']||0].join('/'),maxSeg:Math.max(...Object.values(s)),dup:ids.length-new Set(ids).size,spec:Object.keys(spec).every(k=>o[k]===spec[k])}},U);
 console.log('سحب '+(k+1)+':',JSON.stringify(r))}
console.log('ERRORS',errs.length,errs.slice(0,5));await b.close();})();
