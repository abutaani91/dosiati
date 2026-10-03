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
