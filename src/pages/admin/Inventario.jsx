import "../../styles/inventario.css";

import {
  Archive,
  ArrowLeft,
  Edit,
  Plus,
  Search,
  Trash2,
  X,
} from "lucide-react";

import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  obtenerInstrumentos,
  agregarInstrumento,
  actualizarInstrumento,
  eliminarInstrumento as eliminarInstrumentoService,
} from "../../services/instrumentosService";


// ============================================================
// FORMULARIO INICIAL
// ============================================================

const instrumentoInicial = {
  codigo: "",
  instrumento: "",
  tipo: "",
  marca: "",
  serie: "",
  estado: "Disponible",
  ubicacion: "",
  observaciones: "",
};


// ============================================================
// COMPONENTE
// ============================================================

function Inventario() {

  const navigate = useNavigate();

  // ==========================================================
  // ESTADOS
  // ==========================================================

  const [instrumentos, setInstrumentos] = useState([]);

  const [busqueda, setBusqueda] = useState("");

  const [filtroEstado, setFiltroEstado] =
    useState("Todos");

  const [modalAbierto, setModalAbierto] =
    useState(false);

  const [modoEdicion, setModoEdicion] =
    useState(false);

  const [instrumentoActual, setInstrumentoActual] =
    useState(instrumentoInicial);


  // ==========================================================
  // CARGAR INSTRUMENTOS
  // ==========================================================

  const cargarInstrumentos = () => {

    const datos = obtenerInstrumentos();

    setInstrumentos(datos);
  };


  // ==========================================================
  // CARGA INICIAL
  // ==========================================================

  useEffect(() => {

    cargarInstrumentos();

  }, []);


  // ==========================================================
  // ESCUCHAR CAMBIOS DEL INVENTARIO
  // ==========================================================

  useEffect(() => {

    const actualizar = () => {
      cargarInstrumentos();
    };

    window.addEventListener(
      "instrumentosActualizados",
      actualizar
    );

    window.addEventListener(
      "storage",
      actualizar
    );

    return () => {

      window.removeEventListener(
        "instrumentosActualizados",
        actualizar
      );

      window.removeEventListener(
        "storage",
        actualizar
      );

    };

  }, []);


  // ==========================================================
  // ABRIR NUEVO
  // ==========================================================

  const abrirNuevoInstrumento = () => {

    setInstrumentoActual({
      ...instrumentoInicial,
    });

    setModoEdicion(false);

    setModalAbierto(true);
  };


  // ==========================================================
  // EDITAR
  // ==========================================================

  const editarInstrumento = (instrumento) => {

    setInstrumentoActual({
      ...instrumento,
    });

    setModoEdicion(true);

    setModalAbierto(true);
  };


  // ==========================================================
  // CERRAR MODAL
  // ==========================================================

  const cerrarModal = () => {

    setModalAbierto(false);

    setModoEdicion(false);

    setInstrumentoActual({
      ...instrumentoInicial,
    });
  };


  // ==========================================================
  // CAMBIAR INPUT
  // ==========================================================

  const manejarCambio = (event) => {

    const { name, value } = event.target;

    setInstrumentoActual((anterior) => ({
      ...anterior,
      [name]: value,
    }));
  };


  // ==========================================================
  // VALIDAR FORMULARIO
  // ==========================================================

  const validarFormulario = () => {

    if (!instrumentoActual.codigo.trim()) {

      alert(
        "Por favor ingresa el código del instrumento."
      );

      return false;
    }

    if (!instrumentoActual.instrumento.trim()) {

      alert(
        "Por favor ingresa el nombre del instrumento."
      );

      return false;
    }

    if (!instrumentoActual.tipo.trim()) {

      alert(
        "Por favor selecciona el tipo de instrumento."
      );

      return false;
    }

    return true;
  };


  // ==========================================================
  // GUARDAR
  // ==========================================================

  const guardarInstrumento = (event) => {

    event.preventDefault();

    if (!validarFormulario()) {
      return;
    }


    // ========================================================
    // EDITAR
    // ========================================================

    if (modoEdicion) {

      actualizarInstrumento(
        instrumentoActual.id,
        instrumentoActual
      );

      cargarInstrumentos();

      cerrarModal();

      return;
    }


    // ========================================================
    // CREAR
    // ========================================================

    agregarInstrumento(
      instrumentoActual
    );

    cargarInstrumentos();

    cerrarModal();
  };


  // ==========================================================
  // ELIMINAR
  // ==========================================================

  const eliminarInstrumento = (id) => {

    const confirmar = window.confirm(
      "¿Estás seguro de eliminar este instrumento?"
    );

    if (!confirmar) {
      return;
    }

    eliminarInstrumentoService(id);

    cargarInstrumentos();
  };


  // ==========================================================
  // FILTRAR
  // ==========================================================

  const instrumentosFiltrados = useMemo(() => {

    const texto =
      busqueda
        .trim()
        .toLowerCase();

    return instrumentos.filter(
      (instrumento) => {

        const coincideBusqueda =
          !texto ||

          instrumento.codigo
            ?.toLowerCase()
            .includes(texto) ||

          instrumento.instrumento
            ?.toLowerCase()
            .includes(texto) ||

          instrumento.marca
            ?.toLowerCase()
            .includes(texto) ||

          instrumento.tipo
            ?.toLowerCase()
            .includes(texto) ||

          instrumento.serie
            ?.toLowerCase()
            .includes(texto);


        const coincideEstado =
          filtroEstado === "Todos" ||
          instrumento.estado ===
            filtroEstado;


        return (
          coincideBusqueda &&
          coincideEstado
        );
      }
    );

  }, [
    instrumentos,
    busqueda,
    filtroEstado,
  ]);


  // ==========================================================
  // ESTADÍSTICAS
  // ==========================================================

  const estadisticas = useMemo(() => {

    return {

      total:
        instrumentos.length,

      disponibles:
        instrumentos.filter(
          (instrumento) =>
            instrumento.estado ===
            "Disponible"
        ).length,

      prestados:
        instrumentos.filter(
          (instrumento) =>
            instrumento.estado ===
            "Prestado"
        ).length,

      mantenimiento:
        instrumentos.filter(
          (instrumento) =>
            instrumento.estado ===
            "Mantenimiento"
        ).length,

      baja:
        instrumentos.filter(
          (instrumento) =>
            instrumento.estado ===
            "Baja"
        ).length,
    };

  }, [instrumentos]);


  // ==========================================================
  // CLASE ESTADO
  // ==========================================================

  const obtenerClaseEstado = (estado) => {

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
  // RENDER
  // ==========================================================

  return (

    <div className="inventario-page">


      {/* ====================================================
          HEADER
      ===================================================== */}

      <header className="inventario-header">

        <div className="inventario-header-left">

          <button
            className="back-button"
            onClick={() =>
              navigate("/admin")
            }
            title="Volver al Dashboard"
          >
            <ArrowLeft size={20} />
          </button>


          <div>

            <h1>
              Inventario de instrumentos
            </h1>

            <p>
              Administración de los instrumentos
              de la banda
            </p>

          </div>

        </div>


        <button
          className="primary-button"
          onClick={
            abrirNuevoInstrumento
          }
        >

          <Plus size={19} />

          <span>
            Nuevo instrumento
          </span>

        </button>

      </header>


      {/* ====================================================
          ESTADÍSTICAS
      ===================================================== */}

      <section className="inventario-stats">

        <div className="inventory-stat-card">

          <div className="inventory-stat-icon blue">
            <Archive size={22} />
          </div>

          <div>

            <span>
              Total
            </span>

            <strong>
              {estadisticas.total}
            </strong>

          </div>

        </div>


        <div className="inventory-stat-card">

          <div className="inventory-stat-icon green">
            <span>✓</span>
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


        <div className="inventory-stat-card">

          <div className="inventory-stat-icon red">
            <span>↗</span>
          </div>

          <div>

            <span>
              Prestados
            </span>

            <strong>
              {estadisticas.prestados}
            </strong>

          </div>

        </div>


        <div className="inventory-stat-card">

          <div className="inventory-stat-icon orange">
            <span>⚒</span>
          </div>

          <div>

            <span>
              Mantenimiento
            </span>

            <strong>
              {estadisticas.mantenimiento}
            </strong>

          </div>

        </div>

      </section>


      {/* ====================================================
          CONTENIDO
      ===================================================== */}

      <main className="inventario-content">

        <section className="inventory-panel">


          {/* =================================================
              TOOLBAR
          ================================================== */}

          <div className="inventory-toolbar">


            <div className="search-box">

              <Search size={19} />

              <input
                type="text"
                placeholder="Buscar por código, instrumento, marca..."
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
                  onClick={() =>
                    setBusqueda("")
                  }
                  type="button"
                  title="Limpiar búsqueda"
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

              <option value="Disponible">
                Disponible
              </option>

              <option value="Prestado">
                Prestado
              </option>

              <option value="Mantenimiento">
                Mantenimiento
              </option>

              <option value="Baja">
                Baja
              </option>

            </select>

          </div>


          {/* =================================================
              TABLA
          ================================================== */}

          <div className="table-container">

            <table className="inventory-table">

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
                    N.º Serie
                  </th>

                  <th>
                    Estado
                  </th>

                  <th>
                    Ubicación
                  </th>

                  <th>
                    Acciones
                  </th>

                </tr>

              </thead>


              <tbody>

                {instrumentosFiltrados.length ===
                0 ? (

                  <tr>

                    <td
                      colSpan="8"
                      className="empty-table"
                    >

                      <Archive size={42} />

                      <strong>
                        No hay instrumentos
                      </strong>

                      <span>

                        {busqueda ||
                        filtroEstado !==
                          "Todos"

                          ? "No se encontraron instrumentos con los filtros seleccionados."

                          : "Todavía no has registrado instrumentos."}

                      </span>


                      {!busqueda &&
                        filtroEstado ===
                          "Todos" && (

                        <button
                          className="primary-button"
                          onClick={
                            abrirNuevoInstrumento
                          }
                          type="button"
                        >

                          <Plus size={18} />

                          Registrar instrumento

                        </button>

                      )}

                    </td>

                  </tr>

                ) : (

                  instrumentosFiltrados.map(
                    (instrumento) => (

                      <tr
                        key={
                          instrumento.id
                        }
                      >

                        <td>

                          <strong className="instrument-code">

                            {
                              instrumento.codigo
                            }

                          </strong>

                        </td>


                        <td>

                          <div className="instrument-name">

                            <div className="table-instrument-icon">

                              {instrumento.tipo
                                ?.toLowerCase()
                                .includes(
                                  "percusión"
                                ) ||
                              instrumento.tipo
                                ?.toLowerCase()
                                .includes(
                                  "percusion"
                                )
                                ? "🥁"

                                : instrumento.tipo
                                    ?.toLowerCase()
                                    .includes(
                                      "madera"
                                    )

                                ? "🎷"

                                : "🎺"}

                            </div>


                            <div>

                              <strong>

                                {
                                  instrumento.instrumento
                                }

                              </strong>

                            </div>

                          </div>

                        </td>


                        <td>

                          {
                            instrumento.tipo ||
                            "—"
                          }

                        </td>


                        <td>

                          {
                            instrumento.marca ||
                            "—"
                          }

                        </td>


                        <td>

                          {
                            instrumento.serie ||
                            "—"
                          }

                        </td>


                        <td>

                          <span
                            className={`status ${obtenerClaseEstado(
                              instrumento.estado
                            )}`}
                          >

                            {
                              instrumento.estado ||
                              "Sin estado"
                            }

                          </span>

                        </td>


                        <td>

                          {
                            instrumento.ubicacion ||
                            "—"
                          }

                        </td>


                        <td>

                          <div className="table-actions">

                            <button
                              className="action-button edit"
                              onClick={() =>
                                editarInstrumento(
                                  instrumento
                                )
                              }
                              type="button"
                              title="Editar instrumento"
                            >

                              <Edit size={17} />

                            </button>


                            <button
                              className="action-button delete"
                              onClick={() =>
                                eliminarInstrumento(
                                  instrumento.id
                                )
                              }
                              type="button"
                              title="Eliminar instrumento"
                            >

                              <Trash2 size={17} />

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


          {/* =================================================
              PIE
          ================================================== */}

          <div className="table-footer">

            <span>

              Mostrando{" "}

              <strong>
                {instrumentosFiltrados.length}
              </strong>{" "}

              de{" "}

              <strong>
                {instrumentos.length}
              </strong>{" "}

              instrumentos

            </span>

          </div>

        </section>

      </main>


      {/* ====================================================
          MODAL
      ===================================================== */}

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

          <div className="instrument-modal">


            {/* HEADER */}

            <div className="modal-header">

              <div>

                <h2>

                  {modoEdicion
                    ? "Editar instrumento"
                    : "Nuevo instrumento"}

                </h2>

                <p>

                  {modoEdicion
                    ? "Actualiza la información del instrumento."

                    : "Registra un nuevo instrumento en el inventario."}

                </p>

              </div>


              <button
                className="modal-close"
                onClick={cerrarModal}
                type="button"
              >

                <X size={21} />

              </button>

            </div>


            {/* FORMULARIO */}

            <form
              className="instrument-form"
              onSubmit={
                guardarInstrumento
              }
            >

              <div className="form-grid">


                {/* CÓDIGO */}

                <div className="form-group">

                  <label htmlFor="codigo">
                    Código *
                  </label>

                  <input
                    id="codigo"
                    name="codigo"
                    type="text"
                    placeholder="Ej: TR-001"
                    value={
                      instrumentoActual.codigo
                    }
                    onChange={
                      manejarCambio
                    }
                    autoComplete="off"
                  />

                </div>


                {/* INSTRUMENTO */}

                <div className="form-group">

                  <label htmlFor="instrumento">
                    Instrumento *
                  </label>

                  <input
                    id="instrumento"
                    name="instrumento"
                    type="text"
                    placeholder="Ej: Trompeta"
                    value={
                      instrumentoActual.instrumento
                    }
                    onChange={
                      manejarCambio
                    }
                  />

                </div>


                {/* TIPO */}

                <div className="form-group">

                  <label htmlFor="tipo">
                    Tipo *
                  </label>

                  <select
                    id="tipo"
                    name="tipo"
                    value={
                      instrumentoActual.tipo
                    }
                    onChange={
                      manejarCambio
                    }
                  >

                    <option value="">
                      Seleccionar tipo
                    </option>

                    <option value="Viento metal">
                      Viento metal
                    </option>

                    <option value="Viento madera">
                      Viento madera
                    </option>

                    <option value="Percusión">
                      Percusión
                    </option>

                    <option value="Cuerda">
                      Cuerda
                    </option>

                    <option value="Otro">
                      Otro
                    </option>

                  </select>

                </div>


                {/* MARCA */}

                <div className="form-group">

                  <label htmlFor="marca">
                    Marca
                  </label>

                  <input
                    id="marca"
                    name="marca"
                    type="text"
                    placeholder="Ej: Yamaha"
                    value={
                      instrumentoActual.marca
                    }
                    onChange={
                      manejarCambio
                    }
                  />

                </div>


                {/* SERIE */}

                <div className="form-group">

                  <label htmlFor="serie">
                    Número de serie
                  </label>

                  <input
                    id="serie"
                    name="serie"
                    type="text"
                    placeholder="Ej: 123456789"
                    value={
                      instrumentoActual.serie
                    }
                    onChange={
                      manejarCambio
                    }
                  />

                </div>


                {/* ESTADO */}

                <div className="form-group">

                  <label htmlFor="estado">
                    Estado *
                  </label>

                  <select
                    id="estado"
                    name="estado"
                    value={
                      instrumentoActual.estado
                    }
                    onChange={
                      manejarCambio
                    }
                  >

                    <option value="Disponible">
                      Disponible
                    </option>

                    <option value="Prestado">
                      Prestado
                    </option>

                    <option value="Mantenimiento">
                      Mantenimiento
                    </option>

                    <option value="Baja">
                      Baja
                    </option>

                  </select>

                </div>


                {/* UBICACIÓN */}

                <div className="form-group">

                  <label htmlFor="ubicacion">
                    Ubicación
                  </label>

                  <input
                    id="ubicacion"
                    name="ubicacion"
                    type="text"
                    placeholder="Ej: Sala de música"
                    value={
                      instrumentoActual.ubicacion
                    }
                    onChange={
                      manejarCambio
                    }
                  />

                </div>

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
                  placeholder="Escribe aquí cualquier observación sobre el instrumento..."
                  value={
                    instrumentoActual.observaciones
                  }
                  onChange={
                    manejarCambio
                  }
                />

              </div>


              {/* BOTONES */}

              <div className="modal-actions">

                <button
                  type="button"
                  className="secondary-button"
                  onClick={
                    cerrarModal
                  }
                >
                  Cancelar
                </button>


                <button
                  type="submit"
                  className="primary-button"
                >

                  {modoEdicion
                    ? "Guardar cambios"
                    : "Registrar instrumento"}

                </button>

              </div>

            </form>

          </div>

        </div>

      )}

    </div>
  );
}

export default Inventario;