import React from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../admin/components/userManagement/Button"; 
import "../styles/SidebarGerencia.css"; 
import FotoGerente from "../../../assets/FotoAdmin.jpg"; 
// He quitado los iconos que ya no se usan (PieChart, Users, FileText)
import { LayoutDashboard, LogOut } from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Función auxiliar para obtener el nombre
const getName = () => {
    try {
        const userString = localStorage.getItem("user");
        if (userString) {
            const user = JSON.parse(userString);
            return `${user.nombre} ${user.apellido}`;
        }
    } catch (e) {
        console.error("Error al leer usuario:", e);
    }
    return "Gerente General";
};

export default function SidebarGerencia({ setView, activeView }) {
    const navigate = useNavigate();
    const name = getName();

    // ACTUALIZADO: Solo dejamos la única vista disponible
    const links = [
        { key: "dashboard", label: "Resumen Operativo", icon: <LayoutDashboard size={20} /> },
    ];

    const handleLogout = async () => {
        try {
            const accessToken = localStorage.getItem("accessToken");
            if(accessToken) {
                 await fetch(`${API_BASE_URL}/logout`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${accessToken}`,
                    },
                });
            }
        } catch (error) {
            console.error("Error en logout:", error);
        } finally {
            localStorage.removeItem("accessToken");
            localStorage.removeItem("user");
            navigate("/auth");
        }
    };

    return (
        <aside className="sidebar-gerencia">
            {/* Cabecera del Sidebar */}
            <div className="flex flex-col items-center w-full px-4">
                <img src={FotoGerente} alt="Gerente" className="gerencia-photo shadow-sm" />
                <div className="gerencia-nombre">{name}</div>
                <div className="gerencia-rol">Gerencia de Operaciones</div>
            </div>

            <div className="w-4/5 border-b border-gray-200 mb-6 mt-2"></div>

            {/* Navegación */}
            <nav className="flex flex-col gap-2 w-full px-3 flex-1">
                {links.map(link => (
                    <button
                        key={link.key}
                        className={`sidebar-link-gerencia ${activeView === link.key ? 'active' : ''}`}
                        onClick={() => setView(link.key)}
                    >
                        {link.icon}
                        <span>{link.label}</span>
                    </button>
                ))}
            </nav>

            {/* Footer / Logout */}
            <div className="w-full p-4 border-t border-gray-200 bg-gray-50">
                <Button 
                    variant="danger" 
                    size="medium" 
                    onClick={handleLogout} 
                    className="w-full flex items-center justify-center gap-2"
                >
                    <LogOut size={16} />
                    Cerrar Sesión
                </Button>
            </div>
        </aside>
    );
}