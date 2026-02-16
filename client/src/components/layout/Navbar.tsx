import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { BookOpen, LogOut, User } from "lucide-react";

export function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-slate-200 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link
          to="/dashboard"
          className="flex items-center gap-2 text-xl font-bold text-primary-700 transition-colors hover:text-primary-600"
        >
          <BookOpen className="h-6 w-6" />
          <span>Trackademic</span>
        </Link>

        {/* User Menu */}
        {user && (
          <div className="flex items-center gap-4">
            <div className="hidden items-center gap-2 text-sm text-slate-600 sm:flex">
              <User className="h-4 w-4" />
              <span>{user.name}</span>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-sm text-slate-600 transition-all hover:border-red-200 hover:bg-red-50 hover:text-red-600"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
