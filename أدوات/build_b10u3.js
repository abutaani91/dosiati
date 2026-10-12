const fs=require('fs');
const A=JSON.parse(fs.readFileSync('b10u3_seg_a.json','utf8'));
const B=JSON.parse(fs.readFileSync('b10u3_seg_b.json','utf8'));
const IA=JSON.parse(fs.readFileSync('b10u3_items_a.json','utf8'));
const IB=JSON.parse(fs.readFileSync('b10u3_items_b.json','utf8'));
const IC=JSON.parse(fs.readFileSync('b10u3_items_c.json','utf8'));
const ID=JSON.parse(fs.readFileSync('b10u3_items_d.json','utf8'));
const U=Object.assign({},A);
U.segments=A.segments.concat(B.segments);
U.items=IA.items.concat(IB.items).concat(IC.items).concat(ID.items);
U.selftest={
 n:30,
 bloom:{"ت":9,"ط":12,"ح":9},
 byOutcome:{"1":2,"2":2,"3":2,"4":2,"5":2,"6":2,"7":2,"8":2,"9":2,"10":2,"11":3,"12":2,"13":3,"14":2},
 basis:"الوحدة أربعة دروس متفاوتة في الصفحات ( ستّ وإحدى عشرة وتسع وعشر ) ومتقاربة في الحصص ( ثلاث وثلاث واثنتان واثنتان ) ، ونتاجاتها أربعة عشر ؛ فقاعدة الحدّ الأدنى ( فقرتان لكلّ نتاج حتى تحتمل نسبته حكمًا ) تفرض 28 فقرة على الأقلّ. ولو وقفنا عندها لنال الدرسان الأخيران 4 فقرات لكلّ منهما ( 14 % ) مع أنّ وزنهما بالحصص 20 % ؛ فرُفع العدد إلى 30 ، وذهبت الفقرتان إلى النتاج الحادي عشر ( تصنيف الطلائعيات ، وله مقطعان ) والثالث عشر ( مجموعات الفطريات ، وله مقطعان ) ، فصار التوزيع على الدروس 10 و10 و5 و5 قريبًا من الحصص ( 30 % و 30 % و 20 % و 20 % ). وبلوم 30 \\/ 40 \\/ 30 لأنّ الوحدة تجمع حفظ مستويات ومجموعات وأمثلة بتطبيق ( كتابة الاسم العلميّ ، تصنيف كائن معطى ، تحويل الوحدات ) وتحليل ( قراءة البيانات دليلًا ، تمييز طرائق الانتقال الجينيّ ، علاقات الكائنات ).",
 rules:[
  "لا تُعاد فقرة ظهرت للطالب نفسه خلال الأيام السبعة الماضية ما دام في البنك بديل.",
  "لا تزيد فقرات المقطع الواحد على ثلاث في الاختبار الواحد.",
  "يُخلط ترتيب البدائل وترتيب الفقرات في كلّ عرض.",
  "الجواب لا يُعرض قبل انتهاء الاختبار كلّه.",
  "زمن مقترح : أربعون دقيقة ، وهو إرشادي لا يُقفل الاختبار.",
  "الأسماء العلمية تُعطى داخل الفقرة حين يكون المطلوب تطبيق القاعدة ، أمّا المستويات السبعة وأسماء المجموعات وأمثلتها فمطلوبة كما وردت في الكتاب."
 ],
 decision:[
  {min:85,label:"إتقان الوحدة",act:"انتقل إلى الوحدة التالية . وتعود فقرتان من هذه الوحدة بعد ثلاثة أسابيع للتثبيت."},
  {min:70,label:"إتقان جزئي",act:"راجع النتاجات التي أخطأتَ فيها فقط ، ثمّ اختبار مصغّر من ثماني فقرات عليها وحدها."},
  {min:50,label:"يحتاج إعادة",act:"أعد مقاطع النتاجات التي نسبتها دون 60% ، ثمّ أعد الاختبار كاملًا."},
  {min:0,label:"إعادة المسار",act:"أعد مسار التعلّم الذاتي من أوّل مقطع في الدروس المتعثّرة ، ويُرسَل إشعار إلى المعلّم."}
 ],
 outcomeRule:"أيّ نتاج نسبة الصحيح فيه دون 60% يُعاد مقطعه مهما كانت النتيجة الكلّية ، لأنّ المجموع الكلّي يُخفي ثغرة النتاج الواحد."
};
fs.writeFileSync('unit_b10u3.json',JSON.stringify(U,null,1));

