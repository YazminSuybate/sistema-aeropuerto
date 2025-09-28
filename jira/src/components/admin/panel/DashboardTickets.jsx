import { useEffect, useState } from "react";
import "../../../styles/DashboardTickets.css";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from "recharts";

export default function DashboardTickets() {
  const [data, setData] = useState({
    metrics: [],
    ticketsPrioridad: [],
    ticketsEstado: []
  });

  useEffect(() => {
    fetch("/dashboardData.json")  
      .then(res => res.json())
      .then(json => setData(json))
      .catch(err => console.error("Error cargando datos:", err));
  }, []);

  const COLORS = ["#5FA8D3", "#2EC4B6", "#1B4965", "#2E2E2E"];

  return (
    <div className="dashboard-tickets flex flex-col gap-6">
      <h2 className="text-3xl font-bold mb-4" style={{ color: "var(--color-secondary)" }}>
        Dashboard de Tickets
      </h2>
      <p className="text-gray-700 mb-6">
        Visualizar el estado de los tickets en tiempo real con métricas y gráficos de ejemplo.
      </p>

      {/* Métricas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {data.metrics.map((m, i) => (
          <div key={i} className="p-6 rounded-xl shadow-lg" style={{ backgroundColor: m.color, color: "#fff" }}>
            <p className="text-xl font-semibold">{m.label}</p>
            <p className="text-3xl font-bold mt-2">{m.value}</p>
          </div>
        ))}
      </div>

      {/* Gráficas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        {/* Bar Chart - Prioridad */}
        <div className="chart-card p-6 rounded-xl shadow-lg bg-light">
          <h3 className="text-xl font-semibold mb-4">Tickets por Prioridad</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={data.ticketsPrioridad}>
              <XAxis dataKey="prioridad" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="tickets">
                {data.ticketsPrioridad.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart - Estado */}
        <div className="chart-card p-6 rounded-xl shadow-lg bg-light">
          <h3 className="text-xl font-semibold mb-4">Tickets por Estado</h3>
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
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Legend verticalAlign="bottom" height={36}/>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
