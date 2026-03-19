# 🚀 How to Run Hotel Management App

## 📋 Prerequisites

Before you start, make sure you have:

- **Node.js** v16+ ([Download](https://nodejs.org/))
- **MongoDB** (either local or [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) cloud)
- **Git** (already have it)

---

## ⚙️ Step-by-Step Setup

### Step 1: Navigate to Project

```bash
cd "c:\Users\mkrym\OneDrive\Documents\My Folders\project\hotel\hotel_management_app"
```

### Step 2: Configure Backend Environment

**Copy the example environment file:**

```bash
cd Backend
cp .env.example .env
```

**Edit the `.env` file** with your settings:

```
# MongoDB Connection
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

**Quick Setup** (use these defaults for local testing):

```
MONGO_DB_CONNECTION=mongodb://localhost:27017/hotel_management_app
PORT=8000
NODE_ENV=development
JWT_SECRET=dev_secret_key_12345
STRIPE_SECRET_KEY=sk_test_123
STRIPE_PUBLIC_KEY=pk_test_123
CLOUDINARY_CLOUD_NAME=demo
CLOUDINARY_API_KEY=demo
CLOUDINARY_API_SECRET=demo
CORS_ORIGIN=http://localhost:5173
```

---

## 🚀 Running the App

### Option A: Start MongoDB Locally

If you have MongoDB installed locally:

```bash
# Open a new terminal/PowerShell and start MongoDB
mongod
```

Or use **MongoDB Atlas** (cloud) if you prefer - just update the connection string in `.env`

---

### Option B: Start the Servers

You'll need **3 terminal windows** for this:

#### Terminal 1: Backend Server

```bash
cd Backend
npm run dev
```

**Expected output:**

```
> backend@1.0.0 dev
> nodemon

[nodemon] 2.x.x
[nodemon] to restart at any time, type `rs`
[nodemon] watching path(s): src/**/*
MongoDB connected
Server running on port 8000
```

✅ **Backend is running at:** http://localhost:8000

---

#### Terminal 2: Frontend App

```bash
cd Frontend
npm run dev
```

**Expected output:**

```
> frontend@0.0.0 dev
> vite

  VITE v5.0.8  ready in 234 ms
  ➜  Local:   http://localhost:5173/
  ➜  press h to show help
```

✅ **Frontend is running at:** http://localhost:5173

---

#### Terminal 3: Seed Database (OPTIONAL - Run Once)

```bash
cd Backend
npm run seed
```

**Expected output:**

```
🌱 Starting database seed...
✅ Connected to MongoDB
🗑️ Cleared existing data
✅ Created 2 users
✅ Created 5 sample hotels
✅ Added sample booking to hotel
✨ Database seeding completed successfully!
```

---

## 🌐 Access the App

Open your browser and go to:

```
http://localhost:5173
```

---

## 🔐 Demo Login Credentials

After seeding, use these accounts:

### Account 1: Traveler

```
Email: guest@example.com
Password: password123
```

### Account 2: Hotel Owner #1

```
Email: host1@example.com
Password: password123
```

### Account 3: Hotel Owner #2

```
Email: host2@example.com
Password: password456
```

Or simply **create a new account** via "Sign Up"

---

## ✨ Features to Test

### 1. 🏨 Search Hotels

- Click "Search" or use homepage search
- Filter by destination, price, facilities, ratings
- Click on a hotel to see details

### 2. 💳 Book a Hotel

- Click "Book Now" on a hotel detail page
- Select check-in/check-out dates
- Enter number of guests
- Complete payment with Stripe test card:
  ```
  Card: 4242 4242 4242 4242
  Expiry: Any future date (e.g., 12/25)
  CVC: Any 3 digits (e.g., 123)
  ```

### 3. 📋 View My Bookings

- Click "My Bookings" in header (after login)
- See all your bookings with details

### 4. 🏢 Manage Hotels (Hotel Owner)

- Click "My Hotels" in header
- Click "Add Hotel" to create a new hotel
- Upload images, fill details, save

### 5. 📊 View Dashboard (Hotel Owner)

- Click "Dashboard" in header
- See analytics:
  - Total hotels, bookings, revenue
  - Bookings by month
  - Per-hotel performance

---

## 📱 Quick Command Reference

```bash
# Start Backend
cd Backend && npm run dev

# Start Frontend
cd Frontend && npm run dev

# Seed Database (one time)
cd Backend && npm run seed

# Build for Production
cd Backend && npm run build
cd Frontend && npm run build

# Run Tests
cd e2e && npm test

# View Backend API
curl http://localhost:8000/api/hotels/search?destination=London
```

---

## 🐛 Troubleshooting

### Error: "MongoDB connection error"

```
Solution: Make sure MongoDB is running
mongod
```

### Error: "CORS policy blocked"

```
Solution: Check Backend .env
CORS_ORIGIN=http://localhost:5173
```

### Error: "Port 8000 already in use"

```
Solution: Kill the process on port 8000
# On Windows PowerShell:
netstat -ano | findstr :8000
taskkill /PID <PID> /F
```

### Error: "Stripe key not found"

```
Solution: This is okay for development.
Stripe payments won't work until you add real test keys.
Use card 4242 4242 4242 4242 anyway for testing UI.
```

### Images not uploading

```
Solution: Cloudinary keys are placeholders.
Update in .env with your own Cloudinary account:
https://cloudinary.com
```

---

## 📊 App Architecture

```
Frontend (React + Vite)
    ↓
http://localhost:5173
    ↓
    ↔ API Calls ↔
    ↓
Backend (Express + TypeScript)
    ↓
http://localhost:8000
    ↓
    ↔ Database ↔
    ↓
MongoDB
```

---

## ✅ Verification Checklist

- [ ] MongoDB running (if local)
- [ ] Backend running on http://localhost:8000
- [ ] Frontend running on http://localhost:5173
- [ ] Database seeded with `npm run seed`
- [ ] Can login with demo credentials
- [ ] Can search hotels
- [ ] Can view hotel details
- [ ] Can see "My Bookings" link
- [ ] Can see "Dashboard" link (as hotel owner)

---

## 🎯 Next Steps

1. **Test all features** (search, book, view bookings, dashboard)
2. **Add your own data** via database UI
3. **Deploy** when ready (see deployment docs)
4. **Customize** styling, add features, etc.

---

## 📞 Need Help?

Refer to these docs in the project:

- `README.md` — Setup & troubleshooting
- `COMPLETION_SUMMARY.md` — What was done
- `PROJECT_STATUS.md` — Current status

---

**Happy coding! 🚀**
