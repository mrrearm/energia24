// Opzionale. Genera sitemap.xml e robots.txt con l'indirizzo reale del sito.
// Uso come "Build command" su Netlify, Vercel o Render:  node genera-sitemap.js
// In locale: SITE_URL=https://tuosito.it node genera-sitemap.js
const fs = require('fs');
let base = process.env.SITE_URL || process.env.URL || process.env.RENDER_EXTERNAL_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL && 'https://' + process.env.VERCEL_PROJECT_PRODUCTION_URL) ||
  (process.env.VERCEL_URL && 'https://' + process.env.VERCEL_URL);
if (!base) { console.log('Nessun indirizzo trovato: sitemap non generata (il sito funziona lo stesso).'); process.exit(0); }
base = base.replace(/\/+$/, '') + '/';
const html = fs.readFileSync('index.html', 'utf8');
const esc = t => t.replace(/&/g, '&amp;').replace(/</g, '&lt;');
let imgs = '';
for (const m of html.matchAll(/src="images\/([^"]+)"(?: data-full="images\/([^"]+)")? alt="([^"]*)"/g))
  imgs += `<image:image><image:loc>${base}images/${m[2] || m[1]}</image:loc><image:caption>${esc(m[3])}</image:caption></image:image>\n`;
const day = new Date().toISOString().slice(0, 10);
fs.writeFileSync('sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
<url><loc>${base}</loc><lastmod>${day}</lastmod><changefreq>monthly</changefreq><priority>1.0</priority>
${imgs}</url>
</urlset>
`);
fs.writeFileSync('robots.txt', `User-agent: *\nAllow: /\n\nSitemap: ${base}sitemap.xml\n`);
console.log('Generati sitemap.xml e robots.txt per ' + base);
