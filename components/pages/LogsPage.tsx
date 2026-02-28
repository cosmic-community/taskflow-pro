'use client';

import { Task, AppSettings, LogEntry, ThemeConfig } from '@/lib/types';

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

export default function LogsPage({ logs, theme }: PageProps) {
  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <h2 className="text-2xl font-black" style={{ color: theme.text }}>📜 Activity Logs</h2>
      <p className="text-xs" style={{ color: theme.textSecondary }}>Showing latest 10 actions (Pakistan Time)</p>

      {logs.length === 0 ? (
        <div className="text-center py-8 text-sm opacity-60" style={{ color: theme.textSecondary }}>
          No logs yet.
        </div>
      ) : (
        <div className="space-y-2">
          {logs.map((log, i) => (
            <div
              key={log.id}
              className="flex items-center gap-4 p-4 rounded-lg transition-colors duration-200"
              style={{ backgroundColor: theme.card, border: `1px solid ${theme.border}` }}
            >
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0" style={{ backgroundColor: theme.accent + '20', color: theme.accent }}>
                {i + 1}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate" style={{ color: theme.text }}>
                  {log.metadata?.action || log.title}
                </p>
                <p className="text-xs mt-0.5" style={{ color: theme.textSecondary }}>
                  {log.metadata?.date_stamp} • {log.metadata?.timestamp}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}