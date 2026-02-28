export function formatMs(ms: number): { hours: string; minutes: string; seconds: string; centiseconds: string } {
  const totalMs = Math.max(0, ms);
  const hours = Math.floor(totalMs / 3600000);
  const minutes = Math.floor((totalMs % 3600000) / 60000);
  const seconds = Math.floor((totalMs % 60000) / 1000);
  const centiseconds = Math.floor((totalMs % 1000) / 10);
  return {
    hours: String(hours).padStart(2, '0'),
    minutes: String(minutes).padStart(2, '0'),
    seconds: String(seconds).padStart(2, '0'),
    centiseconds: String(centiseconds).padStart(2, '0'),
  };
}

export function getStatusKey(status: { key: string; value: string } | string | undefined): string {
  if (!status) return 'pending';
  if (typeof status === 'string') return status.toLowerCase();
  return status.key || 'pending';
}

export function getStatusValue(status: { key: string; value: string } | string | undefined): string {
  if (!status) return 'Pending';
  if (typeof status === 'string') return status;
  return status.value || 'Pending';
}

export function getOriginKey(origin: { key: string; value: string } | string | undefined): string {
  if (!origin) return 'library';
  if (typeof origin === 'string') return origin.toLowerCase();
  return origin.key || 'library';
}

export function computeElapsedMs(task: {
  metadata: {
    timer_data?: { elapsed_ms: number; is_running: boolean; last_snapshot_at: number } | string;
    timer_started_at?: number;
  };
}): number {
  let timerData = task.metadata.timer_data;
  if (typeof timerData === 'string') {
    try { timerData = JSON.parse(timerData); } catch { timerData = undefined; }
  }
  if (!timerData || typeof timerData !== 'object') return 0;
  const td = timerData as { elapsed_ms: number; is_running: boolean; last_snapshot_at: number };
  if (td.is_running && td.last_snapshot_at > 0) {
    return td.elapsed_ms + (Date.now() - td.last_snapshot_at);
  }
  return td.elapsed_ms;
}

export function computeRemainingMs(task: {
  metadata: {
    timer_duration: number;
    timer_data?: { elapsed_ms: number; is_running: boolean; last_snapshot_at: number } | string;
    timer_started_at?: number;
  };
}): number {
  const elapsed = computeElapsedMs(task);
  return Math.max(0, task.metadata.timer_duration - elapsed);
}