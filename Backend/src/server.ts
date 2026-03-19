import "dotenv/config";
import express, { Request, Response, Express, NextFunction } from "express";
import mongoose from "mongoose";
import cors from "cors";
import cookieParser from "cookie-parser";
import { v2 as cloudinary } from "cloudinary";
import MyHotelsRoutes from "./routes/MyhotelsRoutes";
import HotelsRoutes from "./routes/hotelsRoutes";

const userRoutes = require("./routes/userRoutes");
const authRoutes = require("./routes/authRoutes");

const port = process.env.PORT || 8000;
const app: Express = express();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Middleware
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:5173",
    credentials: true,
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/my-hotels", MyHotelsRoutes);
app.use("/api/hotels", HotelsRoutes);

// Global Error Handling Middleware
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

// Database Connection & Server
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
