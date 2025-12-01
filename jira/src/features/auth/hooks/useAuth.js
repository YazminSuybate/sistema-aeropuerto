import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { authService } from "../api/auth.service";
import { storage } from "../utils/storage";

export const useAuth = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const login = useCallback(async (email, password) => {
    setIsLoading(true);
    try {
      const data = await authService.login(email, password);

      storage.setToken(data.accessToken);
      storage.setUser(data.user);

      toast.success(`Bienvenido, ${data.user?.nombre || "usuario"}!`);

      return data.user;
    } catch (error) {
      console.error("Login error:", error);
      toast.error(error.message || "Error al iniciar sesión.");
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    storage.clear();
    navigate("/auth");
  }, [navigate]);

  return {
    login,
    logout,
    isLoading,
    user: storage.getUser(),
    token: storage.getToken(),
  };
};

// Helper for headers (legacy support if needed, though api.js handles this)
export const getAuthHeaders = () => {
  const token = storage.getToken();
  const headers = { "Content-Type": "application/json" };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  return headers;
};

export async function handleTokenExpiry(response) {
  if (response.status === 401) {
    const clonedResponse = response.clone();

    try {
      const errorData = await clonedResponse.json();

      if (errorData.code === "TOKEN_EXPIRED") {
        toast.error("Su sesión ha expirado. Redirigiendo al inicio de sesión.");

        storage.clear();

        setTimeout(() => {
          window.location.href = "/auth";
        }, 1500);

        return true;
      }
    } catch (e) {
      console.error("Error al manejar la expiración del token:", e);
    }
  }

  return false;
}
