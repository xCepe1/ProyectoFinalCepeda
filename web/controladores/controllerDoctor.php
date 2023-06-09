<?php

require_once "../modelos/especialidadModelo.php";
require_once "../modelos/aseguradoraModelo.php";
require_once "../modelos/doctorModelo.php";
require_once "../modelos/CitaModel.php";


ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);


if ($_POST['tipo']=='diagnostico') { 
    $mostrar = new Citas();
    $respuesta = $mostrar->modificarCita();
    echo json_encode($respuesta);
} else if ($_POST['tipo'] == "proximasCitas") {
    $crear = new Citas();
    $respuesta = $crear->mostrarProxCitas(); 
    echo json_encode($respuesta);
} else if ($_POST['tipo'] == "pasadasCitas") {
    $crear = new Citas();
    $respuesta = $crear->mostrarPasCitas();
    echo json_encode($respuesta);
} else if($_POST['tipo']=='actualCita'){
    $cancelar= new Citas();
    $respuesta=$cancelar->citaActual();
    echo json_encode($respuesta);
}
