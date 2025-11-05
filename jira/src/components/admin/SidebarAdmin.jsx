import { useNavigate } from "react-router-dom";
import Button from "../admin/userManagement/Button";
import "../../styles/SidebarAdmin.css";
import FotoAdmin from "../../assets/FotoAdmin.jpg";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const getName = () => {
  try {
    const userString = localStorage.getItem("user");
    if (userString) {
      const user = JSON.parse(userString);
      return `${user.nombre} ${user.apellido}`;
    }
  } catch (e) {
    console.error("Error al parsear datos de usuario de localStorage:", e);
  }
  return "Usuario";
};

export default function SidebarAdmin({ setActivePanel }) {
  const navigate = useNavigate();

  const name = getName();

  const links = [
    { key: "intro", label: "Inicio" },
    { key: "usuarios", label: "Gestión de Usuarios" },
    /*{ key: "asignacion", label: "Asignación de Tareas" },*/
    { key: "tiempos", label: "Tiempos Máximos" },
    { key: "dashboard", label: "Dashboard Tickets" },
  ];

  const handleLogout = async () => {
    try {
      const accessToken = localStorage.getItem("accessToken");

      await fetch(`${API_BASE_URL}/logout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${accessToken}`,
        },
      });

    } catch (error) {
      console.error("Error al comunicarse con /logout, limpiando sesión local...", error);
    }

    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");

    navigate("/auth");
  };

  return (
    <aside className="sidebar-admin flex flex-col items-center pt-8">
      <img src={FotoAdmin} alt="Admin" className="admin-photo w-20 h-20 rounded-full object-cover border-2 border-secondary mb-2" />
      <div className="admin-nombre font-semibold text-dark mb-8">{name}</div>

      <div className="w-full border-b border-gray-300 mb-6"></div>

      <nav className="flex flex-col gap-3 w-full px-4 flex-1">
        {links.map(link => (
          <button
            key={link.key}
            className="sidebar-link text-left"
            onClick={() => setActivePanel(link.key)}
          >
            {link.label}
          </button>
        ))}
      </nav>

      <div className="w-full p-4 border-t border-gray-300">
        <Button variant="danger" size="medium" onClick={handleLogout} className="w-full">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
            <polyline points="16 17 21 12 16 7"></polyline>
            <line x1="21" y1="12" x2="9" y2="12"></line>
          </svg>
          Cerrar Sesión
        </Button>
      </div>
    </aside>
  );
}