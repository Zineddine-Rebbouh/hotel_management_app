import { useEffect, useState } from 'react'
import * as apiClient from '../api/api-client'
import { useQuery } from 'react-query'
import BookingForm from '../components/BookingForm';
import { useParams } from 'react-router-dom';
import { useSearchContext } from '../contexts/SearchContext';
import BookingDeatailsSummary from '../components/BookingDeatailsSummary';
import { Elements } from '@stripe/react-stripe-js';
import { useAppContext } from '../contexts/AppContext';
import { log } from 'console';

const Booking = () => {
    const search = useSearchContext()
    const { hotelId } = useParams()
    const { stripePromise } = useAppContext()
    const [numberOfNights, setNumberOfNights] = useState<number>(0)

    useEffect(() => {
        if (search.checkIn && search.checkOut) {
            const nights = Math.abs(search.checkOut.getTime() - search.checkIn.getTime()) / (1000 * 60 * 60 * 24)
            setNumberOfNights(Math.ceil(nights))
        }
        console.log(numberOfNights);
    }, [search.checkIn, search.checkOut])

    const { data: paymentIntentData } = useQuery('getHotelByHotelId',
        () => apiClient.createPaymentIntent(hotelId as string, numberOfNights.toString()), {
        enabled: !!hotelId && numberOfNights > 0,
    }
    )

    console.log(paymentIntentData);


    const { data: hotel } = useQuery('getHotelByHotelId',
        () => apiClient.fetchHotelById(hotelId as string), {
        enabled: !!hotelId,
    }
    )

    const { data: currentUser } = useQuery('getCurrentUser', apiClient.fetchCurrentUser);

    console.log(currentUser?.email);

    if (!hotel) {
        return <></>
    }

    return (
        <div className='grid md:grid-cols-[1fr_2fr]'>
            {/* <div className='bg-green-200 '>
                BOOKING DETAILS SUMMMARY
            </div>
             */}
            <BookingDeatailsSummary checkIn={search.checkIn} checkOut={search.checkOut} adultCount={search.adultCount} childCount={search.childCount} numberOfNights={numberOfNights} hotel={hotel} />
            {currentUser && paymentIntentData && (
                <Elements stripe={stripePromise} options={{
                    clientSecret: paymentIntentData.clientSecret,

                }}>
                    <BookingForm currentUser={currentUser} paymentIntent={paymentIntentData} />
                </Elements>
            )}
        </div>
    )
}

export default Booking
