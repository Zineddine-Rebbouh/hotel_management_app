import express from "express";
import { validateToken } from "../Middleware/validateToken";
import { authLimiter, generalLimiter } from "../Middleware/rateLimiter";

const router = express.Router();
const { check } = require("express-validator");
const authController = require("../Controllers/authController");

// Strict rate limiting on login — prevents brute-force / credential stuffing
router.post(
  "/login",
  authLimiter,
  [
    check("email", "Email is required").isEmail(),
    check("password", "Password with 6 or more characters required").isLength({
      min: 6,
    }),
  ],
  authController.login,
);

router.get(
  "/validate-token",
  generalLimiter,
  validateToken,
  authController.getToken,
);
router.post(
  "/logout",
  generalLimiter,
  validateToken,
  authController.invalidateToken,
);

module.exports = router;
