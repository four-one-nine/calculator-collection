'use client';

import { useState } from 'react';
import { Card } from '@/components/Card';
import { Input } from '@/components/Input';
import { ResultDisplay } from '@/components/ResultDisplay';
import {
  sinDeg,
  cosDeg,
  tanDeg,
  asinDeg,
  acosDeg,
  atanDeg,
  rightTriangleSolve,
  angleFromSin,
  angleFromCos,
  angleFromTan,
  triangleAngle,
} from '@/lib/trig';

const fmt = (n: number | null, digits = 4) =>
  n === null ? null : n.toFixed(digits);

/** sin/cos/tan of a given angle (°). */
function TrigFnCard() {
  const [deg, setDeg] = useState('30');
  const v = parseFloat(deg);
  const s = sinDeg(v);
  const c = cosDeg(v);
  const t = tanDeg(v);

  return (
    <>
      <Input label="Angle" type="number" value={deg} onChange={(e) => setDeg(e.target.value)} placeholder="e.g. 30" min="0" step="0.1" />
      {s !== null && c !== null && t !== null && (
        <div className="flex gap-2 mt-3">
          <ResultDisplay label="sin" value={fmt(s) ?? ''} compact className="flex-1 min-w-0" />
          <ResultDisplay label="cos" value={fmt(c) ?? ''} compact className="flex-1 min-w-0" />
          <ResultDisplay label="tan" value={fmt(t) ?? ''} compact className="flex-1 min-w-0" />
        </div>
      )}
    </>
  );
}

/** Right-triangle side finder: pick which unknown, enter the others. */
function SideFinderCard() {
  const [unknown, setUnknown] = useState<'a' | 'b' | 'c'>('c');
  const [a, setA] = useState('3');
  const [b, setB] = useState('4');
  const [c, setC] = useState('');

  const nA = unknown === 'c' ? null : (parseFloat(a) || 0);
  const nB = unknown === 'c' ? null : (parseFloat(b) || 0);
  const nC = unknown === 'c' ? null : (parseFloat(c) || 0);

  const result = rightTriangleSolve(unknown, nA, nB, nC);

  return (
    <>
      <div className="flex bg-gray-700 rounded-lg p-0.5 mb-3">
        {(['a', 'b', 'c'] as const).map((k) => (
          <button
            key={k}
            type="button"
            onClick={() => setUnknown(k)}
            className={`flex-1 py-1.5 px-3 rounded-md text-sm font-medium transition-colors ${
              unknown === k ? 'bg-blue-500 text-white' : 'text-gray-300 hover:text-white'
            }`}
          >
            find {k}
          </button>
        ))}
      </div>
      {unknown === 'c' ? (
        <div className="flex gap-3">
          <Input className="flex-1" label="Leg A" type="number" value={a} onChange={(e) => setA(e.target.value)} placeholder="3" min="0" step="0.1" />
          <Input className="flex-1" label="Leg B" type="number" value={b} onChange={(e) => setB(e.target.value)} placeholder="4" min="0" step="0.1" />
        </div>
      ) : unknown === 'a' ? (
        <div className="flex gap-3">
          <Input className="flex-1" label="Leg B" type="number" value={b} onChange={(e) => setB(e.target.value)} placeholder="3" min="0" step="0.1" />
          <Input className="flex-1" label="Hypotenuse C" type="number" value={c} onChange={(e) => setC(e.target.value)} placeholder="5" min="0" step="0.1" />
        </div>
      ) : (
        <div className="flex gap-3">
          <Input className="flex-1" label="Leg A" type="number" value={a} onChange={(e) => setA(e.target.value)} placeholder="3" min="0" step="0.1" />
          <Input className="flex-1" label="Hypotenuse C" type="number" value={c} onChange={(e) => setC(e.target.value)} placeholder="5" min="0" step="0.1" />
        </div>
      )}
      {result !== null ? (
        <ResultDisplay
          label={`Unknown ${unknown.toUpperCase()}`}
          value={fmt(result, 3) ?? ''}
          unit="in"
        />
      ) : (
        <p className="mt-3 text-xs text-gray-400">
          {unknown === 'c' ? 'Enter two legs, A and B.' : 'The known leg must be shorter than C.'}
        </p>
      )}
    </>
  );
}

/**
 * Find the angle at a vertex when we know the opposite-side pair that
 * forms a right triangle:
 *   θ = asin(opposite / hyp)
 *   θ = acos(adjacent / hyp)
 *   θ = atan(opposite / adjacent)
 */
