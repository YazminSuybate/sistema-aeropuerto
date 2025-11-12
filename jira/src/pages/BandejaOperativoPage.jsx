import { useBandejaOperativo } from "../hooks/useBandejaOperativo";
import { useNavigate } from "react-router-dom";
import Button from "../components/admin/userManagement/Button";
import { Tabs, TabPane } from "../components/UI/Tabs";
import { TicketList } from "../components/tickets/TicketList";

// --- ¡ESTA ES LA LÍNEA QUE FALTA! ---
// Lee la variable de entorno de Vite
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const BandejaOperativoPage = () => {
  const { disponibles, asignados, loading, error, handleClaimTicket } =
    useBandejaOperativo();
  const navigate = useNavigate();

  if (error) {
    return (
      <div className="p-6 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-red-800 font-semibold">Error: {error}</p>
      </div>
    );
  }

  const handleLogout = async () => {
    try {
      const accessToken = localStorage.getItem("accessToken");

      await fetch(`${API_BASE_URL}/logout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });
    } catch (error) {
      console.error(
        "Error al comunicarse con /logout, limpiando sesión local...",
        error
      );
    }

    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");

    navigate("/auth");
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header Corregido */}
        <div className="mb-8 flex justify-between items-start">
          {/* Contenedor para el título y subtítulo */}
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Bandeja de Operativo
            </h1>
            <p className="text-gray-600 mt-2">
              Gestiona tus tickets operativos
            </p>
          </div>

          {/* Botón movido aquí (sin clases absolute) */}
          <Button variant="danger" size="medium" onClick={handleLogout}>
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="mr-2"
            >
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H9"></path>
              <polyline points="16 17 21 12 16 7"></polyline>
              <line x1="21" y1="12" x2="9" y2="12"></line>
            </svg>
            Cerrar Sesión
          </Button>
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
    </div>
  );
};
