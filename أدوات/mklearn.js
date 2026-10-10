/* تركيب learn.json من ملفات الوحدات بالترتيب المعتمد */
const fs=require('fs');
const ORDER=['s8u1','s8u2','p10u1','p10u2','c10u1','c10u2','b10u1','p9u1','c9u1','b9u1','e9u1','e10u1'];
const out={};
ORDER.forEach(id=>{
  const f='content/unit_'+id+'.json';
  if(!fs.existsSync(f))return;
  out[id]=JSON.parse(fs.readFileSync(f,'utf8'));
});
fs.writeFileSync('web/learn.json',JSON.stringify(out));
const ids=Object.keys(out);
console.log('الوحدات:',ids.join(' · '));
ids.forEach(k=>console.log('  '+k,'مقاطع',out[k].segments.length,'· فقرات',out[k].items.length,'· اختبار',out[k].selftest.n));
console.log('حجم learn.json:',Math.round(fs.statSync('web/learn.json').size/1024)+' KB');
