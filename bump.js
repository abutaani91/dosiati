/* رقم إصدار واحد لا رقمان : يضبط app.js و sw.js معًا
   الاستعمال :  node bump.js 17            ← يضبط التاريخ على اليوم
                node bump.js 17 2026/10/03 ← يضبط تاريخًا بعينه          */
const fs = require('fs');
const v = process.argv[2];
if (!/^\d+$/.test(v || '')) { console.error('اكتب رقم الإصدار : node bump.js 17'); process.exit(1); }
const d = new Date();
const date = process.argv[3] || (d.getFullYear() + '/' + String(d.getMonth() + 1).padStart(2, '0') + '/' + String(d.getDate()).padStart(2, '0'));

let a = fs.readFileSync('app.js', 'utf8');
const a1 = a.replace(/const APP_VER = '\d+';/, "const APP_VER = '" + v + "';")
            .replace(/const APP_DATE = '[^']*';/, "const APP_DATE = '" + date + "';");
if (a1 === a) { console.error('لم يُعثَر على APP_VER أو APP_DATE في app.js'); process.exit(1); }
fs.writeFileSync('app.js', a1);

let s = fs.readFileSync('sw.js', 'utf8');
const s1 = s.replace(/const CACHE = 'dosiati-v\d+';/, "const CACHE = 'dosiati-v" + v + "';");
if (s1 === s) { console.error('لم يُعثَر على CACHE في sw.js'); process.exit(1); }
fs.writeFileSync('sw.js', s1);

/* التحقّق : الرقمان متطابقان فعلًا */
const gv = fs.readFileSync('app.js', 'utf8').match(/const APP_VER = '(\d+)';/)[1];
const gc = fs.readFileSync('sw.js', 'utf8').match(/const CACHE = 'dosiati-v(\d+)';/)[1];
console.log(gv === gc ? '✓ الإصدار ' + gv + ' · التاريخ ' + date + ' · app.js و sw.js متطابقان'
                      : '✗ اختلاف : app.js = ' + gv + ' و sw.js = ' + gc);

/* التحقّق : كلّ ملفات الموقع الأساسية مذكورة في قائمة التخزين */
const FILES = (fs.readFileSync('sw.js', 'utf8').match(/const FILES = \[([^\]]*)\]/) || [, ''])[1]
  .split(',').map(x => x.trim().replace(/^'|'$/g, '')).filter(Boolean);
const need = ['index.html', 'app.js', 'data.json', 'extras.json', 'learn.json', 'figs.json', 'sims.js', 'logo.png', 'manifest.webmanifest', 'icon.svg'];
const miss = need.filter(f => !FILES.includes(f)).concat(FILES.filter(f => f !== './' && !fs.existsSync(f)).map(f => f + ' ( غير موجود )'));
console.log(miss.length ? '✗ قائمة التخزين : ' + miss.join(' · ') : '✓ قائمة التخزين كاملة (' + FILES.length + ' ملفًا)');
