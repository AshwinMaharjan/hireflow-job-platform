import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

function ProtectedRoute({ children, role }) {
  const { user } = useContext(AuthContext);

  // yedi user logged in xaina vaye chai yo vayoo
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // yed user ko role wrong vayoo vane chai yo vayoo
  if (role && user.role !== role) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default ProtectedRoute;