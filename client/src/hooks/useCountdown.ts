import { useState, useEffect } from "react";

interface CountdownResult {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isOverdue: boolean;
  totalMs: number;
  label: string;
}

/**
 * Custom hook that provides a live countdown timer to a deadline.
 * Updates every second.
 */
export function useCountdown(deadline: string): CountdownResult {
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, []);

  const deadlineMs = new Date(deadline).getTime();
  const totalMs = deadlineMs - now;
  const isOverdue = totalMs <= 0;

  const absTotalMs = Math.abs(totalMs);
  const days = Math.floor(absTotalMs / (1000 * 60 * 60 * 24));
  const hours = Math.floor((absTotalMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((absTotalMs % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((absTotalMs % (1000 * 60)) / 1000);

  // Build human-readable label
  let label: string;
  if (isOverdue) {
    if (days > 0) label = `${days}d ${hours}h overdue`;
    else if (hours > 0) label = `${hours}h ${minutes}m overdue`;
    else label = `${minutes}m ${seconds}s overdue`;
  } else {
    if (days > 0) label = `${days}d ${hours}h ${minutes}m`;
    else if (hours > 0) label = `${hours}h ${minutes}m ${seconds}s`;
    else label = `${minutes}m ${seconds}s`;
  }

  return { days, hours, minutes, seconds, isOverdue, totalMs, label };
}
