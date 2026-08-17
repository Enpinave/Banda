// ============================================================
// BANDA CONTROL
// SERVICIO DE PRÉSTAMOS
// ============================================================

const API_URL = "http://localhost/banda/backend/routes/prestamos.php";

// ============================================================
// PROCESAR RESPUESTA
// ============================================================

async function procesarRespuesta(response) {
    const texto = await response.text();

    let resultado;

    try {
        resultado = JSON.parse(texto);
    } catch (error) {
        console.error("Respuesta no válida del servidor:", texto);

        throw new Error(
            "El servidor no devolvió una respuesta JSON válida."
        );
    }

    if (!response.ok || resultado.success === false) {
        throw new Error(
            resultado.message ||
            "Ocurrió un error en la solicitud."
        );
    }

    return resultado;
}

// ============================================================
// OBTENER TODOS LOS PRÉSTAMOS
// ============================================================

export async function obtenerPrestamos() {
    const response = await fetch(API_URL, {
        method: "GET",
        headers: {
            Accept: "application/json"
        }
    });

    const resultado = await procesarRespuesta(response);

    return resultado.data || [];
}

// ============================================================
// OBTENER UN PRÉSTAMO
// ============================================================

export async function obtenerPrestamo(id) {
    if (!id) {
        throw new Error(
            "El ID del préstamo es obligatorio."
        );
    }

    const response = await fetch(
        `${API_URL}?id=${encodeURIComponent(id)}`,
        {
            method: "GET",
            headers: {
                Accept: "application/json"
            }
        }
    );

    const resultado = await procesarRespuesta(response);

    return resultado.data;
}

// ============================================================
// CREAR PRÉSTAMO
// ============================================================

export async function crearPrestamo(datos) {
    const response = await fetch(API_URL, {
        method: "POST",

        headers: {
            "Content-Type": "application/json",
            Accept: "application/json"
        },

        body: JSON.stringify(datos)
    });

    const resultado = await procesarRespuesta(response);

    return resultado.data;
}

// ============================================================
// DEVOLVER PRÉSTAMO
// ============================================================

export async function devolverPrestamo(
    id,
    observaciones = ""
) {
    if (!id) {
        throw new Error(
            "El ID del préstamo es obligatorio."
        );
    }

    const response = await fetch(
        `${API_URL}?accion=devolver&id=${encodeURIComponent(id)}`,
        {
            method: "POST",

            headers: {
                "Content-Type": "application/json",
                Accept: "application/json"
            },

            body: JSON.stringify({
                observaciones
            })
        }
    );

    const resultado = await procesarRespuesta(response);

    return resultado.data;
}

// ============================================================
// ELIMINAR PRÉSTAMO
// ============================================================

export async function eliminarPrestamo(id) {
    if (!id) {
        throw new Error(
            "El ID del préstamo es obligatorio."
        );
    }

    const response = await fetch(
        `${API_URL}?id=${encodeURIComponent(id)}`,
        {
            method: "DELETE",

            headers: {
                Accept: "application/json"
            }
        }
    );

    return procesarRespuesta(response);
}