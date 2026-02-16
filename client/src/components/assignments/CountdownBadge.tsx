import { useCountdown } from "../../hooks/useCountdown";
import { clsx } from "clsx";

interface CountdownBadgeProps {
  deadline: string;
  isCompleted: boolean;
}

/** Live countdown timer badge for assignments */
export function CountdownBadge({ deadline, isCompleted }: CountdownBadgeProps) {
  const { label, isOverdue, totalMs } = useCountdown(deadline);

  if (isCompleted) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-medium text-emerald-700">
        Completed
      </span>
    );
  }

  // Color coding based on urgency
  const isUrgent = !isOverdue && totalMs < 60 * 60 * 1000; // less than 1 hour
  const isWarning =
    !isOverdue && !isUrgent && totalMs < 24 * 60 * 60 * 1000; // less than 24 hours

  return (
    <span
      className={clsx(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium tabular-nums",
        {
          "bg-red-100 text-red-700": isOverdue || isUrgent,
          "bg-amber-100 text-amber-700": isWarning,
          "bg-slate-100 text-slate-600": !isOverdue && !isUrgent && !isWarning,
        }
      )}
    >
      {isOverdue ? "Overdue: " : ""}
      {label}
    </span>
  );
}
