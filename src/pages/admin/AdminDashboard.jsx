import {
  Archive,
  CheckCircle,
  Clock,
  LogOut,
  Menu,
  Settings,
  Shield,
  ToolCase,
  UserCircle,
  Users,
  X,
} from "lucide-react";

import {
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import { useAuth } from "../../context/AuthContext";

import {
  obtenerEstadisticas,
  obtenerInstrumentos,
} from "../../services/instrumentosService";


// ============================================================
// DASHBOARD ADMINISTRADOR
// ============================================================

function AdminDashboard() {

  const {
    user,
    logout,
  } = useAuth();

  const navigate =
    useNavigate();


  // ----------------------------------------------------------
  // ESTADOS
  // ----------------------------------------------------------

  const [
    menuAbierto,
    setMenuAbierto,
  ] = useState(false);


  const [
    instrumentos,
    setInstrumentos,
  ] = useState([]);


  const [
    estadisticas,
    setEstadisticas,
  ] = useState({
    total: 0,
    disponibles: 0,
    prestados: 0,
    mantenimiento: 0,
  });


  // ----------------------------------------------------------
  // CARGAR DATOS
  // ----------------------------------------------------------

  const cargarDatos = () => {

    const datos =
      obtenerInstrumentos();

    const estadisticasActuales =
      obtenerEstadisticas();

    setInstrumentos(datos);

    setEstadisticas(
      estadisticasActuales
    );
  };


  // ----------------------------------------------------------
  // AL ENTRAR AL DASHBOARD
  // ----------------------------------------------------------

  useEffect(() => {

    cargarDatos();

  }, []);


  // ----------------------------------------------------------
  // ESCUCHAR CAMBIOS DEL INVENTARIO
  // ----------------------------------------------------------

  useEffect(() => {

    const actualizarDashboard =
      () => {
        cargarDatos();
      };


    window.addEventListener(
      "instrumentosActualizados",
      actualizarDashboard
    );


    return () => {

      window.removeEventListener(
        "instrumentosActualizados",
        actualizarDashboard
      );

    };

  }, []);


  // ----------------------------------------------------------
  // CERRAR SESIÓN
  // ----------------------------------------------------------

  const cerrarSesion = () => {

    logout();

  };


  // ----------------------------------------------------------
  // ÚLTIMOS INSTRUMENTOS
  // ----------------------------------------------------------

  const instrumentosRecientes =
    [...instrumentos]
      .reverse()
      .slice(0, 5);


  // ----------------------------------------------------------
  // CLASE ESTADO
  // ----------------------------------------------------------

  const claseEstado = (estado) => {

    if (
      estado ===
      "Disponible"
    ) {
      return "available";
    }

    if (
      estado ===
      "Prestado"
    ) {
      return "loaned";
    }

    if (
      estado ===
      "Mantenimiento"
    ) {
      return "maintenance";
    }

    return "";
  };


  // ==========================================================
  // RENDER
  // ==========================================================

  return (

    <div className="dashboard">


      {/* ======================================================
          SIDEBAR
      ====================================================== */}

      <aside
        className={`sidebar ${
          menuAbierto
            ? "sidebar-open"
            : ""
        }`}
      >


        {/* HEADER SIDEBAR */}

        <div className="sidebar-header">

          <div className="sidebar-logo">

            <Shield size={28} />

          </div>


          <div>

            <h2>
              BandaControl
            </h2>

            <span>
              Administración
            </span>

          </div>


          <button
            className="close-menu"
            onClick={() =>
              setMenuAbierto(false)
            }
          >

            <X size={22} />

          </button>

        </div>


        {/* MENÚ */}

        <nav className="sidebar-menu">


          <p className="menu-title">
            PRINCIPAL
          </p>


          {/* DASHBOARD */}

          <button
            className="menu-item active"
            onClick={() =>
              navigate("/admin")
            }
          >

            <Archive size={20} />

            <span>
              Dashboard
            </span>

          </button>


          {/* INVENTARIO */}

          <button
            className="menu-item"
            onClick={() =>
              navigate(
                "/admin/inventario"
              )
            }
          >

            <Archive size={20} />

            <span>
              Inventario
            </span>

          </button>


          {/* PRÉSTAMOS */}

          <button
            className="menu-item"
            onClick={() =>
              alert(
                "Módulo de préstamos próximamente."
              )
            }
          >

            <Clock size={20} />

            <span>
              Préstamos
            </span>

          </button>


          {/* MANTENIMIENTO */}

          <button
            className="menu-item"
            onClick={() =>
              alert(
                "Módulo de mantenimiento próximamente."
              )
            }
          >

            <ToolCase size={20} />

            <span>
              Mantenimiento
            </span>

          </button>


          <p className="menu-title">
            ADMINISTRACIÓN
          </p>


          {/* USUARIOS */}

          <button
            className="menu-item"
            onClick={() =>
              alert(
                "Módulo de usuarios próximamente."
              )
            }
          >

            <Users size={20} />

            <span>
              Usuarios
            </span>

          </button>


          {/* CONFIGURACIÓN */}

          <button
            className="menu-item"
            onClick={() =>
              alert(
                "Configuración próximamente."
              )
            }
          >

            <Settings size={20} />

            <span>
              Configuración
            </span>

          </button>

        </nav>


        {/* USUARIO */}

        <div className="sidebar-bottom">


          <div className="sidebar-user">

            <UserCircle size={38} />

            <div>

              <strong>
                {user?.nombre ||
                  "Administrador"}
              </strong>

              <span>
                Administrador
              </span>

            </div>

          </div>


          <button
            className="logout-button"
            onClick={
              cerrarSesion
            }
          >

            <LogOut size={19} />

            Cerrar sesión

          </button>

        </div>

      </aside>


      {/* ======================================================
          CONTENIDO
      ====================================================== */}

      <main className="dashboard-main">


        {/* HEADER */}

        <header className="dashboard-header">


          <button
            className="mobile-menu"
            onClick={() =>
              setMenuAbierto(true)
            }
          >

            <Menu size={25} />

          </button>


          <div>

            <h1>
              Dashboard
            </h1>

            <p>
              Resumen general de la
              banda de marchas
            </p>

          </div>


          <div className="header-user">

            <div className="header-user-info">

              <strong>
                {user?.nombre ||
                  "Administrador"}
              </strong>

              <span>
                Administrador
              </span>

            </div>

            <UserCircle
              size={42}
            />

          </div>

        </header>


        {/* ====================================================
            CONTENIDO DASHBOARD
        ==================================================== */}

        <section className="dashboard-content">


          {/* BIENVENIDA */}

          <div className="welcome-card">

            <div>

              <span className="welcome-label">
                PANEL DE ADMINISTRACIÓN
              </span>

              <h2>

                ¡Bienvenido,{" "}

                {user?.nombre ||
                  "Administrador"}

                ! 👋

              </h2>

              <p>

                Desde aquí puedes
                controlar el inventario
                y los instrumentos
                de la banda.

              </p>

            </div>


            <div className="welcome-icon">

              <Shield size={70} />

            </div>

          </div>


          {/* ==================================================
              ESTADÍSTICAS
          ================================================== */}

          <div className="stats-grid">


            {/* TOTAL */}

            <div className="stat-card stat-blue">

              <div className="stat-icon">

                <Archive
                  size={25}
                />

              </div>

              <div>

                <span>
                  Total instrumentos
                </span>

                <strong>
                  {estadisticas.total}
                </strong>

              </div>

            </div>


            {/* DISPONIBLES */}

            <div className="stat-card stat-green">

              <div className="stat-icon">

                <CheckCircle
                  size={25}
                />

              </div>

              <div>

                <span>
                  Disponibles
                </span>

                <strong>
                  {
                    estadisticas.disponibles
                  }
                </strong>

              </div>

            </div>


            {/* PRESTADOS */}

            <div className="stat-card stat-red">

              <div className="stat-icon">

                <Clock
                  size={25}
                />

              </div>

              <div>

                <span>
                  Prestados
                </span>

                <strong>
                  {
                    estadisticas.prestados
                  }
                </strong>

              </div>

            </div>


            {/* MANTENIMIENTO */}

            <div className="stat-card stat-orange">

              <div className="stat-icon">

                <ToolCase
                  size={25}
                />

              </div>

              <div>

                <span>
                  Mantenimiento
                </span>

                <strong>
                  {
                    estadisticas.mantenimiento
                  }
                </strong>

              </div>

            </div>

          </div>


          {/* ==================================================
              DOS COLUMNAS
          ================================================== */}

          <div className="dashboard-grid">


            {/* =================================================
                INVENTARIO RECIENTE
            ================================================= */}

            <section className="dashboard-panel">


              <div className="panel-header">

                <div>

                  <h3>
                    Inventario reciente
                  </h3>

                  <p>
                    Últimos instrumentos
                    registrados
                  </p>

                </div>


                <button
                  onClick={() =>
                    navigate(
                      "/admin/inventario"
                    )
                  }
                >
                  Ver todos
                </button>

              </div>


              <div className="instrument-list">


                {instrumentosRecientes.length ===
                0 ? (

                  <div
                    style={{
                      padding:
                        "30px",
                      textAlign:
                        "center",
                      color:
                        "#6b7280",
                    }}
                  >

                    <Archive
                      size={35}
                    />

                    <p>
                      Todavía no hay
                      instrumentos
                      registrados.
                    </p>

                    <button
                      onClick={() =>
                        navigate(
                          "/admin/inventario"
                        )
                      }
                    >
                      Registrar instrumento
                    </button>

                  </div>

                ) : (

                  instrumentosRecientes.map(
                    (instrumento) => (

                      <div
                        className="instrument-item"
                        key={
                          instrumento.id
                        }
                      >


                        <div className="instrument-avatar">

                          🎵

                        </div>


                        <div>

                          <strong>

                            {
                              instrumento.instrumento
                            }

                          </strong>

                          <span>

                            {
                              instrumento.codigo
                            }

                            {" • "}

                            {
                              instrumento.marca ||
                              "Sin marca"
                            }

                          </span>

                        </div>


                        <span
                          className={`status ${claseEstado(
                            instrumento.estado
                          )}`}
                        >

                          {
                            instrumento.estado
                          }

                        </span>

                      </div>

                    )
                  )

                )}

              </div>

            </section>


            {/* =================================================
                PRÉSTAMOS
            ================================================= */}

            <section className="dashboard-panel">


              <div className="panel-header">

                <div>

                  <h3>
                    Últimos préstamos
                  </h3>

                  <p>
                    Movimientos recientes
                  </p>

                </div>

                <button
                  onClick={() =>
                    alert(
                      "El módulo de préstamos se implementará próximamente."
                    )
                  }
                >
                  Ver todos
                </button>

              </div>


              <div className="loan-list">


                <div
                  className="loan-item"
                >

                  <div className="student-avatar">
                    --
                  </div>

                  <div>

                    <strong>
                      Sin préstamos
                    </strong>

                    <span>
                      El módulo de préstamos
                      aún no está configurado.
                    </span>

                  </div>

                  <small>
                    —
                  </small>

                </div>


              </div>

            </section>

          </div>

        </section>

      </main>

    </div>
  );
}

export default AdminDashboard;