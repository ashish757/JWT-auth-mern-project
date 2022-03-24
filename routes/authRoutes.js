const express = require( "express")
const authController = require( "../Controller/authController")

const router = express.Router()

router.post('/signup', authController.signup)
router.post('/login', authController.login)
router.delete('/logout', authController.logout)
router.get('/refreshToken', authController.refreshToken)

module.exports = router
