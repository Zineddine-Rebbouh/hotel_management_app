import { useQuery } from "react-query";
import * as apiClient from "../api/api-client";
import { useAppContext } from "../contexts/AppContext";

type DashboardStats = {
  totalHotels: number;
  totalBookings: number;
  totalRevenue: number;
  avgBookingsPerHotel: number;
  bookingsByMonth: Record<string, number>;
  hotelStats: Array<{
    hotelId: string;
    hotelName: string;
    city: string;
    bookingsCount: number;
    revenue: number;
  }>;
};

const Dashboard = () => {
  const { showToast } = useAppContext();

  const {
    data: statsData,
    isLoading,
    error,
  } = useQuery("fetchDashboardStats", () => apiClient.fetchDashboardStats(), {
    onError: () => {
      showToast({
        message: "Error fetching dashboard statistics",
        type: "ERROR",
      });
    },
  });

  const stats: DashboardStats | undefined = statsData?.statistics;

  return (
    <div className="space-y-6">
      <h1 className="text-4xl font-bold">Dashboard</h1>

      {isLoading && (
        <div className="flex justify-center items-center p-8">
          <div className="text-gray-500 text-lg">
            Loading dashboard statistics...
          </div>
        </div>
      )}

      {error && (
        <div className="bg-red-100 border border-red-500 text-red-700 px-6 py-4 rounded">
          <p>Error loading statistics. Please try again later.</p>
        </div>
      )}

      {!isLoading && stats && (
        <>
          {/* Quick Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Total Hotels */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-300 rounded-lg p-6">
              <div className="text-gray-600 text-sm font-semibold mb-2">
                Total Hotels
              </div>
              <div className="text-4xl font-bold text-blue-600">
                {stats.totalHotels}
              </div>
              <p className="text-xs text-gray-600 mt-2">Properties you own</p>
            </div>

            {/* Total Bookings */}
            <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-300 rounded-lg p-6">
              <div className="text-gray-600 text-sm font-semibold mb-2">
                Total Bookings
              </div>
              <div className="text-4xl font-bold text-green-600">
                {stats.totalBookings}
              </div>
              <p className="text-xs text-gray-600 mt-2">Across all hotels</p>
            </div>

            {/* Total Revenue */}
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-300 rounded-lg p-6">
              <div className="text-gray-600 text-sm font-semibold mb-2">
                Total Revenue
              </div>
              <div className="text-4xl font-bold text-purple-600">
                £{stats.totalRevenue.toFixed(2)}
              </div>
              <p className="text-xs text-gray-600 mt-2">From all bookings</p>
            </div>

            {/* Avg Bookings Per Hotel */}
            <div className="bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-300 rounded-lg p-6">
              <div className="text-gray-600 text-sm font-semibold mb-2">
                Avg Bookings/Hotel
              </div>
              <div className="text-4xl font-bold text-orange-600">
                {stats.avgBookingsPerHotel}
              </div>
              <p className="text-xs text-gray-600 mt-2">
                Bookings per property
              </p>
            </div>
          </div>

          {/* Bookings by Month Chart (Simple Table) */}
          {Object.keys(stats.bookingsByMonth).length > 0 && (
            <div className="bg-white border border-slate-300 rounded-lg p-6">
              <h2 className="text-2xl font-bold mb-4">Bookings by Month</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                {Object.entries(stats.bookingsByMonth).map(([month, count]) => (
                  <div
                    key={month}
                    className="bg-slate-50 border border-slate-200 rounded p-3 text-center hover:bg-slate-100 transition"
                  >
                    <p className="text-xs font-semibold text-gray-600 mb-2">
                      {month}
                    </p>
                    <p className="text-2xl font-bold text-blue-600">{count}</p>
                    <p className="text-xs text-gray-500">
                      booking{count !== 1 ? "s" : ""}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Per-Hotel Statistics */}
          {stats.hotelStats.length > 0 && (
            <div className="bg-white border border-slate-300 rounded-lg p-6">
              <h2 className="text-2xl font-bold mb-4">
                Your Hotels Performance
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-slate-100 border-b-2 border-slate-300">
                    <tr>
                      <th className="px-4 py-3 font-semibold text-gray-700">
                        Hotel Name
                      </th>
                      <th className="px-4 py-3 font-semibold text-gray-700">
                        City
                      </th>
                      <th className="px-4 py-3 font-semibold text-gray-700 text-center">
                        Bookings
                      </th>
                      <th className="px-4 py-3 font-semibold text-gray-700 text-right">
                        Revenue
                      </th>
                      <th className="px-4 py-3 font-semibold text-gray-700 text-center">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.hotelStats.map((hotel, idx) => (
                      <tr
                        key={hotel.hotelId}
                        className={`border-b border-slate-200 hover:bg-slate-50 transition ${
                          idx % 2 === 0 ? "bg-white" : "bg-slate-50"
                        }`}
                      >
                        <td className="px-4 py-3">
                          <a
                            href={`/edit-hotel/${hotel.hotelId}`}
                            className="text-blue-600 hover:text-blue-800 font-semibold"
                          >
                            {hotel.hotelName}
                          </a>
                        </td>
                        <td className="px-4 py-3 text-gray-700">
                          {hotel.city}
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold">
                            {hotel.bookingsCount}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right font-semibold text-green-600">
                          £{hotel.revenue.toFixed(2)}
                        </td>
                        <td className="px-4 py-3 text-center">
                          <a
                            href={`/edit-hotel/${hotel.hotelId}`}
                            className="text-blue-500 hover:text-blue-700 text-sm font-semibold"
                          >
                            View
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {stats.totalHotels === 0 && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-8 text-center">
              <p className="text-gray-600 text-lg">
                You haven't added any hotels yet.
              </p>
              <a
                href="/add-hotel"
                className="text-blue-600 hover:text-blue-800 font-semibold mt-2 inline-block"
              >
                Add your first hotel →
              </a>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Dashboard;
