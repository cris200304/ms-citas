import "../Login.css";

function Login({ setVista }) {
    return (
        <div className="login-page">
            <div className="login-card">

                <div className="logo">
                    🏥
                </div>

                <h1>Red Norte Salud</h1>

                <p className="subtitulo">
                    Sistema inteligente de gestión de solicitudes médicas
                </p>

                <div className="botones-login">

                    <button
                        className="btn-paciente"
                        onClick={() => setVista("paciente")}
                    >
                        👤 Ingresar como Paciente
                    </button>

                    <button
                        className="btn-admin"
                        onClick={() => setVista("admin")}
                    >
                        👨‍💼 Ingresar como Administrador
                    </button>

                </div>

            </div>
        </div>
    );
}

export default Login;