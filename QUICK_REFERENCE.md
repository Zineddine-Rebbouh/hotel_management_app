# ⚡ Quick Reference: Hotel Management Seeding

## 🚀 Quick Start (30 seconds)

```bash
# 1. Navigate to Backend
cd Backend

# 2. Configure .env (if needed)
# MONGODB_URI=mongodb://localhost:27017/hotel_management_app

# 3. Run seed
npm run seed

# 4. Done! ✅
```

---

## 📦 What Gets Seeded

| Collection | Count | Details |
|-----------|-------|---------|
| **Users** | 55 | Algerian names, unique emails, bcrypt-hashed passwords |
| **Hotels** | 18 | Across 17 Algerian cities, $50-$500/night, 3-5⭐ |
| **Bookings** | 200+ | Embedded in hotels, diverse dates (past/future) |

---

## 🔑 Login Credentials

**All seeded users use the same password:**
```
Email: [Any seeded user email]
Password: Password123!
```

**Example**:
```
Email: mohamed.benali@gmail.com
Password: Password123!
```

---

## 📊 Data Summary

```
✅ 55 Users (Algerian names)
✅ 18 Hotels across 17 cities
✅ 200+ Bookings
✅ 5-12 Facilities per hotel
✅ 3-6 Images per hotel
✅ Realistic prices ($50-$500)
✅ Real Cloudinary URLs
✅ Date mix: 33% past, 33% upcoming, 34% future
```

---

## 🧪 Test Queries

### MongoDB Shell / Compass

```javascript
// Count users
db.users.countDocuments()                    // → 55

// Find a user
db.users.findOne()
// Sample result:
{
  _id: ObjectId(...),
  firstname: "Mohamed",
  lastname: "Benali",
  email: "mohamed.benali@gmail.com",
  password: "$2b$10$..." // bcrypt hash
}

// Count hotels
db.hotels.countDocuments()                   // → 18

// Find hotels in Algiers
db.hotels.find({ city: "Algiers" })         // → 1-2 hotels

// Count bookings in first hotel
db.hotels.aggregate([
  { $project: { bookingCount: { $size: "$bookings" } } },
  { $sort: { bookingCount: -1 } }
])

// Find hotels by star rating
db.hotels.find({ starRating: 5 }).count()   // → ~5-6 hotels

// Find bookings in date range
db.hotels.aggregate([
  { $unwind: "$bookings" },
  { $match: {
      "bookings.checkIn": { $gte: new Date("2025-03-01") }
    }
  },
  { $limit: 5 }
])
```

---

## 📝 Verify Seeding Success

After running `npm run seed`, you should see:

```
✅ Connected to MongoDB
✅ Collections cleared
✅ Created 55 users
✅ Created 18 hotels

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

✨ Database is ready for testing!
```

---

## 🔧 Common Tasks

### Re-seed Database
```bash
npm run seed
# Clears all data and inserts fresh seeded data
```

### Check Database Size
```bash
# MongoDB shell
use hotel_management_app
db.stats()
```

### View Seeded Users
```bash
# MongoDB shell
db.users.find().pretty()
```

### View Seeded Hotels
```bash
# MongoDB shell
db.hotels.find({ city: "Algiers" }).pretty()
```

### Count Total Bookings
```bash
# MongoDB shell
db.hotels.aggregate([
  { $group: { _id: null, totalBookings: { $sum: { $size: "$bookings" } } } }
])
```

---

## ⚙️ Environment Setup

### .env Configuration

```env
# Backend/.env
MONGODB_URI=mongodb://localhost:27017/hotel_management_app

# OR for MongoDB Atlas
MONGODB_URI=mongodb+srv://username:password@cluster0.mongodb.net/hotel_management_app

# Other variables (if needed)
NODE_ENV=development
PORT=3000
```

---

## 📋 Seeded Data Categories

### User Types (All Customers by Default)
- 55 unique users
- Algerian names (authentic)
- Real-world email domains
- Password-protected with bcrypt

### Hotel Types
```
Budget Hotels:           20% ($50-$80/night)
Mid-Range:               30% ($80-$150/night)
Upscale:                 30% ($150-$200/night)
Luxury:                  20% ($200-$500/night)
```

### Room Types
- Single
- Double
- Twin
- Suite
- Deluxe Suite
- Standard
- Superior

