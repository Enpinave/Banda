<?php

declare(strict_types=1);

// ============================================================
// BANDA CONTROL
// API PRINCIPAL
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

header(
    "Access-Control-Max-Age: 86400"
);

// ============================================================
// PETICIÓN PREFLIGHT
// ============================================================

if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    http_response_code(204);
    exit;
}

// ============================================================
// RUTA
// ============================================================

$uri = parse_url($_SERVER["REQUEST_URI"], PHP_URL_PATH);

$metodo = $_SERVER["REQUEST_METHOD"];

// ============================================================
// NORMALIZAR RUTA
// ============================================================

$base = "/banda/backend";

if (str_starts_with($uri, $base)) {
    $ruta = substr($uri, strlen($base));
} else {
    $ruta = $uri;
}

$ruta = trim($ruta, "/");

// ============================================================
// RESPUESTA
// ============================================================

function responderApi(
    bool $success,
    string $message,
    mixed $data = null,
    int $status = 200
): never {

    http_response_code($status);

    $respuesta = [
        "success" => $success,
        "message" => $message,
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

// ============================================================
// API PRINCIPAL
// ============================================================

if ($ruta === "") {

    responderApi(
        true,
        "BandaControl API funcionando correctamente.",
        [
            "version" => "1.0.0"
        ]
    );
}

// ============================================================
// RUTA DE INSTRUMENTOS
// ============================================================

if (
    $ruta === "instrumentos" ||
    str_starts_with($ruta, "instrumentos/")
) {

    require_once __DIR__ . "/routes/instrumentos.php";

    exit;
}

// ============================================================
// RUTA NO ENCONTRADA
// ============================================================

responderApi(
    false,
    "Ruta no encontrada.",
    null,
    404
);