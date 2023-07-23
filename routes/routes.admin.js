const express = require('express');
const Admin = require("../model/admin.model")
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const adminRouter = express.Router();

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
})

adminRouter.post('/login', (req, res) => {
    const adminInfo = req.body
    console.log(adminInfo)
    Admin.findOne({ email: adminInfo.email }).then(admin => {
        console.log(admin)
        console.log(adminInfo.email)
        console.log(admin.email)
        if (admin) {
            return bcrypt.compare(adminInfo.password, admin.password).then(authStatus => {
                console.log(adminInfo.password)
                console.log(admin.password)
                console.log(authStatus)
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

module.exports = adminRouter;