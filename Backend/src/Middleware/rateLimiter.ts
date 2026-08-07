import rateLimit from "express-rate-limit";

/**
 * General limiter — applied to public/read endpoints.
 * 100 requests per IP per 15-minute window.
 */
export const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  standardHeaders: true, // Return rate-limit info in the `RateLimit-*` headers
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many requests, please try again later.",
  },
});

/**
 * Auth limiter — applied to login and register endpoints.
 * Strict limit to prevent brute-force and credential stuffing attacks.
 * 10 requests per IP per 15-minute window.
 */
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message:
      "Too many authentication attempts, please try again after 15 minutes.",
  },
  skipSuccessfulRequests: false, // Count all attempts, even successful ones
});

/**
 * Payment limiter — applied to Stripe payment-intent creation and booking endpoints.
 * Prevents abuse of payment APIs.
 * 20 requests per IP per 15-minute window.
 */
export const paymentLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many payment requests, please try again later.",
  },
});
