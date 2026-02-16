import { useState } from "react";
import { Plus } from "lucide-react";
import { useAssignments } from "../hooks/useAssignments";
import { StatsCards } from "../components/assignments/StatsCards";
import { FilterBar } from "../components/assignments/FilterBar";
import { AssignmentList } from "../components/assignments/AssignmentList";
import { AssignmentForm } from "../components/assignments/AssignmentForm";
import { LoadingSpinner } from "../components/ui/LoadingSpinner";
import type { Assignment, CreateAssignmentData, UpdateAssignmentData } from "../types";

export function DashboardPage() {
  const {
    assignments,
    stats,
    courses,
    isLoading,
    error,
    courseFilter,
    setCourseFilter,
    statusFilter,
    setStatusFilter,
    createAssignment,
    updateAssignment,
    deleteAssignment,
    toggleComplete,
  } = useAssignments();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState<Assignment | null>(
    null
  );

  const handleCreate = () => {
    setEditingAssignment(null);
    setIsFormOpen(true);
  };

  const handleEdit = (assignment: Assignment) => {
    setEditingAssignment(assignment);
    setIsFormOpen(true);
  };

  const handleFormSubmit = async (
    data: CreateAssignmentData | UpdateAssignmentData
  ) => {
    if (editingAssignment) {
      await updateAssignment(editingAssignment.id, data as UpdateAssignmentData);
    } else {
      await createAssignment(data as CreateAssignmentData);
    }
  };

  const handleToggleComplete = async (id: string) => {
    await toggleComplete(id);
  };

  const handleDelete = async (id: string) => {
    await deleteAssignment(id);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
          <p className="mt-1 text-sm text-slate-500">
            Track and manage your assignment deadlines
          </p>
        </div>
        <button
          onClick={handleCreate}
          className="flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-primary-700 hover:shadow-md"
        >
          <Plus className="h-4 w-4" />
          New Assignment
        </button>
      </div>

      {/* Stats */}
      {stats && <StatsCards stats={stats} />}

      {/* Error */}
      {error && (
        <div className="rounded-lg bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Filters & List */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <FilterBar
            courses={courses}
            courseFilter={courseFilter}
            onCourseChange={setCourseFilter}
            statusFilter={statusFilter}
            onStatusChange={setStatusFilter}
          />
          <span className="text-sm text-slate-400">
            {assignments.length} assignment{assignments.length !== 1 ? "s" : ""}
          </span>
        </div>

        <AssignmentList
          assignments={assignments}
          onToggleComplete={handleToggleComplete}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>

      {/* Create/Edit Form Modal */}
      <AssignmentForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleFormSubmit}
        assignment={editingAssignment}
      />
    </div>
  );
}
