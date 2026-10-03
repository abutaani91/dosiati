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
