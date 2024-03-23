import { Navigate, Route, BrowserRouter as Router, Routes } from "react-router-dom"
import Layout from "./layouts/Layout"
import Register from "./pages/Register"
import Login from "./pages/Login"
import AddHotel from "./pages/AddHotel"
import { useAppContext } from "./contexts/AppContext"
import MyHotels from "./pages/MyHotels"
import EditHotel from "./pages/EditHotel"
import Search from "./pages/Search"
import Detail from "./pages/DetailedHotel"
import Booking from "./pages/Booking"

function App() {
  const { isLoggedIn } = useAppContext()
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout>{<p>Home page</p>}</Layout>} />
        <Route path="/sign-up" element={<Layout><Register /></Layout>} />
        <Route path="/sign-in" element={<Layout><Login /></Layout>} />
        <Route path="/search" element={<Layout><Search /></Layout>} />
        <Route
          path="/detail/:hotelId"
          element={
            <Layout>
              <Detail />
            </Layout>
          }
        />
        <Route
          path="/register"
          element={
            <Layout>
              <Register />
            </Layout>
          }
        />
        {
          isLoggedIn &&
          <>
            <Route path="/add-hotel" element={<Layout><AddHotel /></Layout>} />
            <Route path="/hotel/:hotelId/booking" element={<Layout><Booking /></Layout>} />
            <Route path="/my-hotels" element={<Layout><MyHotels /></Layout>} />
            <Route path="/edit-hotel/:hotelId" element={<Layout><EditHotel /></Layout>} />
          </>
        }
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  )
}

export default App
