<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Mi Página PHP</title>
    <link rel="stylesheet" href="../css/estilos.css">
</head>

<body>

    <?php include_once 'body/header.php'; ?>


    <div class="container mt-5">
        <<div class="row"> 
            <div class="col-lg-6 mb-4">
                <div class="card shadow-sm">
                    <div class="card-body">
                        <h2 class="text-center mb-4">Añade una transacción</h2>
                        <form action="../procces/transacciones.php" method="post"> <!-- se indica a donde debe de it la indo -->
                            <div class="form-group">
                                <label for="date">Fecha:</label>
                                <input type="date" name="date" id="date" class="form-control" value="<?php echo date('Y-m-d'); ?>" required>
                            </div>
                            <div class="form-group">
                                <label for="descripcion">Descripción:</label>
                                <input type="text" name="descripcion" id="descripcion" class="form-control" required>
                            </div>
                            <div class="form-group">
                                <label for="monto">Monto:</label>
                                <input type="number" name="monto" id="monto" class="form-control" required>
                            </div>
                            <button type="submit" class="btn btn-primary w-100 mt-3">Registrar</button> <!-- se envia la informacion al formuilario -->
                        </form>
                    </div>
                </div>
            </div>

            <div class="col-lg-6 mb-4">
                <div class="card shadow-sm">
                    <div class="card-body">
                        <h2 class="text-center mb-4">Estado de Cuenta</h2>
                        <textarea class="form-control" rows="12" readonly style="white-space: pre-wrap;">
                            <?php
                            $archivo = "../archivos/estado_cuenta.txt"; // Archivo de las transacciones
                            if (file_exists($archivo)) { // Si el archivo existe
                                if (filesize($archivo) > 0) { // Si tiene contenido
                                    echo htmlspecialchars(file_get_contents($archivo)); // Mostrar el contenido del archivo
                                } else {
                                    echo "No hay transacciones registradas."; // Mensaje si está vacío
                                }
                            } else {
                                echo "No hay estado de cuenta disponible."; // Mensaje si no existe el archivo
                            }
                            ?>
                        </textarea>
                    </div>
                </div>
            </div>

            <div class="row">
                <div class="col-lg-6 mb-4">
                    <div class="card shadow-sm">
                        <div class="card-body">
                            <h2 class="text-center mb-4">Eliminar registros</h2>
                            <form action="../procces/eliminarArchivos.php" method="POST"> <!-- Formulario para eliminar los registros -->
                                <button type="submit" class="btn btn-danger w-100 mt-3">Eliminar registros</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>



    </div>

    <?php include_once 'body/footer.php'; ?> <!--llamado al footer-->

</body>

</html>