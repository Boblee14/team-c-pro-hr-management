const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  employeeId: { type: String, required: true},
  date: { type: Date, required: true },
  status: { type: String, enum: ['Present', 'Absent', 'CL', 'ML'] },
  leaveType: { type: String, enum: ['CL', 'ML'], default: 'CL' }
});

attendanceSchema.index({ employeeId: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('Attendance', attendanceSchema);
