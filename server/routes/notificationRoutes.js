const express = require("express");
const router = express.Router();

const { getMyNotifications,markNotificationAsRead,markAllNotificationsAsRead,getUnreadNotificationCount } = require("../controllers/notificationController");
const { protect } = require("../middleware/authMiddleware");


router.get("/", protect, getMyNotifications);
router.get("/unread-count", protect, getUnreadNotificationCount);
router.patch("/read-all", protect, markAllNotificationsAsRead);
router.patch("/:id/read", protect, markNotificationAsRead);

module.exports = router;