'use client';

import { ThemeConfig } from '@/lib/types';

type PageName = 'home' | 'library' | 'temporary' | 'paused' | 'completed' | 'failed' | 'logs';

interface SidebarProps {
  currentPage: PageName;
  onNavigate: (page: PageName) => void;
  theme: ThemeConfig;
  tokens: number;
}

const NAV_ITEMS: { page: PageName; label: string; icon: string }[] = [
  { page: 'home', label: 'Home', icon: '🏠' },
  { page: 'library', label: 'Library', icon: '📚' },
  { page: 'temporary', label: 'Temporary', icon: '⏳' },
  { page: 'paused', label: 'Paused', icon: '⏸️' },
  { page: 'completed', label: 'Completed', icon: '✅' },
  { page: 'failed', label: 'Failed', icon: '❌' },
  { page: 'logs', label: 'Logs', icon: '📜' },
];

export default function Sidebar({ currentPage, onNavigate, theme, tokens }: SidebarProps) {
  return (
    <aside
      className="w-64 h-full flex flex-col transition-colors duration-500 relative z-20 shrink-0"
      style={{ backgroundColor: theme.sidebar, borderRight: `1px solid ${theme.border}` }}
    >
      <div className="p-5 border-b" style={{ borderColor: theme.border }}>
        <h1 className="text-xl font-bold flex items-center gap-2" style={{ color: theme.accent }}>
          ⚡ TaskFlow Pro
        </h1>
        <div className="mt-3 px-3 py-2 rounded-lg text-sm font-semibold" style={{ backgroundColor: theme.bgSecondary, color: theme.accent }}>
          🪙 Tokens: {tokens}
        </div>
      </div>
      <nav className="flex-1 py-2">
        {NAV_ITEMS.map(item => {
          const isActive = currentPage === item.page;
          return (
            <button
              key={item.page}
              onClick={() => onNavigate(item.page)}
              className="w-full text-left px-5 py-3 flex items-center gap-3 text-sm font-medium transition-all duration-200"
              style={{
                color: isActive ? theme.accent : theme.sidebarText,
                backgroundColor: isActive ? theme.sidebarActive : 'transparent',
                borderRight: isActive ? `3px solid ${theme.accent}` : '3px solid transparent',
              }}
            >
              <span className="text-lg">{item.icon}</span>
              {item.label}
            </button>
          );
        })}
      </nav>
      <div className="p-4 text-xs opacity-50" style={{ color: theme.textSecondary }}>
        v1.0.0
      </div>
    </aside>
  );
}