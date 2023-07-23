const express = require('express');
const User = require("../model/user.model")
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const userRouter = express.Router();

userRouter.post("/register", async (req, res) => {
    try {
        const userInfo = req.body
        console.log(userInfo.password)

        bcrypt.hash(userInfo.password, 10).then((encryptedPassword) => {
            console.log(encryptedPassword)
            const user = new User({
                username: userInfo.username,
                email: userInfo.email,
                password: encryptedPassword
            })
            user.save().then(newUser => {
                res.status(201).json({
                    message: "Encryption Successfull",
                    data: newUser
                })
            })
                .catch(err => {
                    res.json({
                        message: "Failed to encrypt the password",
                        error: err
                    })
                })
        })
    }
    catch (err) {
        res.json({
            message: "Failed to create new user",
            error: err
        })
    }
});


/**
 * @swagger
 * components:
 *   schemas:
 *     NewUser:
 *       type: object
 *       properties:
 *         username:
 *           type: string
 *           description: Username of the new user
 *         email:
 *           type: string
 *           description: Email of the new user
 *         password:
 *           type: string
 *           description: Password of the new user
 * 
 * /user/register:
 *   post:
 *     tags:
 *       - Users
 *     summary: Register a new user
 *     description: Create a new user with the provided username, email, and password.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/NewUser'
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/NewUser'
 *       400:
 *         description: Invalid request data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */



userRouter.post('/login', (req, res) => {
    const userInfo = req.body
    User.findOne({ email: userInfo.email }).then(user => {
        if (user) {
            return bcrypt.compare(userInfo.password, user.password).then(authStatus => {
                if (authStatus) {
                    return jwt.sign({
                        email: user.email,
                        id: user._id,
                        role : user.role
                    },
                        `${process.env.SECRET_KEY}`,
                        {
                            expiresIn: "1h"
                        }, (err, token) => {
                            if (err) {
                                return res.json({
                                    message: "Authentication failed",
                                    error: err
                                })
                            } else {
                                return res.json({
                                    message: "Authentication successfull",
                                    data: token
                                })
                            }
                        })
                }
            })
                .catch(err => {
                    res.json({
                        message: "Authentication failed",
                        error: err
                    })
                })
        }
    })
});

/**
 * @swagger
 * components:
 *   schemas:
 *     UserLogin:
 *       type: object
 *       properties:
 *         email:
 *           type: string
 *           description: Email of the user trying to log in
 *         password:
 *           type: string
 *           description: Password of the user trying to log in
 *     AuthResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           description: Status message indicating the result of the authentication
 *         data:
 *           type: string
 *           description: JSON Web Token (JWT) for authentication
 * 
 * /user/login:
 *   post:
 *     tags:
 *       - Admin
 *     summary: User Login
 *     description: Log in as an admin with the provided credentials.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserLogin'
 *     responses:
 *       200:
 *         description: Authentication successful. Returns a JSON Web Token (JWT) to be used for authentication.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       401:
 *         description: Authentication failed. Invalid email or password.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Authentication failed"
 *                 error:
 *                   type: string
 *                   example: "Invalid email or password"
 *       500:
 *         description: Internal Server Error. An error occurred while processing the request.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Internal Server Error"
 *                 error:
 *                   type: string
 * 
 * securityDefinitions:
 *   bearerAuth:
 *     type: apiKey
 *     name: Authorization
 *     in: header
 */

module.exports = userRouter;