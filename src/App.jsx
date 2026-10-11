import { useEffect, useMemo, useState } from 'react';
import { ExternalLink, Moon, Search, Star, Sun, X } from 'lucide-react';
import { Button } from './components/ui/button';
import { Badge } from './components/ui/badge';
import { Input } from './components/ui/input';
import { Select } from './components/ui/select';
import { Segmented } from './components/ui/segmented';
import { dict, LANGS, SOURCE_LABELS } from './i18n';
import { cn, store } from './lib/utils';

const LOCALE = { es: 'es-ES', de: 'de-DE' };
const DEFAULTS = { q: '', type: 'all', role: 'relevant', region: 'all', period: 'all', source: 'all', favOnly: false };
const todayKey = () => new Intl.DateTimeFormat('sv-SE').format(new Date());
const daysBetween = (a, b) => Math.round((new Date(a) - new Date(b)) / 86400000);

async function loadData() {
  if (window.__JOBS__) return window.__JOBS__;
  const res = await fetch('./data/jobs.json', { cache: 'no-store' });
  if (!res.ok) throw new Error(res.statusText);
  return res.json();
}

export default function App() {
  const [lang, setLang] = useState(() => store.get('planb.lang', 'es'));
  const [theme, setTheme] = useState(() => store.get('planb.theme', null));
  const [data, setData] = useState(null);
  const [error, setError] = useState(false);
  const [f, setF] = useState(() => ({ ...DEFAULTS, ...store.get('planb.filters', {}) }));
  const [favs, setFavs] = useState(() => new Set(store.get('planb.favorites', [])));
  const t = dict[lang];

  useEffect(() => { loadData().then(setData).catch(() => setError(true)); }, []);
  useEffect(() => { store.set('planb.lang', lang); document.documentElement.lang = lang; }, [lang]);
  useEffect(() => { store.set('planb.filters', f); }, [f]);
  useEffect(() => { store.set('planb.favorites', [...favs]); }, [favs]);
  useEffect(() => {
    // Solo se fija el tema si la persona lo eligió; si no, manda el del sistema o el del visor.
    if (theme) document.documentElement.setAttribute('data-theme', theme);
    store.set('planb.theme', theme);
  }, [theme]);

  const set = (k) => (v) => setF((p) => ({ ...p, [k]: v }));
  const toggleFav = (id) => setFavs((p) => { const n = new Set(p); n.has(id) ? n.delete(id) : n.add(id); return n; });
  const hostTheme = document.documentElement.getAttribute('data-theme');
  const isDark = (theme || hostTheme) ? (theme || hostTheme) === 'dark' : !!window.matchMedia?.('(prefers-color-scheme: dark)').matches;

  const jobs = data?.jobs || [];
  // En la vista previa "hoy" es el día de la muestra; con datos vivos, el día real.
  const refDay = data?.sample ? data.updatedAt.slice(0, 10) : todayKey();

  const base = useMemo(() => {
    const q = f.q.trim().toLowerCase();
    return jobs.filter((j) => {
      if (q && !`${j.title} ${j.company} ${j.location}`.toLowerCase().includes(q)) return false;
      if (f.role === 'relevant' && j.role === 'other') return false;
      if (!['relevant', 'all'].includes(f.role) && j.role !== f.role) return false;
      if (f.region !== 'all' && j.region !== f.region) return false;
      if (f.source !== 'all' && j.source !== f.source) return false;
      if (f.favOnly && !favs.has(j.id)) return false;
      const age = daysBetween(refDay, j.firstSeen);
      if (f.period === 'today' && age > 0) return false;
      if (f.period === '7' && age > 6) return false;
      if (f.period === '30' && age > 29) return false;
      return true;
    });
  }, [jobs, f, favs, refDay]);

  const visible = f.type === 'all' ? base : base.filter((j) => j.type === f.type);
  const groups = useMemo(() => {
    const m = new Map();
    for (const j of visible) { if (!m.has(j.firstSeen)) m.set(j.firstSeen, []); m.get(j.firstSeen).push(j); }
    return [...m.entries()].sort((a, b) => b[0].localeCompare(a[0]));
  }, [visible]);

  const fmtDay = (d) => {
    const diff = daysBetween(refDay, d);
    if (diff === 0) return t.today;
    if (diff === 1) return t.yesterday;
    return new Date(d + 'T12:00:00').toLocaleDateString(LOCALE[lang], { weekday: 'long', day: 'numeric', month: 'long' });
  };
  const fmtDate = (iso) => iso && new Date(iso).toLocaleDateString(LOCALE[lang], { day: '2-digit', month: '2-digit', year: 'numeric' });
  const sources = [...new Set(jobs.map((j) => j.source))].sort();
  const lastRun = data?.runs?.at(-1);
  const newToday = jobs.filter((j) => j.firstSeen === refDay).length;
  const dirty = JSON.stringify(f) !== JSON.stringify(DEFAULTS);

  return (
    <div className="mx-auto flex min-h-screen max-w-5xl flex-col gap-6 px-4 py-8 sm:px-6">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0 max-w-xl">
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground">Plan B · Pixel Personas</p>
          <h1 className="mt-1 font-display text-3xl font-bold tracking-tight sm:text-4xl">Plan B Jobs</h1>
          <p className="mt-2 text-sm text-muted-foreground">{t.subtitle}</p>
        </div>
        <div className="flex items-center gap-2">
          <Segmented label="Idioma / Sprache" value={lang} onChange={setLang}
            options={Object.keys(LANGS).map((k) => ({ value: k, label: k.toUpperCase() }))} />
          <Button variant="outline" size="icon" aria-label={t.theme} title={t.theme} onClick={() => setTheme(isDark ? 'light' : 'dark')}>
            {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>
        </div>
      </header>

      {data?.sample && (
        <p className="rounded-md border border-dashed border-primary/40 bg-primary/5 px-4 py-3 text-sm text-foreground">{t.sample}</p>
      )}

      <section aria-label="Resumen" className="grid grid-cols-3 gap-px overflow-hidden rounded-lg border border-border bg-border">
        {[[jobs.length, t.total], [newToday, t.newToday], [favs.size, t.favorites]].map(([n, l]) => (
          <div key={l} className="bg-card px-4 py-3">
            <div className="tabular font-display text-2xl font-bold">{n}</div>
            <div className="text-xs text-muted-foreground">{l}</div>
          </div>
        ))}
      </section>

      <section aria-label="Filtros" className="sticky top-0 z-10 -mx-4 flex flex-col gap-3 border-b border-border bg-background/95 px-4 py-3 backdrop-blur sm:-mx-6 sm:px-6"
        style={{ top: 'env(safe-area-inset-top, 0px)' }}>
        <div className="flex flex-wrap items-center gap-3">
          <Segmented label={t.role} value={f.type} onChange={set('type')} options={[
            { value: 'all', label: t.all, count: base.length },
            { value: 'freelance', label: t.freelance, count: base.filter((j) => j.type === 'freelance').length },
            { value: 'permanent', label: t.permanent, count: base.filter((j) => j.type === 'permanent').length },
          ]} />
          <div className="relative min-w-[12rem] flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input id="q" value={f.q} onChange={(e) => set('q')(e.target.value)} placeholder={t.search} className="pl-9" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Select id="role" label={t.role} value={f.role} onChange={set('role')} options={[
            { value: 'relevant', label: t.roleRelevant }, { value: 'design', label: t.roleDesign },
            { value: 'media', label: t.roleMedia }, { value: 'other', label: t.roleOther }, { value: 'all', label: t.roleAll },
          ]} />
          <Select id="region" label={t.region} value={f.region} onChange={set('region')} options={[
            { value: 'all', label: t.regionAll }, ...['dach', 'lu', 'europe', 'usa', 'worldwide', 'other'].map((r) => ({ value: r, label: t[r] })),
          ]} />
          <Select id="period" label={t.period} value={f.period} onChange={set('period')} options={[
            { value: 'all', label: t.periodAll }, { value: 'today', label: t.periodToday },
            { value: '7', label: t.period7 }, { value: '30', label: t.period30 },
          ]} />
          <Select id="source" label={t.source} value={f.source} onChange={set('source')} options={[
            { value: 'all', label: t.sourceAll }, ...sources.map((s) => ({ value: s, label: SOURCE_LABELS[s] || s })),
          ]} />
        </div>
        <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
          <label htmlFor="favOnly" className="inline-flex cursor-pointer items-center gap-2">
            <input id="favOnly" type="checkbox" checked={f.favOnly} onChange={(e) => set('favOnly')(e.target.checked)} className="h-4 w-4 accent-[hsl(var(--primary))]" />
            <Star className="h-4 w-4 text-star" /> {t.onlyFavorites}
          </label>
          <div className="flex items-center gap-3">
            <span className="tabular text-muted-foreground">{t.results(visible.length)}</span>
            {dirty && <Button variant="ghost" size="sm" onClick={() => setF(DEFAULTS)}><X className="h-3.5 w-3.5" />{t.reset}</Button>}
          </div>
        </div>
      </section>

      <main className="flex flex-col gap-8">
        {error && <p className="text-sm text-muted-foreground">{t.loadError}</p>}
        {!error && data && groups.length === 0 && (
          <div className="rounded-lg border border-dashed border-border px-6 py-12 text-center">
            <p className="font-medium">{t.empty}</p>
            <p className="mt-1 text-sm text-muted-foreground">{t.emptyHint}</p>
          </div>
        )}
        {groups.map(([day, list]) => (
          <section key={day} className="flex flex-col gap-3">
            <h2 className="flex items-baseline gap-3 border-b border-border pb-2">
              <span className="font-display text-lg font-bold capitalize">{fmtDay(day)}</span>
              <span className="tabular font-mono text-xs text-muted-foreground">{day} · {t.results(list.length)}</span>
            </h2>
            <ul className="flex flex-col divide-y divide-border overflow-hidden rounded-lg border border-border bg-card">
              {list.map((j) => <JobRow key={j.id} j={j} t={t} fav={favs.has(j.id)} onFav={() => toggleFav(j.id)} fmtDate={fmtDate} isNew={j.firstSeen === refDay} />)}
            </ul>
          </section>
        ))}
      </main>

      <footer className="mt-auto flex flex-col gap-2 border-t border-border pt-4 text-xs text-muted-foreground">
        {lastRun && (
          <p className="flex flex-wrap gap-x-3 gap-y-1">
            <span>{t.lastRun}: <span className="tabular">{new Date(lastRun.at).toLocaleString(LOCALE[lang])}</span></span>
            {Object.entries(lastRun.sources).map(([s, r]) => (
              <span key={s} className={cn(r.status === 'error' && 'text-red-600 dark:text-red-400')}>
                {SOURCE_LABELS[s] || s}: {r.status === 'ok' ? `${t.sourceOk} (+${r.added})` : r.status === 'error' ? t.sourceError : t.sourceSkipped}
              </span>
            ))}
          </p>
        )}
        <p>{t.attribution}</p>
      </footer>
    </div>
  );
}

