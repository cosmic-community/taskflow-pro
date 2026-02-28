'use client';

import { ThemeConfig } from '@/lib/types';
import { THEMES } from '@/lib/themes';

interface ThemeSelectorProps {
  theme: ThemeConfig;
  onSelect: (themeKey: string) => Promise<void>;
  loading?: boolean;
}

export default function ThemeSelector({ theme, onSelect, loading }: ThemeSelectorProps) {
  return (
    <div className="grid grid-cols-4 gap-2">
      {THEMES.map(t => {
        const isActive = t.key === theme.key;
        return (
          <button
            key={t.key}
            onClick={() => onSelect(t.key)}
            disabled={loading || isActive}
            className="p-3 rounded-lg text-xs font-medium transition-all duration-200 disabled:opacity-70 text-left"
            style={{
              backgroundColor: isActive ? theme.accent + '20' : theme.bgSecondary,
              border: isActive ? `2px solid ${theme.accent}` : `1px solid ${theme.border}`,
              color: theme.text,
            }}
          >
            <div className="flex items-center gap-1 mb-1">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: t.accent }} />
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: t.bg }} />
            </div>
            <span className="truncate block">{t.value}</span>
          </button>
        );
      })}
    </div>
  );
}