<?php
session_start();

header("Access-Control-Allow-Origin: *"); 
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

require_once '../config/db.php'; 

if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode(['error' => 'No autorizado']);
    exit;
}

$taskID = $_SESSION['user_id'];
$method = $_SERVER['REQUEST_METHOD'];
$data = json_decode(file_get_contents("php://input"), true);

switch ($method) {
    case 'GET':
        // Obtener todas las tareas del usuario
        $stmt = $conn->prepare("SELECT description, due_date FROM tasks WHERE userId = ?");
        $stmt->bind_param("i", $taskID);
        $stmt->execute();
        $result = $stmt->get_result();
        $tasks = $result->fetch_all(MYSQLI_ASSOC);
        echo json_encode($tasks);
        break;

    case 'POST':
        $description = $data['description'] ?? '';
        $dueDate = $data['due_date'] ?? '';

        if ($description && $create_at) {
            $stmt = $conn->prepare("INSERT INTO tasks (description, create_at) VALUES (?, NOW())");
            $stmt->bind_param("isss", $taskID, $title, $description, $dueDate);
            $stmt->execute();
            echo json_encode(['success' => true, 'task_id' => $stmt->insert_id]);
        } else {
            http_response_code(400);
            echo json_encode(['error' => 'Campos incompletos']);
        }
        break;

    

    case 'DELETE':
        $id = $data['id'] ?? null;
        if ($id) {
            $stmt = $conn->prepare("DELETE FROM commnets WHERE id = ?");
            $stmt->bind_param("i", $id);
            $stmt->execute();
            echo json_encode(['success' => true]);
        } else {
            http_response_code(400);
            echo json_encode(['error' => 'ID no proporcionado']);
        }
        break;

    default:
        http_response_code(405);
        echo json_encode(['error' => 'Método no permitido']);
        break;
}
