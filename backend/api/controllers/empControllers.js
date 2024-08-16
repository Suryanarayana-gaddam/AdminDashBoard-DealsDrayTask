const Employee = require("../models/Employee");
const User = require("../models/User");
const {ObjectId} = require("mongodb")

const AddEmployee = async (req,res) => {
  try{
      const empData = req.body;
      const username = req.params.username;
      const existingEmployee = await Employee.findOne({empName:empData.empName});
      if(existingEmployee){
        return res.status(403).json(`Employee with ${empData.email} exists, please enter another email!`)
      }
      const newEmployee = await Employee.create(empData);
      console.log("new :",newEmployee)
      if(!newEmployee){
          return res.status(501).json("Error creating new employee!")
      }
      return res.status(200).json(newEmployee);
      
  }catch(error){
      res.status(500).json({message : "Internal server error!"})
  }
  }

  const GetEmployee = async (req,res) => {
    try {
    const EmployeeId = req.params.employeeId;
    const EmployeeDetails = await Employee.findOne({_id : new ObjectId(EmployeeId)});
    console.log(EmployeeDetails)
    if(!EmployeeDetails){
      return res.status(404).json("No Employee exists with that id!");
    }
    res.status(200).json(EmployeeDetails);
    } catch (error) {
    res.status(500).json("Internal server error!");
    }
    }
    const UpdateEmployee = async (req,res) => {
    try {
    const EmployeeId = req.params.employeeId;
    const empData = req.body;
    const UpdatedEmployee = await Employee.findOneAndUpdate(
      {_id : new ObjectId(EmployeeId)},
      {$set: {...empData}},
      {upsert:true}
    );
    console.log(UpdatedEmployee) 
    if(!UpdatedEmployee){
      return res.status(501).json("Error in updating the employee!");
    }
    res.status(200).json(UpdatedEmployee);
    } catch (error) {
    res.status(500).json("Internal server error!");
    }
  }
   const GetAllEmployees = async (req,res) => {
    try {
    const username = req.params.username;
    const Employees = await Employee.find({});
    if(!Employees){
      return res.status(404).json("No Employees exists!");
    }
    res.status(200).json(Employees);
    } catch (error) {
    res.status(500).json("Internal server error!");
    }
  }
  const DeleteEmployee = async (req,res) => {
    try {
    const EmployeeId = req.params.employeeId;
    const DeletedEmployee = await Employee.deleteOne({_id : new ObjectId(EmployeeId)});
    if(!DeletedEmployee){
      res.status(501).json("Error deleting the employee!");
    }
    res.status(200).json(DeletedEmployee)
    } catch (error) {
    res.status(500).json("Internal server error!")
    }
  }

module.exports = {AddEmployee,GetEmployee,UpdateEmployee,GetAllEmployees,DeleteEmployee}