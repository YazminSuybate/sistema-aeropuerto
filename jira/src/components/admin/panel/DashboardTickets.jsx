import { useEffect, useState, useMemo } from "react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from "recharts";
import { useAreas } from "../../../hooks/useAreas";
import { useUsers } from "../../../hooks/useUsers";
import Table from "../userManagement/Table";
import "../../../styles/DashboardTickets.css";

const STATIC_METRICS = [
  { label: "Total Tickets", value: 120, color: "var(--color-primary)" },
  { label: "Tickets Abiertos", value: 45, color: "var(--color-secondary)" },
  { label: "Tiempo Promedio (h)", value: "8.5", color: "var(--color-dark)" },
  { label: "Tiempos Excedidos", value: 3, color: "var(--color-accent2)" },
];

const STATIC_TICKETS_ESTADO = [
  { estado: "Abierto", value: 25 },
  { estado: "Asignado", value: 15 },
  { estado: "En Proceso", value: 30 },
  { estado: "Pendiente", value: 10 },
  { estado: "Cerrado", value: 20 },
];

const STATIC_TICKETS_PRIORIDAD = [
  { prioridad: "Alta", value: 10 },
  { prioridad: "Media", value: 25 },
  { prioridad: "Baja", value: 10 },
];


export default function DashboardTickets() {
  const { areas, loading: loadingAreas } = useAreas();
  const { users, loading: loadingUsers } = useUsers();

  const [data, setData] = useState({
    metrics: [],
    ticketsPrioridad: [],
    ticketsEstado: [],
    ticketsArea: [],
  });

  const COLORS = useMemo(() => ["#5FA8D3", "#2EC4B6", "#1B4965", "#FF6B6B", "#f9a826", "#8b5cf6"], []);

  const getMockAreaTickets = useMemo(() => {
    if (areas.length === 0) return [];

    const mockDistribution = [12, 8, 20, 5, 10];

    return areas.slice(0, 5).map((area, index) => ({
      area: area.nombre_area,
      tickets: mockDistribution[index] || 5,
    }));
  }, [areas]);

  const getMockAgentPerformance = useMemo(() => {
    if (users.length === 0) return [];

    const operativeUsers = users.filter(u => u.role.includes('Agente Operativo')).slice(0, 5);

    return operativeUsers.map((user, index) => ({
      agent: user.nombre,
      closed: 15 - index * 2,
      slaCompliance: (85 + index * 3)
    })).sort((a, b) => b.closed - a.closed);
  }, [users]);


  useEffect(() => {
    if (!loadingAreas && !loadingUsers) {
      setData({
        metrics: STATIC_METRICS,
        ticketsPrioridad: STATIC_TICKETS_PRIORIDAD,
        ticketsEstado: STATIC_TICKETS_ESTADO,
        ticketsArea: getMockAreaTickets,
      });
    }

  }, [loadingAreas, loadingUsers, getMockAreaTickets]);

  if (loadingAreas || loadingUsers) {
    return <div className="p-8 text-center text-gray-500">Cargando datos para el Dashboard...</div>;
  }


  return (
    <div className="dashboard-tickets flex flex-col gap-6 p-8">
      <h2 className="text-3xl font-bold mb-4" style={{ color: "var(--color-dark)" }}>
        Dashboard Operativo de Tickets
      </h2>
      <p className="text-gray-700 mb-6">
        Visualiza el estado de los tickets, la carga de trabajo por área y el rendimiento de los agentes operativos.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {data.metrics.map((m, i) => (
          <div key={i} className="p-6 rounded-xl shadow-lg admin-card" style={{ backgroundColor: m.color, color: "#fff" }}>
            <p className="text-xl font-semibold">{m.label}</p>
            <p className="text-3xl font-bold mt-2">{m.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">

        <div className="chart-card p-6 rounded-xl shadow-lg bg-white admin-card">
          <h3 className="text-xl font-semibold mb-4">Tickets Asignados por Área</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={data.ticketsArea}>
              <XAxis dataKey="area" interval={0} angle={-30} textAnchor="end" height={60} style={{ fontSize: 12 }} />
              <YAxis />
              <Tooltip />
              <Bar dataKey="tickets" name="Tickets">
                {data.ticketsArea.map((entry, index) => (
                  <Cell key={`area-cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card p-6 rounded-xl shadow-lg bg-white admin-card">
          <h3 className="text-xl font-semibold mb-4">Distribución por Estado</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={data.ticketsEstado}
                dataKey="value"
                nameKey="estado"
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                label
              >
                {data.ticketsEstado.map((entry, index) => (
                  <Cell key={`estado-cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Legend verticalAlign="bottom" height={36} />
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="mt-6 bg-white shadow-md rounded-lg p-6 admin-card">
        <h3 className="text-xl font-bold mb-4" style={{ color: "var(--color-primary)" }}>
          Rendimiento de Agentes Operativos (Top 5)
        </h3>
        <Table>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Agente</Table.HeaderCell>
              <Table.HeaderCell>Tickets Cerrados</Table.HeaderCell>
              <Table.HeaderCell>Cumplimiento SLA (%)</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {getMockAgentPerformance.map((p, index) => (
              <Table.Row key={index}>
                <Table.Cell>{p.agent}</Table.Cell>
                <Table.Cell>{p.closed}</Table.Cell>
                <Table.Cell className={p.slaCompliance < 90 ? 'text-yellow-600' : 'text-green-600'}>
                  {p.slaCompliance}%
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </div>

    </div>
  );
}