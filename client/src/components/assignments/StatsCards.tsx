import {
  BookOpen,
  CheckCircle2,
  Clock,
  AlertTriangle,
} from "lucide-react";
import type { AssignmentStats } from "../../types";

interface StatsCardsProps {
  stats: AssignmentStats;
}

/** Dashboard statistics cards showing assignment counts */
export function StatsCards({ stats }: StatsCardsProps) {
  const cards = [
    {
      label: "Total",
      value: stats.total,
      icon: BookOpen,
      color: "text-slate-600",
      bg: "bg-slate-100",
    },
    {
      label: "Pending",
      value: stats.pending,
      icon: Clock,
      color: "text-blue-600",
      bg: "bg-blue-100",
    },
    {
      label: "Completed",
      value: stats.completed,
      icon: CheckCircle2,
      color: "text-emerald-600",
      bg: "bg-emerald-100",
    },
    {
      label: "Overdue",
      value: stats.overdue,
      icon: AlertTriangle,
      color: "text-red-600",
      bg: "bg-red-100",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {cards.map((card) => (
        <div
          key={card.label}
          className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">{card.label}</p>
              <p className="mt-1 text-2xl font-bold text-slate-900">
                {card.value}
              </p>
            </div>
            <div className={`rounded-lg ${card.bg} p-2.5`}>
              <card.icon className={`h-5 w-5 ${card.color}`} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
