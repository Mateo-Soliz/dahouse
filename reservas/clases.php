<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

$fecha_inicio = isset($_GET['fecha-inicio']) ? $_GET['fecha-inicio'] : null;
$fecha_fin = isset($_GET['fecha-fin']) ? $_GET['fecha-fin'] : null;
$email = isset($_GET['email']) ? trim($_GET['email'], '"') : null;

if (!$fecha_inicio || !$fecha_fin) {
    echo json_encode(["error" => "Faltan parámetros: fecha-inicio y/o fecha-fin"]);
    http_response_code(400);
    exit;
}

$h_bloqueadas = [];
$reservas = [];

if ($email) {
    $json_reservas = 'C:\Users\ROBERTOCONNOLLYRAMIS\Desktop\DaHouse\db\reservas.json';

    if (file_exists($json_reservas)) {
        $json_data = file_get_contents($json_reservas);
        $reservas_data = json_decode($json_data, true);

        if (isset($reservas_data[$email])) {
            $reservas = array_filter($reservas_data[$email], function ($reserva) use ($fecha_inicio, $fecha_fin) {
                return $reserva['dia'] >= $fecha_inicio && $reserva['dia'] <= $fecha_fin;
            });
        }
    }
}

echo json_encode([
    "h_bloqueadas" => $h_bloqueadas,
    "reservas" => array_values($reservas),
]);
exit;
?>
