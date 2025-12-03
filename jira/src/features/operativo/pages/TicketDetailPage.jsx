import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Calendar, LayoutDashboard, LogOut, ArrowLeft, Ticket } from "lucide-react"; 

// 1. Importa tu VISTA
import { TicketDetailView } from "../../tickets/components/VistaDetalleTicket"; 

// 2. Importa tus servicios
import { getTicketById, createComment } from "../../tickets/api/ticketApi"; 
import { storage } from "../../auth/utils/storage"; 

export const TicketDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Obtenemos el usuario real, o usamos "Lucia" por defecto si falla
  const user = storage.getUser(); 
  const userName = user ? `${user.nombre} ${user.apellido}` : "Agente Operativo";
  const userRole = "Agente Operativo Junior"; // O user.rol.nombre_rol si lo tienes

  useEffect(() => {
    setLoading(true);
    getTicketById(id)
      .then((data) => {
        setTicket(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [id]);

  const handleComment = async (data) => {
      await createComment(data);
      const updated = await getTicketById(id);
      setTicket(updated);
  };

  // --- RENDERIZADO DEL LAYOUT OPERATIVO (AZUL) ---
  return (
    <div className="flex min-h-screen bg-[#e5e7eb] font-sans">
      
      {/* 1. SIDEBAR OPERATIVO (Recreado estilo Azul/Celeste) */}
      <div className="fixed top-0 left-0 bottom-0 z-50 w-64 bg-gradient-to-b from-sky-100 to-sky-300 border-r border-sky-300/50 shadow-lg flex flex-col">
        
        {/* Perfil */}
        <div className="flex flex-col items-center pt-8 pb-6">
            <div className="w-24 h-24 rounded-full bg-white border-4 border-white shadow-md overflow-hidden mb-3 flex items-center justify-center">
                {/* Avatar simple o imagen */}
                <span className="text-3xl font-bold text-sky-600">
                    {userName.charAt(0)}
                </span>
            </div>
            <h3 className="font-bold text-gray-800 text-lg">{userName}</h3>
            <p className="text-xs text-gray-600 font-medium">{userRole}</p>
        </div>

        {/* Separador */}
        <div className="w-3/4 mx-auto border-b border-sky-400/30 mb-6"></div>

        {/* Menú de Navegación */}
        <nav className="flex-1 px-4 space-y-3">
            {/* Botón 1: Bandeja de Tickets */}
            <button 
                onClick={() => navigate('/bandeja', { state: { activeTab: 'disponibles' } })}
                className="w-full flex items-center gap-3 px-4 py-3 bg-teal-500 text-white rounded-lg shadow-md hover:bg-teal-600 transition-colors font-medium"
            >
                <LayoutDashboard size={20} />
                Bandeja de Tickets
            </button>
            
            {/* Botón 2: Mis Asignaciones (AHORA FUNCIONAL) */}
            <button 
                onClick={() => navigate('/bandeja', { state: { activeTab: 'asignados' } })}
                className="w-full flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-white/40 rounded-lg transition-colors font-medium"
            >
                <Ticket size={20} />
                Mis Asignaciones
            </button>
        </nav>

        {/* Footer Sidebar */}
        <div className="p-4 mt-auto">
            <button 
                onClick={() => navigate('/auth')} // O tu lógica de logout
                className="w-full flex items-center justify-center gap-2 bg-slate-800 text-white py-2.5 rounded-lg hover:bg-slate-900 transition-colors shadow-sm text-sm font-medium"
            >
                <LogOut size={16} />
                Cerrar Sesión
            </button>
        </div>
      </div>

      {/* 2. CONTENIDO PRINCIPAL */}
      <main className="flex-1 ml-64 p-8 overflow-y-auto h-screen">
        
        {/* Cabecera con Breadcrumb y Fecha */}
        <div className="flex justify-between items-center mb-6 animate-fade-in">
           <div className="flex flex-col">
              <div className="flex items-center gap-2 text-gray-500 text-sm mb-1">
                  <span 
                    className="hover:text-sky-600 cursor-pointer flex items-center gap-1 transition-colors"
                    onClick={() => navigate('/bandeja')}
                  >
                    <LayoutDashboard size={14}/> Bandeja
                  </span>
                  <span>/</span>
                  <span className="font-semibold text-gray-700">Ticket #{id}</span>
              </div>
              <h1 className="text-2xl font-bold text-gray-800">
                Detalle del Ticket
              </h1>
           </div>

           <div className="hidden md:flex items-center gap-2 text-sm text-gray-600 bg-white px-4 py-2 rounded-full shadow-sm border border-gray-200">
              <Calendar size={16} className="text-sky-500" />
              <span className="capitalize">
                 {new Date().toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })}
              </span>
           </div>
        </div>

        {/* Contenido: Loader, Error o Vista */}
        <div className="animate-fade-in">
            {loading ? (
                <div className="flex flex-col items-center justify-center h-[60vh] text-gray-400">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-600 mb-4"></div>
                    <p>Cargando información...</p>
                </div>
            ) : !ticket ? (
                <div className="flex flex-col items-center justify-center h-[60vh] text-red-500">
                    <p className="text-xl font-bold mb-2">Ticket no encontrado</p>
                    <button onClick={() => navigate('/bandeja')} className="flex items-center gap-2 text-sky-600 hover:underline">
                        <ArrowLeft size={16}/> Volver a la bandeja
                    </button>
                </div>
            ) : (
                <TicketDetailView 
                  ticket={ticket} 
                  currentUser={user}
                  onSubmitComment={handleComment}
                  onCancel={() => navigate("/bandeja")}
                />
            )}
        </div>
      </main>
    </div>
  );
};