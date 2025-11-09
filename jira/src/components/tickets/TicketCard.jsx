export const TicketCard = ({ ticket }) => {
  const getPrioridadColor = (prioridad) => {
    switch (prioridad) {
      case "Alta":
        return "bg-red-100 text-red-800 border-red-300"
      case "Media":
        return "bg-yellow-100 text-yellow-800 border-yellow-300"
      case "Baja":
        return "bg-green-100 text-green-800 border-green-300"
      default:
        return "bg-gray-100 text-gray-800 border-gray-300"
    }
  }

  const getEstadoColor = (estado) => {
    switch (estado) {
      case "Abierto":
        return "text-blue-600"
      case "En Proceso":
        return "text-orange-600"
      default:
        return "text-gray-600"
    }
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start gap-4">
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 mb-2">{ticket.titulo}</h3>

          <div className="flex items-center gap-3">
            {/* Prioridad */}
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium border ${getPrioridadColor(ticket.prioridad)}`}
            >
              {ticket.prioridad}
            </span>

            {/* Estado */}
            <span className={`text-sm font-medium ${getEstadoColor(ticket.estado)}`}>{ticket.estado}</span>
          </div>
        </div>

        {/* Botón Ver Detalles */}
        <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm font-medium whitespace-nowrap">
          Ver Detalles
        </button>
      </div>

      {/* ID del ticket */}
      <div className="mt-3 text-xs text-gray-500">Ticket #{ticket.id}</div>
    </div>
  )
}