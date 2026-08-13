const express = require("express");
const sendEmail = require("../utils/sendEmail");
const generateVerificationToken = require("../utils/generateVerificationToken");

const router = express.Router();

router.get("/", async (req, res) => {
    try {
        await sendEmail({
            to: "maharjanashwin77@gmail.com",
            subject: "HireFlow Email Test",
            html: `
                <h1>Hello from HireFlow!</h1>
                <p>This is a test email from your HireFlow backend.</p>
            `,
        });

        res.status(200).json({
            success: true,
            message: "Test email sent successfully",
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to send test email",
            error: error.message,
        });
    }
});

router.get("/token", (req, res) => {
    const token = generateVerificationToken();

    res.status(200).json({
        success: true,
        token: token
    });
});

module.exports = router;