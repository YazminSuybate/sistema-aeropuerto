import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Home from "./pages/Home"
import AuthPage from "./pages/AuthPage"
import AdminHome from "./pages/admin/AdminHome"

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/admin" element={<AdminHome />} />
      </Routes>
    </Router>
  )
}
