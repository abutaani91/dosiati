/* بناء web/figs.json من فهرس المعلّم — مع اختزال أسماء الدروس */
const fs=require('fs');
const raw=fs.readFileSync('/mnt/user-data/uploads/أشكال/فهرس.csv','utf8').replace(/^﻿/,'');
function parse(t){const R=[];let f='',r=[],q=false;
 for(let i=0;i<t.length;i++){const c=t[i];
  if(q){ if(c==='"'){ if(t[i+1]==='"'){f+='"';i++} else q=false } else f+=c }
  else if(c==='"')q=true;
  else if(c===','){r.push(f);f=''}
  else if(c==='\n'){r.push(f);f='';if(r.some(x=>x!==''))R.push(r);r=[]}
  else if(c!=='\r')f+=c}
 if(f!==''||r.length){r.push(f);if(r.some(x=>x!==''))R.push(r)}
 return R}
const T=parse(raw),H=T[0],col=n=>H.indexOf(n);
const Cu=col('كود الوحدة'),Cf=col('الملف'),Cp=col('رقم الصفحة'),Ck=col('رقم الشكل'),
      Cn=col('الاسم'),Cd=col('الوصف'),Cw=col('الوحدة'),Cl=col('الدرس');
const out={};
for(let i=1;i<T.length;i++){const r=T[i];const code=r[Cu];if(!code)continue;
 const base=code.replace(/-a$/,''),act=/-a$/.test(code);
 const U=out[base]=out[base]||{t:r[Cw]||'',les:[],items:[]};
 let li=U.les.indexOf(r[Cl]||''); if(li<0){U.les.push(r[Cl]||'');li=U.les.length-1}
 U.items.push({f:(act?base+'-a/':base+'/')+r[Cf],p:+r[Cp]||0,
  k:(r[Ck]||'').replace(/^الشكل\s*\((.*)\)$/,'$1'),t:r[Cn]||'',d:r[Cd]||'',l:li,...(act?{a:1}:{})});
}
Object.keys(out).forEach(u=>out[u].items.sort((a,b)=>a.p-b.p||a.f.localeCompare(b.f)));
fs.writeFileSync('web/figs.json',JSON.stringify(out));
const n=Object.values(out).reduce((a,b)=>a+b.items.length,0);
console.log('وحدات:',Object.keys(out).length,'| أشكال:',n,'| الحجم:',(fs.statSync('web/figs.json').size/1024).toFixed(0),'KB');
Object.keys(out).sort().forEach(u=>console.log('  ',u,out[u].items.length,'شكلًا ،',out[u].les.length,'درسًا —',out[u].t));
