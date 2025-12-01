import { useNavigate } from "react-router-dom";

// Tus funciones de color están PERFECTAS. No cambian.
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
  switch (estado) {
    case "Abierto":
      return "text-blue-600";
    case "En Proceso":
      return "text-orange-600";
    // Puedes añadir más estados si los tienes (ej. "Asignado")
    case "Asignado":
      return "text-purple-600";
    default:
      return "text-gray-600";
  }
};

// 1. RECIBIMOS LA PROP 'onClaimTicket' (que viene desde TicketList)
export const TicketCard = ({ ticket, onClaimTicket }) => {
  const navigate = useNavigate();

  // 2. LEEMOS LOS DATOS REALES DE LA API (en lugar de los mocks)
  // Usamos '?' (optional chaining) para evitar errores si algo no ha cargado
  const id = ticket.id_ticket;
  const titulo = ticket.titulo;
  const prioridad = ticket.categoria_info?.prioridad || "N/A"; // Ej: 'Alta'
  const estado = ticket.estado?.nombre_estado || "N/A"; // Ej: 'Abierto'

  // Función para el botón "Ver Detalles"
  const handleViewDetails = () => {
    // Asumimos que tienes una ruta como /app/tickets/:id
    navigate(`/ruta-del-detalle-del-ticket/${id}`);
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start gap-4">
        {/* Detalles (usando las variables reales) */}
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 mb-2">{titulo}</h3>

          <div className="flex items-center gap-3">
            {/* Prioridad */}
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium border ${getPrioridadColor(
                prioridad
              )}`}
            >
              {prioridad}
            </span>

            {/* Estado */}
            <span className={`text-sm font-medium ${getEstadoColor(estado)}`}>
              {estado}
            </span>
          </div>
        </div>

        {/* 3. LÓGICA DE BOTONES CONDICIONALES */}
        <div className="flex items-center space-x-2 whitespace-nowrap">
          {/* BOTÓN "TOMAR TICKET" */}
          {/* Solo se muestra si 'onClaimTicket' existe (o sea, en la pestaña "Disponibles") */}
          {onClaimTicket && (
            <button
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-sm font-medium"
              onClick={(e) => {
                e.stopPropagation(); // Evita que un clic en la card navegue
                onClaimTicket(id);
              }}
            >
              Tomar Ticket
            </button>
          )}

          {/* BOTÓN "VER DETALLES" */}
          {/* Siempre se muestra */}
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm font-medium"
            onClick={handleViewDetails}
          >
            Ver Detalles
          </button>
        </div>
      </div>

      {/* ID del ticket (usando el 'id' real) */}
      <div className="mt-3 text-xs text-gray-500">Ticket #{id}</div>
    </div>
  );
};
