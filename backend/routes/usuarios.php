<?php

declare(strict_types=1);

// ============================================================
// BANDA CONTROL
// RUTAS DE USUARIOS
// ============================================================

header(
    "Content-Type: application/json; charset=UTF-8"
);

header(
    "Access-Control-Allow-Origin: http://localhost:5173"
);

header(
    "Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS"
);

header(
    "Access-Control-Allow-Headers: Content-Type, Authorization"
);

if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    http_response_code(204);
    exit;
}

// ============================================================
// CONEXIÓN
// ============================================================

require_once __DIR__ . "/../database.php";

// ============================================================
// CONTROLADOR
// ============================================================

require_once __DIR__ . "/../controllers/UsuarioController.php";

$controller =
    new UsuarioController($pdo);

// ============================================================
// MÉTODO
// ============================================================

$metodo =
    $_SERVER["REQUEST_METHOD"];

// ============================================================
// ID
// ============================================================

$id = null;

if (isset($_GET["id"])) {

    $id = filter_var(
        $_GET["id"],
        FILTER_VALIDATE_INT
    );

    if (
        $id === false ||
        $id <= 0
    ) {

        http_response_code(400);

        echo json_encode([
            "success" => false,
            "message" => "El ID no es válido."
        ], JSON_UNESCAPED_UNICODE);

        exit;
    }
}

// ============================================================
// ROUTER
// ============================================================

switch ($metodo) {

    case "GET":

        if ($id !== null) {
            $controller->obtener($id);
        }

        $controller->listar();

        break;

    case "POST":

        $controller->crear();

        break;

    case "PUT":

        if ($id === null) {

            http_response_code(400);

            echo json_encode([
                "success" => false,
                "message" => "Debes proporcionar un ID."
            ], JSON_UNESCAPED_UNICODE);

            exit;
        }

        $controller->actualizar($id);

        break;

    case "DELETE":

        if ($id === null) {

            http_response_code(400);

            echo json_encode([
                "success" => false,
                "message" => "Debes proporcionar un ID."
            ], JSON_UNESCAPED_UNICODE);

            exit;
        }

        $controller->eliminar($id);

        break;

    default:

        http_response_code(405);

        echo json_encode([
            "success" => false,
            "message" => "Método HTTP no permitido."
        ], JSON_UNESCAPED_UNICODE);

        exit;
}