const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const app = express();
const cors = require('cors')
const db = require('./db/connection')
const userRouter = require('./routes/routes.user');
const adminRouter = require('./routes/routes.admin');
const productRouter = require("./routes/routes.products");
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

require('dotenv').config();
const PORT = process.env.PORT;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : false}));

app.use(cors());

app.use('/user', userRouter)
app.use('/admin', adminRouter)
app.use('/product', productRouter)

const options = {
    definition : {
        openapi : '3.0.0',
        info : {
            title : 'User Authentication',
            version : '1.0.0'
        },
        servers : [
            {
                url : 'http://localhost:8080'
            }
        ] 
    },
    apis : ['./app.js', './routes/routes.user.js', './routes/routes.admin.js', './routes/routes.products.js']
}

const swaggerSpec = swaggerJSDoc(options);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

/**
 * @swagger
 * /:
 *  get:
 *      summary: This api is used tocheck whether app is running or not
 *      description: This api is used tocheck whether app is running or not
 *      responses:
 *          200:
 *              description: Totest get method
 */

app.use((req,res) => {
    res.send("Welcome to our api");
})

app.listen(`${PORT}`, () => {
    console.log(`server listening on port ${PORT}...`);
})