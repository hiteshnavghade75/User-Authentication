const express = require('express');
const Admin = require("../model/admin.model")
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const adminRouter = express.Router();
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

adminRouter.post("/register", async (req, res) => {
    try {
        const adminInfo = req.body
        console.log(adminInfo)

        bcrypt.hash(adminInfo.password, 10).then((encryptedPassword) => {
            console.log(encryptedPassword)
            const admin = new Admin({
                username: adminInfo.username,
                email: adminInfo.email,
                password: encryptedPassword
            })
            console.log(admin)
            admin.save().then(newAdmin => {
                console.log(newAdmin)
                res.status(201).json({
                    message: "Encryption Successfull",
                    data: newAdmin
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
            message: "Failed to create new admin",
            error: err
        })
    }
});

/**
 * @swagger
 * components:
 *   schemas:
 *     NewAdmin:
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
 * /admin/register:
 *   post:
 *     tags:
 *       - Admins
 *     summary: Register a new admin
 *     description: Create a new user with the provided username, email, and password.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/NewAdmin'
 *     responses:
 *       201:
 *         description: Admin registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/NewAdmin'
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

adminRouter.post('/login', (req, res) => {
    const adminInfo = req.body
    Admin.findOne({ email: adminInfo.email }).then(admin => {
        if (admin) {
            return bcrypt.compare(adminInfo.password, admin.password).then(authStatus => {
                if (authStatus) {
                    return jwt.sign({
                        email: admin.email,
                        id: admin._id,
                        role : admin.role
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
})

/**
 * @swagger
 * components:
 *   schemas:
 *     AdminLogin:
 *       type: object
 *       properties:
 *         email:
 *           type: string
 *           description: Email of the admin trying to log in
 *         password:
 *           type: string
 *           description: Password of the admin trying to log in
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
 * /admin/login:
 *   post:
 *     tags:
 *       - Admin
 *     summary: Admin Login
 *     description: Log in as an admin with the provided credentials.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AdminLogin'
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

module.exports = adminRouter;