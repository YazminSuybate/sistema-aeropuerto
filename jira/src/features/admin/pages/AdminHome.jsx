import { useState } from "react";
import SidebarAdmin from "../components/SidebarAdmin";
import IntroAdmin from "../components/panel/IntroAdmin";
import UserManagement from "./UserManagement";
import AsignacionTareas from "../components/panel/AsignacionTareas";
import TiemposMaximos from "../components/panel/TiemposMaximos";
import DashboardTickets from "../components/panel/DashboardTickets";
import "../../../styles/AdminHome.css";

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
      <div className="fixed top-0 left-0 bottom-0 w-64 z-10">
        <SidebarAdmin setActivePanel={setActivePanel} />
      </div>

      <main className="flex-1 ml-64">
        {renderPanel()}
      </main>
    </div>
  );
}
