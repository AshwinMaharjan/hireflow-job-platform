import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import CandidateDashboard from "./pages/CandidateDashboard";
import RecruiterDashboard from "./pages/RecruiterDashboard";
import JobDetails from "./pages/JobDetails";
import NotFound from "./pages/NotFound";
import EditJob from "./pages/EditJob";
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";
import ApplyJob from "./pages/ApplyJob";
import ApplicantsPage from "./pages/ApplicantsPage";
import CreateJob from "./pages/CreateJob";
import Profile from "./pages/Profile";
import SavedJobs from "./pages/SavedJobs";
import VerifyEmail from "./pages/VerifyEmail";
import Notifications from "./pages/Notifications";
import AvailableJobs from "./components/AvailableJobs";
import MyJobs from "./pages/MyJobs";

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/saved-jobs" element={<SavedJobs />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/jobs/:id" element={<JobDetails />} />
        <Route
          path="/candidate/dashboard"
          element={
            <ProtectedRoute role="candidate">
              <CandidateDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/recruiter/dashboard"
          element={
            <ProtectedRoute role="recruiter">
              <RecruiterDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/jobs/:id/apply"
          element={
            <ProtectedRoute role="candidate">
              <ApplyJob />
            </ProtectedRoute>
          }
        />
        <Route
          path="/recruiter/jobs/:jobId/applicants"
          element={<ApplicantsPage />}
        />
        <Route path="/recruiter/jobs/:jobId/edit" element={<EditJob />} />
        <Route path="*" element={<NotFound />} />
        <Route path="/recruiter/jobs/new" element={<CreateJob />} />
        <Route path="/recruiter/my-jobs" element={<MyJobs />} />

        <Route path="/verify-email/:token" element={<VerifyEmail />} />
        <Route
          path="/notifications"
          element={
            <ProtectedRoute>
              <Notifications />
            </ProtectedRoute>
          }
        />
        <Route path="/jobs" element={<AvailableJobs />} />

        <Route
  path="/recruiter/jobs"
  element={
    <ProtectedRoute role="recruiter">
      <MyJobs />
    </ProtectedRoute>
  }
/>
      </Routes>
    </>
  );
}

export default App;
