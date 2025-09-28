import "../styles/Home.css"
import Navbar from "../components/Navbar"

export default function Home() {
  return (
    <div
      className="home-container min-h-screen flex flex-col items-center justify-center px-6 pt-24"
      style={{ backgroundColor: "var(--color-light)", color: "var(--color-dark)" }}
    >
      <Navbar />

      <div className="home-content text-center mt-12 max-w-3xl">
        <h1
          className="text-5xl md:text-6xl font-extrabold mb-6 home-title"
          style={{ color: "var(--color-primary)" }}
        >
          ¡Bienvenido a JiraAirlands!
        </h1>
        <p
          className="text-lg md:text-xl mb-8 home-text"
          style={{ color: "var(--color-gray)" }}
        >
          Tu plataforma para gestionar proyectos y tareas de forma eficiente y moderna.
        </p>

        <div className="flex gap-6 justify-center home-buttons">
          <button
            className="py-3 px-8 rounded-full font-bold shadow-lg"
            style={{ backgroundColor: "var(--color-secondary)", color: "var(--color-dark)" }}
          >
            Comenzar
          </button>
          <button
            className="py-3 px-8 rounded-full font-bold shadow-lg border-2"
            style={{ borderColor: "var(--color-dark)", color: "var(--color-dark)" }}
          >
            Aprende más
          </button>
        </div>
      </div>
    </div>
  )
}
