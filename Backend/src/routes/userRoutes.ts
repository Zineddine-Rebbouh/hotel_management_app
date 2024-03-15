const express = require('express')
const UserController = require('../Controllers/UserController')
const router = express.Router()
const { check } = require('express-validator')
router.post('/register',
    [
        check("firstname", "First Name is required").isString(),
        check("lastname", "Last Name is required").isString(),
        check("email", "Email is required").isEmail(),
        check("password", "Password with 6 or more characters required").isLength({ min: 6 })
    ],
    UserController.register
)

module.exports = router; 