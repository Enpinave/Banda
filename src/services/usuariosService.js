// ============================================================
// BANDA CONTROL
// SERVICIO DE USUARIOS
// ============================================================

const API_URL =
    "http://localhost/banda/backend/usuarios";

// ============================================================
// RESPUESTA
// ============================================================

async function procesarRespuesta(response) {

    const texto =
        await response.text();

    let resultado;

    try {

        resultado =
            JSON.parse(texto);

    } catch {

        console.error(
            "Respuesta del servidor:",
            texto
        );

        throw new Error(
            "El servidor no devolvió JSON válido."
        );
    }

    if (
        !response.ok ||
        resultado.success === false
    ) {

        throw new Error(
            resultado.message ||
            "Error en la solicitud."
        );
    }

    return resultado;
}

// ============================================================
// LISTAR
// ============================================================

export async function obtenerUsuarios() {

    const response =
        await fetch(API_URL, {
            headers: {
                Accept:
                    "application/json"
            }
        });

    const resultado =
        await procesarRespuesta(
            response
        );

    return resultado.data || [];
}

// ============================================================
// CREAR
// ============================================================

export async function crearUsuario(
    datos
) {

    const response =
        await fetch(API_URL, {

            method: "POST",

            headers: {
                "Content-Type":
                    "application/json",

                Accept:
                    "application/json"
            },

            body:
                JSON.stringify(datos)
        });

    const resultado =
        await procesarRespuesta(
            response
        );

    return resultado.data;
}

// ============================================================
// ACTUALIZAR
// ============================================================

export async function actualizarUsuario(
    id,
    datos
) {

    const response =
        await fetch(
            `${API_URL}?id=${id}`,
            {

                method: "PUT",

                headers: {
                    "Content-Type":
                        "application/json",

                    Accept:
                        "application/json"
                },

                body:
                    JSON.stringify(datos)
            }
        );

    const resultado =
        await procesarRespuesta(
            response
        );

    return resultado.data;
}

// ============================================================
// ELIMINAR
// ============================================================

export async function eliminarUsuario(
    id
) {

    const response =
        await fetch(
            `${API_URL}?id=${id}`,
            {
                method: "DELETE",

                headers: {
                    Accept:
                        "application/json"
                }
            }
        );

    return procesarRespuesta(
        response
    );
}