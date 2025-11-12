import React from "react";
import { useAtencionPasajero } from "../hooks/useAtencionPasajero"; // El hook que maneja todo
import { useNavigate } from "react-router-dom";
import { AtencionTicketList } from "../components/tickets/Listaticket"; // Tu componente de lista
import { CreateTicketForm } from "../components/CreacionTicket"; // Tu formulario de creación
import { TicketDetailView } from "../components/VistaDetalleTicket"; // Tu vista de detalle y chat
import Button from "../components/admin/userManagement/Button"; // Tu componente de botón
import SidebarAtencion from "../components/atencion/SidebarAtencion";

// Iconos para Carga, Error y el botón de "Crear"
import { Loader2, AlertTriangle, Plus } from "lucide-react";

// La API_BASE_URL no es necesaria aquí si usamos la SidebarAtencion
// y la lógica de logout se movió allí, pero la dejamos para consistencia si es usada en otro sitio.
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

/**
 * Página principal del "Centro de Atención al Pasajero".
 * Este componente orquesta qué vista mostrar (lista, crear, detalle)
 * basándose en el estado del hook 'useAtencionPasajero'.
 */
const AtencionPasajeroPage = () => {
  // Inicializa navigate
  const navigate = useNavigate();

  // Se mueve la lógica de logout a SidebarAtencion

  // 1. Obtenemos todo el estado y la lógica del hook
  const {
    view, // <-- Usamos 'view' para saber qué elemento de la sidebar está activo
    setView,
    tickets,
    categorias,
    pasajeros,
    loading,
    error,
    currentUser,
    selectedTicket,
    handleCreateTicket,
    handleSelectTicket,
    handleSubmitComment,
  } = useAtencionPasajero();

  // 2. Estado de Carga (Loading)
  // Muestra un spinner mientras se cargan los datos iniciales
  if (loading || !currentUser) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] text-gray-600">
        <Loader2 size={40} className="animate-spin mr-3" />
        <span className="text-xl">Cargando datos...</span>
      </div>
    );
  }

  // 3. Estado de Error
  // Muestra un mensaje si la carga inicial de datos falla
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-red-600 bg-red-50 border border-red-200 rounded-lg p-8">
        <AlertTriangle size={40} className="mb-4" />
        <h2 className="text-2xl font-semibold mb-2">Error al cargar la página</h2>
        <p className="text-center">{error}</p>
        <Button
          variant="secondary"
          size="medium"
          onClick={() => window.location.reload()} // Recarga la página
          className="mt-6"
        >
          Reintentar
        </Button>
      </div>
    );
  }

  // 4. Renderizado condicional de vistas
  const renderContent = () => {
    switch (view) {
      case "create":
        return (
          <CreateTicketForm
            categorias={categorias}
            pasajeros={pasajeros}
            currentUser={currentUser}
            onSubmit={handleCreateTicket}
            onCancel={() => setView("list")}
          />
        );

      case "detail":
        if (!selectedTicket) {
          setView("list");
          return null;
        }
        return (
          <TicketDetailView
            ticket={selectedTicket}
            currentUser={currentUser}
            onSubmitComment={handleSubmitComment}
            onCancel={() => setView("list")}
          />
        );

      case "list":
      default:
        return (
          <>
            {/* Cabecera simplificada sin botón de Logout */}
            <div className="flex flex-col md:flex-row justify-between items-start mb-6 gap-4">
              <h1 className="text-3xl font-bold text-gray-800">
                Lista de Incidencias
              </h1>
            </div>

            {/* Listado de Tickets */}
            <AtencionTicketList
              tickets={tickets}
              emptyMessage="No hay tickets abiertos en este momento."
              onSelectTicket={handleSelectTicket}
            />
          </>
        );
    }
  };

  // 5. Renderizado final de la página con la nueva estructura Sidebar + Contenido
  return (
    <div className="admin-container flex min-h-screen bg-light">
      {/* Sidebar (fijo, izquierda) */}
      <div className="fixed top-0 left-0 bottom-0 w-64 z-10">
        <SidebarAtencion
          setView={setView}
          activeView={view === 'create' ? 'create' : 'list'}
        />
      </div>

      {/* Contenido principal (con margen izquierdo para compensar el sidebar) */}
      <main className="flex-1 ml-64 p-8">
        {renderContent()}
      </main>
    </div>
  );
};

export default AtencionPasajeroPage;