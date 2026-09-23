/* دوسياتي — منطق التطبيق */
const S = { units: [], unit: null, tab: 'sum', present: false, teacher: false, q: '' };
const $ = s => document.querySelector(s);
const el = (t, c, h) => { const e = document.createElement(t); if (c) e.className = c; if (h !== undefined) e.innerHTML = h; return e; };
const norm = s => (s || '').replace(/[ً-ْـ]/g, '').replace(/[أإآٱ]/g, 'ا').replace(/ى/g, 'ي').replace(/ة/g, 'ه').replace(/[^ء-يa-zA-Z0-9 ]/g, ' ').toLowerCase();
const SUB = { '0': '₀', '1': '₁', '2': '₂', '3': '₃', '4': '₄', '5': '₅', '6': '₆', '7': '₇', '8': '₈', '9': '₉' };
const SUP = { '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴', '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹', '+': '⁺', '-': '⁻', '−': '⁻' };
const NOT_F = /^(ATP|ADP|DNA|RNA|TEM|SEM|PDF|IA|IIA|IB|AB|XY|XX|MA|KE|SI)$/;

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
    u.search = norm(JSON.stringify(u.body));
  });
  route();
}

/* ============ التخزين المحلي ============ */
const KEY = 'dosiati-v1';
const store = JSON.parse(localStorage.getItem(KEY) || '{}');
const save = () => { try { localStorage.setItem(KEY, JSON.stringify(store)); } catch (e) {} };
const prog = id => (store[id] = store[id] || { mcq: {}, seen: [], exam: {} });

/* ============ الواجهة ============ */
function route() {
  const h = location.hash.slice(1);
  const [id, tab] = h.split('/');
  S.unit = S.units.find(u => u.id === id) || null;
  S.tab = tab || 'sum';
  render();
  window.scrollTo(0, 0);
}
window.addEventListener('hashchange', route);

function render() {
  const app = $('#app');
  app.innerHTML = '';
  document.body.classList.toggle('present', S.present);
  if (!S.unit) { app.append(home()); $('#bar').style.display = 'flex'; return; }
  $('#bar').style.display = 'flex';
  app.append(unitView(S.unit));
}

