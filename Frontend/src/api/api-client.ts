import { Inputs2 } from "../pages/Register";
import { Inputs1 } from "../pages/Login";
import { hotelType, HotelSearchResponse, UserType, paymentIntentResponse } from "../types/shared";
import { BookingFormData } from "../components/BookingForm";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

// ─────────────────────────────────────────────────────────────
// CSRF Token Management
// ─────────────────────────────────────────────────────────────

let cachedCsrfToken: string | null = null;

/**
 * Fetches the CSRF token from the backend once and caches it in memory.
 * The token is sent by the server as a JSON field; the corresponding cookie
 * is set HttpOnly so JS cannot read it directly (that's by design for
 * the double-submit cookie pattern used by csrf-csrf).
 */
async function getCsrfToken(): Promise<string> {
  if (cachedCsrfToken) return cachedCsrfToken;

  const response = await fetch(`${API_BASE_URL}/api/csrf-token`, {
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch CSRF token");
  }

  const data = await response.json();
  cachedCsrfToken = data.csrfToken as string;
  return cachedCsrfToken;
}

/**
 * Returns headers with the CSRF token included for mutating requests
 * (POST, PUT, DELETE). The server validates the `x-csrf-token` header
 * against the double-submit cookie.
 */
async function csrfHeaders(
  extra?: Record<string, string>,
): Promise<Record<string, string>> {
  const token = await getCsrfToken();
  return {
    "x-csrf-token": token,
    ...extra,
  };
}

// ─────────────────────────────────────────────────────────────
// Auth & User APIs
// ─────────────────────────────────────────────────────────────

export const register = async (formData: Inputs2) => {
  const response = await fetch(`${API_BASE_URL}/api/users/register`, {
    method: "POST",
    credentials: "include",
    headers: await csrfHeaders({ "Content-Type": "application/json" }),
    body: JSON.stringify(formData),
  });

  const responseBody = await response.json();

  if (!response.ok) {
    throw new Error(responseBody.message);
  }
};

export const fetchCurrentUser = async (): Promise<UserType> => {
  const response = await fetch(`${API_BASE_URL}/api/users/me`, {
    credentials: "include",
  });
  if (!response.ok) {
    throw new Error("Error fetching user");
  }

  return response.json();
};

export const Login = async (formData: Inputs1) => {
  const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
    method: "POST",
    credentials: "include",
    headers: await csrfHeaders({ "Content-Type": "application/json" }),
    body: JSON.stringify(formData),
  });
  const responseBody = await response.json();

  if (!response.ok) {
    throw new Error(responseBody.message);
  }
};

export const getToken = async () => {
  const response = await fetch(`${API_BASE_URL}/api/auth/validate-token`, {
    credentials: "include",
  });
  const responseBody = await response.json();

  if (!response.ok) {
    throw new Error(responseBody.message);
  }
};

export const logout = async () => {
  const response = await fetch(`${API_BASE_URL}/api/auth/logout`, {
    credentials: "include",
    method: "POST",
    headers: await csrfHeaders(),
  });
  const responseBody = await response.json();

  if (!response.ok) {
    throw new Error(responseBody.message);
  }
};

// ─────────────────────────────────────────────────────────────
// Hotel Management APIs (authenticated)
// ─────────────────────────────────────────────────────────────

export const addMyHotel = async (HotelFormData: FormData) => {
  // Note: do not set Content-Type for FormData — the browser sets it
  // automatically with the correct multipart boundary.
  const response = await fetch(`${API_BASE_URL}/api/my-hotels`, {
    credentials: "include",
    method: "POST",
    headers: await csrfHeaders(),
    body: HotelFormData,
  });

  if (!response.ok) {
    throw new Error("Failed to add hotel");
  }

  return await response.json();
};

export const getMyHotels = async (): Promise<hotelType[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/my-hotels`, {
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error("Failed to fetch hotels");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    throw error;
  }
};

export const fetchMyHotelById = async (hotelId: string): Promise<hotelType> => {
  const response = await fetch(`${API_BASE_URL}/api/my-hotels/${hotelId}`, {
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Error fetching Hotels");
  }

  return response.json();
};

export const updateMyHotelById = async (hotelFormData: FormData) => {
  const response = await fetch(
    `${API_BASE_URL}/api/my-hotels/${hotelFormData.get("hotelId")}`,
    {
      method: "PUT",
      body: hotelFormData,
      credentials: "include",
      headers: await csrfHeaders(),
    },
  );

  if (!response.ok) {
    throw new Error("Failed to update Hotel");
  }

  return response.json();
};

// ─────────────────────────────────────────────────────────────
// Hotel Search & Public APIs
// ─────────────────────────────────────────────────────────────

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
  searchParams: SearchParams,
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
    queryParams.append("facilities", facility),
  );

  searchParams.types?.forEach((type) => queryParams.append("types", type));
  searchParams.stars?.forEach((star) => queryParams.append("stars", star));

  const response = await fetch(
    `${API_BASE_URL}/api/hotels/search?${queryParams}`,
  );

  if (!response.ok) {
    throw new Error("Error fetching hotels");
  }

  return response.json();
};

// ─────────────────────────────────────────────────────────────
// Booking & Payment APIs
// ─────────────────────────────────────────────────────────────

export const createRoomBooking = async (formData: BookingFormData) => {
  const response = await fetch(
    `${API_BASE_URL}/api/hotels/${formData.hotelId}/bookings`,
    {
      credentials: "include",
      method: "POST",
      body: JSON.stringify(formData),
      headers: await csrfHeaders({ "Content-Type": "application/json" }),
    },
  );

  if (!response.ok) {
    throw new Error("Error creating booking");
  }

  return response.json();
};

export const createPaymentIntent = async (
  hotelId: string,
  numberOfNights: string,
): Promise<paymentIntentResponse> => {
  const response = await fetch(
    `${API_BASE_URL}/api/hotels/${hotelId}/booking/payment-intent`,
    {
      credentials: "include",
      method: "POST",
      body: JSON.stringify({
        numberOfNights,
      }),
      headers: await csrfHeaders({ "Content-Type": "application/json" }),
    },
  );

  if (!response.ok) {
    throw new Error("Error creating payment intent");
  }

  return response.json();
};

export const fetchHotelById = async (hotelId: string): Promise<hotelType> => {
  const response = await fetch(`${API_BASE_URL}/api/hotels/` + hotelId);

  if (!response.ok) {
    throw new Error("Error fetching hotels");
  }

  return response.json();
};

// ─────────────────────────────────────────────────────────────
// User Bookings & Dashboard
// ─────────────────────────────────────────────────────────────

export const fetchMyBookings = async () => {
  const response = await fetch(`${API_BASE_URL}/api/hotels/user/bookings`, {
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Error fetching user bookings");
  }

  return response.json();
};

export const fetchDashboardStats = async () => {
  const response = await fetch(
    `${API_BASE_URL}/api/my-hotels/dashboard/stats`,
    {
      credentials: "include",
    },
  );

  if (!response.ok) {
    throw new Error("Error fetching dashboard statistics");
  }

  return response.json();
};
