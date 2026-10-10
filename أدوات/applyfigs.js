/* يكتب figs في ملفّات الوحدات ، ويعيد بناء حقل fig من فهرس المعلّم */
const fs=require('fs');
const A=require('./figassign.js');
const F=JSON.parse(fs.readFileSync('web/figs.json','utf8'));
const cap=x=>(x.k?(/^الجدول/.test(x.k)?x.k.replace(/[()]/g,'')+' · ':'الشكل ('+x.k+') · '):'')+'ص '+x.p+' · '+x.t;
let bad=[],nfig=0,nseg=0,nnone=0;
Object.keys(A).forEach(u=>{
 const p='content/unit_'+u+'.json';
 if(!fs.existsSync(p)){bad.push(u+' : لا ملفّ وحدة');return}
 const U=JSON.parse(fs.readFileSync(p,'utf8'));
 const items=(F[u]||{items:[]}).items;
 const find=f=>items.find(x=>x.f===(/^ن:/.test(f)?u+'-a/'+f.slice(2):u+'/'+f));
 U.segments.forEach(s=>{
  const list=A[u][s.i];
  if(list===undefined){bad.push(u+' م'+s.i+' : لم يُذكر في ملفّ الإسناد');return}
  if(list===0){delete s.fig;delete s.figs;nnone++;return}
  const got=list.map(f=>{const x=find(f);if(!x)bad.push(u+' م'+s.i+' : ملفّ غير موجود « '+f+' »');return x}).filter(Boolean);
  if(!got.length){bad.push(u+' م'+s.i+' : كلّ الملفّات مفقودة');return}
  s.figs=got.map(x=>x.f);
  s.fig=cap(got[0]);
  nfig+=got.length;nseg++;
 });
 fs.writeFileSync(p,JSON.stringify(U,null,1));
});
console.log('وحدات:',Object.keys(A).length,'| مقاطع بأشكال:',nseg,'| بلا شكل في الكتاب:',nnone,'| مجموع الأشكال:',nfig);
if(bad.length){console.log('\n⚠ ملاحظات ('+bad.length+'):');bad.forEach(b=>console.log('  ',b))}else console.log('\n✔ لا أخطاء');
