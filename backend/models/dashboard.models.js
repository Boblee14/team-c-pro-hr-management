const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
  employeeId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  address: { type: String, required: true },
  role: { type: String, required: true },
  salary: { type: Number, required: true },
  profilePicture: { type: String, required: true },
  cl: { type: Number, default: 0, required: true },
  ml: { type: Number, default: 0, required: true }
});

const Employee = mongoose.model('Employee', employeeSchema);

module.exports = Employee;
