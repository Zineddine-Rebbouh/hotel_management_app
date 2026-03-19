# Hotel Management App - Setup & Development Guide

A full-stack hotel booking application built with **React + TypeScript + Express + MongoDB + Stripe**.

## 🏗️ Project Structure

```
hotel_management_app/
├── Backend/              # Express server (Node.js/TypeScript)
├── Frontend/             # React + Vite (TypeScript)
├── e2e/                  # Playwright E2E tests
└── Data-test/            # Test data files
```

---

## ⚙️ Prerequisites

- **Node.js** v16+ (with npm)
- **MongoDB** (local or Atlas connection string)
- **Stripe Account** (for payments, use test keys)
- **Cloudinary Account** (for image uploads, optional)

---

## 🚀 Quick Start

### 1. Install Dependencies

**Backend:**
```bash
cd Backend
npm install
```

**Frontend:**
```bash
cd Frontend
npm install
```

**E2E Tests:**
```bash
cd e2e
npm install
```

---

### 2. Configure Environment Variables

#### Backend (`.env`)
Copy `.env.example` and update with your credentials:

```bash
cd Backend
cp .env.example .env
```

Edit `.env` with:
```
MONGO_DB_CONNECTION=mongodb://localhost:27017/hotel_management_app
PORT=8000
NODE_ENV=development

JWT_SECRET=your_secret_key_12345

STRIPE_SECRET_KEY=sk_test_your_key
STRIPE_PUBLIC_KEY=pk_test_your_key

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

CORS_ORIGIN=http://localhost:5173
```

#### Frontend (`.env.local`)
```
VITE_API_BASE_URL=http://localhost:8000
VITE_STRIPE_PUBLIC_KEY=pk_test_your_key
```

---

### 3. Start MongoDB (if local)

```bash
mongod
```

Or use **MongoDB Atlas** (cloud) and update `MONGO_DB_CONNECTION` with your connection string.

---

### 4. Seed Initial Data

Populate the database with sample hotels and users:

```bash
cd Backend
npm run seed
```

**Creates:**
- 2 demo users (host1@example.com, host2@example.com)
- 5 sample hotels across different cities
- 1 sample booking

---

### 5. Start the Development Servers

**Terminal 1 - Backend:**
```bash
cd Backend
npm run dev
```
Server runs on `http://localhost:8000`

**Terminal 2 - Frontend:**
```bash
cd Frontend
npm run dev
```
App opens at `http://localhost:5173`

---

## 📝 Available Routes & Features

### Public Routes
- `/` — Home page with latest destinations
- `/search` — Search and filter hotels
- `/detail/:hotelId` — Hotel details page
- `/sign-in` — User login
- `/sign-up` — User registration

### Authenticated Routes (After Login)
- `/my-bookings` — View your bookings across all hotels
- `/my-hotels` — Manage your hotels (for hotel owners)
- `/add-hotel` — Add a new hotel
- `/edit-hotel/:hotelId` — Edit hotel details
- `/dashboard` — Hotel owner dashboard with stats & analytics
- `/hotel/:hotelId/booking` — Booking & payment page

---

## 🔑 Demo Credentials

**User 1 (Traveler):**
- Email: `guest@example.com`
- Password: `password123`

**User 2 (Hotel Owner):**
- Email: `host1@example.com`
- Password: `password123`

(Or create new accounts via Sign Up)

---

## 🧪 Running Tests

### E2E Tests (Playwright)

```bash
cd e2e
npm install
npm test
```

This will run:
- `auth.spec.ts` — Login and registration tests
- `hotel.spec.ts` — Hotel search and filter tests
- `menage.hotel.spec.ts` — Hotel management tests

**Prerequisite:** Backend and Frontend must be running locally.

---

## 📊 API Endpoints

### Authentication
- `POST /api/auth/login` — User login
- `POST /api/users/register` — User registration
- `GET /api/auth/validate-token` — Validate JWT token
- `POST /api/auth/logout` — User logout

### Hotels
- `GET /api/hotels/search?destination=...` — Search hotels
- `GET /api/hotels/:id` — Get hotel details
- `POST /api/hotels/:hotelId/booking/payment-intent` — Create Stripe payment intent
- `POST /api/hotels/:hotelId/bookings` — Create booking

