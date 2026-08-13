import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Bookmark } from "lucide-react";

function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

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