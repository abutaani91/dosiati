/* يضع كلّ شكل في موضعه من الشرح نفسه :
   1 ) مقاطع الإتقان : s.figat[k] = رقم سطر الشرح الذي يُعرض الشكل بعده ( مُوازٍ لـ s.figs )
   2 ) الدوسية : items[].at في figs.json = موضع العرض :
        "n:<i>"        بعد العقدة رقم i في u.body ( أو داخل صندوق : "n:<i>.<j>" بعد الابن j )
        "q:<lvl>:<i>"  داخل السؤال رقم i من مستوى a/b/c في « أسئلة أحلّها »
   القاعدة الأولى : ذكر صريح « الشكل ( k ) » في النصّ . والثانية : أعلى تطابق في الكلمات ، مقيَّدًا بالدرس.
   الإعادة آمنة : يُمحى كلّ موضع قديم ثمّ يُحسب من جديد. */
const fs = require('fs');
const D = JSON.parse(fs.readFileSync('web/data.json', 'utf8'));
const F = JSON.parse(fs.readFileSync('web/figs.json', 'utf8'));
const OV = fs.existsSync('figplace_fix.json') ? JSON.parse(fs.readFileSync('figplace_fix.json', 'utf8')) : {};

/* ---------- تطبيع عربي وتقطيع ---------- */
const STOP = new Set('في من على الى إلى عن مع التي الذي الذين هذه هذا ذلك تلك او أو ثم كل بين عند حيث لان لأن كان كانت يكون تكون اذا إذا ما لا لم لن قد هو هي هم هن انه أنه ان أن إن بعد قبل حتى غير عندما كما مثل أي اي ايضا أيضا بها فيه فيها منها عليه عليها له لها ذات نحو اكثر أكثر اقل أقل شكل الشكل صورة رسم يبين يوضح تمثل يمثل سؤال'.split(' '));
const norm = s => String(s || '')
  .replace(/<[^>]+>/g, ' ')
  .replace(/[ً-ْـ]/g, '')
  .replace(/[أإآ]/g, 'ا').replace(/ة/g, 'ه').replace(/ى/g, 'ي');
const stem = w => {
  w = w.replace(/^(و|ف|ب|ل|ك)?ال/, '');
  if (w.length > 4) w = w.replace(/(ات|ين|ون|ها|هم|يه|ان)$/, '');
  if (w.length > 3) w = w.replace(/[هي]$/, '');
  return w;
};
const toks = s => norm(s).split(/[^ء-يA-Za-z0-9]+/).filter(w => w.length >= 3 && !STOP.has(w)).map(stem).filter(w => w.length >= 3);
const bag = s => { const m = new Map(); toks(s).forEach(w => m.set(w, (m.get(w) || 0) + 1)); return m; };

/* idf على مستوى الوحدة */
function scorer(docs) {
  const df = new Map();
  docs.forEach(d => new Set(d.keys()).forEach(w => df.set(w, (df.get(w) || 0) + 1)));
  const N = docs.length;
  return (q, d) => { let s = 0; q.forEach((qn, w) => { if (d.has(w)) s += Math.log(1 + N / df.get(w)); }); return s; };
}
const figText = x => (x.t + ' ' + x.t + ' ' + (x.d || ''));
const mentions = (text, k) => k && new RegExp('(الشكل|شكل)\\s*\\(\\s*' + String(k).replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '(\\s|\\)|/|$)').test(norm(text));

const ORD = ['', 'الاول', 'الثاني', 'الثالث', 'الرابع', 'الخامس', 'السادس'];
const report = [];
let nSeg = 0, nSegMention = 0, nDos = 0, nDosMention = 0, nQ = 0;

/* ================= 1 ) مقاطع الإتقان ================= */
fs.readdirSync('content').filter(f => /^unit_.*\.json$/.test(f)).forEach(f => {
  const p = 'content/' + f, U = JSON.parse(fs.readFileSync(p, 'utf8')), u = U.id;
  const items = (F[u] || { items: [] }).items;
  U.segments.forEach(s => {
    delete s.figat;
    if (!s.figs || !s.figs.length) return;
    const lines = String(s.teach).split('\n').map(x => x.trim()).filter(Boolean);
    const docs = lines.map(bag), sc = scorer(docs);
    s.figat = s.figs.map(fn => {
      const fx = OV[u] && OV[u].seg && OV[u].seg[s.i] && OV[u].seg[s.i][fn];
      if (fx !== undefined) return fx;
      const x = items.find(y => y.f === fn); nSeg++;
      if (!x) return 0;
      const mi = lines.findIndex(l => mentions(l, x.k));
      if (mi >= 0) { nSegMention++; return mi; }
      const q = bag(figText(x));
      let best = 0, bs = 0;
      docs.forEach((d, i) => { const v = sc(q, d); if (v > bs + 1e-9) { bs = v; best = i; } });
      /* السطر الأوّل في الغالب تمهيد ، فإن لم يُطابق شيء فبعد السطر الأوّل */
      return best;
    });
  });
  fs.writeFileSync(p, JSON.stringify(U, null, 1));
});

