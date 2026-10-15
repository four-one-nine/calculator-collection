'use client';

import { useState } from 'react';
import { Card } from '@/components/Card';
import { Input } from '@/components/Input';
import { ResultDisplay } from '@/components/ResultDisplay';
import {
  riseRunToPercent,
  percentToDegrees,
  degToPercent,
  percentToRise,
  degToRisePer12,
} from '@/lib/slope';

const fmt = (n: number | null, digits = 3) =>
  n === null ? null : n.toFixed(digits);

/** Convert the classic "rise over run" pair to all three slope representations. */
function RiseRunCard() {
  const [rise, setRise] = useState('6');
  const [run, setRun] = useState('12');
  const r = parseFloat(rise);
  const u = parseFloat(run);

  const pct = riseRunToPercent(r, u);
  const deg = pct === null ? null : percentToDegrees(pct);
  const per12 = u === 0 ? null : (r * 12) / u;

  return (
    <>
      <div className="flex gap-3">
        <Input className="flex-1" label="Rise (in)" type="number" value={rise} onChange={(e) => setRise(e.target.value)} placeholder="e.g. 6" min="0" step="0.1" />
        <Input className="flex-1" label="Run (in)" type="number" value={run} onChange={(e) => setRun(e.target.value)} placeholder="e.g. 12" min="0" step="0.1" />
      </div>
      {pct !== null && (
        <>
          <ResultDisplay label="Slope (rise / 12)" value={`${String(Math.round((per12 ?? 0) * 100) / 100)} / 12`} />
          <ResultDisplay label="Slope %" value={fmt(pct, 2) ?? ''} unit="%" />
          <ResultDisplay label="Slope angle" value={fmt(deg, 2) ?? ''} unit="°" />
        </>
      )}
    </>
  );
}

/** Convert a slope percent to rise-per-12 and angle. */
function PercentCard() {
  const [pct, setPct] = useState('50');
  const v = parseFloat(pct);
  const deg = percentToDegrees(v);
  const riseOn12 = percentToRise(12, v);

  return (
    <>
      <Input label="Slope %" type="number" value={pct} onChange={(e) => setPct(e.target.value)} placeholder="e.g. 50" min="0" step="0.1" />
      {deg !== null && (
        <>
          <ResultDisplay label="Slope (rise / 12)" value={`${String((riseOn12 ?? 0).toFixed(3))} / 12`} />
          <ResultDisplay label="Slope angle" value={fmt(deg, 2) ?? ''} unit="°" />
        </>
      )}
    </>
  );
}

/** Convert a slope angle to rise-per-12 and percent. */
function DegreesCard() {
  const [deg, setDeg] = useState('26.57');
  const v = parseFloat(deg);
  const pct = degToPercent(v);
  const riseOn12 = degToRisePer12(v);

  return (
    <>
      <Input label="Slope angle" type="number" value={deg} onChange={(e) => setDeg(e.target.value)} placeholder="e.g. 26.565" min="0" step="0.01" />
      {pct !== null && (
        <>
          <ResultDisplay label="Slope (rise / 12)" value={`${String((riseOn12 ?? 0).toFixed(3))} / 12`} />
          <ResultDisplay label="Slope %" value={fmt(pct, 2) ?? ''} unit="%" />
        </>
      )}
    </>
  );
}

/**
 * Find the hypotenuse C from two legs A and B.
 *   C = √(A² + B²)
 */
function HypoCard() {
  const [a, setA] = useState('6');
  const [b, setB] = useState('8');
  const nA = parseFloat(a);
  const nB = parseFloat(b);
  const ok = isFinite(nA) && isFinite(nB);
  const c = ok ? Math.hypot(nA, nB) : null;

  return (
    <>
      <div className="flex gap-3">
        <Input className="flex-1" label="Leg A" type="number" value={a} onChange={(e) => setA(e.target.value)} placeholder="6" min="0" step="0.1" />
        <Input className="flex-1" label="Leg B" type="number" value={b} onChange={(e) => setB(e.target.value)} placeholder="8" min="0" step="0.1" />
      </div>
      {c !== null && <ResultDisplay label="Hypotenuse C" value={fmt(c, 3) ?? ''} unit="in" />}
    </>
  );
}

/**
 * Find leg A given leg B and the hypotenuse C.
 *   A = √(C² − B²)
 */
function FindACard() {
  const [b, setB] = useState('8');
  const [c, setC] = useState('10');
  const nB = parseFloat(b);
  const nC = parseFloat(c);
  const ok = isFinite(nB) && isFinite(nC) && nC > nB;
  const a = ok ? Math.sqrt(nC * nC - nB * nB) : null;

  return (
    <>
      <div className="flex gap-3">
        <Input className="flex-1" label="Leg B" type="number" value={b} onChange={(e) => setB(e.target.value)} placeholder="8" min="0" step="0.1" />
        <Input className="flex-1" label="Hypotenuse C" type="number" value={c} onChange={(e) => setC(e.target.value)} placeholder="10" min="0" step="0.1" />
      </div>
      {a !== null ? (
        <ResultDisplay label="Leg A" value={fmt(a, 3) ?? ''} unit="in" />
      ) : (
        <p className="mt-3 text-xs text-gray-400">Enter two numbers with C &gt; B.</p>
      )}
    </>
  );
}

/**
 * Find leg B given leg A and the hypotenuse C.
 *   B = √(C² − A²)
 */
function FindBCard() {
  const [a, setA] = useState('6');
  const [c, setC] = useState('10');
  const nA = parseFloat(a);
  const nC = parseFloat(c);
  const ok = isFinite(nA) && isFinite(nC) && nC > nA;
  const b = ok ? Math.sqrt(nC * nC - nA * nA) : null;

  return (
    <>
      <div className="flex gap-3">
        <Input className="flex-1" label="Leg A" type="number" value={a} onChange={(e) => setA(e.target.value)} placeholder="6" min="0" step="0.1" />
        <Input className="flex-1" label="Hypotenuse C" type="number" value={c} onChange={(e) => setC(e.target.value)} placeholder="10" min="0" step="0.1" />
      </div>
      {b !== null ? (
        <ResultDisplay label="Leg B" value={fmt(b, 3) ?? ''} unit="in" />
      ) : (
        <p className="mt-3 text-xs text-gray-400">Enter two numbers with C &gt; A.</p>
      )}
    </>
  );
}

export default function SlopePage() {
  return (
    <div className="space-y-6">
      <Card title="Rise/Run → % & °">
        <RiseRunCard />
      </Card>

      <Card title="Slope % → rise per 12 & °">
        <PercentCard />
      </Card>

      <Card title="Slope ° → rise per 12 & %">
        <DegreesCard />
      </Card>

      <Card title="Pythagoras — find C">
        <HypoCard />
      </Card>

      <Card title="Pythagoras — find A">
        <FindACard />
      </Card>

      <Card title="Pythagoras — find B">
        <FindBCard />
      </Card>
    </div>
  );
}
