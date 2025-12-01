import { useBandejaOperativo } from "../hooks/useBandejaOperativo";
import { Tabs, TabPane } from "../../../components/UI/Tabs";
import { TicketList } from "../../tickets/components/TicketList";
import SidebarOperativo from "../components/SidebarOperativo";

export const BandejaOperativoPage = () => {
  const { disponibles, asignados, loading, error, handleClaimTicket } =
    useBandejaOperativo();

  if (error) {
    return (
      <div className="p-6 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-red-800 font-semibold">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="admin-container flex min-h-screen bg-gray-50">
      {/* Sidebar (fijo, izquierda) */}
      <div className="fixed top-0 left-0 bottom-0 w-64 z-10">
        <SidebarOperativo />
      </div>

      {/* Contenido principal (con margen izquierdo para compensar el sidebar) */}
      <main className="flex-1 ml-64 p-8">
        <div className="max-w-5xl mx-auto">
          <div className="mb-8 flex justify-between items-start">
            {/* Contenedor para el título y subtítulo */}
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Bandeja Operativa
              </h1>
              <p className="text-gray-600 mt-2">
                Gestiona tus tickets operativos
              </p>
            </div>
          </div>

          {/* Carga */}
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              </div>
              <p className="text-gray-600 mt-4">Cargando datos...</p>
            </div>
          ) : (
            /* Tabs */
            <Tabs
              activeTab="disponibles"
              onTabChange={(tab) => console.log("Tab activa:", tab)}
            >
              <TabPane tabKey="disponibles" label="Disponibles en mi Área">
                <TicketList
                  tickets={disponibles}
                  emptyMessage="No hay tickets disponibles en tu área"
                  onClaimTicket={handleClaimTicket}
                />
              </TabPane>

              <TabPane tabKey="asignados" label="Mis Tickets Asignados">
                <TicketList
                  tickets={asignados}
                  emptyMessage="No tienes tickets asignados"
                />
              </TabPane>
            </Tabs>
          )}
        </div>
      </main>
    </div>
  );
};