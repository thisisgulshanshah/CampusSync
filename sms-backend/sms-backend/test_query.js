require('dotenv').config();
const mongoose = require('mongoose');
const Timetable = require('./models/Timetable');

mongoose.connect(process.env.MONGO_URI).then(async () => {
  const t = await Timetable.find({ branch: 'CSE', section: 'A' });
  console.log('Count:', t.length);
  console.log('Sample:', t[0]);
  mongoose.connection.close();
});
