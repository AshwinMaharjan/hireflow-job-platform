const express = require("express");
const {
  getMyProfile,
  updateMyProfile,
  toggleSaveJob,
  getSavedJobs,
} = require("../controllers/userController");

const {
  protect,
  recruiterOnly,
  candidateOnly,
} = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/profile", protect, (req, res) => {
  res.json({
    message: "You can access this protected route.",
    user: req.user,
  });
});

router.get("/candidate-test", protect, candidateOnly, (req, res) => {
  res.json({
    message: "Candidate access granted",
    user: req.user,
  });
});

router.get("/recruiter-test", protect, recruiterOnly, (req, res) => {
  res.json({
    message: "Recruiter access granted",
    user: req.user,
  });
});
router.get("/me", protect, getMyProfile);
router.put("/me", protect, updateMyProfile);
router.post("/save-job/:jobId", protect, candidateOnly, toggleSaveJob);
router.get("/saved-jobs", protect, candidateOnly, getSavedJobs);
module.exports = router;
