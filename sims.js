/* ===== محاكاة «دوسياتي» — عربية ، بلا مكتبات ، تعمل دون إنترنت ===== */
(function () {
  const el = (t, c, h) => { const e = document.createElement(t); if (c) e.className = c; if (h !== undefined) e.innerHTML = h; return e; };
  const btn = (txt, cls, fn) => { const b = el('button', 'sb ' + (cls || ''), txt); b.onclick = fn; return b; };
  const L = s => '<span class="ltr">' + s + '</span>';

  /* ---------------- 1 · مربع بانيت ---------------- */
  const MODES = {
    full: {
      n: 'سيادة تامة', a: 'T', b: 't',
      gt: ['TT', 'Tt', 'tt'],
      ph: g => (g.indexOf('T') >= 0 ? 'طويل' : 'قصير'),
      col: g => (g.indexOf('T') >= 0 ? '#2F6B3A' : '#8A6B2F'),
      note: 'الحرف الكبير يفوز دائمًا ، فلا يظهر القِصر إلّا في ' + L('tt') + ' .'
    },
    inc: {
      n: 'سيادة غير تامة', a: 'R', b: 'W',
      gt: ['RR', 'RW', 'WW'],
      ph: g => (g === 'RR' ? 'أحمر' : g === 'WW' ? 'أبيض' : 'زهري'),
      col: g => (g === 'RR' ? '#B3261E' : g === 'WW' ? '#8C93A0' : '#E06C9F'),
      note: 'الأليلان متساويان فيمتزجان ، فيظهر لون ثالث وسط بينهما.'
    },
    co: {
      n: 'سيادة مشتركة', a: 'R', b: 'W',
      gt: ['RR', 'RW', 'WW'],
      ph: g => (g === 'RR' ? 'أحمر' : g === 'WW' ? 'أبيض' : 'أبيض موشّح بالأحمر'),
      col: g => (g === 'RR' ? '#B3261E' : g === 'WW' ? '#8C93A0' : '#C14B4B'),
      note: 'الصفتان تظهران معًا دون امتزاج ، فلا يتكوّن لون ثالث جديد.'
    }
  };

  function punnett(host) {
    host.innerHTML = '';
    const S = { m: 'full', p1: 'Tt', p2: 'Tt', step: 0 };
    const bar = el('div', 'srow');
    const body = el('div');
    host.append(bar, body);

    const mk = (lab, key) => {
      const w = el('label', 'sf'); w.append(el('span', '', lab));
      const s = el('select');
      s.onchange = () => { S[key] = s.value; S.step = 0; draw(); };
      w.append(s); w.sel = s; return w;
    };
    const ms = el('label', 'sf'); ms.append(el('span', '', 'نمط السيادة'));
    const msel = el('select');
    Object.keys(MODES).forEach(k => { const o = el('option', '', MODES[k].n); o.value = k; msel.append(o); });
    msel.onchange = () => { S.m = msel.value; S.p1 = MODES[S.m].gt[1]; S.p2 = MODES[S.m].gt[1]; S.step = 0; fill(); draw(); };
    ms.append(msel);
    const f1 = mk('طراز الأب الأول', 'p1'), f2 = mk('طراز الأب الثاني', 'p2');
    bar.append(ms, f1, f2);

    function fill() {
      [f1, f2].forEach((f, i) => {
        f.sel.innerHTML = '';
        MODES[S.m].gt.forEach(g => { const o = el('option', '', g); o.value = g; f.sel.append(o); });
        f.sel.value = i ? S.p2 : S.p1;
        f.sel.setAttribute('dir', 'ltr');
      });
    }
    fill();

    function draw() {
      const M = MODES[S.m];
      const g1 = [S.p1[0], S.p1[1]], g2 = [S.p2[0], S.p2[1]];
      const cells = [];
      for (let r = 0; r < 2; r++) for (let c = 0; c < 2; c++) {
        const ord = a => (a === M.a ? 0 : 1);
        const pair = [g1[c], g2[r]].sort((x, y) => ord(x) - ord(y));
        cells.push(pair.join(''));
      }
      body.innerHTML = '';
      const grid = el('div', 'pq');
      grid.append(el('div', 'ph', ''), el('div', 'ph ltr', g1[0]), el('div', 'ph ltr', g1[1]));
      for (let r = 0; r < 2; r++) {
        grid.append(el('div', 'ph ltr', g2[r]));
        for (let c = 0; c < 2; c++) {
          const i = r * 2 + c;
          const d = el('div', 'pc' + (S.step > i ? ' on' : ''));
          if (S.step > i) {
            d.innerHTML = '<b class="ltr">' + cells[i] + '</b><i>' + M.ph(cells[i]) + '</i>';
            d.style.borderColor = M.col(cells[i]);
            d.style.background = M.col(cells[i]) + '14';
          } else d.innerHTML = '<span class="qm">؟</span>';
          grid.append(d);
        }
      }
      body.append(el('p', 'shint', 'أمشاج الأب الأول فوق الأعمدة ، وأمشاج الثاني بجانب الصفوف . املأ كلّ خليّة بجمع الحرفين المقابلين لها.'));
      body.append(grid);

      const row = el('div', 'srow');
      if (S.step < 4) row.append(btn('املأ خليّة', 'go', () => { S.step++; draw(); }));
      if (S.step < 4) row.append(btn('املأ المربع كلّه', '', () => { S.step = 4; draw(); }));
      row.append(btn('إعادة', 'gh', () => { S.step = 0; draw(); }));
      body.append(row);

      if (S.step === 4) {
        const gc = {}, pc = {};
        cells.forEach(c => { gc[c] = (gc[c] || 0) + 1; const p = M.ph(c); pc[p] = (pc[p] || 0) + 1; });
        const gk = M.gt.filter(g => gc[g]);
        const res = el('div', 'sres');
        res.append(el('div', 'sl', 'النسبة الجينية : <b class="ltr">' +
          gk.map(g => gc[g]).join(' : ') + '</b> &nbsp; ( ' + gk.map(g => L(g) + ' ' + gc[g]).join(' ، ') + ' )'));
        const pk = Object.keys(pc);
        res.append(el('div', 'sl', 'النسبة الشكلية : <b class="ltr">' +
          pk.map(p => pc[p]).join(' : ') + '</b> &nbsp; ( ' + pk.map(p => p + ' ' + pc[p]).join(' ، ') + ' )'));
        if (pk.length === 1) res.append(el('div', 'sl ok', 'كلّ الأفراد بمظهر واحد : ' + pk[0] + ' .'));
        if (S.m === 'full' && gk.length === 3) res.append(el('div', 'sl ok', 'لاحظ : النسبة الجينية ثلاثة أقسام والشكلية قسمان ، لأنّ ' + L('TT') + ' و ' + L('Tt') + ' يظهران بالمظهر نفسه.'));
        if (S.m !== 'full' && gk.length === 3) res.append(el('div', 'sl ok', 'لاحظ : النسبتان متساويتان هنا ، لأنّ لكلّ طراز جيني مظهرًا خاصًّا به.'));
        res.append(el('div', 'sl note', MODES[S.m].note));
        body.append(res);
      }
    }
    draw();
  }

  /* ---------------- 2 · القواعد النيتروجينية والتضاعف ---------------- */
  const PAIR = { A: 'T', T: 'A', G: 'C', C: 'G' };
  const BONDS = { A: 2, T: 2, G: 3, C: 3 };
  const BCOL = { A: '#2B5CA8', T: '#1C7C54', G: '#B07A12', C: '#B3261E' };

  function dna(host, mode) {
    host.innerHTML = '';
    const S = { top: [], bot: [], done: false, split: false };
    const body = el('div');
    host.append(body);

    function gen() {
      const b = 'ATGC';
      S.top = []; for (let i = 0; i < 6; i++) S.top.push(b[Math.floor(Math.random() * 4)]);
      S.bot = new Array(6).fill(null); S.done = false; S.split = false; draw();
    }

    function draw() {
      body.innerHTML = '';
      body.append(el('p', 'shint', mode === 'copy'
        ? 'هذا شريط من جزيء انفصل عن قرينه . ابنِ الشريط الجديد المقابل له ، ثمّ شاهد الناتج.'
        : 'ابنِ الشريط المقابل : اضغط الخانة الفارغة ثمّ اختر القاعدة الصحيحة.'));

      const strand = el('div', 'dna');
      const r1 = el('div', 'drow');
      S.top.forEach(b => { const d = el('div', 'base ltr', b); d.style.background = BCOL[b]; r1.append(d); });
      const r2 = el('div', 'drow bonds');
      S.top.forEach((b, i) => {
        const ok = S.bot[i] === PAIR[b];
        r2.append(el('div', 'bond' + (ok ? ' ok' : ''), ok ? '|'.repeat(BONDS[b]) : ''));
      });
      const r3 = el('div', 'drow');
      S.top.forEach((b, i) => {
        const v = S.bot[i];
        const d = el('div', 'base slot' + (v ? (v === PAIR[b] ? ' ok ltr' : ' bad ltr') : ''), v || '؟');
        if (v && v === PAIR[b]) d.style.background = BCOL[v];
        d.onclick = () => pick(i);
        r3.append(d);
      });
      strand.append(r1, r2, r3);
      body.append(strand);

      const n = S.bot.filter((v, i) => v === PAIR[S.top[i]]).length;
      body.append(el('p', 'shint', 'المطابق : ' + n + ' من 6 · عدد الروابط يظهر بين القاعدتين ( <b>||</b> للزوج ' + L('A — T') + ' و <b>|||</b> للزوج ' + L('G — C') + ' )'));

      const row = el('div', 'srow');
      row.append(btn('شريط جديد', 'gh', gen));
      if (n === 6 && mode === 'copy' && !S.split) row.append(btn('شاهد التضاعف', 'go', () => { S.split = true; draw(); }));
      body.append(row);

      if (n === 6) {
        body.append(el('div', 'sres', '<div class="sl ok">أحسنت . الشريطان متقابلان تقابلًا صحيحًا.</div>'));
        if (S.split) {
          const two = el('div', 'twomol');
          for (let k = 0; k < 2; k++) {
            const m = el('div', 'mol');
            m.append(el('div', 'ml', k === 0 ? 'الجزيء الأول' : 'الجزيء الثاني'));
            const a = el('div', 'drow sm'), c = el('div', 'drow sm');
            S.top.forEach(b => { const d = el('div', 'base sm ltr', b); d.style.background = BCOL[b]; d.style.opacity = k === 0 ? 1 : .55; a.append(d); });
            S.top.forEach(b => { const p = PAIR[b]; const d = el('div', 'base sm ltr', p); d.style.background = BCOL[p]; d.style.opacity = k === 0 ? .55 : 1; c.append(d); });
            m.append(a, c); two.append(m);
          }
          body.append(two);
          body.append(el('div', 'sres', '<div class="sl">جزيئان مطابقان للأصل . اللون الباهت هو الشريط القديم ، والغامق هو الشريط الجديد المبنيّ عليه — ' +
            'فكلّ جزيء ناتج يحمل شريطًا قديمًا وشريطًا جديدًا.</div>'));
        }
      }
    }

    function pick(i) {
      const old = body.querySelector('.picker'); if (old) old.remove();
      const p = el('div', 'picker');
      'ATGC'.split('').forEach(b => {
        const d = el('button', 'pb ltr', b); d.style.background = BCOL[b];
        d.onclick = () => { S.bot[i] = b; draw(); };
        p.append(d);
      });
      p.append(btn('مسح', 'gh', () => { S.bot[i] = null; draw(); }));
      body.append(p);
    }
    gen();
  }

  /* ---------------- 3 · عدّاد الكروموسومات ---------------- */
  function division(host) {
    host.innerHTML = '';
    const S = { n: 16, kind: 'mit', step: 0 };
    const bar = el('div', 'srow'), body = el('div');
    host.append(bar, body);

    const nw = el('label', 'sf'); nw.append(el('span', '', 'عدد كروموسومات الخليّة الأصلية'));
    const ni = el('input'); ni.type = 'range'; ni.min = 4; ni.max = 48; ni.step = 2; ni.value = S.n;
    const nv = el('b', 'nv', String(S.n));
    ni.oninput = () => { S.n = +ni.value; nv.textContent = S.n; S.step = 0; draw(); };
    nw.append(ni, nv); bar.append(nw);

    const kw = el('label', 'sf'); kw.append(el('span', '', 'نوع الانقسام'));
    const ks = el('select');
    [['mit', 'متساوٍ'], ['mei', 'منصّف']].forEach(([v, t]) => { const o = el('option', '', t); o.value = v; ks.append(o); });
    ks.onchange = () => { S.kind = ks.value; S.step = 0; draw(); };
    kw.append(ks); bar.append(kw);

    const cellEl = (n, cls) => {
      const c = el('div', 'cell ' + (cls || ''));
      c.append(el('div', 'cn', String(n)), el('div', 'cu', 'كروموسومًا'));
      return c;
    };

    function draw() {
      const mei = S.kind === 'mei';
      const steps = mei
        ? ['الخليّة الأصلية', 'تضاعف المادة الوراثية', 'الانقسام الأول : خليتان', 'الانقسام الثاني : أربع خلايا']
        : ['الخليّة الأصلية', 'تضاعف المادة الوراثية', 'الانقسام : خليتان'];
      const last = steps.length - 1;
      body.innerHTML = '';
      body.append(el('p', 'shint', 'المرحلة ' + (S.step + 1) + ' من ' + steps.length + ' · ' + steps[S.step]));

      const st = el('div', 'stage');
      if (S.step === 0) st.append(cellEl(S.n));
      else if (S.step === 1) { const c = cellEl(S.n, 'dup'); c.append(el('div', 'tag', 'تضاعف <ltr>DNA</ltr> — العدد لم يتغيّر بعدُ')); st.append(c); }
      else if (S.step === 2) { st.append(cellEl(mei ? S.n / 2 : S.n), cellEl(mei ? S.n / 2 : S.n)); }
      else for (let i = 0; i < 4; i++) st.append(cellEl(S.n / 2, 'sm'));
      body.append(st);

      const row = el('div', 'srow');
      if (S.step < last) row.append(btn('الخطوة التالية', 'go', () => { S.step++; draw(); }));
      row.append(btn('إعادة', 'gh', () => { S.step = 0; draw(); }));
      body.append(row);

      if (S.step === last) {
        const res = el('div', 'sres');
        res.append(el('div', 'sl', 'الناتج : <b>' + (mei ? 'أربع خلايا' : 'خليتان') + '</b> ، في كلّ واحدة <b>' + (mei ? S.n / 2 : S.n) + '</b> كروموسومًا.'));
        res.append(el('div', 'sl', mei
          ? 'العدد نُصِّف ، ولهذا يصلح هذا الانقسام لتكوين الأمشاج : عند الإخصاب يتّحد مشيجان فيعود العدد ' + S.n + ' .'
          : 'العدد بقي كما هو ، ولهذا يصلح هذا الانقسام للنموّ وتعويض الخلايا التالفة.'));
        res.append(el('div', 'sl note', 'جرّب النوع الآخر بالعدد نفسه ولاحظ الفرق في شيئين فقط : عدد الخلايا ، وعدد الكروموسومات في كلّ منها.'));
        body.append(res);
      }
    }
    draw();
  }

  window.SIMS = { punnett, dna: h => dna(h, 'pair'), dnacopy: h => dna(h, 'copy'), division };
})();

/* ===== محاكاة المُتَّجِهات ( فيزياء العاشر — الوحدة الأولى ) ===== */
(function () {
  const el = (t, c, h) => { const e = document.createElement(t); if (c) e.className = c; if (h !== undefined) e.innerHTML = h; return e; };
  const btn = (txt, cls, fn) => { const b = el('button', 'sb ' + (cls || ''), txt); b.onclick = fn; return b; };
  const R2 = x => Math.round(x * 10) / 10;
  const TRIG = { 0: [0, 1], 30: [0.5, 0.87], 37: [0.6, 0.8], 45: [0.71, 0.71], 53: [0.8, 0.6], 60: [0.87, 0.5], 90: [1, 0] };
  const sinD = a => (TRIG[a] ? TRIG[a][0] : Math.sin(a * Math.PI / 180));
  const cosD = a => (TRIG[a] ? TRIG[a][1] : Math.cos(a * Math.PI / 180));
  const sld = (lab, val, min, max, step, fn) => {
    const w = el('label', 'sf'); w.append(el('span', '', lab));
    const i = document.createElement('input'); i.type = 'range'; i.min = min; i.max = max; i.step = step; i.value = val;
    const v = el('b', 'nv', String(val));
    i.oninput = () => { v.textContent = i.value; fn(+i.value); };
    w.append(i, v); return w;
  };
  const W = 340, H = 250, OX = 60, OY = 195;
  const svgHead = () => `<svg viewBox="0 0 ${W} ${H}" class="vsvg"><defs>
    <marker id="ah" markerWidth="9" markerHeight="7" refX="8" refY="3.5" orient="auto"><polygon points="0 0, 9 3.5, 0 7" fill="#00205B"/></marker>
    <marker id="ab" markerWidth="9" markerHeight="7" refX="8" refY="3.5" orient="auto"><polygon points="0 0, 9 3.5, 0 7" fill="#1C7C54"/></marker>
    <marker id="ar" markerWidth="10" markerHeight="8" refX="9" refY="4" orient="auto"><polygon points="0 0, 10 4, 0 8" fill="#B3261E"/></marker></defs>`;
  const grid = () => { let g = '';
    for (let x = 0; x <= W; x += 20) g += `<line x1="${x}" y1="0" x2="${x}" y2="${H}" stroke="#EDF1F6"/>`;
    for (let y = 0; y <= H; y += 20) g += `<line x1="0" y1="${y}" x2="${W}" y2="${y}" stroke="#EDF1F6"/>`;
    g += `<line x1="0" y1="${OY}" x2="${W}" y2="${OY}" stroke="#9AA7B8"/><line x1="${OX}" y1="0" x2="${OX}" y2="${H}" stroke="#9AA7B8"/>`;
    return g; };
  const arrow = (x1, y1, x2, y2, col, mk, wdt) =>
    `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${col}" stroke-width="${wdt || 3}" marker-end="url(#${mk})"/>`;

  function vecadd(host) {
    host.innerHTML = '';
    const S = { a: 30, aa: 0, b: 40, ba: 90, comp: false };
    const bar = el('div', 'srow'), bar2 = el('div', 'srow'), body = el('div');
    host.append(bar, bar2, body);
    const re = () => draw();
    const mkbars = () => {
      bar.innerHTML = ''; bar2.innerHTML = '';
      bar.append(sld('مقدار A', S.a, 5, 60, 5, v => { S.a = v; re(); }), sld('زاوية A', S.aa, 0, 180, 15, v => { S.aa = v; re(); }));
      bar2.append(sld('مقدار B', S.b, 5, 60, 5, v => { S.b = v; re(); }), sld('زاوية B', S.ba, 0, 180, 15, v => { S.ba = v; re(); }));
    };
    mkbars();

    function draw() {
      const k = 2.2;
      const ax = S.a * cosD(S.aa), ay = S.a * sinD(S.aa);
      const bx = S.b * cosD(S.ba), by = S.b * sinD(S.ba);
      const rx = ax + bx, ry = ay + by;
      const Rm = Math.sqrt(rx * rx + ry * ry);
      const al = Math.atan2(ry, rx) * 180 / Math.PI;
      const P = (x, y) => [OX + x * k, OY - y * k];
      const [axp, ayp] = P(ax, ay), [bxp, byp] = P(rx, ry);
      let s = svgHead() + grid();
      s += arrow(OX, OY, axp, ayp, '#00205B', 'ah');
      s += arrow(axp, ayp, bxp, byp, '#1C7C54', 'ab');
      s += arrow(OX, OY, bxp, byp, '#B3261E', 'ar', 4);
      if (S.comp) {
        const [rxp, ] = P(rx, 0);
        s += `<line x1="${OX}" y1="${OY}" x2="${rxp}" y2="${OY}" stroke="#B07A12" stroke-width="2" stroke-dasharray="4 3"/>`;
        s += `<line x1="${rxp}" y1="${OY}" x2="${bxp}" y2="${byp}" stroke="#B07A12" stroke-width="2" stroke-dasharray="4 3"/>`;
      }
      s += `<text x="${(OX + axp) / 2}" y="${(OY + ayp) / 2 - 6}" font-size="13" fill="#00205B">A</text>`;
      s += `<text x="${(axp + bxp) / 2 + 4}" y="${(ayp + byp) / 2}" font-size="13" fill="#1C7C54">B</text>`;
      s += `<text x="${(OX + bxp) / 2 - 12}" y="${(OY + byp) / 2 + 4}" font-size="14" fill="#B3261E" font-weight="bold">R</text>`;
      s += '</svg>';
      body.innerHTML = '';
      body.append(el('p', 'shint', 'ذيل B عند رأس A ، والمحصلة R من ذيل A إلى رأس B . حرّك المنزلقات وراقب المحصلة.'));
      body.append(el('div', 'vwrap', s));
      const row = el('div', 'srow');
      row.append(btn(S.comp ? 'أخفِ المُركّبات' : 'أظهر مُركّبات المحصلة', '', () => { S.comp = !S.comp; draw(); }));
      row.append(btn('متعامدان', 'gh', () => { S.aa = 0; S.ba = 90; mkbars(); draw(); }));
      row.append(btn('في اتجاه واحد', 'gh', () => { S.aa = 0; S.ba = 0; mkbars(); draw(); }));
      body.append(row);
      const res = el('div', 'sres');
      res.append(el('div', 'sl', 'المُركّبات : <b class="ltr">Rx = ' + R2(rx) + '</b> &nbsp; <b class="ltr">Ry = ' + R2(ry) + '</b>'));
      res.append(el('div', 'sl', 'مقدار المحصلة : <b class="ltr">R = √( ' + R2(rx) + '² + ' + R2(ry) + '² ) = ' + R2(Rm) + '</b>'));
      res.append(el('div', 'sl', 'اتجاهها : <b class="ltr">α ≈ ' + R2(al) + '°</b> من محور السينات الموجب'));
      const lo = Math.abs(S.a - S.b), hi = S.a + S.b;
      res.append(el('div', 'sl note', 'تحقّق بقاعدة الحدّين : المحصلة لا تخرج عن المدى من <b class="ltr">' + lo + '</b> إلى <b class="ltr">' + hi + '</b> — وقيمتها الآن <b class="ltr">' + R2(Rm) + '</b> .'));
      body.append(res);
    }
    draw();
  }

  function veccomp(host) {
    host.innerHTML = '';
    const S = { m: 100, a: 37 };
    const bar = el('div', 'srow'), body = el('div');
    host.append(bar, body);
    bar.append(sld('مقدار المُتَّجِه', S.m, 10, 120, 10, v => { S.m = v; draw(); }),
      sld('الزاوية مع الأفقي', S.a, 0, 90, 1, v => { S.a = v; draw(); }));
    function draw() {
      const k = 1.3, ax = S.m * cosD(S.a), ay = S.m * sinD(S.a);
      const P = (x, y) => [OX + x * k, OY - y * k];
      const [xp, yp] = P(ax, ay), [xx, ] = P(ax, 0);
      let s = svgHead() + grid();
      s += `<line x1="${OX}" y1="${OY}" x2="${xx}" y2="${OY}" stroke="#B07A12" stroke-width="3" marker-end="url(#ah)"/>`;
      s += `<line x1="${xx}" y1="${OY}" x2="${xp}" y2="${yp}" stroke="#1C7C54" stroke-width="3" marker-end="url(#ab)"/>`;
      s += `<line x1="${xp}" y1="${yp}" x2="${OX}" y2="${OY}" stroke="#eee" stroke-width="0"/>`;
      s += arrow(OX, OY, xp, yp, '#B3261E', 'ar', 4);
      s += `<text x="${(OX + xx) / 2}" y="${OY + 16}" font-size="12" fill="#B07A12">Ax</text>`;
      s += `<text x="${xx + 6}" y="${(OY + yp) / 2}" font-size="12" fill="#1C7C54">Ay</text>`;
      s += `<text x="${(OX + xp) / 2 - 16}" y="${(OY + yp) / 2 - 4}" font-size="14" fill="#B3261E" font-weight="bold">A</text>`;
      s += '</svg>';
      body.innerHTML = '';
      body.append(el('p', 'shint', 'المُتَّجِه الأحمر يُكافئ المُركّبتين معًا : الأفقية بالذهبي والرأسية بالأخضر.'));
      body.append(el('div', 'vwrap', s));
      const res = el('div', 'sres');
      res.append(el('div', 'sl', '<b class="ltr">Ax = A cos θ = ' + S.m + ' × ' + R2(cosD(S.a)) + ' = ' + R2(ax) + '</b>'));
      res.append(el('div', 'sl', '<b class="ltr">Ay = A sin θ = ' + S.m + ' × ' + R2(sinD(S.a)) + ' = ' + R2(ay) + '</b>'));
      res.append(el('div', 'sl ok', 'التحقّق بفيثاغورس : <b class="ltr">√( ' + R2(ax) + '² + ' + R2(ay) + '² ) = ' + R2(Math.sqrt(ax * ax + ay * ay)) + '</b> — وهو المقدار الأصلي.'));
      const big = S.a < 45 ? 'الأفقية أكبر' : S.a > 45 ? 'الرأسية أكبر' : 'المُركّبتان متساويتان';
      res.append(el('div', 'sl note', 'الزاوية ' + S.a + '° ، و' + big + ' . وكلّ مُركّبة أصغر من المُتَّجِه نفسه دائمًا — فإن خرجت أكبر منه فالحلّ خطأ.'));
      body.append(res);
    }
    draw();
  }

  window.SIMS.vecadd = vecadd;
  window.SIMS.veccomp = veccomp;
})();

/* ===== محاكاة بِنية الذرّة ( كيمياء العاشر — الوحدة الأولى ) ===== */
(function () {
  const el = (t, c, h) => { const e = document.createElement(t); if (c) e.className = c; if (h !== undefined) e.innerHTML = h; return e; };
  const btn = (txt, cls, fn) => { const b = el('button', 'sb ' + (cls || ''), txt); b.onclick = fn; return b; };
  const SUP = { '-': '⁻', '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴', '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹' };
  const sup = n => String(n).split('').map(c => SUP[c] || c).join('');
  const sci = (x, d) => {
    d = (d === undefined ? 2 : d);
    if (!isFinite(x) || x === 0) return '0';
    let e = Math.floor(Math.log10(Math.abs(x)));
    let m = x / Math.pow(10, e);
    m = Math.round(m * Math.pow(10, d)) / Math.pow(10, d);
    if (Math.abs(m) >= 10) { m = m / 10; e = e + 1; }
    return String(m).replace(/^-/, '\u2212') + ' × 10' + sup(e);
  };
  const sld = (lab, val, min, max, step, fn) => {
    const w = el('label', 'sf'); w.append(el('span', '', lab));
    const i = document.createElement('input'); i.type = 'range'; i.min = min; i.max = max; i.step = step; i.value = val;
    const v = el('b', 'nv', String(val));
    i.oninput = () => { v.textContent = i.value; fn(+i.value); };
    w.append(i, v); return w;
  };
  const sel = (lab, val, opts, fn) => {
    const w = el('label', 'sf'); w.append(el('span', '', lab));
    const s = document.createElement('select');
    opts.forEach(o => { const p = document.createElement('option'); p.value = o[0]; p.textContent = o[1]; if (o[0] == val) p.selected = true; s.append(p); });
    s.onchange = () => fn(s.value); w.append(s); return w;
  };
  const C = 3e8, HP = 6.63e-34, RH = 2.18e-18;

  /* ---------------- 1 · الموجة وطاقة الفوتون ---------------- */
  function wave(host) {
    host.innerHTML = '';
    const S = { nm: 500 };
    const bar = el('div', 'srow'), body = el('div');
    host.append(bar, body);
    bar.append(sld('الطول الموجي ( nm )', S.nm, 100, 1000, 20, v => { S.nm = v; draw(); }));

    const colOf = n => n < 350 ? '#6B4FA8' : n < 440 ? '#6A3FA0' : n < 490 ? '#1F57C3' : n < 520 ? '#12855A'
      : n < 565 ? '#8FA314' : n < 590 ? '#D4A017' : n < 625 ? '#D96B13' : n < 800 ? '#B3261E' : '#7A5407';
    const zoneOf = n => n < 350 ? 'غير مرئي — فوق بنفسجي' : n <= 800 ? 'مرئي' : 'غير مرئي — تحت الأحمر';
    const nameOf = n => n < 350 ? 'ما قبل البنفسجي' : n < 440 ? 'بنفسجي' : n < 490 ? 'أزرق' : n < 520 ? 'أخضر'
      : n < 565 ? 'أخضر مُصفرّ' : n < 590 ? 'أصفر' : n < 625 ? 'برتقالي' : n <= 800 ? 'أحمر' : 'ما بعد الأحمر';

    function draw() {
      const W = 340, H = 170, mid = 95, col = colOf(S.nm);
      const px = S.nm * 0.3;                       /* بكسل لكلّ موجة */
      let d = '';
      for (let x = 0; x <= W; x += 2) {
        const y = mid - 42 * Math.sin(2 * Math.PI * x / px);
        d += (x === 0 ? 'M' : 'L') + x + ' ' + Math.round(y * 10) / 10 + ' ';
      }
      let s = '<svg viewBox="0 0 ' + W + ' ' + H + '" class="vsvg">';
      s += '<line x1="0" y1="' + mid + '" x2="' + W + '" y2="' + mid + '" stroke="#DDE4EC"/>';
      s += '<path d="' + d + '" fill="none" stroke="' + col + '" stroke-width="3"/>';
      /* سهم يقيس طولًا موجيًّا واحدًا بين قمّتين */
      const p1 = px / 4, p2 = px / 4 + px;
      if (p2 < W) {
        s += '<line x1="' + p1 + '" y1="' + (mid - 53) + '" x2="' + p2 + '" y2="' + (mid - 53) + '" stroke="#00205B" stroke-width="1.5"/>';
        s += '<line x1="' + p1 + '" y1="' + (mid - 58) + '" x2="' + p1 + '" y2="' + (mid - 48) + '" stroke="#00205B" stroke-width="1.5"/>';
        s += '<line x1="' + p2 + '" y1="' + (mid - 58) + '" x2="' + p2 + '" y2="' + (mid - 48) + '" stroke="#00205B" stroke-width="1.5"/>';
        s += '<text x="' + ((p1 + p2) / 2 - 6) + '" y="' + (mid - 61) + '" font-size="13" fill="#00205B">λ</text>';
      }
      /* شريط الطيف */
      s += '<rect x="20" y="' + (H - 30) + '" width="300" height="14" fill="#F3F6FA" stroke="#DDE4EC"/>';
      s += '<rect x="' + (20 + 300 * (350 - 100) / 900) + '" y="' + (H - 30) + '" width="' + (300 * 450 / 900) + '" height="14" fill="#E8EEF7"/>';
      const mk = 20 + 300 * (S.nm - 100) / 900;
      s += '<polygon points="' + mk + ' ' + (H - 32) + ', ' + (mk - 5) + ' ' + (H - 40) + ', ' + (mk + 5) + ' ' + (H - 40) + '" fill="' + col + '"/>';
      s += '<text x="22" y="' + (H - 4) + '" font-size="10" fill="#5b6b80" direction="ltr">100</text>';
      s += '<text x="296" y="' + (H - 4) + '" font-size="10" fill="#5b6b80" direction="ltr">1000</text>';
      s += '<text x="140" y="' + (H - 4) + '" font-size="10" fill="#5b6b80">الطيف بالنانومتر</text>';
      s += '</svg>';

      const lam = S.nm * 1e-9, nu = C / lam, E = HP * C / lam;
      body.innerHTML = '';
      body.append(el('p', 'shint', 'حرّك المنزلق : كلّما قصُر الطول الموجي تقاربت القمم ، فزاد التردد وزادت طاقة الفوتون.'));
      body.append(el('div', 'vwrap', s));
      const row = el('div', 'srow');
      [['بنفسجي', 400], ['أخضر', 500], ['أحمر', 700], ['فوق بنفسجي', 200], ['تحت الأحمر', 900]]
        .forEach(p => row.append(btn(p[0], 'gh', () => { S.nm = p[1]; bar.innerHTML = ''; bar.append(sld('الطول الموجي ( nm )', S.nm, 100, 1000, 20, v => { S.nm = v; draw(); })); draw(); })));
      body.append(row);
      const res = el('div', 'sres');
      res.append(el('div', 'sl', 'التحويل : <b class="ltr">λ = ' + S.nm + ' nm = ' + sci(lam) + ' m</b>'));
      res.append(el('div', 'sl', 'التردد : <b class="ltr">ν = c / λ = ' + sci(nu) + ' Hz</b>'));
      res.append(el('div', 'sl', 'الطاقة : <b class="ltr">E = h c / λ = ' + sci(E) + ' J</b>'));
      res.append(el('div', 'sl ok', 'الموقع في الطيف : ' + zoneOf(S.nm) + ' ( ' + nameOf(S.nm) + ' )'));
      res.append(el('div', 'sl note', 'تحقّق سريع : ترددات الضوء المرئي في حدود <b class="ltr">10' + sup(14) + '</b> هرتز ، وطاقة فوتوناته في حدود <b class="ltr">10' + sup(-19) + '</b> جول . فإن خرج جوابك بعيدًا عن هذين الأسّين فالخطأ في تحويل النانومتر غالبًا.'));
      body.append(res);
    }
    draw();
  }

  /* ---------------- 2 · مستويات الطاقة وانتقالات الإلكترون ---------------- */
  function bohr(host) {
    host.innerHTML = '';
    const S = { a: 1, b: 3 };
    const bar = el('div', 'srow'), body = el('div');
    host.append(bar, body);
    const ns = [[1, '1'], [2, '2'], [3, '3'], [4, '4'], [99, '∞']];
    const mkbar = () => { bar.innerHTML = '';
      bar.append(sel('من المستوى', S.a, ns.slice(0, 4), v => { S.a = +v; draw(); }),
        sel('إلى المستوى', S.b, ns, v => { S.b = +v; draw(); })); };
    mkbar();

    const En = n => (n >= 99 ? 0 : -RH / (n * n));
    function draw() {
      const W = 340, H = 250;
      const yOf = n => (n >= 99 ? 26 : 26 + 190 / (n * n));
      let s = '<svg viewBox="0 0 ' + W + ' ' + H + '" class="vsvg"><defs>' +
        '<marker id="eup" markerWidth="9" markerHeight="7" refX="8" refY="3.5" orient="auto"><polygon points="0 0, 9 3.5, 0 7" fill="#B3261E"/></marker>' +
        '<marker id="edn" markerWidth="9" markerHeight="7" refX="8" refY="3.5" orient="auto"><polygon points="0 0, 9 3.5, 0 7" fill="#1C7C54"/></marker>' +
        '<marker id="eax" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto"><polygon points="0 0, 8 3, 0 6" fill="#9AA7B8"/></marker></defs>';
      /* محور الطاقة */
      s += '<line x1="18" y1="238" x2="18" y2="16" stroke="#9AA7B8" stroke-width="1.5" marker-end="url(#eax)"/>';
      s += '<text transform="translate(13,150) rotate(-90)" font-size="10" fill="#5b6b80">الطاقة تزداد</text>';
      s += '<line x1="34" y1="26" x2="286" y2="26" stroke="#9AA7B8" stroke-dasharray="4 3"/>';
      s += '<text x="290" y="29" font-size="9" fill="#5b6b80" direction="ltr">n = ∞</text>';
      [1, 2, 3, 4].forEach(n => {
        const y = yOf(n);
        s += '<line x1="34" y1="' + y + '" x2="286" y2="' + y + '" stroke="#00205B" stroke-width="2"/>';
        s += '<text x="290" y="' + (y + 3) + '" font-size="9" fill="#00205B" direction="ltr">n = ' + n + '</text>';
      });
      const y1 = yOf(S.a), y2 = yOf(S.b), up = S.b > S.a;
      if (S.a !== S.b) {
        s += '<line x1="160" y1="' + y1 + '" x2="160" y2="' + y2 + '" stroke="' + (up ? '#B3261E' : '#1C7C54') +
          '" stroke-width="3" marker-end="url(#' + (up ? 'eup' : 'edn') + ')"/>';
        s += '<text x="167" y="' + ((y1 + y2) / 2) + '" font-size="11" fill="' + (up ? '#B3261E' : '#1C7C54') + '">' +
          (up ? 'امتصاص' : 'انبعاث') + '</text>';
      }
      s += '<circle cx="100" cy="' + y1 + '" r="5" fill="#B07A12"/>';
      s += '<text x="92" y="' + (y1 - 7) + '" font-size="9" fill="#B07A12" text-anchor="end">إلكترون</text>';
      s += '</svg>';

      const lo = Math.min(S.a, S.b), hi = Math.max(S.a, S.b);
      const t1 = 1 / (lo * lo), t2 = (hi >= 99 ? 0 : 1 / (hi * hi));
      const dE = RH * (t1 - t2);
      body.innerHTML = '';
      body.append(el('p', 'shint', 'لاحظ تقارب المستويات العليا : فرق الطاقة بين مستويين متتاليين يصغر كلّما ارتفعنا.'));
      body.append(el('div', 'vwrap', s));
      const row = el('div', 'srow');
      [['من 1 إلى 2', 1, 2], ['من 3 إلى 1', 3, 1], ['تأيّن : 1 إلى ∞', 1, 99]]
        .forEach(p => row.append(btn(p[0], 'gh', () => { S.a = p[1]; S.b = p[2]; mkbar(); draw(); })));
      body.append(row);
      const res = el('div', 'sres');
      res.append(el('div', 'sl', 'طاقة المستوى ' + S.a + ' : <b class="ltr">' + sci(En(S.a)) + ' J</b>'));
      res.append(el('div', 'sl', S.b >= 99 ? 'طاقة المستوى ∞ : <b class="ltr">0</b>' : 'طاقة المستوى ' + S.b + ' : <b class="ltr">' + sci(En(S.b)) + ' J</b>'));
      if (S.a === S.b) { res.append(el('div', 'sl note', 'اختر مستويين مختلفين ليحدث انتقال.')); }
      else {
        res.append(el('div', 'sl', 'الصيغة : <b class="ltr">| ΔE | = RH ( 1/' + lo + '² − 1/' + (hi >= 99 ? '∞' : hi) + '² )</b>'));
        res.append(el('div', 'sl', 'التعويض : <b class="ltr">| ΔE | = ' + sci(RH) + ' × ( ' + (Math.round(t1 * 1e4) / 1e4) + ' − ' + (Math.round(t2 * 1e4) / 1e4) + ' ) = ' + sci(dE) + ' J</b>'));
        res.append(el('div', 'sl ok', 'الحكم : الانتقال ' + (up ? 'صعودًا ، فالطاقة <b>ممتصّة</b>' : 'نزولًا ، فالطاقة <b>منبعثة</b>') +
          (up ? '' : ' على هيئة فوتون طوله الموجي <b class="ltr">' + Math.round(HP * C / dE * 1e9 * 10) / 10 + ' nm</b>')));
        res.append(el('div', 'sl note', 'الطاقة الممتصّة بين هذين المستويين تساوي المنبعثة بينهما في المقدار ، والفرق في الاتجاه وحده.'));
      }
      body.append(res);
    }
    draw();
  }

  /* ---------------- 3 · أعداد الكمّ وسعة المستويات ---------------- */
  function qn(host) {
    host.innerHTML = '';
    const S = { n: 3, fill: false };
    const bar = el('div', 'srow'), body = el('div');
    host.append(bar, body);
    bar.append(sel('المستوى الرئيس n', S.n, [[1, '1'], [2, '2'], [3, '3'], [4, '4']], v => { S.n = +v; draw(); }));
    const SUB = [['s', 1], ['p', 3], ['d', 5], ['f', 7]];

    function draw() {
      const subs = SUB.slice(0, S.n);
      const orb = subs.reduce((a, b) => a + b[1], 0);
      body.innerHTML = '';
      body.append(el('p', 'shint', 'المستويات الفرعية عددها يساوي رقم المستوى الرئيس ، وكلّ مربّع فَلَك واحد يحمل إلكترونين غزلاهما متعاكسان.'));
      const box = el('div');
      subs.forEach(u => {
        const r = el('div', 'orow');
        r.append(el('b', 'olab ltr', S.n + u[0]));
        for (let k = 0; k < u[1]; k++) r.append(el('span', 'obox', S.fill ? '↑↓' : ''));
        const nOrb = u[1] === 1 ? 'فَلَك واحد' : u[1] + ' أفلاك';
        const nEl = u[1] === 1 ? 'إلكترونان' : u[1] === 7 ? '14 إلكترونًا' : (u[1] * 2) + ' إلكترونات';
        r.append(el('i', 'onote', nOrb + ' · ' + nEl));
        box.append(r);
      });
      body.append(box);
      const row = el('div', 'srow');
      row.append(btn(S.fill ? 'أفرِغ الأفلاك' : 'املأ الأفلاك بالإلكترونات', '', () => { S.fill = !S.fill; draw(); }));
      body.append(row);
      const res = el('div', 'sres');
      res.append(el('div', 'sl', 'المستويات الفرعية : <b class="ltr">' + subs.map(u => S.n + u[0]).join(' , ') + '</b> وعددها ' + S.n));
      res.append(el('div', 'sl', 'الجمع : <b class="ltr">' + subs.map(u => u[1]).join(' + ') + ' = ' + orb + '</b> فَلَكًا'));
      res.append(el('div', 'sl', 'بالقاعدة : <b class="ltr">n² = ' + S.n + '² = ' + (S.n * S.n) + '</b> فَلَكًا' + (orb === S.n * S.n ? ' — مطابق للجمع' : '')));
      res.append(el('div', 'sl ok', 'السعة القصوى : <b class="ltr">2 n² = 2 × ' + (S.n * S.n) + ' = ' + (2 * S.n * S.n) + '</b> إلكترونًا'));
      res.append(el('div', 'sl note', 'لا تخلط بينهما : <b class="ltr">n²</b> عدد الأفلاك و <b class="ltr">2 n²</b> عدد الإلكترونات . فإن سُئلت عن أفلاك فلا تضرب في اثنين.'));
      body.append(res);
    }
    draw();
  }

  window.SIMS.wave = wave;
  window.SIMS.bohr = bohr;
  window.SIMS.qn = qn;
})();

/* ===== محاكاة نظرية التطوّر ( أحياء العاشر — الوحدة الأولى ) ===== */
(function () {
  const el = (t, c, h) => { const e = document.createElement(t); if (c) e.className = c; if (h !== undefined) e.innerHTML = h; return e; };
  const btn = (txt, cls, fn) => { const b = el('button', 'sb ' + (cls || ''), txt); b.onclick = fn; return b; };
  const sel = (lab, val, opts, fn) => {
    const w = el('label', 'sf'); w.append(el('span', '', lab));
    const s = document.createElement('select');
    opts.forEach(o => { const p = document.createElement('option'); p.value = o[0]; p.textContent = o[1]; if (o[0] == val) p.selected = true; s.append(p); });
    s.onchange = () => fn(s.value); w.append(s); return w;
  };
  const pct = x => Math.round(x * 100);

  /* ---------------- 1 · الانتخاب الطبيعي في جماعة ---------------- */
  function natsel(host) {
    host.innerHTML = '';
    const BG = { light: { n: 'رمل فاتح', c: '#E0CFA8' }, dark: { n: 'صخر داكن', c: '#4A423A' } };
    const MC = { light: '#F7EFDA', dark: '#2E2822' };
    const S = { bg: 'light', gen: 0, pLight: 0.5, hist: [], n: 24 };
    const bar = el('div', 'srow'), body = el('div');
    host.append(bar, body);
    const mkbar = () => { bar.innerHTML = '';
      bar.append(sel('البيئة', S.bg, [['light', BG.light.n], ['dark', BG.dark.n]], v => { S.bg = v; reset(); })); };
    const reset = () => { S.gen = 0; S.pLight = 0.5; S.hist = [{ g: 0, p: 0.5 }]; draw(); };

    /* الأفراد المموّهون أقلّ افتراسًا : نسبة البقاء 0.9 للمموّه و 0.45 لغيره */
    function step() {
      const sLight = (S.bg === 'light') ? 0.9 : 0.45;
      const sDark = (S.bg === 'light') ? 0.45 : 0.9;
      const a = S.pLight * sLight, b = (1 - S.pLight) * sDark;
      S.pLight = a / (a + b);
      S.gen++; S.hist.push({ g: S.gen, p: S.pLight });
      draw();
    }
    function grid() {
      const W = 330, H = 120, cols = 8, rows = 3, r = 11;
      const nLight = Math.round(S.n * S.pLight);
      let s = '<svg viewBox="0 0 ' + W + ' ' + H + '" class="vsvg">';
      s += '<rect x="0" y="0" width="' + W + '" height="' + H + '" fill="' + BG[S.bg].c + '"/>';
      for (let i = 0; i < S.n; i++) {
        const cx = 26 + (i % cols) * 40, cy = 26 + Math.floor(i / cols) * 36;
        const light = i < nLight;
        s += '<circle cx="' + cx + '" cy="' + cy + '" r="' + r + '" fill="' + (light ? MC.light : MC.dark) +
             '" stroke="#00205B" stroke-width="1.2"/>';
      }
      s += '</svg>';
      return s;
    }
    function chart() {
      const W = 330, H = 110, L = 28, B = 88;
      let s = '<svg viewBox="0 0 ' + W + ' ' + H + '" class="vsvg">';
      s += '<line x1="' + L + '" y1="14" x2="' + L + '" y2="' + B + '" stroke="#9AA7B8"/>';
      s += '<line x1="' + L + '" y1="' + B + '" x2="' + (W - 8) + '" y2="' + B + '" stroke="#9AA7B8"/>';
      s += '<text x="4" y="18" font-size="9" fill="#5b6b80" direction="ltr">100%</text>';
      s += '<text x="12" y="' + (B + 3) + '" font-size="9" fill="#5b6b80" direction="ltr">0</text>';
      const maxG = Math.max(8, S.hist.length - 1);
      const X = g => L + (g / maxG) * (W - L - 14);
      const Y = p => B - p * (B - 14);
      let d = '';
      S.hist.forEach((h, i) => { d += (i ? 'L' : 'M') + X(h.g).toFixed(1) + ' ' + Y(h.p).toFixed(1) + ' '; });
      s += '<path d="' + d + '" fill="none" stroke="#1C7C54" stroke-width="2.5"/>';
      S.hist.forEach(h => { s += '<circle cx="' + X(h.g).toFixed(1) + '" cy="' + Y(h.p).toFixed(1) + '" r="2.5" fill="#1C7C54"/>'; });
      s += '<text x="' + (W - 70) + '" y="' + (H - 2) + '" font-size="9" fill="#5b6b80">الأجيال ←</text>';
      return s + '</svg>';
    }
    function draw() {
      body.innerHTML = '';
      body.append(el('p', 'shint', 'اضغط « جيل تالٍ » وراقب شيئين معًا : لا يتغيّر لون فرد واحد ، وتتغيّر نسبة اللونين في الجماعة.'));
      body.append(el('div', 'vwrap', grid()));
      const row = el('div', 'srow');
      row.append(btn('جيل تالٍ ⟵', 'go', step));
      row.append(btn('عشرة أجيال', '', () => { for (let i = 0; i < 10; i++) step(); }));
      row.append(btn('إعادة', 'gh', reset));
      body.append(row);
      body.append(el('p', 'shint', 'نسبة اللون الفاتح في الجماعة عبر الأجيال :'));
      body.append(el('div', 'vwrap', chart()));
      const res = el('div', 'sres');
      res.append(el('div', 'sl', 'الجيل : <b class="ltr">' + S.gen + '</b> · البيئة : ' + BG[S.bg].n));
      res.append(el('div', 'sl', 'الفاتح <b class="ltr">' + pct(S.pLight) + '%</b> · الداكن <b class="ltr">' + pct(1 - S.pLight) + '%</b>'));
      const win = (S.bg === 'light') ? 'الفاتح' : 'الداكن';
      res.append(el('div', 'sl ok', 'المموّه في هذه البيئة هو <b>' + win + '</b> ، فهو أخفى على المفترس فيبقى ويتكاثر أكثر.'));
      res.append(el('div', 'sl note', 'لم يتحوّل فرد واحد من لون إلى لون . الذي تغيّر <b>نسبة الصفة في الجماعة</b> — وهذا بالضبط معنى أنّ التطوّر يحدث في الجماعة لا في الفرد.'));
      body.append(res);
    }
    mkbar(); reset();
  }

  /* ---------------- 2 · التشريح المقارن : الأطراف الأمامية ---------------- */
  function homology(host) {
    host.innerHTML = '';
    /* [عضد , عظمان , رسغ , أصابع] أطوال نسبية */
    const SP = {
      bat: { n: 'الخفّاش', f: 'الطيران', L: [22, 26, 8, 86] },
      dol: { n: 'الدُّلفين', f: 'السباحة', L: [26, 22, 14, 40] },
      cat: { n: 'القطّ', f: 'المشي', L: [46, 44, 12, 20] }
    };
    const BN = [['عضد', '#00205B'], ['عظمان', '#1C7C54'], ['رسغ', '#B07A12'], ['أصابع', '#B3261E']];
    const S = { show: true };
    const bar = el('div', 'srow'), body = el('div');
    host.append(bar, body);

    function draw() {
      body.innerHTML = '';
      body.append(el('p', 'shint', 'كلّ شريط طرف أمامي ، وكلّ لون عظم . قارن الترتيب أولًا ثمّ الأطوال.'));
      const box = el('div', 'homo');
      Object.keys(SP).forEach(k => {
        const sp = SP[k];
        const w = el('div', 'hrow');
        w.append(el('div', 'hlab', '<b>' + sp.n + '</b><i>' + sp.f + '</i>'));
        const bars = el('div', 'hbar');
        const tot = sp.L.reduce((a, b) => a + b, 0);
        sp.L.forEach((len, i) => {
          const seg = el('span', 'hseg');
          seg.style.flex = len + ' 0 0';
          seg.style.background = S.show ? BN[i][1] : '#B9C3D0';
          seg.title = BN[i][0];
          bars.append(seg);
        });
        w.append(bars);
        box.append(w);
      });
      body.append(box);
      const lg = el('div', 'srow');
      BN.forEach(b => lg.append(el('span', 'shint', '<span class="hkey" style="background:' + b[1] + '"></span> ' + b[0])));
      body.append(lg);
      const row = el('div', 'srow');
      row.append(btn(S.show ? 'أخفِ ألوان العظام' : 'أظهر ألوان العظام', '', () => { S.show = !S.show; draw(); }));
      body.append(row);
      const res = el('div', 'sres');
      res.append(el('div', 'sl', 'التركيب : <b>متشابه</b> — أربعة أقسام بالترتيب نفسه في الأنواع الثلاثة.'));
      res.append(el('div', 'sl', 'الوظيفة : <b>مختلفة</b> — طيران وسباحة ومشي.'));
      res.append(el('div', 'sl ok', 'الاختلاف الظاهر في <b>أطوال العظام ونسبها</b> لا في عددها ولا ترتيبها.'));
      res.append(el('div', 'sl note', 'الدلالة كما في الكتاب : وجود أصل واحد لمجموعة من الثدييات . ولاحظ أنّ هذا <b>دليل</b> على التطوّر لا <b>آلية</b> له.'));
      body.append(res);
    }
    draw();
  }

  /* ---------------- 3 · البيولوجيا الجزيئية : مقارنة التسلسل ---------------- */
  function molseq(host) {
    host.innerHTML = '';
    const REF = 'ATGCCTGACTTAGCAGGTCA';
    const SP = {
      a: { n: 'النوع أ', d: [7] },
      b: { n: 'النوع ب', d: [2, 7, 11, 14, 18] },
      c: { n: 'النوع جـ', d: [0, 2, 4, 5, 7, 9, 11, 13, 14, 16, 18, 19] }
    };
    const SW = { A: 'T', T: 'A', G: 'C', C: 'G' };
    const S = { sp: 'a' };
    const bar = el('div', 'srow'), body = el('div');
    host.append(bar, body);
    const mkbar = () => { bar.innerHTML = '';
      bar.append(sel('قارن الإنسان بـ', S.sp, Object.keys(SP).map(k => [k, SP[k].n]), v => { S.sp = v; draw(); })); };

    const seqOf = k => REF.split('').map((c, i) => SP[k].d.includes(i) ? SW[c] : c);
    function row(label, arr, diff) {
      const r = el('div', 'orow');
      r.append(el('b', 'olab', label));
      arr.forEach((c, i) => {
        const b = el('span', 'obox', c);
        b.style.width = '1.35rem'; b.style.fontSize = '.75rem';
        if (diff && diff.includes(i)) { b.style.background = '#FCEAE8'; b.style.borderColor = '#efc4c0'; b.style.color = '#B3261E'; }
        r.append(b);
      });
      return r;
    }
    function draw() {
      const k = S.sp, d = SP[k].d, n = d.length;
      body.innerHTML = '';
      body.append(el('p', 'shint', 'عشرون قاعدة من تسلسل واحد . المربّعات الحمراء مواضع الاختلاف عن الإنسان.'));
      const box = el('div'); box.style.overflowX = 'auto';
      box.append(row('الإنسان', REF.split('')), row(SP[k].n, seqOf(k), d));
      body.append(box);
      const res = el('div', 'sres');
      res.append(el('div', 'sl', 'عدد مواضع الاختلاف : <b class="ltr">' + n + '</b> من <b class="ltr">20</b>'));
      res.append(el('div', 'sl', 'نسبة التشابه : <b class="ltr">' + pct((20 - n) / 20) + '%</b>'));
      const ord = Object.keys(SP).sort((x, y) => SP[x].d.length - SP[y].d.length);
      res.append(el('div', 'sl ok', 'الترتيب من الأقرب قرابةً إلى الأبعد : <b>' + ord.map(x => SP[x].n).join(' ← ') + '</b>'));
      res.append(el('div', 'sl note', 'القاعدة : كلّما زاد التشابه زادت القرابة وقلّت المدّة منذ الانفصال . فانتبه إلى المطلوب — <b>اختلافات</b> أم <b>تشابه</b> — فالحكم ينقلب بينهما.'));
      body.append(res);
    }
    mkbar(); draw();
  }

  /* ---------------- 4 · الانعزال والتدفّق الجيني ---------------- */
  function popflow(host) {
    host.innerHTML = '';
    const S = { mode: 'iso', t: 0 };
    const bar = el('div', 'srow'), body = el('div');
    host.append(bar, body);
    const mkbar = () => { bar.innerHTML = '';
      bar.append(sel('الحالة', S.mode, [['iso', 'حاجز بين المجتمعين ( انعزال )'], ['flow', 'انتقال أفراد ( تدفّق جيني )']],
        v => { S.mode = v; S.t = 0; draw(); })); };

    /* نسبة صفة معيّنة في المجتمعين */
    const stateAt = t => {
      if (S.mode === 'iso') return [Math.min(0.95, 0.70 + 0.05 * t), Math.max(0.05, 0.30 - 0.05 * t)];
      const m = Math.min(1, t / 5);
      return [0.70 - 0.20 * m, 0.30 + 0.20 * m];
    };
    function draw() {
      const [p1, p2] = stateAt(S.t);
      const W = 340, H = 150;
      let s = '<svg viewBox="0 0 ' + W + ' ' + H + '" class="vsvg">';
      const pop = (x, p, name) => {
        let g = '<ellipse cx="' + x + '" cy="62" rx="62" ry="46" fill="#EAF4F1" stroke="#1C7C54" stroke-width="2"/>';
        for (let i = 0; i < 12; i++) {
          const a = (i / 12) * Math.PI * 2, cx = x + Math.cos(a) * (i % 2 ? 24 : 42), cy = 62 + Math.sin(a) * (i % 2 ? 18 : 30);
          g += '<circle cx="' + cx.toFixed(1) + '" cy="' + cy.toFixed(1) + '" r="6" fill="' + (i < Math.round(12 * p) ? '#00205B' : '#D8DEE7') + '"/>';
        }
        g += '<text x="' + x + '" y="124" font-size="10" fill="#00205B" text-anchor="middle">' + name + '</text>';
        g += '<text x="' + x + '" y="138" font-size="10" fill="#5b6b80" text-anchor="middle" direction="ltr">' + pct(p) + '%</text>';
        return g;
      };
      s += pop(76, p1, 'المجتمع الأول') + pop(264, p2, 'المجتمع الثاني');
      if (S.mode === 'iso') {
        s += '<rect x="166" y="14" width="8" height="96" rx="3" fill="#7a5407"/>';
        s += '<text x="170" y="128" font-size="10" fill="#7a5407" text-anchor="middle">حاجز</text>';
      } else {
        s += '<defs><marker id="pf" markerWidth="9" markerHeight="7" refX="8" refY="3.5" orient="auto"><polygon points="0 0, 9 3.5, 0 7" fill="#B07A12"/></marker></defs>';
        s += '<line x1="146" y1="48" x2="196" y2="48" stroke="#B07A12" stroke-width="3" marker-end="url(#pf)"/>';
        s += '<line x1="196" y1="78" x2="146" y2="78" stroke="#B07A12" stroke-width="3" marker-end="url(#pf)"/>';
        s += '<text x="170" y="128" font-size="10" fill="#B07A12" text-anchor="middle">هجرة</text>';
      }
      s += '</svg>';
      body.innerHTML = '';
      body.append(el('p', 'shint', 'الدوائر الزرقاء حاملو الصفة . اضغط « جيل تالٍ » وراقب هل يتقارب المجتمعان أم يتباعدان.'));
      body.append(el('div', 'vwrap', s));
      const row = el('div', 'srow');
      row.append(btn('جيل تالٍ ⟵', 'go', () => { S.t++; draw(); }));
      row.append(btn('إعادة', 'gh', () => { S.t = 0; draw(); }));
      body.append(row);
      const res = el('div', 'sres');
      res.append(el('div', 'sl', 'الجيل : <b class="ltr">' + S.t + '</b> · الفرق بين المجتمعين : <b class="ltr">' + pct(Math.abs(p1 - p2)) + '%</b>'));
      if (S.mode === 'iso') {
        res.append(el('div', 'sl ok', '<b>الانعزال</b> : الحاجز <b>يمنع</b> تبادل المادة الوراثية ، فيسير كلّ مجتمع وحده ويزداد الفرق بينهما.'));
        res.append(el('div', 'sl note', 'والحاجز ليس مكانيًّا دائمًا : قد يكون موسم تكاثر مختلفًا ( فصلي ) أو سلوك تزاوج مختلفًا ( سلوكي ) والمجتمعان في المكان نفسه.'));
      } else {
        res.append(el('div', 'sl ok', '<b>التدفّق الجيني</b> : الهجرة <b>تنقل</b> الجينات بين المجتمعين ، فيقلّ الفرق بينهما ويزداد التنوّع في كلٍّ منهما.'));
        res.append(el('div', 'sl note', 'جرّب الحالتين وقارن منحنى الفرق : الانعزال يُباعد ، والتدفّق يُقارب . هذا هو الفرق الذي يُسأل عنه أكثر من غيره.'));
      }
      body.append(res);
    }
    mkbar(); draw();
  }

  window.SIMS.natsel = natsel;
  window.SIMS.homology = homology;
  window.SIMS.molseq = molseq;
  window.SIMS.popflow = popflow;
})();

/* ===== محاكاة القياس ( فيزياء التاسع — الوحدة الأولى ) ===== */
(function () {
  const el = (t, c, h) => { const e = document.createElement(t); if (c) e.className = c; if (h !== undefined) e.innerHTML = h; return e; };
  const btn = (txt, cls, fn) => { const b = el('button', 'sb ' + (cls || ''), txt); b.onclick = fn; return b; };
  const sel = (lab, val, opts, fn) => {
    const w = el('label', 'sf'); w.append(el('span', '', lab));
    const s = document.createElement('select');
    opts.forEach(o => { const p = document.createElement('option'); p.value = o[0]; p.textContent = o[1]; if (o[0] == val) p.selected = true; s.append(p); });
    s.onchange = () => fn(s.value); w.append(s); return w;
  };
  const SUP = { '-': '⁻', '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴', '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹' };
  const sup = n => String(n).split('').map(c => SUP[c] || c).join('');

  /* ---------------- 1 · اشتقاق الوحدات والتجانس ---------------- */
  function units(host) {
    host.innerHTML = '';
    const Q = {
      v:  { n: 'السرعة',   eq: 'v = Δx / Δt',  parts: [['Δx', 'm'], ['Δt', 's']], op: '/', out: 'm/s',        name: '' },
      a:  { n: 'التسارع',  eq: 'a = Δv / Δt',  parts: [['Δv', 'm/s'], ['Δt', 's']], op: '/', out: 'm/s²',    name: '' },
      F:  { n: 'القوة',    eq: 'F = m a',      parts: [['m', 'kg'], ['a', 'm/s²']], op: '×', out: 'kg.m/s²', name: 'نيوتن  N' },
      W:  { n: 'الشغل',    eq: 'W = F d',      parts: [['F', 'kg.m/s²'], ['d', 'm']], op: '×', out: 'kg.m²/s²', name: 'جول  J' },
      P:  { n: 'الضغط',    eq: 'P = F / A',    parts: [['F', 'kg.m/s²'], ['A', 'm²']], op: '/', out: 'kg/( m.s² )', name: 'باسكال  Pa' },
      rho:{ n: 'الكثافة',  eq: 'ρ = m / V',    parts: [['m', 'kg'], ['V', 'm³']], op: '/', out: 'kg/m³',     name: '' }
    };
    const S = { k: 'F', step: 0 };
    const bar = el('div', 'srow'), body = el('div');
    host.append(bar, body);
    const mkbar = () => { bar.innerHTML = '';
      bar.append(sel('الكمية المشتقّة', S.k, Object.keys(Q).map(k => [k, Q[k].n]), v => { S.k = v; S.step = 0; draw(); })); };

    function draw() {
      const q = Q[S.k];
      body.innerHTML = '';
      body.append(el('p', 'shint', 'اشتقاق الوحدة خطوتان لا غير : اكتب معادلة التعريف ، ثمّ عوّض وحدة كلّ رمز واضرب أو اقسم.'));
      const st = el('div', 'ustep');
      st.append(el('div', 'ul', '<b>معادلة التعريف</b><span class="ltr">' + q.eq + '</span>'));
      if (S.step >= 1) {
        const sub = q.parts.map(p => '<span class="ltr">[ ' + p[0] + ' ] = ' + p[1] + '</span>').join(' &nbsp; ');
        st.append(el('div', 'ul', '<b>الخطوة 1 — وحدة كلّ رمز</b>' + sub));
      }
      if (S.step >= 2) {
        const expr = q.parts.map(p => '( ' + p[1] + ' )').join(' ' + q.op + ' ');
        st.append(el('div', 'ul', '<b>الخطوة 2 — ' + (q.op === '×' ? 'اضرب' : 'اقسم') + ' الوحدات</b><span class="ltr">' + expr + '</span>'));
      }
      if (S.step >= 3) {
        st.append(el('div', 'ul ok', '<b>الوحدة المشتقّة</b><span class="ltr">' + q.out + '</span>' +
          (q.name ? '<i> ولها اسم خاصّ : ' + q.name + '</i>' : '<i> ولا اسم خاصّ لها</i>')));
      }
      body.append(st);
      const row = el('div', 'srow');
      if (S.step < 3) row.append(btn('الخطوة التالية ⟵', 'go', () => { S.step++; draw(); }));
      row.append(btn('إعادة', 'gh', () => { S.step = 0; draw(); }));
      body.append(row);
      const res = el('div', 'sres');
      res.append(el('div', 'sl', 'تعامل مع الوحدات كأنّها متغيّرات جبرية : تُضرب وتُقسم وتُختصر تمامًا كما تفعل بالأعداد.'));
      res.append(el('div', 'sl note', 'والطريقة نفسها تفحص <b>التجانس</b> : اكتب وحدة الطرفين ، فإن اختلفتا فالمعادلة خاطئة قطعًا . ولكنّ تطابقهما لا يُثبت الصحّة ، لأنّ المعامل العددي قد يكون خاطئًا.'));
      body.append(res);
    }
    mkbar(); draw();
  }

  /* ---------------- 2 · البادئات والصيغة العلمية ---------------- */
  function prefix(host) {
    host.innerHTML = '';
    const PX = [['P', 'بيتا', 15], ['T', 'تيرا', 12], ['G', 'جيجا', 9], ['M', 'ميجا', 6], ['k', 'كيلو', 3],
                ['h', 'هيكتو', 2], ['da', 'ديكا', 1], ['', 'بلا بادئة', 0], ['d', 'ديسي', -1], ['c', 'سنتي', -2],
                ['m', 'ملي', -3], ['µ', 'مايكرو', -6], ['n', 'نانو', -9], ['p', 'بيكو', -12], ['f', 'فمتو', -15]];
    const S = { A: 4.5, e: -6, u: 'm' };
    const bar = el('div', 'srow'), bar2 = el('div', 'srow'), body = el('div');
    host.append(bar, bar2, body);
    const mkbar = () => {
      bar.innerHTML = ''; bar2.innerHTML = '';
      const ai = document.createElement('input');
      ai.type = 'range'; ai.min = 10; ai.max = 99; ai.step = 1; ai.value = Math.round(S.A * 10);
      const av = el('b', 'nv', S.A.toFixed(1));
      ai.oninput = () => { S.A = (+ai.value) / 10; av.textContent = S.A.toFixed(1); draw(); };
      const w = el('label', 'sf'); w.append(el('span', '', 'المعامل A'), ai, av);
      bar.append(w);
      bar2.append(sel('الأسّ n', S.e, PX.map(p => [p[2], '10' + sup(p[2]) + (p[0] ? '  ( ' + p[1] + ' ' + p[0] + ' )' : '')]),
        v => { S.e = +v; draw(); }));
      bar2.append(sel('الوحدة', S.u, [['m', 'متر m'], ['g', 'غرام g'], ['s', 'ثانية s'], ['W', 'واط W']], v => { S.u = v; draw(); }));
    };

    function draw() {
      const px = PX.find(p => p[2] === S.e);
      const val = S.A * Math.pow(10, S.e);
      /* الكتابة الكاملة بلا أسّ */
      let plain;
      if (S.e >= 0) plain = (S.A * Math.pow(10, S.e)).toLocaleString('en-US', { maximumFractionDigits: 6, useGrouping: false });
      else plain = val.toFixed(Math.max(0, -S.e + 1)).replace(/0+$/, '').replace(/\.$/, '');
      body.innerHTML = '';
      body.append(el('p', 'shint', 'ثلاث صور لعدد واحد : كاملًا ، وبالصيغة العلمية ، وبالبادئة . حرّك المعامل وغيّر الأسّ وراقب الثلاثة معًا.'));
      const t = el('div', 'ptab');
      t.append(el('div', 'prow', '<b>العدد كاملًا</b><span class="ltr">' + plain + ' ' + S.u + '</span>'));
      t.append(el('div', 'prow', '<b>الصيغة العلمية</b><span class="ltr">' + S.A.toFixed(1) + ' × 10' + sup(S.e) + ' ' + S.u + '</span>'));
      t.append(el('div', 'prow ok', '<b>بالبادئة</b><span class="ltr">' +
        (px && px[0] ? S.A.toFixed(1) + ' ' + px[0] + S.u : S.A.toFixed(1) + ' ' + S.u + '  ( لا بادئة )') + '</span>'));
      body.append(t);
      const row = el('div', 'srow');
      [['نانومتر', 7.0, -9, 'm'], ['ميجاواط', 7.5, 6, 'W'], ['مايكرومتر', 4.5, -6, 'm'], ['كيلوغرام', 2.5, 3, 'g']]
        .forEach(p => row.append(btn(p[0], 'gh', () => { S.A = p[1]; S.e = p[2]; S.u = p[3]; mkbar(); draw(); })));
      body.append(row);
      const res = el('div', 'sres');
      const ok = S.A >= 1 && S.A < 10;
      res.append(el('div', 'sl ' + (ok ? 'ok' : ''), 'شرط الصيغة العلمية <b class="ltr">1 ≤ | A | &lt; 10</b> : ' +
        (ok ? 'متحقّق' : 'غير متحقّق — حرّك الفاصلة وعدّل الأسّ')));
      res.append(el('div', 'sl', 'إشارة الأسّ : ' + (S.e < 0 ? 'سالبة ، والعدد <b>أصغر من واحد</b>' : S.e > 0 ? 'موجبة ، والعدد <b>أكبر من عشرة</b>' : 'صفر ، والعدد بين واحد وعشرة')));
      res.append(el('div', 'sl note', 'انتبه إلى حالة الحرف : <b class="ltr">M</b> ميجا <b class="ltr">10⁶</b> و <b class="ltr">m</b> ملي <b class="ltr">10⁻³</b> — بينهما تسع مراتب.'));
      body.append(res);
    }
    mkbar(); draw();
  }

  /* ---------------- 3 · الأرقام المعنوية ---------------- */
  function sigfig(host) {
    host.innerHTML = '';
    const EX = ['3.45', '205', '14.0', '0.0035', '3000', '5.0308', '0.00450', '30700', '2.500', '1200'];
    const S = { v: '0.00450' };
    const bar = el('div', 'srow'), body = el('div');
    host.append(bar, body);
    const mkbar = () => { bar.innerHTML = '';
      bar.append(sel('العدد', S.v, EX.map(x => [x, x]), v => { S.v = v; draw(); })); };

    /* يُرجع لكلّ خانة : معنوي أم لا ، مع القاعدة */
    function mark(str) {
      const ch = str.split('');
      const dot = str.indexOf('.') >= 0;
      const firstNZ = ch.findIndex(c => /[1-9]/.test(c));
      let lastNZ = -1; ch.forEach((c, i) => { if (/[1-9]/.test(c)) lastNZ = i; });
      return ch.map((c, i) => {
        if (c === '.') return { c: c, sig: null, r: '' };
        if (/[1-9]/.test(c)) return { c: c, sig: true, r: 'رقم غير صفري ← معنوي دائمًا' };
        if (i < firstNZ) return { c: c, sig: false, r: 'صفر على يسار أوّل رقم غير صفري ← غير معنوي' };
        if (i < lastNZ) return { c: c, sig: true, r: 'صفر بين رقمين غير صفريين ← معنوي' };
        return dot ? { c: c, sig: true, r: 'صفر في النهاية بعد الفاصلة ← معنوي' }
                   : { c: c, sig: false, r: 'صفر في نهاية عدد صحيح بلا فاصلة ← غير معنوي' };
      });
    }
    function draw() {
      const m = mark(S.v), n = m.filter(x => x.sig === true).length;
      body.innerHTML = '';
      body.append(el('p', 'shint', 'الأخضر معنوي والرمادي غير معنوي . والسبب مكتوب تحت كلّ خانة.'));
      const row = el('div', 'sgrow');
      m.forEach(x => {
        const b = el('span', 'sgb' + (x.sig === true ? ' on' : x.sig === false ? ' off' : ' dot'), x.c);
        if (x.r) b.title = x.r;
        row.append(b);
      });
      body.append(row);
      const ul = el('div', 'sglist');
      const seen = {};
      m.forEach(x => { if (x.r && !seen[x.r]) { seen[x.r] = 1; ul.append(el('div', 'sgl' + (x.sig ? ' on' : ''), x.r)); } });
      body.append(ul);
      const res = el('div', 'sres');
      res.append(el('div', 'sl ok', 'عدد الأرقام المعنوية في <b class="ltr">' + S.v + '</b> هو <b class="ltr">' + n + '</b>'));
      const sci = (() => {
        const f = parseFloat(S.v); if (!isFinite(f) || f === 0) return S.v;
        const e = Math.floor(Math.log10(Math.abs(f)));
        const a = (f / Math.pow(10, e));
        return (Math.round(a * 1e6) / 1e6) + ' × 10' + sup(e);
      })();
      res.append(el('div', 'sl', 'بالصيغة العلمية : <b class="ltr">' + sci + '</b> — وعدّ أرقام المعامل يُعطيك العدد نفسه.'));
      res.append(el('div', 'sl note', 'قاعدتان تُغنيان عن الخمس : اشطب كلّ صفر <b>قبل</b> أوّل رقم غير صفري ، ثمّ عُدّ ما بقي — ولا تَعُدّ أصفار النهاية إلّا إذا كان في العدد فاصلة.'));
      body.append(res);
    }
    mkbar(); draw();
  }

  /* ---------------- 4 · الدقة والضبط ---------------- */
  function target(host) {
    host.innerHTML = '';
    const C = {
      ap: { n: 'دقيقة ومضبوطة', off: [0, 0], sp: 7, e: 'لا خطأ يُذكر' },
      pn: { n: 'مضبوطة غير دقيقة', off: [34, -20], sp: 7, e: 'خطأ <b>منتظم</b> — انحراف ثابت في اتجاه واحد' },
      an: { n: 'دقيقة غير مضبوطة', off: [0, 0], sp: 36, e: 'خطأ <b>عشوائي</b> — تشتّت بلا اتجاه' },
      no: { n: 'لا دقيقة ولا مضبوطة', off: [30, -24], sp: 36, e: 'خطأ <b>منتظم وعشوائي</b> معًا' }
    };
    const S = { k: 'pn' };
    const bar = el('div', 'srow'), body = el('div');
    host.append(bar, body);
    const mkbar = () => { bar.innerHTML = '';
      bar.append(sel('الحالة', S.k, Object.keys(C).map(k => [k, C[k].n]), v => { S.k = v; draw(); })); };
    /* نقاط ثابتة لا عشوائية ، ليتكرّر العرض نفسه في كلّ مرّة */
    const U = [[0.9, -0.4], [-0.6, 0.8], [0.3, 0.9], [-0.9, -0.5], [0.1, -1.0], [-0.2, 0.3], [0.7, 0.5]];

    function draw() {
      const c = C[S.k], W = 300, H = 230, cx = 150, cy = 110;
      let s = '<svg viewBox="0 0 ' + W + ' ' + H + '" class="vsvg">';
      [90, 66, 42, 18].forEach((r, i) => {
        s += '<circle cx="' + cx + '" cy="' + cy + '" r="' + r + '" fill="' + (i % 2 ? '#F3F6FA' : '#fff') + '" stroke="#C3CCD8"/>';
      });
      s += '<circle cx="' + cx + '" cy="' + cy + '" r="4" fill="#1C7C54"/>';
      U.forEach(u => {
        const x = cx + c.off[0] + u[0] * c.sp, y = cy + c.off[1] + u[1] * c.sp;
        s += '<circle cx="' + x.toFixed(1) + '" cy="' + y.toFixed(1) + '" r="5" fill="#B3261E" fill-opacity=".85"/>';
      });
      s += '<text x="' + cx + '" y="' + (H - 32) + '" font-size="10" fill="#1C7C54" text-anchor="middle">المركز = القيمة المقبولة</text>';
      s += '<text x="' + cx + '" y="' + (H - 16) + '" font-size="10" fill="#B3261E" text-anchor="middle">النقاط الحمراء = القياسات</text>';
      s += '</svg>';
      body.innerHTML = '';
      body.append(el('p', 'shint', 'جرّب الحالات الأربع وقارن : القرب من المركز دقّة ، وتجمّع النقاط ضبط.'));
      body.append(el('div', 'vwrap', s));
      const res = el('div', 'sres');
      const acc = (S.k === 'ap' || S.k === 'an'), pre = (S.k === 'ap' || S.k === 'pn');
      res.append(el('div', 'sl', '<b>الدقة</b> ( القرب من القيمة المقبولة ) : ' + (acc ? 'عالية' : 'منخفضة')));
      res.append(el('div', 'sl', '<b>الضبط</b> ( التوافق بين القياسات ) : ' + (pre ? 'عالٍ' : 'منخفض')));
      res.append(el('div', 'sl ok', 'نوع الخطأ الغالب : ' + c.e));
      res.append(el('div', 'sl note', 'انظر إلى حالة « مضبوطة غير دقيقة » جيّدًا : القياسات متطابقة تقريبًا وكلّها خاطئة . ولهذا لا يصحّ القول « قياساتي متقاربة إذن صحيحة » ، ولهذا أيضًا لا يُصلح تكرارُ القياس الخطأَ المنتظم.'));
      body.append(res);
    }
    mkbar(); draw();
  }

  window.SIMS.units = units;
  window.SIMS.prefix = prefix;
  window.SIMS.sigfig = sigfig;
  window.SIMS.target = target;
})();

/* ===== محاكاة بِنية الذرّة ( كيمياء التاسع — الوحدة الأولى ) ===== */
(function () {
  const el = (t, c, h) => { const e = document.createElement(t); if (c) e.className = c; if (h !== undefined) e.innerHTML = h; return e; };
  const btn = (txt, cls, fn) => { const b = el('button', 'sb ' + (cls || ''), txt); b.onclick = fn; return b; };
  const sel = (lab, val, opts, fn) => {
    const w = el('label', 'sf'); w.append(el('span', '', lab));
    const s = document.createElement('select');
    opts.forEach(o => { const p = document.createElement('option'); p.value = o[0]; p.textContent = o[1]; if (o[0] == val) p.selected = true; s.append(p); });
    s.onchange = () => fn(s.value); w.append(s); return w;
  };
  const sld = (lab, val, min, max, fn) => {
    const w = el('label', 'sf'); w.append(el('span', '', lab));
    const i = document.createElement('input'); i.type = 'range'; i.min = min; i.max = max; i.step = 1; i.value = val;
    const v = el('b', 'nv', String(val));
    i.oninput = () => { v.textContent = i.value; fn(+i.value); };
    w.append(i, v); return w;
  };
  /* العناصر العشرون الأولى */
  const ELS = ['', 'H', 'He', 'Li', 'Be', 'B', 'C', 'N', 'O', 'F', 'Ne',
               'Na', 'Mg', 'Al', 'Si', 'P', 'S', 'Cl', 'Ar', 'K', 'Ca'];
  const NAMES = ['', 'الهيدروجين', 'الهيليوم', 'الليثيوم', 'البيريليوم', 'البورون', 'الكربون', 'النيتروجين',
                 'الأكسجين', 'الفلور', 'النيون', 'الصوديوم', 'المغنيسيوم', 'الألمنيوم', 'السيليكون',
                 'الفسفور', 'الكبريت', 'الكلور', 'الأرجون', 'البوتاسيوم', 'الكالسيوم'];
  const conf = n => { const cap = [2, 8, 8, 2], out = []; let r = n;
    for (let i = 0; i < cap.length && r > 0; i++) { const k = Math.min(cap[i], r); out.push(k); r -= k; }
    return out; };

  /* ---------------- 1 · رمز النظير وحساب الجسيمات ---------------- */
  function isotope(host) {
    host.innerHTML = '';
    const S = { z: 17, a: 35, q: 0 };
    const bar = el('div', 'srow'), bar2 = el('div', 'srow'), bar3 = el('div', 'srow'), body = el('div');
    host.append(bar, bar2, bar3, body);
    const mkbar = () => {
      bar.innerHTML = ''; bar2.innerHTML = ''; bar3.innerHTML = '';
      bar.append(sld('العدد الذرّي Z', S.z, 1, 20, v => { S.z = v; if (S.a < v) { S.a = v; mkbar(); } draw(); }));
      bar2.append(sld('العدد الكتلي A', S.a, 1, 45, v => { S.a = Math.max(v, S.z); draw(); }));
      bar3.append(sel('الشحنة', S.q, [[-2, '2−'], [-1, '1−'], [0, 'متعادلة'], [1, '1+'], [2, '2+'], [3, '3+']],
        v => { S.q = +v; draw(); }));
    };
    function draw() {
      const p = S.z, n = S.a - S.z, e = S.z - S.q;
      const sym = ELS[S.z] || '?';
      body.innerHTML = '';
      body.append(el('p', 'shint', 'حرّك العددين وغيّر الشحنة ، وراقب أيّ الأعداد يتغيّر وأيّها يثبت.'));
      const card = el('div', 'isoc');
      card.append(el('div', 'isyms', '<span class="inum"><span class="ia">' + S.a + '</span><span class="iz">' + S.z + '</span></span>' +
        '<span class="ie">' + sym + (S.q ? '<sup>' + Math.abs(S.q) + (S.q > 0 ? '+' : '−') + '</sup>' : '') + '</span>'));
      card.append(el('div', 'inm', (NAMES[S.z] || '—') + ' · <span class="ltr">' + sym + '-' + S.a + '</span>'));
      body.append(card);
      const g = el('div', 'igrid');
      [['بروتونات', p, '= Z', '#B3261E'], ['نيوترونات', n, '= A − Z', '#7a5407'], ['إلكترونات', e, S.q ? '= Z − الشحنة' : '= Z', '#1C7C54']]
        .forEach(x => {
          const c = el('div', 'icell');
          c.append(el('b', '', String(x[1])), el('span', '', x[0]), el('i', 'ltr', x[2]));
          c.style.borderColor = x[3]; c.querySelector('b').style.color = x[3];
          g.append(c);
        });
      body.append(g);
      const row = el('div', 'srow');
      [['Cl-35', 17, 35, 0], ['Cl-37', 17, 37, 0], ['C-14', 6, 14, 0], ['Na⁺', 11, 23, 1], ['Cl⁻', 17, 35, -1]]
        .forEach(x => row.append(btn(x[0], 'gh', () => { S.z = x[1]; S.a = x[2]; S.q = x[3]; mkbar(); draw(); })));
      body.append(row);
      const res = el('div', 'sres');
      res.append(el('div', 'sl', 'العلاقة : <b class="ltr">A = Z + N</b> ← <b class="ltr">' + S.a + ' = ' + p + ' + ' + n + '</b>'));
      res.append(el('div', 'sl ' + (S.q ? '' : 'ok'), S.q === 0
        ? 'الذرّة <b>متعادلة</b> : عدد الإلكترونات يساوي عدد البروتونات.'
        : 'أيون : الذرّة ' + (S.q > 0 ? '<b>فقدت</b> ' + S.q : '<b>كسبت</b> ' + (-S.q)) + ' إلكترونًا ، فالإلكترونات <b class="ltr">' + e + '</b>'));
      res.append(el('div', 'sl note', 'لاحظ أنّ تغيير الشحنة <b>لا يمسّ</b> البروتونات ولا النيوترونات — فالتأيّن لا يدخل النواة . والذي يُغيّر العنصر نفسه هو تغيّر عدد البروتونات لا غير.'));
      body.append(res);
    }
    mkbar(); draw();
  }

  /* ---------------- 2 · التوزيع الإلكتروني والموقع ---------------- */
  function econfig(host, g18) {
    host.innerHTML = '';
    const S = { z: 17, q: 0 };
    /* g18 : ترقيم المجموعات من 1 إلى 18 كما في كتاب الثامن ، وإلّا فمن 1 إلى 8 كما في كتاب التاسع */
    const gnum = v => (!g18 ? v : S.z === 2 ? 18 : v > 2 ? v + 10 : v);
    const bar = el('div', 'srow'), bar2 = el('div', 'srow'), body = el('div');
    host.append(bar, bar2, body);
    const mkbar = () => {
      bar.innerHTML = ''; bar2.innerHTML = '';
      bar.append(sld('العدد الذرّي Z', S.z, 1, 20, v => { S.z = v; draw(); }));
      bar2.append(sel('الحالة', S.q, [[0, 'ذرّة متعادلة'], [1, 'أيون 1+'], [2, 'أيون 2+'], [3, 'أيون 3+'],
        [-1, 'أيون 1−'], [-2, 'أيون 2−'], [-3, 'أيون 3−']], v => { S.q = +v; draw(); }));
    };
    function draw() {
      const e = S.z - S.q;
      const c = e > 0 ? conf(e) : [];
      const cz = conf(S.z);
      const per = cz.length, grp = cz[cz.length - 1];
      /* الهيدروجين في المجموعة الأولى وهو لافلزّ ، وهو استثناء مشهور */
      const kind = S.z === 1 ? 'لافلزّ ( والهيدروجين استثناء : في المجموعة الأولى وليس فلزًّا )'
        : S.z === 2 || grp === 8 ? 'غاز نبيل' : grp <= 3 ? 'فلزّ' : grp === 4 ? 'شبه فلزّ أو متنوّع' : 'لافلزّ';
      body.innerHTML = '';
      body.append(el('p', 'shint', 'كلّ حلقة مستوى طاقة ، وكلّ نقطة إلكترون . غيّر الحالة لترى كيف يتغيّر التوزيع في الأيون.'));
      /* رسم المستويات */
      const W = 300, H = 210, cx = 150, cy = 100;
      let s = '<svg viewBox="0 0 ' + W + ' ' + H + '" class="vsvg">';
      s += '<circle cx="' + cx + '" cy="' + cy + '" r="16" fill="#FCEAE8" stroke="#B3261E" stroke-width="2"/>';
      s += '<text x="' + cx + '" y="' + (cy - 1) + '" font-size="10" fill="#B3261E" text-anchor="middle" direction="ltr">' + S.z + 'p</text>';
      s += '<text x="' + cx + '" y="' + (cy + 10) + '" font-size="8" fill="#B3261E" text-anchor="middle">نواة</text>';
      c.forEach((k, i) => {
        const r = 32 + i * 21;
        s += '<circle cx="' + cx + '" cy="' + cy + '" r="' + r + '" fill="none" stroke="#C3CCD8" stroke-dasharray="3 3"/>';
        for (let j = 0; j < k; j++) {
          const ang = (j / k) * Math.PI * 2 - Math.PI / 2;
          const x = cx + Math.cos(ang) * r, y = cy + Math.sin(ang) * r;
          s += '<circle cx="' + x.toFixed(1) + '" cy="' + y.toFixed(1) + '" r="3.6" fill="#00205B"/>';
        }
        s += '<text x="' + (cx + r + 4) + '" y="' + (cy - 3) + '" font-size="9" fill="#5b6b80" direction="ltr">' + k + '</text>';
      });
      s += '<text x="' + cx + '" y="' + (H - 8) + '" font-size="10" fill="#00205B" text-anchor="middle" direction="ltr">' +
           c.join(' , ') + '</text>';
      s += '</svg>';
      body.append(el('div', 'vwrap', s));
      const row = el('div', 'srow');
      [['Na', 11, 0], ['Na⁺', 11, 1], ['Cl', 17, 0], ['Cl⁻', 17, -1], ['Ca', 20, 0], ['Ar', 18, 0]]
        .forEach(x => row.append(btn(x[0], 'gh', () => { S.z = x[1]; S.q = x[2]; mkbar(); draw(); })));
      body.append(row);
      const res = el('div', 'sres');
      res.append(el('div', 'sl', 'العنصر : <b>' + NAMES[S.z] + '</b> <span class="ltr">' + ELS[S.z] + '</span> · الإلكترونات <b class="ltr">' + e + '</b>'));
      res.append(el('div', 'sl', 'التوزيع : <b class="ltr">' + c.join(' , ') + '</b> · التحقّق <b class="ltr">' +
        c.join(' + ') + ' = ' + c.reduce((a, b) => a + b, 0) + '</b>'));
      if (S.q === 0) {
        res.append(el('div', 'sl ok', 'الموقع : الدورة <b>' + per + '</b> ( عدد المستويات ) · المجموعة <b>' + gnum(grp) + '</b> ( إلكترونات الخارجي'
          + (g18 && S.z === 2 ? ' مكتمل بإلكترونين ، وموضعه مع الغازات النبيلة'
             : g18 && grp > 2 ? ' ' + grp + ' <span class="ltr">+ 10</span>' : '') + ' ) · ' + kind));
      } else {
        const stable = c.length && (c[c.length - 1] === 8 || (c.length === 1 && c[0] === 2));
        res.append(el('div', 'sl ' + (stable ? 'ok' : ''), 'الأيون : ' + (stable
          ? 'مستواه الخارجي <b>مكتمل</b> ، فهو مستقرّ كغاز نبيل.'
          : 'مستواه الخارجي غير مكتمل بعد.') + ' وعدد البروتونات ما زال <b class="ltr">' + S.z + '</b>'));
      }
      res.append(el('div', 'sl note', 'رقم الدورة من <b>عدد المستويات</b> ، ورقم المجموعة من <b>إلكترونات المستوى الخارجي</b> . ولا تقلبهما : الدورة صفّ أفقي والمجموعة عمود رأسي.'
        + (g18 ? ' وفي كتابك ترقيم المجموعات من <b class="ltr">1</b> إلى <b class="ltr">18</b> ، فما كان تكافؤه أكبر من اثنين يُضاف إلى رقمه <b class="ltr">10</b>.' : '')));
      body.append(res);
    }
    mkbar(); draw();
  }

  /* ---------------- 3 · الاتجاهات الدورية ---------------- */
  function trend(host, adv) {
    host.innerHTML = '';
    /* adv : يُضيف خصائص العاشر ( طاقة التأيّن والسالبية الكهربائية ) إلى قائمة الخصائص */
    const S = { k: 'size' };
    const K = {
      size: { n: 'الحجم الذرّي', row: '◀ يتناقص إلى اليمين', col: 'يتزايد إلى الأسفل ▼',
              why: 'في الدورة : المستويات ثابتة والبروتونات تزداد فيشتدّ الجذب فينكمش الحجم . وفي المجموعة : يُضاف مستوى فيكبر الحجم.' },
      met:  { n: 'نشاط الفلزّات', row: '◀ يقلّ إلى اليمين', col: 'يزداد إلى الأسفل ▼',
              why: 'الفلزّ ينشط بـ<b>فقد</b> الإلكترون ، فكلّما <b>كبر</b> الحجم ابتعد إلكترون الخارجي عن النواة فسهل فقده.' },
      non:  { n: 'نشاط اللافلزّات', row: 'يزداد إلى اليمين ▶', col: 'يقلّ إلى الأسفل ▼',
              why: 'اللافلزّ ينشط بـ<b>كسب</b> الإلكترون ، فكلّما <b>صغر</b> الحجم قربت النواة فقوي جذبها للإلكترون المكتسَب.' }
    };
    if (adv) {
      K.ie = { n: 'طاقة التأيّن', row: 'تزداد إلى اليمين ▶', col: 'تقلّ إلى الأسفل ▼',
        why: 'كلّما <b>صغر</b> نصف القطر وزادت <b>شحنة النواة الفعّالة</b> اشتدّ جذب النواة للإلكترون الأبعد ، فزادت الطاقة اللازمة لنزعه . وهي <b>عكس اتجاه الحجم</b> . ولاحظ أنّ <b>الغازات النبيلة</b> ( المجموعة الثامنة ) هي الأعلى في دورتها ، لأنّ مستواها الخارجي ممتلئ فلا تميل إلى فقد إلكترون.' };
      K.en = { n: 'السالبية الكهربائية', row: 'تزداد إلى اليمين ▶', col: 'تقلّ إلى الأسفل ▼',
        why: 'كلّما <b>صغر</b> حجم الذرّة زادت قدرتها على جذب إلكترونات الرابطة إليها . وهي <b>عكس اتجاه الحجم</b> كذلك . و<b>الفلور</b> أكثر الذرّات سالبيةً ، يليه <b>الأكسجين</b> ثمّ <b>النتروجين</b> — وكلّها في الزاوية العليا اليمنى حيث أصغر الذرّات.' };
      K.zeff = { n: 'شحنة النواة الفعّالة', row: 'تزداد إلى اليمين ▶', col: 'تقارب الثبات ▼',
        why: 'في <b>الدورة</b> تزداد البروتونات <b>مع ثبات عدد المستويات الحاجبة</b> ، فيزداد ما يصل من جذب النواة إلى إلكترون التكافؤ . وفي <b>المجموعة</b> تزداد البروتونات <b>ويزداد الحجب معها</b> ، فيبقى تأثير الجذب متقاربًا — ولهذا كان <ltr>n</ltr> هو الحاكم في المجموعة لا الشحنة الفعّالة.' };
    }
    /* ثلاث دورات × ثماني مجموعات بأرقام ذرّية الدورات 2 و3 ( وصفّ رابع جزئي ) */
    const ROWS = [
      { p: 2, z: [3, 4, 5, 6, 7, 8, 9, 10] },
      { p: 3, z: [11, 12, 13, 14, 15, 16, 17, 18] },
      { p: 4, z: [19, 20, 0, 0, 0, 0, 0, 0] }
    ];
    const bar = el('div', 'srow'), body = el('div');
    host.append(bar, body);
    const mkbar = () => { bar.innerHTML = '';
      bar.append(sel('الخاصية', S.k, Object.keys(K).map(k => [k, K[k].n]), v => { S.k = v; draw(); })); };

    /* شدّة اللون : 0 ضعيف .. 1 قوي */
    function val(z, g) {
      const cz = conf(z), grp = cz[cz.length - 1], per = cz.length;
      if (S.k === 'size') return (per / 4) * 0.6 + ((9 - grp) / 8) * 0.4;
      if (S.k === 'met') return grp <= 3 ? (per / 4) * 0.7 + ((4 - grp) / 4) * 0.3 : -1;
      if (S.k === 'ie') return (grp / 8) * 0.68 + ((5 - per) / 4) * 0.32;
      if (S.k === 'en') return grp === 8 ? -1 : (grp / 7) * 0.66 + ((5 - per) / 4) * 0.34;
      if (S.k === 'zeff') return (grp / 8) * 0.82 + 0.1;
      return (grp >= 5 && grp <= 7) ? (grp / 7) * 0.6 + ((5 - per) / 4) * 0.4 : -1;
    }
    function draw() {
      const k = K[S.k];
      body.innerHTML = '';
      body.append(el('p', 'shint', 'لوحة مبسّطة للمجموعات الثماني . كلّما غمق اللون زادت الخاصية ، والرمادي خارج القاعدة.'));
      const tb = el('div', 'ptb');
      const hd = el('div', 'ptr');
      hd.append(el('span', 'pth', ''));
      for (let g = 1; g <= 8; g++) hd.append(el('span', 'pth', String(g)));
      tb.append(hd);
      ROWS.forEach(r => {
        const tr = el('div', 'ptr');
        tr.append(el('span', 'pth', 'د' + r.p));
        r.z.forEach((z, i) => {
          if (!z) { tr.append(el('span', 'ptc ptnone', '')); return; }
          const v = val(z, i + 1);
          const c = el('span', 'ptc', ELS[z]);
          if (v < 0) { c.style.background = '#EEF1F6'; c.style.color = '#9aa7b8'; }
          else { const a = 0.14 + v * 0.7; c.style.background = 'rgba(0,32,91,' + a.toFixed(2) + ')';
                 c.style.color = a > 0.5 ? '#fff' : '#00205B'; }
          c.title = NAMES[z];
          tr.append(c);
        });
        tb.append(tr);
      });
      body.append(tb);
      const res = el('div', 'sres');
      res.append(el('div', 'sl', 'في <b>الدورة</b> ( الصفّ ) : <b class="ltr">' + k.row + '</b>'));
      res.append(el('div', 'sl', 'في <b>المجموعة</b> ( العمود ) : <b class="ltr">' + k.col + '</b>'));
      res.append(el('div', 'sl ok', k.why));
      res.append(el('div', 'sl note', adv
        ? 'بدّل بين <b>الحجم الذرّي</b> و<b>طاقة التأيّن</b> و<b>السالبية الكهربائية</b> وقارن اتجاه اللون : <b>الأخيرتان تعاكسان الحجم تمامًا</b> . فاحفظ اتجاه <b>الحجم وحده</b> ، واعكسه في الخاصّيتين الأخريين.'
        : 'بدّل بين « نشاط الفلزّات » و « نشاط اللافلزّات » وقارن اتجاه اللون : <b>القاعدتان متعاكستان</b> . فابدأ دائمًا بسؤال : هل العنصر فلزّ أم لافلزّ ؟ قبل أن تنظر في الحجم.'));
      body.append(res);
    }
    mkbar(); draw();
  }

  window.SIMS.isotope = isotope;
  window.SIMS.econfig = econfig;
  window.SIMS.econfig18 = h => econfig(h, true);
  window.SIMS.trend = trend;
  window.SIMS.trend10 = h => trend(h, true);
})();

/* ===== محاكاة دراسة الحياة ( أحياء التاسع — الوحدة الأولى ) ===== */
(function () {
  const el = (t, c, h) => { const e = document.createElement(t); if (c) e.className = c; if (h !== undefined) e.innerHTML = h; return e; };
  const btn = (txt, cls, fn) => { const b = el('button', 'sb ' + (cls || ''), txt); b.onclick = fn; return b; };
  const sel = (lab, val, opts, fn) => {
    const w = el('label', 'sf'); w.append(el('span', '', lab));
    const s = document.createElement('select');
    opts.forEach(o => { const p = document.createElement('option'); p.value = o[0]; p.textContent = o[1]; if (o[0] == val) p.selected = true; s.append(p); });
    s.onchange = () => fn(s.value); w.append(s); return w;
  };

  /* ---------------- 1 · تصميم التجربة المضبوطة ---------------- */
  function expvar(host) {
    host.innerHTML = '';
    const CASES = {
      sam: { n: 'أثر نوع السماد في طول نبتة الذرة',
             iv: 'نوع السماد', dv: 'طول النبتة',
             ctl: ['كمّية الماء', 'شدّة الإضاءة', 'نوع التربة', 'حجم الأصيص', 'نوع البذور'],
             exp: 'نبتات تُسمَّد بالسماد المدروس', con: 'نبتات لا تُسمَّد ، وبقيّة الظروف نفسها' },
      dwa: { n: 'أثر دواء في خفض حرارة فئران مصابة',
             iv: 'إعطاء الدواء', dv: 'درجة حرارة الفأر',
             ctl: ['نوع الفئران وأعمارها', 'شدّة الإصابة', 'الغذاء والماء', 'حرارة المكان', 'مدّة المتابعة'],
             exp: 'فئران مصابة تُعطى الدواء', con: 'فئران مصابة لا تُعطى الدواء ، وبقيّة الظروف نفسها' },
      lig: { n: 'أثر شدّة الإضاءة في معدّل نموّ نبتة الحبق',
             iv: 'شدّة الإضاءة', dv: 'معدّل النموّ',
             ctl: ['كمّية الماء', 'نوع التربة', 'درجة الحرارة', 'مدّة التجربة', 'حجم النبتة الابتدائي'],
             exp: 'نبتة في إضاءة قوية', con: 'نبتة في إضاءة ضعيفة ، وبقيّة الظروف نفسها' }
    };
    const S = { k: 'sam', step: 0 };
    const bar = el('div', 'srow'), body = el('div');
    host.append(bar, body);
    const mkbar = () => { bar.innerHTML = '';
      bar.append(sel('الموقف', S.k, Object.keys(CASES).map(k => [k, CASES[k].n]), v => { S.k = v; S.step = 0; draw(); })); };

    function draw() {
      const c = CASES[S.k];
      body.innerHTML = '';
      body.append(el('p', 'shint', 'ثلاثة أسئلة تُحدّد المتغيّرات : ما الذي غيّرتُه ؟ وما الذي قِستُه ؟ وما الذي أبقيتُه ثابتًا ؟'));
      const q = el('div', 'evq');
      const rows = [
        ['ما الذي غيّرتُه ؟', 'المتغيّر المستقل', c.iv, '#B3261E'],
        ['ما الذي قِستُه ؟', 'المتغيّر التابع', c.dv, '#1C7C54'],
        ['ما الذي أبقيتُه ثابتًا ؟', 'العوامل المثبّتة', c.ctl.join(' · '), '#B07A12']
      ];
      rows.forEach((r, i) => {
        const d = el('div', 'evr' + (S.step > i ? ' on' : ''));
        d.append(el('b', '', r[0]));
        if (S.step > i) {
          d.append(el('i', '', r[1]));
          d.append(el('span', '', r[2]));
          d.style.borderInlineStartColor = r[3];
        } else d.append(el('span', 'evq2', '؟'));
        q.append(d);
      });
      body.append(q);
      const row = el('div', 'srow');
      if (S.step < 3) row.append(btn('أظهر الإجابة ⟵', 'go', () => { S.step++; draw(); }));
      if (S.step >= 3) row.append(btn('أظهر العيّنتين', 'go', () => { S.step = 4; draw(); }));
      row.append(btn('إعادة', 'gh', () => { S.step = 0; draw(); }));
      body.append(row);
      if (S.step >= 4) {
        const two = el('div', 'evtwo');
        [['العيّنة التجريبية', c.exp, '#B3261E'], ['العيّنة الضابطة', c.con, '#00205B']].forEach(x => {
          const d = el('div', 'evc');
          d.append(el('b', '', x[0]), el('span', '', x[1]));
          d.style.borderColor = x[2]; d.querySelector('b').style.color = x[2];
          two.append(d);
        });
        body.append(two);
      }
      const res = el('div', 'sres');
      if (S.step >= 3) {
        res.append(el('div', 'sl ok', 'المتغيّر المستقل <b>يؤثّر ولا يتأثّر</b> ويضبطه الباحث <b>قبل</b> البدء ، والمتغيّر التابع لا يُعرَف إلّا <b>بعد</b> انتهاء التجربة.'));
        res.append(el('div', 'sl note', 'العيّنة الضابطة ليست مهمَلة : تخضع للشروط نفسها كلّها ، ولا يُحجَب عنها إلّا <b>المتغيّر المستقل وحده</b> . وكلّ فرق آخر بين العيّنتين يُفسِد التجربة.'));
      } else {
        res.append(el('div', 'sl', 'اقرأ الموقف وأجب في نفسك قبل الضغط على « أظهر الإجابة ».'));
      }
      body.append(res);
    }
    mkbar(); draw();
  }

  /* ---------------- 2 · البيانات والرسم البياني ---------------- */
  function sciplot(host) {
    host.innerHTML = '';
    const SETS = {
      time: { n: 'طول نبتة يوميًّا ( أسبوعان )', x: 'الزمن ( يوم )', y: 'الطول ( cm )',
              kind: 'line', why: 'الزمن متغيّر متّصل متدرّج ، فالخطّ يصل بين النقاط ويعني أنّ ما بينها موجود.',
              d: [[1, 2], [3, 4.5], [5, 7], [7, 10], [9, 13], [11, 15], [13, 16]] },
      soil: { n: 'معدّل النموّ في ثلاثة أنواع تربة', x: 'نوع التربة', y: 'معدّل النموّ ( cm )',
              kind: 'bar', why: 'أنواع التربة فئات منفصلة ، وما بين عمودين لا معنى له ، فلا يصحّ الوصل.',
              d: [['رملية', 6], ['طينية', 14], ['مزيجية', 11]] }
    };
    const S = { k: 'time', flip: false };
    const bar = el('div', 'srow'), body = el('div');
    host.append(bar, body);
    const mkbar = () => { bar.innerHTML = '';
      bar.append(sel('البيانات', S.k, Object.keys(SETS).map(k => [k, SETS[k].n]), v => { S.k = v; draw(); })); };

    function draw() {
      const s = SETS[S.k], W = 330, H = 200, L = 46, B = 158, R = W - 12, T = 18;
      const xs = s.d.map(p => p[0]), ys = s.d.map(p => p[1]);
      const ymax = Math.ceil(Math.max(...ys) * 1.15);
      let g = '<svg viewBox="0 0 ' + W + ' ' + H + '" class="vsvg">';
      g += '<line x1="' + L + '" y1="' + T + '" x2="' + L + '" y2="' + B + '" stroke="#5b6b80" stroke-width="1.5"/>';
      g += '<line x1="' + L + '" y1="' + B + '" x2="' + R + '" y2="' + B + '" stroke="#5b6b80" stroke-width="1.5"/>';
      const X = i => L + ((i + 0.5) / s.d.length) * (R - L);
      const Y = v => B - (v / ymax) * (B - T);
      if (s.kind === 'line' && !S.flip) {
        let d = '';
        s.d.forEach((p, i) => { d += (i ? 'L' : 'M') + X(i).toFixed(1) + ' ' + Y(p[1]).toFixed(1) + ' '; });
        g += '<path d="' + d + '" fill="none" stroke="#1C7C54" stroke-width="2.5"/>';
        s.d.forEach((p, i) => { g += '<circle cx="' + X(i).toFixed(1) + '" cy="' + Y(p[1]).toFixed(1) + '" r="3" fill="#1C7C54"/>'; });
      } else if (s.kind === 'bar' && !S.flip) {
        const bw = (R - L) / s.d.length * 0.5;
        s.d.forEach((p, i) => {
          g += '<rect x="' + (X(i) - bw / 2).toFixed(1) + '" y="' + Y(p[1]).toFixed(1) + '" width="' + bw.toFixed(1) +
               '" height="' + (B - Y(p[1])).toFixed(1) + '" fill="#00205B" rx="3"/>';
        });
      } else {
        /* عرض خاطئ : وصل الفئات المنفصلة أو تقطيع المتّصل */
        if (s.kind === 'bar') {
          let d = '';
          s.d.forEach((p, i) => { d += (i ? 'L' : 'M') + X(i).toFixed(1) + ' ' + Y(p[1]).toFixed(1) + ' '; });
          g += '<path d="' + d + '" fill="none" stroke="#B3261E" stroke-width="2.5" stroke-dasharray="5 3"/>';
        } else {
          const bw = (R - L) / s.d.length * 0.4;
          s.d.forEach((p, i) => {
            g += '<rect x="' + (X(i) - bw / 2).toFixed(1) + '" y="' + Y(p[1]).toFixed(1) + '" width="' + bw.toFixed(1) +
                 '" height="' + (B - Y(p[1])).toFixed(1) + '" fill="#B3261E" rx="3" fill-opacity=".7"/>';
          });
        }
      }
      s.d.forEach((p, i) => {
        g += '<text x="' + X(i).toFixed(1) + '" y="' + (B + 12) + '" font-size="9" fill="#5b6b80" text-anchor="middle">' + p[0] + '</text>';
      });
      g += '<text x="' + (L - 4) + '" y="' + (T + 4) + '" font-size="9" fill="#5b6b80" text-anchor="end" direction="ltr">' + ymax + '</text>';
      g += '<text x="' + (L - 4) + '" y="' + (B + 3) + '" font-size="9" fill="#5b6b80" text-anchor="end" direction="ltr">0</text>';
      g += '</svg>';

      body.innerHTML = '';
      body.append(el('p', 'shint', 'المتغيّر المستقل تحت والتابع على الجانب . جرّب العرض الخاطئ وانظر كيف ينقلب المعنى.'));
      const ax = el('div', 'axrow');
      ax.append(el('div', 'axb', '<i>المحور الرأسي — المتغيّر التابع</i><b>' + s.y + '</b>'));
      ax.append(el('div', 'axb', '<i>المحور الأفقي — المتغيّر المستقل</i><b>' + s.x + '</b>'));
      body.append(ax);
      body.append(el('div', 'vwrap', g));
      const row = el('div', 'srow');
      row.append(btn(S.flip ? 'أعد العرض الصحيح' : 'جرّب العرض الخاطئ', S.flip ? 'go' : '', () => { S.flip = !S.flip; draw(); }));
      body.append(row);
      const res = el('div', 'sres');
      res.append(el('div', 'sl ' + (S.flip ? '' : 'ok'), 'النوع الصحيح هنا : <b>' + (s.kind === 'line' ? 'رسم خطّي' : 'رسم بالأعمدة') + '</b>'));
      res.append(el('div', 'sl', s.why));
      if (S.flip) res.append(el('div', 'sl note', s.kind === 'bar'
        ? 'الخطّ المتقطّع الأحمر يُوحي بوجود قيم بين نوعَي تربة — وهذا لا معنى له . فالفئات المنفصلة تُرسَم أعمدةً.'
        : 'الأعمدة هنا تُخفي اتّصال الزمن وتجعل الأيام كأنّها فئات منفصلة ، فيضيع شكل منحنى النموّ.'));
      res.append(el('div', 'sl note', 'ولا تنسَ <b>وحدة القياس</b> مع اسم كلّ محور ، وعنوانًا للرسم ، وتدريجًا مناسبًا.'));
      body.append(res);
    }
    mkbar(); draw();
  }

  /* ---------------- 3 · المجهر : التكبير والتمييز ---------------- */
  function micro(host) {
    host.innerHTML = '';
    const S = { eye: 10, obj: 40, real: 0.02 };
    const bar = el('div', 'srow'), bar2 = el('div', 'srow'), body = el('div');
    host.append(bar, bar2, body);
    const mkbar = () => {
      bar.innerHTML = ''; bar2.innerHTML = '';
      bar.append(sel('العدسة العينية', S.eye, [[5, '5 X'], [10, '10 X'], [15, '15 X']], v => { S.eye = +v; draw(); }));
      bar.append(sel('العدسة الشيئية', S.obj, [[4, '4 X'], [10, '10 X'], [40, '40 X'], [100, '100 X']], v => { S.obj = +v; draw(); }));
      bar2.append(sel('طول العيّنة الحقيقي', S.real, [[0.005, '0.005 mm'], [0.01, '0.01 mm'], [0.02, '0.02 mm'], [0.05, '0.05 mm'], [0.1, '0.1 mm']],
        v => { S.real = +v; draw(); }));
    };
    const r2 = x => Math.round(x * 1000) / 1000;
    function draw() {
      const tot = S.eye * S.obj, img = r2(S.real * tot);
      body.innerHTML = '';
      body.append(el('p', 'shint', 'غيّر العدستين وطول العيّنة ، وراقب كيف يكبر طول الصورة وتبقى العيّنة كما هي.'));
      /* العيّنة والصورة بمقياس مرئي */
      const W = 320, H = 110;
      const k = Math.min(260 / Math.max(img, 0.001), 4000);
      const wReal = Math.max(2, S.real * k / 18), wImg = Math.min(260, img * k);
      let g = '<svg viewBox="0 0 ' + W + ' ' + H + '" class="vsvg">';
      g += '<rect x="30" y="22" width="' + wReal.toFixed(1) + '" height="14" fill="#5b6b80" rx="3"/>';
      g += '<text x="' + (30 + wReal + 6) + '" y="33" font-size="10" fill="#5b6b80">العيّنة الحقيقية</text>';
      g += '<rect x="30" y="62" width="' + wImg.toFixed(1) + '" height="20" fill="#00205B" rx="4"/>';
      g += '<text x="30" y="98" font-size="10" fill="#00205B">الصورة المكبَّرة</text>';
      g += '</svg>';
      body.append(el('div', 'vwrap', g));
      const res = el('div', 'sres');
      res.append(el('div', 'sl', 'قوة التكبير الكلية : <b class="ltr">' + S.eye + ' × ' + S.obj + ' = ' + tot + ' X</b>'));
      res.append(el('div', 'sl', 'طول الصورة : <b class="ltr">' + S.real + ' × ' + tot + ' = ' + img + ' mm</b>'));
      res.append(el('div', 'sl ok', 'والعكس : طول العيّنة الحقيقي <b class="ltr">= ' + img + ' ÷ ' + tot + ' = ' + r2(img / tot) + ' mm</b>'));
      const warn = tot > 2000;
      res.append(el('div', 'sl' + (warn ? ' note' : ''), warn
        ? 'تنبيه : <b class="ltr">' + tot + ' X</b> يتجاوز مدى المجهر الضوئي المركّب ( من <b class="ltr">40 X</b> إلى <b class="ltr">2000 X</b> ).'
        : 'هذه القيمة داخل مدى المجهر الضوئي المركّب ( من <b class="ltr">40 X</b> إلى <b class="ltr">2000 X</b> ).'));
      res.append(el('div', 'sl note', 'ولا يُغني التكبير عن <b>قوة التمييز</b> : تكبير صورة من دون قدرة على فصل نقطتين متقاربتين يُعطي صورةً كبيرةً غير واضحة . وقوة تمييز الضوئي من <b class="ltr">200</b> إلى <b class="ltr">250 nm</b> ، وللإلكتروني أعلى بكثير.'));
      body.append(res);
      /* مقارنة المجاهر */
      const t = el('div', 'mctab');
      [['', 'ضوئي مركّب', 'إلكتروني نافذ TEM', 'إلكتروني ماسح SEM'],
       ['ما يُكوِّن الصورة', 'الضوء المرئي', 'الإلكترونات', 'الإلكترونات'],
       ['مبدأ العمل', 'يتخلّل الضوء العيّنة', 'تتخلّل الإلكترونات العيّنة', 'تنعكس الإلكترونات عن السطح'],
       ['الصورة', 'ثنائية الأبعاد', 'ثنائية الأبعاد للداخل', 'ثلاثية الأبعاد للسطح']
      ].forEach((r, i) => {
        const tr = el('div', 'mcr' + (i ? '' : ' hd'));
        r.forEach(c => tr.append(el('span', 'mcc', c)));
        t.append(tr);
      });
      body.append(el('p', 'shint', 'ومقارنة سريعة بين المجاهر الثلاثة :'));
      body.append(el('div', 'mcwrap', ''));
      body.lastChild.append(t);
    }
    mkbar(); draw();
  }

  window.SIMS.expvar = expvar;
  window.SIMS.sciplot = sciplot;
  window.SIMS.micro = micro;
})();

/* ===== محاكاة المعادن ( علوم الأرض التاسع — الوحدة الأولى ) ===== */
(function () {
  const el = (t, c, h) => { const e = document.createElement(t); if (c) e.className = c; if (h !== undefined) e.innerHTML = h; return e; };
  const btn = (txt, cls, fn) => { const b = el('button', 'sb ' + (cls || ''), txt); b.onclick = fn; return b; };
  const L = s => '<span class="ltr">' + s + '</span>';
  const sel = (lab, val, opts, fn) => {
    const w = el('label', 'sf'); w.append(el('span', '', lab));
    const s = document.createElement('select');
    opts.forEach(o => { const p = document.createElement('option'); p.value = o[0]; p.textContent = o[1]; if (o[0] == val) p.selected = true; s.append(p); });
    s.onchange = () => fn(s.value); w.append(s); return w;
  };

  /* ---------------- 1 · اختبار الصفات الخمس ---------------- */
  const MNC = [
    { k: 'sol', n: 'صُلبة', q: 'هل المادة صُلبة في الظروف الطبيعية ؟' },
    { k: 'nat', n: 'تكوّنت طبيعيًّا', q: 'هل تكوّنت في الطبيعة لا في المختبر ؟' },
    { k: 'inorg', n: 'من أصل غير عضوي', q: 'هل أصلها غير عضوي ؟' },
    { k: 'comp', n: 'تركيب كيميائي محدّد', q: 'هل لها صيغة كيميائية محدّدة ؟' },
    { k: 'order', n: 'بناء ذرّي منتظم', q: 'هل ذرّاتها مرتّبة ترتيبًا منتظمًا متكرّرًا ؟' }
  ];
  const MNS = {
    halite: { n: 'الهاليت', f: 'NaCl', v: { sol: 1, nat: 1, inorg: 1, comp: 1, order: 1 },
      why: 'فهو صُلب طبيعي غير عضوي ، له صيغة محدّدة وبناء بلوري منتظم.' },
    quartz: { n: 'الكوارتز', f: 'SiO₂', v: { sol: 1, nat: 1, inorg: 1, comp: 1, order: 1 },
      why: 'تامّ الصفات الخمس ، وهو من أكثر معادن القشرة الأرضية شيوعًا.' },
    calcite: { n: 'الكالسيت', f: 'CaCO₃', v: { sol: 1, nat: 1, inorg: 1, comp: 1, order: 1 },
      why: 'تامّ الصفات الخمس ، ومنه يتكوّن الصخر الجيري.' },
    water: { n: 'الماء', f: 'H₂O', v: { sol: 0, nat: 1, inorg: 1, comp: 1, order: 0 },
      why: 'لأنّه <b>سائل</b> ، ولأنّ جزيئاته في السائل غير مرتّبة ترتيبًا منتظمًا.' },
    glass: { n: 'الزجاج', f: '—', v: { sol: 1, nat: 0, inorg: 1, comp: 0, order: 0 },
      why: 'فهو <b>مصنوع</b> لا طبيعي ، وليست له صيغة محدّدة ، وبناؤه الذرّي <b>غير منتظم</b>.' },
    coal: { n: 'الفحم الحجري', f: '—', v: { sol: 1, nat: 1, inorg: 0, comp: 0, order: 0 },
      why: 'لأنّ أصله <b>عضوي</b> ( بقايا نباتات ) ، وليست له صيغة كيميائية محدّدة.' },
    lab: { n: 'ماس مصنوع في المختبر', f: 'C', v: { sol: 1, nat: 0, inorg: 1, comp: 1, order: 1 },
      why: '— وإن تشابه مع الماس الطبيعي في كلّ صفة أخرى — لأنّه <b>لم يتكوّن طبيعيًّا</b>.' },
    wood: { n: 'الخشب', f: '—', v: { sol: 1, nat: 1, inorg: 0, comp: 0, order: 0 },
      why: 'فأصله <b>عضوي</b> ، ولا صيغة محدّدة له ، وبناؤه غير منتظم.' }
  };

  function mintest(host) {
    host.innerHTML = '';
    const S = { k: 'halite', show: false };
    const bar = el('div', 'srow'), body = el('div');
    host.append(bar, body);

    function mkbar() {
      bar.innerHTML = '';
      bar.append(sel('المادة', S.k, Object.keys(MNS).map(k => [k, MNS[k].n]), v => { S.k = v; S.show = false; mkbar(); draw(); }));
      bar.append(btn(S.show ? 'إخفاء النتيجة' : 'افحص الصفات الخمس', S.show ? 'gh' : 'go', () => { S.show = !S.show; mkbar(); draw(); }));
    }

    function draw() {
      body.innerHTML = '';
      const m = MNS[S.k];
      body.append(el('p', 'shint', 'المادة المفحوصة : <b>' + m.n + '</b>' + (m.f !== '—' ? ' — ' + L(m.f) : '') + ' . والصفات الخمس شروط <b>مجتمعة</b> ، فإن سقط شرط واحد لم تكن المادة معدنًا.'));
      MNC.forEach(c => {
        const r = el('div', 'mnrow' + (S.show ? (m.v[c.k] ? ' mnyes' : ' mnnot') : ''));
        r.append(el('span', 'mnlab', '<b>' + c.n + '</b><i>' + c.q + '</i>'));
        r.append(el('span', 'mnchk', S.show ? (m.v[c.k] ? '✔' : '✘') : '؟'));
        body.append(r);
      });
      if (S.show) {
        const ok = MNC.every(c => m.v[c.k]);
        const n = MNC.filter(c => m.v[c.k]).length;
        body.append(el('div', 'mnverd' + (ok ? ' mnok' : ''), '<b>' + (ok ? 'معدن' : 'ليس معدنًا') + '</b> — تحقّقت ' + n + ' من ' + MNC.length + ' صفات . ' + m.why));
      } else {
        body.append(el('p', 'sl note', 'توقّع أوّلًا : أيّ الصفات الخمس تتحقّق في هذه المادة ؟ ثمّ اضغط « افحص » لتقارن توقّعك بالنتيجة.'));
      }
    }
    mkbar(); draw();
  }

  /* ---------------- 2 · التناظر والأنظمة البلورية ---------------- */
  const CYS = {
    cubic: { n: 'المكعّب', ax: 3, len: 'ثلاثة محاور متساوية الطول', ang: 'متعامدة جميعها', ex: 'الهاليت والماس',
      d: [[0, -58, 0, 58], [-58, 0, 58, 0], [-40, 34, 40, -34]], lab: ['a', 'a', 'a'] },
    tetra: { n: 'الرباعي', ax: 3, len: 'محوران متساويان والثالث مختلف', ang: 'متعامدة جميعها', ex: 'الكالكوبيريت',
      d: [[0, -70, 0, 70], [-48, 0, 48, 0], [-34, 28, 34, -28]], lab: ['c', 'a', 'a'] },
    hexa: { n: 'السداسي', ax: 4, len: 'ثلاثة أفقية متساوية ورابع رأسي مختلف', ang: 'الأفقية بينها <ltr>120°</ltr> والرأسي عمودي عليها', ex: 'الغرافيت',
      d: [[0, -70, 0, 70], [-52, 0, 52, 0], [-26, -45, 26, 45], [-26, 45, 26, -45]], lab: ['c', 'a', 'a', 'a'], six: 1 },
    trig: { n: 'الثلاثي', ax: 4, len: 'ثلاثة أفقية متساوية ورابع رأسي مختلف', ang: 'الأفقية بينها <ltr>120°</ltr> والرأسي عمودي عليها', ex: 'الكالسيت',
      d: [[0, -70, 0, 70], [-52, 0, 52, 0], [-26, -45, 26, 45], [-26, 45, 26, -45]], lab: ['c', 'a', 'a', 'a'], six: 0 },
    ortho: { n: 'المَعين القائم', ax: 3, len: 'ثلاثة محاور غير متساوية', ang: 'متعامدة جميعها', ex: 'الكبريت',
      d: [[0, -70, 0, 70], [-56, 0, 56, 0], [-32, 26, 32, -26]], lab: ['c', 'a', 'b'] },
    mono: { n: 'أحادي المَيل', ax: 3, len: 'ثلاثة محاور غير متساوية', ang: 'زوجان منها متعامدان والثالث مائل', ex: 'الجبس',
      d: [[0, -70, 0, 70], [-56, 0, 56, 0], [-18, 40, 42, -22]], lab: ['c', 'a', 'b'] }
  };
  const CYF = { 2: 'ثنائي', 3: 'ثلاثي', 4: 'رباعي', 6: 'سداسي' };

  function crystal(host) {
    host.innerHTML = '';
    const S = { mode: 'sym', fold: 4, turn: 0, sys: 'cubic' };
    const bar = el('div', 'srow'), body = el('div');
    host.append(bar, body);

    function mkbar() {
      bar.innerHTML = '';
      bar.append(sel('الوضع', S.mode, [['sym', 'محور التناظر والإدارة'], ['sys', 'الأنظمة البلورية الستّة']], v => { S.mode = v; S.turn = 0; mkbar(); draw(); }));
      if (S.mode === 'sym') {
        bar.append(sel('شكل البلورة', S.fold, [[2, 'مقطع مستطيل'], [3, 'مقطع ثلاثي'], [4, 'مقطع مربّع'], [6, 'مقطع سداسي']], v => { S.fold = +v; S.turn = 0; mkbar(); draw(); }));
        bar.append(btn('أَدِرْ خطوة', 'go', () => { if (S.turn < S.fold) S.turn++; draw(); }));
        bar.append(btn('من البداية', 'gh', () => { S.turn = 0; draw(); }));
      } else {
        bar.append(sel('النظام', S.sys, Object.keys(CYS).map(k => [k, CYS[k].n]), v => { S.sys = v; draw(); }));
      }
    }

    function poly(n, rot) {
      const R = 58, c = 78, p = [];
      for (let i = 0; i < n; i++) {
        const a = (rot + i * 360 / n - 90) * Math.PI / 180;
        p.push((c + R * Math.cos(a)).toFixed(1) + ',' + (c + R * Math.sin(a)).toFixed(1));
      }
      return p.join(' ');
    }

    function drawSym() {
      const n = S.fold === 2 ? 4 : S.fold;
      const step = 360 / S.fold;
      const rot = S.turn * step;
      const sq = S.fold === 2 ? 1 : 0;
      let s = '<svg viewBox="0 0 156 156" width="156" height="156" aria-hidden="true">';
      s += '<circle cx="78" cy="78" r="66" fill="#fafbfd" stroke="#e3e8ef"/>';
      if (sq) {
        /* مقطع مستطيل : تكرار الأوجه مرّتان في الدورة الكاملة */
        const w = 54, h = 34, a = rot * Math.PI / 180;
        const pts = [[-w, -h], [w, -h], [w, h], [-w, h]].map(q => {
          const x = 78 + q[0] * Math.cos(a) - q[1] * Math.sin(a);
          const y = 78 + q[0] * Math.sin(a) + q[1] * Math.cos(a);
          return x.toFixed(1) + ',' + y.toFixed(1);
        }).join(' ');
        s += '<polygon points="' + pts + '" fill="#E8EEF6" stroke="#1F3A5F" stroke-width="2"/>';
        const mx = 78 + w * Math.cos(a), my = 78 + w * Math.sin(a);
        s += '<circle cx="' + mx.toFixed(1) + '" cy="' + my.toFixed(1) + '" r="6" fill="#B3261E"/>';
      } else {
        s += '<polygon points="' + poly(n, rot) + '" fill="#E8EEF6" stroke="#1F3A5F" stroke-width="2"/>';
        const a = (rot - 90) * Math.PI / 180;
        s += '<circle cx="' + (78 + 58 * Math.cos(a)).toFixed(1) + '" cy="' + (78 + 58 * Math.sin(a)).toFixed(1) + '" r="6" fill="#B3261E"/>';
      }
      s += '<circle cx="78" cy="78" r="4" fill="#1F3A5F"/>';
      s += '<circle cx="78" cy="78" r="11" fill="none" stroke="#1F3A5F" stroke-dasharray="3 3"/>';
      s += '</svg>';
      const wrap = el('div', 'cywrap', s);
      body.append(el('p', 'shint', 'المحور خطّ وهميّ يمرّ بمركز البلورة ( النقطة الوسطى ) ، <b>والبلورة تدور حوله</b> . والنقطة الحمراء علامة على وجه واحد لتتابع دورانه.'));
      body.append(wrap);
      const info = el('div', 'cyinfo');
      info.append(el('div', 'cyrow', '<span class="cyk">زاوية الخطوة</span><span class="cyv">' + L((360 / S.fold) + '°') + '</span>'));
      info.append(el('div', 'cyrow', '<span class="cyk">ما أُدير حتى الآن</span><span class="cyv">' + L(rot + '°') + ' — ' + (S.turn ? S.turn + ' من ' + S.fold : 'لم يبدأ') + '</span>'));
      info.append(el('div', 'cyrow', '<span class="cyk">عدد مرّات تكرار الأوجه في الدورة الكاملة</span><span class="cyv">' + S.fold + '</span>'));
      info.append(el('div', 'cyrow', '<span class="cyk">اسم المحور</span><span class="cyv"><b>محور تناظر ' + CYF[S.fold] + '</b></span>'));
      body.append(info);
      if (S.turn >= S.fold) body.append(el('p', 'sl ok', 'تمّت دورة كاملة ' + L('360°') + ' : تكرّرت الأوجه المتشابهة <b>' + S.fold + '</b> مرّات ، فالمحور <b>' + CYF[S.fold] + '</b> . وبهذا العدد يُسمّى المحور لا بعدد أوجه البلورة.'));
      else body.append(el('p', 'sl note', 'أَدِر البلورة خطوةً خطوة وعُدّ كم مرّة يرجع الشكل إلى صورته الأولى حتى تتمّ الدورة الكاملة — هذا العدد هو اسم المحور.'));
    }

    function drawSys() {
      const c = CYS[S.sys];
      let s = '<svg viewBox="0 0 170 170" width="170" height="170" aria-hidden="true">';
      s += '<circle cx="85" cy="85" r="76" fill="#fafbfd" stroke="#e3e8ef"/>';
      c.d.forEach((a, i) => {
        s += '<line x1="' + (85 + a[0]) + '" y1="' + (85 + a[1]) + '" x2="' + (85 + a[2]) + '" y2="' + (85 + a[3]) + '" stroke="' + (i ? '#2F6B3A' : '#1F3A5F') + '" stroke-width="2.5"/>';
        s += '<text x="' + (85 + a[2] * 1.17) + '" y="' + (85 + a[3] * 1.17 + 4) + '" direction="ltr" text-anchor="middle" font-size="12" fill="#5b6b80">' + c.lab[i] + '</text>';
      });
      s += '<circle cx="85" cy="85" r="3.5" fill="#1F3A5F"/></svg>';
      body.append(el('div', 'cywrap', s));
      const info = el('div', 'cyinfo');
      const row = (k, v) => info.append(el('div', 'cyrow', '<span class="cyk">' + k + '</span><span class="cyv">' + v + '</span>'));
      row('النظام', '<b>' + c.n + '</b>');
      row('عدد المحاور', c.ax);
      row('أطوال المحاور', c.len);
      row('الزوايا بينها', c.ang);
      row('مثال', '<b>' + c.ex + '</b>');
      body.append(info);
      if (c.six !== undefined)
        body.append(el('p', 'sl note', 'الثلاثي والسداسي يتشابهان في المحاور تشابهًا تامًّا : أربعة محاور ، ثلاثة أفقية متساوية بينها ' + L('120°') + ' . والفصل بينهما في <b>عدد مرّات تكرار الأوجه حول المحور الرأسي</b> : ' + (c.six ? 'ستّ مرّات هنا ← سداسي ( الغرافيت )' : 'ثلاث مرّات هنا ← ثلاثي ( الكالسيت )') + ' .'));
      else if (S.sys === 'cubic' || S.sys === 'ortho')
        body.append(el('p', 'sl note', 'المكعّب والمَعين القائم يشتركان في أنّ لكلٍّ ثلاثة محاور <b>متعامدة</b> ، ويختلفان في <b>الأطوال</b> : متساوية في المكعّب وغير متساوية في المَعين القائم.'));
      body.append(el('p', 'shint', 'والطريق إلى النظام سؤالان : كم محورًا ؟ ثمّ ما حال أطوال المحاور وزواياها ؟'));
    }

    function draw() { body.innerHTML = ''; if (S.mode === 'sym') drawSym(); else drawSys(); }
    mkbar(); draw();
  }

  /* ---------------- 3 · القساوة ومقياس موس ---------------- */
  const MH = [[1, 'التلك'], [2, 'الجبس'], [3, 'الكالسيت'], [4, 'الفلوريت'], [5, 'الأباتيت'],
              [6, 'الأورثوكليز'], [7, 'الكوارتز'], [8, 'التوباز'], [9, 'الكورندوم'], [10, 'الماس']];
  const MHREF = [[2.5, 'ظفر الأصبع'], [3.5, 'العملة النحاسية'], [5.5, 'اللوح الزجاجي'], [6.5, 'نصل السكين الفولاذي'], [7, 'لوح الحكاكة']];
  const MHUNK = [3, 4, 5, 6, 7, 2];

  function mohs(host) {
    host.innerHTML = '';
    const S = { mode: 'cmp', a: 3, b: 7, u: 0, done: [], show: false };
    const bar = el('div', 'srow'), body = el('div');
    host.append(bar, body);
    const ALL = MH.map(m => [m[0], m[1] + ' (' + m[0] + ')']).concat(MHREF.map(m => [m[0], m[1] + ' (' + m[0] + ')']));
    const nameOf = v => { const m = MH.concat(MHREF).find(x => x[0] == v); return m ? m[1] : v; };

    function mkbar() {
      bar.innerHTML = '';
      bar.append(sel('الوضع', S.mode, [['cmp', 'من يخدش من ؟'], ['unk', 'حدّد قساوة معدن مجهول']], v => { S.mode = v; S.done = []; S.show = false; mkbar(); draw(); }));
      if (S.mode === 'cmp') {
        bar.append(sel('المادة الأولى', S.a, ALL, v => { S.a = +v; draw(); }));
        bar.append(sel('المادة الثانية', S.b, ALL, v => { S.b = +v; draw(); }));
      } else {
        bar.append(btn('معدن مجهول آخر', 'gh', () => { S.u = (S.u + 1) % MHUNK.length; S.done = []; S.show = false; draw(); }));
        if (!S.show) bar.append(btn('اكشف الجواب', 'go', () => { S.show = true; mkbar(); draw(); }));
      }
    }

    function scale(mark) {
      const w = el('div', 'mhscale');
      MH.forEach(m => {
        const st = el('div', 'mhstep' + (mark && mark.indexOf(m[0]) >= 0 ? ' mhon' : ''));
        st.append(el('span', 'mhnum', String(m[0])));
        st.append(el('span', 'mhname', m[1]));
        w.append(st);
      });
      return w;
    }

    function drawCmp() {
      body.append(el('p', 'shint', 'القاعدة الذهبية : <b>الأقسى يخدش الأقلّ قساوةً ولا يُخدَش به</b> . ورقم موس <b>ترتيب</b> لا مقدار.'));
      body.append(scale([S.a, S.b]));
      const na = nameOf(S.a), nb = nameOf(S.b);
      let v;
      if (S.a > S.b) v = '<b>' + na + '</b> ' + L('(' + S.a + ')') + ' يخدش <b>' + nb + '</b> ' + L('(' + S.b + ')') + ' ، ولا يُخدَش به — لأنّ الأقسى هو الخادش.';
      else if (S.a < S.b) v = '<b>' + nb + '</b> ' + L('(' + S.b + ')') + ' يخدش <b>' + na + '</b> ' + L('(' + S.a + ')') + ' ، ولا يُخدَش به — لأنّ الأقسى هو الخادش.';
      else v = 'المادّتان متساويتان في القساوة ' + L('(' + S.a + ')') + ' ، فلا تخدش إحداهما الأخرى خدشًا واضحًا.';
      body.append(el('div', 'mhverd', v));
      if (Math.abs(S.a - S.b) === 1)
        body.append(el('p', 'sl note', 'فرق درجة واحدة على المقياس <b>ليس مقدارًا ثابتًا</b> : الفرق الحقيقي بين ' + L('9') + ' و' + L('10') + ' أكبر جدًّا من الفرق بين ' + L('1') + ' و' + L('2') + ' .'));
    }

    function drawUnk() {
      const h = MHUNK[S.u];
      body.append(el('p', 'shint', 'معدن مجهول في يدك . جرّب عليه المواد المرجعية ، ثمّ احصر قساوته بين <b>أقسى مادة لم تخدشه</b> و<b>أقلّ مادة خدشته</b>.'));
      const row = el('div', 'mhrefs');
      MHREF.forEach(r => {
        const used = S.done.find(d => d[0] === r[0]);
        const b = btn(r[1] + ' ' + L('(' + r[0] + ')'), used ? 'gh' : '', () => {
          /* 1 خدشت المعدن · 0 لم تخدشه · 2 متساويان فلا خدش واضح */
          if (!S.done.find(d => d[0] === r[0])) S.done.push([r[0], r[0] > h ? 1 : (r[0] === h ? 2 : 0)]);
          draw();
        });
        row.append(b);
      });
      body.append(row);
      if (S.done.length) {
        const log = el('div', 'mhlog');
        S.done.slice().sort((x, y) => x[0] - y[0]).forEach(d => {
          log.append(el('div', 'mhlogr' + (d[1] === 1 ? ' mhcut' : d[1] === 2 ? ' mheq' : ''),
            '<b>' + nameOf(d[0]) + '</b> ' + L('(' + d[0] + ')') + ' — '
            + (d[1] === 1 ? 'خدشت المعدن ← المعدن أقلّ قساوةً منها'
              : d[1] === 2 ? 'لا خدش واضح في أيّ الاتجاهين ← القساوتان متساويتان'
                : 'لم تخدش المعدن ← المعدن أقسى منها')));
        });
        body.append(log);
        const eq = S.done.filter(d => d[1] === 2).map(d => d[0]);
        const lo = S.done.filter(d => d[1] === 0).map(d => d[0]);
        const hi = S.done.filter(d => d[1] === 1).map(d => d[0]);
        const loV = lo.length ? Math.max.apply(null, lo) : null;
        const hiV = hi.length ? Math.min.apply(null, hi) : null;
        let r;
        if (eq.length) r = 'القساوة <b>تساوي ' + L(eq[0]) + '</b> — فالمادة المرجعية لم تخدشه ولم يخدشها ، وهذا أدقّ ما يُعطيه اختبار الخدش';
        else if (loV !== null && hiV !== null) r = 'القساوة <b>بين ' + L(loV) + ' و ' + L(hiV) + '</b>';
        else if (loV !== null) r = 'القساوة <b>أكبر من ' + L(loV) + '</b> — جرّب مادة أقسى لتُغلق الحدّ الأعلى';
        else r = 'القساوة <b>أقلّ من ' + L(hiV) + '</b> — جرّب مادة أقلّ قساوةً لتُغلق الحدّ الأدنى';
        body.append(el('div', 'mhrange', r));
      }
      body.append(scale(S.show ? [h] : []));
      if (S.show) {
        const m = MH.find(x => x[0] === h);
        body.append(el('div', 'mhverd', 'المعدن المجهول قساوته ' + L(h) + ' — وهو في المقياس <b>' + m[1] + '</b> . ولاحظ أنّ المواد المرجعية الخمس كانت كافية لحصر القساوة من دون معادن موس العشرة.'));
      }
    }

    function draw() { body.innerHTML = ''; if (S.mode === 'cmp') drawCmp(); else drawUnk(); }
    mkbar(); draw();
  }

  /* ---------------- 4 · تصنيف المعادن بالأيون السالب ---------------- */
  const MGG = {
    sil: { n: 'السيليكات', ion: '(SiO₄)⁴⁻', note: 'أكبر المجموعات — أكثر من <ltr>90 %</ltr> من معادن القشرة ، وفيها الأكسجين والسيليكون معًا.' },
    car: { n: 'الكربونات', ion: '(CO₃)²⁻', note: 'ثاني أكثر المجموعات شيوعًا بعد السيليكات.' },
    oxi: { n: 'الأكاسيد', ion: 'O²⁻', note: 'أيون الأكسجين متّحدًا مع أيون موجب يكوّن أحد الفلزّات عادةً.' },
    hal: { n: 'الهاليدات', ion: 'Cl⁻ · F⁻', note: 'أيون هالوجيني ( كلور أو فلور ) متّحدًا مع موجب كالصوديوم أو الكالسيوم.' },
    sul: { n: 'الكبريتات', ion: '(SO₄)²⁻', note: 'فيها كبريت <b>مع أكسجين</b> — وهذا ما يفصلها عن الكبريتيدات.' },
    sfd: { n: 'الكبريتيدات', ion: 'S²⁻', note: 'كبريت <b>بلا أكسجين</b> ، ومنها أهمّ خامات الحديد والرصاص والنحاس.' },
    pho: { n: 'الفوسفات', ion: '(PO₄)³⁻', note: 'ومنها الأباتيت في صخر الفوسفات الأردني.' },
    nat: { n: 'أحادية العنصر', ion: 'لا أيون سالب', note: 'عنصر واحد ، وتندر في الطبيعة لسهولة تفاعل معظمها مع الأكسجين.' }
  };
  const MGM = [
    { n: 'الكالسيت', f: 'CaCO₃', ion: 'CO₃', g: 'car' },
    { n: 'الدولوميت', f: 'CaMg(CO₃)₂', ion: 'CO₃', g: 'car' },
    { n: 'البيريت', f: 'FeS₂', ion: 'S', g: 'sfd' },
    { n: 'الغالينا', f: 'PbS', ion: 'S', g: 'sfd' },
    { n: 'الجبس', f: 'CaSO₄.2H₂O', ion: 'SO₄', g: 'sul' },
    { n: 'الباريت', f: 'BaSO₄', ion: 'SO₄', g: 'sul' },
    { n: 'الهيماتيت', f: 'Fe₂O₃', ion: 'O', g: 'oxi' },
    { n: 'الماغنتيت', f: 'Fe₃O₄', ion: 'O', g: 'oxi' },
    { n: 'الهاليت', f: 'NaCl', ion: 'Cl', g: 'hal' },
    { n: 'الفلوريت', f: 'CaF₂', ion: 'F', g: 'hal' },
    { n: 'السيلفيت', f: 'KCl', ion: 'Cl', g: 'hal' },
    { n: 'الأباتيت', f: 'Ca₅(PO₄)₃F', ion: 'PO₄', g: 'pho' },
    { n: 'الكوارتز', f: 'SiO₂', ion: 'SiO', g: 'sil' },
    { n: 'الأوليفين', f: 'Mg₂SiO₄', ion: 'SiO₄', g: 'sil' },
    { n: 'الذهب', f: 'Au', ion: '—', g: 'nat' },
    { n: 'الفضة', f: 'Ag', ion: '—', g: 'nat' }
  ];

  function mingroup(host) {
    host.innerHTML = '';
    const S = { i: 0, pick: null, tab: false, score: 0, tries: 0 };
    const bar = el('div', 'srow'), body = el('div');
    host.append(bar, body);

    function mkbar() {
      bar.innerHTML = '';
      bar.append(sel('المعدن', S.i, MGM.map((m, k) => [k, m.n]), v => { S.i = +v; S.pick = null; draw(); }));
      bar.append(btn('معدن تالٍ', 'gh', () => { S.i = (S.i + 1) % MGM.length; S.pick = null; mkbar(); draw(); }));
      bar.append(btn(S.tab ? 'إخفاء جدول المجموعات' : 'جدول المجموعات الثمانية', 'gh', () => { S.tab = !S.tab; mkbar(); draw(); }));
    }

    function draw() {
      body.innerHTML = '';
      const m = MGM[S.i];
      body.append(el('p', 'shint', 'القاعدة : ابحث عن <b>الأيون السالب</b> في الصيغة — لا الموجب — ثمّ أَسنِد المعدن إلى مجموعته.'));
      body.append(el('div', 'mgf', '<b>' + m.n + '</b><span dir="ltr" class="mgfa">' + m.f + '</span>'));
      const bs = el('div', 'mgbtns');
      Object.keys(MGG).forEach(k => {
        const cls = S.pick === null ? '' : (k === m.g ? 'mgright' : (k === S.pick ? 'mgwrong' : 'gh'));
        bs.append(btn(MGG[k].n, cls, () => { if (S.pick === null) { S.pick = k; S.tries++; if (k === m.g) S.score++; draw(); } }));
      });
      body.append(bs);
      if (S.pick !== null) {
        const ok = S.pick === m.g, g = MGG[m.g];
        body.append(el('div', 'mgfb' + (ok ? ' mgok' : ''),
          '<b>' + (ok ? 'صحيح' : 'غير صحيح') + '</b> — ' + m.n + ' ' + L(m.f) + ' من <b>' + g.n + '</b> ، '
          + (m.ion === '—' ? 'إذ لا أيون سالب فيه بل عنصر واحد.' : 'لأنّ الأيون السالب فيه ' + L(g.ion) + ' .')
          + ' ' + g.note
          + (ok ? '' : ' وما اخترتَه ( <b>' + MGG[S.pick].n + '</b> ) أيونه ' + L(MGG[S.pick].ion) + ' ، وهو غير موجود في هذه الصيغة.')));
        body.append(el('p', 'shint', 'أصبتَ <b>' + S.score + '</b> من <b>' + S.tries + '</b> .'));
        if ((m.g === 'sul' || m.g === 'sfd'))
          body.append(el('p', 'sl note', 'الفصل بين الكبريتات والكبريتيدات بالأكسجين : ' + L('(SO₄)²⁻') + ' فيه أكسجين ← <b>كبريتات</b> ، و' + L('S²⁻') + ' بلا أكسجين ← <b>كبريتيدات</b> .'));
      }
      if (S.tab) {
        const t = el('div', 'mgtab');
        const hd = el('div', 'mgtr mghd');
        hd.append(el('span', 'mgtc', 'المجموعة')); hd.append(el('span', 'mgtc', 'الأيون السالب')); hd.append(el('span', 'mgtc', 'مثال'));
        t.append(hd);
        Object.keys(MGG).forEach(k => {
          const r = el('div', 'mgtr');
          const ex = MGM.find(x => x.g === k);
          r.append(el('span', 'mgtc', MGG[k].n));
          r.append(el('span', 'mgtc', '<span dir="ltr">' + MGG[k].ion + '</span>'));
          r.append(el('span', 'mgtc', ex ? ex.n + ' <span dir="ltr">' + ex.f + '</span>' : '—'));
          t.append(r);
        });
        const w = el('div', 'mgwrap', ''); w.append(t); body.append(w);
      }
    }
    mkbar(); draw();
  }

  window.SIMS.mintest = mintest;
  window.SIMS.crystal = crystal;
  window.SIMS.mohs = mohs;
  window.SIMS.mingroup = mingroup;
})();

/* ===== محاكاة الصخور ( علوم الأرض العاشر — الوحدة الأولى ) ===== */
(function () {
  const el = (t, c, h) => { const e = document.createElement(t); if (c) e.className = c; if (h !== undefined) e.innerHTML = h; return e; };
  const btn = (txt, cls, fn) => { const b = el('button', 'sb ' + (cls || ''), txt); b.onclick = fn; return b; };
  const L = s => '<span class="ltr">' + s + '</span>';
  const sel = (lab, val, opts, fn) => {
    const w = el('label', 'sf'); w.append(el('span', '', lab));
    const s = document.createElement('select');
    opts.forEach(o => { const p = document.createElement('option'); p.value = o[0]; p.textContent = o[1]; if (o[0] == val) p.selected = true; s.append(p); });
    s.onchange = () => fn(s.value); w.append(s); return w;
  };

  /* ---------------- 1 · دورة الصخور ---------------- */
  const RC = {
    magma: { n: 'ماغما', d: 'صهير في باطن الأرض ، معظمه سيليكا وفيه غازات أهمّها بخار الماء.' },
    ign: { n: 'صخر ناري', d: 'تكوّن بتبريد الماغما أو اللابة وتبلورهما — كالغرانيت والبازلت.' },
    sed: { n: 'رسوبيات', d: 'فتات ومواد تراكمت في حوض الترسيب ، ولم تتصخّر بعد.' },
    srk: { n: 'صخر رسوبي', d: 'تكوّن بتصخّر الرسوبيات : تراصّ ثمّ التحام — كالصخر الرملي والجيري.' },
    met: { n: 'صخر متحوّل', d: 'تكوّن بالحرارة والضغط دون الانصهار ، في الحالة الصُّلبة — كالرخام والنايس.' }
  };
  const RCOPS = {
    magma: [['تبريد وتبلور', 'ign', 'بردت الماغما فتبلورت معادنها ، فتكوّن صخر ناري.']],
    ign: [
      ['تجوية وتعرية وترسيب', 'sed', 'تفتّت الصخر على السطح ، ونُقل فتاته ورُسّب في حوض الترسيب.'],
      ['حرارة وضغط دون الانصهار', 'met', 'تغيّر نسيج الصخر وتركيبه المعدني وهو صُلب ، فصار متحوّلًا.'],
      ['انصهار', 'magma', 'بلغت الحرارة درجة الانصهار فانصهر الصخر ، فعادت الماغما.']
    ],
    sed: [['تصخّر ( تراصّ والتحام )', 'srk', 'قلّص الضغط الفراغات ، ثمّ ربطت المواد المعدنية الحبيبات ، فصارت صخرًا.']],
    srk: [
      ['تجوية وتعرية وترسيب', 'sed', 'تفتّت الصخر الرسوبي المكشوف ، فعاد رسوبيات من جديد.'],
      ['حرارة وضغط دون الانصهار', 'met', 'دُفن الصخر الرسوبي في العمق فتحوّل — كالصخر الجيري يصير رخامًا.'],
      ['انصهار', 'magma', 'دُفن في أعماق كبيرة فبلغت الحرارة درجة الانصهار.']
    ],
    met: [
      ['تجوية وتعرية وترسيب', 'sed', 'رُفع الصخر المتحوّل إلى السطح فتفتّت وصار رسوبيات.'],
      ['حرارة وضغط أعلى دون الانصهار', 'met', 'ارتفعت درجة التحوّل ، فتحوّل الصخر مرّةً أخرى — كالأردواز يصير شيستًا.'],
      ['انصهار', 'magma', 'بلغت الحرارة درجة الانصهار فخرج الصخر من التحوّل إلى الماغما.']
    ]
  };

  function rockcycle(host) {
    host.innerHTML = '';
    const S = { at: 'magma', path: [], last: null };
    const bar = el('div', 'srow'), body = el('div');
    host.append(bar, body);

    function mkbar() {
      bar.innerHTML = '';
      bar.append(sel(S.path.length ? 'الصخر الآن ( غيّره لتبدأ من جديد )' : 'ابدأ من', S.at, Object.keys(RC).map(k => [k, RC[k].n]), v => { S.at = v; S.path = []; S.last = null; mkbar(); draw(); }));
      if (S.path.length) bar.append(btn('من البداية', 'gh', () => { S.path = []; S.last = null; draw(); }));
    }

    function draw() {
      body.innerHTML = '';
      const c = RC[S.at];
      body.append(el('div', 'rcnow', '<b>الصخر الآن : ' + c.n + '</b><span>' + c.d + '</span>'));
      body.append(el('p', 'shint', 'اختر <b>العملية الجيولوجية</b> التي يتعرّض لها — فالعملية هي التي تُحدّد الناتج ، لا نوع الصخر الذي بدأتَ منه.'));
      const ops = el('div', 'rcops');
      RCOPS[S.at].forEach(o => {
        ops.append(btn(o[0], '', () => {
          S.path.push({ from: S.at, op: o[0], to: o[1], why: o[2] });
          S.at = o[1]; S.last = o[2]; mkbar(); draw();
        }));
      });
      body.append(ops);
      if (S.last) body.append(el('p', 'sl ok', S.last));
      if (S.path.length) {
        const p = el('div', 'rcpath');
        p.append(el('b', '', 'المسار الذي سلكتَه :'));
        S.path.forEach((s, i) => p.append(el('div', 'rcstep',
          '<i>' + (i + 1) + '</i>' + RC[s.from].n + ' <span class="rcar">←</span> <b>' + s.op + '</b> <span class="rcar">←</span> ' + RC[s.to].n)));
        if (S.path.length >= 3) p.append(el('div', 'rcnote', 'لاحظ أنّ الدورة <b>مستمرّة لا تتوقّف</b> ، وأنّ لكلّ نوع <b>أكثر من مخرج</b> — فليست مسارًا واحدًا.'));
        body.append(p);
      }
    }
    mkbar(); draw();
  }

  /* ---------------- 2 · نسيج الصخور النارية ---------------- */
  const TX = {
    coarse: { n: 'خشن الحبيبات', how: 'تبريد <b>بطيء</b> للماغما في باطن الأرض فتكبر البلورات', ex: 'الغرانيت', place: 'جوفي', r: 13, k: 'xtal' },
    fine: { n: 'ناعم الحبيبات', how: 'تبريد <b>سريع</b> للّابة على السطح فتصغر البلورات ولا تُرى بالعين المجرّدة', ex: 'الريوليت والبازلت', place: 'سطحي', r: 4, k: 'xtal' },
    glass: { n: 'زجاجي', how: 'تبريد <b>مفاجئ سريع جدًّا</b> فلا تتكوّن بلورات وترتبط الذرّات عشوائيًّا', ex: 'الأوبسيديان', place: 'سطحي', r: 0, k: 'glass' },
    porph: { n: 'سماقي ( بورفيري )', how: 'تبريد على <b>مرحلتين</b> : بطيء في الباطن فتتكوّن بلورات كبيرة ، ثمّ سريع فتتجمّع حولها صغيرة', ex: 'صخر ذو بلورات كبيرة محاطة بصغيرة', place: 'بدأ جوفيًّا وانتهى سطحيًّا', r: 0, k: 'porph' },
    vesic: { n: 'فقاعي', how: 'خروج <b>الغازات</b> من اللابة على السطح فتتكوّن فجوات وثقوب', ex: 'الخفاف', place: 'سطحي', r: 0, k: 'vesic' }
  };

  function texture(host) {
    host.innerHTML = '';
    const S = { k: 'coarse' };
    const bar = el('div', 'srow'), body = el('div');
    host.append(bar, body);

    function mkbar() {
      bar.innerHTML = '';
      bar.append(sel('النسيج', S.k, Object.keys(TX).map(k => [k, TX[k].n]), v => { S.k = v; draw(); }));
    }

    function svg(t) {
      const W = 190, H = 130;
      let s = '<svg viewBox="0 0 ' + W + ' ' + H + '" width="' + W + '" height="' + H + '" aria-hidden="true">';
      s += '<rect x="1" y="1" width="' + (W - 2) + '" height="' + (H - 2) + '" rx="10" fill="#fafbfd" stroke="#e3e8ef"/>';
      const cols = ['#C9D6E6', '#AEC2D8', '#8FA9C6', '#DCE5EF'];
      let seed = 7;
      const rnd = () => { seed = (seed * 1103515245 + 12345) % 2147483648; return seed / 2147483648; };
      if (t.k === 'xtal') {
        const r = t.r, step = r * 1.9;
        for (let y = r + 6; y < H - 4; y += step) for (let x = r + 6; x < W - 4; x += step) {
          s += '<circle cx="' + x.toFixed(1) + '" cy="' + y.toFixed(1) + '" r="' + (r * (0.75 + 0.3 * rnd())).toFixed(1) + '" fill="' + cols[Math.floor(rnd() * 4)] + '" stroke="#5b6b80" stroke-width="0.7"/>';
        }
      } else if (t.k === 'glass') {
        s += '<rect x="8" y="8" width="' + (W - 16) + '" height="' + (H - 16) + '" rx="7" fill="#3C4A5E"/>';
        s += '<path d="M20 108 L60 22 L92 108 Z" fill="#4E6074" opacity="0.7"/>';
        s += '<path d="M100 108 L140 40 L172 108 Z" fill="#55687E" opacity="0.6"/>';
      } else if (t.k === 'porph') {
        for (let y = 10; y < H - 4; y += 9) for (let x = 10; x < W - 4; x += 9)
          s += '<circle cx="' + x + '" cy="' + y + '" r="3.2" fill="' + cols[Math.floor(rnd() * 4)] + '" stroke="#5b6b80" stroke-width="0.5"/>';
        [[52, 44], [128, 40], [92, 96], [36, 100], [158, 92]].forEach(p =>
          s += '<circle cx="' + p[0] + '" cy="' + p[1] + '" r="16" fill="#7E97B6" stroke="#1F3A5F" stroke-width="1.4"/>');
      } else {
        s += '<rect x="8" y="8" width="' + (W - 16) + '" height="' + (H - 16) + '" rx="7" fill="#C2CBD6"/>';
        for (let i = 0; i < 26; i++) {
          const x = 16 + rnd() * (W - 32), y = 16 + rnd() * (H - 32), r = 4 + rnd() * 7;
          s += '<circle cx="' + x.toFixed(1) + '" cy="' + y.toFixed(1) + '" r="' + r.toFixed(1) + '" fill="#fafbfd" stroke="#8894a6" stroke-width="0.8"/>';
        }
      }
      return s + '</svg>';
    }

    function draw() {
      body.innerHTML = '';
      const t = TX[S.k];
      body.append(el('div', 'txwrap', svg(t)));
      const info = el('div', 'cyinfo');
      const row = (k, v) => info.append(el('div', 'cyrow', '<span class="cyk">' + k + '</span><span class="cyv">' + v + '</span>'));
      row('كيف يتكوّن ؟', t.how);
      row('مثاله', '<b>' + t.ex + '</b>');
      row('مكان التبلور', '<b>' + t.place + '</b>');
      body.append(info);
      if (S.k === 'coarse' || S.k === 'fine')
        body.append(el('p', 'sl note', 'القاعدة الذهبية : العلاقة بين <b>سرعة التبريد</b> و<b>حجم البلورة</b> <b>عكسية</b> — كلّما بطؤ التبريد كبرت البلورة.'));
      else if (S.k === 'glass' || S.k === 'vesic')
        body.append(el('p', 'sl note', 'الزجاجي والفقاعي كلاهما <b>سطحي</b> ، والفرق في السبب : الزجاجي من <b>تبريد مفاجئ سريع جدًّا</b> فلا بلورات ، والفقاعي من <b>خروج الغازات</b> فتتكوّن فجوات.'));
      else
        body.append(el('p', 'sl note', 'السماقي دليل على <b>تبريد على مرحلتين</b> ، فهو يحمل في صخر واحد سجلّ الباطن والسطح معًا.'));
    }
    mkbar(); draw();
  }

  /* ---------------- 3 · نسبة السيليكا والتصنيف ---------------- */
  const SI = [
    { k: 'ultra', n: 'فوق مافية', lo: 30, hi: 45, col: '#2C3440', lab: 'قاتم', deep: 'البيريدوتيت', sur: 'الكوماتيت', min: 'الأوليفين والبيروكسين' },
    { k: 'mafic', n: 'مافية', lo: 45, hi: 52, col: '#4B5A6B', lab: 'غامق', deep: 'الغابرو', sur: 'البازلت', min: 'البيروكسين والأمفيبول والبلاجيوكليز الكلسي' },
    { k: 'inter', n: 'متوسطة', lo: 52, hi: 63, col: '#93A3B5', lab: 'بين الفاتح والغامق', deep: 'الديوريت', sur: 'الأنديزيت', min: 'البلاجيوكليز الصودي والبيوتيت والأمفيبول' },
    { k: 'felsic', n: 'فلسية', lo: 63, hi: 80, col: '#DCE3EC', lab: 'فاتح', deep: 'الغرانيت', sur: 'الريوليت', min: 'الفلسبار البوتاسي والمسكوفيت والكوارتز' }
  ];

  function silica(host) {
    host.innerHTML = '';
    const S = { p: 70, deep: 1 };
    const bar = el('div', 'srow'), body = el('div');
    host.append(bar, body);
    const find = p => SI.find(x => p >= x.lo && p < x.hi) || SI[SI.length - 1];

    function mkbar() {
      bar.innerHTML = '';
      const w = el('label', 'sf'); w.append(el('span', '', 'نسبة السيليكا : ' + L(S.p + ' %')));
      const r = document.createElement('input');
      r.type = 'range'; r.min = 30; r.max = 80; r.step = 1; r.value = S.p;
      r.oninput = () => { S.p = +r.value; w.firstChild.innerHTML = 'نسبة السيليكا : ' + L(S.p + ' %'); draw(); };
      w.append(r); bar.append(w);
      const r2 = el('div', 'srow');
      r2.append(sel('مكان التبلور', S.deep, [[1, 'جوفي ( نسيج خشن )'], [0, 'سطحي ( نسيج ناعم )']], v => { S.deep = +v; draw(); }));
      bar.append(r2);
    }

    function draw() {
      body.innerHTML = '';
      const g = find(S.p);
      const band = el('div', 'siband');
      SI.forEach(x => {
        const seg = el('div', 'siseg' + (x.k === g.k ? ' sion' : ''));
        seg.style.flex = (x.hi - x.lo) + ' 1 0';
        seg.style.background = x.col;
        seg.append(el('span', 'sinum', x.lo + '–' + x.hi));
        band.append(seg);
      });
      body.append(el('p', 'shint', 'الشريط من <b>الأقلّ سيليكا</b> إلى <b>الأكثر</b> ، ولاحظ كيف يفتح اللون كلّما زادت السيليكا.'));
      body.append(band);
      const info = el('div', 'cyinfo');
      const row = (k, v) => info.append(el('div', 'cyrow', '<span class="cyk">' + k + '</span><span class="cyv">' + v + '</span>'));
      row('التصنيف', '<b>' + g.n + '</b>');
      row('مدى السيليكا', L(g.lo + ' – ' + g.hi + ' %'));
      row('اللون', '<b>' + g.lab + '</b>');
      row('المعادن المميّزة', g.min);
      row('الصخر', '<b>' + (S.deep ? g.deep : g.sur) + '</b> — ' + (S.deep ? 'جوفي خشن الحبيبات' : 'سطحي ناعم الحبيبات'));
      row('نظيره الآخر', (S.deep ? g.sur + ' ( سطحي )' : g.deep + ' ( جوفي )'));
      body.append(info);
      body.append(el('p', 'sl note', 'تصنيفان <b>مستقلّان</b> : نسبة السيليكا تُعطيك <b>الصفّ</b> ( التركيب واللون ) ، والنسيج يُعطيك <b>العمود</b> ( مكان التبلور ) . و<b>' + g.deep + '</b> و<b>' + g.sur + '</b> تركيبهما واحد ومكان تبلورهما مختلف.'));
    }
    mkbar(); draw();
  }

  /* ---------------- 4 · حجم الحبيبات والصخور الفتاتية ---------------- */
  const GR = [
    { k: 'clay', ras: 'الطين', rock: 'صخر الغضار أو الصخر الطيني', sz: 'أصغر من <ltr>1/256 mm</ltr>', r: 1.2 },
    { k: 'silt', ras: 'الغرين', rock: 'الصخر الغريني', sz: 'من <ltr>1/256 mm</ltr> إلى <ltr>1/16 mm</ltr>', r: 2.6 },
    { k: 'sand', ras: 'الرمل', rock: 'الصخر الرملي', sz: 'من <ltr>1/16 mm</ltr> إلى <ltr>2 mm</ltr>', r: 6 },
    { k: 'gravel', ras: 'الحصباء', rock: '', sz: 'أكبر من <ltr>2 mm</ltr>', r: 15 }
  ];

  function grain(host) {
    host.innerHTML = '';
    const S = { i: 2, round: 1 };
    const bar = el('div', 'srow'), body = el('div');
    host.append(bar, body);

    function mkbar() {
      bar.innerHTML = '';
      bar.append(sel('حجم الحبيبات', S.i, GR.map((g, k) => [k, g.ras + ' — ' + g.sz.replace(/<[^>]*>/g, '')]), v => { S.i = +v; mkbar(); draw(); }));
      if (S.i === 3) bar.append(sel('استدارة الحبيبات', S.round, [[1, 'مستديرة'], [0, 'مزوّاة ( حادّة )']], v => { S.round = +v; draw(); }));
    }

    function svg(g, round) {
      const W = 190, H = 110;
      let seed = 11;
      const rnd = () => { seed = (seed * 1103515245 + 12345) % 2147483648; return seed / 2147483648; };
      let s = '<svg viewBox="0 0 ' + W + ' ' + H + '" width="' + W + '" height="' + H + '" aria-hidden="true">';
      s += '<rect x="1" y="1" width="' + (W - 2) + '" height="' + (H - 2) + '" rx="10" fill="#F5F2EC" stroke="#e3e8ef"/>';
      const cols = ['#C9B89A', '#B8A383', '#D6C8AE', '#A89172'];
      const r = g.r, step = Math.max(r * 2.2, 3.2);
      const mx = 1.25 * r + 6;
      for (let y = mx; y < H - mx + 2; y += step) for (let x = mx; x < W - mx + 2; x += step) {
        const rr = r * (0.7 + 0.5 * rnd()), c = cols[Math.floor(rnd() * 4)];
        if (g.k === 'gravel' && !round) {
          const pts = [];
          for (let a = 0; a < 5; a++) { const an = (a * 72 + rnd() * 26) * Math.PI / 180, q = rr * (0.75 + 0.4 * rnd()); pts.push((x + q * Math.cos(an)).toFixed(1) + ',' + (y + q * Math.sin(an)).toFixed(1)); }
          s += '<polygon points="' + pts.join(' ') + '" fill="' + c + '" stroke="#6B5B43" stroke-width="0.9"/>';
        } else {
          s += '<circle cx="' + x.toFixed(1) + '" cy="' + y.toFixed(1) + '" r="' + rr.toFixed(1) + '" fill="' + c + '" stroke="#6B5B43" stroke-width="' + (r > 5 ? 0.9 : 0.4) + '"/>';
        }
      }
      return s + '</svg>';
    }

    function draw() {
      body.innerHTML = '';
      const g = GR[S.i];
      const rock = g.k === 'gravel' ? (S.round ? 'الكونغلوميريت' : 'البريشيا') : g.rock;
      body.append(el('p', 'shint', 'الصخور الرسوبية <b>الفتاتية</b> تُصنَّف تبعًا <b>لحجم حبيباتها</b> — والرسم تقريبيّ للنِّسَب لا بمقياس دقيق.'));
      body.append(el('div', 'txwrap', svg(g, S.round)));
      const info = el('div', 'cyinfo');
      const row = (k, v) => info.append(el('div', 'cyrow', '<span class="cyk">' + k + '</span><span class="cyv">' + v + '</span>'));
      row('حجم الحبيبات', g.sz);
      row('اسم الراسب', '<b>' + g.ras + '</b>');
      row('اسم الصخر', '<b>' + rock + '</b>');
      if (g.k === 'gravel') row('استدارة الحبيبات', S.round ? 'مستديرة — نُقل الفتات <b>مسافة طويلة</b> فحُتَّت حوافّه' : 'مزوّاة — الفتات <b>لم يُنقل</b> ، فبقيت حوافّه حادّة');
      body.append(info);
      if (g.k === 'gravel')
        body.append(el('p', 'sl note', 'الكونغلوميريت والبريشيا يتّفقان في الحجم ( أكبر من ' + L('2 mm') + ' ) ويختلفان في <b>الاستدارة</b> لا في الحجم — وهذا فرق يتكرّر في الأسئلة.'));
      else
        body.append(el('p', 'sl note', 'رتّب الأحجام من الأكبر إلى الأصغر : <b>حصباء ← رمل ← غرين ← طين</b> ، ولكلٍّ صخره. والحبيبة الأكبر <b>أثقل</b> فترسب أوّلًا في قاع الحوض.'));
    }
    mkbar(); draw();
  }

  /* ---------------- 5 · معالم الصخور الرسوبية ---------------- */
  const SM = {
    grade: { n: 'التطبّق المتدرّج', d: 'كلّما اتّجهنا إلى <b>أسفل</b> الطبقة ازداد حجم الحبيبات المكوّنة لها.', inf: 'تدرّج الترسيب في الحوض و<b>ترتيب الطبقات</b>.', q: 'أيّ الطبقات أقدم ؟ وكيف تدرّج الترسيب ؟' },
    fossil: { n: 'المحتوى الأحفوري', d: '<b>بقايا وآثار</b> لكائنات حية عاشت فيما مضى.', inf: '<b>تاريخ الطبقات الجيولوجي</b> والبيئة والمناخ السائدان وقت تكوّنها.', q: 'متى تكوّنت الطبقة ؟ وما مناخها ؟' },
    ripple: { n: 'علامات النيم', d: '<b>تموّجات صغيرة</b> تكوّنت بفعل مياه الأنهار أو الأمواج أو الرياح.', inf: 'أنّ البيئة <b>نهرية أو بحرية شاطئية</b> ، و<b>اتّجاه التيار</b> الناقل.', q: 'أكان هناك ماء متحرّك ؟ وفي أيّ اتّجاه ؟' },
    mud: { n: 'التشقّقات الطينية', d: 'تشقّقات تنتج عند <b>جفاف</b> الرسوبيات الطينية وتكمّش معادنها.', inf: '<b>تعرّض الرسوبيات للجفاف</b>.', q: 'هل جفّ الحوض ؟' }
  };

  function sedmark(host) {
    host.innerHTML = '';
    const S = { k: 'grade' };
    const bar = el('div', 'srow'), body = el('div');
    host.append(bar, body);

    function mkbar() { bar.innerHTML = ''; }

    function svg(k) {
      const W = 190, H = 120;
      let s = '<svg viewBox="0 0 ' + W + ' ' + H + '" width="' + W + '" height="' + H + '" aria-hidden="true">';
      s += '<rect x="1" y="1" width="' + (W - 2) + '" height="' + (H - 2) + '" rx="10" fill="#F5F2EC" stroke="#e3e8ef"/>';
      let seed = 23; const rnd = () => { seed = (seed * 1103515245 + 12345) % 2147483648; return seed / 2147483648; };
      if (k === 'grade') {
        for (let y = 12; y < H - 6; y += 10) {
          const r = 0.9 + 4.4 * ((y - 12) / (H - 22));
          for (let x = 10; x < W - 6; x += Math.max(r * 2.4, 4))
            s += '<circle cx="' + x.toFixed(1) + '" cy="' + y + '" r="' + (r * (0.8 + 0.4 * rnd())).toFixed(1) + '" fill="#C0AC8C" stroke="#6B5B43" stroke-width="0.4"/>';
        }
        s += '<line x1="176" y1="14" x2="176" y2="' + (H - 10) + '" stroke="#1F3A5F" stroke-width="1.4" marker-end=""/>';
        s += '<polygon points="176,' + (H - 6) + ' 173,' + (H - 13) + ' 179,' + (H - 13) + '" fill="#1F3A5F"/>';
      } else if (k === 'ripple') {
        for (let r = 0; r < 4; r++) {
          let d = 'M8 ' + (28 + r * 24);
          for (let x = 8; x < W - 8; x += 24) d += ' q 12 -11 24 0';
          s += '<path d="' + d + '" fill="none" stroke="#7E97B6" stroke-width="3" stroke-linecap="round"/>';
        }
        s += '<path d="M150 14 L172 14 M166 9 L172 14 L166 19" stroke="#1F3A5F" stroke-width="2" fill="none" stroke-linecap="round"/>';
      } else if (k === 'mud') {
        s += '<rect x="8" y="8" width="' + (W - 16) + '" height="' + (H - 16) + '" rx="7" fill="#C9B89A"/>';
        const cx = [30, 72, 118, 160], cy = [32, 62, 94];
        cy.forEach((y, j) => cx.forEach((x, i) => {
          const pts = [];
          for (let a = 0; a < 6; a++) { const an = (a * 60 + rnd() * 22) * Math.PI / 180, q = 17 + rnd() * 5; pts.push((x + q * Math.cos(an)).toFixed(1) + ',' + (y + q * Math.sin(an) * 0.7).toFixed(1)); }
          s += '<polygon points="' + pts.join(' ') + '" fill="#D8C9AC" stroke="#6B5B43" stroke-width="1.6"/>';
        }));
      } else {
        s += '<rect x="8" y="8" width="' + (W - 16) + '" height="' + (H - 16) + '" rx="7" fill="#DCD2C0"/>';
        s += '<path d="M44 86 a26 26 0 1 1 26 -26 a20 20 0 0 0 -26 26 Z" fill="#E8E0D0" stroke="#6B5B43" stroke-width="1.6"/>';
        s += '<path d="M118 40 q22 8 34 30 q-18 16 -36 10 q-8 -22 2 -40 Z" fill="#E8E0D0" stroke="#6B5B43" stroke-width="1.6"/>';
        for (let i = 0; i < 5; i++) s += '<line x1="' + (120 + i * 7) + '" y1="46" x2="' + (128 + i * 7) + '" y2="76" stroke="#8C7B5F" stroke-width="1.1"/>';
      }
      return s + '</svg>';
    }

    function draw() {
      body.innerHTML = '';
      body.append(el('p', 'shint', 'المعالم تُميّز الصخور الرسوبية من غيرها ، ويقرأ منها الجيولوجي <b>بيئة الترسيب</b> . واضغط المَعلَم لترى ما يُستنتج منه.'));
      const cards = el('div', 'smcards');
      Object.keys(SM).forEach(k => {
        const c = el('button', 'smc' + (k === S.k ? ' smon' : ''), SM[k].n);
        c.onclick = () => { S.k = k; draw(); };
        cards.append(c);
      });
      body.append(cards);
      const m = SM[S.k];
      body.append(el('div', 'txwrap', svg(S.k)));
      const info = el('div', 'cyinfo');
      const row = (k, v) => info.append(el('div', 'cyrow', '<span class="cyk">' + k + '</span><span class="cyv">' + v + '</span>'));
      row('المَعلَم', '<b>' + m.n + '</b>');
      row('وصفه', m.d);
      row('ماذا يُستنتج منه ؟', m.inf);
      body.append(info);
      body.append(el('p', 'sl note', 'والسؤال الذي يُجيب عنه هذا المَعلَم : <b>' + m.q + '</b> — واحفظ لكلّ مَعلَم <b>استنتاجه</b> لا وصفه وحده ، فالسؤال في الاختبار عن الاستنتاج غالبًا.'));
    }
    mkbar(); draw();
  }

  /* ---------------- 6 · الصخور المتحوّلة : متورّقة وغير متورّقة ---------------- */
  const FO = {
    dir: { n: 'ضغط موجَّه غير متساوٍ', cls: 'متورّقة', meta: 'الإقليمي غالبًا', tex: 'المعادن على هيئة <b>طبقات رقيقة</b> ( تورّق )', min: 'معادن <b>متعدّدة</b> تتمايز فاتحة وغامقة', ex: 'الشيست والنايس' },
    conf: { n: 'ضغط محصور متساوٍ في الاتجاهات', cls: 'غير متورّقة', meta: 'التماسي غالبًا قرب اندفاعات الماغما', tex: 'بلورات <b>متساوية الحجم</b> من دون تورّق', min: 'يتكوّن غالبًا من <b>معدن واحد</b> فقط', ex: 'الرخام ( من الجيري ) والكوارتزيت ( من الرملي )' }
  };

  function foliate(host) {
    host.innerHTML = '';
    const S = { k: 'dir' };
    const bar = el('div', 'srow'), body = el('div');
    host.append(bar, body);

    function mkbar() {
      bar.innerHTML = '';
      bar.append(sel('نوع الضغط', S.k, Object.keys(FO).map(k => [k, FO[k].n]), v => { S.k = v; draw(); }));
    }

    function svg(k) {
      const W = 190, H = 130;
      let seed = 31; const rnd = () => { seed = (seed * 1103515245 + 12345) % 2147483648; return seed / 2147483648; };
      let s = '<svg viewBox="0 0 ' + W + ' ' + H + '" width="' + W + '" height="' + H + '" aria-hidden="true">';
      s += '<rect x="22" y="18" width="' + (W - 44) + '" height="' + (H - 36) + '" rx="8" fill="#EEF1F6" stroke="#5b6b80" stroke-width="1.3"/>';
      if (k === 'dir') {
        for (let y = 28; y < H - 20; y += 11) {
          const dark = ((y / 11) | 0) % 2 === 0;
          for (let x = 30; x < W - 28; x += 13)
            s += '<ellipse cx="' + x + '" cy="' + y + '" rx="6" ry="2.4" fill="' + (dark ? '#6B7C92' : '#C7D2E0') + '" stroke="#5b6b80" stroke-width="0.5"/>';
        }
        /* سهما الضغط من أعلى وأسفل */
        [[0, 1], [H, -1]].forEach(a => {
          const y0 = a[0] === 0 ? 2 : H - 2, d = a[1];
          [60, 95, 130].forEach(x => { s += '<path d="M' + x + ' ' + y0 + ' L' + x + ' ' + (y0 + 13 * d) + ' M' + (x - 4) + ' ' + (y0 + 8 * d) + ' L' + x + ' ' + (y0 + 13 * d) + ' L' + (x + 4) + ' ' + (y0 + 8 * d) + '" stroke="#B3261E" stroke-width="2" fill="none" stroke-linecap="round"/>'; });
        });
      } else {
        for (let y = 30; y < H - 20; y += 15) for (let x = 32; x < W - 28; x += 15)
          s += '<rect x="' + (x - 6) + '" y="' + (y - 6) + '" width="12" height="12" rx="2" fill="#C7D2E0" stroke="#5b6b80" stroke-width="0.6"/>';
        /* أسهم من الجهات الأربع */
        [[95, 2, 0, 1], [95, H - 2, 0, -1], [2, 70, 1, 0], [W - 2, 70, -1, 0]].forEach(a => {
          const x = a[0], y = a[1], dx = a[2], dy = a[3];
          s += '<path d="M' + x + ' ' + y + ' L' + (x + 13 * dx) + ' ' + (y + 13 * dy) + '" stroke="#B3261E" stroke-width="2" stroke-linecap="round"/>';
          s += '<path d="M' + (x + 8 * dx - 4 * dy) + ' ' + (y + 8 * dy - 4 * dx) + ' L' + (x + 13 * dx) + ' ' + (y + 13 * dy) + ' L' + (x + 8 * dx + 4 * dy) + ' ' + (y + 8 * dy + 4 * dx) + '" stroke="#B3261E" stroke-width="2" fill="none" stroke-linecap="round"/>';
        });
      }
      return s + '</svg>';
    }

    function draw() {
      body.innerHTML = '';
      const f = FO[S.k];
      body.append(el('p', 'shint', 'الأسهم الحمراء اتّجاه الضغط ، والأشكال الداخلية معادن الصخر . اختبر الصخر بسؤال واحد : <b>هل فيه طبقات ؟</b>'));
      body.append(el('div', 'txwrap', svg(S.k)));
      const info = el('div', 'cyinfo');
      const row = (k, v) => info.append(el('div', 'cyrow', '<span class="cyk">' + k + '</span><span class="cyv">' + v + '</span>'));
      row('التصنيف', '<b>' + f.cls + '</b>');
      row('نوع الضغط', f.n);
      row('التحوّل المرافق', f.meta);
      row('النسيج', f.tex);
      row('التركيب المعدني', f.min);
      row('أمثلة', '<b>' + f.ex + '</b>');
      body.append(info);
      body.append(el('p', 'sl note', S.k === 'dir'
        ? 'الضغط <b>الموجَّه</b> يرصّ المعادن في طبقات عمودية على اتّجاهه ، فينشأ <b>التورّق</b> . والتورّق مرتبط <b>باتّجاه</b> الضغط لا بشدّته.'
        : 'الضغط <b>المحصور المتساوي</b> لا يُفضّل اتّجاهًا ، فتنمو البلورات متساوية بلا تورّق . ولأنّ الصخر غالبًا من <b>معدن واحد</b> فلا يتمايز إلى شرائط أصلًا.'));
    }
    mkbar(); draw();
  }

  window.SIMS.rockcycle = rockcycle;
  window.SIMS.texture = texture;
  window.SIMS.silica = silica;
  window.SIMS.grain = grain;
  window.SIMS.sedmark = sedmark;
  window.SIMS.foliate = foliate;
})();

/* ===== محاكاة الجدول الدوري ( علوم الثامن — الوحدة الثانية ) ===== */
(function () {
  const el = (t, c, h) => { const e = document.createElement(t); if (c) e.className = c; if (h !== undefined) e.innerHTML = h; return e; };
  const btn = (txt, cls, fn) => { const b = el('button', 'sb ' + (cls || ''), txt); b.onclick = fn; return b; };
  const L = s => '<span class="ltr">' + s + '</span>';

  /* العناصر العشرون الأولى : الرمز · الاسم · التوزيع */
  const PT = [
    ['H', 'الهيدروجين', [1]], ['He', 'الهيليوم', [2]],
    ['Li', 'الليثيوم', [2, 1]], ['Be', 'البريليوم', [2, 2]], ['B', 'البورون', [2, 3]],
    ['C', 'الكربون', [2, 4]], ['N', 'النيتروجين', [2, 5]], ['O', 'الأكسجين', [2, 6]],
    ['F', 'الفلور', [2, 7]], ['Ne', 'النيون', [2, 8]],
    ['Na', 'الصوديوم', [2, 8, 1]], ['Mg', 'المغنيسيوم', [2, 8, 2]], ['Al', 'الألمنيوم', [2, 8, 3]],
    ['Si', 'السيليكون', [2, 8, 4]], ['P', 'الفسفور', [2, 8, 5]], ['S', 'الكبريت', [2, 8, 6]],
    ['Cl', 'الكلور', [2, 8, 7]], ['Ar', 'الأرغون', [2, 8, 8]],
    ['K', 'البوتاسيوم', [2, 8, 8, 1]], ['Ca', 'الكالسيوم', [2, 8, 8, 2]]
  ];
  /* رقم المجموعة بالترقيم الثماني عشري */
  /* الهيليوم تكافؤه اثنان لكنّ مستواه الأول ممتلئ ، فموضعه المجموعة 18 مع الغازات النبيلة */
  const g18 = (c, z) => (z === 2 ? 18 : c[c.length - 1] <= 2 ? c[c.length - 1] : c[c.length - 1] + 10);
  const per = c => c.length;
  /* الأعمدة المعروضة : 1 · 2 · فراغ العناصر الانتقالية · 13..18 */
  const COLS = [1, 2, 13, 14, 15, 16, 17, 18];

  function ptable18(host) {
    host.innerHTML = '';
    const S = { z: 17, mode: 'grp' };
    const bar = el('div', 'srow'), body = el('div');
    host.append(bar, body);

    function mkbar() {
      bar.innerHTML = '';
      bar.append(btn('تلوين بالمجموعة', S.mode === 'grp' ? 'go' : 'gh', () => { S.mode = 'grp'; mkbar(); draw(); }));
      bar.append(btn('تلوين بالدورة', S.mode === 'per' ? 'go' : 'gh', () => { S.mode = 'per'; mkbar(); draw(); }));
      bar.append(btn('إبراز الغازات النبيلة', S.mode === 'nob' ? 'go' : 'gh', () => { S.mode = 'nob'; mkbar(); draw(); }));
    }

    const GCOL = { 1: '#D9E3F0', 2: '#CFE0D6', 13: '#F0E3CF', 14: '#E8DCEF', 15: '#DCE9F2', 16: '#F2DEDC', 17: '#E6EFD6', 18: '#F5E4C8' };
    const PCOL = { 1: '#E9EEF5', 2: '#D7E2EF', 3: '#C2D2E6', 4: '#AEC2DC' };

    function draw() {
      body.innerHTML = '';
      body.append(el('p', 'shint', 'العناصر العشرون الأولى في موضعها من الجدول . عمود العناصر الانتقالية ( من <span class="ltr">3</span> إلى <span class="ltr">12</span> ) محذوف هنا لأنّه يبدأ بعد الكالسيوم . اضغط أيّ عنصر.'));
      const grid = el('div', 'ptg');
      const hd = el('div', 'ptgr');
      hd.append(el('span', 'ptgl', ''));
      COLS.forEach(g => hd.append(el('span', 'ptgh' + (g === 13 ? ' ptgap' : ''), String(g))));
      grid.append(hd);
      for (let p = 1; p <= 4; p++) {
        const row = el('div', 'ptgr');
        row.append(el('span', 'ptgl', String(p)));
        COLS.forEach(g => {
          const idx = PT.findIndex((e, i) => per(e[2]) === p && g18(e[2], i + 1) === g);
          if (idx < 0) { row.append(el('span', 'ptgc ptgempty' + (g === 13 ? ' ptgap' : ''), '')); return; }
          const e = PT[idx], z = idx + 1;
          const on = z === S.z;
          const noble = g18(e[2], z) === 18;
          let bg = '#fff';
          if (S.mode === 'grp') bg = GCOL[g];
          else if (S.mode === 'per') bg = PCOL[p];
          else if (S.mode === 'nob') bg = noble ? '#F5E4C8' : '#F5F7FA';
          const c = el('button', 'ptgc' + (on ? ' ptgon' : '') + (g === 13 ? ' ptgap' : ''),
            '<i>' + z + '</i><b>' + e[0] + '</b>');
          c.style.background = on ? '' : bg;
          c.onclick = () => { S.z = z; draw(); };
          row.append(c);
        });
        grid.append(row);
      }
      body.append(el('div', 'ptgwrap', ''));
      body.lastChild.append(grid);

      const e = PT[S.z - 1], c = e[2];
      const info = el('div', 'cyinfo');
      const row = (k, v) => info.append(el('div', 'cyrow', '<span class="cyk">' + k + '</span><span class="cyv">' + v + '</span>'));
      row('العنصر', '<b>' + e[1] + '</b> ' + L(e[0]) + ' · العدد الذرّي ' + L(S.z));
      row('التوزيع الإلكتروني', L(c.join(' , ')) + ' · التحقّق ' + L(c.join(' + ') + ' = ' + c.reduce((a, b) => a + b, 0)));
      row('الدورة', '<b>' + per(c) + '</b> — عدد مستويات الطاقة');
      const v = c[c.length - 1];
      row('إلكترونات التكافؤ', '<b>' + v + '</b> — إلكترونات المستوى الخارجي');
      row('المجموعة', '<b>' + g18(c, S.z) + '</b>' + (S.z === 2 ? ' — الهيليوم تكافؤه اثنان ، لكنّ مستواه الأول <b>ممتلئ</b> بهما فهو مستقرّ ، وموضعه مع <b>الغازات النبيلة</b>'
        : v > 2 ? ' — لأنّها من المجموعات ' + L('13 – 18') + ' فرقمها = التكافؤ ' + L('+ 10') + ' أي ' + L(v + ' + 10')
          : ' — لأنّها من المجموعتين ' + L('1') + ' و ' + L('2') + ' فرقمها = التكافؤ نفسه'));
      body.append(info);

      if (g18(c, S.z) === 18) body.append(el('div', 'sl ok', '<b>غاز نبيل</b> : مستواه الخارجي ' + (S.z === 2 ? '<b>ممتلئ</b> بإلكترونين ، لأنّ المستوى الأول لا يتّسع لأكثر منهما' : 'فيه <b>ثمانية</b> إلكترونات') + ' ، فهو مستقرّ لا يميل إلى التفاعل.'));
      else if (v === 4) body.append(el('div', 'sl note', 'تكافؤه <b>أربعة</b> — في منتصف الطريق ، <b>ففقد أربعة كاكتساب أربعة</b> . ولهذا لا يميل إلى تكوين أيون بسيط ، بل إلى <b>مشاركة</b> إلكتروناته ، وهي الطريق الثالث إلى الاستقرار.'));
      else if (v < 4) body.append(el('div', 'sl', 'تكافؤه <b>' + v + '</b> ، <b>ففقدها أيسر</b> من كسب ' + L(8 - v) + ' ← يكوّن أيونًا <b>موجبًا</b> شحنته ' + L(v + '+') + ' .'));
      else body.append(el('div', 'sl', 'تكافؤه <b>' + v + '</b> ، <b>فاكتساب</b> ' + L(8 - v) + ' أيسر من فقد ' + L(v) + ' ← يكوّن أيونًا <b>سالبًا</b> شحنته ' + L((8 - v) + '−') + ' .'));

      body.append(el('p', 'sl note', 'انظر إلى الجدول في اتّجاهين : <b>أفقيًّا</b> تزداد الإلكترونات واحدًا واحدًا حتى تنتهي الدورة بغاز نبيل ، و<b>رأسيًّا</b> تتشابه عناصر العمود لأنّ إلكترونات تكافؤها واحدة.'));
    }
    mkbar(); draw();
  }

  window.SIMS.ptable18 = ptable18;
})();

/* ===== محاكاة الحركة والقوى ( فيزياء العاشر — الوحدة الثانية ) ===== */
(function () {
  const el = (t, c, h) => { const e = document.createElement(t); if (c) e.className = c; if (h !== undefined) e.innerHTML = h; return e; };
  const btn = (txt, cls, fn) => { const b = el('button', 'sb ' + (cls || ''), txt); b.onclick = fn; return b; };
  const L = s => '<span class="ltr">' + s + '</span>';
  const sel = (lab, val, opts, fn) => {
    const w = el('label', 'sf'); w.append(el('span', '', lab));
    const s = document.createElement('select');
    opts.forEach(o => { const p = document.createElement('option'); p.value = o[0]; p.textContent = o[1]; if (o[0] == val) p.selected = true; s.append(p); });
    s.onchange = () => fn(s.value); w.append(s); return w;
  };
  const sld = (lab, val, lo, hi, step, fn) => {
    const w = el('label', 'sf'); const sp = el('span', '', lab);
    w.append(sp);
    const r = document.createElement('input');
    r.type = 'range'; r.min = lo; r.max = hi; r.step = step; r.value = val;
    r.oninput = () => fn(+r.value, sp);
    w.append(r); return w;
  };
  const n2 = v => (Math.round(v * 100) / 100);

  /* ---------------- 1 · المسافة والإزاحة ---------------- */
  function disp(host) {
    host.innerHTML = '';
    const S = { legs: [2, 5, -4], add: 3 };
    const bar = el('div', 'srow'), body = el('div');
    host.append(bar, body);

    function mkbar() {
      bar.innerHTML = '';
      bar.append(btn('مثال الكتاب', 'gh', () => { S.legs = [2, 5, -4]; mkbar(); draw(); }));
      bar.append(btn('ذهاب وعودة', 'gh', () => { S.legs = [0, 6, 0]; mkbar(); draw(); }));
      bar.append(btn('اتّجاه واحد', 'gh', () => { S.legs = [-5, 0, 4]; mkbar(); draw(); }));
      const r2 = el('div', 'srow');
      S.legs.forEach((v, i) => {
        r2.append(sld((i ? 'الموقع ' + (i + 1) : 'الموقع الابتدائي') + ' : ' + L(v + ' m'), v, -8, 8, 1, (nv, sp) => {
          S.legs[i] = nv; sp.innerHTML = (i ? 'الموقع ' + (i + 1) : 'الموقع الابتدائي') + ' : ' + L(nv + ' m'); draw();
        }));
      });
      bar.append(r2);
    }

    function draw() {
      body.innerHTML = '';
      const P = S.legs, W = 300, H = 112, pad = 18;
      const x2p = v => pad + (v + 8) / 16 * (W - 2 * pad);
      let s = '<svg viewBox="0 0 ' + W + ' ' + H + '" width="100%" height="' + H + '" preserveAspectRatio="xMidYMid meet" aria-hidden="true">';
      s += '<line x1="' + pad + '" y1="70" x2="' + (W - pad) + '" y2="70" stroke="#8894a6" stroke-width="1.4"/>';
      for (let v = -8; v <= 8; v += 2) {
        s += '<line x1="' + x2p(v) + '" y1="66" x2="' + x2p(v) + '" y2="74" stroke="#8894a6" stroke-width="1"/>';
        s += '<text x="' + x2p(v) + '" y="88" direction="ltr" text-anchor="middle" font-size="9" fill="#8894a6">' + v + '</text>';
      }
      s += '<circle cx="' + x2p(0) + '" cy="70" r="3" fill="#8894a6"/>';
      /* أقواس المسار */
      const cols = ['#7E97B6', '#C9A227'];
      for (let i = 0; i < P.length - 1; i++) {
        const a = x2p(P[i]), b = x2p(P[i + 1]), mid = (a + b) / 2, up = 70 - 16 - i * 14;
        s += '<path d="M' + a + ' 68 Q' + mid + ' ' + up + ' ' + b + ' 68" fill="none" stroke="' + cols[i % 2] + '" stroke-width="2.2"/>';
        s += '<polygon points="' + b + ',68 ' + (b + (b > a ? -5 : 5)) + ',' + (up < 54 ? 62 : 62) + ' ' + (b + (b > a ? -5 : 5)) + ',' + 74 + '" fill="' + cols[i % 2] + '" opacity="0.85"/>';
      }
      /* سهم الإزاحة */
      const a0 = x2p(P[0]), aN = x2p(P[P.length - 1]);
      s += '<line x1="' + a0 + '" y1="100" x2="' + aN + '" y2="100" stroke="#B3261E" stroke-width="2.6"/>';
      if (Math.abs(aN - a0) > 4) {
        const d = aN > a0 ? -6 : 6;
        s += '<polygon points="' + aN + ',100 ' + (aN + d) + ',96 ' + (aN + d) + ',104" fill="#B3261E"/>';
      } else s += '<circle cx="' + aN + '" cy="100" r="3.5" fill="#B3261E"/>';
      s += '<circle cx="' + a0 + '" cy="70" r="4.5" fill="#2F6B3A"/>';
      s += '<circle cx="' + aN + '" cy="70" r="4.5" fill="#B3261E"/>';
      s += '</svg>';
      body.append(el('p', 'shint', 'الأقواس الزرقاء والذهبية هي <b>المسار الفعلي</b> ( المسافة ) ، والسهم الأحمر أسفلُ هو <b>الإزاحة</b> من البداية إلى النهاية.'));
      body.append(el('div', 'dpw', s));
      let dist = 0;
      const parts = [];
      for (let i = 0; i < P.length - 1; i++) { const d = Math.abs(P[i + 1] - P[i]); dist += d; parts.push(d); }
      const disp = P[P.length - 1] - P[0];
      const info = el('div', 'cyinfo');
      const row = (k, v) => info.append(el('div', 'cyrow', '<span class="cyk">' + k + '</span><span class="cyv">' + v + '</span>'));
      row('الإزاحة', L('Δx = ' + P[P.length - 1] + ' − (' + P[0] + ') = ' + disp + ' m') + (disp ? ' — في الاتجاه ' + (disp > 0 ? '<b>الموجب</b>' : '<b>السالب</b>') : ' — <b>صفر</b> : رجع من حيث بدأ'));
      row('المسافة', L('S = ' + parts.join(' + ') + ' = ' + dist + ' m'));
      body.append(info);
      if (disp === 0 && dist > 0) body.append(el('div', 'sl note', 'الإزاحة <b>صفر</b> والمسافة <b>' + dist + ' m</b> — والصفر هنا لا يعني أنّه لم يتحرّك ، بل أنّه <b>عاد إلى نقطة البداية</b>. وسرعته المتّجهة المتوسطة ستكون صفرًا كذلك ، وقياسيته لا.'));
      else if (dist === Math.abs(disp)) body.append(el('div', 'sl ok', 'تساوى المقداران — وهذا لا يقع إلّا إذا تحرّك الجسم في <b>اتّجاه واحد من غير رجوع</b>.'));
      else body.append(el('div', 'sl note', 'المسافة <b>' + dist + ' m</b> أكبر من مقدار الإزاحة <b>' + Math.abs(disp) + ' m</b> ، لأنّ كلّ رجوع يزيد المسار ولا يزيد السهم. و<b>المسافة لا تقلّ عن مقدار الإزاحة أبدًا</b>.'));
    }
    mkbar(); draw();
  }

  /* ---------------- 2 · إشارتا السرعة والتسارع ---------------- */
  function accsign(host) {
    host.innerHTML = '';
    const S = { v: 10, a: -3 };
    const bar = el('div', 'srow'), body = el('div');
    host.append(bar, body);
    function mkbar() {
      bar.innerHTML = '';
      bar.append(sld('السرعة : ' + L(S.v + ' m/s'), S.v, -15, 15, 1, (v, sp) => { S.v = v; sp.innerHTML = 'السرعة : ' + L(v + ' m/s'); draw(); }));
      const r2 = el('div', 'srow');
      r2.append(sld('التسارع : ' + L(S.a + ' m/s²'), S.a, -6, 6, 1, (v, sp) => { S.a = v; sp.innerHTML = 'التسارع : ' + L(v + ' m/s²'); draw(); }));
      bar.append(r2);
    }
    function draw() {
      body.innerHTML = '';
      const v = S.v, a = S.a;
      const W = 290, H = 96;
      const cx = W / 2;
      let s = '<svg viewBox="0 0 ' + W + ' ' + H + '" width="100%" height="' + H + '" preserveAspectRatio="xMidYMid meet" aria-hidden="true">';
      s += '<line x1="12" y1="78" x2="' + (W - 12) + '" y2="78" stroke="#c3ccd8" stroke-width="1.2"/>';
      s += '<rect x="' + (cx - 16) + '" y="56" width="32" height="18" rx="3" fill="#E8EEF6" stroke="#1F3A5F" stroke-width="1.4"/>';
      const arrow = (y, val, col, lab, scale) => {
        if (!val) return '<text x="' + cx + '" y="' + (y + 4) + '" text-anchor="middle" font-size="10" fill="#8894a6">' + lab + ' = 0</text>';
        const len = Math.min(Math.abs(val) * scale, 110), dir = val > 0 ? 1 : -1;
        const x1 = cx, x2 = cx + dir * len;
        return '<line x1="' + x1 + '" y1="' + y + '" x2="' + x2 + '" y2="' + y + '" stroke="' + col + '" stroke-width="3"/>'
          + '<polygon points="' + x2 + ',' + y + ' ' + (x2 - dir * 7) + ',' + (y - 4.5) + ' ' + (x2 - dir * 7) + ',' + (y + 4.5) + '" fill="' + col + '"/>'
          + '<text x="' + (x1 + dir * len / 2) + '" y="' + (y - 7) + '" text-anchor="middle" font-size="10" fill="' + col + '">' + lab + '</text>';
      };
      s += arrow(34, v, '#1F3A5F', 'v', 6);
      s += arrow(92, a, '#B3261E', 'a', 15);
      s += '</svg>';
      body.append(el('p', 'shint', 'السهم الأزرق <b>السرعة</b> والأحمر <b>التسارع</b> . وانظر : هل يشيران إلى الجهة نفسها ؟'));
      body.append(el('div', 'dpw', s));
      let verdict, cls, why;
      if (a === 0) { verdict = v === 0 ? 'ساكن' : 'حركة منتظمة'; cls = 'ok'; why = 'التسارع <b>صفر</b> ، فالسرعة المتّجهة ثابتة لا تتغيّر.'; }
      else if (v === 0) { verdict = 'يبدأ الحركة الآن'; cls = ''; why = 'السرعة صفر والتسارع لا يساوي صفرًا ، فسيتحرّك الجسم في اتجاه <b>التسارع</b> وتزداد سرعته.'; }
      else if ((v > 0) === (a > 0)) { verdict = 'متسارعة في الاتجاه ' + (v > 0 ? 'الموجب' : 'السالب'); cls = 'ok'; why = 'الإشارتان <b>متشابهتان</b> ( ' + (v > 0 ? 'كلتاهما موجبة' : 'كلتاهما سالبة') + ' ) ← التسارع في اتجاه الحركة <b>فيدفعها</b> ، فتزداد السرعة.'; }
      else { verdict = 'متباطئة'; cls = 'warnl'; why = 'الإشارتان <b>مختلفتان</b> ← التسارع عكس اتجاه الحركة <b>فيكبحها</b> ، فتقلّ السرعة.'; }
      body.append(el('div', 'acv' + (cls === 'ok' ? ' acok' : cls === 'warnl' ? ' acwarn' : ''), '<b>' + verdict + '</b><span>' + why + '</span>'));
      if (a < 0 && v < 0) body.append(el('div', 'sl note', 'انتبه : التسارع <b>سالب</b> والحركة <b>متسارعة</b> — فالسالب لا يعني التباطؤ. جرّب أن تجعل السرعة موجبة والتسارع كما هو لترى الفرق.'));
      const tbl = el('div', 'mgtab');
      const hd = el('div', 'mgtr mghd');
      ['السرعة', 'التسارع', 'الوصف'].forEach(x => hd.append(el('span', 'mgtc', x)));
      tbl.append(hd);
      [['+', '+', 'متسارعة في الاتجاه الموجب'], ['−', '−', 'متسارعة في الاتجاه السالب'],
       ['+', '−', 'متباطئة'], ['−', '+', 'متباطئة'], ['أيّ إشارة', 'صفر', 'منتظمة']].forEach(r => {
        const on = (r[0] === (v > 0 ? '+' : '−') && r[1] === (a > 0 ? '+' : '−')) || (r[1] === 'صفر' && a === 0);
        const tr = el('div', 'mgtr' + (on ? ' acon' : ''));
        r.forEach(c => tr.append(el('span', 'mgtc', c)));
        tbl.append(tr);
      });
      const w = el('div', 'mgwrap', ''); w.append(tbl); body.append(w);
    }
    mkbar(); draw();
  }

  /* ---------------- 3 · منحنيا الحركة ---------------- */
  const KG = {
    rest: { n: 'جسم ساكن', seg: [[0, 0], [10, 0]] },
    const: { n: 'سرعة ثابتة موجبة', seg: [[0, 6], [10, 6]] },
    acc: { n: 'تسارع منتظم من السكون', seg: [[0, 0], [10, 12]] },
    dec: { n: 'تباطؤ حتى التوقّف', seg: [[0, 12], [10, 0]] },
    mix: { n: 'تسارع ثمّ سرعة ثابتة', seg: [[0, 0], [4, 12], [10, 12]] },
    back: { n: 'حركة ثمّ رجوع', seg: [[0, 8], [5, 0], [10, -8]] }
  };

  function kgraph(host) {
    host.innerHTML = '';
    const S = { k: 'mix', mode: 'v' };
    const bar = el('div', 'srow'), body = el('div');
    host.append(bar, body);
    function mkbar() {
      bar.innerHTML = '';
      bar.append(sel('الحالة', S.k, Object.keys(KG).map(k => [k, KG[k].n]), v => { S.k = v; draw(); }));
      const r2 = el('div', 'srow');
      r2.append(sel('المنحنى', S.mode, [['v', 'السرعة – الزمن'], ['x', 'الموقع – الزمن']], v => { S.mode = v; draw(); }));
      bar.append(r2);
    }
    /* تحويل منحنى السرعة إلى منحنى الموقع بالتكامل التقريبي */
    function toPos(seg) {
      const out = [[0, 0]];
      let x = 0;
      for (let i = 0; i < seg.length - 1; i++) {
        const [t1, v1] = seg[i], [t2, v2] = seg[i + 1], n = 12;
        for (let k = 1; k <= n; k++) {
          const f = k / n, t = t1 + (t2 - t1) * f;
          const va = v1 + (v2 - v1) * (f - 1 / n / 2);
          x += va * (t2 - t1) / n;
          out.push([t, x]);
        }
      }
      return out;
    }
    function draw() {
      body.innerHTML = '';
      const g = KG[S.k];
      const pts = S.mode === 'v' ? g.seg : toPos(g.seg);
      const W = 300, H = 190, L0 = 34, R = 10, T = 12, B = 30;
      const ys = pts.map(p => p[1]);
      let lo = Math.min(0, ...ys), hi = Math.max(0, ...ys);
      if (hi === lo) hi = lo + 1;
      const pad = (hi - lo) * 0.12; lo -= pad; hi += pad;
      const X = t => L0 + t / 10 * (W - L0 - R);
      const Y = v => H - B - (v - lo) / (hi - lo) * (H - T - B);
      let s = '<svg viewBox="0 0 ' + W + ' ' + H + '" width="100%" height="' + H + '" preserveAspectRatio="xMidYMid meet" aria-hidden="true">';
      /* مساحة تحت المنحنى في منحنى السرعة */
      if (S.mode === 'v') {
        let d = 'M' + X(pts[0][0]) + ' ' + Y(0);
        pts.forEach(p => d += ' L' + X(p[0]) + ' ' + Y(p[1]));
        d += ' L' + X(pts[pts.length - 1][0]) + ' ' + Y(0) + ' Z';
        s += '<path d="' + d + '" fill="#7E97B6" opacity="0.28"/>';
      }
      s += '<line x1="' + L0 + '" y1="' + Y(0) + '" x2="' + (W - R) + '" y2="' + Y(0) + '" stroke="#8894a6" stroke-width="1.2"/>';
      s += '<line x1="' + L0 + '" y1="' + T + '" x2="' + L0 + '" y2="' + (H - B) + '" stroke="#8894a6" stroke-width="1.2"/>';
      let d2 = '';
      pts.forEach((p, i) => d2 += (i ? ' L' : 'M') + X(p[0]) + ' ' + Y(p[1]));
      s += '<path d="' + d2 + '" fill="none" stroke="#1F3A5F" stroke-width="2.6"/>';
      [0, 5, 10].forEach(t => s += '<text x="' + X(t) + '" y="' + (H - B + 14) + '" direction="ltr" text-anchor="middle" font-size="9" fill="#8894a6">' + t + '</text>');
      [lo, 0, hi].forEach(v => s += '<text x="' + (L0 - 5) + '" y="' + (Y(v) + 3) + '" direction="ltr" text-anchor="end" font-size="9" fill="#8894a6">' + n2(v) + '</text>');
      s += '</svg>';
      body.append(el('div', 'kgax', '<span>' + (S.mode === 'v' ? 'السرعة ' + L('m/s') : 'الموقع ' + L('m')) + '</span><i>الزمن ' + L('s') + '</i>'));
      body.append(el('div', 'dpw', s));
      const info = el('div', 'cyinfo');
      const row = (k, v) => info.append(el('div', 'cyrow', '<span class="cyk">' + k + '</span><span class="cyv">' + v + '</span>'));
      if (S.mode === 'v') {
        const segs = [];
        for (let i = 0; i < g.seg.length - 1; i++) {
          const [t1, v1] = g.seg[i], [t2, v2] = g.seg[i + 1];
          const a = (v2 - v1) / (t2 - t1), ar = (v1 + v2) / 2 * (t2 - t1);
          segs.push({ t1, t2, a, ar, v1, v2 });
        }
        row('ميل المنحنى يمثّل', '<b>التسارع</b>');
        row('المساحة تحته تمثّل', '<b>الإزاحة</b>');
        segs.forEach((x, i) => row('المرحلة ' + (i + 1) + ' ' + L('(' + x.t1 + '–' + x.t2 + ' s)'),
          'التسارع = الميل = ' + L('(' + x.v2 + ' − ' + x.v1 + ') / ' + (x.t2 - x.t1) + ' = ' + n2(x.a) + ' m/s²')
          + ' · الإزاحة = المساحة = ' + L(n2(x.ar) + ' m')));
        const tot = segs.reduce((p, c) => p + c.ar, 0);
        row('الإزاحة الكلّية', '<b>' + L(n2(tot) + ' m') + '</b>');
        if (segs.some(x => x.a === 0)) body.append(el('div', 'sl note', 'الجزء <b>الأفقي</b> هنا تسارعه <b>صفر</b> ← حركة <b>منتظمة</b> . ولاحظ أنّ الخطّ الأفقي نفسه في منحنى <b>الموقع</b> يعني <b>السكون</b> — فاقرأ عنوان المحور الرأسي قبل أن تحكم.'));
        if (tot < 0 || segs.some(x => x.ar < 0)) body.append(el('div', 'sl note', 'جزء من المنحنى <b>تحت المحور</b> ، فمساحته <b>سالبة</b> والإزاحة فيه في الاتجاه السالب — وهذا ما يجعل الإزاحة الكلّية أقلّ من المسافة.'));
      } else {
        row('ميل المنحنى يمثّل', '<b>السرعة المتّجهة</b>');
        row('المساحة تحته', '<b>لا معنى لها</b> في هذا المنحنى');
        const x0 = pts[0][1], xn = pts[pts.length - 1][1];
        row('الإزاحة الكلّية', L(n2(xn) + ' − ' + n2(x0) + ' = ' + n2(xn - x0) + ' m') + ' — تُقرأ من <b>الفرق بين الطرفين</b> لا من المساحة');
        if (S.k === 'rest') body.append(el('div', 'sl note', 'المنحنى <b>خطّ أفقي</b> في منحنى الموقع ← الميل صفر ← السرعة صفر ← الجسم <b>ساكن</b>.'));
        else if (S.k === 'const') body.append(el('div', 'sl ok', 'المنحنى <b>خطّ مستقيم مائل</b> ← ميله ثابت ← <b>سرعة ثابتة</b> ، وهي الحركة المنتظمة.'));
        else body.append(el('div', 'sl note', 'المنحنى <b>منحنٍ لا مستقيم</b> ← ميله يتغيّر ← السرعة تتغيّر ← يوجد <b>تسارع</b>.'));
      }
      body.append(info);
    }
    mkbar(); draw();
  }

  /* ---------------- 4 · اختيار معادلة الحركة ---------------- */
  const EQV = [['vi', 'السرعة الابتدائية ' + L('v<sub>i</sub>')], ['vf', 'السرعة النهائية ' + L('v<sub>f</sub>')],
               ['a', 'التسارع ' + L('a')], ['t', 'الزمن ' + L('t')], ['dx', 'الإزاحة ' + L('Δx')]];
  const EQS = [
    { n: 'الأولى', f: 'v<sub>f</sub> = v<sub>i</sub> + a t', has: ['vf', 'vi', 'a', 't'], miss: 'dx', lab: 'بلا إزاحة' },
    { n: 'الثانية', f: 'Δx = v<sub>i</sub> t + ½ a t²', has: ['dx', 'vi', 'a', 't'], miss: 'vf', lab: 'بلا سرعة نهائية' },
    { n: 'الثالثة', f: 'v<sub>f</sub>² = v<sub>i</sub>² + 2 a Δx', has: ['vf', 'vi', 'a', 'dx'], miss: 't', lab: 'بلا زمن' }
  ];

  function kineq(host) {
    host.innerHTML = '';
    const S = { known: { vi: 1, a: 1, dx: 1 }, want: 'vf' };
    const bar = el('div', 'srow'), body = el('div');
    host.append(bar, body);
    function mkbar() {
      bar.innerHTML = '';
      bar.append(btn('مثال : ينطلق من السكون ويقطع مسافة', 'gh', () => { S.known = { vi: 1, a: 1, dx: 1 }; S.want = 'vf'; mkbar(); draw(); }));
      bar.append(btn('مثال : سقوط حرّ — كم يرتفع ؟', 'gh', () => { S.known = { vi: 1, vf: 1, a: 1 }; S.want = 'dx'; mkbar(); draw(); }));
      bar.append(btn('مثال : كم يستغرق ؟', 'gh', () => { S.known = { vi: 1, vf: 1, a: 1 }; S.want = 't'; mkbar(); draw(); }));
    }
    function draw() {
      body.innerHTML = '';
      body.append(el('p', 'shint', 'علّم على ما <b>تعرفه</b> من المسألة ، ثمّ اختر <b>المطلوب</b> — وستظهر المعادلة وحدها.'));
      const g = el('div', 'eqgrid');
      EQV.forEach(v => {
        const on = !!S.known[v[0]], want = S.want === v[0];
        const b = el('button', 'eqv' + (want ? ' eqwant' : on ? ' eqon' : ''), v[1] + '<i>' + (want ? 'المطلوب' : on ? 'معلوم' : 'مجهول') + '</i>');
        b.onclick = () => {
          if (S.want === v[0]) return;
          if (S.known[v[0]]) delete S.known[v[0]]; else { S.known[v[0]] = 1; }
          draw();
        };
        b.oncontextmenu = e => { e.preventDefault(); };
        g.append(b);
      });
      body.append(g);
      const wr = el('div', 'srow');
      wr.append(sel('المطلوب', S.want, EQV.map(v => [v[0], v[1].replace(/<[^>]*>/g, '')]), v => { S.want = v; delete S.known[v]; draw(); }));
      body.append(wr);
      /* المعادلة الصالحة : كلّ ما فيها معلوم إلّا المطلوب */
      const fit = EQS.filter(e => e.has.indexOf(S.want) >= 0 && e.has.every(k => k === S.want || S.known[k]));
      if (fit.length) {
        fit.forEach(e => body.append(el('div', 'eqpick', '<b>المعادلة ' + e.n + '</b> — <span dir="ltr">' + e.f + '</span><i>وهي المعادلة « ' + e.lab + ' » ، و' + (e.miss === S.want ? '' : 'الكمية ' + EQV.find(v => v[0] === e.miss)[1].replace(/<[^>]*>/g, '') + ' لا تظهر فيها ، فلا تحتاج إليها') + '</i>')));
        body.append(el('div', 'sl ok', 'فيها <b>مجهول واحد</b> فقط وهو المطلوب ، فتُحَلّ بخطوة واحدة.'));
      } else {
        const near = EQS.filter(e => e.has.indexOf(S.want) >= 0);
        body.append(el('div', 'eqnone', '<b>لا توجد معادلة بمجهول واحد</b><span>' + (near.length
          ? 'كلّ معادلة تحوي المطلوب ينقصها معلوم آخر. راجع المسألة : غالبًا هناك معطًى لم تنتبه إليه — مثل « ينطلق من السكون » ( ' + L('v<sub>i</sub> = 0') + ' ) أو « يتوقّف » ( ' + L('v<sub>f</sub> = 0') + ' ) أو « سقوط حرّ » ( ' + L('a = −g') + ' ).'
          : 'المطلوب لا يظهر في المعادلات الثلاث.') + '</span>'));
      }
      const t = el('div', 'mgtab');
      const hd = el('div', 'mgtr mghd');
      ['المعادلة', 'صيغتها', 'الكمية الغائبة'].forEach(x => hd.append(el('span', 'mgtc', x)));
      t.append(hd);
      EQS.forEach(e => {
        const on = fit.indexOf(e) >= 0;
        const tr = el('div', 'mgtr' + (on ? ' acon' : ''));
        tr.append(el('span', 'mgtc', e.n));
        tr.append(el('span', 'mgtc', '<span dir="ltr">' + e.f + '</span>'));
        tr.append(el('span', 'mgtc', EQV.find(v => v[0] === e.miss)[1]));
        t.append(tr);
      });
      const w = el('div', 'mgwrap eqtab', ''); w.append(t); body.append(w);
      body.append(el('p', 'sl note', 'القاعدة : اختر المعادلة <b>التي تخلو من المجهول غير المطلوب</b> . لا زمن ← الثالثة · لا سرعة نهائية ← الثانية · لا إزاحة ← الأولى.'));
    }
    mkbar(); draw();
  }

  /* ---------------- 5 · المقذوفات ---------------- */
  function proj(host) {
    host.innerHTML = '';
    const S = { v0: 50, th: 37, g: 10, mode: 'ang', h: 20 };
    const bar = el('div', 'srow'), body = el('div');
    host.append(bar, body);
    function mkbar() {
      bar.innerHTML = '';
      bar.append(sel('النوع', S.mode, [['ang', 'مقذوف بزاوية'], ['hor', 'مقذوف أفقي']], v => { S.mode = v; mkbar(); draw(); }));
      const r2 = el('div', 'srow');
      r2.append(sld('السرعة الابتدائية : ' + L(S.v0 + ' m/s'), S.v0, 10, 60, 5, (v, sp) => { S.v0 = v; sp.innerHTML = 'السرعة الابتدائية : ' + L(v + ' m/s'); draw(); }));
      bar.append(r2);
      const r3 = el('div', 'srow');
      if (S.mode === 'ang') r3.append(sld('الزاوية : ' + L(S.th + '°'), S.th, 10, 80, 1, (v, sp) => { S.th = v; sp.innerHTML = 'الزاوية : ' + L(v + '°'); draw(); }));
      else r3.append(sld('ارتفاع القذف : ' + L(S.h + ' m'), S.h, 5, 80, 5, (v, sp) => { S.h = v; sp.innerHTML = 'ارتفاع القذف : ' + L(v + ' m'); draw(); }));
      bar.append(r3);
    }
    function draw() {
      body.innerHTML = '';
      const g = S.g, ang = S.mode === 'ang';
      const th = ang ? S.th * Math.PI / 180 : 0;
      const vx = S.v0 * Math.cos(th), vy = S.v0 * Math.sin(th);
      let T, hmax, R, th0;
      if (ang) { th0 = vy / g; T = 2 * th0; hmax = vy * vy / (2 * g); R = T * vx; }
      else { T = Math.sqrt(2 * S.h / g); th0 = 0; hmax = S.h; R = vx * T; }
      /* الرسم */
      const W = 300, H = 170, padL = 20, padB = 26, padT = 14, padR = 12;
      const maxX = Math.max(R, 1), maxY = Math.max(hmax, 1) * 1.15;
      const X = x => padL + x / maxX * (W - padL - padR);
      const Y = y => H - padB - y / maxY * (H - padB - padT);
      let s = '<svg viewBox="0 0 ' + W + ' ' + H + '" width="100%" height="' + H + '" preserveAspectRatio="xMidYMid meet" aria-hidden="true">';
      s += '<line x1="' + padL + '" y1="' + Y(0) + '" x2="' + (W - padR) + '" y2="' + Y(0) + '" stroke="#8894a6" stroke-width="1.2"/>';
      let d = '';
      const N = 50;
      for (let i = 0; i <= N; i++) {
        const t = T * i / N;
        const x = vx * t, y = (ang ? vy * t : S.h) - (ang ? 0.5 * g * t * t : 0.5 * g * t * t);
        d += (i ? ' L' : 'M') + X(x) + ' ' + Y(Math.max(y, 0));
      }
      s += '<path d="' + d + '" fill="none" stroke="#1F3A5F" stroke-width="2.4"/>';
      /* القمّة */
      const apexX = ang ? vx * th0 : 0;
      s += '<line x1="' + X(apexX) + '" y1="' + Y(0) + '" x2="' + X(apexX) + '" y2="' + Y(hmax) + '" stroke="#C9A227" stroke-dasharray="3 3"/>';
      s += '<circle cx="' + X(apexX) + '" cy="' + Y(hmax) + '" r="4" fill="#C9A227"/>';
      /* المدى */
      s += '<line x1="' + X(0) + '" y1="' + (H - 12) + '" x2="' + X(R) + '" y2="' + (H - 12) + '" stroke="#B3261E" stroke-width="2"/>';
      s += '<polygon points="' + X(R) + ',' + (H - 12) + ' ' + (X(R) - 6) + ',' + (H - 16) + ' ' + (X(R) - 6) + ',' + (H - 8) + '" fill="#B3261E"/>';
      /* مركّبتا السرعة عند الانطلاق */
      const sc = 0.9;
      s += '<line x1="' + X(0) + '" y1="' + Y(ang ? 0 : S.h) + '" x2="' + (X(0) + vx * sc) + '" y2="' + Y(ang ? 0 : S.h) + '" stroke="#2F6B3A" stroke-width="2.4"/>';
      if (ang && vy > 0) s += '<line x1="' + X(0) + '" y1="' + Y(0) + '" x2="' + X(0) + '" y2="' + (Y(0) - vy * sc) + '" stroke="#7A3EA8" stroke-width="2.4"/>';
      s += '</svg>';
      body.append(el('p', 'shint', 'الخطّ الأخضر <b>المركّبة الأفقية</b> ( ثابتة ) ، والبنفسجي <b>المركّبة الرأسية</b> ، والأصفر <b>أقصى ارتفاع</b> ، والأحمر <b>المدى</b>.'));
      body.append(el('div', 'dpw', s));
      const info = el('div', 'cyinfo');
      const row = (k, v) => info.append(el('div', 'cyrow', '<span class="cyk">' + k + '</span><span class="cyv">' + v + '</span>'));
      if (ang) {
        const n3 = v => Math.round(v * 1000) / 1000;
        row('المركّبة الأفقية', L('v₀ cos θ = ' + S.v0 + ' × ' + n3(Math.cos(th)) + ' = ' + n2(vx) + ' m/s') + ' — <b>ثابتة</b>');
        row('المركّبة الرأسية', L('v₀ sin θ = ' + S.v0 + ' × ' + n3(Math.sin(th)) + ' = ' + n2(vy) + ' m/s'));
        row('زمن الصعود', L('t<sub>h</sub> = v₀ sin θ / g = ' + n2(vy) + ' / ' + g + ' = ' + n2(th0) + ' s'));
        row('زمن التحليق', L('T = 2 t<sub>h</sub> = ' + n2(T) + ' s'));
        row('أقصى ارتفاع', L('h = (v₀ sin θ)² / 2g = ' + n2(hmax) + ' m'));
        row('المدى الأفقي', L('R = T × v₀ cos θ = ' + n2(T) + ' × ' + n2(vx) + ' = ' + n2(R) + ' m'));
        body.append(info);
        body.append(el('div', 'sl note', 'لاحظ أنّ الارتفاع والزمن استعملا <b>المركّبة الرأسية وحدها</b> ، وأنّ المدى استعمل <b>الأفقية وحدها</b> — <b>والزمن هو الجسر</b> بينهما.'));
      } else {
        row('المركّبة الأفقية', L('v₀ = ' + n2(vx) + ' m/s') + ' — <b>ثابتة</b>');
        row('المركّبة الرأسية الابتدائية', '<b>صفر</b> — لأنّ ' + L('sin 0 = 0'));
        row('زمن السقوط', L('t = √(2h / g) = √(2 × ' + S.h + ' / ' + g + ') = ' + n2(T) + ' s'));
        row('المدى الأفقي', L('R = v₀ t = ' + n2(vx) + ' × ' + n2(T) + ' = ' + n2(R) + ' m'));
        body.append(info);
        body.append(el('div', 'sl note', 'حرّك منزلق <b>السرعة</b> وراقب : <b>الزمن لا يتغيّر</b> والمدى وحده يتغيّر — لأنّ الزمن يتبع <b>الارتفاع وحده</b>. ولهذا تصل رصاصة تُطلَق أفقيًّا وأخرى تُسقَط من اليد الأرضَ <b>في اللحظة نفسها</b>.'));
      }
    }
    mkbar(); draw();
  }

  /* ---------------- 6 · الحركة الدائرية ---------------- */
  function circ(host) {
    host.innerHTML = '';
    const S = { r: 2, T: 4, ph: 0 };
    const bar = el('div', 'srow'), body = el('div');
    host.append(bar, body);
    function mkbar() {
      bar.innerHTML = '';
      bar.append(sld('نصف القطر : ' + L(S.r + ' m'), S.r, 1, 8, 1, (v, sp) => { S.r = v; sp.innerHTML = 'نصف القطر : ' + L(v + ' m'); draw(); }));
      const r2 = el('div', 'srow');
      r2.append(sld('الزمن الدوري : ' + L(S.T + ' s'), S.T, 1, 10, 1, (v, sp) => { S.T = v; sp.innerHTML = 'الزمن الدوري : ' + L(v + ' s'); draw(); }));
      bar.append(r2);
      const r3 = el('div', 'srow');
      r3.append(sld('موضع الجسم : ' + L(S.ph + '°'), S.ph, 0, 330, 30, (v, sp) => { S.ph = v; sp.innerHTML = 'موضع الجسم : ' + L(v + '°'); draw(); }));
      bar.append(r3);
    }
    function draw() {
      body.innerHTML = '';
      const PI = 3.14, v = 2 * PI * S.r / S.T, ac = v * v / S.r;
      const W = 200, H = 200, cx = 100, cy = 100, R = 66;
      const a = S.ph * Math.PI / 180;
      const px = cx + R * Math.cos(a), py = cy - R * Math.sin(a);
      let s = '<svg viewBox="0 0 ' + W + ' ' + H + '" width="' + W + '" height="' + H + '" aria-hidden="true">';
      s += '<circle cx="' + cx + '" cy="' + cy + '" r="' + R + '" fill="none" stroke="#c3ccd8" stroke-width="1.6" stroke-dasharray="4 3"/>';
      s += '<circle cx="' + cx + '" cy="' + cy + '" r="3.5" fill="#1F3A5F"/>';
      s += '<line x1="' + cx + '" y1="' + cy + '" x2="' + px.toFixed(1) + '" y2="' + py.toFixed(1) + '" stroke="#c3ccd8" stroke-width="1.2"/>';
      /* السرعة : مماسّ */
      const tx = -Math.sin(a), ty = -Math.cos(a), SL = 46;
      s += '<line x1="' + px.toFixed(1) + '" y1="' + py.toFixed(1) + '" x2="' + (px + tx * SL).toFixed(1) + '" y2="' + (py + ty * SL).toFixed(1) + '" stroke="#1F3A5F" stroke-width="2.8"/>';
      s += '<polygon points="' + (px + tx * SL).toFixed(1) + ',' + (py + ty * SL).toFixed(1)
        + ' ' + (px + tx * (SL - 8) - ty * 4).toFixed(1) + ',' + (py + ty * (SL - 8) + tx * 4).toFixed(1)
        + ' ' + (px + tx * (SL - 8) + ty * 4).toFixed(1) + ',' + (py + ty * (SL - 8) - tx * 4).toFixed(1) + '" fill="#1F3A5F"/>';
      /* التسارع : نحو المركز */
      const ux = (cx - px) / R, uy = (cy - py) / R, AL = 34;
      s += '<line x1="' + px.toFixed(1) + '" y1="' + py.toFixed(1) + '" x2="' + (px + ux * AL).toFixed(1) + '" y2="' + (py + uy * AL).toFixed(1) + '" stroke="#B3261E" stroke-width="2.8"/>';
      s += '<polygon points="' + (px + ux * AL).toFixed(1) + ',' + (py + uy * AL).toFixed(1)
        + ' ' + (px + ux * (AL - 8) - uy * 4).toFixed(1) + ',' + (py + uy * (AL - 8) + ux * 4).toFixed(1)
        + ' ' + (px + ux * (AL - 8) + uy * 4).toFixed(1) + ',' + (py + uy * (AL - 8) - ux * 4).toFixed(1) + '" fill="#B3261E"/>';
      s += '<circle cx="' + px.toFixed(1) + '" cy="' + py.toFixed(1) + '" r="6" fill="#E8EEF6" stroke="#1F3A5F" stroke-width="2"/>';
      s += '</svg>';
      body.append(el('p', 'shint', 'السهم <b>الأزرق</b> السرعة المماسية ، و<b>الأحمر</b> التسارع المركزي . حرّك موضع الجسم وراقب : <b>الاتجاهان يدوران والمقداران لا يتغيّران</b>.'));
      body.append(el('div', 'cywrap', s));
      const info = el('div', 'cyinfo');
      const row = (k, val) => info.append(el('div', 'cyrow', '<span class="cyk">' + k + '</span><span class="cyv">' + val + '</span>'));
      row('السرعة المماسية', L('v = 2 π r / T = 2 × 3.14 × ' + S.r + ' / ' + S.T + ' = ' + n2(v) + ' m/s'));
      row('التسارع المركزي', L('a<sub>c</sub> = v² / r = ' + n2(v) + '² / ' + S.r + ' = ' + n2(ac) + ' m/s²'));
      row('اتجاه السرعة', 'على امتداد <b>المماسّ</b> — يتغيّر في كلّ لحظة');
      row('اتجاه التسارع', 'نحو <b>مركز</b> المسار — ويتعامد مع السرعة دائمًا');
      body.append(info);
      body.append(el('div', 'sl note', 'السرعة ثابتة <b>مقدارًا</b> ومتغيّرة <b>اتجاهًا</b> — وتغيّر الاتجاه وحده تغيّرٌ في المتّجه يستلزم تسارعًا. <b>فالتسارع هنا لا يُسرّع الجسم بل يَلويه</b>.'));
    }
    mkbar(); draw();
  }

  /* ---------------- 7 · الجذب العامّ والوزن ---------------- */
  const PLAN = {
    earth: { n: 'الأرض', m: 5.98e24, r: 6.38e6 },
    moon: { n: 'القمر', m: 7.35e22, r: 1.74e6 },
    mars: { n: 'المرّيخ', m: 6.42e23, r: 3.39e6 },
    jup: { n: 'المشتري', m: 1.90e27, r: 6.99e7 }
  };
  const G = 6.67e-11;
  const sci = v => { const e = Math.floor(Math.log10(Math.abs(v))); const m = v / Math.pow(10, e); return n2(m) + ' × 10' + String(e).replace(/-/g, '⁻').replace(/[0-9]/g, d => '⁰¹²³⁴⁵⁶⁷⁸⁹'[+d]); };

  function grav(host) {
    host.innerHTML = '';
    const S = { mode: 'pl', p: 'earth', mass: 70, m1: 50, m2: 80, r: 2 };
    const bar = el('div', 'srow'), body = el('div');
    host.append(bar, body);
    function mkbar() {
      bar.innerHTML = '';
      bar.append(sel('الوضع', S.mode, [['pl', 'الجاذبية والوزن على كوكب'], ['two', 'التجاذب بين جسمين']], v => { S.mode = v; mkbar(); draw(); }));
      if (S.mode === 'pl') {
        const r2 = el('div', 'srow');
        r2.append(sel('الجرم', S.p, Object.keys(PLAN).map(k => [k, PLAN[k].n]), v => { S.p = v; draw(); }));
        r2.append(sld('كتلة الجسم : ' + L(S.mass + ' kg'), S.mass, 10, 120, 10, (v, sp) => { S.mass = v; sp.innerHTML = 'كتلة الجسم : ' + L(v + ' kg'); draw(); }));
        bar.append(r2);
      } else {
        const r2 = el('div', 'srow');
        r2.append(sld('الكتلة الأولى : ' + L(S.m1 + ' kg'), S.m1, 10, 200, 10, (v, sp) => { S.m1 = v; sp.innerHTML = 'الكتلة الأولى : ' + L(v + ' kg'); draw(); }));
        bar.append(r2);
        const r3 = el('div', 'srow');
        r3.append(sld('المسافة : ' + L(S.r + ' m'), S.r, 1, 10, 1, (v, sp) => { S.r = v; sp.innerHTML = 'المسافة : ' + L(v + ' m'); draw(); }));
        bar.append(r3);
      }
    }
    function draw() {
      body.innerHTML = '';
      const info = el('div', 'cyinfo');
      const row = (k, v) => info.append(el('div', 'cyrow', '<span class="cyk">' + k + '</span><span class="cyv">' + v + '</span>'));
      if (S.mode === 'pl') {
        const p = PLAN[S.p], g = G * p.m / (p.r * p.r), w = S.mass * g;
        const gE = G * PLAN.earth.m / (PLAN.earth.r * PLAN.earth.r);
        body.append(el('p', 'shint', 'الجاذبية على سطح أيّ جرم تُشتقّ من قانون الجذب العامّ : <span dir="ltr">g = G m / r²</span> — ولاحظ أنّ <b>كتلة الجسم الساقط لا تدخل فيها</b>.'));
        const bars = el('div', 'gvb');
        Object.keys(PLAN).forEach(k => {
          const q = PLAN[k], gq = G * q.m / (q.r * q.r);
          const row2 = el('div', 'gvr' + (k === S.p ? ' gvon' : ''));
          row2.append(el('span', 'gvl', q.n));
          const t = el('span', 'gvt'); const f = el('i'); f.style.width = Math.min(gq / 26 * 100, 100) + '%'; t.append(f);
          row2.append(t);
          row2.append(el('span', 'gvv', n2(gq) + ''));
          bars.append(row2);
        });
        body.append(bars);
        row('الجرم', '<b>' + p.n + '</b> · الكتلة ' + L(sci(p.m) + ' kg') + ' · نصف القطر ' + L(sci(p.r) + ' m'));
        row('تسارع السقوط الحرّ', L('g = G m / r² = ' + n2(g) + ' m/s²'));
        row('كتلة الجسم', '<b>' + L(S.mass + ' kg') + '</b> — <b>لا تتغيّر</b> بتغيّر الجرم');
        row('وزنه هنا', L('W = m g = ' + S.mass + ' × ' + n2(g) + ' = ' + n2(w) + ' N'));
        const k = g / gE;
        row('وزنه على الأرض', L(n2(S.mass * gE) + ' N') + (S.p === 'earth' ? ''
          : k >= 1 ? ' — أي أنّ وزنه هنا نحو <b>' + n2(k) + ' مِثْل</b> وزنه على الأرض'
            : ' — أي أنّ وزنه هنا نحو <b>' + Math.round(k * 100) + ' %</b> من وزنه على الأرض'));
        body.append(info);
        body.append(el('div', 'sl note', 'غيّر الجرم وراقب : <b>الوزن يتغيّر والكتلة لا</b> . والكتلة مقدار المادّة ووحدتها ' + L('kg') + ' ، والوزن قوّة ووحدته ' + L('N') + '.'));
      } else {
        const F = G * S.m1 * S.m2 / (S.r * S.r);
        const F2 = G * S.m1 * S.m2 / (2 * S.r * 2 * S.r);
        body.append(el('p', 'shint', 'قوّة التجاذب بين أيّ جسمين : <span dir="ltr">F = G m₁ m₂ / r²</span> — والمسافة بين <b>مركزيهما</b> و<b>مربّعة</b> في المقام.'));
        const W = 290, H = 90;
        const gap = 40 + S.r / 10 * 150;
        const ax = (W - gap) / 2, bx = ax + gap;
        const ra = 8 + S.m1 / 200 * 14, rb = 8 + S.m2 / 200 * 14;
        let s = '<svg viewBox="0 0 ' + W + ' ' + H + '" width="100%" height="' + H + '" preserveAspectRatio="xMidYMid meet" aria-hidden="true">';
        s += '<line x1="' + ax + '" y1="45" x2="' + bx + '" y2="45" stroke="#c3ccd8" stroke-dasharray="3 3"/>';
        s += '<circle cx="' + ax + '" cy="45" r="' + ra.toFixed(1) + '" fill="#7E97B6" stroke="#1F3A5F" stroke-width="1.4"/>';
        s += '<circle cx="' + bx + '" cy="45" r="' + rb.toFixed(1) + '" fill="#C9A227" stroke="#8a6f1a" stroke-width="1.4"/>';
        const al = Math.min(26, gap / 3);
        s += '<line x1="' + (ax + ra + 3) + '" y1="45" x2="' + (ax + ra + 3 + al) + '" y2="45" stroke="#B3261E" stroke-width="2.4"/>';
        s += '<polygon points="' + (ax + ra + 3 + al) + ',45 ' + (ax + ra + al - 3) + ',41 ' + (ax + ra + al - 3) + ',49" fill="#B3261E"/>';
        s += '<line x1="' + (bx - rb - 3) + '" y1="45" x2="' + (bx - rb - 3 - al) + '" y2="45" stroke="#B3261E" stroke-width="2.4"/>';
        s += '<polygon points="' + (bx - rb - 3 - al) + ',45 ' + (bx - rb - al + 3) + ',41 ' + (bx - rb - al + 3) + ',49" fill="#B3261E"/>';
        s += '<text x="' + ((ax + bx) / 2) + '" y="76" direction="ltr" text-anchor="middle" font-size="10" fill="#8894a6">r = ' + S.r + ' m</text>';
        s += '</svg>';
        body.append(el('div', 'dpw', s));
        row('الكتلتان', L(S.m1 + ' kg') + ' و ' + L(S.m2 + ' kg'));
        row('المسافة بين المركزين', L(S.r + ' m') + ' · مربّعها ' + L((S.r * S.r) + ''));
        row('قوّة التجاذب', L('F = (' + sci(G) + ' × ' + S.m1 + ' × ' + S.m2 + ') / ' + (S.r * S.r) + ' = ' + sci(F) + ' N'));
        row('لو ضوعفت المسافة', L(sci(F2) + ' N') + ' — أي <b>ربع</b> القيمة ، لأنّ التناسب مع <b>مربّع</b> المسافة');
        row('لو ضوعفت كتلة واحدة', L(sci(F * 2) + ' N') + ' — أي <b>الضعف</b> ، لأنّ التناسب مع الكتلة <b>طردي بسيط</b>');
        body.append(info);
        body.append(el('div', 'sl note', 'لاحظ <b>ضآلة القوّة</b> مع كِبَر الكتلتين — ولهذا لا نشعر بالتجاذب بين الأجسام من حولنا ، ولا يظهر أثره إلّا مع كتل هائلة كالكواكب. و<b>التغيّر في المسافة أشدّ أثرًا</b> من التغيّر في الكتلة لأنّها مربّعة.'));
      }
    }
    mkbar(); draw();
  }

  window.SIMS.disp = disp;
  window.SIMS.accsign = accsign;
  window.SIMS.kgraph = kgraph;
  window.SIMS.kineq = kineq;
  window.SIMS.proj = proj;
  window.SIMS.circ = circ;
  window.SIMS.grav = grav;
})();

/* ===== محاكاة التوزيع الإلكتروني والدورية ( كيمياء العاشر — الوحدة الثانية ) ===== */
(function () {
  const el = (t, c, h) => { const e = document.createElement(t); if (c) e.className = c; if (h !== undefined) e.innerHTML = h; return e; };
  const btn = (txt, cls, fn) => { const b = el('button', 'sb ' + (cls || ''), txt); b.onclick = fn; return b; };
  const L = s => '<span class="ltr">' + s + '</span>';
  const SUP = { 0: '⁰', 1: '¹', 2: '²', 3: '³', 4: '⁴', 5: '⁵', 6: '⁶', 7: '⁷', 8: '⁸', 9: '⁹' };
  const sup = n => String(n).split('').map(d => SUP[d]).join('');
  const sel = (lab, val, opts, fn) => {
    const w = el('label', 'sf'); w.append(el('span', '', lab));
    const s = document.createElement('select');
    opts.forEach(o => { const p = document.createElement('option'); p.value = o[0]; p.textContent = o[1]; if (o[0] == val) p.selected = true; s.append(p); });
    s.onchange = () => fn(s.value); w.append(s); return w;
  };
  const sld = (lab, val, lo, hi, step, fn) => {
    const w = el('label', 'sf'); const sp = el('span', '', lab); w.append(sp);
    const r = document.createElement('input');
    r.type = 'range'; r.min = lo; r.max = hi; r.step = step; r.value = val;
    r.oninput = () => fn(+r.value, sp); w.append(r); return w;
  };

  /* ترتيب المستويات الفرعية بحسب الطاقة ، وسعة كلّ منها */
  const ORD = ['1s', '2s', '2p', '3s', '3p', '4s', '3d', '4p', '5s', '4d', '5p', '6s', '4f', '5d', '6p', '7s', '5f', '6d'];
  const CAP = { s: 2, p: 6, d: 10, f: 14 };
  const NOB = [[2, 'He'], [10, 'Ne'], [18, 'Ar'], [36, 'Kr'], [54, 'Xe'], [86, 'Rn']];
  const NAMES2 = { 1: 'الهيدروجين', 2: 'الهيليوم', 3: 'الليثيوم', 4: 'البريليوم', 5: 'البورون', 6: 'الكربون', 7: 'النتروجين', 8: 'الأكسجين', 9: 'الفلور', 10: 'النيون', 11: 'الصوديوم', 12: 'المغنيسيوم', 13: 'الألمنيوم', 14: 'السيليكون', 15: 'الفسفور', 16: 'الكبريت', 17: 'الكلور', 18: 'الأرغون', 19: 'البوتاسيوم', 20: 'الكالسيوم', 21: 'السكانديوم', 22: 'التيتانيوم', 23: 'الفاناديوم', 24: 'الكروم', 25: 'المنغنيز', 26: 'الحديد', 27: 'الكوبلت', 28: 'النيكل', 29: 'النحاس', 30: 'الخارصين', 31: 'الغاليوم', 32: 'الجرمانيوم', 33: 'الزرنيخ', 34: 'السيلينيوم', 35: 'البروم', 36: 'الكريبتون' };
  const SYM2 = { 1: 'H', 2: 'He', 3: 'Li', 4: 'Be', 5: 'B', 6: 'C', 7: 'N', 8: 'O', 9: 'F', 10: 'Ne', 11: 'Na', 12: 'Mg', 13: 'Al', 14: 'Si', 15: 'P', 16: 'S', 17: 'Cl', 18: 'Ar', 19: 'K', 20: 'Ca', 21: 'Sc', 22: 'Ti', 23: 'V', 24: 'Cr', 25: 'Mn', 26: 'Fe', 27: 'Co', 28: 'Ni', 29: 'Cu', 30: 'Zn', 31: 'Ga', 32: 'Ge', 33: 'As', 34: 'Se', 35: 'Br', 36: 'Kr' };

  /* يبني التوزيع بترتيب الطاقة : [[اسم المستوى , عدد الإلكترونات] , ...] */
  function build(e) {
    const out = [];
    let left = e;
    for (const lv of ORD) {
      if (left <= 0) break;
      const c = Math.min(CAP[lv[1]], left);
      out.push([lv, c]); left -= c;
    }
    return out;
  }
  const show = cfg => cfg.map(x => x[0] + sup(x[1])).join(' ');
  /* المستوى الخارجي : أعلى n */
  const topN = cfg => Math.max.apply(null, cfg.map(x => +x[0][0]));

  /* ---------------- 1 · بناء التوزيع الإلكتروني ---------------- */
  function aufbau(host) {
    host.innerHTML = '';
    const S = { z: 26, q: 0, nob: false };
    const bar = el('div', 'srow'), body = el('div');
    host.append(bar, body);
    function mkbar() {
      bar.innerHTML = '';
      bar.append(sld('العدد الذرّي ' + L('Z') + ' : ' + L(S.z) + ' — ' + (NAMES2[S.z] || ''), S.z, 1, 36, 1,
        (v, sp) => { S.z = v; sp.innerHTML = 'العدد الذرّي ' + L('Z') + ' : ' + L(v) + ' — ' + (NAMES2[v] || ''); draw(); }));
      const r2 = el('div', 'srow');
      r2.append(sel('الحالة', S.q, [[0, 'ذرّة متعادلة'], [1, 'أيون 1+'], [2, 'أيون 2+'], [3, 'أيون 3+'], [-1, 'أيون 1−'], [-2, 'أيون 2−']],
        v => { S.q = +v; draw(); }));
      r2.append(btn(S.nob ? 'التوزيع الكامل' : 'بدلالة الغاز النبيل', 'gh', () => { S.nob = !S.nob; mkbar(); draw(); }));
      bar.append(r2);
    }
    function draw() {
      body.innerHTML = '';
      const e = S.z - S.q;
      if (e <= 0) { body.append(el('div', 'sl note', 'عدد الإلكترونات صفر أو أقلّ — اختر شحنة أصغر.')); return; }
      /* توزيع الذرّة المتعادلة ثمّ تعديله للأيون */
      const base = build(S.z);
      let cfg;
      if (S.q === 0) cfg = base;
      else if (S.q > 0) {
        /* الفقد من المستوى الخارجي ( أعلى n ) أوّلًا */
        cfg = base.map(x => x.slice());
        let rm = S.q;
        while (rm > 0) {
          const n = topN(cfg.filter(x => x[1] > 0));
          /* آخر مستوًى فرعي في أعلى n */
          let idx = -1;
          cfg.forEach((x, i) => { if (+x[0][0] === n && x[1] > 0) idx = i; });
          if (idx < 0) break;
          const take = Math.min(rm, cfg[idx][1]);
          cfg[idx][1] -= take; rm -= take;
        }
        cfg = cfg.filter(x => x[1] > 0);
      } else cfg = build(e);
      const last = base[base.length - 1][0];
      const kind = last[1] === 's' || last[1] === 'p' ? 'ممثل' : last[1] === 'd' ? 'انتقالي' : 'انتقالي داخلي';
      const per = topN(base);
      const outer = base.filter(x => +x[0][0] === per && (x[0][1] === 's' || x[0][1] === 'p'));
      const grp = outer.reduce((a, b) => a + b[1], 0);
      /* رمز الغاز النبيل السابق */
      let nb = null;
      NOB.forEach(x => { if (x[0] < S.z) nb = x; });
      let shown = show(cfg);
      if (S.nob && nb) {
        const nbCfg = build(nb[0]);
        const rest = cfg.slice(nbCfg.length);
        if (cfg.length >= nbCfg.length) shown = '[' + nb[1] + '] ' + show(rest);
      }
      body.append(el('p', 'shint', 'يُملأ بترتيب <b>الطاقة</b> لا برقم المستوى — ولاحظ موضع ' + L('4s') + ' قبل ' + L('3d') + '.'));
      /* شريط الملء */
      const fillBar = el('div', 'aufb');
      cfg.forEach(x => {
        const seg = el('span', 'aufs' + (x[0] === last && S.q === 0 ? ' auflast' : ''));
        seg.style.flex = x[1] + ' 1 0';
        seg.innerHTML = '<i>' + x[0] + '</i><b>' + x[1] + '</b>';
        fillBar.append(seg);
      });
      body.append(fillBar);
      body.append(el('div', 'aufres', '<span dir="ltr">' + shown + '</span>'));
      const info = el('div', 'cyinfo');
      const row = (k, v) => info.append(el('div', 'cyrow', '<span class="cyk">' + k + '</span><span class="cyv">' + v + '</span>'));
      row('العنصر', '<b>' + (NAMES2[S.z] || '—') + '</b> ' + L(SYM2[S.z] || '') + (S.q ? ' · الأيون ' + L(SYM2[S.z] + (Math.abs(S.q) > 1 ? sup(Math.abs(S.q)) : '') + (S.q > 0 ? '⁺' : '⁻')) : ''));
      row('عدد الإلكترونات', L(S.z) + (S.q ? (S.q > 0 ? ' − ' + L(S.q) : ' + ' + L(-S.q)) + ' = <b>' + L(e) + '</b>' : ' ( متعادلة )'));
      row('التحقّق بالجمع', L(cfg.map(x => x[1]).join(' + ') + ' = ' + cfg.reduce((a, b) => a + b[1], 0)) + (cfg.reduce((a, b) => a + b[1], 0) === e ? ' ✔' : ' ✘'));
      if (S.q === 0) {
        row('الإلكترون الأخير دخل', L(last) + ' ← <b>' + kind + '</b>');
        row('الدورة', '<b>' + per + '</b> — أعلى قيمة لـ ' + L('n'));
        row('المجموعة', kind === 'ممثل' ? '<b>' + grp + 'A</b> — مجموع ' + L('s + p') + ' في المستوى الخارجي ( ' + L(outer.map(x => x[1]).join(' + ') + ' = ' + grp) + ' )' : '<b>' + (kind === 'انتقالي' ? 'من مجموعات ' + L('B') + ' ( وسط الجدول )' : 'أسفل الجدول') + '</b> — <b>لا تنطبق</b> قاعدة ' + L('s + p') + ' على هذا التصنيف');
      } else {
        const gone = S.q > 0;
        row('ما حدث', gone ? 'فُقدت <b>' + S.q + '</b> إلكترونات من <b>المستوى الخارجي</b> ( أعلى ' + L('n') + ' )' : 'اكتُسبت <b>' + (-S.q) + '</b> إلكترونات في <b>المستوى الخارجي</b>');
        row('العدد الذرّي', '<b>' + L(S.z) + '</b> — <b>لم يتغيّر</b> ، فالبروتونات لا تُمسّ');
        const nobMatch = NOB.find(x => x[0] === e);
        if (nobMatch) row('ملاحظة', 'صار توزيعه كتوزيع الغاز النبيل <b>' + L(nobMatch[1]) + '</b> ( ' + L(e) + ' إلكترونًا ) — وهذا ما سعت إليه الذرّة');
      }
      body.append(info);
      if (S.q > 0 && base.some(x => x[0] === '3d' && x[1] > 0) && base.some(x => x[0] === '4s'))
        body.append(el('div', 'sl note', 'لاحظ أنّ الفقد بدأ من ' + L('4s') + ' <b>لا</b> من ' + L('3d') + ' — لأنّ المعيار في الفقد هو <b>البُعد عن النواة</b> ( أعلى ' + L('n') + ' ) لا ترتيب الطاقة في الملء.'));
      else if ((S.z === 24 || S.z === 29) && S.q === 0)
        body.append(el('div', 'sl note', 'هذا ما <b>يتنبّأ به مبدأ أوفباو</b> ، وهو المعتمد في كتابك . <b>والتوزيع المقيس فعليًّا لهذا العنصر يخالفه</b> : '
          + L(S.z === 24 ? '[Ar] 4s¹ 3d⁵' : '[Ar] 4s¹ 3d¹⁰') + ' — لأنّ المستوى ' + L('3d') + ' <b>نصف الممتلئ أو الممتلئ</b> أكثر استقرارًا ، فينتقل إليه إلكترون من ' + L('4s') + ' . وهما استثناءان لا يُسأل عنهما في كتابك ، لكن من الأمانة أن تعرفهما.'));
      else if (S.z >= 21 && S.q === 0)
        body.append(el('div', 'sl note', L('4s') + ' كُتب <b>قبل</b> ' + L('3d') + ' ، وهذا ما يعتمده كتابك . ومع ذلك فالإلكترون الأخير دخل ' + L(last) + ' ، وبه يكون التصنيف.'));
      else
        body.append(el('div', 'sl note', 'من التوزيع وحده تقرأ ثلاثة أشياء : <b>الدورة</b> ( أعلى ' + L('n') + ' ) · <b>النوع</b> ( آخر حرف ) · <b>المجموعة</b> ( مجموع ' + L('s + p') + ' للممثل ).'));
    }
    mkbar(); draw();
  }

  /* ---------------- 2 · قاعدة هوند ---------------- */
  function hund(host) {
    host.innerHTML = '';
    const S = { lv: 'p', n: 3, wrong: false };
    const bar = el('div', 'srow'), body = el('div');
    host.append(bar, body);
    const NB = { s: 1, p: 3, d: 5 };
    function mkbar() {
      bar.innerHTML = '';
      bar.append(sel('المستوى الفرعي', S.lv, [['s', 's — فلك واحد'], ['p', 'p — ثلاثة أفلاك'], ['d', 'd — خمسة أفلاك']],
        v => { S.lv = v; S.n = Math.min(S.n, CAP[v]); mkbar(); draw(); }));
      const r2 = el('div', 'srow');
      r2.append(sld('عدد الإلكترونات : ' + L(S.n), S.n, 1, CAP[S.lv], 1, (v, sp) => { S.n = v; sp.innerHTML = 'عدد الإلكترونات : ' + L(v); draw(); }));
      bar.append(r2);
      const r3 = el('div', 'srow');
      r3.append(btn(S.wrong ? 'أعد التوزيع الصحيح' : 'أرِني التوزيع الخاطئ', S.wrong ? 'go' : 'gh', () => { S.wrong = !S.wrong; mkbar(); draw(); }));
      bar.append(r3);
    }
    function draw() {
      body.innerHTML = '';
      const nb = NB[S.lv], arr = [];
      for (let i = 0; i < nb; i++) arr.push([0, 0]);
      if (!S.wrong) {
        for (let i = 0; i < S.n; i++) { if (i < nb) arr[i][0] = 1; else arr[i - nb][1] = 1; }
      } else {
        let left = S.n;
        for (let i = 0; i < nb && left > 0; i++) { arr[i][0] = 1; left--; if (left > 0) { arr[i][1] = 1; left--; } }
      }
      body.append(el('p', 'shint', 'كلّ مربّع <b>فلك</b> ، وكلّ سهم <b>إلكترون</b> . والسهم لأعلى غزل ، ولأسفل غزل معاكس.'));
      const box = el('div', 'hdbox');
      arr.forEach(f => {
        const b = el('span', 'hdf');
        b.innerHTML = '<u>' + (f[0] ? '↑' : '') + '</u><u>' + (f[1] ? '↓' : '') + '</u>';
        box.append(b);
      });
      body.append(box);
      body.append(el('div', 'hdlab', L(S.lv + sup(S.n)) + ' — ' + nb + ' أفلاك · سعتها ' + L(CAP[S.lv]) + ' إلكترونًا'));
      const single = arr.filter(f => f[0] + f[1] === 1).length;
      const pair = arr.filter(f => f[0] + f[1] === 2).length;
      const info = el('div', 'cyinfo');
      const row = (k, v) => info.append(el('div', 'cyrow', '<span class="cyk">' + k + '</span><span class="cyv">' + v + '</span>'));
      row('أفلاك منفردة', '<b>' + single + '</b>');
      row('أفلاك مزدوجة', '<b>' + pair + '</b>');
      row('أفلاك فارغة', '<b>' + (nb - single - pair) + '</b>');
      body.append(info);
      if (S.wrong) body.append(el('div', 'acv acwarn', '<b>توزيع خاطئ</b><span>ازدوج الفلك الأول <b>قبل</b> أن يأخذ كلّ فلك إلكترونًا — وهذا يخالف <b>قاعدة هوند</b> . والإلكترونات متنافرة ، فازدحامها في فلك واحد يرفع طاقة الذرّة ويُقلّل استقرارها.</span>'));
      else if (S.n <= nb) body.append(el('div', 'acv acok', '<b>توزيع صحيح</b><span>الإلكترونات <b>' + S.n + '</b> وعدد الأفلاك <b>' + nb + '</b> ، فوُزّعت <b>منفردة</b> باتجاه الغزل نفسه ولم يزدوج فلك — وهذا نصّ قاعدة هوند.</span>'));
      else body.append(el('div', 'acv acok', '<b>توزيع صحيح</b><span>امتلأت الأفلاك <b>بواحد واحد</b> أوّلًا ( <b>' + nb + '</b> إلكترونات ) ، ثمّ ازدوجت <b>' + pair + '</b> منها باتجاه غزل <b>معاكس</b> بمبدأ باولي.</span>'));
    }
    mkbar(); draw();
  }

  /* ---------------- 3 · حجم الأيون ---------------- */
  const IONS = [
    { s: 'N³⁻', z: 7, e: 10, r: 146 }, { s: 'O²⁻', z: 8, e: 10, r: 140 }, { s: 'F⁻', z: 9, e: 10, r: 133 },
    { s: 'Na⁺', z: 11, e: 10, r: 95 }, { s: 'Mg²⁺', z: 12, e: 10, r: 65 }
  ];
  const ATOM = { 7: 75, 8: 73, 9: 71, 11: 186, 12: 160 };

  function ionsize(host) {
    host.innerHTML = '';
    const S = { mode: 'iso', z: 11 };
    const bar = el('div', 'srow'), body = el('div');
    host.append(bar, body);
    function mkbar() {
      bar.innerHTML = '';
      bar.append(sel('الوضع', S.mode, [['iso', 'أيونات لها التوزيع نفسه'], ['cmp', 'الذرّة وأيونها']], v => { S.mode = v; mkbar(); draw(); }));
      if (S.mode === 'cmp') {
        const r2 = el('div', 'srow');
        r2.append(sel('العنصر', S.z, IONS.map(i => [i.z, NAMES2[i.z] + ' ' + i.s]), v => { S.z = +v; draw(); }));
        bar.append(r2);
      }
    }
    function circleRow(label, r, col, note) {
      const row = el('div', 'isr');
      row.append(el('span', 'isl', label));
      const c = el('span', 'isc');
      const d = Math.max(14, r / 186 * 72);
      c.innerHTML = '<i style="width:' + d.toFixed(1) + 'px;height:' + d.toFixed(1) + 'px;background:' + col + '"></i>';
      row.append(c);
      row.append(el('span', 'isv', note));
      return row;
    }
    function draw() {
      body.innerHTML = '';
      if (S.mode === 'iso') {
        body.append(el('p', 'shint', 'الخمسة لها <b>عشرة إلكترونات</b> وتوزيع واحد ' + L('1s² 2s² 2p⁶') + ' — فالمقارنة <b>بعدد البروتونات وحده</b>.'));
        const w = el('div', 'isbox');
        IONS.forEach(i => w.append(circleRow(i.s, i.r, i.z <= 9 ? '#7E97B6' : '#C9A227',
          L(i.z) + ' بروتونًا · ' + L(i.r + ' pm'))));
        body.append(w);
        body.append(el('div', 'aufres', '<span dir="ltr">N³⁻ &gt; O²⁻ &gt; F⁻ &gt; Na⁺ &gt; Mg²⁺</span>'));
        body.append(el('div', 'sl note', 'عدد الإلكترونات <b>واحد</b> ( عشرة ) ، وشحنة النواة <b>تزداد</b> ( ' + L('7 · 8 · 9 · 11 · 12') + ' ) ، فيشتدّ جذبها للعدد نفسه من الإلكترونات <b>فينكمش الأيون</b>. فكلّما زاد العدد الذرّي <b>صغر</b> الأيون.'));
      } else {
        const i = IONS.find(x => x.z === S.z), at = ATOM[S.z];
        const pos = i.s.indexOf('⁺') >= 0;
        body.append(el('p', 'shint', 'قارن حجم الذرّة المتعادلة بحجم أيونها — ولاحظ الاتجاه.'));
        const w = el('div', 'isbox');
        w.append(circleRow(SYM2[S.z], at, '#C7D2E0', 'الذرّة · ' + L(at + ' pm')));
        w.append(circleRow(i.s, i.r, pos ? '#C9A227' : '#7E97B6', 'الأيون · ' + L(i.r + ' pm')));
        body.append(w);
        body.append(el('div', 'acv ' + (pos ? 'acwarn' : 'acok'),
          '<b>الأيون ' + (pos ? 'أصغر' : 'أكبر') + ' من ذرّته</b><span>' + (pos
            ? '<b>فقد</b> الإلكترونات يُقلّل عدد المستويات الرئيسة ، ويزيد جذب النواة للإلكترونات الباقية في المستوى الخارجي — <b>فينكمش</b>.'
            : '<b>كسب</b> الإلكترونات يزيد عدد إلكترونات المستوى الخارجي ، <b>فيزيد التنافر</b> بينها — <b>فينتفخ</b>.') + '</span>'));
        body.append(el('div', 'sl note', 'وعدد البروتونات <b>لم يتغيّر</b> ( ' + L(S.z) + ' ) في الحالتين ، فالتغيّر في الإلكترونات وحدها.'));
      }
    }
    mkbar(); draw();
  }

  window.SIMS.aufbau = aufbau;
  window.SIMS.hund = hund;
  window.SIMS.ionsize = ionsize;
})();

/* ===== محاكاة القوى والحركة ( فيزياء التاسع — الوحدة الثانية ) ===== */
(function () {
  const el = (t, c, h) => { const e = document.createElement(t); if (c) e.className = c; if (h !== undefined) e.innerHTML = h; return e; };
  const btn = (txt, cls, fn) => { const b = el('button', 'sb ' + (cls || ''), txt); b.onclick = fn; return b; };
  const L = s => '<span class="ltr">' + s + '</span>';
  const sel = (lab, val, opts, fn) => {
    const w = el('label', 'sf'); w.append(el('span', '', lab));
    const s = document.createElement('select');
    opts.forEach(o => { const p = document.createElement('option'); p.value = o[0]; p.textContent = o[1]; if (String(o[0]) === String(val)) p.selected = true; s.append(p); });
    s.onchange = () => fn(s.value); w.append(s); return w;
  };
  const sld = (lab, val, lo, hi, step, fn) => {
    const w = el('label', 'sf'); const sp = el('span', '', lab);
    w.append(sp);
    const r = document.createElement('input');
    r.type = 'range'; r.min = lo; r.max = hi; r.step = step; r.value = val;
    r.oninput = () => fn(+r.value, sp);
    w.append(r); return w;
  };
  const r2 = v => Math.round(v * 100) / 100;
  const nf = v => { const x = r2(v); return (Object.is(x, -0) ? 0 : x).toString().replace('-', '−'); };
  const svgOpen = (W, H) => '<svg viewBox="0 0 ' + W + ' ' + H + '" width="100%" height="' + H + '" preserveAspectRatio="xMidYMid meet" aria-hidden="true">';
  /* سهم من (x1,y1) إلى (x2,y2) */
  const arr = (x1, y1, x2, y2, col, w) => {
    const dx = x2 - x1, dy = y2 - y1, len = Math.hypot(dx, dy);
    if (len < 2) return '';
    const ux = dx / len, uy = dy / len, h = Math.min(8, len * 0.6);
    const bx = x2 - ux * h, by = y2 - uy * h;
    return '<line x1="' + x1.toFixed(1) + '" y1="' + y1.toFixed(1) + '" x2="' + bx.toFixed(1) + '" y2="' + by.toFixed(1) + '" stroke="' + col + '" stroke-width="' + (w || 3) + '"/>'
      + '<polygon points="' + x2.toFixed(1) + ',' + y2.toFixed(1) + ' ' + (bx - uy * 4.5).toFixed(1) + ',' + (by + ux * 4.5).toFixed(1) + ' ' + (bx + uy * 4.5).toFixed(1) + ',' + (by - ux * 4.5).toFixed(1) + '" fill="' + col + '"/>';
  };
  const info = () => {
    const box = el('div', 'cyinfo');
    box.row = (k, v) => box.append(el('div', 'cyrow', '<span class="cyk">' + k + '</span><span class="cyv">' + v + '</span>'));
    return box;
  };
  const verdict = (cls, b, s) => el('div', 'acv' + (cls ? ' ' + cls : ''), '<b>' + b + '</b><span>' + s + '</span>');

  /* ---------------- 1 · تصنيف القوى ---------------- */
  const FC = [
    ['ركل اللاعب الكرة بقدمه', 'c', 'القدم تلامس الكرة ، ولو ابتعدت عنها لما أثّرت.'],
    ['وزن كتاب موضوع على طاولة', 'd', 'الأرض تجذب الكتاب ولو رُفع عن الطاولة ؛ التلامس مع الطاولة لا يُغيّر نوع الوزن.'],
    ['القوّة العمودية من الطاولة على الكتاب', 'c', 'تختفي إذا رُفع الكتاب عن سطح الطاولة.'],
    ['جذب المغناطيس لمسمار من الحديد', 'd', 'يجذبه قبل أن يلمسه.'],
    ['شدّ الحبل لدلو مربوط به', 'c', 'لو انفصل الحبل عن الدلو لزالت القوّة.'],
    ['جذب البالون المشحون لقصاصات الورق', 'd', 'قوّة كهربائية تظهر والفجوة موجودة.'],
    ['احتكاك الأرض بقرص ينزلق عليها', 'c', 'الاحتكاك يحتاج إلى تلامس السطحين.'],
    ['مقاومة الهواء لحركة المظلّة', 'c', 'جزيئات الهواء تلامس سطح المظلّة ، وتختفي المقاومة في الفراغ.'],
    ['جذب الأرض للقمر', 'd', 'بينهما فضاء واسع بلا تلامس.'],
    ['دفع اليد لعربة التسوّق', 'c', 'اليد تلامس مقبض العربة.']
  ];
  function fclass(host) {
    host.innerHTML = '';
    const S = { ans: {} };
    const bar = el('div', 'srow'), body = el('div');
    host.append(bar, body);
    bar.append(btn('ابدأ من جديد', 'gh', () => { S.ans = {}; draw(); }));
    function draw() {
      body.innerHTML = '';
      body.append(el('p', 'shint', 'صنّف كلّ قوّة . وقبل أن تضغط ، اسأل : <b>لو ظهرت فجوة صغيرة بين الجسمين ، هل تبقى القوّة ؟</b>'));
      const wrap = el('div', 'fzcards');
      FC.forEach((f, i) => {
        const a = S.ans[i];
        const c = el('div', 'fzcard' + (a ? (a === f[1] ? ' fzok' : ' fzno') : ''));
        c.append(el('div', 'fzname', f[0]));
        const bs = el('div', 'fzbtns');
        [['c', 'تلامس'], ['d', 'تأثير عن بُعد']].forEach(o => {
          const b = el('button', 'fzpick' + (a === o[0] ? ' fzon' : ''), o[1]);
          b.onclick = () => { S.ans[i] = o[0]; draw(); };
          bs.append(b);
        });
        c.append(bs);
        if (a) c.append(el('div', 'fzwhy', (a === f[1] ? '✔ ' : '✘ الصحيح : <b>' + (f[1] === 'c' ? 'تلامس' : 'تأثير عن بُعد') + '</b> — ') + f[2]));
        wrap.append(c);
      });
      body.append(wrap);
      const done = Object.keys(S.ans).length, ok = Object.keys(S.ans).filter(i => S.ans[i] === FC[i][1]).length;
      if (done === FC.length) {
        body.append(verdict(ok === FC.length ? 'acok' : 'acwarn', ok + ' من ' + FC.length,
          ok === FC.length ? 'أتقنتَ التصنيف . ولاحظ أنّ قوى التأثير عن بُعد ثلاث فقط : الجاذبية والمغناطيسية والكهربائية.'
            : 'راجع البطاقات الحمراء . أكثر الخلط في الوزن : الجسم يلامس السطح ، لكنّ وزنه جذب من الأرض لا يحتاج إلى تلامس.'));
      } else body.append(el('p', 'shint', 'صنّفتَ ' + done + ' من ' + FC.length + ' .'));
    }
    draw();
  }

  /* ---------------- 2 · القوّة المحصّلة والقانون الثاني ---------------- */
  const NP = {
    rev: { n: 'ثلاث قوى ( مراجعة الدرس )', R1: 10, R2: 8, Lf: 12, m: 8, max: 30, st: 1, mlo: 1, mhi: 20, mst: 1 },
    box: { n: 'صندوق : سحب واحتكاك', R1: 60, R2: 0, Lf: 20, m: 10, max: 100, st: 5, mlo: 1, mhi: 20, mst: 1 },
    car: { n: 'سيارة بسرعة ثابتة', R1: 2000, R2: 0, Lf: 2000, m: 1400, max: 4000, st: 100, mlo: 800, mhi: 2000, mst: 100 },
    car2: { n: 'زادت قوّة المحرّك', R1: 3000, R2: 0, Lf: 2000, m: 1400, max: 4000, st: 100, mlo: 800, mhi: 2000, mst: 100 }
  };
  function netf(host) {
    host.innerHTML = '';
    const S = Object.assign({ k: 'rev' }, NP.rev);
    const bar = el('div', 'srow'), body = el('div');
    host.append(bar, body);
    function mkbar() {
      bar.innerHTML = '';
      bar.append(sel('الموقف', S.k, Object.keys(NP).map(k => [k, NP[k].n]), v => { Object.assign(S, NP[v], { k: v }); mkbar(); draw(); }));
      const mk = (key, lab) => {
        const r = el('div', 'srow');
        r.append(sld(lab + ' : ' + L(S[key] + ' N'), S[key], 0, S.max, S.st, (v, sp) => { S[key] = v; sp.innerHTML = lab + ' : ' + L(v + ' N'); draw(); }));
        bar.append(r);
      };
      mk('R1', 'قوّة نحو اليمين ①');
      mk('R2', 'قوّة نحو اليمين ②');
      mk('Lf', 'قوّة نحو اليسار');
      const r = el('div', 'srow');
      r.append(sld('الكتلة : ' + L(S.m + ' kg'), S.m, S.mlo, S.mhi, S.mst, (v, sp) => { S.m = v; sp.innerHTML = 'الكتلة : ' + L(v + ' kg'); draw(); }));
      bar.append(r);
    }
    function draw() {
      body.innerHTML = '';
      const net = S.R1 + S.R2 - S.Lf, a = net / S.m;
      const W = 300, H = 128, cx = 150, sc = 105 / S.max;
      let s = svgOpen(W, H);
      s += '<line x1="10" y1="70" x2="290" y2="70" stroke="#c3ccd8" stroke-width="1.4"/>';
      s += '<rect x="' + (cx - 22) + '" y="36" width="44" height="34" rx="4" fill="#E8EEF6" stroke="#1F3A5F" stroke-width="1.5"/>';
      if (S.R1) s += arr(cx + 22, 46, cx + 22 + S.R1 * sc, 46, '#B3261E', 3);
      if (S.R2) s += arr(cx + 22, 60, cx + 22 + S.R2 * sc, 60, '#E07B39', 3);
      if (S.Lf) s += arr(cx - 22, 53, cx - 22 - S.Lf * sc, 53, '#2F6B3A', 3);
      if (net) s += arr(cx, 104, cx + net * sc, 104, '#1F3A5F', 4);
      else s += '<circle cx="' + cx + '" cy="104" r="4" fill="#1F3A5F"/>';
      s += '<text x="' + cx + '" y="124" direction="ltr" text-anchor="middle" font-size="10" fill="#1F3A5F">ΣF = ' + nf(net) + ' N</text>';
      s += '</svg>';
      body.append(el('p', 'shint', 'الأسهم فوقُ هي القوى ، والسهم الأزرق تحتُ هو <b>المحصّلة</b> . وطول كلّ سهم يتناسب مع مقدار قوّته.'));
      body.append(el('div', 'dpw', s));
      const box = info();
      box.row('اليمين موجب', L('ΣF = (+' + S.R1 + ') + (+' + S.R2 + ') + (−' + S.Lf + ') = ' + nf(net) + ' N'));
      box.row('اتجاه المحصّلة', net > 0 ? 'نحو <b>اليمين</b> ( الإشارة موجبة )' : net < 0 ? 'نحو <b>اليسار</b> ( الإشارة سالبة )' : '<b>لا اتجاه</b> — المحصّلة صفر');
      box.row('التسارع', L('a = ΣF / m = ' + nf(net) + ' / ' + S.m + ' = ' + nf(a) + ' m/s²'));
      body.append(box);
      if (!net) body.append(verdict('acok', 'القوى متّزنة — القانون الأول', 'المحصّلة صفر مع أنّ القوى ليست صفرًا . فالجسم إمّا <b>ساكن</b> يبقى ساكنًا ، وإمّا <b>متحرّك</b> يبقى بسرعة ثابتة في خطّ مستقيم.'));
      else body.append(verdict('', 'يتسارع نحو ' + (net > 0 ? 'اليمين' : 'اليسار') + ' — القانون الثاني', 'المحصّلة لا تساوي صفرًا ، فتتغيّر سرعته كلّ ثانية بمقدار ' + L(nf(Math.abs(a)) + ' m/s') + ' . فإن كان يتحرّك عكس المحصّلة فهو <b>يتباطأ</b>.'));
      if (S.R1 + S.R2 + S.Lf !== Math.abs(net) && net) body.append(el('div', 'sl note', 'لو جمعتَ المقادير دون إشارات لحصلتَ على ' + L((S.R1 + S.R2 + S.Lf) + ' N') + ' — وهذا أشهر خطأ في المحصّلة.'));
    }
    mkbar(); draw();
  }

  /* ---------------- 3 · القانون الأول : قرص على ثلاثة سطوح ---------------- */
  const SURF = { smooth: { n: 'أملس', d: 0, c: '#dfe8f3' }, rough: { n: 'خشن', d: 1.5, c: '#c9b79a' }, sand: { n: 'مغطّى بالرمل', d: 4, c: '#d8b56a' } };
  function inertia(host) {
    host.innerHTML = '';
    const S = { k: 'rough', v: 6 };
    const bar = el('div', 'srow'), body = el('div');
    host.append(bar, body);
    function mkbar() {
      bar.innerHTML = '';
      const cards = el('div', 'fzseg');
      Object.keys(SURF).forEach(k => {
        const b = el('button', 'fzsb' + (S.k === k ? ' fzon' : ''), 'سطح ' + SURF[k].n);
        b.onclick = () => { S.k = k; mkbar(); draw(); };
        cards.append(b);
      });
      bar.append(cards);
      const r = el('div', 'srow');
      r.append(sld('سرعة القرص لحظة انفصال اليد : ' + L(S.v + ' m/s'), S.v, 2, 8, 1, (v, sp) => { S.v = v; sp.innerHTML = 'سرعة القرص لحظة انفصال اليد : ' + L(v + ' m/s'); draw(); }));
      bar.append(r);
    }
    function draw() {
      body.innerHTML = '';
      const d = SURF[S.k].d, tStop = d ? S.v / d : Infinity, T = 6;
      const pos = t => d ? (t >= tStop ? S.v * tStop / 2 : S.v * t - d * t * t / 2) : S.v * t;
      const xmax = Math.max(10, S.v * T), W = 300, H = 120, x0 = 18, sx = (W - 30) / xmax;
      let lastLab = -99;
      let s = svgOpen(W, H);
      s += '<rect x="8" y="70" width="' + (W - 16) + '" height="10" fill="' + SURF[S.k].c + '"/>';
      for (let t = 0; t <= T; t++) {
        const x = x0 + pos(t) * sx;
        s += '<ellipse cx="' + x.toFixed(1) + '" cy="64" rx="7" ry="4" fill="#7E97B6" opacity="' + (0.35 + 0.1 * t) + '" stroke="#1F3A5F" stroke-width=".8"/>';
        if ((!d || t <= tStop) && x - lastLab >= 18) { s += '<text x="' + x.toFixed(1) + '" y="96" direction="ltr" text-anchor="middle" font-size="8.5" fill="#8894a6">' + t + ' s</text>'; lastLab = x; }
      }
      /* القوى على القرص الأخير */
      const xl = x0 + pos(Math.min(T, tStop)) * sx;
      s += arr(xl, 58, xl, 30, '#2F6B3A', 2.4) + arr(xl, 70, xl, 108, '#B3261E', 2.4);
      if (d && tStop > 0) {
        const xm = x0 + pos(Math.min(tStop, 1)) * sx;
        s += arr(xm - 8, 64, xm - 30, 64, '#E07B39', 2.4);
      }
      s += '</svg>';
      body.append(el('p', 'shint', 'القرص مرسوم <b>مرّة كلّ ثانية</b> بعد انفصال اليد ، بمقياس واحد للسطوح الثلاثة . الأخضر القوّة العمودية ، والأحمر الوزن ، والبرتقالي الاحتكاك.'));
      body.append(el('div', 'dpw', s));
      const box = info();
      box.row('القوى الرأسية', 'القوّة العمودية ' + L('F<sub>N</sub>') + ' تساوي الوزن ' + L('F<sub>g</sub>') + ' ، فمحصّلتهما <b>صفر</b>');
      box.row('القوّة الأفقية', d ? 'الاحتكاك وحده ، <b>عكس الحركة</b>' : '<b>لا شيء</b> — المحصّلة الأفقية صفر');
      box.row('ما يحدث لسرعته', d ? 'تتناقص بمقدار ' + L(d + ' m/s') + ' كلّ ثانية' : 'تبقى ' + L(S.v + ' m/s') + ' ثابتة');
      box.row('المسافة حتى يتوقّف', d ? L(nf(S.v * S.v / (2 * d)) + ' m') + ' خلال ' + L(nf(tStop) + ' s') : '<b>لا يتوقّف</b> — في ' + L(T + ' s') + ' قطع ' + L(S.v * T + ' m') + ' ويستمرّ');
      body.append(box);
      if (!d) body.append(verdict('acok', 'القانون الأول', 'لا قوّة محصّلة ، فيحافظ القرص على حالته : <b>خطّ مستقيم وسرعة ثابتة</b> ، والنقاط متباعدة بالتساوي . لم يتوقّف لأنّه لا شيء يوقفه.'));
      else body.append(verdict('acwarn', 'يتوقّف — لكن ليس « من تلقاء نفسه »', 'الاحتكاك قوّة محصّلة عكس الحركة ، فتتقارب النقاط حتى يقف . وكلّما زادت خشونة السطح كان التوقّف أسرع — وهذا ما رأيته في التجربة الاستهلالية.'));
    }
    mkbar(); draw();
  }

  /* ---------------- 4 · السرعة الثابتة والتسارع الثابت ( الشكل 5 ) ---------------- */
  function strobe(host, mode) {
    host.innerHTML = '';
    const S = mode === 'a' ? { vi: 10, a: 10 } : { vi: 10, a: 0 };
    const bar = el('div', 'srow'), body = el('div');
    host.append(bar, body);
    function mkbar() {
      bar.innerHTML = '';
      bar.append(btn('سرعة ثابتة ( 5 / أ )', 'gh', () => { S.vi = 10; S.a = 0; mkbar(); draw(); }));
      bar.append(btn('تسارع ثابت ( 5 / ب )', 'gh', () => { S.vi = 10; S.a = 10; mkbar(); draw(); }));
      bar.append(btn('مكابح', 'gh', () => { S.vi = 30; S.a = -10; mkbar(); draw(); }));
      const r = el('div', 'srow');
      r.append(sld('السرعة الابتدائية : ' + L('v<sub>i</sub> = ' + S.vi + ' m/s'), S.vi, 0, 30, 5, (v, sp) => { S.vi = v; sp.innerHTML = 'السرعة الابتدائية : ' + L('v<sub>i</sub> = ' + v + ' m/s'); draw(); }));
      bar.append(r);
      const r2_ = el('div', 'srow');
      r2_.append(sld('التسارع : ' + L('a = ' + nf(S.a) + ' m/s²'), S.a, -10, 10, 1, (v, sp) => { S.a = v; sp.innerHTML = 'التسارع : ' + L('a = ' + nf(v) + ' m/s²'); draw(); }));
      bar.append(r2_);
    }
    function draw() {
      body.innerHTML = '';
      const T = 3, ts = S.a < 0 ? S.vi / -S.a : Infinity;
      const v = t => (t >= ts ? 0 : S.vi + S.a * t);
      const x = t => { const u = Math.min(t, ts); return S.vi * u + S.a * u * u / 2; };
      const xs = [0, 1, 2, 3].map(x), vs = [0, 1, 2, 3].map(v);
      const W = 300, H = 92, span = Math.max(30, ...xs.map(Math.abs)), sx = (W - 60) / span;
      let s = svgOpen(W, H);
      s += '<line x1="10" y1="62" x2="' + (W - 10) + '" y2="62" stroke="#c3ccd8" stroke-width="1.2"/>';
      xs.forEach((p, i) => {
        const cxp = 22 + Math.max(0, p) * sx;
        s += '<rect x="' + (cxp - 12).toFixed(1) + '" y="44" width="24" height="12" rx="4" fill="#C0392B" opacity="' + (0.45 + 0.18 * i) + '"/>';
        s += '<circle cx="' + (cxp - 6).toFixed(1) + '" cy="58" r="3" fill="#333"/><circle cx="' + (cxp + 6).toFixed(1) + '" cy="58" r="3" fill="#333"/>';
        s += '<text x="' + cxp.toFixed(1) + '" y="36" direction="ltr" text-anchor="middle" font-size="9" fill="#1F3A5F">' + nf(vs[i]) + ' m/s</text>';
        s += '<text x="' + cxp.toFixed(1) + '" y="78" direction="ltr" text-anchor="middle" font-size="8.5" fill="#8894a6">t=' + i + '</text>';
      });
      s += '</svg>';
      body.append(el('p', 'shint', 'السيارة مرسومة <b>مرّة كلّ ثانية</b> ، وفوق كلّ صورة سرعتها في تلك اللحظة — كما في الشكل ( 5 ).'));
      body.append(el('div', 'dpw', s));
      const tb = el('div', 'mgtab fzstab'), hd = el('div', 'mgtr mghd');
      ['الزمن', 'السرعة', 'الإزاحة في الثانية'].forEach(h => hd.append(el('span', 'mgtc', h)));
      tb.append(hd);
      [0, 1, 2, 3].forEach(i => {
        const tr = el('div', 'mgtr');
        tr.append(el('span', 'mgtc', L(i + ' s')), el('span', 'mgtc', L(nf(vs[i]) + ' m/s')), el('span', 'mgtc', i ? L(nf(xs[i] - xs[i - 1]) + ' m') : '—'));
        tb.append(tr);
      });
      const w = el('div', 'mgwrap'); w.append(tb); body.append(w);
      const box = info();
      const tE = Math.min(T, ts), aa = tE > 0 ? (v(tE) - S.vi) / tE : 0;
      if (!S.a || !S.vi && S.a < 0) {
        box.row('السرعة', L('v = Δx / Δt = ' + nf(xs[3]) + ' / 3 = ' + nf(xs[3] / 3) + ' m/s'));
        body.append(box);
        body.append(verdict('acok', S.vi ? 'سرعة ثابتة — حركة منتظمة' : 'ساكنة', S.vi ? 'إزاحات <b>متساوية</b> في أزمنة متساوية ، والسرعة لا تتغيّر ، والقوّة المحصّلة <b>صفر</b>.' : 'لا سرعة ولا تسارع ، فلا حركة.'));
        return;
      }
      box.row('التسارع', L('a = (v<sub>f</sub> − v<sub>i</sub>) / Δt = (' + nf(v(tE)) + ' − ' + S.vi + ') / ' + nf(tE) + ' = ' + nf(aa) + ' m/s²') + (tE < T ? ' — حتى لحظة التوقّف' : ''));
      if (ts < T) box.row('لحظة التوقّف', L('v<sub>f</sub> = v<sub>i</sub> + a Δt = ' + S.vi + ' + (' + nf(S.a) + ' × ' + nf(ts) + ') = 0') + ' — توقّفت عند ' + L(nf(ts) + ' s') + ' ، ثمّ بقيت ساكنة');
      else box.row('السرعة بعد ' + L('3 s'), L('v<sub>f</sub> = v<sub>i</sub> + a Δt = ' + S.vi + ' + (' + nf(S.a) + ' × 3) = ' + nf(S.vi + S.a * 3) + ' m/s'));
      body.append(box);
      if (S.a > 0) body.append(verdict('acok', 'تسارع ثابت — متسارعة', 'السرعة تزيد ' + L(S.a + ' m/s') + ' كلّ ثانية ، والإزاحات في الثواني المتتالية <b>تكبر</b> . إشارتا السرعة والتسارع <b>متشابهتان</b>.'));
      else body.append(verdict('acwarn', 'تسارع ثابت — متباطئة', 'السرعة تنقص ' + L(-S.a + ' m/s') + ' كلّ ثانية ، والإزاحات <b>تصغر</b> . إشارتا السرعة والتسارع <b>مختلفتان</b>.'));
      body.append(el('div', 'sl note', 'في الحالتين القوّة المحصّلة <b>لا تساوي صفرًا</b> ، وهي ثابتة لأنّ التسارع ثابت . وفي السرعة الثابتة وحدها تكون صفرًا.'));
    }
    mkbar(); draw();
  }

  /* ---------------- 5 · القانون الثاني : عربتان ( الشكل 6 ) ---------------- */
  function law2(host) {
    host.innerHTML = '';
    const F0 = 10, M0 = 2;
    const S = { F: 20, m: 2 };
    const bar = el('div', 'srow'), body = el('div');
    host.append(bar, body);
    function mkbar() {
      bar.innerHTML = '';
      bar.append(btn('ضاعف القوّة', 'gh', () => { S.F = 20; S.m = 2; mkbar(); draw(); }));
      bar.append(btn('نصف الكتلة', 'gh', () => { S.F = 10; S.m = 1; mkbar(); draw(); }));
      bar.append(btn('ضاعفهما معًا', 'gh', () => { S.F = 20; S.m = 4; mkbar(); draw(); }));
      const a = el('div', 'srow');
      a.append(sld('القوّة المحصّلة : ' + L(S.F + ' N'), S.F, 5, 40, 5, (v, sp) => { S.F = v; sp.innerHTML = 'القوّة المحصّلة : ' + L(v + ' N'); draw(); }));
      bar.append(a);
      const b = el('div', 'srow');
      b.append(sld('الكتلة : ' + L(S.m + ' kg'), S.m, 1, 8, 1, (v, sp) => { S.m = v; sp.innerHTML = 'الكتلة : ' + L(v + ' kg'); draw(); }));
      bar.append(b);
    }
    function cart(y, F, m, a, col) {
      const w = 34 + m * 6;
      let s = '<rect x="20" y="' + y + '" width="' + w + '" height="22" rx="3" fill="' + col + '" stroke="#1F3A5F" stroke-width="1.2"/>';
      s += '<circle cx="30" cy="' + (y + 26) + '" r="4.5" fill="#fff" stroke="#1F3A5F"/><circle cx="' + (20 + w - 10) + '" cy="' + (y + 26) + '" r="4.5" fill="#fff" stroke="#1F3A5F"/>';
      s += '<text x="' + (20 + w / 2) + '" y="' + (y + 15) + '" direction="ltr" text-anchor="middle" font-size="9.5" fill="#1F3A5F">' + m + ' kg</text>';
      s += arr(20 + w, y + 8, 20 + w + F * 2, y + 8, '#B3261E', 2.6);
      s += arr(20 + w, y + 18, 20 + w + a * 3, y + 18, '#2F6B3A', 2);
      s += '<text x="' + (24 + w + Math.max(F * 2, a * 3)) + '" y="' + (y + 16) + '" direction="ltr" font-size="9" fill="#5b6b80">a = ' + nf(a) + '</text>';
      return s;
    }
    function draw() {
      body.innerHTML = '';
      const a0 = F0 / M0, a = S.F / S.m;
      let s = svgOpen(300, 112);
      s += cart(8, F0, M0, a0, '#dfe8f3');
      s += cart(62, S.F, S.m, a, '#F6E7C1');
      s += '</svg>';
      body.append(el('p', 'shint', 'العربة الأولى <b>مرجع ثابت</b> ، والثانية تتحكّم فيها . الأحمر القوّة المحصّلة ، والأخضر التسارع.'));
      body.append(el('div', 'dpw', s));
      const box = info();
      box.row('المرجع', L('a = ' + F0 + ' / ' + M0 + ' = ' + a0 + ' m/s²'));
      box.row('عربتك', L('a = ΣF / m = ' + S.F + ' / ' + S.m + ' = ' + nf(a) + ' m/s²'));
      const kF = S.F / F0, kM = S.m / M0, kA = a / a0;
      box.row('المقارنة', 'القوّة × ' + L(nf(kF)) + ' · الكتلة × ' + L(nf(kM)) + ' ← التسارع × ' + L(nf(kF) + ' ÷ ' + nf(kM) + ' = ' + nf(kA)));
      body.append(box);
      let msg;
      if (kM === 1 && kF !== 1) msg = 'الكتلة ثابتة ، فالتسارع تغيّر <b>بنسبة تغيّر القوّة نفسها</b> — تناسب طردي ( الشكل 6 / أ ).';
      else if (kF === 1 && kM !== 1) msg = 'القوّة ثابتة ، فالتسارع تغيّر <b>بعكس نسبة تغيّر الكتلة</b> — تناسب عكسي ( الشكل 6 / ب ).';
      else if (kF === kM) msg = 'تغيّرت القوّة والكتلة بالنسبة نفسها ، <b>فبقي التسارع كما هو</b> : ما زادته القوّة أنقصته الكتلة.';
      else msg = 'القوّة في البسط تزيد التسارع ، والكتلة في المقام تُنقصه : ' + L('a = F / m');
      body.append(verdict(kA === 1 ? '' : 'acok', 'التسارع × ' + nf(kA), msg));
    }
    mkbar(); draw();
  }

  /* ---------------- 6 · أزواج الفعل وردّ الفعل ---------------- */
  const PR = {
    walk: { n: 'المشي', A: 'القدم', B: 'الأرض', ab: 'تدفع القدمُ الأرضَ', dab: 'w', ba: 'تدفع الأرضُ القدمَ', dba: 'e', ty: 'دفع ( تلامس )', F: 600,
      x: 'القوّة على <b>القدم</b> نحو الأمام هي التي تُحرّك الماشي . والأرض لا تتحرّك ظاهريًّا لأنّ كتلتها هائلة ، فتسارعها أصغر من أن يُقاس.' },
    hammer: { n: 'المطرقة والمسمار', A: 'المطرقة', B: 'المسمار', ab: 'تدفع المطرقةُ المسمارَ', dab: 's', ba: 'يدفع المسمارُ المطرقةَ', dba: 'n', ty: 'دفع ( تلامس )', F: 200,
      x: 'القوّتان متساويتان ، لكنّ الأولى في المسمار فتُدخله في الخشب ، والثانية في المطرقة فتوقفها . لا تُلغي إحداهما الأخرى لأنّهما في <b>جسمين مختلفين</b>.' },
    fall: { n: 'كرة تسقط', A: 'الأرض', B: 'الكرة', ab: 'تجذب الأرضُ الكرةَ ( الوزن )', dab: 's', ba: 'تجذب الكرةُ الأرضَ', dba: 'n', ty: 'جذب ( تأثير عن بُعد )', F: 5,
      x: 'الجذب متبادل : الكرة تجذب الأرض إلى الأعلى بقوّة تساوي وزنها . والكرة هي التي تتسارع نحو الأرض لأنّ كتلتها صغيرة جدًّا مقارنةً بكتلة الأرض.' },
    crash: { n: 'تصادم سيارة وشاحنة', A: 'الشاحنة', B: 'السيارة', ab: 'تدفع الشاحنةُ السيارةَ', dab: 'w', ba: 'تدفع السيارةُ الشاحنةَ', dba: 'e', ty: 'دفع ( تلامس )', F: 20000, crash: true, x: '' },
    book: { n: 'كتاب على طاولة', book: true }
  };
  const DIRS = { e: 'نحو اليمين', w: 'نحو اليسار', n: 'نحو الأعلى', s: 'نحو الأسفل' };
  const darr = (d, col) => {
    const P = { e: [6, 14, 40, 14], w: [40, 14, 6, 14], n: [23, 26, 23, 2], s: [23, 2, 23, 26] }[d];
    return '<svg viewBox="0 0 46 28" width="46" height="28" aria-hidden="true">' + arr(P[0], P[1], P[2], P[3], col, 3) + '</svg>';
  };
  function pairs(host) {
    host.innerHTML = '';
    const S = { k: 'walk', mc: 1000, mt: 8000 };
    const bar = el('div', 'srow'), body = el('div');
    host.append(bar, body);
    function mkbar() {
      bar.innerHTML = '';
      bar.append(sel('الموقف', S.k, Object.keys(PR).map(k => [k, PR[k].n]), v => { S.k = v; mkbar(); draw(); }));
      if (PR[S.k].crash) {
        const a = el('div', 'srow');
        a.append(sld('كتلة السيارة : ' + L(S.mc + ' kg'), S.mc, 600, 2000, 100, (v, sp) => { S.mc = v; sp.innerHTML = 'كتلة السيارة : ' + L(v + ' kg'); draw(); }));
        bar.append(a);
        const b = el('div', 'srow');
        b.append(sld('كتلة الشاحنة : ' + L(S.mt + ' kg'), S.mt, 3000, 15000, 500, (v, sp) => { S.mt = v; sp.innerHTML = 'كتلة الشاحنة : ' + L(v + ' kg'); draw(); }));
        bar.append(b);
      }
    }
    const fcard = (on, by, txt, d, col, F, tag) => {
      const c = el('div', 'fzpc');
      c.innerHTML = '<div class="fzpon">في <b>' + on + '</b></div>' + darr(d, col)
        + '<div class="fzptx">' + txt + '</div><div class="fzpmeta">' + (F !== null ? L(F + ' N') + ' · ' : '') + DIRS[d] + '</div>' + (tag ? '<div class="fzptag" style="background:' + col + '">' + tag + '</div>' : '');
      return c;
    };
    function draw() {
      body.innerHTML = '';
      const P = PR[S.k];
      if (P.book) {
        body.append(el('p', 'shint', 'أربع قوى في هذا الموقف . <b>اللون نفسه = زوج فعل وردّ فعل</b>.'));
        const g = el('div', 'fzpgrid');
        g.append(fcard('الكتاب', 'الأرض', 'تجذب الأرضُ الكتابَ ( الوزن )', 's', '#B3261E', 15, 'زوج ①'));
        g.append(fcard('الأرض', 'الكتاب', 'يجذب الكتابُ الأرضَ', 'n', '#B3261E', 15, 'زوج ①'));
        g.append(fcard('الكتاب', 'الطاولة', 'تدفع الطاولةُ الكتابَ ( القوّة العمودية )', 'n', '#2F6B3A', 15, 'زوج ②'));
        g.append(fcard('الطاولة', 'الكتاب', 'يدفع الكتابُ الطاولةَ', 's', '#2F6B3A', 15, 'زوج ②'));
        body.append(g);
        body.append(verdict('acwarn', 'الوزن والقوّة العمودية ليسا زوجًا', 'كلاهما يؤثّر في <b>الكتاب نفسه</b> ، ومن نوعين مختلفين ( جذب وتلامس ) ، فهما قوّتان <b>متّزنتان</b> ( القانون الأول ) . أمّا ردّ فعل الوزن فهو جذب الكتاب للأرض ، وردّ فعل القوّة العمودية دفع الكتاب للطاولة.'));
        return;
      }
      body.append(el('p', 'shint', 'كلّ بطاقة قوّة واحدة ، ومكتوب أعلاها <b>الجسم الذي تؤثّر فيه</b>.'));
      const g = el('div', 'fzpgrid');
      g.append(fcard(P.B, P.A, P.ab, P.dab, '#B3261E', P.F, 'الفعل'));
      g.append(fcard(P.A, P.B, P.ba, P.dba, '#1F3A5F', P.F, 'ردّ الفعل'));
      body.append(g);
      const box = info();
      box.row('المقدار', 'متساويان : ' + L(P.F + ' N') + ' و ' + L(P.F + ' N'));
      box.row('الاتجاه', 'متعاكسان : ' + DIRS[P.dab] + ' و ' + DIRS[P.dba]);
      box.row('النوع', 'واحد : ' + P.ty);
      box.row('الجسم الذي تؤثّر فيه', '<b>مختلف</b> : ' + P.B + ' و ' + P.A + ' — فلا يُجمعان ولا يُلغي أحدهما الآخر');
      if (P.crash) {
        const ac = P.F / S.mc, at = P.F / S.mt;
        box.row('تسارع السيارة', L('a = ' + P.F + ' / ' + S.mc + ' = ' + nf(ac) + ' m/s²'));
        box.row('تسارع الشاحنة', L('a = ' + P.F + ' / ' + S.mt + ' = ' + nf(at) + ' m/s²'));
      }
      body.append(box);
      if (P.crash) body.append(verdict('acok', 'القوّتان متساويتان ، والأثر مختلف', 'القانون الثالث يُخبرك أنّ القوّتين متساويتان مهما اختلفت الكتلتان . والقانون الثاني يُخبرك أنّ تسارع السيارة أكبر ' + L(nf(S.mt / S.mc)) + ' مِثْل تسارع الشاحنة ، فتتغيّر سرعتها أكثر ويكون الضرر فيها أكبر.'));
      else body.append(el('div', 'sl note', P.x));
    }
    mkbar(); draw();
  }

  /* ---------------- 7 · السقوط مع مقاومة الهواء وبدونها ---------------- */
  const OBJ = { coin: { n: 'قطعة النقود', vt: 30 }, flat: { n: 'الورقة المسطّحة', vt: 1.1 }, ball: { n: 'كرة الورق', vt: 4.5 }, hammer: { n: 'المطرقة', vt: 60 }, feather: { n: 'الريشة', vt: 0.6 } };
  const FP = { cp: { n: 'قطعة نقود وورقة', a: 'coin', b: 'flat', h: 2 }, bp: { n: 'كرة ورق وورقة مماثلة', a: 'ball', b: 'flat', h: 2 }, hf: { n: 'مطرقة وريشة', a: 'hammer', b: 'feather', h: 1.6 } };
  function fallRun(vt, g, h, air) {
    let y = 0, v = 0, i = 0;
    const dt = 0.001, marks = [0];
    while (y < h && i < 60000) {
      const acc = air ? g * (1 - v * v / (vt * vt)) : g;
      v += acc * dt; y += v * dt; i++;
      if (i % 100 === 0) marks.push(Math.min(y, h));
    }
    return { t: i * dt, v, marks };
  }
  function fall(host) {
    host.innerHTML = '';
    const S = { k: 'cp', air: 1 };
    const bar = el('div', 'srow'), body = el('div');
    host.append(bar, body);
    function mkbar() {
      bar.innerHTML = '';
      bar.append(sel('الجسمان', S.k, Object.keys(FP).map(k => [k, FP[k].n]), v => { S.k = v; draw(); }));
      const r = el('div', 'srow');
      r.append(sel('الوسط', S.air, [[1, 'في الهواء'], [0, S.k === 'hf' ? 'دون هواء ( سطح القمر )' : 'دون هواء ( أنبوب مفرّغ )']], v => { S.air = +v; draw(); }));
      bar.append(r);
    }
    function draw() {
      mkbar();
      body.innerHTML = '';
      const P = FP[S.k], A = OBJ[P.a], B = OBJ[P.b];
      const g = (!S.air && S.k === 'hf') ? 1.62 : 9.8;
      const ra = fallRun(A.vt, g, P.h, S.air), rb = fallRun(B.vt, g, P.h, S.air);
      const W = 260, H = 170, top = 12, sy = (H - 24) / P.h;
      const head = el('div', 'fzfh');
      head.append(el('span', '', A.n), el('span', '', B.n));
      body.append(el('p', 'shint', 'موضع كلّ جسم مرسوم <b>كلّ عُشر ثانية</b> : تباعد النقاط يعني سرعة متزايدة ، وتساويه يعني سرعة ثابتة.'));
      const fw = el('div', 'fzfw');
      fw.append(head);
      body.append(fw);
      let s = svgOpen(W, H);
      s += '<line x1="20" y1="' + (top + P.h * sy) + '" x2="' + (W - 20) + '" y2="' + (top + P.h * sy) + '" stroke="#8a6f1a" stroke-width="2"/>';
      [[ra, 65, '#7E97B6'], [rb, 195, '#C9A227']].forEach(([r, x, c]) => {
        s += '<line x1="' + x + '" y1="' + top + '" x2="' + x + '" y2="' + (top + P.h * sy) + '" stroke="#e3e8ef" stroke-dasharray="3 3"/>';
        r.marks.forEach(m => { s += '<circle cx="' + x + '" cy="' + (top + m * sy).toFixed(1) + '" r="3.2" fill="' + c + '"/>'; });
      });
      s += '</svg>';
      fw.append(el('div', '', s));
      const box = info();
      box.row('زمن وصول ' + A.n, L(nf(ra.t) + ' s'));
      box.row('زمن وصول ' + B.n, L(nf(rb.t) + ' s'));
      body.append(box);
      const same = Math.abs(ra.t - rb.t) < 0.02;
      if (same) body.append(verdict('acok', 'وصلا معًا', (S.k === 'hf' ? 'هذه تجربة ديفيد سكوت على القمر عام 1971 : ' : '') + 'بغياب مقاومة الهواء لا تؤثّر في الجسمين إلّا الجاذبية ، فيكتسبان <b>التسارع نفسه</b> مهما اختلفت كتلتاهما وشكلاهما.'));
      else {
        const first = ra.t < rb.t ? A.n : B.n;
        const why = S.k === 'bp' ? 'الكتلتان متساويتان فالوزنان متساويان ، لكنّ <b>مساحة</b> الورقة المسطّحة المعرّضة للهواء أكبر ، فمقاومتها أكبر ومحصّلتها إلى الأسفل أصغر.'
          : 'مقاومة الهواء على ' + first + ' <b>صغيرة مقارنةً بوزنه</b> ، أمّا الجسم الآخر فالمقاومة عليه كبيرة مقارنةً بوزنه فتُبطئه.';
        body.append(verdict('acwarn', 'الأسبق : ' + first, why));
        body.append(el('div', 'sl note', 'غيّر الوسط إلى « دون هواء » وأعد المقارنة : الفرق كلّه سببه الهواء.'));
      }
    }
    draw();
  }

  /* ---------------- 8 · المظلّي ---------------- */
  function skyRun(tOpen) {
    const m = 80, g = 10, W = m * g, c1 = W / (50 * 50), c2 = W / (5 * 5);
    const dt = 0.01, out = [];
    let v = 0;
    for (let i = 0; i <= 4000; i++) {
      const t = i * dt;
      const k = t < tOpen ? 0 : Math.min(1, (t - tOpen) / 2);
      const c = c1 + (c2 - c1) * k;
      const R = c * v * v, a = (W - R) / m;
      if (i % 10 === 0) out.push({ t: r2(t), v, R, a });
      v += a * dt;
    }
    return { W, pts: out };
  }
  function skydive(host) {
    host.innerHTML = '';
    const S = { open: 20, t: 5 };
    const bar = el('div', 'srow'), body = el('div');
    host.append(bar, body);
    function mkbar() {
      bar.innerHTML = '';
      bar.append(btn('لحظة القفز', 'gh', () => { S.t = 1; mkbar(); draw(); }));
      bar.append(btn('سرعة ثابتة', 'gh', () => { S.t = S.open - 2; mkbar(); draw(); }));
      bar.append(btn('فتح المظلّة', 'gh', () => { S.t = S.open + 1; mkbar(); draw(); }));
      bar.append(btn('قرب الأرض', 'gh', () => { S.t = 40; mkbar(); draw(); }));
      const a = el('div', 'srow');
      a.append(sld('الزمن منذ القفز : ' + L(S.t + ' s'), S.t, 0, 40, 1, (v, sp) => { S.t = v; sp.innerHTML = 'الزمن منذ القفز : ' + L(v + ' s'); draw(); }));
      bar.append(a);
      const b = el('div', 'srow');
      b.append(sld('تُفتح المظلّة عند : ' + L(S.open + ' s'), S.open, 12, 30, 1, (v, sp) => { S.open = v; sp.innerHTML = 'تُفتح المظلّة عند : ' + L(v + ' s'); draw(); }));
      bar.append(b);
    }
    function draw() {
      body.innerHTML = '';
      const run = skyRun(S.open), P = run.pts, W = run.W;
      const cur = P[Math.min(P.length - 1, Math.round(S.t * 10))];
      const GW = 300, GH = 120, gx = t => 28 + t / 40 * (GW - 40), gy = v => GH - 18 - v / 60 * (GH - 30);
      let s = svgOpen(GW, GH);
      s += '<line x1="28" y1="' + gy(0) + '" x2="' + (GW - 10) + '" y2="' + gy(0) + '" stroke="#8894a6"/><line x1="28" y1="' + gy(60) + '" x2="28" y2="' + gy(0) + '" stroke="#8894a6"/>';
      [0, 25, 50].forEach(v => { s += '<text x="24" y="' + (gy(v) + 3) + '" direction="ltr" text-anchor="end" font-size="8" fill="#8894a6">' + v + '</text>'; });
      [0, 10, 20, 30, 40].forEach(t => { s += '<text x="' + gx(t) + '" y="' + (GH - 5) + '" direction="ltr" text-anchor="middle" font-size="8" fill="#8894a6">' + t + ' s</text>'; });
      s += '<polyline fill="none" stroke="#1F3A5F" stroke-width="2" points="' + P.filter((p, i) => i % 2 === 0).map(p => gx(p.t).toFixed(1) + ',' + gy(p.v).toFixed(1)).join(' ') + '"/>';
      s += '<line x1="' + gx(S.open) + '" y1="' + gy(60) + '" x2="' + gx(S.open) + '" y2="' + gy(0) + '" stroke="#C9A227" stroke-dasharray="3 3"/>';
      s += '<circle cx="' + gx(cur.t) + '" cy="' + gy(cur.v) + '" r="4.5" fill="#B3261E"/>';
      s += '<text x="34" y="14" direction="ltr" font-size="8.5" fill="#5b6b80">v (m/s)</text>';
      s += '</svg>';
      body.append(el('p', 'shint', 'منحنى السرعة مع الزمن ، والنقطة الحمراء اللحظة المختارة ، والخطّ الذهبي لحظة فتح المظلّة.'));
      body.append(el('div', 'dpw', s));
      /* سهما القوّتين */
      const sc = 30 / W, Rl = cur.R * sc, cap = 62;
      let f = svgOpen(120, 140);
      f += '<circle cx="60" cy="70" r="9" fill="#1F3A5F"/>';
      if (cur.t >= S.open) f += '<path d="M30 42 Q60 10 90 42 Z" fill="#E8C268" stroke="#8a6f1a"/><line x1="32" y1="42" x2="58" y2="64" stroke="#8a6f1a"/><line x1="88" y1="42" x2="62" y2="64" stroke="#8a6f1a"/>';
      f += arr(60, 80, 60, 80 + 30, '#B3261E', 3.5);
      if (Rl > 1) f += arr(60, 60, 60, 60 - Math.min(cap, Rl), '#2F6B3A', 3.5);
      f += '</svg>';
      const fw = el('div', 'fzsky');
      fw.append(el('div', 'dpw', f));
      const lg = el('div', 'fzskyl', '<div><i style="background:#B3261E"></i>الوزن ' + L(W + ' N') + ' — ثابت</div><div><i style="background:#2F6B3A"></i>مقاومة الهواء ' + L(Math.round(cur.R) + ' N') + (Rl > cap ? ' ( السهم مقصوص )' : '') + '</div>');
      fw.append(lg);
      body.append(fw);
      const net = W - cur.R;
      const box = info();
      box.row('السرعة', L(nf(cur.v) + ' m/s') + ' إلى الأسفل');
      box.row('المحصّلة', Math.abs(net) < W * 0.02 ? '<b>صفر تقريبًا</b>' : L(Math.round(Math.abs(net)) + ' N') + ' ' + (net > 0 ? 'إلى <b>الأسفل</b>' : 'إلى <b>الأعلى</b>'));
      body.append(box);
      let v;
      if (Math.abs(net) < W * 0.02) v = verdict('acok', cur.t < S.open ? 'المرحلة ( 3 ) : سرعة ثابتة' : 'سرعة ثابتة أقلّ — هبوط آمن', 'مقاومة الهواء تساوي الوزن ، فالمحصّلة صفر ، فيتحرّك بسرعة ثابتة ( القانون الأول ) ' + (cur.t < S.open ? '. القوّتان موجودتان وكبيرتان ، لكنّهما متساويتان.' : '. والسرعة الآن نحو ' + L(Math.round(cur.v) + ' m/s') + ' بعد أن كانت نحو ' + L('50 m/s') + ' .'));
      else if (net < 0) v = verdict('acwarn', 'يتباطأ وهو ما يزال يهبط', 'المظلّة زادت مساحة السطح فصارت المقاومة أكبر من الوزن ، فالمحصّلة إلى الأعلى ، وهي تُنقص سرعته ولا تجعله يصعد.');
      else if (cur.a > 7) v = verdict('', 'المرحلة ( 1 ) : بداية السقوط', 'السرعة صغيرة فالمقاومة صغيرة ، والمحصّلة إلى الأسفل كبيرة ، فيتسارع تسارعًا كبيرًا.');
      else v = verdict('', 'المرحلة ( 2 ) : ما يزال يتسارع ، لكن أقلّ', 'زادت السرعة فزادت المقاومة ، فصغرت المحصّلة وصغر التسارع ، <b>وسرعته ما تزال تزداد</b>.');
      body.append(v);
    }
    mkbar(); draw();
  }

  /* ---------------- 9 · النابض وحدّ المرونة والميزان النابضي ---------------- */
  const L0 = 15.2, KS = 1.6, LIM = 6;
  const BOOK = { 1: 1.6, 2: 3.3, 3: 4.7, 4: 6.4 };
  const ext = F => (BOOK[F] !== undefined ? BOOK[F] : F <= LIM ? KS * F : KS * F + 0.56 * (F - LIM) * (F - LIM));
  function spring(host, beyond) {
    host.innerHTML = '';
    const S = { F: beyond ? 8 : 2, mx: beyond ? 8 : 2, rel: false };
    const bar = el('div', 'srow'), body = el('div');
    host.append(bar, body);
    function mkbar() {
      bar.innerHTML = '';
      bar.append(btn('أزل القوّة', 'gh', () => { S.rel = true; mkbar(); draw(); }));
      bar.append(btn('نابض جديد', 'gh', () => { S.F = 0; S.mx = 0; S.rel = false; mkbar(); draw(); }));
      const a = el('div', 'srow');
      a.append(sld('القوّة المؤثّرة : ' + L(S.F + ' N'), S.F, 0, 10, 0.5, (v, sp) => { S.F = v; S.rel = false; S.mx = Math.max(S.mx, v); sp.innerHTML = 'القوّة المؤثّرة : ' + L(v + ' N'); draw(); }));
      bar.append(a);
    }
    function draw() {
      body.innerHTML = '';
      const perm = S.mx > LIM ? 0.35 * 0.56 * (S.mx - LIM) * (S.mx - LIM) + 0.4 * (S.mx - LIM) : 0;
      const F = S.rel ? 0 : S.F;
      const e = S.rel ? perm : Math.max(ext(F), F > 0 ? perm + KS * F : perm);
      const Lc = L0 + e;
      /* الرسم : ميزان ومسطرة */
      const W = 300, H = 200, top = 14, py = 3.8;
      let s = svgOpen(W, H);
      s += '<line x1="40" y1="' + top + '" x2="120" y2="' + top + '" stroke="#5b6b80" stroke-width="3"/>';
      const yEnd = top + Math.min(Lc, 42) * py;
      const n = 14;
      let d = 'M80 ' + top;
      for (let i = 1; i <= n; i++) d += ' L' + (i % 2 ? 70 : 90) + ' ' + (top + (yEnd - top) * i / (n + 1)).toFixed(1);
      d += ' L80 ' + yEnd.toFixed(1);
      s += '<path d="' + d + '" fill="none" stroke="' + (S.mx > LIM ? '#B3261E' : '#1F3A5F') + '" stroke-width="1.8"/>';
      if (F > 0) s += '<rect x="68" y="' + yEnd.toFixed(1) + '" width="24" height="' + (10 + F * 1.4).toFixed(1) + '" fill="#7E97B6" stroke="#1F3A5F"/>';
      s += '<rect x="112" y="' + top + '" width="16" height="' + (42 * py) + '" fill="#F6E7C1" stroke="#8a6f1a" stroke-width=".8"/>';
      for (let c = 0; c <= 42; c += 2) {
        const y = top + c * py;
        s += '<line x1="112" y1="' + y.toFixed(1) + '" x2="' + (c % 10 ? 118 : 122) + '" y2="' + y.toFixed(1) + '" stroke="#8a6f1a" stroke-width=".7"/>';
        if (c % 10 === 0) s += '<text x="132" y="' + (y + 3).toFixed(1) + '" direction="ltr" font-size="8" fill="#8a6f1a">' + c + '</text>';
      }
      s += '<line x1="88" y1="' + (top + L0 * py).toFixed(1) + '" x2="112" y2="' + (top + L0 * py).toFixed(1) + '" stroke="#2F6B3A" stroke-dasharray="2 2"/>';
      /* منحنى القوّة – الاستطالة */
      const gx0 = 170, gy0 = 180, gw = 120, gh = 160, ex = v => gx0 + v / 30 * gw, fy = f => gy0 - f / 10 * gh;
      s += '<line x1="' + gx0 + '" y1="' + gy0 + '" x2="' + (gx0 + gw) + '" y2="' + gy0 + '" stroke="#8894a6"/><line x1="' + gx0 + '" y1="' + gy0 + '" x2="' + gx0 + '" y2="' + (gy0 - gh) + '" stroke="#8894a6"/>';
      let pl = '';
      for (let f = 0; f <= 10.01; f += 0.25) { const xv = f <= LIM ? KS * f : ext(f); if (xv > 30) break; pl += ex(xv).toFixed(1) + ',' + fy(f).toFixed(1) + ' '; }
      s += '<polyline fill="none" stroke="#c3ccd8" stroke-width="1.6" points="' + pl + '"/>';
      s += '<circle cx="' + ex(KS * LIM).toFixed(1) + '" cy="' + fy(LIM).toFixed(1) + '" r="3.2" fill="none" stroke="#C9A227" stroke-width="1.6"/>';
      s += '<text x="' + (ex(KS * LIM) - 6).toFixed(1) + '" y="' + (fy(LIM) - 6).toFixed(1) + '" direction="ltr" text-anchor="end" font-size="9" fill="#8a6f1a">A</text>';
      [1, 2, 3, 4].forEach(f => { s += '<circle cx="' + ex(BOOK[f]).toFixed(1) + '" cy="' + fy(f).toFixed(1) + '" r="2.4" fill="#2F6B3A"/>'; });
      if (F > 0 && e <= 30) s += '<circle cx="' + ex(e).toFixed(1) + '" cy="' + fy(F).toFixed(1) + '" r="4" fill="#B3261E"/>';
      s += '<text x="' + (gx0 + 2) + '" y="' + (gy0 - gh - 3) + '" direction="ltr" font-size="8.5" fill="#5b6b80">F (N)</text>';
      s += '<text x="' + (gx0 + gw) + '" y="' + (gy0 + 12) + '" direction="ltr" text-anchor="end" font-size="8.5" fill="#5b6b80">Δx (cm)</text>';
      s += '</svg>';
      body.append(el('p', 'shint', 'المسطرة بالسنتيمتر والخطّ الأخضر الطول الأصلي ' + L(L0 + ' cm') + ' . وفي المنحنى : النقاط الخضراء جدول الكتاب ، والحمراء قراءتك ، والدائرة الذهبية ' + L('A') + ' حدّ المرونة.'));
      body.append(el('div', 'dpw', s));
      const box = info();
      box.row('طول النابض', L('L = ' + nf(Lc) + ' cm'));
      box.row('الاستطالة', L('Δx = ' + nf(Lc) + ' − ' + L0 + ' = ' + nf(e) + ' cm'));
      if (F > 0) box.row('الاستطالة لكلّ نيوتن', L(nf(e / F) + ' cm/N') + (S.mx <= LIM ? ' — ثابتة تقريبًا ( تناسب طردي )' : ' — <b>لم تعد ثابتة</b>'));
      body.append(box);
      /* الميزان النابضي */
      const sb = el('div', 'fzbal');
      let t = '';
      for (let i = 0; i <= 10; i++) t += '<span class="fzbt' + (i > LIM ? ' fzbx' : '') + '">' + i + '</span>';
      sb.innerHTML = '<div class="fzbh">ميزان نابضي بهذا النابض ( مدرّج بالنيوتن حتى حدّ المرونة )</div><div class="fzbs" dir="ltr">' + t + '<i style="left:' + Math.min(100, F * 10) + '%"></i></div>';
      body.append(sb);
      if (S.rel && perm > 0.05) body.append(verdict('acwarn', 'تشوّه دائم — النابض تالف', 'أُزيلت القوّة لكنّ النابض <b>لم يعد</b> إلى ' + L(L0 + ' cm') + ' ، وبقيت استطالة ' + L(nf(perm) + ' cm') + ' . تجاوزتَ حدّ المرونة ( ' + L(LIM + ' N') + ' ) ، فلا يصلح النابض لإعادة التجربة ولا لميزان.'));
      else if (S.rel) body.append(verdict('acok', 'عاد إلى طوله الأصلي', 'لم تتجاوز القوّة حدّ المرونة ، فاستعاد النابض شكله : هذا معنى <b>المرونة</b>.'));
      else if (F > LIM) body.append(verdict('acwarn', 'تجاوزتَ حدّ المرونة', 'الاستطالة ' + L(nf(e) + ' cm') + ' ، ولو بقي التناسب لكانت ' + L(nf(KS * F) + ' cm') + ' . العلاقة صارت <b>غير خطّية</b> ، والمؤشّر خرج عن التدريج الصالح . اضغط « أزل القوّة » لترى ما بقي.'));
      else if (F > 0) body.append(verdict('acok', 'ضمن حدّ المرونة', 'ضاعِف القوّة تتضاعف الاستطالة لا الطول . ولهذا جاءت أقسام الميزان <b>متساوية</b>.'));
    }
    mkbar(); draw();
  }

  /* ---------------- 10 · مركز الكتلة والكرسي المائل ---------------- */
  function com(host) {
    host.innerHTML = '';
    const S = { th: 0 };
    const D = 0.15, Hh = 0.55, crit = Math.atan(D / Hh) * 180 / Math.PI;
    const bar = el('div', 'srow'), body = el('div');
    host.append(bar, body);
    function mkbar() {
      bar.innerHTML = '';
      bar.append(btn('جلوس صحيح', 'gh', () => { S.th = 0; mkbar(); draw(); }));
      bar.append(btn('إمالة خفيفة', 'gh', () => { S.th = 8; mkbar(); draw(); }));
      bar.append(btn('إمالة خطرة', 'gh', () => { S.th = 22; mkbar(); draw(); }));
      const a = el('div', 'srow');
      a.append(sld('إمالة الكرسي إلى الخلف : ' + L(S.th + '°'), S.th, 0, 30, 1, (v, sp) => { S.th = v; sp.innerHTML = 'إمالة الكرسي إلى الخلف : ' + L(v + '°'); draw(); }));
      bar.append(a);
    }
    function draw() {
      body.innerHTML = '';
      const th = S.th * Math.PI / 180, k = 150;
      const px = 110, py = 170;
      /* نقطة الارتكاز : الرجلان الخلفيتان ، والدوران حولها عكس عقارب الساعة ( إلى الخلف ) */
      const rot = (x, y) => [px + (x * Math.cos(th) - y * Math.sin(th)) * k, py - (x * Math.sin(th) + y * Math.cos(th)) * k];
      const P = (x, y) => rot(x, y).map(v => v.toFixed(1)).join(',');
      let s = svgOpen(300, 190);
      s += '<line x1="10" y1="' + py + '" x2="290" y2="' + py + '" stroke="#8894a6" stroke-width="2"/>';
      const tipped = S.th > crit;
      const legs = [[0, 0, 0, 0.42], [0.42, 0, 0.42, 0.42], [0, 0.42, 0.46, 0.42], [0, 0.42, -0.02, 0.85]];
      legs.forEach(l => { s += '<line x1="' + rot(l[0], l[1])[0].toFixed(1) + '" y1="' + rot(l[0], l[1])[1].toFixed(1) + '" x2="' + rot(l[2], l[3])[0].toFixed(1) + '" y2="' + rot(l[2], l[3])[1].toFixed(1) + '" stroke="#8a6f1a" stroke-width="4" stroke-linecap="round"/>'; });
      /* الجالس مبسّطًا */
      s += '<polygon points="' + P(0.03, 0.44) + ' ' + P(0.4, 0.44) + ' ' + P(0.4, 0.52) + ' ' + P(0.05, 0.52) + '" fill="#7E97B6"/>';
      s += '<polygon points="' + P(0.03, 0.5) + ' ' + P(0.14, 0.5) + ' ' + P(0.12, 0.92) + ' ' + P(0.01, 0.92) + '" fill="#7E97B6"/>';
      const hd = rot(0.07, 1.0);
      s += '<circle cx="' + hd[0].toFixed(1) + '" cy="' + hd[1].toFixed(1) + '" r="13" fill="#E8C268"/>';
      /* القاعدة */
      const b0 = rot(0, 0), b1 = rot(0.42, 0);
      if (S.th === 0) s += '<line x1="' + b0[0] + '" y1="' + (py + 4) + '" x2="' + b1[0] + '" y2="' + (py + 4) + '" stroke="#2F6B3A" stroke-width="5"/>';
      else s += '<circle cx="' + b0[0].toFixed(1) + '" cy="' + (py + 3) + '" r="4" fill="#2F6B3A"/>';
      /* مركز الكتلة وخطّه الرأسي */
      const c = rot(D, Hh);
      s += '<line x1="' + c[0].toFixed(1) + '" y1="' + c[1].toFixed(1) + '" x2="' + c[0].toFixed(1) + '" y2="' + py + '" stroke="' + (tipped ? '#B3261E' : '#1F3A5F') + '" stroke-dasharray="4 3" stroke-width="1.6"/>';
      s += '<circle cx="' + c[0].toFixed(1) + '" cy="' + c[1].toFixed(1) + '" r="6" fill="#fff" stroke="' + (tipped ? '#B3261E' : '#1F3A5F') + '" stroke-width="2.2"/>';
      s += '</svg>';
      body.append(el('p', 'shint', 'الدائرة <b>مركز الكتلة</b> ( الجالس والكرسي معًا ) ، والخطّ المتقطّع يسقط منه رأسيًّا ، والأخضر <b>قاعدة الاتّزان</b>.'));
      body.append(el('div', 'dpw', s));
      const xoff = D * Math.cos(th) - Hh * Math.sin(th);
      const box = info();
      box.row('قاعدة الاتّزان', S.th === 0 ? 'الأرجل الأربع : المسافة بين الأمامية والخلفية' : 'الرجلان الخلفيتان وحدهما — قاعدة <b>ضيّقة جدًّا</b>');
      box.row('موقع الخطّ الرأسي من مركز الكتلة', xoff >= 0 ? 'أمام نقطة الارتكاز بـ ' + L(Math.round(xoff * 100) + ' cm') : '<b>خلف</b> نقطة الارتكاز بـ ' + L(Math.round(-xoff * 100) + ' cm'));
      box.row('زاوية الانقلاب لهذا الجالس', L('≈ ' + Math.round(crit) + '°'));
      body.append(box);
      if (tipped) body.append(verdict('acwarn', 'ينقلب الكرسي', 'خرج الخطّ الرأسي من مركز الكتلة <b>عن قاعدة الاتّزان</b> ، فلم يعد شيء يُعيد الكرسي ، فيسقط إلى الخلف.'));
      else if (S.th > 0) body.append(verdict('', 'مستقرّ — لكن على الحافّة', 'ما يزال الخطّ الرأسي داخل القاعدة فيعود الكرسي إذا تُرك ، لكنّ القاعدة صارت نقطة ، وأيّ ميل زائد يُخرجه منها.'));
      else body.append(verdict('acok', 'مستقرّ', 'مركز الكتلة فوق قاعدة اتّزان عريضة ، والخطّ الرأسي منه يقع داخلها بهامش واسع.'));
    }
    mkbar(); draw();
  }

  window.SIMS.fclass = fclass;
  window.SIMS.netf = netf;
  window.SIMS.inertia = inertia;
  window.SIMS.strobev = h => strobe(h, 'v');
  window.SIMS.strobea = h => strobe(h, 'a');
  window.SIMS.law2 = law2;
  window.SIMS.pairs = pairs;
  window.SIMS.fall = fall;
  window.SIMS.skydive = skydive;
  window.SIMS.spring = h => spring(h, false);
  window.SIMS.springx = h => spring(h, true);
  window.SIMS.com = com;
})();

/* ===== محاكاة الحموض والقواعد والأملاح ( كيمياء التاسع — الوحدة الثانية ) ===== */
(function () {
  const el = (t, c, h) => { const e = document.createElement(t); if (c) e.className = c; if (h !== undefined) e.innerHTML = h; return e; };
  const btn = (txt, cls, fn) => { const b = el('button', 'sb ' + (cls || ''), txt); b.onclick = fn; return b; };
  const L = s => '<span class="ltr">' + s + '</span>';
  const sel = (lab, val, opts, fn) => {
    const w = el('label', 'sf'); w.append(el('span', '', lab));
    const s = document.createElement('select');
    opts.forEach(o => { const p = document.createElement('option'); p.value = o[0]; p.textContent = o[1]; if (String(o[0]) === String(val)) p.selected = true; s.append(p); });
    s.onchange = () => fn(s.value); w.append(s); return w;
  };
  const sld = (lab, val, lo, hi, step, fn) => {
    const w = el('label', 'sf'); const sp = el('span', '', lab); w.append(sp);
    const r = document.createElement('input'); r.type = 'range'; r.min = lo; r.max = hi; r.step = step; r.value = val;
    r.oninput = () => fn(+r.value, sp); w.append(r); return w;
  };
  const info = () => { const b = el('div', 'cyinfo'); b.row = (k, v) => b.append(el('div', 'cyrow', '<span class="cyk">' + k + '</span><span class="cyv">' + v + '</span>')); return b; };
  const verdict = (cls, b, s) => el('div', 'acv' + (cls ? ' ' + cls : ''), '<b>' + b + '</b><span>' + s + '</span>');
  const SUP = { '0': '⁰', '1': '¹', '2': '²', '3': '³', '+': '⁺', '-': '⁻' };
  const SUB = { '0': '₀', '1': '₁', '2': '₂', '3': '₃', '4': '₄', '5': '₅', '6': '₆' };
  const sub = n => String(n).split('').map(c => SUB[c]).join('');
  const chg = q => (Math.abs(q) > 1 ? SUP[Math.abs(q)] : '') + (q > 0 ? '⁺' : '⁻');
  const ion = (s, q) => s + chg(q);
  const coef = n => (n > 1 ? n : '');
  const sgn = q => (q > 0 ? '+' + q : '−' + Math.abs(q));

  /* ---------------- 1 · التأيّن ---------------- */
  const SUBS = {
    HCl: { t: 'a', s: 1, n: 'حمض الهيدروكلوريك', ions: [['H', 1, 1], ['Cl', 1, -1]] },
    HNO3: { t: 'a', s: 1, f: 'HNO₃', n: 'حمض النيتريك', ions: [['H', 1, 1], ['NO₃', 1, -1]] },
    H2SO4: { t: 'a', s: 1, f: 'H₂SO₄', n: 'حمض الكبريتيك', ions: [['H', 2, 1], ['SO₄', 1, -2]] },
    CH3COOH: { t: 'a', s: 0, f: 'CH₃COOH', n: 'حمض الإيثانويك', ions: [['H', 1, 1], ['CH₃COO', 1, -1]] },
    HF: { t: 'a', s: 0, n: 'حمض الهيدروفلوريك', ions: [['H', 1, 1], ['F', 1, -1]] },
    NaOH: { t: 'b', s: 1, n: 'هيدروكسيد الصوديوم', ions: [['Na', 1, 1], ['OH', 1, -1]] },
    KOH: { t: 'b', s: 1, n: 'هيدروكسيد البوتاسيوم', ions: [['K', 1, 1], ['OH', 1, -1]] },
    CaOH2: { t: 'b', s: 1, f: 'Ca(OH)₂', n: 'هيدروكسيد الكالسيوم', ions: [['Ca', 1, 2], ['OH', 2, -1]] },
    BaOH2: { t: 'b', s: 1, f: 'Ba(OH)₂', n: 'هيدروكسيد الباريوم', ions: [['Ba', 1, 2], ['OH', 2, -1]] },
    NH3: { t: 'b', s: 0, f: 'NH₃', n: 'الأمونيا', ions: [['NH₄', 1, 1], ['OH', 1, -1]], water: true },
    CO2: { t: 'ox', s: 0, f: 'CO₂', n: 'ثاني أكسيد الكربون' },
    CH4: { t: 'no', f: 'CH₄', n: 'الميثان' }
  };
  function ionize(host, def) {
    host.innerHTML = '';
    const S = { k: def || 'HCl' };
    const bar = el('div', 'srow'), body = el('div');
    host.append(bar, body);
    bar.append(sel('المادّة', S.k, Object.keys(SUBS).map(k => [k, (SUBS[k].f || k) + ' — ' + SUBS[k].n]), v => { S.k = v; draw(); }));
    function draw() {
      body.innerHTML = '';
      const X = SUBS[S.k], F = X.f || S.k;
      if (X.t === 'no') {
        body.append(el('div', 'abeq', L(F + ' + H₂O → لا أيونات')));
        body.append(verdict('acwarn', 'ليس حمضًا ولا قاعدة', 'في ' + L('CH₄') + ' أربع ذرّات هيدروجين ، لكنّه <b>لا يُنتج أيّ أيونات</b> في الماء ، فلا يُنتج ' + L('H⁺') + ' . المعيار ما تُنتجه المادّة في الماء ، لا ما في صيغتها.'));
        return;
      }
      if (X.t === 'ox') {
        body.append(el('div', 'abeq', L('CO₂ + H₂O ⇌ H₂CO₃')));
        body.append(el('div', 'abeq', L('H₂CO₃ ⇌ H⁺ + HCO₃⁻')));
        body.append(chips([['H', 1, 1], ['HCO₃', 1, -1]]));
        body.append(verdict('acok', 'محلوله حمضيّ — مع أنّه بلا هيدروجين', L('CO₂') + ' أكسيد حمضيّ : يذوب في الماء مكوّنًا حمض الكربونيك ، وهذا يتأيّن فيُنتج ' + L('H⁺') + ' . والسهمان المتعاكسان لأنّ التأيّن جزئيّ.'));
        return;
      }
      const arrow = X.s ? '→' : '⇌';
      const rhs = X.ions.map(i => coef(i[1]) + ion(i[0], i[2])).join(' + ');
      body.append(el('div', 'abeq', L((X.water ? F + ' + H₂O ' : F + ' ') + arrow + ' ' + rhs)));
      body.append(chips(X.ions));
      const box = info();
      box.row('مجموع الشحنات', L(X.ions.map(i => (i[1] > 1 ? i[1] + ' × ' : '') + '(' + sgn(i[2]) + ')').join(' + ') + ' = ' + X.ions.reduce((a, i) => a + i[1] * i[2], 0)) + ' ✔');
      box.row('نوع السهم', X.s ? 'سهم واحد ← <b>تأيّن كلّيّ</b>' : 'سهمان متعاكسان ← <b>تأيّن جزئيّ</b>');
      box.row('الأيون المسؤول عن الخصائص', X.t === 'a' ? L('H⁺') + ' ← خصائص <b>حمضية</b>' : L('OH⁻') + ' ← خصائص <b>قاعدية</b>');
      body.append(box);
      const many = X.ions.find(i => i[1] > 1);
      let msg = X.t === 'a' ? 'يُنتج ' + L('H⁺') + ' في الماء ، فهو <b>حمض</b>' : 'يُنتج ' + L('OH⁻') + ' في الماء ، فهو <b>قاعدة</b>';
      msg += X.s ? ' <b>قويّ</b> التأيّن.' : ' <b>ضعيف</b> التأيّن.';
      if (many) msg += ' والمعامل ' + L(String(many[1])) + ' أمام ' + L(ion(many[0], many[2])) + ' لأنّ في الصيغة ' + L(String(many[1])) + ' منه — لا يُكتب داخل الأيون.';
      if (S.k === 'NH3') msg += ' ولا هيدروكسيد في صيغة الأمونيا ، لكنّها تتفاعل مع الماء فتُنتجه.';
      body.append(verdict('acok', X.t === 'a' ? 'حمض' : 'قاعدة', msg));
    }
    function chips(ions) {
      const w = el('div', 'abchips');
      ions.forEach(i => { for (let k = 0; k < i[1]; k++) w.append(el('span', 'abchip ' + (i[2] > 0 ? 'abpos' : 'abneg'), L(ion(i[0], i[2])))); });
      return w;
    }
    draw();
  }

  /* ---------------- 2 · مختبر الخصائص ---------------- */
  const SOL = {
    HCl: { n: 'حمض الهيدروكلوريك ' + 'HCl', k: 'a', st: 1 },
    vin: { n: 'الخلّ ( حمض الإيثانويك )', k: 'a', st: 0 },
    NaOH: { n: 'هيدروكسيد الصوديوم NaOH', k: 'b', st: 1 },
    NaCl: { n: 'محلول ملح الطعام NaCl', k: 'n', st: 1 },
    sug: { n: 'محلول السكّر', k: 'n', st: -1 }
  };
  const TESTS = [
    ['blue', 'ورقة تبّاع الشمس الزرقاء'], ['red', 'ورقة تبّاع الشمس الحمراء'], ['php', 'الفينولفثالين'],
    ['btb', 'البروموثايمول الأزرق'], ['cond', 'توصيل التيار'], ['mg', 'شريط مغنيسيوم']
  ];
  function result(k, t) {
    const X = SOL[k];
    if (t === 'blue') return X.k === 'a' ? ['تحوّلت إلى <b>الأحمر</b>', '#C0392B'] : ['بقيت <b>زرقاء</b>', '#2E6DB4'];
    if (t === 'red') return X.k === 'b' ? ['تحوّلت إلى <b>الأزرق</b>', '#2E6DB4'] : ['بقيت <b>حمراء</b>', '#C0392B'];
    if (t === 'php') return X.k === 'b' ? ['صار <b>زهريًّا</b>', '#E06C9F'] : ['بقي <b>عديم اللون</b>', '#d9dee6'];
    if (t === 'btb') return X.k === 'a' ? ['صار <b>أصفر</b>', '#E3C21C'] : X.k === 'b' ? ['صار <b>أزرق</b>', '#2E6DB4'] : ['صار <b>أخضر</b> ( بين اللونين )', '#3E9E5A'];
    if (t === 'cond') return X.st === 1 ? ['المصباح <b>يُضيء بشدّة</b>', '#F2C230'] : X.st === 0 ? ['المصباح <b>يُضيء خافتًا</b>', '#E9DFA8'] : ['المصباح <b>لا يُضيء</b>', '#c3ccd8'];
    if (t === 'mg') return X.k === 'a' ? [X.st ? '<b>فقاعات كثيرة سريعة</b>' : '<b>فقاعات قليلة بطيئة</b>', '#9AC4E8'] : ['<b>لا تفاعل</b>', '#c3ccd8'];
  }
  function props(host) {
    host.innerHTML = '';
    const S = { k: 'HCl', done: {} };
    const bar = el('div', 'srow'), body = el('div');
    host.append(bar, body);
    function mkbar() {
      bar.innerHTML = '';
      bar.append(sel('المحلول', S.k, Object.keys(SOL).map(k => [k, SOL[k].n]), v => { S.k = v; S.done = {}; mkbar(); draw(); }));
      const r = el('div', 'abtests');
      TESTS.forEach(t => { const b = el('button', 'abtb' + (S.done[t[0]] ? ' abon' : ''), t[1]); b.onclick = () => { S.done[t[0]] = 1; mkbar(); draw(); }; r.append(b); });
      bar.append(r);
      bar.append(btn('أجرِ كلّ الاختبارات', 'gh', () => { TESTS.forEach(t => S.done[t[0]] = 1); mkbar(); draw(); }));
    }
    function draw() {
      body.innerHTML = '';
      const ks = TESTS.filter(t => S.done[t[0]]);
      if (!ks.length) { body.append(el('p', 'shint', 'اختر اختبارًا أو أكثر ، وسجّل المشاهدة قبل أن تحكم.')); return; }
      const tb = el('div', 'abres');
      ks.forEach(t => { const r = result(S.k, t[0]); tb.append(el('div', 'abrr', '<i style="background:' + r[1] + '"></i><span>' + t[1] + '</span><b>' + r[0] + '</b>')); });
      body.append(tb);
      const X = SOL[S.k];
      const have = k => !!S.done[k];
      const decisive = have('blue') || have('php') || have('btb') || (have('red') && X.k === 'b') || (have('mg') && X.k === 'a');
      if (!decisive) {
        body.append(el('div', 'sl note', (have('cond') ? 'توصيل التيار <b>لا يُميّز</b> الحمض من القاعدة ؛ كلاهما يوصل . ' : '') + (have('red') ? 'بقاء الورقة الحمراء حمراء يعني « ليس قاعديًّا » فقط ، فقد يكون حمضيًّا أو متعادلًا . ' : '') + 'أجرِ اختبارًا آخر حاسمًا.'));
        return;
      }
      const name = X.k === 'a' ? 'حمضيّ' : X.k === 'b' ? 'قاعديّ' : 'متعادل';
      let why = X.k === 'a' ? 'يحتوي على أيونات ' + L('H⁺') : X.k === 'b' ? 'يحتوي على أيونات ' + L('OH⁻') : 'لا تغلب فيه أيونات ' + L('H⁺') + ' ولا ' + L('OH⁻');
      if (have('cond')) why += X.st === 1 ? ' ، وأيوناته الحرّة كثيرة فيوصل جيّدًا' : X.st === 0 ? ' ، وأيوناته قليلة فيوصل ضعيفًا ( حمض ضعيف )' : ' ، ولا أيونات فيه فلا يوصل';
      body.append(verdict(X.k === 'n' ? '' : 'acok', 'المحلول ' + name, why + '.'));
    }
    mkbar(); draw();
  }

  /* ---------------- 3 · الأكاسيد ---------------- */
  const OX = {
    CO2: { f: 'CO₂', e: 'الكربون', m: 0, eq: 'CO₂ + H₂O ⇌ H₂CO₃' },
    SO2: { f: 'SO₂', e: 'الكبريت', m: 0, eq: 'SO₂ + H₂O ⇌ H₂SO₃' },
    NO2: { f: 'NO₂', e: 'النيتروجين', m: 0, eq: '' },
    Na2O: { f: 'Na₂O', e: 'الصوديوم ( IA )', m: 1, sol: 1, eq: 'Na₂O + H₂O → 2NaOH' },
    K2O: { f: 'K₂O', e: 'البوتاسيوم ( IA )', m: 1, sol: 1, eq: 'K₂O + H₂O → 2KOH' },
    CaO: { f: 'CaO', e: 'الكالسيوم ( IIA )', m: 1, sol: 1, eq: 'CaO + H₂O → Ca(OH)₂' },
    BaO: { f: 'BaO', e: 'الباريوم ( IIA )', m: 1, sol: 1, eq: 'BaO + H₂O → Ba(OH)₂' },
    CuO: { f: 'CuO', e: 'النحاس', m: 1, sol: 0, eq: 'CuO + 2HCl → CuCl₂ + H₂O' }
  };
  function oxides(host) {
    host.innerHTML = '';
    const S = { k: 'CO2' };
    const bar = el('div', 'srow'), body = el('div');
    host.append(bar, body);
    const g = el('div', 'abox');
    Object.keys(OX).forEach(k => { const b = el('button', 'abob', L(OX[k].f)); b.onclick = () => { S.k = k; draw(); }; b.dataset.k = k; g.append(b); });
    bar.append(g);
    function draw() {
      g.querySelectorAll('.abob').forEach(b => b.classList.toggle('abon', b.dataset.k === S.k));
      body.innerHTML = '';
      const X = OX[S.k];
      const steps = el('div', 'absteps');
      steps.append(el('div', 'abst', '<i>1</i><span>العنصر مع الأكسجين : <b>' + X.e + '</b> — ' + (X.m ? '<b>فلزّ</b>' : '<b>لافلزّ</b>') + '</span>'));
      steps.append(el('div', 'abst', '<i>2</i><span>نوع الأكسيد : ' + (X.m ? '<b>قاعديّ</b>' : '<b>حمضيّ</b>') + '</span>'));
      if (X.m) steps.append(el('div', 'abst', '<i>3</i><span>هل يذوب في الماء ؟ ' + (X.sol ? '<b>نعم</b> ← <b>قلويّ</b>' : '<b>لا</b> ← قاعديّ <b>غير قلويّ</b>') + '</span>'));
      body.append(steps);
      if (X.eq) body.append(el('div', 'abeq', L(X.eq)));
      let msg;
      if (!X.m) msg = 'أكسيد حمضيّ : يذوب في الماء مكوّنًا <b>حمضًا</b> ، فيصير المحلول حمضيًّا' + (S.k === 'NO2' ? ' . ( معادلته خارج الكتاب ، والمهمّ أنّه من أسباب المطر الحمضي. )' : '.');
      else if (X.sol) msg = 'أكسيد قاعديّ ذائب : يكوّن هيدروكسيد الفلزّ الذي يتأيّن منتجًا ' + L('OH⁻') + ' ، فهو <b>قلويّ</b>.';
      else msg = 'أكسيد قاعديّ <b>لا يذوب</b> في الماء ، فليس قلويًّا ، لكنّه يتفاعل مع الحموض منتجًا <b>ملحًا وماءً</b> — وهذا ما يجعله قاعديًّا.';
      body.append(verdict(X.m ? 'acok' : 'acwarn', X.m ? (X.sol ? 'قاعديّ وقلويّ' : 'قاعديّ غير قلويّ') : 'أكسيد حمضيّ', msg));
    }
    draw();
  }

  /* ---------------- 4 · قوّة الحمض والقاعدة ---------------- */
  const PAIR = {
    a1: { n: 'HCl و CH₃COOH', A: ['HCl', 'H', 'Cl'], B: ['CH₃COOH', 'H', 'CH₃COO'], acid: 1, metal: 'الخارصين' },
    a2: { n: 'HNO₃ و HF', A: ['HNO₃', 'H', 'NO₃'], B: ['HF', 'H', 'F'], acid: 1, metal: 'الخارصين' },
    b1: { n: 'KOH و NH₃', A: ['KOH', 'K', 'OH'], B: ['NH₃', 'NH₄', 'OH'], acid: 0 }
  };
  function beaker(strong, A, acid) {
    let s = '<svg viewBox="0 0 120 120" width="120" height="120" aria-hidden="true">';
    s += '<path d="M14 10 V104 Q14 114 24 114 H96 Q106 114 106 104 V10" fill="#EAF3FB" stroke="#5b6b80" stroke-width="2"/>';
    let seed = 7; const rnd = () => (seed = (seed * 9301 + 49297) % 233280) / 233280;
    for (let i = 0; i < 10; i++) {
      const x = 26 + (i % 4) * 22 + rnd() * 6, y = 28 + Math.floor(i / 4) * 26 + rnd() * 8;
      const ionized = strong || i === 0;
      if (ionized) {
        s += '<circle cx="' + x.toFixed(1) + '" cy="' + y.toFixed(1) + '" r="5" fill="' + (acid ? '#C0392B' : '#E07B39') + '"/>';
        s += '<circle cx="' + (x + 9).toFixed(1) + '" cy="' + (y + 9).toFixed(1) + '" r="5" fill="#2E6DB4"/>';
      } else {
        s += '<ellipse cx="' + (x + 4).toFixed(1) + '" cy="' + (y + 4).toFixed(1) + '" rx="10" ry="6" fill="#9aa6b8" stroke="#5b6b80"/>';
      }
    }
    return s + '</svg>';
  }
  function strength(host) {
    host.innerHTML = '';
    const S = { k: 'a1' };
    const bar = el('div', 'srow'), body = el('div');
    host.append(bar, body);
    bar.append(sel('المحلولان ( متساويا التركيز )', S.k, Object.keys(PAIR).map(k => [k, PAIR[k].n]), v => { S.k = v; draw(); }));
    function draw() {
      body.innerHTML = '';
      const P = PAIR[S.k];
      const g = el('div', 'abpair');
      [[P.A, 1], [P.B, 0]].forEach(([X, st]) => {
        const c = el('div', 'abcard');
        c.append(el('div', 'abct', L(X[0]) + ' — ' + (st ? '<b>قويّ</b>' : '<b>ضعيف</b>')));
        c.append(el('div', 'dpw', beaker(st, X, P.acid)));
        const pos = ion(X[1], 1), neg = ion(X[2], -1);
        const eq = (X[0] === 'NH₃' ? 'NH₃ + H₂O ⇌ ' : X[0] + (st ? ' → ' : ' ⇌ ')) + pos + ' + ' + neg;
        c.append(el('div', 'abeq abeqs', L(eq)));
        c.append(el('div', 'abbulb', '<i style="opacity:' + (st ? 1 : 0.3) + '"></i>' + (st ? 'يُضيء بشدّة' : 'يُضيء خافتًا')));
        if (P.acid) c.append(el('div', 'abrate', '<span>سرعة التفاعل مع ' + P.metal + '</span><b style="width:' + (st ? 92 : 28) + '%"></b>'));
        g.append(c);
      });
      body.append(g);
      body.append(el('p', 'shint', 'الدوائر المنفصلة أيونات ، والأشكال البيضاوية الرمادية جزيئات لم تتأيّن . ( النسبة في الضعيف مرسومة للتوضيح ، وهي في الواقع أصغر. )'));
      const box = info();
      box.row('التوصيل الكهربائي', L(P.A[0]) + ' أكبر ، لأنّ أيوناته الحرّة أكثر');
      if (P.acid) box.row('سرعة التفاعل مع الفلزّ', L(P.A[0]) + ' أسرع ، أي يستغرق زمنًا أقلّ');
      box.row('الرقم الهيدروجيني', P.acid ? L(P.A[0]) + ' قيمته <b>أقلّ</b> ( الأقوى حمضًا أقلّ pH )' : L(P.A[0]) + ' قيمته <b>أكبر</b> ( الأقوى قاعدةً أكبر pH )');
      body.append(box);
      body.append(verdict('acok', 'القوّة = درجة التأيّن', 'القويّ يتأيّن <b>كلّيًّا</b> فمحلوله أيونات فقط ، والضعيف <b>جزئيًّا</b> فيبقى فيه جزيئات . والمقارنة صحيحة لأنّ التركيز متساوٍ ؛ ولو اختلف التركيز لما صحّت.'));
    }
    draw();
  }

  /* ---------------- 5 · تدريج pH والكواشف ---------------- */
  const PHI = ['حمض بطارية السيارة', 'حمض المعدة', 'الخلّ', 'عصير البرتقال', 'البندورة', 'القهوة', 'الحليب', 'الماء النقيّ', 'ماء البحر', 'مسحوق الخبز', 'مضادّ الحموضة', 'محلول الأمونيا', 'الصابون السائل', 'مبيّض الغسيل', 'منظّف المصارف'];
  const PHC = ['#D7263D', '#E4472B', '#EE7A21', '#F4A51C', '#F2CB1D', '#B6CF2B', '#6DBE45', '#2FA84F', '#1E9C8F', '#1E7FB8', '#2457A6', '#3B3F9A', '#55358E', '#6A2C86', '#7B2378'];
  function phscale(host, mode) {
    host.innerHTML = '';
    const S = { p: mode === 'ind' ? 3 : 7 };
    const bar = el('div', 'srow'), body = el('div');
    host.append(bar, body);
    const r = el('div', 'srow');
    r.append(sld('الرقم الهيدروجيني : ' + L('pH = ' + S.p), S.p, 0, 14, 1, (v, sp) => { S.p = v; sp.innerHTML = 'الرقم الهيدروجيني : ' + L('pH = ' + v); draw(); }));
    bar.append(r);
    function draw() {
      body.innerHTML = '';
      const p = S.p;
      const sc = el('div', 'abph');
      PHC.forEach((c, i) => { const b = el('span', 'abphc' + (i === p ? ' abon' : ''), String(i)); b.style.background = c; b.onclick = () => { S.p = i; const inp = bar.querySelector('input'); inp.value = i; inp.dispatchEvent(new Event('input')); }; sc.append(b); });
      body.append(sc);
      body.append(el('div', 'abphl', '<span>تزداد الحموضة ←</span><span>متعادل</span><span>→ تزداد القاعدية</span>'));
      const type = p < 7 ? 'حمضيّ' : p > 7 ? 'قاعديّ' : 'متعادل';
      const box = info();
      box.row('مثال من الشكل ( 8 )', '<b>' + PHI[p] + '</b>');
      box.row('نوع المحلول', '<b>' + type + '</b>' + (p < 7 ? ' — البُعد عن 7 : ' + L(String(7 - p)) : p > 7 ? ' — البُعد عن 7 : ' + L(String(p - 7)) : ''));
      box.row('الأيون الغالب', p < 7 ? L('H⁺') + ' ، ويزداد تركيزه كلّما اقتربنا من 0' : p > 7 ? L('OH⁻') + ' ، ويزداد تركيزه كلّما اقتربنا من 14' : 'لا يغلب أحدهما');
      body.append(box);
      const ind = [
        ['تبّاع الشمس الزرقاء', p < 7 ? ['أحمر', '#C0392B'] : ['أزرق', '#2E6DB4']],
        ['تبّاع الشمس الحمراء', p > 7 ? ['أزرق', '#2E6DB4'] : ['أحمر', '#C0392B']],
        ['الفينولفثالين', p > 8 ? ['زهريّ', '#E06C9F'] : p === 8 ? ['زهريّ خفيف جدًّا', '#F4C6D9'] : ['عديم اللون', '#e6e9ee']],
        ['البروموثايمول الأزرق', p < 6 ? ['أصفر', '#E3C21C'] : p > 7 ? ['أزرق', '#2E6DB4'] : ['أخضر ( بين اللونين )', '#3E9E5A']],
        ['الكاشف العام', ['يُقارَن بدليل الألوان ← ' + p, PHC[p]]]
      ];
      const t = el('div', 'abres' + (mode === 'ind' ? ' abresx' : ''));
      ind.forEach(x => t.append(el('div', 'abrr', '<i style="background:' + x[1][1] + '"></i><span>' + x[0] + '</span><b>' + x[1][0] + '</b>')));
      body.append(t);
      if (mode === 'ind') body.append(el('div', 'sl note', 'لاحظ : الكواشف الأربعة الأولى تُخبرك بـ<b>النوع</b> فقط ، فلا تُفرّق بين ' + L('pH = 2') + ' و ' + L('pH = 5') + ' ، أمّا الكاشف العام فيعطي <b>قيمة</b> تقديرية ، ومقياس pH يعطيها بدقّة.'));
      else body.append(verdict(p === 7 ? '' : 'acok', 'محلول ' + type, p < 7 ? 'كلّما <b>قلّت</b> القيمة زادت الحموضة ، فالحمض الأقوى قيمته أقلّ ( عند تساوي التركيز ).' : p > 7 ? 'كلّما <b>زادت</b> القيمة زادت القاعدية ، فالقاعدة الأقوى قيمتها أكبر ( عند تساوي التركيز ).' : 'ليس حمضيًّا ولا قاعديًّا ، كالماء النقيّ.'));
    }
    draw();
  }

  /* ---------------- 6 · التعادل ---------------- */
  function neutral(host) {
    host.innerHTML = '';
    const S = { acid: 'HCl', add: 0 };
    const bar = el('div', 'srow'), body = el('div');
    host.append(bar, body);
    function mkbar() {
      bar.innerHTML = '';
      bar.append(sel('الحمض في الكأس', S.acid, [['HCl', 'HCl — 10 أيونات H⁺'], ['H2SO4', 'H₂SO₄ — 10 أيونات H⁺']], v => { S.acid = v; S.add = 0; mkbar(); draw(); }));
      const r = el('div', 'srow');
      r.append(sld('أيونات OH⁻ المضافة من NaOH : ' + L(String(S.add)), S.add, 0, 16, 1, (v, sp) => { S.add = v; sp.innerHTML = 'أيونات OH⁻ المضافة من NaOH : ' + L(String(v)); draw(); }));
      bar.append(r);
    }
    function draw() {
      body.innerHTML = '';
      const H0 = 10, oh = S.add, w = Math.min(H0, oh), H = H0 - w, OH = oh - w;
      const anion = S.acid === 'HCl' ? ['Cl⁻', 10] : ['SO₄²⁻', 5];
      const cnt = [['H⁺', H, '#C0392B'], ['OH⁻', OH, '#2E6DB4'], ['Na⁺', oh, '#E07B39'], [anion[0], anion[1], '#7a5407'], ['H₂O', w, '#7E97B6']];
      const g = el('div', 'abcnt');
      cnt.forEach(c => g.append(el('div', 'abcn', '<b style="color:' + c[2] + '">' + c[1] + '</b><span>' + L(c[0]) + '</span>')));
      body.append(g);
      const state = H > 0 ? 'a' : OH > 0 ? 'b' : 'n';
      const box = info();
      box.row('ما حدث', L(w + ' H⁺ + ' + w + ' OH⁻ → ' + w + ' H₂O'));
      box.row('المحلول الآن', state === 'a' ? '<b>حمضيّ</b> — بقي ' + L(H + ' H⁺') : state === 'b' ? '<b>قاعديّ</b> — زاد ' + L(OH + ' OH⁻') : '<b>متعادل</b> — ' + L('pH = 7'));
      box.row('الفينولفثالين', state === 'b' ? '<b>زهريّ</b>' : '<b>عديم اللون</b>');
      body.append(box);
      if (state === 'n') {
        const eq = S.acid === 'HCl' ? 'HCl + NaOH → NaCl + H₂O' : 'H₂SO₄ + 2NaOH → Na₂SO₄ + 2H₂O';
        body.append(el('div', 'abeq', L(eq)));
        body.append(verdict('acok', 'اكتمل التعادل', 'كلّ ' + L('H⁺') + ' وجد ' + L('OH⁻') + ' فكوّنا الماء : ' + L('H⁺ + OH⁻ → H₂O') + ' . وبقي ' + L('Na⁺') + ' و ' + L(anion[0]) + ' في المحلول — هذا هو <b>الملح</b> ( ' + (S.acid === 'HCl' ? 'كلوريد الصوديوم' : 'كبريتات الصوديوم') + ' ). ' + (S.acid === 'H2SO4' ? 'ولاحظ أنّ جزيء الحمض الواحد يحتاج جزيئَي NaOH.' : '')));
      } else body.append(el('p', 'shint', state === 'a' ? 'أضف هيدروكسيدًا حتى يختفي آخر ' + L('H⁺') + ' .' : 'تجاوزتَ نقطة التعادل : الزائد ' + L('OH⁻') + ' جعل المحلول قاعديًّا وحوّل الفينولفثالين إلى الزهريّ.'));
    }
    mkbar(); draw();
  }

  /* ---------------- 7 · بناء الملح وتصنيفه ---------------- */
  const ACID = {
    HCl: { f: 'HCl', a: 'Cl', q: -1, an: 'كلوريد', s: 1, poly: 0 },
    HNO3: { f: 'HNO₃', a: 'NO₃', q: -1, an: 'نترات', s: 1, poly: 1 },
    H2SO4: { f: 'H₂SO₄', a: 'SO₄', q: -2, an: 'كبريتات', s: 1, poly: 1 },
    H3PO4: { f: 'H₃PO₄', a: 'PO₄', q: -3, an: 'فوسفات', s: 0, poly: 1 },
    CH3COOH: { f: 'CH₃COOH', a: 'CH₃COO', q: -1, an: 'إيثانوات', s: 0, poly: 1 }
  };
  const BASE = {
    NaOH: { f: 'NaOH', c: 'Na', q: 1, cn: 'الصوديوم', s: 1 },
    KOH: { f: 'KOH', c: 'K', q: 1, cn: 'البوتاسيوم', s: 1 },
    LiOH: { f: 'LiOH', c: 'Li', q: 1, cn: 'الليثيوم', s: 1 },
    CaOH2: { f: 'Ca(OH)₂', c: 'Ca', q: 2, cn: 'الكالسيوم', s: 1 },
    BaOH2: { f: 'Ba(OH)₂', c: 'Ba', q: 2, cn: 'الباريوم', s: 1 },
    NH3: { f: 'NH₃', c: 'NH₄', q: 1, cn: 'الأمونيوم', s: 0, nh3: 1 }
  };
  const gcd = (a, b) => (b ? gcd(b, a % b) : a);
  function saltOf(A, Bs) {
    const qa = -A.q, qb = Bs.q, g = gcd(qa, qb);
    const nc = qa / g, na = qb / g;
    const cat = Bs.c === 'NH₄' && nc > 1 ? '(NH₄)' + sub(nc) : Bs.c + (nc > 1 ? sub(nc) : '');
    const an = na > 1 ? (A.poly ? '(' + A.a + ')' + sub(na) : A.a + sub(na)) : A.a;
    const f = A.a === 'CH₃COO' ? (na > 1 ? '(CH₃COO)' + sub(na) + Bs.c : 'CH₃COO' + (Bs.c === 'NH₄' ? 'NH₄' : Bs.c)) : cat + an;
    /* المعادلة : na حمض + nc قاعدة → ملح + ماء */
    const h2o = na * qa;
    const lhs = coef(na) + A.f + ' + ' + coef(nc) + Bs.f;
    const eq = lhs + ' → ' + f + (Bs.nh3 ? '' : ' + ' + coef(h2o) + 'H₂O');
    return { f, nc, na, eq, name: A.an + ' ' + Bs.cn };
  }
  function salt(host, def) {
    host.innerHTML = '';
    const S = def === 'pick' ? { a: 'HCl', b: 'NH3' } : { a: 'H2SO4', b: 'KOH' };
    const bar = el('div', 'srow'), body = el('div');
    host.append(bar, body);
    bar.append(sel('الحمض', S.a, Object.keys(ACID).map(k => [k, ACID[k].f + (ACID[k].s ? ' ( قويّ )' : ' ( ضعيف )')]), v => { S.a = v; draw(); }));
    const r = el('div', 'srow');
    r.append(sel('القاعدة', S.b, Object.keys(BASE).map(k => [k, BASE[k].f + (BASE[k].s ? ' ( قوية )' : ' ( ضعيفة )')]), v => { S.b = v; draw(); }));
    bar.append(r);
    function draw() {
      body.innerHTML = '';
      const A = ACID[S.a], Bs = BASE[S.b], X = saltOf(A, Bs);
      const cat = ion(Bs.c, Bs.q), an = ion(A.a, A.q);
      const box = info();
      box.row('الأيون الموجب ( من القاعدة )', L(cat));
      box.row('الأيون السالب ( من الحمض )', L(an) + ' — ويُسمّى منه الملح : <b>' + A.an + '</b>');
      box.row('موازنة الشحنات', L(X.nc + ' × (' + sgn(Bs.q) + ') + ' + X.na + ' × (' + sgn(A.q) + ') = 0'));
      box.row('الملح', L(X.f) + ' — <b>' + X.name + '</b>');
      box.row('معادلة التعادل الموزونة', L(X.eq) + (Bs.nh3 ? ' — بلا ماء ، لأنّ الأمونيا لا تحتوي '+ L('OH⁻') : ''));
      body.append(box);
      let k, t, why;
      if (A.s && Bs.s) { k = ''; t = 'محلوله متعادل · pH = 7'; why = 'حمض قويّ مع قاعدة قوية : تساويا في القوّة فلم يفرض أحدهما صفته.'; }
      else if (A.s && !Bs.s) { k = 'acwarn'; t = 'محلوله حمضيّ · pH أقلّ من 7'; why = 'الحمض <b>قويّ</b> والقاعدة <b>ضعيفة</b> : الطرف الأقوى ( الحمض ) يفرض صفته.'; }
      else if (!A.s && Bs.s) { k = 'acok'; t = 'محلوله قاعديّ · pH أكبر من 7'; why = 'الحمض <b>ضعيف</b> والقاعدة <b>قوية</b> : الطرف الأقوى ( القاعدة ) يفرض صفته.'; }
      else { k = ''; t = 'كلاهما ضعيف'; why = 'هذه الحالة <b>خارج الكتاب</b> : الحكم فيها يحتاج مقارنة دقيقة بين ضعفين ، فلا تُطبَّق عليها القاعدة الذهبية.'; }
      body.append(verdict(k, t, why));
      if (S.a === 'H3PO4' && (S.b === 'CaOH2' || S.b === 'BaOH2')) body.append(el('div', 'sl note', 'هذا الملح <b>شحيح الذوبان</b> في الماء ، فيترسّب ؛ والتصنيف أعلاه تطبيق للقاعدة لا وصف لمحلول تقيسه فعلًا.'));
    }
    draw();
  }

  /* ---------------- 8 · طرائق تحضير الأملاح ---------------- */
  const PREP = [
    { n: 'حمض + قاعدة', eq: 'HCl + KOH → KCl + H₂O', out: ['ماء'], see: 'ترتفع حرارة المحلول ، ولا يُرى غاز ولا راسب.' },
    { n: 'حمض + أكسيد فلزّ', eq: 'H₂SO₄ + CuO → CuSO₄ + H₂O', out: ['ماء'], see: 'يختفي المسحوق الأسود ويزرقّ المحلول بكبريتات النحاس.' },
    { n: 'حمض + فلزّ', eq: '2HCl + Mg → MgCl₂ + H₂', out: ['غاز الهيدروجين'], see: '<b>فقاعات</b> غاز الهيدروجين ، ويتآكل شريط الفلزّ.' },
    { n: 'حمض + كربونات فلزّ', eq: '2HNO₃ + CuCO₃ → Cu(NO₃)₂ + H₂O + CO₂', out: ['ماء', 'غاز CO₂'], see: '<b>فوران</b> غاز ثاني أكسيد الكربون.' },
    { n: 'حمض + أمونيا', eq: 'NH₃ + HCl → NH₄Cl', out: [], see: 'يتكوّن الملح وحده ، ولا ماء.' },
    { n: 'خلط محلولَي ملحين', eq: 'ZnCl₂ + K₂CO₃ → ZnCO₃ + 2KCl', out: ['راسب'], see: '<b>راسب</b> من كربونات الخارصين ، ويبقى كلوريد البوتاسيوم ذائبًا.' }
  ];
  function saltprep(host) {
    host.innerHTML = '';
    const S = { k: 2 };
    const bar = el('div', 'srow'), body = el('div');
    host.append(bar, body);
    const g = el('div', 'abox');
    PREP.forEach((p, i) => { const b = el('button', 'abob abprep', p.n); b.onclick = () => { S.k = i; draw(); }; b.dataset.k = i; g.append(b); });
    bar.append(g);
    function draw() {
      g.querySelectorAll('.abob').forEach(b => b.classList.toggle('abon', +b.dataset.k === S.k));
      body.innerHTML = '';
      const P = PREP[S.k];
      body.append(el('div', 'abeq', L(P.eq)));
      const o = el('div', 'abchips');
      o.append(el('span', 'abchip abpos', 'ملح'));
      P.out.forEach(x => o.append(el('span', 'abchip abneg', x)));
      if (!P.out.length) o.append(el('span', 'abchip abnone', 'لا شيء غيره'));
      body.append(el('p', 'shint', 'النواتج :'));
      body.append(o);
      body.append(verdict('acok', 'ما تراه في الأنبوب', P.see));
      body.append(el('div', 'sl note', 'القاعدة : الماء مع القاعدة أو الأكسيد أو الكربونات · الهيدروجين مع الفلزّ · ثاني أكسيد الكربون مع الكربونات فقط · لا ماء مع الأمونيا · راسب مع خلط ملحين.'));
    }
    draw();
  }

  window.SIMS.ionize = h => ionize(h, 'HCl');
  window.SIMS.ionizeb = h => ionize(h, 'CaOH2');
  window.SIMS.props = props;
  window.SIMS.oxides = oxides;
  window.SIMS.strength = strength;
  window.SIMS.phscale = h => phscale(h, 'scale');
  window.SIMS.phind = h => phscale(h, 'ind');
  window.SIMS.neutral = neutral;
  window.SIMS.salt = h => salt(h, 'build');
  window.SIMS.saltpick = h => salt(h, 'pick');
  window.SIMS.saltprep = saltprep;
})();
/* ===== محاكاة الخليّة وعمليّاتها الحيويّة ( أحياء التاسع — الوحدة الثانية ) ===== */
(function () {
  const el = (t, c, h) => { const e = document.createElement(t); if (c) e.className = c; if (h !== undefined) e.innerHTML = h; return e; };
  const btn = (txt, cls, fn) => { const b = el('button', 'sb ' + (cls || ''), txt); b.onclick = fn; return b; };
  const L = s => '<span class="ltr">' + s + '</span>';
  const sel = (lab, val, opts, fn) => {
    const w = el('label', 'sf'); w.append(el('span', '', lab));
    const s = document.createElement('select');
    opts.forEach(o => { const p = document.createElement('option'); p.value = o[0]; p.textContent = o[1]; if (String(o[0]) === String(val)) p.selected = true; s.append(p); });
    s.onchange = () => fn(s.value); w.append(s); return w;
  };
  const sld = (lab, val, lo, hi, step, fn) => {
    const w = el('label', 'sf'); const sp = el('span', '', lab); w.append(sp);
    const r = document.createElement('input'); r.type = 'range'; r.min = lo; r.max = hi; r.step = step; r.value = val;
    r.oninput = () => fn(+r.value, sp); w.append(r); return w;
  };
  const info = () => { const b = el('div', 'cyinfo'); b.row = (k, v) => b.append(el('div', 'cyrow', '<span class="cyk">' + k + '</span><span class="cyv">' + v + '</span>')); return b; };
  const verdict = (cls, b, s) => el('div', 'acv' + (cls ? ' ' + cls : ''), '<b>' + b + '</b><span>' + s + '</span>');
  const seg = (opts, val, fn) => {
    const w = el('div', 'ceseg');
    opts.forEach(o => { const b = el('button', 'ceb' + (String(o[0]) === String(val) ? ' ceon' : ''), o[1]); b.onclick = () => fn(o[0]); w.append(b); });
    return w;
  };
  const NS = 'http://www.w3.org/2000/svg';
  const sv = (t, a, p) => { const e = document.createElementNS(NS, t); for (const k in a) e.setAttribute(k, a[k]); if (p) p.append(e); return e; };
  const svgBox = (w, h) => sv('svg', { viewBox: '0 0 ' + w + ' ' + h, class: 'cesvg', preserveAspectRatio: 'xMidYMid meet' });
  const shuffle = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };

  /* ======================= 1 · بدائية أم حقيقية ======================= */
  const KINDS = {
    bac: { n: 'بكتيريا', p: 1 }, arc: { n: 'أثريات', p: 1 }, liv: { n: 'خليّة كبد', p: 0 },
    leaf: { n: 'خليّة ورقة نبات', p: 0 }, fun: { n: 'خليّة فطر', p: 0 }, ame: { n: 'أميبا ( طلائعيات )', p: 0 }
  };
  function drawKind(svg, pro) {
    svg.innerHTML = '';
    if (pro) {
      sv('rect', { x: 50, y: 45, width: 220, height: 110, rx: 55, fill: '#EAF4EC', stroke: '#2E7D4F', 'stroke-width': 3 }, svg);
      sv('path', { d: 'M110 100 q12 -22 24 0 t24 0 t24 0 t24 0 q-10 18 -30 6 t-40 4 t-26 -10', fill: 'none', stroke: '#B03A2E', 'stroke-width': 2.5 }, svg);
      [[80, 75], [95, 130], [230, 80], [215, 128], [250, 105], [170, 70], [150, 135]].forEach(p => sv('circle', { cx: p[0], cy: p[1], r: 3, fill: '#5b6b80' }, svg));
      sv('path', { d: 'M270 100 q20 -10 35 5 q12 12 10 25', fill: 'none', stroke: '#2E7D4F', 'stroke-width': 2 }, svg);
    } else {
      sv('ellipse', { cx: 160, cy: 100, rx: 140, ry: 85, fill: '#EEF3FA', stroke: '#1F3A5F', 'stroke-width': 3 }, svg);
      sv('circle', { cx: 130, cy: 95, r: 36, fill: '#E3E8F3', stroke: '#1F3A5F', 'stroke-width': 3 }, svg);
      sv('circle', { cx: 130, cy: 95, r: 31, fill: 'none', stroke: '#1F3A5F', 'stroke-width': 1.2, 'stroke-dasharray': '4 3' }, svg);
      sv('path', { d: 'M110 95 q8 -14 16 0 t16 0 t12 -4', fill: 'none', stroke: '#B03A2E', 'stroke-width': 2.2 }, svg);
      [[230, 70], [225, 135]].forEach(p => {
        sv('ellipse', { cx: p[0], cy: p[1], rx: 24, ry: 12, fill: '#FBE3D2', stroke: '#C0612B', 'stroke-width': 2 }, svg);
        sv('path', { d: 'M' + (p[0] - 16) + ' ' + p[1] + ' l6 -6 l6 12 l6 -12 l6 12 l6 -6', fill: 'none', stroke: '#C0612B', 'stroke-width': 1.3 }, svg);
      });
      sv('path', { d: 'M185 95 q10 -6 20 0 t20 0 M185 105 q10 -6 20 0 t20 0', fill: 'none', stroke: '#6A4C93', 'stroke-width': 2 }, svg);
      [[60, 100], [80, 140], [270, 100], [180, 160], [200, 45]].forEach(p => sv('circle', { cx: p[0], cy: p[1], r: 3, fill: '#5b6b80' }, svg));
    }
  }
  function cellkind(host) {
    host.innerHTML = '';
    const S = { k: 'bac', ans: null };
    const bar = el('div', 'srow'), body = el('div');
    host.append(bar, body);
    bar.append(sel('الخليّة', S.k, Object.keys(KINDS).map(k => [k, KINDS[k].n]), v => { S.k = v; S.ans = null; draw(); }));
    function draw() {
      body.innerHTML = '';
      const K = KINDS[S.k], svg = svgBox(320, 200); drawKind(svg, K.p);
      body.append(el('div', 'cefig', ''));
      body.lastChild.append(svg);
      body.append(el('div', 'shint', 'انظر إلى الرسم : هل المادّة الوراثية ( الخطّ الأحمر ) داخل غلاف ؟ وهل ترى عُضيّات غشائية ؟ ثمّ صنّف.'));
      const r = el('div', 'srow');
      r.append(btn('بدائية النواة', S.ans === 1 ? 'go' : '', () => { S.ans = 1; draw(); }), btn('حقيقية النواة', S.ans === 0 ? 'go' : '', () => { S.ans = 0; draw(); }));
      body.append(r);
      if (S.ans === null) return;
      const ok = S.ans === K.p;
      const t = info();
      t.row('الغلاف النووي', K.p ? '✗ غير موجود — المادّة الوراثية حرّة في السيتوبلازم' : '✓ موجود — نواة حقيقية');
      t.row('العُضيّات الغشائية', K.p ? '✗ لا توجد' : '✓ ميتوكندريا وغولجي وشبكة إندوبلازمية …');
      t.row('الرايبوسومات', '✓ موجودة في النوعين — ليست معيارًا');
      body.append(verdict(ok ? 'acok' : 'acwarn', (ok ? 'تصنيف صحيح : ' : 'راجع : ') + K.n + (K.p ? ' بدائية النواة' : ' حقيقية النواة'),
        K.p ? 'المادّة الوراثية <b>غير محاطة بغلاف</b> ولا عُضيّات غشائية ، وهذا شأن البكتيريا والأثريات.' : 'المادّة الوراثية <b>محاطة بغلاف نووي</b> ، وفي الخليّة عُضيّات غشائية ؛ وهذا شأن النبات والحيوان والفطريات والطلائعيات.'), t);
    }
    draw();
  }

  /* ======================= 2 · مستكشف العُضيّات ======================= */
  const ORG = {
    mem: { n: 'الغشاء البلازمي', e: 'Plasma Membrane', s: 'طبقة مزدوجة من الدهون المفسفرة ، وبروتينات سطحية ومُندسّة', f: 'يفصل الخليّة عن محيطها ، وينظّم حركة المواد منها وإليها ( نفاذية اختيارية )', w: 'b' },
    nuc: { n: 'النواة', e: 'Nucleus', s: 'أكبر عُضيّة ، يحيط بها غلاف نووي مزدوج فيه ثقوب', f: 'تحوي المادّة الوراثية ' + L('DNA') + ' المسؤولة عن صفات الكائن', w: 'b' },
    nucl: { n: 'النويّة', e: 'Nucleolus', s: 'تركيب أصغر داخل النواة', f: 'مكان تصنيع الرايبوسومات', w: 'b' },
    cyto: { n: 'السيتوبلازم', e: 'Cytoplasm', s: 'سائل هلاميّ حبيبيّ بين النواة والغشاء ، معظمه ماء ؛ وجزؤه السائل بلا عُضيّات هو السيتوسول', f: 'يحوي العُضيّات والإنزيمات والأملاح ، وتجري فيه عمليات حيوية', w: 'b' },
    ribo: { n: 'الرايبوسومات', e: 'Ribosomes', s: 'وحدتان بنائيتان كبيرة وصغيرة ؛ حرّة أو على الشبكة الخشنة', f: '<b>مصنع البروتين</b> في الخليّة', w: 'b' },
    rer: { n: 'الشبكة الإندوبلازمية الخشنة', e: 'Rough ER', s: 'أغشية وقنوات على سطحها رايبوسومات', f: 'تضيف الكربوهيدرات إلى البروتينات ، وتنقل البروتين بعد تعديله', w: 'b' },
    ser: { n: 'الشبكة الإندوبلازمية الملساء', e: 'Smooth ER', s: 'أغشية وقنوات <b>بلا</b> رايبوسومات', f: 'تصنيع الدهون ، وتخزين الكالسيوم ، وإزالة سُمّية بعض المواد', w: 'b' },
    golgi: { n: 'جهاز غولجي', e: 'Golgi Apparatus', s: 'أكياس غشائية متوازية وحويصلات غولجي', f: 'يعدّل البروتينات والدهون ثمّ يخزّنها أو يطلقها خارج الخليّة', w: 'b' },
    mito: { n: 'الميتوكندريا', e: 'Mitochondria', s: 'غشاء خارجي وداخلي منثنٍ ( الأعراف ) والحشوة ، وفيها ' + L('DNA') + ' ورايبوسومات', f: 'التنفّس الخلوي وإنتاج ' + L('ATP') + ' — « مصنع الطاقة »', w: 'b' },
    chl: { n: 'البلاستيدة الخضراء', e: 'Chloroplast', s: 'غشاءان ، وثايلاكويدات مكدّسة ( الغرانا ) في اللحمة', f: 'البناء الضوئي ؛ الكلوروفيل في أغشية الثايلاكويد', w: 'p' },
    lyso: { n: 'الأجسام الحالّة', e: 'Lysosomes', s: 'حويصلات غشائية من جهاز غولجي فيها إنزيمات هاضمة', f: 'تحليل الخلايا الهرمة والأجسام الغريبة', w: 'a' },
    perox: { n: 'البيروكسيسوم', e: 'Peroxisome', s: 'عُضيّ صغير محاط بغشاء واحد', f: 'إزالة السُّمّية ( كما في خلايا الكبد )', w: 'b' },
    cent: { n: 'الجسم المركزي والمُريكزات', e: 'Centrosome', s: 'مُريكزان أسطوانيان', f: 'تكوين الخيوط المغزلية في الانقسام', w: 'a' },
    vac: { n: 'الفجوة', e: 'Vacuole', s: 'عُضيّ غشائي فيه مواد عضوية وغير عضوية', f: 'في النبات فجوة عصارية كبيرة تحافظ على ضغط الامتلاء ؛ وفي الحيوان فجوات صغيرة عديدة', w: 'b' },
    csk: { n: 'الهيكل الخلوي', e: 'Cytoskeleton', s: 'ألياف بروتينية : أنيبيبات دقيقة وخيوط وسطية وخيوط دقيقة', f: 'دعم الخليّة والمحافظة على شكلها وتثبيت العُضيّات', w: 'b' },
    wall: { n: 'الجدار الخلوي', e: 'Cell Wall', s: 'مواد كربوهيدراتية معقّدة كالسليلوز', f: 'الدعامة والحماية وشكل ثابت ؛ مُنفِذ كلّيًّا ولا يتحكّم في المرور', w: 'p' }
  };
  const WH = { b: 'النباتية والحيوانية', p: 'النباتية فقط', a: 'الحيوانية ( ويندر في النباتية أو يغيب )' };
  function drawCell(svg, plant, hi) {
    svg.innerHTML = '';
    const G = k => { const g = sv('g', { 'data-k': k, class: hi ? (hi === k ? 'ceon' : 'ceoff') : '' }, svg); return g; };
    // الجدار والغشاء والسيتوبلازم
    if (plant) {
      const w = G('wall'); sv('rect', { x: 8, y: 8, width: 304, height: 204, rx: 10, fill: '#E7F1DE', stroke: '#5C7F3A', 'stroke-width': 7 }, w);
    }
    const c = G('cyto');
    if (plant) sv('rect', { x: 16, y: 16, width: 288, height: 188, rx: 7, fill: '#F6F9EF' }, c);
    else sv('ellipse', { cx: 160, cy: 110, rx: 150, ry: 100, fill: '#F4F6FB' }, c);
    const m = G('mem');
    if (plant) sv('rect', { x: 16, y: 16, width: 288, height: 188, rx: 7, fill: 'none', stroke: '#1F3A5F', 'stroke-width': 2.5 }, m);
    else sv('ellipse', { cx: 160, cy: 110, rx: 150, ry: 100, fill: 'none', stroke: '#1F3A5F', 'stroke-width': 3 }, m);
    // الهيكل الخلوي
    const k = G('csk');
    (plant ? ['M24 60 L120 30', 'M30 190 L140 205', 'M290 30 L230 70'] : ['M30 110 L90 60', 'M60 175 L150 200', 'M270 50 L300 120', 'M210 200 L280 160']).forEach(d => sv('path', { d, stroke: '#9AA7BA', 'stroke-width': 1.2, fill: 'none', 'stroke-dasharray': '6 3' }, k));
    // الفجوة
    const v = G('vac');
    if (plant) sv('rect', { x: 120, y: 70, width: 130, height: 95, rx: 40, fill: '#D9ECF7', stroke: '#3A7CA5', 'stroke-width': 2 }, v);
    else [[70, 70, 9], [255, 165, 8], [110, 180, 7]].forEach(p => sv('circle', { cx: p[0], cy: p[1], r: p[2], fill: '#D9ECF7', stroke: '#3A7CA5', 'stroke-width': 1.5 }, v));
    // النواة والنويّة
    const NX = plant ? 70 : 115, NY = plant ? 70 : 105;
    const n = G('nuc');
    sv('circle', { cx: NX, cy: NY, r: 32, fill: '#E3E8F3', stroke: '#1F3A5F', 'stroke-width': 3 }, n);
    sv('circle', { cx: NX, cy: NY, r: 27, fill: 'none', stroke: '#1F3A5F', 'stroke-width': 1, 'stroke-dasharray': '3 3' }, n);
    sv('path', { d: 'M' + (NX - 20) + ' ' + (NY + 8) + ' q6 -10 12 0 t12 0 t10 -6', fill: 'none', stroke: '#B03A2E', 'stroke-width': 1.8 }, n);
    const nl = G('nucl'); sv('circle', { cx: NX + 8, cy: NY - 8, r: 9, fill: '#8C5E9E' }, nl);
    // الشبكة الخشنة والملساء
    const RX = plant ? 105 : 152, RY = plant ? 40 : 75;
    const r = G('rer');
    for (let i = 0; i < 3; i++) sv('path', { d: 'M' + RX + ' ' + (RY + i * 14) + ' q8 -7 16 0 t16 0 t16 0', fill: 'none', stroke: '#6A4C93', 'stroke-width': 2.4 }, r);
    const s = G('ser');
    const SX = plant ? 40 : 150, SY = plant ? 125 : 140;
    for (let i = 0; i < 2; i++) sv('path', { d: 'M' + SX + ' ' + (SY + i * 13) + ' q8 -8 16 0 t16 0 t16 0', fill: 'none', stroke: '#A07CC5', 'stroke-width': 4, 'stroke-linecap': 'round' }, s);
    // الرايبوسومات
    const rb = G('ribo');
    for (let i = 0; i < 3; i++) for (let j = 0; j < 4; j++) sv('circle', { cx: RX + 4 + j * 12, cy: RY - 4 + i * 14, r: 2.3, fill: '#2B2B2B' }, rb);
    (plant ? [[270, 120], [100, 190], [30, 100]] : [[60, 140], [240, 55], [205, 180], [95, 45]]).forEach(p => sv('circle', { cx: p[0], cy: p[1], r: 2.6, fill: '#2B2B2B' }, rb));
    // غولجي
    const GX = plant ? 280 : 235, GY = plant ? 95 : 85;
    const g = G('golgi');
    for (let i = 0; i < 4; i++) sv('path', { d: 'M' + (GX - 22 + i * 2) + ' ' + (GY + i * 7) + ' q22 -10 44 0', fill: 'none', stroke: '#C08A1E', 'stroke-width': 3, 'stroke-linecap': 'round' }, g);
    sv('circle', { cx: GX + 26, cy: GY + 26, r: 4, fill: '#E9C46A', stroke: '#C08A1E' }, g);
    // الميتوكندريا
    const mt = G('mito');
    (plant ? [[60, 170], [255, 190]] : [[75, 160], [215, 160]]).forEach(p => {
      sv('ellipse', { cx: p[0], cy: p[1], rx: 22, ry: 11, fill: '#FBE3D2', stroke: '#C0612B', 'stroke-width': 2 }, mt);
      sv('path', { d: 'M' + (p[0] - 15) + ' ' + p[1] + ' l5 -5 l5 10 l5 -10 l5 10 l5 -10 l5 5', fill: 'none', stroke: '#C0612B', 'stroke-width': 1.2 }, mt);
    });
    // الأجسام الحالّة والبيروكسيسوم
    const ly = G('lyso');
    (plant ? [[290, 165]] : [[260, 130], [185, 45]]).forEach(p => { sv('circle', { cx: p[0], cy: p[1], r: 8, fill: '#F7D6DE', stroke: '#B04A68', 'stroke-width': 1.6 }, ly); sv('circle', { cx: p[0] - 2, cy: p[1] + 1, r: 1.6, fill: '#B04A68' }, ly); sv('circle', { cx: p[0] + 3, cy: p[1] - 2, r: 1.6, fill: '#B04A68' }, ly); });
    const px = G('perox');
    sv('circle', { cx: plant ? 30 : 45, cy: plant ? 30 : 105, r: 6, fill: '#E6F2D7', stroke: '#6E8B3D', 'stroke-width': 1.6 }, px);
    // الجسم المركزي
    if (!plant) {
      const ce = G('cent');
      sv('rect', { x: 270, y: 92, width: 16, height: 6, rx: 2, fill: '#5D7C99' }, ce);
      sv('rect', { x: 275, y: 100, width: 6, height: 16, rx: 2, fill: '#5D7C99' }, ce);
    }
    // البلاستيدات
    if (plant) {
      const ch = G('chl');
      [[175, 35], [160, 190], [270, 50], [40, 210 - 30]].slice(0, 3).forEach(p => {
        sv('ellipse', { cx: p[0], cy: p[1], rx: 22, ry: 11, fill: '#BFE3B4', stroke: '#2E7D4F', 'stroke-width': 2 }, ch);
        for (let i = -1; i <= 1; i++) sv('rect', { x: p[0] - 4 + i * 9, y: p[1] - 5, width: 6, height: 10, rx: 1.5, fill: '#2E7D4F' }, ch);
      });
    }
  }
  const SETA = ['mem', 'nuc', 'nucl', 'cyto', 'ribo', 'rer', 'ser', 'golgi'];
  const SETB = ['mito', 'chl', 'lyso', 'perox', 'cent', 'vac', 'csk', 'wall'];
  function cellmap(host, set) {
    host.innerHTML = '';
    const S = { plant: set === SETB ? 1 : 0, k: set[0], mode: 'x', q: null, pick: null, path: -1 };
    const bar = el('div', 'srow'), body = el('div');
    host.append(bar, body);
    function top() {
      bar.innerHTML = '';
      bar.append(seg([[0, 'خليّة حيوانية'], [1, 'خليّة نباتية']], S.plant, v => { S.plant = +v; top(); draw(); }));
      bar.append(seg([['x', 'استكشف'], ['q', 'اختبر نفسك']], S.mode, v => { S.mode = v; S.pick = null; S.q = null; top(); draw(); }));
    }
    function newQ() {
      const pool = set.filter(k => ORG[k].w !== (S.plant ? 'a' : 'p'));
      S.q = shuffle(pool)[0]; S.pick = null;
    }
    function draw() {
      body.innerHTML = '';
      const svg = svgBox(320, 220);
      const avail = k => ORG[k].w !== (S.plant ? 'a' : 'p');
      if (S.mode === 'x') {
        drawCell(svg, S.plant, avail(S.k) ? S.k : null);
        const f = el('div', 'cefig'); f.append(svg); body.append(f);
        const chips = el('div', 'cechips');
        set.forEach(k => { const b = el('button', 'cechip' + (S.k === k ? ' ceon' : '') + (avail(k) ? '' : ' cegone'), ORG[k].n); b.onclick = () => { S.k = k; draw(); }; chips.append(b); });
        body.append(chips);
        const O = ORG[S.k], t = info();
        t.row('الاسم', O.n + ' ' + L(O.e));
        t.row('تركيبه', O.s);
        t.row('وظيفته', O.f);
        t.row('يوجد في الخليّة', WH[O.w]);
        body.append(t);
        if (!avail(S.k)) body.append(verdict('acwarn', 'غير موجود في هذه الخليّة', O.n + ' يوجد في الخليّة ' + WH[O.w] + ' ؛ بدّل نوع الخليّة لتراه.'));
        if (set === SETA) {
          const pr = el('div', 'srow');
          pr.append(btn('تتبّع بروتينًا مُفرَزًا', 'go', () => runPath(svg, pr)));
          body.append(pr);
          body.append(el('div', 'sl note', 'مسار البروتين المُفرَز : رايبوسوم على الشبكة الخشنة ← الشبكة الخشنة ( تعديل ونقل ) ← جهاز غولجي ( تعديل وتعبئة ) ← حويصلة ← الغشاء البلازمي ( إخراج خلوي ).'));
        }
      } else {
        if (!S.q) newQ();
        drawCell(svg, S.plant, S.pick ? S.pick : null);
        const f = el('div', 'cefig'); f.append(svg); body.append(f);
        body.append(verdict('', 'أيّ عُضيّ أو تركيب هذا ؟', ORG[S.q].f));
        const chips = el('div', 'cechips');
        set.filter(avail).forEach(k => { const b = el('button', 'cechip' + (S.pick === k ? (k === S.q ? ' ceok' : ' cebad') : ''), ORG[k].n); b.onclick = () => { S.pick = k; draw(); }; chips.append(b); });
        body.append(chips);
        if (S.pick) {
          const ok = S.pick === S.q;
          body.append(verdict(ok ? 'acok' : 'acwarn', ok ? 'إجابة صحيحة' : 'ليس هذا', ok ? ORG[S.q].n + ' : ' + ORG[S.q].s + '.' : ORG[S.pick].n + ' وظيفته : ' + ORG[S.pick].f + ' . حاول مرّة أخرى.'));
          if (ok) { const r = el('div', 'srow'); r.append(btn('سؤال آخر', 'go', () => { newQ(); draw(); })); body.append(r); }
        }
      }
    }
    function runPath(svg, row) {
      const P = S.plant ? [[110, 36], [150, 55], [258, 100], [290, 125], [304, 150]] : [[158, 71], [195, 95], [214, 92], [262, 112], [300, 140]];
      const NAMES = ['الرايبوسوم يصنع البروتين', 'الشبكة الخشنة تعدّله وتنقله', 'جهاز غولجي يعدّله ويعبّئه', 'حويصلة تحمله', 'الغشاء البلازمي : يخرج بالإخراج الخلوي'];
      const dot = sv('circle', { cx: P[0][0], cy: P[0][1], r: 6, fill: '#D62828', stroke: '#fff', 'stroke-width': 2 }, svg);
      const cap = el('div', 'cestep', NAMES[0]); row.innerHTML = ''; row.append(cap);
      let i = 0, t0 = null;
      const step = ts => {
        if (!svg.isConnected) return;
        if (t0 === null) t0 = ts;
        const u = Math.min(1, (ts - t0) / 1100);
        const a = P[i], b = P[i + 1];
        dot.setAttribute('cx', a[0] + (b[0] - a[0]) * u); dot.setAttribute('cy', a[1] + (b[1] - a[1]) * u);
        if (u >= 1) { i++; t0 = ts; cap.innerHTML = NAMES[i]; if (i >= P.length - 1) { setTimeout(() => { if (row.isConnected) { row.innerHTML = ''; row.append(btn('أعد التتبّع', 'go', () => runPath(svg, row))); } dot.remove(); }, 1400); return; } }
        requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    }
    top(); draw();
  }

  /* ======================= 3 · نباتية أم حيوانية ======================= */
  const CMP = [
    ['wall', 'الجدار الخلوي', 'يوجد ، من السليلوز', 'لا يوجد'],
    ['chl', 'البلاستيدات الخضراء', 'توجد في الأجزاء الخضراء', 'لا توجد'],
    ['cent', 'المُريكزات', 'لا توجد', 'زوج في الجسم المركزي'],
    ['vac', 'الفجوات', 'فجوة واحدة كبيرة', 'فجوات صغيرة عديدة'],
    ['lyso', 'الأجسام الحالّة', 'يندر وجودها', 'في معظم الخلايا'],
    ['mem', 'الشكل العام', 'محدّد وثابت ( بسبب الجدار )', 'غير ثابت']
  ];
  function cellcmp(host) {
    host.innerHTML = '';
    const S = { plant: 1, i: 0, guess: null, mys: null };
    const bar = el('div', 'srow'), body = el('div');
    host.append(bar, body);
    function top() {
      bar.innerHTML = '';
      bar.append(seg([[1, 'خليّة نباتية'], [0, 'خليّة حيوانية'], ['g', 'خمّن الخليّة']], S.mys ? 'g' : S.plant, v => {
        if (v === 'g') { S.mys = Math.random() < .5 ? 'p' : 'a'; S.guess = null; } else { S.mys = null; S.plant = +v; }
        top(); draw();
      }));
    }
    function draw() {
      body.innerHTML = '';
      const svg = svgBox(320, 220);
      if (S.mys) {
        drawCell(svg, S.mys === 'p', null);
        const f = el('div', 'cefig'); f.append(svg); body.append(f);
        body.append(el('div', 'shint', 'ابحث عن ثلاثة أدلّة : الجدار ، والبلاستيدات ، والفجوة الكبيرة أو المُريكزات.'));
        const r = el('div', 'srow');
        r.append(btn('نباتية', S.guess === 'p' ? 'go' : '', () => { S.guess = 'p'; draw(); }), btn('حيوانية', S.guess === 'a' ? 'go' : '', () => { S.guess = 'a'; draw(); }));
        body.append(r);
        if (S.guess) {
          const ok = S.guess === S.mys;
          body.append(verdict(ok ? 'acok' : 'acwarn', ok ? 'صحيح' : 'راجع الأدلّة', S.mys === 'p' ? 'في الرسم <b>جدار خلوي</b> سميك و<b>بلاستيدات خضراء</b> و<b>فجوة كبيرة</b> ، والشكل ثابت ← خليّة نباتية.' : 'لا جدار ولا بلاستيدات ، وفيها <b>مُريكزان</b> و<b>أجسام حالّة</b> وفجوات صغيرة ، والشكل غير ثابت ← خليّة حيوانية.'));
          const n = el('div', 'srow'); n.append(btn('خليّة أخرى', 'go', () => { S.mys = Math.random() < .5 ? 'p' : 'a'; S.guess = null; draw(); })); body.append(n);
        }
        return;
      }
      const R = CMP[S.i];
      drawCell(svg, S.plant, R[0] === 'mem' ? null : R[0]);
      const f = el('div', 'cefig'); f.append(svg); body.append(f);
      const tb = el('div', 'cetab');
      tb.append(el('div', 'cetr cehd', '<span>وجه المقارنة</span><span>النباتية</span><span>الحيوانية</span>'));
      CMP.forEach((x, i) => { const rr = el('div', 'cetr' + (i === S.i ? ' ceon' : ''), '<span>' + x[1] + '</span><span>' + x[2] + '</span><span>' + x[3] + '</span>'); rr.onclick = () => { S.i = i; draw(); }; tb.append(rr); });
      body.append(tb);
      body.append(el('div', 'sl note', 'اضغط صفًّا في الجدول ليُبرز العُضيّ في الرسم ، ثمّ بدّل نوع الخليّة لترى الفرق.'));
    }
    top(); draw();
  }

  /* ======================= 4 · النقل عبر الغشاء ======================= */
  const TR = {
    simple: { n: 'انتشار بسيط', g: 1, e: 0, p: 0, v: 0, x: 'من التركيز الأعلى إلى الأدنى مباشرة عبر طبقتَي الدهون ، بلا طاقة ولا بروتين ، مثل ' + L('O₂') + ' و ' + L('CO₂') + ' في الحويصلات الهوائية.' },
    facil: { n: 'انتشار مُسهَّل', g: 1, e: 0, p: 1, v: 0, x: 'مع تدرّج التركيز وبلا طاقة ، لكن عبر <b>بروتين ناقل</b> في الغشاء.' },
    active: { n: 'نقل نشط', g: 0, e: 1, p: 1, v: 0, x: '<b>عكس</b> تدرّج التركيز ، فيحتاج إلى طاقة ' + L('ATP') + ' وبروتين ناقل.' },
    osmo: { n: 'خاصية أسموزية', g: 1, e: 0, p: 0, v: 0, x: 'حركة <b>الماء</b> نحو الوسط الأكثر تركيزًا بالمذاب ، وهي نقل سلبي.' },
    endo: { n: 'إدخال خلوي', g: 2, e: 1, p: 0, v: 1, x: 'ينثني الغشاء حول الجسيم الكبير ثمّ يلتحم طرفاه مكوّنًا حويصلة ؛ بلعمة للصلب وشرب خلوي للسائل ، ويحتاج إلى ' + L('ATP') + '.' },
    exo: { n: 'إخراج خلوي', g: 2, e: 1, p: 0, v: 1, x: 'تندمج حويصلة فيها الجسيمات مع الغشاء فتُطلقها خارج الخليّة ، ويحتاج إلى ' + L('ATP') + '.' }
  };
  function drawTr(svg, k, ts) {
    svg.innerHTML = '';
    const T = TR[k];
    sv('rect', { x: 0, y: 0, width: 320, height: 75, fill: '#F7F9FC' }, svg);
    sv('rect', { x: 0, y: 105, width: 320, height: 75, fill: '#FFFDF4' }, svg);
    for (let x = 6; x < 320; x += 12) { sv('circle', { cx: x, cy: 80, r: 4.5, fill: '#E9C46A' }, svg); sv('circle', { cx: x, cy: 100, r: 4.5, fill: '#E9C46A' }, svg); sv('path', { d: 'M' + x + ' 84 v4 M' + x + ' 96 v-4', stroke: '#C08A1E', 'stroke-width': 1.2 }, svg); }
    const ph = (ts / 1000) % 3 / 3;
    if (T.p) { sv('rect', { x: 148, y: 72, width: 24, height: 36, rx: 8, fill: '#8FB3DE', stroke: '#1F4E8C', 'stroke-width': 2 }, svg); }
    if (T.e) { sv('circle', { cx: T.v ? 40 : 200, cy: 150, r: 13, fill: '#FFE08A', stroke: '#C08A1E', 'stroke-width': 2 }, svg); }
    const rnd = i => { const v = Math.sin(i * 12.9898 + 4.1) * 43758.5453; return v - Math.floor(v); };
    const out = k === 'active' ? 4 : 12, inn = k === 'active' ? 12 : 4;
    const col = k === 'osmo' ? '#3A7CA5' : '#D62828';
    for (let i = 0; i < out; i++) sv('circle', { cx: 15 + rnd(i) * 290, cy: 10 + rnd(i + 50) * 55, r: k === 'osmo' ? 4 : 5, fill: col, opacity: .8 }, svg);
    for (let i = 0; i < inn; i++) sv('circle', { cx: 15 + rnd(i + 100) * 290, cy: 115 + rnd(i + 150) * 55, r: k === 'osmo' ? 4 : 5, fill: col, opacity: .8 }, svg);
    if (!T.v) {
      const x = T.p ? 160 : 95, down = true;
      const y = down ? 30 + ph * 120 : 150 - ph * 120;
      sv('circle', { cx: x, cy: y, r: 6, fill: col, stroke: '#fff', 'stroke-width': 2 }, svg);
      sv('path', { d: down ? 'M' + (x + 22) + ' 40 v100 m-6 -8 l6 8 l6 -8' : 'M' + (x + 22) + ' 140 v-100 m-6 8 l6 -8 l6 8', stroke: '#14603f', 'stroke-width': 2, fill: 'none' }, svg);
    } else {
      const inw = k === 'endo', u = ph;
      const cy = inw ? 30 + u * 120 : 150 - u * 120;
      const r = 16;
      sv('circle', { cx: 230, cy: cy, r: r, fill: 'none', stroke: '#E9C46A', 'stroke-width': 4 }, svg);
      sv('circle', { cx: 230, cy: cy, r: 7, fill: '#6A4C93' }, svg);
    }
  }
  function transport(host) {
    host.innerHTML = '';
    const S = { g: null, e: null, p: null };
    const bar = el('div', ''), body = el('div');
    host.append(el('div', 'shint', 'أجب عن الأسئلة الثلاثة بالترتيب ، فتُحدَّد طريقة النقل :'), bar, body);
    let raf = 0;
    function draw() {
      bar.innerHTML = '';
      const Q = (lab, key, opts) => { const w = el('div', 'ceq'); w.append(el('div', 'ceql', lab)); w.append(seg(opts, S[key], v => { S[key] = +v; draw(); })); bar.append(w); };
      Q('1 · اتّجاه الحركة بالنسبة إلى تدرّج التركيز ؟', 'g', [[1, 'مع التدرّج'], [0, 'عكس التدرّج']]);
      Q('2 · هل تحتاج إلى طاقة ATP ؟', 'e', [[1, 'نعم'], [0, 'لا']]);
      Q('3 · هل تحتاج إلى بروتين ناقل ؟', 'p', [[1, 'نعم'], [0, 'لا']]);
      body.innerHTML = '';
      cancelAnimationFrame(raf);
      if (S.g === null || S.e === null || S.p === null) return;
      let k = null;
      if (S.g === 1 && S.e === 0) k = S.p ? 'facil' : 'simple';
      if (S.g === 0 && S.e === 1 && S.p === 1) k = 'active';
      const svg = svgBox(320, 180), f = el('div', 'cefig');
      if (!k) {
        body.append(verdict('acwarn', 'تركيب غير ممكن في هذه الوحدة',
          S.g === 0 && S.e === 0 ? 'الحركة <b>عكس</b> التدرّج لا تحدث بلا طاقة ؛ فهي تحتاج دائمًا إلى ' + L('ATP') + '.' :
          S.g === 1 && S.e === 1 ? 'الحركة مع التدرّج لا تحتاج إلى طاقة ؛ الطاقة تُصرف للحركة عكس التدرّج ( أو للحويصلات ).' :
          'النقل النشط يحتاج إلى بروتين ناقل وطاقة معًا.'));
        return;
      }
      f.append(svg); body.append(f);
      const lg = el('div', 'celeg', '<span>الأعلى : خارج الخليّة</span><span>الأسفل : داخل الخليّة</span>' + (TR[k].e ? '<span class="cey">● ATP</span>' : '') + (TR[k].p ? '<span class="ceb2">▮ بروتين ناقل</span>' : ''));
      body.append(lg);
      body.append(verdict('acok', TR[k].n, TR[k].x));
      const loop = ts => { if (!svg.isConnected) return; drawTr(svg, k, ts); raf = requestAnimationFrame(loop); };
      raf = requestAnimationFrame(loop);
    }
    draw();
  }
  const SCN = [
    ['ينتقل ' + L('O₂') + ' من الحويصلة الهوائية ( تركيز عالٍ ) إلى الدم ( تركيز منخفض ).', 'simple'],
    ['يدخل الغلوكوز الخليّة مع تدرّج تركيزه عبر بروتين في الغشاء دون استهلاك طاقة.', 'facil'],
    ['تضخّ الخليّة أيونات إلى داخلها مع أنّ تركيزها في الداخل أعلى ، وتستهلك ' + L('ATP') + '.', 'active'],
    ['خليّة دم بيضاء تحيط ببكتيريا بغشائها وتدخلها في حويصلة.', 'endo'],
    ['خليّة غدّية تُطلق إنزيمات مُعبّأة في حويصلات إلى خارجها.', 'exo'],
    ['يدخل الماء خليّة البصل الموضوعة في ماء مقطّر.', 'osmo'],
    ['ينتقل ' + L('CO₂') + ' من الدم إلى الحويصلة الهوائية.', 'simple'],
    ['تدخل الخليّة قطرات سائلة بانثناء غشائها ( شرب خلوي ).', 'endo']
  ];
  function transportb(host) {
    host.innerHTML = '';
    const S = { i: 0, pick: null, score: 0, seen: 0, order: shuffle(SCN.map((x, i) => i)) };
    const body = el('div'); host.append(body);
    let raf = 0;
    function draw() {
      body.innerHTML = ''; cancelAnimationFrame(raf);
      const sc = SCN[S.order[S.i]];
      body.append(el('div', 'cecount', 'الموقف ' + (S.i + 1) + ' من ' + SCN.length + ' · الصحيح ' + S.score));
      body.append(verdict('', 'ما طريقة النقل ؟', sc[0]));
      const chips = el('div', 'cechips');
      Object.keys(TR).forEach(k => { const b = el('button', 'cechip' + (S.pick === k ? (k === sc[1] ? ' ceok' : ' cebad') : ''), TR[k].n); b.onclick = () => { if (S.pick) return; S.pick = k; if (k === sc[1]) S.score++; draw(); }; chips.append(b); });
      body.append(chips);
      if (!S.pick) return;
      const ok = S.pick === sc[1];
      const svg = svgBox(320, 180), f = el('div', 'cefig'); f.append(svg); body.append(f);
      body.append(verdict(ok ? 'acok' : 'acwarn', (ok ? 'صحيح : ' : 'الصحيح : ') + TR[sc[1]].n, TR[sc[1]].x));
      const loop = ts => { if (!svg.isConnected) return; drawTr(svg, sc[1], ts); raf = requestAnimationFrame(loop); };
      raf = requestAnimationFrame(loop);
      const r = el('div', 'srow');
      if (S.i < SCN.length - 1) r.append(btn('الموقف التالي', 'go', () => { S.i++; S.pick = null; draw(); }));
      else r.append(el('div', 'sl ok', 'انتهت المواقف : ' + S.score + ' من ' + SCN.length + ' .'), btn('ابدأ من جديد', 'go', () => { S.i = 0; S.pick = null; S.score = 0; S.order = shuffle(S.order); draw(); }));
      body.append(r);
    }
    draw();
  }

  /* ======================= 5 · أثر تراكيز المحاليل ======================= */
  function tonicity(host) {
    host.innerHTML = '';
    const S = { plant: 0, sol: 'hypo', sh: 1 };
    const bar = el('div', 'srow'), body = el('div');
    host.append(bar, body);
    let raf = 0;
    function top() {
      bar.innerHTML = '';
      bar.append(seg([[0, 'خليّة دم حمراء'], [1, 'خليّة نباتية']], S.plant, v => { S.plant = +v; S.sh = 1; top(); draw(); }));
      bar.append(seg([['hypo', 'منخفض التركيز'], ['iso', 'متساوي التركيز'], ['hyper', 'عالي التركيز']], S.sol, v => { S.sol = v; top(); draw(); }));
    }
    function pic(svg, f) {
      svg.innerHTML = '';
      const nOut = S.sol === 'hypo' ? 4 : S.sol === 'iso' ? 10 : 22;
      sv('rect', { x: 0, y: 0, width: 320, height: 200, fill: S.sol === 'hyper' ? '#FFF4DC' : S.sol === 'iso' ? '#F4F8F4' : '#EAF4FB' }, svg);
      const rnd = i => ((i * 7919 + 104729) % 10007) / 10007;
      for (let i = 0; i < nOut; i++) { const x = 10 + rnd(i) * 300, y = 10 + rnd(i + 31) * 180; if (Math.hypot(x - 160, y - 100) > 92) sv('circle', { cx: x, cy: y, r: 3.5, fill: '#C0612B' }, svg); }
      if (!S.plant) {
        const r = 58 * f;
        if (f > 1.32) { // انفجار
          for (let i = 0; i < 9; i++) { const a = i * 0.7; sv('path', { d: 'M' + (160 + Math.cos(a) * 40) + ' ' + (100 + Math.sin(a) * 40) + ' l' + Math.cos(a) * 30 + ' ' + Math.sin(a) * 30, stroke: '#C1121F', 'stroke-width': 4, 'stroke-linecap': 'round' }, svg); }
          for (let i = 0; i < 10; i++) sv('circle', { cx: 160 + Math.cos(i) * (60 + i * 4), cy: 100 + Math.sin(i) * (50 + i * 3), r: 3, fill: '#E5383B' }, svg);
          return 'burst';
        }
        const sq = f < 1 ? 'M' : '';
        if (f < 1) {
          const pts = []; for (let i = 0; i < 24; i++) { const a = i / 24 * Math.PI * 2, rr = r * (1 + 0.12 * Math.sin(i * 3)); pts.push((160 + Math.cos(a) * rr * 1.25) + ' ' + (100 + Math.sin(a) * rr)); }
          sv('path', { d: 'M' + pts.join(' L') + ' Z', fill: '#E5383B', stroke: '#9D0208', 'stroke-width': 2.5 }, svg);
        } else {
          sv('ellipse', { cx: 160, cy: 100, rx: r * 1.25, ry: r, fill: '#E5383B', stroke: '#9D0208', 'stroke-width': 2.5 }, svg);
          if (f < 1.05) sv('ellipse', { cx: 160, cy: 100, rx: r * .55, ry: r * .4, fill: '#C1121F', opacity: .5 }, svg);
        }
      } else {
        sv('rect', { x: 70, y: 30, width: 180, height: 140, rx: 8, fill: 'none', stroke: '#5C7F3A', 'stroke-width': 8 }, svg);
        const shrink = Math.min(1, f);
        const w = 172 * (shrink < 1 ? 0.55 + 0.45 * shrink : 1), h = 132 * (shrink < 1 ? 0.6 + 0.4 * shrink : 1);
        sv('rect', { x: 160 - w / 2, y: 100 - h / 2, width: w, height: h, rx: shrink < 1 ? 30 : 6, fill: '#BFE3B4', stroke: '#1F3A5F', 'stroke-width': f > 1 ? 3.5 : 2 }, svg);
        const vw = w * (f >= 1 ? .7 * Math.min(f, 1.15) : .45 * shrink), vh = h * (f >= 1 ? .62 * Math.min(f, 1.15) : .4 * shrink);
        sv('rect', { x: 160 - vw / 2, y: 100 - vh / 2, width: vw, height: vh, rx: 20, fill: '#D9ECF7', stroke: '#3A7CA5', 'stroke-width': 2 }, svg);
      }
      return 'ok';
    }
    function arrows(svg, ts) {
      if (S.sol === 'iso') {
        const u = (ts / 900) % 1;
        sv('path', { d: 'M' + (20 + u * 20) + ' 100 h28 m-6 -6 l6 6 l-6 6', stroke: '#3A7CA5', 'stroke-width': 3, fill: 'none' }, svg);
        sv('path', { d: 'M' + (300 - u * 20) + ' 100 h-28 m6 -6 l-6 6 l6 6', stroke: '#3A7CA5', 'stroke-width': 3, fill: 'none' }, svg);
        sv('path', { d: 'M' + (68 - u * 20) + ' 120 h-28 m6 -6 l-6 6 l6 6', stroke: '#3A7CA5', 'stroke-width': 3, fill: 'none' }, svg);
        sv('path', { d: 'M' + (252 + u * 20) + ' 120 h28 m-6 -6 l6 6 l-6 6', stroke: '#3A7CA5', 'stroke-width': 3, fill: 'none' }, svg);
        return;
      }
      const inw = S.sol === 'hypo', u = (ts / 900) % 1;
      [[20, 100, 1], [300, 100, -1], [160, 12, 0]].forEach(p => {
        if (p[2] === 0) { const y = inw ? 6 + u * 18 : 30 - u * 18; sv('path', { d: inw ? 'M160 ' + y + ' v14 m-6 -6 l6 6 l6 -6' : 'M160 ' + (y + 14) + ' v-14 m-6 6 l6 -6 l6 6', stroke: '#3A7CA5', 'stroke-width': 3, fill: 'none' }, svg); return; }
        const d = p[2] * (inw ? 1 : -1), x = p[0] + (inw ? u * 20 * p[2] : 20 * p[2] - u * 20 * p[2]);
        sv('path', { d: 'M' + x + ' ' + p[1] + ' h' + 28 * d + ' m' + (-6 * d) + ' -6 l' + 6 * d + ' 6 l' + (-6 * d) + ' 6', stroke: '#3A7CA5', 'stroke-width': 3, fill: 'none' }, svg);
      });
    }
    const TXT = {
      hypo: ['المحلول منخفض التركيز : تركيز المذاب خارج الخليّة <b>أقلّ</b> ← يدخل الماء.', 'تنتفخ ثمّ <b>تنفجر</b> وتنطلق محتوياتها.', 'تنتفخ الفجوة والسيتوبلازم ويضغط الغشاء على الجدار <b>من دون انفجار</b> ؛ الجدار يحميها.'],
      iso: ['المحلول متساوي التركيز : حركة الماء متساوية في الاتّجاهين.', 'لا يتغيّر حجمها ولا شكلها.', 'لا يتغيّر حجمها ولا شكلها.'],
      hyper: ['المحلول عالي التركيز : تركيز المذاب خارج الخليّة <b>أكبر</b> ← يخرج الماء.', '<b>تنكمش</b> الخليّة.', 'تتقلّص الفجوة وينكمش السيتوبلازم ثمّ <b>ينفصل الغشاء عن الجدار</b> ، وقد تموت الخليّة.']
    };
    function draw() {
      body.innerHTML = ''; cancelAnimationFrame(raf);
      const svg = svgBox(320, 200), f = el('div', 'cefig'); f.append(svg); body.append(f);
      body.append(el('div', 'celeg', '<span class="cer">● جزيئات المذاب</span><span class="ceblu">→ اتّجاه حركة الماء</span>'));
      const T = TXT[S.sol];
      const res = el('div'); body.append(res);
      const target = S.sol === 'hypo' ? (S.plant ? 1.12 : 1.4) : S.sol === 'iso' ? 1 : 0.62;
      let st = null; const from = S.sh;
      const loop = ts => {
        if (!svg.isConnected) return;
        if (st === null) st = ts;
        const u = Math.min(1, (ts - st) / 2200);
        S.sh = from + (target - from) * u;
        const r = pic(svg, S.sh);
        if (r !== 'burst') arrows(svg, ts);
        if (u >= 1 && !res.firstChild) res.append(verdict(S.sol === 'iso' ? 'acok' : 'acwarn', (S.plant ? 'الخليّة النباتية : ' : 'خليّة الدم الحمراء : ') + (S.sol === 'iso' ? 'لا تغيّر' : S.sol === 'hypo' ? (S.plant ? 'انتفاخ بلا انفجار' : 'انفجار') : (S.plant ? 'انفصال الغشاء عن الجدار' : 'انكماش')), T[0] + ' ' + T[S.plant ? 2 : 1]));
        raf = requestAnimationFrame(loop);
      };
      raf = requestAnimationFrame(loop);
      const r = el('div', 'srow'); r.append(btn('أعد التجربة', 'gh', () => { S.sh = 1; draw(); })); body.append(r);
      body.append(el('div', 'sl note', 'القاعدة : الماء يتحرّك نحو المكان <b>الأكثر تركيزًا بالمذاب</b> ، والمتحرّك هو الماء لا المذاب.'));
    }
    top(); draw();
  }

  /* ======================= 6 · الأيض : التنفّس والتخمّر ======================= */
  const PR = {
    resp: { n: 'التنفّس الخلوي الهوائي', k: 'هدم', o2: 'يحتاج', loc: 'يبدأ في السيتوبلازم ويكتمل في الميتوكندريا', eq: 'C₆H₁₂O₆ + 6O₂ → 6CO₂ + 6H₂O + Energy (ATP)', ar: 'سكّر الغلوكوز + الأكسجين ← ماء + ثاني أكسيد الكربون + طاقة', who: 'خلايا النباتات والحيوانات' },
    lact: { n: 'التخمّر اللبني', k: 'هدم', o2: 'لا يحتاج', loc: 'سيتوسول الخليّة', eq: 'C₆H₁₂O₆ → 2C₃H₆O₃ + Energy', ar: 'سكّر الغلوكوز ← حمض اللبن + طاقة', who: 'العضلات عند المجهود الكبير ، وبعض النباتات والبكتيريا' },
    alc: { n: 'التخمّر الكحولي', k: 'هدم', o2: 'لا يحتاج', loc: 'خلايا الخميرة', eq: 'C₆H₁₂O₆ → CO₂ + كحول إيثيلي + Energy', ar: 'سكّر الغلوكوز ← كحول إيثيلي + ثاني أكسيد الكربون + طاقة', who: 'الخميرة' },
    photo: { n: 'البناء الضوئي', k: 'بناء', o2: 'يُنتجه', loc: 'البلاستيدة الخضراء', eq: '6H₂O + 6CO₂ → C₆H₁₂O₆ + 6O₂', ar: 'ماء + ثاني أكسيد الكربون ← سكّر الغلوكوز + أكسجين', who: 'خلايا النباتات الخضراء' }
  };
  function procCard(k) {
    const P = PR[k], t = info();
    t.row('نوع العملية', '<b>' + P.k + '</b>');
    t.row('المعادلة', '<span class="ceeq">' + P.eq + '</span>');
    t.row('بالكلمات', P.ar);
    t.row('مكانها', P.loc);
    t.row('الأكسجين', P.o2);
    t.row('أين تحدث ؟', P.who);
    return t;
  }
  function metab(host) {
    host.innerHTML = '';
    const S = { org: 'mus', o2: 1, mode: 'sim', ci: 0, cp: null };
    const bar = el('div', 'srow'), body = el('div');
    host.append(bar, body);
    function top() {
      bar.innerHTML = '';
      bar.append(seg([['sim', 'من أين الطاقة ؟'], ['cls', 'هدم أم بناء ؟']], S.mode, v => { S.mode = v; top(); draw(); }));
    }
    const CLS = [['التنفّس الخلوي الهوائي', 'هدم'], ['البناء الضوئي', 'بناء'], ['التخمّر اللبني', 'هدم'], ['تحويل الغلوكوز إلى سليلوز في الجدار الخلوي', 'بناء'], ['التخمّر الكحولي في الخميرة', 'هدم'], ['تخزين النشا في درنة البطاطا', 'بناء']];
    function draw() {
      body.innerHTML = '';
      if (S.mode === 'cls') {
        const c = CLS[S.ci];
        body.append(el('div', 'cecount', 'العملية ' + (S.ci + 1) + ' من ' + CLS.length));
        body.append(verdict('', 'صنّف العملية', c[0]));
        const r = el('div', 'srow');
        ['هدم', 'بناء'].forEach(x => r.append(btn(x, S.cp === x ? 'go' : '', () => { S.cp = x; draw(); })));
        body.append(r);
        if (S.cp) {
          const ok = S.cp === c[1];
          body.append(verdict(ok ? 'acok' : 'acwarn', (ok ? 'صحيح : ' : 'الصحيح : ') + c[1], c[1] === 'هدم' ? 'تتحطّم فيها جزيئات معقّدة إلى بسيطة و<b>تنتج</b> الطاقة.' : 'تُبنى فيها جزيئات معقّدة من بسيطة و<b>تُستهلَك</b> الطاقة.'));
          const n = el('div', 'srow'); n.append(btn(S.ci < CLS.length - 1 ? 'التالية' : 'من البداية', 'go', () => { S.ci = (S.ci + 1) % CLS.length; S.cp = null; draw(); })); body.append(n);
        }
        return;
      }
      const r = el('div', 'srow');
      r.append(sel('الخليّة', S.org, [['mus', 'خليّة عضلية في الإنسان'], ['yst', 'خليّة خميرة'], ['leaf', 'خليّة ورقة نبات']], v => { S.org = v; draw(); }));
      r.append(sel('الأكسجين', S.o2, [[1, 'متوفّر بكفاية'], [0, 'غير كافٍ']], v => { S.o2 = +v; draw(); }));
      body.append(r);
      const k = S.o2 ? 'resp' : (S.org === 'yst' ? 'alc' : 'lact');
      const svg = svgBox(320, 120), f = el('div', 'cefig'); f.append(svg); body.append(f);
      sv('rect', { x: 10, y: 35, width: 70, height: 50, rx: 10, fill: '#FFF4DC', stroke: '#C08A1E', 'stroke-width': 2 }, svg);
      sv('path', { d: 'M85 60 h50 m-8 -7 l8 7 l-8 7', stroke: '#1F3A5F', 'stroke-width': 3, fill: 'none' }, svg);
      if (k === 'resp') {
        sv('ellipse', { cx: 185, cy: 60, rx: 48, ry: 26, fill: '#FBE3D2', stroke: '#C0612B', 'stroke-width': 2.5 }, svg);
        sv('path', { d: 'M150 60 l8 -10 l8 20 l8 -20 l8 20 l8 -20 l8 20 l8 -20 l8 10', fill: 'none', stroke: '#C0612B', 'stroke-width': 1.5 }, svg);
      } else sv('rect', { x: 140, y: 34, width: 90, height: 52, rx: 14, fill: '#EEF3FA', stroke: '#1F3A5F', 'stroke-width': 2, 'stroke-dasharray': '5 3' }, svg);
      sv('path', { d: 'M238 60 h40 m-8 -7 l8 7 l-8 7', stroke: '#1F3A5F', 'stroke-width': 3, fill: 'none' }, svg);
      const big = k === 'resp';
      for (let i = 0; i < (big ? 6 : 2); i++) sv('circle', { cx: 292 + (i % 2) * 14, cy: 38 + Math.floor(i / 2) * 16, r: 6, fill: '#FFE08A', stroke: '#C08A1E', 'stroke-width': 1.5 }, svg);
      body.append(el('div', 'celeg', '<span>يسار : الغلوكوز</span><span>الوسط : مكان العملية</span><span class="cey">● طاقة ATP ( أكثر في التنفّس الهوائي )</span>'));
      body.append(procCard(k));
      body.append(verdict('acok', PR[k].n, S.o2 ? 'بوجود الأكسجين تُنتج الخليّة معظم طاقتها بالتنفّس الخلوي الهوائي.' :
        S.org === 'yst' ? 'الخميرة دون أكسجين كافٍ تلجأ إلى <b>التخمّر الكحولي</b> ، ويُنتج ' + L('CO₂') + ' الذي ينفخ العجين أو البالون.' :
        S.org === 'leaf' ? 'بعض أنواع النباتات تلجأ إلى <b>التخمّر اللبني</b> عند نقص الأكسجين.' :
        'عند المجهود الكبير لا يكفي الأكسجين ، فتلجأ العضلة إلى <b>التخمّر اللبني</b> ، فيتراكم حمض اللبن ( كما في نهاية الماراثون ).'));
    }
    top(); draw();
  }

  /* ======================= 7 · البناء الضوئي مقابل التنفّس ======================= */
  function metabp(host) {
    host.innerHTML = '';
    const S = { light: 1, row: 0 };
    const bar = el('div', 'srow'), body = el('div');
    host.append(bar, body);
    let raf = 0;
    const ROWS = [
      ['نوع العملية', 'هدم', 'بناء'],
      ['الخلايا', 'النباتات والحيوانات', 'النباتات الخضراء'],
      ['المكان', 'السيتوبلازم ثمّ الميتوكندريا', 'البلاستيدة الخضراء'],
      ['المواد الداخلة', 'غلوكوز وأكسجين', L('CO₂') + ' وماء'],
      ['المواد الناتجة', 'ماء و' + L('CO₂'), 'غلوكوز وأكسجين'],
      ['الطاقة', 'تُنتج ' + L('ATP'), 'تُمتَصّ طاقة ضوئية']
    ];
    function top() {
      bar.innerHTML = '';
      bar.append(seg([[1, 'نهار ( ضوء )'], [0, 'ليل ( ظلام )']], S.light, v => { S.light = +v; top(); draw(); }));
    }
    function draw() {
      body.innerHTML = ''; cancelAnimationFrame(raf);
      const svg = svgBox(320, 170), f = el('div', 'cefig'); f.append(svg); body.append(f);
      body.append(el('div', 'celeg', (S.light ? '<span class="ceg">● O₂ يخرج ( بناء ضوئي )</span>' : '') + '<span class="cegr">● CO₂ يخرج ( تنفّس )</span>' + (S.light ? '<span class="cegr2">● CO₂ يدخل ( بناء ضوئي )</span>' : '')));
      const loop = ts => {
        if (!svg.isConnected) return;
        svg.innerHTML = '';
        sv('rect', { x: 0, y: 0, width: 320, height: 170, fill: S.light ? '#FFFBEA' : '#1E2A44' }, svg);
        if (S.light) { sv('circle', { cx: 285, cy: 30, r: 18, fill: '#F4C430' }, svg); for (let i = 0; i < 3; i++) sv('path', { d: 'M265 ' + (45 + i * 8) + ' L' + (200 - i * 10) + ' ' + (70 + i * 10), stroke: '#F4C430', 'stroke-width': 2, 'stroke-dasharray': '6 5' }, svg); }
        else sv('path', { d: 'M290 20 a16 16 0 1 0 10 28 a12 12 0 1 1 -10 -28', fill: '#E9E4C8' }, svg);
        sv('path', { d: 'M160 165 V95', stroke: '#5C7F3A', 'stroke-width': 5 }, svg);
        sv('path', { d: 'M160 115 q-55 -10 -70 -45 q45 0 70 45 z', fill: '#4E9F3D' }, svg);
        sv('path', { d: 'M160 100 q55 -12 72 -48 q-48 2 -72 48 z', fill: '#4E9F3D' }, svg);
        const u = (ts / 1600) % 1;
        const dotp = (x, y, c, t) => { sv('circle', { cx: x, cy: y, r: 6, fill: c, stroke: '#fff', 'stroke-width': 1.5 }, svg); };
        if (S.light) {
          for (let i = 0; i < 3; i++) { const v = (u + i / 3) % 1; dotp(110 - v * 80, 70 - v * 40, '#2E9E4F'); }
          for (let i = 0; i < 2; i++) { const v = (u + i / 2) % 1; dotp(30 + v * 70, 150 - v * 60, '#8A8A8A'); }
          dotp(215 + u * 50, 75 + u * 40, '#C0612B');
        } else {
          for (let i = 0; i < 3; i++) { const v = (u + i / 3) % 1; dotp(205 + v * 80, 70 + v * 50, '#C0612B'); }
        }
        raf = requestAnimationFrame(loop);
      };
      raf = requestAnimationFrame(loop);
      body.append(verdict(S.light ? 'acok' : 'acwarn', S.light ? 'في الضوء : العمليتان معًا' : 'في الظلام : التنفّس وحده',
        S.light ? 'النبات يبني الغلوكوز في البلاستيدات <b>ويتنفّس</b> في الميتوكندريا في الوقت نفسه ؛ وفي الضوء الكافي يغلب البناء الضوئي فيخرج من الورقة أكسجين أكثر.' :
        'لا ضوء فلا بناء ضوئي ، لكنّ <b>التنفّس الخلوي مستمرّ</b> ليلًا ونهارًا ، فيخرج ' + L('CO₂') + ' . النبات يتنفّس دائمًا.'));
      const eq = el('div', 'cepair');
      eq.append(el('div', 'cecard', '<div class="cect">التنفّس الخلوي الهوائي</div><div class="ceeq">C₆H₁₂O₆ + 6O₂ → 6CO₂ + 6H₂O + ATP</div>'));
      eq.append(el('div', 'cecard' + (S.light ? '' : ' ceoffc'), '<div class="cect">البناء الضوئي</div><div class="ceeq">6H₂O + 6CO₂ → C₆H₁₂O₆ + 6O₂</div>'));
      body.append(eq);
      const tb = el('div', 'cetab');
      tb.append(el('div', 'cetr cehd', '<span>وجه المقارنة</span><span>التنفّس الهوائي</span><span>البناء الضوئي</span>'));
      ROWS.forEach(x => tb.append(el('div', 'cetr', '<span>' + x[0] + '</span><span>' + x[1] + '</span><span>' + x[2] + '</span>')));
      body.append(tb);
      body.append(el('div', 'sl note', 'المعادلتان متعاكستان : الداخل في إحداهما هو الناتج من الأخرى.'));
    }
    top(); draw();
  }

  /* ======================= 8 · العامل المُحدّد ======================= */
  function limfac(host) {
    host.innerHTML = '';
    const S = { L: 40, C: 0, T: 25 };
    const bar = el('div', 'srow'), body = el('div');
    host.append(bar, body);
    const tf = T => T <= 30 ? Math.max(0, T / 30) : Math.max(0, 1 - (T - 30) / 15);
    const cap = C => C ? 80 : 40;
    const rate = (Lx, C, T) => Math.min(Lx * 1.2, cap(C)) * tf(T);
    bar.append(sld('شدّة الإضاءة : ' + S.L + ' %', S.L, 0, 100, 5, (v, sp) => { S.L = v; sp.textContent = 'شدّة الإضاءة : ' + v + ' %'; draw(); }));
    bar.append(sel('تركيز CO₂', S.C, [[0, '0.03 % ( الهواء الجوّي )'], [1, '0.1 % ( مرتفع )']], v => { S.C = +v; draw(); }));
    bar.append(sld('درجة الحرارة : ' + S.T + ' °C', S.T, 0, 45, 1, (v, sp) => { S.T = v; sp.textContent = 'درجة الحرارة : ' + v + ' °C'; draw(); }));
    function draw() {
      body.innerHTML = '';
      const svg = svgBox(320, 200), f = el('div', 'cefig'); f.append(svg); body.append(f);
      const X = l => 40 + l * 2.6, Y = r => 175 - r * 1.8;
      sv('path', { d: 'M40 10 V175 H305', stroke: '#1F3A5F', 'stroke-width': 2, fill: 'none' }, svg);
      [0, 25, 50, 75, 100].forEach(v => { const t = sv('text', { x: X(v), y: 190, 'font-size': 10, 'text-anchor': 'middle', fill: '#5b6b80' }, svg); t.textContent = v; });
      [0, 40, 80].forEach(v => { const t = sv('text', { x: 34, y: Y(v) + 3, 'font-size': 10, 'text-anchor': 'end', fill: '#5b6b80' }, svg); t.textContent = v; sv('path', { d: 'M40 ' + Y(v) + ' H305', stroke: '#E3E8F0', 'stroke-width': 1 }, svg); });
      const curve = (C, col, dash) => { let d = ''; for (let l = 0; l <= 100; l += 2) d += (l ? 'L' : 'M') + X(l) + ' ' + Y(rate(l, C, S.T)); sv('path', { d, stroke: col, 'stroke-width': 3, fill: 'none', 'stroke-dasharray': dash || '' }, svg); };
      curve(1 - S.C, '#B8C2D1', '5 4');
      curve(S.C, '#2E7D4F');
      const r = rate(S.L, S.C, S.T);
      sv('circle', { cx: X(S.L), cy: Y(r), r: 7, fill: '#D62828', stroke: '#fff', 'stroke-width': 2 }, svg);
      body.append(el('div', 'celeg', '<span>الأفقي : شدّة الإضاءة %</span><span>الرأسي : معدّل البناء الضوئي</span><span class="ceg">— التركيز المختار</span><span class="cegr">- - التركيز الآخر</span>'));
      const t = info();
      t.row('معدّل البناء الضوئي', '<b>' + Math.round(r) + '</b> ( وحدة نسبية في هذا النموذج )');
      let lim, msg, cls = 'acok';
      const lightLim = S.L * 1.2 < cap(S.C);
      if (S.T > 30) { lim = 'درجة الحرارة'; cls = 'acwarn'; msg = 'تجاوزت الحرارة الدرجة المُثلى ( 30 °C في هذا النموذج ) ، ف<b>تتلف الإنزيمات</b> وينخفض المعدّل مهما زادت الإضاءة أو ' + L('CO₂') + '.'; }
      else if (S.T < 20 && !lightLim) { lim = 'درجة الحرارة'; msg = 'الحرارة منخفضة ونشاط الإنزيمات قليل ؛ رفعها نحو الدرجة المُثلى يرفع المعدّل.'; }
      else if (lightLim) { lim = 'شدّة الإضاءة'; msg = 'النقطة على الجزء <b>الصاعد</b> من المنحنى : زيادة الإضاءة تزيد المعدّل ، فهي العامل المُحدّد الآن.'; }
      else { lim = S.C ? 'عامل آخر ( كدرجة الحرارة )' : 'تركيز CO₂'; msg = 'النقطة على الجزء <b>الأفقي</b> : زيادة الإضاءة لم تعد ترفع المعدّل ، فهي <b>لم تعد مُحدّدة</b> . ' + (S.C ? 'وحتّى عند التركيز المرتفع يثبت المنحنى ؛ فالمُحدّد الآن عامل آخر.' : 'جرّب رفع تركيز ' + L('CO₂') + ' إلى 0.1 % : يرتفع المنحنى كلّه.'); }
      t.row('العامل المُحدّد الآن', '<b>' + lim + '</b>');
      body.append(t, verdict(cls, 'لماذا ؟', msg));
      body.append(el('div', 'sl note', 'العامل المُحدّد : العامل الذي تسبّب زيادته زيادةً في المعدّل . وحين يثبت المنحنى ينتقل الدور إلى عامل آخر . ( الأرقام في هذا النموذج توضيحية ، لا من الكتاب . )'));
    }
    draw();
  }

  /* ======================= 9 · الانقسام المتساوي والمُنصّف ======================= */
  const RED = '#D62828', RED2 = '#F28482', BLU = '#1F4E8C', BLU2 = '#7FA7D9';
  function chrom(svg, x, y, len, c1, c2, dup, ang, cross) {
    const g = sv('g', { transform: 'translate(' + x + ' ' + y + ') rotate(' + (ang || 0) + ')' }, svg);
    if (dup) {
      sv('rect', { x: -7, y: -len / 2, width: 6, height: len, rx: 3, fill: c1 }, g);
      sv('rect', { x: 1, y: -len / 2, width: 6, height: len, rx: 3, fill: c1 }, g);
      if (cross) sv('rect', { x: cross > 0 ? 1 : -7, y: len / 2 - len * .35, width: 6, height: len * .35, rx: 3, fill: c2 }, g);
      sv('circle', { cx: 0, cy: 0, r: 3.5, fill: '#333' }, g);
    } else {
      sv('rect', { x: -3, y: -len / 2, width: 6, height: len, rx: 3, fill: c1 }, g);
      if (cross) sv('rect', { x: -3, y: len / 2 - len * .35, width: 6, height: len * .35, rx: 3, fill: c2 }, g);
      sv('circle', { cx: 0, cy: 0, r: 2.6, fill: '#333' }, g);
    }
    return g;
  }
  const cellC = (svg, cx, cy, rx, ry, env, cent) => {
    sv('ellipse', { cx, cy, rx, ry, fill: '#F4F6FB', stroke: '#1F3A5F', 'stroke-width': 2.5 }, svg);
    if (env) sv('circle', { cx, cy, r: Math.min(rx, ry) * .55, fill: env === 2 ? 'none' : '#E3E8F3', stroke: '#1F3A5F', 'stroke-width': 1.6, 'stroke-dasharray': env === 2 ? '4 4' : '' }, svg);
    if (cent) cent.forEach(p => { sv('rect', { x: p[0] - 6, y: p[1] - 2, width: 12, height: 4, fill: '#5D7C99' }, svg); sv('rect', { x: p[0] - 2, y: p[1] - 6, width: 4, height: 12, fill: '#5D7C99' }, svg); });
  };
  const spindle = (svg, px1, px2, cy, xs) => { xs.forEach(p => { sv('path', { d: 'M' + px1 + ' ' + cy + ' L' + p[0] + ' ' + p[1], stroke: '#9AA7BA', 'stroke-width': 1 }, svg); sv('path', { d: 'M' + px2 + ' ' + cy + ' L' + p[2] + ' ' + p[1], stroke: '#9AA7BA', 'stroke-width': 1 }, svg); }); };
  const chromatin = (svg, cx, cy) => { [[RED, -12], [RED2, -4], [BLU, 4], [BLU2, 12]].forEach(c => sv('path', { d: 'M' + (cx - 20) + ' ' + (cy + c[1]) + ' q5 -6 10 0 t10 0 t10 0 t10 0', stroke: c[0], 'stroke-width': 1.6, fill: 'none' }, svg)); };
  const MIT = [
    { n: 'المرحلة البينية : G1', x: 'يزداد حجم الخليّة وتتضاعف معظم عُضيّاتها . المادّة الوراثية كروماتين غير مرئيّ الكروموسومات.', c: '4 كروموسومات ( غير مضاعفة )' },
    { n: 'المرحلة البينية : S', x: 'تبني الخليّة <b>نسخة ثانية</b> من مادّتها الوراثية ؛ فيصبح كلّ كروموسوم كروماتيدين شقيقين.', c: '4 كروموسومات ، كلّ منها كروماتيدان' },
    { n: 'المرحلة البينية : G2', x: 'تتهيّأ للانقسام : ينقسم الجسم المركزي فيصبح في الخليّة جسمان مركزيان ، والمادّة الوراثية ما زالت كروماتين.', c: '4 كروموسومات مضاعفة' },
    { n: 'الطور التمهيدي', x: 'تقصر الكروموسومات وتغلظ فتظهر ( كروماتيدان شقيقان تربطهما القطعة المركزية ) ، يتفكّك الغلاف النووي ، تختفي النويّة ، وتبدأ الخيوط المغزلية بالتكوّن.', c: '4 كروموسومات مضاعفة' },
    { n: 'الطور الاستوائي', x: 'يستقرّ المُريكزان عند القطبين ، وتصطفّ الكروموسومات على <b>خطّ منتصف</b> الخليّة.', c: '4 كروموسومات مضاعفة' },
    { n: 'الطور الانفصالي', x: 'تتكمّش الخيوط المغزلية ، وتنقسم القطعة المركزية ، و<b>تنفصل الكروماتيدات الشقيقة</b> كلّ إلى قطب.', c: '4 عند كلّ قطب' },
    { n: 'الطور النهائي', x: 'يتشكّل الغلاف النووي حول كلّ مجموعة ، وتظهر النويّة ، ويقلّ تكثّف الكروموسومات ، وتختفي الخيوط المغزلية.', c: '4 في كلّ نواة' },
    { n: 'انقسام السيتوبلازم', x: 'يبدأ بتخصّر في الغشاء البلازمي ، ثمّ تنقسم الخليّة إلى <b>خليّتين متطابقتين</b> ، في كلّ منهما العدد الأصلي.', c: 'خليّتان × 4 كروموسومات' }
  ];
  const SET4 = [[RED, 40], [RED2, 40], [BLU, 26], [BLU2, 26]];
  function drawMit(svg, i) {
    svg.innerHTML = '';
    const cx = 160, cy = 100;
    if (i <= 2) {
      cellC(svg, cx, cy, 140, 85, 1, i === 2 ? [[85, 40], [235, 40]] : [[160, 30]]);
      if (i === 0) chromatin(svg, cx, cy); else { chromatin(svg, cx, cy - 4); chromatin(svg, cx, cy + 6); }
      return;
    }
    if (i === 3) {
      cellC(svg, cx, cy, 140, 85, 2, [[60, 100], [260, 100]]);
      [[130, 80, 20], [185, 75, -25], [140, 125, 60], [190, 120, 10]].forEach((p, k) => chrom(svg, p[0], p[1], SET4[k][1], SET4[k][0], null, 1, p[2]));
      return;
    }
    if (i === 4) {
      cellC(svg, cx, cy, 140, 85, 0, [[35, 100], [285, 100]]);
      const ys = [45, 80, 115, 150]; spindle(svg, 35, 285, 100, ys.map(y => [cx - 7, y, cx + 7]));
      ys.forEach((y, k) => chrom(svg, cx, y, SET4[k][1] * .75, SET4[k][0], null, 1, 0));
      return;
    }
    if (i === 5) {
      cellC(svg, cx, cy, 145, 80, 0, [[30, 100], [290, 100]]);
      const ys = [50, 82, 116, 148]; spindle(svg, 30, 290, 100, ys.map(y => [cx - 60, y, cx + 60]));
      ys.forEach((y, k) => { chrom(svg, cx - 60, y, SET4[k][1] * .8, SET4[k][0], null, 0, 90); chrom(svg, cx + 60, y, SET4[k][1] * .8, SET4[k][0], null, 0, 90); });
      return;
    }
    if (i === 6) {
      sv('path', { d: 'M20 100 C20 20 150 30 160 60 C170 30 300 20 300 100 C300 180 170 170 160 140 C150 170 20 180 20 100 Z', fill: '#F4F6FB', stroke: '#1F3A5F', 'stroke-width': 2.5 }, svg);
      [85, 235].forEach(x => { sv('circle', { cx: x, cy: 100, r: 38, fill: '#E3E8F3', stroke: '#1F3A5F', 'stroke-width': 1.6 }, svg); [[-14, RED, 32], [-5, RED2, 32], [5, BLU, 22], [14, BLU2, 22]].forEach(c => chrom(svg, x + c[0], 100, c[2], c[1], null, 0, 0)); });
      return;
    }
    [80, 240].forEach(x => { cellC(svg, x, 100, 72, 70, 1, [[x, 40]]); chromatin(svg, x, 100); });
  }
  const MEI = [
    { n: 'المرحلة البينية', x: 'تتضاعف المادّة الوراثية مرّة واحدة <b>قبل المرحلة الأولى فقط</b> . في الرسم زوجان من الكروموسومات المتماثلة ( الأحمران زوج ، والأزرقان زوج ).', c: '4 كروموسومات مضاعفة ( 2n = 4 )', k: 1 },
    { n: 'التمهيدي الأوّل', x: 'يتفكّك الغلاف النووي وتختفي النويّة ، وتترتّب <b>المتماثلة أزواجًا</b> ، ويحدث <b>العبور</b> : تبادل أجزاء بين كروماتيدين غير شقيقين ( لاحظ الطرفين المتبادلين ).', c: '4 كروموسومات مضاعفة ، في زوجين', k: 1 },
    { n: 'الاستوائي الأوّل', x: 'تترتّب <b>أزواج</b> الكروموسومات المتماثلة على خطّ المنتصف : كلّ كروموسوم من الزوج على جهة.', c: 'زوجان على خطّ المنتصف', k: 1 },
    { n: 'الانفصالي الأوّل', x: 'تنفصل <b>الكروموسومات المتماثلة</b> نحو القطبين ، وتظلّ <b>الكروماتيدات الشقيقة متّصلة</b>.', c: '2 مضاعفة عند كلّ قطب', k: 1 },
    { n: 'النهائي الأوّل', x: 'تتكوّن نواتان ثمّ ينقسم السيتوبلازم : <b>خليّتان</b> في كلّ منهما <b>نصف العدد</b> ( كروموسوم من كلّ زوج ).', c: 'خليّتان × 2 كروموسوم مضاعف', k: 2 },
    { n: 'التمهيدي والاستوائي الثاني', x: 'لا تضاعف جديد . يتلاشى الغلاف النووي وتتكوّن الخيوط المغزلية ، ثمّ تصطفّ الكروموسومات ( كلّ منها كروماتيدان ) على خطّ المنتصف في كلّ خليّة.', c: 'خليّتان × 2 مضاعف', k: 2 },
    { n: 'الانفصالي الثاني', x: 'تنفصل <b>الكروماتيدات الشقيقة</b> ، ويُسمّى كلّ منها كروموسومًا.', c: '2 عند كلّ قطب في كلّ خليّة', k: 2 },
    { n: 'النهائي الثاني', x: 'يتشكّل غلاف نووي وينقسم السيتوبلازم : <b>أربع خلايا</b> في كلّ منها <b>نصف العدد الأصلي</b> ، و<b>غير متطابقة</b> بسبب العبور.', c: '4 خلايا × 2 كروموسوم ( n = 2 )', k: 4 }
  ];
  function drawMei(svg, i) {
    svg.innerHTML = '';
    if (i === 0) { cellC(svg, 160, 100, 140, 85, 1, [[85, 40], [235, 40]]); chromatin(svg, 160, 96); chromatin(svg, 160, 106); return; }
    if (i === 1) {
      cellC(svg, 160, 100, 140, 85, 2, [[60, 100], [260, 100]]);
      chrom(svg, 140, 85, 40, RED, RED2, 1, 0, 1); chrom(svg, 156, 85, 40, RED2, RED, 1, 0, -1);
      chrom(svg, 170, 125, 26, BLU, BLU2, 1, 0, 1); chrom(svg, 186, 125, 26, BLU2, BLU, 1, 0, -1);
      return;
    }
    if (i === 2) {
      cellC(svg, 160, 100, 140, 85, 0, [[35, 100], [285, 100]]);
      spindle(svg, 35, 285, 100, [[150, 70, 170], [150, 130, 170]]);
      chrom(svg, 148, 70, 36, RED, RED2, 1, 0, 1); chrom(svg, 172, 70, 36, RED2, RED, 1, 0, -1);
      chrom(svg, 148, 130, 24, BLU2, BLU, 1, 0, -1); chrom(svg, 172, 130, 24, BLU, BLU2, 1, 0, 1);
      return;
    }
    if (i === 3) {
      cellC(svg, 160, 100, 145, 80, 0, [[30, 100], [290, 100]]);
      spindle(svg, 30, 290, 100, [[90, 70, 230], [90, 130, 230]]);
      chrom(svg, 90, 70, 36, RED, RED2, 1, 0, 1); chrom(svg, 230, 70, 36, RED2, RED, 1, 0, -1);
      chrom(svg, 90, 130, 24, BLU2, BLU, 1, 0, -1); chrom(svg, 230, 130, 24, BLU, BLU2, 1, 0, 1);
      return;
    }
    const two = [[80, [RED, RED2, 1], [BLU2, BLU, -1]], [240, [RED2, RED, -1], [BLU, BLU2, 1]]];
    if (i === 4) {
      two.forEach(c => { cellC(svg, c[0], 100, 72, 70, 1, [[c[0], 38]]); chrom(svg, c[0] - 14, 100, 36, c[1][0], c[1][1], 1, 0, c[1][2]); chrom(svg, c[0] + 14, 100, 24, c[2][0], c[2][1], 1, 0, c[2][2]); });
      return;
    }
    if (i === 5) {
      two.forEach(c => { cellC(svg, c[0], 100, 72, 70, 0, [[c[0] - 62, 100], [c[0] + 62, 100]]); spindle(svg, c[0] - 62, c[0] + 62, 100, [[c[0] - 6, 75, c[0] + 6], [c[0] - 6, 125, c[0] + 6]]); chrom(svg, c[0], 75, 30, c[1][0], c[1][1], 1, 0, c[1][2]); chrom(svg, c[0], 125, 20, c[2][0], c[2][1], 1, 0, c[2][2]); });
      return;
    }
    if (i === 6) {
      two.forEach(c => {
        cellC(svg, c[0], 100, 74, 70, 0, [[c[0] - 64, 100], [c[0] + 64, 100]]);
        const A = c[1], B = c[2];
        chrom(svg, c[0] - 34, 75, 30, A[2] > 0 ? A[0] : A[0], A[1], 0, 90, A[2] > 0 ? 0 : 1); chrom(svg, c[0] + 34, 75, 30, A[0], A[1], 0, 90, A[2] > 0 ? 1 : 0);
        chrom(svg, c[0] - 34, 125, 20, B[0], B[1], 0, 90, B[2] > 0 ? 0 : 1); chrom(svg, c[0] + 34, 125, 20, B[0], B[1], 0, 90, B[2] > 0 ? 1 : 0);
      });
      return;
    }
    two.forEach((c, ci) => [0, 1].forEach(s => {
      const x = (ci ? 200 : 45) + s * 75;
      cellC(svg, x, 100, 36, 60, 1, null);
      const A = c[1], B = c[2];
      const crA = (A[2] > 0) === (s === 1), crB = (B[2] > 0) === (s === 1);
      chrom(svg, x - 8, 100, 30, A[0], A[1], 0, 0, crA ? 1 : 0);
      chrom(svg, x + 8, 100, 20, B[0], B[1], 0, 0, crB ? 1 : 0);
    }));
  }
  function divider(host, ST, drawer, title) {
    host.innerHTML = '';
    const S = { i: 0 };
    const body = el('div'); host.append(body);
    function draw() {
      body.innerHTML = '';
      const steps = el('div', 'cesteps');
      ST.forEach((s, k) => { const b = el('button', 'cedot' + (k === S.i ? ' ceon' : k < S.i ? ' cedone' : ''), String(k + 1)); b.title = s.n; b.onclick = () => { S.i = k; draw(); }; steps.append(b); });
      body.append(steps);
      const svg = svgBox(320, 200), f = el('div', 'cefig'); f.append(svg); body.append(f);
      drawer(svg, S.i);
      const T = ST[S.i];
      body.append(verdict('', (S.i + 1) + ' · ' + T.n, T.x));
      const t = info(); t.row('الكروموسومات', T.c); body.append(t);
      const r = el('div', 'srow');
      r.append(btn('→ السابق', 'gh', () => { if (S.i > 0) { S.i--; draw(); } }), btn('التالي ←', 'go', () => { if (S.i < ST.length - 1) { S.i++; draw(); } }));
      body.append(r);
      if (S.i === ST.length - 1) body.append(el('div', 'sl note', title));
    }
    draw();
  }
  const mitosis = h => divider(h, MIT, drawMit, 'النتيجة : خليّتان <b>متطابقتان</b> فيهما العدد الأصلي من الكروموسومات ، ولا عبور . الترتيب : تمهيدي ← استوائي ← انفصالي ← نهائي.');
  const meiosis = h => divider(h, MEI, drawMei, 'النتيجة : <b>أربع</b> خلايا في كلّ منها <b>نصف</b> العدد ، غير متطابقة بسبب العبور . في الانفصالي الأوّل تنفصل المتماثلة ، وفي الثاني تنفصل الشقيقة.');

  /* ======================= 10 · المساحة إلى الحجم ======================= */
  function savol(host) {
    host.innerHTML = '';
    const S = { a: 1 };
    const bar = el('div', 'srow'), body = el('div');
    host.append(bar, body);
    bar.append(sld('طول ضلع المكعّب : ' + S.a + ' cm', S.a, 1, 6, 1, (v, sp) => { S.a = v; sp.textContent = 'طول ضلع المكعّب : ' + v + ' cm'; draw(); }));
    const fmt = x => (Math.round(x * 100) / 100).toString();
    function draw() {
      body.innerHTML = '';
      const a = S.a, A = 6 * a * a, V = a * a * a, R = A / V;
      const svg = svgBox(320, 170), f = el('div', 'cefig'); f.append(svg); body.append(f);
      const u = 16, s = a * u, ox = 160 - s * .7, oy = 150, d = s * .45;
      sv('path', { d: 'M' + ox + ' ' + oy + ' h' + s + ' v' + (-s) + ' h' + (-s) + ' Z', fill: '#BFE3B4', stroke: '#2E7D4F', 'stroke-width': 2 }, svg);
      sv('path', { d: 'M' + ox + ' ' + (oy - s) + ' l' + d + ' ' + (-d) + ' h' + s + ' l' + (-d) + ' ' + d + ' Z', fill: '#D7EFCF', stroke: '#2E7D4F', 'stroke-width': 2 }, svg);
      sv('path', { d: 'M' + (ox + s) + ' ' + oy + ' l' + d + ' ' + (-d) + ' v' + (-s) + ' l' + (-d) + ' ' + d + ' Z', fill: '#A6D49A', stroke: '#2E7D4F', 'stroke-width': 2 }, svg);
      for (let i = 1; i < a; i++) { sv('path', { d: 'M' + (ox + i * u) + ' ' + oy + ' v' + (-s) + ' M' + ox + ' ' + (oy - i * u) + ' h' + s, stroke: '#2E7D4F', 'stroke-width': .7, opacity: .6 }, svg); }
      const t = info();
      t.row('مساحة السطح = ضلع × ضلع × 6', L(a + ' × ' + a + ' × 6 = ' + A + ' cm²'));
      t.row('الحجم = ضلع × ضلع × ضلع', L(a + ' × ' + a + ' × ' + a + ' = ' + V + ' cm³'));
      t.row('نسبة المساحة إلى الحجم', '<b>' + L(fmt(R) + ' : 1') + '</b>');
      body.append(t);
      const bars = el('div', 'cebars');
      [1, 2, 3, 4, 5, 6].forEach(k => { const r = 6 / k; const b = el('div', 'cebar' + (k === a ? ' ceon' : ''), '<i style="height:' + (r / 6 * 100) + '%"></i><span>' + k + ' cm</span>'); bars.append(b); });
      body.append(el('div', 'shint', 'نسبة المساحة إلى الحجم لكلّ طول ضلع :'), bars);
      body.append(verdict(a <= 1 ? 'acok' : 'acwarn', a === 1 ? 'أكبر نسبة : تبادل مواد سهل' : 'كلّما كبر الحجم قلّت النسبة',
        'المساحة تكبر بمربّع الضلع ، والحجم بمكعّبه ؛ فالحجم يسبق المساحة . والخليّة الكبيرة غشاؤها <b>صغير نسبةً إلى حجمها</b> ، فيصعب عليها توفير المواد اللازمة ، فتنقسم . ( وفي الكتاب : 6 : 1 ، 3 : 1 ، 2 : 1 لأضلاع 1 و2 و3 cm )'));
    }
    draw();
  }

  window.SIMS.cellkind = cellkind;
  window.SIMS.cellmap = h => cellmap(h, SETA);
  window.SIMS.cellmape = h => cellmap(h, SETB);
  window.SIMS.cellcmp = cellcmp;
  window.SIMS.transport = transport;
  window.SIMS.transportb = transportb;
  window.SIMS.tonicity = tonicity;
  window.SIMS.metab = metab;
  window.SIMS.metabp = metabp;
  window.SIMS.limfac = limfac;
  window.SIMS.mitosis = mitosis;
  window.SIMS.meiosis = meiosis;
  window.SIMS.savol = savol;
})();
/* ===== محاكاة المياه ( علوم الأرض والبيئة — التاسع — الوحدة الثانية ) ===== */
(function () {
  const el = (t, c, h) => { const e = document.createElement(t); if (c) e.className = c; if (h !== undefined) e.innerHTML = h; return e; };
  const btn = (txt, cls, fn) => { const b = el('button', 'sb ' + (cls || ''), txt); b.onclick = fn; return b; };
  const L = s => '<span class="ltr">' + s + '</span>';
  const sel = (lab, val, opts, fn) => {
    const w = el('label', 'sf'); w.append(el('span', '', lab));
    const s = document.createElement('select');
    opts.forEach(o => { const p = document.createElement('option'); p.value = o[0]; p.textContent = o[1]; if (String(o[0]) === String(val)) p.selected = true; s.append(p); });
    s.onchange = () => fn(s.value); w.append(s); return w;
  };
  const sld = (lab, val, lo, hi, step, fn) => {
    const w = el('label', 'sf'); const sp = el('span', '', lab(val)); w.append(sp);
    const r = document.createElement('input'); r.type = 'range'; r.min = lo; r.max = hi; r.step = step; r.value = val;
    r.oninput = () => { sp.innerHTML = lab(+r.value); fn(+r.value); }; w.append(r); return w;
  };
  const info = () => { const b = el('div', 'cyinfo'); b.row = (k, v) => b.append(el('div', 'cyrow', '<span class="cyk">' + k + '</span><span class="cyv">' + v + '</span>')); return b; };
  const verdict = (cls, b, s) => el('div', 'acv' + (cls ? ' ' + cls : ''), '<b>' + b + '</b><span>' + s + '</span>');
  const seg = (opts, val, fn) => {
    const w = el('div', 'wrseg');
    opts.forEach(o => { const b = el('button', 'wrb' + (String(o[0]) === String(val) ? ' wron' : ''), o[1]); b.onclick = () => fn(o[0]); w.append(b); });
    return w;
  };
  const NS = 'http://www.w3.org/2000/svg';
  const sv = (t, a, p) => { const e = document.createElementNS(NS, t); for (const k in a) e.setAttribute(k, a[k]); if (p) p.append(e); return e; };
  const svgBox = (w, h) => sv('svg', { viewBox: '0 0 ' + w + ' ' + h, class: 'wrsvg', preserveAspectRatio: 'xMidYMid meet' });
  const fig = (body, w, h) => { const s = svgBox(w, h), f = el('div', 'wrfig'); f.append(s); body.append(f); return s; };
  const shuffle = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const fmt = x => { const r = Math.round(x * 100) / 100; return String(r); };
  const num = x => Math.round(x).toLocaleString('en-US');
  const rnd = i => { const v = Math.sin(i * 12.9898 + 4.1) * 43758.5453; return v - Math.floor(v); };
  const BLUE = '#3A7CA5', SEA = '#2F6E9E', ICE = '#CFE8F5', GRN = '#4E9F3D', SAND = '#E9D3A1', CLAY = '#B07A57', ROCK = '#8C8C8C';

  /* ======================= 1 · توزيع مياه الأرض ======================= */
  function wdist(host) {
    host.innerHTML = '';
    const S = { tot: 1000, k: 'fresh' };
    const bar = el('div', 'srow'), body = el('div');
    host.append(bar, body);
    bar.append(sld(v => 'لو كانت مياه الأرض كلّها : ' + L(num(v) + ' L'), S.tot, 100, 10000, 100, v => { S.tot = v; draw(); }));
    const P = {
      salt: ['مياه مالحة ( بحار ومحيطات )', 97.5, '#2F6E9E', 'all', 'لا تصلح للشرب ولا للريّ دون تحلية.'],
      fresh: ['مياه عذبة', 2.5, '#7FC8A9', 'all', 'أقلّ من 2.5 % من مياه الأرض ، وهي كلّ ما يمكن أن نشربه.'],
      ice: ['جليديات في الأقطاب', 68.7, '#CFE8F5', 'fresh', 'أكبر مخزون عذب ، لكن لا يمكن الوصول إليه في الغالب.'],
      gw: ['مياه جوفية', 30.1, '#8E6C4E', 'fresh', 'في الخزانات الجوفية ، ويعتمد عليها الأردن اعتمادًا رئيسًا.'],
      sw: ['مياه سطحية سائلة ( جداول وأنهار وبحيرات )', 1.2, '#3A7CA5', 'fresh', 'نحو 1.2 % فقط من المياه العذبة.']
    };
    function draw() {
      body.innerHTML = '';
      const mk = (keys, title) => {
        body.append(el('div', 'wrbt', title));
        const b = el('div', 'wrbar');
        keys.forEach(k => { const p = P[k]; const c = el('button', 'wrbs' + (S.k === k ? ' wron' : ''), ''); c.style.flex = '0 0 ' + Math.max(p[1], 1.6) + '%'; c.style.background = p[2]; c.title = p[0]; c.onclick = () => { S.k = k; draw(); }; b.append(c); });
        body.append(b);
        const lg = el('div', 'wrlg'); keys.forEach(k => lg.append(el('span', '', '<i style="background:' + P[k][2] + '"></i>' + P[k][0] + ' ' + L(P[k][1] + ' %')))); body.append(lg);
      };
      mk(['salt', 'fresh'], 'كلّ مياه الأرض');
      mk(['ice', 'gw', 'sw'], 'المياه العذبة وحدها ( مكبَّرة )');
      const p = P[S.k], t = info();
      const share = p[3] === 'all' ? p[1] / 100 : 0.025 * p[1] / 100;
      t.row('الجزء المختار', '<b>' + p[0] + '</b>');
      t.row(p[3] === 'all' ? 'نسبته من كلّ مياه الأرض' : 'نسبته من المياه العذبة', L(p[1] + ' %'));
      t.row('من ' + L(num(S.tot) + ' L'), L(fmt(S.tot * share) + ' L') + ( p[3] === 'fresh' ? ' ( ' + L(num(S.tot) + ' × 2.5 % × ' + p[1] + ' %') + ' )' : ''));
      t.row('ملاحظة', p[4]);
      body.append(t);
      const usable = S.tot * 0.025 * (30.1 + 1.2) / 100;
      body.append(verdict('acok', 'ما يمكن الوصول إليه فعلًا', 'من ' + L(num(S.tot) + ' L') + ' لا يصل الإنسان بسهولة إلّا إلى نحو ' + L(fmt(usable) + ' L') + ' ( الجوفية والسطحية السائلة ) . والذي يعوّض ما نستهلكه منها هو <b>الهطل المتجدّد</b> ، فمياه الأمطار هي المصدر الرئيس للمياه العذبة.'));
    }
    draw();
  }

  /* ======================= 2 · دورة الماء ======================= */
  const PROC = {
    evap: { n: 'التبخّر', x: 'يتبخّر الماء من المسطّحات المائية بفعل حرارة الشمس.', p: 'M95 165 C 95 120 110 90 120 60' },
    trans: { n: 'النتح', x: 'يخرج بخار الماء من النباتات.', p: 'M225 130 C 220 105 205 80 190 60' },
    cond: { n: 'التكاثف', x: 'يتكاثف بخار الماء في طبقات الجوّ العليا فتتكوّن الغيوم.', p: 'M125 45 L 175 40' },
    prec: { n: 'الهطل', x: 'يعود الماء إلى سطح الأرض ثلوجًا أو بَرَدًا أو أمطارًا.', p: 'M240 45 L 255 105' },
    run: { n: 'الجريان السطحي', x: 'الجزء المتبقّي يتدفّق على سطح الأرض نحو الأنهار والسيول والبحيرات.', p: 'M270 125 C 230 150 180 160 140 168' },
    inf: { n: 'الارتشاح', x: 'يتسرّب جزء من الماء إلى باطن الأرض ويُخزَّن مياهًا جوفية.', p: 'M265 135 L 262 185' },
    gw: { n: 'الجريان الجوفي', x: 'تنتقل المياه الجوفية تحت سطح الأرض ، وقد تصل إلى البحار والأنهار.', p: 'M255 195 C 210 200 160 200 120 185' }
  };
  function drawCycle(svg, hi, ts) {
    svg.innerHTML = '';
    sv('rect', { x: 0, y: 0, width: 320, height: 220, fill: '#EEF6FC' }, svg);
    sv('circle', { cx: 35, cy: 30, r: 16, fill: '#F4C430' }, svg);
    sv('path', { d: 'M0 175 L0 220 L320 220 L320 140 C 300 120 280 95 265 100 C 240 110 235 150 200 160 L150 170 Z', fill: '#C9B58A' }, svg);
    sv('path', { d: 'M0 190 L320 190 L320 220 L0 220 Z', fill: '#A88B63', opacity: .6 }, svg);
    sv('path', { d: 'M0 165 L150 168 L150 176 L0 176 Z', fill: SEA }, svg);
    sv('path', { d: 'M226 130 v-25', stroke: '#6B4F2B', 'stroke-width': 4 }, svg);
    sv('circle', { cx: 226, cy: 100, r: 13, fill: GRN }, svg);
    [[150, 40], [175, 36], [200, 42], [240, 38]].forEach(c => sv('ellipse', { cx: c[0], cy: c[1], rx: 26, ry: 13, fill: '#fff', stroke: '#B8C6D8' }, svg));
    Object.keys(PROC).forEach(k => {
      const on = !hi || hi === k;
      const p = sv('path', { d: PROC[k].p, fill: 'none', stroke: on ? (hi === k ? '#D62828' : BLUE) : '#B8C6D8', 'stroke-width': hi === k ? 4 : 2.5, 'stroke-dasharray': k === 'gw' || k === 'inf' ? '6 4' : '', 'marker-end': 'url(#wrar' + (hi === k ? 'r' : 'b') + ')' }, svg);
      if (hi === k) {
        const len = p.getTotalLength ? p.getTotalLength() : 0;
        if (len) { const u = ((ts || 0) / 1500) % 1; const pt = p.getPointAtLength(u * len); sv('circle', { cx: pt.x, cy: pt.y, r: 5, fill: '#1F4E8C', stroke: '#fff', 'stroke-width': 1.5 }, svg); }
      }
    });
    const defs = sv('defs', {}, svg);
    [['b', BLUE], ['r', '#D62828']].forEach(m => { const mk = sv('marker', { id: 'wrar' + m[0], viewBox: '0 0 10 10', refX: 8, refY: 5, markerWidth: 6, markerHeight: 6, orient: 'auto-start-reverse' }, defs); sv('path', { d: 'M0 0 L10 5 L0 10 z', fill: m[1] }, mk); });
  }
  function wcycle(host) {
    host.innerHTML = '';
    const S = { mode: 'x', k: 'evap', seq: [] };
    const bar = el('div', 'srow'), body = el('div');
    host.append(bar, body);
    let raf = 0;
    function top() { bar.innerHTML = ''; bar.append(seg([['x', 'استكشف العمليات'], ['q', 'تتبّع قطرة']], S.mode, v => { S.mode = v; S.seq = []; top(); draw(); })); }
    const NEXT = { start: ['evap', 'trans'], evap: ['cond'], trans: ['cond'], cond: ['prec'], prec: ['run', 'inf'], run: ['evap'], inf: ['gw'], gw: ['evap'] };
    function draw() {
      body.innerHTML = ''; cancelAnimationFrame(raf);
      const svg = fig(body, 320, 220);
      const hi = S.mode === 'x' ? S.k : S.seq[S.seq.length - 1];
      const loop = ts => { if (!svg.isConnected) return; drawCycle(svg, hi, ts); raf = requestAnimationFrame(loop); };
      raf = requestAnimationFrame(loop);
      body.append(el('div', 'wrlg', '<span><i style="background:' + BLUE + '"></i>سهم متّصل : فوق السطح</span><span><i style="background:#8C8C8C"></i>سهم متقطّع : تحت السطح</span>'));
      if (S.mode === 'x') {
        const ch = el('div', 'wrchips');
        Object.keys(PROC).forEach(k => { const b = el('button', 'wrchip' + (S.k === k ? ' wron' : ''), PROC[k].n); b.onclick = () => { S.k = k; draw(); }; ch.append(b); });
        body.append(ch, verdict('', PROC[S.k].n, PROC[S.k].x));
        body.append(el('div', 'sl note', 'بعد الهطل يتوزّع الماء : جزء يعود إلى المسطّحات ، وجزء يرتشح ، والجزء المتبقّي يجري جريانًا سطحيًّا.'));
        return;
      }
      const last = S.seq.length ? S.seq[S.seq.length - 1] : 'start';
      body.append(verdict('', 'قطرة في البحر … ما خطوتها التالية ؟', S.seq.length ? 'الرحلة : ' + S.seq.map(k => PROC[k].n).join(' ← ') : 'ابدأ من البحر أو من ورقة النبات.'));
      const ch = el('div', 'wrchips');
      Object.keys(PROC).forEach(k => { const b = el('button', 'wrchip', PROC[k].n); b.onclick = () => {
        if (NEXT[last].includes(k)) { S.seq.push(k); S.err = null; } else S.err = k;
        draw(); }; ch.append(b); });
      body.append(ch);
      if (S.err) { body.append(verdict('acwarn', PROC[S.err].n + ' لا يأتي الآن', last === 'start' ? 'تبدأ القطرة رحلتها بالتبخّر من البحر أو بالنتح من النبات.' : 'بعد « ' + PROC[last].n + ' » تأتي : ' + NEXT[last].map(k => PROC[k].n).join(' أو ') + '.')); S.err = null; }
      if (S.seq.length >= 5) body.append(verdict('acok', 'أكملتَ دورة', 'عادت القطرة إلى حيث تبدأ ؛ فالدورة <b>مغلقة</b> : لا يُفقد الماء من الأرض ، بل ينتقل بين غُلُفها.'));
      const r = el('div', 'srow'); r.append(btn('ابدأ قطرة جديدة', 'gh', () => { S.seq = []; draw(); })); body.append(r);
    }
    top(); draw();
  }

  /* ======================= 3 · مقياس المطر وكثافة الهطل ======================= */
  function rainrate(host) {
    host.innerHTML = '';
    const S = { T: 24, n: 3, ask: 'P' };
    const bar = el('div', 'srow'), body = el('div');
    host.append(bar, body);
    let raf = 0;
    function top() {
      bar.innerHTML = '';
      bar.append(seg([['P', 'احسب الكثافة P'], ['T', 'احسب الكمية T'], ['n', 'احسب المدّة n']], S.ask, v => { S.ask = v; top(); draw(); }));
    }
    const NS_ = [[0.5, '30 min'], [1, '1 h'], [2, '2 h'], [3, '3 h'], [4, '4 h'], [5, '5 h'], [6, '6 h'], [8, '8 h'], [12, '12 h']];
    function draw() {
      body.innerHTML = ''; cancelAnimationFrame(raf);
      const P = S.T / S.n;
      const ctr = el('div', 'srow');
      ctr.append(sld(v => 'كمية الأمطار T : ' + L(v + ' mm'), S.T, 2, 60, 1, v => { S.T = v; draw(); }));
      ctr.append(sel('مدّة الهطل n', S.n, NS_.map(x => [x[0], x[1]]), v => { S.n = +v; draw(); }));
      body.append(ctr);
      const svg = fig(body, 320, 180);
      const loop = ts => {
        if (!svg.isConnected) return;
        svg.innerHTML = '';
        sv('rect', { x: 0, y: 0, width: 320, height: 180, fill: '#F2F7FC' }, svg);
        const dens = Math.min(30, Math.round(P * 1.2) + 2), sp = 60 + P * 6;
        for (let i = 0; i < dens; i++) { const x = 20 + rnd(i) * 160, y = ((ts / 1000) * sp + rnd(i + 9) * 180) % 180; sv('path', { d: 'M' + x + ' ' + y + ' l-2 8', stroke: BLUE, 'stroke-width': 2 }, svg); }
        sv('path', { d: 'M215 30 h50 l-12 22 h-26 z', fill: '#DDE6F0', stroke: '#1F3A5F', 'stroke-width': 2 }, svg);
        sv('rect', { x: 228, y: 52, width: 24, height: 118, fill: '#fff', stroke: '#1F3A5F', 'stroke-width': 2 }, svg);
        const h = Math.min(116, S.T * 116 / 60);
        sv('rect', { x: 229, y: 169 - h, width: 22, height: h, fill: BLUE, opacity: .8 }, svg);
        for (let m = 0; m <= 60; m += 10) { const y = 169 - m * 116 / 60; sv('path', { d: 'M252 ' + y + ' h8', stroke: '#1F3A5F', 'stroke-width': 1 }, svg); const t = sv('text', { x: 264, y: y + 3, 'font-size': 9, fill: '#5b6b80' }, svg); t.textContent = m; }
        const t2 = sv('text', { x: 290, y: 175, 'font-size': 9, fill: '#5b6b80' }, svg); t2.textContent = 'mm';
        raf = requestAnimationFrame(loop);
      };
      raf = requestAnimationFrame(loop);
      const t = info();
      if (S.ask === 'P') { t.row('المعطيات', L('T = ' + S.T + ' mm') + ' · ' + L('n = ' + S.n + ' h')); t.row('العلاقة', L('P = T / n')); t.row('التعويض', L('P = ' + S.T + ' / ' + S.n + ' = ' + fmt(P) + ' mm/h')); }
      if (S.ask === 'T') { t.row('المعطيات', L('P = ' + fmt(P) + ' mm/h') + ' · ' + L('n = ' + S.n + ' h')); t.row('العلاقة', L('T = P × n')); t.row('التعويض', L('T = ' + fmt(P) + ' × ' + S.n + ' = ' + fmt(P * S.n) + ' mm')); }
      if (S.ask === 'n') { t.row('المعطيات', L('T = ' + S.T + ' mm') + ' · ' + L('P = ' + fmt(P) + ' mm/h')); t.row('العلاقة', L('n = T / P')); t.row('التعويض', L('n = ' + S.T + ' / ' + fmt(P) + ' = ' + fmt(S.n) + ' h')); }
      body.append(t);
      const other = 6, Po = S.T / other;
      body.append(verdict('acok', 'كثافة الهطل ' + L(fmt(P) + ' mm/h'), 'الكمية نفسها ' + L(S.T + ' mm') + ' لو هطلت في ' + L(other + ' h') + ' لكانت الكثافة ' + L(fmt(Po) + ' mm/h') + ' ؛ فالأقصر مدّةً ' + (S.n < other ? '<b>أشدّ</b> هطلًا.' : S.n > other ? 'أشدّ ، والحالية أخفّ.' : 'مساوية للحالية.') + ( S.n === 0.5 ? ' ولاحظ تحويل ' + L('30 min = 0.5 h') + ' قبل القسمة.' : '')));
    }
    top(); draw();
  }

  /* ======================= 4 · الموازنة المائية ======================= */
  const FL = [
    ['prec', 'الهطل على البحيرة', 1, 2000], ['rin', 'جريان سطحي إلى البحيرة', 1, 5000], ['gin', 'جريان جوفي إلى البحيرة', 1, 1000],
    ['evap', 'التبخّر من البحيرة', 0, 4500], ['rout', 'جريان سطحي من البحيرة', 0, 3000], ['gout', 'جريان جوفي من البحيرة', 0, 0]
  ];
  function drawLake(svg, V, lvl, ts) {
    svg.innerHTML = '';
    sv('rect', { x: 0, y: 0, width: 320, height: 200, fill: '#F2F7FC' }, svg);
    sv('path', { d: 'M0 120 L60 120 C 90 120 100 175 160 178 C 220 175 230 120 260 120 L320 120 L320 200 L0 200 Z', fill: '#C9B58A' }, svg);
    const y = 165 - lvl * 40;
    sv('clipPath', { id: 'wrlk' }, svg).append(sv('path', { d: 'M60 120 C 90 120 100 175 160 178 C 220 175 230 120 260 120 Z' }));
    sv('rect', { x: 0, y: y, width: 320, height: 200, fill: BLUE, opacity: .75, 'clip-path': 'url(#wrlk)' }, svg);
    const u = ((ts || 0) / 1400) % 1;
    const ar = (x1, y1, x2, y2, on, inn) => { if (!on) return; sv('path', { d: 'M' + x1 + ' ' + y1 + ' L' + x2 + ' ' + y2, stroke: inn ? '#2E7D4F' : '#C0612B', 'stroke-width': 3, 'stroke-dasharray': '5 4', 'stroke-dashoffset': -u * 18 }, svg); sv('circle', { cx: x2, cy: y2, r: 4, fill: inn ? '#2E7D4F' : '#C0612B' }, svg); };
    ar(160, 15, 160, y - 6, V.prec > 0, 1);
    ar(10, 110, 70, y + 4, V.rin > 0, 1);
    ar(30, 190, 110, 170, V.gin > 0, 1);
    ar(120, y - 4, 105, 25, V.evap > 0, 0);
    ar(255, y + 2, 310, 110, V.rout > 0, 0);
    ar(210, 172, 290, 192, V.gout > 0, 0);
  }
  function wbudget(host) {
    host.innerHTML = '';
    const V = {}; FL.forEach(f => V[f[0]] = f[3]);
    const body = el('div'); host.append(body);
    let raf = 0, lvl = 0.5;
    const ctr = el('div', 'wrgrid'); host.prepend(ctr);
    FL.forEach(f => ctr.append(sld(v => '<span class="' + (f[2] ? 'wrin' : 'wrout') + '">' + (f[2] ? '+ ' : '− ') + f[1] + '</span> : ' + L(num(v) + ' m³'), V[f[0]], 0, 10000, 500, v => { V[f[0]] = v; draw(); })));
    function draw() {
      body.innerHTML = ''; cancelAnimationFrame(raf);
      const I = V.prec + V.rin + V.gin, O = V.evap + V.rout + V.gout, C = I - O;
      const target = Math.max(0.05, Math.min(0.95, 0.5 + C / 20000));
      const svg = fig(body, 320, 200);
      body.append(el('div', 'wrlg', '<span><i style="background:#2E7D4F"></i>مدخل ( إلى البحيرة )</span><span><i style="background:#C0612B"></i>مخرج ( من البحيرة )</span>'));
      const loop = ts => { if (!svg.isConnected) return; lvl += (target - lvl) * 0.05; drawLake(svg, V, lvl, ts); raf = requestAnimationFrame(loop); };
      raf = requestAnimationFrame(loop);
      const t = info();
      t.row('المدخلات I', L(num(V.prec) + ' + ' + num(V.rin) + ' + ' + num(V.gin) + ' = ' + num(I) + ' m³'));
      t.row('المخرجات O', L(num(V.evap) + ' + ' + num(V.rout) + ' + ' + num(V.gout) + ' = ' + num(O) + ' m³'));
      t.row('الموازنة ' + L('C = I − O'), '<b>' + L(num(I) + ' − ' + num(O) + ' = ' + (C > 0 ? '+' : '') + num(C) + ' m³') + '</b>');
      body.append(t);
      body.append(C > 0 ? verdict('acok', 'موازنة موجبة : يرتفع المنسوب', 'الداخل أكبر من الخارج ، فتزداد كمية المياه المخزّنة في البحيرة.') :
        C < 0 ? verdict('acwarn', 'موازنة سالبة : ينخفض المنسوب', 'الخارج أكبر من الداخل ، فتنقص كمية المياه المخزّنة . الإشارة السالبة ليست خطأ في الحساب.') :
        verdict('acok', 'موازنة صفرية : يثبت المنسوب', 'الداخل يساوي الخارج تمامًا.'));
    }
    draw();
  }

  /* ======================= 5 · تصنيف ومسائل ======================= */
  const CARDS = [
    ['هطل الأمطار على سطح البحيرة', 1], ['التبخّر من سطح البحيرة', 0], ['جريان سطحي من سيل إلى البحيرة', 1], ['جريان سطحي من البحيرة إلى نهر', 0],
    ['جريان جوفي من الخزان إلى البحيرة', 1], ['جريان جوفي من البحيرة إلى الطبقات المجاورة', 0], ['ثلوج هطلت على سطح البحيرة', 1], ['ماء يُضخّ من البحيرة للريّ', 0]
  ];
  function wbudgetb(host) {
    host.innerHTML = '';
    const S = { mode: 'c', i: 0, pick: null, score: 0, order: shuffle(CARDS.map((c, i) => i)), prob: null, ans: '', shown: false };
    const bar = el('div', 'srow'), body = el('div');
    host.append(bar, body);
    function top() { bar.innerHTML = ''; bar.append(seg([['c', 'مدخل أم مخرج ؟'], ['p', 'أوجد المجهول']], S.mode, v => { S.mode = v; if (v === 'p') newProb(); top(); draw(); })); }
    function newProb() {
      const r = k => 500 * (1 + Math.floor(Math.random() * k));
      const I = r(16) + 2000, O = r(16) + 2000, C = I - O, type = ['C', 'O', 'I', 'part'][Math.floor(Math.random() * 4)];
      const prec = Math.min(I - 500, r(6));
      S.prob = { I, O, C, type, prec }; S.ans = ''; S.shown = false;
    }
    function draw() {
      body.innerHTML = '';
      if (S.mode === 'c') {
        const c = CARDS[S.order[S.i]];
        body.append(el('div', 'wrcount', 'البطاقة ' + (S.i + 1) + ' من ' + CARDS.length + ' · الصحيح ' + S.score));
        body.append(verdict('', 'صنّف التدفّق', c[0]));
        const r = el('div', 'srow');
        [[1, 'مدخل I'], [0, 'مخرج O']].forEach(o => r.append(btn(o[1], S.pick === o[0] ? 'go' : '', () => { if (S.pick !== null) return; S.pick = o[0]; if (o[0] === c[1]) S.score++; draw(); })));
        body.append(r);
        if (S.pick !== null) {
          const ok = S.pick === c[1];
          body.append(verdict(ok ? 'acok' : 'acwarn', (ok ? 'صحيح : ' : 'الصحيح : ') + (c[1] ? 'مدخل' : 'مخرج'), c[1] ? 'الماء يتّجه <b>إلى</b> البحيرة فيزيد خزينها.' : 'الماء يخرج <b>من</b> البحيرة فينقص خزينها . الاتّجاه هو المعيار لا الاسم.'));
          const n = el('div', 'srow');
          if (S.i < CARDS.length - 1) n.append(btn('التالية', 'go', () => { S.i++; S.pick = null; draw(); }));
          else n.append(el('div', 'sl ok', 'النتيجة : ' + S.score + ' من ' + CARDS.length), btn('من جديد', 'go', () => { S.i = 0; S.pick = null; S.score = 0; S.order = shuffle(S.order); draw(); }));
          body.append(n);
        }
        return;
      }
      const p = S.prob, sg = x => (x > 0 ? '+' : '') + num(x);
      let q, key, steps;
      if (p.type === 'C') { q = 'مدخلات بحيرة ' + L(num(p.I) + ' m³') + ' ومخرجاتها ' + L(num(p.O) + ' m³') + ' . احسب الموازنة المائية C .'; key = p.C; steps = L('C = I − O = ' + num(p.I) + ' − ' + num(p.O) + ' = ' + sg(p.C) + ' m³'); }
      if (p.type === 'O') { q = 'مدخلات بحيرة ' + L(num(p.I) + ' m³') + ' وموازنتها ' + L(sg(p.C) + ' m³') + ' . احسب مجموع المخرجات O .'; key = p.O; steps = L('O = I − C = ' + num(p.I) + ' − ( ' + sg(p.C) + ' ) = ' + num(p.O) + ' m³'); }
      if (p.type === 'I') { q = 'مخرجات بحيرة ' + L(num(p.O) + ' m³') + ' وموازنتها ' + L(sg(p.C) + ' m³') + ' . احسب مجموع المدخلات I .'; key = p.I; steps = L('I = C + O = ' + sg(p.C) + ' + ' + num(p.O) + ' = ' + num(p.I) + ' m³'); }
      if (p.type === 'part') { q = 'مخرجات بحيرة ' + L(num(p.O) + ' m³') + ' وموازنتها ' + L(sg(p.C) + ' m³') + ' ، ومدخلاتها هطل ' + L(num(p.prec) + ' m³') + ' وجريان سطحي إليها فقط . احسب الجريان السطحي إليها .'; key = p.I - p.prec; steps = L('I = C + O = ' + num(p.I) + ' m³') + ' ، ثمّ ' + L(num(p.I) + ' − ' + num(p.prec) + ' = ' + num(key) + ' m³'); }
      body.append(verdict('', 'مسألة', q));
      const r = el('div', 'srow wrans');
      const inp = document.createElement('input'); inp.type = 'number'; inp.inputMode = 'numeric'; inp.value = S.ans; inp.className = 'wrinp'; inp.placeholder = 'm³';
      inp.oninput = () => { S.ans = inp.value; };
      r.append(inp, btn('تحقّق', 'go', () => { S.shown = true; draw(); }), btn('مسألة أخرى', 'gh', () => { newProb(); draw(); }));
      body.append(r);
      if (S.shown) {
        const ok = S.ans !== '' && Math.abs(+S.ans - key) < 0.5;
        body.append(verdict(ok ? 'acok' : 'acwarn', ok ? 'إجابة صحيحة' : 'الإجابة : ' + L(num(key) + ' m³'), steps + (ok ? '' : ' . راجع الإشارة : ' + L('O = I − C') + ' و ' + L('I = C + O') + '.')));
      }
    }
    top(); draw();
  }

  /* ======================= 6 · الحوض المائي وخطّ تقسيم المياه ======================= */
  function basin(host) {
    host.innerHTML = '';
    const S = { drops: [] };
    const body = el('div'); host.append(body);
    host.prepend(el('div', 'shint', 'اضغط في أيّ مكان على الخريطة لتسقط قطرة مطر ، وتابع إلى أين تجري.'));
    let raf = 0;
    const ridgeX = y => 165 + 25 * Math.sin(y / 35);
    const OUT = { w: [30, 205], e: [295, 205] };
    function path(x, y) {
      const side = x < ridgeX(y) ? 'w' : 'e', o = OUT[side];
      const mid = side === 'w' ? [90, 150] : [235, 155];
      return { side, pts: [[x, y], [(x + mid[0]) / 2, (y + mid[1]) / 2 + 10], mid, o] };
    }
    function draw() {
      body.innerHTML = ''; cancelAnimationFrame(raf);
      const svg = fig(body, 320, 220);
      svg.style.cursor = 'crosshair';
      svg.onclick = ev => {
        const r = svg.getBoundingClientRect(), x = (ev.clientX - r.left) * 320 / r.width, y = (ev.clientY - r.top) * 220 / r.height;
        if (y > 200) return;
        S.drops.push(Object.assign(path(x, y), { t0: performance.now() })); if (S.drops.length > 6) S.drops.shift(); res();
      };
      const loop = ts => {
        if (!svg.isConnected) return;
        svg.innerHTML = '';
        sv('rect', { x: 0, y: 0, width: 320, height: 220, fill: '#E6EFD9' }, svg);
        sv('path', { d: 'M0 0 H' + ridgeX(0) + ' ' + Array.from({ length: 23 }, (_, i) => 'L' + ridgeX(i * 10) + ' ' + i * 10).join(' ') + ' L0 220 Z', fill: '#DCE8C8' }, svg);
        sv('path', { d: Array.from({ length: 23 }, (_, i) => (i ? 'L' : 'M') + ridgeX(i * 10) + ' ' + i * 10).join(' '), stroke: '#B03A2E', 'stroke-width': 3, 'stroke-dasharray': '8 5', fill: 'none' }, svg);
        sv('path', { d: 'M70 20 C 80 80 70 120 90 150 C 70 175 45 190 30 205', stroke: BLUE, 'stroke-width': 3, fill: 'none' }, svg);
        sv('path', { d: 'M130 60 C 110 100 100 130 90 150', stroke: BLUE, 'stroke-width': 2, fill: 'none' }, svg);
        sv('path', { d: 'M260 20 C 250 80 250 120 235 155 C 255 180 280 195 295 205', stroke: BLUE, 'stroke-width': 3, fill: 'none' }, svg);
        sv('path', { d: 'M205 70 C 215 110 225 130 235 155', stroke: BLUE, 'stroke-width': 2, fill: 'none' }, svg);
        Object.values(OUT).forEach(o => sv('circle', { cx: o[0], cy: o[1], r: 9, fill: SEA, stroke: '#fff', 'stroke-width': 2 }, svg));
        S.drops.forEach(d => {
          const u = Math.max(0, Math.min(1, (ts - d.t0) / 2200)), seg = u * 3, k = Math.min(2, Math.floor(seg)), f = seg - k;
          const a = d.pts[k], b = d.pts[k + 1];
          sv('polyline', { points: d.pts.slice(0, k + 1).concat([[a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f]]).map(p => p.join(',')).join(' '), fill: 'none', stroke: d.side === 'w' ? '#1F4E8C' : '#6A4C93', 'stroke-width': 2, 'stroke-dasharray': '3 3' }, svg);
          sv('circle', { cx: a[0] + (b[0] - a[0]) * f, cy: a[1] + (b[1] - a[1]) * f, r: 5, fill: d.side === 'w' ? '#1F4E8C' : '#6A4C93', stroke: '#fff', 'stroke-width': 1.5 }, svg);
        });
        raf = requestAnimationFrame(loop);
      };
      raf = requestAnimationFrame(loop);
      body.append(el('div', 'wrlg', '<span><i style="background:#B03A2E"></i>خطّ تقسيم المياه ( على المرتفعات )</span><span><i style="background:' + SEA + '"></i>مخرج الحوض</span><span><i style="background:#1F4E8C"></i>الحوض الغربي</span><span><i style="background:#6A4C93"></i>الحوض الشرقي</span>'));
      const r = el('div'); body.append(r);
      const res = () => {
        r.innerHTML = '';
        if (!S.drops.length) { r.append(verdict('', 'الحوض المائي السطحي', 'مساحة من الأرض تتجمّع مياه أمطارها عند <b>نقطة واحدة منخفضة</b> ( المخرج ) ، ويفصلها عن الحوض المجاور <b>خطّ تقسيم المياه</b>.')); return; }
        const d = S.drops[S.drops.length - 1], w = S.drops.filter(x => x.side === 'w').length, e = S.drops.length - w;
        r.append(verdict('acok', 'القطرة في الحوض ' + (d.side === 'w' ? 'الغربي' : 'الشرقي'), 'سقطت ' + (d.side === 'w' ? 'غرب' : 'شرق') + ' خطّ تقسيم المياه ، فجرت نحو مخرج حوضها . قطرات الحوض الغربي : ' + w + ' · الشرقي : ' + e + ' . قطرتان متجاورتان على جانبَي الخطّ تذهبان إلى مخرجين مختلفين.'));
      };
      res();
      const t = info();
      t.row('عوامل شكل الحوض', 'كمية الأمطار · نوع الصخور · الغطاء النباتي · التراكيب الجيولوجية ( الصدوع والطيّات )');
      t.row('في الأردن', L('15') + ' حوضًا سطحيًّا ، أكبرها تصريفًا <b>حوض اليرموك</b>');
      body.append(t);
      const b = el('div', 'srow'); b.append(btn('امسح القطرات', 'gh', () => { S.drops = []; res(); })); body.append(b);
    }
    draw();
  }

  /* ======================= 7 · الارتشاح والجريان ======================= */
  const ROCKS = {
    gravel: { n: 'حصى', k: 0.9, c: '#C2B59B', d: 'مسامات كبيرة ومتّصلة' },
    sand: { n: 'رمل', k: 0.7, c: SAND, d: 'مسامات متّصلة' },
    clay: { n: 'طين', k: 0.08, c: CLAY, d: 'مسامات صغيرة غير متّصلة' },
    granite: { n: 'غرانيت', k: 0.02, c: ROCK, d: 'لا مسامات تقريبًا' }
  };
  function infil(host) {
    host.innerHTML = '';
    const S = { r: 'sand', P: 10 };
    const bar = el('div', 'srow'), body = el('div');
    host.append(bar, body);
    bar.append(sel('الصخر على السطح', S.r, Object.keys(ROCKS).map(k => [k, ROCKS[k].n]), v => { S.r = v; draw(); }));
    bar.append(sld(v => 'كثافة الهطل : ' + L(v + ' mm/h'), S.P, 2, 40, 1, v => { S.P = v; draw(); }));
    let raf = 0;
    function draw() {
      body.innerHTML = ''; cancelAnimationFrame(raf);
      const R = ROCKS[S.r];
      const cap = R.k * 20;
      const inf = Math.min(S.P, cap), run = S.P - inf;
      const fi = inf / S.P;
      const svg = fig(body, 320, 200);
      const loop = ts => {
        if (!svg.isConnected) return;
        svg.innerHTML = '';
        sv('rect', { x: 0, y: 0, width: 320, height: 200, fill: '#F2F7FC' }, svg);
        sv('path', { d: 'M0 80 L320 110 L320 200 L0 200 Z', fill: R.c }, svg);
        sv('path', { d: 'M0 150 L320 170 L320 200 L0 200 Z', fill: '#6E6E6E' }, svg);
        for (let i = 0; i < 40; i++) sv('circle', { cx: 10 + rnd(i) * 300, cy: 100 + rnd(i + 3) * 50 + rnd(i) * 20, r: S.r === 'gravel' ? 5 : S.r === 'sand' ? 2.5 : 1.2, fill: '#00000022' }, svg);
        const n = Math.round(S.P * 0.8) + 3;
        for (let i = 0; i < n; i++) {
          const x = 15 + rnd(i) * 290, ph = ((ts / 1000) * 1.2 + rnd(i + 7)) % 1, ys = 80 + x * 30 / 320;
          const goesIn = rnd(i + 31) < fi;
          if (ph < 0.5) sv('path', { d: 'M' + x + ' ' + (ph * 2 * ys - 10) + ' l-2 8', stroke: BLUE, 'stroke-width': 2 }, svg);
          else if (goesIn) sv('circle', { cx: x, cy: ys + (ph - 0.5) * 2 * (140 - ys + x * 20 / 320), r: 3, fill: '#1F4E8C' }, svg);
          else sv('circle', { cx: x + (ph - 0.5) * 2 * 90, cy: ys - 3 + (ph - 0.5) * 2 * 9, r: 3, fill: '#C0612B' }, svg);
        }
        raf = requestAnimationFrame(loop);
      };
      raf = requestAnimationFrame(loop);
      body.append(el('div', 'wrlg', '<span><i style="background:#1F4E8C"></i>يرتشح إلى باطن الأرض</span><span><i style="background:#C0612B"></i>يجري جريانًا سطحيًّا</span><span><i style="background:#6E6E6E"></i>صخر كتيم في الأسفل</span>'));
      const bars = el('div', 'wrsplit');
      bars.append(el('div', 'wrsi', '<i style="width:' + (fi * 100) + '%"></i><span>ارتشاح ' + L(Math.round(fi * 100) + ' %') + '</span>'));
      bars.append(el('div', 'wrsr', '<i style="width:' + ((1 - fi) * 100) + '%"></i><span>جريان سطحي ' + L(Math.round((1 - fi) * 100) + ' %') + '</span>'));
      body.append(bars);
      body.append(verdict(fi > 0.6 ? 'acok' : 'acwarn', R.n + ' : ' + R.d, fi > 0.6 ? 'يرتشح معظم الماء بفعل <b>الجاذبية</b> عبر المسامات ، فيُغذّي الخزان الجوفي ويقلّ الجريان السطحي.' : 'لا يستطيع الصخر تمرير الماء بالسرعة الكافية ، فيبقى معظمه على السطح و<b>يزداد الجريان السطحي</b>' + (S.r === 'clay' ? ' ، مع أنّ في الطين مسامات.' : '.')));
      body.append(el('div', 'sl note', 'النِّسب في هذا النموذج توضيحية لا من الكتاب . الثابت من الكتاب : الصخور ذات المسامات الكبيرة المتّصلة تسمح بالارتشاح ، وغير المنفذة تزيد الجريان السطحي.'));
    }
    draw();
  }

  /* ======================= 8 · المسامية ======================= */
  function porosity(host) {
    host.innerHTML = '';
    const S = { mix: 0, cem: 0, Vt: 200, Vp: 50 };
    const bar = el('div', 'srow'), body = el('div');
    host.append(bar, body);
    function top() {
      bar.innerHTML = '';
      bar.append(seg([[0, 'حبيبات متجانسة'], [1, 'حبيبات غير متجانسة']], S.mix, v => { S.mix = +v; top(); draw(); }));
      bar.append(sld(v => 'المواد اللاحمة : ' + L(v + ' %'), S.cem, 0, 100, 10, v => { S.cem = v; draw(); }));
    }
    function draw() {
      body.innerHTML = '';
      const base = S.mix ? 25 : 40, por = Math.round(base * (1 - S.cem / 100 * 0.85));
      const svg = fig(body, 320, 170);
      sv('rect', { x: 0, y: 0, width: 320, height: 170, fill: '#FFFFFF' }, svg);
      if (S.cem) sv('rect', { x: 0, y: 0, width: 320, height: 170, fill: '#D9A441', opacity: (S.cem / 100) * 0.75 }, svg);
      else sv('rect', { x: 0, y: 0, width: 320, height: 170, fill: '#D6ECF7' }, svg);
      for (let r = 0; r < 5; r++) for (let c = 0; c < 10; c++) {
        const x = 18 + c * 32 + (r % 2) * 16, y = 18 + r * 34;
        if (x > 315) continue;
        sv('circle', { cx: x, cy: y, r: 15, fill: SAND, stroke: '#B8955A', 'stroke-width': 1.2 }, svg);
        if (S.mix) { sv('circle', { cx: x + 16, cy: y + 17, r: 6, fill: '#E2C68E', stroke: '#B8955A' }, svg); sv('circle', { cx: x + 2, cy: y + 18, r: 4, fill: '#E2C68E', stroke: '#B8955A' }, svg); }
      }
      body.append(el('div', 'wrlg', '<span><i style="background:#D6ECF7"></i>مسامات فارغة ( يملؤها الماء )</span><span><i style="background:#D9A441"></i>مواد لاحمة</span>'));
      const t = info();
      t.row('المسامية التقريبية في هذا النموذج', '<b>' + L(por + ' %') + '</b>');
      t.row('السبب', (S.mix ? 'الحبيبات الصغيرة تملأ الفراغات بين الكبيرة ← مسامية أقلّ' : 'الحبيبات متجانسة ، فالفراغات بينها كبيرة') + (S.cem ? ' · والمواد اللاحمة تملأ جزءًا من المسامات ← تقلّ المسامية' : ''));
      body.append(t);
      body.append(el('div', 'wrbt', 'احسب المسامية لعيّنة'));
      const c = el('div', 'srow');
      c.append(sld(v => 'الحجم الكلّي : ' + L(v + ' cm³'), S.Vt, 50, 500, 10, v => { S.Vt = v; if (S.Vp > v) S.Vp = v; calc(); }));
      c.append(sld(v => 'حجم المسامات : ' + L(v + ' cm³'), S.Vp, 0, 200, 5, v => { S.Vp = Math.min(v, S.Vt); calc(); }));
      body.append(c);
      const out = el('div'); body.append(out);
      function calc() { out.innerHTML = ''; out.append(verdict('acok', 'المسامية = ' + L(fmt(S.Vp / S.Vt * 100) + ' %'), L('( ' + S.Vp + ' ÷ ' + S.Vt + ' ) × 100 % = ' + fmt(S.Vp / S.Vt * 100) + ' %') + ' — حجم المسامات على الحجم الكلّي ، لا العكس.')); }
      calc();
      body.append(el('div', 'sl note', 'الأولية تُكتسب أثناء التشكّل ( الرملي والجيري ) ، والثانوية بعده بالتجوية ( البازلت ) أو الإذابة ( الجيري ) . النِّسب في الرسم توضيحية.'));
    }
    top(); draw();
  }

  /* ======================= 9 · تجربة النفاذية ======================= */
  const SAMP = { gravel: { n: 'حصى', t: 18, c: '#C2B59B', g: 6 }, sand: { n: 'رمل', t: 75, c: SAND, g: 2.6 }, clay: { n: 'طين', t: Infinity, c: CLAY, g: 1 } };
  function perm(host) {
    host.innerHTML = '';
    const S = { s: 'gravel', res: {}, run: null };
    const bar = el('div', 'srow'), body = el('div');
    host.append(el('div', 'shint', 'قمع مغلّف بقماش فوق دورق : ' + L('100 mL') + ' من العيّنة ، ثمّ ' + L('100 mL') + ' من الماء . الزمن مسرَّع في العرض.'), bar, body);
    let raf = 0;
    function top() { bar.innerHTML = ''; bar.append(seg(Object.keys(SAMP).map(k => [k, SAMP[k].n]), S.s, v => { S.s = v; S.run = null; top(); draw(); })); }
    function draw() {
      body.innerHTML = ''; cancelAnimationFrame(raf);
      const svg = fig(body, 320, 200), X = SAMP[S.s];
      const clock = el('div', 'wrclock', ''); body.append(clock);
      const loop = ts => {
        if (!svg.isConnected) return;
        const sim = S.run ? Math.max(0, Math.min((ts - S.run) / 1000 * 15, 150)) : 0;
        const done = isFinite(X.t) ? Math.min(1, sim / X.t) : Math.min(0.04, sim / 900);
        svg.innerHTML = '';
        sv('rect', { x: 0, y: 0, width: 320, height: 200, fill: '#F7F9FC' }, svg);
        sv('path', { d: 'M110 20 H210 L175 85 V110 H145 V85 Z', fill: '#EEF2F7', stroke: '#1F3A5F', 'stroke-width': 2 }, svg);
        sv('path', { d: 'M118 40 H202 L178 82 H142 Z', fill: X.c }, svg);
        for (let i = 0; i < 18; i++) sv('circle', { cx: 130 + rnd(i) * 60, cy: 50 + rnd(i + 5) * 28, r: X.g, fill: '#00000020' }, svg);
        if (S.run && done < 1) sv('rect', { x: 120, y: 22, width: 80, height: Math.max(0, 18 * (1 - done)), fill: BLUE, opacity: .6 }, svg);
        sv('path', { d: 'M120 125 H200 V190 H120 Z', fill: 'none', stroke: '#1F3A5F', 'stroke-width': 2 }, svg);
        const h = 60 * done;
        sv('rect', { x: 121, y: 189 - h, width: 78, height: h, fill: BLUE, opacity: .75 }, svg);
        if (S.run && done < 1 && done > 0) for (let i = 0; i < 3; i++) sv('circle', { cx: 160, cy: 112 + ((ts / 250 + i * 6) % 18), r: 2.5, fill: BLUE }, svg);
        clock.innerHTML = S.run ? 'الزمن : ' + L(Math.round(sim) + ' s') + (done >= 1 ? ' · انتهى التدفّق' : isFinite(X.t) ? '' : ' · بالكاد يمرّ الماء') : '';
        if (S.run && !S.res[S.s] && (done >= 1 || sim >= 150)) { S.res[S.s] = isFinite(X.t) ? X.t + ' s' : 'لم يمرّ تقريبًا'; table(); }
        raf = requestAnimationFrame(loop);
      };
      raf = requestAnimationFrame(loop);
      const r = el('div', 'srow'); r.append(btn('اسكب الماء', 'go', () => { S.run = performance.now(); })); body.append(r);
      const tb = el('div'); body.append(tb);
      function table() {
        tb.innerHTML = '';
        const t = info();
        Object.keys(SAMP).forEach(k => t.row('زمن مرور الماء — ' + SAMP[k].n, S.res[k] ? L(S.res[k]) : '—'));
        tb.append(t);
        if (Object.keys(S.res).length === 3) tb.append(verdict('acok', 'الاستنتاج : النفاذية تزداد بزيادة حجم الحبيبات', 'الحصى أسرع ، ثمّ الرمل ، ثمّ الطين . مسامات الطين موجودة لكنّها <b>صغيرة وغير متّصلة</b> ، فهو غير منفذ ؛ والمسامية وحدها لا تكفي.'));
        else tb.append(el('div', 'sl note', 'جرّب العيّنات الثلاث لتصل إلى الاستنتاج . الأزمنة في النموذج توضيحية.'));
      }
      table();
    }
    top(); draw();
  }

  /* ======================= 10 · نُطُق الخزان والينابيع ======================= */
  function aquifer(host) {
    host.innerHTML = '';
    const S = { wt: 60 };
    const bar = el('div', 'srow'), body = el('div');
    host.append(bar, body);
    bar.append(sld(v => 'ارتفاع منسوب المياه الجوفية : ' + L(v + ' %'), S.wt, 10, 100, 5, v => { S.wt = v; draw(); }));
    const surf = x => 60 + 40 * Math.cos((x - 60) / 55) + (x > 230 ? (x - 230) * 0.55 : 0);
    const WELLS = [[70, 105], [150, 150], [260, 120]];
    function draw() {
      body.innerHTML = '';
      const svg = fig(body, 320, 220);
      const base = 185, top = 75;
      const wtY = x => base - (base - top) * S.wt / 100 + (x - 160) * 0.12;
      sv('rect', { x: 0, y: 0, width: 320, height: 220, fill: '#EEF6FC' }, svg);
      let d = 'M0 ' + surf(0); for (let x = 4; x <= 320; x += 4) d += ' L' + x + ' ' + surf(x);
      sv('path', { d: d + ' L320 ' + base + ' L0 ' + base + ' Z', fill: '#E3D3AE' }, svg);
      let w = ''; const springs = [];
      for (let x = 0; x <= 320; x += 4) { const y = Math.max(wtY(x), surf(x)); w += (x ? ' L' : 'M') + x + ' ' + y; if (x > 0 && (wtY(x) < surf(x)) !== (wtY(x - 4) < surf(x - 4))) springs.push(x); }
      sv('path', { d: w + ' L320 ' + base + ' L0 ' + base + ' Z', fill: '#7FB3D5', opacity: .85 }, svg);
      sv('path', { d: w, stroke: '#1F4E8C', 'stroke-width': 2.5, fill: 'none', 'stroke-dasharray': '6 4' }, svg);
      sv('rect', { x: 0, y: base, width: 320, height: 35, fill: '#6E6E6E' }, svg);
      for (let i = 0; i < 30; i++) sv('circle', { cx: rnd(i) * 320, cy: base + 5 + rnd(i + 2) * 25, r: 1.5, fill: '#555' }, svg);
      const flooded = [];
      for (let x = 0; x <= 320; x += 4) if (wtY(x) < surf(x)) flooded.push(x);
      springs.forEach(x => { sv('circle', { cx: x, cy: surf(x), r: 7, fill: '#1F77B4', stroke: '#fff', 'stroke-width': 2 }, svg); });
      const wres = WELLS.map((wl, i) => { const x = wl[0], bot = wl[1], s = surf(x); sv('rect', { x: x - 3, y: s - 10, width: 6, height: bot - s + 10, fill: '#fff', stroke: '#333', 'stroke-width': 1.2 }, svg); const wet = bot > wtY(x); if (wet) sv('rect', { x: x - 2, y: Math.max(wtY(x), s), width: 4, height: bot - Math.max(wtY(x), s), fill: '#1F4E8C' }, svg); const t = sv('text', { x: x, y: s - 14, 'font-size': 11, 'text-anchor': 'middle', fill: '#1F3A5F', 'font-weight': 700 }, svg); t.textContent = i + 1; return wet; });
      body.append(el('div', 'wrlg', '<span><i style="background:#E3D3AE"></i>نطاق التهوية ( هواء وماء قليل )</span><span><i style="background:#7FB3D5"></i>نطاق التشبّع ( ماء يملأ المسامات )</span><span><i style="background:#1F4E8C"></i>منسوب المياه الجوفية</span><span><i style="background:#6E6E6E"></i>صخور كتيمة</span><span><i style="background:#1F77B4"></i>ينبوع</span>'));
      const t = info();
      wres.forEach((ok, i) => t.row('البئر ' + (i + 1), ok ? '✓ قاعه تحت المنسوب ( في نطاق التشبّع ) ← يعطي ماءً' : '✗ قاعه فوق المنسوب ( في نطاق التهوية ) ← جافّ'));
      t.row('الينابيع', springs.length ? springs.length + ' — حيث يتقاطع المنسوب مع سطح الأرض' : 'لا ينابيع : المنسوب لا يلمس سطح الأرض');
      body.append(t);
      body.append(verdict(S.wt < 40 ? 'acwarn' : 'acok', S.wt < 40 ? 'المنسوب منخفض' : 'رتّب من الأعلى', S.wt < 40 ? 'انخفض المنسوب فجفّت الآبار الضحلة وتوقّفت الينابيع ؛ وهذا ما يحدث مع الضخّ الجائر.' : 'نطاق التهوية ← المنسوب ( حدّ لا نطاق ) ← نطاق التشبّع ← الصخور الكتيمة التي تمنع تسرّب الماء إلى الأسفل.'));
    }
    draw();
  }

  /* ======================= 11 · أحواض الأردن الجوفية ======================= */
  const BAS = {
    az: { n: 'حوض عمّان - الزرقاء', ren: 1, R: 100, rock: 'صخور جيرية' , x: 'متجدّد بفعل الأمطار ، في شمالي الأردن ، ومهدّد بالنضوب بسبب الضخّ الجائر والتلوّث.' },
    disi: { n: 'حوض الديسة', ren: 0, R: 0, rock: 'صخر رملي', x: 'غير متجدّد ، مشترك مع السعودية ، عمر مياهه أكثر من 10000 سنة ، ويُنقل عبر الناقل المائي منذ 2013 م.' },
    jafr: { n: 'حوض الجفر', ren: 0, R: 0, rock: '—', x: 'غير متجدّد : تكوّنت مياهه في عصور قديمة ولا تعوّضها الأمطار.' }
  };
  function jobasins(host) {
    host.innerHTML = '';
    const S = { b: 'az', pump: 140, rain: 100 };
    const bar = el('div', 'srow'), body = el('div');
    host.append(bar, body);
    function top() {
      bar.innerHTML = '';
      bar.append(seg(Object.keys(BAS).map(k => [k, BAS[k].n]), S.b, v => { S.b = v; top(); draw(); }));
    }
    function draw() {
      body.innerHTML = '';
      const B = BAS[S.b];
      const c = el('div', 'srow');
      c.append(sld(v => 'الضخّ السنوي : ' + L(String(v)) + ' وحدة ' + (B.ren ? '( التغذية المعتادة = 100 )' : '( لا تغذية )'), S.pump, 0, 200, 10, v => { S.pump = v; draw(); }));
      if (B.ren) c.append(sld(v => 'الهطل مقارنةً بالمعتاد : ' + L(v + ' %'), S.rain, 40, 120, 10, v => { S.rain = v; draw(); }));
      body.append(c);
      const recharge = B.ren ? S.rain : 0, net = recharge - S.pump;
      const svg = fig(body, 320, 190);
      const X = y => 40 + y * 13.5, Y = v => 30 + (100 - v) * 1.3;
      sv('path', { d: 'M40 10 V160 H310', stroke: '#1F3A5F', 'stroke-width': 2, fill: 'none' }, svg);
      [0, 5, 10, 15, 20].forEach(y => { const t = sv('text', { x: X(y), y: 176, 'font-size': 10, 'text-anchor': 'middle', fill: '#5b6b80' }, svg); t.textContent = y; });
      [0, 50, 100].forEach(v => { sv('path', { d: 'M40 ' + Y(v) + ' H310', stroke: '#E3E8F0' }, svg); const t = sv('text', { x: 34, y: Y(v) + 3, 'font-size': 10, 'text-anchor': 'end', fill: '#5b6b80' }, svg); t.textContent = v; });
      let d = '', v = 100, empty = null;
      for (let y = 0; y <= 20; y++) { d += (y ? ' L' : 'M') + X(y) + ' ' + Y(Math.max(0, Math.min(100, v))); if (v <= 0 && empty === null) empty = y; v += net * 0.04; }
      sv('path', { d, stroke: net >= 0 ? '#2E7D4F' : '#C1121F', 'stroke-width': 3, fill: 'none' }, svg);
      body.append(el('div', 'wrlg', '<span>الأفقي : السنوات</span><span>الرأسي : المخزون ( % من الحالي )</span>'));
      const t = info();
      t.row('النوع', B.ren ? '<b>متجدّد</b> — تغذّيه الأمطار' : '<b>غير متجدّد</b> — لا تغذية من الأمطار');
      t.row('الصخر', B.rock);
      t.row('التغذية − الضخّ', L(recharge + ' − ' + S.pump + ' = ' + (net > 0 ? '+' : '') + net) + ' وحدة سنويًّا ( موازنة ' + (net > 0 ? 'موجبة' : net < 0 ? 'سالبة' : 'صفرية') + ' )');
      t.row('عن الحوض', B.x);
      body.append(t);
      body.append(net < 0 ? verdict('acwarn', 'المخزون ينقص' + (empty !== null ? ' وقد ينفد خلال نحو ' + empty + ' سنة في هذا النموذج' : ''), B.ren ? 'الضخّ أكبر من التغذية ، فينخفض المنسوب — كما يحدث في الأردن بمعدّل يبلغ ' + L('2 m') + ' . والتغيّر المناخي الذي يُنقص الهطل يزيد الانخفاض.' : 'كلّ ما يُسحب من الحوض غير المتجدّد <b>لا يعود</b> ؛ فهو مخزون قديم يجب إحسان استعماله.') :
        verdict('acok', 'المخزون ثابت أو يزداد', 'لا يتجاوز الضخّ التغذية ، فيبقى المنسوب ' + (net > 0 ? 'في ارتفاع.' : 'ثابتًا.') + ( B.ren ? '' : ' ( ولا يحدث هذا في حوض غير متجدّد إلّا إذا توقّف الضخّ ).')));
      body.append(el('div', 'sl note', 'في الأردن 12 حوضًا جوفيًّا . الإستراتيجية الوطنية للمياه 2023 - 2040 : الناقل الوطني ، ومعالجة مياه الصرف الصحي للزراعة ، وتقليل استنزاف المياه الجوفية ، وخفض المفقود المائي 2 % سنويًّا . ( أرقام المنحنى توضيحية . )'));
    }
    top(); draw();
  }

  window.SIMS.wdist = wdist;
  window.SIMS.wcycle = wcycle;
  window.SIMS.rainrate = rainrate;
  window.SIMS.wbudget = wbudget;
  window.SIMS.wbudgetb = wbudgetb;
  window.SIMS.basin = basin;
  window.SIMS.infil = infil;
  window.SIMS.porosity = porosity;
  window.SIMS.perm = perm;
  window.SIMS.aquifer = aquifer;
  window.SIMS.jobasins = jobasins;
})();
