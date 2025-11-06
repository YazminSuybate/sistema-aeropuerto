import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import AuthPage from "./pages/AuthPage";
import AdminHome from "./pages/admin/AdminHome";
import UserManagement from "./pages/admin/UserManagement";
import ProtectedRoute from "../src/components/ProtectedRoute";
import NotFoundPage from "./pages/NotFound";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/home" element={<Home />} />

        <Route path="/" element={<Navigate to="/auth" replace />} />
        <Route path="/auth" element={<AuthPage />} />

        <Route element={<ProtectedRoute allowedRoles={['Administrador']} />}>
          <Route path="/admin" element={<AdminHome />} />
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
}
