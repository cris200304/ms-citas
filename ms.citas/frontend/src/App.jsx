import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [doctores, setDoctores] = useState([]);

  const [formulario, setFormulario] = useState({
    paciente: "",
    fecha: "",
    hora: "",
    doctorId: "",
  });

  useEffect(() => {
    obtenerDoctores();
  }, []);

  const obtenerDoctores = async () => {
    try {
      const response = await fetch("http://localhost:8083/doctores");
      const data = await response.json();
      setDoctores(data);
    } catch (error) {
      console.error("Error al obtener doctores:", error);
    }
  };

  const handleChange = (e) => {
    setFormulario({
      ...formulario,
      [e.target.name]: e.target.value,
    });
  };

  const crearCita = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:8083/citas", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formulario),
      });

      if (!response.ok) {
        throw new Error("Error al crear cita");
      }

      alert("Cita creada correctamente");

      setFormulario({
        paciente: "",
        fecha: "",
        hora: "",
        doctorId: "",
      });
    } catch (error) {
      console.error(error);
      alert("No se pudo crear la cita");
    }
  };

  return (
      <div className="contenedor">
        <h1>RedNorte Salud</h1>
        <h2>Crear Cita Médica</h2>

        <form onSubmit={crearCita}>
          <input
              type="text"
              name="paciente"
              placeholder="Nombre del paciente"
              value={formulario.paciente}
              onChange={handleChange}
              required
          />

          <input
              type="date"
              name="fecha"
              value={formulario.fecha}
              onChange={handleChange}
              required
          />

          <input
              type="time"
              name="hora"
              value={formulario.hora}
              onChange={handleChange}
              required
          />

          <select
              name="doctorId"
              value={formulario.doctorId}
              onChange={handleChange}
              required
          >
            <option value="">Seleccione un doctor</option>

            {doctores.map((doctor) => (
                <option key={doctor.id} value={doctor.id}>
                  {doctor.nombre} - {doctor.especialidad}
                </option>
            ))}
          </select>

          <button type="submit">Crear cita</button>
        </form>
      </div>
  );
}

export default App;