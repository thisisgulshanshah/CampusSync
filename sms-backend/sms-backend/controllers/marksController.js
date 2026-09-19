const Marks = require("../models/Marks");
const Student = require("../models/Student");
const Subject = require("../models/Subject");

// GET /api/marks?studentId=&subjectId=&semester=
const getMarks = async (req, res) => {
  try {
    const { studentId, subjectId, semester } = req.query;
    const query = {};
    if (studentId) query.studentId = studentId;
    if (subjectId) query.subjectId = subjectId;
    if (semester) query.semester = semester;
    const marks = await Marks.find(query);
    res.json(marks);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// GET /api/marks/student/:studentId
const getStudentMarks = async (req, res) => {
  try {
    const marks = await Marks.find({ studentId: req.params.studentId });
    res.json(marks);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// GET /api/marks/subject/:subjectId — all students' marks for a subject
const getSubjectMarks = async (req, res) => {
  try {
    const { page = 1, limit = 50 } = req.query;
    const allMarks = await Marks.find({ subjectId: req.params.subjectId });
    
    // Enrich with student info
    const enriched = await Promise.all(allMarks.map(async (m) => {
      const student = await Student.findOne({ _id: m.studentId });
      return { 
        ...m.toObject(), 
        studentName: student?.name, 
        rollNo: student?.rollNo, 
        branch: student?.branch, 
        section: student?.section 
      };
    }));
    
    const start = (parseInt(page) - 1) * parseInt(limit);
    const paginated = enriched.slice(start, start + parseInt(limit));
    res.json({ 
      marks: paginated, 
      total: enriched.length, 
      page: parseInt(page), 
      totalPages: Math.ceil(enriched.length / parseInt(limit)) 
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// POST /api/marks — create or update marks
const upsertMarks = async (req, res) => {
  try {
    const { studentId, subjectId, midSem1, midSem2, endSem, internal, semester } = req.body;
    if (!studentId || !subjectId) return res.status(400).json({ message: "studentId and subjectId are required" });

    const existing = await Marks.findOne({ studentId, subjectId });
    const subj = await Subject.findById(subjectId);
    
    const numMidSem1 = midSem1 !== undefined ? midSem1 : (existing?.midSem1 || 0);
    const numMidSem2 = midSem2 !== undefined ? midSem2 : (existing?.midSem2 || 0);
    const numEndSem = endSem !== undefined ? endSem : (existing?.endSem || 0);
    const numInternal = internal !== undefined ? internal : (existing?.internal || 0);
    
    const total = numMidSem1 + numMidSem2 + numEndSem + numInternal;
    const grade = calcGrade(total);

    if (existing) {
      existing.midSem1 = numMidSem1;
      existing.midSem2 = numMidSem2;
      existing.endSem = numEndSem;
      existing.internal = numInternal;
      existing.total = total;
      existing.grade = grade;
      if (semester) existing.semester = semester;
      await existing.save();
      return res.json(existing);
    }

    const mark = await Marks.create({
      studentId, subjectId, subjectCode: subj?.code || "", subjectName: subj?.name || "",
      midSem1: numMidSem1, midSem2: numMidSem2, endSem: numEndSem, internal: numInternal,
      total, grade, semester: semester || "3",
    });
    res.status(201).json(mark);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// PUT /api/marks/:id — update specific marks record
const updateMarks = async (req, res) => {
  try {
    const existing = await Marks.findById(req.params.id);
    if (!existing) return res.status(404).json({ message: "Marks record not found" });

    const midSem1 = req.body.midSem1 ?? existing.midSem1;
    const midSem2 = req.body.midSem2 ?? existing.midSem2;
    const endSem = req.body.endSem ?? existing.endSem;
    const internal = req.body.internal ?? existing.internal;
    const total = midSem1 + midSem2 + endSem + internal;

    existing.midSem1 = midSem1;
    existing.midSem2 = midSem2;
    existing.endSem = endSem;
    existing.internal = internal;
    existing.total = total;
    existing.grade = calcGrade(total);
    Object.assign(existing, req.body); // override any other simple fields

    await existing.save();
    res.json(existing);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

function calcGrade(total) {
  if (total >= 90) return "A+";
  if (total >= 80) return "A";
  if (total >= 70) return "B+";
  if (total >= 60) return "B";
  if (total >= 50) return "C+";
  if (total >= 40) return "C";
  if (total >= 30) return "D";
  return "F";
}

module.exports = { getMarks, getStudentMarks, getSubjectMarks, upsertMarks, updateMarks };
