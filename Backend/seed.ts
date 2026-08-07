import "dotenv/config";
import crypto from "crypto";
import mongoose from "mongoose";
import User from "./src/models/User";
import Hotel from "./src/models/hotels";
import bcrypt from "bcrypt";

const MONGO_DB_CONNECTION =
  process.env.MONGO_DB_CONNECTION ||
  "mongodb://localhost:27017/hotel_management_app";

// ============================================
// DATA CONSTANTS
// ============================================

const ALGERIAN_FIRST_NAMES_MALE = [
  "Mohamed",
  "Ahmed",
  "Ali",
  "Hassan",
  "Karim",
  "Nasir",
  "Adel",
  "Youssef",
  "Farah",
  "Omar",
  "Ibrahim",
  "Khalid",
  "Mustafa",
  "Samir",
  "Rashid",
  "Tariq",
  "Wajih",
  "Noor",
  "Jamal",
  "Amine",
];

const ALGERIAN_FIRST_NAMES_FEMALE = [
  "Yasmine",
  "Fatima",
  "Amina",
  "Layla",
  "Salima",
  "Zainab",
  "Leila",
  "Nadia",
  "Hana",
  "Safiya",
  "Samira",
  "Rania",
  "Dina",
  "Mariam",
  "Zara",
  "Lina",
  "Aisha",
  "Noor",
  "Mona",
  "Rana",
];

const ALGERIAN_LAST_NAMES = [
  "Benali",
  "Touati",
  "Boudiaf",
  "Algoud",
  "Bennabi",
  "Kaid",
  "Brahimi",
  "Bouteflika",
  "Chadli",
  "Zemine",
  "Hammani",
  "Boualem",
  "Khaled",
  "Mahfoud",
  "Saadi",
  "Benamirouche",
  "Bouhaddoud",
  "Cheriet",
  "Meghouari",
  "Oualdi",
  "Aziz",
  "Kadir",
  "Mansour",
  "Saleh",
  "Tahar",
];

const ALGERIAN_CITIES = [
  "Algiers",
  "Oran",
  "Constantine",
  "Tlemcen",
  "Blida",
  "Bejaia",
  "Tizi Ouzou",
  "Annaba",
  "Sidi Bel Abbès",
  "Skikda",
  "Guelma",
  "Tiaret",
  "Mascara",
  "Mostaganem",
  "Batna",
  "Setif",
  "Medea",
];

const HOTEL_NAMES_TEMPLATES = [
  "Hotel {City} Palace",
  "{City} Marriott Hotel",
  "Sheraton {City}",
  "Hotel {City} Grand",
  "{City} Boutique Hotel",
  "El {City} Resort",
  "Hotel {City} Luxury",
  "{City} Continental",
  "Hotel {City} Promenade",
  "The {City} Plaza",
  "{City} Heritage Hotel",
  "Hotel {City} Oasis",
  "Dar {City}",
  "{City} Star Hotel",
  "Hotel {City} Royal",
];

const ROOM_TYPES = [
  "Single",
  "Double",
  "Twin",
  "Suite",
  "Deluxe Suite",
  "Standard",
  "Superior",
];

const FACILITIES = [
  "WiFi",
  "Air Conditioning",
  "Swimming Pool",
  "Gym",
  "Restaurant",
  "Bar",
  "Spa",
  "Parking",
  "Conference Room",
  "Room Service",
  "Business Center",
  "TV",
  "Mini Bar",
  "Bathrobe",
  "Hair Dryer",
  "Shower",
  "Hot Tub",
  "Garden",
  "Terrace",
  "Concierge",
];

const HOTEL_DESCRIPTIONS_EN = [
  "A luxurious 5-star hotel offering world-class amenities and exceptional service in the heart of the city.",
  "Modern boutique hotel with contemporary design and personalized attention to detail.",
  "Historic hotel combining colonial architecture with modern comfort and elegance.",
  "Beachfront resort with stunning views and direct access to pristine beaches.",
  "Business hotel ideal for corporate travelers, equipped with state-of-the-art facilities.",
  "Family-friendly hotel with spacious rooms and extensive recreational facilities.",
  "Charming traditional hotel showcasing local culture and authentic Algerian hospitality.",
  "Luxury resort featuring fine dining, wellness center, and world-class spa services.",
  "Contemporary hotel designed for the discerning traveler seeking comfort and style.",
  "Elegant establishment combining local heritage with international standards.",
];

