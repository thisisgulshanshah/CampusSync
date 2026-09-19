const mongoose = require('mongoose');

const timetableSchema = new mongoose.Schema({
  _id: { type: String },
  branch: { type: String, required: true },
  section: { type: String, required: true },
  semester: { type: String, required: true },
  day: { type: String, required: true },
  period: { type: Number, required: true },
  subjectId: { type: String },
  subjectCode: { type: String },
  subjectName: { type: String },
  room: { type: String },
  facultyId: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Timetable', timetableSchema);
