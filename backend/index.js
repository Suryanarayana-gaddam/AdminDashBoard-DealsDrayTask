const express = require("express");
const app = express();
const cors = require("cors")
require("dotenv").config();
const port = process.env.PORT || 5080;
const bcrypt = require('bcryptjs');

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = process.env.MONGOURI;
const corsOptions = {
  origin:["https://admin-dash-board-api.vercel.app/","https://admin-dash-board-indol-six.vercel.app/"]
}
app.use(cors(corsOptions));

app.use(express.json());

app.get("/", (req,res) => {
    res.send("Hello World!");
})

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    await client.connect();

    const users = client.db("DealsDrayTest").collection("users");
    const employees = client.db("DealsDrayTest").collection("employees");

    app.post("/register-user",async (req,res) => {
        try {
          const {username,password} = req.body;
          console.log("Signup :",username,password)
          const hashedPassword = await bcrypt.hash(password,10);
          const User = await users.insertOne({username,password:hashedPassword,empList:[]});
          if(!User){
            return res.status(501).json("Error creating user!")
          }
          const newUser = await users.findOne({_id : new ObjectId(User.insertedId)});
          res.status(200).json(newUser);
        } catch (error) {
          console.log("Error :",error);
          res.status(500).json("Internal server error!");
        }
    })

    app.post("/login-user",async (req,res) => {
      try{
          const {username,password} = req.body;
          console.log(username,password)
          const UserDetails = await users.findOne({username : username});
          console.log("User:",UserDetails)
          if(!UserDetails){
              return res.status(404).json("User not found! Please Create an account and try again...")
          }
          const passwordMatch = await bcrypt.compare(password,UserDetails.password);
          if(!passwordMatch){
              return res.status(401).json("Password was incorrect!")
          }else{
              console.log(UserDetails)
              return res.status(200).json(UserDetails);
          }
      }catch(error){
          res.status(500).json({message : "Internal server error!"})
      }
  })

    app.post("/add/employee/:username",async (req,res) => {
      try{
          const empData = req.body;
          const username = req.params.username;
          const existingEmployee = await employees.findOne({empName:empData.empName});
          if(existingEmployee){
            return res.status(403).json(`Employee with ${empData.email} exists, please enter another email!`)
          }
          const newEmployee = await employees.insertOne(empData);
          console.log("new :",newEmployee)
          console.log(employees)
          if(!newEmployee){
              return res.status(501).json("Error creating new employee!")
          }
          const empDetails = await employees.findOne({_id : new ObjectId(newEmployee.insertedId)});
          return res.status(200).json(empDetails);
          
      }catch(error){
          res.status(500).json({message : "Internal server error!"})
      }
  })

  app.get('/get/employee/:employeeId', async (req,res) => {
    try {
      const EmployeeId = req.params.employeeId;
      const EmployeeDetails = await employees.findOne({_id : new ObjectId(EmployeeId)});
      console.log(EmployeeDetails)
      if(!EmployeeDetails){
        return res.status(404).json("No Employee exists with that id!");
      }
      res.status(200).json(EmployeeDetails);
    } catch (error) {
      res.status(500).json("Internal server error!");
    }
  })

  app.patch('/update/employee/:employeeId', async (req,res) => {
    try {
      const EmployeeId = req.params.employeeId;
      const empData = req.body;
      const UpdatedEmployee = await employees.findOneAndUpdate(
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
  })

  app.get('/get/employees/:username', async (req,res) => {
    try {
      const username = req.params.username;
      const Employees = await employees.find({}).toArray();
      if(!Employees){
        return res.status(404).json("No Employees exists!");
      }
      res.status(200).json(Employees);
    } catch (error) {
      res.status(500).json("Internal server error!");
    }
  })

  app.delete("/delete/employee/:employeeId", async (req,res) => {
    try {
      const EmployeeId = req.params.employeeId;
      const DeletedEmployee = await employees.deleteOne({_id : new ObjectId(EmployeeId)});
      if(!DeletedEmployee){
        res.status(501).json("Error deleting the employee!");
      }
      res.status(200).json(DeletedEmployee)
    } catch (error) {
      res.status(500).json("Internal server error!")
    }
  })


    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    //await client.close();
  }
}
run().catch(console.dir);


app.listen(port,() => {
    console.log(`App listening on port number : ${port}`);
})

module.exports = app