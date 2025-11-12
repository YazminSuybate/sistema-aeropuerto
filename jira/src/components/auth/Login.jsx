import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  if (!API_BASE_URL) {
    const errorMessage =
      "FATAL ERROR: API_BASE_URL no está definida. Verifique el archivo .env";
    console.error(errorMessage);
    toast.error("Error de Configuración: La URL de la API no está definida.");
    return (
      <div style={{ color: "red", textAlign: "center", padding: "2rem" }}>
        {errorMessage}
      </div>
    );
  }

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

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
            navigate("/atencion"); //esta linea
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

  return (
    <div className="form-content">
      <Toaster position="top-right" reverseOrder={false} />

      <h2
        className="text-3xl font-bold mb-6 text-center"
        style={{ color: "var(--color-primary)" }}
      >
        Iniciar Sesión
      </h2>

      <form className="flex flex-col gap-4" onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Correo electrónico"
          className="input-field"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={isLoading}
          required
        />
        <input
          type="password"
          placeholder="Contraseña"
          className="input-field"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={isLoading}
          required
        />
        <button type="submit" className="btn-login" disabled={isLoading}>
          {isLoading ? "Cargando..." : "Entrar"}
        </button>
      </form>
    </div>
  );
}
