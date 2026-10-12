// Post-build steps for the static Cloudflare deployment:
//  1. Copy the prerendered /404 page to /404.html, which Cloudflare serves
//     (with a 404 status) for any path that has no asset.
//  2. Inline the small global stylesheet into every prerendered page: one less
//     render-blocking round trip, and complete (unlike partial critical CSS, which
//     let late rules re-wrap the hero and caused layout shift).
//  3. Write resized copies of every /media/*.webp (name.w768.webp, ...) for the
//     srcset that src/app/core/images/image-loader.ts builds. Keep widths in sync.
//  4. Generate sitemap.xml from the routes Angular actually prerendered, so the
//     sitemap can never list a page that does not exist.
import { copyFile, readFile, readdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import sharp from 'sharp';

const SITE_URL = 'https://www.rabinr.in';
const DIST = 'dist/rabin-portfolio';
const BROWSER = join(DIST, 'browser');

/** Not indexable: the 404 page, and paths that 301 elsewhere (see public/_redirects). */
const EXCLUDED = new Set(['/404', '/projects', '/skills']);

const PRIORITY = [
  [/^\/$/, '1.0'],
  [/^\/(work|services)$/, '0.9'],
  [/^\/(work|services)\//, '0.8'],
  [/^\/(about|experience|contact)$/, '0.8'],
  [/^\/insights\//, '0.6'],
  [/^\/(privacy|terms)$/, '0.3'],
];

function priorityFor(path) {
  return PRIORITY.find(([pattern]) => pattern.test(path))?.[1] ?? '0.6';
}

const { routes } = JSON.parse(await readFile(join(DIST, 'prerendered-routes.json'), 'utf8'));
const paths = Object.keys(routes)
  .filter((path) => !EXCLUDED.has(path))
  .sort();

const lastmod = new Date().toISOString().slice(0, 10);
const urls = paths
  .map((path) => {
    const loc = path === '/' ? `${SITE_URL}/` : `${SITE_URL}${path}`;
    return `  <url>\n    <loc>${loc}</loc>\n    <lastmod>${lastmod}</lastmod>\n    <priority>${priorityFor(path)}</priority>\n  </url>`;
  })
  .join('\n');

await writeFile(
  join(BROWSER, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`,
);
await copyFile(join(BROWSER, '404', 'index.html'), join(BROWSER, '404.html'));

const htmlFiles = (await readdir(BROWSER, { recursive: true })).filter((file) => file.endsWith('.html'));
let inlined = 0;
for (const file of htmlFiles) {
  const path = join(BROWSER, file);
  const html = await readFile(path, 'utf8');
  const match = /<link rel="stylesheet" href="(styles-[\w-]+\.css)">/.exec(html);
  if (!match) continue;
  const css = await readFile(join(BROWSER, match[1]), 'utf8');
  const withCss = html.replace(match[0], () => `<style>${css}</style>`);
  // Every page is complete prerendered HTML, so the app bundle only hydrates it.
  // Low priority lets the document, images and fonts win the bandwidth on slow
  // connections; event replay covers any click that lands before hydration.
  const lowPriorityJs = withCss
    .replace(/<link rel="modulepreload" href="([^"]+)">/g, '<link rel="modulepreload" href="$1" fetchpriority="low">')
    .replace(/<script src="(main-[\w-]+\.js)" type="module">/, '<script src="$1" type="module" fetchpriority="low">');
  await writeFile(path, lowPriorityJs);
  inlined++;
}

const IMAGE_BREAKPOINTS = [480, 768, 1080, 1600];
const mediaFiles = (await readdir(join(BROWSER, 'media'), { recursive: true })).filter(
  (file) => file.endsWith('.webp') && !/\.w\d+\.webp$/.test(file),
);
let variants = 0;
for (const file of mediaFiles) {
  const source = join(BROWSER, 'media', file);
  const { width = 0 } = await sharp(source).metadata();
  for (const target of IMAGE_BREAKPOINTS) {
    const out = source.replace(/\.webp$/, `.w${target}.webp`);
    // Never upscale: a breakpoint wider than the original gets the original bytes
    if (target >= width) await copyFile(source, out);
    else await sharp(source).resize({ width: target }).webp({ quality: 78 }).toFile(out);
    variants++;
  }
}

console.log(`postbuild: ${variants} image variants, sitemap.xml with ${paths.length} URLs, 404.html written, global CSS inlined in ${inlined} pages`);
