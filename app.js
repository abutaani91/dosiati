/* دوسياتي — منطق التطبيق  (v4 : لوحة تحكّم للمعلّم + صلاحيات + اختبار مؤقّت) */
const S = { units: [], unit: null, tab: 'sum', present: false, user: null, q: '', iv: null, admin: 'gen' };
const $ = s => document.querySelector(s);
const el = (t, c, h) => { const e = document.createElement(t); if (c) e.className = c; if (h !== undefined) e.innerHTML = h; return e; };
const norm = s => (s || '').replace(/[ً-ْـ]/g, '').replace(/[أإآٱ]/g, 'ا').replace(/ى/g, 'ي').replace(/ة/g, 'ه').replace(/[^ء-يa-zA-Z0-9 ]/g, ' ').toLowerCase();
const SUB = { '0': '₀', '1': '₁', '2': '₂', '3': '₃', '4': '₄', '5': '₅', '6': '₆', '7': '₇', '8': '₈', '9': '₉' };
const SUP = { '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴', '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹', '+': '⁺', '-': '⁻', '−': '⁻' };
const NOT_F = /^(ATP|ADP|DNA|RNA|TEM|SEM|PDF|IA|IIA|IB|AB|XY|XX|MA|KE|SI)$/;
const GRADES = { '08': 'الصف الثامن', '09': 'الصف التاسع', '10': 'الصف العاشر' };
const GORDER = ['08', '09', '10'];
const TERMS = { '01': 'الفصل الأول', '02': 'الفصل الثاني', '03': 'الفصل الصيفي' };
const gradeNo = g => /ثامن/.test(g) ? '08' : /تاسع/.test(g) ? '09' : /عاشر/.test(g) ? '10' : '';
const clone = o => JSON.parse(JSON.stringify(o));
const hash = s => { let h = 5381; for (const c of String(s)) h = ((h * 33) ^ c.charCodeAt(0)) >>> 0; return h.toString(36); };

/* ============ الإعدادات ============ */
const DEF = {
  year: 2027, term: '01', checkYear: true, checkTerm: false,
  school: 'مدرسة رجم الشامي الشرقي الثانوية للبنين', teacherName: 'المعلم محمد الطعاني',
  pinHash: hash('2027'),
  lock: false, lockMsg: 'التطبيق مغلق مؤقتًا . راجع معلّمك.',
  grades: { '08': { on: true, max: 60 }, '09': { on: true, max: 60 }, '10': { on: true, max: 60 } },
  perm: { search: true, present: true, print: true, qa: true, retake: false },
  exam: { dur: 45, win: 15 },
  units: {},
  salt: 'dosiati',
  roster: [],              // [{h, e, g, s, n}]  h=بصمة الرمز ، e=الاسم مشفّرًا برمز صاحبه
  log: { url: '', key: '', on: true }
};
let SET = clone(DEF);
const DEF_UNIT = { on: true, sum: true, ex: true, q: true, qa: true, test: true };
const uset = id => Object.assign({}, DEF_UNIT, SET.units[id] || {});
function merge(base, add) {
  if (!add || typeof add !== 'object') return base;
  Object.keys(add).forEach(k => {
    if (add[k] && typeof add[k] === 'object' && !Array.isArray(add[k])) base[k] = merge(base[k] && typeof base[k] === 'object' ? base[k] : {}, add[k]);
    else base[k] = add[k];
  });
  return base;
}
async function loadSettings() {
  SET = clone(DEF);
  if (window.__SETTINGS__) merge(SET, window.__SETTINGS__);
  else {
    try { const r = await fetch('settings.json', { cache: 'no-store' }); if (r.ok) merge(SET, await r.json()); } catch (e) {}
  }
  try { const l = JSON.parse(localStorage.getItem('dosiati-settings') || 'null'); if (l) merge(SET, l); } catch (e) {}
}
function saveSettings(s) { SET = s; try { localStorage.setItem('dosiati-settings', JSON.stringify(s)); } catch (e) {} }

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

/* ============ الهوية ============ */
function readCode(v) {
  const t = String(v || '').replace(/[^0-9]/g, '');
  if (t.length < 9 || t.length > 12) return null;
  const year = +t.slice(0, 4), term = t.slice(4, 6), grade = t.slice(6, 8), no = t.slice(8);
  if (SET.checkYear && year !== +SET.year) return null;
  if (year < 2020 || year > 2060) return null;
  if (!TERMS[term]) return null;
  if (SET.checkTerm && term !== SET.term) return null;
  const g = SET.grades[grade];
  if (!g || !g.on) return null;
  if (!/^[0-9]{1,4}$/.test(no) || +no < 1 || +no > (+g.max || 999)) return null;
  const u = { code: t, year, term, grade, no: String(+no) };
  const h = hash(t);
  const row = (SET.roster || []).find(r => r.h === h);
  if (row) { u.name = decName(row.e, t); u.sec = row.s || ''; }
  if ((SET.roster || []).length && !row) return null;   // القائمة موجودة فالرمز لا بدّ أن يكون فيها
  return u;
}
const userKey = 'dosiati-user';
function loadUser() { try { return JSON.parse(localStorage.getItem(userKey) || 'null'); } catch (e) { return null; } }
function setUser(u) { S.user = u; try { localStorage.setItem(userKey, JSON.stringify(u)); } catch (e) {} }
function logout() { try { localStorage.removeItem(userKey); } catch (e) {} S.user = null; location.hash = ''; render(); }
const isTeacher = () => !!(S.user && S.user.teacher);
const okPin = v => hash(String(v)) === SET.pinHash || String(v) === localStorage.getItem('dosiati-pin');

/* ============ أسماء الطلبة : إخفاء بمفتاح رمز الطالب ============ */
function rng(seed) { let x = (seed >>> 0) || 1; return () => { x ^= x << 13; x >>>= 0; x ^= x >>> 17; x ^= x << 5; x >>>= 0; return x & 255; }; }
const seedOf = code => parseInt(hash(code + '#' + (SET.salt || '')), 36) >>> 0;
function encName(name, code) {
  const r = rng(seedOf(code));
  const b = new TextEncoder().encode(String(name));
  let out = ''; b.forEach(x => { out += String.fromCharCode(x ^ r()); });
  return btoa(out);
}
function decName(b64, code) {
  try {
    const r = rng(seedOf(code));
    const bin = atob(b64);
    const a = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) a[i] = bin.charCodeAt(i) ^ r();
    return new TextDecoder().decode(a);
  } catch (e) { return ''; }
}
const codeOf = (g, n, year, term) => String(year || SET.year) + (term || SET.term) + g + String(n).padStart(2, '0');
function nameOf(code) {
  const h = hash(code);
  const row = (SET.roster || []).find(r => r.h === h);
  return row ? decName(row.e, code) : '';
}
function rosterOf(g) {
  return (SET.roster || []).filter(r => r.g === g).map(r => {
    const code = codeOf(r.g, r.n);
    return { no: r.n, sec: r.s || '', code, name: decName(r.e, code) || '( بلا اسم )' };
  }).sort((a, b) => (+a.no) - (+b.no));
}

