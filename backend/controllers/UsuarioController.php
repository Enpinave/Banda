<?php

declare(strict_types=1);

// ============================================================
// BANDA CONTROL
// CONTROLADOR DE USUARIOS
// ============================================================

require_once __DIR__ . "/../models/Usuario.php";

class UsuarioController
{
    private Usuario $modelo;

    public function __construct(PDO $pdo)
    {
        $this->modelo =
            new Usuario($pdo);
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
        $contenido =
            file_get_contents(
                "php://input"
            );

        if (!$contenido) {
            return [];
        }

        $datos =
            json_decode(
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

            $usuarios =
                $this->modelo->listar();

            $this->responder(
                true,
                "Usuarios obtenidos correctamente.",
                $usuarios
            );

        } catch (Throwable $error) {

            $this->responder(
                false,
                "Error al obtener los usuarios.",
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

            $usuario =
                $this->modelo->buscarPorId(
                    $id
                );

            if ($usuario === null) {

                $this->responder(
                    false,
                    "Usuario no encontrado.",
                    null,
                    404
                );
            }

            $this->responder(
                true,
                "Usuario obtenido correctamente.",
                $usuario
            );

        } catch (Throwable $error) {

            $this->responder(
                false,
                "Error al obtener el usuario.",
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
        $datos =
            $this->obtenerDatos();

        $nombre =
            trim((string)
                ($datos["nombre"] ?? "")
            );

        $apellido =
            trim((string)
                ($datos["apellido"] ?? "")
            );

        $usuario =
            trim((string)
                ($datos["usuario"] ?? "")
            );

        $email =
            trim((string)
                ($datos["email"] ?? "")
            );

        $password =
            (string)
                ($datos["password"] ?? "");

        $rol =
            $datos["rol"] ??
            "estudiante";

        $estado =
            $datos["estado"] ??
            "activo";

        if (
            $nombre === "" ||
            $apellido === "" ||
            $usuario === ""
        ) {

            $this->responder(
                false,
                "Nombre, apellido y usuario son obligatorios.",
                null,
                400
            );
        }

        if ($password === "") {

            $this->responder(
                false,
                "La contraseña es obligatoria.",
                null,
                400
            );
        }

        if (
            !in_array(
                $rol,
                [
                    "admin",
                    "estudiante"
                ],
                true
            )
        ) {

            $this->responder(
                false,
                "El rol no es válido.",
                null,
                400
            );
        }

        if (
            !in_array(
                $estado,
                [
                    "activo",
                    "inactivo"
                ],
                true
            )
        ) {

            $this->responder(
                false,
                "El estado no es válido.",
                null,
                400
            );
        }

        try {

            $id =
                $this->modelo->crear([
                    "nombre" =>
                        $nombre,

                    "apellido" =>
                        $apellido,

                    "usuario" =>
                        $usuario,

                    "email" =>
                        $email !== ""
                            ? $email
                            : null,

                    "password" =>
                        $password,

                    "rol" =>
                        $rol,

                    "estado" =>
                        $estado
                ]);

            $nuevo =
                $this->modelo->buscarPorId(
                    $id
                );

            $this->responder(
                true,
                "Usuario creado correctamente.",
                $nuevo,
                201
            );

        } catch (PDOException $error) {

            if (
                $error->getCode() === "23000"
            ) {

                $this->responder(
                    false,
                    "El usuario o correo ya existe.",
                    null,
                    409
                );
            }

            $this->responder(
                false,
                "Error al crear el usuario.",
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

        $datos =
            $this->obtenerDatos();

        try {

            $usuario =
                $this->modelo->buscarPorId(
                    $id
                );

            if ($usuario === null) {

                $this->responder(
                    false,
                    "Usuario no encontrado.",
                    null,
                    404
                );
            }

            $this->modelo->actualizar(
                $id,
                [
                    "nombre" =>
                        trim(
                            (string)
                            ($datos["nombre"] ?? "")
                        ),

                    "apellido" =>
                        trim(
                            (string)
                            ($datos["apellido"] ?? "")
                        ),

                    "usuario" =>
                        trim(
                            (string)
                            ($datos["usuario"] ?? "")
                        ),

                    "email" =>
                        trim(
                            (string)
                            ($datos["email"] ?? "")
                        ),

                    "password" =>
                        (string)
                        ($datos["password"] ?? ""),

                    "rol" =>
                        $datos["rol"]
                        ?? "estudiante",

                    "estado" =>
                        $datos["estado"]
                        ?? "activo"
                ]
            );

            $actualizado =
                $this->modelo->buscarPorId(
                    $id
                );

            $this->responder(
                true,
                "Usuario actualizado correctamente.",
                $actualizado
            );

        } catch (Throwable $error) {

            $this->responder(
                false,
                "Error al actualizar el usuario.",
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

            $usuario =
                $this->modelo->buscarPorId(
                    $id
                );

            if ($usuario === null) {

                $this->responder(
                    false,
                    "Usuario no encontrado.",
                    null,
                    404
                );
            }

            $this->modelo->eliminar(
                $id
            );

            $this->responder(
                true,
                "Usuario eliminado correctamente."
            );

        } catch (Throwable $error) {

            $this->responder(
                false,
                "No se puede eliminar el usuario. Puede tener préstamos asociados.",
                null,
                409
            );
        }
    }
}