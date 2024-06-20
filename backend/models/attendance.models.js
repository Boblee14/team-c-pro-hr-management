const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  employeeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee' },
  date: Date,
  status: { type: String, enum: ['Present', 'Absent', 'CL', 'ML'] }
});

module.exports = mongoose.model('Attendance', attendanceSchema);
