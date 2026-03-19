import { useQuery } from "react-query";
import * as apiClient from "../api/api-client";
import { useAppContext } from "../contexts/AppContext";

type BookingInfo = {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  adultCount: number;
  childCount: number;
  checkIn: string;
  checkOut: string;
  totalCost: number;
  hotelName: string;
  hotelCity: string;
  hotelId: string;
};

const MyBookings = () => {
  const { showToast } = useAppContext();

  const {
    data: bookingsData,
    isLoading,
    error,
  } = useQuery("fetchMyBookings", () => apiClient.fetchMyBookings(), {
    onError: () => {
      showToast({ message: "Error fetching bookings", type: "ERROR" });
    },
  });

  const bookings: BookingInfo[] = bookingsData?.bookings || [];

  return (
    <div className="space-y-6">
      <h1 className="text-4xl font-bold">My Bookings</h1>

      {isLoading && (
        <div className="flex justify-center items-center p-8">
          <div className="text-gray-500 text-lg">Loading your bookings...</div>
        </div>
      )}

      {error && (
        <div className="bg-red-100 border border-red-500 text-red-700 px-6 py-4 rounded">
          <p>Error loading bookings. Please try again later.</p>
        </div>
      )}

      {!isLoading && bookings.length === 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-8 text-center">
          <p className="text-gray-600 text-lg">
            You haven't made any bookings yet.
          </p>
          <a
            href="/search"
            className="text-blue-600 hover:text-blue-800 font-semibold mt-2 inline-block"
          >
            Start searching for hotels →
          </a>
        </div>
      )}

      {!isLoading && bookings.length > 0 && (
        <div className="grid gap-4">
          {bookings.map((booking) => {
            const checkInDate = new Date(booking.checkIn);
            const checkOutDate = new Date(booking.checkOut);
            const nightsCount = Math.ceil(
              (checkOutDate.getTime() - checkInDate.getTime()) /
                (1000 * 60 * 60 * 24),
            );

            return (
              <div
                key={booking._id}
                className="border border-slate-300 rounded-lg p-6 hover:shadow-lg transition-shadow"
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Hotel Info */}
                  <div>
                    <h3 className="text-xl font-bold text-blue-600 mb-2">
                      {booking.hotelName}
                    </h3>
                    <p className="text-gray-600">📍 {booking.hotelCity}</p>
                    <a
                      href={`/detail/${booking.hotelId}`}
                      className="text-blue-500 hover:text-blue-700 text-sm mt-2 inline-block"
                    >
                      View hotel details →
                    </a>
                  </div>

                  {/* Booking Dates */}
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">
                      Booking Details
                    </h4>
                    <div className="space-y-1 text-sm text-gray-700">
                      <p>
                        <strong>Check-in:</strong>{" "}
                        {checkInDate.toLocaleDateString()}
                      </p>
                      <p>
                        <strong>Check-out:</strong>{" "}
                        {checkOutDate.toLocaleDateString()}
                      </p>
                      <p>
                        <strong>Duration:</strong> {nightsCount} night
                        {nightsCount !== 1 ? "s" : ""}
                      </p>
                      <p>
                        <strong>Guests:</strong> {booking.adultCount} adult
                        {booking.adultCount !== 1 ? "s" : ""}
                        {booking.childCount > 0 &&
                          `, ${booking.childCount} child${booking.childCount !== 1 ? "ren" : ""}`}
                      </p>
                    </div>
                  </div>

                  {/* Guest & Cost Info */}
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">
                      Guest Information
                    </h4>
                    <div className="space-y-1 text-sm text-gray-700">
                      <p>
                        <strong>Name:</strong> {booking.firstName}{" "}
                        {booking.lastName}
                      </p>
                      <p>
                        <strong>Email:</strong> {booking.email}
                      </p>
                      <div className="bg-green-50 border border-green-200 rounded p-3 mt-2">
                        <p className="text-lg font-bold text-green-700">
                          £{booking.totalCost.toFixed(2)}
                        </p>
                        <p className="text-xs text-gray-600">Total paid</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyBookings;
