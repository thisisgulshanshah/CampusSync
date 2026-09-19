const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema(
  {
    _id: { type: String },
    userId: { type: String, ref: "User" },
    name: { type: String, required: true, trim: true },
    rollNo: { type: String, required: true, unique: true, trim: true },
    branch: { type: String, trim: true },
    section: { type: String, trim: true },
    semester: { type: String, trim: true },
    gender: { type: String, trim: true },
    email: { type: String, trim: true, lowercase: true },
    contact: { type: String, trim: true },
    dob: { type: String, trim: true },
    parentalEducation: { type: String, trim: true },
    lunchType: { type: String, trim: true },
    testPrepStatus: { type: String, trim: true },
    feeStatus: {
      type: String,
      enum: ["paid", "pending", "overdue"],
      default: "pending",
    },
    feeAmount: { type: Number, default: 0 },
    grade: { type: String, default: "" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Student", studentSchema);
