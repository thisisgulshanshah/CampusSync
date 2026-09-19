const Subject = require("../models/Subject");
const User = require("../models/User");

// GET /api/subjects
const getSubjects = async (req, res) => {
  try {
    const { branch, semester } = req.query;
    const query = {};
    if (branch) query.branch = { $in: [branch, "ALL"] };
    if (semester) query.semester = semester;
    const subjects = await Subject.find(query);
    res.json(subjects);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// GET /api/subjects/:id
const getSubjectById = async (req, res) => {
  try {
    const subject = await Subject.findById(req.params.id);
    if (!subject) return res.status(404).json({ message: "Subject not found" });
    const faculty = subject.facultyId ? await User.findById(subject.facultyId) : null;
    res.json({ ...subject.toObject(), facultyName: faculty?.name || "Unassigned" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// POST /api/subjects
const createSubject = async (req, res) => {
  try {
    const { code, name, branch, semester, credits, facultyId } = req.body;
    if (!code || !name) return res.status(400).json({ message: "Code and name are required" });
    const existing = await Subject.findOne({ code });
    if (existing) return res.status(400).json({ message: "Subject with this code already exists" });
    const subject = await Subject.create({
      code, name, branch: branch || "ALL", semester: semester || "3",
      credits: credits || 3, facultyId: facultyId || null,
    });
    res.status(201).json(subject);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// PUT /api/subjects/:id
const updateSubject = async (req, res) => {
  try {
    const updated = await Subject.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: "Subject not found" });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// DELETE /api/subjects/:id
const deleteSubject = async (req, res) => {
  try {
    const removed = await Subject.findByIdAndDelete(req.params.id);
    if (!removed) return res.status(404).json({ message: "Subject not found" });
    res.json({ message: "Subject deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = { getSubjects, getSubjectById, createSubject, updateSubject, deleteSubject };
