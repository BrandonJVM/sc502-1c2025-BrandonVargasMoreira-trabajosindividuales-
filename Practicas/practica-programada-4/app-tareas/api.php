<?php
header('Content-Type: application/json');

$host = '127.0.0.1';// info de la db 
$dbname = 'tareas';
$user = 'root';
$pass = '';

try {// se realiza la conexion 
    $pdo = new PDO("mysql:host=$host;dbname=$dbname", $user, $pass);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Error en la conexión: ' . $e->getMessage()]);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'GET') {// para cunado la accion es de tipo get o de obtener 
    $action = $_GET['action'] ?? '';

    if ($action === 'tareas') {// si la acion es tareas se hace la consulta y se envian la tareas 
        $stmt = $pdo->query("SELECT * FROM tareas");
        $tareas = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($tareas);
        exit;
    }
    if ($action === 'comentarios' && isset($_GET['tarea_id'])) {// si es ocmenarios y hay un id se obtienen los comentarios
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



if ($_SERVER['REQUEST_METHOD'] === 'POST') {// si es de tipo post 
    $action = $_GET['action'] ?? '';

    if ($action === 'crear_tarea') {// se crea una tarea y se envia 
        $title = $_POST['title'] ?? '';
        $description = $_POST['description'] ?? '';
        $dueDate = $_POST['dueDate'] ?? '';

        if ($title && $description && $dueDate) {
            $stmt = $pdo->prepare("INSERT INTO tareas (title, description, dueDate) VALUES (?, ?, ?)");
            $stmt->execute([$title, $description, $dueDate]);

            echo json_encode(['mensaje' => 'Tarea creada con éxito']);
        } else {
            http_response_code(400);
            echo json_encode(['error' => 'Faltan campos']);
        }

        exit;
    }elseif ($action === 'eliminar_comentario') {// si hay que qliminar un comentario se optiene el id y se elimina 
        $comentario_id = (int) $_POST['comentario_id'];
        $stmt = $pdo->prepare("DELETE FROM comentarios WHERE comentario_id = ?");
        $exito = $stmt->execute([$comentario_id]);

        echo json_encode(['success' => $exito]);
        exit;
    }
    elseif($action === 'agregar_comentario') {// si hay que agreagar un coenatio se optiene el id de la tarea y se agrega
        $comentario = $_POST['comentario'] ?? '';
        $tarea_id = (int) ($_POST['tarea_id'] ?? 0);
    
        if (!empty($comentario) && $tarea_id > 0) {
            $stmt = $pdo->prepare("INSERT INTO comentarios (tarea_id, comentario) VALUES (?, ?)");
            $exito = $stmt->execute([$tarea_id, $comentario]);
    
            echo json_encode(['success' => $exito]);
        } else {
            echo json_encode(['success' => false, 'error' => 'Faltan datos']);
        }
        exit;
    }elseif ($action === 'eliminar_tarea') {// si hay que elimianr una tarea se optiene el id de la tarea y se elimian 
        header('Content-Type: application/json');
    
        $tareaId = $_POST['tarea_id'] ?? null;
    
        if ($tareaId) {
            $stmt1 = $pdo->prepare("DELETE FROM comentarios WHERE tarea_id = ?");
            $stmt1->execute([$tareaId]);
            $stmt = $pdo->prepare("DELETE FROM tareas WHERE tarea_id = ?");
            $stmt->execute([$tareaId]);
    
            echo json_encode(['success' => true]);
        } else {
            http_response_code(400);
            echo json_encode(['error' => 'Falta el ID de la tarea']);
        }
    
        exit;
    }
    

}