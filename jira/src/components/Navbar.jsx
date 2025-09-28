import { Link } from "react-router-dom"
import "../styles/Navbar.css"

export default function Navbar() {
  return (
    <nav className="navbar fixed top-0 left-0 w-full flex items-center justify-between px-8 py-4 shadow-md z-50">
      <div className="logo text-3xl font-extrabold" style={{ color: "var(--color-primary)" }}>
        JiraAirlands
      </div>
      <div className="links flex items-center gap-6">
        <Link to="/" className="nav-link">Inicio</Link>
        <Link to="/proyectos" className="nav-link">Proyectos</Link>
        <Link to="/acerca" className="nav-link">Acerca</Link>
        <Link
          to="/auth"
          className="login-btn py-2 px-6 rounded-full font-bold shadow"
        >
          Login
        </Link>
      </div>
    </nav>
  )
}
