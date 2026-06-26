import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

import Login from "./components/Login";
import VistaPaciente from "./components/VistaPaciente";
import VistaAdmin from "./components/VistaAdmin";

function App() {
    const [vista, setVista] = useState("");
    const [dashboard, setDashboard] = useState(null);

    const cargarDashboard = async () => {
        try {
            const response = await axios.get(
                "http://localhost:8080/api/bff/dashboard"
            );

            setDashboard(response.data);
        } catch (error) {
            console.error("Error al cargar dashboard:", error);
        }
    };

    useEffect(() => {
        cargarDashboard();
    }, []);

    if (!vista) {
        return <Login setVista={setVista} />;
    }

    if (!dashboard) {
        return <h2 className="cargando">Cargando información...</h2>;
    }

    return (
        <div className="container">
            <header className="app-header">
                <h1>🏥 Red Norte Salud</h1>
                <p>Sistema inteligente de gestión de solicitudes médicas</p>
            </header>

            <button
                className="volver"
                onClick={() => setVista("")}
            >
                ⬅ Volver
            </button>

            <main className="panel-contenido">
                {vista === "paciente" && (
                    <VistaPaciente
                        dashboard={dashboard}
                        cargarDashboard={cargarDashboard}
                    />
                )}

                {vista === "admin" && (
                    <VistaAdmin
                        dashboard={dashboard}
                        cargarDashboard={cargarDashboard}
                    />
                )}
            </main>
        </div>
    );
}

export default App;