import { Filter } from "lucide-react";

interface FilterBarProps {
  courses: string[];
  courseFilter: string;
  onCourseChange: (course: string) => void;
  statusFilter: string;
  onStatusChange: (status: string) => void;
}

/** Filter bar for assignments - course and status filters */
export function FilterBar({
  courses,
  courseFilter,
  onCourseChange,
  statusFilter,
  onStatusChange,
}: FilterBarProps) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="flex items-center gap-1.5 text-sm text-slate-500">
        <Filter className="h-4 w-4" />
        <span className="hidden sm:inline">Filters:</span>
      </div>

      {/* Course Filter */}
      <select
        value={courseFilter}
        onChange={(e) => onCourseChange(e.target.value)}
        className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-700 transition-colors focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
      >
        <option value="">All Courses</option>
        {courses.map((course) => (
          <option key={course} value={course}>
            {course}
          </option>
        ))}
      </select>

      {/* Status Filter */}
      <select
        value={statusFilter}
        onChange={(e) => onStatusChange(e.target.value)}
        className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-700 transition-colors focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
      >
        <option value="">All Status</option>
        <option value="pending">Pending</option>
        <option value="completed">Completed</option>
        <option value="overdue">Overdue</option>
      </select>

      {/* Clear Filters */}
      {(courseFilter || statusFilter) && (
        <button
          onClick={() => {
            onCourseChange("");
            onStatusChange("");
          }}
          className="text-sm text-primary-600 hover:text-primary-700 hover:underline"
        >
          Clear filters
        </button>
      )}
    </div>
  );
}
