import { useNavigate } from "react-router-dom";
import Button from "../../admin/components/userManagement/Button";
import "../../../styles/SidebarAdmin.css";
import FotoAdmin from "../../../assets/FotoAdmin.jpg";
import { Plus, List } from 'lucide-react';

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

export default function SidebarAtencion({ setView, activeView }) {
    const navigate = useNavigate();
    const name = getName();

    const links = [
        { key: "list", label: "Lista de Tickets", icon: <List size={20} />, variant: "primary" },
        { key: "create", label: "Crear Incidencia", icon: <Plus size={20} />, variant: "secondary" },
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
        <aside className="sidebar-admin flex flex-col items-center pt-8 h-full bg-light">
            {/* Foto y Nombre del Agente */}
            <img src={FotoAdmin} alt="Agente" className="admin-photo w-20 h-20 rounded-full object-cover border-2 border-secondary mb-2" />
            <div className="admin-nombre font-semibold text-dark mb-1 text-center">{name}</div>
            <div className="text-xs text-gray-500 mb-8">Atención al Pasajero</div>

            <div className="w-full border-b border-gray-300 mb-6"></div>

            {/* Navegación (Lista/Crear) */}
            <nav className="flex flex-col gap-3 w-full px-4 flex-1">
                {links.map(link => (
                    <button
                        key={link.key}
                        className={`sidebar-link text-left flex items-center gap-3 ${activeView === link.key ? 'active' : ''}`}
                        onClick={() => setView(link.key)}
                    >
                        {link.icon}
                        {link.label}
                    </button>
                ))}
            </nav>

            {/* Botón Cerrar Sesión */}
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