const HOTEL_DESCRIPTIONS_FR = [
  "Un hôtel 5 étoiles luxueux offrant des équipements de classe mondiale et un service exceptionnel.",
  "Hôtel boutique moderne avec un design contemporain et une attention personnalisée.",
  "Hôtel historique combinant l'architecture coloniale avec le confort moderne et l'élégance.",
  "Resort en bord de mer avec des vues spectaculaires et un accès direct aux plages.",
  "Hôtel d'affaires idéal pour les voyageurs d'affaires, équipé d'installations ultramodernes.",
  "Hôtel accueillant les familles avec des chambres spacieuses et des installations récréatives.",
  "Charmant hôtel traditionnel mettant en valeur la culture locale et l'hospitalité algérienne.",
  "Resort de luxe proposant la fine cuisine, un centre bien-être et des services de spa.",
  "Hôtel contemporain conçu pour le voyageur exigeant en quête de confort et de style.",
  "Établissement élégant combinant le patrimoine local aux normes internationales.",
];

const CLOUDINARY_IMAGES = [
  // High-quality hotel images from Unsplash (production-ready)
  "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&h=600&fit=crop",
  "https://images.unsplash.com/photo-1566665556112-652d90450e41?w=800&h=600&fit=crop",
  "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&h=600&fit=crop",
  "https://images.unsplash.com/photo-1618773388375-524b97f0c7d9?w=800&h=600&fit=crop",
  "https://images.unsplash.com/photo-1564078369132-f90e87e33763?w=800&h=600&fit=crop",
  "https://images.unsplash.com/photo-1560631684-927fc36e76a9?w=800&h=600&fit=crop",
  "https://images.unsplash.com/photo-1455849318169-8381abf2c477?w=800&h=600&fit=crop",
  "https://images.unsplash.com/photo-1655881472-b6b8aab34cf8?w=800&h=600&fit=crop",
  "https://images.unsplash.com/photo-1578674387459-35160a8bbd09?w=800&h=600&fit=crop",
  "https://images.unsplash.com/photo-1512027795207-f2b60a3e1710?w=800&h=600&fit=crop",
  "https://images.unsplash.com/photo-1582719471384-894fbb16e074?w=800&h=600&fit=crop",
  "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&h=600&fit=crop",
  "https://images.unsplash.com/photo-1551632786-de41ec2a83b6?w=800&h=600&fit=crop",
  "https://images.unsplash.com/photo-1445991842772-097fea258e7b?w=800&h=600&fit=crop",
  "https://images.unsplash.com/photo-1570129477492-45e003008e2c?w=800&h=600&fit=crop",
  "https://images.unsplash.com/photo-1559926635-eae4c6e5f3ab?w=800&h=600&fit=crop",
  "https://images.unsplash.com/photo-1571896349842-b14a9e30623e?w=800&h=600&fit=crop",
  "https://images.unsplash.com/photo-1636574242854-8d8305be5fc6?w=800&h=600&fit=crop",
  "https://images.unsplash.com/photo-1540932239986-310128078ceb?w=800&h=600&fit=crop",
  "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&h=600&fit=crop",
];

// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Cryptographically secure integer in [min, max] inclusive.
 * Replaces Math.floor(Math.random() * ...) for CodeQL CWE-338 compliance.
 */
function randomInt(min: number, max: number): number {
  return crypto.randomInt(min, max + 1);
}

function getRandomElement<T>(array: T[]): T {
  return array[crypto.randomInt(0, array.length)];
}

function getRandomElements<T>(array: T[], min: number, max: number): T[] {
  const count = randomInt(min, max);
  // Fisher-Yates shuffle using crypto.randomInt
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = crypto.randomInt(0, i + 1);
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled.slice(0, count);
}

