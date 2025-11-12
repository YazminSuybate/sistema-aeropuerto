import React from "react";
import { useAtencionPasajero } from "../hooks/useAtencionPasajero"; // El hook que maneja todo
import { AtencionTicketList } from "../components/tickets/Listaticket"; // Tu componente de lista
import { CreateTicketForm } from "../components/CreacionTicket"; // Tu formulario de creación
import { TicketDetailView } from "../components/VistaDetalleTicket"; // Tu vista de detalle y chat
import Button from "../components/admin/userManagement/Button"; // Tu componente de botón

// Iconos para Carga, Error y el botón de "Crear"
import { Loader2, AlertTriangle, Plus } from "lucide-react";

/**
 * Página principal del "Centro de Atención al Pasajero".
 * Este componente orquesta qué vista mostrar (lista, crear, detalle)
 * basándose en el estado del hook 'useAtencionPasajero'.
 */
const AtencionPasajeroPage = () => {
  // 1. Obtenemos todo el estado y la lógica del hook
  const {
    view,
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
  // Esta función decide qué componente mostrar según el estado 'view'
  const renderContent = () => {
    switch (view) {
      // -----------------------------------------------------------------
      // VISTA "CREATE" (Función 1: Crear Ticket)
      // -----------------------------------------------------------------
      case "create":
        return (
          <CreateTicketForm
            categorias={categorias}
            pasajeros={pasajeros}
            currentUser={currentUser}
            onSubmit={handleCreateTicket} // Pasa la función de creación del hook
            onCancel={() => setView("list")} // Pasa la función para volver
          />
        );

      // -----------------------------------------------------------------
      // VISTA "DETAIL" (Función 2: Seguimiento - Detalle y Chat)
      // -----------------------------------------------------------------
      case "detail":
        if (!selectedTicket) {
          // Si no hay ticket seleccionado, volvemos a la lista
          setView("list");
          return null;
        }
        return (
          <TicketDetailView
            ticket={selectedTicket}
            currentUser={currentUser}
            onSubmitComment={handleSubmitComment} // Pasa la función de comentar del hook
            onCancel={() => setView("list")} // Pasa la función para volver
          />
        );

      // -----------------------------------------------------------------
      // VISTA "LIST" (Default: Centro de Atención)
      // -----------------------------------------------------------------
      case "list":
      default:
        return (
          <>
            {/* Cabecera con Botón "Crear Incidencia" (Función 1) */}
            <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
              <h1 className="text-3xl font-bold text-gray-800">
                Centro de Atención
              </h1>
              <Button
                variant="primary"
                size="medium"
                onClick={() => setView("create")} // Cambia la vista a 'create'
              >
                <Plus size={18} className="mr-2" />
                Crear Incidencia
              </Button>
            </div>

            {/* Listado de Tickets (Función 2: Seguimiento) */}
            <AtencionTicketList
              tickets={tickets}
              emptyMessage="No hay tickets abiertos en este momento."
              onSelectTicket={handleSelectTicket} // Pasa la función de selección del hook
            />
          </>
        );
    }
  };

  // 5. Renderizado final de la página
  return (
    <div className="container mx-auto p-4 md:p-8">
      {/* Renderiza la vista correspondiente (lista, crear o detalle) */}
      {renderContent()}
    </div>
  );
};

export default AtencionPasajeroPage;