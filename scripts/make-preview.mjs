// Genera preview/plan-b-jobs.html: la app en un solo archivo con los datos incrustados.
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
const html = readFileSync('dist-single/index.html', 'utf8');
const data = readFileSync('public/data/jobs.json', 'utf8');
const head = html.match(/<head>([\s\S]*?)<\/head>/)[1]
  .replace(/<meta charset[^>]*>/i, '').replace(/<meta name="viewport"[^>]*>/i, '');
const body = html.match(/<body>([\s\S]*?)<\/body>/)[1];
const title = head.match(/<title>[\s\S]*?<\/title>/)[0];
const rest = head.replace(title, '');
const safe = data.replace(/</g, '\\u003c');
mkdirSync('preview', { recursive: true });
writeFileSync('preview/plan-b-jobs.html', `${title}\n<script>window.__JOBS__=${safe};</script>\n${rest}\n${body}\n`);
console.log('preview/plan-b-jobs.html listo');
