const {chromium}=require('/home/claude/.npm-global/lib/node_modules/playwright-core');
const U='p9u3',G='09',N=12;
(async()=>{
const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome'});
const p=await (await b.newContext({viewport:{width:430,height:2600},serviceWorkers:'block'})).newPage();
const errs=[];p.on('pageerror',e=>errs.push(String(e)));p.on('console',m=>{if(m.type()==='error'&&!/404/.test(m.text()))errs.push(m.text())});
await p.goto('http://localhost:8799/',{waitUntil:'networkidle'});await p.waitForTimeout(900);
await p.evaluate(g=>{setUser({code:'TV',grade:g,no:'1',name:'ط'});openStore();S.screenLogin=false;location.hash='#p9u3/lrn';route()},G);await p.waitForTimeout(600);
const go=async i=>{await p.evaluate(x=>{location.hash='#p9u3/lrn/seg/'+x;route()},i);await p.waitForTimeout(400)};
const click=t=>p.evaluate(x=>{const bs=[...document.querySelectorAll('.simbox button')];const b=bs.find(b=>b.textContent.trim()===x)||bs.find(b=>b.textContent.indexOf(x)>=0);if(!b)throw new Error('no button '+x);b.click()},t);
const verd=()=>p.evaluate(()=>[...document.querySelectorAll('.simbox .acv')].map(x=>x.querySelector('b').textContent).join(' | '));
const row=k=>p.evaluate(x=>{const r=[...document.querySelectorAll('.simbox .cyrow')].find(r=>r.querySelector('.cyk').textContent.indexOf(x)>=0);return r?r.querySelector('.cyv').textContent:'—'},k);
const put=async v=>{await p.evaluate(x=>{const i=document.querySelector('.simbox input[type=number]');i.value=x;i.dispatchEvent(new Event('input'))},String(v));await click('تحقّق')};
for(let i=1;i<=N;i++){await go(i);for(let k=0;k<50;k++)await p.evaluate(()=>{const bs=[...document.querySelectorAll('.simbox button')];if(bs.length)bs[Math.floor(Math.random()*bs.length)].click()});process.stdout.write('م'+i+(errs.length?' ✗':' ✓')+' ')}console.log();
await go(1);console.log('wkwork 60×5 →',await row('الشغل'));await click('قوّة رأسية');console.log('  رأسية →',await row('الشغل'));
await go(2);const q2=await p.evaluate(()=>document.querySelector('.simbox .wkq').textContent);console.log('wkcalc q →',q2.slice(0,60));await put(0.000123);console.log('  wrong →',await verd());
await go(3);await click('القوّة عكس الحركة');console.log('wkcases →',await row('الشغل'));
await go(4);console.log('wkpower →',await row('قدرة ( أ )'),await row('قدرة ( ب )'),await verd());
await go(5);await click('ثبّت مرجعًا');await click('ضاعف السرعة');console.log('wkke ×2v →',await row('الطاقة صارت'));
await go(6);console.log('wkwke →',await row('التغيّر'),await row('السرعة النهائية'));await click('مسافة التوقّف');console.log('  stop →',await row('مسافة التوقّف'));
await go(8);console.log('wkramp →',await row('الفائدة الآلية'),await row('القوّة اللازمة'));await click('9 m و 6 m');console.log('  9/6 →',await row('القوّة اللازمة'));
await go(9);console.log('wklever →',await verd(),await row('القوّة اللازمة'));await p.evaluate(()=>{const r=[...document.querySelectorAll('.simbox input[type=range]')][3];r.value=250;r.dispatchEvent(new Event('input'))});console.log('  F=250 →',await verd());
await go(10);await click('المجموعة الثالثة');console.log('wkclass →',await row('أمثلة'));
await go(11);await click('بكرة متحرّكة');console.log('wkpulley →',await row('قوّة الشدّ'));await click('الدولاب والجذع');console.log('  wheel →',await row('القوّة اللازمة'));
await go(12);console.log('wkeff →',await row('الكفاءة'),await verd());
for(const w of [320,360,390,430]){await p.setViewportSize({width:w,height:2400});const bad=[];
 for(let i=1;i<=N;i++){await go(i);const r=await p.evaluate(()=>({ov:document.documentElement.scrollWidth>document.documentElement.clientWidth,sb:[...document.querySelectorAll('.simbox')].some(x=>x.scrollWidth>x.clientWidth+1)}));if(r.ov||r.sb)bad.push(i+(r.ov?'p':'')+(r.sb?'s':''))}
 console.log('عرض '+w+' → تجاوز:',bad.length?bad.join(','):'لا شيء')}
for(let k=0;k<6;k++){const r=await p.evaluate(u=>{const L=lrnOf(u);lrStartTest(S.unit,L);const ids=lp(S.unit).test.ids,its=ids.map(i=>L.items.find(x=>x.id===i));
 const o={},l={},s={};its.forEach(t=>{o[t.o]=(o[t.o]||0)+1;l[t.lvl]=(l[t.lvl]||0)+1;s[t.s]=(s[t.s]||0)+1});const spec=L.selftest.byOutcome;
 return {n:ids.length,bloom:[l['ت']||0,l['ط']||0,l['ح']||0].join('/'),maxSeg:Math.max(...Object.values(s)),dup:ids.length-new Set(ids).size,spec:Object.keys(spec).every(k=>o[k]===spec[k])}},U);
 console.log('سحب '+(k+1)+':',JSON.stringify(r))}
console.log('ERRORS',errs.length,errs.slice(0,5));await b.close();})();
