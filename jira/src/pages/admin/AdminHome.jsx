import { useState } from "react";
import SidebarAdmin from "../../components/admin/SidebarAdmin";
import IntroAdmin from "../../components/admin/panel/IntroAdmin";
import UserManagement from "../../pages/admin/UserManagement";
import AsignacionTareas from "../../components/admin/panel/AsignacionTareas";
import TiemposMaximos from "../../components/admin/panel/TiemposMaximos";
import DashboardTickets from "../../components/admin/panel/DashboardTickets";
import "../../styles/AdminHome.css";

export default function AdminHome() {
  const [activePanel, setActivePanel] = useState("intro");

  const renderPanel = () => {
    switch (activePanel) {
      case "usuarios":
        return <UserManagement />;
      case "asignacion":
        return <AsignacionTareas />;
      case "tiempos":
        return <TiemposMaximos />;
      case "dashboard":
        return <DashboardTickets />;
      default:
        return <IntroAdmin />;
    }
  };

  return (
    <div className="admin-container flex min-h-screen bg-light">
      {/* Sidebar relativo */}
      <SidebarAdmin setActivePanel={setActivePanel} />

      {/* Contenido principal */}
      <main className="flex-1 p-8">{renderPanel()}</main>
    </div>
  );
}
