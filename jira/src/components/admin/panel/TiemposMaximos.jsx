import { useState } from "react";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

export default function TiemposMaximos() {
  const [slas, setSlas] = useState([
    { id: 1, caso: "Tiempo de respuesta de ticket", categoria: "Ticket", tiempo: 1, unidad: "Días" },
    { id: 2, caso: "Solicitud de información", categoria: "Gerentes", tiempo: 2, unidad: "Días" },
    { id: 3, caso: "Actualización de Dashboard de gerente", categoria: "Gerentes", tiempo: 3, unidad: "Días" },
    { id: 4, caso: "Agente operador", categoria: "Agente", tiempo: 2, unidad: "Días" },
  ]);

  const [ticketsWithTiming] = useState([
    { id: 101, priority: "Alta", agent: "Carlos", responseRemaining: 2, resolutionRemaining: 5, state: "En progreso" },
    { id: 102, priority: "Media", agent: "Lucía", responseRemaining: 5, resolutionRemaining: 10, state: "Pendiente" },
    { id: 103, priority: "Baja", agent: "Pedro", responseRemaining: -1, resolutionRemaining: 0, state: "Vencido" },
  ]);

  const COLORS = ["#5FA8D3", "#2EC4B6", "#1B4965", "#2E2E2E"];

  const pieData = slas.map((sla) => ({
    name: sla.caso,
    value: sla.tiempo,
  }));

  const getStatusClass = (time) => {
    if (time <= 0) return "text-red-600 font-bold";
    if (time <= 2) return "text-yellow-600 font-semibold";
    return "text-green-600";
  };

  const formatRemaining = (time) => {
    return time > 0 ? `${time} días` : "Vencido";
  };

  return (
    <div className="admin-panel-content">
      <h2 className="text-3xl font-semibold mb-4" style={{ color: "#1B4965" }}>
        Tiempos Máximos de Resolución (SLA)
      </h2>
      <p className="mb-4 text-gray-600">
        Definir plazos máximos para resolución de cada tipo de ticket y monitorear cumplimiento.
      </p>

      {/* Tabla SLA */}
      <div className="overflow-x-auto bg-white shadow-md rounded-lg p-4 mb-8 border" style={{ borderColor: "#E5E5E5" }}>
        <h3 className="text-xl font-bold mb-3" style={{ color: "#2EC4B6" }}>
          Definición de SLA
        </h3>
        <table className="min-w-full table-auto border-collapse">
          <thead>
            <tr style={{ backgroundColor: "#5FA8D3", color: "white" }}>
              <th className="p-3 border" style={{ borderColor: "#E5E5E5" }}>Caso</th>
              <th className="p-3 border" style={{ borderColor: "#E5E5E5" }}>Categoría</th>
              <th className="p-3 border text-center" style={{ borderColor: "#E5E5E5" }}>Tiempo SLA</th>
              <th className="p-3 border text-center" style={{ borderColor: "#E5E5E5" }}>Unidad</th>
              <th className="p-3 border text-center" style={{ borderColor: "#E5E5E5" }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {slas.map((sla, index) => (
              <tr
                key={sla.id}
                className="text-sm"
                style={{ backgroundColor: index % 2 === 0 ? "#F9FAFB" : "#FFFFFF" }}
              >
                <td className="p-3 border" style={{ borderColor: "#E5E5E5" }}>{sla.caso}</td>
                <td className="p-3 border" style={{ borderColor: "#E5E5E5" }}>{sla.categoria}</td>
                <td className="p-3 border text-center" style={{ borderColor: "#E5E5E5" }}>{sla.tiempo}</td>
                <td className="p-3 border text-center" style={{ borderColor: "#E5E5E5" }}>{sla.unidad}</td>
                <td className="p-3 border text-center" style={{ borderColor: "#E5E5E5" }}>
                  <button
                    className="px-2 py-1 rounded-md mr-2 text-white"
                    style={{ backgroundColor: "#2EC4B6" }}
                  >
                    Editar
                  </button>
                  <button
                    className="px-2 py-1 rounded-md text-white"
                    style={{ backgroundColor: "#1B4965" }}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Monitoreo SLA */}
      <div className="overflow-x-auto bg-white shadow-md rounded-lg p-4 mb-8 border" style={{ borderColor: "#E5E5E5" }}>
        <h3 className="text-xl font-bold mb-3" style={{ color: "#2EC4B6" }}>
          Monitoreo de Tickets
        </h3>
        <table className="w-full border rounded-lg shadow-md" style={{ borderColor: "#E5E5E5" }}>
          <thead style={{ backgroundColor: "#5FA8D3", color: "white" }}>
            <tr>
              <th className="p-2">ID</th>
              <th className="p-2">Prioridad</th>
              <th className="p-2">Agente</th>
              <th className="p-2">Tiempo Restante Respuesta</th>
              <th className="p-2">Tiempo Restante Resolución</th>
              <th className="p-2">Estado</th>
            </tr>
          </thead>
          <tbody>
            {ticketsWithTiming.map((t, index) => (
              <tr
                key={t.id}
                className="hover:bg-gray-50"
                style={{ backgroundColor: index % 2 === 0 ? "#FFFFFF" : "#F9FAFB" }}
              >
                <td className="p-2 border" style={{ borderColor: "#E5E5E5" }}>{t.id}</td>
                <td className="p-2 border" style={{ borderColor: "#E5E5E5" }}>{t.priority}</td>
                <td className="p-2 border" style={{ borderColor: "#E5E5E5" }}>{t.agent}</td>
                <td className={`p-2 border ${getStatusClass(t.responseRemaining)}`} style={{ borderColor: "#E5E5E5" }}>
                  {formatRemaining(t.responseRemaining)}
                </td>
                <td className={`p-2 border ${getStatusClass(t.resolutionRemaining)}`} style={{ borderColor: "#E5E5E5" }}>
                  {formatRemaining(t.resolutionRemaining)}
                </td>
                <td className="p-2 border" style={{ borderColor: "#E5E5E5" }}>{t.state}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Diagrama de pastel SLA */}
      <div className="bg-white shadow-md rounded-lg p-4 border" style={{ borderColor: "#E5E5E5" }}>
        <h3 className="text-xl font-bold mb-3" style={{ color: "#2EC4B6" }}>
          Distribución de SLA
        </h3>
        <div className="w-full h-64">
          <ResponsiveContainer>
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label
              >
                {pieData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
