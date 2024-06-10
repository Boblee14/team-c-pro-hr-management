// models/Employee.js
const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
  employeeId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  address: { type: String, required: true },
  role: { type: String, required: true },
  salary: { type: Number, required: true },
  // proofType: { type: String, required: true },
  // proofFile: { type: String, required: true },
  profilePicture: { type: String, required: true }
});

const Employee = mongoose.model('Employee', employeeSchema);

module.exports = Employee;
