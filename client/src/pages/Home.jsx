import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import toast from "react-hot-toast";

import { useAuth } from "../context/AuthContext";
import GuestHome from "../components/home/GuestHome";
import CandidateHome from "../components/home/CandidateHome";
import RecruiterHome from "../components/home/RecruiterHome";

function Home() {
  const { user } = useAuth();
  const location = useLocation();

  useEffect(() => {
    if (location.state?.success) {
      toast.success(location.state.success);

      // Clear the state so the toast doesn't show again on refresh
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  if (!user) {
    return <GuestHome />;
  }

  if (user.role === "recruiter") {
    return <RecruiterHome user={user} />;
  }

  return <CandidateHome user={user} />;
}

export default Home;