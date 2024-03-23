import React from 'react'
import * as apiClient from '../api/api-client'
import { useQuery } from 'react-query'
const Booking = () => {

    const { data: currentUser } = useQuery('getCurrentUser', apiClient.fetchCurrentUser);

    console.log(currentUser?.email);

    return (
        <div>
            Booked
        </div>
    )
}

export default Booking