/* ---------- الصفحة الرئيسة ---------- */
function home() {
  const w = el('div', 'wrap');
  w.append(el('div', 'hero', `<h1>دوسياتي</h1><p>ملخّصات ونماذج وأسئلة تفاعلية — تعمل بدون إنترنت</p>`));
  const s = el('input', 'search'); s.placeholder = 'ابحث في كل الوحدات …'; s.value = S.q;
  s.oninput = () => { S.q = s.value; list.replaceChildren(...cards()); };
  w.append(s);
  const list = el('div', 'grid');
  list.append(...cards());
  w.append(list);
  w.append(el('p', 'foot', 'إعداد المعلم محمد الطعاني — مدرسة رجم الشامي الشرقي الثانوية للبنين'));
  return w;

  function cards() {
    const q = norm(S.q);
    const groups = {};
    S.units.filter(u => !q || u.search.includes(q) || norm(u.meta.subject + ' ' + u.unit.unitTitle).includes(q))
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

/* ---------- عرض الوحدة ---------- */
const TABS = [['sum', 'الملخّص'], ['ex', 'نماذج محلولة'], ['q', 'أسئلة'], ['test', 'اختبر نفسك'], ['t', 'للمعلّم']];
function unitView(u) {
  const w = el('div', 'wrap');
  const head = el('div', 'uhead', `<a class="back" href="#">‹ الوحدات</a>
    <div><strong>${fmt(u.unit.unitTitle)}</strong><span>${esc(u.meta.subject)} — ${esc(u.meta.grade)} · ص ${fmt(u.unit.pages)}</span></div>`);
  w.append(head);
  const tabs = el('div', 'tabs');
  TABS.forEach(([k, t]) => {
    const b = el('a', 'tab' + (S.tab === k ? ' on' : ''), esc(t));
    b.href = `#${u.id}/${k}`;
    tabs.append(b);
  });
  w.append(tabs);
  const body = el('div', 'tabbody');
  if (S.tab === 'sum') body.append(...summary(u));
  if (S.tab === 'ex') body.append(...examplesView(u));
  if (S.tab === 'q') body.append(...questionsView(u));
  if (S.tab === 'test') body.append(testView(u));
  if (S.tab === 't') body.append(teacherView(u));
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
  u.chapters.forEach((ch, i) => {
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
      next.onclick = () => { if (shown < item.sol.length) { sol.insertAdjacentHTML('beforeend', line(item.sol[shown++])); } if (shown >= item.sol.length) next.disabled = true; };
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
    (arr || []).forEach(item => {
      out.push(qCard(u, item, n++));
    });
  });
  return out;
}

function qCard(u, item, n) {
  const c = el('div', 'card2');
  c.append(el('div', 'qn', `س ${n}`));
  c.append(el('p', 'qq', fmt(item.q)));
  if (item.tbl) { const t = nodeEl({ t: 'table', rows: item.tbl }); c.append(t); }
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

/* ---------- اختبر نفسك ---------- */
function testView(u) {
  const ex = u.exam;
  const w = el('div', 'test');
  if (!ex) return w;
  const p = prog(u.id);
  const head = el('div', 'thead', `<strong>اختبار نهاية الوحدة</strong><span>40 علامة · 45 دقيقة</span>`);
  const timer = el('div', 'timer', '45:00');
  let left = 45 * 60, iv = null;
  const start = el('button', 'btn', 'ابدأ المؤقّت');
  start.onclick = () => {
    if (iv) { clearInterval(iv); iv = null; start.textContent = 'تابع المؤقّت'; return; }
    start.textContent = 'إيقاف مؤقّت';
    iv = setInterval(() => {
      left--; timer.textContent = String(Math.floor(left / 60)).padStart(2, '0') + ':' + String(left % 60).padStart(2, '0');
      if (left <= 0) { clearInterval(iv); iv = null; timer.textContent = 'انتهى الوقت'; }
    }, 1000);
  };
  head.append(timer, start);
  w.append(head);

  const score = el('div', 'score', '');
  const AR = ['أ', 'ب', 'جـ', 'د'];
  const notes = u.keyk.mcqNotes || [];
  w.append(el('h2', 'lvl', 'السؤال الأول : اختيار من متعدد ( 15 علامة )'));
  ex.mcq.forEach((it, i) => {
    const c = el('div', 'card2');
    c.append(el('p', 'qq', `<b>${i + 1} )</b> ${fmt(it.q)}`));
    const opts = el('div', 'opts');
    it.o.forEach((o, j) => {
      const b = el('button', 'opt', `<span>${AR[j]}</span> ${fmt(o)}`);
      b.onclick = () => {
        if (c.dataset.done) return;
        c.dataset.done = '1';
        const ok = AR[j] === it.a;
        b.classList.add(ok ? 'right' : 'wrong');
        if (!ok) [...opts.children].forEach((x, k) => { if (AR[k] === it.a) x.classList.add('right'); });
        const nt = notes.find(t => t.includes(`(${i + 1})`));
        const fb = el('div', 'fb ' + (ok ? 'g' : 'r'), ok ? '✔ إجابة صحيحة' : '✘ الإجابة الصحيحة : ' + it.a);
        if (nt) fb.insertAdjacentHTML('beforeend', `<div class="note">${fmt(nt.replace(/^الفقرة \(\d+\) : /, ''))}</div>`);
        c.append(fb);
        p.exam[i] = ok ? 1 : 0; save(); tally();
      };
      opts.append(b);
    });
    c.append(opts);
    w.append(c);
  });
  w.append(score);
  function tally() {
    const done = Object.keys(p.exam).length, right = Object.values(p.exam).filter(Boolean).length;
    score.innerHTML = `<b>نتيجتك في الاختيار من متعدد :</b> ${right} من ${done} · العلامة ${(right * 1.5).toFixed(1)} من 15`;
  }
  tally();

  w.append(el('h2', 'lvl', 'السؤال الثاني : أُجيب عمّا يأتي ( 8 علامات )'));
  ex.q2.forEach((it, i) => w.append(essay(it, i + 1)));
  w.append(el('h2', 'lvl', `السؤال الثالث : ${esc(ex.x.q3Title)} ( 17 علامة )`));
  ex.q3.forEach((it, i) => w.append(essay(it, i + 1)));
  return w;

  function essay(it, i) {
    const c = el('div', 'card2');
    c.append(el('p', 'qq', `<b>${i} )</b> ${fmt(it.q)} <em class="m">( ${esc(it.m)} علامات )</em>`));
    if (it.tbl) c.append(nodeEl({ t: 'table', rows: it.tbl }));
    const ta = el('textarea'); ta.placeholder = 'اكتب إجابتك هنا ( اختياري ) …';
    const ans = el('div', 'ans hidden');
    (it.a || []).forEach(a => ans.insertAdjacentHTML('beforeend', line(a)));
    const b = el('button', 'btn', 'قارن بالإجابة النموذجية');
    b.onclick = () => { ans.classList.toggle('hidden'); b.textContent = ans.classList.contains('hidden') ? 'قارن بالإجابة النموذجية' : 'إخفاء'; };
    c.append(ta, b, ans);
    return c;
  }
}

/* ---------- قسم المعلّم ---------- */
function teacherView(u) {
  const w = el('div');
  if (!S.teacher) {
    const g = el('div', 'gate');
    g.innerHTML = '<p>هذا القسم للمعلّم : جدول المواصفات وسلّم التصحيح وملحوظات التصحيح.</p>';
    const i = el('input'); i.type = 'password'; i.placeholder = 'رمز الدخول';
    const b = el('button', 'btn', 'دخول');
    b.onclick = () => {
      if (i.value === (localStorage.getItem('dosiati-pin') || '2027')) { S.teacher = true; render(); }
      else { i.value = ''; i.placeholder = 'رمز غير صحيح'; }
    };
    i.onkeydown = e => { if (e.key === 'Enter') b.click(); };
    g.append(i, b);
    w.append(g);
    return w;
  }
  const k = u.keyk, ex = u.exam;
  w.append(el('h2', 'lvl', 'جدول مواصفات الاختبار'));
  if (ex) {
    w.append(nodeEl({ t: 'table', rows: ex.spec }));
    w.append(el('p', '', fmt(ex.x.specNote)));
  }
  w.append(el('h2', 'lvl', 'سلّم التصحيح'));
  w.append(nodeEl({ t: 'table', rows: [['السؤال', 'التوزيع', 'العلامة'], ...(k.scale || []), ['المجموع', '', '40']] }));
  w.append(el('h2', 'lvl', 'ملحوظات على الفقرات المُشكِلة'));
  (k.mcqNotes || []).forEach(t => w.append(el('div', 'li', fmt(t))));
  w.append(el('h2', 'lvl', 'ملحوظات للمعلّم عند التصحيح'));
  (k.notes || []).forEach(t => w.append(el('div', 'li', fmt(t))));
  const pin = el('button', 'btn ghost', 'تغيير رمز الدخول');
  pin.onclick = () => { const v = prompt('الرمز الجديد :'); if (v) { localStorage.setItem('dosiati-pin', v); alert('تم الحفظ'); } };
  const prow = el('div', 'btns2'); prow.append(pin); w.append(prow);
  return w;
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
  const z = +(localStorage.getItem('dosiati-zoom') || 0); setZoom(z);
  boot();
  if ('serviceWorker' in navigator) navigator.serviceWorker.register('sw.js');
});
function zoom(d) { setZoom((+(localStorage.getItem('dosiati-zoom') || 0)) + d); }
function setZoom(z) {
  z = Math.max(-2, Math.min(6, z));
  localStorage.setItem('dosiati-zoom', z);
  document.documentElement.style.setProperty('--z', 1 + z * 0.12);
}
