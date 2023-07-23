const jwt = require("jsonwebtoken")

module.exports = (req, res, next) => {
    console.log("Auth middleware reached")
    try{
        const token = req.headers.authorization.split(" ")[1];
        console.log(token)
        const verifiedToken = jwt.verify(token, `${process.env.SECRET_KEY}`)
        if(verifiedToken.role === 'admin'){
            req.adminId = verifiedToken.id;
        next();
        }else{
            res.json({
                message : "Not Authorized"
            })
        }
    }
    catch{
        res.json({
            message : "Authorization failed"
        })
    }
}

