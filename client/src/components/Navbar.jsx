import { Link, NavLink, useNavigate } from "react-router-dom";

import { useContext, useEffect, useState } from "react";

import { Bookmark, Bell, BriefcaseBusiness, LogOut, X } from "lucide-react";

import { AuthContext } from "../context/AuthContext";
import { useNotifications } from "../context/NotificationContext";

function LogoutConfirmModal({ open, onCancel, onConfirm }) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center bg-gray-900/50 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="logout-modal-title"
    >
      <div className="w-full max-w-sm rounded-xl bg-white p-6 shadow-xl">
        <div className="flex items-start justify-between">
          <h3
            id="logout-modal-title"
            className="text-lg font-semibold text-gray-900"
          >
            Log out?
          </h3>
          <button
            onClick={onCancel}
            aria-label="Close"
            className="rounded-lg p-1 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <p className="mt-2 text-sm text-gray-600">
          You'll need to sign in again to access your account.
        </p>

        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 shadow-sm transition hover:border-gray-400 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-red-700 active:bg-red-800"
          >
            <LogOut size={16} />
            Log out
          </button>
        </div>
      </div>
    </div>
  );
}

function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const { unreadCount, fetchUnreadCount } = useNotifications();

  const navigate = useNavigate();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const handleLogoutClick = () => {
    setShowLogoutConfirm(true);
  };

  const handleConfirmLogout = () => {
    setShowLogoutConfirm(false);
    logout();
    navigate("/login");
  };

  useEffect(() => {
    if (!user) return;

    fetchUnreadCount();

    const interval = setInterval(fetchUnreadCount, 30000);

    return () => clearInterval(interval);
  }, [user]);

  const navLink = "text-gray-600 hover:text-indigo-600 transition font-medium";

  const activeNav = "text-indigo-600 font-semibold";

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <LogoutConfirmModal
        open={showLogoutConfirm}
        onCancel={() => setShowLogoutConfirm(false)}
        onConfirm={handleConfirmLogout}
      />

      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}

        <Link to="/" className="flex items-center gap-2">
          
          <span className="text-2xl font-bold text-gray-900">HireFlow</span>
        </Link>

        {/* Center Links */}

        <div className="flex items-center gap-8">
          <NavLink
            to="/"
            className={({ isActive }) => (isActive ? activeNav : navLink)}
          >
            Home
          </NavLink>

          {!user ? (
            <>
              <NavLink
                to="/login"
                className={({ isActive }) => (isActive ? activeNav : navLink)}
              >
                Login
              </NavLink>

              <Link
                to="/register"
                className="bg-indigo-600 text-white px-5 py-2 rounded-lg hover:bg-indigo-700 transition font-medium"
              >
                Register
              </Link>
            </>
          ) : (
            <>
              {user.role === "candidate" ? (
                <>
                  <NavLink
                    to="/jobs"
                    className={({ isActive }) =>
                      isActive ? activeNav : navLink
                    }
                  >
                    Jobs
                  </NavLink>

                  <NavLink
                    to="/saved-jobs"
                    className={({ isActive }) =>
                      `flex items-center gap-2 ${isActive ? activeNav : navLink}`
                    }
                  >
                    Saved Jobs
                  </NavLink>

                  <NavLink
                    to="/candidate/dashboard"
                    className={({ isActive }) =>
                      isActive ? activeNav : navLink
                    }
                  >
                    Dashboard
                  </NavLink>
                </>
              ) : (
                <>
                  <NavLink
                    to="/recruiter/dashboard"
                    className={({ isActive }) =>
                      isActive ? activeNav : navLink
                    }
                  >
                    Dashboard
                  </NavLink>

                  <NavLink
                    to="/recruiter/jobs"
                    end
                    className={({ isActive }) =>
                      isActive ? activeNav : navLink
                    }
                  >
                    My Jobs
                  </NavLink>
                  <NavLink
                    to="/recruiter/jobs/new"
                    className={({ isActive }) =>
                      isActive ? activeNav : navLink
                    }
                  >
                    Post Jobs
                  </NavLink>
                </>
              )}
            </>
          )}
        </div>

        {/* Right */}

        {user && (
          <div className="flex items-center gap-5">
            {/* Notifications */}

            <NavLink
              to="/notifications"
              className="relative text-gray-600 hover:text-indigo-600 transition"
            >
              <Bell size={22} />

              {unreadCount > 0 && (
                <span className="absolute -top-2 -right-2 min-w-[18px] h-[18px] px-1 rounded-full bg-red-500 text-white text-[10px] flex items-center justify-center animate-pulse">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </NavLink>

            {/* Profile */}

            <NavLink
              to="/profile"
              className="flex items-center gap-3 hover:bg-gray-100 px-3 py-2 rounded-lg transition"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-blue-700 font-semibold text-white shadow-md">
                {user.name?.charAt(0).toUpperCase()}
              </div>

              <div className="hidden md:block">
                <p className="text-sm font-semibold text-gray-900">
                  {user.name}
                </p>

                <p className="text-xs text-gray-500 capitalize">{user.role}</p>
              </div>
            </NavLink>

            {/* Logout */}

            <button
              onClick={handleLogoutClick}
              className="flex items-center gap-2 border border-red-200 text-red-600 px-4 py-2 rounded-lg hover:bg-red-50 transition"
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
}

export default Navbar;