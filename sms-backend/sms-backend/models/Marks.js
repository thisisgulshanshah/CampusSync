const mongoose = require('mongoose');

const marksSchema = new mongoose.Schema({
  _id: { type: String, default: () => new mongoose.Types.ObjectId().toString() },
  studentId: { type: String, required: true }, // 'student-0001'
  subjectId: { type: String, required: true }, // 'subject-001'
  subjectCode: { type: String },
  subjectName: { type: String },
  midSem1: { type: Number, default: 0 },
  midSem2: { type: Number, default: 0 },
  endSem: { type: Number, default: 0 },
  internal: { type: Number, default: 0 },
  total: { type: Number, default: 0 },
  grade: { type: String, default: "F" },
  semester: { type: String, default: "3" }
}, { timestamps: true });

module.exports = mongoose.model('Marks', marksSchema);
