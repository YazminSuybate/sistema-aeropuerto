import React from "react";
import { useAtencionPasajero } from "../hooks/useAtencionPasajero";
import { AtencionTicketList } from "../../tickets/components/Listaticket";
import { CreateTicketForm } from "../../tickets/components/CreacionTicket";
import { TicketDetailView } from "../../tickets/components/VistaDetalleTicket";
import Button from "../../admin/components/userManagement/Button";
import SidebarAtencion from "../components/SidebarAtencion";
import { Loader2, AlertTriangle } from "lucide-react";

/**
 * Página principal del "Centro de Atención al Pasajero".
 * Este componente orquesta qué vista mostrar (lista, crear, detalle)
 * basándose en el estado del hook 'useAtencionPasajero'.
 */
const AtencionPasajeroPage = () => {
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

  if (loading || !currentUser) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] text-gray-600">
        <Loader2 size={40} className="animate-spin mr-3" />
        <span className="text-xl">Cargando datos...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-red-600 bg-red-50 border border-red-200 rounded-lg p-8">
        <AlertTriangle size={40} className="mb-4" />
        <h2 className="text-2xl font-semibold mb-2">Error al cargar la página</h2>
        <p className="text-center">{error}</p>
        <Button
          variant="secondary"
          size="medium"
          onClick={() => window.location.reload()}
          className="mt-6"
        >
          Reintentar
        </Button>
      </div>
    );
  }

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
            <div className="flex flex-col md:flex-row justify-between items-start mb-6 gap-4">
              <h1 className="text-3xl font-bold text-gray-800">
                Lista de Incidencias
              </h1>
            </div>

            <AtencionTicketList
              tickets={tickets}
              emptyMessage="No hay tickets abiertos en este momento."
              onSelectTicket={handleSelectTicket}
            />
          </>
        );
    }
  };

  return (
    <div className="admin-container flex min-h-screen bg-light">
      <div className="fixed top-0 left-0 bottom-0 w-64 z-10">
        <SidebarAtencion
          setView={setView}
          activeView={view === 'create' ? 'create' : 'list'}
        />
      </div>

      <main className="flex-1 ml-64 p-8">
        {renderContent()}
      </main>
    </div>
  );
};

export default AtencionPasajeroPage;