<?php

header("Content-Type: application/json; charset=UTF-8");

require_once "../config/database.php";

try {

    $consulta = $pdo->query("SELECT DATABASE() AS base_datos");

    $resultado = $consulta->fetch();

    echo json_encode([
        "success" => true,
        "message" => "Conexión con MySQL exitosa.",
        "database" => $resultado["base_datos"]
    ]);

} catch (PDOException $error) {

    http_response_code(500);

    echo json_encode([
        "success" => false,
        "message" => "Error al consultar MySQL.",
        "error" => $error->getMessage()
    ]);
}