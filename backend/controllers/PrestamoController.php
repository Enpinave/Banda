<?php

declare(strict_types=1);

// ============================================================
// BANDA CONTROL
// CONTROLADOR DE PRÉSTAMOS
// ============================================================

require_once __DIR__ . "/../models/Prestamo.php";

class PrestamoController
{
    private Prestamo $modelo;

    public function __construct(PDO $pdo)
    {
        $this->modelo = new Prestamo($pdo);
    }

    // ========================================================
    // RESPONDER
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
            "message" => $message
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
    // JSON
    // ========================================================

    private function obtenerDatos(): array
    {
        $contenido = file_get_contents(
            "php://input"
        );

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
                "El JSON enviado no es válido.",
                null,
                400
            );
        }

        return $datos;
    }

    // ========================================================
    // LISTAR
    // ========================================================

    public function listar(): never
    {
        try {

            $this->modelo->actualizarVencidos();

            $prestamos =
                $this->modelo->listar();

            $this->responder(
                true,
                "Préstamos obtenidos correctamente.",
                $prestamos
            );

        } catch (Throwable $error) {

            $this->responder(
                false,
                "Error al obtener los préstamos.",
                null,
                500
            );
        }
    }

    // ========================================================
    // OBTENER
    // ========================================================

    public function obtener(int $id): never
    {
        try {

            $prestamo =
                $this->modelo->buscarPorId($id);

            if ($prestamo === null) {

                $this->responder(
                    false,
                    "Préstamo no encontrado.",
                    null,
                    404
                );
            }

            $this->responder(
                true,
                "Préstamo obtenido correctamente.",
                $prestamo
            );

        } catch (Throwable $error) {

            $this->responder(
                false,
                "Error al obtener el préstamo.",
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

        $instrumentoId =
            (int) ($datos["instrumento_id"] ?? 0);

        $estudianteId =
            (int) ($datos["estudiante_id"] ?? 0);

        $fecha =
            trim(
                (string)
                ($datos["fecha_devolucion_prevista"] ?? "")
            );

        $observaciones =
            trim(
                (string)
                ($datos["observaciones"] ?? "")
            );

        if ($instrumentoId <= 0) {

            $this->responder(
                false,
                "Debes seleccionar un instrumento.",
                null,
                400
            );
        }

        if ($estudianteId <= 0) {

            $this->responder(
                false,
                "Debes seleccionar un estudiante.",
                null,
                400
            );
        }

        if ($fecha === "") {

            $this->responder(
                false,
                "La fecha de devolución es obligatoria.",
                null,
                400
            );
        }

        try {

            $id = $this->modelo->crear([
                "instrumento_id" =>
                    $instrumentoId,

                "estudiante_id" =>
                    $estudianteId,

                "fecha_devolucion_prevista" =>
                    $fecha,

                "observaciones" =>
                    $observaciones !== ""
                        ? $observaciones
                        : null
            ]);

            $prestamo =
                $this->modelo->buscarPorId($id);

            $this->responder(
                true,
                "Préstamo registrado correctamente.",
                $prestamo,
                201
            );

        } catch (Throwable $error) {

            $this->responder(
                false,
                "Error al registrar el préstamo.",
                null,
                500
            );
        }
    }

    // ========================================================
    // DEVOLVER
    // ========================================================

    public function devolver(int $id): never
    {
        $datos = $this->obtenerDatos();

        $observaciones =
            trim(
                (string)
                ($datos["observaciones"] ?? "")
            );

        try {

            $prestamo =
                $this->modelo->buscarPorId($id);

            if ($prestamo === null) {

                $this->responder(
                    false,
                    "Préstamo no encontrado.",
                    null,
                    404
                );
            }

            if ($prestamo["estado"] === "Devuelto") {

                $this->responder(
                    false,
                    "Este préstamo ya fue devuelto.",
                    null,
                    400
                );
            }

            $this->modelo->devolver(
                $id,
                $observaciones !== ""
                    ? $observaciones
                    : null
            );

            $actualizado =
                $this->modelo->buscarPorId($id);

            $this->responder(
                true,
                "Instrumento devuelto correctamente.",
                $actualizado
            );

        } catch (Throwable $error) {

            $this->responder(
                false,
                "Error al registrar la devolución.",
                null,
                500
            );
        }
    }

    // ========================================================
    // ELIMINAR
    // ========================================================

    public function eliminar(int $id): never
    {
        try {

            $prestamo =
                $this->modelo->buscarPorId($id);

            if ($prestamo === null) {

                $this->responder(
                    false,
                    "Préstamo no encontrado.",
                    null,
                    404
                );
            }

            $this->modelo->eliminar($id);

            $this->responder(
                true,
                "Préstamo eliminado correctamente."
            );

        } catch (Throwable $error) {

            $this->responder(
                false,
                "No se pudo eliminar el préstamo.",
                null,
                500
            );
        }
    }
}