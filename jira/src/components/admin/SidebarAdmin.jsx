import "../../styles/SidebarAdmin.css"
import FotoAdmin from "../../assets/FotoAdmin.jpg"

export default function SidebarAdmin({ setActivePanel }) {
  const links = [
    { key: "intro", label: "Inicio" },
    { key: "usuarios", label: "Gestión de Usuarios" },
    /*{ key: "asignacion", label: "Asignación de Tareas" },*/
    { key: "tiempos", label: "Tiempos Máximos" },
    { key: "dashboard", label: "Dashboard Tickets" },
  ]

  return (
    <aside className="sidebar-admin flex flex-col items-center pt-8">
      <img src={FotoAdmin} alt="Admin" className="admin-photo w-20 h-20 rounded-full object-cover border-2 border-secondary mb-2" />
      <div className="admin-nombre font-semibold text-dark mb-8">Juan Pérez</div>

      <div className="w-full border-b border-gray-300 mb-6"></div>

      <nav className="flex flex-col gap-3 w-full px-4">
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
    </aside>
  )
}