function RightAngleCard() {
  const [mode, setMode] = useState<'sin' | 'cos' | 'tan'>('sin');
  const [opp, setOpp] = useState('3');
  const [adj, setAdj] = useState('4');
  const [hyp, setHyp] = useState('5');

  const o = parseFloat(opp);
  const a = parseFloat(adj);
  const h = parseFloat(hyp);
  const nO = mode === 'cos' ? null : o || null;
  const nA = mode === 'sin' ? null : a || null;
  const nH = mode === 'tan' ? null : h || null;

  const angle =
    mode === 'sin' ? angleFromSin(nO ?? 0, nH ?? 0)
      : mode === 'cos' ? angleFromCos(nA ?? 0, nH ?? 0)
      : angleFromTan(nO ?? 0, nA ?? 0);

  const labels: Record<string, [string, string]> = {
    sin: ['Opposite', 'Hypotenuse'],
    cos: ['Adjacent', 'Hypotenuse'],
    tan: ['Opposite', 'Adjacent'],
  };

  return (
    <>
      <div className="flex bg-gray-700 rounded-lg p-0.5 mb-3">
        {(['sin', 'cos', 'tan'] as const).map((k) => (
          <button
            key={k}
            type="button"
            onClick={() => setMode(k)}
            className={`flex-1 py-1.5 px-3 rounded-md text-sm font-medium transition-colors ${
              mode === k ? 'bg-blue-500 text-white' : 'text-gray-300 hover:text-white'
            }`}
          >
            {k}
          </button>
        ))}
      </div>
      <div className="flex gap-3">
        <Input className="flex-1" label={labels[mode][0]} type="number"
          value={mode === 'cos' ? adj : opp}
          onChange={(e) => (mode === 'cos' ? setAdj : setOpp)(e.target.value)}
          placeholder="3" min="0" step="0.1" />
        <Input className="flex-1" label={labels[mode][1]} type="number"
          value={mode === 'tan' ? adj : hyp}
          onChange={(e) => (mode === 'tan' ? setAdj : setHyp)(e.target.value)}
          placeholder="5" min="0" step="0.1" />
      </div>
      {angle !== null ? (
        <ResultDisplay label="Angle θ" value={fmt(angle, 2) ?? ''} unit="°" />
      ) : (
        <p className="mt-3 text-xs text-gray-400">Enter two numbers in a valid right triangle.</p>
      )}
    </>
  );
}

/** General triangle — give A, B, C (sides) plus which vertex → law of cosines. */
function GeneralAngleCard() {
  const [a, setA] = useState('5');
  const [b, setB] = useState('6');
  const [c, setC] = useState('7');
  const [at, setAt] = useState<'A' | 'B' | 'C'>('A');
  const va = parseFloat(a);
  const vb = parseFloat(b);
  const vc = parseFloat(c);
  const ang =
    isFinite(va) && isFinite(vb) && isFinite(vc)
      ? triangleAngle(va, vb, vc, at)
      : null;
  const angB = isFinite(va) && isFinite(vb) && isFinite(vc) ? triangleAngle(va, vb, vc, 'B') : null;
  const angC = isFinite(va) && isFinite(vb) && isFinite(vc) ? triangleAngle(va, vb, vc, 'C') : null;

  return (
    <>
      <div className="flex gap-3">
        <Input className="flex-1" label="Side a" type="number" value={a} onChange={(e) => setA(e.target.value)} placeholder="5" min="0" step="0.1" />
        <Input className="flex-1" label="Side b" type="number" value={b} onChange={(e) => setB(e.target.value)} placeholder="6" min="0" step="0.1" />
        <Input className="flex-1" label="Side c" type="number" value={c} onChange={(e) => setC(e.target.value)} placeholder="7" min="0" step="0.1" />
      </div>
      <div className="flex bg-gray-700 rounded-lg p-0.5 mb-3">
        {(['A', 'B', 'C'] as const).map((v) => (
          <button
            key={v}
            type="button"
            onClick={() => setAt(v)}
            className={`flex-1 py-1.5 px-3 rounded-md text-sm font-medium transition-colors ${
              at === v ? 'bg-blue-500 text-white' : 'text-gray-300 hover:text-white'
            }`}
          >
            angle {v}
          </button>
        ))}
      </div>
      {ang !== null && angB !== null && angC !== null ? (
        <div className="flex gap-2">
          <div className="flex-1 min-w-0"><ResultDisplay label="∠A" value={fmt(ang, 2) ?? ''} unit="°" compact /></div>
          <div className="flex-1 min-w-0"><ResultDisplay label="∠B" value={fmt(angB, 2) ?? ''} unit="°" compact /></div>
          <div className="flex-1 min-w-0"><ResultDisplay label="∠C" value={fmt(angC, 2) ?? ''} unit="°" compact /></div>
        </div>
      ) : (
        <p className="mt-3 text-xs text-gray-400">Sides must form a valid non-degenerate triangle.</p>
      )}
    </>
  );
}

