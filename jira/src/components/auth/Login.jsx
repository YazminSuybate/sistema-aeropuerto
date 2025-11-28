import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { loginUser } from "../../services/api";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  if (!API_BASE_URL) {
    toast.error("Error de Configuración: La URL de la API no está definida.");
  }

  return (
    <div className="form-content">
      <Toaster position="top-right" reverseOrder={false} />

      <h2
        className="text-3xl font-bold mb-6 text-center"
        style={{ color: "var(--color-primary)" }}
      >
        Iniciar Sesión
      </h2>

      <form className="flex flex-col gap-4" onSubmit={loginUser}>
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
