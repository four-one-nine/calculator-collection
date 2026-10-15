// Slope calculations — helpers to convert between roof slope representations:
//   Rise over Run (e.g. 6 on 12)  ↔  Slope as a %  ↔  Slope as degrees
// and Pythagorean A² + B² = C² helpers.

/** Slope fraction: rise over run = 1 (i.e. the classic "rise on 12" style) */
export function slopeFromRise(rise: number, run: number): number | null {
  if (!isFinite(rise) || !isFinite(run) || run === 0) return null;
  return rise / run;
}

/** Classic "rise run over 12" representation, e.g. 6/12 for a 6-in-12 roof. */
export function toPer12(rise: number, run: number): string | null {
  const ratio = slopeFromRise(rise, run);
  if (ratio === null) return null;
  // Normalize to per-run = 12: (rise*12)/(run)
  const val = ratio * 12;
  return `${roundNice(val)} / 12`;
}

export function riseRunToPercent(rise: number, run: number): number | null {
  const r = slopeFromRise(rise, run);
  if (r === null) return null;
  return r * 100;
}

export function percentToRise(run = 12, percent: number): number | null {
  const p = percentToSlope(percent);
  if (p === null) return null;
  return p * run;
}

export function percentToSlope(percent: number): number | null {
  if (!isFinite(percent) || percent === 0) return null;
  return percent / 100;
}

export function percentToDegrees(percent: number): number | null {
  const s = percentToSlope(percent);
  if (s === null) return null;
  return (Math.atan(s) * 180) / Math.PI;
}

export function slopeToDeg(percent: number): number | null {
  return percentToDegrees(percent);
}

export function degToPercent(deg: number): number | null {
  if (!isFinite(deg)) return null;
  if (deg === 0) return 0;
  const s = Math.tan((deg * Math.PI) / 180);
  return s * 100;
}

export function degToRisePer12(deg: number): number | null {
  if (!isFinite(deg) || deg === 0) return null;
  const s = Math.tan((deg * Math.PI) / 180);
  return s * 12;
}

/** Round to a nice short decimal for display; avoid floating-point noise. */
function roundNice(x: number, dp = 3): number {
  const f = Math.pow(10, dp);
  return Math.round(x * f) / f;
}
