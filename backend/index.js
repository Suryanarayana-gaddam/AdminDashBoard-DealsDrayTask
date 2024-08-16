const express = require("express");
const app = express();
const cors = require("cors")
require("dotenv").config();
const serverless = require('serverless-http');
const mongoose = require("mongoose");

const port = process.env.PORT || 5080;
const uri = process.env.MONGO_DB_URI;

const corsOptions = {
  origin:["https://admin-dash-board-api.vercel.app","http://localhost:5173","http://localhost:5080/","https://admin-dash-board-indol-six.vercel.app"]
}

app.use(cors(corsOptions));
app.use(express.json());

mongoose.connect(uri)
.then(
  console.log(" Mongo DB connected successfully !")
)
.catch((error) => console.log("Error connecting to the Mongo DB !",error));

app.get("/", (req,res) => {
    res.send("Hello World!");
})

const empRouters = require("./api/routers/empRouters")
const userRoutes = require("./api/routers/userRoutes")

app.use("/",empRouters)
app.use("/employee",empRouters)
app.use("/",userRoutes)
app.use("/user",userRoutes)

app.listen(port,() => {
  console.log(`App listening on port number : ${port}`);
})

module.exports = app
module.exports.handler = serverless(app);
