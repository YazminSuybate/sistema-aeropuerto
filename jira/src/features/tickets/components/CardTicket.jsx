import React from 'react';
import Button from "../../admin/components/userManagement/Button"; // Usamos tu Button
import { Eye } from "lucide-react"; // Asumiendo que usas lucide-react

// Funciones de color (copiadas de tu TicketCard)
const getPrioridadColor = (prioridad) => {
  switch (prioridad) {
    case "Alta":
      return "bg-red-100 text-red-800 border-red-300";
    case "Media":
      return "bg-yellow-100 text-yellow-800 border-yellow-300";
    case "Baja":
      return "bg-green-100 text-green-800 border-green-300";
    default:
      return "bg-gray-100 text-gray-800 border-gray-300";
  }
};

const getEstadoColor = (estado) => {
  // Colores actualizados para todos los estados de tu seed
  switch (estado) {
    case "Abierto":
      return "text-blue-600";
    case "Asignado":
      return "text-purple-600";
    case "En Proceso":
      return "text-orange-600";
    case "Pendiente":
      return "text-pink-600"; // Color ejemplo
    case "Resuelto":
      return "text-green-600";
    case "Cerrado":
      return "text-gray-500";
    default:
      return "text-gray-600";
  }
};

// Sigue el patrón de tu TicketCard, pero sin 'onClaimTicket'
export const AtencionTicketCard = ({ ticket, onSelectTicket }) => {
  
  // Leemos los datos reales de la API (con 'optional chaining' por seguridad)
  const id = ticket.id_ticket;
  const titulo = ticket.titulo;
  const prioridad = ticket.categoria_info?.prioridad || "N/A";
  const estado = ticket.estado?.nombre_estado || "N/A";

  const handleViewDetails = () => {
    // Esta función llama al hook de la página padre
    onSelectTicket(id);
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start gap-4">
        {/* Detalles */}
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 mb-2">{titulo}</h3>
          <div className="flex items-center gap-3">
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium border ${getPrioridadColor(
                prioridad
              )}`}
            >
              {prioridad}
            </span>
            <span className={`text-sm font-medium ${getEstadoColor(estado)}`}>
              {estado}
            </span>
          </div>
        </div>

        {/* Botón "Ver Detalles" (usando tu componente Button) */}
        <div className="flex items-center space-x-2 whitespace-nowrap">
          <Button variant="primary" size="medium" onClick={handleViewDetails}>
            <Eye size={16} className="mr-2" />
            Ver / Comentar
          </Button>
        </div>
      </div>
      <div className="mt-3 text-xs text-gray-500">Ticket #{id}</div>
    </div>
  );
};