const {chromium}=require('/home/claude/.npm-global/lib/node_modules/playwright-core');
const U='s8u3',G='08',N=10;
(async()=>{
const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome'});
const p=await (await b.newContext({viewport:{width:430,height:2600},serviceWorkers:'block'})).newPage();
const errs=[];p.on('pageerror',e=>errs.push(String(e)));p.on('console',m=>{if(m.type()==='error'&&!/404/.test(m.text()))errs.push(m.text())});
await p.goto('http://localhost:8799/',{waitUntil:'networkidle'});await p.waitForTimeout(900);
await p.evaluate(g=>{setUser({code:'TV',grade:g,no:'1',name:'ط'});openStore();S.screenLogin=false;location.hash='#s8u3/lrn';route()},G);await p.waitForTimeout(600);
const go=async i=>{await p.evaluate(x=>{location.hash='#s8u3/lrn/seg/'+x;route()},i);await p.waitForTimeout(400)};
const click=t=>p.evaluate(x=>{const bs=[...document.querySelectorAll('.simbox button')];const b=bs.find(b=>b.textContent.trim()===x)||bs.find(b=>b.textContent.indexOf(x)>=0);if(!b)throw new Error('no button '+x);b.click()},t);
const verd=()=>p.evaluate(()=>[...document.querySelectorAll('.simbox .acv')].map(x=>x.querySelector('b').textContent).join(' | '));
const row=k=>p.evaluate(x=>{const r=[...document.querySelectorAll('.simbox .cyrow')].find(r=>r.querySelector('.cyk').textContent.indexOf(x)>=0);return r?r.querySelector('.cyv').textContent:'—'},k);
const put=async v=>{await p.evaluate(x=>{const i=document.querySelector('.simbox input[type=number]');i.value=x;i.dispatchEvent(new Event('input'))},String(v));await click('تحقّق')};
for(let i=1;i<=N;i++){await go(i);for(let k=0;k<50;k++)await p.evaluate(()=>{const bs=[...document.querySelectorAll('.simbox button')];if(bs.length)bs[Math.floor(Math.random()*bs.length)].click()});process.stdout.write('م'+i+(errs.length?' ✗':' ✓')+' ')}console.log();
await go(1);await click('على قدم واحدة');console.log('fmpress →',await row('الضغط'));
await go(2);await put(12500);console.log('fmcalc 12500 →',await verd());await click('مسألة أخرى');await put(0.001);console.log('  wrong →',await verd());
await go(4);console.log('fmliq 10m →',await row('الضغط الناتج'));await click('زئبق');console.log('  زئبق 1m →',await row('الضغط الناتج'));
await go(5);console.log('fmlift →',await row('القوّة على المكبس الكبير'));await click('مسائل');await put(3000);console.log('  3000 →',await verd());
await go(6);await click('يتقاربان');console.log('fmbern →',await verd());
await go(7);console.log('fmdens →',await row('الكثافة'));await click('مسائل');await put(0.5);console.log('  0.5 →',await verd());
await go(8);for(const t of ['كحول','العسل','ماء نقيّ','أسقط خشب','أسقط حديد'])await click(t);console.log('fmlayer →',await row('من الأسفل'));
await go(9);await p.evaluate(()=>{const r=document.querySelector('.simbox input[type=range]');r.value=100;r.dispatchEvent(new Event('input'))});console.log('fmarch 100% →',await row('قوّة الطفو'),await row('قراءة'));
await go(10);console.log('fmfloat 0.6 →',await row('سلوك'));
for(const w of [320,360,390,430]){await p.setViewportSize({width:w,height:2400});const bad=[];
 for(let i=1;i<=N;i++){await go(i);const r=await p.evaluate(()=>({ov:document.documentElement.scrollWidth>document.documentElement.clientWidth,sb:[...document.querySelectorAll('.simbox')].some(x=>x.scrollWidth>x.clientWidth+1)}));if(r.ov||r.sb)bad.push(i+(r.ov?'p':'')+(r.sb?'s':''))}
 console.log('عرض '+w+' → تجاوز:',bad.length?bad.join(','):'لا شيء')}
for(let k=0;k<6;k++){const r=await p.evaluate(u=>{const L=lrnOf(u);lrStartTest(S.unit,L);const ids=lp(S.unit).test.ids,its=ids.map(i=>L.items.find(x=>x.id===i));
 const o={},l={},s={};its.forEach(t=>{o[t.o]=(o[t.o]||0)+1;l[t.lvl]=(l[t.lvl]||0)+1;s[t.s]=(s[t.s]||0)+1});const spec=L.selftest.byOutcome;
 return {n:ids.length,bloom:[l['ت']||0,l['ط']||0,l['ح']||0].join('/'),maxSeg:Math.max(...Object.values(s)),dup:ids.length-new Set(ids).size,spec:Object.keys(spec).every(k=>o[k]===spec[k])}},U);
 console.log('سحب '+(k+1)+':',JSON.stringify(r))}
console.log('ERRORS',errs.length,errs.slice(0,5));await b.close();})();
