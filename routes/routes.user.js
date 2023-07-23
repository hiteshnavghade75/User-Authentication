const express = require('express');
const User = require("../model/user.model")
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const userRouter = express.Router();

userRouter.post("/register", async (req, res) => {
    try {
        const userInfo = req.body
        console.log(userInfo)

        bcrypt.hash(userInfo.password, 10).then((encryptedPassword) => {
            console.log(encryptedPassword)
            const user = new User({
                username: userInfo.username,
                email: userInfo.email,
                password: encryptedPassword
            })
            console.log(user)
            user.save().then(newUser => {
                console.log(newUser)
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
})

userRouter.post('/login', (req, res) => {
    const userInfo = req.body
    console.log(userInfo)
    User.findOne({ email: userInfo.email }).then(user => {
        console.log(user)
        console.log(userInfo.email)
        console.log(user.email)
        if (user) {
            return bcrypt.compare(userInfo.password, user.password).then(authStatus => {
                console.log(userInfo.password)
                console.log(user.password)
                console.log(authStatus)
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
})

module.exports = userRouter;