/* ---------- التحقّق ---------- */
const E=[],W=[];
const segIds=U.segments.map(s=>s.i);
if(U.segments.length!==18)E.push('عدد المقاطع '+U.segments.length);
U.segments.forEach(s=>{
 ['t','teach','warn','ex','alt','before','after','fig','o','les','min'].forEach(k=>{if(s[k]===undefined)E.push('المقطع '+s.i+' ينقصه '+k)});
 if(s.ex&&(!s.ex.q||!s.ex.a))E.push('المقطع '+s.i+' مثال ناقص');
 if(s.teach&&s.teach.length<300)W.push('المقطع '+s.i+' شرح قصير ('+s.teach.length+' حرفًا)');
 if(!Array.isArray(s.after)||!s.after.length)E.push('المقطع '+s.i+' بلا خيط رأسي');
});
const seen={},lv={},oc={},sc={};
U.items.forEach(it=>{
 if(seen[it.q])E.push('فقرة مكرّرة : '+it.id);seen[it.q]=1;
 if(!Array.isArray(it.op)||it.op.length!==4)E.push(it.id+' عدد البدائل ليس أربعة');
 if(!(it.a>=0&&it.a<=3))E.push(it.id+' مفتاح خارج المدى');
 if(!Array.isArray(it.fb)||it.fb.length!==4)E.push(it.id+' التغذية الراجعة ليست أربعة عناصر');
 else{
  if(it.fb[it.a]&&it.fb[it.a].trim())W.push(it.id+' يوجد نصّ على البديل الصحيح');
  it.fb.forEach((x,k)=>{if(k!==it.a&&(!x||!x.trim()))E.push(it.id+' البديل '+(k+1)+' بلا تعليل')});
 }
 if(!segIds.includes(it.s))E.push(it.id+' مقطع غير معروف');
 const sg=U.segments.find(x=>x.i===it.s);
 if(sg&&sg.o!==it.o)E.push(it.id+' النتاج لا يطابق مقطعه');
 if(new Set(it.op).size!==4)E.push(it.id+' بدائل متكرّرة');
 lv[it.lvl]=(lv[it.lvl]||0)+1;oc[it.o]=(oc[it.o]||0)+1;sc[it.s]=(sc[it.s]||0)+1;
});
segIds.forEach(i=>{if((sc[i]||0)<8)E.push('المقطع '+i+' فقراته '+(sc[i]||0)+' وهي أقلّ من ثمان')});
const keys={};U.items.forEach(it=>keys[it.a]=(keys[it.a]||0)+1);
/* المدوّنة : مجموع نصيب النتاجات يساوي عدد فقرات الاختبار */
const sum=Object.values(U.selftest.byOutcome).reduce((a,b)=>a+b,0);
if(sum!==U.selftest.n)E.push('نصيب النتاجات '+sum+' لا يساوي '+U.selftest.n);
const bl=Object.values(U.selftest.bloom).reduce((a,b)=>a+b,0);
if(bl!==U.selftest.n)E.push('مجموع بلوم '+bl+' لا يساوي '+U.selftest.n);
/* كفاية البنك لكلّ نتاج */
Object.keys(U.selftest.byOutcome).forEach(o=>{
 const have=oc[Number(o)]||0,need=U.selftest.byOutcome[o];
 if(have<need)E.push('النتاج '+o+' يحتاج '+need+' وفي البنك '+have);
 const segs=U.segments.filter(s=>s.o===Number(o)).length;
 if(need>segs*3)E.push('النتاج '+o+' نصيبه '+need+' ويتجاوز سقف ثلاث فقرات لكلّ مقطع ('+segs+' مقاطع)');
});
/* سلامة وسوم ltr */
const chk=s=>{const o=(s.match(/<ltr>/g)||[]).length,c=(s.match(/<\/ltr>/g)||[]).length;return o===c};
const walk=(o,p)=>{if(typeof o==='string'){if(!chk(o))E.push('وسم ltr غير متوازن في '+p)}
 else if(Array.isArray(o))o.forEach((x,i)=>walk(x,p+'['+i+']'));
 else if(o&&typeof o==='object')Object.keys(o).forEach(k=>walk(o[k],p+'.'+k))};
walk(U,'U');

console.log('الفقرات :',U.items.length);
console.log('المقاطع :',U.segments.length);
console.log('بلوم    :',JSON.stringify(lv));
console.log('النتاجات:',JSON.stringify(oc));
console.log('لكلّ مقطع:',JSON.stringify(sc));
console.log('توزيع المفاتيح (أ ب جـ د):',JSON.stringify(keys));
console.log('حجم الملف:',Math.round(fs.statSync('unit_b10u3.json').size/1024)+' KB');
console.log('\nأخطاء:',E.length);E.forEach(x=>console.log('  ✗',x));
console.log('تنبيهات:',W.length);W.forEach(x=>console.log('  !',x));
