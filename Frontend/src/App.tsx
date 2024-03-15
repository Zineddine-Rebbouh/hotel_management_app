import { Navigate, Route, BrowserRouter as Router, Routes } from "react-router-dom"
import Layout from "./layouts/Layout"
import Register from "./pages/Register"
import Login from "./pages/Login"

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout>{<p>Home page</p>}</Layout>} />
        <Route path="/search" element={<Layout>{<p>Search page</p>}</Layout>} />
        <Route path="/sign-up" element={<Layout><Register /></Layout>} />
        <Route path="/sign-in" element={<Layout><Login /></Layout>} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  )
}

export default App
