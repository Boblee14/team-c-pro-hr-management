const User = require("../models/user.models");
const Employee = require("../models/dashboard.models");
const Attendance = require("../models/attendance.models");
const mongoose = require('mongoose');
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

const loginUser = async (req, res) => {
    const { username, password } = req.body;
    try {
        if (!username || !password) {
            return res.status(400).json({ message: "Please provide both username and password" });
        }

        const user = await User.findOne({ username });
        if (!user) {
            return res.status(404).json({ message: "Username not found - Enter a registered username" });
        }

        if (password !== user.password) {
            return res.status(401).json({ message: "Incorrect password" });
        }

        console.log("Login successful");
        return res.status(200).json({ message: "Login successful", user });
    } catch (error) {
        console.error('Error during login:', error);
        return res.status(500).json({ message: "Error during login" });
    }
};

const getAllEmployees = async (req, res) => {
    try {
        const employees = await Employee.find();
        res.json(employees);
    } catch (error) {
        console.error('Error fetching employees:', error);
        res.status(500).json({ message: "Error fetching employees" });
    }
};

const addEmployee = async (req, res) => {
    try {
        const { employeeId, name, address, role, salary } = req.body;
        const profilePicture = req.file ? req.file.filename : null;

        const newEmployee = new Employee({
            employeeId,
            name,
            address,
            role,
            salary,
            profilePicture
        });

        await newEmployee.save();
        res.status(201).json({ message: 'Employee added successfully', newEmployee });
    } catch (error) {
        console.error('Error adding employee:', error);
        res.status(500).json({ message: "Error adding employee details" });
    }
};

const getSpecificEmployee = async (req, res) => {
    const { id } = req.params;
    try {
        const employee = await Employee.findById(id);
        if (!employee) {
            return res.status(404).json({ message: 'Employee not found' });
        }
        res.json(employee);
    } catch (error) {
        console.error('Error fetching specific employee:', error);
        res.status(500).json({ message: "Error fetching employee details" });
    }
};

const updateEmployee = async (req, res) => {
    const { id } = req.params;
    const { employeeId, name, address, role, salary, profilePicture } = req.body;
    try {
        const updatedEmployee = await Employee.findByIdAndUpdate(
            id,
            { employeeId, name, address, role, salary, profilePicture },
            { new: true, runValidators: true }
        );

        if (!updatedEmployee) {
            return res.status(404).json({ message: "Employee not found" });
        }

        res.json({ message: "Employee updated successfully", updatedEmployee });
    } catch (error) {
        console.error('Error updating employee:', error);
        res.status(500).json({ message: "Error updating employee" });
    }
};

const deleteEmployee = async (req, res) => {
    const { id } = req.params;
    try {
        const deletedEmployee = await Employee.findByIdAndDelete(id);
        if (!deletedEmployee) {
            return res.status(404).json({ message: "Employee not found" });
        }
        res.json({ message: "Employee deleted successfully" });
    } catch (error) {
        console.error('Error deleting employee:', error);
        res.status(500).json({ message: "Error deleting employee" });
    }
};

const recordEmployeeAttendance = async (req, res) => {
    const { records } = req.body;
    try {
        const bulkOps = records.map((record) => ({
            updateOne: {
                filter: { employeeId: record.employeeId, date: record.date },
                update: { $set: record },
                upsert: true,
            },
        }));

        await Attendance.bulkWrite(bulkOps);
        res.status(201).json({ message: 'Attendance recorded successfully' });
    } catch (error) {
        console.error('Error recording attendance:', error);
        res.status(500).json({ message: 'Error recording attendance' });
    }
};

const viewAttendanceByDate = async (req, res) => {
    const { date } = req.params;
    const startOfDay = new Date(date);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    try {
        const attendanceRecords = await Attendance.find({
            date: { $gte: startOfDay, $lte: endOfDay }
        }).populate('employeeId', 'name');

        if (attendanceRecords.length === 0) {
            return res.status(404).json({ error: 'No attendance records found for this date' });
        }

        res.status(200).json(attendanceRecords);
    } catch (error) {
        console.error('Error fetching attendance records:', error);
        res.status(500).json({ error: 'Error fetching attendance records' });
    }
};

