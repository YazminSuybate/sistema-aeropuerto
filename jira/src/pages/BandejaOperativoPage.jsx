import { useBandejaOperativo } from "../hooks/useBandejaOperativo"
import { Tabs, TabPane } from "../components/UI/Tabs"
import { TicketList } from "../components/tickets/TicketList"

export const BandejaOperativoPage = () => {
  const { disponibles, asignados, loading, error } = useBandejaOperativo()

  if (error) {
    return (
      <div className="p-6 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-red-800 font-semibold">Error: {error}</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Bandeja de Operativo</h1>
          <p className="text-gray-600 mt-2">Gestiona tus tickets operativos</p>
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
          <Tabs activeTab="disponibles" onTabChange={(tab) => console.log("Tab activa:", tab)}>
            <TabPane tabKey="disponibles" label="Disponibles en mi Área">
              <TicketList tickets={disponibles} emptyMessage="No hay tickets disponibles en tu área" />
            </TabPane>

            <TabPane tabKey="asignados" label="Mis Tickets Asignados">
              <TicketList tickets={asignados} emptyMessage="No tienes tickets asignados" />
            </TabPane>
          </Tabs>
        )}
      </div>
    </div>
  )
}