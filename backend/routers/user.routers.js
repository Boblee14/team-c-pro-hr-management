const express = require("express")
const router = express.Router()
const { loginUser, addEmployee, getAllEmployees } = require("../controllers/user.controller");
const multer = require('multer');


const storage = multer.memoryStorage();
const upload = multer({ dest: 'uploads/' });

router.post("/login", loginUser);

router.get('/employees', getAllEmployees);

router.post('/employees', upload.fields([{ name: 'proofFile' }, { name: 'profilePicture' }]), addEmployee);




module.exports = router 