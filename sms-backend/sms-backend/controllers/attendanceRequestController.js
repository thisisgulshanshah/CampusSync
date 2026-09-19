const AttendanceRequest = require("../models/AttendanceRequest");
const Student = require("../models/Student");
const Attendance = require("../models/Attendance");

// GET /api/attendance-requests?status=&studentId=
const getAttendanceRequests = async (req, res) => {
  try {
    const { status, studentId } = req.query;
    const query = {};
    if (status) query.status = status;
    if (studentId) query.studentId = studentId;
    
    const requests = await AttendanceRequest.find(query).sort({ createdAt: -1 });
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// POST /api/attendance-requests — Student creates a request
const createRequest = async (req, res) => {
  try {
    const { studentId, eventName, eventDate, reason } = req.body;
    if (!studentId || !eventName || !eventDate) {
      return res.status(400).json({ message: "studentId, eventName, and eventDate are required" });
    }
    
    const student = await Student.findOne({ _id: studentId });
    
    const request = await AttendanceRequest.create({
      studentId, 
      studentName: student?.name || "Unknown", 
      rollNo: student?.rollNo || "",
      eventName, 
      eventDate, 
      reason: reason || "college_function",
      status: "pending_ta", 
      taReviewedBy: null, 
      facultyApprovedBy: null
    });
    res.status(201).json(request);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// PUT /api/attendance-requests/:id/ta-review — TA reviews and forwards to faculty
const taReview = async (req, res) => {
  try {
    const { action, taId } = req.body; // action: "forward" or "reject"
    const request = await AttendanceRequest.findById(req.params.id);
    if (!request) return res.status(404).json({ message: "Request not found" });
    if (request.status !== "pending_ta") return res.status(400).json({ message: "Request is not pending TA review" });

    if (action === "forward") {
      request.status = "pending_faculty";
    } else {
      request.status = "rejected";
    }
    request.taReviewedBy = taId || "user-ta-001";
    
    await request.save();
    res.json(request);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// PUT /api/attendance-requests/:id/faculty-approve — Faculty final approval
const facultyApprove = async (req, res) => {
  try {
    const { action, facultyId } = req.body; // action: "approve" or "reject"
    const request = await AttendanceRequest.findById(req.params.id);
    if (!request) return res.status(404).json({ message: "Request not found" });
    if (request.status !== "pending_faculty") return res.status(400).json({ message: "Request is not pending faculty approval" });

    if (action === "approve") {
      request.status = "approved";
      request.facultyApprovedBy = facultyId || "user-faculty-001";
      await request.save();
      
      // Mark attendance as compensated for that date
      const existingAtt = await Attendance.findOne({
        studentId: request.studentId,
        date: new Date(request.eventDate),
        status: "absent"
      });
      
      if (existingAtt) {
        existingAtt.status = "compensated";
        existingAtt.compensationReason = request.eventName;
        existingAtt.approvedBy = facultyId;
        await existingAtt.save();
      } else {
        await Attendance.create({
          studentId: request.studentId, 
          subjectId: null, 
          date: new Date(request.eventDate),
          status: "compensated", 
          compensationReason: request.eventName, 
          approvedBy: facultyId
        });
      }
    } else {
      request.status = "rejected";
      request.facultyApprovedBy = facultyId || "user-faculty-001";
      await request.save();
    }
    res.json(request);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = { getAttendanceRequests, createRequest, taReview, facultyApprove };
