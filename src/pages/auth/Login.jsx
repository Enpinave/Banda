import { useState } from "react";
import { Eye, EyeOff, LogIn } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import escudo from "../../assets/escudo.png";

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [usuario, setUsuario] = useState("");
  const [password, setPassword] = useState("");
  const [mostrarPassword, setMostrarPassword] = useState(false);
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (!usuario.trim() || !password.trim()) {
      setError("Por favor completa todos los campos.");
      return;
    }

    setCargando(true);

    await new Promise((resolve) => setTimeout(resolve, 500));

    const resultado = login(usuario.trim(), password);

    if (!resultado.success) {
      setError(resultado.message);
      setCargando(false);
      return;
    }

    if (resultado.user.rol === "admin") {
      navigate("/admin");
    } else {
      navigate("/estudiante");
    }

    setCargando(false);
  };

  return (
    <main className="login-page">
      <div className="login-background">
        <div className="login-decoration login-decoration-red"></div>
        <div className="login-decoration login-decoration-blue"></div>
      </div>

      <section className="login-container">
        <div className="login-card">

          {/* ESCUDO Y NOMBRE DEL SISTEMA */}
          <div className="login-brand">

            <div className="shield-container">
              <img
                src={escudo}
                alt="Escudo del colegio"
                className="school-shield"
              />
            </div>

            <div>
              <h1>BandaControl</h1>
              <p>Inventario de la Banda de Marchas</p>
            </div>

          </div>

          {/* ENCABEZADO */}
          <div className="login-header">
            <h2>Bienvenido</h2>

            <p>
              Ingresa tus credenciales para acceder al sistema.
            </p>
          </div>

          {/* FORMULARIO */}
          <form onSubmit={handleSubmit} className="login-form">

            <div className="form-group">
              <label htmlFor="usuario">
                Usuario
              </label>

              <input
                id="usuario"
                type="text"
                placeholder="Ingresa tu usuario"
                value={usuario}
                onChange={(e) => setUsuario(e.target.value)}
                autoComplete="username"
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">
                Contraseña
              </label>

              <div className="password-wrapper">

                <input
                  id="password"
                  type={mostrarPassword ? "text" : "password"}
                  placeholder="Ingresa tu contraseña"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                />

                <button
                  type="button"
                  className="password-toggle"
                  onClick={() =>
                    setMostrarPassword(!mostrarPassword)
                  }
                  aria-label={
                    mostrarPassword
                      ? "Ocultar contraseña"
                      : "Mostrar contraseña"
                  }
                >
                  {mostrarPassword ? (
                    <EyeOff size={20} />
                  ) : (
                    <Eye size={20} />
                  )}
                </button>

              </div>
            </div>

            {/* ERROR */}
            {error && (
              <div className="login-error">
                {error}
              </div>
            )}

            {/* BOTÓN */}
            <button
              type="submit"
              className="login-button"
              disabled={cargando}
            >
              {cargando ? (
                "Ingresando..."
              ) : (
                <>
                  <LogIn size={20} />
                  Iniciar sesión
                </>
              )}
            </button>

          </form>

          {/* USUARIOS DE PRUEBA */}
          <div className="login-demo">

            <p>Usuarios de prueba</p>

            <div className="demo-user">
              <strong>Administrador:</strong>
              <span>admin / admin123</span>
            </div>

            <div className="demo-user">
              <strong>Estudiante:</strong>
              <span>estudiante / estudiante123</span>
            </div>

          </div>

          {/* PIE */}
          <footer className="login-footer">
            <span>© 2026</span>
            <span>•</span>
            <span>Sistema de Inventario</span>
          </footer>

        </div>
      </section>
    </main>
  );
}

export default Login;