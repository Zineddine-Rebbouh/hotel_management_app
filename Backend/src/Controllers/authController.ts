import { NextFunction, Request, Response } from "express";
import User from "../models/User";
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { validationResult } = require("express-validator");

// Shared secure cookie configuration.
// SameSite: "strict" is the primary CSRF mitigation for same-origin cookie auth.
const buildCookieConfig = () => ({
  httpOnly: true, // Prevents client-side JS access to the cookie
  secure: process.env.NODE_ENV === "production", // HTTPS only in production
  sameSite: "strict" as const, // CSRF mitigation: cookie not sent on cross-site requests
  maxAge: 86400000, // 24 hours in milliseconds
});

export const login = async (req: Request, res: Response<any>) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials",
        error: errors.array(),
      });
    }

    // Note: mongo-sanitize middleware in server.ts already strips $ and . operators
    // from req.body before this point. We extract the scalar value explicitly as
    // an additional layer of defense against NoSQL operator injection.
    const email = String(req.body.email || "").toLowerCase().trim();
    const password = String(req.body.password || "");

    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid Credentials" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "Invalid Credentials" });
    }

    const isEqual = await bcrypt.compare(password, user.password);
    if (!isEqual) {
      return res.status(401).json({
        success: false,
        message: "Invalid Credentials",
      });
    }

    // Sign JSON Web Token
    const token = await jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET as string,
      {
        expiresIn: "1d",
      },
    );

    res.cookie("auth_token", token, buildCookieConfig());
    return res.status(200).json({ success: true, userId: user._id });
  } catch (error) {
    console.error("Error during Login:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

export const getToken = (req: Request, res: Response, next: NextFunction) => {
  res.status(200).json({ success: true, userId: req.userId });
};

export const invalidateToken = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  res.cookie("auth_token", "", {
    expires: new Date(0),
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
  });
  res.status(200).json({ success: true, message: "Signed out successfully" });
};
