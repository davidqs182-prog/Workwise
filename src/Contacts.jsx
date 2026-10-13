import { useMemo, useState } from 'react';
import { Copy, ExternalLink, Search, UserRound } from 'lucide-react';
import { Badge } from './components/ui/badge';
import { Input } from './components/ui/input';
import { Segmented } from './components/ui/segmented';
import { CONTACTS, CONTACTS_UPDATED, CONTACT_STATUSES } from './data/contacts';
import { cn, store } from './lib/utils';

const KEY = 'planb.contactStatus';

export default function Contacts({ t, lang }) {
  const [q, setQ] = useState('');
  const [group, setGroup] = useState('all');
  const [status, setStatus] = useState(() => store.get(KEY, {}));

  const setOne = (id, v) => setStatus((p) => { const n = { ...p, [id]: v }; store.set(KEY, n); return n; });

  const list = useMemo(() => {
    const s = q.trim().toLowerCase();
    return CONTACTS.filter((c) => (group === 'all' || c.group === group)
      && (!s || `${c.name} ${c.region} ${c.what[lang]}`.toLowerCase().includes(s)));
  }, [q, group, lang]);

  const sent = CONTACTS.filter((c) => (status[c.id] || 'new') !== 'new').length;
  const groups = ['consulting', 'network', 'agency'].map((g) => [g, list.filter((c) => c.group === g)]).filter(([, l]) => l.length);

  return (
    <div className="flex flex-col gap-6">
      <section aria-label={t.contacts} className="grid grid-cols-3 gap-px overflow-hidden rounded-lg border border-border bg-border">
        {[[CONTACTS.length, t.cTotal], [sent, t.cSent], [CONTACTS.filter((c) => c.email).length, t.cEmails]].map(([n, l]) => (
          <div key={l} className="bg-card px-4 py-3">
            <div className="tabular font-display text-2xl font-bold">{n}</div>
            <div className="text-xs text-muted-foreground">{l}</div>
          </div>
        ))}
      </section>

      <p className="text-sm text-muted-foreground">{t.cIntro}</p>

      <div className="flex flex-wrap items-center gap-3">
        <Segmented label={t.contacts} value={group} onChange={setGroup} className="max-w-full overflow-x-auto" options={[
          { value: 'all', label: t.all, count: CONTACTS.length },
          { value: 'consulting', label: t.cConsulting, count: CONTACTS.filter((c) => c.group === 'consulting').length },
          { value: 'network', label: t.cNetworks, count: CONTACTS.filter((c) => c.group === 'network').length },
          { value: 'agency', label: t.cAgencies, count: CONTACTS.filter((c) => c.group === 'agency').length },
        ]} />
        <div className="relative min-w-[12rem] flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input id="cq" value={q} onChange={(e) => setQ(e.target.value)} placeholder={t.cSearch} className="pl-9" />
        </div>
      </div>

      {groups.length === 0 && (
        <div className="rounded-lg border border-dashed border-border px-6 py-12 text-center text-sm">{t.cEmpty}</div>
      )}

      {groups.map(([g, items]) => (
        <section key={g} className="flex flex-col gap-3">
          <h2 className="flex items-baseline gap-3 border-b border-border pb-2">
            <span className="font-display text-lg font-bold">{t.cGroup[g]}</span>
            <span className="text-xs text-muted-foreground">{t.cGroupHint[g]}</span>
          </h2>
          <ul className="grid gap-3 sm:grid-cols-2">
            {items.map((c) => <ContactCard key={c.id} c={c} t={t} lang={lang} value={status[c.id] || 'new'} onChange={(v) => setOne(c.id, v)} />)}
          </ul>
        </section>
      ))}

      <p className="text-xs text-muted-foreground">{t.cUpdated} {new Date(CONTACTS_UPDATED + 'T12:00:00').toLocaleDateString(lang === 'de' ? 'de-DE' : 'es-ES')} · {t.cStatusLocal}</p>
    </div>
  );
}

function ContactCard({ c, t, lang, value, onChange }) {
  const done = value === 'discarded';
  return (
    <li className={cn('flex flex-col gap-3 rounded-lg border border-border bg-card p-4', done && 'opacity-60')}>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="font-medium leading-snug">{c.name}</p>
          <p className="text-sm text-muted-foreground">{c.region}</p>
        </div>
        <label className="sr-only" htmlFor={`st-${c.id}`}>{t.cStatus}</label>
        <select id={`st-${c.id}`} value={value} onChange={(e) => onChange(e.target.value)}
          className="h-8 shrink-0 rounded-md border border-input bg-background px-2 text-xs font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
          {CONTACT_STATUSES.map((s) => <option key={s} value={s}>{t.cSt[s]}</option>)}
        </select>
      </div>

      <p className="text-sm">{c.what[lang]}</p>

      <dl className="grid grid-cols-[auto,1fr] gap-x-3 gap-y-1.5 text-sm">
        <dt className="text-muted-foreground">{t.cHow}</dt>
        <dd>{c.how[lang]}</dd>
        <dt className="text-muted-foreground">{t.cPerson}</dt>
        <dd>
          {c.person ? (
            <span className="inline-flex flex-wrap items-center gap-x-1.5">
              <UserRound className="h-3.5 w-3.5 shrink-0" /> {c.person.name}
              {c.person.role && <span className="text-muted-foreground">· {c.person.role[lang]}</span>}
            </span>
          ) : <span className="text-muted-foreground">{t.cPending}</span>}
        </dd>
        <dt className="text-muted-foreground">{t.cEmail}</dt>
        <dd className="min-w-0 break-all">
          {c.email ? (
            <span className="inline-flex items-center gap-2">
              <a className="font-medium text-primary hover:underline" href={`mailto:${c.email}`}>{c.email}</a>
              <button type="button" onClick={() => navigator.clipboard?.writeText(c.email)} title={t.cCopy} aria-label={t.cCopy}
                className="rounded p-0.5 text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                <Copy className="h-3.5 w-3.5" />
              </button>
            </span>
          ) : <span className="text-muted-foreground">{t.cNoEmail}</span>}
        </dd>
        {c.note && (<><dt className="text-muted-foreground">{t.cNote}</dt><dd>{c.note[lang]}</dd></>)}
      </dl>

      <div className="mt-auto flex flex-wrap items-center gap-1.5">
        <Badge variant={c.group === 'consulting' ? 'new' : c.group === 'network' ? 'freelance' : 'permanent'}>{t.cType[c.group]}</Badge>
        {c.url ? (
          <a href={c.url} target="_blank" rel="noreferrer" className="ml-auto inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline">
            {t.cWeb} <ExternalLink className="h-3 w-3" />
          </a>
        ) : <span className="ml-auto text-xs text-muted-foreground">{t.cVerify}</span>}
      </div>
    </li>
  );
}
