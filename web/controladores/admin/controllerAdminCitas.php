<?php
require_once "../../modelos/CitaModel.php";

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

 
if(empty($_POST)){
    $mostrar = new Citas();
    $respuesta = $mostrar->mostrarCitas();
    echo json_encode($respuesta);
}
else if($_POST['tipo']=="mostrarUno"){
    $mostrar = new Citas($_POST["id"]);
    $respuesta = $mostrar->mostrarUnaCita();
    echo json_encode($respuesta);
}
else if($_POST['tipo']=="eliminar"){
    $eliminar= new Citas($_POST['paciente'],$_POST['fecha'],$_POST['doctore']);
    $respuesta= $eliminar->borrarCita();
    echo json_encode($respuesta);
}
else if($_POST['tipo']=="anadir"){
    $crear= new Citas($_POST['id-crear'],$_POST['paciente-crear'],$_POST['doctor-crear'],$_POST['fecha-crear']);
    $respuesta= $crear->insertarCita();
    echo json_encode($respuesta);
}

?>