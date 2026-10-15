'use client';

import { useState } from 'react';
import { Card } from '@/components/Card';
import { Input } from '@/components/Input';
import { Select } from '@/components/Input';
import { ResultDisplay } from '@/components/ResultDisplay';
import {
  roundUpInches,
  trenchVolumeGal,
  trenchVolumeIn3,
  trenchWidthForGallons,
  wallHeightForGallons,
  wallVolumeGal,
} from '@/lib/containment';

// ---- Trench: find the width, given inner L/W, depth, and volume in gallons ----
function TrenchWidthCard() {
  const [L, setL] = useState('96');      // inner long (in)
  const [W, setW] = useState('120');     // inner wide (in)
  const [d, setD] = useState('6');       // depth (in)
  const [gal, setGal] = useState('5');   // volume (gal)

  const nL = parseFloat(L);
  const nW = parseFloat(W);
  const nd = parseFloat(d);
  const ngal = parseFloat(gal);

  const wIn =
    isFinite(nL) && isFinite(nW) && isFinite(nd) && isFinite(ngal)
      ? trenchWidthForGallons(nL, nW, nd, ngal)
      : null;
  const wWhole = wIn === null ? null : roundUpInches(wIn);

  return (
    <>
      <div className="flex gap-3">
        <Input className="flex-1" label="Inner L (in)" type="number" value={L} onChange={(e) => setL(e.target.value)} placeholder="96" min="0" step="1" />
        <Input className="flex-1" label="Inner W (in)" type="number" value={W} onChange={(e) => setW(e.target.value)} placeholder="120" min="0" step="1" />
      </div>
      <div className="flex gap-3">
        <Input className="flex-1" label="Depth (in)" type="number" value={d} onChange={(e) => setD(e.target.value)} placeholder="6" min="0" step="1" />
        <Input className="flex-1" label="Volume (gal)" type="number" value={gal} onChange={(e) => setGal(e.target.value)} placeholder="5" min="0" step="0.1" />
      </div>
      {wWhole !== null && wIn !== null && wWhole > 0 && (
        <>
          <ResultDisplay label="Channel width (raw)" value={wIn.toFixed(3)} unit="in" />
          <ResultDisplay label="Channel width (poured)" value={String(wWhole)} unit="in" />
        </>
      )}
    </>
  );
}

// ---- Trench: find the contained volume (gal), given L, W, width, depth ----
function TrenchVolumeCard() {
  const [L, setL] = useState('96');
  const [W, setW] = useState('120');
  const [w, setW2] = useState('12');
  const [d, setD] = useState('6');

  const nL = parseFloat(L);
  const nW = parseFloat(W);
  const nw = parseFloat(w);
  const nd = parseFloat(d);

  const vIn3 =
    isFinite(nL) && isFinite(nW) && isFinite(nw) && isFinite(nd)
      ? trenchVolumeIn3(nL, nW, nw, nd)
      : null;
  const vGal = vIn3 === null ? null : vIn3 / 231;

  return (
    <>
      <div className="flex gap-3">
        <Input className="flex-1" label="Inner L (in)" type="number" value={L} onChange={(e) => setL(e.target.value)} placeholder="96" min="0" step="1" />
        <Input className="flex-1" label="Inner W (in)" type="number" value={W} onChange={(e) => setW(e.target.value)} placeholder="120" min="0" step="1" />
      </div>
      <div className="flex gap-3">
        <Input className="flex-1" label="Width (in)" type="number" value={w} onChange={(e) => setW2(e.target.value)} placeholder="12" min="0" step="1" />
        <Input className="flex-1" label="Depth (in)" type="number" value={d} onChange={(e) => setD(e.target.value)} placeholder="6" min="0" step="1" />
      </div>
      {vGal !== null && (
        <>
          <ResultDisplay label="Contained volume" value={vGal.toFixed(0)} unit="gal" />
          <p className="mt-2 text-xs text-gray-400">{vIn3!.toFixed(0)} in³ ≈ {(vGal * 4).toFixed(1)} gal</p>
        </>
      )}
    </>
  );
}

// ---- Wall: find the height given L, W (outer dims), volume in gallons ----
function WallHeightCard() {
  const [L, setL] = useState('96');
  const [W, setW] = useState('120');
  const [gal, setGal] = useState('5');

  const nL = parseFloat(L);
  const nW = parseFloat(W);
  const ngal = parseFloat(gal);

  const hIn =
    isFinite(nL) && isFinite(nW) && isFinite(ngal)
      ? wallHeightForGallons(nL, nW, ngal)
      : null;
  const hWhole = hIn === null ? null : roundUpInches(hIn);

  return (
    <>
      <div className="flex gap-3">
        <Input className="flex-1" label="Pad L (in)" type="number" value={L} onChange={(e) => setL(e.target.value)} placeholder="96" min="0" step="1" />
        <Input className="flex-1" label="Pad W (in)" type="number" value={W} onChange={(e) => setW(e.target.value)} placeholder="120" min="0" step="1" />
      </div>
      <Input label="Volume (gal)" type="number" value={gal} onChange={(e) => setGal(e.target.value)} placeholder="5" min="0" step="0.1" />
      {hWhole !== null && hIn !== null && hWhole > 0 && (
        <>
          <ResultDisplay label="Wall height (raw)" value={hIn.toFixed(3)} unit="in" />
          <ResultDisplay label="Wall height (poured)" value={String(hWhole)} unit="in" />
        </>
      )}
    </>
  );
}

// ---- Wall: find the contained volume (gal), given L, W, height ----
function WallVolumeCard() {
  const [L, setL] = useState('96');
  const [W, setW] = useState('120');
  const [h, setH] = useState('12');

  const nL = parseFloat(L);
  const nW = parseFloat(W);
  const nh = parseFloat(h);

  const vGal =
    isFinite(nL) && isFinite(nW) && isFinite(nh)
      ? wallVolumeGal(nL, nW, nh)
      : null;

  return (
    <>
      <div className="flex gap-3">
        <Input className="flex-1" label="Pad L (in)" type="number" value={L} onChange={(e) => setL(e.target.value)} placeholder="96" min="0" step="1" />
        <Input className="flex-1" label="Pad W (in)" type="number" value={W} onChange={(e) => setW(e.target.value)} placeholder="120" min="0" step="1" />
      </div>
      <Input label="Wall height (in)" type="number" value={h} onChange={(e) => setH(e.target.value)} placeholder="12" min="0" step="1" />
      {vGal !== null && vGal > 0 && (
        <ResultDisplay label="Contained volume" value={vGal.toFixed(0)} unit="gal" />
      )}
    </>
  );
}

export default function ContainmentPage() {
  return (
    <div className="space-y-6">
      <Card title="Trench — width needed to contain a volume">
        <TrenchWidthCard />
      </Card>

      <Card title="Trench — contained volume, given width & depth">
        <TrenchVolumeCard />
      </Card>

      <Card title="Wall — height needed to contain a volume">
        <WallHeightCard />
      </Card>

      <Card title="Wall — contained volume, given height">
        <WallVolumeCard />
      </Card>
    </div>
  );
}
