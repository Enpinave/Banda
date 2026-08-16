<?php

declare(strict_types=1);

// ============================================================
// BANDA CONTROL
// CONEXIÓN A MYSQL
// ============================================================

$host = "localhost";
$usuario = "root";
$password = "";
$baseDatos = "bandacol";

try {
    $pdo = new PDO(
        "mysql:host={$host};dbname={$baseDatos};charset=utf8mb4",
        $usuario,
        $password,
        [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES => false,
        ]
    );
} catch (PDOException $error) {

    http_response_code(500);

    header("Content-Type: application/json; charset=UTF-8");

    echo json_encode(
        [
            "success" => false,
            "message" => "No se pudo conectar con la base de datos.",
        ],
        JSON_UNESCAPED_UNICODE
    );

    exit;
}