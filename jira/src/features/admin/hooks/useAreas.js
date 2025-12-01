import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { getAuthHeaders, handleTokenExpiry } from "../../auth/hooks/useAuth";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const API_URL = `${API_BASE_URL}/areas`;

export function useAreas() {
  const [areas, setAreas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAreas = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(API_URL, {
        headers: getAuthHeaders(),
      });
      const tokenExpired = await handleTokenExpiry(response);
      if (tokenExpired) {
        return;
      }

      if (!response.ok) {
        const errorData = await response.json();
        if (response.status === 403) {
          setError("No autorizado. Permisos insuficientes o sesión expirada.");
        }
        throw new Error(errorData.message || "Error al obtener los usuarios");
      }

      const data = await response.json();
      setAreas(
        data.map((area) => ({
          id_area: area.id_area,
          nombre_area: area.nombre_area,
          descripcion: area.descripcion,
        }))
      );
    } catch (err) {
      console.error(err);
      setError(err.message);
      if (error?.message?.indexOf("Permisos insuficientes") === -1) {
        toast.error(err.message || "Error de red/servidor al cargar áreas.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAreas();
  }, []);

  return { areas, loading, error };
}
