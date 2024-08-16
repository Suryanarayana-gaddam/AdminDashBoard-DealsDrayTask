const mongoose = require("mongoose")
const {Schema} = mongoose;

const userSchema = new Schema({
    username :
        { 
            type : String,
            required : true
        },
    password :
        {
            type : String,
            required : true
        },
    empList : {
        type : Array
    }
    
});

const User = mongoose.model('users', userSchema );
module.exports = User;