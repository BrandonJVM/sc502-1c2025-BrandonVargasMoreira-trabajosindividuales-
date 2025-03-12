<?php

class Transacciones {
    private $archivoTransacciones; // Atributo para el archivo de transacciones
    private $archivoEstadoCuenta;// Atributo para el archivo de estado de cuenta    

    public function __construct() {
        $this->archivoTransacciones = "../archivos/transacciones.txt"; // Se inicializa el atributo con la ruta del archivo
        $this->archivoEstadoCuenta = "../archivos/estado_cuenta.txt";// Se inicializa el atributo con la ruta del archivo
    }

    public function agregarTransaccion($fecha, $descripcion, $monto) {// Método para agregar una transacción
        $linea = "$fecha|$descripcion|$monto\n";// se crea un string con los datos de la transacción
        file_put_contents($this->archivoTransacciones, $linea, FILE_APPEND);// se agrega la transacción al archivo con el append para no sobreescribir
    }

    public function generarEstadoCuenta() {// metodo para generar el estado de cuenta medinate el archivo de transacciones
        $transacciones = []; // se crea un array para guardar las transacciones
        $montoContado = 0;// se inicializa el monto contado en 0
        
        if (file_exists($this->archivoTransacciones)) {// si el archivo de transacciones existe
            $archivo = fopen($this->archivoTransacciones, "r");// se abre el archivo en modo lectura
        
            while (($linea = fgets($archivo)) !== false) {// se lee el archivo linea por linea mientras haya contenido en el mismo
                $linea = trim($linea);// se limpia la linea de espacios en blanco
                if (!empty($linea)) {// si la linea no está vacía
                    list($fecha, $descripcion, $monto) = explode("|", $linea);// se separan los datos de la transacción
                    $monto = (float) trim($monto);// se limpia el monto de espacios en blanco
                    $transacciones[] = ["fecha" => $fecha, "descripcion" => $descripcion, "monto" => $monto];// se agrega la transacción al array de transacciones
                    $montoContado += $monto;// se suma el monto de la transacción al monto contado
                }
            }
            fclose($archivo);// se cierra el archivo

            $interes = 1.026;// se asigna el interes del 2.6%
            $montoConInteres = $montoContado * $interes;// se calcula el monto con el interes
            $cashback = $montoContado * 0.001; // se calcula el cashback del 0.1%
            $montoFinal = $montoConInteres - $cashback;// se calcula el monto final a pagar

            $contenidoEstado = "Estado de Cuenta\n\n";// se inicializa el contenido del estado de cuenta
            foreach ($transacciones as $t) {// se itera el array de las transacciones
                $contenidoEstado .= "{$t['fecha']} - {$t['descripcion']}: ₡{$t['monto']}\n"; // se agrega la transacción al contenido del estado de cuenta
            }
            $contenidoEstado .= "\nTotal Contado: ₡" . number_format($montoContado, 2) . "\n";// se agrega el total contado al contenido del estado de cuenta
            $contenidoEstado .= "Total con 2.6% de interés: ₡" . number_format($montoConInteres, 2) . "\n";// se agrega el total con interes al contenido del estado de cuenta
            $contenidoEstado .= "Cashback (0.1%): ₡" . number_format($cashback, 2) . "\n";// se agrega el cashback al contenido del estado de cuenta
            $contenidoEstado .= "Monto Final a Pagar: ₡" . number_format($montoFinal, 2) . "\n";// se agrega el monto final al contenido del estado de cuenta

            $archivo = fopen($this->archivoEstadoCuenta, "w");// se abre el archivo de estado de cuenta en modo escritura
            fwrite($archivo, $contenidoEstado);// se escribe el contenido del estado de cuenta en el archivo
            fclose($archivo);// se cierra el archivo
        }
    }
}

// esto es lo que se ejecuta cuando se recibe el formulario

if ($_SERVER["REQUEST_METHOD"] == "POST") { // se verifica si hubo una solicitud POST
    $fecha = $_POST['date'];// se obtienen los datos del formulario
    $descripcion = $_POST['descripcion'];// se obtienen los datos del formulario
    $monto = $_POST['monto'];// se obtienen los datos del formulario

    $transacciones = new Transacciones(); // Se crea un objeto de la clase Transacciones
    $transacciones->agregarTransaccion($fecha, $descripcion, $monto); // se agrega la transaccino con el metodo agregarTransaccion
    $transacciones->generarEstadoCuenta(); // se genera el estado de cuenta con el metodo generarEstadoCuenta

    header("Location: ../content/index.php");// se redirige al usuario a la página principal
    exit(); 
}

?>
