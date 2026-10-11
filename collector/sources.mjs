// Conectores de cada portal. Cada uno devuelve una lista de ofertas normalizadas.
import { makeJob, region, jobType, salary } from './normalize.mjs';

const UA = { 'User-Agent': 'PlanB-Jobs/0.1 (personal job aggregator)', Accept: 'application/json' };
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
async function getJson(url, opts = {}) {
  const res = await fetch(url, { ...opts, headers: { ...UA, ...(opts.headers || {}) }, signal: AbortSignal.timeout(30000) });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText} en ${url}`);
  return res.json();
}

const ROLE_QUERIES = ['product designer', 'ux designer', 'ui designer', 'media buyer', 'performance marketing'];

export const sources = {
  // Bundesagentur für Arbeit: API pública no oficial (clave compartida fija).
  bundesagentur: {
    label: 'Bundesagentur für Arbeit',
    needsKey: false,
    async fetch() {
      const base = 'https://rest.arbeitsagentur.de/jobboerse/jobsuche-service/pc/v4/jobs';
      const out = [];
      const queries = ['Product Designer', 'UX Designer', 'UI Designer', 'UX/UI Designer', 'Media Buyer', 'Performance Marketing'];
      for (const was of queries) {
        for (const angebotsart of [1, 2]) { // 1 = Arbeit (fijo), 2 = Selbstständigkeit (freelance)
          const url = `${base}?was=${encodeURIComponent(was)}&angebotsart=${angebotsart}&arbeitszeit=ho&veroeffentlichtseit=30&size=50&page=1`;
          const data = await getJson(url, { headers: { 'X-API-Key': 'jobboerse-jobsuche' } });
          for (const s of data.stellenangebote || []) {
            const loc = [s.arbeitsort?.ort, s.arbeitsort?.region, s.arbeitsort?.land || 'Deutschland'].filter(Boolean).join(', ');
            out.push(makeJob('bundesagentur', {
              title: s.titel || s.beruf, company: s.arbeitgeber, location: loc, region: region(loc),
              remote: true, type: angebotsart === 2 ? 'freelance' : 'permanent',
              postedAt: s.aktuelleVeroeffentlichungsdatum,
              url: s.externeUrl || `https://www.arbeitsagentur.de/jobsuche/jobdetail/${s.refnr}`,
            }));
          }
          await sleep(500);
        }
      }
      return out;
    },
  },

  arbeitnow: {
    label: 'Arbeitnow',
    needsKey: false,
    async fetch() {
      const out = [];
      for (let page = 1; page <= 5; page++) {
        const data = await getJson(`https://www.arbeitnow.com/api/job-board-api?page=${page}`);
        for (const j of data.data || []) {
          out.push(makeJob('arbeitnow', {
            title: j.title, company: j.company_name, location: j.location, region: region(j.location),
            remote: !!j.remote, type: jobType(j.job_types, j.title), postedAt: j.created_at, url: j.url,
          }));
        }
        if (!data.links?.next) break;
        await sleep(800);
      }
      return out;
    },
  },

  // Himalayas pide citar la fuente y enlazar a su web. El link apunta a Himalayas.
  himalayas: {
    label: 'Himalayas',
    needsKey: false,
    async fetch() {
      const out = [];
      for (const q of ROLE_QUERIES) {
        const data = await getJson(`https://himalayas.app/jobs/api/search?q=${encodeURIComponent(q)}&page=1`);
        for (const j of data.jobs || []) {
          const loc = (j.locationRestrictions || []).join(', ') || 'Worldwide';
          out.push(makeJob('himalayas', {
            title: j.title, company: j.companyName, location: loc, region: region(loc), remote: true,
            type: jobType(j.employmentType, j.title), postedAt: j.pubDate,
            salary: salary(j.minSalary, j.maxSalary, j.currency), url: j.applicationLink || j.guid,
          }));
        }
        await sleep(1500);
      }
      return out;
    },
  },

  // Remotive: máximo ~4 consultas al día y 2 por minuto. Ofertas con 24 h de retraso.
  remotive: {
    label: 'Remotive',
    needsKey: false,
    async fetch() {
      const out = [];
      const urls = [
        'https://remotive.com/api/remote-jobs?category=design',
        'https://remotive.com/api/remote-jobs?search=media%20buyer',
      ];
      for (const [i, url] of urls.entries()) {
        if (i) await sleep(35000);
        const data = await getJson(url);
        for (const j of data.jobs || []) {
          out.push(makeJob('remotive', {
            title: j.title, company: j.company_name, location: j.candidate_required_location,
            region: region(j.candidate_required_location), remote: true,
            type: jobType(j.job_type, j.title), postedAt: j.publication_date, salary: j.salary || null, url: j.url,
          }));
        }
      }
      return out;
    },
  },

  remoteok: {
    label: 'RemoteOK',
    needsKey: false,
    async fetch() {
      const data = await getJson('https://remoteok.com/api');
      return (Array.isArray(data) ? data : []).filter((j) => j && j.position).map((j) => makeJob('remoteok', {
        title: j.position, company: j.company, location: j.location || 'Worldwide', region: region(j.location),
        remote: true, type: jobType(j.tags, j.position), postedAt: j.date,
        salary: salary(j.salary_min, j.salary_max, 'USD'), url: j.url,
      }));
    },
  },

  // Jobicy: como mucho una consulta por hora; solo ofertas de los últimos 7 días.
  jobicy: {
    label: 'Jobicy',
    needsKey: false,
    async fetch() {
      const out = [];
      for (const qs of ['tag=designer', 'tag=ux', 'tag=media%20buyer', 'industry=marketing']) {
        const data = await getJson(`https://jobicy.com/api/v2/remote-jobs?count=100&${qs}`);
        for (const j of data.jobs || []) {
          out.push(makeJob('jobicy', {
            title: j.jobTitle, company: j.companyName, location: j.jobGeo, region: region(j.jobGeo), remote: true,
            type: jobType(j.jobType, j.jobTitle), postedAt: j.pubDate,
            salary: salary(j.salaryMin, j.salaryMax, j.salaryCurrency), url: j.url,
          }));
        }
        await sleep(1500);
      }
      return out;
    },
  },

  // Desactivado hasta que haya claves. Registro gratis en https://developer.adzuna.com/
  adzuna: {
    label: 'Adzuna',
    needsKey: true,
    async fetch(cfg) {
      const { appId, appKey } = cfg.adzuna || {};
      const out = [];
      const countryRegion = { de: 'dach', at: 'dach', nl: 'europe', fr: 'europe', gb: 'europe', us: 'usa' };
      for (const country of Object.keys(countryRegion)) {
        for (const what of ['product designer', 'ux designer', 'media buyer']) {
          const url = `https://api.adzuna.com/v1/api/jobs/${country}/search/1?app_id=${appId}&app_key=${appKey}&results_per_page=50&what=${encodeURIComponent(what)}&max_days_old=30`;
          const data = await getJson(url);
          for (const j of data.results || []) {
            out.push(makeJob('adzuna', {
              title: j.title, company: j.company?.display_name, location: j.location?.display_name,
              region: countryRegion[country], remote: /remote|home ?office/i.test(j.title + ' ' + (j.description || '')) || null,
              type: j.contract_type === 'contract' ? 'freelance' : jobType(j.title),
              postedAt: j.created, salary: salary(j.salary_min, j.salary_max, country === 'us' ? 'USD' : (country === 'gb' ? 'GBP' : 'EUR')),
              url: j.redirect_url,
            }));
          }
          await sleep(1200);
        }
      }
      return out;
    },
  },

  // Desactivado hasta que haya clave. Se pide en https://jooble.org/api/about
  jooble: {
    label: 'Jooble',
    needsKey: true,
    async fetch(cfg) {
      const key = cfg.jooble?.apiKey;
      const out = [];
      for (const location of ['Deutschland', 'Luxembourg', 'Remote']) {
        for (const keywords of ['product designer', 'ux designer', 'media buyer']) {
          const data = await getJson(`https://jooble.org/api/${key}`, {
            method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ keywords, location }),
          });
          for (const j of data.jobs || []) {
            out.push(makeJob('jooble', {
              title: j.title, company: j.company, location: j.location, region: region(j.location, location),
              remote: /remote|home ?office/i.test(j.title + ' ' + j.location) || null,
              type: jobType(j.type, j.title), postedAt: j.updated, salary: j.salary || null, url: j.link,
            }));
          }
          await sleep(1200);
        }
      }
      return out;
    },
  },
};
