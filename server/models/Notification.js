const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    title: {
      type: String,
      required: true,
    },

    message: {
      type: String,
      required: true,
    },

    type: {
      type: String,
      enum: [
        "APPLICATION_APPROVED",
        "APPLICATION_REJECTED",
        "APPLICATION_REVIEWED",
      ],
      required: true,
    },

    isRead: {
      type: Boolean,
      default: false,
    },

    relatedJob: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
    },

    relatedApplication: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Application",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Notification", notificationSchema);