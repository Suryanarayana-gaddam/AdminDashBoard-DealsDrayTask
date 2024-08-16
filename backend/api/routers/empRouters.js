const express = require("express");
const router = express.Router();

const {AddEmployee, GetEmployee, GetAllEmployees, UpdateEmployee, DeleteEmployee} = require("../controllers/empControllers")

router.get('/get/employee/:employeeId',GetEmployee);
router.get('/get/employees/:username',GetAllEmployees)
router.post("/add/employee/:username",AddEmployee);
router.patch('/update/employee/:employeeId',UpdateEmployee)
router.delete("/delete/employee/:employeeId",DeleteEmployee)

module.exports = router;