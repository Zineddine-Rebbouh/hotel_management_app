import express, { Request, Response } from "express";
import multer from "multer";
import {
  updateHotel,
  getMyHotels,
  getHotel,
  getDashboardStats,
} from "../Controllers/hotelsController";
import { validateToken } from "../Middleware/validateToken";
import { generalLimiter } from "../Middleware/rateLimiter";
import { body } from "express-validator";
import cloudinary from "cloudinary";
import Hotel, { hotelType } from "../models/hotels";

const router = express.Router();

// ─── Multer configuration ─────────────────────────────────────────────────────
const storage = multer.memoryStorage();

/** Allowed MIME types for hotel image uploads */
const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/gif",
];

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB per file
    files: 6, // Maximum 6 files
  },
  fileFilter: (_req, file, cb) => {
    if (ALLOWED_IMAGE_TYPES.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(
        new Error(
          `Invalid file type. Only ${ALLOWED_IMAGE_TYPES.join(", ")} are allowed.`,
        ),
      );
    }
  },
});

// ─── Create hotel ─────────────────────────────────────────────────────────────
router.post(
  "/",
  generalLimiter,
  validateToken,
  [
    body("name").notEmpty().withMessage("Name is required"),
    body("city").notEmpty().withMessage("City is required"),
    body("country").notEmpty().withMessage("Country is required"),
    body("description").notEmpty().withMessage("Description is required"),
    body("type").notEmpty().withMessage("Hotel type is required"),
    body("pricePerNight")
      .notEmpty()
      .isNumeric()
      .withMessage("Price per night is required and must be a number"),
    body("facilities")
      .notEmpty()
      .isArray()
      .withMessage("Facilities are required"),
  ],
  upload.array("imageFiles", 6),
  async (req: Request, res: Response) => {
    try {
      const imageFiles = req.files as Express.Multer.File[];
      const newHotel: hotelType = req.body;

      const imageUrls = await uploadImages(imageFiles);

      newHotel.imageUrls = imageUrls;
      newHotel.lastUpdated = new Date();
      newHotel.userId = req.userId;

      const hotel = new Hotel(newHotel);
      await hotel.save();

      res.status(201).send(hotel);
    } catch (e) {
      console.log(e);
      res.status(500).json({ message: "Something went wrong" });
    }
  },
);

// ─── Get single hotel by ID ───────────────────────────────────────────────────
router.get("/:id", generalLimiter, validateToken, getHotel);

// ─── Get all hotels for authenticated user ────────────────────────────────────
router.get("/", generalLimiter, validateToken, getMyHotels);

// ─── Dashboard stats ──────────────────────────────────────────────────────────
router.get(
  "/dashboard/stats",
  generalLimiter,
  validateToken,
  getDashboardStats,
);

// ─── Update hotel ─────────────────────────────────────────────────────────────
router.put(
  "/:hotelId",
  generalLimiter,
  validateToken,
  upload.array("imageFiles"),
  updateHotel,
);

export async function uploadImages(imageFiles: Express.Multer.File[]) {
  const uploadPromises = imageFiles.map(async (image) => {
    const b64 = Buffer.from(image.buffer).toString("base64");
    let dataURI = "data:" + image.mimetype + ";base64," + b64;
    const res = await cloudinary.v2.uploader.upload(dataURI);
    return res.url;
  });

  const imageUrls = await Promise.all(uploadPromises);
  return imageUrls;
}

export default router;