/* ================= 2 ) الدوسية ================= */
const SKIPBOX = /اخطاء|مفاتيح|بطاقه|خريطه|الفكره الرئيسه/;
const SKIPSEC = /امثله|نماذج|اخطاء|بطاقه|خريطه|ماذا ساتعلم|نتاجات/;
D.forEach(U => {
  const u = U.id, FX = F[u]; if (!FX) return;
  FX.items.forEach(x => { delete x.at; delete x.isQ; });
  /* الأقسام : كلّ h2 ( أو بداية فصل ) قسم ، وفيه عُقَده */
  const SEC = [];
  let chap = -1, chapT = '', cur = null;
  U.body.forEach((n, i) => {
    if (n.t === 'h1') { chap++; chapT = n.x; cur = { chap, chapT, title: '', nodes: [], skip: false }; SEC.push(cur); return; }
    if (n.t === 'h2') { cur = { chap, chapT, title: n.x, nodes: [], skip: SKIPSEC.test(norm(n.x)) }; SEC.push(cur); return; }
    if (!cur || ['cover', 'questions', 'exam', 'examples'].includes(n.t)) return;
    if (n.t === 'box' && SKIPBOX.test(norm(n.title))) return;
    const txt = n.t === 'table' ? n.rows.map(r => r.join(' ')).join(' ') : n.t === 'box' ? (n.title + ' ' + (n.children || []).map(c => c.x || (c.rows ? c.rows.map(r => r.join(' ')).join(' ') : '')).join(' ')) : (n.x || '');
    cur.nodes.push({ i, t: n.t, txt, box: n.t === 'box' ? n.title : '' });
  });
  const SC = SEC.filter(c => !c.skip && c.nodes.length);
  SC.forEach(c => {
    c.bag = bag(c.title + ' ' + c.title + ' ' + c.title + ' ' + c.nodes.map(n => n.txt).join(' '));
    c.lesson = /الدرس/.test(norm(c.chapT)); c.enr = /اثراء|توسع/.test(norm(c.title + ' ' + c.nodes.map(n => n.box).join(' ')));
  });
  const QS = [];
  const qn = U.body.find(n => n.t === 'questions');
  if (qn) ['a', 'b', 'c'].forEach(l => (qn[l] || []).forEach((q, i) => QS.push({ at: 'q:' + l + ':' + i, b: bag(q.q) })));
  const sc = scorer(SC.map(c => c.bag).concat(QS.map(q => q.b)));
  const nodeIn = (c, q) => {
    let best = c.nodes.find(n => n.t === 'p') || c.nodes[0], bs = 0;
    const sn = scorer(c.nodes.map(n => bag(n.txt)));
    c.nodes.forEach(n => { const v = sn(q, bag(n.txt)); if (v > bs + 1e-9) { bs = v; best = n; } });
    return 'n:' + best.i;
  };
  const chapOf = les => {
    const m = /الدرس\s*(\d+)/.exec(norm(les || ''));
    if (!m) return null;
    const c = SC.find(c => new RegExp('الدرس\\s*(' + ORD[+m[1]] + '|' + m[1] + ')').test(norm(c.chapT)));
    return c ? c.chap : null;
  };
  const firstNode = SC.length ? SC[0].nodes[0].i : 0;
  const pend = [];
  FX.items.forEach(x => {
    const fx = OV[u] && OV[u].dos && OV[u].dos[x.f];
    if (fx) { x.at = fx; return; }
    nDos++;
    const les = norm(FX.les[x.l] || '');
    const q = bag(figText(x) + (x.a ? ' ' + FX.les[x.l] + ' ' + FX.les[x.l] : ''));
    /* ( أ ) ذكر صريح */
    if (!x.a && x.k) { for (const c of SC) { const n = c.nodes.find(n => mentions(n.txt, x.k)); if (n) { x.at = 'n:' + n.i; nDosMention++; return; } } }
    /* ( ب ) أسئلة المراجعة */
    const isQ = /سؤال/.test(x.t) || /مراجعه|اسئله|تحاكي/.test(les);
    if (isQ && QS.length) {
      let bi = -1, bs = 0, b2 = 0;
      QS.forEach((qq, i) => { const v = sc(q, qq.b); if (v > bs) { b2 = bs; bs = v; bi = i; } else if (v > b2) b2 = v; });
      if (bi >= 0 && bs >= 4 && bs >= 1.3 * b2) { x.at = QS[bi].at; nQ++; return; }
    }
    if (isQ) x.isQ = 1;
    /* ( جـ ) مقدّمة الوحدة : قبل أوّل عقدة */
    if (/مقدمه الوحده/.test(les)) { x.at = 'b:' + firstNode; return; }
    pend.push(x);
  });
  /* ( د ) كتاب الطالب في فصل درس : محاذاة رتيبة بالصفحة ( الأقسام تتبع ترتيب صفحات الكتاب ) */
  const byChap = {};
  pend.forEach(x => { const c = (x.a || x.isQ) ? null : chapOf(FX.les[x.l]); if (c !== null) (byChap[c] = byChap[c] || []).push(x); });
  Object.keys(byChap).forEach(c => {
    const xs = byChap[c].sort((a, b) => a.p - b.p || ((+a.k || 99) - (+b.k || 99)) || (a.f < b.f ? -1 : 1));
    const cs = SC.filter(s => s.chap === +c);
    const M = xs.map(x => { const q = bag(figText(x)); return cs.map(s => sc(q, s.bag)); });
    /* DP : أعلى مجموع تطابق مع ألّا يعود شكل لاحق إلى قسم سابق */
    const n = xs.length, m = cs.length, dp = [], bk = [];
    for (let i = 0; i < n; i++) { dp.push(new Array(m).fill(-1e9)); bk.push(new Array(m).fill(0)); }
    for (let j = 0; j < m; j++) dp[0][j] = M[0][j] - 0.01 * j;
    for (let i = 1; i < n; i++) {
      let bestV = -1e9, bestJ = 0;
      for (let j = 0; j < m; j++) {
        if (dp[i - 1][j] > bestV) { bestV = dp[i - 1][j]; bestJ = j; }
        dp[i][j] = bestV + M[i][j] - 0.01 * j; bk[i][j] = bestJ;
      }
    }
    let j = 0; for (let k = 1; k < m; k++) if (dp[n - 1][k] > dp[n - 1][j]) j = k;
    for (let i = n - 1; i >= 0; i--) {
      const x = xs[i], s = cs[j];
      x.at = nodeIn(s, bag(figText(x)));
      if (M[i][j] < 2) report.push(u + ' · ' + x.f + ' · « ' + x.t + ' » ← ' + (s.title || s.chapT).slice(0, 40) + ' ( ' + M[i][j].toFixed(1) + ' )');
      j = bk[i][j];
    }
  });
  /* ( هـ ) الباقي ( كتاب الأنشطة والإثراء وما لم يُعرف درسه ) : أعلى تطابق في أقسام الدروس */
  pend.filter(x => !x.at).forEach(x => {
    const q = bag(figText(x) + (x.a ? ' ' + FX.les[x.l] + ' ' + FX.les[x.l] : ''));
    let cand = SC.filter(c => c.lesson);
    const lc = chapOf(FX.les[x.l]);
    if (x.isQ && lc !== null) cand = SC.filter(c => c.chap === lc);
    if (/اثراء/.test(norm(FX.les[x.l] || ''))) { const e = SC.filter(c => c.enr); if (e.length) cand = e; }
    if (!cand.length) cand = SC;
    let best = cand[0], bs = -1;
    cand.forEach(c => { const v = sc(q, c.bag); if (v > bs) { bs = v; best = c; } });
    x.at = nodeIn(best, q);
    if (bs < 2) report.push(u + ' · ' + x.f + ' · « ' + x.t + ' » ← ' + (best.title || best.chapT).slice(0, 40) + ' ( ' + bs.toFixed(1) + ' )');
  });
});
Object.values(F).forEach(V => V.items.forEach(x => delete x.isQ));
fs.writeFileSync('web/figs.json', JSON.stringify(F));
console.log('المقاطع : أشكال', nSeg, '· بذكر صريح', nSegMention);
console.log('الدوسية : أشكال', nDos, '· بذكر صريح', nDosMention, '· في الأسئلة', nQ, '· تطابق ضعيف', report.length);
fs.writeFileSync('figplace_report.txt', report.join('\n'));
