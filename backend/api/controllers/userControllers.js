const bcrypt = require('bcryptjs');
const User = require('../models/User');
const RegisterUser = async (req,res) => {
    try {
      const {username,password} = req.body;
      const hashedPassword = await bcrypt.hash(password,10);
      const existingUser = await User.findOne({username: username});
      if(existingUser){
        return res.status(403).json("User exists with similar credentials!")
      }
      const user = await User.create({username,password:hashedPassword,empList:[]});
      if(!user){
        return res.status(501).json("Error creating user!")
      }
      res.status(200).json(user);
    } catch (error) {
      console.log("Error :",error);
      res.status(500).json("Internal server error!");
    }
};


const LoginUser = async (req,res) => {
    try{
        const {username,password} = req.body;
        const UserDetails = await User.findOne({username : username});
        if(!UserDetails){
            return res.status(404).json("User not found! Please Create an account and try again...")
        }
        const passwordMatch = await bcrypt.compare(password,UserDetails.password);
        if(!passwordMatch){
            return res.status(401).json("Password was incorrect!")
        }else{
            return res.status(200).json(UserDetails);
        }
    }catch(error){
        res.status(500).json({message : "Internal server error!"})
    }
}


module.exports = {RegisterUser,LoginUser}
