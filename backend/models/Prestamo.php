<?php

declare(strict_types=1);

// ============================================================
// BANDA CONTROL
// MODELO DE PRÉSTAMOS
// ============================================================

class Prestamo
{
    private PDO $pdo;

    public function __construct(PDO $pdo)
    {
        $this->pdo = $pdo;
    }

    // ========================================================
    // LISTAR PRÉSTAMOS
    // ========================================================

    public function listar(): array
    {
        $sql = "
            SELECT
                p.id,
                p.instrumento_id,
                p.estudiante_id,
                p.fecha_prestamo,
                p.fecha_devolucion_prevista,
                p.fecha_devolucion_real,
                p.estado,
                p.observaciones,

                i.codigo AS instrumento_codigo,
                i.nombre AS instrumento_nombre,
                i.tipo AS instrumento_tipo,
                i.marca AS instrumento_marca,

                u.nombre AS estudiante_nombre,
                u.apellido AS estudiante_apellido,
                u.usuario AS estudiante_usuario

            FROM prestamos p

            INNER JOIN instrumentos i
                ON i.id = p.instrumento_id

            INNER JOIN usuarios u
                ON u.id = p.estudiante_id

            ORDER BY p.id DESC
        ";

        $stmt = $this->pdo->query($sql);

        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    // ========================================================
    // BUSCAR POR ID
    // ========================================================

    public function buscarPorId(int $id): ?array
    {
        $sql = "
            SELECT
                p.id,
                p.instrumento_id,
                p.estudiante_id,
                p.fecha_prestamo,
                p.fecha_devolucion_prevista,
                p.fecha_devolucion_real,
                p.estado,
                p.observaciones,

                i.codigo AS instrumento_codigo,
                i.nombre AS instrumento_nombre,

                u.nombre AS estudiante_nombre,
                u.apellido AS estudiante_apellido

            FROM prestamos p

            INNER JOIN instrumentos i
                ON i.id = p.instrumento_id

            INNER JOIN usuarios u
                ON u.id = p.estudiante_id

            WHERE p.id = :id

            LIMIT 1
        ";

        $stmt = $this->pdo->prepare($sql);

        $stmt->execute([
            "id" => $id
        ]);

        $resultado = $stmt->fetch(PDO::FETCH_ASSOC);

        return $resultado ?: null;
    }

    // ========================================================
    // CREAR
    // ========================================================

    public function crear(array $datos): int
    {
        $sql = "
            INSERT INTO prestamos (
                instrumento_id,
                estudiante_id,
                fecha_devolucion_prevista,
                estado,
                observaciones
            )
            VALUES (
                :instrumento_id,
                :estudiante_id,
                :fecha_devolucion_prevista,
                'Activo',
                :observaciones
            )
        ";

        $stmt = $this->pdo->prepare($sql);

        $stmt->execute([
            "instrumento_id" =>
                $datos["instrumento_id"],

            "estudiante_id" =>
                $datos["estudiante_id"],

            "fecha_devolucion_prevista" =>
                $datos["fecha_devolucion_prevista"],

            "observaciones" =>
                $datos["observaciones"]
        ]);

        return (int) $this->pdo->lastInsertId();
    }

    // ========================================================
    // DEVOLVER
    // ========================================================

    public function devolver(
        int $id,
        ?string $observaciones
    ): bool {

        $sql = "
            UPDATE prestamos

            SET
                fecha_devolucion_real = NOW(),
                estado = 'Devuelto',
                observaciones = :observaciones

            WHERE id = :id
        ";

        $stmt = $this->pdo->prepare($sql);

        return $stmt->execute([
            "id" => $id,
            "observaciones" => $observaciones
        ]);
    }

    // ========================================================
    // ACTUALIZAR VENCIDOS
    // ========================================================

    public function actualizarVencidos(): void
    {
        $sql = "
            UPDATE prestamos

            SET estado = 'Vencido'

            WHERE estado = 'Activo'

            AND fecha_devolucion_prevista < CURDATE()
        ";

        $this->pdo->exec($sql);
    }

    // ========================================================
    // ELIMINAR
    // ========================================================

    public function eliminar(int $id): bool
    {
        $sql = "
            DELETE FROM prestamos
            WHERE id = :id
        ";

        $stmt = $this->pdo->prepare($sql);

        return $stmt->execute([
            "id" => $id
        ]);
    }
}