'use client';

import { ThemeConfig } from '@/lib/types';

interface PageResetButtonProps {
  theme: ThemeConfig;
  label: string;
  onReset: () => Promise<void>;
  loading?: boolean;
}

export default function PageResetButton({ theme, label, onReset, loading }: PageResetButtonProps) {
  return (
    <button
      onClick={onReset}
      disabled={loading}
      className="px-4 py-2 rounded-md text-xs font-semibold disabled:opacity-50 transition-opacity"
      style={{ backgroundColor: theme.buttonDanger, color: '#fff' }}
    >
      {loading ? 'Resetting...' : label}
    </button>
  );
}