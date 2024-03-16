import { Request, Response } from "express";
import Hotel, { hotelType } from "../models/hotels";
import { uploadImages } from "../routes/hotelsRoutes";

export const addHotel = async (req: Request, res: Response) => {
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
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error });
    }
}

export const getMyHotels = async (req: Request, res: Response) => {
    try {
        const hotels = await Hotel.find({ userId: req.userId })
            .sort("-lastUpdated");

        res.status(200).json(hotels)
    } catch (e) {
        res.status(500).json({ message: 'Server error' });
    }
}

export const getHotel = async (req: Request, res: Response) => {
    const id = req.params.id.toString();
    try {
        const hotel = await Hotel.findOne({
            _id: id,
            userId: req.userId,
        });
        res.json(hotel);
    } catch (error) {
        res.status(500).json({ message: "Error fetching hotels" });
    }
}

export const updateHotel = async (req: Request, res: Response) => {
    try {
        const updatedHotel: hotelType = req.body;
        updatedHotel.lastUpdated = new Date();

        const hotel = await Hotel.findOneAndUpdate(
            {
                _id: req.params.hotelId,
                userId: req.userId,
            },
            updatedHotel,
            { new: true }
        );

        if (!hotel) {
            return res.status(404).json({ message: "Hotel not found" });
        }

        const files = req.files as Express.Multer.File[];
        const updatedImageUrls = await uploadImages(files);

        hotel.imageUrls = [
            ...updatedImageUrls,
            ...(updatedHotel.imageUrls || []),
        ];

        await hotel.save();
        res.status(201).json(hotel);
    } catch (error) {
        res.status(500).json({ message: "Something went throw" });
    }
}