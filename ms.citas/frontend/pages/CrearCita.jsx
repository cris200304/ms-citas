import { useState } from "react";
import citasApi from "../api/citasApi";

function CrearCita() {

    const [formulario, setFormulario] = useState({
        paciente: "",
        fecha: "",
        hora: "",
        doctorId: ""
    });

    const handleChange = (e) => {
        setFormulario({
            ...formulario,
            [e.target.name]: e.target.value
        });
    };

    const crearCita = async (e) => {
        e.preventDefault();

        try {

            await citasApi.post("/citas", formulario);

            alert("Cita creada correctamente");

        } catch (error) {

            console.error(error);
            alert("Error al crear cita");

        }
    };

    return (
        <div className="contenedor">

            <h2>Crear Cita</h2>

            <form onSubmit={crearCita}>

                <input
                    type="text"
                    name="paciente"
                    placeholder="Paciente"
                    onChange={handleChange}
                />

                <input
                    type="date"
                    name="fecha"
                    onChange={handleChange}
                />

                <input
                    type="time"
                    name="hora"
                    onChange={handleChange}
                />

                <input
                    type="number"
                    name="doctorId"
                    placeholder="ID Doctor"
                    onChange={handleChange}
                />

                <button type="submit">
                    Crear cita
                </button>

            </form>

        </div>
    );
}

export default CrearCita;