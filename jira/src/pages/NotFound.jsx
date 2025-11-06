import { Link } from "react-router-dom";
import "../../src/styles/Home.css";

export default function NotFoundPage() {
    return (
        <div
            className="home-container min-h-screen flex flex-col items-center justify-center px-6"
            style={{ backgroundColor: "var(--color-light)", color: "var(--color-dark)" }}
        >
            <div className="home-content text-center max-w-3xl">
                <h1
                    className="text-7xl md:text-9xl font-extrabold mb-4 home-title"
                    style={{ color: "var(--color-danger)" }}
                >
                    404
                </h1>
                <h2
                    className="text-3xl md:text-4xl font-bold mb-6 home-title"
                    style={{ color: "var(--color-primary)" }}
                >
                    Página No Encontrada
                </h2>
                <p
                    className="text-lg md:text-xl mb-8 home-text"
                    style={{ color: "var(--color-gray)" }}
                >
                    Lo sentimos, la ruta que estás buscando no existe en JiraAirlands.
                </p>

                <div className="home-buttons flex justify-center">
                    <Link to="/">
                        <button
                            className="py-3 px-8 rounded-full font-bold shadow-lg hover:shadow-xl transition-shadow"
                            style={{
                                backgroundColor: "var(--color-secondary)",
                                color: "var(--color-dark)",
                            }}
                        >
                            Volver al Inicio
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    );
}