/* ============ تسجيل أحداث الطلبة ============ */
const LOGQ = 'dosiati-logq', LOGL = 'dosiati-events';
function lsGet(k) { try { return JSON.parse(localStorage.getItem(k) || '[]'); } catch (e) { return []; } }
function lsPut(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
function logEvent(type, unit, detail, score) {
  if (!S.user || isTeacher() || !SET.log || SET.log.on === false) return;
  const e = { t: Date.now(), code: S.user.code, name: S.user.name || '', g: S.user.grade, s: S.user.sec || '', n: S.user.no, type, unit: unit || '', detail: detail || '', score: (score === undefined ? '' : score) };
  const loc = lsGet(LOGL); loc.push(e); lsPut(LOGL, loc.slice(-800));
  const q = lsGet(LOGQ); q.push(e); lsPut(LOGQ, q.slice(-400));
  flushLog();
}
let flushing = false;
function flushLog() {
  const url = (SET.log || {}).url;
  if (!url || flushing) return;
  const q = lsGet(LOGQ);
  if (!q.length) return;
  flushing = true;
  fetch(url, { method: 'POST', body: JSON.stringify({ k: (SET.log || {}).key || '', rows: q }) })
    .then(r => r.text()).then(() => { lsPut(LOGQ, lsGet(LOGQ).slice(q.length)); })
    .catch(() => {})
    .then(() => { flushing = false; });
}
window.addEventListener('online', flushLog);

/* ============ رمز الاختبار ============ */
const B36 = '0123456789abcdefghijklmnopqrstuvwxyz';
const b36 = (n, w) => { let s = ''; n = Math.max(0, Math.floor(n)); while (n > 0) { s = B36[n % 36] + s; n = Math.floor(n / 36); } return s.padStart(w, '0').slice(-w); };
const un36 = s => [...s].reduce((a, c) => a * 36 + B36.indexOf(c), 0);
const chk = s => B36[[...s].reduce((a, c) => a + B36.indexOf(c), 0) % 36];
const uhash = id => { let h = 0; for (const c of id) h = (h * 33 + c.charCodeAt(0)) % 1296; return b36(h, 2); };
const TEPOCH = Date.UTC(2025, 0, 1) / 60000;
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


/* ============ كود Apps Script الجاهز ============ */
const GS_CODE = [
"/**  متابعة دوسياتي — Google Apps Script  **/",
"const KEY = 'ضع-كلمة-السر-هنا';   // يجب أن تطابق المفتاح في لوحة المعلّم",
"const HEAD = ['الوقت','رمز الطالب','الاسم','الصف','الشعبة','الرقم','الحدث','الوحدة','تفصيل','العلامة'];",
"",
"function sheet_() {",
"  const ss = SpreadsheetApp.getActiveSpreadsheet();",
"  let sh = ss.getSheetByName('الأحداث');",
"  if (!sh) { sh = ss.insertSheet('الأحداث'); sh.appendRow(HEAD); }",
"  return sh;",
"}",
"",
"function doPost(e) {",
"  try {",
"    const d = JSON.parse(e.postData.contents || '{}');",
"    if (d.k !== KEY) return out_({ error: 'key' });",
"    const sh = sheet_();",
"    const rows = (d.rows || []).map(function (r) {",
"      return [new Date(r.t), r.code, r.name, r.g, r.s, r.n, r.type, r.unit, r.detail, r.score];",
"    });",
"    if (rows.length) sh.getRange(sh.getLastRow() + 1, 1, rows.length, HEAD.length).setValues(rows);",
"    return out_({ ok: true, n: rows.length });",
"  } catch (err) { return out_({ error: String(err) }); }",
"}",
"",
"function doGet(e) {",
"  if ((e.parameter.k || '') !== KEY) return out_({ error: 'key' });",
"  const sh = sheet_();",
"  const v = sh.getDataRange().getValues();",
"  v.shift();",
"  const rows = v.map(function (r) {",
"    return { t: new Date(r[0]).getTime(), code: String(r[1]), name: r[2], g: String(r[3]), s: r[4], n: String(r[5]), type: r[6], unit: r[7], detail: r[8], score: r[9] };",
"  });",
"  return out_({ rows: rows });",
"}",
"",
"function out_(o) {",
"  return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON);",
"}"
].join('\n');

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
  await loadSettings();
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
  flushLog();
  route();
}

/* ============ التوجيه ============ */
function route() {
  const h = decodeURIComponent(location.hash.slice(1));
  const [id, tab] = h.split('/');
  S.adminPage = (id === '!admin');
  if (!S.adminPage) S.draft = null;
  S.unit = S.adminPage ? null : (S.units.find(u => u.id === id) || null);
  if (S.unit && !isTeacher()) {
    if (S.unit.gno !== (S.user || {}).grade || !uset(S.unit.id).on) S.unit = null;
  }
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
  if (isTeacher() && S.adminPage) { app.append(adminView()); return; }
  if (!S.unit) { app.append(home()); return; }
  app.append(unitView(S.unit));
}

function bar() {
  const who = $('#who'), out = $('#out'), pb = $('#pbtn');
  pb.style.display = (S.user && !isTeacher() && !SET.perm.present) ? 'none' : '';
  if (!S.user) { who.textContent = ''; out.style.display = 'none'; return; }
  who.textContent = isTeacher() ? 'المعلّم' : ((S.user.name ? S.user.name.split(' ')[0] + ' · ' : '') + GRADES[S.user.grade] + ' · ' + S.user.no);
  out.style.display = '';
}

/* ---------- شاشة الدخول ---------- */
function loginView() {
  const w = el('div', 'wrap');
  w.append(el('div', 'hero', `<h1>دوسياتي</h1><p>ملخّصات ونماذج وأسئلة تفاعلية — تعمل بدون إنترنت</p>`));
  const g = el('div', 'gate big');
  const teacherMode = !!S.loginTeacher;
  g.append(el('p', '', teacherMode ? 'دخول المعلّم : أدخل رمزك.' : 'أدخل رمز الدخول الخاص بك.'));
  const i = el('input');
  if (teacherMode) { i.type = 'password'; } else { i.type = 'tel'; i.inputMode = 'numeric'; }
  i.placeholder = teacherMode ? 'رمز المعلّم' : 'رمز الدخول';
  i.setAttribute('dir', 'ltr'); i.id = 'code'; i.autocomplete = 'off';
  const msg = el('p', 'err', '');
  const b = el('button', 'btn', 'دخول');
  b.onclick = () => {
    const v = i.value.trim();
    if (v && okPin(v)) { setUser({ teacher: true }); openStore(); S.loginTeacher = false; location.hash = ''; render(); return; }
    if (teacherMode) { msg.textContent = 'رمز غير صحيح.'; i.select(); return; }
    if (SET.lock) { msg.textContent = SET.lockMsg || 'الدخول مغلق حاليًّا.'; return; }
    const u = readCode(v);
    if (!u) { msg.textContent = 'رمز غير صحيح.'; i.select(); return; }
    setUser(u); openStore(); location.hash = '';
    logEvent('login');
    render();
  };
  i.onkeydown = e => { if (e.key === 'Enter') b.click(); };
  g.append(i, b, msg);
  const sep = el('div', 'sep', teacherMode ? 'رجوع' : 'أو');
  g.append(sep);
  const tb = el('button', 'btn dark', teacherMode ? '‹ دخول الطلبة' : '🔑  دخول المعلّم');
  tb.onclick = () => { S.loginTeacher = !teacherMode; render(); };
  g.append(tb);
  w.append(g);
  w.append(el('p', 'foot', esc(SET.teacherName) + (SET.school ? ' — ' + esc(SET.school) : '')));
  setTimeout(() => i.focus(), 50);
  return w;
}

