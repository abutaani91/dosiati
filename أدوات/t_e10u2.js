const {chromium}=require('/home/claude/.npm-global/lib/node_modules/playwright-core');
const U='e10u2',G='10',N=15;
(async()=>{
const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome'});
const p=await (await b.newContext({viewport:{width:430,height:2600},serviceWorkers:'block'})).newPage();
const errs=[];p.on('pageerror',e=>errs.push(String(e)));p.on('console',m=>{if(m.type()==='error')errs.push(m.text())});
await p.goto('http://localhost:8799/',{waitUntil:'networkidle'});await p.waitForTimeout(900);
console.log('وحدات:',await p.evaluate(()=>Object.keys(LRN).length),'| SIMS:',await p.evaluate(()=>Object.keys(window.SIMS).length));
await p.evaluate(g=>{setUser({code:'TV',grade:g,no:'1',name:'ط'});openStore();S.screenLogin=false;location.hash='#e10u2/lrn';route()},G);await p.waitForTimeout(600);
const go=async i=>{await p.evaluate(x=>{location.hash='#e10u2/lrn/seg/'+x;route()},i);await p.waitForTimeout(450)};
const click=t=>p.evaluate(x=>{const bs=[...document.querySelectorAll('.simbox button')];const b=bs.find(b=>b.textContent.trim()===x)||bs.find(b=>b.textContent.indexOf(x)>=0);if(!b)throw new Error('no button '+x);b.click()},t);
const verd=()=>p.evaluate(()=>[...document.querySelectorAll('.simbox .acv')].map(x=>x.querySelector('b').textContent).join(' | '));
const row=k=>p.evaluate(x=>{const r=[...document.querySelectorAll('.simbox .cyrow')].find(r=>r.querySelector('.cyk').textContent.indexOf(x)>=0);return r?r.querySelector('.cyv').textContent:'—'},k);
const has=async()=>p.evaluate(()=>document.querySelectorAll('.simbox').length);
for(let i=1;i<=N;i++){await go(i);const n=await has();if(!n)console.log('م'+i,'بلا محاكاة!')}
await go(1);await click('القمر');console.log('njdef القمر →',await verd());await click('الشمس');console.log('  الشمس →',await verd());
await go(2);await click('ادمج');console.log('njfuse بارد →',await verd());await click('ضع في قلب النجم');await click('ادمج');console.log('  قلب →',await verd());
await go(3);await p.evaluate(()=>{const r=document.querySelector('.simbox input[type=range]');r.value=20000;r.dispatchEvent(new Event('input'))});console.log('njcolor 20000 →',await p.evaluate(()=>document.querySelector('.simbox .njbig').textContent),await row('موجة'));
await p.evaluate(()=>{const r=document.querySelector('.simbox input[type=range]');r.value=3200;r.dispatchEvent(new Event('input'))});console.log('  3200 →',await p.evaluate(()=>document.querySelector('.simbox .njbig').textContent),await row('موجة'));
await click('رتّب النجوم');for(let k=0;k<3;k++)await p.evaluate(()=>document.querySelectorAll('.simbox .njstarbtn:not(.njon)')[0].click());console.log('  ترتيب →',await verd());
await go(4);await click('الشعرى');console.log('njlum →',await verd());
await go(5);await click('يد الجوزاء');console.log('njhr →',await row('لماذا'));
await go(6);await p.evaluate(()=>{const T=['الأنظمة النجمية','النجوم الثنائية','النجوم المتعدّدة','العناقيد النجمية','الكوكبات','دائرة البروج','كوكبات البروج'];const D={};});
for(const t of ['النجوم الثنائية','الكوكبات']){await p.evaluate(x=>[...document.querySelectorAll('.simbox .njb')].find(b=>b.textContent===x).click(),t);await p.evaluate(x=>{const m={'النجوم الثنائية':'نجمان اثنان فقط','الكوكبات':'لا ترتبط نجومها'};[...document.querySelectorAll('.simbox .njcard')].find(c=>c.textContent.indexOf(m[x])>=0).click()},t)}console.log('njterm أُنجز',await p.evaluate(()=>document.querySelectorAll('.simbox .njcard.njok').length));
await go(7);let ok7=0;for(let k=0;k<8;k++){const d=await p.evaluate(()=>document.querySelector('.simbox .njq').textContent);const bound=!/لا ترتبط|لا رابط|وحيد/.test(d);await click(bound?'نعم ، مرتبطة':'لا ترتبط');
 const t=/نجمان مرتبطان/.test(d)?'نجوم ثنائية':/أربعة|ستّة/.test(d)?'نجوم متعدّدة':/مبعثرة/.test(d)?'مفتوح':/متراصّة/.test(d)?'مغلق':/وحيد/.test(d)?'نجم منفرد':'كوكبة';await click(t);if((await verd()).indexOf('صحيح')>=0)ok7++;await click('التالي')}console.log('njsys',ok7,'/8 ·',await verd());
await go(8);for(let k=0;k<7;k++)await p.evaluate(k=>{const cs=[...document.querySelectorAll('.simbox svg circle')].filter(c=>c.getAttribute('r')==='7');cs[k].dispatchEvent(new MouseEvent('click',{bubbles:true}))},k);await click('أين النجم القطبيّ');console.log('njdraw →',await verd());
await click('رتّب كوكبات البروج');for(const z of ['الحمل','الثور','الجوزاء','السرطان','الأسد','العذراء','الميزان','العقرب','القوس','الجدي','الدلو','الحوت'])await p.evaluate(x=>[...document.querySelectorAll('.simbox .njb')].find(b=>b.textContent===x).click(),z);console.log('  بروج →',await verd());
await go(9);await click('الموضع 3');console.log('njuse →',await row('تظهر'));
await go(10);for(let k=0;k<9;k++){const t=await p.evaluate(()=>document.querySelector('.simbox .njq').textContent);await click(/برج|محظوظ|مصيبة|بطبعه/.test(t)?'التنجيم':'علم الفلك');await click('التالي')}console.log('njsci →',await verd());
await go(11);for(let k=0;k<6;k++)await click('التالي');console.log('njlife →',await verd());await click('الكتلة ومدّة الحياة');await p.evaluate(()=>[...document.querySelectorAll('.simbox svg circle')][0].dispatchEvent(new MouseEvent('click',{bubbles:true})));console.log('  0.75 →',await row('مدّة'));
await go(12);console.log('njbal →',await row('المقارنة'));await click('المرحلة التالية');console.log('  →',await row('المقارنة'));
await go(13);await click('احسب');await p.evaluate(()=>{const i=document.querySelector('.simbox .njinp');i.value='10.1';i.dispatchEvent(new Event('input'))});await click('تحقّق');console.log('njsun 10.1 →',await verd());await click('مسألة أخرى');await p.evaluate(()=>{const i=document.querySelector('.simbox .njinp');i.value='0';i.dispatchEvent(new Event('input'))});await click('تحقّق');console.log('  0 →',await verd());
await go(14);await p.evaluate(()=>{const r=document.querySelector('.simbox input[type=range]');r.value=4.5;r.dispatchEvent(new Event('input'))});console.log('njdead 4.5 →',await row('النتيجة'));await click('نجم متوسّط الكتلة');console.log('  متوسّط →',await row('النتيجة'));
await go(15);for(const t of ['اندماج في قلب نجم','النجم يحوي','موت النجم','سديم جديد','الشمس والأرض'])await p.evaluate(x=>[...document.querySelectorAll('.simbox .njcard')].find(c=>c.textContent.indexOf(x)===0).click(),t);console.log('njorig →',await verd());
for(const w of [320,360,390,430]){await p.setViewportSize({width:w,height:2400});const bad=[];
 for(let i=1;i<=N;i++){await go(i);const r=await p.evaluate(()=>({ov:document.documentElement.scrollWidth>document.documentElement.clientWidth,sb:[...document.querySelectorAll('.simbox')].some(x=>x.scrollWidth>x.clientWidth+1)}));if(r.ov||r.sb)bad.push(i+(r.ov?'p':'')+(r.sb?'s':''))}
 console.log('عرض '+w+' → تجاوز:',bad.length?bad.join(','):'لا شيء')}
await p.setViewportSize({width:430,height:2600});
for(let k=0;k<6;k++){const r=await p.evaluate(u=>{const L=lrnOf(u);lrStartTest(S.unit,L);const ids=lp(S.unit).test.ids,its=ids.map(i=>L.items.find(x=>x.id===i));
 const o={},l={},s={};its.forEach(t=>{o[t.o]=(o[t.o]||0)+1;l[t.lvl]=(l[t.lvl]||0)+1;s[t.s]=(s[t.s]||0)+1});const spec=L.selftest.byOutcome;
 return {n:ids.length,bloom:[l['ت']||0,l['ط']||0,l['ح']||0].join('/'),maxSeg:Math.max(...Object.values(s)),dup:ids.length-new Set(ids).size,spec:Object.keys(spec).every(k=>o[k]===spec[k])}},U);
 console.log('سحب '+(k+1)+':',JSON.stringify(r))}
console.log('ERRORS',errs.length,errs.slice(0,5));await b.close();})();
