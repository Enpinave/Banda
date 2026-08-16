<?php

declare(strict_types=1);

// ============================================================
// BANDA CONTROL
// MODELO DE INSTRUMENTOS
// ============================================================

class Instrumento
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
                codigo,
                nombre,
                tipo,
                marca,
                modelo,
                numero_serie,
                estado,
                ubicacion,
                observaciones,
                fecha_registro,
                fecha_actualizacion
            FROM instrumentos
            ORDER BY id DESC
        ";

        $consulta = $this->pdo->query($sql);

        return $consulta->fetchAll();
    }

    // ========================================================
    // BUSCAR POR ID
    // ========================================================

    public function buscarPorId(int $id): ?array
    {
        $sql = "
            SELECT
                id,
                codigo,
                nombre,
                tipo,
                marca,
                modelo,
                numero_serie,
                estado,
                ubicacion,
                observaciones,
                fecha_registro,
                fecha_actualizacion
            FROM instrumentos
            WHERE id = ?
            LIMIT 1
        ";

        $consulta = $this->pdo->prepare($sql);

        $consulta->execute([$id]);

        $instrumento = $consulta->fetch();

        return $instrumento ?: null;
    }

    // ========================================================
    // BUSCAR POR CÓDIGO
    // ========================================================

    public function buscarPorCodigo(
        string $codigo,
        ?int $excluirId = null
    ): ?array {

        if ($excluirId === null) {

            $sql = "
                SELECT id
                FROM instrumentos
                WHERE codigo = ?
                LIMIT 1
            ";

            $consulta = $this->pdo->prepare($sql);

            $consulta->execute([$codigo]);

        } else {

            $sql = "
                SELECT id
                FROM instrumentos
                WHERE codigo = ?
                AND id <> ?
                LIMIT 1
            ";

            $consulta = $this->pdo->prepare($sql);

            $consulta->execute([
                $codigo,
                $excluirId
            ]);
        }

        $resultado = $consulta->fetch();

        return $resultado ?: null;
    }

    // ========================================================
    // CREAR
    // ========================================================

    public function crear(array $datos): int
    {
        $sql = "
            INSERT INTO instrumentos (
                codigo,
                nombre,
                tipo,
                marca,
                modelo,
                numero_serie,
                estado,
                ubicacion,
                observaciones
            )
            VALUES (
                :codigo,
                :nombre,
                :tipo,
                :marca,
                :modelo,
                :numero_serie,
                :estado,
                :ubicacion,
                :observaciones
            )
        ";

        $consulta = $this->pdo->prepare($sql);

        $consulta->execute([
            ":codigo" => $datos["codigo"],
            ":nombre" => $datos["nombre"],
            ":tipo" => $datos["tipo"],
            ":marca" => $datos["marca"],
            ":modelo" => $datos["modelo"],
            ":numero_serie" => $datos["numero_serie"],
            ":estado" => $datos["estado"],
            ":ubicacion" => $datos["ubicacion"],
            ":observaciones" => $datos["observaciones"],
        ]);

        return (int) $this->pdo->lastInsertId();
    }

    // ========================================================
    // ACTUALIZAR
    // ========================================================

    public function actualizar(
        int $id,
        array $datos
    ): bool {

        $sql = "
            UPDATE instrumentos
            SET
                codigo = :codigo,
                nombre = :nombre,
                tipo = :tipo,
                marca = :marca,
                modelo = :modelo,
                numero_serie = :numero_serie,
                estado = :estado,
                ubicacion = :ubicacion,
                observaciones = :observaciones
            WHERE id = :id
        ";

        $consulta = $this->pdo->prepare($sql);

        return $consulta->execute([
            ":codigo" => $datos["codigo"],
            ":nombre" => $datos["nombre"],
            ":tipo" => $datos["tipo"],
            ":marca" => $datos["marca"],
            ":modelo" => $datos["modelo"],
            ":numero_serie" => $datos["numero_serie"],
            ":estado" => $datos["estado"],
            ":ubicacion" => $datos["ubicacion"],
            ":observaciones" => $datos["observaciones"],
            ":id" => $id,
        ]);
    }

    // ========================================================
    // ELIMINAR
    // ========================================================

    public function eliminar(int $id): bool
    {
        $sql = "
            DELETE FROM instrumentos
            WHERE id = ?
        ";

        $consulta = $this->pdo->prepare($sql);

        return $consulta->execute([$id]);
    }

    // ========================================================
    // ESTADÍSTICAS
    // ========================================================

    public function estadisticas(): array
    {
        $sql = "
            SELECT
                COUNT(*) AS total,

                SUM(
                    estado = 'Disponible'
                ) AS disponibles,

                SUM(
                    estado = 'Prestado'
                ) AS prestados,

                SUM(
                    estado = 'Mantenimiento'
                ) AS mantenimiento,

                SUM(
                    estado = 'Baja'
                ) AS baja

            FROM instrumentos
        ";

        $consulta = $this->pdo->query($sql);

        $resultado = $consulta->fetch();

        return [
            "total" => (int) ($resultado["total"] ?? 0),
            "disponibles" => (int) ($resultado["disponibles"] ?? 0),
            "prestados" => (int) ($resultado["prestados"] ?? 0),
            "mantenimiento" => (int) ($resultado["mantenimiento"] ?? 0),
            "baja" => (int) ($resultado["baja"] ?? 0),
        ];
    }
}