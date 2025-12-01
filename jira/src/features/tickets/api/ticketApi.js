import { storage } from "../../auth/utils/storage";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const apiFetch = async (endpoint, options = {}) => {
  const token = storage.getToken();

  const defaultHeaders = {
    "Content-Type": "application/json",
  };

  if (token) {
    defaultHeaders["Authorization"] = `Bearer ${token}`;
  }

  const config = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  };

  let response = await fetch(`${API_BASE_URL}${endpoint}`, config);

  if (response.status === 401) {
    console.warn("Token expirado o inválido. Intentando refrescar...");

    try {
      // Evitar bucle infinito si la petición original era al endpoint de refresh
      if (endpoint === "/refresh") {
        throw new Error("Refresh token expirado");
      }

      // Intentar refrescar el token (el backend lee la cookie httpOnly)
      const refreshResponse = await fetch(`${API_BASE_URL}/refresh`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        // Importante: incluir credenciales para enviar la cookie
        credentials: "include",
      });

      if (refreshResponse.ok) {
        const data = await refreshResponse.json();
        storage.setToken(data.accessToken);

        // Actualizar el header con el nuevo token
        config.headers["Authorization"] = `Bearer ${data.accessToken}`;

        // Reintentar la petición original
        response = await fetch(`${API_BASE_URL}${endpoint}`, config);
      } else {
        throw new Error("No se pudo refrescar el token");
      }
    } catch (error) {
      console.error("Error al refrescar sesión:", error);
      storage.clear();
      window.location.href = "/auth";
      throw new Error("Sesión expirada");
    }
  }

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || `Error ${response.status}`);
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
};

export const getTicketsDisponibles = () => {
  const user = storage.getUser();
  if (!user || !user.id_area) {
    return Promise.reject(
      new Error("No se pudo encontrar el id_area del usuario.")
    );
  }
  return apiFetch(`/tickets/area/${user.id_area}`);
};

export const getTicketsAsignados = () => {
  const user = storage.getUser();
  if (!user || !user.id_usuario) {
    return Promise.reject(new Error("No se pudo encontrar el id del usuario."));
  }
  return apiFetch(`/tickets/responsable/${user.id_usuario}`);
};

export const claimTicket = (ticketId) => {
  return apiFetch(`/tickets/${ticketId}/claim`, {
    method: "PUT",
  });
};

export const getTickets = () => {
  return apiFetch("/tickets");
};

export const getCategorias = () => {
  return apiFetch("/categorias");
};

export const getPasajeros = () => {
  return apiFetch("/pasajeros");
};

export const createTicket = (ticketData) => {
  return apiFetch("/tickets", {
    method: "POST",
    body: JSON.stringify(ticketData),
  });
};

export const createComment = (commentData) => {
  return apiFetch("/comentarios", {
    method: "POST",
    body: JSON.stringify(commentData),
  });
};

export const getEstados = () => {
  return apiFetch("/estados");
};
