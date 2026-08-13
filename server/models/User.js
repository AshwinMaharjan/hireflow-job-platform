const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    verificationToken: {
    type: String,
},

verificationTokenExpires: {
    type: Date,
},
    role: {
      type: String,
      enum: ["candidate", "recruiter"],
      default: "candidate",
    },

    skills: {
      type: [String],
      default: [],
    },
    savedJobs: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "Job",
      default: [],
    },
  },

  {
    timestamps: true,
  },
);

module.exports = mongoose.model("User", userSchema);
