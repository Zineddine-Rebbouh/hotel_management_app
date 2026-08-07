import "dotenv/config";
import express, { Request, Response, Express, NextFunction } from "express";
import mongoose from "mongoose";
import cors from "cors";
import cookieParser from "cookie-parser";
import { v2 as cloudinary } from "cloudinary";
import mongoSanitize from "mongo-sanitize";
import { doubleCsrf } from "csrf-csrf";
import MyHotelsRoutes from "./routes/MyhotelsRoutes";
import HotelsRoutes from "./routes/hotelsRoutes";

const userRoutes = require("./routes/userRoutes");
const authRoutes = require("./routes/authRoutes");

const port = process.env.PORT || 8000;
const app: Express = express();

// Fail fast if critical secrets are missing
if (!process.env.JWT_SECRET) {
  console.error(
    "FATAL: JWT_SECRET environment variable is not set. Refusing to start.",
  );
  process.exit(1);
}
if (!process.env.CSRF_SECRET) {
  console.error(
    "FATAL: CSRF_SECRET environment variable is not set. Refusing to start.",
  );
  process.exit(1);
}

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ─────────────────────────────────────────────────────────────
// CSRF Protection (Double-Submit Cookie pattern)
// ─────────────────────────────────────────────────────────────
const { generateToken, doubleCsrfProtection } = doubleCsrf({
  getSecret: () => process.env.CSRF_SECRET as string,
  cookieName: "x-csrf-token",
  cookieOptions: {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
  },
  size: 64,
  ignoredMethods: ["GET", "HEAD", "OPTIONS"],
  getTokenFromRequest: (req) => req.headers["x-csrf-token"] as string,
});

// ─────────────────────────────────────────────────────────────
// Core Middleware
// ─────────────────────────────────────────────────────────────
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:5173",
    credentials: true,
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ─────────────────────────────────────────────────────────────
// Security: Strip MongoDB operator injection ($, .) from all
// request bodies, params, and query strings
// ─────────────────────────────────────────────────────────────
app.use((req: Request, _res: Response, next: NextFunction) => {
  if (req.body) req.body = mongoSanitize(req.body);
  if (req.params) req.params = mongoSanitize(req.params);
  if (req.query) req.query = mongoSanitize(req.query as Record<string, unknown>) as typeof req.query;
  next();
});

// ─────────────────────────────────────────────────────────────
// CSRF token endpoint — frontend calls this once on app load
// to get the token, then includes it in all mutating requests
// via the `x-csrf-token` header.
// ─────────────────────────────────────────────────────────────
app.get("/api/csrf-token", (req: Request, res: Response) => {
  const token = generateToken(req, res);
  res.json({ csrfToken: token });
});

// Apply CSRF protection to all state-changing routes
app.use(doubleCsrfProtection);

// ─────────────────────────────────────────────────────────────
// Routes
// ─────────────────────────────────────────────────────────────
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/my-hotels", MyHotelsRoutes);
app.use("/api/hotels", HotelsRoutes);

// ─────────────────────────────────────────────────────────────
// Global Error Handling Middleware
// ─────────────────────────────────────────────────────────────
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  const status = (err as any).status || 500;
  const message = err.message || "Internal Server Error";
  res.status(status).json({
    success: false,
    message: message,
    error: process.env.NODE_ENV === "development" ? err : undefined,
  });
});

// ─────────────────────────────────────────────────────────────
// Database Connection & Server
// ─────────────────────────────────────────────────────────────
mongoose
  .connect(process.env.MONGO_DB_CONNECTION as string)
  .then(() => console.log("MongoDB connected"))
  .then(() => {
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  })
  .catch((err: Error) => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });
