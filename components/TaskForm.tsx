'use client';

import { useState } from 'react';
import { ThemeConfig } from '@/lib/types';

interface TaskFormProps {
  theme: ThemeConfig;
  origin: 'Library' | 'Temporary';
  onSubmit: (data: {
    title: string;
    description: string;
    reward_tokens: number;
    penalty_tokens: number;
    timer_hours: number;
    timer_minutes: number;
    timer_seconds: number;
  }) => Promise<void>;
  loading?: boolean;
}

export default function TaskForm({ theme, origin, onSubmit, loading }: TaskFormProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [rewardTokens, setRewardTokens] = useState('');
  const [penaltyTokens, setPenaltyTokens] = useState('');
  const [timerHours, setTimerHours] = useState('');
  const [timerMinutes, setTimerMinutes] = useState('');
  const [timerSeconds, setTimerSeconds] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!title.trim()) { setError('Title is required'); return; }
    if (!rewardTokens || !penaltyTokens) { setError('Token values are required'); return; }
    const h = parseInt(timerHours || '0');
    const m = parseInt(timerMinutes || '0');
    const s = parseInt(timerSeconds || '0');
    if (h === 0 && m === 0 && s === 0) { setError('Timer duration is required'); return; }

    await onSubmit({
      title: title.trim(),
      description: description.trim(),
      reward_tokens: parseInt(rewardTokens),
      penalty_tokens: parseInt(penaltyTokens),
      timer_hours: h,
      timer_minutes: m,
      timer_seconds: s,
    });

    setTitle('');
    setDescription('');
    setRewardTokens('');
    setPenaltyTokens('');
    setTimerHours('');
    setTimerMinutes('');
    setTimerSeconds('');
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 rounded-lg space-y-3" style={{ backgroundColor: theme.card, border: `1px solid ${theme.border}` }}>
      <h3 className="text-sm font-bold" style={{ color: theme.accent }}>
        Create {origin} Task
      </h3>
      {error && <div className="text-xs px-3 py-1.5 rounded" style={{ backgroundColor: theme.buttonDanger + '20', color: theme.buttonDanger }}>{error}</div>}
      <input
        type="text"
        placeholder="Task title *"
        value={title}
        onChange={e => setTitle(e.target.value)}
        className="w-full px-3 py-2 rounded-md text-sm outline-none"
        style={{ backgroundColor: theme.bgSecondary, color: theme.text, border: `1px solid ${theme.border}` }}
      />
      <textarea
        placeholder="Description (optional)"
        value={description}
        onChange={e => setDescription(e.target.value)}
        rows={2}
        className="w-full px-3 py-2 rounded-md text-sm outline-none resize-none"
        style={{ backgroundColor: theme.bgSecondary, color: theme.text, border: `1px solid ${theme.border}` }}
      />
      <div className="grid grid-cols-2 gap-2">
        <input
          type="number"
          placeholder="Reward tokens *"
          value={rewardTokens}
          onChange={e => setRewardTokens(e.target.value)}
          min="0"
          className="px-3 py-2 rounded-md text-sm outline-none"
          style={{ backgroundColor: theme.bgSecondary, color: theme.text, border: `1px solid ${theme.border}` }}
        />
        <input
          type="number"
          placeholder="Penalty tokens *"
          value={penaltyTokens}
          onChange={e => setPenaltyTokens(e.target.value)}
          min="0"
          className="px-3 py-2 rounded-md text-sm outline-none"
          style={{ backgroundColor: theme.bgSecondary, color: theme.text, border: `1px solid ${theme.border}` }}
        />
      </div>
      <div className="grid grid-cols-3 gap-2">
        <input type="number" placeholder="Hours" value={timerHours} onChange={e => setTimerHours(e.target.value)} min="0"
          className="px-3 py-2 rounded-md text-sm outline-none"
          style={{ backgroundColor: theme.bgSecondary, color: theme.text, border: `1px solid ${theme.border}` }}
        />
        <input type="number" placeholder="Minutes" value={timerMinutes} onChange={e => setTimerMinutes(e.target.value)} min="0" max="59"
          className="px-3 py-2 rounded-md text-sm outline-none"
          style={{ backgroundColor: theme.bgSecondary, color: theme.text, border: `1px solid ${theme.border}` }}
        />
        <input type="number" placeholder="Seconds" value={timerSeconds} onChange={e => setTimerSeconds(e.target.value)} min="0" max="59"
          className="px-3 py-2 rounded-md text-sm outline-none"
          style={{ backgroundColor: theme.bgSecondary, color: theme.text, border: `1px solid ${theme.border}` }}
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="w-full py-2 rounded-md text-sm font-semibold disabled:opacity-50 transition-opacity"
        style={{ backgroundColor: theme.buttonPrimary, color: theme.buttonPrimaryText }}
      >
        {loading ? 'Creating...' : 'Create Task'}
      </button>
    </form>
  );
}