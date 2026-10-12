/* ===== محاكاة تصنيف الكائنات الحيّة ( أحياء العاشر — الوحدة الثالثة ) — البادئة kz ===== */
(function () {
  const el = (t, c, h) => { const e = document.createElement(t); if (c) e.className = c; if (h !== undefined) e.innerHTML = h; return e; };
  const btn = (txt, cls, fn) => { const b = el('button', 'sb ' + (cls || ''), txt); b.onclick = fn; return b; };
  const L = s => '<span class="ltr">' + s + '</span>';
  const I = s => '<span class="ltr"><i>' + s + '</i></span>';
  const info = () => { const b = el('div', 'cyinfo'); b.row = (k, v) => b.append(el('div', 'cyrow', '<span class="cyk">' + k + '</span><span class="cyv">' + v + '</span>')); return b; };
  const verdict = (cls, b, s) => el('div', 'acv' + (cls ? ' ' + cls : ''), '<b>' + b + '</b><span>' + s + '</span>');
  const seg = (opts, val, fn) => { const w = el('div', 'kzseg'); opts.forEach(o => { const b = el('button', 'kzb' + (String(o[0]) === String(val) ? ' kzon' : ''), o[1]); b.onclick = () => fn(o[0]); w.append(b); }); return w; };
  const NS = 'http://www.w3.org/2000/svg';
  const sv = (t, a, p) => { const e = document.createElementNS(NS, t); for (const k in a) e.setAttribute(k, a[k]); if (p) p.append(e); return e; };
  const txt = (svg, x, y, s, a) => { const t = sv('text', Object.assign({ x: x, y: y, 'font-size': 11, fill: '#1F3A5F', direction: 'ltr', 'font-weight': 700 }, a || {}), svg); t.textContent = s; return t; };
  const fig = (body, w, h) => { const s = sv('svg', { viewBox: '0 0 ' + w + ' ' + h, class: 'kzsvg', preserveAspectRatio: 'xMidYMid meet' }); const f = el('div', 'kzfig'); f.append(s); body.append(f); return s; };
  const shuffle = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const note = s => el('div', 'kznote', s);
  function sorter(body, pool, cats, intro, done) {
    const S = { q: shuffle(pool), k: 0, ok: 0, ans: null };
    function draw() {
      body.innerHTML = '';
      if (S.k >= S.q.length) { body.append(verdict('acok', 'النتيجة : ' + S.ok + ' من ' + S.q.length, done)); const r = el('div', 'srow'); r.append(btn('من جديد', 'gh', () => { S.q = shuffle(pool); S.k = 0; S.ok = 0; S.ans = null; draw(); })); body.append(r); return; }
      const it = S.q[S.k];
      body.append(el('div', 'shint', intro + ' ( ' + (S.k + 1) + ' / ' + S.q.length + ' )'));
      body.append(el('div', 'kzq', it[0]));
      const r = el('div', 'kzseg');
      cats.forEach((c, i) => { const b = el('button', 'kzb' + (S.ans !== null && i === it[1] ? ' kzon' : '') + (S.ans === i && i !== it[1] ? ' kzno' : ''), c); b.onclick = () => { if (S.ans !== null) return; S.ans = i; if (i === it[1]) S.ok++; draw(); }; r.append(b); });
      body.append(r);
      if (S.ans !== null) { body.append(verdict(S.ans === it[1] ? 'acok' : 'acwarn', S.ans === it[1] ? 'صحيح' : 'الصواب : ' + cats[it[1]], it[2])); const r2 = el('div', 'srow'); r2.append(btn('التالي', '', () => { S.k++; S.ans = null; draw(); })); body.append(r2); }
    }
    draw();
  }
  /* لعبة ترتيب : بطاقات تُضغط بترتيبها الصحيح */
  function orderer(body, items, intro, wrongMsg, doneTitle, doneMsg, show) {
    const S = { ord: shuffle(items.map((x, i) => i)), done: [], bad: null };
    function draw() {
      body.innerHTML = '';
      body.append(el('div', 'shint', intro));
      const ch = el('div', 'kzchain'); items.forEach((x, i) => ch.append(el('div', 'kzlink' + (i < S.done.length ? ' kzon' : ''), '<b>' + (i + 1) + '</b><span>' + (i < S.done.length ? x[0] : '؟') + '</span>'))); body.append(ch);
      const w = el('div', 'kzcards');
      S.ord.forEach(i => { if (S.done.includes(i)) return; const c = el('button', 'kzcard' + (S.bad === i ? ' kzno' : ''), (show ? '<b>' + items[i][0] + '</b>' : '') + '<span>' + items[i][1] + '</span>'); c.onclick = () => { if (i === S.done.length) { S.done.push(i); S.bad = null; } else S.bad = i; draw(); }; w.append(c); });
      body.append(w);
      if (S.bad !== null) body.append(verdict('acwarn', 'ليس الآن', wrongMsg));
      if (S.done.length === items.length) { body.append(verdict('acok', doneTitle, doneMsg)); const r = el('div', 'srow'); r.append(btn('من جديد', 'gh', () => { S.done = []; S.ord = shuffle(S.ord); draw(); })); body.append(r); }
    }
    draw();
  }
  const modes = (host, list, cur) => { host.innerHTML = ''; const S = { m: cur || list[0][0] }; const top = el('div'), body = el('div'); host.append(top, body); const go = () => { top.innerHTML = ''; top.append(seg(list.map(x => [x[0], x[1]]), S.m, v => { S.m = v; go(); })); body.innerHTML = ''; list.find(x => x[0] === S.m)[2](body); }; go(); };

  /* ======================= 1 · المجموعة تتبع المعيار ======================= */
  const ANI = [['حمامة', 'هوائية', 'تطير'], ['خفّاش', 'هوائية', 'تطير'], ['سمكة', 'مائية', 'تسبح'], ['حوت', 'مائية', 'تسبح'], ['قطّة', 'برّية', 'تمشي'], ['جمل', 'برّية', 'تمشي'], ['نسر', 'هوائية', 'تطير']];
  const PLA = [['نخلة', 'أشجار'], ['زيتون', 'أشجار'], ['ورد', 'شجيرات'], ['نعناع', 'أعشاب'], ['قمح', 'أعشاب']];
  function kzgroup(host) {
    host.innerHTML = '';
    const S = { c: 'place' };
    const top = el('div'), body = el('div'); host.append(top, body);
    function bar() { top.innerHTML = ''; top.append(el('div', 'shint', 'اختر معيار التصنيف ، وراقب كيف تتغيّر المجموعات :')); top.append(seg([['place', 'الحيوانات : مكان المعيشة'], ['move', 'الحيوانات : طريقة الحركة'], ['size', 'النباتات : الحجم']], S.c, v => { S.c = v; bar(); draw(); })); }
    function draw() {
      body.innerHTML = '';
      const groups = {};
      if (S.c === 'size') PLA.forEach(p => (groups[p[1]] = groups[p[1]] || []).push(p[0]));
      else ANI.forEach(a => { const k = S.c === 'place' ? a[1] : a[2]; (groups[k] = groups[k] || []).push(a[0]); });
      const g = el('div', 'kzgroups');
      Object.keys(groups).forEach(k => { const c = el('div', 'kzgcol'); c.append(el('b', '', k)); groups[k].forEach(n => c.append(el('span', 'kzchip' + ((n === 'حوت' || n === 'خفّاش') ? ' kzhl' : ''), n))); g.append(c); });
      body.append(g);
      const who = { place: 'أرسطو ( الحيوانات بحسب مكان المعيشة )', move: 'الجاحظ والقزوينيّ ( الحيوانات بحسب طريقة الحركة )', size: 'أرسطو ( النباتات بحسب الحجم )' }[S.c];
      const b = info(); b.row('هذا معيار', who); b.row('تابع الحوت والخفّاش', S.c === 'place' ? 'الحوت مع السمكة ( مائية ) ، والخفّاش مع الحمامة ( هوائية ).' : S.c === 'move' ? 'الحوت مع السمكة ( تسبح ) ، والخفّاش مع الطيور ( تطير ).' : 'غيّر إلى معيار للحيوانات لتتبّعهما.'); body.append(b);
      body.append(verdict('acok', 'المجموعة تتبع المعيار', 'تغيّر المعيار فتغيّرت المجموعات ؛ ولهذا يسأل العالِم أوّلًا : ما المعيار ؟ والتصنيف الحديث يختار معايير تكشف التشابه الحقيقيّ في الخلية والمادّة الوراثية.'));
    }
    bar(); draw();
  }

  /* ======================= 2 · تطوّر الأنظمة ======================= */
  const HIST = [
    ['أرسطو', 'صنّف النباتات بحسب الحجم ، والحيوانات بحسب مكان المعيشة.'],
    ['الجاحظ والقزوينيّ', 'صنّفوا الحيوانات بناءً على طريقة حركتها.'],
    ['لينيوس', 'أوّل من استعمل النظام الهرميّ بحسب أوجه التشابه والاختلاف ، ووضع التسمية الثنائية.'],
    ['وتكر ( 1969 م )', 'خمس ممالك بحسب صفات الخلية : شكلها وعضيّاتها ونمط تغذيتها والغلاف النوويّ.'],
    ['ووز', 'بمقارنة المادّة الوراثية : قسّم البدائيات إلى بكتيريا وأثريات ، ورتّب الكائنات في ثلاثة نطاقات.']
  ];
  function kzhist(host) {
    modes(host, [
      ['ord', 'رتّب زمنيًّا', b => orderer(b, HIST, 'اضغط الإسهامات من الأقدم إلى الأحدث :', 'فكّر في المعيار : الشكل الظاهر أوّلًا ، ثمّ الخلية ، ثمّ المادّة الوراثية.', 'رتّبتَ التطوّر كاملًا', 'المعيار انتقل من الشكل الظاهر ( الحجم ، المكان ، الحركة ) إلى أوجه التشابه ، ثمّ إلى الخلية ، ثمّ إلى المادّة الوراثية.', false)],
      ['who', 'من صاحب هذا ؟', b => sorter(b, [
        ['قسّم الكائنات إلى خمس ممالك عام 1969 م.', 3, 'وتكر.'], ['قسّم البدائيات إلى بكتيريا وأثريات.', 4, 'ووز بمقارنة المادّة الوراثية.'], ['أوّل من صنّف الكائنات الحيّة.', 0, 'أرسطو.'],
        ['صنّف الحيوانات بحسب طريقة حركتها.', 1, 'الجاحظ والقزوينيّ.'], ['وضع نظام التسمية الثنائية.', 2, 'لينيوس.'], ['رتّب الكائنات في ثلاثة نطاقات.', 4, 'ووز.'], ['أوّل من استعمل النظام الهرميّ.', 2, 'لينيوس.']
      ], ['أرسطو', 'الجاحظ والقزوينيّ', 'لينيوس', 'وتكر', 'ووز'], 'لمن هذا الإسهام ؟', 'الخطأ الأشهر : نسبة النطاقات إلى وتكر ، وهي لووز.')]
    ]);
  }

  /* ======================= 3 · المستويات السبعة ======================= */
  const LV = [['المملكة', 'Kingdom', 'Plantae', 'Animalia'], ['القبيلة', 'Phylum', 'Angiospermae', 'Chordata'], ['الصفّ', 'Class', 'Dicotyledonae', 'Mammalia'], ['الرتبة', 'Order', 'Rosales', 'Primates'], ['العائلة', 'Family', 'Rosaceae', 'Hominidae'], ['الجنس', 'Genus', 'Rosa', 'Homo'], ['النوع', 'Species', 'gallica', 'sapiens']];
  function kzlevels(host) {
    modes(host, [
      ['lad', 'السلّم', b => {
        const S = { k: 0, ex: 2 };
        const draw = () => {
          b.innerHTML = '';
          b.append(seg([[2, 'الورد الفرنسيّ'], [3, 'الإنسان']], S.ex, v => { S.ex = +v; draw(); }));
          const w = el('div', 'kzladder');
          LV.forEach((l, i) => { const r = el('button', 'kzrung' + (i === S.k ? ' kzon' : '')); r.style.width = (100 - i * 9) + '%'; r.innerHTML = '<b>' + l[0] + '</b>' + L(l[1]) + ' · ' + I(l[S.ex]); r.onclick = () => { S.k = i; draw(); }; w.append(r); });
          b.append(w);
          const inf = info(); inf.row('المستوى ' + (S.k + 1) + ' من 7', LV[S.k][0]); inf.row('عدد الأفراد', ['الأكثر', 'كثير جدًّا', 'كثير', 'أقلّ', 'قليل', 'أقلّ كثيرًا', 'الأقلّ'][S.k]); inf.row('التشابه بينهم', ['الأقلّ', 'قليل', 'أكثر', 'أكثر', 'كبير', 'كبير جدًّا', 'الأكبر'][S.k]);
          if (S.k >= 5) inf.row('الاسم العلميّ', I(LV[5][S.ex] + ' ' + LV[6][S.ex]) + ' — من آخر مستويين'); b.append(inf);
          b.append(note('العرض المتناقص للدرجات يمثّل نقص عدد الأفراد كلّما نزلنا ، وهو تمثيل لا مقياس.'));
        }; draw();
      }],
      ['ord', 'رتّب المستويات', b => orderer(b, LV.map(l => [l[0], l[0] + ' ' + L(l[1])]), 'اضغط المستويات من الأعمّ إلى الأخصّ :', 'تذكّر : م ق ص ر ع ج ن.', 'سبعة مستويات بالترتيب', 'مملكة ← قبيلة ← صفّ ← رتبة ← عائلة ← جنس ← نوع . والنزول يعني أفرادًا أقلّ وتشابهًا أكبر.', false)]
    ]);
  }

  /* ======================= 4 · الاسم العلميّ ======================= */
  const NAMES = [['Homo', 'sapiens', 'الإنسان'], ['Olea', 'europaea', 'الزيتون'], ['Apis', 'mellifera', 'نحل العسل'], ['Salvia', 'officinalis', 'الميرمية'], ['Artemisia', 'herba-alba', 'الشيح'], ['Panthera', 'leo', 'الأسد'], ['Panthera', 'tigris', 'النمر'], ['Rosa', 'gallica', 'الورد الفرنسيّ']];
  const cap = s => s[0].toUpperCase() + s.slice(1), low = s => s[0].toLowerCase() + s.slice(1);
  function kzname(host) {
    host.innerHTML = '';
    const S = { it: null, ans: null, ok: 0, n: 0 };
    const body = el('div'); host.append(body);
    function next() {
      const [g, sp, ar] = NAMES[Math.floor(Math.random() * NAMES.length)];
      const kind = Math.floor(Math.random() * 5);
      let html, err;
      if (kind === 0) { html = I(g + ' ' + sp); err = 0; }
      else if (kind === 1) { html = '<span class="ltr"><u>' + g + '</u> <u>' + sp + '</u></span>'; err = 0; }
      else if (kind === 2) { html = I(g + ' ' + cap(sp)); err = 1; }
      else if (kind === 3) { html = I(low(g) + ' ' + sp); err = 2; }
      else { html = L(g + ' ' + sp); err = 3; }
      S.it = { html: html, err: err, ar: ar, right: g + ' ' + sp }; S.ans = null;
    }
    const OPTS = ['صحيح', 'النوع بحرف كبير', 'الجنس بحرف صغير', 'لا مائل ولا تحته خطّ'];
    function draw() {
      body.innerHTML = '';
      body.append(el('div', 'shint', 'افحص كتابة الاسم العلميّ : هل هو صحيح ؟ وإن لم يكن فأيّ قاعدة خُولفت ؟'));
      body.append(el('div', 'kzname', '<small>' + S.it.ar + '</small>' + S.it.html));
      const r = el('div', 'kzseg'); OPTS.forEach((o, i) => { const b = el('button', 'kzb' + (S.ans !== null && i === S.it.err ? ' kzon' : '') + (S.ans === i && i !== S.it.err ? ' kzno' : ''), o); b.onclick = () => { if (S.ans !== null) return; S.ans = i; S.n++; if (i === S.it.err) S.ok++; draw(); }; r.append(b); }); body.append(r);
      if (S.ans !== null) {
        body.append(verdict(S.ans === S.it.err ? 'acok' : 'acwarn', S.ans === S.it.err ? 'صحيح' : 'الصواب : ' + OPTS[S.it.err], 'الكتابة الصحيحة : ' + I(S.it.right) + ' ، أو بخطّ تحت كلّ كلمة . الجنس بحرف كبير ، والنوع بحرف صغير ، بالّلاتينية.'));
        const r2 = el('div', 'srow'); r2.append(btn('اسم آخر', '', () => { next(); draw(); })); body.append(r2);
      }
      const b = info(); b.row('القواعد الأربع', 'لاتينية · كلمتان : جنس ثمّ نوع · الجنس بحرف كبير والنوع بحرف صغير · مائل أو تحت كلّ كلمة خطّ'); b.row('نتيجتك', L(S.ok + ' / ' + S.n)); body.append(b);
    }
    next(); draw();
  }

  /* ======================= 5 · النطاقات والممالك ======================= */
  const DOM = [
    ['الأميبا', 2, 'حقيقية النَّوى ، تتغذّى بغيرها : طلائعيات.'], ['فطر المشروم', 3, 'حقيقيّ النَّوى ، جداره من الكايتين : فطريات.'], ['بكتيريا القولون', 0, 'بدائية النَّوى وجدارها فيه ببتيدوغلايكان : البكتيريا.'],
    ['كائن بدائيّ النواة يعيش في البحر الميت', 1, 'بيئة مالحة قاسية : الأثريات.'], ['شجرة الزيتون', 4, 'حقيقية النَّوى ذاتية التغذية : النباتات.'], ['نحل العسل', 5, 'حقيقيّ النَّوى : الحيوانات.'],
    ['اليوغلينا', 2, 'حقيقية النَّوى ، طلائعية شبيهة بالنباتات.'], ['الخميرة', 3, 'فطر وحيد الخلية.'], ['الرايزوبيوم', 0, 'بكتيريا العقد الجذرية.'], ['كائن بدائيّ النواة في ينبوع ساخن', 1, 'محبّ للحرارة : الأثريات.']
  ];
  const DN = ['نطاق البكتيريا', 'نطاق الأثريات', 'الطلائعيات', 'الفطريات', 'النباتات', 'الحيوانات'];
  function kzdomain(host) {
    modes(host, [
      ['tree', 'المخطّط', b => {
        const t = el('div', 'kztree');
        t.append(el('div', 'kztop', 'الكائنات الحيّة'));
        const row = el('div', 'kzdoms');
        row.append(el('div', 'kzdom kzpro', '<b>نطاق البكتيريا</b><span>بدائية النَّوى</span>'), el('div', 'kzdom kzpro', '<b>نطاق الأثريات</b><span>بدائية النَّوى</span>'));
        const eu = el('div', 'kzdom kzeu', '<b>نطاق حقيقيات النَّوى</b>'); const ks = el('div', 'kzks'); ['الطلائعيات', 'الفطريات', 'النباتات', 'الحيوانات'].forEach(k => ks.append(el('span', '', k))); eu.append(ks); row.append(eu);
        t.append(row); b.append(t);
        b.append(verdict('acok', '3 نطاقات · 4 ممالك · 7 مستويات', 'مملكة البدائيات عند وتكر انقسمت نطاقين ، والممالك الأربع الباقية اجتمعت في نطاق حقيقيات النَّوى.'));
      }],
      ['q', 'أين يقع ؟', b => sorter(b, DOM, DN, 'في أيّ نطاق أو مملكة يقع ؟', 'السؤال الأوّل : هل خلاياه حقيقية النَّوى ؟ لا ← بكتيريا أو أثريات . نعم ← إحدى الممالك الأربع.')]
    ]);
  }

  /* ======================= 6 · البكتيريا والأثريات ======================= */
  const ARC = [
    ['جدارها الخلويّ يحتوي الببتيدوغلايكان.', 0, 'في البكتيريا وحدها ، وبه تُصنَّف بصبغة غرام.'], ['تعيش في الينابيع الساخنة ومياه البحر الميت.', 1, 'البيئات القاسية للأثريات.'],
    ['خلية بدائية النَّوى بلا نواة ولا عضيّات غشائية.', 2, 'صفة مشتركة.'], ['مادّتها الوراثية شريط مزدوج حلقيّ محاط بالسيتوبلازم.', 2, 'صفة مشتركة.'],
    ['تُقسَّم إلى محبّة للحرارة ومحبّة للملوحة ومنتجة للميثان.', 1, 'تقسيم الأثريات بحسب البيئة.'], ['تُقسَّم إلى كروية وعصوية وحلزونية.', 0, 'تقسيم البكتيريا بحسب الشكل.'],
    ['تتحرّك بالانزلاق أو بالأسواط.', 2, 'صفة مشتركة.'], ['تستعمل الأمونيا وغاز الهيدروجين مصدرًا للطاقة.', 1, 'من مصادر طاقة الأثريات في الكتاب.'],
    ['تُسمّى البكتيريا القديمة أو العتائق.', 1, 'اسم آخر للأثريات.'], ['قد تحتوي البلازميد.', 2, 'الكتاب يذكره في الخصائص المشتركة.']
  ];
  function kzarch(host) {
    modes(host, [
      ['q', 'لمن هذه الصفة ؟', b => sorter(b, ARC, ['البكتيريا', 'الأثريات', 'كلاهما'], 'لمن هذه الصفة ؟', 'الفروق أربعة : الجدار ( الببتيدوغلايكان ) ، والغشاء البلازميّ ، والبيئة ، ومصادر الطاقة . وما عداها مشترك.')],
      ['tb', 'جدول المقارنة', b => {
        const rows = [['نوع الخلية', 'بدائية النَّوى', 'بدائية النَّوى', 0], ['المادّة الوراثية', 'شريط مزدوج حلقيّ', 'شريط مزدوج حلقيّ', 0], ['الجدار الخلويّ', 'فيه الببتيدوغلايكان', 'بلا ببتيدوغلايكان', 1], ['الغشاء البلازميّ', 'تركيب كيميائيّ مختلف', 'تركيب كيميائيّ مختلف', 1], ['الحركة', 'انزلاق أو أسواط', 'انزلاق أو أسواط', 0], ['البيئة', 'متنوّعة', 'قاسية : ينابيع ساخنة ، مياه مالحة', 1], ['مصادر الطاقة', 'متنوّعة', 'أمونيا ، هيدروجين ، مركّبات عضوية ، شمس ، تثبيت CO₂', 1], ['التقسيم', 'بحسب الشكل', 'بحسب البيئة', 1]];
        const t = el('div', 'kztable'); t.append(el('div', 'kztr kzth', '<span>وجه المقارنة</span><span>البكتيريا</span><span>الأثريات</span>'));
        rows.forEach(r => t.append(el('div', 'kztr' + (r[3] ? ' kzdiff' : ''), '<span>' + r[0] + '</span><span>' + r[1] + '</span><span>' + r[2] + '</span>')));
        b.append(t, note('الصفوف الملوّنة هي الفروق ، والبقية مشترك.'));
      }]
    ]);
  }

  /* ======================= 7 · الخلية البكتيرية ======================= */
  const PARTS = [['المحفظة', 'غلاف خارجيّ يحيط بالجدار الخلويّ.'], ['الجدار الخلويّ', 'يحمي الخلية ويحدّد شكلها ، وفيه الببتيدوغلايكان.'], ['الغشاء البلازميّ', 'يحيط بالسيتوبلازم وينظّم دخول المواد وخروجها.'], ['السيتوبلازم', 'الوسط الذي تسبح فيه مكوّنات الخلية.'], ['المادّة الوراثية DNA', 'شريط مزدوج حلقيّ في السيتوبلازم مباشرةً ، لعدم وجود نواة.'], ['البلازميد', 'قطعة صغيرة حلقية منفصلة عن المادّة الوراثية الرئيسة.'], ['الرايبوسومات', 'مواقع بناء البروتين.'], ['السوط', 'تركيب تتحرّك به الخلية.']];
  function bacterium(svg, hi) {
    const on = i => hi === i;
    sv('rect', { x: 50, y: 40, width: 230, height: 110, rx: 55, fill: '#F7F1D9', stroke: on(0) ? '#D62828' : '#C9B87A', 'stroke-width': on(0) ? 6 : 4 }, svg);
    sv('rect', { x: 60, y: 50, width: 210, height: 90, rx: 45, fill: 'none', stroke: on(1) ? '#D62828' : '#6A8F3A', 'stroke-width': on(1) ? 6 : 4 }, svg);
    sv('rect', { x: 67, y: 57, width: 196, height: 76, rx: 38, fill: on(3) ? '#E8F3FF' : '#EEF6E8', stroke: on(2) ? '#D62828' : '#1F4E8C', 'stroke-width': on(2) ? 3.5 : 1.8 }, svg);
    sv('path', { d: 'M110 95 q15 -22 30 0 t30 0 t30 0 q-10 20 -30 10 t-30 0 t-30 -10', fill: 'none', stroke: on(4) ? '#D62828' : '#1F3A5F', 'stroke-width': on(4) ? 4 : 2.4 }, svg);
    sv('circle', { cx: 232, cy: 78, r: 9, fill: 'none', stroke: on(5) ? '#D62828' : '#8E44AD', 'stroke-width': on(5) ? 4 : 2.4 }, svg);
    [[95, 72], [100, 118], [200, 120], [240, 108], [180, 70], [150, 122]].forEach(p => sv('circle', { cx: p[0], cy: p[1], r: on(6) ? 4.5 : 3, fill: on(6) ? '#D62828' : '#2D6A4F' }, svg));
    sv('path', { d: 'M280 95 q20 -18 35 0 t25 6', fill: 'none', stroke: on(7) ? '#D62828' : '#7a5c2e', 'stroke-width': on(7) ? 4 : 2.5 }, svg);
    [[52, 34, 1], [60, 160, 2], [262, 160, 3], [150, 82, 4], [118, 72, 5], [232, 60, 6], [96, 112, 7], [318, 84, 8]].forEach(p => { sv('circle', { cx: p[0], cy: p[1], r: 9, fill: '#fff', stroke: '#1F3A5F', 'stroke-width': 1.5 }, svg); txt(svg, p[0] - 3.5, p[1] + 4, String(p[2])); });
  }
  function kzcell(host) {
    modes(host, [
      ['ex', 'استكشف الأجزاء', b => {
        const S = { k: 0 };
        const draw = () => {
          b.innerHTML = ''; const svg = fig(b, 350, 190); bacterium(svg, S.k);
          const r = el('div', 'kzseg'); PARTS.forEach((p, i) => { const x = el('button', 'kzb' + (i === S.k ? ' kzon' : ''), (i + 1) + ' · ' + p[0]); x.onclick = () => { S.k = i; draw(); }; r.append(x); }); b.append(r);
          const inf = info(); inf.row(PARTS[S.k][0], PARTS[S.k][1]); b.append(inf);
          b.append(note('لا نواة ولا عضيّات غشائية ؛ والرايبوسومات غير غشائية ولذلك توجد . الرسم تخطيطيّ.'));
        }; draw();
      }],
      ['q', 'اختبر نفسك', b => sorter(b, PARTS.map((p, i) => [p[1], i, p[0] + '.']), PARTS.map(p => p[0]), 'أيّ جزء هذا ؟', 'من الخارج إلى الداخل : محفظة ← جدار ← غشاء بلازميّ ← سيتوبلازم فيه المادّة الوراثية والبلازميد والرايبوسومات.')]
    ]);
  }

  /* ======================= 8 · الأشكال والهيئات والحجم ======================= */
  function kzshape(host) {
    modes(host, [
      ['sh', 'الشكل والهيئة', b => {
        const S = { s: 0, a: 0 };
        const SH = ['كروية', 'عصوية', 'حلزونية'], SL = ['Coccus', 'Bacillus', 'Spirillum'], AR = ['منفردة', 'ثنائيات', 'سلاسل', 'عنقودية'];
        const draw = () => {
          b.innerHTML = '';
          b.append(el('div', 'shint', 'الشكل :')); b.append(seg(SH.map((x, i) => [i, x]), S.s, v => { S.s = +v; draw(); }));
          b.append(el('div', 'shint', 'الهيئة :')); b.append(seg(AR.map((x, i) => [i, x]), S.a, v => { S.a = +v; draw(); }));
          const svg = fig(b, 320, 140);
          let pts = [];
          if (S.a === 0) pts = [[160, 70]]; else if (S.a === 1) pts = [[142, 70], [178, 70]]; else if (S.a === 2) for (let i = 0; i < 6; i++) pts.push([60 + i * 40, 70]); else { [[0, 0], [1, 0], [2, 0], [0.5, 0.86], [1.5, 0.86], [1, 1.72], [0.5, -0.86], [1.5, -0.86], [-0.5, 0.86]].forEach(p => pts.push([125 + p[0] * 26, 60 + p[1] * 26])); }
          pts.forEach(p => {
            if (S.s === 0) sv('circle', { cx: p[0], cy: p[1], r: 13, fill: '#9CCB86', stroke: '#4E8B3A', 'stroke-width': 2.5 }, svg);
            else if (S.s === 1) sv('rect', { x: p[0] - 17, y: p[1] - 9, width: 34, height: 18, rx: 9, fill: '#9CCB86', stroke: '#4E8B3A', 'stroke-width': 2.5 }, svg);
            else sv('path', { d: 'M' + (p[0] - 18) + ' ' + p[1] + ' q6 -14 12 0 t12 0 t12 0', fill: 'none', stroke: '#4E8B3A', 'stroke-width': 4.5, 'stroke-linecap': 'round' }, svg);
          });
          const inf = info(); inf.row('الوصف', '<b>' + SH[S.s] + ' ' + AR[S.a] + '</b>'); inf.row('اسم الشكل', L(SL[S.s])); b.append(inf);
          b.append(note('الشكل صورة الخلية الواحدة ، والهيئة طريقة تجمّع الخلايا.'));
        }; draw();
      }],
      ['calc', 'قارن الأحجام', b => {
        const S = { p: null, v: '', r: null };
        const newP = first => { const um = first ? 6 : [2, 3, 4, 5, 8, 9][Math.floor(Math.random() * 6)], nm = first ? 150 : [50, 100, 150, 200, 300][Math.floor(Math.random() * 5)]; S.p = { um: um, nm: nm, ans: um * 1000 / nm }; S.v = ''; S.r = null; };
        const draw = () => {
          b.innerHTML = ''; const p = S.p;
          b.append(el('div', 'kzq', 'طول خلية بكتيرية ' + L(p.um + ' µm') + ' ، وطول فيروس ' + L(p.nm + ' nm') + ' . كم مرّة يزيد طول البكتيريا على طول الفيروس ؟'));
          const r = el('div', 'srow'); const inp = document.createElement('input'); inp.type = 'number'; inp.step = 'any'; inp.className = 'kzinp'; inp.value = S.v; inp.oninput = () => S.v = inp.value;
          r.append(inp, btn('تحقّق', '', () => { const v = parseFloat(S.v); S.r = isNaN(v) ? null : Math.abs(v - p.ans) < 0.01 * p.ans + 0.001; draw(); })); b.append(r);
          if (S.r !== null) {
            const v = parseFloat(S.v), raw = p.um / p.nm, hint = Math.abs(v - raw) < 0.01 ? ' قسمتَ قبل توحيد الوحدة.' : '';
            b.append(verdict(S.r ? 'acok' : 'acwarn', S.r ? 'صحيح' : 'ليس صحيحًا', L(p.um + ' µm = ' + (p.um * 1000) + ' nm') + ' ثمّ ' + L((p.um * 1000) + ' ÷ ' + p.nm + ' = ' + (+p.ans.toFixed(2))) + ' مرّة.' + (S.r ? '' : hint)));
            const r2 = el('div', 'srow'); r2.append(btn('مسألة أخرى', '', () => { newP(false); draw(); })); b.append(r2);
          }
          b.append(note('القاعدة : ' + L('1 µm = 1000 nm') + ' ؛ وحّد الوحدة ثمّ اقسم الأكبر على الأصغر.'));
        }; newP(true); draw();
      }]
    ]);
  }

  /* ======================= 9 · الانشطار الثنائيّ ======================= */
  const FIS = ['تضاعف المادّة الوراثية وازدياد حجم الخلية ، وتحرّك نسخة إلى كلّ طرف.', 'انغماد الغشاء البلازميّ وترسّب مكوّنات الجدار الخلويّ في الوسط.', 'انفصال الخليتين.', 'خليتان بكتيريتان متطابقتان.'];
  function kzfiss(host) {
    modes(host, [
      ['st', 'المراحل', b => {
        const S = { k: 0 };
        const draw = () => {
          b.innerHTML = ''; const svg = fig(b, 320, 130); const k = S.k;
          const cell = (x, w, pinch) => { const h = 60, y = 35; if (!pinch) sv('rect', { x: x, y: y, width: w, height: h, rx: 30, fill: '#9CCB86', stroke: '#4E8B3A', 'stroke-width': 3 }, svg); else { sv('path', { d: 'M' + (x + 30) + ' ' + y + ' H' + (x + w / 2 - 6) + ' Q' + (x + w / 2) + ' ' + (y + 22) + ' ' + (x + w / 2 + 6) + ' ' + y + ' H' + (x + w - 30) + ' A30 30 0 0 1 ' + (x + w - 30) + ' ' + (y + h) + ' H' + (x + w / 2 + 6) + ' Q' + (x + w / 2) + ' ' + (y + h - 22) + ' ' + (x + w / 2 - 6) + ' ' + (y + h) + ' H' + (x + 30) + ' A30 30 0 0 1 ' + (x + 30) + ' ' + y, fill: '#9CCB86', stroke: '#4E8B3A', 'stroke-width': 3 }, svg); sv('path', { d: 'M' + (x + w / 2) + ' ' + (y + 20) + ' V' + (y + h - 20), stroke: '#4E8B3A', 'stroke-width': 3 }, svg); } };
          const chrom = (cx) => sv('circle', { cx: cx, cy: 65, r: 13, fill: 'none', stroke: '#D62828', 'stroke-width': 2.5 }, svg);
          if (k === 0) { cell(70, 180); chrom(125); chrom(195); }
          else if (k === 1) { cell(60, 200, true); chrom(115); chrom(205); }
          else if (k === 2) { cell(40, 110); cell(170, 110); chrom(95); chrom(225); }
          else { cell(30, 115); cell(175, 115); chrom(87); chrom(232); }
          const r = el('div', 'kzseg'); FIS.forEach((f, i) => { const x = el('button', 'kzb' + (i === k ? ' kzon' : ''), 'المرحلة ' + (i + 1)); x.onclick = () => { S.k = i; draw(); }; r.append(x); }); b.append(r);
          const inf = info(); inf.row('المرحلة ' + (k + 1), FIS[k]); b.append(inf);
          if (k === 3) b.append(verdict('acok', 'تكاثر لاجنسيّ', 'خليتان متطابقتان ؛ لأنّ كلًّا منهما أخذت نسخة من الكروموسوم الحلقيّ المضاعَف ، ولا اتّحاد بين خليتين.'));
        }; draw();
      }],
      ['cnt', 'تضاعف العدد', b => {
        const S = { n: 0 };
        const draw = () => {
          b.innerHTML = ''; const N = Math.pow(2, S.n);
          const w = el('div', 'kzdots'); for (let i = 0; i < N; i++) w.append(el('i')); b.append(w);
          const inf = info(); inf.row('مرّات الانشطار', L(String(S.n))); inf.row('عدد الخلايا', L('2' + (S.n ? '<sup>' + S.n + '</sup>' : '⁰') + ' = ' + N)); b.append(inf);
          const r = el('div', 'srow'); if (S.n < 7) r.append(btn('انشطار', '', () => { S.n++; draw(); })); r.append(btn('من البداية', 'gh', () => { S.n = 0; draw(); })); b.append(r);
          b.append(note('كلّ انشطار يُضاعف العدد ولا يزيده واحدًا : بعد ثلاث مرّات 8 خلايا لا 6.'));
        }; draw();
      }]
    ]);
  }

  /* ======================= 10 · الانتقال الجينيّ ======================= */
  const GT = {
    con: ['الاقتران', ['تمتدّ شعيرة جنسية من الخلية المُعطية.', 'ترتبط بالمستقبلات البروتينية على سطح المستقبِلة فيتكوّن جسر اقتران.', 'تُنقل نسخة من البلازميد عبر الجسر.', 'يتضاعف البلازميد في الخليتين ، فتنفصلان معطيتين معًا.']],
    tra: ['التحوّل', ['تموت خلية بكتيرية فتتحرّر قطع من مادّتها الوراثية في البيئة.', 'ترتبط قطعة DNA بالخلية المستقبِلة.', 'تنقلها الخلية إلى داخلها عن طريق الغشاء البلازميّ.', 'تندمج في الحمض النوويّ الأصليّ فتنشأ صفات جديدة.']],
    trd: ['النقل', ['يُصيب فيروس آكل البكتيريا خلية بكتيرية.', 'تنتج فيروسات يحمل بعضها جزءًا من DNA البكتيريا.', 'يهاجم أحدها خلية بكتيرية جديدة فينقل إليها هذا الجزء.', 'يندمج الجزء المنقول في المادّة الوراثية للخلية الجديدة.']]
  };
  function gtDraw(svg, m, k) {
    const C = (x, dead) => sv('rect', { x: x, y: 45, width: 110, height: 60, rx: 30, fill: dead ? '#ECE7DA' : '#9CCB86', stroke: dead ? '#B8A98A' : '#4E8B3A', 'stroke-width': 3, 'stroke-dasharray': dead ? '6 5' : '' }, svg);
    const pl = (cx, cy, c) => sv('circle', { cx: cx, cy: cy, r: 7, fill: 'none', stroke: c || '#8E44AD', 'stroke-width': 3 }, svg);
    const piece = (x, y) => sv('path', { d: 'M' + x + ' ' + y + ' q6 -8 12 0 t12 0', fill: 'none', stroke: '#D62828', 'stroke-width': 3 }, svg);
    if (m === 'con') { C(20); C(190); pl(60, 75); if (k >= 1) sv('rect', { x: 128, y: 70, width: 66, height: 10, fill: '#C9E3B5', stroke: '#4E8B3A' }, svg); else if (k === 0) sv('path', { d: 'M130 75 h35', stroke: '#4E8B3A', 'stroke-width': 3 }, svg); if (k >= 2) pl(k === 2 ? 160 : 245, 75); if (k === 3) pl(85, 75); txt(svg, 50, 125, 'donor', { 'font-size': 10, fill: '#5b6b80', 'font-weight': 400 }); txt(svg, 215, 125, 'recipient', { 'font-size': 10, fill: '#5b6b80', 'font-weight': 400 }); }
    else if (m === 'tra') { C(20, true); C(190); if (k >= 0) piece(k === 0 ? 60 : k === 1 ? 170 : 225, k === 0 ? 75 : k === 1 ? 50 : 75); if (k === 3) sv('path', { d: 'M215 82 q8 -10 16 0 t16 0 t16 0', fill: 'none', stroke: '#1F3A5F', 'stroke-width': 2 }, svg); }
    else { C(20); C(190); const ph = (x, y) => { sv('polygon', { points: (x) + ',' + (y - 12) + ' ' + (x + 9) + ',' + (y - 6) + ' ' + (x + 9) + ',' + (y + 4) + ' ' + x + ',' + (y + 10) + ' ' + (x - 9) + ',' + (y + 4) + ' ' + (x - 9) + ',' + (y - 6), fill: '#E8DDF5', stroke: '#6A4C93', 'stroke-width': 2 }, svg); sv('path', { d: 'M' + x + ' ' + (y + 10) + ' v12', stroke: '#6A4C93', 'stroke-width': 3 }, svg); }; const px = k === 0 ? 75 : k === 1 ? 75 : k === 2 ? 245 : 245; ph(px, k >= 2 ? 30 : 30); if (k >= 1) piece(px - 12, 30); if (k === 3) piece(232, 78); }
  }
  function kzgene(host) {
    modes(host, [
      ['ex', 'الطرائق الثلاث', b => {
        const S = { m: 'con', k: 0 };
        const draw = () => {
          b.innerHTML = '';
          b.append(seg([['con', 'الاقتران'], ['tra', 'التحوّل'], ['trd', 'النقل']], S.m, v => { S.m = v; S.k = 0; draw(); }));
          const svg = fig(b, 320, 135); gtDraw(svg, S.m, S.k);
          const inf = info(); inf.row(GT[S.m][0] + ' — الخطوة ' + (S.k + 1) + ' من 4', GT[S.m][1][S.k]); b.append(inf);
          const r = el('div', 'srow'); if (S.k < 3) r.append(btn('الخطوة التالية', '', () => { S.k++; draw(); })); r.append(btn('من البداية', 'gh', () => { S.k = 0; draw(); })); b.append(r);
          b.append(el('div', 'kzlg', '<span><i style="background:#8E44AD"></i>بلازميد</span><span><i style="background:#D62828"></i>قطعة DNA</span><span><i style="background:#6A4C93"></i>فيروس آكل البكتيريا</span>'));
        }; draw();
      }],
      ['q', 'أيّ طريقة ؟', b => sorter(b, [
        ['خلية بكتيرية التقطت قطعة DNA من بقايا بكتيريا ميتة في الوسط.', 1, 'المصدر البيئة ، ولا وسيط : تحوّل.'], ['امتدّت شعيرة من خلية إلى أخرى وانتقل بلازميد عبر جسر.', 0, 'جسر وبلازميد : اقتران.'],
        ['حمل فيروس جزءًا من DNA بكتيريا إلى بكتيريا أخرى.', 2, 'الوسيط فيروس : نقل.'], ['خليتان انفصلتا بعد الانتقال وكلتاهما صارت معطية.', 0, 'هذه نهاية الاقتران.'],
        ['قطعة DNA دخلت عبر الغشاء البلازميّ واندمجت في الحمض النوويّ.', 1, 'دخول من البيئة عبر الغشاء : تحوّل.'], ['بكتيريا اكتسبت صفة بعد أن أصابها فيروس آكل البكتيريا.', 2, 'نقل.']
      ], ['الاقتران', 'التحوّل', 'النقل'], 'أيّ طرائق الانتقال الجينيّ هذه ؟', 'اسأل : من أين جاءت المادّة الوراثية ؟ وما الوسيط ؟')]
    ]);
  }

  /* ======================= 11 · علاقات البكتيريا ======================= */
  function kzrel(host) {
    modes(host, [
      ['rel', 'نوع العلاقة', b => sorter(b, [
        ['الرايزوبيوم في العقد الجذرية للفول : يثبّت النيتروجين ، والنبات يمنحه الغذاء والمأوى.', 0, 'منفعة متبادلة : تقايض.'], ['السالمونيلا في جسم الإنسان تُسبّب له المرض.', 2, 'ضرر لأحد الطرفين : تطفّل.'],
        ['بكتيريا تعيش على جلد كائن دون أن تؤذيه.', 1, 'بلا أذًى : تعايش.'], ['بكتيريا القولون في الأمعاء : تساعد على الهضم وتُنتج فيتامينات ، وتجد الغذاء والمأوى.', 0, 'منفعة للطرفين.'],
        ['بكتيريا تُسبّب الجمرة الخبيثة للماشية.', 2, 'تطفّل.'], ['بكتيريا تُسبّب سلّ الزيتون.', 2, 'تطفّل على النبات.']
      ], ['تقايض', 'تعايش', 'تطفّل'], 'ما نوع العلاقة ؟', 'تقايض = منفعة للطرفين ، تعايش = بلا أذًى ، تطفّل = ضرر ومرض.')],
      ['use', 'نافعة أم ضارّة ؟', b => sorter(b, [
        ['تحليل البقع النفطية في مياه البحار.', 0, 'معالجة حيوية : نافعة.'], ['الكزاز : تشنّجات وتصلّب في عضلات الفكّ.', 1, 'ضارّة : بكتيريا Clostridium tetani.'], ['إعادة المواد العضوية إلى التربة بتحليل بقايا الكائنات الميتة.', 0, 'نافعة.'],
        ['اللفحة النارية في النباتات.', 1, 'ضارّة للنبات.'], ['إنتاج فيتامين K والبيوتين في الأمعاء.', 0, 'بكتيريا القولون : نافعة.'], ['حبّ الشباب بسبب انسداد بصيلات الشعر بالدهون.', 1, 'ضارّة : Cutibacterium acnes.'], ['معالجة مياه التصريف الصحّيّ.', 0, 'نافعة.']
      ], ['نافعة', 'ضارّة'], 'هل هذا الأثر نافع أم ضارّ ؟', 'في البكتيريا نافع كثير وضارّ كثير ؛ والحكم على المثال لا على المجموعة.')]
    ]);
  }

  /* ======================= 12 · مقاومة المضادات ======================= */
  const RD = [['آسيا', 4700000], ['إفريقيا', 4200000], ['أمريكا اللاتينية', 392000], ['أوروبا', 390000], ['أمريكا الشمالية', 317000], ['أستراليا', 22000]];
  const fmtN = n => n >= 1e6 ? (n / 1e6).toString().replace(/\.0$/, '') + ' مليون' : Math.round(n / 1000) + ' ألف';
  function kzres(host) {
    modes(host, [
      ['data', 'البيانات', b => {
        b.append(el('div', 'kzbt', 'الوفيات المتوقّعة سنويًّا بسبب البكتيريا المقاوِمة حتّى 2050 م :'));
        const m = el('div', 'kzbars'); const mx = RD[0][1]; RD.forEach(r => m.append(el('div', 'kzbrow', '<span>' + r[0] + '</span><b style="width:' + Math.max(1.5, 100 * r[1] / mx) + '%"></b><em>' + fmtN(r[1]) + '</em>'))); b.append(m);
        b.append(el('div', 'kzbt', 'المقارنة التي تجعل الرقم دليلًا :'));
        const m2 = el('div', 'kzbars'); [['الوفيات 2016 م', 700000, '#9AA5B1'], ['وفيات السرطان الحالية', 8200000, '#F2963A'], ['المتوقّع 2050 م', 10000000, '#C0392B']].forEach(r => m2.append(el('div', 'kzbrow', '<span>' + r[0] + '</span><b style="width:' + (100 * r[1] / 1e7) + '%;background:' + r[2] + '"></b><em>' + fmtN(r[1]) + '</em>'))); b.append(m2);
        b.append(verdict('acok', 'دليلان', 'الزيادة من 700 ألف إلى عشرة ملايين نحو ' + L('14') + ' ضعفًا ، والرقم المتوقّع أكبر من وفيات السرطان الحالية.'));
        b.append(note('الأرقام من تحليل البيانات في الكتاب ص 55.'));
      }],
      ['mech', 'طرائق المقاومة', b => sorter(b, [
        ['تُفرز البكتيريا إنزيمًا يُحطّم المضادّ قبل أن يؤثّر.', 0, 'إفراز إنزيمات.'], ['تنقل البكتيريا جزء المقاومة إلى بكتيريا أخرى عبر جسر.', 1, 'الانتقال بالاقتران.'],
        ['تُغيّر البكتيريا المُستقبِل الذي يعمل عليه المضادّ.', 2, 'تغيير الموقع.'], ['تُعيد البكتيريا نشر المضادّ إلى خارج جسمها.', 3, 'الطرد إلى الخارج.']
      ], ['إفراز إنزيمات', 'الاقتران', 'تغيير الموقع', 'الطرد'], 'أيّ طرائق المقاومة الأربع ؟', 'أربع طرائق في الشكل ( 14 ) ، وإساءة استعمال المضادات تُسرّع ظهور السلالات المقاوِمة.')],
      ['mod', 'لماذا تُكمل الجرعة ؟', b => {
        const S = { pop: null, log: [] };
        const reset = () => { S.pop = []; for (let i = 0; i < 40; i++) S.pop.push(i < 2 ? 'r' : 's'); S.log = []; };
        const dose = full => { const k = full ? 1 : 0.6; S.pop = S.pop.filter(c => c === 'r' ? true : Math.random() > k); const n = S.pop.length; for (let i = 0; i < n && S.pop.length < 40; i++) S.pop.push(S.pop[i]); S.log.push(full ? 'جرعة كاملة' : 'جرعة ناقصة'); };
        const draw = () => {
          b.innerHTML = '';
          const w = el('div', 'kzdots kzpop'); S.pop.forEach(c => w.append(el('i', c === 'r' ? 'kzr' : ''))); b.append(w);
          const r = S.pop.filter(c => c === 'r').length;
          b.append(el('div', 'kzlg', '<span><i style="background:#9CCB86"></i>حسّاسة للمضادّ</span><span><i style="background:#C0392B"></i>مقاوِمة</span>'));
          const inf = info(); inf.row('نسبة المقاوِمة', L(Math.round(100 * r / Math.max(1, S.pop.length)) + ' %')); inf.row('ما فعلتَه', S.log.join(' ← ') || '—'); b.append(inf);
          const rr = el('div', 'srow'); rr.append(btn('جرعة ناقصة / غير لازمة', '', () => { dose(false); draw(); }), btn('جرعة كاملة', 'gh', () => { dose(true); draw(); }), btn('من البداية', 'gh', () => { reset(); draw(); })); b.append(rr);
          b.append(note('نموذج توضيحيّ مُبسَّط لا أرقام فيه من الكتاب : كلّ جرعة تقتل الحسّاسة وتُبقي المقاوِمة لتتكاثر ، فيكثر المقاوِم مع تكرار الاستعمال غير الضروريّ — وهذا معنى « الإفراط يُسرّع المقاومة ».'));
        }; reset(); draw();
      }]
    ]);
  }

  /* ======================= 13 · الطلائعيات والطحالب ======================= */
  const ALG = [['الطحالب الخضراء', 'كلوروفيل a و b ، كاروتينويدات', '#3FA34D', 'وحيدة أو عديدة الخلايا'], ['اليوغلينات', 'كلوروفيل a و b ، كاروتينويدات', '#5BB85B', 'وحيدة الخلية'], ['الدياتومات', 'كلوروفيل a و c ، كاروتينويدات', '#B8A04A', 'وحيدة الخلية'], ['الطحالب الحمراء', 'كلوروفيل a ، الفايكوإريثرين', '#C0392B', 'عديدة الخلايا'], ['الطحالب البنّية', 'كلوروفيل a و c ، الفيوكوزانثين', '#7A5230', 'عديدة الخلايا ، وفيها أعشاب البحر']];
  function kzalgae(host) {
    modes(host, [
      ['grp', 'المجموعات الثلاث', b => sorter(b, [
        ['كائن حقيقيّ النواة فيه كلوروفيل ويصنع غذاءه.', 0, 'ذاتيّ التغذية : شبيه بالنباتات ( طحلب ).'], ['كائن حقيقيّ النواة يلتهم كائنات أخرى ولا أجهزة متخصّصة فيه.', 1, 'شبيه بالحيوانات ( أوليّ ).'],
        ['كائن يحلّل المواد العضوية ، وجداره من السليلوز.', 2, 'شبيه بالفطريات.'], ['اليوغلينا.', 0, 'ذاتية التغذية : من الطحالب.'], ['الأميبا.', 1, 'أوليات.'], ['الفطريات الغروية.', 2, 'شبيهة بالفطريات.'], ['الدياتومات.', 0, 'طحالب.'], ['البراميسيوم.', 1, 'أوليات.']
      ], ['شبيهة بالنباتات', 'شبيهة بالحيوانات', 'شبيهة بالفطريات'], 'إلى أيّ مجموعة من الطلائعيات ؟', 'المعيار : طريقة التغذية . يصنع غذاءه ← طحلب ، يلتهم ← أوليّ ، يحلّل وجداره سليلوز ← شبيه بالفطريات.')],
      ['pig', 'صبغات الطحالب', b => {
        const S = { k: 0 };
        const draw = () => {
          b.innerHTML = '';
          const r = el('div', 'kzseg'); ALG.forEach((a, i) => { const x = el('button', 'kzb' + (i === S.k ? ' kzon' : ''), a[0]); x.onclick = () => { S.k = i; draw(); }; r.append(x); }); b.append(r);
          const a = ALG[S.k]; const sw = el('div', 'kzswatch'); sw.style.background = a[2]; sw.textContent = a[0]; b.append(sw);
          const inf = info(); inf.row('الصبغات', a[1].replace(/ ([abc])(?= |$)/g, ' <span class="ltr">$1</span>')); inf.row('عدد الخلايا', a[3]); b.append(inf);
          b.append(note('اللون الظاهر لون الصبغة الغالبة : الفايكوإريثرين أحمر ، والفيوكوزانثين بنّيّ . الألوان في الرسم تقريبية.'));
        }; draw();
      }]
    ]);
  }

  /* ======================= 14 · الأوليات والحركة ======================= */
  function kzmove(host) {
    modes(host, [
      ['mv', 'وسيلة الحركة', b => sorter(b, [
        ['البراميسيوم : تغطّي جسمه تراكيب قصيرة كثيرة.', 0, 'الأهداب : هدبيات.'], ['الأميبا : تمدّ بروزات مؤقّتة من جسمها.', 1, 'الأقدام الكاذبة : جذريات القدم.'],
        ['البلازموديوم : لا تراكيب للحركة فيه ، ينزلق مع سوائل جسم العائل.', 2, 'بوغيات.'], ['الليشمانيا : لها سوط.', 3, 'سوطيات حيوانية.'],
        ['البالانتيديوم كولاي : متطفّل يتحرّك بالأهداب.', 0, 'هدبيات.'], ['الإنتاميبا هيستوليتيكا : متطفّلة بالأقدام الكاذبة.', 1, 'جذريات القدم.'], ['الجيارديا : بالأسواط.', 3, 'سوطيات حيوانية.']
      ], ['الهدبيات', 'جذريات القدم', 'البوغيات', 'السوطيات الحيوانية'], 'إلى أيّ مجموعة من الأوليات ؟', 'الأوليات وحدها تُفرز بالحركة ، أمّا الطلائعيات كلّها فبالتغذية.')],
      ['ph', 'البلعمة في الأميبا', b => orderer(b, [['الإحاطة', 'تُحيط الأقدام الكاذبة بالطعام.'], ['الهضم', 'يُهضم الطعام بمساعدة اللايسوسوم مكوّنًا جسمًا حالًّا.'], ['الامتصاص', 'تُمتصّ المواد المهضومة وتُطرح الفضلات.']], 'رتّب خطوات البلعمة ( الشكل 24 ) :', 'لا هضم قبل الإحاطة ، ولا طرح قبل الهضم.', 'هكذا تتغذّى الأميبا', 'الأقدام الكاذبة أداة حركة وأداة تغذية معًا.', true)],
      ['par', 'البراميسيوم', b => {
        const P = [['الأهداب', 'تغطّي الجسم كاملًا : للحركة والتغذية.'], ['النواة الكبيرة', 'مسؤولة عن العمليات الحيوية.'], ['النواة الصغيرة', 'مسؤولة عن التكاثر.'], ['الفجوات الغذائية', 'يُهضم فيها الطعام.'], ['الفجوة المنقبضة', 'من أجزاء البراميسيوم في الشكل ( 22 ).'], ['التجويف الفمويّ', 'يدخل منه الطعام.']];
        const S = { k: 0 };
        const draw = () => {
          b.innerHTML = ''; const svg = fig(b, 320, 150);
          sv('ellipse', { cx: 160, cy: 75, rx: 120, ry: 48, fill: '#EAF4FB', stroke: S.k === 0 ? '#D62828' : '#1F4E8C', 'stroke-width': S.k === 0 ? 4 : 2 }, svg);
          for (let i = 0; i < 40; i++) { const a = i * Math.PI / 20; const x = 160 + 120 * Math.cos(a), y = 75 + 48 * Math.sin(a); sv('path', { d: 'M' + x + ' ' + y + ' l' + 7 * Math.cos(a) + ' ' + 7 * Math.sin(a), stroke: S.k === 0 ? '#D62828' : '#1F4E8C', 'stroke-width': 1.3 }, svg); }
          sv('ellipse', { cx: 150, cy: 72, rx: 26, ry: 16, fill: S.k === 1 ? '#F5B7B1' : '#D6C9E8', stroke: '#6A4C93' }, svg);
          sv('circle', { cx: 183, cy: 62, r: 6, fill: S.k === 2 ? '#D62828' : '#6A4C93' }, svg);
          [[95, 60], [110, 95], [215, 95]].forEach(p => sv('circle', { cx: p[0], cy: p[1], r: 8, fill: S.k === 3 ? '#F5B7B1' : '#FCE8C8', stroke: '#B07A2A' }, svg));
          sv('circle', { cx: 245, cy: 70, r: 10, fill: 'none', stroke: S.k === 4 ? '#D62828' : '#1F4E8C', 'stroke-width': 2, 'stroke-dasharray': '3 2' }, svg);
          sv('path', { d: 'M160 120 q20 -25 45 -18', fill: 'none', stroke: S.k === 5 ? '#D62828' : '#1F3A5F', 'stroke-width': 3 }, svg);
          const r = el('div', 'kzseg'); P.forEach((p, i) => { const x = el('button', 'kzb' + (i === S.k ? ' kzon' : ''), p[0]); x.onclick = () => { S.k = i; draw(); }; r.append(x); }); b.append(r);
          const inf = info(); inf.row(P[S.k][0], P[S.k][1]); b.append(inf); b.append(note('رسم تخطيطيّ ، والجزء المختار ملوّن بالأحمر.'));
        }; draw();
      }]
    ]);
  }

  /* ======================= 15 · أثر الطلائعيات ======================= */
  const LEI = [['أقلّ من سنة', 73, 49], ['سنة واحدة', 31, 17], ['من سنة إلى سنتين', 96, 48], ['من سنتين إلى ثلاث', 28, 35], ['من ثلاث إلى أربع', 22, 8], ['خمس سنوات فأكثر', 11, 1]];
  function kzprot(host) {
    modes(host, [
      ['dis', 'المرض ومسبّبه', b => sorter(b, [
        ['الملاريا : تنتقل بلدغة أنثى بعوضة الأنوفلس.', 2, 'البلازموديوم ( بوغيات ).'], ['الزحار الأميبيّ : إسهال شديد يخالطه الدم والمخاط.', 1, 'الإنتاميبا هيستوليتيكا ( جذريات القدم ).'],
        ['الزحار البالانتيديوميّ : إسهال يخالطه الدم والمخاط.', 0, 'البالانتيديوم كولاي ( هدبيات ).'], ['الليشمانيا الجلدية : تنتقل بذبابة الرمل.', 3, 'الليشمانيا ( سوطيات ).'], ['حُمّى القُندُس : عدوى معوية.', 4, 'الجيارديا ( سوطيات ).']
      ], ['البالانتيديوم كولاي', 'الإنتاميبا هيستوليتيكا', 'البلازموديوم', 'الليشمانيا', 'الجيارديا'], 'ما الطلائعيّ المسبّب ؟', 'الزحاران متشابهان في العَرَض ، ويختلفان في المسبّب : هدبيّ ( بالانتيديوم ) أو جذريّ القدم ( إنتاميبا ).')],
      ['use', 'نافع أم ضارّ ؟', b => sorter(b, [
        ['الطحالب مُنتِج أساسيّ تتغذّى به الأسماك الصغيرة والعوالق.', 0, 'نافع.'], ['الطحالب تُنتج الأكسجين لتنفّس الكائنات المائية.', 0, 'نافع.'], ['فطريات مائية تتطفّل على خياشيم الأسماك.', 1, 'ضارّ.'],
        ['أنواع من الطحالب تُستعمل تجاريًّا لإنتاج البروتينات والفيتامينات.', 0, 'نافع.'], ['البلازموديوم في دم الإنسان.', 1, 'ضارّ : الملاريا.']
      ], ['نافع', 'ضارّ'], 'هل هذا الأثر نافع أم ضارّ ؟', 'الطلائعيات ليست ضارّة كلّها : الطحالب أساس الحياة في البحار.')],
      ['data', 'بيانات الليشمانيا', b => {
        const S = { y: 0 };
        const draw = () => {
          b.innerHTML = ''; b.append(seg([[0, 'بحسب العمر'], [1, 'بحسب الجنس']], S.y, v => { S.y = +v; draw(); }));
          if (S.y === 0) {
            const m = el('div', 'kzbars'); LEI.forEach(r => m.append(el('div', 'kzbrow kz2', '<span>' + r[0] + '</span><b style="width:' + (r[1] / 96 * 26) + '%"></b><em>' + r[1] + '</em><b class="kzb8" style="width:' + (r[2] / 96 * 26) + '%"></b><em>' + r[2] + '</em>'))); b.append(m);
            b.append(el('div', 'kzlg', '<span><i style="background:#F2963A"></i>2007 م</span><span><i style="background:#1F4E8C"></i>2008 م</span>'));
            b.append(verdict('acok', 'الأكثر عُرضة : من سنة إلى سنتين', 'وانخفضت الإصابات عام 2008 م في كلّ الفئات تقريبًا . والتفسير فرضيات تُصاغ بحذر : مكافحة ذبابة الرمل ، أو تحسّن الوعي والوقاية ، أو ظروف السكن والمناخ.'));
          } else {
            const m = el('div', 'kzbars'); [['2007 م — ذكور', 120], ['2007 م — إناث', 110], ['2008 م — ذكور', 89], ['2008 م — إناث', 69]].forEach(r => m.append(el('div', 'kzbrow', '<span>' + r[0] + '</span><b style="width:' + (r[1] / 1.2) + '%"></b><em>' + r[1] + '</em>'))); b.append(m);
            b.append(verdict('acok', 'الذكور أكثر في العامين', 'فرضية مقبولة : نشاط الذكور خارج المنزل أكبر ، فيزيد تعرّضهم للدغ ذبابة الرمل.'));
          }
          b.append(note('الأرقام من مراجعة الدرس في الكتاب ص 64.'));
        }; draw();
      }]
    ]);
  }

  /* ======================= 16 · الفطريات : التركيب والتغذية والتكاثر ======================= */
  function kzfungi(host) {
    modes(host, [
      ['str', 'التركيب', b => {
        const P = [['الخيوط الفطرية', 'خيوط دقيقة يتكوّن منها جسم الفطر ، وتتجمّع في الغزل الفطريّ.'], ['أشباه الجذور', 'تثبّت الفطر في مصدر غذائه وتمتصّ منه.'], ['الحامل', 'ساق قائمة يحمل في نهايته الكيس البوغيّ.'], ['الكيس البوغيّ', 'يحتوي الأبواغ التي يتكاثر بها الفطر لاجنسيًّا.'], ['الحاجز الخلويّ', 'يقسّم الخيط إلى خلايا ، ويغيب في المدمج الخلويّ.']];
        const S = { k: 0 };
        const draw = () => {
          b.innerHTML = ''; const svg = fig(b, 320, 170); const c = i => S.k === i ? '#D62828' : '#6B5B3E';
          sv('path', { d: 'M20 130 H300', stroke: c(0), 'stroke-width': S.k === 0 ? 5 : 3.5 }, svg);
          [[70, 130], [170, 130], [260, 130]].forEach(p => { sv('path', { d: 'M' + p[0] + ' ' + p[1] + ' l-12 22 M' + p[0] + ' ' + p[1] + ' l0 26 M' + p[0] + ' ' + p[1] + ' l12 22', stroke: c(1), 'stroke-width': S.k === 1 ? 3 : 2 }, svg); sv('path', { d: 'M' + p[0] + ' ' + p[1] + ' V45', stroke: c(2), 'stroke-width': S.k === 2 ? 4.5 : 3 }, svg); sv('circle', { cx: p[0], cy: 35, r: 14, fill: S.k === 3 ? '#F5B7B1' : '#3a3a3a', stroke: c(3), 'stroke-width': 2 }, svg); });
          [120, 215].forEach(x => sv('path', { d: 'M' + x + ' 124 V136', stroke: c(4), 'stroke-width': S.k === 4 ? 4 : 2 }, svg));
          const r = el('div', 'kzseg'); P.forEach((p, i) => { const x = el('button', 'kzb' + (i === S.k ? ' kzon' : ''), p[0]); x.onclick = () => { S.k = i; draw(); }; r.append(x); }); b.append(r);
          const inf = info(); inf.row(P[S.k][0], P[S.k][1]); b.append(inf);
          b.append(note('رسم تخطيطيّ بأجزاء الشكل ( 31 ) . وعفن الخبز خيوطه في الحقيقة مدمجة خلويًّا بلا حواجز ، والحواجز مرسومة هنا لتعرّف الجزء فقط.'));
        }; draw();
      }],
      ['nut', 'نوع التغذية', b => sorter(b, [
        ['فطر المشروم ينمو على بقايا عضوية في التربة.', 0, 'رمّية.'], ['فطر صدأ القمح يعيش على نبات القمح ويُمرضه.', 1, 'طفيلية.'], ['الأشنات : فطر يمدّ الطحلب بالماء والأملاح ، والطحلب يمدّه بالغذاء.', 2, 'تقايضية.'],
        ['فطر ينمو على جذع شجرة ميتة.', 0, 'رمّية : الشجرة ميتة.'], ['فطر يتطفّل على حشرة حيّة.', 1, 'طفيلية.'], ['المايكورايزا على جذور النبات تُحسّن امتصاص الماء والأملاح.', 2, 'تقايضية.']
      ], ['رمّية', 'طفيلية', 'تقايضية'], 'ما نوع تغذية الفطر ؟', 'كلّها غير ذاتية : تهضم خارج خلاياها ثمّ تمتصّ . ويختلف المصدر : ميّت ( رمّية ) ، حيّ يتضرّر ( طفيلية ) ، شريك ينتفع ( تقايضية ).')],
      ['rep', 'التكاثر', b => orderer(b, [['اتّحاد نواتين', 'تتّحد نواتا خيطين فطريّين.'], ['نواة 2n', 'تنتج نواة ثنائية المجموعة الكروموسومية.'], ['انقسام منصّف', 'تنقسم النواة انقسامًا منصّفًا.'], ['أبواغ 1n', 'تنتج أبواغ أحادية المجموعة الكروموسومية.'], ['غزل فطريّ', 'تنمو الأبواغ عند توفّر الحرارة والرطوبة والمواد العضوية إلى خيوط وغزل.']], 'رتّب مراحل التكاثر الجنسيّ في الفطريات :', 'الأبواغ لا تكون ثنائية : المنصّف يُنصّف العدد.', 'اكتملت الدورة', 'والتكاثر اللاجنسيّ أقصر : أبواغ 1n تنمو مباشرة ، أو تبرعم في الخمائر.', true)]
    ]);
  }

  /* ======================= 17 · مجموعات الفطريات ======================= */
  function kzfgroup(host) {
    host.innerHTML = ''; const b = el('div'); host.append(b);
    sorter(b, [
      ['أبسط الفطريات تركيبًا ، وأبواغها تتحرّك بالأسواط.', 0, 'الأصيصية.'], ['يُعتقد أنّها سبب تناقص أعداد الضفادع عالميًّا.', 0, 'الأصيصية.'],
      ['فطر عفن الخبز.', 1, 'الاقترانية ( الزيجوتية ).'], ['فطريات تتطفّل على الحشرات ومعظمها رمّيّ.', 1, 'الاقترانية.'],
      ['تعيش على جذور النباتات وتُحسّن امتصاص الماء والأملاح.', 2, 'الكبيبية ( المايكورايزا ).'],
      ['الخمائر والكمأ.', 3, 'الكيسية.'], ['أكبر مجموعات الفطريات.', 3, 'الكيسية.'], ['مسبّبة البياض الدقيقيّ في العنب وقدم الرياضيّ.', 3, 'الكيسية.'],
      ['فطر المشروم ، وبعض أنواعه سامّة رغم جمال مظهرها.', 4, 'القمعية.'], ['واسعة الانتشار ، رمّية ، متباينة الحجوم والألوان ، خيوطها مقسّمة بحواجز.', 4, 'القمعية.']
    ], ['الأصيصية', 'الاقترانية', 'الكبيبية', 'الكيسية', 'القمعية'], 'إلى أيّ مجموعة ينتمي ؟', 'علامة لكلّ مجموعة : أصيصية سبّاحة ، اقترانية عفن الخبز ، كبيبية صديقة الجذور ، كيسية الأكبر ( خميرة وكمأ ) ، قمعية المشروم.');
  }

  /* ======================= 18 · أهمّية الفطريات وتهديدها ======================= */
  function kzfimp(host) {
    modes(host, [
      ['imp', 'مجالات الأهمّية', b => sorter(b, [
        ['المشروم يحلّل المواد العضوية ويُعيد العناصر إلى البيئة.', 0, 'بيئية.'], ['الأشنات تفتّت الصخور وتزيد خصوبة التربة.', 0, 'بيئية.'], ['فطر المحار يُزيل الملوّثات من الماء والتربة.', 0, 'بيئية : معالجة حيوية.'],
        ['البنيسيليوم يُنتج البنسلين.', 1, 'طبّية وزراعية.'], ['مركّبات من الفطريات للمكافحة الحيوية للحشرات.', 1, 'طبّية وزراعية.'],
        ['خميرة الخبز والمشروم والكمأ غذاءً.', 2, 'اقتصادية.'], ['مزارع ومصانع للفطر وإنتاج الغاز الحيويّ.', 2, 'اقتصادية.'],
        ['إنتاج مواد مضادّة للسرطان والفيروسات.', 3, 'رؤى مستقبلية.'], ['مركّبات حيوية بالهندسة الجينية.', 3, 'رؤى مستقبلية.']
      ], ['بيئية', 'طبّية وزراعية', 'اقتصادية', 'رؤى مستقبلية'], 'في أيّ مجال من جدول الأهمّية ؟', 'جدول ص 73 أربعة أعمدة ؛ والمثال الواحد قد يخدم أكثر من مجال ، والمطلوب أقربها.')],
      ['eco', 'دليل اقتصاديّ', b => {
        const c = el('div', 'kzcase');
        c.append(el('b', '', 'الأسكدنيا في راجب — لواء كفرنجة — عجلون'));
        const inf = info(); inf.row('المحصول ومكانه', 'الأسكدنيا ، أحد أهمّ مصادر دخل مزارعي راجب'); inf.row('الحجم', 'نحو ألف دونم'); inf.row('الضرر', 'أضرار كبيرة بالفطريات والآفات ، وخسائر مادية كبيرة للمزارعين'); c.append(inf);
        b.append(c);
        b.append(verdict('acok', 'بناء الدليل : مكان + حجم + ضرر', 'هكذا يصير المثال دليلًا على تهديد الاقتصاد الوطنيّ . ومثال ثانٍ في الكتاب : صدأ القمح الطفيليّ يُلحق خسائر كبيرة بالاقتصاد.'));
      }],
      ['rel', 'نوع العلاقة', b => sorter(b, [
        ['الأشنات : فطر وطحلب.', 0, 'تقايض.'], ['المايكورايزا وجذور النبات.', 0, 'تقايض.'], ['الفطريات الاقترانية والحشرات.', 1, 'تطفّل.'], ['صدأ القمح ونبات القمح.', 1, 'تطفّل.'], ['البياض الدقيقيّ ونبات العنب.', 1, 'تطفّل.']
      ], ['تقايض', 'تطفّل'], 'ما نوع العلاقة ؟', 'الأنماط نفسها التي رأيتها في البكتيريا.')]
    ]);
  }

  Object.assign(window.SIMS, { kzgroup, kzhist, kzlevels, kzname, kzdomain, kzarch, kzcell, kzshape, kzfiss, kzgene, kzrel, kzres, kzalgae, kzmove, kzprot, kzfungi, kzfgroup, kzfimp });
})();