const calculateSalaryDetails = async (req, res) => {
    const { employeeId } = req.params;
    const { month, year } = req.query;

    try {
        const employee = await Employee.findOne({ employeeId });
        if (!employee) {
            return res.status(404).json({ error: 'Employee not found' });
        }

        const attendanceRecords = await Attendance.find({
            employeeId,
            date: {
                $gte: new Date(`${year}-${month}-01`),
                $lt: new Date(`${year}-${parseInt(month) + 1}-01`)
            }
        });

        const workingDays = attendanceRecords.filter(record => record.status === 'Present').length;
        const clDays = attendanceRecords.filter(record => record.leaveType === 'CL').length;
        const mlDays = attendanceRecords.filter(record => record.leaveType === 'ML').length;

        const excessCL = clDays > 2 ? clDays - 2 : 0;
        const excessML = mlDays > 2 ? mlDays - 2 : 0;

        const excessCLPayoff = excessCL * 1000;
        const excessMLPayoff = excessML * 500;

        const baseSalary = employee.salary;
        const totalSalary = baseSalary - excessCLPayoff - excessMLPayoff;

        const salaryDetails = {
            employeeSalary: baseSalary,
            workingDays,
            clDays,
            mlDays,
            excessCLPayoff,
            excessMLPayoff,
            totalSalary,
        };

        res.json(salaryDetails);
    } catch (error) {
        console.error('Error calculating salary:', error);
        res.status(500).json({ error: 'Error calculating salary' });
    }
};

const generateSalarySlip = async (req, res) => {
    const { employeeId } = req.params;
    const { month, year } = req.query;

    try {
        const salaryDetailsResult = await calculateSalaryDetails(employeeId, month, year);
        if (!salaryDetailsResult) {
            return res.status(404).json({ error: 'Salary details not found' });
        }

        const { employeeSalary, workingDays, clDays, mlDays, excessCLPayoff, excessMLPayoff, totalSalary } = salaryDetailsResult;

        const employee = await Employee.findOne({ employeeId });
        if (!employee) {
            return res.status(404).json({ error: 'Employee not found' });
        }

        const doc = new PDFDocument();
        let filename = `salary_slip_${employee.employeeId}_${month}_${year}.pdf`;
        filename = encodeURIComponent(filename);

        res.setHeader('Content-disposition', `attachment; filename="${filename}"`);
        res.setHeader('Content-type', 'application/pdf');

        doc.pipe(res);

        doc.fontSize(16).text('Salary Slip', { align: 'center' });
        doc.fontSize(14).text(`Employee ID: ${employee.employeeId}`);
        doc.fontSize(14).text(`Name: ${employee.name}`);
        doc.fontSize(14).text(`Month: ${month}`);
        doc.fontSize(14).text(`Year: ${year}`);

        doc.moveDown();
        doc.fontSize(12).text(`Base Salary: ${employeeSalary}`);
        doc.text(`Working Days: ${workingDays}`);
        doc.text(`CL Days: ${clDays}`);
        doc.text(`ML Days: ${mlDays}`);
        doc.text(`Excess CL Payoff: ${excessCLPayoff}`);
        doc.text(`Excess ML Payoff: ${excessMLPayoff}`);
        doc.text(`Total Salary: ${totalSalary}`);

        doc.end();
    } catch (error) {
        console.error('Error generating salary slip:', error);
        res.status(500).json({ error: 'Error generating salary slip' });
    }
};

module.exports = {
    loginUser,
    getAllEmployees,
    addEmployee,
    updateEmployee,
    deleteEmployee,
    getSpecificEmployee,
    recordEmployeeAttendance,
    viewAttendanceByDate,
    calculateSalaryDetails,
    generateSalarySlip
};
