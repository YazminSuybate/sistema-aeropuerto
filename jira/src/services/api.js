const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const apiFetch = async (endpoint, options = {}) => {
  const token = localStorage.getItem("accessToken");

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

  const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

  if (response.status === 401) {
    console.error("Token inválido o expirado. Redirigiendo al login...");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
    window.location.href = "/auth";
    throw new Error("No autorizado");
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
  const user = JSON.parse(localStorage.getItem("user"));
  if (!user || !user.id_area) {
    return Promise.reject(new Error("No se pudo encontrar el id_area del usuario."));
  }
  return apiFetch(`/tickets/area/${user.id_area}`);
};

export const getTicketsAsignados = () => {
  const user = JSON.parse(localStorage.getItem("user"));
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

export const getProfile = () => {
  return apiFetch("/auth/profile");
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

export const loginUser = (email, password) => {
  try {
    const response = fetch(`${API_BASE_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = response.json();

    if (!response.ok) {
      const errorMessage =
        data.message ||
        "Error al iniciar sesión. Credenciales inválidas o usuario inactivo.";
      toast.error(errorMessage);
      return;
    }

    localStorage.setItem("accessToken", data.accessToken);
    localStorage.setItem("user", JSON.stringify(data.user));

    toast.success(
      `Bienvenido, ${data.user?.nombre || "usuario"}! Iniciando sesión...`
    );

    const userRoleName = data.user?.rol?.nombre_rol;

    setTimeout(() => {
      switch (userRoleName) {
        case "Administrador":
          navigate("/admin");
          break;
        case "Gerencia":
        case "Agente Operativo Junior":
          navigate("/bandeja");
          break;
        case "Agente Operativo Senior":
          navigate("/bandeja");
          break;
        case "Atención al Pasajero":
          navigate("/atencion");
          break;
        default:
          navigate("/home");
          break;
      }
    }, 1000);
  } catch (err) {
    console.error("Error de red/servidor:", err);
    toast.error(
      "No se pudo conectar o el servidor respondió con un error inesperado."
    );
  } finally {
    setIsLoading(false);
  }
};