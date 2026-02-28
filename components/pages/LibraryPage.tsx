'use client';

import { Task, AppSettings, LogEntry, ThemeConfig } from '@/lib/types';
import { getStatusKey } from '@/lib/helpers';
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

export default function LibraryPage({ tasks, theme, refreshAll, loading }: PageProps) {
  const [actionLoading, setActionLoading] = useState(false);

  const groupedTasks: Record<string, Task[]> = { running: [], pending: [], paused: [], completed: [], failed: [] };
  tasks.forEach(t => {
    const key = getStatusKey(t.metadata.status_field);
    if (groupedTasks[key]) {
      groupedTasks[key]!.push(t);
    }
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
          origin: 'Library',
          reward_tokens: data.reward_tokens,
          penalty_tokens: data.penalty_tokens,
          timer_duration: durationMs,
        }),
      });
      await refreshAll();
    } catch (_e) { /* ignore */ }
    setActionLoading(false);
  };

  const handleLibraryReset = async () => {
    setActionLoading(true);
    try {
      await fetch('/api/task-action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'library-reset' }),
      });
      await refreshAll();
    } catch (_e) { /* ignore */ }
    setActionLoading(false);
  };

  const allActions: ('start' | 'pause' | 'resume' | 'reset' | 'delete')[] = ['start', 'pause', 'resume', 'reset', 'delete'];
  const sections: { key: string; label: string; icon: string }[] = [
    { key: 'running', label: 'Running Tasks', icon: '▶' },
    { key: 'pending', label: 'Pending Tasks', icon: '⏹' },
    { key: 'paused', label: 'Paused Tasks', icon: '⏸' },
    { key: 'completed', label: 'Completed Tasks', icon: '✅' },
    { key: 'failed', label: 'Failed Tasks', icon: '❌' },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-black" style={{ color: theme.text }}>📚 Library</h2>
        <PageResetButton theme={theme} label="Reset Library" onReset={handleLibraryReset} loading={actionLoading} />
      </div>

      <TaskForm theme={theme} origin="Library" onSubmit={handleCreateTask} loading={actionLoading} />

      {sections.map(section => {
        const sectionTasks = groupedTasks[section.key];
        if (!sectionTasks || sectionTasks.length === 0) return null;
        return (
          <div key={section.key}>
            <h3 className="text-sm font-bold mb-2 flex items-center gap-2" style={{ color: theme.accent }}>
              {section.icon} {section.label} ({sectionTasks.length})
            </h3>
            <TaskTable tasks={sectionTasks} theme={theme} showActions={allActions} onAction={handleAction} loading={loading || actionLoading} />
          </div>
        );
      })}
    </div>
  );
}