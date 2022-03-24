const jwt = require('jsonwebtoken')


const authMiddleware = async (req, res, next) => {
    const token = req.headers["x-access-token"]
    if (token) {
        const valid = jwt.verify(token, "ACCESSkey", (err, payload) => {
            if (!err) return next()

            console.log(err);
            res.json({ status: false, msg: "you are not authenticated" })
        })

    } else {
        res.json({ status: false, msg: "you are not authenticated" })
    }
}

module.exports = authMiddleware