/* ---------- الصفحة الرئيسة ---------- */
function home() {
  const w = el('div', 'wrap');
  const sub = isTeacher() ? 'وضع المعلّم — جميع الصفوف والاختبارات'
    : GRADES[S.user.grade] + (S.user.sec ? ' · الشعبة ' + S.user.sec : '') + ' · ' + (TERMS[S.user.term] || '') + ' · رقمك ' + S.user.no;
  const head = isTeacher() ? 'دوسياتي' : (S.user.name ? 'أهلًا ' + S.user.name : 'دوسياتي');
  w.append(el('div', 'hero', `<h1>${esc(head)}</h1><p>${esc(sub)}</p>`));
  if (isTeacher()) {
    const row = el('div', 'btns2');
    const a = el('button', 'btn', 'لوحة التحكّم');
    a.onclick = () => { S.admin = 'gen'; location.hash = '!admin'; };
    const c = el('button', 'btn ghost', 'أكواد الطلبة');
    c.onclick = () => { S.admin = 'codes'; location.hash = '!admin'; };
    row.append(a, c);
    w.append(row);
  }
  if (isTeacher() || SET.perm.search) {
    const s = el('input', 'search'); s.placeholder = 'ابحث في الوحدات …'; s.value = S.q;
    s.oninput = () => { S.q = s.value; list.replaceChildren(...cards()); };
    w.append(s);
  }
  const list = el('div', 'grid');
  list.append(...cards());
  w.append(list);
  w.append(el('p', 'foot', esc(SET.teacherName) + (SET.school ? ' — ' + esc(SET.school) : '')));
  return w;

  function cards() {
    const q = norm(S.q);
    const mine = S.units.filter(u => isTeacher() ? true : (u.gno === S.user.grade && uset(u.id).on));
    const groups = {};
    mine.filter(u => !q || u.search.includes(q) || norm(u.meta.subject + ' ' + u.unit.unitTitle).includes(q))
      .forEach(u => { (groups[u.meta.grade] = groups[u.meta.grade] || []).push(u); });
    const out = [];
    Object.keys(groups).forEach(g => {
      out.push(el('h2', 'grade', esc(g)));
      const row = el('div', 'row');
      groups[g].forEach(u => {
        const hid = isTeacher() && !uset(u.id).on;
        const c = el('a', 'card' + (hid ? ' off' : ''));
        c.href = '#' + u.id;
        c.innerHTML = `<span class="sub">${esc(u.meta.subject)}</span>
          <strong>${fmt(u.unit.unitTitle)}</strong>
          <span class="meta">الوحدة ${esc(u.unit.unitNo.replace(/ـ/g, ''))} · ص ${fmt(u.unit.pages)} · ${fmt(u.unit.periods)}</span>
          ${hid ? '<span class="tag">مخفيّة عن الطلبة</span>' : ''}`;
        row.append(c);
      });
      out.push(row);
    });
    if (!out.length) out.push(el('p', 'empty', 'لا توجد وحدات متاحة حاليًّا.'));
    return out;
  }
}

