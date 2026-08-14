const Notification = require("../models/Notification");

// Get all notifications for logged in user
const getMyNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({
      recipient: req.user.userId,
    })
      .sort({ createdAt: -1 })
      .populate("sender", "fullName")
      .populate("relatedJob", "title company");

    res.status(200).json(notifications);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
// Mark a notification as read
const markNotificationAsRead = async (req, res) => {
    try {
        const notification = await Notification.findById(req.params.id);

        if (!notification) {
            return res.status(404).json({
                message: "Notification not found"
            });
        }

        // Ensure users can only update their own notifications
        if (notification.recipient.toString() !== req.user.userId) {
            return res.status(403).json({
                message: "You are not authorized to update this notification"
            });
        }

        notification.isRead = true;

        await notification.save();

        res.status(200).json({
            message: "Notification marked as read",
            notification
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

// Mark all notifications as read
const markAllNotificationsAsRead = async (req, res) => {
    try {
        const result = await Notification.updateMany(
            {
                recipient: req.user.userId,
                isRead: false,
            },
            {
                isRead: true,
            }
        );

        res.status(200).json({
            message: "All notifications marked as read",
            modifiedCount: result.modifiedCount,
        });

    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};
const getUnreadNotificationCount = async (req, res) => {
    try {
        const count = await Notification.countDocuments({
            recipient: req.user.userId,
            isRead: false,
        });

        res.status(200).json({
            unreadCount: count,
        });

    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};
module.exports = {
  getMyNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  getUnreadNotificationCount
};