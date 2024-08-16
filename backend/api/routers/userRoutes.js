const express = require("express");
const router = express.Router();

const {RegisterUser,LoginUser} = require("../controllers/userControllers");

router.post("/register-user",RegisterUser);
router.post("/login-user",LoginUser);

module.exports = router;