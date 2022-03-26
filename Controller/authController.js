const User = require("../Models/User.model")
const bcrypt = require("bcrypt")
const e = require("express")
const jwt = require("jsonwebtoken")
const res = require("express/lib/response")
const redisClient = require("../redisClient.js")

const createAccessToken = (payload) => {
    return jwt.sign(payload, "ACCESSkey", {expiresIn: "15s"})
}

const createRefreshToken = (payload) => {
    return jwt.sign(payload, "REFRESHkey", {expiresIn: "1d"})
}


const signup = async (req, res) => {
    const {name, email, password}  = req.body
    try {
        const user = new User({
            name, email, password
        })
        await user.save()
        // user created successfuly
        
        const accessToken = createAccessToken({id: user._id})
        
        const refreshToken = createRefreshToken({id: user._id})

        redisClient.set(`WHITE_${user._id}`, JSON.stringify([refreshToken]))

        res.cookie("jid", refreshToken, { httpOnly: true, sameSite: 'None', maxAge: 24 * 60 * 60 * 1000, secure: true })
        return res.status(201).json({success: true, user, msg: "user created successfully", accessToken})
        

    } catch (error) {
        res.status(500).json({success: false, msg: error})
    }
}

const login = async (req, res) => {
    const {email, password} = req.body

    try {
        const user = await User.findOne({email})
        if (user) {
            
            if (await bcrypt.compare(password, user.password)) {

                const accessToken = createAccessToken({id: user._id})
        
                const refreshToken = createRefreshToken({id: user._id})

                redisClient.set(`WHITE_${user._id}`, JSON.stringify([refreshToken]))

                res.cookie("jid", refreshToken, { httpOnly: true, sameSite: 'None', maxAge: 24 * 60 * 60 * 1000, secure: true })
                return res.json({success: true, msg: "login successful", user, accessToken})

            } else {
                return res.json({success: false,msg: "Invalid password"})
            }

        } else {
            res.status(500).json({success: false, msg: `user with ${email} is not registered yet`})
        }

    } catch (error) {
        res.status(500).json({success: false, msg: error})
    }

}

const logout = async (req, res) => {
    if (!req.cookies.jid) return res.json({status: false, msg: "no refresh token provided"})

    const userId = req.payload.id
    const refreshToken = req.cookies.jid


    const refreshTokens = await redisClient.get(`WHITE_${userId}`)
    const newRefreshTokens =JSON.parse(refreshTokens).filter(token => token !== refreshToken)
    redisClient.set(`WHITE_${userId}`, JSON.stringify(newRefreshTokens))

    res.clearCookie("jid")
    res.json({status: true, msg:"you were logged out"})
}




const refreshToken = async (req, res) => {
    const clientRefreshToken = req.cookies.jid
    if (!clientRefreshToken) return res.json({status: false, msg: "no refresh token provided"})

    jwt.verify(clientRefreshToken, "REFRESHkey", async (err, payload) => {

        // console.log("PAYLOAD", JSON.stringify(payload)); // 

        if (err) return res.json({status: false, msg: "invalid refresh token"})

        // check whether the given refersh token exists in whitelist
        try {
            const savedRefreshTokens = await redisClient.get(`WHITE_${payload.id}`)
            const savedRefreshToken = JSON.parse(savedRefreshTokens).filter(token => token = clientRefreshToken)
            if (savedRefreshToken.length) {
                    // here refersh token is valid as it is in whitelist
                    // console.log(savedRefreshToken) //

                    const accessToken = createAccessToken({id: payload._id})
                    const refreshToken = createRefreshToken({id: payload._id})

                    redisClient.set(`WHITE_${payload._id}`, JSON.stringify([refreshToken]))

                    res.cookie("jid", refreshToken, { httpOnly: true, sameSite: 'None', maxAge: 24 * 60 * 60 * 1000, secure: true })
                    return res.json({ status: true, accessToken})

            
            } else {
                // REUSE DETECTED
                res.status(500).json({success: false, msg: "user logged out with this token but it is compromised", isUserHacked: true})
                // res.status(500).json({success: false, msg: "SEVERE SECURITY CONCERN"})
            }
            
        } catch (error) {
            console.log(err)
            res.status(500).json({success: false, msg: err})
        }
        
        

        // LEGACY
        // redisClient.get(`WHITE_${payload.id}`).then(savedRefreshToken => {
        //     if (savedRefreshToken) {
        //         if (savedRefreshToken == clientRefreshToken) {
        //             // here refersh token is valid as it is in whitelist
        //             // console.log(savedRefreshToken) //
        //             const accessToken = createAccessToken({id: payload._id})
        //             return res.json({ status: true, accessToken})

        //         } else {
        //             // refersh token is invalid "USER HACKED"
        //             res.status(500).json({success: false, msg: "user logged out with this token but it is compromised"})
        //         }
        //     } else {
        //         // null no refersh token of this user is whitelisted
        //         res.status(500).json({success: false, msg: "SEVERE SECURITY CONCERN"})
        //     }
        // }).catch(err => {
        //     console.log(err)
        //     res.status(500).json({success: false, msg: err})
        // })
    

        
    })
}



module.exports = {login, signup, logout, refreshToken}