import { ClipboardList } from "lucide-react";
import type { Assignment } from "../../types";
import { AssignmentCard } from "./AssignmentCard";

interface AssignmentListProps {
  assignments: Assignment[];
  onToggleComplete: (id: string) => Promise<void>;
  onEdit: (assignment: Assignment) => void;
  onDelete: (id: string) => Promise<void>;
}

/** List of assignment cards with empty state */
export function AssignmentList({
  assignments,
  onToggleComplete,
  onEdit,
  onDelete,
}: AssignmentListProps) {
  if (assignments.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 py-16">
        <ClipboardList className="h-12 w-12 text-slate-300" />
        <h3 className="mt-4 text-lg font-semibold text-slate-600">
          No assignments found
        </h3>
        <p className="mt-1 text-sm text-slate-400">
          Create your first assignment to get started!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {assignments.map((assignment) => (
        <AssignmentCard
          key={assignment.id}
          assignment={assignment}
          onToggleComplete={onToggleComplete}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
