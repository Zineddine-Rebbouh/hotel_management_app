import { hotelType } from "../models/hotels"

export type HotelSearchResponse = {
    data: hotelType[],
    pagination: {
        total: number,
        page: number,
        pages: number,
    }
}