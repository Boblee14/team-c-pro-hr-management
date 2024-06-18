const logindetails = require("../models/user.models");
const Employee = require("../models/dashboard.models")

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

module.exports = { loginUser, getAllEmployees, addEmployee, updateEmployee, deleteEmployee, getSpecificEmployee };

