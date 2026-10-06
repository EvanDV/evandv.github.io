// Shared by Radio.astro's build-time render and its browser script.
import type { Episode } from '../data/radio';

const TZ = 'America/Montreal';

/** Minutes Montréal is ahead of UTC at instant `ts` (negative, e.g. -240 in EDT). */
function tzOffset(ts: number): number {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: TZ,
    hourCycle: 'h23',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).formatToParts(ts);
  const get = (t: string) => Number(parts.find((p) => p.type === t)?.value);
  const asUtc = Date.UTC(get('year'), get('month') - 1, get('day'), get('hour'), get('minute'));
  return Math.round((asUtc - ts) / 60_000);
}

/** Montréal wall-clock date + time -> epoch ms. */
function montreal(date: string, time: string): number {
  const naive = Date.parse(`${date}T${time}:00Z`);
  return naive - tzOffset(naive) * 60_000;
}

export function airTimes(ep: Episode): { start: number; end: number } {
  const start = montreal(ep.date, ep.start);
  let end = montreal(ep.date, ep.end);
  if (end <= start) end += 24 * 3_600_000; // runs past midnight
  return { start, end };
}

/** CKUT archive file, e.g. archives.ckut.ca/128/20260911.15.00.00-17.00.00.mp3 */
export function archiveUrl(ep: Episode): string {
  if (ep.archive) return ep.archive;
  const t = (hm: string) => `${hm.replace(':', '.')}.00`;
  return `https://archives.ckut.ca/128/${ep.date.replaceAll('-', '')}.${t(ep.start)}-${t(ep.end)}.mp3`;
}

export interface RadioState {
  previous?: Episode;
  next?: Episode;
  onAir: boolean;
}

export function radioState(episodes: Episode[], now = Date.now()): RadioState {
  const sorted = [...episodes].sort((a, b) => airTimes(a).start - airTimes(b).start);
  const previous = sorted.filter((e) => airTimes(e).end <= now).at(-1);
  const next = sorted.find((e) => airTimes(e).end > now);
  const onAir = next ? airTimes(next).start <= now : false;
  return { previous, next, onAir };
}

const dayFmt = new Intl.DateTimeFormat('en-CA', {
  timeZone: 'UTC', // the date string is already Montréal-local
  weekday: 'short',
  month: 'short',
  day: 'numeric',
});

/** "Wed, Oct 21" */
export function formatDay(ep: Episode): string {
  return dayFmt.format(Date.parse(`${ep.date}T12:00:00Z`));
}

/** "8–10 pm ET", "11 am–1 pm ET" */
export function formatTimes(ep: Episode): string {
  const parse = (hm: string) => {
    const [h, m] = hm.split(':').map(Number);
    return { label: `${h % 12 || 12}${m ? `:${String(m).padStart(2, '0')}` : ''}`, pm: h >= 12 };
  };
  const s = parse(ep.start);
  const e = parse(ep.end);
  const suffix = (pm: boolean) => (pm ? 'pm' : 'am');
  const start = s.pm === e.pm ? s.label : `${s.label} ${suffix(s.pm)}`;
  return `${start}–${e.label} ${suffix(e.pm)} ET`;
}
