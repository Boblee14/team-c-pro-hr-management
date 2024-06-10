
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
  
  // Add new employee
  const addEmployee = async (req, res) => {

    try {
      const profilePicture = req.file.filename
      const { employeeId, name, address, role, salary } = req.body;
      console.log(profilePicture)
    //   if (!req.files || !req.files['proofFile'] || !req.files['profilePicture']) {
    //     return res.status(400).send('Missing required file uploads');
        
    // }
      // const proofFile = req.files['proofFile'][0].buffer.toString('base64');
      // const profilePicture = req.files['profilePicture'][0].buffer.toString('base64');

      // const proofFileBuffer = req.files['proofFile'] ? req.files['proofFile'][0].buffer : undefined;
      // const profilePictureBuffer = req.files['profilePicture'] ? req.files['profilePicture'][0].buffer : undefined;

      // if (!proofFileBuffer || !profilePictureBuffer) {
      //   return res.status(400).send('Missing required file uploads');
      // }

      // const proofFile = proofFileBuffer.toString('base64');
      // const profilePicture = profilePictureBuffer.toString('base64');

  
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

module.exports = { loginUser,getAllEmployees, addEmployee };
