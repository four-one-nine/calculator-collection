// Triangle trig: basic sine/cosine/tangent plus inverse trig for angles,
// and the Law of Cosines helper for finding unknown sides and angles.

export const DEG = (rad: number): number => (rad * 180) / Math.PI;
export const RAD = (deg: number): number => (deg * Math.PI) / 180;

/** sin, cos, tan of an angle. Angle may be in deg or rad. */
export function sinDeg(deg: number): number | null {
  if (!isFinite(deg)) return null;
  return Math.sin(RAD(deg));
}
export function cosDeg(deg: number): number | null {
  if (!isFinite(deg)) return null;
  return Math.cos(RAD(deg));
}
export function tanDeg(deg: number): number | null {
  if (!isFinite(deg)) return null;
  const v = Math.tan(RAD(deg));
  return Math.abs(v) > 1e10 ? null : v;
}

/**
 * Inverse trig for angles in degrees, given a triangle's hypotenuse/c/adjacent ratio.
 * Returns null for invalid domains (e.g. |ratio|>1 for asin).
 */
export function asinDeg(x: number): number | null {
  if (!isFinite(x) || Math.abs(x) > 1) return null;
  return DEG(Math.asin(x));
}
export function acosDeg(x: number): number | null {
  if (!isFinite(x) || Math.abs(x) > 1) return null;
  return DEG(Math.acos(x));
}
export function atanDeg(x: number): number | null {
  if (!isFinite(x)) return null;
  return DEG(Math.atan(x));
}

/**
 * Find the third side of a right triangle:
 *   - hypotenuse c: sqrt(a² + b²)
 *   - leg a: sqrt(c² - b²)
 *   - leg b: sqrt(c² - a²)
 * Returns null when inputs would produce a non-real number (e.g. c² - leg² < 0).
 */
export function rightTriangleSolve(
  which: 'a' | 'b' | 'c',
  a: number | null,
  b: number | null,
  c: number | null,
): number | null {
  if (which === 'c') {
    if (!isFiniteAsOr(a) || !isFiniteAsOr(b)) return null;
    return Math.sqrt((a! ** 2) + (b! ** 2));
  }
  if (which === 'a') {
    if (!isFiniteAsOr(c) || !isFiniteAsOr(b)) return null;
    const v = c! ** 2 - b! ** 2;
    return v < 0 ? null : Math.sqrt(v);
  }
  // which === 'b'
  if (!isFiniteAsOr(c) || !isFiniteAsOr(a)) return null;
  const v = c! ** 2 - a! ** 2;
  return v < 0 ? null : Math.sqrt(v);
}

/**
 * Angle θ opposite a leg x in a right-triangle with the leg and the hypotenuse
 * as input: asin(x / c).
 */
export function angleFromSin(x: number, c: number): number | null {
  if (!isFiniteAsOr(x) || !isFiniteAsOr(c)) return null;
  const r = x / c;
  if (Math.abs(r) > 1) return null;
  return asinDeg(r);
}
export function angleFromCos(adj: number, hyp: number): number | null {
  if (!isFiniteAsOr(adj) || !isFiniteAsOr(hyp)) return null;
  const r = adj / hyp;
  if (Math.abs(r) > 1) return null;
  return acosDeg(r);
}
export function angleFromTan(op: number, adj: number): number | null {
  if (!isFiniteAsOr(op) || !isFiniteAsOr(adj)) return null;
  if (adj === 0) return null;
  return atanDeg(op / adj);
}

/**
 * Law of Cosines: find the angle at a vertex of a general triangle.
 * Sides must be positive and a, b, c must be a valid triangle.
 */
export function triangleAngle(
  a: number,
  b: number,
  c: number,
  vertex: 'A' | 'B' | 'C',
): number | null {
  const sides = { a, b, c };
  if (Object.values(sides).some((s) => !isFinite(s) || s <= 0)) return null;
  // Check triangle inequality.
  const vals = [a, b, c].sort((x, y) => x - y);
  if (vals[0] + vals[1] <= vals[2]) return null;

  // Side opposite 'A' is a; angle A is at the vertex between sides b and c.
  // cos(A) = (b² + c² - a²) / (2 b c); same for the other two.
  const cosA = (sides.b ** 2 + sides.c ** 2 - sides.a ** 2) / (2 * sides.b * sides.c);
  if (Math.abs(cosA) > 1) return null;
  const angA = DEG(Math.acos(cosA));

  const cosB = (sides.a ** 2 + sides.c ** 2 - sides.b ** 2) / (2 * sides.a * sides.c);
  if (Math.abs(cosB) > 1) return null;
  const angB = DEG(Math.acos(cosB));

  const angC = 180 - angA - angB;
  if (angC < -1e-9) return null;

  return vertex === 'A' ? angA : vertex === 'B' ? angB : angC;
}

function isFiniteAsOr(n: number | null): n is number {
  return typeof n === 'number' && isFinite(n);
}
