import { validateToken } from "../Middleware/validateToken";
import { authLimiter, generalLimiter } from "../Middleware/rateLimiter";

const express = require("express");
const UserController = require("../Controllers/userController");
const router = express.Router();
const { check } = require("express-validator");

// Strict rate limiting on registration — prevents account farming / DoS
router.post(
  "/register",
  authLimiter,
  [
    check("firstname", "First Name is required").isString(),
    check("lastname", "Last Name is required").isString(),
    check("email", "Email is required").isEmail(),
    check("password", "Password with 6 or more characters required").isLength({
      min: 6,
    }),
  ],
  UserController.register,
);

router.get("/me", generalLimiter, validateToken, UserController.getUserDetails);

module.exports = router;
