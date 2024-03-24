import express, { Request, Response, response } from 'express'
import { getHotelById, searchHotels } from "../Controllers/hotelsController";
import { param } from 'express-validator';
import Stripe from 'stripe'
import { validateToken } from '../Middelware/validateToken';
import Hotel from '../models/hotels';

export type paymentIntentResponse = {
    totalCost: number,
    paymentIntentId: string,
    clientSecret: string
}

export type BookingType = {
    _id: string,
    userId: string,
    firstName: string,
    lastName: string,
    email: string,
    adultCount: number,
    childCount: number,
    checkOut: Date,
    checkIn: Date,
    totalCost: number
}
const stripe = new Stripe("sk_test_51OxLiTIO9Wp11eFf9KmcKEgjZXIrF0SsyqaSLRumbxidGgbUVUdprMlHVFsT6DAFrmJzJo1mhnw2mRlFUZdseBKt006vn1816v")

const router = express.Router()
router.get('/search', searchHotels);
router.get('/:id', param("id").notEmpty().withMessage("Params is required "), getHotelById)

router.post('/:hotelId/booking/payment-intent', validateToken, async (req: Request, res: Response) => {
    //1 - totalCost
    console.log('here paymentIntent');

    const { numberOfNights } = req.body
    //2-hotelId
    const hotelId = req.params.hotelId;
    const hotel = await Hotel.findById(hotelId)

    if (!hotel) {
        return res.status(404).json({ message: "Hotel not found" })
    }

    const totalCost = hotel.pricePerNight * numberOfNights;
    console.log(totalCost);

    //3-userId
    const paymentIntent = await stripe.paymentIntents.create({
        amount: totalCost * 100,
        currency: "gbp",
        metadata: {
            hotelId,
            userId: req.userId
        }
    })

    console.log(paymentIntent);

    if (!paymentIntent) {
        return res.status(500).json({ message: 'Error creating payment intent' })
    }

    const response = {
        totalCost: totalCost,
        paymentIntentId: paymentIntent.id,
        clientSecret: paymentIntent.client_secret?.toString()
    }

    return res.status(200).json(response)

})

router.post('/:hotelId/bookings', validateToken, async (req: Request, res: Response) => {
    try {
        const paymentIntentId = req.body.paymentIntentId
        const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId as string)

        if (!paymentIntent) {
            return res.status(500).json({ message: "payment intent failed" })
        }

        if (paymentIntent.metadata.hotelId !== req.params.hotelId || paymentIntent.metadata.userId !== req.userId) {
            return res.status(400).json({ messsage: 'payment intent mismatch' })
        }

        if (paymentIntent.status !== "succeeded") {
            return res.status(500).json({ message: "payment intent not succeeded , Status : " + paymentIntent.status })
        }

        const newBooking: BookingType = {
            ...req.body, userId: req.userId
        }
        const hotel = await Hotel.findOneAndUpdate({
            _id: req.params.hotelId
        }, {
            $push: { bookings: newBooking },
        }
        )

        if (!hotel) {
            return res.status(500).json({ message: "payment intent not succeeded , Status : " + paymentIntent.status })
        }

        await hotel.save()

        return res.status(200).json(
            { message: "Payment succeeded" }
        )

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Something went wrong" })
    }
})

export default router;


