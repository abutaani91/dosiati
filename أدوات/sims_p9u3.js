/* ===== محاكاة الشغل والآلات البسيطة ( فيزياء التاسع — الوحدة الثالثة ) — البادئة wk ===== */
(function () {
  const el = (t, c, h) => { const e = document.createElement(t); if (c) e.className = c; if (h !== undefined) e.innerHTML = h; return e; };
  const btn = (txt, cls, fn) => { const b = el('button', 'sb ' + (cls || ''), txt); b.onclick = fn; return b; };
  const L = s => '<span class="ltr">' + s + '</span>';
  const sld = (lab, val, lo, hi, step, fn) => { const w = el('label', 'sf'); const sp = el('span', '', lab(val)); w.append(sp); const r = document.createElement('input'); r.type = 'range'; r.min = lo; r.max = hi; r.step = step; r.value = val; r.oninput = () => { sp.innerHTML = lab(+r.value); fn(+r.value); }; w.append(r); return w; };
  const info = () => { const b = el('div', 'cyinfo'); b.row = (k, v) => b.append(el('div', 'cyrow', '<span class="cyk">' + k + '</span><span class="cyv">' + v + '</span>')); return b; };
  const verdict = (cls, b, s) => el('div', 'acv' + (cls ? ' ' + cls : ''), '<b>' + b + '</b><span>' + s + '</span>');
  const seg = (opts, val, fn) => { const w = el('div', 'wkseg'); opts.forEach(o => { const b = el('button', 'wkb' + (String(o[0]) === String(val) ? ' wkon' : ''), o[1]); b.onclick = () => fn(o[0]); w.append(b); }); return w; };
  const NS = 'http://www.w3.org/2000/svg';
  const sv = (t, a, p) => { const e = document.createElementNS(NS, t); for (const k in a) e.setAttribute(k, a[k]); if (p) p.append(e); return e; };
  const txt = (svg, x, y, s, a) => { const t = sv('text', Object.assign({ x: x, y: y, 'font-size': 11, fill: '#1F3A5F', direction: 'ltr', 'font-weight': 700 }, a || {}), svg); t.textContent = s; return t; };
  const fig = (body, w, h) => { const s = sv('svg', { viewBox: '0 0 ' + w + ' ' + h, class: 'wksvg', preserveAspectRatio: 'xMidYMid meet' }); const f = el('div', 'wkfig'); f.append(s); body.append(f); return s; };
  const shuffle = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const note = s => el('div', 'wknote', s);
  const fmt = (v, d) => { const r = +v.toFixed(d === undefined ? 2 : d); return String(r); };
  const arrow = (svg, x1, y1, x2, y2, c, w) => { const a = Math.atan2(y2 - y1, x2 - x1); sv('path', { d: 'M' + x1 + ' ' + y1 + ' L' + x2 + ' ' + y2, stroke: c, 'stroke-width': w || 3 }, svg); sv('path', { d: 'M' + x2 + ' ' + y2 + ' l' + (-9 * Math.cos(a - 0.45)) + ' ' + (-9 * Math.sin(a - 0.45)) + ' l' + (9 * Math.cos(a - 0.45) - 9 * Math.cos(a + 0.45)) + ' ' + (9 * Math.sin(a - 0.45) - 9 * Math.sin(a + 0.45)) + ' z', fill: c }, svg); };
  function sorter(body, pool, cats, intro, done) {
    const S = { q: shuffle(pool), k: 0, ok: 0, ans: null };
    function draw() {
      body.innerHTML = '';
      if (S.k >= S.q.length) { body.append(verdict('acok', 'النتيجة : ' + S.ok + ' من ' + S.q.length, done)); const r = el('div', 'srow'); r.append(btn('من جديد', 'gh', () => { S.q = shuffle(pool); S.k = 0; S.ok = 0; S.ans = null; draw(); })); body.append(r); return; }
      const it = S.q[S.k];
      body.append(el('div', 'shint', intro + ' ( ' + (S.k + 1) + ' / ' + S.q.length + ' )'));
      body.append(el('div', 'wkq', it[0]));
      const r = el('div', 'wkseg');
      cats.forEach((c, i) => { const b = el('button', 'wkb' + (S.ans !== null && i === it[1] ? ' wkon' : '') + (S.ans === i && i !== it[1] ? ' wkno' : ''), c); b.onclick = () => { if (S.ans !== null) return; S.ans = i; if (i === it[1]) S.ok++; draw(); }; r.append(b); });
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
      body.append(el('div', 'wkq', p.q));
      const r = el('div', 'srow'); const inp = document.createElement('input'); inp.type = 'number'; inp.step = 'any'; inp.className = 'wkinp'; inp.value = S.v; inp.oninput = () => S.v = inp.value;
      r.append(inp, el('span', 'wkunit', L(p.unit)), btn('تحقّق', '', () => { const v = parseFloat(S.v); S.r = isNaN(v) ? null : Math.abs(v - p.ans) <= Math.abs(p.ans) * 0.01 + 1e-9; draw(); })); body.append(r);
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

  const ri = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
  const C = { F: '#D62828', d: '#14603f', box: '#B07A2A', ink: '#1F3A5F', grey: '#8894a6', blue: '#5B8DEF' };
  const lg = items => el('div', 'wklg', items.map(x => '<span><i style="background:' + x[0] + '"></i>' + x[1] + '</span>').join(''));
  const ground = (svg, y, x1, x2) => { sv('path', { d: 'M' + x1 + ' ' + y + ' H' + x2, stroke: '#5b6b80', 'stroke-width': 2 }, svg); for (let x = x1; x < x2; x += 14) sv('path', { d: 'M' + x + ' ' + (y + 8) + ' l8 -8', stroke: '#c3cad6', 'stroke-width': 1 }, svg); };

  /* ======================= 1 · ما الشغل ======================= */
  function wkwork(host) {
    modes(host, [
      ['sim', 'جرّب', b => {
        const S = { F: 60, d: 5, dir: 'h' };
        const draw = () => {
          b.innerHTML = '';
          b.append(seg([['h', 'قوّة أفقية مع الحركة'], ['v', 'قوّة رأسية والحركة أفقية'], ['0', 'الجسم لا يتحرّك']], S.dir, v => { S.dir = v; draw(); }));
          b.append(sld(v => 'القوّة ' + L('F = ' + v + ' N'), S.F, 0, 100, 5, v => { S.F = v; draw(); }));
          if (S.dir !== '0') b.append(sld(v => 'الإزاحة ' + L('d = ' + v + ' m'), S.d, 0, 10, 0.5, v => { S.d = v; draw(); }));
          const d = S.dir === '0' ? 0 : S.d, svg = fig(b, 320, 150);
          ground(svg, 110, 10, 310);
          const x0 = 20, x1 = x0 + d * 24;
          if (d > 0) sv('rect', { x: x0, y: 70, width: 40, height: 40, fill: 'none', stroke: C.grey, 'stroke-dasharray': '4 3' }, svg);
          sv('rect', { x: x1, y: 70, width: 40, height: 40, rx: 3, fill: C.box, stroke: '#7a5c2e', 'stroke-width': 2 }, svg);
          const w = 2 + S.F / 30;
          if (S.F > 0) { if (S.dir === 'v') arrow(svg, x1 + 20, 70, x1 + 20, 70 - 12 - S.F / 2.5, C.F, w); else arrow(svg, x1 + 40, 90, x1 + 52 + S.F / 2, 90, C.F, w); }
          if (d > 0) { arrow(svg, x0 + 20, 132, x1 + 20, 132, C.d, 2.5); txt(svg, (x0 + x1) / 2 + 20, 146, 'd = ' + d + ' m', { fill: C.d, 'text-anchor': 'middle' }); }
          txt(svg, S.dir === 'v' ? x1 + 28 : x1 + 44, S.dir === 'v' ? 30 : 82, 'F = ' + S.F + ' N', { fill: C.F });
          b.append(lg([[C.F, 'القوّة المؤثّرة'], [C.d, 'الإزاحة']]));
          const inf = info(); let W = 0, why;
          if (S.dir === '0') why = 'لا إزاحة ' + L('d = 0') + ' ، فلا شغل مهما كانت القوّة.';
          else if (S.dir === 'v') why = 'القوّة رأسية والإزاحة أفقية ( متعامدتان ) ، فلا إزاحة باتجاه القوّة.';
          else if (S.F === 0 || d === 0) why = 'أحد العاملين صفر ، فالشغل صفر.';
          else { W = S.F * d; why = 'القوّة والإزاحة في الاتجاه نفسه : ' + L(S.F + ' × ' + d + ' = ' + fmt(W) + ' J'); }
          inf.row('الشغل', L('W_F = ' + fmt(W) + ' J')); inf.row('السبب', why); b.append(inf);
        }; draw();
      }],
      ['q', 'هل يُبذل شغل ؟', b => sorter(b, [
        ['عامل يدفع عربة صناديق فتتحرّك أمامه.', 0, 'قوّة وإزاحة باتجاهها.'], ['رجل يدفع جدارًا بكلّ قوّته فلا يتحرّك.', 1, 'لا إزاحة ، مهما كان التعب.'],
        ['رافعة ترفع حزمة أنابيب إلى أعلى.', 0, 'قوّة رأسية وإزاحة رأسية.'], ['شخص يقف ساكنًا حاملًا حقيبة.', 1, 'لا إزاحة.'],
        ['رافع أثقال يرفعها من الأرض إلى فوق رأسه.', 0, 'قوّة إلى أعلى وإزاحة إلى أعلى.'], ['رافع الأثقال يُبقيها فوق رأسه ثابتة.', 1, 'لا إزاحة في أثناء التثبيت.'],
        ['شخص يمشي أفقيًّا حاملًا حقيبة بسرعة ثابتة ( شغل قوّة الحمل ).', 1, 'القوّة رأسية والإزاحة أفقية.'], ['فتاة تسحب صندوقًا على الأرض فيتحرّك.', 0, 'إزاحة باتجاه السحب.']
      ], ['يُبذل شغل', 'لا يُبذل شغل'], 'هل تبذل القوّة شغلًا بالمعنى الفيزيائي ؟', 'الشرطان معًا : قوّة ، وإزاحة باتجاه لا يتعامد معها.')]
    ]);
  }

  /* ======================= 2 · حساب الشغل ======================= */
  function wkcalc(host) {
    const gen = () => {
      const k = pick(['W', 'd', 'F', 'lift', 'cm']);
      if (k === 'W') { const F = ri(2, 20) * 10, d = ri(2, 12); return { q: 'قوّة ' + L(F + ' N') + ' تدفع صندوقًا باتجاهها مسافة ' + L(d + ' m') + ' . احسب الشغل.', unit: 'J', ans: F * d, sol: L('W_F = F d = ' + F + ' × ' + d + ' = ' + F * d + ' J'), traps: [[F / d, 'قسمتَ ؛ الشغل حاصل ضرب.'], [F + d, 'جمعتَ ؛ الشغل حاصل ضرب.']] }; }
      if (k === 'd') { const F = ri(1, 12) * 5, d = ri(2, 20), W = F * d; return { q: 'قوّة ' + L(F + ' N') + ' تبذل شغلًا ' + L(W + ' J') + ' على جسم تحرّكه باتجاهها . احسب الإزاحة.', unit: 'm', ans: d, sol: L('d = W_F / F = ' + W + ' / ' + F + ' = ' + d + ' m'), traps: [[W * F, 'ضربتَ ؛ الإزاحة قسمة.'], [+(F / W).toFixed(4), 'قلبتَ القسمة.']] }; }
      if (k === 'F') { const F = ri(2, 50) * 10, d = ri(2, 8), W = F * d; return { q: 'جسم يتحرّك باتجاه قوّة مسافة ' + L(d + ' m') + ' فتبذل عليه شغلًا ' + L(W + ' J') + ' . احسب القوّة.', unit: 'N', ans: F, sol: L('F = W_F / d = ' + W + ' / ' + d + ' = ' + F + ' N'), traps: [[W * d, 'ضربتَ ؛ القوّة قسمة.']] }; }
      if (k === 'lift') { const m = ri(2, 60), h = pick([1, 1.5, 2, 3, 4, 5, 6]); const W = m * 10 * h; return { q: 'يُرفع جسم كتلته ' + L(m + ' kg') + ' بسرعة ثابتة إلى ارتفاع ' + L(h + ' m') + ' ( ' + L('g = 10 m/s²') + ' ) . احسب الشغل.', unit: 'J', ans: W, sol: 'السرعة ثابتة فالقوّة تساوي الوزن : ' + L('F = m g = ' + m * 10 + ' N') + ' ، ثمّ ' + L('W_F = ' + m * 10 + ' × ' + h + ' = ' + fmt(W) + ' J'), traps: [[m * h, 'ضربتَ الكتلة لا الوزن ؛ اضرب في g أوّلًا.']] }; }
      const F = ri(2, 30) * 10, c = pick([20, 40, 50, 75, 80, 150]); const W = F * c / 100; return { q: 'قوّة ' + L(F + ' N') + ' تحرّك جسمًا باتجاهها مسافة ' + L(c + ' cm') + ' . احسب الشغل بالجول.', unit: 'J', ans: W, sol: 'حوّل : ' + L(c + ' cm = ' + c / 100 + ' m') + ' ، ثمّ ' + L('W_F = ' + F + ' × ' + c / 100 + ' = ' + fmt(W) + ' J'), traps: [[F * c, 'لم تحوّل السنتيمتر إلى متر.']] };
    };
    host.innerHTML = ''; const b = el('div'); host.append(b);
    solver(b, gen, 'اكتب الناتج رقمًا فقط . أنواع المسائل : الشغل ، الإزاحة ، القوّة ، الرفع بسرعة ثابتة ، وتحويل السنتيمتر.');
  }

  /* ======================= 3 · حالات الشغل ======================= */
  function wkcases(host) {
    const CS = { with: ['القوّة مع الحركة', 'موجب', 'تزداد', 'دفع صندوق فيتحرّك أمامك.'], against: ['القوّة عكس الحركة', 'سالب', 'تتناقص', 'قوّة الاحتكاك على كرة متدحرجة.'], perp: ['القوّة عمودية على الحركة', 'صفر ( معدوم )', 'لا تتأثّر بهذه القوّة', 'قوّة حمل حقيبة في أثناء المشي الأفقي.'], none: ['لا حركة', 'صفر ( معدوم )', 'تبقى صفرًا', 'شخص يقف حاملًا حقيبة.'] };
    modes(host, [
      ['sim', 'جرّب', b => {
        const S = { k: 'with' };
        const draw = () => {
          b.innerHTML = '';
          b.append(seg(Object.keys(CS).map(k => [k, CS[k][0]]), S.k, v => { S.k = v; draw(); }));
          const svg = fig(b, 320, 150); ground(svg, 110, 10, 310);
          sv('rect', { x: 140, y: 70, width: 40, height: 40, rx: 3, fill: C.box, stroke: '#7a5c2e', 'stroke-width': 2 }, svg);
          if (S.k !== 'none') arrow(svg, 120, 134, 220, 134, C.d, 2.5);
          if (S.k === 'with' || S.k === 'none') arrow(svg, 180, 90, 250, 90, C.F, 4);
          if (S.k === 'none') { sv('rect', { x: 250, y: 50, width: 12, height: 60, fill: '#9aa5b1' }, svg); }
          if (S.k === 'against') arrow(svg, 140, 90, 70, 90, C.F, 4);
          if (S.k === 'perp') arrow(svg, 160, 70, 160, 15, C.F, 4);
          b.append(lg([[C.F, 'القوّة'], [C.d, 'اتجاه الحركة ( الإزاحة )']]));
          const c = CS[S.k], inf = info();
          inf.row('الشغل', c[1]); inf.row('الطاقة الحركية', c[2]); inf.row('مثال من الكتاب', c[3]); b.append(inf);
        }; draw();
      }],
      ['q', 'صنّف', b => sorter(b, [
        ['شغل قوّة الدفع على صندوق يتحرّك أمامك.', 0, 'القوّة مع الحركة.'], ['شغل قوّة الاحتكاك على كرة قدم تتدحرج.', 1, 'الاحتكاك عكس الحركة.'],
        ['شغل قوّة حمل الحقيبة في أثناء المشي الأفقي.', 2, 'القوّة رأسية والإزاحة أفقية.'], ['شغل شخص يقف ساكنًا حاملًا حقيبة.', 2, 'لا إزاحة.'],
        ['شغل القوّة العمودية من الطاولة على صندوق ينزلق أفقيًّا عليها.', 2, 'عمودية على الإزاحة.'], ['شغل الكوابح على سيّارة تتباطأ حتّى تقف.', 1, 'قوّة الكبح عكس الحركة.'],
        ['شغل قوّة رافعة ترفع حمولة إلى أعلى.', 0, 'القوّة والإزاحة إلى أعلى.'], ['شغل شخص يمسك عربة من الخلف فيُبطئها وهي تتقدّم.', 1, 'قوّته عكس الحركة.']
      ], ['موجب', 'سالب', 'معدوم'], 'ما نوع الشغل ؟', 'اسأل : هل توجد إزاحة ؟ وما اتجاه القوّة بالنسبة إلى الحركة ؟')]
    ]);
  }

  /* ======================= 4 · القدرة ======================= */
  function wkpower(host) {
    modes(host, [
      ['cmp', 'قارن رافعتين', b => {
        const S = { m: 120, t1: 30, t2: 9 }, h = 15;
        const draw = () => {
          b.innerHTML = '';
          b.append(sld(v => 'الكتلة المرفوعة ' + L(v + ' kg') + ' إلى ' + L(h + ' m'), S.m, 20, 200, 10, v => { S.m = v; draw(); }));
          b.append(sld(v => 'زمن الرافعة ( أ ) ' + L(v + ' s'), S.t1, 5, 60, 1, v => { S.t1 = v; draw(); }));
          b.append(sld(v => 'زمن الرافعة ( ب ) ' + L(v + ' s'), S.t2, 5, 60, 1, v => { S.t2 = v; draw(); }));
          const W = S.m * 10 * h, P1 = W / S.t1, P2 = W / S.t2, mx = Math.max(P1, P2);
          const svg = fig(b, 300, 140);
          [[P1, 'A', '#5B8DEF'], [P2, 'B', '#F2963A']].forEach((x, i) => { const y = 25 + i * 55, w = 220 * x[0] / mx; txt(svg, 12, y + 20, x[1]); sv('rect', { x: 30, y: y, width: Math.max(2, w), height: 30, rx: 4, fill: x[2] }, svg); txt(svg, w > 200 ? 36 : 36 + w, y + 20, fmt(x[0], 0) + ' W', { fill: w > 200 ? '#fff' : C.ink }); });
          b.append(lg([['#5B8DEF', 'قدرة الرافعة ( أ )'], ['#F2963A', 'قدرة الرافعة ( ب )']]));
          const inf = info();
          inf.row('الشغل لكلٍّ منهما', L('W_F = ' + S.m * 10 + ' × ' + h + ' = ' + W + ' J'));
          inf.row('قدرة ( أ )', L(W + ' / ' + S.t1 + ' = ' + fmt(P1, 1) + ' W'));
          inf.row('قدرة ( ب )', L(W + ' / ' + S.t2 + ' = ' + fmt(P2, 1) + ' W'));
          b.append(inf);
          b.append(verdict(S.t1 === S.t2 ? '' : 'acok', S.t1 === S.t2 ? 'متساويتان' : 'الأفضل : الرافعة ' + (P1 > P2 ? '( أ )' : '( ب )'), 'الشغل واحد ، والأقصر زمنًا أكبر قدرة.'));
        }; draw();
      }],
      ['calc', 'احسب', b => solver(b, () => {
        const k = pick(['P', 'lift', 'W', 't', 'min']);
        if (k === 'P') { const P = ri(2, 40) * 25, t = ri(2, 20), W = P * t; return { q: 'آلة تبذل شغلًا ' + L(W + ' J') + ' في ' + L(t + ' s') + ' . احسب قدرتها.', unit: 'W', ans: P, sol: L('P = W_F / Δt = ' + W + ' / ' + t + ' = ' + P + ' W'), traps: [[W * t, 'ضربتَ في الزمن ؛ القدرة قسمة.']] }; }
        if (k === 'lift') { const m = pick([50, 60, 80, 100, 120, 150]), h = pick([5, 10, 15, 20]), t = pick([5, 10, 20, 25, 50]); const P = m * 10 * h / t; return { q: 'ترفع رافعة جسمًا كتلته ' + L(m + ' kg') + ' إلى ارتفاع ' + L(h + ' m') + ' بسرعة ثابتة في ' + L(t + ' s') + ' ( ' + L('g = 10 m/s²') + ' ) . احسب قدرتها.', unit: 'W', ans: P, sol: L('W_F = ' + m * 10 + ' × ' + h + ' = ' + m * 10 * h + ' J') + ' ، ثمّ ' + L('P = ' + m * 10 * h + ' / ' + t + ' = ' + fmt(P) + ' W'), traps: [[m * h / t, 'نسيتَ ضرب الكتلة في g.']] }; }
        if (k === 'W') { const P = pick([2, 5, 10, 25, 75]), t = pick([4, 10, 20, 30]); return { q: 'آلة قدرتها ' + L(P + ' kW') + ' تعمل ' + L(t + ' s') + ' . احسب الشغل بالجول.', unit: 'J', ans: P * 1000 * t, sol: L(P + ' kW = ' + P * 1000 + ' W') + ' ، ثمّ ' + L('W_F = P Δt = ' + P * 1000 + ' × ' + t + ' = ' + P * 1000 * t + ' J'), traps: [[P * t, 'لم تحوّل الكيلوواط إلى واط.']] }; }
        if (k === 't') { const P = pick([100, 150, 200, 300, 500]), t = ri(2, 30), W = P * t; return { q: 'محرّك قدرته ' + L(P + ' W') + ' يبذل شغلًا ' + L(W + ' J') + ' . احسب الزمن.', unit: 's', ans: t, sol: L('Δt = W_F / P = ' + W + ' / ' + P + ' = ' + t + ' s'), traps: [[W * P, 'ضربتَ.']] }; }
        const F = pick([300, 600, 900, 1200]), h = pick([2, 4, 5, 10]), mn = pick([1, 2]); const P = F * h / (mn * 60); return { q: 'ترفع رافعة جسمًا وزنه ' + L(F + ' N') + ' إلى ارتفاع ' + L(h + ' m') + ' في ' + L(mn + ' min') + ' . احسب قدرتها.', unit: 'W', ans: P, sol: L('W_F = ' + F * h + ' J') + ' و ' + L('Δt = ' + mn * 60 + ' s') + ' ، فـ ' + L('P = ' + fmt(P) + ' W'), traps: [[F * h / mn, 'لم تحوّل الدقائق إلى ثوانٍ.']] };
      }, 'حوّل الدقائق إلى ثوانٍ والكيلوواط إلى واط قبل التعويض.')]
    ]);
  }

  /* ======================= 5 · الطاقة الحركية ======================= */
  function wkke(host) {
    modes(host, [
      ['sim', 'جرّب', b => {
        const S = { m: 2, v: 3, r: null };
        const draw = () => {
          b.innerHTML = '';
          const KE = 0.5 * S.m * S.v * S.v;
          const r = el('div', 'srow');
          r.append(btn('ثبّت مرجعًا', 'gh', () => { S.r = { m: S.m, v: S.v, KE: KE }; draw(); }), btn('ضاعف الكتلة', 'gh', () => { if (S.m * 2 <= 20) S.m *= 2; draw(); }), btn('ضاعف السرعة', 'gh', () => { if (S.v * 2 <= 20) S.v *= 2; draw(); }), btn('من جديد', 'gh', () => { S.m = 2; S.v = 3; S.r = null; draw(); }));
          b.append(r);
          b.append(sld(v => 'الكتلة ' + L('m = ' + v + ' kg'), S.m, 1, 20, 1, v => { S.m = v; draw(); }));
          b.append(sld(v => 'السرعة ' + L('v = ' + v + ' m/s'), S.v, 0, 20, 1, v => { S.v = v; draw(); }));
          const svg = fig(b, 300, 130), mx = Math.max(KE, S.r ? S.r.KE : 0, 1);
          const bars = [[KE, 'now', '#5B8DEF']]; if (S.r) bars.unshift([S.r.KE, 'ref', '#c3cad6']);
          bars.forEach((x, i) => { const y = 20 + i * 50, w = 200 * x[0] / mx; sv('rect', { x: 50, y: y, width: Math.max(2, w), height: 32, rx: 4, fill: x[2] }, svg); txt(svg, 8, y + 21, x[1]); txt(svg, w > 190 ? 56 : 56 + w, y + 21, fmt(x[0], 1) + ' J', { fill: w > 190 ? '#fff' : C.ink }); });
          b.append(lg(S.r ? [['#c3cad6', 'المرجع'], ['#5B8DEF', 'الآن']] : [['#5B8DEF', 'الطاقة الحركية الآن']]));
          const inf = info();
          inf.row('الطاقة الحركية', L('KE = ½ × ' + S.m + ' × ' + S.v + '² = ' + fmt(KE, 1) + ' J'));
          if (S.r && S.r.KE > 0) { inf.row('الكتلة صارت', L('× ' + fmt(S.m / S.r.m))); inf.row('السرعة صارت', L('× ' + fmt(S.r.v ? S.v / S.r.v : 0))); inf.row('الطاقة صارت', L('× ' + fmt(KE / S.r.KE))); }
          b.append(inf);
          b.append(note(S.r ? 'الطاقة تتضاعف بنسبة الكتلة ، وبنسبة مربّع السرعة .' : 'ثبّت مرجعًا ثمّ ضاعف الكتلة أو السرعة وقارن.'));
        }; draw();
      }],
      ['calc', 'احسب', b => solver(b, () => {
        const k = pick(['KE', 'KE', 'v', 'g']);
        if (k === 'KE') { const m = ri(1, 30) * 2, v = ri(1, 15); const KE = m * v * v / 2; return { q: 'جسم كتلته ' + L(m + ' kg') + ' يتحرّك بسرعة ' + L(v + ' m/s') + ' . احسب طاقته الحركية.', unit: 'J', ans: KE, sol: L('KE = ½ × ' + m + ' × ' + v + '² = ' + KE + ' J'), traps: [[m * v / 2, 'نسيتَ تربيع السرعة.'], [m * v * v, 'نسيتَ ضرب النصف.'], [m * v, 'نسيتَ النصف والتربيع.']] }; }
        if (k === 'v') { const m = ri(1, 10) * 2, v = ri(2, 12); const KE = m * v * v / 2; return { q: 'جسم كتلته ' + L(m + ' kg') + ' وطاقته الحركية ' + L(KE + ' J') + ' . احسب سرعته.', unit: 'm/s', ans: v, sol: L(KE + ' = ½ × ' + m + ' × v²') + ' ← ' + L('v² = ' + v * v) + ' ← ' + L('v = ' + v + ' m/s'), traps: [[v * v, 'هذا مربّع السرعة ؛ خذ الجذر.']] }; }
        const g = pick([100, 200, 400, 500]), v = pick([2, 4, 5, 6, 10]); const KE = g / 1000 * v * v / 2; return { q: 'طائر كتلته ' + L(g + ' g') + ' يطير بسرعة ' + L(v + ' m/s') + ' . احسب طاقته الحركية.', unit: 'J', ans: KE, sol: L(g + ' g = ' + g / 1000 + ' kg') + ' ، ثمّ ' + L('KE = ½ × ' + g / 1000 + ' × ' + v + '² = ' + fmt(KE, 3) + ' J'), traps: [[g * v * v / 2, 'لم تحوّل الغرام إلى كيلوغرام.']] };
      }, 'اربّع السرعة قبل الضرب ، ولا تنسَ النصف.')]
    ]);
  }

  /* ======================= 6 · الشغل والطاقة الحركية ======================= */
  function wkwke(host) {
    modes(host, [
      ['push', 'ادفع', b => {
        const S = { m: 3, F: 12, d: 8 };
        const draw = () => {
          b.innerHTML = '';
          b.append(seg([[3, L('3 kg')], [6, L('6 kg')], [12, L('12 kg')]], S.m, v => { S.m = +v; draw(); }));
          b.append(sld(v => 'القوّة ' + L('F = ' + v + ' N'), S.F, 0, 20, 1, v => { S.F = v; draw(); }));
          b.append(sld(v => 'المسافة ' + L('d = ' + v + ' m'), S.d, 0, 10, 0.5, v => { S.d = v; draw(); }));
          const W = S.F * S.d, vf = Math.sqrt(2 * W / S.m);
          const svg = fig(b, 320, 150); ground(svg, 100, 10, 310);
          const x = 20 + S.d * 24, sz = 26 + S.m * 1.2;
          sv('rect', { x: 20, y: 100 - sz, width: sz, height: sz, fill: 'none', stroke: C.grey, 'stroke-dasharray': '4 3' }, svg);
          sv('rect', { x: x, y: 100 - sz, width: sz, height: sz, rx: 3, fill: C.box, stroke: '#7a5c2e', 'stroke-width': 2 }, svg);
          if (S.F) arrow(svg, x - 34, 100 - sz / 2, x - 2, 100 - sz / 2, C.F, 2 + S.F / 6);
          sv('rect', { x: 20, y: 118, width: 280, height: 14, rx: 3, fill: '#eef1f5' }, svg); sv('rect', { x: 20, y: 118, width: 280 * W / 200, height: 14, rx: 3, fill: '#F2963A' }, svg);
          txt(svg, 22, 146, 'KE = ' + fmt(W) + ' J', { fill: '#b45309' });
          b.append(lg([[C.F, 'القوّة'], ['#F2963A', 'الطاقة الحركية المكتسبة']]));
          const inf = info();
          inf.row('الشغل', L('W_F = ' + S.F + ' × ' + S.d + ' = ' + fmt(W) + ' J'));
          inf.row('التغيّر في الطاقة الحركية', L('ΔKE = W_F = ' + fmt(W) + ' J'));
          inf.row('السرعة النهائية', L('v = ' + fmt(vf, 2) + ' m/s'));
          b.append(inf);
          b.append(note('السطح أملس والجسم يبدأ من السكون . غيّر الكتلة والقوّة والمسافة ثابتتان : الطاقة المكتسبة لا تتغيّر ، لكنّ الأثقل أبطأ.'));
        }; draw();
      }],
      ['stop', 'مسافة التوقّف', b => {
        const S = { v: 20, t: 1, f: 6000 }, m = 1200;
        const draw = () => {
          b.innerHTML = '';
          b.append(sld(v => 'السرعة ' + L(v + ' m/s'), S.v, 5, 30, 1, v => { S.v = v; draw(); }));
          b.append(sld(v => 'زمن ردّ الفعل ' + L(v + ' s'), S.t, 0.5, 2.5, 0.1, v => { S.t = v; draw(); }));
          b.append(sld(v => 'قوّة الكبح ' + L(v + ' N'), S.f, 3000, 12000, 500, v => { S.f = v; draw(); }));
          const KE = 0.5 * m * S.v * S.v, dr = S.v * S.t, db = KE / S.f, tot = dr + db, sc = 280 / 160;
          const svg = fig(b, 320, 90); ground(svg, 60, 10, 310);
          sv('rect', { x: 20, y: 30, width: dr * sc, height: 22, fill: '#5B8DEF' }, svg); sv('rect', { x: 20 + dr * sc, y: 30, width: db * sc, height: 22, fill: C.F }, svg);
          txt(svg, 20, 80, fmt(tot, 1) + ' m', { fill: C.ink });
          b.append(lg([['#5B8DEF', 'مسافة ردّ الفعل'], [C.F, 'مسافة الكبح']]));
          const inf = info();
          inf.row('الطاقة الحركية', L('½ × ' + m + ' × ' + S.v + '² = ' + fmt(KE, 0) + ' J'));
          inf.row('مسافة ردّ الفعل', L(fmt(dr, 1) + ' m'));
          inf.row('مسافة الكبح', 'شغل الكبح السالب يُفني الطاقة : ' + L(fmt(KE, 0) + ' / ' + S.f + ' = ' + fmt(db, 1) + ' m'));
          inf.row('مسافة التوقّف', L(fmt(tot, 1) + ' m'));
          b.append(inf);
          b.append(note('سيّارة كتلتها ' + L(m + ' kg') + ' ، والأرقام توضيحية ؛ المطلوب من الكتاب الفكرة : طاقة أكبر ← مسافة كبح أطول ، وتأخّر ردّ الفعل ( كالتحدّث بالهاتف ) ← مسافة ردّ فعل أطول.'));
        }; draw();
      }],
      ['calc', 'احسب', b => solver(b, () => {
        const k = pick(['dk', 'v']);
        if (k === 'dk') { const F = ri(2, 30), d = ri(2, 12); return { q: 'جسم ساكن على سطح أملس أثّرت فيه قوّة ' + L(F + ' N') + ' فحرّكته باتجاهها ' + L(d + ' m') + ' . احسب التغيّر في طاقته الحركية.', unit: 'J', ans: F * d, sol: L('ΔKE = W_F = ' + F + ' × ' + d + ' = ' + F * d + ' J'), traps: [[F / d, 'قسمتَ.']] }; }
        const m = pick([2, 4, 8, 10]), v = pick([2, 3, 4, 5, 6]), W = m * v * v / 2, F = pick([1, 2, 4, 5].filter(x => W % x === 0)); return { q: 'قوّة ' + L(F + ' N') + ' تدفع عربة كتلتها ' + L(m + ' kg') + ' من السكون مسافة ' + L(W / F + ' m') + ' على سطح أملس . احسب سرعتها النهائية.', unit: 'm/s', ans: v, sol: L('W_F = ' + F + ' × ' + W / F + ' = ' + W + ' J = KE_f') + ' ← ' + L('v² = 2 × ' + W + ' / ' + m + ' = ' + v * v) + ' ← ' + L('v = ' + v + ' m/s'), traps: [[v * v, 'هذا مربّع السرعة.'], [W, 'هذا الشغل لا السرعة.']] };
      }, 'الشغل المبذول على جسم يبدأ من السكون يساوي طاقته الحركية النهائية.')]
    ]);
  }

  /* ======================= 7 · أنواع الآلات البسيطة ======================= */
  function wksm(host) {
    host.innerHTML = ''; const b = el('div'); host.append(b);
    sorter(b, [
      ['المقصّ', 1, 'ساق تدور حول نقطة ارتكاز.'], ['الملقط', 1, 'رافعة.'], ['كسّارة البندق', 1, 'رافعة.'], ['عربة اليد', 1, 'رافعة.'],
      ['مقبض الباب', 3, 'دولاب كبير على جذع صغير.'], ['صنبور الماء', 3, 'دولاب وجذع.'], ['عجلة البئر', 3, 'دولاب وجذع.'],
      ['منحدر لدفع برميل إلى شاحنة', 0, 'سطح أحد طرفيه أعلى.'], ['الطريق الجبلي المتعرّج', 0, 'مستوى مائل طويل.'],
      ['قرص يدور حول محور يلتفّ عليه حبل لرفع ثقل', 2, 'بكرة.'], ['الفأس', 4, 'وتد.'], ['البرغي الذي يُثبّت قطعتين من الخشب', 5, 'برغي.']
    ], ['مستوى مائل', 'رافعة', 'بكرة', 'دولاب وجذع', 'وتد', 'برغي'], 'إلى أيّ الأنواع الستّة تنتمي ؟', 'الأنواع الستّة : المستوى المائل ، الرافعة ، البكرة ، الدولاب والجذع ، الوتد ، البرغي.');
  }

  /* ======================= 8 · المستوى المائل ======================= */
  function wkramp(host) {
    modes(host, [
      ['sim', 'جرّب', b => {
        const S = { Fg: 1200, h: 1, l: 3 };
        const draw = () => {
          b.innerHTML = '';
          const r = el('div', 'srow'); r.append(btn('البرميل ( الكتاب )', 'gh', () => { S.Fg = 1200; S.h = 1; S.l = 3; draw(); }), btn('الشاحنة ( مثال 5 )', 'gh', () => { S.Fg = 800; S.h = 0.5; S.l = 1; draw(); }), btn('9 m و 6 m', 'gh', () => { S.Fg = 300; S.h = 6; S.l = 9; draw(); })); b.append(r);
          b.append(sld(v => 'وزن الجسم ' + L(v + ' N'), S.Fg, 100, 2000, 50, v => { S.Fg = v; draw(); }));
          b.append(sld(v => 'الارتفاع ' + L('h = ' + v + ' m'), S.h, 0.5, 6, 0.5, v => { S.h = v; if (S.l < v) S.l = v; draw(); }));
          b.append(sld(v => 'طول المستوى ' + L('l = ' + v + ' m'), S.l, 0.5, 12, 0.5, v => { S.l = Math.max(v, S.h); draw(); }));
          const MA = S.l / S.h, F = S.Fg / MA, ang = Math.asin(Math.min(1, S.h / S.l));
          const svg = fig(b, 320, 170), L0 = 230, bx = 40, by = 150;
          const tx = bx + L0 * Math.cos(ang), ty = by - L0 * Math.sin(ang);
          sv('path', { d: 'M' + bx + ' ' + by + ' L' + tx + ' ' + ty + ' L' + tx + ' ' + by + ' z', fill: '#E9D48F', stroke: '#7a5c2e', 'stroke-width': 2 }, svg);
          const ux = Math.cos(ang), uy = -Math.sin(ang), nx = -Math.sin(ang), ny = -Math.cos(ang), P = t => [bx + t * L0 * ux, by + t * L0 * uy];
          txt(svg, tx + 6, (ty + by) / 2, 'h', { fill: C.ink }); const pl = P(0.78); txt(svg, pl[0] + nx * 16 - 4, pl[1] + ny * 16, 'l', { fill: C.ink });
          const pb = P(0.5), g = sv('g', { transform: 'rotate(' + (-ang * 180 / Math.PI) + ' ' + pb[0] + ' ' + pb[1] + ')' }, svg);
          sv('rect', { x: pb[0] - 14, y: pb[1] - 26, width: 28, height: 26, rx: 3, fill: C.box, stroke: '#7a5c2e' }, g);
          const a0 = P(0.2), a1 = P(0.43); arrow(svg, a0[0] + nx * 13, a0[1] + ny * 13, a1[0] + nx * 13, a1[1] + ny * 13, C.F, 2 + Math.min(4, F / 300));
          b.append(lg([[C.F, 'القوّة اللازمة على المستوى']]));
          const inf = info();
          inf.row('الفائدة الآلية', L('MA = l / h = ' + S.l + ' / ' + S.h + ' = ' + fmt(MA)));
          inf.row('القوّة اللازمة', L('F_l = F_g / MA = ' + S.Fg + ' / ' + fmt(MA) + ' = ' + fmt(F, 1) + ' N'));
          inf.row('الشغل رأسيًّا', L(S.Fg + ' × ' + S.h + ' = ' + fmt(S.Fg * S.h) + ' J'));
          inf.row('الشغل على المستوى', L(fmt(F, 1) + ' × ' + S.l + ' = ' + fmt(F * S.l) + ' J'));
          b.append(inf);
          b.append(note('أطِل المستوى والارتفاع ثابت : القوّة تقلّ والشغل لا يتغيّر ( مستوى أملس ).'));
        }; draw();
      }],
      ['calc', 'احسب', b => solver(b, () => {
        const k = pick(['MA', 'F', 'l']);
        const hs = pick([0.5, 1, 2, 3, 4, 6]), ma = pick([1.5, 2, 3, 4, 5]), l = hs * ma;
        if (k === 'MA') return { q: 'مستوى مائل أملس طوله ' + L(l + ' m') + ' وارتفاعه ' + L(hs + ' m') + ' . احسب فائدته الآلية.', unit: '', ans: ma, sol: L('MA = l / h = ' + l + ' / ' + hs + ' = ' + ma), traps: [[+(hs / l).toFixed(4), 'قلبتَ النسبة.'], [l * hs, 'ضربتَ.']] };
        const Fg = ma * pick([100, 200, 300, 400]);
        if (k === 'F') return { q: 'جسم وزنه ' + L(Fg + ' N') + ' يُرفع على مستوى أملس طوله ' + L(l + ' m') + ' وارتفاعه ' + L(hs + ' m') + ' بسرعة ثابتة . احسب القوّة اللازمة.', unit: 'N', ans: Fg / ma, sol: L('MA = ' + ma) + ' ، و ' + L('F_l = ' + Fg + ' / ' + ma + ' = ' + Fg / ma + ' N'), traps: [[Fg * ma, 'ضربتَ في الفائدة ؛ القوّة تقلّ.'], [Fg, 'هذه القوّة بلا مستوى.']] };
        return { q: 'دُفع جسم وزنه ' + L(Fg + ' N') + ' على مستوى أملس بقوّة ' + L(Fg / ma + ' N') + ' ، وارتفاع المستوى ' + L(hs + ' m') + ' . احسب طوله.', unit: 'm', ans: l, sol: L('MA = ' + Fg + ' / ' + Fg / ma + ' = ' + ma) + ' ، و ' + L('l = MA × h = ' + ma + ' × ' + hs + ' = ' + l + ' m'), traps: [[+(hs / ma).toFixed(4), 'قسمتَ بدل أن تضرب.']] };
      }, 'الفائدة الآلية بلا وحدة : اكتب الرقم فقط.')]
    ]);
  }

  /* ======================= 9 · الرافعة ======================= */
  function wklever(host) {
    modes(host, [
      ['sim', 'وازن', b => {
        const S = { R: 1000, d1: 0.5, d2: 2, F: 100 };
        const draw = () => {
          b.innerHTML = '';
          const r = el('div', 'srow'); r.append(btn('الصخرة ( الكتاب )', 'gh', () => { Object.assign(S, { R: 1000, d1: 0.5, d2: 2, F: 100 }); draw(); }), btn('السي سو', 'gh', () => { Object.assign(S, { R: 450, d1: 1.2, d2: 1.8, F: 200 }); draw(); })); b.append(r);
          b.append(sld(v => 'المقاومة ' + L(v + ' N'), S.R, 100, 1500, 50, v => { S.R = v; draw(); }));
          b.append(sld(v => 'ذراع المقاومة ' + L('d₁ = ' + v + ' m'), S.d1, 0.1, 2.5, 0.1, v => { S.d1 = +v.toFixed(1); draw(); }));
          b.append(sld(v => 'ذراع القوّة ' + L('d₂ = ' + v + ' m'), S.d2, 0.1, 2.5, 0.1, v => { S.d2 = +v.toFixed(1); draw(); }));
          b.append(sld(v => 'القوّة التي تؤثّر بها ' + L('F = ' + v + ' N'), S.F, 0, 1500, 10, v => { S.F = v; draw(); }));
          const tR = S.R * S.d1, tF = S.F * S.d2, need = tR / S.d2, ok = Math.abs(tF - tR) <= tR * 0.02;
          const tilt = ok ? 0 : Math.max(-12, Math.min(12, (tF - tR) / tR * 12));
          const svg = fig(b, 320, 160), cx = 160, cy = 100, sc = 55;
          sv('path', { d: 'M' + cx + ' ' + cy + ' l-14 34 h28 z', fill: '#5b6b80' }, svg);
          const g = sv('g', { transform: 'rotate(' + tilt + ' ' + cx + ' ' + cy + ')' }, svg);
          sv('rect', { x: cx - 150, y: cy - 6, width: 300, height: 8, rx: 3, fill: '#a0784a' }, g);
          const xr = cx - S.d1 * sc, xf = cx + S.d2 * sc;
          sv('rect', { x: xr - 16, y: cy - 34, width: 32, height: 28, rx: 3, fill: '#9aa5b1', stroke: '#5b6b80' }, g);
          if (S.F) arrow(g, xf, cy - 60, xf, cy - 8, C.F, 2 + S.F / 300);
          txt(g, xr, cy - 40, S.R + ' N', { 'text-anchor': 'middle' }); txt(g, xf, cy - 64, S.F + ' N', { fill: C.F, 'text-anchor': 'middle' });
          sv('path', { d: 'M' + xr + ' ' + (cy + 44) + ' H' + cx + ' M' + cx + ' ' + (cy + 44) + ' H' + xf, stroke: '#8894a6', 'stroke-width': 1, 'stroke-dasharray': '3 3' }, svg); txt(svg, (xr + cx) / 2, cy + 56, 'd1', { 'text-anchor': 'middle' }); txt(svg, (xf + cx) / 2, cy + 56, 'd2', { 'text-anchor': 'middle' });
          b.append(lg([['#9aa5b1', 'المقاومة'], [C.F, 'القوّة'], ['#5b6b80', 'نقطة الارتكاز']]));
          const inf = info();
          inf.row('المقاومة × ذراعها', L(S.R + ' × ' + S.d1 + ' = ' + fmt(tR) + ' N·m'));
          inf.row('القوّة × ذراعها', L(S.F + ' × ' + S.d2 + ' = ' + fmt(tF) + ' N·m'));
          inf.row('القوّة اللازمة للاتزان', L(fmt(need, 1) + ' N'));
          inf.row('الفائدة الآلية', L('MA = d₂ / d₁ = ' + fmt(S.d2 / S.d1)));
          b.append(inf);
          b.append(verdict(ok ? 'acok' : 'acwarn', ok ? 'متّزنة' : (tF > tR ? 'يرتفع الحِمل' : 'القوّة لا تكفي'), ok ? 'القوّة × ذراع القوّة = المقاومة × ذراع المقاومة.' : 'اجعل القوّة نحو ' + L(fmt(need, 0) + ' N') + ' ، أو غيّر الذراعين.'));
        }; draw();
      }],
      ['calc', 'احسب', b => solver(b, () => {
        const k = pick(['F', 'MA', 'd', 'm']);
        const d1 = pick([0.2, 0.25, 0.5, 1]), ma = pick([2, 3, 4, 5]), d2 = +(d1 * ma).toFixed(2);
        if (k === 'F') { const R = ma * pick([100, 150, 200, 250]); return { q: 'عتلة ذراع قوّتها ' + L(d2 + ' m') + ' وذراع مقاومتها ' + L(d1 + ' m') + ' ترفع صخرة وزنها ' + L(R + ' N') + ' . احسب القوّة اللازمة.', unit: 'N', ans: R / ma, sol: L('F × ' + d2 + ' = ' + R + ' × ' + d1) + ' ← ' + L('F = ' + R / ma + ' N'), traps: [[R * ma, 'قلبتَ الذراعين.']] }; }
        if (k === 'MA') return { q: 'رافعة ذراع قوّتها ' + L(d2 + ' m') + ' وذراع مقاومتها ' + L(d1 + ' m') + ' . احسب فائدتها الآلية.', unit: '', ans: ma, sol: L('MA = d₂ / d₁ = ' + d2 + ' / ' + d1 + ' = ' + ma), traps: [[+(1 / ma).toFixed(4), 'قلبتَ النسبة.']] };
        if (k === 'd') { const w1 = pick([200, 300, 400]), w2 = pick([400, 450, 600]), x1 = pick([1.2, 1.5, 1.8, 2.4]); const x2 = w1 * x1 / w2; return { q: 'طفل وزنه ' + L(w1 + ' N') + ' يجلس على بُعد ' + L(x1 + ' m') + ' من ارتكاز السي سو . على أيّ بُعد يجلس طفل وزنه ' + L(w2 + ' N') + ' ليتّزنا ؟', unit: 'm', ans: x2, sol: L(w1 + ' × ' + x1 + ' = ' + w2 + ' × d') + ' ← ' + L('d = ' + fmt(x2, 2) + ' m'), traps: [[w2 * x1 / w1, 'قلبتَ نسبة الوزنين ؛ الأثقل يجلس أقرب.']] }; }
        const m1 = pick([10, 20, 25, 30]), a = pick([20, 30, 40]), c = pick([50, 60, 80]); return { q: 'لوح متّزن عليه جسم ' + L(m1 + ' kg') + ' على بُعد ' + L(a + ' cm') + ' من الارتكاز ، وجسم آخر على بُعد ' + L(c + ' cm') + ' في الجهة الأخرى . احسب كتلته.', unit: 'kg', ans: m1 * a / c, sol: L(m1 + ' × ' + a + ' = m₂ × ' + c) + ' ← ' + L('m₂ = ' + fmt(m1 * a / c, 2) + ' kg'), traps: [[m1 * c / a, 'قلبتَ البُعدين.']] };
      }, 'الذراع يُقاس من نقطة الارتكاز.')]
    ]);
  }

  /* ======================= 10 · مجموعات الروافع ======================= */
  function wkclass(host) {
    const K = [
      ['الأولى', 'نقطة الارتكاز بين القوّة والمقاومة', 'المقصّ ، قطّاعة الأسلاك ، العتلة', 'تعتمد على موقع نقطة الارتكاز', ['F', 'P', 'R']],
      ['الثانية', 'المقاومة بين القوّة ونقطة الارتكاز', 'عربة اليد ، كسّارة البندق ، مقصّ الورق', 'أكبر من 1', ['F', 'R', 'P']],
      ['الثالثة', 'القوّة بين المقاومة ونقطة الارتكاز', 'الملقط ، الساعد عند رفع ثقل', 'أقلّ من 1', ['R', 'F', 'P']]
    ];
    modes(host, [
      ['see', 'شاهد', b => {
        const S = { k: 0 };
        const draw = () => {
          b.innerHTML = '';
          b.append(seg(K.map((x, i) => [i, 'المجموعة ' + x[0]]), S.k, v => { S.k = +v; draw(); }));
          const k = K[S.k], svg = fig(b, 320, 140), xs = [40, 160, 280];
          sv('rect', { x: 20, y: 80, width: 280, height: 8, rx: 3, fill: '#a0784a' }, svg);
          k[4].forEach((p, i) => {
            const x = xs[i];
            if (p === 'P') sv('path', { d: 'M' + x + ' 88 l-14 34 h28 z', fill: '#5b6b80' }, svg);
            if (p === 'R') { sv('rect', { x: x - 16, y: 50, width: 32, height: 30, rx: 3, fill: '#9aa5b1', stroke: '#5b6b80' }, svg); arrow(svg, x, 30, x, 48, '#5b6b80', 2); }
            if (p === 'F') arrow(svg, x, 20, x, 76, C.F, 4);
          });
          b.append(lg([[C.F, 'القوّة'], ['#9aa5b1', 'المقاومة'], ['#5b6b80', 'نقطة الارتكاز']]));
          const inf = info(); inf.row('الوصف', k[1]); inf.row('أمثلة', k[2]); inf.row('الفائدة الآلية', k[3]); b.append(inf);
          b.append(note('المفتاح : ما الذي في الوسط ؟ الارتكاز ← الأولى ، المقاومة ← الثانية ، القوّة ← الثالثة.'));
        }; draw();
      }],
      ['q', 'صنّف', b => sorter(b, [
        ['المقصّ', 0, 'الارتكاز ( المسمار ) بين اليد والورقة.'], ['قطّاعة الأسلاك', 0, 'الارتكاز بين القوّة والمقاومة.'], ['العتلة لرفع صخرة', 0, 'الارتكاز بين الولد والصخرة.'],
        ['عربة اليد ( المجرفة )', 1, 'الحِمل بين العجلة ( الارتكاز ) واليدين.'], ['كسّارة البندق', 1, 'الجوزة بين المفصل واليد.'], ['مقصّ الورق', 1, 'في جدول الكتاب : المقاومة بين القوّة والارتكاز.'],
        ['الملقط', 2, 'الأصابع بين المفصل والشيء الممسوك.'], ['الساعد عند رفع ثقل باليد', 2, 'العضلة بين المرفق والثقل.'],
        ['رافعة فائدتها الآلية أقلّ من 1 دائمًا', 2, 'ذراع القوّة أقصر.'], ['رافعة فائدتها أكبر من 1 دائمًا', 1, 'ذراع القوّة أطول دائمًا.']
      ], ['الأولى', 'الثانية', 'الثالثة'], 'إلى أيّ مجموعة تنتمي ؟', 'حدّد ما في الوسط من النقاط الثلاث.')]
    ]);
  }

  /* ======================= 11 · البكرات والدولاب والجذع ======================= */
  function wkpulley(host) {
    modes(host, [
      ['p', 'البكرات', b => {
        const S = { k: 'fix', w: 20 };
        const draw = () => {
          b.innerHTML = '';
          b.append(seg([['fix', 'بكرة ثابتة'], ['mov', 'بكرة متحرّكة'], ['sys', 'ثابتة + متحرّكة']], S.k, v => { S.k = v; draw(); }));
          b.append(sld(v => 'وزن الثقل ' + L(v + ' N'), S.w, 10, 200, 10, v => { S.w = v; draw(); }));
          const MA = S.k === 'fix' ? 1 : 2, F = S.w / MA, svg = fig(b, 300, 200), rope = '#5b6b80';
          sv('rect', { x: 20, y: 6, width: 260, height: 8, fill: '#9aa5b1' }, svg);
          if (S.k === 'fix') {
            sv('path', { d: 'M150 14 V40', stroke: rope, 'stroke-width': 2 }, svg); sv('circle', { cx: 150, cy: 55, r: 18, fill: '#fff', stroke: C.ink, 'stroke-width': 3 }, svg);
            sv('path', { d: 'M132 55 V140 M168 55 V150', stroke: rope, 'stroke-width': 2 }, svg);
            sv('rect', { x: 116, y: 140, width: 32, height: 30, fill: C.box }, svg); arrow(svg, 168, 150, 168, 190, C.F, 3);
            txt(svg, 176, 186, F + ' N', { fill: C.F });
          } else {
            const ax = S.k === 'sys' ? 210 : 100;
            sv('path', { d: 'M' + ax + ' 14 V110', stroke: rope, 'stroke-width': 2 }, svg);
            sv('circle', { cx: ax + 18, cy: 120, r: 18, fill: '#fff', stroke: C.ink, 'stroke-width': 3 }, svg);
            sv('path', { d: 'M' + (ax + 18) + ' 138 V150', stroke: rope, 'stroke-width': 2 }, svg); sv('rect', { x: ax + 2, y: 150, width: 32, height: 30, fill: C.box }, svg);
            if (S.k === 'mov') { sv('path', { d: 'M' + (ax + 36) + ' 120 V60', stroke: rope, 'stroke-width': 2 }, svg); arrow(svg, ax + 36, 60, ax + 36, 24, C.F, 3); txt(svg, ax + 44, 40, F + ' N', { fill: C.F }); }
            else { sv('path', { d: 'M' + (ax + 36) + ' 120 V55', stroke: rope, 'stroke-width': 2 }, svg); sv('circle', { cx: ax + 54, cy: 50, r: 18, fill: '#fff', stroke: C.ink, 'stroke-width': 3 }, svg); sv('path', { d: 'M' + (ax + 54) + ' 14 V32 M' + (ax + 72) + ' 50 V150', stroke: rope, 'stroke-width': 2 }, svg); arrow(svg, ax + 72, 150, ax + 72, 190, C.F, 3); txt(svg, ax - 50, 196, F + ' N', { fill: C.F }); }
          }
          b.append(lg([[C.F, 'قوّة الشدّ ( قراءة الميزان )'], [C.box, 'الثقل']]));
          const inf = info();
          inf.row('الفائدة الآلية', L('MA = ' + MA)); inf.row('قوّة الشدّ', L(S.w + ' / ' + MA + ' = ' + fmt(F) + ' N'));
          inf.row('اتجاه الشدّ', S.k === 'mov' ? 'إلى الأعلى ( لم يتغيّر )' : 'إلى الأسفل ( تغيّر الاتجاه )');
          inf.row('لرفع الثقل ' + L('1 m'), 'تسحب الحبل ' + L(MA + ' m') + ' ؛ فالشغل لا يقلّ.');
          b.append(inf);
        }; draw();
      }],
      ['w', 'الدولاب والجذع', b => {
        const S = { D: 60, d: 10, w: 120 };
        const draw = () => {
          b.innerHTML = '';
          b.append(sld(v => 'قطر الدولاب ' + L(v + ' cm'), S.D, 20, 100, 5, v => { S.D = Math.max(v, S.d); draw(); }));
          b.append(sld(v => 'قطر الجذع ' + L(v + ' cm'), S.d, 5, 30, 1, v => { S.d = Math.min(v, S.D); draw(); }));
          b.append(sld(v => 'وزن الدلو ' + L(v + ' N'), S.w, 20, 300, 10, v => { S.w = v; draw(); }));
          const MA = S.D / S.d, F = S.w / MA, svg = fig(b, 300, 170), cx = 120, cy = 70;
          sv('circle', { cx: cx, cy: cy, r: S.D * 0.55, fill: '#eef1f5', stroke: C.ink, 'stroke-width': 3 }, svg);
          sv('circle', { cx: cx, cy: cy, r: S.d * 0.55, fill: '#a0784a', stroke: '#7a5c2e', 'stroke-width': 2 }, svg);
          sv('path', { d: 'M' + (cx + S.d * 0.55) + ' ' + cy + ' V130', stroke: '#5b6b80', 'stroke-width': 2 }, svg); sv('rect', { x: cx + S.d * 0.55 - 14, y: 130, width: 28, height: 28, fill: '#5B8DEF' }, svg);
          arrow(svg, cx - S.D * 0.55, cy - 30, cx - S.D * 0.55, cy + 4, C.F, 2 + F / 40);
          txt(svg, 210, 40, 'MA = ' + fmt(MA), { fill: C.ink }); txt(svg, 210, 64, 'F = ' + fmt(F, 1) + ' N', { fill: C.F });
          b.append(lg([[C.F, 'القوّة على طرف الدولاب'], ['#a0784a', 'الجذع'], ['#5B8DEF', 'الدلو']]));
          const inf = info(); inf.row('الفائدة الآلية', 'قطر الدولاب ÷ قطر الجذع = ' + L(S.D + ' / ' + S.d + ' = ' + fmt(MA))); inf.row('القوّة اللازمة', L(S.w + ' / ' + fmt(MA) + ' = ' + fmt(F, 1) + ' N')); b.append(inf);
          b.append(note('استخدامات من الكتاب : مقبض الباب ، صنبور الماء ، عجلة البئر.'));
        }; draw();
      }],
      ['calc', 'احسب', b => solver(b, () => {
        const k = pick(['fix', 'mov', 'wa']);
        if (k === 'fix') { const w = ri(2, 40) * 5; return { q: 'ثقل وزنه ' + L(w + ' N') + ' يُرفع ببكرة ثابتة . ما قراءة الميزان النابضي ؟', unit: 'N', ans: w, sol: 'البكرة الثابتة تُغيّر الاتجاه فقط : ' + L('MA = 1') + ' ، فالقراءة ' + L(w + ' N'), traps: [[w / 2, 'هذا في المتحرّكة.']] }; }
        if (k === 'mov') { const w = ri(2, 40) * 10; return { q: 'ثقل وزنه ' + L(w + ' N') + ' يُرفع بنظام من بكرة متحرّكة موصولة ببكرة ثابتة . احسب قوّة الشدّ.', unit: 'N', ans: w / 2, sol: L('MA = 2') + ' ( الثابتة لا تُغيّرها ) ، فـ ' + L('F = ' + w + ' / 2 = ' + w / 2 + ' N'), traps: [[w / 4, 'الثابتة لا تُضاعف الفائدة.'], [w, 'المتحرّكة تُنصّف.']] }; }
        const d = pick([5, 8, 10, 12]), ma = pick([3, 4, 5, 6]), D = d * ma, w = ma * pick([10, 20, 30]); return { q: 'دولاب وجذع : قطر الدولاب ' + L(D + ' cm') + ' وقطر الجذع ' + L(d + ' cm') + ' ، يرفع وزنًا ' + L(w + ' N') + ' . احسب القوّة اللازمة على الدولاب.', unit: 'N', ans: w / ma, sol: L('MA = ' + D + ' / ' + d + ' = ' + ma) + ' ، فـ ' + L('F = ' + w + ' / ' + ma + ' = ' + w / ma + ' N'), traps: [[w * ma, 'ضربتَ في الفائدة.']] };
      }, 'اكتب الناتج رقمًا فقط.')]
    ]);
  }

  /* ======================= 12 · الكفاءة ======================= */
  function wkeff(host) {
    modes(host, [
      ['sim', 'جرّب', b => {
        const S = { Fg: 200, h: 1, l: 2, f: 25 };
        const draw = () => {
          b.innerHTML = '';
          b.append(sld(v => 'وزن العربة ' + L(v + ' N'), S.Fg, 50, 500, 10, v => { S.Fg = v; draw(); }));
          b.append(sld(v => 'الارتفاع ' + L(v + ' m'), S.h, 0.5, 2, 0.1, v => { S.h = +v.toFixed(1); if (S.l < S.h) S.l = S.h; draw(); }));
          b.append(sld(v => 'طول المستوى ' + L(v + ' m'), S.l, 0.5, 6, 0.1, v => { S.l = Math.max(+v.toFixed(1), S.h); draw(); }));
          b.append(sld(v => 'قوّة الاحتكاك ' + L(v + ' N'), S.f, 0, 100, 5, v => { S.f = v; draw(); }));
          const Wout = S.Fg * S.h, F = S.Fg * S.h / S.l + S.f, Win = F * S.l, lost = Win - Wout, e = Wout / Win * 100;
          const bar = el('div', 'wkbar'); bar.innerHTML = '<span style="width:' + (Wout / Win * 100) + '%;background:#14603f"></span><span style="width:' + (lost / Win * 100) + '%;background:#D62828"></span>'; b.append(bar);
          b.append(lg([['#14603f', 'الشغل الناتج ( المفيد )'], ['#D62828', 'الضائع حرارةً بالاحتكاك']]));
          const inf = info();
          inf.row('الشغل المبذول على المستوى', L(fmt(F, 1) + ' × ' + S.l + ' = ' + fmt(Win, 1) + ' J'));
          inf.row('الشغل الناتج ( الرفع رأسيًّا )', L(S.Fg + ' × ' + S.h + ' = ' + fmt(Wout, 1) + ' J'));
          inf.row('الكفاءة', L('e = ' + fmt(Wout, 1) + ' / ' + fmt(Win, 1) + ' × 100 % = ' + fmt(e, 1) + ' %'));
          b.append(inf);
          b.append(verdict(S.f ? 'acwarn' : 'acok', S.f ? 'أقلّ من 100 %' : 'الوضع المثالي : 100 %', S.f ? 'ضاع ' + L(fmt(lost, 1) + ' J') + ' بسبب الاحتكاك وتحوّل إلى طاقة حرارية.' : 'لا احتكاك ، فالناتج يساوي المبذول ؛ وعلى هذا حُسبت الفوائد الآلية.'));
        }; draw();
      }],
      ['calc', 'احسب', b => solver(b, () => {
        const k = pick(['e', 'out', 'lost']);
        const Win = pick([200, 250, 400, 500, 800, 1000]), e = pick([50, 60, 75, 80, 90]), Wout = Win * e / 100;
        if (k === 'e') return { q: 'بُذل على آلة شغل ' + L(Win + ' J') + ' فكان الشغل الناتج ' + L(Wout + ' J') + ' . احسب الكفاءة بالنسبة المئوية.', unit: '%', ans: e, sol: L('e = ' + Wout + ' / ' + Win + ' × 100 % = ' + e + ' %'), traps: [[+(Win / Wout * 100).toFixed(2), 'قلبتَ الكسر ؛ الكفاءة لا تتجاوز 100 %.'], [100 - e, 'هذه نسبة الضائع.']] };
        if (k === 'out') return { q: 'آلة كفاءتها ' + L(e + ' %') + ' بُذل عليها شغل ' + L(Win + ' J') + ' . احسب الشغل الناتج.', unit: 'J', ans: Wout, sol: L('W_out = ' + e / 100 + ' × ' + Win + ' = ' + Wout + ' J'), traps: [[Win - Wout, 'هذا الضائع.']] };
        return { q: 'بُذل على آلة شغل ' + L(Win + ' J') + ' فكان الناتج ' + L(Wout + ' J') + ' . كم جولًا ضاع حرارةً ؟', unit: 'J', ans: Win - Wout, sol: L(Win + ' − ' + Wout + ' = ' + (Win - Wout) + ' J') + ' تحوّلت إلى طاقة حرارية بالاحتكاك.', traps: [[Win + Wout, 'جمعتَ.']] };
      }, 'الكفاءة = الناتج ÷ المبذول × 100 %.')]
    ]);
  }

  Object.assign(window.SIMS, { wkwork, wkcalc, wkcases, wkpower, wkke, wkwke, wksm, wkramp, wklever, wkclass, wkpulley, wkeff });
})();
