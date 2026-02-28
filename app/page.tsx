import { getAllTasks, getAppSettings, getLogs } from '@/lib/cosmic';
import AppShell from '@/components/AppShell';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function HomePage() {
  const [tasks, settings, logs] = await Promise.all([
    getAllTasks(),
    getAppSettings(),
    getLogs(),
  ]);

  const bucketSlug = process.env.COSMIC_BUCKET_SLUG || '';

  return (
    <AppShell
      initialTasks={tasks}
      initialSettings={settings}
      initialLogs={logs}
      bucketSlug={bucketSlug}
    />
  );
}