/* دوسياتي — منطق التطبيق  (v3 : أكواد الطلبة + اختبار مؤقّت برمز المعلّم) */
const S = { units: [], unit: null, tab: 'sum', present: false, user: null, q: '', iv: null };
const $ = s => document.querySelector(s);
const el = (t, c, h) => { const e = document.createElement(t); if (c) e.className = c; if (h !== undefined) e.innerHTML = h; return e; };
const norm = s => (s || '').replace(/[ً-ْـ]/g, '').replace(/[أإآٱ]/g, 'ا').replace(/ى/g, 'ي').replace(/ة/g, 'ه').replace(/[^ء-يa-zA-Z0-9 ]/g, ' ').toLowerCase();
const SUB = { '0': '₀', '1': '₁', '2': '₂', '3': '₃', '4': '₄', '5': '₅', '6': '₆', '7': '₇', '8': '₈', '9': '₉' };
const SUP = { '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴', '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹', '+': '⁺', '-': '⁻', '−': '⁻' };
const NOT_F = /^(ATP|ADP|DNA|RNA|TEM|SEM|PDF|IA|IIA|IB|AB|XY|XX|MA|KE|SI)$/;

/* ============ إعدادات عامة ============ */
const CFG = {
  year: 2027,                 // السنة الدراسية المعتمدة في الأكواد
  minYear: 2024, maxYear: 2040,
  terms: { '01': 'الفصل الأول', '02': 'الفصل الثاني', '03': 'الفصل الصيفي' },
  grades: { '08': 'الصف الثامن', '09': 'الصف التاسع', '10': 'الصف العاشر' }
};
const gradeNo = g => /ثامن/.test(g) ? '08' : /تاسع/.test(g) ? '09' : /عاشر/.test(g) ? '10' : '';

