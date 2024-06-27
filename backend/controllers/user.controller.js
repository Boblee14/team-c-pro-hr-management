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

const salaryDetails =  async (req, res) => {
  const { employeeId } = req.params;
  const { month, year } = req.query;
  try {
    const attendanceRecords = await Attendance.find({ 
      employeeId,
      date: {
        $gte: new Date(year, month - 1, 1),
        $lt: new Date(year, month, 1)
      }
    });
    const employee = await Employee.findOne({ employeeId: employeeId });
    
    if (!employee) {
      return res.status(404).send({ error: 'Employee not found' });
    }

    const dailySalary = employee.salary / 30; 
    let workingDays = 0;
    let clDays = 0;
    let mlDays = 0;
    let absentDays = 0;
      
    attendanceRecords.forEach(record => {
      if (record.status === 'Present') {
        workingDays++;
      } else if (record.status === 'CL') {
        clDays++;
      } else if (record.status === 'ML') {
        mlDays++;
      } else if (record.status === 'Absent') {
        absentDays++;
      }
    });

    const totalDays = workingDays + clDays+mlDays;
    const totalPaidDays = workingDays ;
    const totalUnpaidDays = mlDays + absentDays + clDays;
    const totalSalary = totalPaidDays * dailySalary;

    res.send({ 
      employeeId,
      employeeSalary : employee.salary,
      totalDays,
      workingDays,
      clDays,
      mlDays,
      absentDays,
      totalPaidDays,
      totalUnpaidDays,
      totalSalary,
    });
  } catch (error) {
    console.log(error)
    res.status(500).send({ error: 'Error calculating salary backend' });
  }
}

const generateSalarySlip = async (req, res) => {
  const { employeeId } = req.params;
  const { month, year } = req.query;

  try {
    const employee = await Employee.findOne({ employeeId });
    if (!employee) {
      return res.status(404).send({ error: 'Employee not found' });
    }

    const attendanceRecords = await Attendance.find({
      employeeId,
      date: {
        $gte: new Date(year, month - 1, 1),
        $lt: new Date(year, month, 1),
      },
    });

    const dailySalary = employee.salary / 30;
    let workingDays = 0;
    let clDays = 0;
    let mlDays = 0;
    let absentDays = 0;

    attendanceRecords.forEach(record => {
      if (record.status === 'Present') {
        workingDays++;
      } else if (record.status === 'CL') {
        clDays++;
      } else if (record.status === 'ML') {
        mlDays++;
      } else if (record.status === 'Absent') {
        absentDays++;
      }
    });

    const totalPaidDays = workingDays + clDays;
    const totalSalary = totalPaidDays * dailySalary;
    const directoryPath = path.join(__dirname, '..', 'salary_slips');
    if (!fs.existsSync(directoryPath)) {
      fs.mkdirSync(directoryPath);
    }

    const doc = new PDFDocument();
    const filename = `Salary_Slip_${employeeId}_${month}_${year}.pdf`;
    const filepath = path.join(directoryPath, filename);
    const writeStream = fs.createWriteStream(filepath);
    doc.pipe(writeStream);

    doc.pipe(fs.createWriteStream(filepath));

    doc.fontSize(20).text('Salary Slip', { align: 'center' });
    doc.fontSize(16).text(`Employee ID: ${employeeId}`, 100, 100);
    doc.fontSize(16).text(`Name: ${employee.name}`, 100, 120);
    doc.fontSize(16).text(`Month: ${month}`, 100, 140);
    doc.fontSize(16).text(`Year: ${year}`, 100, 160);
    doc.fontSize(16).text(`Base Salary: ${employee.salary}`, 100, 180);
    doc.fontSize(16).text(`Total Paid Days: ${totalPaidDays}`, 100, 200);
    doc.fontSize(16).text(`Total Salary: ${totalSalary}`, 100, 220);

    doc.end();

    writeStream.on('finish', () => {
      res.download(filepath, filename, (err) => {
        if (err) {
          console.error('Error sending file:', err);
          res.status(500).send({ error: 'Error sending salary slip' });
        } else {
          console.log('File sent successfully:', filepath);
        }
      });
    });
  } catch (error) {
    console.error('Error generating salary slip:', error);
    res.status(500).send({ error: 'Error generating salary slip' });
  }
};


module.exports = { loginUser, getAllEmployees, addEmployee, updateEmployee, deleteEmployee, getSpecificEmployee, employeeAttendance, viewAttendanceByDate, salaryDetails, generateSalarySlip };

