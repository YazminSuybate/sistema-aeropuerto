import React, { useState } from "react";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell 
} from "recharts";
import { 
  BarChart3, 
  Users, 
  AlertTriangle, 
  CheckCircle, 
  TrendingUp, 
  Calendar,
  Clock
} from "lucide-react";
import SidebarGerencia from "../components/SidebarGerencia";

// --- DATOS DE EJEMPLO PARA EL GRÁFICO ---
const dataGrafico = [
  { name: 'Lun', tickets: 12 },
  { name: 'Mar', tickets: 19 },
  { name: 'Mié', tickets: 15 },
  { name: 'Jue', tickets: 22 }, // Día con más incidencias
  { name: 'Vie', tickets: 18 },
  { name: 'Sáb', tickets: 10 },
  { name: 'Dom', tickets: 8 },
];

// --- COMPONENTES AUXILIARES ---

const StatCard = ({ title, value, icon: Icon, color, subtext, trend }) => (
  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200">
    <div className="flex items-center justify-between mb-4">
      <div className={`p-3 rounded-lg ${color} bg-opacity-10`}>
        {/* El replace es un truco para usar el color de fondo como texto también */}
        <Icon size={24} className={color.replace('bg-', 'text-')} />
      </div>
      <span className="text-xs font-semibold text-gray-500 bg-gray-50 px-2 py-1 rounded-full border border-gray-100">Este Mes</span>
    </div>
    <div>
      <h3 className="text-3xl font-bold text-gray-800 mb-1">{value}</h3>
      <p className="text-gray-500 text-sm font-medium">{title}</p>
      {subtext && (
        <p className={`text-xs mt-3 flex items-center gap-1 font-medium ${trend === 'up' ? 'text-green-600' : 'text-green-600'}`}>
          <TrendingUp size={12}/> {subtext}
        </p>
      )}
    </div>
  </div>
);

// --- VISTA PRINCIPAL (DASHBOARD) ---
const DashboardView = () => (
    <div className="animate-fade-in max-w-7xl mx-auto">
        <header className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800">Resumen Operativo</h1>
            <p className="text-gray-500 mt-1">Vista general del estado del aeropuerto hoy.</p>
        </header>

        {/* 1. Grid de KPIs (Tarjetas Superiores) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard 
                title="Tickets Totales" 
                value="1,245" 
                icon={BarChart3} 
                color="bg-blue-600"
                subtext="+12% vs mes anterior"
                trend="up"
            />
            <StatCard 
                title="Casos Críticos" 
                value="12" 
                icon={AlertTriangle} 
                color="bg-red-500"
                subtext="-5% (Mejora)"
                trend="down"
            />
            <StatCard 
                title="Eficiencia" 
                value="94%" 
                icon={CheckCircle} 
                color="bg-green-500" 
                subtext="Objetivo cumplido"
                trend="up"
            />
            <StatCard 
                title="Personal Activo" 
                value="45" 
                icon={Users} 
                color="bg-purple-600"
                subtext="Turno Mañana"
                trend="up"
            />
        </div>

        {/* 2. Sección Principal: Gráfico + Alertas */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* COLUMNA IZQUIERDA: GRÁFICO DE BARRAS */}
            <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h3 className="text-lg font-bold text-gray-800">Flujo de Incidencias Semanal</h3>
                        <p className="text-sm text-gray-400">Tickets reportados por día</p>
                    </div>
                    <button className="text-sm text-blue-600 font-medium hover:bg-blue-50 px-3 py-1 rounded transition-colors">
                        Ver reporte completo
                    </button>
                </div>
                
                {/* AQUÍ ESTÁ EL GRÁFICO REAL CON RECHARTS */}
                <div className="h-72 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={dataGrafico} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                            <XAxis 
                                dataKey="name" 
                                axisLine={false} 
                                tickLine={false} 
                                tick={{ fill: '#9ca3af', fontSize: 12 }} 
                                dy={10}
                            />
                            <YAxis 
                                axisLine={false} 
                                tickLine={false} 
                                tick={{ fill: '#9ca3af', fontSize: 12 }} 
                            />
                            <Tooltip 
                                cursor={{ fill: '#f9fafb' }}
                                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                            />
                            <Bar dataKey="tickets" radius={[4, 4, 0, 0]}>
                                {dataGrafico.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.tickets > 20 ? '#ef4444' : '#3b82f6'} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
            
            {/* COLUMNA DERECHA: ALERTAS RECIENTES */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 h-full">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-bold text-gray-800">Alertas Recientes</h3>
                    <span className="text-xs bg-red-50 text-red-600 px-2 py-1 rounded-full font-medium">3 Nuevas</span>
                </div>
                
                <div className="space-y-4">
                    {[1, 2, 3].map((item, index) => (
                        <div key={item} className="group flex gap-4 items-start p-3 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer border border-transparent hover:border-gray-100">
                            <div className="bg-red-100 p-2 rounded-full flex-shrink-0 group-hover:bg-red-200 transition-colors">
                                <AlertTriangle size={18} className="text-red-600" />
                            </div>
                            <div>
                                <h4 className="text-sm font-bold text-gray-800">Retraso en Puerta 4</h4>
                                <p className="text-xs text-gray-500 mb-1">Zona Norte • Problema Operativo</p>
                                <div className="flex items-center gap-1 text-xs text-gray-400">
                                    <Clock size={10} />
                                    <span>Hace 25 minutos</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                
                <button className="w-full mt-6 text-sm text-gray-500 border border-gray-200 rounded-lg py-2 hover:bg-gray-50 transition-colors">
                    Ver todas las alertas
                </button>
            </div>
        </div>
    </div>
);

// --- COMPONENTE PRINCIPAL QUE EXPORTAS ---
const GerenciaDashboard = () => {
  const [view, setView] = useState("dashboard");

  // Función simple para cambiar el contenido según el sidebar
  const renderContent = () => {
    switch (view) {
      case "dashboard": return <DashboardView />;
      case "performance": return <div className="p-10 text-center text-gray-500">Módulo de Rendimiento (En construcción)</div>;
      case "staff": return <div className="p-10 text-center text-gray-500">Módulo de Personal (En construcción)</div>;
      case "reports": return <div className="p-10 text-center text-gray-500">Módulo de Reportes (En construcción)</div>;
      default: return <DashboardView />;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50 font-sans">
      {/* 1. Sidebar Fijo a la izquierda */}
      <div className="fixed top-0 left-0 bottom-0 z-50 w-64">
        <SidebarGerencia setView={setView} activeView={view} />
      </div>

      {/* 2. Contenido Principal (con margen izquierdo para no taparse con el sidebar) */}
      <main className="flex-1 ml-64 p-8 overflow-y-auto h-screen">
        {/* Barra superior fecha */}
        <div className="flex justify-end mb-6">
            <div className="flex items-center gap-2 text-sm text-gray-600 bg-white px-4 py-2 rounded-full shadow-sm border border-gray-200">
                <Calendar size={16} className="text-blue-500" />
                <span className="capitalize">
                    {new Date().toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })}
                </span>
            </div>
        </div>

        {renderContent()}
      </main>
    </div>
  );
};

export default GerenciaDashboard;