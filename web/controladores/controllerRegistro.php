<?php
require_once "../modelos/registroModelo.php";

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL); 


if (empty($_SESSION['usuario'])) {
    $registro = new Registro($_POST["dni"], $_POST['password'], $_POST['nombre'], $_POST['email'],$_POST['fecha'],$_POST['telefono']);
    $respuesta = $registro->registrar();
    if($respuesta == 1){
        echo json_encode($_SESSION['usuario']);
    }
    else{
        echo json_encode($respuesta);
    }
} else {
    echo json_encode($respuesta);
}