function generateEmail(
  firstName: string,
  lastName: string,
  index: number,
): string {
  const domains = [
    "gmail.com",
    "outlook.com",
    "yahoo.com",
    "example.dz",
    "email.com",
  ];
  const domain = getRandomElement(domains);
  const username = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${index > 0 ? index : ""}`;
  return `${username}@${domain}`;
}

function generateHotelName(city: string): string {
  const template = getRandomElement(HOTEL_NAMES_TEMPLATES);
  return template.replace("{City}", city);
}

function getRandomPrice(): number {
  const priceRanges = [
    { min: 50, max: 80 },
    { min: 80, max: 150 },
    { min: 150, max: 200 },
    { min: 200, max: 350 },
    { min: 350, max: 500 },
  ];
  const range = getRandomElement(priceRanges);
  return randomInt(range.min, range.max);
}

function getRandomStarRating(): number {
  const ratings = [3, 3, 3, 4, 4, 4, 4, 5, 5, 5];
  return getRandomElement(ratings);
}

function generatePastDate(daysAgo: number): Date {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  return date;
}

function generateFutureDate(daysAhead: number): Date {
  const date = new Date();
  date.setDate(date.getDate() + daysAhead);
  return date;
}

function generateBookingDates(): { checkIn: Date; checkOut: Date } {
  const bookingType = randomInt(0, 2); // 0=past, 1=current/upcoming, 2=far future

  if (bookingType === 0) {
    // Past booking
    const checkInDaysAgo = randomInt(10, 189);
    const lengthOfStay = randomInt(1, 7);
    const checkIn = generatePastDate(checkInDaysAgo);
    const checkOut = new Date(checkIn);
    checkOut.setDate(checkOut.getDate() + lengthOfStay);
    return { checkIn, checkOut };
  } else if (bookingType === 1) {
    // Current/upcoming booking
    const checkInDaysAhead = randomInt(1, 60);
    const lengthOfStay = randomInt(1, 14);
    const checkIn = generateFutureDate(checkInDaysAhead);
    const checkOut = new Date(checkIn);
    checkOut.setDate(checkOut.getDate() + lengthOfStay);
    return { checkIn, checkOut };
  } else {
    // Far future booking
    const checkInDaysAhead = randomInt(60, 239);
    const lengthOfStay = randomInt(1, 21);
    const checkIn = generateFutureDate(checkInDaysAhead);
    const checkOut = new Date(checkIn);
    checkOut.setDate(checkOut.getDate() + lengthOfStay);
    return { checkIn, checkOut };
  }
}

// ============================================
// SEED DATA GENERATORS
// ============================================

async function generateUsers(count: number) {
  const users = [];
  const usedEmails = new Set<string>();

  for (let i = 0; i < count; i++) {
    const isMale = randomInt(0, 1) === 1;
    const firstName = isMale
      ? getRandomElement(ALGERIAN_FIRST_NAMES_MALE)
      : getRandomElement(ALGERIAN_FIRST_NAMES_FEMALE);
    const lastName = getRandomElement(ALGERIAN_LAST_NAMES);

    let email = generateEmail(firstName, lastName, 0);
    let emailIndex = 1;
    while (usedEmails.has(email)) {
      email = generateEmail(firstName, lastName, emailIndex);
      emailIndex++;
    }
    usedEmails.add(email);

    const hashedPassword = await bcrypt.hash("Password123!", 10);

    users.push({
      firstname: firstName,
      lastname: lastName,
      email: email,
      password: hashedPassword,
    });
  }

  return users;
}

function generateBookings(count: number, hotelPrice: number) {
  const bookings = [];
  const bookingFirstNames = [
    ...ALGERIAN_FIRST_NAMES_MALE,
    ...ALGERIAN_FIRST_NAMES_FEMALE,
  ];
  const bookingLastNames = ALGERIAN_LAST_NAMES;

  for (let i = 0; i < count; i++) {
    const { checkIn, checkOut } = generateBookingDates();
    const lengthOfStay = Math.ceil(
      (checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24),
    );
    const adultCount = randomInt(1, 3);
    const childCount = randomInt(0, 2);
    const firstName = getRandomElement(bookingFirstNames);
    const lastName = getRandomElement(bookingLastNames);
    const email = generateEmail(firstName, lastName, i);

    bookings.push({
      userId: new mongoose.Types.ObjectId().toString(),
      firstName: firstName,
      lastName: lastName,
      email: email,
      adultCount: adultCount,
      childCount: childCount,
      checkIn: checkIn,
      checkOut: checkOut,
      totalCost: hotelPrice * lengthOfStay,
    });
  }

  return bookings;
}

function generateHotels(count: number, userIds: string[]) {
  const hotels = [];

  for (let i = 0; i < count; i++) {
    const city = getRandomElement(ALGERIAN_CITIES);
    const pricePerNight = getRandomPrice();
    const bookingCount = randomInt(5, 29);
    const bookings = generateBookings(bookingCount, pricePerNight);

    const selectedFacilities = getRandomElements(FACILITIES, 5, 12);
    const imageUrls = getRandomElements(CLOUDINARY_IMAGES, 3, 6);

    const description =
      randomInt(0, 1) === 1
        ? getRandomElement(HOTEL_DESCRIPTIONS_EN)
        : getRandomElement(HOTEL_DESCRIPTIONS_FR);

    hotels.push({
      userId: getRandomElement(userIds),
      name: generateHotelName(city),
      city: city,
      country: "Algeria",
      description: description,
      type: getRandomElement(ROOM_TYPES),
      adultCount: randomInt(1, 4),
      childCount: randomInt(0, 2),
      facilities: selectedFacilities,
      pricePerNight: pricePerNight,
      starRating: getRandomStarRating(),
      imageUrls: imageUrls,
      lastUpdated: new Date(),
      bookings: bookings,
    });
  }

  return hotels;
}

// ============================================
// SEED EXECUTION
// ============================================

const seedData = async () => {
  try {
    console.log("🌱 Starting comprehensive database seed...\n");
    console.log("🔌 Connecting to MongoDB at: " + MONGO_DB_CONNECTION);

    // Connect to MongoDB with timeout
    await mongoose.connect(MONGO_DB_CONNECTION, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 5000,
    });
    console.log("✅ Connected to MongoDB");

    // Clear existing data
    console.log("\n🧹 Clearing existing collections...");
    await Hotel.deleteMany({});
    await User.deleteMany({});
    console.log("✅ Collections cleared");

    // Generate and insert users
    console.log("\n👥 Generating 55 Algerian users...");
    const userData = await generateUsers(55);
    const createdUsers = await User.insertMany(userData);
    const userIds = createdUsers.map((u) => u._id.toString());
    console.log(`✅ Created ${createdUsers.length} users`);

    // Generate and insert hotels with bookings
    console.log("\n🏨 Generating 18 hotels with realistic bookings...");
    const hotelData = generateHotels(18, userIds);
    const createdHotels = await Hotel.insertMany(hotelData);
    console.log(`✅ Created ${createdHotels.length} hotels`);

    // Calculate statistics
    let totalBookings = 0;
    for (const hotel of createdHotels) {
      totalBookings += hotel.bookings.length;
    }

    console.log("\n" + "=".repeat(55));
    console.log("📊 COMPREHENSIVE SEED COMPLETED - DATABASE STATISTICS");
    console.log("=".repeat(55));
    console.log(`\n📋 Collections Seeded:`);
    console.log(`   • Users: ${createdUsers.length}`);
    console.log(`   • Hotels: ${createdHotels.length}`);
    console.log(`   • Total Bookings: ${totalBookings}`);
    console.log(`\n🌍 Geographic Coverage:`);
    console.log(`   • Algerian Cities: ${ALGERIAN_CITIES.length}`);
    console.log(
      `   • Hotels per City: ${Math.round(createdHotels.length / ALGERIAN_CITIES.length)}`,
    );
    console.log(`\n🎨 Data Features:`);
    console.log(`   • Available Facilities: ${FACILITIES.length}`);
    console.log(`   • Hotel Images (Cloudinary): ${CLOUDINARY_IMAGES.length}`);
    console.log(`   • Room Types: ${ROOM_TYPES.length}`);
    console.log(`\n📊 Booking Distribution:`);
    console.log(`   • Past Bookings: ~${Math.round(totalBookings * 0.33)}`);
    console.log(`   • Upcoming Bookings: ~${Math.round(totalBookings * 0.33)}`);
    console.log(`   • Future Bookings: ~${Math.round(totalBookings * 0.34)}`);

    // Display sample data
    console.log("\n" + "=".repeat(55));
    console.log("📝 SAMPLE DATA PREVIEW");
    console.log("=".repeat(55));

    console.log("\n👤 Sample User:");
    console.log(
      `   Name: ${createdUsers[0].firstname} ${createdUsers[0].lastname}`,
    );
    console.log(`   Email: ${createdUsers[0].email}`);

    const sampleHotel = createdHotels[0];
    console.log("\n🏨 Sample Hotel:");
    console.log(`   Name: ${sampleHotel.name}`);
    console.log(`   City: ${sampleHotel.city}`);
    console.log(`   Type: ${sampleHotel.type}`);
    console.log(`   Price: $${sampleHotel.pricePerNight}/night`);
    console.log(`   Rating: ${"⭐".repeat(sampleHotel.starRating)}`);
    console.log(`   Bookings: ${sampleHotel.bookings.length}`);
    console.log(
      `   Facilities: ${sampleHotel.facilities.slice(0, 3).join(", ")}...`,
    );
    console.log(`   Images: ${sampleHotel.imageUrls.length} uploaded`);

    if (sampleHotel.bookings.length > 0) {
      console.log("\n📅 Sample Booking:");
      const sampleBooking = sampleHotel.bookings[0];
      const days = Math.ceil(
        (sampleBooking.checkOut.getTime() - sampleBooking.checkIn.getTime()) /
          (1000 * 60 * 60 * 24),
      );
      console.log(
        `   Guest: ${sampleBooking.firstName} ${sampleBooking.lastName}`,
      );
      console.log(`   Email: ${sampleBooking.email}`);
      console.log(`   Check-in: ${sampleBooking.checkIn.toDateString()}`);
      console.log(`   Check-out: ${sampleBooking.checkOut.toDateString()}`);
      console.log(`   Duration: ${days} nights`);
      console.log(`   Total Cost: $${sampleBooking.totalCost}`);
      console.log(
        `   Guests: ${sampleBooking.adultCount} adults, ${sampleBooking.childCount} children`,
      );
    }

    console.log("\n" + "=".repeat(55));
    console.log("✨ Database is ready for testing!");
    console.log("=".repeat(55) + "\n");

    // Disconnect
    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    await mongoose.connection.close();
    process.exit(1);
  }
};

seedData();
