const express = require("express")
const router = express.Router()
const { loginUser, addEmployee, getAllEmployees } = require("../controllers/user.controller");
const multer = require('multer');
const fs = require('fs');

// const storage = multer.memoryStorage();
// const upload = multer({ dest: 'uploads/' });

// const fs = require('fs');
// const path = require('path');

// const uploadDirectory = path.join(__dirname, 'uploads');
// if (!fs.existsSync(uploadDirectory)) {
//     fs.mkdirSync(uploadDirectory);
// }

const storage = multer.diskStorage({
    destination: function(req, file, cb){
        const destDir = "../frontend/pro-hr/public/images/";
        fs.mkdirSync(destDir, { recursive: true }); // Create directory recursively if it doesn't exist
        cb(null, destDir);
    },
    filename: function(req, file, cb){
        const uniqueSuffix = Date.now() 
        cb(null, uniqueSuffix + file.originalname)
    }
})
const upload = multer({storage: storage })

router.post("/login", loginUser);

router.get('/employees', getAllEmployees);

// router.post('/employees', upload.fields([{ name: 'proofFile' }, { name: 'profilePicture' }]), addEmployee);

router.post('/employees', upload.single('profilePicture' ), addEmployee);




module.exports = router 