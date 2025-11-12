import { useNavigate } from "react-router-dom";
import Button from "../admin/userManagement/Button";
import "../../styles/SidebarAdmin.css";
import FotoAdmin from "../../assets/FotoAdmin.jpg";
import { List, LogOut } from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const getSessionInfo = () => {
    try {
        const userString = localStorage.getItem("user");
        if (userString) {
            const user = JSON.parse(userString);
            return {
                name: `${user.nombre} ${user.apellido}`,
                role: user.rol?.nombre_rol,
                area: user.area?.nombre_area || 'Sin Área'
            };
        }
    } catch (e) {
        console.error("Error al parsear datos de usuario de localStorage:", e);
    }
    return { name: "Operador", role: "N/A", area: "N/A" };
};

export default function SidebarOperativo() {
    const navigate = useNavigate();
    const { name, role, area } = getSessionInfo();

    // En la Bandeja Operativo, solo hay una vista principal (la lista con tabs)
    const links = [
        { key: "bandeja", label: "Bandeja de Tickets", icon: <List size={20} /> },
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
            {/* Foto y Nombre del Operador */}
            <img src={FotoAdmin} alt="Operador" className="admin-photo w-20 h-20 rounded-full object-cover border-2 border-secondary mb-2" />
            <div className="admin-nombre font-semibold text-dark mb-1 text-center">{name}</div>
            <div className="text-xs text-gray-500 mb-1">{role}</div>

            <div className="w-full border-b border-gray-300 mb-6"></div>

            {/* Navegación (principalmente solo la bandeja) */}
            <nav className="flex flex-col gap-3 w-full px-4 flex-1">
                {links.map(link => (
                    // La Bandeja Operativo siempre es la vista principal, así que la marcamos como activa
                    <div
                        key={link.key}
                        className="sidebar-link text-left flex items-center gap-3 active"
                    >
                        {link.icon}
                        {link.label}
                    </div>
                ))}
            </nav>

            {/* Botón Cerrar Sesión */}
            <div className="w-full p-4 border-t border-gray-300">
                <Button variant="danger" size="medium" onClick={handleLogout} className="w-full">
                    <LogOut size={16} />
                    Cerrar Sesión
                </Button>
            </div>
        </aside>
    );
}