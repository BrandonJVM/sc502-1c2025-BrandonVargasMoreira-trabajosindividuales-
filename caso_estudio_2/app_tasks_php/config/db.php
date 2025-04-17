<?php

$conn = new mysqli("127.0.0.1", "root", "", "caso_estudio");

if ($conn->connect_error) {
  http_response_code(500);
  echo json_encode(["error" => "Conexión fallida"]);
  exit;
}

