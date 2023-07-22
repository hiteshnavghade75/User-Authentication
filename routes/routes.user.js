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


module.exports = userRouter;