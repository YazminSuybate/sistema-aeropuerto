import "../../../styles/DashboardTickets.css"
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from "recharts"

export default function DashboardTickets() {
  const metrics = [
    { label: "Tickets Abiertos", value: 128, color: "#5FA8D3" },
    { label: "Tickets Cerrados", value: 342, color: "#2EC4B6" },
    { label: "Tareas Pendientes", value: 75, color: "#1B4965" },
    { label: "Tiempos Excedidos", value: 12, color: "#2E2E2E" },
  ]

  // Datos ficticios para gráficos
  const ticketsPrioridad = [
    { prioridad: "Alta", tickets: 40 },
    { prioridad: "Media", tickets: 30 },
    { prioridad: "Baja", tickets: 20 },
    { prioridad: "Muy Baja", tickets: 10 },
  ]

  const ticketsEstado = [
    { estado: "Abiertos", value: 40 },
    { estado: "Cerrados", value: 30 },
    { estado: "Pendientes", value: 20 },
    { estado: "Excedidos", value: 10 },
  ]

  const COLORS = ["#5FA8D3", "#2EC4B6", "#1B4965", "#2E2E2E"]

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
        {metrics.map((m, i) => (
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
            <BarChart data={ticketsPrioridad}>
              <XAxis dataKey="prioridad" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="tickets">
                {ticketsPrioridad.map((entry, index) => (
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
                data={ticketsEstado}
                dataKey="value"
                nameKey="estado"
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                label
              >
                {ticketsEstado.map((entry, index) => (
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
  )
}