/* ================= لوحة التحكّم ================= */
const ADMIN_TABS = [['follow', 'متابعة الطلبة'], ['roster', 'قائمة الطلبة'], ['gen', 'إعدادات عامة'], ['perm', 'صلاحيات الطلبة'], ['units', 'الوحدات'], ['exam', 'الاختبار'], ['link', 'الربط والإرسال'], ['file', 'حفظ ونشر']];
function adminView() {
  const D = S.draft || (S.draft = clone(SET));
  const w = el('div', 'wrap');
  w.append(el('div', 'uhead', `<a class="back" href="#">‹ الرئيسة</a><div><strong>لوحة التحكّم</strong><span>كل ما تغيّره هنا يُحفظ على هذا الجهاز ، ولنشره للطلبة نزّل ملف الإعدادات وارفعه إلى الموقع.</span></div>`));
  const tabs = el('div', 'tabs');
  ADMIN_TABS.forEach(([k, t]) => {
    const b = el('a', 'tab' + (S.admin === k ? ' on' : ''));
    b.textContent = t; b.href = 'javascript:void 0';
    b.onclick = () => { S.admin = k; render(); };
    tabs.append(b);
  });
  w.append(tabs);
  const body = el('div', 'tabbody');
  w.append(body);

  const bar2 = el('div', 'savebar');
  const sv = el('button', 'btn', 'حفظ التغييرات');
  sv.onclick = () => { saveSettings(clone(D)); S.draft = clone(SET); flash('تمّ الحفظ على هذا الجهاز.'); render(); };
  const dl = el('button', 'btn ghost', 'تنزيل ملف الإعدادات');
  dl.onclick = () => download(D);
  bar2.append(sv, dl);
  w.append(bar2);

  if (S.admin === 'follow') follow();
  if (S.admin === 'roster') rosterTab();
  if (S.admin === 'link') linkTab();
  if (S.admin === 'gen') general();
  if (S.admin === 'perm') perms();
  if (S.admin === 'units') units();
  if (S.admin === 'exam') examSet();
  if (S.admin === 'file') filePage();
  return w;

  /* --- أدوات بناء الحقول --- */
  function sec(title, note) {
    const b = el('div', 'box mint');
    b.append(el('div', 'bt', title));
    if (note) b.append(el('p', 'hint', note));
    body.append(b);
    return b;
  }
  function fnum(par, label, obj, key, min, max) {
    const i = el('input'); i.type = 'number'; i.className = 'num'; i.value = obj[key];
    if (min !== undefined) i.min = min; if (max !== undefined) i.max = max;
    i.oninput = () => { obj[key] = +i.value; };
    par.append(wrapLab(label, i)); return i;
  }
  function ftxt(par, label, obj, key, ph) {
    const i = el('input'); i.type = 'text'; i.className = 'wide'; i.value = obj[key] || ''; if (ph) i.placeholder = ph;
    i.oninput = () => { obj[key] = i.value; };
    par.append(wrapLab(label, i)); return i;
  }
  function fsel(par, label, obj, key, map) {
    const s = el('select');
    Object.keys(map).forEach(k => { const o = el('option', '', map[k]); o.value = k; s.append(o); });
    s.value = obj[key];
    s.onchange = () => { obj[key] = s.value; };
    par.append(wrapLab(label, s)); return s;
  }
  function fchk(par, label, obj, key, note) {
    const l = el('label', 'chk');
    const i = el('input'); i.type = 'checkbox'; i.checked = !!obj[key];
    i.onchange = () => { obj[key] = i.checked; };
    l.append(i, el('span', '', esc(label) + (note ? ` <em class="sm">${esc(note)}</em>` : '')));
    par.append(l); return i;
  }
  function wrapLab(t, e) { const d = el('label', 'fl'); d.append(el('span', '', esc(t)), e); return d; }
  function frow(par) { const r = el('div', 'frow'); par.append(r); return r; }

  /* --- التبويبات --- */
  function general() {
    const b = sec('السنة والفصل', 'تُستعمل في التحقّق من أكواد الطلبة وفي توليدها.');
    const r = frow(b);
    fnum(r, 'السنة', D, 'year', 2020, 2060);
    fsel(r, 'الفصل الحالي', D, 'term', TERMS);
    fchk(b, 'لا تقبل إلا أكواد هذه السنة', D, 'checkYear');
    fchk(b, 'لا تقبل إلا أكواد الفصل الحالي', D, 'checkTerm', '( يمنع أكواد الفصل السابق )');

    const b2 = sec('الترويسة');
    const r2 = frow(b2);
    ftxt(r2, 'اسم المعلّم', D, 'teacherName');
    ftxt(r2, 'اسم المدرسة', D, 'school');

    const b3 = sec('الصفوف', 'أطفئ الصف الذي لا تدرّسه ، وحدّد أعلى رقم طالب لمنع الأكواد العشوائية.');
    GORDER.forEach(g => {
      D.grades[g] = D.grades[g] || { on: true, max: 60 };
      const r3 = frow(b3);
      const l = el('label', 'chk');
      const i = el('input'); i.type = 'checkbox'; i.checked = !!D.grades[g].on;
      i.onchange = () => { D.grades[g].on = i.checked; };
      l.append(i, el('span', '', GRADES[g]));
      r3.append(l);
      fnum(r3, 'أعلى رقم طالب', D.grades[g], 'max', 1, 999);
    });

    const b4 = sec('رمز المعلّم', 'اتركه فارغًا للإبقاء على الرمز الحالي . يُحفظ مشفّرًا تشفيرًا بسيطًا ، وهو حماية تنظيمية لا أمنية.');
    const pi = el('input'); pi.type = 'text'; pi.placeholder = 'رمز جديد'; pi.className = 'num';
    const pb = el('button', 'btn ghost', 'تغيير الرمز');
    pb.onclick = () => {
      const v = pi.value.trim();
      if (!v) return flash('اكتب الرمز الجديد أولًا.');
      if (/^[0-9]{9,12}$/.test(v)) return flash('لا تجعل رمزك بطول أكواد الطلبة.');
      D.pinHash = hash(v); localStorage.removeItem('dosiati-pin'); pi.value = '';
      flash('تغيّر الرمز . اضغط « حفظ التغييرات ».');
    };
    const r4 = frow(b4); r4.append(wrapLab('الرمز الجديد', pi), pb);

    const b5 = sec('إغلاق مؤقّت');
    fchk(b5, 'أغلق دخول الطلبة مؤقّتًا', D, 'lock');
    ftxt(b5, 'الرسالة التي تظهر لهم', D, 'lockMsg');
  }

  function perms() {
    const b = sec('ما هو متاح للطالب', 'ينطبق على جميع الطلبة . إعدادات كل وحدة على حدة في تبويب « الوحدات ».');
    fchk(b, 'إظهار إجابات تبويب « أسئلة »', D.perm, 'qa', '( إن أطفأتها بقيت الأسئلة بلا حلول )');
    fchk(b, 'السماح بالبحث في الوحدات', D.perm, 'search');
    fchk(b, 'السماح بوضع العرض وتكبير الخطّ', D.perm, 'present');
    fchk(b, 'السماح بطباعة ورقة النتيجة', D.perm, 'print');
    fchk(b, 'السماح بإعادة محاولة الاختبار برمز جديد', D.perm, 'retake', '( الأصل : محاولة واحدة )');
  }

  function units() {
    const b = sec('إظهار الوحدات وتبويباتها', 'الوحدة المطفأة لا تظهر للطالب إطلاقًا . والتبويب المطفأ يختفي من وحدته.');
    const cols = [['on', 'إظهار'], ['sum', 'الملخّص'], ['ex', 'نماذج'], ['q', 'أسئلة'], ['qa', 'حلول الأسئلة'], ['test', 'الاختبار']];
    GORDER.forEach(g => {
      const list = S.units.filter(u => u.gno === g);
      if (!list.length) return;
      b.append(el('h3', '', GRADES[g]));
      const bt = el('div', 'btns');
      const on = el('button', 'btn ghost sm', 'إظهار الكل');
      const off = el('button', 'btn ghost sm', 'إخفاء الكل');
      on.onclick = () => { list.forEach(u => { D.units[u.id] = Object.assign({}, DEF_UNIT, D.units[u.id] || SET.units[u.id] || {}, { on: true }); }); render(); };
      off.onclick = () => { list.forEach(u => { D.units[u.id] = Object.assign({}, DEF_UNIT, D.units[u.id] || SET.units[u.id] || {}, { on: false }); }); render(); };
      bt.append(on, off); b.append(bt);
      const t = el('table', 'perm');
      const hr = el('tr'); hr.append(el('th', '', 'الوحدة')); cols.forEach(c => hr.append(el('th', '', c[1]))); t.append(hr);
      list.forEach(u => {
        const cfg = Object.assign({}, DEF_UNIT, SET.units[u.id] || {}, D.units[u.id] || {});
        
        D.units[u.id] = cfg;
        const tr = el('tr');
        tr.append(el('td', '', `<b>${esc(u.meta.subject)}</b><br>${fmt(u.unit.unitTitle)}`));
        cols.forEach(([k]) => {
          const td = el('td', 'c');
          const i = el('input'); i.type = 'checkbox'; i.checked = !!cfg[k];
          i.onchange = () => { cfg[k] = i.checked; };
          td.append(i); tr.append(td);
        });
        t.append(tr);
      });
      const tw = el('div', 'tw'); tw.append(t); b.append(tw);
    });
  }

  function examSet() {
    const b = sec('الاختبار', 'هذه قيم افتراضية تظهر لك في شاشة توليد رمز الاختبار داخل كل وحدة.');
    const r = frow(b);
    fnum(r, 'مدة الاختبار ( دقيقة )', D.exam, 'dur', 1, 180);
    fnum(r, 'مهلة الدخول ( دقيقة )', D.exam, 'win', 1, 240);
    b.append(el('p', 'hint', 'تذكير : لا يُفتح الاختبار عند الطالب إلا برمز تولّده أنت من تبويب « للمعلّم » داخل الوحدة ، ولا تظهر له الإجابات إلا بعد التسليم.'));
    const b2 = sec('محاولات هذا الجهاز');
    const cl = el('button', 'btn ghost', 'مسح كل محاولات هذا الجهاز');
    cl.onclick = () => { if (confirm('مسح محاولات الاختبار المحفوظة على هذا الجهاز ؟')) { Object.keys(store).forEach(k => delete store[k].att); save(); flash('تمّ المسح.'); } };
    b2.append(cl);
  }

  function codes() {
    const b = sec('توليد أكواد الطلبة', 'وزّع على كل طالب رمزه فقط ؛ لا يحتاج أن يعرف معناه.');
    const r = frow(b);
    const yr = el('input'); yr.type = 'number'; yr.value = D.year; yr.className = 'num';
    const ts = el('select'); Object.keys(TERMS).forEach(k => { const o = el('option', '', TERMS[k]); o.value = k; ts.append(o); }); ts.value = D.term;
    const gs = el('select'); GORDER.forEach(k => { const o = el('option', '', GRADES[k]); o.value = k; gs.append(o); });
    const n1 = el('input'); n1.type = 'number'; n1.value = 1; n1.className = 'num';
    const n2 = el('input'); n2.type = 'number'; n2.value = 30; n2.className = 'num';
    r.append(wrapLab('السنة', yr), wrapLab('الفصل', ts), wrapLab('الصف', gs), wrapLab('من', n1), wrapLab('إلى', n2));
    const gen = el('button', 'btn', 'توليد القائمة');
    const out = el('div', 'codes');
    gen.onclick = () => {
      out.innerHTML = '';
      const t = el('table');
      const hr = el('tr'); ['#', 'رمز الدخول', 'اسم الطالب'].forEach(x => hr.append(el('th', '', x))); t.append(hr);
      for (let i = +n1.value; i <= +n2.value && i - +n1.value < 200; i++) {
        const code = String(yr.value) + ts.value + gs.value + String(i).padStart(2, '0');
        const tr = el('tr'); [i, code, ''].forEach(x => tr.append(el('td', '', esc(String(x))))); t.append(tr);
      }
      const tw = el('div', 'tw'); tw.append(t);
      out.append(el('p', 'hint', `${GRADES[gs.value]} — ${TERMS[ts.value]} ${yr.value}`), tw);
      const pb = el('button', 'btn ghost', 'طباعة القائمة');
      pb.onclick = () => printList(out.innerHTML);
      out.append(pb);
    };
    b.append(gen, out);
  }

  /* ---------- متابعة الطلبة ---------- */
  function follow() {
    const b = sec('متابعة الطلبة', 'مَن دخل ومَن لم يدخل ، وماذا فتح ، وعلاماته في اختبارات الوحدات.');
    const g = S.fg || (S.fg = '09');
    const row = frow(b);
    const gs = el('select'); GORDER.forEach(k => { const o = el('option', '', GRADES[k]); o.value = k; gs.append(o); });
    gs.value = g; gs.onchange = () => { S.fg = gs.value; render(); };
    row.append(wrapLab('الصف', gs));
    const rf = el('button', 'btn sm', '⟳ تحديث من الجدول');
    rf.onclick = () => pullRows(true);
    const xl = el('button', 'btn sm ghost', '⬇ تصدير Excel ( CSV )');
    const js = el('button', 'btn sm ghost', '⬇ نسخة للسجلّ ( JSON )');
    row.append(rf, xl, js);
    const info = el('p', 'hint', '');
    b.append(info);

    const list = rosterOf(g);
    if (!list.length) { b.append(el('p', 'empty', 'لا توجد أسماء لهذا الصف . أضفها من تبويب « قائمة الطلبة ».')); return; }
    const rows = allRows();
    const agg = aggregate(rows);
    const total = S.units.filter(u => u.gno === g && uset(u.id).on).length || 1;
    const marks = lsGet2('dosiati-marks');

    const inC = list.filter(r => agg[r.code]).length;
    const exAll = list.map(r => (agg[r.code] || {}).bestPct).filter(x => x !== undefined);
    const cards = el('div', 'cards');
    cards.innerHTML = `<div class="stat"><b>${list.length}</b><span>طلبة ${GRADES[g]}</span></div>
      <div class="stat g"><b>${inC}</b><span>دخلوا التطبيق</span></div>
      <div class="stat r"><b>${list.length - inC}</b><span>لم يدخلوا</span></div>
      <div class="stat"><b>${exAll.length ? (exAll.reduce((x, y) => x + y, 0) / exAll.length).toFixed(0) + ' %' : '—'}</b><span>متوسّط الاختيار من متعدد</span></div>`;
    b.append(cards);

    const tw = el('div', 'tw');
    const t = el('table', 'follow');
    const hr = el('tr');
    ['#', 'اسم الطالب', 'الشعبة', 'آخر دخول', 'وحدات فتحها', 'حلول كشفها', 'أفضل اختبار', 'الحالة', 'البصمة'].forEach(x => hr.append(el('th', '', x)));
    t.append(hr);
    list.forEach(r => {
      const a = agg[r.code] || {};
      const tr = el('tr');
      const pct = Math.round(((a.units || new Set()).size / total) * 100);
      tr.append(el('td', '', esc(r.no)), el('td', '', esc(r.name)), el('td', '', esc(r.sec)),
        el('td', '', a.last ? when(a.last) : '—'),
        el('td', '', `${(a.units || new Set()).size} / ${total}`),
        el('td', '', String(a.reveals || 0)),
        el('td', '', a.best !== undefined ? a.best + ' / 15' : '—'),
        el('td', '', `<span class="pill ${a.last ? 'in' : 'out'}">${a.last ? 'نشِط' : 'لم يدخل'}</span>`));
      const td = el('td', 'c');
      const bt = el('button', 'btn sm ghost', 'عرض');
      bt.onclick = () => showPrint(r, a, pct, marks[r.code] || {});
      td.append(bt); tr.append(td);
      t.append(tr);
    });
    tw.append(t); b.append(tw);

    /* علامات سجلّ المتابعة */
    const b2 = sec('علامات سجلّ المتابعة ( تُدخَل أو تُلصَق من سجلي )', 'تُستعمل في بصمة الطالب . القيم من 0 إلى 100 . الترتيب : رقم الطالب ثم المتابعة ثم الواجبات ثم الأنشطة ثم السلوك.');
    const ta = el('textarea');
    ta.placeholder = '1\t90\t85\t80\t95\n2\t70\t60\t75\t80';
    ta.value = list.map(r => [r.no].concat(['follow', 'hw', 'act', 'beh'].map(k => (marks[r.code] || {})[k] ?? '')).join('\t')).join('\n');
    b2.append(ta);
    const sv2 = el('button', 'btn', 'حفظ العلامات');
    sv2.onclick = () => {
      const m = lsGet2('dosiati-marks');
      ta.value.split(/\n/).forEach(ln => {
        const c = ln.split(/[\t,;]+/).map(x => x.trim()).filter(x => x !== '');
        if (c.length < 2) return;
        const r = list.find(x => +x.no === +c[0]); if (!r) return;
        m[r.code] = { follow: +c[1] || 0, hw: +c[2] || 0, act: +c[3] || 0, beh: +c[4] || 0 };
      });
      lsPut2('dosiati-marks', m); flash('تم حفظ العلامات على هذا الجهاز.'); render();
    };
    b2.append(sv2);

    xl.onclick = () => {
      const head = ['الرقم', 'الاسم', 'الشعبة', 'آخر دخول', 'وحدات', 'حلول', 'أفضل اختبار من 15', 'المتابعة', 'الواجبات', 'الأنشطة', 'السلوك'];
      const body = list.map(r => { const a = agg[r.code] || {}, m = marks[r.code] || {};
        return [r.no, r.name, r.sec, a.last ? new Date(a.last).toLocaleString('ar-EG') : '', (a.units || new Set()).size, a.reveals || 0, a.best ?? '', m.follow ?? '', m.hw ?? '', m.act ?? '', m.beh ?? ''];
      });
      const csv = '\uFEFF' + [head].concat(body).map(r => r.map(x => '"' + String(x).replace(/"/g, '""') + '"').join(',')).join('\n');
      saveBlob(new Blob([csv], { type: 'text/csv;charset=utf-8' }), 'متابعة-' + GRADES[g] + '.csv');
    };
    js.onclick = () => {
      const out = list.map(r => { const a = agg[r.code] || {}, m = marks[r.code] || {};
        return { no: r.no, name: r.name, sec: r.sec, last: a.last || null, units: [...(a.units || [])], reveals: a.reveals || 0, best: a.best ?? null, marks: m };
      });
      saveBlob(new Blob([JSON.stringify({ grade: g, year: SET.year, term: SET.term, students: out }, null, 1)], { type: 'application/json' }), 'دوسياتي-' + GRADES[g] + '.json');
    };

    function pullRows(msg) {
      const L = SET.log || {};
      if (!L.url) { flash('لم تُضبط بيانات الجدول . افتح تبويب « الربط والإرسال ».'); return; }
      info.textContent = 'جارٍ التحديث …';
      fetch(L.url + (L.url.includes('?') ? '&' : '?') + 'k=' + encodeURIComponent(L.key || ''))
        .then(r => r.json())
        .then(d => { lsPut2('dosiati-remote', d.rows || []); info.textContent = 'آخر تحديث : ' + new Date().toLocaleTimeString('ar-EG') + ' · ' + (d.rows || []).length + ' سطرًا'; render(); })
        .catch(() => { info.textContent = 'تعذّر الاتصال بالجدول . تأكّد من الرابط والمفتاح ومن الإنترنت.'; });
    }
  }

  function allRows() {
    const rem = lsGet2('dosiati-remote');
    const loc = lsGet('dosiati-events');
    const arr = (Array.isArray(rem) ? rem : []).concat(loc);
    return arr.filter(r => r && r.code);
  }
  function aggregate(rows) {
    const o = {};
    rows.forEach(r => {
      const a = o[r.code] = o[r.code] || { units: new Set(), reveals: 0, last: 0 };
      const t = +r.t || Date.parse(r.t) || 0;
      if (t > a.last) a.last = t;
      if (r.type === 'open' && r.unit) a.units.add(r.unit);
      if (r.type === 'reveal') a.reveals++;
      if (r.type === 'exam') {
        const sc = parseFloat(r.score);
        if (!isNaN(sc) && (a.best === undefined || sc > a.best)) { a.best = sc; a.bestPct = Math.round(sc / 15 * 100); }
      }
    });
    return o;
  }
  function when(t) { const d = (Date.now() - t) / 86400000; return d < 1 ? 'اليوم ' + new Date(t).toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }) : d < 2 ? 'أمس' : 'قبل ' + Math.floor(d) + ' يومًا'; }
  function lsGet2(k) { try { return JSON.parse(localStorage.getItem(k) || '{}'); } catch (e) { return {}; } }
  function lsPut2(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
  function saveBlob(blob, name) { const a = el('a'); a.href = URL.createObjectURL(blob); a.download = name; document.body.append(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(a.href), 2000); }

  /* ---------- بصمة الطالب ---------- */
  function showPrint(r, a, pct, m) {
    const axes = [
      ['الوحدات', pct],
      ['الاختبارات', a.bestPct || 0],
      ['المتابعة', +m.follow || 0],
      ['الواجبات', +m.hw || 0],
      ['الأنشطة', +m.act || 0],
      ['السلوك', +m.beh || 0]
    ];
    const w = $('#modal') || (() => { const d = el('div'); d.id = 'modal'; document.body.append(d); return d; })();
    w.innerHTML = '';
    w.className = 'on';
    const card = el('div', 'mcard');
    card.append(el('h3', '', esc(r.name) + ' <span class="sm">— ' + GRADES[S.fg] + (r.sec ? ' · الشعبة ' + r.sec : '') + ' · رقم ' + r.no + '</span>'));
    card.append(radar(axes));
    const t = el('table');
    t.innerHTML = '<tr><th>المحور</th><th>القيمة</th></tr>' + axes.map(x => `<tr><td>${x[0]}</td><td>${x[1]} %</td></tr>`).join('');
    const tw = el('div', 'tw'); tw.append(t); card.append(tw);
    const rowb = el('div', 'btns2');
    const pr = el('button', 'btn ghost', 'طباعة البصمة');
    pr.onclick = () => window.print();
    const cl = el('button', 'btn', 'إغلاق');
    cl.onclick = () => { w.className = ''; w.innerHTML = ''; };
    rowb.append(pr, cl); card.append(rowb);
    w.append(card);
    w.onclick = e => { if (e.target === w) cl.click(); };
  }
  function radar(axes) {
    const R = 104, cx = 150, cy = 136, n = axes.length;
    const pt = (i, v) => { const ang = -Math.PI / 2 + i * 2 * Math.PI / n, rr = R * Math.max(0, Math.min(100, v)) / 100; return [cx + rr * Math.cos(ang), cy + rr * Math.sin(ang)]; };
    let g = '';
    [25, 50, 75, 100].forEach(lv => {
      const p = axes.map((_, i) => pt(i, lv).join(',')).join(' ');
      g += `<polygon points="${p}" fill="none" stroke="#DCE3EC" stroke-width="1"/>`;
    });
    axes.forEach((_, i) => { const p = pt(i, 100); g += `<line x1="${cx}" y1="${cy}" x2="${p[0]}" y2="${p[1]}" stroke="#DCE3EC"/>`; });
    const poly = axes.map((x, i) => pt(i, x[1]).join(',')).join(' ');
    g += `<polygon points="${poly}" fill="rgba(43,92,168,.28)" stroke="#2B5CA8" stroke-width="2"/>`;
    axes.forEach((x, i) => { const p = pt(i, x[1]); g += `<circle cx="${p[0]}" cy="${p[1]}" r="3.2" fill="#00205B"/>`; });
    axes.forEach((x, i) => {
      const p = pt(i, 130);
      g += `<text x="${p[0]}" y="${p[1]}" text-anchor="middle" dominant-baseline="middle" font-size="12" fill="#12243B">${x[0]}</text>`;
    });
    const d = el('div', 'radar');
    d.innerHTML = `<svg viewBox="0 0 300 285" width="100%" height="285">${g}</svg>`;
    return d;
  }

  /* ---------- قائمة الطلبة ---------- */
  function rosterTab() {
    const b = sec('قائمة الطلبة وتوليد الأكواد', 'الصق الأسماء مرّة واحدة . يُخزَّن كل اسم مُشفَّرًا برمز صاحبه ، فلا يقرؤه إلا من يملك رمز الطالب نفسه.');
    const g0 = S.rg || (S.rg = '09');
    const row = frow(b);
    const gs = el('select'); GORDER.forEach(k => { const o = el('option', '', GRADES[k]); o.value = k; gs.append(o); });
    gs.value = g0; gs.onchange = () => { S.rg = gs.value; render(); };
    const se = el('input'); se.type = 'text'; se.className = 'num'; se.value = S.rs || ''; se.placeholder = 'أ';
    se.oninput = () => { S.rs = se.value; };
    const st = el('input'); st.type = 'number'; st.className = 'num'; st.value = S.rstart || 1;
    st.oninput = () => { S.rstart = +st.value; };
    row.append(wrapLab('الصف', gs), wrapLab('الشعبة', se), wrapLab('يبدأ الترقيم من', st));
    const ta = el('textarea');
    ta.placeholder = 'الصق الأسماء سطرًا لكل طالب ، أو : الرقم ثم الاسم مفصولين بمسافة أو Tab';
    b.append(el('p', 'hint', 'الأسماء :'), ta);
    const r2 = el('div', 'btns');
    const add = el('button', 'btn', 'استيراد وتوليد الأكواد');
    add.onclick = () => {
      const lines = ta.value.split(/\n/).map(x => x.trim()).filter(Boolean);
      if (!lines.length) return flash('الصق الأسماء أولًا.');
      let n = +st.value || 1;
      D.roster = (D.roster || []).filter(r => r.g !== gs.value || (se.value && r.s !== se.value));
      lines.forEach(ln => {
        const m = ln.match(/^(\d{1,3})[\s\t.\-]+(.+)$/);
        const no = m ? m[1] : String(n);
        const name = (m ? m[2] : ln).trim();
        const code = codeOf(gs.value, no, D.year, D.term);
        D.roster.push({ h: hash(code), e: encName(name, code), g: gs.value, s: se.value || '', n: String(+no) });
        n = (+no) + 1;
      });
      flash('أُضيف ' + lines.length + ' طالبًا . اضغط « حفظ التغييرات ».');
      ta.value = ''; render();
    };
    const clr = el('button', 'btn ghost', 'حذف قائمة هذا الصف');
    clr.onclick = () => { if (confirm('حذف أسماء ' + GRADES[gs.value] + ' ؟')) { D.roster = (D.roster || []).filter(r => r.g !== gs.value); render(); } };
    const pb = el('button', 'btn ghost', '🖨 طباعة قائمة الأكواد');
    r2.append(add, clr, pb);
    b.append(r2);

    const cur = (D.roster || []).filter(r => r.g === gs.value).map(r => { const c = codeOf(r.g, r.n, D.year, D.term); return { no: r.n, s: r.s, code: c, name: decName(r.e, c) }; }).sort((a, c) => (+a.no) - (+c.no));
    const tw = el('div', 'tw codes');
    const t = el('table');
    t.innerHTML = '<tr><th>#</th><th>اسم الطالب</th><th>الشعبة</th><th>رمز الدخول</th></tr>' +
      cur.map(r => `<tr><td>${esc(r.no)}</td><td>${esc(r.name)}</td><td>${esc(r.s)}</td><td>${esc(r.code)}</td></tr>`).join('');
    tw.append(t); b.append(tw);
    b.append(el('p', 'hint', 'عدد الطلبة في هذا الصف : ' + cur.length));
    pb.onclick = () => printList('<h3>أكواد ' + GRADES[gs.value] + ' — ' + TERMS[D.term] + ' ' + D.year + '</h3>' + tw.innerHTML);
    b.append(el('div', 'box gold', '<div class="bt">ملحوظة صريحة على الخصوصية</div><p style="margin:0;font-size:.88rem">الاسم مُخزَّن مُشفَّرًا بمفتاح مُشتقّ من رمز الطالب ، فمَن يفتح ملف الإعدادات يرى حروفًا لا معنى لها ، ولا تلتقطها محرّكات البحث. لكنّ الرمز مكوّن من أرقام متوقّعة ، فشخص تقنيّ مُصرّ يستطيع تجريب الأرقام ليكشف الأسماء. إن أردت حماية أقوى نضيف خانتين عشوائيتين إلى رمز كل طالب.</p>'));
  }

  /* ---------- الربط والإرسال ---------- */
  function linkTab() {
    const b = sec('الإرسال التلقائي إلى جدول Google', 'بعد الإعداد مرّة واحدة ، يرسل التطبيق عند كل دخول أو فتح وحدة أو تسليم اختبار سطرًا إلى جدولك ، ويقرأ منه هذا التبويب.');
    D.log = D.log || { url: '', key: '', on: true };
    const r = frow(b);
    ftxt(r, 'رابط السكربت ( ينتهي بـ /exec )', D.log, 'url', 'https://script.google.com/macros/s/..../exec');
    ftxt(r, 'المفتاح السرّي', D.log, 'key', 'اكتب كلمة سرّ تضعها في السكربت نفسه');
    fchk(b, 'تشغيل الإرسال', D.log, 'on');
    const r2 = el('div', 'btns');
    const tst = el('button', 'btn', 'اختبار الاتصال');
    tst.onclick = () => {
      if (!D.log.url) return flash('ضع الرابط أولًا.');
      fetch(D.log.url + (D.log.url.includes('?') ? '&' : '?') + 'k=' + encodeURIComponent(D.log.key || ''))
        .then(x => x.json()).then(d => flash(d.rows ? 'الاتصال سليم · عدد الأسطر ' + d.rows.length : 'ردّ غير متوقّع : ' + JSON.stringify(d).slice(0, 60)))
        .catch(() => flash('تعذّر الاتصال . راجع الرابط والمفتاح.'));
    };
    const cp = el('button', 'btn ghost', 'نسخ كود السكربت');
    cp.onclick = () => { navigator.clipboard.writeText(GS_CODE).then(() => flash('نُسخ الكود . الصقه في Apps Script.'), () => flash('انسخه من ملف الدليل.')); };
    r2.append(tst, cp); b.append(r2);
    const b2 = sec('خطوات الإعداد ( مرّة واحدة )');
    [
      'افتح جدول Google جديدًا وسمّه « متابعة دوسياتي ».',
      'من القائمة : الإضافات ← Apps Script.',
      'احذف ما في المحرّر والصق كود السكربت ( زرّ « نسخ كود السكربت » أعلاه ، أو ملف code.gs المرفق ).',
      'غيّر السطر الأول KEY إلى كلمة السرّ نفسها التي كتبتها هنا.',
      'احفظ ، ثم : Deploy ← New deployment ← Web app ، واجعل Execute as : Me ، و Who has access : Anyone.',
      'انسخ الرابط الذي ينتهي بـ /exec والصقه في الحقل أعلاه ، ثم اضغط « اختبار الاتصال ».',
      'احفظ التغييرات ونزّل ملف الإعدادات وارفعه مع الموقع ؛ عندها تبدأ أجهزة الطلبة بالإرسال.'
    ].forEach((x, i) => b2.append(el('div', 'li', (i + 1) + ' ) ' + x)));
    b2.append(el('p', 'hint', 'ما يُرسَل : الوقت ، رقم الطالب واسمه ، الصف ، نوع الحدث ( دخول / فتح وحدة / كشف حلّ / تسليم اختبار ) ، الوحدة ، العلامة. لا يُرسل شيء آخر ، ولا يُرسل شيء إن تركت الحقل فارغًا.'));
  }

  function filePage() {
    const b = sec('نشر الإعدادات على الموقع', 'ما تحفظه هنا يسري على جهازك فقط . ليصل للطلبة : نزّل ملف الإعدادات وارفعه إلى مجلّد الموقع بجانب index.html ، ثم ارفع رقم الكاش في sw.js.');
    const r = el('div', 'btns');
    const dl2 = el('button', 'btn', 'تنزيل settings.json');
    dl2.onclick = () => download(D);
    const imp = el('button', 'btn ghost', 'استيراد ملف إعدادات');
    const fi = el('input'); fi.type = 'file'; fi.accept = '.json,application/json'; fi.style.display = 'none';
    fi.onchange = () => {
      const f = fi.files[0]; if (!f) return;
      const rd = new FileReader();
      rd.onload = () => {
        try { const o = JSON.parse(rd.result); saveSettings(merge(clone(DEF), o)); S.draft = clone(SET); flash('تمّ الاستيراد.'); render(); }
        catch (e) { flash('الملف غير صالح.'); }
      };
      rd.readAsText(f);
    };
    imp.onclick = () => fi.click();
    const rs = el('button', 'btn ghost', 'استعادة الإعدادات الافتراضية');
    rs.onclick = () => { if (confirm('استعادة كل الإعدادات الافتراضية ؟')) { localStorage.removeItem('dosiati-settings'); SET = clone(DEF); S.draft = clone(SET); flash('تمّت الاستعادة.'); render(); } };
    r.append(dl2, imp, rs, fi);
    b.append(r);
    const pre = el('pre', 'json'); pre.textContent = JSON.stringify(D, null, 1);
    b.append(el('p', 'hint', 'محتوى الملف الحالي :'), pre);
  }

  function download(D2) {
    const blob = new Blob([JSON.stringify(D2, null, 1)], { type: 'application/json' });
    const a = el('a'); a.href = URL.createObjectURL(blob); a.download = 'settings.json';
    document.body.append(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 2000);
  }
}
function flash(t) {
  let f = $('#flash');
  if (!f) { f = el('div', '', ''); f.id = 'flash'; document.body.append(f); }
  f.textContent = t; f.classList.add('on');
  clearTimeout(flash.t); flash.t = setTimeout(() => f.classList.remove('on'), 2200);
}
function printList(html) {
  const w = window.open('', '_blank');
  if (!w) return flash('اسمح بالنوافذ المنبثقة للطباعة.');
  w.document.write(`<!doctype html><html lang="ar" dir="rtl"><head><meta charset="utf-8"><title>أكواد الطلبة</title>
  <style>body{font-family:"Segoe UI",Tahoma,sans-serif;padding:1.5rem}table{border-collapse:collapse;width:100%}th,td{border:1px solid #999;padding:.4rem .6rem;text-align:start}th{background:#00205B;color:#fff}.hint{color:#555}button{display:none}</style>
  </head><body>${html}</body></html>`);
  w.document.close(); w.focus(); setTimeout(() => w.print(), 300);
}

/* ---------- عرض الوحدة ---------- */
const TABS = [['sum', 'الملخّص'], ['ex', 'نماذج محلولة'], ['q', 'أسئلة'], ['test', 'اختبار الوحدة'], ['t', 'للمعلّم']];
function liveNow(u) { const a = att(u); return !!(a && !a.submitted && Date.now() < a.start + a.dur * 60000); }
function unitView(u) {
  const cfg = uset(u.id);
  const w = el('div', 'wrap');
  const live = liveNow(u);
  const allow = k => isTeacher() ? true : (k === 't' ? false : cfg[k]);
  if (!allow(S.tab) && !live) S.tab = ['sum', 'ex', 'q', 'test'].find(allow) || 'sum';
  if (live && S.tab !== 'test') { location.hash = `#${u.id}/test`; S.tab = 'test'; }
  const head = el('div', 'uhead', `${live ? '' : '<a class="back" href="#">‹ الوحدات</a>'}
    <div><strong>${fmt(u.unit.unitTitle)}</strong><span>${esc(u.meta.subject)} — ${esc(u.meta.grade)} · ص ${fmt(u.unit.pages)}</span></div>`);
  w.append(head);
  const tabs = el('div', 'tabs');
  TABS.forEach(([k, t]) => {
    if (k === 't' && !isTeacher()) return;
    if (live && k !== 'test') return;
    if (!isTeacher() && !allow(k)) return;
    const b = el('a', 'tab' + (S.tab === k ? ' on' : '') + (isTeacher() && k !== 't' && !cfg[k] ? ' dim' : ''), esc(t));
    b.href = `#${u.id}/${k}`;
    tabs.append(b);
  });
  w.append(tabs);
  if (!isTeacher()) logEvent('open', u.id, S.tab);
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
  const showA = isTeacher() || (SET.perm.qa && uset(u.id).qa);
  const out = [];
  if (!showA) out.push(el('p', 'hint', 'أجب في دفترك ؛ الحلول غير متاحة في هذا التبويب حاليًّا.'));
  let n = 1;
  [['المستوى ( أ ) : تذكّر وفهم', q.a], ['المستوى ( ب ) : تطبيق', q.b], ['المستوى ( جـ ) : تحليل واستدلال', q.c]].forEach(([title, arr]) => {
    out.push(el('h2', 'lvl', esc(title)));
    (arr || []).forEach(item => out.push(qCard(u, item, n++, showA)));
  });
  return out;
}
function qCard(u, item, n, showA) {
  const c = el('div', 'card2');
  c.append(el('div', 'qn', `س ${n}`));
  c.append(el('p', 'qq', fmt(item.q)));
  if (item.tbl) c.append(nodeEl({ t: 'table', rows: item.tbl }));
  if (!showA) return c;
  const ans = el('div', 'ans hidden');
  (item.a || []).forEach(a => ans.insertAdjacentHTML('beforeend', line(a)));
  const b = el('button', 'btn', 'أظهر الإجابة');
  b.onclick = () => {
    ans.classList.toggle('hidden');
    b.textContent = ans.classList.contains('hidden') ? 'أظهر الإجابة' : 'إخفاء الإجابة';
    const p = prog(u.id); if (!p.seen.includes(n)) { p.seen.push(n); save(); logEvent('reveal', u.id, 'س' + n); }
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

function lockView(u) {
  const w = el('div', 'test');
  const g = el('div', 'gate big');
  g.append(el('div', 'lock', '🔒'));
  g.append(el('p', '', '<b>اختبار نهاية الوحدة</b><br>40 علامة . يفتح برمز يعطيه المعلّم وقت الاختبار.'));
  const i = el('input'); i.placeholder = 'رمز الاختبار'; i.setAttribute('dir', 'ltr'); i.className = 'tk'; i.autocomplete = 'off';
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
    tb.onclick = () => { setAtt(u, { tk: 'TEACHER', start: Date.now(), dur: SET.exam.dur || 45, mcq: {}, essay: {}, self: {} }); render(); };
    const trow = el('div', 'btns2'); trow.append(tb); g.append(trow);
  }
  w.append(g);
  return w;
}

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
    let right = 0; ex.mcq.forEach((it, i) => { if (a.mcq[i] === it.a) right++; });
    logEvent('exam', u.id, (auto ? 'تلقائي' : 'يدوي') + ' · ' + right + '/' + ex.mcq.length, (right * 1.5).toFixed(1));
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
  if (isTeacher() || SET.perm.print) {
    const pr = el('button', 'btn ghost', 'طباعة / حفظ PDF');
    pr.onclick = () => window.print();
    f.append(pr);
  }
  if (isTeacher() || SET.perm.retake) {
    const rt = el('button', 'btn ghost', 'محاولة جديدة ( تحتاج رمزًا )');
    rt.onclick = () => { if (confirm('مسح هذه المحاولة والبدء من جديد ؟')) { const p = prog(u.id); delete p.att; save(); render(); } };
    f.append(rt);
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

/* ---------- قسم المعلّم داخل الوحدة ---------- */
function teacherView(u) {
  const w = el('div');
  const k = u.keyk, ex = u.exam, cfg = uset(u.id);
  if (!cfg.on) w.append(el('div', 'box gold', '<div class="bt">تنبيه</div><p>هذه الوحدة مخفيّة عن الطلبة حاليًّا . غيّر ذلك من لوحة التحكّم ← الوحدات.</p>'));

  const box = el('div', 'box gold');
  box.append(el('div', 'bt', 'فتح الاختبار للطلبة'));
  box.append(el('p', '', 'حدّد مدة الاختبار ومهلة الدخول ، ثم اكتب الرمز على السبورة . لن يُفتح الاختبار عند الطالب إلا بهذا الرمز ، وتظهر له الإجابات بعد التسليم فقط.'));
  const row = el('div', 'frow');
  const dur = el('input'); dur.type = 'number'; dur.value = SET.exam.dur || 45; dur.className = 'num';
  const win = el('input'); win.type = 'number'; win.value = SET.exam.win || 15; win.className = 'num';
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
