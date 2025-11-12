import { AtencionTicketCard } from "./CardTicket"; // Importa la nueva Card

// Sigue el patrón de tu TicketList, pero no necesita 'onClaimTicket'
export const AtencionTicketList = ({ tickets, emptyMessage, onSelectTicket }) => {
  if (!tickets || tickets.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {tickets.map((ticket) => (
        <AtencionTicketCard
          key={ticket.id_ticket}
          ticket={ticket}
          onSelectTicket={onSelectTicket} // Pasa la función para "Ver Detalles"
        />
      ))}
    </div>
  );
};