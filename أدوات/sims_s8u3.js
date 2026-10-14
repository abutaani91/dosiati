/* ===== محاكاة ميكانيكا الموائع ( علوم الثامن — الوحدة الثالثة ) — البادئة fm ===== */
(function () {
  const el = (t, c, h) => { const e = document.createElement(t); if (c) e.className = c; if (h !== undefined) e.innerHTML = h; return e; };
  const btn = (txt, cls, fn) => { const b = el('button', 'sb ' + (cls || ''), txt); b.onclick = fn; return b; };
  const L = s => '<span class="ltr">' + s + '</span>';
  const sld = (lab, val, lo, hi, step, fn) => { const w = el('label', 'sf'); const sp = el('span', '', lab(val)); w.append(sp); const r = document.createElement('input'); r.type = 'range'; r.min = lo; r.max = hi; r.step = step; r.value = val; r.oninput = () => { sp.innerHTML = lab(+r.value); fn(+r.value); }; w.append(r); return w; };
  const info = () => { const b = el('div', 'cyinfo'); b.row = (k, v) => b.append(el('div', 'cyrow', '<span class="cyk">' + k + '</span><span class="cyv">' + v + '</span>')); return b; };
  const verdict = (cls, b, s) => el('div', 'acv' + (cls ? ' ' + cls : ''), '<b>' + b + '</b><span>' + s + '</span>');
  const seg = (opts, val, fn) => { const w = el('div', 'fmseg'); opts.forEach(o => { const b = el('button', 'fmb' + (String(o[0]) === String(val) ? ' fmon' : ''), o[1]); b.onclick = () => fn(o[0]); w.append(b); }); return w; };
  const NS = 'http://www.w3.org/2000/svg';
  const sv = (t, a, p) => { const e = document.createElementNS(NS, t); for (const k in a) e.setAttribute(k, a[k]); if (p) p.append(e); return e; };
  const txt = (svg, x, y, s, a) => { const t = sv('text', Object.assign({ x: x, y: y, 'font-size': 11, fill: '#1F3A5F', direction: 'ltr', 'font-weight': 700 }, a || {}), svg); t.textContent = s; return t; };
  const fig = (body, w, h) => { const s = sv('svg', { viewBox: '0 0 ' + w + ' ' + h, class: 'fmsvg', preserveAspectRatio: 'xMidYMid meet' }); const f = el('div', 'fmfig'); f.append(s); body.append(f); return s; };
  const shuffle = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const note = s => el('div', 'fmnote', s);
  const fmt = (v, d) => { const r = +v.toFixed(d === undefined ? 2 : d); return String(r); };
  const arrow = (svg, x1, y1, x2, y2, c, w) => { const a = Math.atan2(y2 - y1, x2 - x1); sv('path', { d: 'M' + x1 + ' ' + y1 + ' L' + x2 + ' ' + y2, stroke: c, 'stroke-width': w || 3 }, svg); sv('path', { d: 'M' + x2 + ' ' + y2 + ' l' + (-9 * Math.cos(a - 0.45)) + ' ' + (-9 * Math.sin(a - 0.45)) + ' l' + (9 * Math.cos(a - 0.45) - 9 * Math.cos(a + 0.45)) + ' ' + (9 * Math.sin(a - 0.45) - 9 * Math.sin(a + 0.45)) + ' z', fill: c }, svg); };
  function sorter(body, pool, cats, intro, done) {
    const S = { q: shuffle(pool), k: 0, ok: 0, ans: null };
    function draw() {
      body.innerHTML = '';
      if (S.k >= S.q.length) { body.append(verdict('acok', 'النتيجة : ' + S.ok + ' من ' + S.q.length, done)); const r = el('div', 'srow'); r.append(btn('من جديد', 'gh', () => { S.q = shuffle(pool); S.k = 0; S.ok = 0; S.ans = null; draw(); })); body.append(r); return; }
      const it = S.q[S.k];
      body.append(el('div', 'shint', intro + ' ( ' + (S.k + 1) + ' / ' + S.q.length + ' )'));
      body.append(el('div', 'fmq', it[0]));
      const r = el('div', 'fmseg');
      cats.forEach((c, i) => { const b = el('button', 'fmb' + (S.ans !== null && i === it[1] ? ' fmon' : '') + (S.ans === i && i !== it[1] ? ' fmno' : ''), c); b.onclick = () => { if (S.ans !== null) return; S.ans = i; if (i === it[1]) S.ok++; draw(); }; r.append(b); });
      body.append(r);
      if (S.ans !== null) { body.append(verdict(S.ans === it[1] ? 'acok' : 'acwarn', S.ans === it[1] ? 'صحيح' : 'الصواب : ' + cats[it[1]], it[2])); const r2 = el('div', 'srow'); r2.append(btn('التالي', '', () => { S.k++; S.ans = null; draw(); })); body.append(r2); }
    }
    draw();
  }
  /* مولّد مسائل رقمية عامّ */
  function solver(body, gen, foot) {
    const S = { p: gen(true), v: '', r: null };
    function draw() {
      body.innerHTML = ''; const p = S.p;
      body.append(el('div', 'fmq', p.q));
      const r = el('div', 'srow'); const inp = document.createElement('input'); inp.type = 'number'; inp.step = 'any'; inp.className = 'fminp'; inp.value = S.v; inp.oninput = () => S.v = inp.value;
      r.append(inp, el('span', 'fmunit', L(p.unit)), btn('تحقّق', '', () => { const v = parseFloat(S.v); S.r = isNaN(v) ? null : Math.abs(v - p.ans) <= Math.abs(p.ans) * 0.01 + 1e-9; draw(); })); body.append(r);
      if (S.r !== null) {
        const v = parseFloat(S.v); const tr = (p.traps || []).find(t => Math.abs(v - t[0]) <= Math.abs(t[0]) * 0.01 + 1e-9);
        body.append(verdict(S.r ? 'acok' : 'acwarn', S.r ? 'صحيح' : 'ليس صحيحًا', p.sol + (S.r ? '' : (tr ? ' — ' + tr[1] : ''))));
        const r2 = el('div', 'srow'); r2.append(btn('مسألة أخرى', '', () => { S.p = gen(false); S.v = ''; S.r = null; draw(); })); body.append(r2);
      }
      if (foot) body.append(note(foot));
    }
    draw();
  }
  const pick = a => a[Math.floor(Math.random() * a.length)];
  const modes = (host, list) => { host.innerHTML = ''; const S = { m: list[0][0] }; const top = el('div'), body = el('div'); host.append(top, body); const go = () => { top.innerHTML = ''; top.append(seg(list.map(x => [x[0], x[1]]), S.m, v => { S.m = v; go(); })); body.innerHTML = ''; list.find(x => x[0] === S.m)[2](body); }; go(); };

  /* ======================= 1 · الضغط : القوّة والمساحة ======================= */
  function fmpress(host) {
    host.innerHTML = '';
    const S = { F: 600, A: 0.06 };
    const top = el('div'), ctl = el('div'), body = el('div'); host.append(top, ctl, body);
    function bar() {
      top.innerHTML = ''; const r = el('div', 'srow');
      r.append(btn('واقف على قدميه', 'gh', () => { S.F = 750; S.A = 0.06; bar(); draw(); }), btn('على قدم واحدة', 'gh', () => { S.F = 750; S.A = 0.03; bar(); draw(); }), btn('يحمل صندوقًا 60 N', 'gh', () => { S.F = 810; S.A = 0.06; bar(); draw(); }));
      top.append(r);
      ctl.innerHTML = '';
      ctl.append(sld(v => 'القوّة العمودية ' + L('F = ' + v + ' N'), S.F, 100, 1200, 10, v => { S.F = v; draw(); }));
      ctl.append(sld(v => 'مساحة التماسّ ' + L('A = ' + v + ' m²'), S.A, 0.01, 0.2, 0.01, v => { S.A = v; draw(); }));
    }
    function draw() {
      body.innerHTML = '';
      const P = S.F / S.A, svg = fig(body, 320, 170);
      const depth = 3 + 45 * Math.min(1, P / 40000);
      const w = 30 + S.A / 0.2 * 230;
      sv('rect', { x: 20, y: 90, width: 280, height: 70, fill: '#F6E7B4', stroke: '#C9A94A' }, svg);
      sv('path', { d: 'M' + (160 - w / 2) + ' 90 Q160 ' + (90 + depth * 1.6) + ' ' + (160 + w / 2) + ' 90', fill: '#E9D48F', stroke: '#C9A94A' }, svg);
      sv('rect', { x: 160 - w / 2, y: 90 + depth - 40, width: w, height: 40, rx: 4, fill: '#5B8DEF', stroke: '#1F4E8C', 'stroke-width': 2 }, svg);
      arrow(svg, 160, 8, 160, 90 + depth - 44, '#D62828', 2 + S.F / 250);
      txt(svg, 168, 30, 'F = ' + S.F + ' N', { fill: '#D62828' });
      const b = info(); b.row('الضغط', '<b>' + L('P = F / A = ' + S.F + ' / ' + S.A + ' = ' + Math.round(P) + ' Pa') + '</b>'); b.row('الغوص في الإسفنج', depth > 35 ? 'كبير' : depth > 15 ? 'متوسّط' : 'قليل'); body.append(b);
      body.append(note('ثبّت القوّة وصغّر المساحة ، ثمّ ثبّت المساحة وكبّر القوّة : الغوص يتبع الضغط لا القوّة وحدها . عمق الغوص في الرسم توضيحيّ.'));
    }
    bar(); draw();
  }

  /* ======================= 2 · حساب الضغط ======================= */
  function fmcalc(host) {
    host.innerHTML = ''; const b = el('div'); host.append(b);
    solver(b, first => {
      if (first) return { q: 'شخص وزنه ' + L('750 N') + ' ، ومساحة نعل حذائه الواحد ' + L('0.03 m²') + ' ، يقف على قدميه . احسب الضغط على الأرض.', unit: 'Pa', ans: 12500, sol: L('A = 0.06 m²') + ' ، ' + L('P = 750 / 0.06 = 12500 Pa'), traps: [[25000, 'حسبتَ بنعل واحد ، وهو واقف على قدميه.'], [22.5, 'ضربتَ بدل أن تقسم.']] };
      const k = Math.floor(Math.random() * 4);
      if (k === 0) { const F = pick([200, 300, 450, 600, 900, 1200]), A = pick([0.02, 0.05, 0.1, 0.2, 0.5]); return { q: 'قوّة ' + L(F + ' N') + ' تؤثّر عموديًّا في مساحة ' + L(A + ' m²') + ' . احسب الضغط.', unit: 'Pa', ans: F / A, sol: L('P = ' + F + ' / ' + A + ' = ' + fmt(F / A) + ' Pa'), traps: [[F * A, 'ضربتَ بدل أن تقسم.'], [A / F, 'قسمتَ المساحة على القوّة.']] }; }
      if (k === 1) { const P = pick([1000, 2000, 2500, 5000, 8000]), A = pick([0.1, 0.2, 0.4, 0.5]); return { q: 'ضغط مقداره ' + L(P + ' Pa') + ' على مساحة ' + L(A + ' m²') + ' . احسب القوّة المؤثّرة.', unit: 'N', ans: P * A, sol: L('F = P × A = ' + P + ' × ' + A + ' = ' + fmt(P * A) + ' N'), traps: [[P / A, 'قسمتَ ، والقوّة حاصل ضرب الضغط في المساحة.']] }; }
      if (k === 2) { const F = pick([40, 60, 80, 120]), c = pick([[20, 10], [40, 20], [30, 10], [50, 20]]); const cm = c[0] * c[1], m = cm / 10000; return { q: 'صندوق وزنه ' + L(F + ' N') + ' يرتكز على وجه أبعاده ' + L(c[0] + ' cm × ' + c[1] + ' cm') + ' . احسب الضغط بالباسكال.', unit: 'Pa', ans: F / m, sol: L(cm + ' cm² = ' + m + ' m²') + ' ، ' + L('P = ' + F + ' / ' + m + ' = ' + fmt(F / m) + ' Pa'), traps: [[F / cm, 'لم تحوّل المساحة من cm² إلى m² ( 1 m² = 10000 cm² ).']] }; }
      const F = pick([500, 600, 700, 800]), a = pick([0.02, 0.025, 0.04]); return { q: 'شخص وزنه ' + L(F + ' N') + ' يقف على قدم واحدة ، ومساحة نعله ' + L(a + ' m²') + ' . احسب الضغط.', unit: 'Pa', ans: F / a, sol: L('P = ' + F + ' / ' + a + ' = ' + fmt(F / a) + ' Pa'), traps: [[F / (2 * a), 'حسبتَ بنعلين ، وهو على قدم واحدة.']] };
    }, 'القاعدة : القوّة بالنيوتن ، والمساحة بالمتر المربّع ( 1 m² = 10000 cm² ) ، فيخرج الضغط بالباسكال مباشرةً.');
  }

  /* ======================= 3 · تصميم الأدوات ======================= */
  function fmtools(host) {
    host.innerHTML = ''; const b = el('div'); host.append(b);
    sorter(b, [
      ['رأس الدبّوس الحادّ.', 0, 'مساحة صغيرة ← ضغط كبير يخترق الخشب.'], ['إطارات عريضة لمركبات الثلوج.', 1, 'مساحة كبيرة ← ضغط قليل فلا تغوص.'],
      ['حدّ السكّين الرقيق.', 0, 'مساحة صغيرة ← ضغط كبير يقطع بسهولة.'], ['وسادة على حزام حقيبة الظهر.', 1, 'تزيد المساحة على الكتف فيقلّ الضغط.'],
      ['رأس المسمار المدبّب.', 0, 'مساحة صغيرة ← ضغط كبير.'], ['أقدام الجمل الكبيرة على الرمل.', 1, 'مساحة كبيرة ← ضغط قليل.'],
      ['قطع حماية عريضة تحت أرجل الكرسيّ.', 1, 'تزيد المساحة فيقلّ الضغط على الأرضية.'], ['أسنان المنشار المدبّبة.', 0, 'مساحة صغيرة ← ضغط كبير.']
    ], ['يزيد الضغط', 'يُقلّل الضغط'], 'هل صُمّم هذا ليزيد الضغط أم ليُقلّله ؟', 'التفسير بثلاث خطوات : القوّة ثابتة ، المساحة صغرت أو كبرت ، فالضغط يتبعها عكسيًّا.');
  }

  /* ======================= 4 · ضغط السائل ======================= */
  function fmliq(host) {
    modes(host, [
      ['depth', 'العمق والكثافة', b => {
        const S = { h: 10, liq: 1 };
        const draw = () => {
          b.innerHTML = '';
          b.append(seg([[1, 'ماء'], [13.6, 'زئبق']], S.liq, v => { S.liq = +v; if (S.liq > 1 && S.h > 5) S.h = 1; draw(); }));
          const max = S.liq > 1 ? 5 : 40;
          b.append(sld(v => 'العمق ' + L('h = ' + v + ' m'), S.h, 0, max, S.liq > 1 ? 0.5 : 1, v => { S.h = v; draw(); }));
          const svg = fig(b, 320, 190);
          sv('rect', { x: 40, y: 20, width: 240, height: 160, fill: S.liq > 1 ? '#B8BEC6' : '#BFE0F7', stroke: '#1F4E8C', 'stroke-width': 2 }, svg);
          const y = 20 + S.h / max * 150;
          sv('circle', { cx: 160, cy: y, r: 9, fill: '#F2963A', stroke: '#fff', 'stroke-width': 2 }, svg);
          const P = S.h * 1e4 * S.liq, L2 = 6 + Math.min(40, P / (S.liq > 1 ? 7e5 : 4e5) * 40);
          [[0, -1], [0, 1], [-1, 0], [1, 0]].forEach(d => arrow(svg, 160 + d[0] * (L2 + 12), y + d[1] * (L2 + 12), 160 + d[0] * 11, y + d[1] * 11, '#D62828', 2.5));
          for (let m = 0; m <= max; m += max / 4) { const yy = 20 + m / max * 150; sv('path', { d: 'M282 ' + yy + ' h8', stroke: '#1F3A5F' }, svg); txt(svg, 292, yy + 4, m + ' m', { 'font-weight': 400, 'font-size': 10 }); }
          const inf = info(); inf.row('الضغط الناتج عن السائل', L(Math.round(P).toLocaleString('en') + ' Pa')); inf.row('القاعدة', S.liq > 1 ? 'في الزئبق : 13.6 مِثل الماء عند العمق نفسه' : 'كلّ عشرة أمتار من الماء تضيف ' + L('10⁵ Pa')); b.append(inf);
          b.append(note('الأرقام لضغط السائل وحده دون ضغط الهواء فوقه ، ومحسوبة من قاعدة الكتاب : كلّ عشرة أمتار من الماء تضيف ' + L('10⁵ Pa') + '.'));
        }; draw();
      }],
      ['shape', 'شكل الوعاء', b => {
        const svg = fig(b, 330, 170);
        const shapes = [[20, 'M20 30 h60 v120 h-60 z'], [120, 'M110 30 h80 l-25 120 h-30 z'], [230, 'M225 30 h20 l40 120 h-100 z']];
        shapes.forEach(s => sv('path', { d: s[1], fill: '#BFE0F7', stroke: '#1F4E8C', 'stroke-width': 2 }, svg));
        sv('path', { d: 'M10 110 H320', stroke: '#F2963A', 'stroke-dasharray': '6 4', 'stroke-width': 2 }, svg);
        [50, 150, 235].forEach(x => sv('circle', { cx: x, cy: 110, r: 6, fill: '#F2963A' }, svg));
        b.append(verdict('acok', 'الضغط متساوٍ عند النقاط الثلاث', 'النقاط في مستوًى أفقيّ واحد وعلى العمق نفسه من السطح في السائل نفسه ؛ فلا أثر لشكل الوعاء ولا لكمية السائل فيه.'));
      }],
      ['holes', 'ثقوب القارورة', b => {
        const svg = fig(b, 320, 190);
        sv('rect', { x: 40, y: 20, width: 70, height: 160, rx: 8, fill: '#BFE0F7', stroke: '#1F4E8C', 'stroke-width': 2 }, svg);
        [[60, 1], [105, 2], [150, 3]].forEach(h => { const d = h[1]; sv('circle', { cx: 110, cy: h[0], r: 4, fill: '#1F4E8C' }, svg); sv('path', { d: 'M110 ' + h[0] + ' q' + (30 * d) + ' 0 ' + (45 * d) + ' ' + (180 - h[0]), fill: 'none', stroke: '#2f7fcf', 'stroke-width': 4 }, svg); txt(svg, 90, h[0] + 4, String(d), { 'font-size': 10 }); });
        b.append(verdict('acok', 'الثقب الأسفل أبعد اندفاعًا', 'هو الأعمق تحت سطح الماء ، والضغط يزداد بزيادة العمق . والمسافات في الرسم توضيحية.'));
      }]
    ]);
  }

  /* ======================= 5 · الرافعة الهيدروليكية ======================= */
  function fmlift(host) {
    modes(host, [
      ['sim', 'جرّب الرافعة', b => {
        const S = { F1: 100, A1: 0.1, A2: 1 };
        const draw = () => {
          b.innerHTML = '';
          b.append(sld(v => 'القوّة على المكبس الصغير ' + L('F₁ = ' + v + ' N'), S.F1, 10, 500, 10, v => { S.F1 = v; draw(); }));
          b.append(sld(v => 'مساحة المكبس الصغير ' + L('A₁ = ' + v + ' m²'), S.A1, 0.05, 0.5, 0.05, v => { S.A1 = v; draw(); }));
          b.append(sld(v => 'مساحة المكبس الكبير ' + L('A₂ = ' + v + ' m²'), S.A2, 0.5, 2, 0.1, v => { S.A2 = v; draw(); }));
          const P = S.F1 / S.A1, F2 = P * S.A2, svg = fig(b, 330, 170);
          const w1 = 20 + S.A1 / 0.5 * 40, w2 = 60 + S.A2 / 2 * 120;
          sv('path', { d: 'M' + (60 - w1 / 2) + ' 40 V140 H' + (230 - w2 / 2) + ' V60 H' + (230 + w2 / 2) + ' V160 H' + (60 - w1 / 2 - 0) + ' V140', fill: 'none' }, svg);
          sv('rect', { x: 60 - w1 / 2, y: 60, width: w1, height: 90, fill: '#F7D774' }, svg);
          sv('rect', { x: 60 + w1 / 2, y: 130, width: 230 - w2 / 2 - 60 - w1 / 2, height: 20, fill: '#F7D774' }, svg);
          sv('rect', { x: 230 - w2 / 2, y: 70, width: w2, height: 80, fill: '#F7D774' }, svg);
          sv('rect', { x: 60 - w1 / 2, y: 52, width: w1, height: 8, fill: '#5b6b80' }, svg);
          sv('rect', { x: 230 - w2 / 2, y: 62, width: w2, height: 8, fill: '#5b6b80' }, svg);
          arrow(svg, 60, 8, 60, 48, '#D62828', 2 + S.F1 / 150);
          arrow(svg, 230, 58, 230, 12, '#1F4E8C', 2 + Math.min(8, F2 / 600));
          txt(svg, 70, 20, 'F₁', { fill: '#D62828' }); txt(svg, 240, 24, 'F₂', { fill: '#1F4E8C' });
          const inf = info(); inf.row('الضغط في المكبسين ( واحد )', L('P = ' + S.F1 + ' / ' + S.A1 + ' = ' + fmt(P) + ' Pa')); inf.row('القوّة على المكبس الكبير', '<b>' + L('F₂ = P × A₂ = ' + fmt(F2) + ' N') + '</b>'); inf.row('التكبير', L('A₂ / A₁ = ' + fmt(S.A2 / S.A1) + ' = F₂ / F₁')); b.append(inf);
        }; draw();
      }],
      ['pr', 'مسائل', b => solver(b, first => {
        if (first) return { q: 'رافعة مساحة مكبسها الصغير ' + L('0.2 m²') + ' والكبير ' + L('0.8 m²') + ' . ما القوّة اللازمة على المكبس الصغير لرفع سيارة وزنها ' + L('12000 N') + ' ؟', unit: 'N', ans: 3000, sol: L('12000 / 0.8 = F₁ / 0.2') + ' ، ' + L('F₁ = 3000 N'), traps: [[48000, 'ضربتَ في النسبة بدل القسمة : المكبس الصغير يحتاج قوّة أقلّ.'], [12000, 'نسيتَ نسبة المساحتين.']] };
        const a1 = pick([0.05, 0.1, 0.2, 0.25]), r = pick([4, 5, 10, 20]), a2 = +(a1 * r).toFixed(2), F1 = pick([50, 100, 150, 200, 300]);
        if (Math.random() < 0.5) return { q: 'رافعة ' + L('A₁ = ' + a1 + ' m²') + ' و ' + L('A₂ = ' + a2 + ' m²') + ' ، والقوّة على المكبس الصغير ' + L(F1 + ' N') + ' . احسب القوّة على المكبس الكبير.', unit: 'N', ans: F1 * r, sol: L('F₂ = ' + F1 + ' × ( ' + a2 + ' / ' + a1 + ' ) = ' + F1 * r + ' N'), traps: [[F1 / r, 'قسمتَ ، والقوّة تكبر على المكبس الكبير.']] };
        const F2 = F1 * r; return { q: 'رافعة ' + L('A₁ = ' + a1 + ' m²') + ' و ' + L('A₂ = ' + a2 + ' m²') + ' . ما القوّة على المكبس الصغير لرفع جسم وزنه ' + L(F2 + ' N') + ' ؟', unit: 'N', ans: F1, sol: L('F₁ = ' + F2 + ' × ( ' + a1 + ' / ' + a2 + ' ) = ' + F1 + ' N'), traps: [[F2 * r, 'ضربتَ بدل أن تقسم.']] };
      }, 'العلاقة : F₂ / A₂ = F₁ / A₁ — كلّ قوّة مع مساحة مكبسها.')]
    ]);
  }

  /* ======================= 6 · مبدأ برنولي ======================= */
  const BER = [
    { k: 'bal', t: 'تنفخ بين بالونين معلّقين متقاربين.', o: ['يتقاربان', 'يتباعدان'], a: 0, why: 'الهواء بينهما سريع فضغطه أقلّ ، والهواء خارجهما ساكن فضغطه أكبر فيدفعهما نحو بعضهما.' },
    { k: 'wing', t: 'الهواء يمرّ فوق جناح الطائرة وأسفله ، وانحناء الجناح من الأعلى أكبر.', o: ['تنشأ قوّة رفع إلى الأعلى', 'تنشأ قوّة إلى الأسفل'], a: 0, why: 'الهواء فوق الجناح أسرع فضغطه أقلّ ، وأسفله أبطأ فضغطه أكبر ، فيدفع الجناح إلى الأعلى.' },
    { k: 'roof', t: 'رياح قويّة جدًّا تهبّ فوق سقف كوخ مغلق.', o: ['يُدفع السقف إلى الأعلى', 'يُضغط السقف إلى الأسفل'], a: 0, why: 'الهواء فوق السقف سريع فضغطه أقلّ من ضغط الهواء الساكن داخل الكوخ.' },
    { k: 'paper', t: 'تمسك ورقة من طرفها تحت شفتك وتنفخ فوقها.', o: ['ترتفع الورقة', 'تنخفض الورقة'], a: 0, why: 'الهواء فوق الورقة سريع فضغطه أقلّ من ضغط الهواء تحتها.' }
  ];
  function berDraw(svg, k, done) {
    const fast = '#D62828', slow = '#1F4E8C';
    const flow = (y, x1, x2, c, n) => { for (let i = 0; i < n; i++) arrow(svg, x1 + i * (x2 - x1) / n, y, x1 + (i + 0.7) * (x2 - x1) / n, y, c, 2); };
    if (k === 'bal') { const dx = done ? 8 : 0; sv('ellipse', { cx: 120 + dx, cy: 80, rx: 30, ry: 38, fill: '#F2963A' }, svg); sv('ellipse', { cx: 210 - dx, cy: 80, rx: 30, ry: 38, fill: '#5B8DEF' }, svg); flow(80, 152, 178, fast, 1); for (let y = 50; y <= 110; y += 30) flow(y, 156 + dx, 176 - dx, fast, 1); if (done) { arrow(svg, 60, 80, 85, 80, slow, 3); arrow(svg, 270, 80, 245, 80, slow, 3); } }
    else if (k === 'wing') { sv('path', { d: 'M70 95 Q160 35 270 95 Q160 110 70 95 z', fill: '#c9d2dd', stroke: '#5b6b80', 'stroke-width': 2 }, svg); flow(50, 60, 280, fast, 5); flow(125, 60, 280, slow, 3); if (done) arrow(svg, 165, 120, 165, 60, '#14603f', 4); }
    else if (k === 'roof') { sv('path', { d: 'M90 150 V100 L165 60 L240 100 V150 z', fill: '#E9D48F', stroke: '#7a5c2e', 'stroke-width': 2 }, svg); flow(40, 40, 300, fast, 6); if (done) { arrow(svg, 165, 130, 165, 75, slow, 4); } }
    else { sv('path', { d: 'M90 70 Q180 ' + (done ? 60 : 100) + ' 260 ' + (done ? 70 : 130), fill: 'none', stroke: '#5b6b80', 'stroke-width': 5 }, svg); flow(45, 90, 260, fast, 4); }
  }
  function fmbern(host) {
    host.innerHTML = '';
    const S = { k: 0, ans: null };
    const top = el('div'), body = el('div'); host.append(top, body);
    function bar() { top.innerHTML = ''; top.append(seg(BER.map((b, i) => [i, ['البالونان', 'جناح الطائرة', 'سقف الكوخ', 'الورقة'][i]]), S.k, v => { S.k = +v; S.ans = null; bar(); draw(); })); }
    function draw() {
      body.innerHTML = ''; const B = BER[S.k];
      body.append(el('div', 'fmq', B.t + ' <b>توقّع : ماذا يحدث ؟</b>'));
      const svg = fig(body, 330, 160); berDraw(svg, B.k, S.ans !== null);
      body.append(el('div', 'fmlg', '<span><i style="background:#D62828"></i>هواء سريع ← ضغط أقلّ</span><span><i style="background:#1F4E8C"></i>هواء أبطأ أو ساكن ← ضغط أكبر</span>'));
      const r = el('div', 'fmseg'); B.o.forEach((o, i) => { const x = el('button', 'fmb' + (S.ans !== null && i === B.a ? ' fmon' : '') + (S.ans === i && i !== B.a ? ' fmno' : ''), o); x.onclick = () => { if (S.ans === null) { S.ans = i; draw(); } }; r.append(x); }); body.append(r);
      if (S.ans !== null) body.append(verdict(S.ans === B.a ? 'acok' : 'acwarn', S.ans === B.a ? 'توقّع صحيح' : 'الصواب : ' + B.o[B.a], B.why + ' ( ضغط المائع يقلّ عندما تزيد سرعته ).'));
    }
    bar(); draw();
  }

  /* ======================= 7 · الكثافة وحسابها ======================= */
  function fmdens(host) {
    modes(host, [
      ['box', 'صندوق منتظم', b => {
        const S = { L: 10, W: 5, H: 2, m: 20 };
        const draw = () => {
          b.innerHTML = '';
          [['L', 'الطول'], ['W', 'العرض'], ['H', 'الارتفاع']].forEach(k => b.append(sld(v => k[1] + ' ' + L(v + ' cm'), S[k[0]], 1, 20, 1, v => { S[k[0]] = v; draw(); })));
          b.append(sld(v => 'الكتلة ' + L(v + ' g'), S.m, 5, 4000, 5, v => { S.m = v; draw(); }));
          const V = S.L * S.W * S.H, D = S.m / V;
          const svg = fig(b, 300, 120); const s = 4; const x = 150 - S.L * s / 2, y = 90 - S.H * s;
          sv('path', { d: 'M' + x + ' ' + (y + S.H * s) + ' h' + S.L * s + ' v' + (-S.H * s) + ' h' + (-S.L * s) + ' z', fill: '#B8D4F0', stroke: '#1F4E8C' }, svg);
          sv('path', { d: 'M' + x + ' ' + y + ' l' + S.W * s * 0.6 + ' ' + (-S.W * s * 0.4) + ' h' + S.L * s + ' l' + (-S.W * s * 0.6) + ' ' + (S.W * s * 0.4) + ' z', fill: '#D6E6F7', stroke: '#1F4E8C' }, svg);
          sv('path', { d: 'M' + (x + S.L * s) + ' ' + (y + S.H * s) + ' l' + S.W * s * 0.6 + ' ' + (-S.W * s * 0.4) + ' v' + (-S.H * s) + ' l' + (-S.W * s * 0.6) + ' ' + (S.W * s * 0.4) + ' z', fill: '#9CC0E6', stroke: '#1F4E8C' }, svg);
          const inf = info(); inf.row('الحجم', L('V = ' + S.L + ' × ' + S.W + ' × ' + S.H + ' = ' + V + ' cm³')); inf.row('الكثافة', '<b>' + L('D = ' + S.m + ' / ' + V + ' = ' + fmt(D, 3) + ' g/cm³') + '</b>'); inf.row('في الماء ( 1 g/cm³ )', D > 1.0005 ? 'يغوص' : D < 0.9995 ? 'يطفو' : 'يبقى معلّقًا'); b.append(inf);
        }; draw();
      }],
      ['cyl', 'المخبار المدرّج', b => {
        const S = { v1: 50, dv: 20, m: 60 };
        const draw = () => {
          b.innerHTML = '';
          b.append(sld(v => 'كتلة الحجر ' + L(v + ' g'), S.m, 10, 200, 5, v => { S.m = v; draw(); }));
          b.append(sld(v => 'حجم الحجر ' + L(v + ' cm³'), S.dv, 5, 40, 1, v => { S.dv = v; draw(); }));
          const svg = fig(b, 300, 190); const sc = 1.6, base = 175;
          sv('rect', { x: 120, y: 15, width: 60, height: 160, fill: '#fff', stroke: '#1F3A5F', 'stroke-width': 2 }, svg);
          sv('rect', { x: 122, y: base - (S.v1 + S.dv) * sc, width: 56, height: (S.v1 + S.dv) * sc - 2, fill: '#BFE0F7' }, svg);
          sv('path', { d: 'M135 ' + (base - 8) + ' l12 -14 l14 4 l6 12 z', fill: '#8a7a6a' }, svg);
          for (let v = 0; v <= 90; v += 10) { const yy = base - v * sc; sv('path', { d: 'M180 ' + yy + ' h8', stroke: '#1F3A5F' }, svg); txt(svg, 192, yy + 4, String(v), { 'font-size': 9, 'font-weight': 400 }); }
          const inf = info(); inf.row('القراءة قبل الغمر', L(S.v1 + ' cm³')); inf.row('القراءة بعد الغمر', L((S.v1 + S.dv) + ' cm³')); inf.row('حجم الحجر ( الفرق )', L((S.v1 + S.dv) + ' − ' + S.v1 + ' = ' + S.dv + ' cm³')); inf.row('الكثافة', '<b>' + L('D = ' + S.m + ' / ' + S.dv + ' = ' + fmt(S.m / S.dv, 2) + ' g/cm³') + '</b>'); b.append(inf);
          b.append(note('للجسم غير المنتظم : الحجم = الفرق بين القراءتين ، لا L × W × H.'));
        }; draw();
      }],
      ['pr', 'مسائل', b => solver(b, first => {
        if (first) return { q: 'مكعّب خشب طول ضلعه ' + L('10 cm') + ' وكتلته ' + L('0.5 kg') + ' . احسب كثافة مادّته بوحدة ' + L('g/cm³') + '.', unit: 'g/cm³', ans: 0.5, sol: L('V = 1000 cm³') + ' ، ' + L('m = 500 g') + ' ، ' + L('D = 500 / 1000 = 0.5 g/cm³'), traps: [[0.0005, 'لم تحوّل الكتلة إلى غرام ( 1 kg = 1000 g ).']] };
        const a = pick([2, 4, 5]), bb = pick([2, 5, 10]), c = pick([2, 4, 5]), V = a * bb * c, D = pick([0.5, 0.8, 2, 2.5, 7.9]), m = +(D * V).toFixed(1);
        return { q: 'جسم أبعاده ' + L(a + ' cm × ' + bb + ' cm × ' + c + ' cm') + ' وكتلته ' + L(m + ' g') + ' . احسب كثافته.', unit: 'g/cm³', ans: D, sol: L('V = ' + V + ' cm³') + ' ، ' + L('D = ' + m + ' / ' + V + ' = ' + D + ' g/cm³'), traps: [[V / m, 'قسمتَ الحجم على الكتلة.']] };
      })]
    ]);
  }

  /* ======================= 8 · ترتيب السوائل ======================= */
  const LIQ = [['العسل', 1.4, '#E0A526'], ['ماء مالح', 1.1, '#7FB8D8'], ['ماء نقيّ', 1, '#BFE0F7'], ['زيت نباتيّ', 0.93, '#F3DD6B'], ['كحول', 0.79, '#EDEDF5']];
  function fmlayer(host) {
    host.innerHTML = '';
    const S = { in: [], objs: [] };
    const body = el('div'); host.append(body);
    function draw() {
      body.innerHTML = '';
      body.append(el('div', 'shint', 'اسكب السوائل بأيّ ترتيب ، ثمّ أسقط أجسامًا ( كثافات الكتاب ) :'));
      const r = el('div', 'fmseg'); LIQ.forEach((l, i) => { const x = el('button', 'fmb' + (S.in.includes(i) ? ' fmon' : ''), l[0] + ' ' + L(String(l[1]))); x.onclick = () => { if (!S.in.includes(i)) S.in.push(i); draw(); }; r.append(x); }); body.append(r);
      const r2 = el('div', 'fmseg'); [['خشب', 0.6], ['حديد', 7.9]].forEach(o => { const x = el('button', 'fmb' + (S.objs.includes(o[0]) ? ' fmon' : ''), 'أسقط ' + o[0] + ' ' + L(String(o[1]))); x.onclick = () => { if (!S.objs.includes(o[0])) S.objs.push(o[0]); draw(); }; r2.append(x); }); r2.append(btn('أفرغ المخبار', 'gh', () => { S.in = []; S.objs = []; draw(); })); body.append(r2);
      const svg = fig(body, 300, 220);
      sv('rect', { x: 110, y: 10, width: 80, height: 200, fill: '#fff', stroke: '#1F3A5F', 'stroke-width': 2 }, svg);
      const layers = S.in.slice().sort((a, b) => LIQ[b][1] - LIQ[a][1]); const h = 36; let y = 208;
      const pos = {};
      layers.forEach(i => { y -= h; sv('rect', { x: 112, y: y, width: 76, height: h, fill: LIQ[i][2] }, svg); txt(svg, 196, y + h / 2 + 4, LIQ[i][1] + '', { 'font-weight': 400, 'font-size': 10 }); pos[i] = y; });
      if (S.objs.includes('حديد')) sv('rect', { x: 125, y: 196, width: 16, height: 10, fill: '#5b6b80' }, svg);
      if (S.objs.includes('خشب')) { const top = layers.length ? pos[layers[layers.length - 1]] : 208; sv('rect', { x: 150, y: top - 10, width: 26, height: 16, fill: '#B07A2A' }, svg); }
      const inf = info(); inf.row('من الأسفل إلى الأعلى', layers.map(i => LIQ[i][0]).join(' ← ') || '—');
      if (S.objs.length) inf.row('الأجسام', (S.objs.includes('حديد') ? 'الحديد ( 7.9 ) في القاع : أكثف من الجميع . ' : '') + (S.objs.includes('خشب') ? 'الخشب ( 0.6 ) يطفو فوق الطبقة العليا : أقلّ كثافة من الجميع.' : ''));
      body.append(inf);
      body.append(note('السوائل تترتّب بحسب كثافاتها مهما كان ترتيب السكب : الأكثف في الأسفل . والكثافة لا تتغيّر بتغيّر الكمية.'));
    }
    draw();
  }

  /* ======================= 9 · قاعدة أرخميدس ======================= */
  function fmarch(host) {
    host.innerHTML = '';
    const S = { f: 0, W: 5, V: 300, liq: 1 };
    const ctl = el('div'), body = el('div'); host.append(ctl, body);
    function bar() {
      ctl.innerHTML = '';
      ctl.append(seg([[1, 'ماء عذب'], [1.1, 'ماء مالح']], S.liq, v => { S.liq = +v; bar(); draw(); }));
      ctl.append(sld(v => 'الجزء المغمور من الجسم ' + L(v + ' %'), S.f, 0, 100, 5, v => { S.f = v; draw(); }));
    }
    function draw() {
      body.innerHTML = '';
      const Vd = S.V * S.f / 100, FB = Vd * S.liq * 0.01, R = Math.max(0, S.W - FB);
      const svg = fig(body, 320, 210);
      sv('rect', { x: 80, y: 90, width: 160, height: 110, fill: S.liq > 1 ? '#9FCBE3' : '#BFE0F7', stroke: '#1F4E8C', 'stroke-width': 2 }, svg);
      const by = 56 + S.f / 100 * 62;
      sv('path', { d: 'M160 10 V' + (by - 26), stroke: '#5b6b80', 'stroke-width': 2 }, svg);
      sv('rect', { x: 148, y: 4, width: 24, height: 22, rx: 4, fill: '#fff', stroke: '#1F3A5F' }, svg);
      sv('rect', { x: 135, y: by - 26, width: 50, height: 60, fill: '#8a7a6a', stroke: '#5b4a3a' }, svg);
      if (S.f > 0) { arrow(svg, 205, by + 30, 205, by + 30 - 10 - FB * 8, '#14603f', 3); txt(svg, 212, by + 20, 'F_B', { fill: '#14603f' }); }
      arrow(svg, 120, by + 6, 120, by + 16 + S.W * 6, '#D62828', 3); txt(svg, 88, by + 30, 'W', { fill: '#D62828' });
      const inf = info();
      inf.row('حجم السائل المُزاح', L(fmt(Vd, 0) + ' cm³') + ' = حجم الجزء المغمور');
      inf.row('قوّة الطفو = وزن السائل المُزاح', '<b>' + L(fmt(FB, 2) + ' N') + '</b>');
      inf.row('قراءة الميزان', L(S.W + ' − ' + fmt(FB, 2) + ' = ' + fmt(R, 2) + ' N'));
      body.append(inf);
      body.append(note('الجسم : وزنه ' + L('5 N') + ' وحجمه ' + L('300 cm³') + ' . حُسب وزن السائل المُزاح بتقريب ' + L('g = 10 N/kg') + ' ( كلّ ' + L('1 cm³') + ' من الماء العذب وزنه ' + L('0.01 N') + ' ) ، وهي أرقام توضيحية ؛ المطلوب من الكتاب العلاقة لا الحساب.'));
      if (S.f === 100) body.append(verdict('acok', 'غُمر كلّيًّا', 'أزاح ماءً حجمه حجم الجسم كلّه ، فقوّة الطفو هي أكبر ما تكون' + (S.liq > 1 ? ' ، وهي في الماء المالح أكبر منها في العذب لأنّه أكثف.' : ' . جرّب الماء المالح.')));
    }
    bar(); draw();
  }

  /* ======================= 10 · يطفو أم يغوص ======================= */
  const LQ2 = [['ماء نقيّ', 1], ['ماء مالح', 1.1], ['زيت نباتيّ', 0.93], ['كحول', 0.79], ['العسل', 1.4]];
  function fmfloat(host) {
    modes(host, [
      ['sim', 'جرّب', b => {
        const S = { d: 0.6, l: 0 };
        const draw = () => {
          b.innerHTML = '';
          b.append(seg(LQ2.map((x, i) => [i, x[0] + ' ' + L(String(x[1]))]), S.l, v => { S.l = +v; draw(); }));
          b.append(sld(v => 'كثافة الجسم ' + L(v + ' g/cm³'), S.d, 0.2, 2, 0.01, v => { S.d = v; draw(); }));
          const dl = LQ2[S.l][1], svg = fig(b, 300, 200);
          sv('rect', { x: 60, y: 60, width: 180, height: 130, fill: '#BFE0F7', stroke: '#1F4E8C', 'stroke-width': 2 }, svg);
          const h = 40; let y, st;
          if (Math.abs(S.d - dl) < 0.005) { y = 105; st = 1; } else if (S.d > dl) { y = 190 - h; st = 0; } else { const frac = S.d / dl; y = 60 - h * (1 - frac); st = 2; }
          sv('rect', { x: 130, y: y, width: 40, height: h, fill: '#B07A2A', stroke: '#7a5c2e' }, svg);
          arrow(svg, 140, y + h / 2, 140, y + h / 2 + 38, '#D62828', 3);
          const fbL = st === 0 ? 22 : 38; arrow(svg, 160, y + h / 2, 160, y + h / 2 - fbL, '#14603f', 3);
          b.append(el('div', 'fmlg', '<span><i style="background:#D62828"></i>الوزن</span><span><i style="background:#14603f"></i>قوّة الطفو</span>'));
          const inf = info(); inf.row('المقارنة', st === 0 ? 'كثافة الجسم أكبر من كثافة السائل' : st === 1 ? 'كثافة الجسم تساوي كثافة السائل' : 'كثافة الجسم أقلّ من كثافة السائل');
          inf.row('قوّة الطفو والوزن', st === 0 ? 'قوّة الطفو أقلّ من الوزن' : 'قوّة الطفو تساوي الوزن');
          inf.row('سلوك الجسم', st === 0 ? 'يهبط ويستقرّ في القاع' : st === 1 ? 'يبقى معلّقًا داخل السائل' : 'يطفو ، والمغمور منه نحو ' + L(Math.round(S.d / dl * 100) + ' %'));
          b.append(inf);
          b.append(note('نسبة الجزء المغمور تساوي نسبة الكثافتين ، وهي من الفيزياء توضيحًا ؛ والكتاب يكتفي بأنّ الأكثف يُغمر منه جزء أكبر.'));
        }; draw();
      }],
      ['q', 'احكم', b => sorter(b, [
        ['جسم كثافته ' + L('0.5 g/cm³') + ' في ماء نقيّ.', 2, 'أقلّ كثافة ← يطفو وجزء منه مغمور.'], ['قطعة حديد ' + L('7.9 g/cm³') + ' في ماء نقيّ.', 0, 'أكثف ← تهبط إلى القاع.'],
        ['كرة كثافتها ' + L('1 g/cm³') + ' في ماء نقيّ.', 1, 'متساويتان ← تبقى معلّقة.'], ['قطعة خشب ' + L('0.6 g/cm³') + ' في الكحول ' + L('0.79 g/cm³') + '.', 2, 'أقلّ كثافة من الكحول ← تطفو.'],
        ['جسم كثافته ' + L('1.2 g/cm³') + ' في العسل ' + L('1.4 g/cm³') + '.', 2, 'أقلّ كثافة من العسل ← يطفو.'], ['جسم كثافته ' + L('1.2 g/cm³') + ' في ماء نقيّ.', 0, 'أكثف من الماء ← يغوص.'],
        ['بيضة كثافتها بين كثافتَي الماء العذب والمالح ، في الماء المالح.', 2, 'المالح أكثف منها ← تطفو.']
      ], ['يغوص إلى القاع', 'يبقى معلّقًا', 'يطفو'], 'أين يستقرّ الجسم ؟', 'قارن الكثافتين أوّلًا ، ثمّ قوّة الطفو بالوزن . والطافي المستقرّ قوّة الطفو فيه تساوي وزنه.')]
    ]);
  }

  Object.assign(window.SIMS, { fmpress, fmcalc, fmtools, fmliq, fmlift, fmbern, fmdens, fmlayer, fmarch, fmfloat });
})();
