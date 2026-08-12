const express = require("express");

const {
  createJob,
  getAllJobs,
  getJobById,
  updateJob,
  deleteJob,
} = require("../controllers/jobController");

const { protect, recruiterOnly } = require("../middleware/authMiddleware");

const router = express.Router();

// Create Job
router.post("/", protect, recruiterOnly, createJob);
router.get("/", protect, getAllJobs);
router.get("/:id", protect, getJobById);
router.put("/:id", protect, recruiterOnly, updateJob);
router.delete("/:id", protect, recruiterOnly, deleteJob);

module.exports = router;
