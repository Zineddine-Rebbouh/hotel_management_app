import express, { Request, Response } from "express";
import { getHotelById, searchHotels } from "../Controllers/hotelsController";
import { param } from "express-validator";
import Stripe from "stripe";
import { validateToken } from "../Middleware/validateToken";
import Hotel from "../models/hotels";

export type paymentIntentResponse = {
  totalCost: number;
  paymentIntentId: string;
  clientSecret: string;
};

export type BookingType = {
  _id: string;
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  adultCount: number;
  childCount: number;
  checkOut: Date;
  checkIn: Date;
  totalCost: number;
};
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "");

const router = express.Router();
router.get("/search", searchHotels);
router.get(
  "/user/bookings",
  validateToken,
  async (req: Request, res: Response) => {
    try {
      const userId = req.userId;

      // Find all hotels with bookings from this user
      const hotels = await Hotel.find({
        "bookings.userId": userId,
      });

      const userBookings = [];
      for (const hotel of hotels) {
        const bookings = hotel.bookings.filter((b) => b.userId === userId);
        userBookings.push(
          ...bookings.map((booking) => ({
            ...booking,
            hotelName: hotel.name,
            hotelCity: hotel.city,
            hotelId: hotel._id,
          })),
        );
      }

      return res.status(200).json({
        success: true,
        bookingsCount: userBookings.length,
        bookings: userBookings,
      });
    } catch (error) {
      console.error("Error fetching user bookings:", error);
      return res
        .status(500)
        .json({ success: false, message: "Error fetching bookings" });
    }
  },
);
router.get(
  "/:id",
  param("id").notEmpty().withMessage("Params is required "),
  getHotelById,
);

router.post(
  "/:hotelId/booking/payment-intent",
  validateToken,
  async (req: Request, res: Response) => {
    try {
      const { numberOfNights } = req.body;
      const hotelId = req.params.hotelId;
      const hotel = await Hotel.findById(hotelId);

      if (!hotel) {
        return res
          .status(404)
          .json({ success: false, message: "Hotel not found" });
      }

      const totalCost = hotel.pricePerNight * numberOfNights;

      const paymentIntent = await stripe.paymentIntents.create({
        amount: totalCost * 100,
        currency: "gbp",
        metadata: {
          hotelId,
          userId: req.userId,
        },
      });

      if (!paymentIntent) {
        return res
          .status(500)
          .json({ success: false, message: "Error creating payment intent" });
      }

      const response = {
        success: true,
        totalCost: totalCost,
        paymentIntentId: paymentIntent.id,
        clientSecret: paymentIntent.client_secret?.toString(),
      };

      return res.status(200).json(response);
    } catch (error) {
      console.error("Error creating payment intent:", error);
      return res
        .status(500)
        .json({ success: false, message: "Error creating payment intent" });
    }
  },
);

router.post(
  "/:hotelId/bookings",
  validateToken,
  async (req: Request, res: Response) => {
    try {
      const paymentIntentId = req.body.paymentIntentId;
      const paymentIntent = await stripe.paymentIntents.retrieve(
        paymentIntentId as string,
      );

      if (!paymentIntent) {
        return res
          .status(500)
          .json({ success: false, message: "Payment intent not found" });
      }

      if (
        paymentIntent.metadata.hotelId !== req.params.hotelId ||
        paymentIntent.metadata.userId !== req.userId
      ) {
        return res
          .status(400)
          .json({ success: false, message: "Payment intent mismatch" });
      }

      if (paymentIntent.status !== "succeeded") {
        return res
          .status(400)
          .json({
            success: false,
            message: `Payment not successful. Status: ${paymentIntent.status}`,
          });
      }

      const newBooking: BookingType = {
        ...req.body,
        userId: req.userId,
      };
      const hotel = await Hotel.findOneAndUpdate(
        {
          _id: req.params.hotelId,
        },
        {
          $push: { bookings: newBooking },
        },
      );

      if (!hotel) {
        return res
          .status(500)
          .json({ success: false, message: "Failed to create booking" });
      }

      await hotel.save();

      return res.status(200).json({
        success: true,
        message: "Booking created successfully",
      });
    } catch (error) {
      console.error("Error creating booking:", error);
      return res
        .status(500)
        .json({ success: false, message: "Something went wrong" });
    }
  },
);

export default router;

// ============================================
// GET all bookings for a specific hotel
// GET /api/hotels/:hotelId/bookings
// ============================================
router.get(
  "/:hotelId/bookings",
  validateToken,
  async (req: Request, res: Response) => {
    try {
      const hotelId = req.params.hotelId;
      const hotel = await Hotel.findById(hotelId);

      if (!hotel) {
        return res
          .status(404)
          .json({ success: false, message: "Hotel not found" });
      }

      // Only hotel owner can view bookings
      if (hotel.userId !== req.userId) {
        return res
          .status(403)
          .json({
            success: false,
            message: "Unauthorized: You do not own this hotel",
          });
      }

      return res.status(200).json({
        success: true,
        hotelName: hotel.name,
        bookingsCount: hotel.bookings.length,
        bookings: hotel.bookings || [],
      });
    } catch (error) {
      console.error("Error fetching bookings:", error);
      return res
        .status(500)
        .json({ success: false, message: "Error fetching bookings" });
    }
  },
);
