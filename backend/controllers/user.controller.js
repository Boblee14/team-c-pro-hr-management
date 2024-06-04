
const logindetails = require("../models/user.models");

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

module.exports = { loginUser };
