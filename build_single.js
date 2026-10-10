const fs = require('fs');
const dir = __dirname;
const esc = t => t.replace(/<\/script/gi, '<\\/script').replace(/<!--/g, '<\\!--');
let html = fs.readFileSync(dir + '/index.html', 'utf8');
const app = fs.readFileSync(dir + '/app.js', 'utf8');
const data = fs.readFileSync(dir + '/data.json', 'utf8');
const sets = fs.existsSync(dir + '/settings.json') ? fs.readFileSync(dir + '/settings.json', 'utf8') : 'null';
const extras = fs.existsSync(dir + '/extras.json') ? fs.readFileSync(dir + '/extras.json', 'utf8') : '{}';
const learn = fs.existsSync(dir + '/learn.json') ? fs.readFileSync(dir + '/learn.json', 'utf8') : '{}';
const figs = fs.existsSync(dir + '/figs.json') ? fs.readFileSync(dir + '/figs.json', 'utf8') : '{}';
const sims = fs.existsSync(dir + '/sims.js') ? fs.readFileSync(dir + '/sims.js', 'utf8') : '';
const logo = fs.existsSync(dir + '/logo.png') ? 'data:image/png;base64,' + fs.readFileSync(dir + '/logo.png').toString('base64') : '';
html = html.replace('<link rel="manifest" href="manifest.webmanifest">', '');
html = html.replace('<link rel="icon" href="icon.svg">', '');
html = html.replace('<script src="sims.js"></script>', '<script>' + esc(sims) + '</script>');
html = html.replace('<script src="app.js"></script>',
  '<script>window.__SETTINGS__=' + esc(sets) + ';window.__EXTRAS__=' + esc(extras) + ';window.__LEARN__=' + esc(learn) + ';window.__FIGS__=' + esc(figs) + ';window.__LOGO__=' + JSON.stringify(logo) + ';window.__DATA__=' + esc(data) + ';</script>\n<script>' + esc(app) + '</script>');
fs.writeFileSync(dir + '/دوسياتي - نسخة ملف واحد.html', html);
console.log('single file:', (fs.statSync(dir + '/دوسياتي - نسخة ملف واحد.html').size / 1024).toFixed(0), 'KB');
