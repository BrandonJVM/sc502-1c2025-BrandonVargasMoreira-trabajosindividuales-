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

$userId = $_SESSION['user_id'];
$method = $_SERVER['REQUEST_METHOD'];
$data = json_decode(file_get_contents("php://input"), true);

switch ($method) {
    case 'GET':
        if (isset($_GET['taskId'])) {// si se optiene un taskid
            $taskId = $_GET['taskId'];// se almacena el task id en una variable 
            $stmt = $conn->prepare("SELECT id, content, created_at FROM comments WHERE taskId = ?");// se envia el query 
            $stmt->bind_param("i", $taskId);// se sustituyen los parametros
            $stmt->execute();
            $result = $stmt->get_result();
            $comments = $result->fetch_all(MYSQLI_ASSOC);
            echo json_encode($comments);
        } 
        break;

    case 'POST':// metodo para enviar los comentario 
        $taskId = $data['taskId'] ?? null; // se optiene el task id del body
        $description = $data['description'] ?? '';// se optiene el contenido del body

        if ($taskId && $condescriptiontent) {// si hay info 
            $stmt = $conn->prepare("INSERT INTO comments (taskId, description, create_at) VALUES (?, ?, NOW())");// se hace el insert y aparte se agrega la fecha de hoy
            $stmt->bind_param("iis", $taskId,$description);
            $stmt->execute();
            echo json_encode(['success' => true, 'id' => $stmt->insert_id]);
        } else {
            http_response_code(400);
            echo json_encode(['error' => 'Campos incompletos']);
        }
        break;

    case 'DELETE':
        $commentId = $data['id'] ?? null;
        if ($commentId) {
            $stmt = $conn->prepare("DELETE FROM comments WHERE id = ? ");// se crea el query del delete con el parametro necesaro 
            $stmt->bind_param("i", $commentId);// se sustituyen los parametros
            $stmt->execute();
            echo json_encode(['success' => true]);
        } else {
            http_response_code(400);
            echo json_encode(['error' => 'ID de comentario no proporcionado']);
        }
        break;

    default:
        http_response_code(405);
        echo json_encode(['error' => 'Método no permitido']);
        break;
}
