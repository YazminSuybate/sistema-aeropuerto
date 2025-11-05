import { useState } from "react";
import { useNavigate } from "react-router-dom";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  if (!API_BASE_URL) {
    console.error("FATAL ERROR: API_BASE_URL no está definida. Verifique el archivo .env");
    return <div style={{ color: 'red', textAlign: 'center', padding: '2rem' }}>Error de Configuración: La URL de la API no está definida.</div>;
  }

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
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
        setError(data.message || "Error al iniciar sesión. Credenciales inválidas o usuario inactivo.");
        return;
      }

      localStorage.setItem("accessToken", data.accessToken);
      localStorage.setItem("user", JSON.stringify(data.user));

      const userRoleName = data.user?.rol?.nombre_rol;

      switch (userRoleName) {
        case "Administrador":
          navigate("/admin");
          break;
        case "Gerencia":
        case "Operativo":
        case "Atención al Pasajero":
          navigate("/");
          break;
        default:
          navigate("/");
          break;
      }

    } catch (err) {
      console.error("Error de red/servidor:", err);
      setError("No se pudo conectar o el servidor respondió con un error inesperado. Verifique la consola.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="form-content">
      <h2 className="text-3xl font-bold mb-6 text-center" style={{ color: "var(--color-primary)" }}>
        Iniciar Sesión
      </h2>

      {error && (
        <div style={{ color: '#dc3545', marginBottom: '1rem', textAlign: 'center', fontWeight: 'bold' }}>
          {error}
        </div>
      )}

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