function JobRow({ j, t, fav, onFav, fmtDate, isNew }) {
  return (
    <li className="flex gap-3 px-4 py-3.5 transition-colors hover:bg-accent/60 sm:px-5">
      <button type="button" onClick={onFav} aria-pressed={fav} aria-label={fav ? t.unfav : t.fav} title={fav ? t.unfav : t.fav}
        className="mt-0.5 h-8 w-8 shrink-0 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
        <Star className={cn('mx-auto h-5 w-5 transition-colors', fav ? 'fill-star text-star' : 'text-muted-foreground hover:text-star')} />
      </button>
      <div className="flex min-w-0 flex-1 flex-col gap-1.5">
        <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-1">
          <div className="min-w-0">
            <a href={j.url} target="_blank" rel="noreferrer" className="font-medium leading-snug hover:underline">{j.title}</a>
            <p className="text-sm text-muted-foreground">{j.company}{j.location ? ` · ${j.location}` : ''}</p>
          </div>
          {j.salary && <span className="tabular shrink-0 font-mono text-xs text-foreground">{j.salary}</span>}
        </div>
        <div className="flex flex-wrap items-center gap-1.5">
          <Badge variant={j.type}>{t[j.type]}</Badge>
          <Badge>{t[j.region] || j.region}</Badge>
          {j.remote !== null && <Badge>{j.remote ? t.remote : t.onsite}</Badge>}
          <Badge>{SOURCE_LABELS[j.source] || j.source}</Badge>
          {isNew && <Badge variant="new">{t.newBadge}</Badge>}
          {j.postedAt && <span className="tabular ml-1 text-xs text-muted-foreground">{t.posted} {fmtDate(j.postedAt)}</span>}
          <a href={j.url} target="_blank" rel="noreferrer" className="ml-auto inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline">
            {t.open} <ExternalLink className="h-3 w-3" />
          </a>
        </div>
      </div>
    </li>
  );
}
