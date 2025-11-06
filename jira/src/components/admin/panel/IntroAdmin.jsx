import { useUsers } from "../../../hooks/useUsers";
import { useState, useEffect } from "react";

const TICKET_MOCK_URL = "http://localhost:4000/metrics";

export default function IntroAdmin({ setActivePanel }) {
  const { users, loading: loadingUsers } = useUsers();
  const [ticketMetrics, setTicketMetrics] = useState({
    totalActiveUsers: 0,
    openTickets: 0,
    overdueTickets: 0,
  });

  useEffect(() => {
    if (!loadingUsers) {
      const activeUsersCount = users.filter(u => u.status === 'Activo').length;
      setTicketMetrics(prev => ({
        ...prev,
        totalActiveUsers: activeUsersCount
      }));
    }

    const fetchTicketMetrics = async () => {
      try {
        const response = await fetch(TICKET_MOCK_URL);
        const metrics = await response.json();

        const openTickets = metrics.find(m => m.label === "Tickets Abiertos")?.value || 0;
        const overdueTickets = metrics.find(m => m.label === "Tiempos Excedidos")?.value || 0;

        setTicketMetrics(prev => ({
          ...prev,
          openTickets: openTickets,
          overdueTickets: overdueTickets
        }));
      } catch (err) {
        console.error("Error cargando métricas de tickets (mock):", err);
      }
    };

    fetchTicketMetrics();
  }, [users, loadingUsers]);

  const kpis = [
    { label: "Usuarios Activos", value: ticketMetrics.totalActiveUsers, color: "#5FA8D3", loading: loadingUsers },
    { label: "Tickets Abiertos", value: ticketMetrics.openTickets, color: "#2EC4B6", loading: false },
    { label: "Tickets Vencidos", value: ticketMetrics.overdueTickets, color: "#1B4965", loading: false },
  ];

  return (
    <div className="admin-panel-content p-8">
      <h2 className="text-3xl font-bold mb-4" style={{ color: "var(--color-primary)" }}>
        Panel de Administración
      </h2>
      <p className="text-gray-700 mb-8">
        Vista de alto nivel y acceso rápido a la configuración esencial del sistema JiraAirlands.
      </p>

      {/* Sección de Métricas Clave (KPIs) */}
      <h3 className="text-xl font-semibold mb-4" style={{ color: "var(--color-dark)" }}>Métricas Clave</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        {kpis.map((kpi, i) => (
          <div
            key={i}
            className="admin-card p-6 rounded-xl shadow-lg"
            style={{ backgroundColor: kpi.color, color: "#fff" }}
          >
            <p className="text-xl font-semibold">{kpi.label}</p>
            <p className="text-3xl font-bold mt-2">
              {kpi.loading ? '...' : kpi.value}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}