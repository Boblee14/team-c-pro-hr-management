
const logindetails = require("../models/user.models");

const loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await logindetails.findOne({ email });
        if(!email){
            return res.status(400).json("Enter a valid Email")
        }
        if (!user) {
            return res.status(400).json({ message: "Email doesn't exist - Enter a registered Email" });
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

module.exports = { loginUser };
