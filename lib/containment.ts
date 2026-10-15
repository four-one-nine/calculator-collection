// Containment (spill) sizing for poured-concrete trenches and walls.
//
// Trench type: the containment is the inner ring of a trench that encircles
// the concrete pad. The inner dimensions (which double as the pad's outer
// dimensions) — e.g. 8 × 10 — and the trench is X wide and Y deep: an
// "8 × 10 trench that is 12 × 6" means a 12-in wide, 6-in deep trench.
// We size the wall (trench ring) and the usable containment volume.
//
// All lengths are in inches unless explicitly noted.
// Volumes: US gallons (1 gal = 231 in³) and cubic feet.

export const GalIn3 = 231;
export const InchesPerFt = 12;
export const Inches3PerCft = 1728;

/** Inner perimeter (in) of the containment (equals the pad outer dims). */
export function perimeterIn(innerL: number, innerW: number): number | null {
  if (!finiteAll(innerL, innerW) || innerL <= 0 || innerW <= 0) return null;
  return 2 * (innerL + innerW);
}

/**
 * Open-ring (water-holding) area (in²) of a rectangular ring channel
 * (the containment between the pad outer rectangle and the outer rectangle):
 *   ring area = (L + 2w)(W + 2w) − L·W
 * where w is the trench ring width (the pour width).
 * The user's "inner dimensions" for the trench (in the 12-inch × 6-inch sense
 * for an 8 × 10 pad) correspond to THIS channel's inner footprint — which
 * equals the pad outer dimensions (L, W).
 */
export function trenchRingArea(L: number, W: number, w: number): number | null {
  if (!finiteAll(L, W, w) || L <= 0 || W <= 0) return null;
  return (L + 2 * w) * (W + 2 * w) - L * W;
}

/** Total containment volume (in³) = open ring area × depth. */
export function trenchVolumeIn3(L: number, W: number, w: number, d: number): number | null {
  const a = trenchRingArea(L, W, w);
  if (a === null || !isFinite(d) || d <= 0) return null;
  return a * d;
}

/**
 * Trench width (in) needed to hold a liquid volume.
 * Solves the quadratic  4d·w² + 2d(L + W)·w − V = 0  for w.
 */
export function trenchWidthForVolume(
  L: number,
  W: number,
  d: number,
  vIn3: number,
): number | null {
  if (![L, W, d, vIn3].every((n) => isFinite(n))) return null;
  if (L <= 0 || W <= 0 || d <= 0 || vIn3 <= 0) return null;
  const a = 4 * d;
  const b = 2 * d * (L + W);
  const c = -vIn3;
  const disc = b * b - 4 * a * c;
  if (disc < 0) return null;
  const w = (-b + Math.sqrt(disc)) / (2 * a);
  if (!isFinite(w) || w < 0) return null;
  return w;
}

/**
 * Wall height (in) to contain a liquid volume over the pad area.
 * Volume = L · W · h  (L, W are the pad's outer dimensions, in inches).
 */
export function wallHeightForVolume(L: number, W: number, vIn3: number): number | null {
  if (![L, W, vIn3].every((n) => isFinite(n))) return null;
  if (L <= 0 || W <= 0 || vIn3 <= 0) return null;
  return vIn3 / (L * W);
}

/** Wall contained volume (in³) = L · W · h. */
export function wallVolumeIn3(L: number, W: number, h: number): number | null {
  if (![L, W, h].every((n) => isFinite(n)) || L <= 0 || W <= 0) return null;
  return L * W * h;
}

/** Trench contained volume in gallons. */
export function trenchVolumeGal(L: number, W: number, w: number, d: number): number | null {
  const v = trenchVolumeIn3(L, W, w, d);
  return v === null ? null : v / GalIn3;
}

/** Wall contained volume in gallons. */
export function wallVolumeGal(L: number, W: number, h: number): number | null {
  const v = wallVolumeIn3(L, W, h);
  return v === null ? null : v / GalIn3;
}

/** Wall height (in) for a liquid volume given in US gallons. */
export function wallHeightForGallons(L: number, W: number, gal: number): number | null {
  return wallHeightForVolume(L, W, gal * GalIn3);
}

/** Trench width (in) for a liquid volume given in US gallons. */
export function trenchWidthForGallons(L: number, W: number, d: number, gal: number): number | null {
  return trenchWidthForVolume(L, W, d, gal * GalIn3);
}

/**
 * Round a positive length UP to the containing whole inch (poured-concrete
 * sizing — never shrinks the result: 5.1 → 6 in, 5.0 → 5 in).
 */
export function roundUpInches(x: number): number {
  return Math.ceil(x - 1e-9);
}

/** Convert in³ → US gallons for display. */
export function toGal(in3: number): number {
  return in3 / GalIn3;
}

function finiteAll(...ns: number[]): boolean {
  return ns.every((n) => typeof n === 'number' && isFinite(n));
}