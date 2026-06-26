import FormularioCita from "./FormularioCita.jsx";
import ConsultaCitaRut from "./ConsultaCitaRut.jsx";
import "../VistaPaciente.css";

function VistaPaciente({ cargarDashboard }) {
    return (
        <div className="vista-paciente">
            <section className="paciente-hero">
                <div>
                    <h2>👤 Portal del Paciente</h2>
                    <p>
                        Solicita tu hora médica, consulta el estado de tu solicitud
                        y revisa la información de tu atención.
                    </p>
                </div>
            </section>

            <div className="paciente-grid">
                <div className="paciente-panel">
                    <FormularioCita cargarDashboard={cargarDashboard} />
                </div>

                <div className="paciente-panel">
                    <ConsultaCitaRut />
                </div>
            </div>
        </div>
    );
}

export default VistaPaciente;