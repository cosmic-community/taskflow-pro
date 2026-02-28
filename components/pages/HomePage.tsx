'use client';

import { Task, AppSettings, LogEntry, ThemeConfig } from '@/lib/types';
import { getStatusKey } from '@/lib/helpers';
import CircularTimer from '@/components/CircularTimer';
import TokenDisplay from '@/components/TokenDisplay';
import ThemeSelector from '@/components/ThemeSelector';

interface PageProps {
  tasks: Task[];
  settings: AppSettings | null;
  logs: LogEntry[];
  theme: ThemeConfig;
  refreshAll: () => Promise<void>;
  refreshTasks: () => Promise<void>;
  refreshSettings: () => Promise<void>;
  refreshLogs: () => Promise<void>;
  loading: boolean;
}

export default function HomePage({ tasks, settings, theme, refreshAll, refreshSettings }: PageProps) {
  const runningTasks = tasks.filter(t => getStatusKey(t.metadata.status_field) === 'running');
  const primaryTask = runningTasks[0];
  const tokens = settings?.metadata?.global_tokens ?? 0;
  const settingsId = settings?.id || '';

  const apiCall = async (url: string, body: Record<string, unknown>) => {
    await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    await refreshAll();
  };

  const handleThemeChange = async (themeKey: string) => {
    await apiCall('/api/settings', { id: settingsId, action: 'changeTheme', themeKey });
  };

  const handleAddTokens = async (amount: number) => {
    await apiCall('/api/settings', { id: settingsId, action: 'addTokens', amount });
  };

  const handleRemoveTokens = async (amount: number) => {
    await apiCall('/api/settings', { id: settingsId, action: 'removeTokens', amount });
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-black" style={{ color: theme.text }}>⚡ Dashboard</h2>
        <p className="text-sm mt-1" style={{ color: theme.textSecondary }}>
          {runningTasks.length} running • {tasks.filter(t => getStatusKey(t.metadata.status_field) === 'pending').length} pending
        </p>
      </div>

      {/* Circular Timer */}
      <div className="flex justify-center">
        {primaryTask ? (
          <CircularTimer task={primaryTask} theme={theme} size={280} />
        ) : (
          <div className="flex items-center justify-center w-[280px] h-[280px] rounded-full" style={{ border: `4px solid ${theme.border}` }}>
            <span className="text-sm" style={{ color: theme.textSecondary }}>No running task</span>
          </div>
        )}
      </div>

      {/* Multiple running timers */}
      {runningTasks.length > 1 && (
        <div className="flex justify-center gap-6 flex-wrap">
          {runningTasks.slice(1).map(t => (
            <CircularTimer key={t.id} task={t} theme={theme} size={140} />
          ))}
        </div>
      )}

      {/* Token Management */}
      <TokenDisplay
        tokens={tokens}
        theme={theme}
        onAdd={handleAddTokens}
        onRemove={handleRemoveTokens}
      />

      {/* Theme Selector */}
      <div className="p-4 rounded-lg" style={{ backgroundColor: theme.card, border: `1px solid ${theme.border}` }}>
        <h3 className="text-sm font-bold mb-3" style={{ color: theme.accent }}>🎨 Themes</h3>
        <ThemeSelector theme={theme} onSelect={handleThemeChange} />
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-5 gap-3">
        {(['running', 'pending', 'paused', 'completed', 'failed'] as const).map(status => {
          const count = tasks.filter(t => getStatusKey(t.metadata.status_field) === status).length;
          const icons: Record<string, string> = { running: '▶', pending: '⏹', paused: '⏸', completed: '✅', failed: '❌' };
          return (
            <div key={status} className="p-3 rounded-lg text-center" style={{ backgroundColor: theme.card, border: `1px solid ${theme.border}` }}>
              <div className="text-2xl">{icons[status]}</div>
              <div className="text-xl font-bold mt-1" style={{ color: theme.accent }}>{count}</div>
              <div className="text-xs capitalize" style={{ color: theme.textSecondary }}>{status}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}