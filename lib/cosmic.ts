import { createBucketClient } from '@cosmicjs/sdk';
import { Task, AppSettings, LogEntry } from './types';

export const cosmic = createBucketClient({
  bucketSlug: process.env.COSMIC_BUCKET_SLUG as string,
  readKey: process.env.COSMIC_READ_KEY as string,
  writeKey: process.env.COSMIC_WRITE_KEY as string,
});

function hasStatus(error: unknown): error is { status: number } {
  return typeof error === 'object' && error !== null && 'status' in error;
}

export async function getAllTasks(): Promise<Task[]> {
  try {
    const response = await cosmic.objects
      .find({ type: 'tasks' })
      .props(['id', 'title', 'slug', 'metadata'])
      .depth(1)
      .limit(100);
    return (response.objects || []) as Task[];
  } catch (error) {
    if (hasStatus(error) && error.status === 404) return [];
    throw new Error('Failed to fetch tasks');
  }
}

export async function getAppSettings(): Promise<AppSettings | null> {
  try {
    const response = await cosmic.objects
      .find({ type: 'app-settings' })
      .props(['id', 'title', 'slug', 'metadata'])
      .depth(1)
      .limit(1);
    const objects = response.objects as AppSettings[];
    return objects[0] || null;
  } catch (error) {
    if (hasStatus(error) && error.status === 404) return null;
    throw new Error('Failed to fetch settings');
  }
}

export async function getLogs(): Promise<LogEntry[]> {
  try {
    const response = await cosmic.objects
      .find({ type: 'logs' })
      .props(['id', 'title', 'slug', 'metadata'])
      .depth(1)
      .limit(100);
    const logs = (response.objects || []) as LogEntry[];
    return logs.sort((a, b) => (b.metadata?.log_order || 0) - (a.metadata?.log_order || 0)).slice(0, 10);
  } catch (error) {
    if (hasStatus(error) && error.status === 404) return [];
    throw new Error('Failed to fetch logs');
  }
}

export async function updateTask(id: string, metadata: Record<string, unknown>): Promise<void> {
  await cosmic.objects.updateOne(id, { metadata });
}

export async function updateSettings(id: string, metadata: Record<string, unknown>): Promise<void> {
  await cosmic.objects.updateOne(id, { metadata });
}

export async function createTask(data: {
  title: string;
  description: string;
  origin: string;
  reward_tokens: number;
  penalty_tokens: number;
  timer_duration: number;
}): Promise<Task> {
  const slug = data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') + '-' + Date.now();
  const response = await cosmic.objects.insertOne({
    type: 'tasks',
    title: data.title,
    slug,
    metadata: {
      title: data.title,
      description: data.description,
      status_field: 'Pending',
      origin: data.origin,
      reward_tokens: data.reward_tokens,
      penalty_tokens: data.penalty_tokens,
      timer_duration: data.timer_duration,
      timer_remaining: data.timer_duration,
      timer_started_at: 0,
      timer_data: JSON.stringify({ elapsed_ms: 0, is_running: false, last_snapshot_at: 0 }),
      removed_from_temporary: false,
      removed_from_completed: false,
      removed_from_failed: false,
      removed_from_paused: false,
      created_at: new Date().toISOString(),
    },
  });
  return response.object as Task;
}

export async function deleteTask(id: string): Promise<void> {
  await cosmic.objects.deleteOne(id);
}

export async function createLog(action: string): Promise<void> {
  const now = new Date();
  const pkTime = new Intl.DateTimeFormat('en-PK', {
    timeZone: 'Asia/Karachi',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  }).format(now);
  const pkDate = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Asia/Karachi',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }).format(now);

  const allLogs = await getLogs();
  const maxOrder = allLogs.reduce((max, l) => Math.max(max, l.metadata?.log_order || 0), 0);

  const slug = 'log-' + Date.now() + '-' + Math.random().toString(36).substring(2, 8);

  await cosmic.objects.insertOne({
    type: 'logs',
    title: action.substring(0, 100),
    slug,
    metadata: {
      action,
      timestamp: pkTime.toUpperCase(),
      date_stamp: pkDate,
      log_order: maxOrder + 1,
    },
  });

  // Keep only latest 10 logs
  try {
    const fullResponse = await cosmic.objects
      .find({ type: 'logs' })
      .props(['id', 'metadata'])
      .depth(1)
      .limit(100);
    const allLogsNow = (fullResponse.objects || []) as LogEntry[];
    const sorted = allLogsNow.sort((a, b) => (b.metadata?.log_order || 0) - (a.metadata?.log_order || 0));
    if (sorted.length > 10) {
      const toDelete = sorted.slice(10);
      for (const log of toDelete) {
        try {
          await cosmic.objects.deleteOne(log.id);
        } catch (_e) {
          // ignore deletion errors
        }
      }
    }
  } catch (_e) {
    // ignore cleanup errors
  }
}