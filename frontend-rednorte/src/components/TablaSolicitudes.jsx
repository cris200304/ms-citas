function TablaSolicitudes({ solicitudes }) {
    return (
        <table>
            <thead>
            <tr>
                <th>ID</th>
                <th>Tipo</th>
                <th>Prioridad</th>
                <th>Estado</th>
            </tr>
            </thead>

            <tbody>
            {solicitudes.map((s) => (
                <tr key={s.id}>
                    <td>{s.id}</td>
                    <td>{s.tipo}</td>
                    <td>{s.prioridad}</td>
                    <td>{s.estado}</td>
                </tr>
            ))}
            </tbody>
        </table>
    );
}

export default TablaSolicitudes;