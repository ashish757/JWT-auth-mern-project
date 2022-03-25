const jwt = require('jsonwebtoken')


const authMiddleware = async (req, res, next) => {
    const token = req.headers["x-access-token"]
    if (token) {
        jwt.verify(token, "ACCESSkey", (err, payload) => {
            if (err) {
                console.log(err);
                return res.json({ status: false, msg: "you are not authenticated" })
            }

            req.payload = payload
            return next()
            
        })

    } else {
        res.json({ status: false, msg: "you are not authenticated" })
    }
}

module.exports = authMiddleware