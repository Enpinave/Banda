import "../../styles/prestamos.css";

import {
  ArrowLeft,
  Calendar,
  CheckCircle,
  Clock,
  Plus,
  RefreshCw,
  Search,
  Trash2,
  User,
  X,
  Music,
} from "lucide-react";

import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  obtenerPrestamos,
  crearPrestamo,
  devolverPrestamo,
  eliminarPrestamo,
} from "../../services/prestamosService";

import {
  obtenerInstrumentos,
} from "../../services/instrumentosService";

import {
  obtenerUsuarios,
} from "../../services/usuariosService";


// ============================================================
// FORMULARIO INICIAL
// ============================================================

const prestamoInicial = {
  instrumento_id: "",
  estudiante_id: "",
  fecha_devolucion_prevista: "",
  observaciones: "",
};


// ============================================================
// COMPONENTE
// ============================================================

function Prestamos() {

  const navigate = useNavigate();


  // ==========================================================
  // ESTADOS
  // ==========================================================

  const [prestamos, setPrestamos] = useState([]);

  const [instrumentos, setInstrumentos] = useState([]);

  const [estudiantes, setEstudiantes] = useState([]);

  const [busqueda, setBusqueda] = useState("");

  const [filtroEstado, setFiltroEstado] =
    useState("Todos");

  const [modalAbierto, setModalAbierto] =
    useState(false);

  const [modalDevolucion, setModalDevolucion] =
    useState(false);

  const [prestamoSeleccionado, setPrestamoSeleccionado] =
    useState(null);

  const [formulario, setFormulario] =
    useState({
      ...prestamoInicial,
    });

  const [observacionesDevolucion, setObservacionesDevolucion] =
    useState("");

  const [cargando, setCargando] =
    useState(false);

  const [guardando, setGuardando] =
    useState(false);


  // ==========================================================
  // CARGAR DATOS
  // ==========================================================

  const cargarDatos = async () => {

    try {

      setCargando(true);

      const [
        datosPrestamos,
        datosInstrumentos,
        datosUsuarios,
      ] = await Promise.all([
        obtenerPrestamos(),
        obtenerInstrumentos(),
        obtenerUsuarios(),
      ]);

      setPrestamos(
        Array.isArray(datosPrestamos)
          ? datosPrestamos
          : []
      );

      setInstrumentos(
        Array.isArray(datosInstrumentos)
          ? datosInstrumentos
          : []
      );

      const listaUsuarios =
        Array.isArray(datosUsuarios)
          ? datosUsuarios
          : [];

      setEstudiantes(
        listaUsuarios.filter(
          (usuario) =>
            usuario.rol === "estudiante" &&
            usuario.estado !== "inactivo"
        )
      );

    } catch (error) {

      console.error(
        "Error al cargar datos de préstamos:",
        error
      );

      setPrestamos([]);

      alert(
        error.message ||
        "No se pudieron cargar los datos de préstamos."
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
  // ABRIR NUEVO PRÉSTAMO
  // ==========================================================

  const abrirNuevoPrestamo = () => {

    setFormulario({
      ...prestamoInicial,
    });

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

    setFormulario({
      ...prestamoInicial,
    });

  };


  // ==========================================================
  // CAMBIAR FORMULARIO
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
  // VALIDAR FORMULARIO
  // ==========================================================

  const validarFormulario = () => {

    if (!formulario.instrumento_id) {

      alert(
        "Por favor selecciona un instrumento."
      );

      return false;
    }


    if (!formulario.estudiante_id) {

      alert(
        "Por favor selecciona un estudiante."
      );

      return false;
    }


    if (
      !formulario.fecha_devolucion_prevista
    ) {

      alert(
        "Por favor selecciona la fecha de devolución."
      );

      return false;
    }


    return true;
  };


  // ==========================================================
  // CREAR PRÉSTAMO
  // ==========================================================

  const guardarPrestamo = async (event) => {

    event.preventDefault();

    if (!validarFormulario()) {
      return;
    }


    try {

      setGuardando(true);


      await crearPrestamo({

        instrumento_id:
          Number(formulario.instrumento_id),

        estudiante_id:
          Number(formulario.estudiante_id),

        fecha_devolucion_prevista:
          formulario.fecha_devolucion_prevista,

        observaciones:
          formulario.observaciones.trim(),

      });


      alert(
        "Préstamo registrado correctamente."
      );


      cerrarModal();

      await cargarDatos();


    } catch (error) {

      console.error(
        "Error al crear préstamo:",
        error
      );

      alert(
        error.message ||
        "No se pudo registrar el préstamo."
      );

    } finally {

      setGuardando(false);

    }

  };


  // ==========================================================
  // ABRIR DEVOLUCIÓN
  // ==========================================================

  const abrirDevolucion = (prestamo) => {

    setPrestamoSeleccionado(
      prestamo
    );

    setObservacionesDevolucion("");

    setModalDevolucion(true);

  };


  // ==========================================================
  // CERRAR DEVOLUCIÓN
  // ==========================================================

  const cerrarDevolucion = () => {

    if (guardando) {
      return;
    }

    setModalDevolucion(false);

    setPrestamoSeleccionado(null);

    setObservacionesDevolucion("");

  };


  // ==========================================================
  // REGISTRAR DEVOLUCIÓN
  // ==========================================================

  const registrarDevolucion = async () => {

    if (!prestamoSeleccionado) {
      return;
    }


    try {

      setGuardando(true);


      await devolverPrestamo(
        prestamoSeleccionado.id,
        {
          observaciones:
            observacionesDevolucion.trim(),
        }
      );


      alert(
        "Instrumento devuelto correctamente."
      );


      cerrarDevolucion();

      await cargarDatos();


    } catch (error) {

      console.error(
        "Error al registrar devolución:",
        error
      );

      alert(
        error.message ||
        "No se pudo registrar la devolución."
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
        "¿Estás seguro de eliminar este préstamo?"
      );


    if (!confirmar) {
      return;
    }


    try {

      await eliminarPrestamo(id);

      await cargarDatos();


      alert(
        "Préstamo eliminado correctamente."
      );

    } catch (error) {

      console.error(
        "Error al eliminar préstamo:",
        error
      );

      alert(
        error.message ||
        "No se pudo eliminar el préstamo."
      );

    }

  };


  // ==========================================================
  // OBTENER NOMBRE INSTRUMENTO
  // ==========================================================

  const obtenerNombreInstrumento = (
    prestamo
  ) => {

    if (prestamo.instrumento_nombre) {
      return prestamo.instrumento_nombre;
    }

    const instrumento =
      instrumentos.find(
        (item) =>
          Number(item.id) ===
          Number(prestamo.instrumento_id)
      );

    return instrumento
      ? instrumento.nombre
      : "Instrumento";
  };


  // ==========================================================
  // OBTENER CÓDIGO INSTRUMENTO
  // ==========================================================

  const obtenerCodigoInstrumento = (
    prestamo
  ) => {

    if (prestamo.instrumento_codigo) {
      return prestamo.instrumento_codigo;
    }

    const instrumento =
      instrumentos.find(
        (item) =>
          Number(item.id) ===
          Number(prestamo.instrumento_id)
      );

    return instrumento
      ? instrumento.codigo
      : "—";
  };


  // ==========================================================
  // OBTENER NOMBRE ESTUDIANTE
  // ==========================================================

  const obtenerNombreEstudiante = (
    prestamo
  ) => {

    if (prestamo.estudiante_nombre) {
      return prestamo.estudiante_nombre;
    }

    if (prestamo.usuario_nombre) {
      return prestamo.usuario_nombre;
    }

    const estudiante =
      estudiantes.find(
        (item) =>
          Number(item.id) ===
          Number(prestamo.estudiante_id)
      );

    if (!estudiante) {
      return "Estudiante";
    }

    return `${estudiante.nombre || ""} ${
      estudiante.apellido || ""
    }`.trim();

  };


  // ==========================================================
  // ESTADO
  // ==========================================================

  const obtenerEstadoReal = (prestamo) => {

    if (prestamo.estado) {
      return prestamo.estado;
    }

    return "Activo";

  };


  // ==========================================================
  // CLASE ESTADO
  // ==========================================================

  const obtenerClaseEstado = (
    estado
  ) => {

    switch (estado) {

      case "Activo":
        return "loan-active";

      case "Prestado":
        return "loan-active";

      case "Vencido":
        return "loan-overdue";

      case "Devuelto":
        return "loan-returned";

      default:
        return "loan-default";
    }

  };


  // ==========================================================
  // FORMATEAR FECHA
  // ==========================================================

  const formatearFecha = (fecha) => {

    if (!fecha) {
      return "—";
    }

    const fechaLocal =
      String(fecha).split(" ")[0];

    const partes =
      fechaLocal.split("-");

    if (partes.length !== 3) {
      return fecha;
    }

    return `${partes[2]}/${partes[1]}/${partes[0]}`;

  };


  // ==========================================================
  // FILTRAR
  // ==========================================================

  const prestamosFiltrados = useMemo(() => {

    const texto =
      busqueda
        .trim()
        .toLowerCase();


    return prestamos.filter(
      (prestamo) => {

        const nombreInstrumento =
          obtenerNombreInstrumento(
            prestamo
          ).toLowerCase();

        const codigoInstrumento =
          obtenerCodigoInstrumento(
            prestamo
          ).toLowerCase();

        const nombreEstudiante =
          obtenerNombreEstudiante(
            prestamo
          ).toLowerCase();

        const estado =
          obtenerEstadoReal(
            prestamo
          );


        const coincideBusqueda =
          !texto ||
          nombreInstrumento.includes(
            texto
          ) ||
          codigoInstrumento.includes(
            texto
          ) ||
          nombreEstudiante.includes(
            texto
          );


        const coincideEstado =
          filtroEstado === "Todos" ||
          estado === filtroEstado;


        return (
          coincideBusqueda &&
          coincideEstado
        );

      }
    );

  }, [
    prestamos,
    instrumentos,
    estudiantes,
    busqueda,
    filtroEstado,
  ]);


  // ==========================================================
  // ESTADÍSTICAS
  // ==========================================================

  const estadisticas =
    useMemo(() => {

      const total =
        prestamos.length;

      const activos =
        prestamos.filter(
          (prestamo) => {

            const estado =
              obtenerEstadoReal(
                prestamo
              );

            return (
              estado === "Activo" ||
              estado === "Prestado"
            );

          }
        ).length;


      const vencidos =
        prestamos.filter(
          (prestamo) =>
            obtenerEstadoReal(
              prestamo
            ) === "Vencido"
        ).length;


      const devueltos =
        prestamos.filter(
          (prestamo) =>
            obtenerEstadoReal(
              prestamo
            ) === "Devuelto"
        ).length;


      return {
        total,
        activos,
        vencidos,
        devueltos,
      };

    }, [prestamos]);


  // ==========================================================
  // INSTRUMENTOS DISPONIBLES
  // ==========================================================

  const instrumentosDisponibles =
    instrumentos.filter(
      (instrumento) =>
        instrumento.estado ===
        "Disponible"
    );


  // ==========================================================
  // RENDER
  // ==========================================================

  return (

    <div className="prestamos-page">


      {/* ======================================================
          HEADER
      ======================================================= */}

      <header className="prestamos-header">

        <div className="prestamos-header-left">

          <button
            className="back-button"
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
              Gestionar préstamos
            </h1>

            <p>
              Administra los préstamos y
              devoluciones de instrumentos
              musicales.
            </p>

          </div>

        </div>


        <button
          className="primary-button"
          type="button"
          onClick={
            abrirNuevoPrestamo
          }
        >

          <Plus size={19} />

          <span>
            Nuevo préstamo
          </span>

        </button>

      </header>


      {/* ======================================================
          ESTADÍSTICAS
      ======================================================= */}

      <section className="prestamos-stats">


        <div className="loan-stat-card">

          <div className="loan-stat-icon blue">
            <Music size={22} />
          </div>

          <div>

            <span>
              Total préstamos
            </span>

            <strong>
              {estadisticas.total}
            </strong>

          </div>

        </div>


        <div className="loan-stat-card">

          <div className="loan-stat-icon green">
            <Clock size={22} />
          </div>

          <div>

            <span>
              Activos
            </span>

            <strong>
              {estadisticas.activos}
            </strong>

          </div>

        </div>


        <div className="loan-stat-card">

          <div className="loan-stat-icon orange">
            <Calendar size={22} />
          </div>

          <div>

            <span>
              Vencidos
            </span>

            <strong>
              {estadisticas.vencidos}
            </strong>

          </div>

        </div>


        <div className="loan-stat-card">

          <div className="loan-stat-icon purple">
            <CheckCircle size={22} />
          </div>

          <div>

            <span>
              Devueltos
            </span>

            <strong>
              {estadisticas.devueltos}
            </strong>

          </div>

        </div>


      </section>


      {/* ======================================================
          CONTENIDO
      ======================================================= */}

      <main className="prestamos-content">


        <section className="prestamos-panel">


          {/* ==================================================
              PANEL HEADER
          =================================================== */}

          <div className="prestamos-panel-header">

            <div>

              <h2>
                Préstamos registrados
              </h2>

              <p>
                Historial de préstamos de
                la banda.
              </p>

            </div>


            <button
              className="refresh-button"
              type="button"
              onClick={cargarDatos}
              disabled={cargando}
            >

              <RefreshCw
                size={17}
                className={
                  cargando
                    ? "spin"
                    : ""
                }
              />

              Actualizar

            </button>

          </div>


          {/* ==================================================
              TOOLBAR
          =================================================== */}

          <div className="prestamos-toolbar">


            <div className="search-box">

              <Search size={19} />

              <input
                type="text"
                placeholder="Buscar por instrumento, código o estudiante..."
                value={busqueda}
                onChange={(event) =>
                  setBusqueda(
                    event.target.value
                  )
                }
              />


              {busqueda && (

                <button
                  className="clear-search"
                  type="button"
                  onClick={() =>
                    setBusqueda("")
                  }
                >
                  <X size={17} />
                </button>

              )}

            </div>


            <select
              className="filter-select"
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

              <option value="Activo">
                Activos
              </option>

              <option value="Prestado">
                Prestados
              </option>

              <option value="Vencido">
                Vencidos
              </option>

              <option value="Devuelto">
                Devueltos
              </option>

            </select>

          </div>


          {/* ==================================================
              TABLA
          =================================================== */}

          <div className="table-container">

            <table className="prestamos-table">

              <thead>

                <tr>

                  <th>
                    Instrumento
                  </th>

                  <th>
                    Estudiante
                  </th>

                  <th>
                    Fecha préstamo
                  </th>

                  <th>
                    Devolución prevista
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
                      className="empty-table"
                    >
                      <RefreshCw
                        size={35}
                        className="spin"
                      />

                      <strong>
                        Cargando préstamos...
                      </strong>

                    </td>

                  </tr>

                ) : prestamosFiltrados.length === 0 ? (

                  <tr>

                    <td
                      colSpan="6"
                      className="empty-table"
                    >

                      <Music size={45} />

                      <strong>
                        No hay préstamos registrados
                      </strong>

                      <span>

                        {busqueda ||
                        filtroEstado !==
                          "Todos"
                          ? "No se encontraron préstamos con los filtros seleccionados."
                          : "Cuando registres un préstamo, aparecerá aquí."}

                      </span>


                      {!busqueda &&
                        filtroEstado ===
                          "Todos" && (

                        <button
                          className="primary-button"
                          type="button"
                          onClick={
                            abrirNuevoPrestamo
                          }
                        >

                          <Plus size={18} />

                          Nuevo préstamo

                        </button>

                      )}

                    </td>

                  </tr>

                ) : (

                  prestamosFiltrados.map(
                    (prestamo) => {

                      const estado =
                        obtenerEstadoReal(
                          prestamo
                        );


                      return (

                        <tr
                          key={
                            prestamo.id
                          }
                        >


                          {/* INSTRUMENTO */}

                          <td>

                            <div className="loan-instrument">

                              <div className="loan-instrument-icon">
                                <Music size={20} />
                              </div>

                              <div>

                                <strong>
                                  {
                                    obtenerNombreInstrumento(
                                      prestamo
                                    )
                                  }
                                </strong>

                                <small>
                                  Código:{" "}
                                  {
                                    obtenerCodigoInstrumento(
                                      prestamo
                                    )
                                  }
                                </small>

                              </div>

                            </div>

                          </td>


                          {/* ESTUDIANTE */}

                          <td>

                            <div className="loan-student">

                              <div className="loan-user-icon">
                                <User size={17} />
                              </div>

                              <strong>
                                {
                                  obtenerNombreEstudiante(
                                    prestamo
                                  )
                                }
                              </strong>

                            </div>

                          </td>


                          {/* FECHA PRÉSTAMO */}

                          <td>

                            <span className="date-value">

                              <Calendar
                                size={15}
                              />

                              {
                                formatearFecha(
                                  prestamo.fecha_prestamo ||
                                  prestamo.fecha_creacion
                                )
                              }

                            </span>

                          </td>


                          {/* DEVOLUCIÓN */}

                          <td>

                            <span className="date-value">

                              <Calendar
                                size={15}
                              />

                              {
                                formatearFecha(
                                  prestamo.fecha_devolucion_prevista
                                )
                              }

                            </span>

                          </td>


                          {/* ESTADO */}

                          <td>

                            <span
                              className={`loan-status ${obtenerClaseEstado(
                                estado
                              )}`}
                            >

                              {estado}

                            </span>

                          </td>


                          {/* ACCIONES */}

                          <td>

                            <div className="table-actions">


                              {(estado ===
                                "Activo" ||
                                estado ===
                                  "Prestado" ||
                                estado ===
                                  "Vencido") && (

                                <button
                                  className="action-button return"
                                  type="button"
                                  title="Registrar devolución"
                                  onClick={() =>
                                    abrirDevolucion(
                                      prestamo
                                    )
                                  }
                                >

                                  <CheckCircle
                                    size={17}
                                  />

                                </button>

                              )}


                              <button
                                className="action-button delete"
                                type="button"
                                title="Eliminar préstamo"
                                onClick={() =>
                                  eliminar(
                                    prestamo.id
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

                      );

                    }
                  )

                )}

              </tbody>

            </table>

          </div>


          {/* ==================================================
              FOOTER
          =================================================== */}

          <div className="table-footer">

            <span>

              Mostrando{" "}

              <strong>
                {
                  prestamosFiltrados.length
                }
              </strong>{" "}

              de{" "}

              <strong>
                {prestamos.length}
              </strong>{" "}

              préstamos

            </span>

          </div>


        </section>

      </main>


      {/* ======================================================
          MODAL NUEVO PRÉSTAMO
      ======================================================= */}

      {modalAbierto && (

        <div
          className="modal-overlay"
          onMouseDown={(event) => {

            if (
              event.target ===
              event.currentTarget
            ) {

              cerrarModal();

            }

          }}
        >

          <div className="prestamo-modal">


            {/* HEADER */}

            <div className="modal-header">

              <div>

                <div className="modal-title-icon">
                  <Music size={22} />
                </div>

                <div>

                  <h2>
                    Nuevo préstamo
                  </h2>

                  <p>
                    Registra la entrega de un
                    instrumento a un estudiante.
                  </p>

                </div>

              </div>


              <button
                className="modal-close"
                type="button"
                onClick={
                  cerrarModal
                }
              >

                <X size={21} />

              </button>

            </div>


            {/* FORMULARIO */}

            <form
              className="prestamo-form"
              onSubmit={
                guardarPrestamo
              }
            >


              <div className="form-grid">


                {/* INSTRUMENTO */}

                <div className="form-group">

                  <label htmlFor="instrumento_id">
                    Instrumento *
                  </label>

                  <select
                    id="instrumento_id"
                    name="instrumento_id"
                    value={
                      formulario.instrumento_id
                    }
                    onChange={
                      manejarCambio
                    }
                  >

                    <option value="">
                      Seleccione un instrumento
                    </option>


                    {instrumentosDisponibles.map(
                      (instrumento) => (

                        <option
                          key={
                            instrumento.id
                          }
                          value={
                            instrumento.id
                          }
                        >

                          {instrumento.codigo} -
                          {" "}
                          {instrumento.nombre}

                        </option>

                      )
                    )}

                  </select>


                  {instrumentosDisponibles.length ===
                    0 && (

                    <small className="form-help error-text">
                      No hay instrumentos
                      disponibles para préstamo.
                    </small>

                  )}

                </div>


                {/* ESTUDIANTE */}

                <div className="form-group">

                  <label htmlFor="estudiante_id">
                    Estudiante *
                  </label>

                  <select
                    id="estudiante_id"
                    name="estudiante_id"
                    value={
                      formulario.estudiante_id
                    }
                    onChange={
                      manejarCambio
                    }
                  >

                    <option value="">
                      Seleccione un estudiante
                    </option>


                    {estudiantes.map(
                      (estudiante) => (

                        <option
                          key={
                            estudiante.id
                          }
                          value={
                            estudiante.id
                          }
                        >

                          {estudiante.nombre}{" "}
                          {estudiante.apellido || ""}

                        </option>

                      )
                    )}

                  </select>


                  {estudiantes.length ===
                    0 && (

                    <small className="form-help error-text">
                      No hay estudiantes
                      registrados.
                    </small>

                  )}

                </div>


                {/* FECHA */}

                <div className="form-group full-width">

                  <label htmlFor="fecha_devolucion_prevista">

                    Fecha de devolución
                    prevista *

                  </label>

                  <input
                    id="fecha_devolucion_prevista"
                    name="fecha_devolucion_prevista"
                    type="date"
                    value={
                      formulario.fecha_devolucion_prevista
                    }
                    onChange={
                      manejarCambio
                    }
                  />

                </div>


                {/* OBSERVACIONES */}

                <div className="form-group full-width">

                  <label htmlFor="observaciones">

                    Observaciones

                  </label>

                  <textarea
                    id="observaciones"
                    name="observaciones"
                    rows="4"
                    placeholder="Escribe aquí cualquier observación sobre el préstamo..."
                    value={
                      formulario.observaciones
                    }
                    onChange={
                      manejarCambio
                    }
                  />

                </div>


              </div>


              {/* BOTONES */}

              <div className="modal-actions">

                <button
                  type="button"
                  className="secondary-button"
                  onClick={
                    cerrarModal
                  }
                  disabled={guardando}
                >

                  Cancelar

                </button>


                <button
                  type="submit"
                  className="primary-button"
                  disabled={
                    guardando ||
                    instrumentosDisponibles.length ===
                      0 ||
                    estudiantes.length ===
                      0
                  }
                >

                  {guardando
                    ? "Registrando..."
                    : "Registrar préstamo"}

                </button>

              </div>


            </form>

          </div>

        </div>

      )}


      {/* ======================================================
          MODAL DEVOLUCIÓN
      ======================================================= */}

      {modalDevolucion &&
        prestamoSeleccionado && (

        <div
          className="modal-overlay"
          onMouseDown={(event) => {

            if (
              event.target ===
              event.currentTarget
            ) {

              cerrarDevolucion();

            }

          }}
        >

          <div className="prestamo-modal small-modal">


            <div className="modal-header">

              <div>

                <div className="modal-title-icon return-icon">
                  <CheckCircle
                    size={22}
                  />
                </div>

                <div>

                  <h2>
                    Registrar devolución
                  </h2>

                  <p>
                    Confirma la devolución
                    del instrumento.
                  </p>

                </div>

              </div>


              <button
                className="modal-close"
                type="button"
                onClick={
                  cerrarDevolucion
                }
              >

                <X size={21} />

              </button>

            </div>


            <div className="return-summary">

              <div>

                <span>
                  Instrumento
                </span>

                <strong>
                  {
                    obtenerNombreInstrumento(
                      prestamoSeleccionado
                    )
                  }
                </strong>

                <small>
                  Código:{" "}
                  {
                    obtenerCodigoInstrumento(
                      prestamoSeleccionado
                    )
                  }
                </small>

              </div>


              <div>

                <span>
                  Estudiante
                </span>

                <strong>
                  {
                    obtenerNombreEstudiante(
                      prestamoSeleccionado
                    )
                  }
                </strong>

              </div>

            </div>


            <div className="form-group">

              <label htmlFor="observacionesDevolucion">

                Observaciones de devolución

              </label>

              <textarea
                id="observacionesDevolucion"
                rows="4"
                placeholder="Ej: Instrumento recibido en buen estado..."
                value={
                  observacionesDevolucion
                }
                onChange={(event) =>
                  setObservacionesDevolucion(
                    event.target.value
                  )
                }
              />

            </div>


            <div className="modal-actions">

              <button
                type="button"
                className="secondary-button"
                onClick={
                  cerrarDevolucion
                }
                disabled={guardando}
              >

                Cancelar

              </button>


              <button
                type="button"
                className="success-button"
                onClick={
                  registrarDevolucion
                }
                disabled={guardando}
              >

                <CheckCircle
                  size={18}
                />

                {guardando
                  ? "Procesando..."
                  : "Confirmar devolución"}

              </button>

            </div>


          </div>

        </div>

      )}

    </div>
  );
}


export default Prestamos;