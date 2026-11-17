// Builds the link-preview pages for each shareable finding: share/<id>.html and share/<id>.png.
// A chat app that fetches share/boils.html sees that finding's own title, hook and chart image;
// a person who opens it is sent straight on to the story at #boils.
//
//   node scripts/build_share.js <local page url> <public page url>
//   node scripts/build_share.js http://127.0.0.1:8791/ https://example.com/chai/
//
// Needs puppeteer-core and a local Chrome. Re-run whenever the survey data changes.
const puppeteer = require('puppeteer-core');
const fs = require('fs'), path = require('path');
const [local = 'http://127.0.0.1:8791/', pub = 'https://anuj-theken.github.io/Interactive-Experiments/Interactives/chai/'] = process.argv.slice(2);
const CHROME = process.env.CHROME || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const out = path.join(__dirname, '..', 'share');
const esc = s => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');

(async () => {
  fs.mkdirSync(out, { recursive: true });
  const b = await puppeteer.launch({ executablePath: CHROME, headless: 'new' });
  const p = await b.newPage(); await p.setViewport({ width: 1280, height: 800 });
  await p.goto(local, { waitUntil: 'networkidle0' });
  await p.evaluate(u => window.__chaiSetPublic(u), pub);
  const shares = await p.evaluate(() => window.__chaiShares());
  for (const [id, s] of Object.entries(shares)) {
    const png = await p.evaluate(id => window.__chaiShareImage(id, 'og'), id);
    fs.writeFileSync(path.join(out, id + '.png'), Buffer.from(png.split(',')[1], 'base64'));
    const title = s.claim, desc = s.hook, img = pub + 'share/' + id + '.png', page = pub + '#' + id;
    fs.writeFileSync(path.join(out, id + '.html'), `<!doctype html>
<html lang="en"><head><meta charset="utf-8">
<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}">
<meta property="og:type" content="article">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(desc)}">
<meta property="og:image" content="${img}">
<meta property="og:image:width" content="1200"><meta property="og:image:height" content="630">
<meta property="og:url" content="${pub}share/${id}.html">
<meta name="twitter:card" content="summary_large_image">
<link rel="canonical" href="${page}">
<meta http-equiv="refresh" content="0; url=../#${id}">
<script>location.replace('../#${id}');</script>
</head><body><a href="../#${id}">${esc(title)}</a></body></html>
`);
    console.log('share/' + id);
  }
  await b.close();
})();
