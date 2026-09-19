// Populates the DB with data from dataStore.js
// Run with: npm run seed

require("dotenv").config();
const mongoose = require("mongoose");
const connectDB = require("./config/db");
const dataStore = require("./dataStore");

const User = require("./models/User");
const Student = require("./models/Student");
const Attendance = require("./models/Attendance");
const Subject = require("./models/Subject");
const Marks = require("./models/Marks");
const Timetable = require("./models/Timetable");
const Notification = require("./models/Notification");
const AttendanceRequest = require("./models/AttendanceRequest");
const MessMenu = require("./models/MessMenu");

const seed = async () => {
  try {
    await connectDB();

    console.log("Clearing existing data...");
    await User.deleteMany({});
    await Student.deleteMany({});
    await Attendance.deleteMany({});
    await Subject.deleteMany({});
    await Marks.deleteMany({});
    await Timetable.deleteMany({});
    await Notification.deleteMany({});
    await AttendanceRequest.deleteMany({});
    await MessMenu.deleteMany({});

    console.log("Migrating Users...");
    await User.insertMany(dataStore.users);

    console.log("Migrating Subjects...");
    await Subject.insertMany(dataStore.subjects);

    console.log("Migrating Students...");
    await Student.insertMany(dataStore.students);

    console.log("Migrating Marks...");
    // Mongoose insertMany might have memory issues for large arrays, but 6000 marks is small enough
    await Marks.insertMany(dataStore.marks);

    console.log("Migrating Attendance...");
    // 30,000 attendance records, let's chunk it to be safe
    const chunkSize = 5000;
    for (let i = 0; i < dataStore.attendance.length; i += chunkSize) {
      await Attendance.insertMany(dataStore.attendance.slice(i, i + chunkSize));
      console.log(`  Inserted ${Math.min(i + chunkSize, dataStore.attendance.length)} / ${dataStore.attendance.length} attendance records`);
    }

    console.log("Migrating Timetable...");
    await Timetable.insertMany(dataStore.timetable);

    console.log("Migrating Notifications...");
    await Notification.insertMany(dataStore.notifications);

    console.log("Migrating Attendance Requests...");
    await AttendanceRequest.insertMany(dataStore.attendanceRequests);

    console.log("Migrating Mess Menu...");
    await MessMenu.insertMany(dataStore.messMenu);

    console.log("\nSeed complete! All in-memory data migrated to MongoDB.");
    console.log("Login credentials:");
    console.log("  Admin:   admin@campussync.edu / admin123");
    console.log("  Faculty: prof.sharma@campussync.edu / faculty123");
    console.log("  TA:      ta.priya@campussync.edu / ta123456");
    
    mongoose.connection.close();
  } catch (error) {
    console.error("Migration failed:", error);
    process.exit(1);
  }
};

seed();
