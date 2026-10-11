// Normaliza ofertas de cualquier fuente a un formato común y las clasifica.
import { createHash } from 'node:crypto';

const DESIGN = /(product|ux|ui|interaction|visual|digital|web|brand|service)[\s/-]*(design|designer)|ux\s*\/\s*ui|ui\s*\/\s*ux|produktdesign|ux[- ]?designer|ui[- ]?designer|diseñador|disenador|design lead|head of design|growth designer/i;
const MEDIA = /media[\s-]*buy|paid[\s-]*(social|search|media|ads)|performance[\s-]*(marketing|manager|marketer)|\bppc\b|\bsea\b|\bsem\b|ads?[\s-]*manager|media[\s-]*strateg|social[\s-]*ads|growth[\s-]*market|user acquisition/i;
const FREELANCE = /freelanc|contract|contractor|selbst(st)?ändig|selbststaendig|freiberuf|interim|auftrag|temporary|befristet.*projekt/i;

const DACH = /deutschland|germany|\bde\b|österreich|oesterreich|austria|schweiz|switzerland|suisse|berlin|hamburg|münchen|muenchen|munich|köln|koeln|cologne|frankfurt|düsseldorf|dusseldorf|stuttgart|leipzig|dresden|hannover|nürnberg|nuremberg|bremen|essen|dortmund|gelsenkirchen|bochum|bonn|wien|vienna|zürich|zurich|basel|genf|dach/i;
const LUX = /luxemb|luxemburg|\blu\b/i;
const EUROPE = /europe|europa|\beu\b|emea|cet|spain|españa|espana|france|frankreich|netherlands|niederlande|belgium|belgien|italy|italien|portugal|poland|polen|ireland|irland|united kingdom|\buk\b|england|london|sweden|denmark|norway|finland|czech|romania|greece|hungary|estonia|latvia|lithuania|croatia|slovenia|slovakia|bulgaria|madrid|barcelona|paris|amsterdam|lisbon|warsaw|dublin|prague/i;
const USA = /united states|\busa\b|\bus\b|u\.s\.|america|new york|san francisco|california|texas|seattle|boston|chicago|austin|canada|north america|noram/i;
const WORLD = /worldwide|anywhere|global|remote$|^remote|weltweit|international/i;

export function region(...parts) {
  const s = parts.flat().filter(Boolean).join(' | ');
  if (!s.trim()) return 'worldwide';
  if (LUX.test(s)) return 'lu';
  if (DACH.test(s)) return 'dach';
  if (EUROPE.test(s)) return 'europe';
  if (USA.test(s)) return 'usa';
  if (WORLD.test(s)) return 'worldwide';
  return 'other';
}

export function role(title = '') {
  if (DESIGN.test(title)) return 'design';
  if (MEDIA.test(title)) return 'media';
  return 'other';
}

export function jobType(...hints) {
  return FREELANCE.test(hints.flat().filter(Boolean).join(' ')) ? 'freelance' : 'permanent';
}

export function toIsoDate(v) {
  if (v === null || v === undefined || v === '') return null;
  let d;
  if (typeof v === 'number') d = new Date(v < 1e12 ? v * 1000 : v);
  else d = new Date(v);
  return isNaN(d) ? null : d.toISOString();
}

export function salary(min, max, currency = '', unit = '') {
  const f = (n) => (n ? Number(n).toLocaleString('de-DE') : null);
  const a = f(min), b = f(max);
  if (!a && !b) return null;
  const range = a && b && a !== b ? `${a}–${b}` : a || b;
  return `${range} ${currency || ''}${unit ? ' ' + unit : ''}`.trim();
}

const clean = (s) => String(s || '').replace(/\s+/g, ' ').trim();

export function makeJob(src, j) {
  const title = clean(j.title);
  const company = clean(j.company) || '—';
  const key = `${src}|${company.toLowerCase()}|${title.toLowerCase()}|${clean(j.location).toLowerCase()}`;
  return {
    id: createHash('sha1').update(key).digest('hex').slice(0, 16),
    source: src,
    title,
    company,
    location: clean(j.location),
    region: j.region || region(j.location),
    remote: j.remote ?? null,
    type: j.type || 'permanent',
    role: role(title),
    salary: j.salary || null,
    postedAt: toIsoDate(j.postedAt),
    url: j.url,
  };
}