### Cities (Algerian)
```
Algiers          Constantine      Skikda
Oran             Tlemcen          Guelma
Blida            Bejaia           Tiaret
Tizi Ouzou       Annaba           Mascara
Sidi Bel Abbès   Mostaganem       Batna
Setif            Medea
```

---

## 🎯 Sample Usage Workflow

```
1. Run Seed
   npm run seed

2. Start Backend Server
   npm run dev

3. Start Frontend
   cd Frontend && npm run dev

4. Login with Seeded User
   Email: yasmine.touati@outlook.com
   Pass: Password123!

5. Browse Hotels
   All 18 seeded hotels appear

6. View Bookings
   All 200+ bookings available

7. Create New Booking
   Select hotel → pick dates → complete booking

8. Add New Hotel
   Hotel owner can add their own hotel
```

---

## 📚 Detailed Docs

For more detailed information, see:
- **[SEEDING_GUIDE.md](./SEEDING_GUIDE.md)** - Complete usage guide
- **[SEEDING_TECHNICAL.md](./SEEDING_TECHNICAL.md)** - Technical implementation details

---

## 🆘 Troubleshooting

| Issue | Solution |
|-------|----------|
| MongoDB connection fails | Ensure MongoDB is running; check `.env` URI |
| ts-node not found | `npm install --save-dev ts-node` |
| Duplicate key error | Run `npm run seed` again (clears & re-seeds) |
| Port already in use | Change `PORT` in `.env` or kill process |
| bcrypt errors | `npm install bcrypt` |
| Password hash mismatch | Use `Password123!` for all seeded users |

---

## 🎓 Key Concepts

### Embedded vs Referenced
- **Used**: Embedded bookings within hotels
- **Schema**: `Hotel { bookings: [Booking] }`
- **Advantage**: Single query for hotel + bookings
- **Alternative**: Separate Booking collection (not used here)

### Seeding Strategy
- **Bulk insert**: Efficient database operations
- **Relationships**: Proper user/hotel/booking links
- **Validation**: Mongoose schema enforcement
- **Randomization**: Realistic data distribution

### Password Security
- **Hash Algorithm**: bcrypt
- **Salt Rounds**: 10 (production-grade)
- **Test Password**: Password123!
- **Real Applications**: Load hashed passwords from secure storage

---

## ✅ Verification Steps

```bash
# 1. Backend directory
cd Backend

# 2. Check MongoDB connection string
cat .env | grep MONGODB

# 3. Run seed
npm run seed

# 4. Verify in MongoDB
use hotel_management_app
db.users.countDocuments()    # Should return 55
db.hotels.countDocuments()   # Should return 18
```

---

## 🚀 Production Deployment

**Before deploying to production:**

1. ✅ Update password security (use secure vault)
2. ✅ Configure proper MongoDB connection (Atlas/Cloud)
3. ✅ Set environment variables via CI/CD
4. ✅ Run seed only once during initialization
5. ✅ Backup database before seeding
6. ✅ Use role-based access for production users
7. ✅ Enable MongoDB authentication/encryption

---

## 💡 Pro Tips

1. **Freeze Current Data**
   ```bash
   mongodump --uri "mongodb://localhost:27017/hotel_management_app" --out ./backup
   ```

2. **Restore from Backup**
   ```bash
   mongorestore --uri "mongodb://localhost:27017/hotel_management_app" ./backup
   ```

3. **View Real-Time Data**
   ```bash
   # MongoDB Compass: Visual database browser
   # MongoDB Shell: Command-line access
   # VS Code Extension: Built-in database explorer
   ```

4. **Performance Testing**
   ```bash
   # Create 1000s of records for load testing
   # Modify generateUsers(), generateHotels() counts
   ```

---

## 📞 Need Help?

1. Check the **Troubleshooting** section above
2. Review **[SEEDING_GUIDE.md](./SEEDING_GUIDE.md)** for detailed instructions
3. Review **[SEEDING_TECHNICAL.md](./SEEDING_TECHNICAL.md)** for implementation details
4. Run the seed script with verbose output for debugging

---

**Last Updated**: March 2025
**Script Version**: 1.0 (Production-Ready)
**Status**: ✅ Ready for Production Testing
