// --- Helpers y Configuración ---

const API_BASE_URL = "http://localhost:3000/api";

/**
 * Helper genérico (tu 'apiFetch') para hacer peticiones fetch
 * con el token de autenticación.
 */
const apiFetch = async (endpoint, options = {}) => {
  const token = localStorage.getItem("accessToken");

  const defaultHeaders = {
    "Content-Type": "application/json",
  };
  
  // Añadimos el token si existe
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

  const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

  // Manejo de 401 (Token expirado/inválido)
  if (response.status === 401) {
    console.error("Token inválido o expirado. Redirigiendo al login...");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
    // Asumimos que tu ruta de login es /auth
    window.location.href = "/auth"; 
    throw new Error("No autorizado");
  }

  // Manejo de otros errores
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || `Error ${response.status}`);
  }

  // Maneja respuestas sin contenido (ej. 204 No Content en un DELETE)
  if (response.status === 204) {
    return null;
  }

  return response.json();
};

// --- FUNCIONES PARA 'useBandejaOperativo' (Tu Hook) ---

/**
 * Obtiene los tickets disponibles para el área del usuario logueado.
 * (Basado en tu lógica de 'ticketAPI.js')
 */
export const getTicketsDisponibles = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  if (!user || !user.id_area) {
    // Retornamos una promesa rechazada para que el hook la atrape
    return Promise.reject(new Error("No se pudo encontrar el id_area del usuario."));
  }
  // Llama al endpoint: GET /api/tickets/area/:id_area
  return apiFetch(`/tickets/area/${user.id_area}`);
};

/**
 * Obtiene los tickets asignados al usuario logueado.
 * (Basado en tu lógica de 'ticketAPI.js')
 */
export const getTicketsAsignados = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  if (!user || !user.id_usuario) {
    return Promise.reject(new Error("No se pudo encontrar el id del usuario."));
  }
  // Llama al endpoint: GET /api/tickets/responsable/:id_usuario
  return apiFetch(`/tickets/responsable/${user.id_usuario}`);
};

/**
 * Llama al endpoint para tomar (reclamar) un ticket.
 * (Basado en tu lógica de 'ticketAPI.js')
 */
export const claimTicket = (ticketId) => {
  // Llama al endpoint: PUT /api/tickets/:id/claim
  return apiFetch(`/tickets/${ticketId}/claim`, {
    method: "PUT",
    // No necesita body, el backend usa el ID del token
  });
};

// --- FUNCIONES PARA 'useAtencionPasajero' (El Nuevo Hook) ---

/**
 * Obtiene el perfil del usuario logueado (desde el token).
 */
export const getProfile = () => {
  return apiFetch("/auth/profile"); // Asumiendo que tienes este endpoint
};

/**
 * Obtiene TODOS los tickets (para la vista de Atención).
 */
export const getTickets = () => {
  return apiFetch("/tickets"); // GET /api/tickets
};

/**
 * Obtiene todas las categorías (para el formulario).
 */
export const getCategorias = () => {
  return apiFetch("/categorias"); // GET /api/categorias
};

/**
 * Obtiene todos los pasajeros (para el formulario).
 */
export const getPasajeros = () => {
  return apiFetch("/pasajeros"); // GET /api/pasajeros
};

/**
 * Crea un nuevo ticket.
 */
export const createTicket = (ticketData) => {
  return apiFetch("/tickets", {
    method: "POST",
    body: JSON.stringify(ticketData),
  });
};

/**
 * Crea un nuevo comentario.
 */
export const createComment = (commentData) => {
  return apiFetch("/comentarios", {
    method: "POST",
    body: JSON.stringify(commentData),
  });
};

/**
 * Obtiene todos los estados (para el formulario y el listado).
 */
export const getEstados = () => {
  return apiFetch("/estados"); // GET /api/estados
};