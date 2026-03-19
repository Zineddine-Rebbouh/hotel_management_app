import mongoose from "mongoose";
import Hotel from "./src/models/hotels";

async function run() {
  await mongoose.connect("mongodb://localhost:27017/hotel_management_app");
  const hotel = await Hotel.findOne().lean();
  if (!hotel) {
    console.log("No hotel found");
    await mongoose.disconnect();
    return;
  }
  console.log("Hotel imageUrls:", hotel.imageUrls);
  await mongoose.disconnect();
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
