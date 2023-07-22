const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const app = express();
const db = require('./db/connection')
const userRouter = require('./routes/routes.user');
const adminRouter = require('./routes/routes.admin');
const productRouter = require("./routes/routes.products")

require('dotenv').config();
const PORT = process.env.PORT;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : false}));

app.use('/user', userRouter)
app.use('/admin', adminRouter)
app.use('/product', productRouter)

app.use((req,res) => {
    res.send("Welcome to our api");
})

app.listen(`${PORT}`, () => {
    console.log(`server listening on port ${PORT}...`);
})