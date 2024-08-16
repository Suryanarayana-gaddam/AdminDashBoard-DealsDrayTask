const mongoose = require("mongoose");
const {Schema} = mongoose;
const employeeSchema = new Schema({
    username: {
        type: String,
        required: true
    },
    empName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    mobile: {
        type: String,
        required: true
    },
    designation: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        required: true,
    },
    course: {
        type: Array,
        required: true,
    },
    img: {
        type : String,
    },
    date: {
        type : Date,
    }
});


const Employee = mongoose.model('employees', employeeSchema);
module.exports = Employee;
