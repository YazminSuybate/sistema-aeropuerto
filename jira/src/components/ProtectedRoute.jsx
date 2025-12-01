import { useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { storage } from "../features/auth/utils/storage";

const getSessionInfo = () => {
  const user = storage.getUser();
  const token = storage.getToken();

  if (!user || !token) {
    return { userRole: null, hasToken: false };
  }

  return { userRole: user.rol?.nombre_rol, hasToken: true };
};

const ProtectedRoute = ({ allowedRoles }) => {
  const [session] = useState(getSessionInfo());
  
  if (!session.hasToken) {
    return <Navigate to="/auth" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(session.userRole)) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;