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

const upload = require("../middleware/uploadMiddleware");

// Candidate views
router.get("/my-applications", protect, candidateOnly, getMyApplications);

// Recruiter views
router.get("/:jobId", protect, recruiterOnly, getApplicantsByJob);

// Candidate applies 
router.post(
  "/:jobId",
  protect,
  candidateOnly,
  upload.single("resume"),
  applyForJob,
);

router.patch("/:id/status", protect, recruiterOnly, updateApplicationStatus);

module.exports = router;
