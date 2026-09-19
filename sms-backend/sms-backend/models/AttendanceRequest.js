const mongoose = require('mongoose');

const attendanceRequestSchema = new mongoose.Schema({
  _id: { type: String, default: () => new mongoose.Types.ObjectId().toString() },
  studentId: { type: String, required: true },
  studentName: { type: String },
  rollNo: { type: String },
  eventName: { type: String, required: true },
  eventDate: { type: String, required: true },
  reason: { type: String, required: true },
  status: { type: String, default: "pending_ta" },
  taReviewedBy: { type: String, default: null },
  facultyApprovedBy: { type: String, default: null }
}, { timestamps: true });

module.exports = mongoose.model('AttendanceRequest', attendanceRequestSchema);
