function TablaPacientes({ pacientes }) {
    return (
        <table>
            <thead>
            <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Rut</th>
            </tr>
            </thead>

            <tbody>
            {pacientes.map((p) => (
                <tr key={p.id}>
                    <td>{p.id}</td>
                    <td>{p.nombre}</td>
                    <td>{p.rut}</td>
                </tr>
            ))}
            </tbody>
        </table>
    );
}

export default TablaPacientes;