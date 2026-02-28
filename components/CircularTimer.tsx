'use client';

import { useEffect, useState, useRef } from 'react';
import { Task, ThemeConfig } from '@/lib/types';
import { computeRemainingMs, formatMs, getStatusKey } from '@/lib/helpers';

interface CircularTimerProps {
  task: Task;
  theme: ThemeConfig;
  size?: number;
}

export default function CircularTimer({ task, theme, size = 260 }: CircularTimerProps) {
  const [remaining, setRemaining] = useState(computeRemainingMs(task));
  const [pulseClass, setPulseClass] = useState('');
  const prevRef = useRef({ s: -1, m: -1, h: -1 });
  const isRunning = getStatusKey(task.metadata.status_field) === 'running';
  const duration = task.metadata.timer_duration;

  useEffect(() => {
    setRemaining(computeRemainingMs(task));
  }, [task]);

  useEffect(() => {
    if (!isRunning) return;
    const interval = setInterval(() => {
      setRemaining(computeRemainingMs(task));
    }, 50);
    return () => clearInterval(interval);
  }, [isRunning, task]);

  useEffect(() => {
    const time = formatMs(remaining);
    const s = parseInt(time.seconds);
    const m = parseInt(time.minutes);
    const h = parseInt(time.hours);
    if (prevRef.current.h !== h && prevRef.current.h !== -1) {
      setPulseClass('animate-strongest');
      setTimeout(() => setPulseClass(''), 400);
    } else if (prevRef.current.m !== m && prevRef.current.m !== -1) {
      setPulseClass('animate-strong');
      setTimeout(() => setPulseClass(''), 300);
    } else if (prevRef.current.s !== s && prevRef.current.s !== -1) {
      setPulseClass('animate-pulse-s');
      setTimeout(() => setPulseClass(''), 200);
    }
    prevRef.current = { s, m, h };
  }, [remaining]);

  const progress = duration > 0 ? 1 - remaining / duration : 0;
  const radius = (size - 20) / 2;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference * (1 - progress);
  const time = formatMs(remaining);

  const pulseStyle = pulseClass === 'animate-strongest'
    ? { animation: 'timerPulseStrongest 0.4s ease-in-out' }
    : pulseClass === 'animate-strong'
      ? { animation: 'timerPulseStrong 0.3s ease-in-out' }
      : pulseClass === 'animate-pulse-s'
        ? { animation: 'timerPulse 0.2s ease-in-out' }
        : {};

  const gradId = `grad-${task.id}`;

  return (
    <div className="flex flex-col items-center" style={pulseStyle}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <defs>
          <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
            {theme.gradientRing.map((color, i) => (
              <stop key={i} offset={`${(i / (theme.gradientRing.length - 1)) * 100}%`} stopColor={color} />
            ))}
          </linearGradient>
        </defs>
        {/* Background ring */}
        <circle
          cx={size / 2} cy={size / 2} r={radius}
          fill="none" stroke={theme.border} strokeWidth="8" opacity="0.3"
        />
        {/* Progress ring */}
        <circle
          cx={size / 2} cy={size / 2} r={radius}
          fill="none" stroke={`url(#${gradId})`} strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          style={{ transition: 'stroke-dashoffset 0.1s linear' }}
        />
        {/* Time text */}
        <text x={size / 2} y={size / 2 - 8} textAnchor="middle" dominantBaseline="middle"
          fill={theme.text} fontSize="28" fontFamily="JetBrains Mono, monospace" fontWeight="700"
        >
          {time.hours}:{time.minutes}:{time.seconds}
        </text>
        <text x={size / 2} y={size / 2 + 22} textAnchor="middle" dominantBaseline="middle"
          fill={theme.accent} fontSize="18" fontFamily="JetBrains Mono, monospace" fontWeight="500"
        >
          .{time.centiseconds}
        </text>
      </svg>
      <p className="mt-2 text-xs font-medium truncate max-w-[200px]" style={{ color: theme.textSecondary }}>
        {task.metadata.title || task.title}
      </p>
    </div>
  );
}