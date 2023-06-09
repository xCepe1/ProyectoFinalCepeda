<?php
require_once "../../modelos/pacienteModelo.php";

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

 
if(empty($_POST)){
    $mostrar = new Paciente();
    $respuesta = $mostrar->mostrarTodoPaciente();
    echo json_encode($respuesta);
}
else if($_POST['tipo']=="mostrarUno"){
    $mostrar = new Paciente($_POST["dni"]);
    $respuesta = $mostrar->mostrarPaciente();
    echo json_encode($respuesta);
}
else if($_POST['tipo']=="modificar"){
    $modificar= new Paciente($_POST['dni'],$_POST['nombre-modificar'],$_POST['password-modificar'],$_POST['mail-modificar'],
    $_POST['fecha-modificar'],$_POST['telefono-modificar']);
    $respuesta= $modificar->modificarPaciente();
    echo json_encode($respuesta);
}
else if($_POST['tipo']=="eliminar"){
    $eliminar= new Paciente($_POST['dni']);
    $respuesta= $eliminar->eliminarPaciente();
    echo json_encode($respuesta);
}
else if($_POST['tipo']=="anadir"){
    $crear= new Paciente($_POST['dni-crear'],$_POST['nombre-crear'],$_POST['password-crear'],$_POST['mail-crear'],
    $_POST['fecha-crear'],$_POST['telefono-crear']);
    $respuesta= $crear->crearPaciente();
    echo json_encode($respuesta);
}

?>