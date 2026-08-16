<?php

// ============================================================
// BANDA CONTROL
// PRUEBA DE CONEXIÓN A MYSQL
// ============================================================

header("Content-Type: application/json; charset=UTF-8");

// database.php está directamente en:
// backend/database.php

require_once __DIR__ . "/../database.php";

try {

    // Ejecutamos una consulta sencilla
    $consulta = $pdo->query("SELECT DATABASE() AS base_datos");

    $resultado = $consulta->fetch();

    echo json_encode([
        "success" => true,
        "message" => "Conexión a MySQL exitosa.",
        "base_datos" => $resultado["base_datos"],
    ], JSON_UNESCAPED_UNICODE);

} catch (PDOException $error) {

    http_response_code(500);

    echo json_encode([
        "success" => false,
        "message" => "La conexión funcionó, pero la consulta falló.",
        "error" => $error->getMessage()
    ], JSON_UNESCAPED_UNICODE);
}