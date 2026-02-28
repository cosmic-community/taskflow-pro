'use client';

import { useState } from 'react';
import { ThemeConfig } from '@/lib/types';

interface TokenDisplayProps {
  tokens: number;
  theme: ThemeConfig;
  onAdd: (amount: number) => Promise<void>;
  onRemove: (amount: number) => Promise<void>;
  loading?: boolean;
}

export default function TokenDisplay({ tokens, theme, onAdd, onRemove, loading }: TokenDisplayProps) {
  const [addVal, setAddVal] = useState('');
  const [removeVal, setRemoveVal] = useState('');

  return (
    <div className="p-4 rounded-lg" style={{ backgroundColor: theme.card, border: `1px solid ${theme.border}` }}>
      <div className="text-center mb-4">
        <div className="text-4xl font-black" style={{ color: theme.accent }}>
          🪙 {tokens}
        </div>
        <div className="text-xs mt-1" style={{ color: theme.textSecondary }}>Global Tokens</div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="flex gap-1">
          <input
            type="number"
            placeholder="Amount"
            value={addVal}
            onChange={e => setAddVal(e.target.value)}
            min="1"
            className="flex-1 px-2 py-1.5 rounded-md text-sm outline-none min-w-0"
            style={{ backgroundColor: theme.bgSecondary, color: theme.text, border: `1px solid ${theme.border}` }}
          />
          <button
            onClick={async () => {
              const v = parseInt(addVal);
              if (v > 0) { await onAdd(v); setAddVal(''); }
            }}
            disabled={loading || !addVal}
            className="px-3 py-1.5 rounded-md text-xs font-semibold disabled:opacity-50 shrink-0"
            style={{ backgroundColor: theme.buttonSuccess, color: '#fff' }}
          >
            + Add
          </button>
        </div>
        <div className="flex gap-1">
          <input
            type="number"
            placeholder="Amount"
            value={removeVal}
            onChange={e => setRemoveVal(e.target.value)}
            min="1"
            className="flex-1 px-2 py-1.5 rounded-md text-sm outline-none min-w-0"
            style={{ backgroundColor: theme.bgSecondary, color: theme.text, border: `1px solid ${theme.border}` }}
          />
          <button
            onClick={async () => {
              const v = parseInt(removeVal);
              if (v > 0) { await onRemove(v); setRemoveVal(''); }
            }}
            disabled={loading || !removeVal}
            className="px-3 py-1.5 rounded-md text-xs font-semibold disabled:opacity-50 shrink-0"
            style={{ backgroundColor: theme.buttonDanger, color: '#fff' }}
          >
            - Remove
          </button>
        </div>
      </div>
    </div>
  );
}