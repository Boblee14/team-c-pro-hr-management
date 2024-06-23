const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  employeeId: { type: String, required: true, unique: true },
  date: Date,
  status: { type: String, enum: ['Present', 'Absent', 'CL', 'ML'] }
});

module.exports = mongoose.model('Attendance', attendanceSchema);
