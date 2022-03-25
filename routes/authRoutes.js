const express = require( "express")
const authController = require( "../Controller/authController")
const authMiddleware = require("../middlerwares/authMiddleware")

const router = express.Router()

router.post('/signup', authController.signup)
router.post('/login', authController.login)
router.delete('/logout', authMiddleware, authController.logout)
router.get('/refreshToken', authController.refreshToken)

module.exports = router
