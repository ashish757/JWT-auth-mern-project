const User = require("../Models/User.model")


const getAllUsers = async (req, res) => {
    try {
        const users = await User.find()
        res.status(200).json({ status: "OK", users })
    } catch (error) {
        res.status(500).json({ status: "error", error })
    }


}

const getUser = async (req, res) => {
    const id = req.params.id
    try {
        const user = await User.findOne({ _id: id })
        if (!user) return res.status(404).json({ status: false, user, msg: "No user found" })

        res.status(200).json({ status: true, user})

    } catch (error) {
        res.status(500).json({ status: false, error, user: [] })

    }
}

module.exports = { getAllUsers, getUser }