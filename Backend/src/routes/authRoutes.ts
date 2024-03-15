import express from "express"
import { validateToken } from "../Middelware/validateToken"
const router = express.Router()
const { check } = require('express-validator')
const authController = require('../Controllers/authController')
router.post('/login'
    , [
        check('email', 'Email is required').isEmail(),
        check("password", "Password with 6 or more characters required").isLength({ min: 6 })
    ],
    authController.login)

router.get('/validate-token', validateToken, authController.getToken)
router.post('/logout', validateToken, authController.invalidateToken)

module.exports = router; 