/* ============ تنسيق النصوص ============ */
function chem(s) {
  s = s.replace(/(?<![A-Za-z])((?:\((?:[A-Z][a-z]?\d*)+\)\d*|[A-Z][a-z]?\d*)+)(\^\d*[+\-−])?(?![A-Za-z0-9^])/g, (m, body, chg) => {
    if (NOT_F.test(m)) return m;
    if (!/\d/.test(body) && !chg) return m;
    const b = body.replace(/\d/g, d => SUB[d]);
    const c = chg ? chg.slice(1).replace(/[\d+\-−]/g, x => SUP[x]) : '';
    return b + c;
  });
  return s.replace(/_([A-Za-z0-9]+)/g, '\u0001$1\u0002');
}
function esc(s) { return String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
const SPAN = /[A-Za-z0-9°²³⁴⁵⁶⁷⁸⁹⁻¹⁰₀₁₂₃₄₅₆₇₈₉√θαβγλνμπΣΔΩℓ½⁺+\-−–×·÷=<>≤≥≠:,.\/|()\u0001\u0002\s]{2,}/g;
function fmt(raw) {
  let t = esc(chem(String(raw ?? '')));
  t = t.replace(/&lt;ltr&gt;([\s\S]*?)&lt;\/ltr&gt;/g, '\u0003$1\u0004');
  t = t.replace(SPAN, m => {
    if (!/[A-Za-z0-9]/.test(m)) return m;
    if (!/[=<>+\-−×·÷\/√|]/.test(m) && !/\d[\d.,]*\s+[A-Za-zμΩ]/.test(m)) return m;
    const lead = m.match(/^\s*/)[0], tail = m.match(/\s*$/)[0];
    const core = m.slice(lead.length, m.length - tail.length);
    if (!core) return m;
    return lead + '\u0003' + core + '\u0004' + tail;
  });
  t = t.replace(/\u0003/g, '<span dir="ltr" class="ltr">').replace(/\u0004/g, '</span>');
  t = t.replace(/\u0001([^\u0002]*)\u0002/g, '<sub>$1</sub>');
  return t;
}
const isEq = s => typeof s === 'string' && s.startsWith('EQ|');
function line(s) {
  if (isEq(s)) { const v = s.slice(3); return `<div class="eq" ${/[ء-ي]/.test(v) ? '' : 'dir="ltr"'}>${fmt(v)}</div>`; }
  return `<p>${fmt(s)}</p>`;
}

/* ============ أكواد الطلبة ============ */
/* الكود = السنة (4) + الفصل (2) + الصف (2) + رقم الطالب (2 أو 3)
   مثال : 2027010901  →  2027 ، الفصل الأول ، الصف التاسع ، الطالب 01      */
function readCode(v) {
  const t = String(v || '').replace(/[^0-9]/g, '');
  if (t.length < 9 || t.length > 12) return null;
  const year = +t.slice(0, 4), term = t.slice(4, 6), grade = t.slice(6, 8), no = t.slice(8);
  if (year < CFG.minYear || year > CFG.maxYear) return null;
  if (!CFG.terms[term]) return null;
  if (!CFG.grades[grade]) return null;
  if (!/^[0-9]{1,4}$/.test(no) || +no < 1) return null;
  return { code: t, year, term, grade, no };
}
const userKey = 'dosiati-user';
function loadUser() { try { return JSON.parse(localStorage.getItem(userKey) || 'null'); } catch (e) { return null; } }
function setUser(u) { S.user = u; try { localStorage.setItem(userKey, JSON.stringify(u)); } catch (e) {} }
function logout() { try { localStorage.removeItem(userKey); } catch (e) {} S.user = null; location.hash = ''; render(); }
const isTeacher = () => !!(S.user && S.user.teacher);
const pin = () => localStorage.getItem('dosiati-pin') || '2027';

/* ============ رمز الاختبار ============ */
const B36 = '0123456789abcdefghijklmnopqrstuvwxyz';
const b36 = (n, w) => { let s = ''; n = Math.max(0, Math.floor(n)); while (n > 0) { s = B36[n % 36] + s; n = Math.floor(n / 36); } return s.padStart(w, '0').slice(-w); };
const un36 = s => [...s].reduce((a, c) => a * 36 + B36.indexOf(c), 0);
const chk = s => B36[[...s].reduce((a, c) => a + B36.indexOf(c), 0) % 36];
const uhash = id => { let h = 0; for (const c of id) h = (h * 33 + c.charCodeAt(0)) % 1296; return b36(h, 2); };
const TEPOCH = Date.UTC(2025, 0, 1) / 60000;     // بالدقائق
function makeTicket(uid, dur, expMs) {
  const core = uhash(uid) + b36(dur, 2) + b36(Math.round((expMs / 60000 - TEPOCH) / 5), 4);
  return (core + chk(core)).toUpperCase();
}
function readTicket(v) {
  const t = String(v || '').toLowerCase().replace(/[^0-9a-z]/g, '');
  if (t.length !== 9) return null;
  const core = t.slice(0, 8);
  if (chk(core) !== t[8]) return null;
  return { tk: t.toUpperCase(), uh: core.slice(0, 2), dur: un36(core.slice(2, 4)), exp: (un36(core.slice(4, 8)) * 5 + TEPOCH) * 60000 };
}
const hhmm = ms => { const d = new Date(ms); return String(d.getHours()).padStart(2, '0') + ':' + String(d.getMinutes()).padStart(2, '0'); };
const mmss = s => (s < 0 ? '00:00' : String(Math.floor(s / 60)).padStart(2, '0') + ':' + String(Math.floor(s % 60)).padStart(2, '0'));

/* ============ التخزين المحلي ============ */
let KEY = 'dosiati-v1', store = {};
function openStore() {
  KEY = 'dosiati-v1:' + ((S.user && S.user.code) || 'teacher');
  try { store = JSON.parse(localStorage.getItem(KEY) || '{}'); } catch (e) { store = {}; }
}
const save = () => { try { localStorage.setItem(KEY, JSON.stringify(store)); } catch (e) {} };
const prog = id => (store[id] = store[id] || { mcq: {}, seen: [] });

/* ============ تحميل البيانات ============ */
async function boot() {
  let data = window.__DATA__;
  if (!data) { const r = await fetch('data.json'); data = await r.json(); }
  S.units = data;
  S.units.forEach(u => {
    u.chapters = [];
    let cur = null;
    u.body.forEach(n => {
      if (n.t === 'cover') return;
      if (n.t === 'h1') { cur = { title: n.x, nodes: [] }; u.chapters.push(cur); return; }
      if (n.t === 'questions') { u.questions = n; return; }
      if (n.t === 'exam') { u.exam = n; return; }
      if (!cur) { cur = { title: 'مقدّمة', nodes: [] }; u.chapters.push(cur); }
      cur.nodes.push(n);
    });
    u.examples = u.body.filter(n => n.t === 'examples');
    u.keyk = (u.key.find(n => n.t === 'key') || {}).k || {};
    u.gno = gradeNo(u.meta.grade);
    u.uh = uhash(u.id);
    u.search = norm(JSON.stringify(u.body));
  });
  S.user = loadUser();
  openStore();
  route();
}

/* ============ التوجيه ============ */
function route() {
  const h = decodeURIComponent(location.hash.slice(1));
  const [id, tab] = h.split('/');
  S.unit = S.units.find(u => u.id === id) || null;
  if (S.unit && !isTeacher() && S.user && S.unit.gno !== S.user.grade) S.unit = null;
  S.tab = tab || 'sum';
  render();
  window.scrollTo(0, 0);
}
window.addEventListener('hashchange', route);

function render() {
  if (S.iv) { clearInterval(S.iv); S.iv = null; }
  const app = $('#app');
  app.innerHTML = '';
  document.body.classList.toggle('present', S.present);
  bar();
  if (!S.user) { app.append(loginView()); return; }
  if (!S.unit) { app.append(home()); return; }
  app.append(unitView(S.unit));
}

function bar() {
  const who = $('#who'), out = $('#out');
  if (!S.user) { who.textContent = ''; out.style.display = 'none'; return; }
  who.textContent = isTeacher() ? 'المعلّم' : (CFG.grades[S.user.grade] + ' · طالب ' + S.user.no);
  out.style.display = '';
}

/* ---------- شاشة الدخول ---------- */
function loginView() {
  const w = el('div', 'wrap');
  w.append(el('div', 'hero', `<h1>دوسياتي</h1><p>ملخّصات ونماذج وأسئلة تفاعلية — تعمل بدون إنترنت</p>`));
  const g = el('div', 'gate big');
  g.append(el('p', '', 'أدخل رمز الدخول الخاص بك للمتابعة.'));
  const i = el('input'); i.type = 'tel'; i.inputMode = 'numeric'; i.placeholder = 'رمز الدخول';
  i.setAttribute('dir', 'ltr'); i.id = 'code';
  const msg = el('p', 'err', '');
  const b = el('button', 'btn', 'دخول');
  b.onclick = () => {
    const v = i.value.trim();
    if (v && v === pin()) { setUser({ teacher: true }); openStore(); location.hash = ''; render(); return; }
    const u = readCode(v);
    if (!u) { msg.textContent = 'رمز غير صحيح . تأكّد من الرقم الذي زوّدك به المعلّم.'; return; }
    setUser(u); openStore(); location.hash = ''; render();
  };
  i.onkeydown = e => { if (e.key === 'Enter') b.click(); };
  g.append(i, b, msg);
  g.append(el('p', 'hint', 'رمز الطالب مكوّن من : السنة ( 4 أرقام ) + الفصل ( 01 أو 02 ) + الصف ( 08 ، 09 ، 10 ) + رقمك في القائمة.<br>مثال : <span class="ltr" dir="ltr">2027010901</span> يعني سنة 2027 ، الفصل الأول ، الصف التاسع ، الطالب الأول.'));
  w.append(g);
  w.append(el('p', 'foot', 'إعداد المعلم محمد الطعاني — مدرسة رجم الشامي الشرقي الثانوية للبنين'));
  setTimeout(() => i.focus(), 50);
  return w;
}

/* ---------- الصفحة الرئيسة ---------- */
function home() {
  const w = el('div', 'wrap');
  const sub = isTeacher() ? 'وضع المعلّم — جميع الصفوف والاختبارات' : CFG.grades[S.user.grade] + ' · ' + (CFG.terms[S.user.term] || '') + ' · رقمك ' + S.user.no;
  w.append(el('div', 'hero', `<h1>دوسياتي</h1><p>${esc(sub)}</p>`));
  if (isTeacher()) w.append(teacherTools());
  const s = el('input', 'search'); s.placeholder = 'ابحث في الوحدات …'; s.value = S.q;
  s.oninput = () => { S.q = s.value; list.replaceChildren(...cards()); };
  w.append(s);
  const list = el('div', 'grid');
  list.append(...cards());
  w.append(list);
  w.append(el('p', 'foot', 'إعداد المعلم محمد الطعاني — مدرسة رجم الشامي الشرقي الثانوية للبنين'));
  return w;

  function cards() {
    const q = norm(S.q);
    const mine = S.units.filter(u => isTeacher() || u.gno === S.user.grade);
    const groups = {};
    mine.filter(u => !q || u.search.includes(q) || norm(u.meta.subject + ' ' + u.unit.unitTitle).includes(q))
      .forEach(u => { (groups[u.meta.grade] = groups[u.meta.grade] || []).push(u); });
    const out = [];
    Object.keys(groups).forEach(g => {
      out.push(el('h2', 'grade', esc(g)));
      const row = el('div', 'row');
      groups[g].forEach(u => {
        const c = el('a', 'card');
        c.href = '#' + u.id;
        c.innerHTML = `<span class="sub">${esc(u.meta.subject)}</span>
          <strong>${fmt(u.unit.unitTitle)}</strong>
          <span class="meta">الوحدة ${esc(u.unit.unitNo.replace(/ـ/g, ''))} · ص ${fmt(u.unit.pages)} · ${fmt(u.unit.periods)}</span>`;
        row.append(c);
      });
      out.push(row);
    });
    if (!out.length) out.push(el('p', 'empty', 'لا توجد نتائج.'));
    return out;
  }
}

/* ---------- أدوات المعلّم في الصفحة الرئيسة ---------- */
function teacherTools() {
  const box = el('div', 'box gold');
  box.append(el('div', 'bt', 'أدوات المعلّم'));
  const row = el('div', 'frow');
  const gs = el('select'); Object.keys(CFG.grades).forEach(k => { const o = el('option', '', CFG.grades[k]); o.value = k; gs.append(o); });
  const ts = el('select'); Object.keys(CFG.terms).forEach(k => { const o = el('option', '', CFG.terms[k]); o.value = k; ts.append(o); });
  const yr = el('input'); yr.type = 'number'; yr.value = CFG.year; yr.className = 'num';
  const n1 = el('input'); n1.type = 'number'; n1.value = 1; n1.className = 'num';
  const n2 = el('input'); n2.type = 'number'; n2.value = 30; n2.className = 'num';
  row.append(lab('السنة', yr), lab('الفصل', ts), lab('الصف', gs), lab('من', n1), lab('إلى', n2));
  const b = el('button', 'btn', 'توليد أكواد الطلبة');
  const out = el('div', 'codes');
  b.onclick = () => {
    out.innerHTML = '';
    const t = el('table');
    t.append(rowOf(['#', 'رمز الدخول', 'اسم الطالب'], true));
    for (let i = +n1.value; i <= +n2.value && i - +n1.value < 200; i++) {
      const code = String(yr.value) + ts.value + gs.value + String(i).padStart(2, '0');
      t.append(rowOf([i, code, '']));
    }
    const tw = el('div', 'tw'); tw.append(t);
    out.append(el('p', 'hint', `أكواد ${CFG.grades[gs.value]} — ${CFG.terms[ts.value]} ${yr.value} . اطبع الجدول ووزّع كل رمز على صاحبه.`), tw);
    const pb = el('button', 'btn ghost', 'طباعة القائمة');
    pb.onclick = () => printList(out.innerHTML);
    out.append(pb);
  };
  box.append(row, b, out);
  const brow = el('div', 'btns2');
  const pb = el('button', 'btn ghost', 'تغيير رمز المعلّم');
  pb.onclick = () => { const v = prompt('رمز المعلّم الجديد :'); if (v && v.trim()) { localStorage.setItem('dosiati-pin', v.trim()); alert('تم الحفظ على هذا الجهاز.'); } };
  brow.append(pb);
  box.append(brow);
  return box;

  function lab(t, e) { const d = el('label', 'fl'); d.append(el('span', '', esc(t)), e); return d; }
  function rowOf(cells, head) { const tr = el('tr'); cells.forEach(c => tr.append(el(head ? 'th' : 'td', '', esc(String(c))))); return tr; }
}
function printList(html) {
  const w = window.open('', '_blank');
  if (!w) return alert('اسمح بالنوافذ المنبثقة للطباعة.');
  w.document.write(`<!doctype html><html lang="ar" dir="rtl"><head><meta charset="utf-8"><title>أكواد الطلبة</title>
  <style>body{font-family:"Segoe UI",Tahoma,sans-serif;padding:1.5rem}table{border-collapse:collapse;width:100%}th,td{border:1px solid #999;padding:.4rem .6rem;text-align:start}th{background:#00205B;color:#fff}.hint{color:#555}button{display:none}</style>
  </head><body>${html}</body></html>`);
  w.document.close(); w.focus(); setTimeout(() => w.print(), 300);
}

/* ---------- عرض الوحدة ---------- */
const TABS = [['sum', 'الملخّص'], ['ex', 'نماذج محلولة'], ['q', 'أسئلة'], ['test', 'اختبار الوحدة'], ['t', 'للمعلّم']];
function liveNow(u) { const a = att(u); return !!(a && !a.submitted && Date.now() < a.start + a.dur * 60000); }
function unitView(u) {
  const w = el('div', 'wrap');
  const live = liveNow(u);
  if (live && S.tab !== 'test') { location.hash = `#${u.id}/test`; S.tab = 'test'; }
  const head = el('div', 'uhead', `${live ? '' : '<a class="back" href="#">‹ الوحدات</a>'}
    <div><strong>${fmt(u.unit.unitTitle)}</strong><span>${esc(u.meta.subject)} — ${esc(u.meta.grade)} · ص ${fmt(u.unit.pages)}</span></div>`);
  w.append(head);
  const tabs = el('div', 'tabs');
  TABS.forEach(([k, t]) => {
    if (k === 't' && !isTeacher()) return;
    if (live && k !== 'test') return;
    const b = el('a', 'tab' + (S.tab === k ? ' on' : ''), esc(t));
    b.href = `#${u.id}/${k}`;
    tabs.append(b);
  });
  w.append(tabs);
  const body = el('div', 'tabbody');
  if (S.tab === 'sum') body.append(...summary(u));
  if (S.tab === 'ex') body.append(...examplesView(u));
  if (S.tab === 'q') body.append(...questionsView(u));
  if (S.tab === 'test') body.append(examView(u));
  if (S.tab === 't') body.append(isTeacher() ? teacherView(u) : el('p', 'empty', 'هذا القسم للمعلّم.'));
  w.append(body);
  return w;
}

function nodeEl(n) {
  if (!n) return null;
  if (n.t === 'h1') return el('h1', 'ch', fmt(n.x));
  if (n.t === 'h2') return el('h2', '', fmt(n.x));
  if (n.t === 'h3') return el('h3', '', fmt(n.x));
  if (n.t === 'p') return el('p', '', fmt(n.x));
  if (n.t === 'li') return el('div', 'li', fmt(n.x));
  if (n.t === 'eq') return el('div', 'eq', fmt(n.x));
  if (n.t === 'draw') return el('div', 'draw', 'فراغ الرسم — استخدم الدفتر');
  if (n.t === 'table') {
    const t = el('table');
    n.rows.forEach((r, i) => {
      const tr = el('tr');
      r.forEach(c => { const cell = el(i ? 'td' : 'th', '', fmt(c).replace(/\n/g, '<br>')); tr.append(cell); });
      t.append(tr);
    });
    const box = el('div', 'tw'); box.append(t); return box;
  }
  if (n.t === 'box') {
    const b = el('div', 'box ' + (n.color === 'gold' ? 'gold' : 'mint'));
    b.append(el('div', 'bt', fmt(n.title)));
    n.children.forEach(c => { const x = nodeEl(c); if (x) b.append(x); });
    return b;
  }
  return null;
}

function summary(u) {
  const out = [];
  u.chapters.forEach(ch => {
    const sec = el('section', 'chap');
    sec.append(el('h1', 'ch', fmt(ch.title)));
    ch.nodes.forEach(n => { if (n.t === 'examples') return; const x = nodeEl(n); if (x) sec.append(x); });
    out.push(sec);
  });
  return out;
}

/* ---------- النماذج المحلولة ---------- */
function examplesView(u) {
  const out = [el('p', 'hint', 'حاول حلّ النموذج بنفسك ، ثم أظهر الخطوات واحدة واحدة.')];
  u.examples.forEach(ex => {
    ex.list.forEach(item => {
      const c = el('div', 'card2');
      c.append(el('div', 'ct', fmt(item.t)));
      c.append(el('p', 'qq', fmt(item.q)));
      const sol = el('div', 'sol');
      let shown = 0;
      const btns = el('div', 'btns');
      const next = el('button', 'btn', 'الخطوة التالية');
      const all = el('button', 'btn ghost', 'إظهار الحلّ كاملًا');
      next.onclick = () => { if (shown < item.sol.length) sol.insertAdjacentHTML('beforeend', line(item.sol[shown++])); if (shown >= item.sol.length) next.disabled = true; };
      all.onclick = () => { while (shown < item.sol.length) sol.insertAdjacentHTML('beforeend', line(item.sol[shown++])); next.disabled = true; };
      btns.append(next, all);
      c.append(btns, sol);
      out.push(c);
    });
  });
  return out;
}

/* ---------- الأسئلة المتدرجة ---------- */
function questionsView(u) {
  const q = u.questions;
  if (!q) return [el('p', '', 'لا توجد أسئلة.')];
  const out = [];
  let n = 1;
  [['المستوى ( أ ) : تذكّر وفهم', q.a], ['المستوى ( ب ) : تطبيق', q.b], ['المستوى ( جـ ) : تحليل واستدلال', q.c]].forEach(([title, arr]) => {
    out.push(el('h2', 'lvl', esc(title)));
    (arr || []).forEach(item => out.push(qCard(u, item, n++)));
  });
  return out;
}
function qCard(u, item, n) {
  const c = el('div', 'card2');
  c.append(el('div', 'qn', `س ${n}`));
  c.append(el('p', 'qq', fmt(item.q)));
  if (item.tbl) c.append(nodeEl({ t: 'table', rows: item.tbl }));
  const ans = el('div', 'ans hidden');
  (item.a || []).forEach(a => ans.insertAdjacentHTML('beforeend', line(a)));
  const b = el('button', 'btn', 'أظهر الإجابة');
  b.onclick = () => {
    ans.classList.toggle('hidden');
    b.textContent = ans.classList.contains('hidden') ? 'أظهر الإجابة' : 'إخفاء الإجابة';
    const p = prog(u.id); if (!p.seen.includes(n)) { p.seen.push(n); save(); }
  };
  c.append(b, ans);
  return c;
}

/* ================= اختبار الوحدة ================= */
const AR = ['أ', 'ب', 'جـ', 'د'];
function att(u) { const p = prog(u.id); return p.att || null; }
function setAtt(u, a) { const p = prog(u.id); p.att = a; save(); }

function examView(u) {
  const ex = u.exam;
  const w = el('div', 'test');
  if (!ex) { w.append(el('p', 'empty', 'لا يوجد اختبار لهذه الوحدة.')); return w; }
  const a = att(u);

  if (a && a.submitted) return resultView(u, a);
  if (a && !a.submitted) {
    const leftS = Math.floor((a.start + a.dur * 60000 - Date.now()) / 1000);
    if (leftS <= 0) { a.submitted = Date.now(); a.auto = true; setAtt(u, a); return resultView(u, a); }
    return liveView(u, a);
  }
  return lockView(u);
}

/* --- شاشة القفل : إدخال رمز الاختبار --- */
function lockView(u) {
  const w = el('div', 'test');
  const g = el('div', 'gate big');
  g.append(el('div', 'lock', '🔒'));
  g.append(el('p', '', '<b>اختبار نهاية الوحدة</b><br>40 علامة . يفتح برمز يعطيه المعلّم وقت الاختبار فقط.'));
  const i = el('input'); i.placeholder = 'رمز الاختبار'; i.setAttribute('dir', 'ltr'); i.className = 'tk';
  const msg = el('p', 'err', '');
  const b = el('button', 'btn', 'فتح الاختبار');
  b.onclick = () => {
    const t = readTicket(i.value);
    if (!t) { msg.textContent = 'رمز غير صحيح.'; return; }
    if (t.uh !== u.uh) { msg.textContent = 'هذا الرمز يخصّ وحدة أخرى.'; return; }
    if (Date.now() > t.exp) { msg.textContent = 'انتهت مهلة الدخول لهذا الرمز.'; return; }
    setAtt(u, { tk: t.tk, start: Date.now(), dur: t.dur, mcq: {}, essay: {}, self: {} });
    render();
  };
  i.onkeydown = e => { if (e.key === 'Enter') b.click(); };
  g.append(i, b, msg);
  if (isTeacher()) {
    const tb = el('button', 'btn ghost', 'فتح الاختبار ( وضع المعلّم )');
    tb.onclick = () => { setAtt(u, { tk: 'TEACHER', start: Date.now(), dur: 45, mcq: {}, essay: {}, self: {} }); render(); };
    const trow = el('div', 'btns2'); trow.append(tb); g.append(trow);
  }
  w.append(g);
  return w;
}

/* --- الاختبار الجاري --- */
function liveView(u, a) {
  const ex = u.exam;
  const w = el('div', 'test');
  const head = el('div', 'thead run');
  head.append(el('strong', '', 'اختبار نهاية الوحدة'), el('span', '', '40 علامة · ' + a.dur + ' دقيقة'));
  const timer = el('div', 'timer', '');
  head.append(timer);
  const sub = el('button', 'btn danger', 'تسليم الاختبار');
  sub.onclick = () => { if (confirm('هل أنت متأكد من تسليم الاختبار ؟ لن تتمكن من التعديل بعدها.')) doSubmit(); };
  head.append(sub);
  w.append(head);
  w.append(el('p', 'hint', 'أجب عن جميع الأسئلة ثم اضغط « تسليم الاختبار » . تظهر الإجابات النموذجية بعد التسليم فقط . يُسلَّم الاختبار تلقائيًّا عند انتهاء الوقت.'));

  /* السؤال الأول */
  w.append(el('h2', 'lvl', 'السؤال الأول : اختيار من متعدد ( 15 علامة )'));
  ex.mcq.forEach((it, i) => {
    const c = el('div', 'card2');
    c.append(el('p', 'qq', `<b>${i + 1} )</b> ${fmt(it.q)}`));
    const opts = el('div', 'opts');
    it.o.forEach((o, j) => {
      const b = el('button', 'opt' + (a.mcq[i] === AR[j] ? ' sel' : ''), `<span>${AR[j]}</span> ${fmt(o)}`);
      b.onclick = () => {
        a.mcq[i] = AR[j]; setAtt(u, a);
        [...opts.children].forEach(x => x.classList.remove('sel'));
        b.classList.add('sel');
      };
      opts.append(b);
    });
    c.append(opts);
    w.append(c);
  });

  /* الثاني والثالث */
  w.append(el('h2', 'lvl', 'السؤال الثاني : أُجيب عمّا يأتي ( 8 علامات )'));
  ex.q2.forEach((it, i) => w.append(essayLive(it, 'q2-' + i, i + 1)));
  w.append(el('h2', 'lvl', `السؤال الثالث : ${esc(ex.x.q3Title)} ( 17 علامة )`));
  ex.q3.forEach((it, i) => w.append(essayLive(it, 'q3-' + i, i + 1)));

  const f = el('div', 'btns2');
  const sub2 = el('button', 'btn danger', 'تسليم الاختبار');
  sub2.onclick = sub.onclick;
  f.append(sub2); w.append(f);

  tick();
  S.iv = setInterval(tick, 1000);
  return w;

  function tick() {
    const left = Math.floor((a.start + a.dur * 60000 - Date.now()) / 1000);
    timer.textContent = mmss(left);
    timer.classList.toggle('warn', left <= 300);
    if (left <= 0) { clearInterval(S.iv); S.iv = null; doSubmit(true); }
  }
  function doSubmit(auto) {
    a.submitted = Date.now(); a.auto = !!auto; setAtt(u, a);
    if (S.iv) { clearInterval(S.iv); S.iv = null; }
    render();
  }
  function essayLive(it, k, i) {
    const c = el('div', 'card2');
    c.append(el('p', 'qq', `<b>${i} )</b> ${fmt(it.q)} <em class="m">( ${esc(it.m)} علامات )</em>`));
    if (it.tbl) c.append(nodeEl({ t: 'table', rows: it.tbl }));
    const ta = el('textarea'); ta.placeholder = 'اكتب إجابتك هنا …'; ta.value = a.essay[k] || '';
    ta.oninput = () => { a.essay[k] = ta.value; setAtt(u, a); };
    c.append(ta);
    return c;
  }
}

/* --- النتيجة بعد التسليم --- */
function resultView(u, a) {
  const ex = u.exam, notes = u.keyk.mcqNotes || [];
  const w = el('div', 'test');
  let right = 0;
  ex.mcq.forEach((it, i) => { if (a.mcq[i] === it.a) right++; });
  const mcqMark = right * 1.5;
  const head = el('div', 'thead done');
  head.append(el('strong', '', 'تمّ تسليم الاختبار' + (a.auto ? ' تلقائيًّا ( انتهى الوقت )' : '')),
    el('span', '', 'وقت التسليم ' + hhmm(a.submitted)));
  w.append(head);
  const tot = el('div', 'score big', '');
  w.append(tot);
  w.append(el('p', 'hint', 'ظهرت الآن الإجابات الصحيحة . قارن إجابتك بالإجابة النموذجية في السؤالين الثاني والثالث وضع علامتك التقديرية ، ثم اعرض الشاشة على المعلّم.'));

  w.append(el('h2', 'lvl', 'السؤال الأول : اختيار من متعدد ( 15 علامة )'));
  ex.mcq.forEach((it, i) => {
    const c = el('div', 'card2');
    c.append(el('p', 'qq', `<b>${i + 1} )</b> ${fmt(it.q)}`));
    const opts = el('div', 'opts');
    it.o.forEach((o, j) => {
      const cls = AR[j] === it.a ? ' right' : (a.mcq[i] === AR[j] ? ' wrong' : '');
      opts.append(el('div', 'opt res' + cls, `<span>${AR[j]}</span> ${fmt(o)}`));
    });
    c.append(opts);
    const ok = a.mcq[i] === it.a;
    const fb = el('div', 'fb ' + (ok ? 'g' : 'r'), ok ? '✔ إجابة صحيحة' : (a.mcq[i] ? '✘ إجابتك : ' + a.mcq[i] + ' — الصحيحة : ' + it.a : '— لم تُجب . الإجابة الصحيحة : ' + it.a));
    const nt = notes.find(t => t.includes(`(${i + 1})`));
    if (nt) fb.insertAdjacentHTML('beforeend', `<div class="note">${fmt(nt.replace(/^الفقرة \(\d+\) : /, ''))}</div>`);
    c.append(fb);
    w.append(c);
  });

  w.append(el('h2', 'lvl', 'السؤال الثاني : أُجيب عمّا يأتي ( 8 علامات )'));
  ex.q2.forEach((it, i) => w.append(essayRes(it, 'q2-' + i, i + 1)));
  w.append(el('h2', 'lvl', `السؤال الثالث : ${esc(ex.x.q3Title)} ( 17 علامة )`));
  ex.q3.forEach((it, i) => w.append(essayRes(it, 'q3-' + i, i + 1)));

  const f = el('div', 'btns2');
  const pr = el('button', 'btn ghost', 'طباعة / حفظ PDF');
  pr.onclick = () => window.print();
  f.append(pr);
  if (isTeacher()) {
    const rs = el('button', 'btn ghost', 'مسح المحاولة ( هذا الجهاز )');
    rs.onclick = () => { const p = prog(u.id); delete p.att; save(); render(); };
    f.append(rs);
  }
  w.append(f);
  tally();
  return w;

  function essayRes(it, k, i) {
    const c = el('div', 'card2');
    c.append(el('p', 'qq', `<b>${i} )</b> ${fmt(it.q)} <em class="m">( ${esc(it.m)} علامات )</em>`));
    if (it.tbl) c.append(nodeEl({ t: 'table', rows: it.tbl }));
    c.append(el('div', 'mine', `<div class="mt">إجابتك :</div>${esc(a.essay[k] || '( لم تكتب إجابة )').replace(/\n/g, '<br>')}`));
    const ans = el('div', 'ans');
    ans.append(el('div', 'mt', 'الإجابة النموذجية :'));
    (it.a || []).forEach(x => ans.insertAdjacentHTML('beforeend', line(x)));
    c.append(ans);
    const max = parseFloat(String(it.m).replace(/[^0-9.]/g, '')) || 0;
    const sel = el('select', 'mark');
    for (let v = 0; v <= max * 2; v++) { const o = el('option', '', String(v / 2)); o.value = String(v / 2); sel.append(o); }
    sel.value = String(a.self[k] ?? 0);
    sel.onchange = () => { a.self[k] = +sel.value; setAtt(u, a); tally(); };
    const row = el('div', 'frow');
    const l = el('label', 'fl'); l.append(el('span', '', 'علامتي التقديرية من ' + max), sel);
    row.append(l);
    c.append(row);
    return c;
  }
  function tally() {
    const self = Object.values(a.self || {}).reduce((x, y) => x + (+y || 0), 0);
    tot.innerHTML = `<b>اختيار من متعدد :</b> ${right} من ${ex.mcq.length} · ${mcqMark.toFixed(1)} من 15
      &nbsp;|&nbsp; <b>المقالي ( تقدير ذاتي ) :</b> ${self.toFixed(1)} من 25
      &nbsp;|&nbsp; <b>المجموع :</b> ${(mcqMark + self).toFixed(1)} من 40`;
  }
}

/* ---------- قسم المعلّم ---------- */
function teacherView(u) {
  const w = el('div');
  const k = u.keyk, ex = u.exam;

  /* مولّد رمز الاختبار */
  const box = el('div', 'box gold');
  box.append(el('div', 'bt', 'فتح الاختبار للطلبة'));
  box.append(el('p', '', 'حدّد مدة الاختبار ومهلة الدخول ، ثم اكتب الرمز على السبورة . لن يُفتح الاختبار عند الطالب إلا بهذا الرمز ، وتظهر له الإجابات بعد التسليم فقط.'));
  const row = el('div', 'frow');
  const dur = el('input'); dur.type = 'number'; dur.value = 45; dur.className = 'num';
  const win = el('input'); win.type = 'number'; win.value = 15; win.className = 'num';
  row.append(lab('مدة الاختبار ( دقيقة )', dur), lab('مهلة الدخول ( دقيقة )', win));
  const gen = el('button', 'btn', 'توليد الرمز');
  const out = el('div', 'tkout');
  gen.onclick = () => {
    const d = Math.max(1, Math.min(180, +dur.value || 45));
    const m = Math.max(1, Math.min(240, +win.value || 15));
    const exp = Date.now() + m * 60000;
    const code = makeTicket(u.id, d, exp);
    out.innerHTML = `<div class="tkbig ltr" dir="ltr">${esc(code)}</div>
      <p class="hint">صالح للدخول حتى الساعة <b>${hhmm(exp)}</b> · مدة الاختبار <b>${d}</b> دقيقة .<br>
      من يدخل الرمز قبل هذا الوقت يبدأ عنده المؤقّت فورًا ولا يتأثر بانتهاء مهلة الدخول.</p>`;
  };
  box.append(row, gen, out);
  w.append(box);

  w.append(el('h2', 'lvl', 'جدول مواصفات الاختبار'));
  if (ex) {
    w.append(nodeEl({ t: 'table', rows: ex.spec }));
    w.append(el('p', '', fmt(ex.x.specNote)));
  }
  w.append(el('h2', 'lvl', 'إجابات الاختيار من متعدد'));
  if (ex) w.append(nodeEl({ t: 'table', rows: [['الفقرة', ...ex.mcq.map((_, i) => String(i + 1))], ['الإجابة', ...ex.mcq.map(m => m.a)]] }));
  w.append(el('h2', 'lvl', 'سلّم التصحيح'));
  w.append(nodeEl({ t: 'table', rows: [['السؤال', 'التوزيع', 'العلامة'], ...(k.scale || []), ['المجموع', '', '40']] }));
  w.append(el('h2', 'lvl', 'ملحوظات على الفقرات المُشكِلة'));
  (k.mcqNotes || []).forEach(t => w.append(el('div', 'li', fmt(t))));
  w.append(el('h2', 'lvl', 'ملحوظات للمعلّم عند التصحيح'));
  (k.notes || []).forEach(t => w.append(el('div', 'li', fmt(t))));
  return w;

  function lab(t, e) { const d = el('label', 'fl'); d.append(el('span', '', esc(t)), e); return d; }
}

/* ---------- وضع العرض ---------- */
function togglePresent() {
  S.present = !S.present;
  document.body.classList.toggle('present', S.present);
  $('#pbtn').textContent = S.present ? 'إنهاء العرض' : 'وضع العرض';
  if (S.present && document.documentElement.requestFullscreen) document.documentElement.requestFullscreen().catch(() => {});
  else if (!S.present && document.fullscreenElement) document.exitFullscreen().catch(() => {});
}
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && S.present) togglePresent();
  if (!S.present) return;
  if (e.key === 'ArrowLeft' || e.key === 'PageDown') scrollBy(0, innerHeight * 0.85);
  if (e.key === 'ArrowRight' || e.key === 'PageUp') scrollBy(0, -innerHeight * 0.85);
});

window.addEventListener('DOMContentLoaded', () => {
  $('#pbtn').onclick = togglePresent;
  $('#zin').onclick = () => zoom(1);
  $('#zout').onclick = () => zoom(-1);
  $('#out').onclick = () => { if (confirm('تسجيل الخروج ؟')) logout(); };
  setZoom(+(localStorage.getItem('dosiati-zoom') || 0));
  boot();
  if ('serviceWorker' in navigator && location.protocol.startsWith('http') && !window.__DATA__) navigator.serviceWorker.register('sw.js');
});
function zoom(d) { setZoom((+(localStorage.getItem('dosiati-zoom') || 0)) + d); }
function setZoom(z) {
  z = Math.max(-2, Math.min(6, z));
  localStorage.setItem('dosiati-zoom', z);
  document.documentElement.style.setProperty('--z', 1 + z * 0.12);
}
