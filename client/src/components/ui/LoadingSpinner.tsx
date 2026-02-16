import { Loader2 } from "lucide-react";
import { clsx } from "clsx";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function LoadingSpinner({ size = "md", className }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-8 h-8",
    lg: "w-12 h-12",
  };

  return (
    <div className={clsx("flex items-center justify-center", className)}>
      <Loader2
        className={clsx("animate-spin text-primary-600", sizeClasses[size])}
      />
    </div>
  );
}

/** Full-page loading state */
export function PageLoader() {
  return (
    <div className="flex h-screen items-center justify-center">
      <div className="text-center">
        <LoadingSpinner size="lg" />
        <p className="mt-4 text-slate-500">Loading...</p>
      </div>
    </div>
  );
}
