<?php
require_once "../modelos/loginModelo.php";

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);


if (empty($_SESSION['usuario'])) {
    $login = new Login($_POST["dni"], $_POST['password']);
    $respuesta = $login->inicio();
    echo json_encode($respuesta);
} else {
    echo json_encode(1);
}
