import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { useAuth } from "../hooks/useAuth";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, isLoading } = useAuth();
  const navigate = useNavigate();

  if (!API_BASE_URL) {
    console.error("Error de Configuración: La URL de la API no está definida.");
  }

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const user = await login(email, password);
      const userRoleName = user?.rol?.nombre_rol;

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
    } catch {
      // Error is handled in useAuth
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
