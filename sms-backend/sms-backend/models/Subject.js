const mongoose = require('mongoose');

const subjectSchema = new mongoose.Schema({
  _id: { type: String, default: () => new mongoose.Types.ObjectId().toString() },
  code: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  branch: { type: String, default: "ALL" },
  semester: { type: String, default: "3" },
  credits: { type: Number, default: 3 },
  facultyId: { type: String, default: null } // using String to match dataStore logic (e.g. 'user-faculty-001')
}, { timestamps: true });

module.exports = mongoose.model('Subject', subjectSchema);
