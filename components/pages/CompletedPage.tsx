'use client';

import { Task, AppSettings, LogEntry, ThemeConfig } from '@/lib/types';
import { getStatusKey } from '@/lib/helpers';
import TaskTable from '@/components/TaskTable';
import PageResetButton from '@/components/PageResetButton';
import { useState } from 'react';

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

export default function CompletedPage({ tasks, theme, refreshAll, loading }: PageProps) {
  const [actionLoading, setActionLoading] = useState(false);
  const completedTasks = tasks.filter(t => getStatusKey(t.metadata.status_field) === 'completed' && !t.metadata.removed_from_completed);

  const handleAction = async (taskId: string, action: string) => {
    setActionLoading(true);
    await fetch('/api/task-action', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ taskId, action }) });
    await refreshAll();
    setActionLoading(false);
  };

  const handleReset = async () => {
    setActionLoading(true);
    await fetch('/api/task-action', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'completed-reset' }) });
    await refreshAll();
    setActionLoading(false);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-black" style={{ color: theme.text }}>✅ Completed</h2>
        <PageResetButton theme={theme} label="Reset Completed" onReset={handleReset} loading={actionLoading} />
      </div>
      <TaskTable tasks={completedTasks} theme={theme} showActions={[]} onAction={handleAction} loading={loading || actionLoading} />
    </div>
  );
}