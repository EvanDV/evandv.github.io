// The point of sky directly overhead a place: RA = local sidereal time,
// Dec = latitude. Used for the coordinates in the top bar.

/** Local sidereal time in hours [0, 24). USNO low-precision GMST formula (~0.1 s). */
export function localSiderealHours(ms: number, longitudeDeg: number): number {
  const daysSinceJ2000 = ms / 86_400_000 - 10_957.5; // J2000.0 = 2000-01-01 12:00 UT
  const gmst = 18.697374558 + 24.06570982441908 * daysSinceJ2000;
  return (((gmst + longitudeDeg / 15) % 24) + 24) % 24;
}

const pad = (n: number) => String(n).padStart(2, '0');

/** "RA 04h 38m" */
export function formatRA(hours: number): string {
  const totalMin = Math.floor(hours * 60);
  return `RA ${pad(Math.floor(totalMin / 60) % 24)}h ${pad(totalMin % 60)}m`;
}

/** "DEC +45°30′" */
export function formatDec(deg: number): string {
  const sign = deg < 0 ? '−' : '+';
  const totalMin = Math.round(Math.abs(deg) * 60);
  return `DEC ${sign}${pad(Math.floor(totalMin / 60))}°${pad(totalMin % 60)}′`;
}

export function zenithLabel(lat: number, lon: number, ms = Date.now()): string {
  return `${formatRA(localSiderealHours(ms, lon))} · ${formatDec(lat)}`;
}
