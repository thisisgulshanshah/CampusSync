const Timetable = require("../models/Timetable");
const Subject = require("../models/Subject");

// GET /api/timetable?branch=&section=&semester=
const getTimetable = async (req, res) => {
  try {
    const { branch, section, semester, day } = req.query;
    const query = {};
    if (branch) query.branch = branch;
    if (section) query.section = section;
    if (semester) query.semester = semester;
    if (day) query.day = day;

    let result = await Timetable.find(query);
    
    // Sort by day order then period
    const dayOrder = { Monday: 1, Tuesday: 2, Wednesday: 3, Thursday: 4, Friday: 5, Saturday: 6, Sunday: 7 };
    result.sort((a, b) => (dayOrder[a.day] - dayOrder[b.day]) || (a.period - b.period));
    
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// PUT /api/timetable/:id
const updateTimetableEntry = async (req, res) => {
  try {
    const updated = await Timetable.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: "Timetable entry not found" });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// POST /api/timetable
const createTimetableEntry = async (req, res) => {
  try {
    const { branch, section, semester, day, period, subjectId, room, facultyId } = req.body;
    if (!branch || !day || !period) return res.status(400).json({ message: "Branch, day, and period are required" });
    
    const subj = subjectId ? await Subject.findById(subjectId) : null;
    
    const entry = await Timetable.create({
      branch, section: section || "A", semester: semester || "3", day, period,
      subjectId: subjectId || null, subjectCode: subj?.code || "", subjectName: subj?.name || "",
      room: room || "", facultyId: facultyId || null,
    });
    res.status(201).json(entry);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// DELETE /api/timetable/:id
const deleteTimetableEntry = async (req, res) => {
  try {
    const removed = await Timetable.findByIdAndDelete(req.params.id);
    if (!removed) return res.status(404).json({ message: "Timetable entry not found" });
    res.json({ message: "Timetable entry deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = { getTimetable, updateTimetableEntry, createTimetableEntry, deleteTimetableEntry };
