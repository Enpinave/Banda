import "../../styles/dashboard.css";
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

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";

import {
  obtenerEstadisticas,
  obtenerInstrumentos,
} from "../../services/instrumentosService";


// ============================================================
// BANDA CONTROL
// DASHBOARD ADMINISTRADOR
// ============================================================

function AdminDashboard() {

  const { user, logout } = useAuth();

  const navigate = useNavigate();


  // ==========================================================
  // ESTADOS
  // ==========================================================

  const [menuAbierto, setMenuAbierto] = useState(false);

  const [instrumentos, setInstrumentos] = useState([]);

  const [estadisticas, setEstadisticas] = useState({
    total: 0,
    disponibles: 0,
    prestados: 0,
    mantenimiento: 0,
    baja: 0,
  });

  const [cargando, setCargando] = useState(true);

  const [error, setError] = useState("");


  // ==========================================================
  // CARGAR DATOS DESDE LA API
  // ==========================================================

  const cargarDatos = async () => {

    try {

      setCargando(true);
      setError("");

      // Obtener instrumentos desde MySQL
      const datos = await obtenerInstrumentos();

      // Obtener estadísticas
      const estadisticasActuales =
        await obtenerEstadisticas();

      // Garantizar que siempre trabajamos con arrays
      setInstrumentos(
        Array.isArray(datos)
          ? datos
          : []
      );

      setEstadisticas({
        total:
          Number(
            estadisticasActuales?.total || 0
          ),

        disponibles:
          Number(
            estadisticasActuales?.disponibles || 0
          ),

        prestados:
          Number(
            estadisticasActuales?.prestados || 0
          ),

        mantenimiento:
          Number(
            estadisticasActuales?.mantenimiento || 0
          ),

        baja:
          Number(
            estadisticasActuales?.baja || 0
          ),
      });

    } catch (error) {

      console.error(
        "Error cargando dashboard:",
        error
      );

      setInstrumentos([]);

      setEstadisticas({
        total: 0,
        disponibles: 0,
        prestados: 0,
        mantenimiento: 0,
        baja: 0,
      });

      setError(
        error.message ||
        "No fue posible cargar la información del dashboard."
      );

    } finally {

      setCargando(false);

    }
  };


  // ==========================================================
  // CARGA INICIAL
  // ==========================================================

  useEffect(() => {

    cargarDatos();

  }, []);


  // ==========================================================
  // ESCUCHAR CAMBIOS DEL INVENTARIO
  // ==========================================================

  useEffect(() => {

    const actualizarDashboard = () => {

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


  // ==========================================================
  // CERRAR SESIÓN
  // ==========================================================

  const cerrarSesion = () => {

    logout();

  };


  // ==========================================================
  // ÚLTIMOS INSTRUMENTOS
  // ==========================================================

  const instrumentosRecientes =
    Array.isArray(instrumentos)
      ? instrumentos.slice(0, 5)
      : [];


  // ==========================================================
  // CLASE PARA ESTADO
  // ==========================================================

  const claseEstado = (estado) => {

    switch (estado) {

      case "Disponible":
        return "available";

      case "Prestado":
        return "loaned";

      case "Mantenimiento":
        return "maintenance";

      case "Baja":
        return "retired";

      default:
        return "";

    }
  };


  // ==========================================================
  // ICONO DEL INSTRUMENTO
  // ==========================================================

  const iconoInstrumento = (tipo) => {

    const texto =
      String(tipo || "")
        .toLowerCase();


    if (
      texto.includes("percusión") ||
      texto.includes("percusion")
    ) {
      return "🥁";
    }


    if (
      texto.includes("madera")
    ) {
      return "🎷";
    }


    if (
      texto.includes("cuerda")
    ) {
      return "🎻";
    }


    return "🎺";
  };


  // ==========================================================
  // NOMBRE DEL USUARIO
  // ==========================================================

  const nombreUsuario =
    user?.nombre ||
    user?.name ||
    user?.usuario ||
    "Administrador";


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

        {/* HEADER */}

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

        </div>


        {/* CERRAR MENÚ MÓVIL */}

        <button
          className="sidebar-close"
          onClick={() =>
            setMenuAbierto(false)
          }
          type="button"
          aria-label="Cerrar menú"
        >
          <X size={22} />
        </button>


        {/* NAVEGACIÓN */}

        <nav className="sidebar-nav">

          <button
            type="button"
            className="sidebar-link active"
            onClick={() => {

              navigate("/admin");

              setMenuAbierto(false);

            }}
          >

            <Archive size={20} />

            <span>
              Dashboard
            </span>

          </button>


          <button
            type="button"
            className="sidebar-link"
            onClick={() => {

              navigate("/admin/inventario");

              setMenuAbierto(false);

            }}
          >

            <ToolCase size={20} />

            <span>
              Inventario
            </span>

          </button>


          <button
            type="button"
            className="sidebar-link"
            onClick={() => {

              navigate("/admin/prestamos");

              setMenuAbierto(false);

            }}
          >

            <Clock size={20} />

            <span>
              Préstamos
            </span>

          </button>


          <button
            type="button"
            className="sidebar-link"
            onClick={() => {

              navigate("/admin/usuarios");

              setMenuAbierto(false);

            }}
          >

            <Users size={20} />

            <span>
              Usuarios
            </span>

          </button>


          <button
            type="button"
            className="sidebar-link"
            onClick={() => {

              navigate("/admin/configuracion");

              setMenuAbierto(false);

            }}
          >

            <Settings size={20} />

            <span>
              Configuración
            </span>

          </button>

        </nav>


        {/* USUARIO */}

        <div className="sidebar-user">

          <div className="sidebar-user-icon">

            <UserCircle size={34} />

          </div>

          <div className="sidebar-user-info">

            <strong>
              {nombreUsuario}
            </strong>

            <span>
              Administrador
            </span>

          </div>

          <button
            type="button"
            className="logout-button"
            onClick={cerrarSesion}
            title="Cerrar sesión"
          >

            <LogOut size={19} />

          </button>

        </div>

      </aside>


      {/* ======================================================
          CONTENIDO PRINCIPAL
      ====================================================== */}

      <main className="dashboard-main">


        {/* ====================================================
            HEADER
        ===================================================== */}

        <header className="dashboard-header">

          <div className="dashboard-header-left">

            <button
              type="button"
              className="menu-button"
              onClick={() =>
                setMenuAbierto(true)
              }
              aria-label="Abrir menú"
            >

              <Menu size={24} />

            </button>


            <div>

              <h1>
                Dashboard
              </h1>

              <p>
                Bienvenido al panel de administración de BandaControl.
              </p>

            </div>

          </div>


          <div className="dashboard-header-user">

            <UserCircle size={35} />

            <div>

              <strong>
                {nombreUsuario}
              </strong>

              <span>
                Administrador
              </span>

            </div>

          </div>

        </header>


        {/* ====================================================
            CONTENIDO
        ===================================================== */}

        <div className="dashboard-content">


          {/* ERROR */}

          {error && (

            <div className="dashboard-error">

              <strong>
                No se pudieron cargar los datos
              </strong>

              <span>
                {error}
              </span>

              <button
                type="button"
                onClick={cargarDatos}
              >
                Intentar nuevamente
              </button>

            </div>

          )}


          {/* ==================================================
              TARJETAS DE ESTADÍSTICAS
          =================================================== */}

          <section className="dashboard-stats">


            {/* TOTAL */}

            <div className="dashboard-stat-card">

              <div className="dashboard-stat-icon blue">

                <Archive size={24} />

              </div>

              <div>

                <span>
                  Total instrumentos
                </span>

                <strong>
                  {cargando
                    ? "..."
                    : estadisticas.total}
                </strong>

              </div>

            </div>


            {/* DISPONIBLES */}

            <div className="dashboard-stat-card">

              <div className="dashboard-stat-icon green">

                <CheckCircle size={24} />

              </div>

              <div>

                <span>
                  Disponibles
                </span>

                <strong>
                  {cargando
                    ? "..."
                    : estadisticas.disponibles}
                </strong>

              </div>

            </div>


            {/* PRESTADOS */}

            <div className="dashboard-stat-card">

              <div className="dashboard-stat-icon red">

                <Clock size={24} />

              </div>

              <div>

                <span>
                  Prestados
                </span>

                <strong>
                  {cargando
                    ? "..."
                    : estadisticas.prestados}
                </strong>

              </div>

            </div>


            {/* MANTENIMIENTO */}

            <div className="dashboard-stat-card">

              <div className="dashboard-stat-icon orange">

                <ToolCase size={24} />

              </div>

              <div>

                <span>
                  Mantenimiento
                </span>

                <strong>
                  {cargando
                    ? "..."
                    : estadisticas.mantenimiento}
                </strong>

              </div>

            </div>

          </section>


          {/* ==================================================
              ACCIONES RÁPIDAS
          =================================================== */}

          <section className="dashboard-quick-actions">

            <div className="dashboard-section-header">

              <div>

                <h2>
                  Acciones rápidas
                </h2>

                <p>
                  Accede rápidamente a las funciones principales.
                </p>

              </div>

            </div>


            <div className="quick-actions-grid">


              <button
                type="button"
                className="quick-action-card"
                onClick={() =>
                  navigate("/admin/inventario")
                }
              >

                <div className="quick-action-icon blue">

                  <Archive size={25} />

                </div>

                <div>

                  <strong>
                    Gestionar inventario
                  </strong>

                  <span>
                    Ver, agregar, editar y eliminar instrumentos.
                  </span>

                </div>

              </button>


              <button
                type="button"
                className="quick-action-card"
                onClick={() =>
                  navigate("/admin/prestamos")
                }
              >

                <div className="quick-action-icon orange">

                  <Clock size={25} />

                </div>

                <div>

                  <strong>
                    Gestionar préstamos
                  </strong>

                  <span>
                    Administrar préstamos y devoluciones.
                  </span>

                </div>

              </button>


              <button
                type="button"
                className="quick-action-card"
                onClick={() =>
                  navigate("/admin/usuarios")
                }
              >

                <div className="quick-action-icon green">

                  <Users size={25} />

                </div>

                <div>

                  <strong>
                    Gestionar usuarios
                  </strong>

                  <span>
                    Administrar los usuarios del sistema.
                  </span>

                </div>

              </button>

            </div>

          </section>


          {/* ==================================================
              ÚLTIMOS INSTRUMENTOS
          =================================================== */}

          <section className="dashboard-panel">


            <div className="dashboard-section-header">

              <div>

                <h2>
                  Instrumentos recientes
                </h2>

                <p>
                  Últimos instrumentos registrados en el inventario.
                </p>

              </div>


              <button
                type="button"
                className="dashboard-view-all"
                onClick={() =>
                  navigate("/admin/inventario")
                }
              >
                Ver inventario
              </button>

            </div>


            <div className="dashboard-table-container">

              <table className="dashboard-table">

                <thead>

                  <tr>

                    <th>
                      Código
                    </th>

                    <th>
                      Instrumento
                    </th>

                    <th>
                      Tipo
                    </th>

                    <th>
                      Marca
                    </th>

                    <th>
                      Estado
                    </th>

                    <th>
                      Ubicación
                    </th>

                  </tr>

                </thead>


                <tbody>

                  {cargando ? (

                    <tr>

                      <td
                        colSpan="6"
                        className="dashboard-empty"
                      >

                        Cargando instrumentos...

                      </td>

                    </tr>

                  ) : instrumentosRecientes.length === 0 ? (

                    <tr>

                      <td
                        colSpan="6"
                        className="dashboard-empty"
                      >

                        <Archive size={35} />

                        <strong>
                          No hay instrumentos registrados
                        </strong>

                        <span>
                          Agrega el primer instrumento al inventario.
                        </span>

                        <button
                          type="button"
                          className="primary-button"
                          onClick={() =>
                            navigate("/admin/inventario")
                          }
                        >
                          Agregar instrumento
                        </button>

                      </td>

                    </tr>

                  ) : (

                    instrumentosRecientes.map(
                      (instrumento) => (

                        <tr
                          key={instrumento.id}
                        >

                          {/* CÓDIGO */}

                          <td>

                            <strong>
                              {instrumento.codigo}
                            </strong>

                          </td>


                          {/* INSTRUMENTO */}

                          <td>

                            <div className="dashboard-instrument">

                              <div className="dashboard-instrument-icon">

                                {iconoInstrumento(
                                  instrumento.tipo
                                )}

                              </div>

                              <div>

                                <strong>
                                  {instrumento.nombre || "—"}
                                </strong>

                              </div>

                            </div>

                          </td>


                          {/* TIPO */}

                          <td>

                            {instrumento.tipo || "—"}

                          </td>


                          {/* MARCA */}

                          <td>

                            {instrumento.marca || "—"}

                          </td>


                          {/* ESTADO */}

                          <td>

                            <span
                              className={`status ${claseEstado(
                                instrumento.estado
                              )}`}
                            >

                              {instrumento.estado || "—"}

                            </span>

                          </td>


                          {/* UBICACIÓN */}

                          <td>

                            {instrumento.ubicacion || "—"}

                          </td>

                        </tr>

                      )
                    )

                  )}

                </tbody>

              </table>

            </div>

          </section>


          {/* ==================================================
              RESUMEN
          =================================================== */}

          <section className="dashboard-summary">

            <div className="dashboard-summary-card">

              <div className="dashboard-summary-icon green">

                <CheckCircle size={23} />

              </div>

              <div>

                <span>
                  Disponibles
                </span>

                <strong>
                  {estadisticas.disponibles}
                </strong>

              </div>

            </div>


            <div className="dashboard-summary-card">

              <div className="dashboard-summary-icon red">

                <Clock size={23} />

              </div>

              <div>

                <span>
                  En préstamo
                </span>

                <strong>
                  {estadisticas.prestados}
                </strong>

              </div>

            </div>


            <div className="dashboard-summary-card">

              <div className="dashboard-summary-icon orange">

                <ToolCase size={23} />

              </div>

              <div>

                <span>
                  En mantenimiento
                </span>

                <strong>
                  {estadisticas.mantenimiento}
                </strong>

              </div>

            </div>


            <div className="dashboard-summary-card">

              <div className="dashboard-summary-icon gray">

                <Archive size={23} />

              </div>

              <div>

                <span>
                  Dados de baja
                </span>

                <strong>
                  {estadisticas.baja}
                </strong>

              </div>

            </div>

          </section>

        </div>

      </main>


      {/* ======================================================
          OVERLAY MÓVIL
      ====================================================== */}

      {menuAbierto && (

        <div
          className="sidebar-overlay"
          onClick={() =>
            setMenuAbierto(false)
          }
        />

      )}

    </div>

  );
}


// ============================================================
// EXPORTACIÓN
// ============================================================

export default AdminDashboard;