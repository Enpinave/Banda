<?php

declare(strict_types=1);

// ============================================================
// BANDA CONTROL
// MODELO DE USUARIOS
// ============================================================

class Usuario
{
    private PDO $pdo;

    public function __construct(PDO $pdo)
    {
        $this->pdo = $pdo;
    }

    // ========================================================
    // LISTAR
    // ========================================================

    public function listar(): array
    {
        $sql = "
            SELECT
                id,
                nombre,
                apellido,
                usuario,
                email,
                rol,
                estado,
                fecha_creacion,
                fecha_actualizacion

            FROM usuarios

            ORDER BY id DESC
        ";

        $stmt = $this->pdo->query($sql);

        return $stmt->fetchAll(
            PDO::FETCH_ASSOC
        );
    }

    // ========================================================
    // BUSCAR
    // ========================================================

    public function buscarPorId(
        int $id
    ): ?array {

        $sql = "
            SELECT
                id,
                nombre,
                apellido,
                usuario,
                email,
                rol,
                estado,
                fecha_creacion,
                fecha_actualizacion

            FROM usuarios

            WHERE id = :id

            LIMIT 1
        ";

        $stmt = $this->pdo->prepare($sql);

        $stmt->execute([
            "id" => $id
        ]);

        $resultado =
            $stmt->fetch(PDO::FETCH_ASSOC);

        return $resultado ?: null;
    }

    // ========================================================
    // CREAR
    // ========================================================

    public function crear(
        array $datos
    ): int {

        $sql = "
            INSERT INTO usuarios (
                nombre,
                apellido,
                usuario,
                email,
                password,
                rol,
                estado
            )
            VALUES (
                :nombre,
                :apellido,
                :usuario,
                :email,
                :password,
                :rol,
                :estado
            )
        ";

        $stmt = $this->pdo->prepare($sql);

        $stmt->execute([
            "nombre" =>
                $datos["nombre"],

            "apellido" =>
                $datos["apellido"],

            "usuario" =>
                $datos["usuario"],

            "email" =>
                $datos["email"],

            "password" =>
                password_hash(
                    $datos["password"],
                    PASSWORD_DEFAULT
                ),

            "rol" =>
                $datos["rol"],

            "estado" =>
                $datos["estado"]
        ]);

        return (int)
            $this->pdo->lastInsertId();
    }

    // ========================================================
    // ACTUALIZAR
    // ========================================================

    public function actualizar(
        int $id,
        array $datos
    ): bool {

        $campos = [
            "nombre = :nombre",
            "apellido = :apellido",
            "usuario = :usuario",
            "email = :email",
            "rol = :rol",
            "estado = :estado"
        ];

        $parametros = [
            "id" =>
                $id,

            "nombre" =>
                $datos["nombre"],

            "apellido" =>
                $datos["apellido"],

            "usuario" =>
                $datos["usuario"],

            "email" =>
                $datos["email"],

            "rol" =>
                $datos["rol"],

            "estado" =>
                $datos["estado"]
        ];

        if (
            !empty($datos["password"])
        ) {

            $campos[] =
                "password = :password";

            $parametros["password"] =
                password_hash(
                    $datos["password"],
                    PASSWORD_DEFAULT
                );
        }

        $sql = "
            UPDATE usuarios

            SET
                " .
                implode(
                    ", ",
                    $campos
                ) .

            "

            WHERE id = :id
        ";

        $stmt =
            $this->pdo->prepare($sql);

        return $stmt->execute(
            $parametros
        );
    }

    // ========================================================
    // ELIMINAR
    // ========================================================

    public function eliminar(
        int $id
    ): bool {

        $sql = "
            DELETE FROM usuarios
            WHERE id = :id
        ";

        $stmt =
            $this->pdo->prepare($sql);

        return $stmt->execute([
            "id" => $id
        ]);
    }
}