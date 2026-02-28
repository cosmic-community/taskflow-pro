export interface CosmicSelectDropdown {
  key: string;
  value: string;
}

export interface TimerData {
  elapsed_ms: number;
  is_running: boolean;
  last_snapshot_at: number;
}

export interface TaskMetadata {
  title: string;
  description?: string;
  status_field: CosmicSelectDropdown;
  origin: CosmicSelectDropdown;
  reward_tokens: number;
  penalty_tokens: number;
  timer_duration: number;
  timer_remaining: number;
  timer_started_at?: number;
  timer_data?: TimerData;
  removed_from_temporary: boolean;
  removed_from_completed: boolean;
  removed_from_failed: boolean;
  removed_from_paused: boolean;
  created_at?: string;
}

export interface Task {
  id: string;
  title: string;
  slug: string;
  metadata: TaskMetadata;
}

export interface AppSettingsMetadata {
  global_tokens: number;
  active_theme: CosmicSelectDropdown;
}

export interface AppSettings {
  id: string;
  title: string;
  slug: string;
  metadata: AppSettingsMetadata;
}

export interface LogMetadata {
  action: string;
  timestamp: string;
  date_stamp: string;
  log_order: number;
}

export interface LogEntry {
  id: string;
  title: string;
  slug: string;
  metadata: LogMetadata;
}

export type TaskStatus = 'Pending' | 'Running' | 'Paused' | 'Completed' | 'Failed';
export type TaskOrigin = 'Library' | 'Temporary';
export type TaskStatusKey = 'pending' | 'running' | 'paused' | 'completed' | 'failed';

export type ThemeKey =
  | 'arctic-white' | 'cloud-nine' | 'snowfall' | 'ivory-elegance' | 'pearl-mist'
  | 'midnight-abyss' | 'deep-space' | 'obsidian-night' | 'shadow-realm' | 'void-black'
  | 'neon-cyberpunk' | 'electric-pulse' | 'laser-grid' | 'neon-sunset' | 'digital-rain'
  | 'pastel-dream' | 'soft-blossom' | 'lavender-haze' | 'mint-whisper' | 'cotton-candy';

export interface ThemeConfig {
  key: ThemeKey;
  value: string;
  bg: string;
  bgSecondary: string;
  text: string;
  textSecondary: string;
  accent: string;
  accentHover: string;
  border: string;
  card: string;
  cardHover: string;
  sidebar: string;
  sidebarText: string;
  sidebarActive: string;
  buttonPrimary: string;
  buttonPrimaryText: string;
  buttonDanger: string;
  buttonSuccess: string;
  buttonWarning: string;
  particleColors: string[];
  gradientRing: string[];
  isDark: boolean;
}

export interface AppContextType {
  tasks: Task[];
  settings: AppSettings | null;
  logs: LogEntry[];
  activeTheme: ThemeConfig;
  loading: boolean;
  refreshTasks: () => Promise<void>;
  refreshSettings: () => Promise<void>;
  refreshLogs: () => Promise<void>;
  refreshAll: () => Promise<void>;
}