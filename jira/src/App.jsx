import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Home from "./pages/Home";
import LoginPage from "./features/auth/pages/LoginPage";
import AdminHome from "./features/admin/pages/AdminHome";
import ProtectedRoute from "./components/ProtectedRoute";
import NotFoundPage from "./pages/NotFound";
import { BandejaOperativoPage } from "./features/operativo/pages/BandejaOperativoPage";
import AtencionPasajeroPage from "./features/atencion/pages/AtencionPasajeroPage";

// 1. IMPORTAMOS EL DASHBOARD DE GERENCIA (Verifica que la ruta coincida con tu imagen)
import GerenciaDashboard from "./features/gerencia/pages/GerenciaDashboard";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/home" element={<Home />} />

        <Route path="/" element={<Navigate to="/auth" replace />} />
        <Route path="/auth" element={<LoginPage />} />

        {/* RUTAS DE ADMINISTRADOR */}
        <Route element={<ProtectedRoute allowedRoles={["Administrador"]} />}>
          <Route path="/admin" element={<AdminHome />} />
        </Route>

        {/* RUTAS DE ATENCIÓN AL PASAJERO */}
        <Route
          element={
            <ProtectedRoute allowedRoles={["Atención al Pasajero"]} />
          }
        >
          <Route path="/atencion" element={<AtencionPasajeroPage />} />
        </Route>

        {/* RUTAS DE OPERATIVO */}
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

        {/* --- 2. NUEVA RUTA DE GERENCIA --- */}
        <Route
          element={
            <ProtectedRoute allowedRoles={["Gerencia"]} />
          }
        >
          <Route path="/gerencia" element={<GerenciaDashboard />} />
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
}