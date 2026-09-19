const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema(
  {
    _id: { type: String, default: () => new mongoose.Types.ObjectId().toString() },
    studentId: { type: String, ref: "Student", required: true },
    subjectId: { type: String, ref: "Subject" },
    date: { type: String, required: true },
    status: {
      type: String,
      enum: ["present", "absent", "compensated"],
      required: true,
    },
    compensationReason: { type: String },
    approvedBy: { type: String }
  },
  { timestamps: true }
);

// Prevent marking attendance twice for the same student on the same day for same subject
attendanceSchema.index({ studentId: 1, date: 1, subjectId: 1 }, { unique: false });

module.exports = mongoose.model("Attendance", attendanceSchema);
