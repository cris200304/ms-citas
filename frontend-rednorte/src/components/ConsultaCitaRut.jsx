import { useState } from "react";
import axios from "axios";

function ConsultaCitaRut() {
    const [rut, setRut] = useState("");
    const [citas, setCitas] = useState([]);
    const [mensaje, setMensaje] = useState("");
    const validarRut = (rut) => {
        const rutLimpio = rut.replace(/\./g, "").replace("-", "");

        if (!/^[0-9]{7,8}[0-9kK]$/.test(rutLimpio)) {
            return false;
        }

        let cuerpo = rutLimpio.slice(0, -1);
        let dv = rutLimpio.slice(-1).toUpperCase();

        let suma = 0;
        let multiplo = 2;

        for (let i = cuerpo.length - 1; i >= 0; i--) {
            suma += parseInt(cuerpo.charAt(i)) * multiplo;
            multiplo = multiplo === 7 ? 2 : multiplo + 1;
        }

        const resto = 11 - (suma % 11);

        let dvEsperado;

        if (resto === 11) dvEsperado = "0";
        else if (resto === 10) dvEsperado = "K";
        else dvEsperado = resto.toString();

        return dv === dvEsperado;
    };

    const buscarCitas = async (e) => {
        e.preventDefault();
        if (!validarRut(rut)) {
            setMensaje("❌ Ingrese un RUT válido.");
            return;
        }

        try {
            const response = await axios.get(
                `http://localhost:8083/api/citas/rut/${rut}`
            );

            setCitas(response.data);

            if (response.data.length === 0) {
                setMensaje("No se encontraron solicitudes para este RUT");
            } else {
                setMensaje("");
            }
        } catch (error) {
            console.error(error);
            setMensaje("Error al consultar la solicitud");
        }
    };

    return (
        <div className="card">
            <h3>🔎 Consultar Estado por RUT</h3>

            <form onSubmit={buscarCitas}>
                <input
                    placeholder="Ingrese su RUT"
                    value={rut}
                    onChange={(e) => setRut(e.target.value)}
                    required
                />

                <button type="submit">Consultar</button>
            </form>

            {mensaje && <p>{mensaje}</p>}

            {citas.length > 0 && (
                <table>
                    <thead>
                    <tr>
                        <th>Paciente</th>
                        <th>Profesional</th>
                        <th>Tipo</th>
                        <th>Prioridad</th>
                        <th>Estado</th>
                        <th>Fecha</th>
                        <th>Hora</th>
                    </tr>
                    </thead>
                    <tbody>
                    {citas.map((cita) => (
                        <tr key={cita.id}>
                            <td>{cita.paciente}</td>
                            <td>{cita.doctorNombre}</td>
                            <td>{cita.tipo}</td>
                            <td>{cita.prioridad}</td>
                            <td>{cita.estado}</td>
                            <td>{cita.fecha}</td>
                            <td>{cita.hora}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}

export default ConsultaCitaRut;