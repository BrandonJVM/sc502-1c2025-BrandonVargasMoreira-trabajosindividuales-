<?php
header('Content-Type: application/json');

$host = '127.0.0.1';
$dbname = 'tareas';
$user = 'root';
$pass = '';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname", $user, $pass);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Error en la conexión: ' . $e->getMessage()]);
    exit;
}

// Obtener datos
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $action = $_GET['action'] ?? '';

    if ($action === 'tareas') {
        $stmt = $pdo->query("SELECT * FROM tareas");
        $tareas = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($tareas);
        exit;
    }

    if ($action === 'comentarios' && isset($_GET['tarea_id'])) {
        $tarea_id = (int) $_GET['tarea_id'];
        $stmt = $pdo->prepare("SELECT * FROM comentarios WHERE tarea_id = ?");
        $stmt->execute([$tarea_id]);
        $comentarios = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($comentarios);
        exit;
    }

    http_response_code(400);
    echo json_encode(['error' => 'Acción no válida o falta parámetro']);
    exit;
}

// Crear tarea
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $action = $_GET['action'] ?? '';

    if ($action === 'crear_tarea') {
        $titulo = $_POST['titulo'] ?? '';
        $descripcion = $_POST['descripcion'] ?? '';
        $fecha = $_POST['fecha_limite'] ?? '';

        if ($titulo && $descripcion && $fecha) {
            $stmt = $pdo->prepare("INSERT INTO tareas (titulo, descripcion, fecha_limite) VALUES (?, ?, ?)");
            $stmt->execute([$titulo, $descripcion, $fecha]);

            echo json_encode(['mensaje' => 'Tarea creada con éxito']);
        } else {
            http_response_code(400);
            echo json_encode(['error' => 'Faltan campos']);
        }

        exit;
    }
}
