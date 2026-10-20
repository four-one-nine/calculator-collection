'use client';

import { useState } from 'react';
import { CheckIcon, ClipboardIcon } from '@heroicons/react/24/outline';

interface ResultDisplayProps {
  label: string;
  value: string | number;
  unit?: string;
  className?: string;
  /** Compact mode: denser value (smaller text/padding, no copy icon) so several can sit beside each other on narrow screens. */
  compact?: boolean;
}

export function ResultDisplay({ label, value, unit, className = '', compact = false }: ResultDisplayProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const textToCopy = typeof value === 'number' ? value.toString() : value;
    await navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const pad = compact ? 'px-2 py-1.5' : 'p-3';
  const mt = compact ? 'mt-0' : 'mt-3';

  return (
    <div className={`bg-gray-700 rounded-lg ${pad} ${mt} ${className} overflow-hidden`}>
      <div className={`flex items-center justify-between ${compact ? 'gap-1.5' : ''}`}>
        <span className={`text-gray-300 ${compact ? 'text-xs truncate' : 'text-sm'}`}>{label}</span>
        {!compact && (
          <button
            onClick={handleCopy}
            className="p-1 hover:bg-gray-600 rounded transition-colors shrink-0"
            title="Copy to clipboard"
          >
            {copied ? (
              <CheckIcon className="w-5 h-5 text-green-400" />
            ) : (
              <ClipboardIcon className="w-5 h-5 text-gray-400" />
            )}
          </button>
        )}
      </div>
      <div className={`font-bold text-white mt-1 truncate ${compact ? 'text-base' : 'text-2xl'}`}>
        {value}
        {unit && <span className={`text-gray-400 ml-1 ${compact ? 'text-xs' : 'text-lg'}`}>{unit}</span>}
      </div>
    </div>
  );
}
