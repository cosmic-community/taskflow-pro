import { NextResponse } from 'next/server';
import { getAllTasks, updateTask, deleteTask, getAppSettings, updateSettings, createLog } from '@/lib/cosmic';

export const dynamic = 'force-dynamic';

function getStatusKey(status: { key: string; value: string } | string | undefined): string {
  if (!status) return 'pending';
  if (typeof status === 'string') return status.toLowerCase();
  return status.key || 'pending';
}

function getOriginKey(origin: { key: string; value: string } | string | undefined): string {
  if (!origin) return 'library';
  if (typeof origin === 'string') return origin.toLowerCase();
  return origin.key || 'library';
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { taskId, action } = body;

    // Bulk resets (no taskId needed)
    if (action === 'library-reset') {
      const tasks = await getAllTasks();
      for (const task of tasks) {
        const status = getStatusKey(task.metadata.status_field);
        if (status === 'completed' || status === 'failed') {
          await updateTask(task.id, {
            status_field: 'Pending',
            timer_remaining: task.metadata.timer_duration,
            timer_started_at: 0,
            timer_data: JSON.stringify({ elapsed_ms: 0, is_running: false, last_snapshot_at: 0 }),
          });
        }
      }
      await createLog('Library reset — Completed & Failed tasks moved to Pending');
      return NextResponse.json({ success: true });
    }

    if (action === 'temporary-reset') {
      const tasks = await getAllTasks();
      for (const task of tasks) {
        if (getOriginKey(task.metadata.origin) === 'temporary') {
          await updateTask(task.id, { removed_from_temporary: true });
        }
      }
      await createLog('Temporary page reset — all temporary tasks removed from view');
      return NextResponse.json({ success: true });
    }

    if (action === 'paused-reset') {
      const tasks = await getAllTasks();
      for (const task of tasks) {
        if (getStatusKey(task.metadata.status_field) === 'paused') {
          await updateTask(task.id, { removed_from_paused: true });
        }
      }
      await createLog('Paused page reset');
      return NextResponse.json({ success: true });
    }

    if (action === 'completed-reset') {
      const tasks = await getAllTasks();
      for (const task of tasks) {
        if (getStatusKey(task.metadata.status_field) === 'completed') {
          await updateTask(task.id, { removed_from_completed: true });
        }
      }
      await createLog('Completed page reset');
      return NextResponse.json({ success: true });
    }

    if (action === 'failed-reset') {
      const tasks = await getAllTasks();
      for (const task of tasks) {
        if (getStatusKey(task.metadata.status_field) === 'failed') {
          await updateTask(task.id, { removed_from_failed: true });
        }
      }
      await createLog('Failed page reset');
      return NextResponse.json({ success: true });
    }

    // Single-task actions
    if (!taskId) {
      return NextResponse.json({ error: 'Task ID required' }, { status: 400 });
    }

    const tasks = await getAllTasks();
    const task = tasks.find(t => t.id === taskId);
    if (!task) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }

    const taskTitle = task.metadata.title || task.title;

    if (action === 'start') {
      const now = Date.now();
      await updateTask(taskId, {
        status_field: 'Running',
        timer_started_at: now,
        timer_data: JSON.stringify({ elapsed_ms: 0, is_running: true, last_snapshot_at: now }),
      });
      await createLog(`Task '${taskTitle}' started`);
    }

    if (action === 'pause') {
      let timerData = task.metadata.timer_data;
      if (typeof timerData === 'string') {
        try { timerData = JSON.parse(timerData); } catch { timerData = { elapsed_ms: 0, is_running: false, last_snapshot_at: 0 }; }
      }
      const td = (timerData || { elapsed_ms: 0, is_running: false, last_snapshot_at: 0 }) as {
        elapsed_ms: number; is_running: boolean; last_snapshot_at: number;
      };
      const now = Date.now();
      const newElapsed = td.is_running && td.last_snapshot_at > 0 ? td.elapsed_ms + (now - td.last_snapshot_at) : td.elapsed_ms;
      const newRemaining = Math.max(0, task.metadata.timer_duration - newElapsed);

      await updateTask(taskId, {
        status_field: 'Paused',
        timer_remaining: newRemaining,
        timer_started_at: 0,
        timer_data: JSON.stringify({ elapsed_ms: newElapsed, is_running: false, last_snapshot_at: 0 }),
        removed_from_paused: false,
      });
      await createLog(`Task '${taskTitle}' paused`);
    }

    if (action === 'resume') {
      let timerData = task.metadata.timer_data;
      if (typeof timerData === 'string') {
        try { timerData = JSON.parse(timerData); } catch { timerData = { elapsed_ms: 0, is_running: false, last_snapshot_at: 0 }; }
      }
      const td = (timerData || { elapsed_ms: 0, is_running: false, last_snapshot_at: 0 }) as {
        elapsed_ms: number; is_running: boolean; last_snapshot_at: number;
      };
      const now = Date.now();

      await updateTask(taskId, {
        status_field: 'Running',
        timer_started_at: now,
        timer_data: JSON.stringify({ elapsed_ms: td.elapsed_ms, is_running: true, last_snapshot_at: now }),
      });
      await createLog(`Task '${taskTitle}' resumed`);
    }

    if (action === 'reset') {
      await updateTask(taskId, {
        status_field: 'Pending',
        timer_remaining: task.metadata.timer_duration,
        timer_started_at: 0,
        timer_data: JSON.stringify({ elapsed_ms: 0, is_running: false, last_snapshot_at: 0 }),
        removed_from_paused: false,
        removed_from_completed: false,
        removed_from_failed: false,
      });
      await createLog(`Task '${taskTitle}' reset`);
    }

    if (action === 'delete') {
      await deleteTask(taskId);
      await createLog(`Task '${taskTitle}' permanently deleted`);
    }

    if (action === 'complete') {
      // Mark completed and add reward tokens
      let timerData = task.metadata.timer_data;
      if (typeof timerData === 'string') {
        try { timerData = JSON.parse(timerData); } catch { timerData = { elapsed_ms: 0, is_running: false, last_snapshot_at: 0 }; }
      }
      const td = (timerData || { elapsed_ms: 0, is_running: false, last_snapshot_at: 0 }) as {
        elapsed_ms: number; is_running: boolean; last_snapshot_at: number;
      };
      const now = Date.now();
      const finalElapsed = td.is_running && td.last_snapshot_at > 0 ? td.elapsed_ms + (now - td.last_snapshot_at) : td.elapsed_ms;

      await updateTask(taskId, {
        status_field: 'Completed',
        timer_remaining: 0,
        timer_started_at: 0,
        timer_data: JSON.stringify({ elapsed_ms: finalElapsed, is_running: false, last_snapshot_at: 0 }),
        removed_from_completed: false,
      });

      // Add reward tokens
      const settings = await getAppSettings();
      if (settings) {
        const currentTokens = settings.metadata.global_tokens ?? 0;
        const newTokens = currentTokens + task.metadata.reward_tokens;
        await updateSettings(settings.id, { global_tokens: newTokens });
      }
      await createLog(`Task '${taskTitle}' completed — +${task.metadata.reward_tokens} tokens`);
    }

    if (action === 'fail') {
      let timerData = task.metadata.timer_data;
      if (typeof timerData === 'string') {
        try { timerData = JSON.parse(timerData); } catch { timerData = { elapsed_ms: 0, is_running: false, last_snapshot_at: 0 }; }
      }
      const td = (timerData || { elapsed_ms: 0, is_running: false, last_snapshot_at: 0 }) as {
        elapsed_ms: number; is_running: boolean; last_snapshot_at: number;
      };
      const now = Date.now();
      const finalElapsed = td.is_running && td.last_snapshot_at > 0 ? td.elapsed_ms + (now - td.last_snapshot_at) : td.elapsed_ms;

      await updateTask(taskId, {
        status_field: 'Failed',
        timer_remaining: 0,
        timer_started_at: 0,
        timer_data: JSON.stringify({ elapsed_ms: finalElapsed, is_running: false, last_snapshot_at: 0 }),
        removed_from_failed: false,
      });

      // Subtract penalty tokens
      const settings = await getAppSettings();
      if (settings) {
        const currentTokens = settings.metadata.global_tokens ?? 0;
        const newTokens = Math.max(0, currentTokens - task.metadata.penalty_tokens);
        await updateSettings(settings.id, { global_tokens: newTokens });
      }
      await createLog(`Task '${taskTitle}' failed — -${task.metadata.penalty_tokens} tokens`);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Task action error:', error);
    return NextResponse.json({ error: 'Failed to perform action' }, { status: 500 });
  }
}