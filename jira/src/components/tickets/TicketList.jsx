import { TicketCard } from "./TicketCard";

export const TicketList = ({ tickets, emptyMessage, onClaimTicket }) => {
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
        <TicketCard
          // 2. ¡MUY IMPORTANTE! Usamos el ID real de la API
          key={ticket.id_ticket}
          ticket={ticket}
          // 3. Pasamos la función 'onClaimTicket' al hijo
          onClaimTicket={onClaimTicket}
        />
      ))}
    </div>
  );
};
