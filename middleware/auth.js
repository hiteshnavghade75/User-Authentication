const jwt = require("jsonwebtoken")

module.exports = (req, res, next) => {
    console.log("Auth middleware reached")
    try{
        const token = req.headers.authorization;
        console.log(token)
        const verifiedToken = jwt.verify(token, `${process.env.SECRET_KEY}`)
        console.log(verifiedToken)
        req.adminId = verifiedToken.id;
        next();
    }
    catch{
        res.json({
            message : "Authorization failed"
        })
    }
}

