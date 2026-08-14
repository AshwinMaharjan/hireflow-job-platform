import { Link, useNavigate } from "react-router-dom";
import { useContext, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNotifications } from "../context/NotificationContext";
import { Bookmark, Bell } from "lucide-react";

function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const { unreadCount, fetchUnreadCount } = useNotifications();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  useEffect(() => {
    if (!user) return;

    fetchUnreadCount();

    const interval = setInterval(fetchUnreadCount, 30000);
    return () => clearInterval(interval);
  }, [user]);

  return (
    <nav className="bg-slate-900 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold">
          HireFlow
        </Link>

        <div className="flex items-center gap-5">
          <Link to="/">Home</Link>

          {!user ? (
            <>
              <Link to="/login">Login</Link>
              <Link to="/register">Register</Link>
            </>
          ) : (
            <>
              {user.role === "candidate" ? (
                <>
                  <Link to="/candidate/dashboard">Dashboard</Link>
                  <Link to="/saved-jobs" className="flex items-center gap-1">
                    <Bookmark size={18} />
                    Saved Jobs
                  </Link>
                </>
              ) : (
                <Link to="/recruiter/dashboard">Dashboard</Link>
              )}

              <Link
                to="/profile"
                className="text-gray-300 hover:text-white transition"
              >
                Hi, {user.name}
              </Link>

              <Link
                to="/notifications"
                className="relative text-gray-300 hover:text-white transition"
              >
                <Bell size={22} />

                {unreadCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                )}
              </Link>

              <button
                onClick={handleLogout}
                className="bg-red-500 px-3 py-1 rounded hover:bg-red-600"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;