// ============================================================
// BANDA CONTROL
// SERVICIO DE INSTRUMENTOS
// ============================================================

const STORAGE_KEY = "bandacontrol_instrumentos";

// ============================================================
// OBTENER TODOS LOS INSTRUMENTOS
// ============================================================

export function obtenerInstrumentos() {
  try {
    const datos = localStorage.getItem(STORAGE_KEY);

    if (!datos) {
      return [];
    }

    const instrumentos = JSON.parse(datos);

    if (!Array.isArray(instrumentos)) {
      return [];
    }

    return instrumentos;
  } catch (error) {
    console.error(
      "Error al obtener los instrumentos:",
      error
    );

    return [];
  }
}


// ============================================================
// GUARDAR TODOS LOS INSTRUMENTOS
// ============================================================

export function guardarInstrumentos(instrumentos) {
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(instrumentos)
    );

    // Avisar a los demás componentes que hubo cambios
    window.dispatchEvent(
      new Event("instrumentosActualizados")
    );

    return true;
  } catch (error) {
    console.error(
      "Error al guardar los instrumentos:",
      error
    );

    return false;
  }
}


// ============================================================
// GENERAR ID ÚNICO
// ============================================================

function generarId() {
  return (
    Date.now().toString(36) +
    Math.random()
      .toString(36)
      .substring(2, 9)
  );
}


// ============================================================
// AGREGAR INSTRUMENTO
// ============================================================

export function agregarInstrumento(datos) {
  const instrumentos =
    obtenerInstrumentos();

  const nuevoInstrumento = {
    id: generarId(),

    codigo:
      datos.codigo?.trim() || "",

    instrumento:
      datos.instrumento?.trim() || "",

    tipo:
      datos.tipo?.trim() || "",

    marca:
      datos.marca?.trim() || "",

    serie:
      datos.serie?.trim() || "",

    estado:
      datos.estado || "Disponible",

    ubicacion:
      datos.ubicacion?.trim() || "",

    observaciones:
      datos.observaciones?.trim() || "",

    fechaRegistro:
      new Date().toISOString(),
  };

  const nuevaLista = [
    ...instrumentos,
    nuevoInstrumento,
  ];

  guardarInstrumentos(nuevaLista);

  return nuevoInstrumento;
}


// ============================================================
// ACTUALIZAR INSTRUMENTO
// ============================================================

export function actualizarInstrumento(
  id,
  datosActualizados
) {
  const instrumentos =
    obtenerInstrumentos();

  const nuevaLista =
    instrumentos.map((instrumento) => {

      if (instrumento.id !== id) {
        return instrumento;
      }

      return {
        ...instrumento,

        ...datosActualizados,

        codigo:
          datosActualizados.codigo !== undefined
            ? datosActualizados.codigo.trim()
            : instrumento.codigo,

        instrumento:
          datosActualizados.instrumento !== undefined
            ? datosActualizados.instrumento.trim()
            : instrumento.instrumento,

        tipo:
          datosActualizados.tipo !== undefined
            ? datosActualizados.tipo.trim()
            : instrumento.tipo,

        marca:
          datosActualizados.marca !== undefined
            ? datosActualizados.marca.trim()
            : instrumento.marca,

        serie:
          datosActualizados.serie !== undefined
            ? datosActualizados.serie.trim()
            : instrumento.serie,

        ubicacion:
          datosActualizados.ubicacion !== undefined
            ? datosActualizados.ubicacion.trim()
            : instrumento.ubicacion,

        observaciones:
          datosActualizados.observaciones !== undefined
            ? datosActualizados.observaciones.trim()
            : instrumento.observaciones,
      };
    });

  guardarInstrumentos(nuevaLista);

  return nuevaLista;
}


// ============================================================
// ELIMINAR INSTRUMENTO
// ============================================================

export function eliminarInstrumento(id) {
  const instrumentos =
    obtenerInstrumentos();

  const nuevaLista =
    instrumentos.filter(
      (instrumento) =>
        instrumento.id !== id
    );

  guardarInstrumentos(nuevaLista);

  return nuevaLista;
}


// ============================================================
// OBTENER UN INSTRUMENTO POR ID
// ============================================================

export function obtenerInstrumentoPorId(id) {
  const instrumentos =
    obtenerInstrumentos();

  return instrumentos.find(
    (instrumento) =>
      instrumento.id === id
  );
}


// ============================================================
// OBTENER ESTADÍSTICAS
// ============================================================

export function obtenerEstadisticas() {
  const instrumentos =
    obtenerInstrumentos();

  const total =
    instrumentos.length;

  const disponibles =
    instrumentos.filter(
      (instrumento) =>
        instrumento.estado ===
        "Disponible"
    ).length;

  const prestados =
    instrumentos.filter(
      (instrumento) =>
        instrumento.estado ===
        "Prestado"
    ).length;

  const mantenimiento =
    instrumentos.filter(
      (instrumento) =>
        instrumento.estado ===
        "Mantenimiento"
    ).length;

  return {
    total,
    disponibles,
    prestados,
    mantenimiento,
  };
}


// ============================================================
// BUSCAR INSTRUMENTOS
// ============================================================

export function buscarInstrumentos(texto) {
  const instrumentos =
    obtenerInstrumentos();

  const busqueda =
    texto
      ?.toLowerCase()
      .trim() || "";

  if (!busqueda) {
    return instrumentos;
  }

  return instrumentos.filter(
    (instrumento) => {

      return (
        instrumento.codigo
          ?.toLowerCase()
          .includes(busqueda) ||

        instrumento.instrumento
          ?.toLowerCase()
          .includes(busqueda) ||

        instrumento.tipo
          ?.toLowerCase()
          .includes(busqueda) ||

        instrumento.marca
          ?.toLowerCase()
          .includes(busqueda) ||

        instrumento.serie
          ?.toLowerCase()
          .includes(busqueda) ||

        instrumento.ubicacion
          ?.toLowerCase()
          .includes(busqueda)
      );
    }
  );
}


// ============================================================
// FILTRAR POR ESTADO
// ============================================================

export function filtrarPorEstado(estado) {
  const instrumentos =
    obtenerInstrumentos();

  if (
    !estado ||
    estado === "Todos"
  ) {
    return instrumentos;
  }

  return instrumentos.filter(
    (instrumento) =>
      instrumento.estado === estado
  );
}


// ============================================================
// LIMPIAR TODO EL INVENTARIO
// ============================================================
//
// Esta función es solamente para pruebas.
// NO se utiliza normalmente en el sistema.
//

export function limpiarInventario() {
  localStorage.removeItem(
    STORAGE_KEY
  );

  window.dispatchEvent(
    new Event("instrumentosActualizados")
  );
}


// ============================================================
// EXPORTAR LA CLAVE DE ALMACENAMIENTO
// ============================================================

export { STORAGE_KEY };