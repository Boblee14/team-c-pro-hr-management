const express = require("express");
const router = express.Router();
const { loginUser, addEmployee, getAllEmployees, updateEmployee, deleteEmployee } = require("../controllers/user.controller");
const multer = require('multer');
const fs = require('fs');

const storage = multer.diskStorage({
    destination: function(req, file, cb){
        const destDir = "../frontend/pro-hr/public/images/";
        fs.mkdirSync(destDir, { recursive: true }); 
        cb(null, destDir);
    },
    filename: function(req, file, cb){
        const uniqueSuffix = Date.now();
        cb(null, uniqueSuffix + file.originalname);
    }
});
const upload = multer({ storage: storage });

router.post("/login", loginUser);

router.get('/employees', getAllEmployees);

router.post('/employees', upload.single('profilePicture'), addEmployee);

router.put('/employees/:id', upload.single('profilePicture'), updateEmployee);

router.delete('/employees/:id', deleteEmployee);

module.exports = router;