### User Hotels (Owner)
- `GET /api/my-hotels` — Get user's hotels
- `POST /api/my-hotels` — Add new hotel
- `PUT /api/my-hotels/:hotelId` — Update hotel
- `GET /api/my-hotels/:hotelId` — Get hotel details
- `GET /api/my-hotels/dashboard/stats` — Dashboard statistics
- `GET /api/hotels/:hotelId/bookings` — View hotel's bookings

### User Bookings
- `GET /api/hotels/user/bookings` — Get user's bookings

---

## 🛠️ Build & Deployment

### Build for Production

**Backend:**
```bash
cd Backend
npm run build
npm start
```

**Frontend:**
```bash
cd Frontend
npm run build
```

Output in `Frontend/dist/`

---

## 📦 Key Dependencies

### Backend
- `express` — Web framework
- `mongoose` — MongoDB ODM
- `jsonwebtoken` — JWT authentication
- `stripe` — Payment processing
- `cloudinary` — Image hosting
- `bcrypt` — Password hashing
- `cors` — Cross-origin requests

### Frontend
- `react` & `react-dom` — UI library
- `vite` — Build tool
- `react-router-dom` — Routing
- `react-query` — Data fetching
- `react-hook-form` — Form handling
- `@stripe/react-stripe-js` — Stripe payments
- `react-datepicker` — Date picker
- `tailwindcss` — Styling

---

## 🐛 Troubleshooting

### MongoDB Connection Error
```
MongoDB connection error: connect ECONNREFUSED
```
**Solution:** Ensure MongoDB is running (`mongod`) or update `MONGO_DB_CONNECTION` with Atlas string.

### Stripe Key Not Working
```
Error creating payment intent
```
**Solution:** Ensure `STRIPE_SECRET_KEY` is a valid Stripe test key (starts with `sk_test_`).

### CORS Errors
```
Access to XMLHttpRequest has been blocked by CORS policy
```
**Solution:** Update `CORS_ORIGIN` in `.env` to match your frontend URL (default: `http://localhost:5173`).

### TypeScript Errors in Frontend Build
```
Cannot find type definition file for 'react-datepicker'
```
**Solution:** Already fixed. A local declaration file is in `src/types/react-datepicker.d.ts`.

---

## 🧪 Testing the Complete Flow

1. **Register** a new user
2. **Search** for hotels
3. **View** hotel details
4. **Book** a hotel (uses Stripe test mode, use `4242 4242 4242 4242` for test card)
5. **View bookings** in "My Bookings"
6. **(As owner)** View "Dashboard" for analytics

---

## 📈 Features Overview

✅ **User Authentication** — JWT-based login/registration  
✅ **Hotel Search & Filter** — By destination, facilities, price, ratings  
✅ **Hotel Management** — Add, edit, delete hotels (owners only)  
✅ **Image Uploads** — Via Cloudinary  
✅ **Payment Processing** — Stripe integration  
✅ **Booking System** — Create, track, and view bookings  
✅ **Dashboard Analytics** — Revenue, bookings by month, per-hotel stats  
✅ **Responsive Design** — Tailwind CSS, mobile-friendly  
✅ **E2E Testing** — Playwright test suite  

---

## 🔒 Security Features

- ✅ Password hashing with bcrypt
- ✅ JWT authentication with token validation middleware
- ✅ CORS configured for cross-origin requests
- ✅ Environment variables for sensitive data (no hardcoded secrets)
- ✅ Stripe PCI-DSS compliant
- ✅ MongoDB injection protection (via Mongoose)

---

## 📝 Development Notes

- **Middleware Folder:** `src/Middleware/` (note: typo in original, kept for compatibility)
- **API Responses:** Standardized JSON format with `success` flag
- **Error Handling:** Global error middleware catches all exceptions
- **Database Models:** User, Hotel with nested Bookings array

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing-feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

ISC License

---

**Last Updated:** March 18, 2026  
**Status:** ✅ Fully Functional (Phase 1-3 Complete)
