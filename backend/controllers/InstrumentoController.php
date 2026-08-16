<?php

declare(strict_types=1);

// ============================================================
// BANDA CONTROL
// CONTROLADOR DE INSTRUMENTOS
// ============================================================

require_once __DIR__ . "/../models/Instrumento.php";

class InstrumentoController
{
    private Instrumento $modelo;

    public function __construct(PDO $pdo)
    {
        $this->modelo = new Instrumento($pdo);
    }

    // ========================================================
    // RESPUESTA
    // ========================================================

    private function responder(
        bool $success,
        string $message,
        mixed $data = null,
        int $status = 200
    ): never {

        http_response_code($status);

        $respuesta = [
            "success" => $success,
            "message" => $message,
        ];

        if ($data !== null) {
            $respuesta["data"] = $data;
        }

        echo json_encode(
            $respuesta,
            JSON_UNESCAPED_UNICODE
        );

        exit;
    }

    // ========================================================
    // LEER JSON
    // ========================================================

    private function obtenerDatos(): array
    {
        $contenido = file_get_contents("php://input");

        if (!$contenido) {
            return [];
        }

        $datos = json_decode(
            $contenido,
            true
        );

        if (!is_array($datos)) {

            $this->responder(
                false,
                "El cuerpo de la solicitud no contiene JSON válido.",
                null,
                400
            );
        }

        return $datos;
    }

    // ========================================================
    // NORMALIZAR DATOS
    // ========================================================

    private function prepararDatos(
        array $datos
    ): array {

        $estado = trim(
            (string) ($datos["estado"] ?? "Disponible")
        );

        return [
            "codigo" => trim(
                (string) ($datos["codigo"] ?? "")
            ),

            "nombre" => trim(
                (string) ($datos["nombre"] ?? "")
            ),

            "tipo" => trim(
                (string) ($datos["tipo"] ?? "")
            ),

            "marca" => $this->valorNulo(
                $datos["marca"] ?? null
            ),

            "modelo" => $this->valorNulo(
                $datos["modelo"] ?? null
            ),

            "numero_serie" => $this->valorNulo(
                $datos["numero_serie"] ?? null
            ),

            "estado" => $estado,

            "ubicacion" => $this->valorNulo(
                $datos["ubicacion"] ?? null
            ),

            "observaciones" => $this->valorNulo(
                $datos["observaciones"] ?? null
            ),
        ];
    }

    // ========================================================
    // VALOR NULO
    // ========================================================

    private function valorNulo(
        mixed $valor
    ): ?string {

        if ($valor === null) {
            return null;
        }

        $valor = trim((string) $valor);

        return $valor === "" ? null : $valor;
    }

    // ========================================================
    // VALIDAR
    // ========================================================

    private function validar(
        array $datos
    ): void {

        if ($datos["codigo"] === "") {

            $this->responder(
                false,
                "El código del instrumento es obligatorio.",
                null,
                400
            );
        }

        if ($datos["nombre"] === "") {

            $this->responder(
                false,
                "El nombre del instrumento es obligatorio.",
                null,
                400
            );
        }

        if ($datos["tipo"] === "") {

            $this->responder(
                false,
                "El tipo de instrumento es obligatorio.",
                null,
                400
            );
        }

        $estadosPermitidos = [
            "Disponible",
            "Prestado",
            "Mantenimiento",
            "Baja"
        ];

        if (
            !in_array(
                $datos["estado"],
                $estadosPermitidos,
                true
            )
        ) {

            $this->responder(
                false,
                "El estado del instrumento no es válido.",
                null,
                400
            );
        }
    }

    // ========================================================
    // LISTAR
    // ========================================================

    public function listar(): never
    {
        try {

            $instrumentos =
                $this->modelo->listar();

            $this->responder(
                true,
                "Instrumentos obtenidos correctamente.",
                $instrumentos
            );

        } catch (Throwable $error) {

            $this->responder(
                false,
                "Error al obtener los instrumentos.",
                null,
                500
            );
        }
    }

    // ========================================================
    // OBTENER
    // ========================================================

    public function obtener(
        int $id
    ): never {

        try {

            $instrumento =
                $this->modelo->buscarPorId($id);

            if ($instrumento === null) {

                $this->responder(
                    false,
                    "Instrumento no encontrado.",
                    null,
                    404
                );
            }

            $this->responder(
                true,
                "Instrumento obtenido correctamente.",
                $instrumento
            );

        } catch (Throwable $error) {

            $this->responder(
                false,
                "Error al obtener el instrumento.",
                null,
                500
            );
        }
    }

    // ========================================================
    // CREAR
    // ========================================================

    public function crear(): never
    {
        $datos = $this->obtenerDatos();

        $datos = $this->prepararDatos($datos);

        $this->validar($datos);

        try {

            $existente =
                $this->modelo->buscarPorCodigo(
                    $datos["codigo"]
                );

            if ($existente !== null) {

                $this->responder(
                    false,
                    "Ya existe un instrumento con ese código.",
                    null,
                    409
                );
            }

            $id =
                $this->modelo->crear($datos);

            $instrumento =
                $this->modelo->buscarPorId($id);

            $this->responder(
                true,
                "Instrumento registrado correctamente.",
                $instrumento,
                201
            );

        } catch (Throwable $error) {

            $this->responder(
                false,
                "Error al registrar el instrumento.",
                null,
                500
            );
        }
    }

    // ========================================================
    // ACTUALIZAR
    // ========================================================

    public function actualizar(
        int $id
    ): never {

        $datos = $this->obtenerDatos();

        $datos = $this->prepararDatos($datos);

        $this->validar($datos);

        try {

            $instrumento =
                $this->modelo->buscarPorId($id);

            if ($instrumento === null) {

                $this->responder(
                    false,
                    "Instrumento no encontrado.",
                    null,
                    404
                );
            }

            $existente =
                $this->modelo->buscarPorCodigo(
                    $datos["codigo"],
                    $id
                );

            if ($existente !== null) {

                $this->responder(
                    false,
                    "Ya existe otro instrumento con ese código.",
                    null,
                    409
                );
            }

            $this->modelo->actualizar(
                $id,
                $datos
            );

            $actualizado =
                $this->modelo->buscarPorId($id);

            $this->responder(
                true,
                "Instrumento actualizado correctamente.",
                $actualizado
            );

        } catch (Throwable $error) {

            $this->responder(
                false,
                "Error al actualizar el instrumento.",
                null,
                500
            );
        }
    }

    // ========================================================
    // ELIMINAR
    // ========================================================

    public function eliminar(
        int $id
    ): never {

        try {

            $instrumento =
                $this->modelo->buscarPorId($id);

            if ($instrumento === null) {

                $this->responder(
                    false,
                    "Instrumento no encontrado.",
                    null,
                    404
                );
            }

            $this->modelo->eliminar($id);

            $this->responder(
                true,
                "Instrumento eliminado correctamente."
            );

        } catch (Throwable $error) {

            $this->responder(
                false,
                "Error al eliminar el instrumento.",
                null,
                500
            );
        }
    }

    // ========================================================
    // ESTADÍSTICAS
    // ========================================================

    public function estadisticas(): never
    {
        try {

            $estadisticas =
                $this->modelo->estadisticas();

            $this->responder(
                true,
                "Estadísticas obtenidas correctamente.",
                $estadisticas
            );

        } catch (Throwable $error) {

            $this->responder(
                false,
                "Error al obtener las estadísticas.",
                null,
                500
            );
        }
    }
}