const mongoose = require("mongoose");
require("dotenv").config();

mongoose.connect(process.env.DB_URL)
.then(() => {
    console.log("Connected to db...")
})
.catch(() => {
    console.log("Failed to connect to db")
})