<?php

$host = '127.0.0.1';
$dbname = 'wishlist_db';
$user = 'root';
$pass = '';

try {   
    $pdo = new PDO("mysql:host=$host;dbname=$dbname", $user, $pass);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

} catch (PDOException $e) {
    die("Error en la conexión: " . $e->getMessage());
}

if ($_SERVER['REQUEST_METHOD'] == 'GET') { // verifica si el metodo de la funcion desde el html es el Get
    $result = $pdo->query("SELECT * FROM wishlist ORDER BY fecha DESC");
    $wishesh = []; // guardamos los deseos en un arrray 
    while ($row = $result->fetch(PDO::FETCH_ASSOC)) {
        $wishesh[] = $row;
    }
    echo json_encode($wishesh);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);

    if (isset($data['titulo']) && isset($data['descripcion'])) {
        $titulo = $data['titulo'];
        $descripcion = $data['descripcion'];

        $stmt = $pdo->prepare("INSERT INTO wishlist (titulo, descripcion, fecha) VALUES (:titulo, :descripcion, NOW())");
        $stmt->bindParam(':titulo', $titulo);
        $stmt->bindParam(':descripcion', $descripcion);

        if ($stmt->execute()) {
            echo json_encode(['message' => 'Deseo agregado exitosamente']);
        } else {
            echo json_encode(['error' => 'Error al agregar el deseo']);
        }
    } else {
        echo json_encode(['error' => 'Datos incompletos']);
    }
    exit;
}

if ($_SERVER['REQUEST_METHOD'] == 'DELETE') {
    $data = json_decode(file_get_contents('php://input'), true);

    if (isset($data['id'])) {
        $id = $data['id'];

        $stmt = $pdo->prepare("DELETE FROM wishlist WHERE id = :id");
        $stmt->bindParam(':id', $id);

        if ($stmt->execute()) {
            echo json_encode(['message' => 'Deseo eliminado exitosamente']);
        } else {
            echo json_encode(['error' => 'Error al eliminar el deseo']);
        }
    } else {
        echo json_encode(['error' => 'ID no proporcionado']);
    }
    exit;
}

?>