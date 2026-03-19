# 🌱 Hotel Management App - Comprehensive Data Seeding Guide

## 📋 Overview

A **production-ready seeding script** has been generated for your hotel management application. This guide explains the complete data model and how to use it.

---

## ✅ Database Model Analysis

### Collections & Schemas

#### 1. **User Collection**

```typescript
{
  _id: ObjectId;
  firstname: String(required);
  lastname: String(required);
  email: String(required, unique);
  password: String(required, bcrypt - hashed);
}
```

- **Count**: 55 realistic Algerian users
- **Roles**: Mix of hotel owners and customers
- **Email Format**: firstname.lastname@domain.dz

---

#### 2. **Hotel Collection**

```typescript
{
  _id: ObjectId
  userId: String (reference to User)
  name: String (required)
  city: String (Algerian cities)
  country: String ("Algeria")
  description: String (French or English)
  type: String (Single, Double, Twin, Suite, Deluxe Suite, Standard, Superior)
  adultCount: Number
  childCount: Number
  facilities: [String] (Array of amenities)
  pricePerNight: Number ($50-$500 range)
  starRating: Number (1-5)
  imageUrls: [String] (Cloudinary URLs)
  lastUpdated: Date
  bookings: [Booking] (embedded array)
}
```

- **Count**: 18 hotels across 17 Algerian cities
- **Facilities**: 20 different amenities available
- **Images**: Real Cloudinary URLs

---

#### 3. **Booking (Embedded in Hotel)**

```typescript
{
  _id: ObjectId(auto - generated);
  userId: String;
  firstName: String;
  lastName: String;
  email: String;
  adultCount: Number;
  childCount: Number;
  checkIn: Date;
  checkOut: Date;
  totalCost: Number;
}
```

- **Total Bookings**: 200+ across all hotels
- **Date Distribution**:
  - ~33% Past bookings (180 days ago)
  - ~33% Upcoming bookings (next 60 days)
  - ~34% Future bookings (60-180 days ahead)

---

## 🚀 How to Run the Seeding Script

### Prerequisites

Ensure the following are installed and configured:

```bash
✓ Node.js (v16+)
✓ MongoDB (local or connection string in .env)
✓ Dependencies installed (npm install in Backend/)
```

### Step 1: Configure Environment

Update your `.env` file in the Backend directory:

```env
MONGODB_URI=mongodb://localhost:27017/hotel_management_app
# OR use your MongoDB Atlas connection string:
# MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/hotel_management_app
```

### Step 2: Navigate to Backend

```bash
cd Backend
```

### Step 3: Run the Seeding Script

```bash
npm run seed
```

### Expected Output

```
🌱 Starting comprehensive database seed...

✅ Connected to MongoDB
🧹 Clearing existing collections...
✅ Collections cleared

👥 Generating 55 Algerian users...
✅ Created 55 users

🏨 Generating 18 hotels with realistic bookings...
✅ Created 18 hotels

=======================================================
📊 COMPREHENSIVE SEED COMPLETED - DATABASE STATISTICS
=======================================================

📋 Collections Seeded:
   • Users: 55
   • Hotels: 18
   • Total Bookings: 200+

🌍 Geographic Coverage:
   • Algerian Cities: 17
   • Hotels per City: 1-2

🎨 Data Features:
   • Available Facilities: 20
   • Hotel Images (Cloudinary): 15
   • Room Types: 7

📊 Booking Distribution:
   • Past Bookings: ~66
   • Upcoming Bookings: ~68
   • Future Bookings: ~66

=======================================================
📝 SAMPLE DATA PREVIEW
=======================================================

👤 Sample User:
   Name: Mohamed Benali
   Email: mohamed.benali@gmail.com

🏨 Sample Hotel:
   Name: Hotel Algiers Palace
   City: Algiers
   Type: Suite
   Price: $175/night
   Rating: ⭐⭐⭐⭐⭐
   Bookings: 18
   Facilities: WiFi, Swimming Pool, Restaurant...
   Images: 4 uploaded

📅 Sample Booking:
   Guest: Yasmine Touati
   Email: yasmine.touati@outlook.com
   Check-in: Wed Mar 12 2025
   Check-out: Sat Mar 15 2025
   Duration: 3 nights
   Total Cost: $525
   Guests: 2 adults, 1 child

=======================================================
✨ Database is ready for testing!
=======================================================
```

