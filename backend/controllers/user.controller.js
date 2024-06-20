const logindetails = require("../models/user.models");
const Employee = require("../models/dashboard.models")
const Attendance = require("../models/attendance.models")

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

const employeeAttendance = async (req, res) => {
  const { employeeId, date, status } = req.body;
  try {
    const attendance = new Attendance({ employeeId, date, status });
    await attendance.save();

    if (status === 'CL') {
      await Employee.findByIdAndUpdate(employeeId, { $inc: { cl: 1 } });
    } else if (status === 'ML') {
      await Employee.findByIdAndUpdate(employeeId, { $inc: { ml: 1 } });
    }

    res.status(201).send(attendance);
  } catch (error) {
    res.status(500).send({ error: 'Error recording attendance' });
  }
}

const specificEmployeeAttendance = async (req, res) => {
  const { employeeId } = req.params;
  try {
    const attendanceRecords = await Attendance.find({ employeeId }).sort({ date: 1 });
    res.send(attendanceRecords);
  } catch (error) {
    res.status(500).send({ error: 'Error fetching attendance records' });
  }
}

const salaryDetails =  async (req, res) => {
  const { employeeId } = req.params;
  try {
    const attendanceRecords = await Attendance.find({ employeeId }).sort({ date: 1 });
    const employee = await Employee.findById(employeeId);
    
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

    const totalPaidDays = workingDays + clDays;
    const totalUnpaidDays = mlDays + absentDays;
    const totalSalary = totalPaidDays * dailySalary;

    res.send({ 
      employeeId,
      workingDays,
      clDays,
      mlDays,
      absentDays,
      totalPaidDays,
      totalUnpaidDays,
      totalSalary,
    });
  } catch (error) {
    res.status(500).send({ error: 'Error calculating salary' });
  }
}

module.exports = { loginUser, getAllEmployees, addEmployee, updateEmployee, deleteEmployee, getSpecificEmployee, employeeAttendance, specificEmployeeAttendance, salaryDetails };

