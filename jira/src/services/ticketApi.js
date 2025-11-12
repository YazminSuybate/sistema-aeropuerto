const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

/**
 * Helper genérico para hacer peticiones fetch con el token de auth.
 */
const apiFetch = async (endpoint, options = {}) => {
  const token = localStorage.getItem("accessToken");

  const defaultHeaders = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  const config = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

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
  const user = JSON.parse(localStorage.getItem("user"));
  if (!user || !user.id_area) {
    throw new Error("No se pudo encontrar el id_area del usuario.");
  }
  return apiFetch(`/tickets/area/${user.id_area}`);
};

export const getTicketsAsignados = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  if (!user || !user.id_usuario) {
    throw new Error("No se pudo encontrar el id del usuario.");
  }
  return apiFetch(`/tickets/responsable/${user.id_usuario}`);
};

export const claimTicket = (ticketId) => {
  return apiFetch(`/tickets/${ticketId}/claim`, {
    method: "PUT",
  });
};
