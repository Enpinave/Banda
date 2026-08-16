import {
  Archive,
  CheckCircle,
  Clock,
  LogOut,
  Shield,
  UserCircle,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";

function EstudianteDashboard() {
  const { user, logout } = useAuth();

  return (
    <div className="dashboard">

      <aside className="sidebar">

        <div className="sidebar-header">

          <div className="sidebar-logo">
            <Shield size={28} />
          </div>

          <div>
            <h2>BandaControl</h2>
            <span>Estudiante</span>
          </div>

        </div>

        <nav className="sidebar-menu">

          <p className="menu-title">
            MI CUENTA
          </p>

          <button className="menu-item active">
            <Archive size={20} />
            <span>Inicio</span>
          </button>

          <button className="menu-item">
            <Archive size={20} />
            <span>Instrumentos</span>
          </button>

          <button className="menu-item">
            <Clock size={20} />
            <span>Mis préstamos</span>
          </button>

        </nav>

        <div className="sidebar-bottom">

          <div className="sidebar-user">

            <UserCircle size={38} />

            <div>
              <strong>{user?.nombre}</strong>
              <span>Estudiante</span>
            </div>

          </div>

          <button
            className="logout-button"
            onClick={logout}
          >
            <LogOut size={19} />
            Cerrar sesión
          </button>

        </div>

      </aside>

      <main className="dashboard-main">

        <header className="dashboard-header">

          <div>
            <h1>Mi espacio</h1>
            <p>
              Consulta tus instrumentos y préstamos
            </p>
          </div>

          <div className="header-user">

            <div className="header-user-info">
              <strong>{user?.nombre}</strong>
              <span>Estudiante</span>
            </div>

            <UserCircle size={42} />

          </div>

        </header>

        <section className="dashboard-content">

          <div className="welcome-card">

            <div>
              <span className="welcome-label">
                BANDA DE MARCHAS
              </span>

              <h2>
                ¡Hola, {user?.nombre}! 👋
              </h2>

              <p>
                Aquí puedes consultar los instrumentos
                disponibles y revisar tus préstamos.
              </p>
            </div>

            <div className="welcome-icon">
              <Shield size={70} />
            </div>

          </div>

          <div className="stats-grid">

            <div className="stat-card stat-blue">

              <div className="stat-icon">
                <Archive size={25} />
              </div>

              <div>
                <span>Instrumentos disponibles</span>
                <strong>31</strong>
              </div>

            </div>

            <div className="stat-card stat-red">

              <div className="stat-icon">
                <Clock size={25} />
              </div>

              <div>
                <span>Mis préstamos</span>
                <strong>1</strong>
              </div>

            </div>

            <div className="stat-card stat-green">

              <div className="stat-icon">
                <CheckCircle size={25} />
              </div>

              <div>
                <span>Préstamos activos</span>
                <strong>1</strong>
              </div>

            </div>

          </div>

          <section className="dashboard-panel">

            <div className="panel-header">

              <div>
                <h3>Mi instrumento actual</h3>
                <p>Instrumento asignado actualmente</p>
              </div>

            </div>

            <div className="current-instrument">

              <div className="current-instrument-icon">
                🎺
              </div>

              <div>
                <strong>Trompeta Yamaha</strong>
                <span>
                  Código: TR-001
                </span>
                <span>
                  Estado: En préstamo
                </span>
              </div>

              <div className="status loaned">
                En préstamo
              </div>

            </div>

          </section>

        </section>

      </main>

    </div>
  );
}

export default EstudianteDashboard;