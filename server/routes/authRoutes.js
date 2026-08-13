const express = require("express");

const {
    registerUser,
    verifyEmail,
    loginUser
} = require("../controllers/authController");

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/verify-email/:token", verifyEmail);

module.exports = router;