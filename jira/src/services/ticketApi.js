const API_BASE_URL = "http://localhost:3000/api";

/**
 * Helper genérico para hacer peticiones fetch con el token de auth.
 */
const apiFetch = async (endpoint, options = {}) => {
  const token = localStorage.getItem("accessToken");

  const defaultHeaders = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`, // El middleware 'protect' usa esto
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

  // Maneja respuestas sin contenido (ej. 204 No Content)
  if (response.status === 204) {
    return null;
  }

  return response.json();
};

// --- FUNCIONES PARA OBTENER LOS TICKETS ---

/**
 * Obtiene los tickets disponibles para el área del usuario logueado.
 */
export const getTicketsDisponibles = () => {
  // Obtenemos el 'id_area' del usuario que guardamos en localStorage al hacer login
  const user = JSON.parse(localStorage.getItem("user"));
  if (!user || !user.id_area) {
    throw new Error("No se pudo encontrar el id_area del usuario.");
  }
  // Llama al endpoint: GET /api/tickets/area/:id_area
  return apiFetch(`/tickets/area/${user.id_area}`);
};

/**
 * Obtiene los tickets asignados al usuario logueado.
 */
export const getTicketsAsignados = () => {
  // Obtenemos el 'id' (id_usuario) del usuario logueado
  const user = JSON.parse(localStorage.getItem("user"));
  if (!user || !user.id_usuario) {
    throw new Error("No se pudo encontrar el id del usuario.");
  }
  // Llama al endpoint: GET /api/tickets/responsable/:id_usuario
  return apiFetch(`/tickets/responsable/${user.id_usuario}`);
};

/**
 * Llama al endpoint para tomar (reclamar) un ticket.
 */
export const claimTicket = (ticketId) => {
  // Llama al endpoint: PUT /api/tickets/:id/claim
  return apiFetch(`/tickets/${ticketId}/claim`, {
    method: "PUT",
    // No necesita body, el backend usa el ID del token
  });
};
