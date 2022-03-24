const express = require("express")
const userController = require("../Controller/userController")
const authMiddleware = require("../middlerwares/authMiddleware")


const router = express.Router()

router.get('/users', userController.getAllUsers)
router.get('/user/:id', authMiddleware, userController.getUser)


module.exports = router