---

## 📊 Seeded Data Details

### User Distribution

- **55 Total Users**
  - 20 Female users
  - 35 Male users
  - All have Algerian names (real cultural authenticity)
  - Each with unique email address

### Hotel Distribution

| City                    | Hotels | Avg Price | Star Rating |
| ----------------------- | ------ | --------- | ----------- |
| Algiers                 | 2      | $150-$250 | 4-5 ⭐      |
| Oran                    | 1      | $80-$120  | 3-4 ⭐      |
| Constantine             | 1      | $90-$150  | 3-4 ⭐      |
| Tlemcen                 | 1      | $70-$100  | 3 ⭐        |
| Blida                   | 1      | $100-$200 | 4 ⭐        |
| Bejaia                  | 1      | $110-$180 | 4 ⭐        |
| _And 11 more cities..._ | _11_   | _Varied_  | _3-5 ⭐_    |

### Room Type Examples

- Single: $50-$80
- Double: $80-$150
- Twin: $80-$150
- Suite: $150-$300
- Deluxe Suite: $250-$500

### Amenities (20 Total)

```
WiFi              Air Conditioning    Swimming Pool
Gym               Restaurant          Bar
Spa               Parking             Conference Room
Room Service      Business Center     TV
Mini Bar          Bathrobe            Hair Dryer
Shower            Hot Tub             Garden
Terrace           Concierge
```

### Booking Patterns

- **Check-in Spread**: Past 6 months to Future 6 months
- **Length of Stay**: 1-21 nights (realistic variation)
- **Guest Composition**: 1-4 adults + 0-2 children
- **Cost Calculation**: Automatic based on hotel price × nights

---

## 🎯 Key Features

### ✨ Realistic Data Generation

✅ **Algerian Cultural Authenticity**

- Real Algerian first names (masculine & feminine)
- Real Algerian last names
- Algerian city names
- French/English descriptions (bilingual region)

✅ **Production-Ready Facility Data**

- Multiple hotels across different regions
- Varied room types and price points
- Realistic amenity combinations
- Proper star ratings (3-5 stars)

✅ **Sophisticated Booking Logic**

- Proper date ranges (past, present, future)
- Realistic booking lengths (1-21 nights)
- Cost calculations based on duration
- Guest demographics variation

✅ **Professional Image URLs**

- Cloudinary hosted images (15 unique URLs)
- Realistic hotel/room photography patterns
- Distributed across hotels (3-6 images per hotel)

### 🔒 Security

- ✅ Passwords hashed with bcrypt (10 salt rounds)
- ✅ MongoDB connection via environment variables
- ✅ No hardcoded credentials
- ✅ Data validation on insert

### 🚀 Performance

- ✅ Efficient bulk insert operations
- ✅ Proper ObjectId generation
- ✅ Optimized query structure
- ✅ Minimal database round-trips

---

## 🔄 Re-seeding

To reset and re-seed the database with new data:

```bash
npm run seed
```

**Note**: This will:

1. Clear all existing users
2. Clear all existing hotels and bookings
3. Insert completely new randomized data
4. Preserve database connections and indexes

---

## 📝 Customization Options

### Modify User Count

In `seed.ts`, line ~800:

```typescript
const userData = await generateUsers(55); // Change 55 to desired count
```

### Modify Hotel Count

In `seed.ts`, line ~801:

```typescript
const hotelData = generateHotels(18, userIds); // Change 18 to desired count
```

### Modify Booking Count per Hotel

In `seed.ts`, in `generateHotels()` function:

```typescript
const bookingCount = Math.floor(Math.random() * 25) + 5; // Change this range
```

