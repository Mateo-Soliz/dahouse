<?php
$json_reservas = 'C:\Users\ROBERTOCONNOLLYRAMIS\Desktop\DaHouse\db\reservas.json';
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

$datos_input = json_decode(file_get_contents('php://input'), true);

if (isset($datos_input['correo']) && isset($datos_input['reservas'])) {
    $correo = $datos_input['correo'];
    $reservas = $datos_input['reservas'];

    if (file_exists($json_reservas)) {
        $json_data = file_get_contents($json_reservas);
        $reservas_data = json_decode($json_data, true);

        if (isset($reservas_data[$correo])) {
            $reservas_data[$correo] = array_merge($reservas_data[$correo], $reservas);
        } else {
            $reservas_data[$correo] = $reservas;
        }
    } else {
        $reservas_data = [$correo => $reservas];
    }

    if (file_put_contents($json_reservas, json_encode($reservas_data, JSON_PRETTY_PRINT))) {
        echo json_encode([
            "message" => "Reserva guardada correctamente",
            "status" => "success",
            "correo" => $correo,
            "reservas" => $reservas
        ]);
    } else {
        echo json_encode([
            "message" => "Error al guardar el archivo reservas.json",
            "status" => "error"
        ]);
        http_response_code(500);
    }
} else {
    echo json_encode([
        "message" => "Faltan datos: correo o reservas",
        "status" => "error"
    ]);
    http_response_code(400);
}

exit;
?>
