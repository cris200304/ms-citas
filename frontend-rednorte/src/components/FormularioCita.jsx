import { useState, useEffect } from "react";
import axios from "axios";

function FormularioCita({ cargarDashboard }) {

    const [doctores, setDoctores] = useState([]);
    const [horasDisponibles, setHorasDisponibles] = useState([]);

    const [form, setForm] = useState({
        paciente: "",
        rut: "",
        telefono: "",
        correo: "",
        rutDoctor: "",
        profesionId: "",
        fecha: "",
        hora: "",
        tipo: "CONSULTA_MEDICA"
    });

    const [mensaje, setMensaje] = useState("");
    const [citaCreada, setCitaCreada] = useState(null);

    // Cargar doctores
    useEffect(() => {

        const cargarDoctores = async () => {

            try {

                const response = await axios.get(
                    "http://localhost:8083/doctores"
                );

                setDoctores(response.data);

            } catch (error) {

                console.error("Error cargando doctores", error);

            }

        };

        cargarDoctores();

    }, []);

    // Cargar horas disponibles
    useEffect(() => {

        const cargarHorasDisponibles = async () => {

            if (!form.rutDoctor || !form.fecha) {
                setHorasDisponibles([]);
                return;
            }

            try {

                const response = await axios.get(
                    "http://localhost:8083/api/citas/disponibles",
                    {
                        params: {
                            rutDoctor: form.rutDoctor,
                            fecha: form.fecha
                        }
                    }
                );

                setHorasDisponibles(response.data);

            } catch (error) {

                console.error("Error cargando horas disponibles", error);
                setHorasDisponibles([]);

            }

        };

        cargarHorasDisponibles();

    }, [form.rutDoctor, form.fecha]);

    const doctorSeleccionado = doctores.find(
        doctor => doctor.rut === form.rutDoctor
    );

    const campoVacio = (campo) => !String(campo || "").trim();
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

    const handleChange = (e) => {

        setForm({
            ...form,
            [e.target.name]: e.target.value
        });

    };

    const crearCita = async (e) => {

        e.preventDefault();

        if (
            campoVacio(form.paciente) ||
            campoVacio(form.rut) ||
            campoVacio(form.telefono) ||
            campoVacio(form.correo) ||
            campoVacio(form.rutDoctor) ||
            campoVacio(form.profesionId) ||
            campoVacio(form.fecha) ||
            campoVacio(form.hora)
        ) {
            setMensaje("❌ Complete todos los campos.");
            return;
        }

        if (!validarRut(form.rut)) {
            setMensaje("❌ El RUT ingresado no es válido.");
            return;
        }

        const confirmar = window.confirm(
            "¿Está seguro de solicitar esta hora médica?\n\nUna vez enviada, los datos no podrán ser modificados por el paciente."
        );

        if (!confirmar) {
            return;
        }

        try {

            const response = await axios.post(
                "http://localhost:8083/api/citas",
                {
                    paciente: form.paciente.trim(),
                    rut: form.rut.trim(),
                    telefono: form.telefono.trim(),
                    correo: form.correo.trim(),
                    rutDoctor: form.rutDoctor,
                    profesionId: Number(form.profesionId),
                    fecha: form.fecha,
                    hora: form.hora + ":00",
                    tipo: form.tipo
                }
            );

            setCitaCreada(response.data);
            setMensaje("✅ Hora solicitada correctamente");

            setForm({
                paciente: "",
                rut: "",
                telefono: "",
                correo: "",
                rutDoctor: "",
                profesionId: "",
                fecha: "",
                hora: "",
                tipo: "CONSULTA_MEDICA"
            });

            setHorasDisponibles([]);

            if (cargarDashboard) {
                await cargarDashboard();
            }

        } catch (error) {

            console.error(error);

            if (error.response) {
                setMensaje("❌ " + JSON.stringify(error.response.data));
            } else {
                setMensaje("❌ Error de conexión con ms-citas");
            }

        }

    };

    return (
        <div className="card">

            <h3>📅 Solicitar Hora Médica</h3>

            <form onSubmit={crearCita} noValidate>

                <input
                    name="paciente"
                    placeholder="Nombre del paciente"
                    value={form.paciente}
                    onChange={handleChange}
                />

                <input
                    name="rut"
                    placeholder="RUT del paciente"
                    value={form.rut}
                    onChange={handleChange}
                />

                <input
                    name="telefono"
                    placeholder="Teléfono"
                    value={form.telefono}
                    onChange={handleChange}
                />

                <input
                    type="email"
                    name="correo"
                    placeholder="Correo"
                    value={form.correo}
                    onChange={handleChange}
                />

                <select
                    name="rutDoctor"
                    value={form.rutDoctor}
                    onChange={handleChange}
                >

                    <option value="">
                        Seleccione profesional
                    </option>

                    {doctores.map((doctor) => (

                        <option key={doctor.rut} value={doctor.rut}>
                            {doctor.nombre}
                        </option>

                    ))}

                </select>

                {doctorSeleccionado && (

                    <select
                        name="profesionId"
                        value={form.profesionId}
                        onChange={handleChange}
                    >

                        <option value="">
                            Seleccione profesión
                        </option>

                        {doctorSeleccionado.profesiones.map((profesion) => (

                            <option
                                key={profesion.id}
                                value={profesion.id}
                            >
                                {profesion.nombre}
                            </option>

                        ))}

                    </select>

                )}

                <input
                    type="date"
                    name="fecha"
                    value={form.fecha}
                    onChange={handleChange}
                />

                <select
                    name="hora"
                    value={form.hora}
                    onChange={handleChange}
                >

                    <option value="">
                        Seleccione hora
                    </option>

                    {horasDisponibles.map((hora) => (

                        <option key={hora} value={hora}>
                            {hora}
                        </option>

                    ))}

                </select>

                <select
                    name="tipo"
                    value={form.tipo}
                    onChange={handleChange}
                >

                    <option value="CONSULTA_MEDICA">
                        Consulta médica
                    </option>

                    <option value="CIRUGIA">
                        Cirugía
                    </option>

                </select>



                <button type="submit">
                    Solicitar Hora
                </button>

            </form>

            {mensaje && <p>{mensaje}</p>}

            {citaCreada && (

                <div className="resumen-cita">

                    <h4>Estado de la hora solicitada</h4>

                    <p><strong>Paciente:</strong> {citaCreada.paciente}</p>

                    <p><strong>Profesional:</strong> {citaCreada.doctorNombre}</p>

                    <p><strong>Profesión:</strong> {citaCreada.profesion}</p>

                    <p><strong>Fecha:</strong> {citaCreada.fecha}</p>

                    <p><strong>Hora:</strong> {citaCreada.hora?.substring(0, 5)}</p>

                    <p><strong>Estado:</strong> {citaCreada.estado}</p>

                </div>

            )}

        </div>

    );
}

export default FormularioCita;