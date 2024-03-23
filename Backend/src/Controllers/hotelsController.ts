import { Request, Response } from "express";
import Hotel, { hotelType } from "../models/hotels";
import { uploadImages } from "../routes/MyhotelsRoutes";
import { validationResult } from "express-validator";

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

export const searchHotels = async (req: Request, res: Response) => {
    try {

        let sortOptions = {};
        switch (req.query.sortOption) {
            case "starRating":
                sortOptions = { starRating: -1 };
                break;
            case "pricePerNightAsc":
                sortOptions = { pricePerNight: 1 };
                break;
            case "pricePerNightDesc":
                sortOptions = { pricePerNight: -1 };
                break;
        }

        const query = constructSearchQuery(req.query);


        const pageSize = 5;
        const pageNumber = parseInt(req.query.page ? req.query.page.toString() : '1');
        const skip = (pageNumber - 1) * pageSize;
        const hotels = await Hotel.find(query).sort(sortOptions).skip(skip).limit(pageSize);
        const totalNumberOfHotelsExisted = await Hotel.countDocuments()

        console.log('here search controller');

        const response = {
            data: hotels, pagination: { totalNumberOfHotelsExisted, pageNumber, pages: Math.ceil(totalNumberOfHotelsExisted / pageSize) }
        }

        res.json(response)
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Something went throw" });
    }
}

const constructSearchQuery = (queryParams: any) => {
    let constructedQuery: any = {};

    if (queryParams.destination) {
        constructedQuery.$or = [
            { city: new RegExp(queryParams.destination, "i") },
            { country: new RegExp(queryParams.destination, "i") },
        ];
    }

    if (queryParams.adultCount) {
        constructedQuery.adultCount = {
            $gte: parseInt(queryParams.adultCount),
        };
    }

    if (queryParams.childCount) {
        constructedQuery.childCount = {
            $gte: parseInt(queryParams.childCount),
        };
    }

    if (queryParams.facilities) {
        constructedQuery.facilities = {
            $all: Array.isArray(queryParams.facilities)
                ? queryParams.facilities
                : [queryParams.facilities],
        };
    }

    if (queryParams.types) {
        constructedQuery.type = {
            $in: Array.isArray(queryParams.types)
                ? queryParams.types
                : [queryParams.types],
        };
    }

    if (queryParams.stars) {
        const starRatings = Array.isArray(queryParams.stars)
            ? queryParams.stars.map((star: string) => parseInt(star))
            : parseInt(queryParams.stars);
        constructedQuery.starRating = { $in: starRatings };
    }

    if (queryParams.maxPrice) {
        constructedQuery.pricePerNight = {
            $lte: parseInt(queryParams.maxPrice).toString(),
        };
    }

    return constructedQuery;
};

export const getHotelById = async (req: Request, res: Response) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, error: 'Bad request', data: errors.array() })
    }

    const id = req.params.id.toString()

    try {
        const hotel = await Hotel.findById(id)
        return res.status(200).json(hotel)
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "error fetching the hotel " })

    }
}