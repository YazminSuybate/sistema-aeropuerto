import { useState } from "react"
import "../styles/AuthPage.css"
import Login from "../components/auth/Login"
import Register from "../components/auth/Register"

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true)
  const toggleForm = () => setIsLogin(!isLogin)

  return (
    <div
      className="auth-container min-h-screen flex items-center justify-center px-6"
      style={{ backgroundColor: "var(--color-light)" }}
    >
      <div className="auth-box bg-white rounded-2xl shadow-lg w-full max-w-4xl flex overflow-hidden">

        {/* Lado izquierdo: mensaje promocional */}
        <div className="auth-info flex-1 bg-primary text-light p-10 hidden md:flex flex-col justify-center">
          <h2 className="text-4xl font-bold mb-4">Bienvenido a JiraAirlands</h2>
          <p className="text-lg">
            Gestiona tus proyectos de forma ágil, colabora con tu equipo y acelera tus tareas.
            Todo en un solo lugar para que tu trabajo sea más eficiente y productivo.
          </p>
        </div>

        {/* Lado derecho: formulario */}
        <div className="auth-form flex-1 p-10 flex flex-col justify-center">
          {isLogin ? <Login /> : <Register />}
        </div>
      </div>
    </div>
  )
}
