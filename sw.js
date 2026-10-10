const CACHE = 'dosiati-v24';
/* خزانة مستقلّة للأشكال لا يمسّها تحديث الإصدار ، فلا يفقد الطالب ما نزّله */
const FIGC = 'dosiati-fig';
const FILES = ['./', 'index.html', 'app.js', 'data.json', 'extras.json', 'learn.json', 'figs.json', 'sims.js', 'logo.png', 'manifest.webmanifest', 'icon.svg'];
self.addEventListener('install', e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES)).then(() => self.skipWaiting())); });
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys()
    .then(k => Promise.all(k.filter(x => x !== CACHE && x !== FIGC).map(x => caches.delete(x))))
    .then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  const url = new URL(e.request.url);
  /* ملف الإعدادات : الشبكة أوّلًا ليصل تعديل المعلّم فورًا ، والنسخة المخزَّنة عند انقطاع الإنترنت */
  if (url.pathname.endsWith('settings.json')) {
    e.respondWith(fetch(e.request).then(res => {
      const copy = res.clone(); caches.open(CACHE).then(c => c.put(e.request, copy)); return res;
    }).catch(() => caches.match(e.request, { ignoreSearch: true })));
    return;
  }
  /* أشكال الكتاب : المخزَّن أوّلًا ثمّ الشبكة ، وتُخزَّن في خزانة الأشكال عند أوّل فتح */
  if (/\/fig\//.test(url.pathname)) {
    e.respondWith(caches.open(FIGC).then(c => c.match(e.request).then(r => r || fetch(e.request).then(res => {
      if (res && res.ok) c.put(e.request, res.clone());
      return res;
    }))));
    return;
  }
  e.respondWith(caches.match(e.request, { ignoreSearch: true }).then(r => r || fetch(e.request).then(res => {
    const copy = res.clone(); caches.open(CACHE).then(c => c.put(e.request, copy)); return res;
  }).catch(() => (e.request.mode === 'navigate' ? caches.match('index.html') : Response.error()))));
});
