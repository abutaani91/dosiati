/* ===== محاكاة النجوم ( علوم الأرض العاشر — الوحدة الثانية ) — البادئة nj ===== */
(function () {
  const el = (t, c, h) => { const e = document.createElement(t); if (c) e.className = c; if (h !== undefined) e.innerHTML = h; return e; };
  const btn = (txt, cls, fn) => { const b = el('button', 'sb ' + (cls || ''), txt); b.onclick = fn; return b; };
  const L = s => '<span class="ltr">' + s + '</span>';
  const sld = (lab, val, lo, hi, step, fn) => {
    const w = el('label', 'sf'); const sp = el('span', '', lab(val)); w.append(sp);
    const r = document.createElement('input'); r.type = 'range'; r.min = lo; r.max = hi; r.step = step; r.value = val;
    r.oninput = () => { sp.innerHTML = lab(+r.value); fn(+r.value); }; w.append(r); return w;
  };
  const info = () => { const b = el('div', 'cyinfo'); b.row = (k, v) => b.append(el('div', 'cyrow', '<span class="cyk">' + k + '</span><span class="cyv">' + v + '</span>')); return b; };
  const verdict = (cls, b, s) => el('div', 'acv' + (cls ? ' ' + cls : ''), '<b>' + b + '</b><span>' + s + '</span>');
  const seg = (opts, val, fn) => {
    const w = el('div', 'njseg');
    opts.forEach(o => { const b = el('button', 'njb' + (String(o[0]) === String(val) ? ' njon' : ''), o[1]); b.onclick = () => fn(o[0]); w.append(b); });
    return w;
  };
  const NS = 'http://www.w3.org/2000/svg';
  const sv = (t, a, p) => { const e = document.createElementNS(NS, t); for (const k in a) e.setAttribute(k, a[k]); if (p) p.append(e); return e; };
  const txt = (svg, x, y, s, a) => { const t = sv('text', Object.assign({ x: x, y: y, 'font-size': 10, fill: '#5b6b80', direction: 'ltr' }, a || {}), svg); t.textContent = s; return t; };
  const fig = (body, w, h) => { const s = sv('svg', { viewBox: '0 0 ' + w + ' ' + h, class: 'njsvg', preserveAspectRatio: 'xMidYMid meet' }); const f = el('div', 'njfig'); f.append(s); body.append(f); return s; };
  const shuffle = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const note = s => el('div', 'njnote', s);
  /* لون النجم بحسب الحرارة : الفئات الأربع في الكتاب */
  const COLS = [['أحمر', '#E0533B'], ['برتقاليّ', '#F2963A'], ['أصفر', '#F5CF3F'], ['أزرق', '#5B8DEF']];
  const catOf = T => T < 3900 ? 0 : T < 5200 ? 1 : T < 7500 ? 2 : 3;
  const disk = (col, px, cls) => { const d = el('span', 'njdisk' + (cls ? ' ' + cls : '')); d.style.width = d.style.height = px + 'px'; d.style.background = 'radial-gradient(circle at 35% 35%, #fff 0%, ' + col + ' 45%, ' + col + ' 100%)'; d.style.boxShadow = '0 0 ' + Math.max(4, px / 4) + 'px ' + col; return d; };
  /* لعبة تصنيف عامّة : بطاقة ← اختيار */
  function sorter(body, pool, cats, intro, done) {
    const S = { q: shuffle(pool), k: 0, ok: 0, ans: null };
    function draw() {
      body.innerHTML = '';
      if (S.k >= S.q.length) {
        body.append(verdict('acok', 'النتيجة : ' + S.ok + ' من ' + S.q.length, done));
        const r = el('div', 'srow'); r.append(btn('من جديد', 'gh', () => { S.q = shuffle(pool); S.k = 0; S.ok = 0; S.ans = null; draw(); })); body.append(r); return;
      }
      const it = S.q[S.k];
      body.append(el('div', 'shint', intro + ' ( ' + (S.k + 1) + ' / ' + S.q.length + ' )'));
      body.append(el('div', 'njq', it[0]));
      const r = el('div', 'njseg');
      cats.forEach((c, i) => { const b = el('button', 'njb' + (S.ans !== null && i === it[1] ? ' njon' : '') + (S.ans === i && i !== it[1] ? ' njno' : ''), c); b.onclick = () => { if (S.ans !== null) return; S.ans = i; if (i === it[1]) S.ok++; draw(); }; r.append(b); });
      body.append(r);
      if (S.ans !== null) {
        body.append(verdict(S.ans === it[1] ? 'acok' : 'acwarn', S.ans === it[1] ? 'صحيح' : 'الصواب : ' + cats[it[1]], it[2]));
        const r2 = el('div', 'srow'); r2.append(btn('التالي', '', () => { S.k++; S.ans = null; draw(); })); body.append(r2);
      }
    }
    draw();
  }

  /* ======================= 1 · ما النجم ؟ ======================= */
  const CAND = [
    { n: 'الشمس', sh: 1, gas: 1, hhe: 1, own: 1, d: 'كرة غاز ساخن مُتأيّن يغلب عليها الهيدروجين والهيليوم ، وتُصدر الحرارة والضوء.' },
    { n: 'نجم السمّاك الأعزل', sh: 1, gas: 1, hhe: 1, own: 1, d: 'نجم كبير جدًّا شديد الحرارة ، يُصدر ضوءه بذاته.' },
    { n: 'القمر', sh: 1, gas: 0, hhe: 0, own: 0, d: 'جسم صخريّ كرويّ يعكس ضوء الشمس ولا يُصدر ضوءًا.' },
    { n: 'كوكب الأرض', sh: 1, gas: 0, hhe: 0, own: 0, d: 'كوكب صخريّ لا يُصدر ضوءًا بذاته.' },
    { n: 'السديم', sh: 0, gas: 1, hhe: 1, own: 0, d: 'سحابة كبيرة من الغبار الكونيّ والغاز ، معظمه هيدروجين وهيليوم ، ولا اندماج فيها بعد.' },
    { n: 'نجم النسر الواقع', sh: 1, gas: 1, hhe: 1, own: 1, d: 'نجم كبير أسخن من الشمس ، يُصدر ضوءه بذاته.' }
  ];
  const CON = [['sh', 'جِرم كرويّ'], ['gas', 'غاز ساخن مُتأيّن'], ['hhe', 'يغلب عليه الهيدروجين والهيليوم'], ['own', 'يُصدر طاقة حرارية وضوئية بذاته']];
  function njdef(host) {
    host.innerHTML = '';
    const S = { m: 'ex', c: 0, qs: null };
    const top = el('div'), body = el('div'); host.append(top, body);
    function bar() { top.innerHTML = ''; top.append(seg([['ex', 'افحص بالقيود'], ['q', 'اختبر نفسك']], S.m, v => { S.m = v; bar(); draw(); })); }
    function draw() {
      body.innerHTML = '';
      if (S.m === 'ex') {
        const r = el('div', 'njseg'); CAND.forEach((c, i) => { const b = el('button', 'njb' + (i === S.c ? ' njon' : ''), c.n); b.onclick = () => { S.c = i; draw(); }; r.append(b); }); body.append(r);
        const c = CAND[S.c]; body.append(el('div', 'njq', c.d));
        const b = info(); let fail = [];
        CON.forEach(k => { b.row(k[1], c[k[0]] ? '✔ يتحقّق' : '✘ لا يتحقّق'); if (!c[k[0]]) fail.push(k[1]); }); body.append(b);
        body.append(fail.length ? verdict('acwarn', 'ليس نجمًا', 'يسقط عند قيد : ' + fail.join(' ، ') + '.') : verdict('acok', 'نجم', 'تحقّقت القيود الأربعة في تعريف الكتاب.'));
        body.append(note('وكيف عرف العلماء هذه الصفات دون الوصول إلى النجوم ؟ بتحليل أطياف الأشعّة المُنبعثة منها.'));
      } else {
        const pool = CAND.map(c => [c.n + ' : ' + c.d, CON.every(k => c[k[0]]) ? 0 : 1, CON.every(k => c[k[0]]) ? 'تتحقّق فيه القيود الأربعة.' : 'يسقط عند قيد : ' + CON.filter(k => !c[k[0]]).map(k => k[1]).join(' ، ') + '.']);
        sorter(body, pool, ['نجم', 'ليس نجمًا'], 'هل هذا نجم ؟', 'القيد الحاسم في أكثر الحالات : النجم يُصدر الطاقة بذاته ، ولا يعكسها.');
      }
    }
    bar(); draw();
  }

  /* ======================= 2 · الاندماج النوويّ ======================= */
  function nuc(svg, x, y, p, n, r) {
    const g = sv('g', {}, svg); const tot = p + n; const pts = [];
    for (let i = 0; i < tot; i++) { const a = i * 2.4, rr = tot === 1 ? 0 : r * 0.55 * Math.sqrt((i + 0.5) / tot); pts.push([x + rr * Math.cos(a), y + rr * Math.sin(a)]); }
    pts.forEach((q, i) => sv('circle', { cx: q[0], cy: q[1], r: r * 0.42, fill: i < p ? '#D62828' : '#9AA5B1', stroke: '#fff', 'stroke-width': 1.2 }, g));
    return g;
  }
  function njfuse(host) {
    host.innerHTML = '';
    const S = { T: 0, P: 0, done: false };
    const top = el('div'), body = el('div'); host.append(top, body);
    function bar() {
      top.innerHTML = '';
      top.append(el('div', 'shint', 'اضبط ظروف المكان ، ثمّ اضغط « ادمج » :'));
      top.append(seg([[0, 'حرارة منخفضة'], [1, 'حرارة مرتفعة جدًّا']], S.T, v => { S.T = +v; S.done = false; bar(); draw(); }));
      top.append(seg([[0, 'ضغط عاديّ'], [1, 'ضغط هائل']], S.P, v => { S.P = +v; S.done = false; bar(); draw(); }));
      const r = el('div', 'srow'); r.append(btn('ادمج', '', () => { S.done = true; draw(); }), btn('ضع في قلب النجم', 'gh', () => { S.T = 1; S.P = 1; S.done = false; bar(); draw(); })); top.append(r);
    }
    function draw() {
      body.innerHTML = '';
      const svg = fig(body, 340, 130);
      const ok = S.done && S.T && S.P;
      if (!ok) {
        nuc(svg, 70, 62, 1, 1, 22); nuc(svg, 150, 62, 1, 2, 26);
        txt(svg, 62, 115, '²H'); txt(svg, 142, 115, '³H'); txt(svg, 104, 66, '+', { 'font-size': 18, fill: '#1F3A5F' });
      } else {
        nuc(svg, 215, 62, 2, 2, 28); nuc(svg, 290, 40, 0, 1, 14);
        txt(svg, 203, 115, '⁴He'); txt(svg, 283, 72, 'n'); txt(svg, 250, 66, '+', { 'font-size': 18, fill: '#1F3A5F' });
        sv('path', { d: 'M40 62 h120', stroke: '#c9d2dd', 'stroke-width': 2, 'stroke-dasharray': '4 4' }, svg);
        for (let i = 0; i < 6; i++) sv('path', { d: 'M' + (300 + i * 5) + ' ' + (85 + (i % 2) * 6) + ' l6 -8 l-3 0 l6 -9', fill: 'none', stroke: '#F2A900', 'stroke-width': 2 }, svg);
        txt(svg, 40, 66, '²H + ³H', { 'font-size': 11, fill: '#9AA5B1' });
      }
      const lg = el('div', 'njlg', '<span><i style="background:#D62828"></i>بروتون</span><span><i style="background:#9AA5B1"></i>نيوترون</span>'); body.append(lg);
      if (!S.done) { body.append(note('الديتيريوم نواته بروتون ونيوترون ، والتريتيوم بروتون ونيوترونان.')); return; }
      if (!ok) {
        body.append(verdict('acwarn', 'لم يحدث اندماج', (S.T ? '' : 'الحرارة غير كافية . ') + (S.P ? '' : 'الضغط غير كافٍ . ') + 'الاندماج يحتاج ضغوطًا هائلة ودرجات حرارة مرتفعة جدًّا معًا ، ولا يتوفّر ذلك إلّا في قلب النجم.'));
        return;
      }
      body.append(verdict('acok', 'حدث الاندماج', 'اتّحدت نواتان خفيفتان فنتجت نواة هيليوم أثقل ونيوترون ، وانطلقت طاقة تصل الأرض حرارةً وضوءًا.'));
      body.append(el('div', 'njbt', 'من أين الطاقة ؟ قارن الكتلتين ( رسم توضيحيّ مُبالَغ فيه ) :'));
      const m = el('div', 'njbars');
      m.append(el('div', 'njbrow', '<span>كتلة المتفاعلات</span><b style="width:100%"></b>'));
      m.append(el('div', 'njbrow', '<span>كتلة النواتج</span><b style="width:93%"></b><em style="width:7%"></em>'));
      body.append(m, note('الجزء الناقص من الكتلة ( البرتقاليّ ) هو الذي ظهر طاقةً : « نظرًا إلى فرق الكتلة بين المواد المتفاعلة والمادة الناتجة تنتج كميات كبيرة من الطاقة ».'));
    }
    bar(); draw();
  }

  /* ======================= 3 · اللون والحرارة ======================= */
  const planck = (lnm, T) => { const l = lnm * 1e-9; return 1 / (Math.pow(l, 5) * (Math.exp(0.014388 / (l * T)) - 1)); };
  function njcolor(host) {
    host.innerHTML = '';
    const S = { T: 5800, m: 'ex', q: null, pick: [] };
    const top = el('div'), ctl = el('div'), body = el('div'); host.append(top, ctl, body);
    function bar() {
      top.innerHTML = ''; top.append(seg([['ex', 'غيّر الحرارة'], ['q', 'رتّب النجوم']], S.m, v => { S.m = v; if (v === 'q') newQ(); bar(); draw(); }));
      ctl.innerHTML = '';
      if (S.m === 'ex') ctl.append(sld(v => 'درجة حرارة السطح : ' + L(v + ' K'), S.T, 3000, 30000, 100, v => { S.T = v; draw(); }));
    }
    function newQ() { const ts = shuffle([3300, 4500, 5800, 12000]).slice(0, 3); S.q = ts; S.pick = []; }
    function draw() {
      body.innerHTML = '';
      if (S.m === 'ex') {
        const c = catOf(S.T); const row = el('div', 'njrow'); row.append(disk(COLS[c][1], 64), el('div', 'njbig', 'لون النجم : <b>' + COLS[c][0] + '</b>')); body.append(row);
        const svg = fig(body, 340, 170);
        const x0 = 30, x1 = 330, y0 = 140, y1 = 15, lmax = 2000, X = l => x0 + (l / lmax) * (x1 - x0);
        const vis = [[380, '#7b3fbf'], [450, '#3f6fd8'], [495, '#2fb5b5'], [530, '#3fb04a'], [580, '#e8d23a'], [620, '#f2963a'], [700, '#e0533b']];
        vis.forEach((v, i) => { const nx = i < vis.length - 1 ? vis[i + 1][0] : 750; sv('rect', { x: X(v[0]), y: y1, width: X(nx) - X(v[0]), height: y0 - y1, fill: v[1], opacity: 0.13 }, svg); });
        sv('path', { d: 'M' + x0 + ' ' + y0 + ' H' + x1 + ' M' + x0 + ' ' + y0 + ' V' + y1, stroke: '#1F3A5F', 'stroke-width': 1.2 }, svg);
        [0, 500, 1000, 1500, 2000].forEach(l => txt(svg, X(l) - 8, y0 + 13, String(l)));
        txt(svg, x1 - 22, y0 + 26, 'λ (nm)');
        let mx = 0; for (let l = 50; l <= lmax; l += 10) mx = Math.max(mx, planck(l, S.T));
        let d = ''; for (let l = 50; l <= lmax; l += 10) d += (l === 50 ? 'M' : 'L') + X(l).toFixed(1) + ' ' + (y0 - planck(l, S.T) / mx * (y0 - y1 - 6)).toFixed(1) + ' ';
        sv('path', { d: d, fill: 'none', stroke: COLS[c][1], 'stroke-width': 3 }, svg);
        const lp = 2.898e6 / S.T; if (lp <= lmax) { sv('path', { d: 'M' + X(lp) + ' ' + y0 + ' V' + (y1 + 6), stroke: '#1F3A5F', 'stroke-dasharray': '4 3' }, svg); txt(svg, X(lp) + 4, y1 + 14, 'λ ≈ ' + Math.round(lp) + ' nm', { fill: '#1F3A5F', 'font-weight': 700 }); }
        const b = info(); b.row('موجة الذروة', L('λ ≈ ' + Math.round(lp) + ' nm') + ( lp < 380 ? ' — أقصر من الضوء المرئيّ' : lp > 750 ? ' — أطول من الضوء المرئيّ' : '')); b.row('القاعدة', 'حرارة أعلى ← موجة ذروة أقصر ← لون يميل إلى الأزرق'); body.append(b);
        body.append(note('المنحنى مرسوم بقانون فيزيائيّ ومُطبَّع على قمّته ليُرى انزياح الذروة ؛ والأرقام توضيحية ، فالكتاب يكتفي بالعلاقة العكسية.'));
      } else {
        body.append(el('div', 'shint', 'اضغط النجوم من الأبرد إلى الأسخن :'));
        const r = el('div', 'njrow njwrap');
        S.q.forEach((T, i) => { const done = S.pick.includes(i); const b = el('button', 'njstarbtn' + (done ? ' njon' : '')); b.append(disk(COLS[catOf(T)][1], 46)); b.append(el('span', '', done ? (S.pick.indexOf(i) + 1) + '' : '؟')); b.onclick = () => { if (done || S.pick.length === 3) return; S.pick.push(i); draw(); }; r.append(b); }); body.append(r);
        if (S.pick.length === 3) {
          const ok = S.pick.every((k, j) => j === 0 || S.q[k] > S.q[S.pick[j - 1]]);
          body.append(verdict(ok ? 'acok' : 'acwarn', ok ? 'ترتيب صحيح' : 'راجع الترتيب', 'الترتيب من الأبرد : ' + S.q.map((T, i) => i).sort((a, b) => S.q[a] - S.q[b]).map(i => COLS[catOf(S.q[i])][0]).join(' ← ') + ' . الأحمر أبرد النجوم والأزرق أسخنها.'));
          const r2 = el('div', 'srow'); r2.append(btn('مجموعة أخرى', '', () => { newQ(); draw(); })); body.append(r2);
        }
      }
    }
    bar(); draw();
  }

  /* ======================= 4 · عاملا السطوع والبُعد ======================= */
  function njlum(host) {
    host.innerHTML = '';
    const S = { a: { T: 5800, R: 1, d: 10 }, b: { T: 5800, R: 1, d: 10 } };
    const top = el('div'), ctl = el('div'), body = el('div'); host.append(top, ctl, body);
    const lum = s => s.R * s.R * Math.pow(s.T / 5800, 4), app = s => lum(s) / (s.d * s.d);
    function bar() {
      top.innerHTML = ''; const r = el('div', 'srow');
      r.append(btn('الشعرى اليمانية ورجل الجبار', '', () => { S.a = { T: 9900, R: 1.7, d: 1 }; S.b = { T: 12100, R: 79, d: 100 }; bar(); draw(); }), btn('حرارة واحدة وحجمان', 'gh', () => { S.a = { T: 5800, R: 1, d: 10 }; S.b = { T: 5800, R: 10, d: 10 }; bar(); draw(); }), btn('حجم واحد وحرارتان', 'gh', () => { S.a = { T: 3500, R: 5, d: 10 }; S.b = { T: 12000, R: 5, d: 10 }; bar(); draw(); }));
      top.append(r);
      ctl.innerHTML = ''; const g = el('div', 'njgrid');
      [['a', 'النجم ( أ )'], ['b', 'النجم ( ب )']].forEach(k => {
        const c = el('div', 'njcol'); c.append(el('b', '', k[1]));
        c.append(sld(v => 'حرارة السطح ' + L(v + ' K'), S[k[0]].T, 3000, 30000, 100, v => { S[k[0]].T = v; draw(); }));
        c.append(sld(v => 'الحجم ' + L('× ' + v) + ' الشمس', S[k[0]].R, 0.5, 100, 0.5, v => { S[k[0]].R = v; draw(); }));
        c.append(sld(v => 'البُعد ' + L(v) + ' وحدة', S[k[0]].d, 1, 100, 1, v => { S[k[0]].d = v; draw(); }));
        g.append(c);
      });
      ctl.append(g);
    }
    function draw() {
      body.innerHTML = '';
      const row = el('div', 'njrow njsp');
      ['a', 'b'].forEach((k, i) => { const s = S[k]; const c = el('div', 'njcell'); c.append(disk(COLS[catOf(s.T)][1], Math.max(10, Math.min(70, 10 + Math.log10(s.R + 1) * 30)))); c.append(el('span', '', i ? '( ب )' : '( أ )')); row.append(c); });
      body.append(row);
      const la = lum(S.a), lb = lum(S.b), aa = app(S.a), ab = app(S.b);
      const bars = (t, x, y) => { body.append(el('div', 'njbt', t)); const m = el('div', 'njbars'); const mx = Math.max(x, y), w = v => Math.max(3, 100 * Math.log10(1 + 9 * v / mx)); m.append(el('div', 'njbrow', '<span>( أ )</span><b style="width:' + w(x) + '%"></b>'), el('div', 'njbrow', '<span>( ب )</span><b style="width:' + w(y) + '%;background:#1F4E8C"></b>')); body.append(m); };
      bars('السطوع الحقيقيّ : ما يُشعّه النجم في الثانية ( يعتمد على الحرارة والحجم ) :', la, lb);
      bars('ما يصلنا منه على الأرض ( يدخل البُعد ) :', aa, ab);
      const big = la > lb ? '( أ )' : '( ب )', seen = aa > ab ? '( أ )' : '( ب )';
      const r = Math.max(la, lb) / Math.min(la, lb);
      if (r < 1.05 && Math.max(aa, ab) / Math.min(aa, ab) < 1.05) { body.append(verdict('acok', 'متساويان', 'تساوت الحرارة والحجم فتساوى السطوع ، وتساوى البُعد فتساوى ما يصلنا . غيّر عاملًا واحدًا وراقب.')); body.append(note('الأرقام من نموذج فيزيائيّ توضيحيّ.')); return; }
      body.append(verdict(big === seen ? 'acok' : 'acwarn', big === seen ? 'الأسطع هو الذي يبدو ألمع' : 'الأسطع ليس الذي يبدو ألمع !', 'السطوع الحقيقيّ أكبر في ' + big + ' بنحو ' + L(r < 10 ? r.toFixed(1) : Math.round(r)) + ' مرّة ، أمّا ما يبدو لنا ألمع فـ' + seen + (big === seen ? '.' : ' لأنّ ' + big + ' أبعد . البُعد يُغيّر ما نراه لا ما يُشعّه النجم.')));
      body.append(note('الأرقام من نموذج فيزيائيّ توضيحيّ ( والقيم في مثال الشعرى ورجل الجبار تقريبية ) ؛ المطلوب من الكتاب : السطوع يتناسب طرديًّا مع الحرارة والحجم ، والبُعد يُغيّر ما نراه فقط.'));
    }
    bar(); draw();
  }

  /* ======================= 5 · مخطّط السطوع والحرارة ======================= */
  const HR = [
    { n: 'السمّاك الأعزل', T: 25000, Lm: 20000, R: 'نحو 7 أضعاف الشمس — كبير جدًّا', why: 'شديد الحرارة وكبير جدًّا ، فاجتمع العاملان فصار سطوعه هائلًا.' },
    { n: 'النسر الواقع', T: 9600, Lm: 40, R: 'نحو ضعفَي الشمس — كبير', why: 'أسخن من الشمس وأكبر منها ، فهو أسطع منها.' },
    { n: 'الشمس', T: 5800, Lm: 1, R: 'متوسّطة الحجم', why: 'متوسّطة الحرارة والحجم ، وهي المرجع الذي يُقاس به سطوع غيرها.' },
    { n: 'يد الجوزاء', T: 3600, Lm: 100000, R: 'مئات أضعاف الشمس — عملاق أحمر', why: 'سطحه بارد ( أحمر ) ، لكنّ حجمه العملاق جعل سطوعه هائلًا.' }
  ];
  function njhr(host) {
    host.innerHTML = '';
    const S = { c: 2, m: 'ex', q: null, ans: null };
    const top = el('div'), body = el('div'); host.append(top, body);
    function bar() { top.innerHTML = ''; top.append(seg([['ex', 'اقرأ المخطّط'], ['q', 'أيّهما أسطع ؟']], S.m, v => { S.m = v; S.q = shuffle([0, 1, 2, 3]).slice(0, 2); S.ans = null; bar(); draw(); })); }
    function draw() {
      body.innerHTML = '';
      const svg = fig(body, 340, 200);
      const x0 = 40, x1 = 325, y0 = 170, y1 = 12;
      const X = T => x0 + (Math.log10(30000) - Math.log10(T)) / (Math.log10(30000) - Math.log10(3000)) * (x1 - x0);
      const Y = Lm => y0 - (Math.log10(Lm) + 1) / 6.5 * (y0 - y1);
      sv('path', { d: 'M' + x0 + ' ' + y0 + ' H' + x1 + ' M' + x0 + ' ' + y0 + ' V' + y1, stroke: '#1F3A5F', 'stroke-width': 1.2 }, svg);
      [30000, 10000, 5000, 3000].forEach(T => txt(svg, X(T) - 14, y0 + 13, T + ''));
      txt(svg, x1 - 30, y0 + 26, 'T (K)');
      [0.1, 1, 100, 10000].forEach(v => txt(svg, 2, Y(v) + 3, v >= 1000 ? '10⁴' : String(v)));
      txt(svg, 44, y1 + 4, 'L / L☉');
      HR.forEach((h, i) => {
        const on = S.m === 'ex' ? i === S.c : (S.q && S.q.includes(i));
        const c = sv('circle', { cx: X(h.T), cy: Y(h.Lm), r: on ? 11 : 8, fill: COLS[catOf(h.T)][1], stroke: on ? '#1F3A5F' : '#fff', 'stroke-width': 2.5, style: 'cursor:pointer' }, svg);
        txt(svg, X(h.T) - 3, Y(h.Lm) + 3.5, String(i + 1), { fill: '#1F3A5F', 'font-weight': 700, 'pointer-events': 'none' });
        c.onclick = () => { if (S.m === 'ex') { S.c = i; draw(); } };
      });
      body.append(el('div', 'njlg', HR.map((h, i) => '<span><b>' + (i + 1) + '</b> ' + h.n + '</span>').join('')));
      body.append(note('المحور الأفقيّ : الحرارة ، والأسخن إلى اليسار . المحور الرأسيّ : السطوع مقارنةً بالشمس . المواضع تقريبية للتوضيح.'));
      if (S.m === 'ex') {
        const h = HR[S.c]; const b = info();
        b.row('النجم', h.n); b.row('اللون', COLS[catOf(h.T)][0]); b.row('الحجم', h.R); b.row('لماذا هو هنا ؟', h.why); body.append(b);
        const r = el('div', 'njseg'); HR.forEach((x, i) => { const bb = el('button', 'njb' + (i === S.c ? ' njon' : ''), (i + 1) + ' · ' + x.n); bb.onclick = () => { S.c = i; draw(); }; r.append(bb); }); body.append(r);
      } else {
        const [a, b2] = S.q; body.append(el('div', 'shint', 'أيّ النجمين سطوعه أكبر ؟'));
        const r = el('div', 'njseg'); [a, b2].forEach(i => { const bb = el('button', 'njb' + (S.ans === i ? ' njon' : ''), HR[i].n); bb.onclick = () => { if (S.ans === null) { S.ans = i; draw(); } }; r.append(bb); }); body.append(r);
        if (S.ans !== null) {
          const best = HR[a].Lm > HR[b2].Lm ? a : b2;
          body.append(verdict(S.ans === best ? 'acok' : 'acwarn', S.ans === best ? 'صحيح' : 'الأسطع : ' + HR[best].n, HR[best].why));
          const r2 = el('div', 'srow'); r2.append(btn('نجمان آخران', '', () => { S.q = shuffle([0, 1, 2, 3]).slice(0, 2); S.ans = null; draw(); })); body.append(r2);
        }
      }
    }
    bar(); draw();
  }

  /* ======================= 6 · المصطلحات ======================= */
  const TERMS = [
    ['الأنظمة النجمية', 'مجموعات من النجوم ترتبط بقوى جذب تجعلها تدور حول بعضها.'],
    ['النجوم الثنائية', 'نجمان اثنان فقط يدور أحدهما حول الآخر بقوى تجاذبية متبادلة.'],
    ['النجوم المتعدّدة', 'من ثلاثة نجوم إلى سبعة ، مرتبطة بقوى تجاذب فتدور حول بعضها.'],
    ['العناقيد النجمية', 'من مئة نجم إلى مئات الآلاف ، مرتبطة جذبيًّا فتتحرّك وحدةً واحدة في اتجاه واحد.'],
    ['الكوكبات', 'مجموعات نجمية لا ترتبط نجومها جذبيًّا ، وتظهر بانعكاس الأشعة الواصلة منها ؛ مجموعات ظاهرية.'],
    ['دائرة البروج', 'دائرة تصنعها الشمس في أثناء حركتها الظاهرية حول الأرض.'],
    ['كوكبات البروج', 'الكوكبات التي تقطعها الشمس في مسارها الظاهريّ ، وعددها 12.']
  ];
  function njterm(host) {
    host.innerHTML = '';
    const S = { t: null, done: [], bad: null, ord: shuffle(TERMS.map((x, i) => i)) };
    const body = el('div'); host.append(body);
    function draw() {
      body.innerHTML = '';
      body.append(el('div', 'shint', 'اختر مصطلحًا ، ثمّ اختر تعريفه :'));
      const r = el('div', 'njseg');
      TERMS.forEach((t, i) => { const b = el('button', 'njb' + (S.done.includes(i) ? ' njok' : i === S.t ? ' njon' : ''), t[0]); b.onclick = () => { if (!S.done.includes(i)) { S.t = i; S.bad = null; draw(); } }; r.append(b); });
      body.append(r);
      const w = el('div', 'njcards');
      S.ord.forEach(i => { const ok = S.done.includes(i); const c = el('button', 'njcard' + (ok ? ' njok' : '') + (S.bad === i ? ' njno' : ''), (ok ? '<b>' + TERMS[i][0] + '</b>' : '') + '<span>' + TERMS[i][1] + '</span>'); c.onclick = () => { if (ok || S.t === null) return; if (i === S.t) { S.done.push(i); S.t = null; S.bad = null; } else S.bad = i; draw(); }; w.append(c); });
      body.append(w);
      if (S.bad !== null) body.append(verdict('acwarn', 'ليس هذا', 'اسأل : هل ترتبط النجوم جذبيًّا ؟ وكم عددها ؟ أم أنّ الحديث عن مسار الشمس ؟'));
      if (S.done.length === TERMS.length) { body.append(verdict('acok', 'أتممتَ المطابقة', 'المفتاح في كلّ مصطلح : هل ترتبط نجومه جذبيًّا ؟ الكوكبات وحدها لا ترتبط.')); const r2 = el('div', 'srow'); r2.append(btn('من جديد', 'gh', () => { S.done = []; S.t = null; S.ord = shuffle(S.ord); draw(); })); body.append(r2); }
    }
    draw();
  }

  /* ======================= 7 · تمييز الأنظمة ======================= */
  const SYSC = [
    { k: 'bin', n: 2, b: 1, d: 'نجمان مرتبطان بقوى تجاذبية متبادلة ، يدور أحدهما حول الآخر.' },
    { k: 'mul', n: 4, b: 1, d: 'أربعة نجوم مرتبطة بقوى تجاذب تدور حول بعضها.' },
    { k: 'mul', n: 6, b: 1, d: 'ستّة نجوم مرتبطة جذبيًّا تدور حول بعضها.' },
    { k: 'clo', n: 300, b: 1, d: 'نحو ثلاثمئة نجم مرتبطة جذبيًّا ، المسافات بينها كبيرة فتبدو مبعثرة ، وتتحرّك معًا.' },
    { k: 'clc', n: 100000, b: 1, d: 'نحو مئة ألف نجم مرتبطة جذبيًّا ، متراصّة تبدو كتلة مستديرة ، وتتحرّك وحدةً واحدة.' },
    { k: 'con', n: 7, b: 0, d: 'سبعة نجوم لامعة تبدو متجاورة في السماء ، لكنّها متباعدة جدًّا ولا ترتبط جذبيًّا.' },
    { k: 'con', n: 2, b: 0, d: 'نجمان يبدوان متجاورين من الأرض ، أحدهما أبعد من الآخر بكثير ولا رابط جذبيّ بينهما.' },
    { k: 'one', n: 1, b: 0, d: 'نجم وحيد لا يرتبط بنجم آخر ، مثل الشمس.' }
  ];
  const SYSN = { bin: 'نجوم ثنائية', mul: 'نجوم متعدّدة', clo: 'عنقود نجميّ مفتوح', clc: 'عنقود نجميّ مغلق', con: 'كوكبة ( مجموعة ظاهرية )', one: 'نجم منفرد' };
  function njsys(host) {
    host.innerHTML = '';
    const S = { q: shuffle(SYSC), k: 0, b: null, t: null, ok: 0 };
    const body = el('div'); host.append(body);
    function sky(c) {
      const svg = fig(body, 300, 120); let pts = [];
      const rnd = (s => () => (s = (s * 9301 + 49297) % 233280) / 233280)(c.n * 7 + c.k.length);
      if (c.k === 'clc') for (let i = 0; i < 160; i++) { const a = rnd() * 6.283, r = Math.pow(rnd(), 1.8) * 48; pts.push([150 + r * Math.cos(a), 60 + r * Math.sin(a), 1.4]); }
      else if (c.k === 'clo') for (let i = 0; i < 40; i++) pts.push([40 + rnd() * 220, 12 + rnd() * 96, 2]);
      else if (c.k === 'con') { for (let i = 0; i < c.n; i++) pts.push([40 + i * (220 / Math.max(1, c.n - 1)), 30 + rnd() * 60, 3.4]); sv('path', { d: pts.map((p, i) => (i ? 'L' : 'M') + p[0] + ' ' + p[1]).join(' '), stroke: '#9AA5B1', 'stroke-dasharray': '3 4', fill: 'none' }, svg); }
      else { const n = c.n; for (let i = 0; i < n; i++) { const a = i * 6.283 / n; pts.push([150 + (n > 1 ? 26 : 0) * Math.cos(a), 60 + (n > 1 ? 26 : 0) * Math.sin(a), 5]); } if (n > 1) sv('circle', { cx: 150, cy: 60, r: 26, fill: 'none', stroke: '#c9d2dd', 'stroke-dasharray': '3 3' }, svg); }
      sv('rect', { x: 0, y: 0, width: 300, height: 120, fill: '#0f1e33' }, svg).parentNode.insertBefore(svg.lastChild, svg.firstChild);
      pts.forEach(p => sv('circle', { cx: p[0], cy: p[1], r: p[2], fill: '#fdf6d8' }, svg));
    }
    function draw() {
      body.innerHTML = '';
      if (S.k >= S.q.length) { body.append(verdict('acok', 'النتيجة : ' + S.ok + ' من ' + S.q.length, 'السؤال الأوّل دائمًا : هل ترتبط جذبيًّا ؟ ثمّ العدد.')); const r = el('div', 'srow'); r.append(btn('من جديد', 'gh', () => { S.q = shuffle(SYSC); S.k = 0; S.ok = 0; S.b = S.t = null; draw(); })); body.append(r); return; }
      const c = S.q[S.k]; body.append(el('div', 'shint', 'الحالة ' + (S.k + 1) + ' من ' + S.q.length)); sky(c); body.append(el('div', 'njq', c.d));
      body.append(el('div', 'njbt', 'السؤال الأوّل : هل ترتبط نجومها جذبيًّا ؟'));
      body.append(seg([[1, 'نعم ، مرتبطة'], [0, 'لا ترتبط']], S.b, v => { if (S.t === null) { S.b = +v; draw(); } }));
      if (S.b !== null) {
        if (S.b !== c.b) { body.append(verdict('acwarn', 'أعد القراءة', c.b ? 'الوصف يذكر ارتباطًا جذبيًّا.' : 'الوصف ينفي الارتباط الجذبيّ.')); S.b = null; const r = el('div', 'srow'); r.append(btn('حاول مجدّدًا', 'gh', () => draw())); body.append(r); return; }
        body.append(el('div', 'njbt', 'السؤال الثاني : ما نوعها ؟'));
        const opts = c.b ? ['bin', 'mul', 'clo', 'clc'] : ['con', 'one'];
        body.append(seg(opts.map(k => [k, SYSN[k]]), S.t, v => { if (S.t === null) { S.t = v; if (v === c.k) S.ok++; draw(); } }));
        if (S.t !== null) {
          body.append(verdict(S.t === c.k ? 'acok' : 'acwarn', S.t === c.k ? 'صحيح' : 'الصواب : ' + SYSN[c.k], { bin: 'اثنان فقط.', mul: 'من ثلاثة إلى سبعة.', clo: 'مئة فأكثر ، مبعثرة لكبر المسافات بينها.', clc: 'مئة فأكثر ، متراصّة تبدو كتلة مستديرة.', con: 'لا ارتباط جذبيًّا مهما كان العدد.', one: 'نجم وحيد مثل الشمس.' }[c.k]));
          const r = el('div', 'srow'); r.append(btn('التالي', '', () => { S.k++; S.b = S.t = null; draw(); })); body.append(r);
        }
      }
    }
    draw();
  }

  /* ======================= 8 · رسم الكوكبات ======================= */
  const DIP = [[40, 250], [95, 222], [140, 212], [185, 218], [197, 268], [265, 290], [255, 225]];
  const ZOD = ['الحمل', 'الثور', 'الجوزاء', 'السرطان', 'الأسد', 'العذراء', 'الميزان', 'العقرب', 'القوس', 'الجدي', 'الدلو', 'الحوت'];
  function njdraw(host) {
    host.innerHTML = '';
    const S = { m: 'dip', k: 0, pol: false, z: [], zb: null, ord: shuffle(ZOD) };
    const top = el('div'), body = el('div'); host.append(top, body);
    function bar() { top.innerHTML = ''; top.append(seg([['dip', 'ارسم الدبّ الأكبر'], ['zod', 'رتّب كوكبات البروج']], S.m, v => { S.m = v; bar(); draw(); })); }
    function draw() {
      body.innerHTML = '';
      if (S.m === 'dip') {
        body.append(el('div', 'shint', S.k < 7 ? 'صِل النجوم بالترتيب : اضغط النجم رقم ' + (S.k + 1) : S.pol ? 'نجما حافّة الوعاء يُشيران إلى النجم القطبيّ.' : 'اكتمل الشكل . اضغط « أين النجم القطبيّ ؟ »'));
        const svg = fig(body, 320, 310);
        sv('rect', { x: 0, y: 0, width: 320, height: 310, fill: '#0f1e33' }, svg);
        let d = ''; for (let i = 0; i < S.k; i++) d += (i ? 'L' : 'M') + DIP[i][0] + ' ' + DIP[i][1] + ' ';
        if (S.k === 7) d += 'L' + DIP[3][0] + ' ' + DIP[3][1];
        if (d) sv('path', { d: d, stroke: '#F5CF3F', 'stroke-width': 2.2, fill: 'none' }, svg);
        if (S.pol) { const a = DIP[5], b = DIP[6], P = [b[0] + 3.2 * (b[0] - a[0]), b[1] + 3.2 * (b[1] - a[1])]; sv('path', { d: 'M' + a[0] + ' ' + a[1] + ' L' + P[0] + ' ' + P[1], stroke: '#9fc3ff', 'stroke-width': 1.6, 'stroke-dasharray': '5 4' }, svg); sv('circle', { cx: P[0], cy: P[1], r: 7, fill: '#fff', stroke: '#9fc3ff', 'stroke-width': 3 }, svg); txt(svg, P[0] + 12, P[1] + 4, 'N ↑', { fill: '#fff', 'font-size': 13, 'font-weight': 700 }); }
        sv('circle', { cx: DIP[1][0] + 7, cy: DIP[1][1] - 9, r: 2, fill: '#fdf6d8' }, svg);
        DIP.forEach((p, i) => { const c = sv('circle', { cx: p[0], cy: p[1], r: 7, fill: i < S.k ? '#F5CF3F' : '#fdf6d8', style: 'cursor:pointer' }, svg); txt(svg, p[0] - 3, p[1] + 20, String(i + 1), { fill: '#c9d2dd', 'font-size': 11 }); c.onclick = () => { if (i === S.k) { S.k++; draw(); } }; });
        body.append(el('div', 'njlg', '<span>النجم <b>2</b> هو المئزر ، وبجانبه النجم الخافت السهى ( نجمان ثنائيان ).</span><span>النجوم <b>4 – 7</b> الوعاء ، و<b>1 – 3</b> المقبض.</span>'));
        const r = el('div', 'srow');
        if (S.k === 7 && !S.pol) r.append(btn('أين النجم القطبيّ ؟', '', () => { S.pol = true; draw(); }));
        r.append(btn('من جديد', 'gh', () => { S.k = 0; S.pol = false; draw(); })); body.append(r);
        if (S.pol) body.append(verdict('acok', 'وجدتَ الشمال', 'مُدّ الخطّ من النجم 6 إلى النجم 7 ( حافّة الوعاء ) واستمرّ ، فتصل إلى النجم القطبيّ الذي يدلّ على جهة الشمال . والمسافة في الرسم توضيحية.'));
      } else {
        body.append(el('div', 'shint', 'اضغط كوكبات البروج بترتيبها في الكتاب ، بدءًا بالحمل :'));
        const ring = el('div', 'njring');
        ZOD.forEach((z, i) => { const a = -Math.PI / 2 + i * Math.PI / 6; const s = el('span', 'njzs' + (i < S.z.length ? ' njon' : ''), i < S.z.length ? z : (i + 1) + ''); s.style.left = (50 + 40 * Math.cos(a)) + '%'; s.style.top = (50 + 40 * Math.sin(a)) + '%'; ring.append(s); });
        ring.append(el('span', 'njsun', '☉')); body.append(ring);
        const w = el('div', 'njseg'); S.ord.forEach(z => { if (S.z.includes(z)) return; const b = el('button', 'njb' + (S.zb === z ? ' njno' : ''), z); b.onclick = () => { if (z === ZOD[S.z.length]) { S.z.push(z); S.zb = null; } else S.zb = z; draw(); }; w.append(b); }); body.append(w);
        if (S.zb) body.append(verdict('acwarn', 'ليست التالية', 'التالية بعد ' + (S.z.length ? S.z[S.z.length - 1] : 'البداية') + ' في ترتيب الكتاب غيرها.'));
        if (S.z.length === 12) { body.append(verdict('acok', 'اكتملت دائرة البروج', 'اثنتا عشرة كوكبة من أصل 88 كوكبة ( 48 قديمة + 40 جديدة ) ، وهي وحدها التي يقطعها مسار الشمس الظاهريّ.')); const r = el('div', 'srow'); r.append(btn('من جديد', 'gh', () => { S.z = []; S.ord = shuffle(ZOD); draw(); })); body.append(r); }
      }
    }
    bar(); draw();
  }

  /* ======================= 9 · النجوم في حياتنا ======================= */
  const USES = [
    ['راعٍ ضلّ طريقه ليلًا ، فبحث عن الدبّ الأكبر ثمّ عن النجم القطبيّ.', 0, 'النجم القطبيّ يدلّ على جهة الشمال ، ويُعرف عن طريق الدبّ الأكبر.'],
    ['لاحظ فلّاح قديمًا أنّ كوكبات معيّنة بدأت تظهر في السماء بعد غياب ، فعرف أنّ فصلًا جديدًا بدأ.', 1, 'تغيّر الكوكبات الظاهرة يدلّ على بداية الفصول الأربعة.'],
    ['قرّر فلّاح أن يبذر القمح حين ظهرت كوكبات فصل معيّن.', 2, 'بمعرفة الفصول تمكّن القدماء من تحديد أوقات الزراعة.'],
    ['قافلة عربية تسير ليلًا في الصحراء ، وتعرف بالنجوم كم مضى من الليل.', 3, 'كانت النجوم دليل العرب في ترحالهم ، وبها عرفوا الوقت.'],
    ['بحّار يريد أن يتّجه شمالًا في ليلة صافية.', 0, 'النجم القطبيّ يدلّ على الشمال.'],
    ['قوم ينتظرون ظهور كوكبة بعينها ليبدأوا موسم الحرث.', 2, 'هذه فائدة الزراعة ، وهي مبنيّة على معرفة الفصل.']
  ];
  function njuse(host) {
    host.innerHTML = '';
    const S = { m: 'orb', pos: 0 };
    const top = el('div'), body = el('div'); host.append(top, body);
    function bar() { top.innerHTML = ''; top.append(seg([['orb', 'لماذا تتبدّل الكوكبات ؟'], ['q', 'أيّ فائدة ؟']], S.m, v => { S.m = v; bar(); draw(); })); }
    function draw() {
      body.innerHTML = '';
      if (S.m === 'q') { sorter(body, USES, ['تحديد الاتجاه', 'معرفة الفصل', 'وقت الزراعة', 'السفر والوقت'], 'أيّ فائدة من فوائد النجوم في هذا الموقف ؟', 'السلسلة : تغيّر الكوكبات ← معرفة الفصل ← وقت الزراعة ، والنجم القطبيّ ← الشمال.'); return; }
      body.append(el('div', 'shint', 'حرّك الأرض في مدارها حول الشمس ( رسم توضيحيّ غير مُقاس ) :'));
      body.append(seg([[0, 'الموضع 1'], [1, 'الموضع 2'], [2, 'الموضع 3'], [3, 'الموضع 4']], S.pos, v => { S.pos = +v; draw(); }));
      const svg = fig(body, 300, 300); const cx = 150, cy = 150;
      sv('circle', { cx: cx, cy: cy, r: 128, fill: 'none', stroke: '#e3e8ef', 'stroke-width': 18 }, svg);
      sv('circle', { cx: cx, cy: cy, r: 58, fill: 'none', stroke: '#c9d2dd', 'stroke-dasharray': '4 4' }, svg);
      sv('circle', { cx: cx, cy: cy, r: 16, fill: '#F5CF3F' }, svg);
      const ang = -Math.PI / 2 + S.pos * Math.PI / 2, ex = cx + 58 * Math.cos(ang), ey = cy + 58 * Math.sin(ang);
      const vis = [], hid = [];
      for (let i = 0; i < 12; i++) { const a = -Math.PI / 2 + i * Math.PI / 6; const d = Math.cos(a - ang); const x = cx + 128 * Math.cos(a), y = cy + 128 * Math.sin(a); sv('circle', { cx: x, cy: y, r: 8, fill: d > 0.45 ? '#1F4E8C' : d < -0.45 ? '#e3e8ef' : '#9AA5B1' }, svg); txt(svg, x - 4, y + 3.5, String(i + 1), { fill: d > 0.45 ? '#fff' : '#5b6b80', 'font-size': 9 }); if (d > 0.45) vis.push(ZOD[i]); if (d < -0.45) hid.push(ZOD[i]); }
      sv('path', { d: 'M' + ex + ' ' + ey + ' L' + (ex + 50 * Math.cos(ang)) + ' ' + (ey + 50 * Math.sin(ang)), stroke: '#1F4E8C', 'stroke-width': 2, 'stroke-dasharray': '3 3' }, svg);
      sv('circle', { cx: ex, cy: ey, r: 9, fill: '#2f7fcf' }, svg);
      body.append(el('div', 'njlg', '<span><i style="background:#2f7fcf"></i>الأرض ، والخطّ المتقطّع : جهة سماء الليل</span><span><i style="background:#1F4E8C"></i>كوكبات تُرى ليلًا</span><span><i style="background:#e3e8ef"></i>كوكبات خلف الشمس لا تُرى</span>'));
      const b = info(); b.row('تظهر ليلًا', vis.join(' ، ')); b.row('تختفي ( خلف الشمس )', hid.join(' ، ')); body.append(b);
      body.append(verdict('acok', 'الكوكبات لم تتحرّك', 'الذي تغيّر موضع الأرض حول الشمس ، فصار الجانب الليليّ يواجه كوكبات أخرى . وبهذا عرف القدماء بداية الفصول ، ومنها أوقات الزراعة.'));
    }
    bar(); draw();
  }

  /* ======================= 10 · الفلك والتنجيم ======================= */
  const SCI = [
    ['النجم الأزرق أعلى حرارةً من النجم الأحمر.', 0, 'يمكن قياسها بتحليل أطياف الأشعّة : حقيقة فلكية.'],
    ['مواليد برج الحمل سيكونون محظوظين هذا الشهر.', 1, 'ربط الأبراج بالحظّ تخمين لا يمكن التحقّق منه : تنجيم.'],
    ['عدد كوكبات البروج اثنتا عشرة كوكبة.', 0, 'حقيقة يمكن رصدها : الكوكبات التي يقطعها مسار الشمس الظاهريّ.'],
    ['ستنجح تجارتك لأنّ برجك في أفضل أحواله.', 1, 'توقّع مستقبل شخص من برجه : تنجيم.'],
    ['النجم القطبيّ يدلّ على جهة الشمال.', 0, 'معلومة يمكن التحقّق منها بالرصد : علم فلك.'],
    ['من وُلد تحت برج الأسد قائد بطبعه.', 1, 'ربط الطباع بالأبراج تخمين : تنجيم.'],
    ['يجمع مقراب فاست موجات الراديو القادمة من الفضاء.', 0, 'رصد بأداة علمية : علم فلك.'],
    ['ظهور كوكبة معيّنة يعني أنّ مصيبة ستقع.', 1, 'ربط الكوكبات بالأحداث والأقدار : تنجيم ، ومن المعتقدات غير الصحيحة.'],
    ['تتناسب كتلة النجم عكسيًّا مع مدّة حياته.', 0, 'نتيجة توصّل إليها العلماء بدراسة النجوم : علم فلك.']
  ];
  function njsci(host) { host.innerHTML = ''; const b = el('div'); host.append(b); sorter(b, SCI, ['علم الفلك', 'التنجيم'], 'إلى أيّهما تنتمي العبارة ؟', 'المعيار : هل يمكن رصد العبارة وقياسها والتحقّق منها ؟ والإيمان بالأبراج وتوقّع المستقبل من المعتقدات غير الصحيحة.'); }

  /* ======================= 11 · دورة الحياة بحسب الكتلة ======================= */
  const PATH = {
    mid: [['السديم', '#c98bd6', 60, 'سحابة غبار كونيّ وغاز ، معظمها هيدروجين وهيليوم.'], ['نجم أوّليّ', '#F2963A', 34, 'ينكمش الجزء الأكثف بالجاذبية فترتفع حرارة القلب.'], ['نجم تتابع رئيس', '#F5CF3F', 30, 'يبدأ الاندماج ، ويقضي النجم هنا معظم حياته.'], ['عملاق أحمر', '#E0533B', 62, 'ينفد الوقود من القلب ، فيكبر النجم ويبرد سطحه.'], ['سديم كوكبيّ', '#7fc8c8', 52, 'يفقد العملاق الأحمر الوقود فيتكوّن سديم كرويّ كثيف.'], ['قزم أبيض', '#e8eef7', 14, 'بقايا قلب السديم الكوكبيّ : كحجم الأرض وكتلة كالشمس.'], ['قزم أسود', '#33393f', 14, 'القزم الأبيض بعد أن يتوقّف عن التوهّج بمليارات السنين.']],
    big: [['السديم', '#c98bd6', 60, 'سحابة غبار كونيّ وغاز ، معظمها هيدروجين وهيليوم.'], ['نجم أوّليّ', '#F2963A', 38, 'ينكمش الجزء الأكثف بالجاذبية فترتفع حرارة القلب.'], ['نجم تتابع رئيس كبير', '#5B8DEF', 40, 'يبدأ الاندماج ، ويستنفد وقوده أسرع بكثير من النجم المتوسّط.'], ['نجم فوق عملاق أحمر', '#C0392B', 76, 'ينفد الوقود فيكبر كبرًا هائلًا ، مثل قلب العقرب.'], ['نجم فوق مُستعِر', '#fff3a8', 70, 'انفجار عظيم خلال زمن قصير يُطلق طاقة تعادل ما تُصدره الشمس طوال حياتها.'], ['نجم نيوترونيّ أو ثقب أسود', '#1b1f24', 14, 'بحسب الكتلة المتبقّية في القلب.']]
  };
  const ML = [[0.75, 15], [1, 10], [2, 4], [3, 1]];
  function njlife(host) {
    host.innerHTML = '';
    const S = { m: 'mid', k: 0, g: null };
    const top = el('div'), body = el('div'); host.append(top, body);
    function bar() { top.innerHTML = ''; top.append(seg([['mid', 'نجم متوسّط الكتلة'], ['big', 'نجم كبير الكتلة'], ['gr', 'الكتلة ومدّة الحياة']], S.m, v => { S.m = v; S.k = 0; bar(); draw(); })); }
    function draw() {
      body.innerHTML = '';
      if (S.m === 'gr') {
        body.append(el('div', 'shint', 'من الرسم البيانيّ في مراجعة الوحدة : اضغط نقطة لتقرأها.'));
        const svg = fig(body, 320, 190); const x0 = 40, x1 = 305, y0 = 160, y1 = 14, X = m => x0 + (m / 3.2) * (x1 - x0), Y = t => y0 - (t / 16) * (y0 - y1);
        sv('path', { d: 'M' + x0 + ' ' + y0 + ' H' + x1 + ' M' + x0 + ' ' + y0 + ' V' + y1, stroke: '#1F3A5F', 'stroke-width': 1.2 }, svg);
        [0.5, 1, 1.5, 2, 2.5, 3].forEach(m => txt(svg, X(m) - 7, y0 + 13, String(m)));
        [0, 4, 8, 12, 16].forEach(t => txt(svg, 18, Y(t) + 3, String(t)));
        txt(svg, x1 - 40, y0 + 26, 'M / M☉'); txt(svg, 44, y1 + 2, '×10⁹ y');
        sv('path', { d: ML.map((p, i) => (i ? 'L' : 'M') + X(p[0]) + ' ' + Y(p[1])).join(' '), stroke: '#5B8DEF', 'stroke-width': 2.5, fill: 'none' }, svg);
        ML.forEach((p, i) => { const c = sv('circle', { cx: X(p[0]), cy: Y(p[1]), r: S.g === i ? 9 : 7, fill: S.g === i ? '#1F3A5F' : '#5B8DEF', stroke: '#fff', 'stroke-width': 2, style: 'cursor:pointer' }, svg); c.onclick = () => { S.g = i; draw(); }; });
        if (S.g !== null) { const p = ML[S.g]; const b = info(); b.row('الكتلة', L(p[0]) + ' من كتلة الشمس' + (p[0] === 1 ? ' ( الشمس )' : '')); b.row('مدّة الحياة قبل نفاد الوقود', 'نحو ' + L(p[1]) + ' بليون سنة'); body.append(b); }
        body.append(verdict('acok', 'العلاقة عكسية', 'كلّما زادت الكتلة قصرت الحياة : النجوم الكبيرة تستنفد وقودها النوويّ أسرع بكثير.'));
        return;
      }
      const P = PATH[S.m];
      const row = el('div', 'njstages');
      P.forEach((p, i) => { const c = el('button', 'njst' + (i === S.k ? ' njon' : '') + (i > S.k ? ' njfut' : '')); const d = disk(p[1], Math.round(p[2] * 0.55)); c.append(d, el('span', '', p[0])); c.onclick = () => { S.k = i; draw(); }; row.append(c); if (i < P.length - 1) row.append(el('i', 'njarr', '←')); });
      body.append(row);
      const b = info(); b.row('المرحلة ' + (S.k + 1) + ' من ' + P.length, '<b>' + P[S.k][0] + '</b>'); b.row('ما يحدث', P[S.k][3]); body.append(b);
      const r = el('div', 'srow'); if (S.k < P.length - 1) r.append(btn('التالي', '', () => { S.k++; draw(); })); r.append(btn('من البداية', 'gh', () => { S.k = 0; draw(); })); body.append(r);
      if (S.k === P.length - 1) body.append(verdict('acok', 'انتهى المسار', S.m === 'mid' ? 'مسار الشمس ويد الجوزاء . والبداية ( سديم ← أوّليّ ← تتابع رئيس ) مشتركة بين المسارين.' : 'مسار قلب العقرب . والكتلة الأكبر تعني حياة أقصر ونهاية أعنف.'));
    }
    bar(); draw();
  }

  /* ======================= 12 · التوازن والاندماج ======================= */
  const BAL = [
    ['سديم ينكمش', 3, 0, 70, '#c98bd6', 'الجاذبية وحدها تعمل : المادّة تنكمش نحو المركز ، ولا ضغط حراريّ يُذكر بعد.'],
    ['نجم أوّليّ', 3, 2, 46, '#F2963A', 'الانكماش رفع الطاقة الحركية وحرارة القلب ، فتولّد ضغط حراريّ يُعاكس الانكماش ، لكنّه أضعف منه ، ولا اندماج بعد.'],
    ['تتابع رئيس', 3, 3, 40, '#F5CF3F', 'عند 1.5 مليون كلفن بدأ الاندماج : الضغط الحراريّ يساوي الانكماش الجذبيّ ، فيستقرّ النجم معظم حياته.'],
    ['نفاد وقود القلب', 3, 4, 70, '#E0533B', 'يسخن الغلاف المحيط بالقلب ويبدأ فيه اندماج الهيدروجين ، فيغلب الضغط الحراريّ : يكبر النجم عملاقًا أحمر ويبرد سطحه.'],
    ['توقّف الاندماج', 3, 0.5, 18, '#e8eef7', 'لم يبقَ ما يولّد الضغط الحراريّ ، فتغلب الجاذبية : ينتهي النجم قزمًا ( أو ينفجر إن كان كبير الكتلة ).']
  ];
  function njbal(host) {
    host.innerHTML = '';
    const S = { k: 2 };
    const top = el('div'), body = el('div'); host.append(top, body);
    function bar() { top.innerHTML = ''; top.append(seg(BAL.map((b, i) => [i, (i + 1) + ' · ' + b[0]]), S.k, v => { S.k = +v; bar(); draw(); })); }
    function draw() {
      body.innerHTML = '';
      const B = BAL[S.k]; const svg = fig(body, 300, 220); const cx = 150, cy = 110, R = B[3];
      sv('circle', { cx: cx, cy: cy, r: R, fill: B[4], opacity: S.k === 0 ? 0.55 : 1 }, svg);
      if (S.k >= 2 && S.k <= 3) sv('circle', { cx: cx, cy: cy, r: Math.min(14, R * 0.3), fill: '#fff8d0' }, svg);
      for (let i = 0; i < 8; i++) {
        const a = i * Math.PI / 4, a2 = a + Math.PI / 8;
        const gL = B[1] * 9, pL = B[2] * 9;
        const ox = cx + (R + 34) * Math.cos(a), oy = cy + (R + 34) * Math.sin(a);
        sv('path', { d: 'M' + ox + ' ' + oy + ' L' + (ox - gL * Math.cos(a)) + ' ' + (oy - gL * Math.sin(a)), stroke: '#1F4E8C', 'stroke-width': 3, 'marker-end': 'url(#njah)' }, svg);
        if (pL > 0) { const ix = cx + (R + 4) * Math.cos(a2), iy = cy + (R + 4) * Math.sin(a2); sv('path', { d: 'M' + ix + ' ' + iy + ' L' + (ix + pL * Math.cos(a2)) + ' ' + (iy + pL * Math.sin(a2)), stroke: '#D62828', 'stroke-width': 3, 'marker-end': 'url(#njah2)' }, svg); }
      }
      const defs = sv('defs', {}, svg);
      [['njah', '#1F4E8C'], ['njah2', '#D62828']].forEach(m => { const mk = sv('marker', { id: m[0], markerWidth: 6, markerHeight: 6, refX: 3, refY: 3, orient: 'auto' }, defs); sv('path', { d: 'M0 0 L6 3 L0 6 z', fill: m[1] }, mk); });
      body.append(el('div', 'njlg', '<span><i style="background:#1F4E8C"></i>الانكماش الجذبيّ نحو الداخل</span><span><i style="background:#D62828"></i>الضغط الحراريّ نحو الخارج</span>'));
      const b = info(); b.row('المقارنة', B[2] === 0 ? 'لا ضغط حراريّ يُذكر' : B[2] < B[1] ? 'الانكماش الجذبيّ أكبر' : B[2] === B[1] ? 'متساويان : اتّزان' : 'الضغط الحراريّ أكبر'); b.row('ما يحدث', B[5]); body.append(b);
      const r = el('div', 'srow'); if (S.k < BAL.length - 1) r.append(btn('المرحلة التالية', '', () => { S.k++; bar(); draw(); })); body.append(r);
      if (S.k === 2) body.append(verdict('acok', 'الاندماج يُبقي النجم حيًّا', 'هو مصدر الضوء والحرارة ، وهو مصدر الضغط الذي يمنع الانهيار . فإذا توقّف انتهت حياة النجم.'));
    }
    bar(); draw();
  }

  /* ======================= 13 · عمر الشمس ======================= */
  function njsun(host) {
    host.innerHTML = '';
    const S = { t: 4.6, m: 'tl', p: null, ans: '', res: null };
    const top = el('div'), ctl = el('div'), body = el('div'); host.append(top, ctl, body);
    const ST = [[0, 'الولادة ( نجم أوّليّ )'], [4.6, 'الشمس اليوم'], [10.1, 'عملاق أحمر'], [12.1, 'قزم أبيض']];
    function bar() {
      top.innerHTML = ''; top.append(seg([['tl', 'الخطّ الزمنيّ'], ['pr', 'احسب']], S.m, v => { S.m = v; if (v === 'pr') newP(0); bar(); draw(); }));
      ctl.innerHTML = ''; if (S.m === 'tl') ctl.append(sld(v => 'العمر : ' + L(v.toFixed(1)) + ' مليار سنة', S.t, 0, 14, 0.1, v => { S.t = v; draw(); }));
    }
    function stage(t) { return t < 0.05 ? 'الولادة من السديم : نجم أوّليّ' : t < 10.1 ? 'تتابع رئيس : تُولّد الطاقة بالاندماج' + (Math.abs(t - 4.6) < 0.06 ? ' ( الآن )' : t < 4.6 ? ' ( في الماضي )' : ' ( في المستقبل )') : t < 12.1 ? 'عملاق أحمر ثمّ سديم كوكبيّ : حرارته تجعل الحياة على الأرض مستحيلة' : 'قزم أبيض ، ثمّ يبرد بعد مليارات السنين قزمًا أسود'; }
    function newP(k) {
      const book = k === 0, a = book ? 4.6 : +(3 + Math.random() * 3).toFixed(1), b = book ? 5.5 : +(4 + Math.random() * 3).toFixed(1), c = book ? 2 : [1, 2, 3][Math.floor(Math.random() * 3)];
      const kind = book ? 0 : Math.floor(Math.random() * 3);
      const ask = [['عمره عند صيرورته عملاقًا أحمر', +(a + b).toFixed(1), L(a + ' + ' + b + ' = ' + (a + b).toFixed(1))], ['عمره الكلّيّ', +(a + b + c).toFixed(1), L(a + ' + ' + b + ' + ' + c + ' = ' + (a + b + c).toFixed(1))], ['كم بقي له من الآن حتّى يصير قزمًا أبيض', +(b + c).toFixed(1), L(b + ' + ' + c + ' = ' + (b + c).toFixed(1))]][kind];
      S.p = { book: book, a: a, b: b, c: c, ask: ask, n: (S.p ? S.p.n : 0) + 1 }; S.ans = ''; S.res = null;
    }
    function draw() {
      body.innerHTML = '';
      if (S.m === 'tl') {
        const svg = fig(body, 340, 90); const x0 = 15, x1 = 325, X = t => x0 + t / 14 * (x1 - x0);
        sv('rect', { x: 0, y: 0, width: 340, height: 90, fill: '#0f1e33' }, svg);
        sv('path', { d: 'M' + x0 + ' 60 H' + x1, stroke: '#9AA5B1', 'stroke-width': 1.5 }, svg);
        for (let t = 0; t <= 14; t += 2) { sv('path', { d: 'M' + X(t) + ' 56 v8', stroke: '#9AA5B1' }, svg); txt(svg, X(t) - 3, 78, String(t), { fill: '#c9d2dd' }); }
        sv('rect', { x: X(0), y: 52, width: X(10.1) - X(0), height: 5, fill: '#F5CF3F' }, svg);
        sv('rect', { x: X(10.1), y: 52, width: X(12.1) - X(10.1), height: 5, fill: '#E0533B' }, svg);
        sv('rect', { x: X(12.1), y: 52, width: X(14) - X(12.1), height: 5, fill: '#e8eef7' }, svg);
        ST.forEach(s => sv('circle', { cx: X(s[0]), cy: 54, r: 4, fill: '#fff' }, svg));
        const c = S.t < 10.1 ? '#F5CF3F' : S.t < 12.1 ? '#E0533B' : '#e8eef7', r = S.t < 10.1 ? 12 : S.t < 12.1 ? 22 : 6;
        sv('circle', { cx: X(S.t), cy: 26, r: r, fill: c }, svg);
        txt(svg, x1 - 60, 14, '×10⁹ years', { fill: '#c9d2dd' });
        const b = info(); b.row('المرحلة', stage(S.t)); ST.forEach(s => b.row(s[1], 'عند ' + L(s[0]) + ' مليار سنة')); body.append(b);
        body.append(note('عملاق أحمر : ' + L('4.6 + 5.5 = 10.1') + ' ، ثمّ قزم أبيض : ' + L('10.1 + 2 = 12.1') + ' مليار سنة.'));
      } else {
        const p = S.p;
        body.append(el('div', 'njq', (p.book ? 'الشمس : ' : 'نجم افتراضيّ متوسّط الكتلة : ') + 'عمره الآن ' + L(p.a) + ' مليار سنة ، ويستمرّ إشراقه ' + L(p.b) + ' مليار سنة أخرى ثمّ يصير عملاقًا أحمر ، ويموت قزمًا أبيض بعد ' + L(p.c) + ' مليار سنة من ذلك . احسب <b>' + p.ask[0] + '</b> بمليارات السنين.'));
        const r = el('div', 'srow'); const inp = document.createElement('input'); inp.type = 'number'; inp.step = '0.1'; inp.className = 'njinp'; inp.value = S.ans; inp.oninput = () => S.ans = inp.value;
        r.append(inp, btn('تحقّق', '', () => { const v = parseFloat(S.ans); S.res = isNaN(v) ? null : Math.abs(v - p.ask[1]) < 0.051; draw(); })); body.append(r);
        if (S.res !== null) {
          const wrong = [+(p.a + p.b).toFixed(1), +(p.a + p.b + p.c).toFixed(1), +(p.b + p.c).toFixed(1), p.b].filter(x => x !== p.ask[1]);
          const v = parseFloat(S.ans), hint = wrong.includes(+v.toFixed(1)) ? ' ناتجك يجيب عن سؤال آخر : اقرأ « من أين إلى أين ؟ ».' : '';
          body.append(verdict(S.res ? 'acok' : 'acwarn', S.res ? 'صحيح' : 'ليس صحيحًا', p.ask[2] + ' مليار سنة.' + (S.res ? '' : hint)));
          const r2 = el('div', 'srow'); r2.append(btn('مسألة أخرى', '', () => { newP(1); draw(); })); body.append(r2);
        }
      }
    }
    bar(); draw();
  }

  /* ======================= 14 · بقايا النجوم ======================= */
  const REM = [
    ['قزم أبيض', 'حجمه كحجم الأرض ، وكتلته تُقارب كتلة الشمس ، ويتوهّج توهّجًا ضعيفًا بالطاقة المتبقّية في قلبه.', 0],
    ['قزم أسود', 'القزم الأبيض بعد أن توقّف عن التوهّج بمرور مليارات السنين.', 1],
    ['نجم نيوترونيّ', 'قطره نحو 25 كيلومترًا ، وكثافته أكبر بمليون مرّة من كثافة الأقزام البيض.', 2],
    ['ثقب أسود', 'جاذبيته هائلة لا تسمح للضوء بالإفلات ، فلا يُرى مباشرةً.', 3],
    ['نجم فوق مُستعِر', 'انفجار عظيم خلال زمن قصير يُطلق طاقة تعادل ما تُصدره الشمس طوال حياتها.', 4]
  ];
  function njdead(host) {
    host.innerHTML = '';
    const S = { m: 'ex', path: 'big', M: 2 };
    const top = el('div'), ctl = el('div'), body = el('div'); host.append(top, ctl, body);
    function bar() {
      top.innerHTML = ''; top.append(seg([['ex', 'ماذا يبقى من النجم ؟'], ['q', 'تعرّف الجِرم']], S.m, v => { S.m = v; bar(); draw(); }));
      ctl.innerHTML = ''; if (S.m !== 'ex') return;
      ctl.append(seg([['mid', 'نجم متوسّط الكتلة'], ['big', 'نجم كبير الكتلة']], S.path, v => { S.path = v; bar(); draw(); }));
      if (S.path === 'big') ctl.append(sld(v => 'الكتلة المتبقّية في القلب : ' + L(v.toFixed(1)) + ' من كتلة الشمس', S.M, 1, 6, 0.1, v => { S.M = v; draw(); }));
    }
    function draw() {
      body.innerHTML = '';
      if (S.m === 'q') { sorter(body, REM.map(r => [r[1], r[2], r[0] + '.']), REM.map(r => r[0]), 'ما الجِرم الموصوف ؟', 'الحجم والكثافة والتوهّج تكفي للتمييز : الأبيض كالأرض ، والنيوترونيّ 25 كيلومترًا ، والثقب لا يُرى.'); return; }
      let k, why;
      if (S.path === 'mid') { k = 0; why = 'العملاق الأحمر يفقد وقوده فيتكوّن سديم كوكبيّ ، ومادّة قلبه المتبقّية تُكوّن قزمًا أبيض ، ثمّ قزمًا أسود حين يبرد.'; }
      else if (S.M > 3) { k = 3; why = 'زادت الكتلة المتبقّية في القلب على ثلاثة أضعاف كتلة الشمس ، فتكوّن ثقب أسود بعد الانفجار فوق المُستعِر.'; }
      else { k = 2; why = 'لم تزد الكتلة المتبقّية على ثلاثة أضعاف كتلة الشمس ، فتكوّن نجم نيوترونيّ ممّا بقي من القلب بعد الانفجار.'; }
      const row = el('div', 'njrow njsp');
      [['قزم أبيض', 0, '#e8eef7', 40], ['نجم نيوترونيّ', 2, '#9fb6d8', 10], ['ثقب أسود', 3, '#111', 26]].forEach(x => { const c = el('div', 'njcell' + (x[1] === k ? ' njon' : ' njdim')); const d = disk(x[2], x[3]); if (x[1] === 3) { d.style.background = '#000'; d.style.boxShadow = '0 0 0 3px #F2963A'; } c.append(d, el('span', '', x[0])); row.append(c); });
      body.append(row);
      const b = info(); b.row('النتيجة', '<b>' + REM[k][0] + '</b>'); b.row('خصائصه', REM[k][1]); b.row('لماذا ؟', why); body.append(b);
      body.append(note('الأحجام في الرسم غير مُقاسة : القزم الأبيض كحجم الأرض ، والنيوترونيّ قطره نحو 25 كيلومترًا ، أي أصغر بكثير.'));
    }
    bar(); draw();
  }

  /* ======================= 15 · النجوم أصل العناصر ======================= */
  const CH = [
    ['اندماج في قلب نجم', 'نَوى خفيفة تتّحد فتُنتج نَوى أثقل : الهيدروجين ← الهيليوم . فالنجم يصنع عناصر لم تكن.'],
    ['النجم يحوي عناصر أثقل', 'إلى جانب الهيدروجين والهيليوم : نِسب قليلة من الكربون والنيتروجين والأكسجين والحديد.'],
    ['موت النجم', 'سديم كوكبيّ في المسار المتوسّط ، أو انفجار فوق مُستعِر في المسار الكبير ، فتعود مادّته إلى الفضاء.'],
    ['سديم جديد', 'غبار كونيّ وغاز ، ومنه تبدأ حياة النجوم جميعًا.'],
    ['الشمس والأرض', 'انكمش سديم فتجمّعت معظم كتلته في المركز شمسًا ، وتكوّنت الكواكب ومنها الأرض ممّا حولها.']
  ];
  function njorig(host) {
    host.innerHTML = '';
    const S = { ord: shuffle([0, 1, 2, 3, 4]), done: [], bad: null };
    const body = el('div'); host.append(body);
    function draw() {
      body.innerHTML = '';
      body.append(el('div', 'shint', 'رتّب حلقات السلسلة من الاندماج إلى الأرض :'));
      const chain = el('div', 'njchain');
      CH.forEach((c, i) => { const ok = i < S.done.length; chain.append(el('div', 'njlink' + (ok ? ' njon' : ''), '<b>' + (i + 1) + '</b><span>' + (ok ? c[0] : '؟') + '</span>')); });
      body.append(chain);
      const w = el('div', 'njcards');
      S.ord.forEach(i => { if (S.done.includes(i)) return; const c = el('button', 'njcard' + (S.bad === i ? ' njno' : ''), '<b>' + CH[i][0] + '</b><span>' + CH[i][1] + '</span>'); c.onclick = () => { if (i === S.done.length) { S.done.push(i); S.bad = null; } else S.bad = i; draw(); }; w.append(c); });
      body.append(w);
      if (S.bad !== null) body.append(verdict('acwarn', 'ليست الحلقة التالية', 'فكّر : لا موت قبل اندماج ، ولا نجم جديد قبل سديم.'));
      if (S.done.length === 5) { body.append(verdict('acok', 'اكتملت السلسلة', 'المادّة التي بُنيت منها الأرض مرّت بقلوب النجوم ؛ ولهذا « يرتبط وجودنا على سطح الأرض بالاندماجات النووية في قلب النجم ».')); const r = el('div', 'srow'); r.append(btn('من جديد', 'gh', () => { S.done = []; S.ord = shuffle(S.ord); draw(); })); body.append(r); }
    }
    draw();
  }

  Object.assign(window.SIMS, { njdef, njfuse, njcolor, njlum, njhr, njterm, njsys, njdraw, njuse, njsci, njlife, njbal, njsun, njdead, njorig });
})();
