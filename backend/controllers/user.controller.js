const logindetails = require("../models/user.models");
const Employee = require("../models/dashboard.models")
const Attendance = require("../models/attendance.models")
const mongoose = require('mongoose')
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

const loginUser = async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await logindetails.findOne({ username });
        if(!username){
            return res.status(400).json("Enter a valid username")
        }
        if (!user) {
            return res.status(400).json({ message: "Username doesn't exist - Enter a registered Username" });
        }

        if(password === user.password){
            console.log("Login successful");
            
            return res.status(200).json({message:"Login Successful",result:user})
        }
        return res.status(400).json({ message: "Incorrect Password" });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Error during Login" });
    }
};

const getAllEmployees = async (req, res) => {
    try {
      const employees = await Employee.find();
      res.send(employees);
    } catch (error) {
      res.status(500).send('Error fetching employees');
    }
  };
  

  const addEmployee = async (req, res) => {

    try {
      const profilePicture = req.file.filename
      const { employeeId, name, address, role, salary } = req.body;
      console.log(profilePicture)
  
      const newEmployee = new Employee({
        employeeId,
        name,
        address,
        role,
        salary,
        // proofType,
        // proofFile,
        profilePicture
      });
  
      await newEmployee.save();
      res.send('Employee added successfully');
    } catch (error) {
      res.status(500).send('Error adding employee details');
      console.log(error)
    }
  };

  const getSpecificEmployee=  async (req, res) => {
    const id = req.params.id;
  
    try {
      const employee = await Employee.findById(id);
      if (!employee) {
        return res.status(404).json({ message: 'Employee not found' });
      }
      res.json(employee);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

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
        res.status(500).json({ message: "Error deleting employee" });
    }
};

const employeeAttendance =  async (req, res) => {
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
    res.status(201).send({ message: 'Attendance recorded successfully' });
  } catch (error) {
    console.error('Error recording attendance', error);
    res.status(500).send({ message: 'Error recording attendance' });
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
    });

    if (attendanceRecords.length === 0) {
      return res.status(404).json({ error: 'No attendance records found for this date' });
    }

    const detailedRecords = await Promise.all(
      attendanceRecords.map(async (record) => {
        const employee = await Employee.findOne({ employeeId: record.employeeId });
        return {
          ...record.toObject(),
          name: employee.name
        };
      })
    );

    res.status(200).json(detailedRecords);
  } catch (error) {
    console.error('Error fetching attendance records:', error);
    res.status(500).json({ error: 'Error fetching attendance records' });
  }
};

const salaryDetails = async (req, res) => {
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
    res.status(500).json({ error: 'Error calculating salary' });
  }
};


const generateSalarySlip = async (req, res) => {
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
        $gte: new Date(year, month - 1, 1),
        $lt: new Date(year, month, 1)
      }
    });

    let workingDays = 0;
    let clDays = 0;
    let mlDays = 0;

    attendanceRecords.forEach(record => {
      if (record.status === 'Present') {
        workingDays++;
      } else if (record.status === 'CL') {
        clDays++;
      } else if (record.status === 'ML') {
        mlDays++;
      }
    });

    const clLimit = 2;
    const mlLimit = 2;
    const excessCL = clDays > clLimit ? clDays - clLimit : 0;
    const excessML = mlDays > mlLimit ? mlDays - mlLimit : 0;
    const excessCLPayoff = excessCL * 1000; // Adjust these payoff amounts as needed
    const excessMLPayoff = excessML * 500;  // Adjust these payoff amounts as needed

    const baseSalary = employee.salary;
    const workingDaysPerMonth = 22;
    const dailySalary = baseSalary / workingDaysPerMonth;
    const totalPaidDays = workingDays + Math.min(clDays, clLimit);
    const totalSalary = totalPaidDays * dailySalary - excessCLPayoff - excessMLPayoff;

    const salaryDetails = {
      employeeSalary: baseSalary,
      workingDays,
      clDays,
      mlDays,
      excessCLPayoff,
      excessMLPayoff,
      totalSalary,
      month,
      year
    };

    const doc = new PDFDocument();
    let filename = `Salary_Slip_${employee.employeeId}_${salaryDetails.month}_${salaryDetails.year}.pdf`;
    filename = encodeURIComponent(filename);

    res.setHeader('Content-disposition', `attachment; filename="${filename}"`);
    res.setHeader('Content-type', 'application/pdf');

    doc.pipe(res);

    doc.fontSize(16).text('Salary Slip', { align: 'center' });
    doc.fontSize(14).text(`Employee ID: ${employee.employeeId}`);
    doc.fontSize(14).text(`Name: ${employee.name}`);
    doc.fontSize(14).text(`Month: ${salaryDetails.month}`);
    doc.fontSize(14).text(`Year: ${salaryDetails.year}`);

    doc.moveDown();
    doc.fontSize(12).text(`Base Salary: ${salaryDetails.employeeSalary}`);
    doc.text(`Present Days: ${salaryDetails.workingDays}`);
    doc.text(`CL Days: ${salaryDetails.clDays}`);
    doc.text(`ML Days: ${salaryDetails.mlDays}`);
    doc.text(`Excess CL Payoff: ${salaryDetails.excessCLPayoff}`);
    doc.text(`Excess ML Payoff: ${salaryDetails.excessMLPayoff}`);
    doc.text(`Total Salary: ${salaryDetails.totalSalary}`);

    doc.end();
  } catch (error) {
    res.status(500).json({ error: 'Error generating salary slip' });
  }
};



module.exports = { loginUser, getAllEmployees, addEmployee, updateEmployee, deleteEmployee, getSpecificEmployee, employeeAttendance, viewAttendanceByDate, salaryDetails, generateSalarySlip };

