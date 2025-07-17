import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Code, Trophy, Calendar, Users, Settings, LogOut } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import ThemeToggler from "./ThemeToggler";

// Function to generate initials from name
const getInitials = (name: string) => {
  return name
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase())
    .slice(0, 2)
    .join("");
};

function Header() {
  const { user, logout } = useAuth();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  // Don't show header on landing page when not logged in
  if (!user && location.pathname === "/") return null;

  return (
    <header className="fixed top-0 left-0 right-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            <Link
              to={user ? "/dashboard" : "/"}
              className="flex items-center space-x-2"
            >
              <Code className="h-8 w-8 text-orange-500" />
              <span className="text-xl font-bold text-gray-900 dark:text-white">
                Synapse Area
              </span>
            </Link>

            {user && (
              <nav className="hidden md:flex space-x-8">
                <Link
                  to="/problems"
                  className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive("/problems")
                      ? "bg-orange-50 text-orange-600 dark:bg-orange-500/20 dark:text-orange-400"
                      : "text-gray-600 dark:text-gray-300 hover:text-orange-600 dark:hover:text-orange-400"
                  }`}
                >
                  <Code className="h-4 w-4" />
                  <span>Problems</span>
                </Link>

                <Link
                  to="/events"
                  className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive("/events")
                      ? "bg-orange-50 text-orange-600 dark:bg-orange-500/20 dark:text-orange-400"
                      : "text-gray-600 dark:text-gray-300 hover:text-orange-600 dark:hover:text-orange-400"
                  }`}
                >
                  <Calendar className="h-4 w-4" />
                  <span>Events</span>
                </Link>

                <Link
                  to="/leaderboard"
                  className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive("/leaderboard")
                      ? "bg-orange-50 text-orange-600 dark:bg-orange-500/20 dark:text-orange-400"
                      : "text-gray-600 dark:text-gray-300 hover:text-orange-600 dark:hover:text-orange-400"
                  }`}
                >
                  <Trophy className="h-4 w-4" />
                  <span>Leaderboard</span>
                </Link>

                {user.role === "admin" && (
                  <Link
                    to="/admin"
                    className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive("/admin")
                        ? "bg-orange-50 text-orange-600 dark:bg-orange-500/20 dark:text-orange-400"
                        : "text-gray-600 dark:text-gray-300 hover:text-orange-600 dark:hover:text-orange-400"
                    }`}
                  >
                    <Settings className="h-4 w-4" />
                    <span>Admin</span>
                  </Link>
                )}
              </nav>
            )}
          </div>

          {user && (
            <div className="flex items-center space-x-4">
              <ThemeToggler />
              <div className="flex items-center space-x-2">
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="h-8 w-8 rounded-full object-cover"
                  />
                ) : (
                  <div className="h-8 w-8 rounded-full bg-orange-500 flex items-center justify-center">
                    <span className="text-white font-bold text-sm">
                      {getInitials(user.name)}
                    </span>
                  </div>
                )}
                <div className="text-sm">
                  <span className="font-medium text-gray-700 dark:text-gray-200">
                    {user.name}
                  </span>
                  <div className="text-orange-600 dark:text-orange-400 font-bold">
                    {user.points} pts
                  </div>
                </div>
              </div>

              <button
                onClick={logout}
                className="flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-orange-600 dark:hover:text-orange-400 transition-colors"
              >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;
