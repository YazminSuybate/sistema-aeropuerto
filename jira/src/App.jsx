import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Home from "./pages/Home";
import LoginPage from "./features/auth/pages/LoginPage";
import AdminHome from "./features/admin/pages/AdminHome";
import UserManagement from "./features/admin/pages/UserManagement";
import ProtectedRoute from "./components/ProtectedRoute";
import NotFoundPage from "./pages/NotFound";
import { BandejaOperativoPage } from "./features/operativo/pages/BandejaOperativoPage";
import AtencionPasajeroPage from "./features/atencion/pages/AtencionPasajeroPage";
export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/home" element={<Home />} />

        <Route path="/" element={<Navigate to="/auth" replace />} />
        <Route path="/auth" element={<LoginPage />} />

        <Route element={<ProtectedRoute allowedRoles={["Administrador"]} />}>
          <Route path="/admin" element={<AdminHome />} />
        </Route>

        {/* --- RUTA DE ATENCIÓN AL PASAJERO --- */}
        <Route
          element={
            <ProtectedRoute allowedRoles={["Atención al Pasajero"]} />
          }
        >
          <Route path="/atencion" element={<AtencionPasajeroPage />} />
        </Route>

        <Route
          element={
            <ProtectedRoute
              allowedRoles={[
                "Agente Operativo Junior",
                "Agente Operativo Senior",
              ]}
            />
          }
        >
          <Route path="/bandeja" element={<BandejaOperativoPage />} />
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
}
