'use client';

import { useState, useCallback, useEffect } from 'react';
import { Task, AppSettings, LogEntry, ThemeConfig } from '@/lib/types';
import { getThemeByKey } from '@/lib/themes';
import Sidebar from '@/components/Sidebar';
import ParticleEngine from '@/components/ParticleEngine';
import HomePage from '@/components/pages/HomePage';
import LibraryPage from '@/components/pages/LibraryPage';
import TemporaryPage from '@/components/pages/TemporaryPage';
import PausedPage from '@/components/pages/PausedPage';
import CompletedPage from '@/components/pages/CompletedPage';
import FailedPage from '@/components/pages/FailedPage';
import LogsPage from '@/components/pages/LogsPage';
import CosmicBadge from '@/components/CosmicBadge';

type PageName = 'home' | 'library' | 'temporary' | 'paused' | 'completed' | 'failed' | 'logs';

interface AppShellProps {
  initialTasks: Task[];
  initialSettings: AppSettings | null;
  initialLogs: LogEntry[];
  bucketSlug: string;
}

export default function AppShell({ initialTasks, initialSettings, initialLogs, bucketSlug }: AppShellProps) {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [settings, setSettings] = useState<AppSettings | null>(initialSettings);
  const [logs, setLogs] = useState<LogEntry[]>(initialLogs);
  const [currentPage, setCurrentPage] = useState<PageName>('home');
  const [loading, setLoading] = useState(false);

  const themeKey = typeof settings?.metadata?.active_theme === 'object'
    ? settings.metadata.active_theme.key
    : typeof settings?.metadata?.active_theme === 'string'
      ? settings.metadata.active_theme
      : 'arctic-white';

  const theme: ThemeConfig = getThemeByKey(themeKey);

  const fetchData = useCallback(async (endpoint: string) => {
    const res = await fetch(endpoint, { cache: 'no-store' });
    if (!res.ok) throw new Error('Fetch failed');
    return res.json();
  }, []);

  const refreshTasks = useCallback(async () => {
    try {
      const data = await fetchData('/api/tasks');
      setTasks(data.tasks || []);
    } catch (_e) { /* ignore */ }
  }, [fetchData]);

  const refreshSettings = useCallback(async () => {
    try {
      const data = await fetchData('/api/settings');
      setSettings(data.settings || null);
    } catch (_e) { /* ignore */ }
  }, [fetchData]);

  const refreshLogs = useCallback(async () => {
    try {
      const data = await fetchData('/api/logs');
      setLogs(data.logs || []);
    } catch (_e) { /* ignore */ }
  }, [fetchData]);

  const refreshAll = useCallback(async () => {
    setLoading(true);
    await Promise.all([refreshTasks(), refreshSettings(), refreshLogs()]);
    setLoading(false);
  }, [refreshTasks, refreshSettings, refreshLogs]);

  // Auto-refresh every 10s
  useEffect(() => {
    const interval = setInterval(refreshAll, 10000);
    return () => clearInterval(interval);
  }, [refreshAll]);

  const renderPage = () => {
    const commonProps = { tasks, settings, logs, theme, refreshAll, refreshTasks, refreshSettings, refreshLogs, loading };
    switch (currentPage) {
      case 'home': return <HomePage {...commonProps} />;
      case 'library': return <LibraryPage {...commonProps} />;
      case 'temporary': return <TemporaryPage {...commonProps} />;
      case 'paused': return <PausedPage {...commonProps} />;
      case 'completed': return <CompletedPage {...commonProps} />;
      case 'failed': return <FailedPage {...commonProps} />;
      case 'logs': return <LogsPage {...commonProps} />;
      default: return <HomePage {...commonProps} />;
    }
  };

  return (
    <div
      className="flex h-screen w-screen overflow-hidden transition-colors duration-500"
      style={{ backgroundColor: theme.bg, color: theme.text }}
    >
      <ParticleEngine theme={theme} />
      <Sidebar
        currentPage={currentPage}
        onNavigate={setCurrentPage}
        theme={theme}
        tokens={settings?.metadata?.global_tokens ?? 0}
      />
      <main className="flex-1 overflow-y-auto relative z-10 p-6">
        {renderPage()}
      </main>
      <CosmicBadge bucketSlug={bucketSlug} />
    </div>
  );
}