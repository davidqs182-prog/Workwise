// Recopilador de Plan B. Consulta las APIs, deduplica y guarda TODO con historial.
// Uso: npm run collect          (todas las fuentes activas)
//      npm run collect -- remotive arbeitnow   (solo esas)
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { sources } from './sources.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const STORE = join(root, 'public', 'data', 'jobs.json');

async function loadConfig() {
  const cfg = { adzuna: {}, jooble: {} };
  const local = join(root, 'collector', 'config.local.json');
  if (existsSync(local)) Object.assign(cfg, JSON.parse(await readFile(local, 'utf8')));
  // Las variables de entorno (p. ej. secretos de GitHub) tienen prioridad.
  if (process.env.ADZUNA_APP_ID) cfg.adzuna.appId = process.env.ADZUNA_APP_ID;
  if (process.env.ADZUNA_APP_KEY) cfg.adzuna.appKey = process.env.ADZUNA_APP_KEY;
  if (process.env.JOOBLE_API_KEY) cfg.jooble.apiKey = process.env.JOOBLE_API_KEY;
  return cfg;
}

const hasKey = (name, cfg) =>
  name === 'adzuna' ? !!(cfg.adzuna.appId && cfg.adzuna.appKey) :
  name === 'jooble' ? !!cfg.jooble.apiKey : true;

const today = () => new Intl.DateTimeFormat('sv-SE', { timeZone: 'Europe/Berlin' }).format(new Date());

async function main() {
  const cfg = await loadConfig();
  const store = existsSync(STORE) ? JSON.parse(await readFile(STORE, 'utf8')) : { jobs: [], runs: [] };
  const byId = new Map(store.jobs.map((j) => [j.id, j]));
  const only = process.argv.slice(2);
  const day = today();
  const run = { at: new Date().toISOString(), day, sources: {} };

  for (const [name, src] of Object.entries(sources)) {
    if (only.length && !only.includes(name)) continue;
    if (src.needsKey && !hasKey(name, cfg)) { run.sources[name] = { status: 'skipped', reason: 'sin clave' }; continue; }
    try {
      const jobs = await src.fetch(cfg);
      let added = 0;
      for (const j of jobs) {
        if (!j.url || !j.title) continue;
        const prev = byId.get(j.id);
        if (prev) { prev.lastSeen = day; continue; }       // nunca se sobrescribe ni se borra
        byId.set(j.id, { ...j, firstSeen: day, lastSeen: day });
        added++;
      }
      run.sources[name] = { status: 'ok', received: jobs.length, added };
      console.log(`✓ ${src.label}: ${jobs.length} recibidas, ${added} nuevas`);
    } catch (e) {
      run.sources[name] = { status: 'error', error: String(e.message || e) };
      console.error(`✗ ${src.label}: ${e.message || e}`);
    }
  }

  store.jobs = [...byId.values()].sort((a, b) => (b.firstSeen + (b.postedAt || '')).localeCompare(a.firstSeen + (a.postedAt || '')));
  store.runs = [...(store.runs || []), run].slice(-90);
  store.updatedAt = run.at;
  await mkdir(dirname(STORE), { recursive: true });
  await writeFile(STORE, JSON.stringify(store, null, 1));
  console.log(`Guardado: ${store.jobs.length} ofertas en total → public/data/jobs.json`);
}

main().catch((e) => { console.error(e); process.exit(1); });
