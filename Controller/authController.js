const User = require("../Models/User.model")
const bcrypt = require("bcrypt")
const e = require("express")
const jwt = require("jsonwebtoken")
const res = require("express/lib/response")

const createAccessToken = (payload) => {
    return jwt.sign(payload, "ACCESSkey", {expiresIn: "1h"})
}
const createRefreshToken = (payload) => {
    return jwt.sign(payload, "REFRESHkey", {expiresIn: "1d"})
}


const refreshToken = async (req, res) => {
    if (!req.cookies.jid) return res.json({status: false, msg: "no refresh token provided"})

    const valid = jwt.verify(req.cookies.jid, "REFRESHkey", (err, payload) => {

        if (err) return res.json({status: false, msg: "invalid refresh token"})

        const accessToken = createAccessToken({id: payload._id})
        return res.json({ status: true, accessToken})
    })
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
    res.clearCookie("jid")
    res.json({status: true, msg:"you were logged out"})
}

module.exports = {login, signup, logout, refreshToken}