/** Inverse-trig quick lookup: enter x, get asin/acos/atan in degrees. */
function InverseCard() {
  const [x, setX] = useState('0.5');
  const v = parseFloat(x);
  const sa = asinDeg(v);
  const ca = acosDeg(v);
  const ta = atanDeg(v);

  return (
    <>
      <Input label="Input x" type="number" value={x} onChange={(e) => setX(e.target.value)} placeholder="0.5" min="0" step="0.01" />
      {ta !== null && (
        <div className="flex gap-2">
          <div className="flex-1 min-w-0"><ResultDisplay label="asin(x)" value={sa === null ? '—' : fmt(sa, 2) ?? ''} unit="°" compact /></div>
          <div className="flex-1 min-w-0"><ResultDisplay label="acos(x)" value={ca === null ? '—' : fmt(ca, 2) ?? ''} unit="°" compact /></div>
          <div className="flex-1 min-w-0"><ResultDisplay label="atan(x)" value={fmt(ta, 2) ?? ''} unit="°" compact /></div>
        </div>
      )}
    </>
  );
}

/**
 * Find the missing side of a right triangle given two sides.
 * Pick which one is unknown; enter the other two.
 */
function MissingSideCard() {
  const [missing, setMissing] = useState<'a' | 'b' | 'c'>('c');
  const [a, setA] = useState('3');
  const [b, setB] = useState('4');
  const [c, setC] = useState('');
  const nA = missing === 'c' ? null : (parseFloat(a) || 0);
  const nB = missing === 'c' ? null : (parseFloat(b) || 0);
  const nC = missing === 'c' ? (parseFloat(c) || 0) : null;
  const sol = rightTriangleSolve(missing, nA, nB, nC);

  const inputs = (() => {
    if (missing === 'c') return (
      <div className="flex gap-3">
        <Input className="flex-1" label="Leg A" type="number" value={a} onChange={(e) => setA(e.target.value)} placeholder="3" min="0" step="0.1" />
        <Input className="flex-1" label="Leg B" type="number" value={b} onChange={(e) => setB(e.target.value)} placeholder="4" min="0" step="0.1" />
      </div>
    );
    if (missing === 'a') return (
      <div className="flex gap-3">
        <Input className="flex-1" label="Leg B" type="number" value={b} onChange={(e) => setB(e.target.value)} placeholder="3" min="0" step="0.1" />
        <Input className="flex-1" label="Hyp C" type="number" value={c} onChange={(e) => setC(e.target.value)} placeholder="5" min="0" step="0.1" />
      </div>
    );
    return (
      <div className="flex gap-3">
        <Input className="flex-1" label="Leg A" type="number" value={a} onChange={(e) => setA(e.target.value)} placeholder="3" min="0" step="0.1" />
        <Input className="flex-1" label="Hyp C" type="number" value={c} onChange={(e) => setC(e.target.value)} placeholder="5" min="0" step="0.1" />
      </div>
    );
  })();

  return (
    <>
      <div className="flex bg-gray-700 rounded-lg p-0.5 mb-3">
        {(['a', 'b', 'c'] as const).map((k) => (
          <button
            key={k}
            type="button"
            onClick={() => setMissing(k)}
            className={`flex-1 py-1.5 px-3 rounded-md text-sm font-medium transition-colors ${
              missing === k ? 'bg-blue-500 text-white' : 'text-gray-300 hover:text-white'
            }`}
          >
            find {k}
          </button>
        ))}
      </div>
      {inputs}
      {sol !== null ? (
        <ResultDisplay label={`Missing side ${missing.toUpperCase()}`} value={fmt(sol, 3) ?? ''} unit="in" />
      ) : (
        <p className="mt-3 text-xs text-gray-400">Find {missing}: the "hyp must be the longest side" rule applies when two legs are being summed.</p>
      )}
    </>
  );
}

export default function TrigPage() {
  return (
    <div className="space-y-6">
      <Card title="Trig functions (sin / cos / tan)">
        <TrigFnCard />
      </Card>

      <Card title="Right triangle — find the missing side">
        <MissingSideCard />
      </Card>

      <Card title="Right triangle — find the angle">
        <RightAngleCard />
      </Card>

      <Card title="Inverse functions (asin / acos / atan)">
        <InverseCard />
      </Card>

      <Card title="General triangle — find angles (law of cosines)">
        <GeneralAngleCard />
      </Card>
    </div>
  );
}
