/* eslint-disable react-hooks/set-state-in-effect */

import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import emailjs from "@emailjs/browser";
import "../VistaAdmin.css";

function VistaAdmin({ dashboard }) {
    const API_URL = "http://localhost:8083/api/citas";

    const [citas, setCitas] = useState([]);
    const [rutBusqueda, setRutBusqueda] = useState("");
    const [mensaje, setMensaje] = useState("");
    const [guardandoId, setGuardandoId] = useState(null);
    const [editandoId, setEditandoId] = useState(null);
    const [enviandoCorreoId, setEnviandoCorreoId] = useState(null);
    const [correosEnviados, setCorreosEnviados] = useState([]);
    const [pestanaActiva, setPestanaActiva] = useState("solicitudes");

    const estadoSistema = dashboard?.estadoSistema ?? 100;

    const formatearHora = (hora) => {
        if (!hora) return "";
        return String(hora).length === 5 ? `${hora}:00` : hora;
    };

    const mostrarHora = (hora) => String(hora || "").slice(0, 5);

    const formatearTexto = (texto) => {
        if (!texto) return "No registrado";

        return texto
            .toLowerCase()
            .replaceAll("_", " ")
            .replace(/\b\w/g, (letra) => letra.toUpperCase());
    };

    const ordenarPorPrioridad = (lista) => {
        const prioridades = {
            URGENTE: 1,
            ALTA: 2,
            MEDIA: 3,
            BAJA: 4
        };

        return [...lista].sort((a, b) => {
            const prioridadA = prioridades[a.prioridad] || 99;
            const prioridadB = prioridades[b.prioridad] || 99;

            if (prioridadA !== prioridadB) return prioridadA - prioridadB;

            const fechaA = new Date(`${a.fecha}T${mostrarHora(a.hora)}`);
            const fechaB = new Date(`${b.fecha}T${mostrarHora(b.hora)}`);

            if (fechaA.getTime() !== fechaB.getTime()) return fechaB - fechaA;

            return b.id - a.id;
        });
    };

    const cargarCitas = async () => {
        try {
            const response = await axios.get(API_URL);
            setCitas(response.data);
        } catch (error) {
            console.error("Error al cargar citas:", error);
            setMensaje("❌ Error al cargar solicitudes");
        }
    };

    const recargarVistaActual = async () => {
        try {
            if (rutBusqueda.trim()) {
                const response = await axios.get(
                    `${API_URL}/rut/${encodeURIComponent(rutBusqueda)}`
                );
                setCitas(response.data);
            } else {
                await cargarCitas();
            }
        } catch (error) {
            console.error("Error al recargar vista:", error);
            setMensaje("❌ Error al recargar la vista");
        }
    };

    const buscarPorRut = async (e) => {
        e.preventDefault();

        if (!rutBusqueda.trim()) {
            await cargarCitas();
            setMensaje("");
            return;
        }

        try {
            const response = await axios.get(
                `${API_URL}/rut/${encodeURIComponent(rutBusqueda)}`
            );

            setCitas(response.data);

            if (response.data.length === 0) {
                setMensaje("No se encontraron solicitudes para ese RUT");
            } else {
                setMensaje("");
            }
        } catch (error) {
            console.error("Error al buscar por RUT:", error);
            setMensaje("❌ Error de conexión con ms-citas");
        }
    };

    const actualizarCampo = (id, campo, valor) => {
        setCitas((prevCitas) =>
            prevCitas.map((cita) =>
                cita.id === id ? { ...cita, [campo]: valor } : cita
            )
        );
    };

    const enviarCorreo = async (cita) => {
        if (!cita.correo) {
            setMensaje("❌ Esta solicitud no tiene correo registrado.");
            return;
        }

        try {
            setEnviandoCorreoId(cita.id);
            setMensaje("📧 Enviando correo...");

            const estadoBonito = formatearTexto(cita.estado);
            const tipoBonito = formatearTexto(cita.tipo);
            const prioridadBonita = formatearTexto(cita.prioridad);

            const response = await emailjs.send(
                "service_9nv8ndg",
                "template_c3pvgqo",
                {
                    to_email: cita.correo,
                    email: cita.correo,
                    correo: cita.correo,
                    to_name: cita.paciente,
                    paciente: cita.paciente,
                    nombre: cita.paciente,
                    rut: cita.rut,
                    telefono: cita.telefono || "No registrado",
                    doctor: cita.doctorNombre,
                    profesional: cita.doctorNombre,
                    profesion: cita.profesion || "No registrada",
                    tipo: tipoBonito,
                    prioridad: prioridadBonita,
                    estado: estadoBonito,
                    fecha: cita.fecha,
                    hora: mostrarHora(cita.hora),
                    mensaje: `Hola ${cita.paciente}, su solicitud médica se encuentra en estado ${estadoBonito}. Profesional: ${cita.doctorNombre}. Profesión: ${cita.profesion}. Fecha: ${cita.fecha}. Hora: ${mostrarHora(cita.hora)}.`
                },
                "mcsAHLAjEAGCsMXSx"
            );

            console.log("EmailJS OK:", response);
            setCorreosEnviados((prev) => [...prev, cita.id]);
            setMensaje(`✅ Correo enviado correctamente a ${cita.correo}`);
        } catch (error) {
            console.error("ERROR EMAILJS:", error);

            setMensaje(
                `❌ Error EmailJS: ${
                    error?.text ||
                    error?.message ||
                    JSON.stringify(error) ||
                    "Error desconocido"
                }`
            );
        } finally {
            setEnviandoCorreoId(null);
        }
    };

    const guardarCambios = async (
        cita,
        estadoFinal,
        mensajeOk = "✅ Solicitud actualizada correctamente"
    ) => {
        if (!cita.fecha || !cita.hora) {
            setMensaje("❌ Debes ingresar fecha y hora antes de guardar.");
            return;
        }

        const accion = estadoFinal.toLowerCase();

        const confirmar = window.confirm(
            `¿Está seguro de ${accion} esta cita?\n\nUna vez realizada esta acción no podrá modificarse automáticamente.`
        );

        if (!confirmar) {
            return;
        }

        try {
            setGuardandoId(cita.id);
            setMensaje("⏳ Guardando cambios...");

            await axios.put(`${API_URL}/${cita.id}`, {
                rutDoctor: cita.rutDoctor,
                profesionId: Number(cita.profesionId),
                tipo: cita.tipo || "CONSULTA_MEDICA",
                prioridad: cita.prioridad || "MEDIA",
                estado: estadoFinal,
                fecha: cita.fecha,
                hora: formatearHora(cita.hora)
            });

            setEditandoId(null);
            await recargarVistaActual();
            setMensaje(mensajeOk);
        } catch (error) {
            console.error("Error al actualizar cita:", error);

            if (error.response) {
                setMensaje("❌ Error: " + JSON.stringify(error.response.data));
            } else {
                setMensaje("❌ Error de conexión con ms-citas");
            }
        } finally {
            setGuardandoId(null);
        }
    };

    useEffect(() => {
        cargarCitas();
    }, []);

    const solicitudesPendientes = ordenarPorPrioridad(
        citas.filter((c) => c.estado === "PENDIENTE")
    );

    const solicitudesProcesadas = ordenarPorPrioridad(
        citas.filter((c) =>
            ["ACEPTADA", "RECHAZADA", "REAGENDADA"].includes(c.estado)
        )
    );

    const solicitudesCriticas = ordenarPorPrioridad(
        citas.filter((c) => c.prioridad === "ALTA" || c.prioridad === "URGENTE")
    );

    return (
        <>
            <h2>👨‍💼 Panel Administrador</h2>

            <div style={{ margin: "20px 0", display: "flex", gap: "10px" }}>
                <button
                    type="button"
                    className={pestanaActiva === "solicitudes" ? "btn-aprobar" : ""}
                    onClick={() => setPestanaActiva("solicitudes")}
                >
                    📋 Solicitudes
                </button>

                <button
                    type="button"
                    className={pestanaActiva === "correos" ? "btn-aprobar" : ""}
                    onClick={() => setPestanaActiva("correos")}
                >
                    📧 Correos
                </button>
            </div>

            <div className="grid">
                <div className="card resumen">
                    <h3>Estado del Sistema</h3>
                    <p
                        className={
                            estadoSistema >= 90
                                ? "estado-ok"
                                : estadoSistema >= 70
                                    ? "estado-alerta"
                                    : "estado-error"
                        }
                    >
                        {estadoSistema}%
                    </p>
                </div>

                <div className="card resumen">
                    <h3>Total Solicitudes</h3>
                    <p className="numero">{citas.length}</p>
                </div>

                <div className="card resumen">
                    <h3>Solicitudes Pendientes</h3>
                    <p className="numero">{solicitudesPendientes.length}</p>
                </div>

                <div className="card resumen">
                    <h3>Solicitudes Procesadas</h3>
                    <p className="numero">{solicitudesProcesadas.length}</p>
                </div>

                <div className="card resumen">
                    <h3>Prioridad Alta/Urgente</h3>
                    <p className="numero alerta">{solicitudesCriticas.length}</p>
                </div>
            </div>

            {mensaje && <p className="mensaje">{mensaje}</p>}

            {pestanaActiva === "solicitudes" && (
                <>
                    <div className="card">
                        <h3>🔎 Buscar solicitud por RUT</h3>

                        <form onSubmit={buscarPorRut}>
                            <input
                                placeholder="Ingrese RUT del paciente"
                                value={rutBusqueda}
                                onChange={(e) => setRutBusqueda(e.target.value)}
                            />

                            <button type="submit">Buscar</button>

                            <button
                                type="button"
                                onClick={async () => {
                                    setRutBusqueda("");
                                    await cargarCitas();
                                    setMensaje("");
                                }}
                            >
                                Ver todas
                            </button>
                        </form>
                    </div>

                    <div className="card">
                        <h3>📋 Administración de Solicitudes de Atención</h3>

                        <button
                            type="button"
                            onClick={async () => {
                                await cargarCitas();
                                setMensaje("");
                            }}
                        >
                            Actualizar solicitudes
                        </button>

                        {solicitudesPendientes.length === 0 ? (
                            <p>No existen solicitudes pendientes.</p>
                        ) : (
                            <div className="tabla-scroll">
                                <table className="tabla-admin">
                                    <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Paciente</th>
                                        <th>RUT</th>
                                        <th>Profesional</th>
                                        <th>Profesión</th>
                                        <th>Tipo</th>
                                        <th>Prioridad</th>
                                        <th>Estado</th>
                                        <th>Fecha</th>
                                        <th>Hora</th>
                                        <th>Acciones</th>
                                    </tr>
                                    </thead>

                                    <tbody>
                                    {solicitudesPendientes.map((cita) => {
                                        const estaEditando = editandoId === cita.id;

                                        return (
                                            <tr key={cita.id}>
                                                <td>{cita.id}</td>
                                                <td>{cita.paciente}</td>
                                                <td>{cita.rut}</td>
                                                <td>{cita.doctorNombre}</td>
                                                <td>{cita.profesion || "No registrada"}</td>

                                                <td>
                                                    {estaEditando ? (
                                                        <select
                                                            value={cita.tipo || "CONSULTA_MEDICA"}
                                                            onChange={(e) =>
                                                                actualizarCampo(cita.id, "tipo", e.target.value)
                                                            }
                                                        >
                                                            <option value="CONSULTA_MEDICA">
                                                                Consulta médica
                                                            </option>
                                                            <option value="CIRUGIA">Cirugía</option>
                                                        </select>
                                                    ) : (
                                                        formatearTexto(cita.tipo)
                                                    )}
                                                </td>

                                                <td>
                                                    {estaEditando ? (
                                                        <select
                                                            value={cita.prioridad || "MEDIA"}
                                                            onChange={(e) =>
                                                                actualizarCampo(cita.id, "prioridad", e.target.value)
                                                            }
                                                        >
                                                            <option value="BAJA">Baja</option>
                                                            <option value="MEDIA">Media</option>
                                                            <option value="ALTA">Alta</option>
                                                            <option value="URGENTE">Urgente</option>
                                                        </select>
                                                    ) : (
                                                        formatearTexto(cita.prioridad)
                                                    )}
                                                </td>

                                                <td>
                                                    {estaEditando ? (
                                                        <strong>Reagendada</strong>
                                                    ) : (
                                                        formatearTexto(cita.estado)
                                                    )}
                                                </td>

                                                <td>
                                                    {estaEditando ? (
                                                        <input
                                                            type="date"
                                                            value={cita.fecha || ""}
                                                            onChange={(e) =>
                                                                actualizarCampo(cita.id, "fecha", e.target.value)
                                                            }
                                                        />
                                                    ) : (
                                                        cita.fecha
                                                    )}
                                                </td>

                                                <td>
                                                    {estaEditando ? (
                                                        <input
                                                            type="time"
                                                            value={mostrarHora(cita.hora)}
                                                            onChange={(e) =>
                                                                actualizarCampo(
                                                                    cita.id,
                                                                    "hora",
                                                                    `${e.target.value}:00`
                                                                )
                                                            }
                                                        />
                                                    ) : (
                                                        mostrarHora(cita.hora)
                                                    )}
                                                </td>

                                                <td>
                                                    <div className="acciones-admin">
                                                        {estaEditando ? (
                                                            <>
                                                                <button
                                                                    type="button"
                                                                    disabled={guardandoId === cita.id}
                                                                    onClick={() =>
                                                                        guardarCambios(
                                                                            cita,
                                                                            "REAGENDADA",
                                                                            "✅ Solicitud reagendada correctamente"
                                                                        )
                                                                    }
                                                                >
                                                                    {guardandoId === cita.id
                                                                        ? "Guardando..."
                                                                        : "Guardar reagendamiento"}
                                                                </button>

                                                                <button
                                                                    type="button"
                                                                    onClick={async () => {
                                                                        setEditandoId(null);
                                                                        await recargarVistaActual();
                                                                        setMensaje("");
                                                                    }}
                                                                >
                                                                    Cancelar
                                                                </button>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <button
                                                                    type="button"
                                                                    className="btn-aprobar"
                                                                    disabled={guardandoId === cita.id}
                                                                    onClick={() =>
                                                                        guardarCambios(
                                                                            cita,
                                                                            "ACEPTADA",
                                                                            "✅ Solicitud aceptada correctamente"
                                                                        )
                                                                    }
                                                                >
                                                                    Aceptar
                                                                </button>

                                                                <button
                                                                    type="button"
                                                                    className="btn-rechazar"
                                                                    disabled={guardandoId === cita.id}
                                                                    onClick={() =>
                                                                        guardarCambios(
                                                                            cita,
                                                                            "RECHAZADA",
                                                                            "✅ Solicitud rechazada correctamente"
                                                                        )
                                                                    }
                                                                >
                                                                    Rechazar
                                                                </button>

                                                                <button
                                                                    type="button"
                                                                    className="btn-reasignar"
                                                                    onClick={() => {
                                                                        setEditandoId(cita.id);
                                                                        setMensaje(
                                                                            "✏️ Modo reagendar activado. Modifica fecha u hora y presiona Guardar reagendamiento."
                                                                        );
                                                                    }}
                                                                >
                                                                    Reagendar
                                                                </button>
                                                            </>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </>
            )}

            {pestanaActiva === "correos" && (
                <div className="card">
                    <h3>📧 Envío de Correos</h3>

                    {solicitudesProcesadas.length === 0 ? (
                        <p>No existen solicitudes procesadas.</p>
                    ) : (
                        <div className="tabla-scroll">
                            <table className="tabla-admin">
                                <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Paciente</th>
                                    <th>RUT</th>
                                    <th>Teléfono</th>
                                    <th>Correo</th>
                                    <th>Profesional</th>
                                    <th>Profesión</th>
                                    <th>Tipo</th>
                                    <th>Prioridad</th>
                                    <th>Estado</th>
                                    <th>Fecha</th>
                                    <th>Hora</th>
                                    <th>Correo</th>
                                </tr>
                                </thead>

                                <tbody>
                                {solicitudesProcesadas.map((cita) => (
                                    <tr key={cita.id}>
                                        <td>{cita.id}</td>
                                        <td>{cita.paciente}</td>
                                        <td>{cita.rut}</td>
                                        <td>{cita.telefono || "No registrado"}</td>
                                        <td>{cita.correo || "No registrado"}</td>
                                        <td>{cita.doctorNombre}</td>
                                        <td>{cita.profesion || "No registrada"}</td>
                                        <td>{formatearTexto(cita.tipo)}</td>
                                        <td>{formatearTexto(cita.prioridad)}</td>
                                        <td>{formatearTexto(cita.estado)}</td>
                                        <td>{cita.fecha}</td>
                                        <td>{mostrarHora(cita.hora)}</td>
                                        <td>
                                            <button
                                                type="button"
                                                className={
                                                    correosEnviados.includes(cita.id)
                                                        ? "btn-correo-enviado"
                                                        : "btn-correo"
                                                }
                                                disabled={
                                                    enviandoCorreoId === cita.id ||
                                                    correosEnviados.includes(cita.id)
                                                }
                                                onClick={() => enviarCorreo(cita)}
                                            >
                                                {enviandoCorreoId === cita.id
                                                    ? "Enviando..."
                                                    : correosEnviados.includes(cita.id)
                                                        ? "Correo enviado"
                                                        : "Enviar correo"}
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            )}
        </>
    );
}

VistaAdmin.propTypes = {
    dashboard: PropTypes.shape({
        estadoSistema: PropTypes.number
    })
};

export default VistaAdmin;