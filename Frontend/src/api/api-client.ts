import { Inputs2 } from "../pages/Register";
import { Inputs1 } from "../pages/Login";
// const url = import.meta.env.API_BASE_URl || "";
import { hotelType } from '../../../Backend/src/models/hotels'
import { HotelSearchResponse } from '../../../Backend/src/types/types'
import { useParams } from "react-router-dom";
import { promises } from "dns";
import { UserType } from '../../../Backend/src/models/User'
import { paymentIntentResponse } from "../../../Backend/src/routes/hotelsRoutes";
import { BookingFormData } from "../components/BookingForm";
import { log } from "console";
export const register = async (formData: Inputs2) => {

    const response = await fetch('http://localhost:8000/api/users/register', {
        method: 'POST',
        credentials: "include",
        headers: {
            'Content-Type': 'application/json' // Correct syntax for the headers object
        },
        body: JSON.stringify(formData) // Convert formData to JSON format
    });

    const responseBody = await response.json()
    console.log(response);

    if (!response.ok) {
        throw new Error(responseBody.message);
    }

};

export const fetchCurrentUser = async (): Promise<UserType> => {
    const response = await fetch('http://localhost:8000/api/users/me', {
        credentials: "include"
    })
    if (!response.ok) {
        throw new Error("Error fetching hotels");
    }

    return response.json();

}

export const Login = async (formData: Inputs1) => {

    const response = await fetch('http://localhost:8000/api/auth/login', {
        method: 'POST',
        credentials: "include",
        headers: {
            'Content-Type': 'application/json' // Correct syntax for the headers object
        },
        body: JSON.stringify(formData) // Convert formData to JSON format
    });
    const responseBody = await response.json()
    console.log(response);

    if (!response.ok) {
        throw new Error(responseBody.message);
    }

};

export const getToken = async () => {
    const response = await fetch("http://localhost:8000/api/auth/validate-token", {
        credentials: "include"
    })
    const responseBody = await response.json()
    console.log(response);

    if (!response.ok) {
        throw new Error(responseBody.message);
    }
}

export const logout = async () => {
    const response = await fetch("http://localhost:8000/api/auth/logout", {
        credentials: "include",
        method: "POST"
    })
    const responseBody = await response.json()
    console.log(response);

    if (!response.ok) {
        throw new Error(responseBody.message);
    }
}

export const addMyHotel = async (HotelFormData: FormData) => {
    const response = await fetch('http://localhost:8000/api/my-hotels', {
        credentials: "include",
        method: "POST",
        body: HotelFormData
    })

    console.log(response);
    if (!response.ok) {
        throw new Error("Failed to add hotel")
    }

    return await response.json()
}

export const getMyHotels = async (): Promise<hotelType[]> => {
    try {
        const response = await fetch('http://localhost:8000/api/my-hotels', {
            credentials: 'include',
        });

        if (!response.ok) {
            throw new Error('Failed to fetch hotels'); // Throw an error for non-200 status codes
        }

        const data = await response.json(); // Parse JSON response
        return data;
    } catch (error) {
        console.error('Error fetching hotels:', error);
        throw error; // Rethrow the error to be caught by the caller
    }
};

export const fetchMyHotelById = async (hotelId: string): Promise<hotelType> => {
    const response = await fetch(`http://localhost:8000/api/my-hotels/${hotelId}`, {
        credentials: "include",
    });
    console.log('1');

    console.log(response);
    if (!response.ok) {
        throw new Error("Error fetching Hotels");
    }

    return response.json();
};

export const updateMyHotelById = async (hotelFormData: FormData) => {
    const response = await fetch(
        `http://localhost:8000/api/my-hotels/${hotelFormData.get("hotelId")}`,
        {
            method: "PUT",
            body: hotelFormData,
            credentials: "include",
        }
    );
    console.log('2');

    console.log(response);

    if (!response.ok) {
        throw new Error("Failed to update Hotel");
    }

    return response.json();
};

export type SearchParams = {
    destination?: string;
    checkIn?: string;
    checkOut?: string;
    adultCount?: string;
    childCount?: string;
    page?: string;
    facilities?: string[];
    types?: string[];
    stars?: string[];
    maxPrice?: string;
    sortOption?: string;
};

export const searchHotels = async (
    searchParams: SearchParams
): Promise<HotelSearchResponse> => {
    const queryParams = new URLSearchParams();
    queryParams.append("destination", searchParams.destination || "");
    queryParams.append("checkIn", searchParams.checkIn || "");
    queryParams.append("checkOut", searchParams.checkOut || "");
    queryParams.append("adultCount", searchParams.adultCount || "");
    queryParams.append("childCount", searchParams.childCount || "");
    queryParams.append("page", searchParams.page || "");

    queryParams.append("maxPrice", searchParams.maxPrice || "");
    queryParams.append("sortOption", searchParams.sortOption || "");

    searchParams.facilities?.forEach((facility) =>
        queryParams.append("facilities", facility)
    );

    searchParams.types?.forEach((type) => queryParams.append("types", type));
    searchParams.stars?.forEach((star) => queryParams.append("stars", star));

    const response = await fetch(`http://localhost:8000/api/hotels/search?${queryParams}`)


    if (!response.ok) {
        throw new Error("Error fetching hotels");
    }

    return response.json();
};

export const createRoomBooking = async (formData: BookingFormData,) => {
    const response = await fetch(`http://localhost:8000/api/hotels/${formData.hotelId}/bookings`, {
        credentials: "include",
        method: "POOST",
        body: JSON.stringify(
            formData
        ),
        headers: {
            "Content-Type": "application/json"
        },
    })

    if (!response.ok) {
        throw new Error("Error fetching hotels");
    }

    return response.json();


}

export const createPaymentIntent = async (hotelId: string, numberOfNights: string): Promise<paymentIntentResponse> => {
    console.log(hotelId);
    console.log(numberOfNights);

    const response = await fetch(`http://localhost:8000/api/hotels/${hotelId}/booking/payment-intent`, {
        credentials: "include",
        method: "POST",
        body: JSON.stringify({
            numberOfNights
        }),
        headers: {
            "Content-Type": "application/json"
        },
    })

    if (!response.ok) {
        throw new Error("Error fetching hotels");
    }

    console.log(response);

    return response.json();

}


export const fetchHotelById = async (hotelId: string): Promise<hotelType> => {
    const response = await fetch(`http://localhost:8000/api/hotels/` + hotelId)

    if (!response.ok) {
        throw new Error("Error fetching hotels");
    }

    return response.json();

}




