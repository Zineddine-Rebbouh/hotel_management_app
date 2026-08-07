import { Request, Response } from "express";
import User from "../models/User";
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");

// Shared secure cookie configuration.
// SameSite: "strict" is the primary CSRF mitigation for same-origin cookie auth.
const buildCookieConfig = () => ({
  httpOnly: true, // Prevents client-side JS access to the cookie
  secure: process.env.NODE_ENV === "production", // HTTPS only in production
  sameSite: "strict" as const, // CSRF mitigation: cookie not sent on cross-site requests
  maxAge: 86400000, // 24 hours in milliseconds
});

export const register = async (req: Request, res: Response<any>) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: errors.array(),
      });
    }

    // SECURITY FIX: Extract only the expected fields instead of passing the entire
    // req.body to the User constructor. Passing req.body directly allows an attacker
    // to set arbitrary Mongoose fields (mass assignment / prototype pollution).
    // The global mongo-sanitize middleware already strips $ and . operators, but
    // allow-listing fields here is defense in depth.
    const { firstname, lastname, email, password } = req.body;

    const sanitizedEmail = String(email || "").toLowerCase().trim();

    if (!firstname || !lastname || !sanitizedEmail || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const existingUser = await User.findOne({ email: sanitizedEmail });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Create user with only the allowed fields
    const user = new User({
      firstname: String(firstname),
      lastname: String(lastname),
      email: sanitizedEmail,
      password: String(password),
    });
    await user.save();

    // Creating token
    const token = await jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET as string,
      {
        expiresIn: "1d",
      },
    );

    res.cookie("auth_token", token, buildCookieConfig());
    return res
      .status(201)
      .json({ success: true, message: "Registration successful" });
  } catch (error) {
    console.error("Error during registration:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

export const getUserDetails = async (req: Request, res: Response) => {
  const userId = req.userId;
  try {
    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }
    return res.json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};
