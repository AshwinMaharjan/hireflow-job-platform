const express = require("express");

const {
  applyForJob,
  getApplicantsByJob,
  getMyApplications,
  updateApplicationStatus,
} = require("../controllers/applicationController");

const {
  protect,
  candidateOnly,
  recruiterOnly,
} = require("../middleware/authMiddleware");

const router = express.Router();

// Candidate views their applications
router.get("/my-applications", protect, candidateOnly, getMyApplications);

// Recruiter views applicants for a job
router.get("/:jobId", protect, recruiterOnly, getApplicantsByJob);

// Candidate applies for a job
router.post("/:jobId", protect, candidateOnly, applyForJob);

router.patch("/:id/status", protect, recruiterOnly, updateApplicationStatus);

module.exports = router;
