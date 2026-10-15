// Pythagorean theorem helpers — A² + B² = C²
// A and B are legs, C is the hypotenuse.

/**
 * Is (a, b, c) a valid right triangle? C (largest) satisfies a² + b² = c².
 */
export function isPythagorean(a: number, b: number, c: number): boolean {
  if (!isFinite(a) || !isFinite(b) || !isFinite(c)) return false;
  // Allow ordering: C must be the largest of the three for the identity.
  const t = [a, b, c].sort((x, y) => x - y);
  if (t[2] === 0) return false;
  return Math.abs(t[0] ** 2 + t[1] ** 2 - t[2] ** 2) < 1e-9;
}

export function hypotenuse(a: number, b: number): number | null {
  if (!isFinite(a) || !isFinite(b)) return null;
  if (a < 0 || b < 0) return null;
  return Math.sqrt(a * a + b * b);
}

/**
 * Find leg A given leg B and hypotenuse C.
 * Returns null when B >= C (no valid right triangle with C as hypotenuse).
 */
export function legFromBAndC(b: number, c: number): number | null {
  if (!isFinite(b) || !isFinite(c)) return null;
  if (c <= b) return null;
  return Math.sqrt(c * c - b * b);
}

/**
 * Pythagorean distance between two 2-D points.
 */
export function distance(x1: number, y1: number, x2: number, y2: number): number | null {
  if (![x1, y1, x2, y2].every((n) => isFinite(n))) return null;
  return Math.hypot(x2 - x1, y2 - y1);
}
