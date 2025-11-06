import { useState, useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";

const getSessionInfo = () => {
  const userString = localStorage.getItem("user");
  const accessToken = localStorage.getItem("accessToken");

  if (!userString || !accessToken) {
    return { userRole: null, hasToken: false };
  }

  try {
    const user = JSON.parse(userString);
    return { userRole: user.rol?.nombre_rol, hasToken: true };
  } catch (e) {
    console.error("Error al parsear datos de usuario, cerrando sesión local.", e);
    
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
    return { userRole: null, hasToken: false };
  }
};

const ProtectedRoute = ({ allowedRoles }) => {
  const [session, setSession] = useState(getSessionInfo());
  
  if (!session.hasToken) {
    return <Navigate to="/auth" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(session.userRole)) {
    return <Navigate to="/" replace />;
  }

  if (allowedRoles.includes(session.userRole)) {
    return <Outlet />;
  }
  
  return <Navigate to="/auth" replace />;
};

export default ProtectedRoute;