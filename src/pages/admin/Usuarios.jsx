import "../../styles/usuarios.css";

import {
  ArrowLeft,
  Edit,
  Eye,
  EyeOff,
  Plus,
  Search,
  Trash2,
  User,
  Users,
  ShieldCheck,
  GraduationCap,
  CheckCircle,
  X,
} from "lucide-react";

import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  obtenerUsuarios,
  crearUsuario,
  actualizarUsuario,
  eliminarUsuario,
} from "../../services/usuariosService";


// ============================================================
// FORMULARIO INICIAL
// ============================================================

const usuarioInicial = {
  nombre: "",
  apellido: "",
  usuario: "",
  email: "",
  password: "",
  rol: "estudiante",
  estado: "activo",
};


// ============================================================
// COMPONENTE
// ============================================================

function Usuarios() {

  const navigate = useNavigate();


  // ==========================================================
  // ESTADOS
  // ==========================================================

  const [usuarios, setUsuarios] = useState([]);

  const [busqueda, setBusqueda] = useState("");

  const [filtroRol, setFiltroRol] =
    useState("Todos");

  const [filtroEstado, setFiltroEstado] =
    useState("Todos");

  const [modalAbierto, setModalAbierto] =
    useState(false);

  const [usuarioSeleccionado, setUsuarioSeleccionado] =
    useState(null);

  const [formulario, setFormulario] =
    useState({
      ...usuarioInicial,
    });

  const [mostrarPassword, setMostrarPassword] =
    useState(false);

  const [cargando, setCargando] =
    useState(false);

  const [guardando, setGuardando] =
    useState(false);


  // ==========================================================
  // CARGAR USUARIOS
  // ==========================================================

  const cargarUsuarios = async () => {

    try {

      setCargando(true);

      const datos =
        await obtenerUsuarios();

      setUsuarios(
        Array.isArray(datos)
          ? datos
          : []
      );

    } catch (error) {

      console.error(
        "Error al cargar usuarios:",
        error
      );

      setUsuarios([]);

      alert(
        error.message ||
        "No se pudieron cargar los usuarios."
      );

    } finally {

      setCargando(false);

    }
  };


  // ==========================================================
  // CARGA INICIAL
  // ==========================================================

  useEffect(() => {

    cargarUsuarios();

  }, []);


  // ==========================================================
  // ABRIR NUEVO USUARIO
  // ==========================================================

  const abrirNuevoUsuario = () => {

    setUsuarioSeleccionado(null);

    setFormulario({
      ...usuarioInicial,
    });

    setMostrarPassword(false);

    setModalAbierto(true);
  };


  // ==========================================================
  // ABRIR EDITAR
  // ==========================================================

  const abrirEditarUsuario = (usuario) => {

    setUsuarioSeleccionado(usuario);

    setFormulario({
      nombre:
        usuario.nombre || "",

      apellido:
        usuario.apellido || "",

      usuario:
        usuario.usuario || "",

      email:
        usuario.email || "",

      password: "",

      rol:
        usuario.rol || "estudiante",

      estado:
        usuario.estado || "activo",
    });

    setMostrarPassword(false);

    setModalAbierto(true);
  };


  // ==========================================================
  // CERRAR MODAL
  // ==========================================================

  const cerrarModal = () => {

    if (guardando) {
      return;
    }

    setModalAbierto(false);

    setUsuarioSeleccionado(null);

    setFormulario({
      ...usuarioInicial,
    });

    setMostrarPassword(false);
  };


  // ==========================================================
  // CAMBIO FORMULARIO
  // ==========================================================

  const manejarCambio = (event) => {

    const {
      name,
      value,
    } = event.target;

    setFormulario(
      (anterior) => ({
        ...anterior,
        [name]: value,
      })
    );
  };


  // ==========================================================
  // VALIDAR
  // ==========================================================

  const validarFormulario = () => {

    if (!formulario.nombre.trim()) {

      alert(
        "Por favor escribe el nombre."
      );

      return false;
    }


    if (!formulario.apellido.trim()) {

      alert(
        "Por favor escribe el apellido."
      );

      return false;
    }


    if (!formulario.usuario.trim()) {

      alert(
        "Por favor escribe el nombre de usuario."
      );

      return false;
    }


    if (
      formulario.email.trim() &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        formulario.email.trim()
      )
    ) {

      alert(
        "El correo electrónico no tiene un formato válido."
      );

      return false;
    }


    if (
      !usuarioSeleccionado &&
      !formulario.password.trim()
    ) {

      alert(
        "La contraseña es obligatoria para un nuevo usuario."
      );

      return false;
    }


    if (
      formulario.password.trim() &&
      formulario.password.trim().length < 4
    ) {

      alert(
        "La contraseña debe tener al menos 4 caracteres."
      );

      return false;
    }


    return true;
  };


  // ==========================================================
  // GUARDAR
  // ==========================================================

  const guardarUsuario = async (event) => {

    event.preventDefault();

    if (!validarFormulario()) {
      return;
    }


    try {

      setGuardando(true);


      const datos = {

        nombre:
          formulario.nombre.trim(),

        apellido:
          formulario.apellido.trim(),

        usuario:
          formulario.usuario.trim(),

        email:
          formulario.email.trim() || null,

        rol:
          formulario.rol,

        estado:
          formulario.estado,

      };


      /*
       * La contraseña solamente se envía:
       *
       * - al crear un usuario
       * - si se escribió una nueva contraseña
       *
       * Así no se reemplaza accidentalmente
       * la contraseña existente al editar.
       */

      if (
        !usuarioSeleccionado ||
        formulario.password.trim()
      ) {

        datos.password =
          formulario.password.trim();
      }


      if (usuarioSeleccionado) {

        await actualizarUsuario(
          usuarioSeleccionado.id,
          datos
        );

        alert(
          "Usuario actualizado correctamente."
        );

      } else {

        await crearUsuario(
          datos
        );

        alert(
          "Usuario creado correctamente."
        );
      }


      cerrarModal();

      await cargarUsuarios();


    } catch (error) {

      console.error(
        "Error al guardar usuario:",
        error
      );

      alert(
        error.message ||
        "No se pudo guardar el usuario."
      );

    } finally {

      setGuardando(false);

    }
  };


  // ==========================================================
  // ELIMINAR
  // ==========================================================

  const eliminar = async (id) => {

    const confirmar =
      window.confirm(
        "¿Estás seguro de eliminar este usuario?"
      );


    if (!confirmar) {
      return;
    }


    try {

      await eliminarUsuario(id);

      await cargarUsuarios();

      alert(
        "Usuario eliminado correctamente."
      );


    } catch (error) {

      console.error(
        "Error al eliminar usuario:",
        error
      );

      alert(
        error.message ||
        "No se pudo eliminar el usuario."
      );
    }
  };


  // ==========================================================
  // FILTRAR USUARIOS
  // ==========================================================

  const usuariosFiltrados = useMemo(() => {

    const texto =
      busqueda
        .trim()
        .toLowerCase();


    return usuarios.filter(
      (usuario) => {

        const nombreCompleto =
          `${usuario.nombre || ""} ${
            usuario.apellido || ""
          }`.toLowerCase();

        const nombreUsuario =
          String(
            usuario.usuario || ""
          ).toLowerCase();

        const email =
          String(
            usuario.email || ""
          ).toLowerCase();


        const coincideBusqueda =
          !texto ||
          nombreCompleto.includes(texto) ||
          nombreUsuario.includes(texto) ||
          email.includes(texto);


        const coincideRol =
          filtroRol === "Todos" ||
          usuario.rol === filtroRol;


        const coincideEstado =
          filtroEstado === "Todos" ||
          usuario.estado === filtroEstado;


        return (
          coincideBusqueda &&
          coincideRol &&
          coincideEstado
        );
      }
    );

  }, [
    usuarios,
    busqueda,
    filtroRol,
    filtroEstado,
  ]);


  // ==========================================================
  // ESTADÍSTICAS
  // ==========================================================

  const estadisticas =
    useMemo(() => {

      const total =
        usuarios.length;

      const administradores =
        usuarios.filter(
          (usuario) =>
            usuario.rol === "admin"
        ).length;

      const estudiantes =
        usuarios.filter(
          (usuario) =>
            usuario.rol === "estudiante"
        ).length;

      const activos =
        usuarios.filter(
          (usuario) =>
            usuario.estado === "activo"
        ).length;


      return {
        total,
        administradores,
        estudiantes,
        activos,
      };

    }, [usuarios]);


  // ==========================================================
  // NOMBRE COMPLETO
  // ==========================================================

  const obtenerNombreCompleto = (usuario) => {

    return (
      `${usuario.nombre || ""} ${
        usuario.apellido || ""
      }`.trim() ||
      "Sin nombre"
    );
  };


  // ==========================================================
  // CLASE ROL
  // ==========================================================

  const obtenerClaseRol = (rol) => {

    if (rol === "admin") {
      return "user-role admin";
    }

    return "user-role student";
  };


  // ==========================================================
  // TEXTO ROL
  // ==========================================================

  const obtenerTextoRol = (rol) => {

    return rol === "admin"
      ? "Administrador"
      : "Estudiante";
  };


  // ==========================================================
  // RENDER
  // ==========================================================

  return (

    <div className="usuarios-page">


      {/* ======================================================
          HEADER
      ======================================================= */}

      <header className="usuarios-header">

        <div className="usuarios-header-left">

          <button
            className="usuarios-back-button"
            type="button"
            onClick={() =>
              navigate("/admin")
            }
            title="Volver al Dashboard"
          >
            <ArrowLeft size={20} />
          </button>


          <div>

            <h1>
              Gestionar usuarios
            </h1>

            <p>
              Administra estudiantes y
              administradores del sistema.
            </p>

          </div>

        </div>


        <button
          className="usuarios-primary-button"
          type="button"
          onClick={
            abrirNuevoUsuario
          }
        >

          <Plus size={19} />

          <span>
            Nuevo usuario
          </span>

        </button>

      </header>


      {/* ======================================================
          ESTADÍSTICAS
      ======================================================= */}

      <section className="usuarios-stats">


        {/* TOTAL */}

        <div className="usuario-stat-card">

          <div className="usuario-stat-icon blue">
            <Users size={22} />
          </div>

          <div>

            <span>
              Total usuarios
            </span>

            <strong>
              {estadisticas.total}
            </strong>

          </div>

        </div>


        {/* ADMINISTRADORES */}

        <div className="usuario-stat-card">

          <div className="usuario-stat-icon red">
            <ShieldCheck size={22} />
          </div>

          <div>

            <span>
              Administradores
            </span>

            <strong>
              {estadisticas.administradores}
            </strong>

          </div>

        </div>


        {/* ESTUDIANTES */}

        <div className="usuario-stat-card">

          <div className="usuario-stat-icon blue">
            <GraduationCap size={22} />
          </div>

          <div>

            <span>
              Estudiantes
            </span>

            <strong>
              {estadisticas.estudiantes}
            </strong>

          </div>

        </div>


        {/* ACTIVOS */}

        <div className="usuario-stat-card">

          <div className="usuario-stat-icon green">
            <CheckCircle size={22} />
          </div>

          <div>

            <span>
              Usuarios activos
            </span>

            <strong>
              {estadisticas.activos}
            </strong>

          </div>

        </div>


      </section>


      {/* ======================================================
          CONTENIDO
      ======================================================= */}

      <main className="usuarios-content">


        <section className="usuarios-panel">


          {/* ==================================================
              CABECERA PANEL
          =================================================== */}

          <div className="usuarios-panel-header">

            <div>

              <h2>
                Usuarios registrados
              </h2>

              <p>
                Gestiona las cuentas de acceso
                a Banda Control.
              </p>

            </div>


            <button
              className="usuarios-refresh-button"
              type="button"
              onClick={
                cargarUsuarios
              }
              disabled={cargando}
            >

              <RefreshIcon
                cargando={cargando}
              />

              Actualizar

            </button>

          </div>


          {/* ==================================================
              TOOLBAR
          =================================================== */}

          <div className="usuarios-toolbar">


            <div className="usuarios-search-box">

              <Search size={19} />

              <input
                type="text"
                placeholder="Buscar por nombre, usuario o correo..."
                value={busqueda}
                onChange={(event) =>
                  setBusqueda(
                    event.target.value
                  )
                }
              />


              {busqueda && (

                <button
                  className="usuarios-clear-search"
                  type="button"
                  onClick={() =>
                    setBusqueda("")
                  }
                  title="Limpiar búsqueda"
                >

                  <X size={17} />

                </button>

              )}

            </div>


            <select
              className="usuarios-filter-select"
              value={filtroRol}
              onChange={(event) =>
                setFiltroRol(
                  event.target.value
                )
              }
            >

              <option value="Todos">
                Todos los roles
              </option>

              <option value="admin">
                Administradores
              </option>

              <option value="estudiante">
                Estudiantes
              </option>

            </select>


            <select
              className="usuarios-filter-select"
              value={filtroEstado}
              onChange={(event) =>
                setFiltroEstado(
                  event.target.value
                )
              }
            >

              <option value="Todos">
                Todos los estados
              </option>

              <option value="activo">
                Activos
              </option>

              <option value="inactivo">
                Inactivos
              </option>

            </select>


          </div>


          {/* ==================================================
              TABLA
          =================================================== */}

          <div className="usuarios-table-container">

            <table className="usuarios-table">

              <thead>

                <tr>

                  <th>
                    Usuario
                  </th>

                  <th>
                    Nombre completo
                  </th>

                  <th>
                    Correo
                  </th>

                  <th>
                    Rol
                  </th>

                  <th>
                    Estado
                  </th>

                  <th>
                    Acciones
                  </th>

                </tr>

              </thead>


              <tbody>


                {cargando ? (

                  <tr>

                    <td
                      colSpan="6"
                      className="usuarios-empty-table"
                    >

                      <div className="usuarios-loading">

                        <span className="usuarios-spinner" />

                        <strong>
                          Cargando usuarios...
                        </strong>

                      </div>

                    </td>

                  </tr>

                ) : usuariosFiltrados.length === 0 ? (

                  <tr>

                    <td
                      colSpan="6"
                      className="usuarios-empty-table"
                    >

                      <Users size={45} />

                      <strong>
                        No hay usuarios registrados
                      </strong>

                      <span>

                        {busqueda ||
                        filtroRol !== "Todos" ||
                        filtroEstado !== "Todos"
                          ? "No se encontraron usuarios con los filtros seleccionados."
                          : "Cuando registres un usuario, aparecerá aquí."}

                      </span>


                      {!busqueda &&
                        filtroRol === "Todos" &&
                        filtroEstado === "Todos" && (

                        <button
                          className="usuarios-primary-button"
                          type="button"
                          onClick={
                            abrirNuevoUsuario
                          }
                        >

                          <Plus size={18} />

                          Nuevo usuario

                        </button>

                      )}

                    </td>

                  </tr>

                ) : (

                  usuariosFiltrados.map(
                    (usuario) => (

                      <tr
                        key={
                          usuario.id
                        }
                      >


                        {/* USUARIO */}

                        <td>

                          <div className="usuario-identificador">

                            <div className="usuario-avatar">

                              <User size={18} />

                            </div>

                            <strong>
                              {usuario.usuario}
                            </strong>

                          </div>

                        </td>


                        {/* NOMBRE */}

                        <td>

                          <div className="usuario-nombre">

                            <strong>
                              {obtenerNombreCompleto(
                                usuario
                              )}
                            </strong>

                            <small>
                              ID: {usuario.id}
                            </small>

                          </div>

                        </td>


                        {/* EMAIL */}

                        <td>

                          <span className="usuario-email">

                            {usuario.email ||
                              "Sin correo"}

                          </span>

                        </td>


                        {/* ROL */}

                        <td>

                          <span
                            className={
                              obtenerClaseRol(
                                usuario.rol
                              )
                            }
                          >

                            {usuario.rol === "admin" ? (
                              <ShieldCheck
                                size={14}
                              />
                            ) : (
                              <GraduationCap
                                size={14}
                              />
                            )}

                            {obtenerTextoRol(
                              usuario.rol
                            )}

                          </span>

                        </td>


                        {/* ESTADO */}

                        <td>

                          <span
                            className={`usuario-status ${
                              usuario.estado === "activo"
                                ? "active"
                                : "inactive"
                            }`}
                          >

                            <span className="status-dot" />

                            {usuario.estado === "activo"
                              ? "Activo"
                              : "Inactivo"}

                          </span>

                        </td>


                        {/* ACCIONES */}

                        <td>

                          <div className="usuarios-table-actions">


                            <button
                              className="usuario-action-button edit"
                              type="button"
                              title="Editar usuario"
                              onClick={() =>
                                abrirEditarUsuario(
                                  usuario
                                )
                              }
                            >

                              <Edit
                                size={17}
                              />

                            </button>


                            <button
                              className="usuario-action-button delete"
                              type="button"
                              title="Eliminar usuario"
                              onClick={() =>
                                eliminar(
                                  usuario.id
                                )
                              }
                            >

                              <Trash2
                                size={17}
                              />

                            </button>


                          </div>

                        </td>


                      </tr>

                    )
                  )

                )}

              </tbody>

            </table>

          </div>


          {/* ==================================================
              FOOTER
          =================================================== */}

          <div className="usuarios-table-footer">

            <span>

              Mostrando{" "}

              <strong>
                {usuariosFiltrados.length}
              </strong>

              {" "}de{" "}

              <strong>
                {usuarios.length}
              </strong>

              {" "}usuarios

            </span>

          </div>


        </section>

      </main>


      {/* ======================================================
          MODAL USUARIO
      ======================================================= */}

      {modalAbierto && (

        <div
          className="usuarios-modal-overlay"
          onMouseDown={(event) => {

            if (
              event.target ===
              event.currentTarget
            ) {

              cerrarModal();

            }

          }}
        >

          <div className="usuario-modal">


            {/* ==================================================
                HEADER MODAL
            =================================================== */}

            <div className="usuario-modal-header">

              <div className="usuario-modal-heading">

                <div className="usuario-modal-icon">

                  {usuarioSeleccionado ? (
                    <Edit size={21} />
                  ) : (
                    <User size={21} />
                  )}

                </div>

                <div>

                  <h2>

                    {usuarioSeleccionado
                      ? "Editar usuario"
                      : "Nuevo usuario"}

                  </h2>

                  <p>

                    {usuarioSeleccionado
                      ? "Actualiza la información del usuario."
                      : "Registra una nueva cuenta de acceso."}

                  </p>

                </div>

              </div>


              <button
                className="usuario-modal-close"
                type="button"
                onClick={
                  cerrarModal
                }
                disabled={guardando}
              >

                <X size={21} />

              </button>

            </div>


            {/* ==================================================
                FORMULARIO
            =================================================== */}

            <form
              className="usuario-form"
              onSubmit={
                guardarUsuario
              }
            >


              <div className="usuario-form-grid">


                {/* NOMBRE */}

                <div className="usuario-form-group">

                  <label htmlFor="nombre">
                    Nombre *
                  </label>

                  <input
                    id="nombre"
                    name="nombre"
                    type="text"
                    placeholder="Ej: Juan"
                    value={
                      formulario.nombre
                    }
                    onChange={
                      manejarCambio
                    }
                    autoComplete="off"
                  />

                </div>


                {/* APELLIDO */}

                <div className="usuario-form-group">

                  <label htmlFor="apellido">
                    Apellido *
                  </label>

                  <input
                    id="apellido"
                    name="apellido"
                    type="text"
                    placeholder="Ej: Pérez"
                    value={
                      formulario.apellido
                    }
                    onChange={
                      manejarCambio
                    }
                    autoComplete="off"
                  />

                </div>


                {/* USUARIO */}

                <div className="usuario-form-group">

                  <label htmlFor="usuario">
                    Nombre de usuario *
                  </label>

                  <input
                    id="usuario"
                    name="usuario"
                    type="text"
                    placeholder="Ej: jperez"
                    value={
                      formulario.usuario
                    }
                    onChange={
                      manejarCambio
                    }
                    autoComplete="off"
                  />

                </div>


                {/* EMAIL */}

                <div className="usuario-form-group">

                  <label htmlFor="email">
                    Correo electrónico
                  </label>

                  <input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Ej: usuario@correo.com"
                    value={
                      formulario.email
                    }
                    onChange={
                      manejarCambio
                    }
                    autoComplete="off"
                  />

                </div>


                {/* PASSWORD */}

                <div className="usuario-form-group usuario-password-group">

                  <label htmlFor="password">

                    Contraseña

                    {!usuarioSeleccionado &&
                      " *"}

                  </label>


                  <div className="usuario-password-wrapper">

                    <input
                      id="password"
                      name="password"
                      type={
                        mostrarPassword
                          ? "text"
                          : "password"
                      }
                      placeholder={
                        usuarioSeleccionado
                          ? "Dejar vacío para conservarla"
                          : "Escribe una contraseña"
                      }
                      value={
                        formulario.password
                      }
                      onChange={
                        manejarCambio
                      }
                      autoComplete="new-password"
                    />


                    <button
                      type="button"
                      className="usuario-password-toggle"
                      onClick={() =>
                        setMostrarPassword(
                          (anterior) =>
                            !anterior
                        )
                      }
                      title={
                        mostrarPassword
                          ? "Ocultar contraseña"
                          : "Mostrar contraseña"
                      }
                    >

                      {mostrarPassword ? (
                        <EyeOff size={18} />
                      ) : (
                        <Eye size={18} />
                      )}

                    </button>

                  </div>


                  <small>
                    {usuarioSeleccionado
                      ? "Escribe una contraseña únicamente si deseas cambiarla."
                      : "La contraseña debe tener al menos 4 caracteres."}
                  </small>

                </div>


                {/* ROL */}

                <div className="usuario-form-group">

                  <label htmlFor="rol">
                    Rol *
                  </label>

                  <select
                    id="rol"
                    name="rol"
                    value={
                      formulario.rol
                    }
                    onChange={
                      manejarCambio
                    }
                  >

                    <option value="estudiante">
                      Estudiante
                    </option>

                    <option value="admin">
                      Administrador
                    </option>

                  </select>

                </div>


                {/* ESTADO */}

                <div className="usuario-form-group">

                  <label htmlFor="estado">
                    Estado *
                  </label>

                  <select
                    id="estado"
                    name="estado"
                    value={
                      formulario.estado
                    }
                    onChange={
                      manejarCambio
                    }
                  >

                    <option value="activo">
                      Activo
                    </option>

                    <option value="inactivo">
                      Inactivo
                    </option>

                  </select>

                </div>


              </div>


              {/* ==================================================
                  INFORMACIÓN
              =================================================== */}

              <div className="usuario-form-info">

                <CheckCircle size={16} />

                <span>
                  Los estudiantes activos podrán
                  recibir instrumentos en préstamo.
                </span>

              </div>


              {/* ==================================================
                  ACCIONES
              =================================================== */}

              <div className="usuario-modal-actions">

                <button
                  type="button"
                  className="usuario-secondary-button"
                  onClick={
                    cerrarModal
                  }
                  disabled={guardando}
                >
                  Cancelar
                </button>


                <button
                  type="submit"
                  className="usuarios-primary-button"
                  disabled={guardando}
                >

                  {guardando
                    ? "Guardando..."
                    : usuarioSeleccionado
                      ? "Guardar cambios"
                      : "Crear usuario"}

                </button>

              </div>


            </form>

          </div>

        </div>

      )}

    </div>
  );
}


// ============================================================
// ICONO ACTUALIZAR
// ============================================================

function RefreshIcon({ cargando }) {

  return (
    <svg
      width="17"
      height="17"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={
        cargando
          ? "usuario-refresh-spin"
          : ""
      }
    >

      <path d="M20 11a8.1 8.1 0 0 0-15.5-2M4 5v4h4" />

      <path d="M4 13a8.1 8.1 0 0 0 15.5 2M20 19v-4h-4" />

    </svg>
  );
}


export default Usuarios;