### Add/Modify Cities

In `seed.ts`, update the `ALGERIAN_CITIES` array:

```typescript
const ALGERIAN_CITIES = [
  "Algiers",
  "Oran",
  // Add more cities...
];
```

### Add/Modify Facilities

In `seed.ts`, update the `FACILITIES` array:

```typescript
const FACILITIES = [
  "WiFi",
  "Swimming Pool",
  // Add more facilities...
];
```

---

## 🧪 Testing the Seeded Data

### 1. Verify Users Created

```javascript
// In MongoDB shell or Compass
db.users.countDocuments(); // Should return 55
db.users.findOne();
```

### 2. Verify Hotels Created

```javascript
db.hotels.countDocuments(); // Should return 18
db.hotels.findOne();
```

### 3. Verify Bookings

```javascript
const hotel = db.hotels.findOne();
hotel.bookings.length; // Should show # of bookings in that hotel
```

### 4. Test with Application

1. Start the backend server
2. Login with any seeded user email + "Password123!"
3. Browse hotels and bookings
4. Create new bookings (add to seed data)

---

## 🐛 Troubleshooting

### Issue: "Cannot find module 'ts-node'"

**Solution**: Install ts-node globally or locally

```bash
npm install -g ts-node
# OR
npm install --save-dev ts-node
```

### Issue: "ECONNREFUSED - MongoDB connection failed"

**Solution**: Ensure MongoDB is running

```bash
# For local MongoDB
mongod

# For MongoDB Atlas, verify connection string in .env
MONGODB_URI=mongodb+srv://user:password@your-cluster.mongodb.net/hotel_management_app
```

### Issue: "E11000 duplicate key error"

**Solution**: Clear database and re-seed

```bash
# MongoDB shell
use hotel_management_app
db.dropDatabase()

# Then re-run seed
npm run seed
```

### Issue: "bcrypt module not found"

**Solution**: Install dependencies

```bash
cd Backend
npm install
npm run seed
```

---

## 📚 Data Schema Reference

### User Login Credentials

All users have the same password for testing:

- **Password**: `Password123!`
- **Examples**:
  - Email: `mohamed.benali@gmail.com` | Pass: `Password123!`
  - Email: `yasmine.touati@outlook.com` | Pass: `Password123!`

### Database Connection

Update `MONGO_DB_CONNECTION` in seed.ts or use `.env`:

```
MONGODB_URI=mongodb://localhost:27017/hotel_management_app
```

### Sample Hotel Query

```javascript
// Find all hotels in Algiers
db.hotels.find({ city: "Algiers" });

// Find hotels with booking count > 10
db.hotels.find({ "bookings.0": { $exists: true } });

// Find bookings for a specific guest
db.hotels.find({ "bookings.email": "guest@example.com" });
```

---

## ✅ Verification Checklist

After running the seed script, verify:

- [ ] 55 users created
- [ ] 18 hotels created
- [ ] 200+ total bookings
- [ ] All hotels have valid userId reference
- [ ] All bookings have valid dates (checkIn < checkOut)
- [ ] All hotels have 3-6 Cloudinary images
- [ ] All hotels have 5-12 facilities
- [ ] Prices are realistic ($50-$500 range)
- [ ] Star ratings are 3-5
- [ ] Users have unique emails
- [ ] Passwords are bcrypt-hashed

---

## 🎉 You're Ready!

Your database is now seeded with:

- ✅ 55 realistic Algerian users
- ✅ 18 hotels across 17 cities
- ✅ 200+ bookings with realistic dates and costs
- ✅ Production-ready image URLs
- ✅ Complete facility data
- ✅ Proper data relationships and validation

**Start exploring and testing your hotel management application!**

---

## 📞 Support

For issues or questions:

1. Check the **Troubleshooting** section above
2. Verify MongoDB connection and credentials
3. Ensure all dependencies are installed
4. Check `Backend/package.json` for required packages

Happy coding! 🚀
