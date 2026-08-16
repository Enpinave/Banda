<?php

declare(strict_types=1);

// ============================================================
// BANDA CONTROL
// RUTAS DE INSTRUMENTOS
// ============================================================

header("Content-Type: application/json; charset=UTF-8");

header(
    "Access-Control-Allow-Origin: http://localhost:5173"
);

header(
    "Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS"
);

header(
    "Access-Control-Allow-Headers: Content-Type, Authorization"
);

// ============================================================
// CORS - OPTIONS
// ============================================================

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

require_once __DIR__ . "/../controllers/InstrumentoController.php";

// ============================================================
// CONTROLADOR
// ============================================================

$controller = new InstrumentoController($pdo);

// ============================================================
// MÉTODO HTTP
// ============================================================

$metodo = $_SERVER["REQUEST_METHOD"];

// ============================================================
// ID
// ============================================================

$id = null;

if (isset($_GET["id"])) {
    $id = filter_var(
        $_GET["id"],
        FILTER_VALIDATE_INT
    );

    if ($id === false || $id <= 0) {
        http_response_code(400);

        echo json_encode([
            "success" => false,
            "message" => "El ID proporcionado no es válido."
        ], JSON_UNESCAPED_UNICODE);

        exit;
    }
}

// ============================================================
// ROUTER
// ============================================================

switch ($metodo) {

    // --------------------------------------------------------
    // GET
    // --------------------------------------------------------

    case "GET":

        if ($id !== null) {
            $controller->obtener($id);
        }

        $controller->listar();

        break;

    // --------------------------------------------------------
    // POST
    // --------------------------------------------------------

    case "POST":

        $controller->crear();

        break;

    // --------------------------------------------------------
    // PUT
    // --------------------------------------------------------

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

    // --------------------------------------------------------
    // DELETE
    // --------------------------------------------------------

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

    // --------------------------------------------------------
    // MÉTODO NO PERMITIDO
    // --------------------------------------------------------

    default:

        http_response_code(405);

        echo json_encode([
            "success" => false,
            "message" => "Método HTTP no permitido."
        ], JSON_UNESCAPED_UNICODE);

        exit;
}