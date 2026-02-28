'use client';

import { Task, ThemeConfig } from '@/lib/types';
import { getStatusKey, getStatusValue, computeRemainingMs, formatMs } from '@/lib/helpers';

interface TaskTableProps {
  tasks: Task[];
  theme: ThemeConfig;
  showActions?: ('start' | 'pause' | 'resume' | 'reset' | 'delete' | 'complete' | 'fail')[];
  onAction: (taskId: string, action: string) => Promise<void>;
  loading?: boolean;
}

export default function TaskTable({ tasks, theme, showActions = [], onAction, loading }: TaskTableProps) {
  if (tasks.length === 0) {
    return (
      <div className="text-center py-8 text-sm opacity-60" style={{ color: theme.textSecondary }}>
        No tasks found.
      </div>
    );
  }

  const actionButtons: Record<string, { label: string; color: string }> = {
    start: { label: '▶ Start', color: theme.buttonSuccess },
    pause: { label: '⏸ Pause', color: theme.buttonWarning },
    resume: { label: '▶ Resume', color: theme.buttonSuccess },
    reset: { label: '↺ Reset', color: theme.accent },
    delete: { label: '🗑 Delete', color: theme.buttonDanger },
    complete: { label: '✓ Complete', color: theme.buttonSuccess },
    fail: { label: '✗ Fail', color: theme.buttonDanger },
  };

  return (
    <div className="space-y-2">
      {tasks.map(task => {
        const statusKey = getStatusKey(task.metadata.status_field);
        const statusLabel = getStatusValue(task.metadata.status_field);
        const remaining = computeRemainingMs(task);
        const time = formatMs(remaining);
        const availableActions = showActions.filter(a => {
          if (a === 'start') return statusKey === 'pending';
          if (a === 'pause') return statusKey === 'running';
          if (a === 'resume') return statusKey === 'paused';
          if (a === 'reset') return statusKey !== 'pending';
          if (a === 'delete') return true;
          if (a === 'complete') return statusKey === 'running';
          if (a === 'fail') return statusKey === 'running';
          return true;
        });

        const statusColors: Record<string, string> = {
          running: theme.buttonSuccess,
          pending: theme.textSecondary,
          paused: theme.buttonWarning,
          completed: theme.buttonSuccess,
          failed: theme.buttonDanger,
        };

        return (
          <div
            key={task.id}
            className="flex items-center gap-4 p-4 rounded-lg transition-colors duration-200"
            style={{ backgroundColor: theme.card, border: `1px solid ${theme.border}` }}
          >
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h4 className="font-semibold text-sm truncate" style={{ color: theme.text }}>
                  {task.metadata.title || task.title}
                </h4>
                <span
                  className="text-xs px-2 py-0.5 rounded-full font-medium"
                  style={{
                    backgroundColor: (statusColors[statusKey] || theme.accent) + '20',
                    color: statusColors[statusKey] || theme.accent,
                  }}
                >
                  {statusLabel}
                </span>
              </div>
              {task.metadata.description && (
                <p className="text-xs mt-1 truncate" style={{ color: theme.textSecondary }}>
                  {task.metadata.description}
                </p>
              )}
              <div className="flex items-center gap-4 mt-1 text-xs" style={{ color: theme.textSecondary }}>
                <span>⏱ {time.hours}:{time.minutes}:{time.seconds}</span>
                <span>🪙 +{task.metadata.reward_tokens} / -{task.metadata.penalty_tokens}</span>
              </div>
            </div>
            <div className="flex items-center gap-1 shrink-0">
              {availableActions.map(action => {
                const btn = actionButtons[action];
                if (!btn) return null;
                return (
                  <button
                    key={action}
                    onClick={() => onAction(task.id, action)}
                    disabled={loading}
                    className="text-xs px-3 py-1.5 rounded-md font-medium transition-opacity duration-200 disabled:opacity-50"
                    style={{ backgroundColor: btn.color, color: '#ffffff' }}
                  >
                    {btn.label}
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}