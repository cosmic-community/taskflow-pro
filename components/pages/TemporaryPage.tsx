'use client';

import { Task, AppSettings, LogEntry, ThemeConfig } from '@/lib/types';
import { getStatusKey, getOriginKey } from '@/lib/helpers';
import TaskTable from '@/components/TaskTable';
import TaskForm from '@/components/TaskForm';
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

export default function TemporaryPage({ tasks, theme, refreshAll, loading }: PageProps) {
  const [actionLoading, setActionLoading] = useState(false);

  // Temporary page: show tasks with origin=temporary that are running or paused AND not removed_from_temporary
  const tempTasks = tasks.filter(t => {
    const origin = getOriginKey(t.metadata.origin);
    const status = getStatusKey(t.metadata.status_field);
    return origin === 'temporary' && !t.metadata.removed_from_temporary && (status === 'running' || status === 'paused' || status === 'pending');
  });

  const handleAction = async (taskId: string, action: string) => {
    setActionLoading(true);
    try {
      await fetch('/api/task-action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ taskId, action }),
      });
      await refreshAll();
    } catch (_e) { /* ignore */ }
    setActionLoading(false);
  };

  const handleCreateTask = async (data: {
    title: string; description: string; reward_tokens: number;
    penalty_tokens: number; timer_hours: number; timer_minutes: number; timer_seconds: number;
  }) => {
    setActionLoading(true);
    try {
      const durationMs = (data.timer_hours * 3600 + data.timer_minutes * 60 + data.timer_seconds) * 1000;
      await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: data.title,
          description: data.description,
          origin: 'Temporary',
          reward_tokens: data.reward_tokens,
          penalty_tokens: data.penalty_tokens,
          timer_duration: durationMs,
        }),
      });
      await refreshAll();
    } catch (_e) { /* ignore */ }
    setActionLoading(false);
  };

  const handleReset = async () => {
    setActionLoading(true);
    try {
      await fetch('/api/task-action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'temporary-reset' }),
      });
      await refreshAll();
    } catch (_e) { /* ignore */ }
    setActionLoading(false);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-black" style={{ color: theme.text }}>⏳ Temporary</h2>
        <PageResetButton theme={theme} label="Reset Temporary" onReset={handleReset} loading={actionLoading} />
      </div>

      <TaskForm theme={theme} origin="Temporary" onSubmit={handleCreateTask} loading={actionLoading} />

      <TaskTable
        tasks={tempTasks}
        theme={theme}
        showActions={['start', 'pause', 'resume', 'reset']}
        onAction={handleAction}
        loading={loading || actionLoading}
      />
    </div>
  );
}