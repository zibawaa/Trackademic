import { useState } from "react";
import {
  Calendar,
  CheckCircle2,
  Circle,
  Edit3,
  Trash2,
  BookOpenText,
} from "lucide-react";
import { clsx } from "clsx";
import type { Assignment } from "../../types";
import {
  getPriorityColor,
  getPriorityBorderColor,
  getPriorityLabel,
  formatDateTime,
  isOverdue,
} from "../../utils/helpers";
import { CountdownBadge } from "./CountdownBadge";

interface AssignmentCardProps {
  assignment: Assignment;
  onToggleComplete: (id: string) => Promise<void>;
  onEdit: (assignment: Assignment) => void;
  onDelete: (id: string) => Promise<void>;
}

/** Individual assignment card with actions */
export function AssignmentCard({
  assignment,
  onToggleComplete,
  onEdit,
  onDelete,
}: AssignmentCardProps) {
  const [isToggling, setIsToggling] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const overdue = isOverdue(assignment.deadline, assignment.isCompleted);

  const handleToggle = async () => {
    setIsToggling(true);
    try {
      await onToggleComplete(assignment.id);
    } finally {
      setIsToggling(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm(`Delete "${assignment.title}"? This cannot be undone.`)) {
      return;
    }
    setIsDeleting(true);
    try {
      await onDelete(assignment.id);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div
      className={clsx(
        "group rounded-xl border-l-4 bg-white p-4 shadow-sm transition-all hover:shadow-md sm:p-5",
        getPriorityBorderColor(assignment.priority),
        {
          "opacity-60": assignment.isCompleted,
          "border-l-red-500": overdue && !assignment.isCompleted,
        }
      )}
    >
      <div className="flex items-start gap-3">
        {/* Toggle Button */}
        <button
          onClick={handleToggle}
          disabled={isToggling}
          className="mt-0.5 shrink-0 transition-colors hover:scale-110"
          title={assignment.isCompleted ? "Mark as pending" : "Mark as complete"}
        >
          {assignment.isCompleted ? (
            <CheckCircle2 className="h-5 w-5 text-emerald-500" />
          ) : (
            <Circle className="h-5 w-5 text-slate-300 hover:text-emerald-400" />
          )}
        </button>

        {/* Content */}
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3
              className={clsx("font-semibold text-slate-900", {
                "line-through text-slate-400": assignment.isCompleted,
              })}
            >
              {assignment.title}
            </h3>
            <span
              className={clsx(
                "rounded-full px-2 py-0.5 text-xs font-medium",
                getPriorityColor(assignment.priority)
              )}
            >
              {getPriorityLabel(assignment.priority)}
            </span>
          </div>

          {assignment.description && (
            <p className="mt-1 text-sm text-slate-500 line-clamp-2">
              {assignment.description}
            </p>
          )}

          <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-slate-500">
            <span className="flex items-center gap-1">
              <BookOpenText className="h-3.5 w-3.5" />
              {assignment.course}
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5" />
              {formatDateTime(assignment.deadline)}
            </span>
            <CountdownBadge
              deadline={assignment.deadline}
              isCompleted={assignment.isCompleted}
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex shrink-0 gap-1 opacity-0 transition-opacity group-hover:opacity-100">
          <button
            onClick={() => onEdit(assignment)}
            className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-primary-600"
            title="Edit assignment"
          >
            <Edit3 className="h-4 w-4" />
          </button>
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-red-50 hover:text-red-600"
            title="Delete assignment"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
