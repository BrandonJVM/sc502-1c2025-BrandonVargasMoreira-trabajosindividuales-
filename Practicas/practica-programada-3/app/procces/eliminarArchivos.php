<?php

if ($_SERVER["REQUEST_METHOD"] == "POST") {// se recibe la solicitud de tipo psot 
    $archivoTransacciones = "../archivos/transacciones.txt";// se define
    $archivoEstadoCuenta = "../archivos/estado_cuenta.txt";// se define
    
    file_put_contents($archivoTransacciones, "");// se vacia el archivo
    file_put_contents($archivoEstadoCuenta, "");// se vacia el archivo

    header("Location: ../content/index.php");// se redirige a la pagina principal
    exit();
}
?>
