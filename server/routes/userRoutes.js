const express = require("express");

const {
    protect,
    recruiterOnly,
    candidateOnly
} = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/profile", protect, (req, res) => {
    res.json({
        message: "You can access this protected route.",
        user: req.user
    });
});

router.get("/candidate-test", protect, candidateOnly, (req, res) => {
    res.json({
        message: "Candidate access granted",
        user: req.user
    });
});

router.get("/recruiter-test", protect, recruiterOnly, (req, res) => {
    res.json({
        message: "Recruiter access granted",
        user: req.user
    });
});

module.exports = router;