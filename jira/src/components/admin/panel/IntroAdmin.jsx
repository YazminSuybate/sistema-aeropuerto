import { useUsers } from "../../../hooks/useUsers";
import { useState, useEffect } from "react";

const STATIC_TICKET_DATA = {
  openTickets: 45,
  overdueTickets: 3,
};

const STATIC_OPERATIONAL_INFO = [
  { label: "Total Roles Definidos", value: 5, icon: "👤" },
  { label: "Total Áreas Operacionales", value: 5, icon: "🏢" },
  { label: "Categorías de Ticket (SLA)", value: 4, icon: "🏷️" },
  { label: "Pasajeros Registrados (Simul.)", value: 120, icon: "🎫" },
];

export default function IntroAdmin({ setActivePanel }) {
  const { users, loading: loadingUsers } = useUsers();
  const [ticketMetrics, setTicketMetrics] = useState({
    totalActiveUsers: 0,
    openTickets: STATIC_TICKET_DATA.openTickets,
    overdueTickets: STATIC_TICKET_DATA.overdueTickets,
  });

  useEffect(() => {
    if (!loadingUsers) {
      const activeUsersCount = users.filter(u => u.status === 'Activo').length;
      setTicketMetrics(prev => ({
        ...prev,
        totalActiveUsers: activeUsersCount
      }));
    }
  }, [users, loadingUsers]);

  const kpis = [
    { label: "Usuarios Activos", value: ticketMetrics.totalActiveUsers, color: "var(--color-primary)", loading: loadingUsers },
    { label: "Tickets Abiertos", value: ticketMetrics.openTickets, color: "var(--color-secondary)", loading: false },
    { label: "Tickets Vencidos", value: ticketMetrics.overdueTickets, color: "var(--color-accent2)", loading: false },
  ];

  return (
    <div className="admin-panel-content p-8">
      <h2 className="text-3xl font-bold mb-4" style={{ color: "var(--color-dark)" }}>
        Panel de Administración
      </h2>
      <p className="text-gray-700 mb-8">
        Vista de alto nivel y acceso rápido a la configuración esencial del sistema JiraAirlands.
      </p>

      {/* Sección de Métricas Clave (KPIs) */}
      <h3 className="text-xl font-semibold mb-4" style={{ color: "var(--color-dark)" }}>Métricas Clave de Ticketing</h3>
      {loadingUsers ? (
        <div className="text-gray-500 mb-10">Cargando métricas...</div>
      ) : (
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
      )}

      {/* Nueva Sección de Datos Estáticos del Sistema */}
      <h3 className="text-xl font-semibold mb-4" style={{ color: "var(--color-dark)" }}>Estructura del Sistema</h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {STATIC_OPERATIONAL_INFO.map((item, i) => (
          <div
            key={i}
            className="admin-card p-6 rounded-xl shadow-lg bg-white"
          >
            <div className="flex items-center justify-between">
              <p className="text-lg font-medium text-gray-700">{item.label}</p>
              <span className="text-3xl">{item.icon}</span>
            </div>
            <p className="text-3xl font-bold mt-2" style={{ color: "var(--color-secondary)" }}>
              {item.value}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}