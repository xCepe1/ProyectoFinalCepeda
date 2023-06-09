<?php
require_once "../../modelos/doctorModelo.php";

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

if(empty($_POST)){
    $mostrar = new Doctor();
    $respuesta = $mostrar->mostrarTodoDoctor();
    echo json_encode($respuesta);
}
else if($_POST['tipo']=="mostrarUno"){
    $mostrar = new Doctor($_POST["dni"]);
    $respuesta = $mostrar->mostrarDoctor();
    echo json_encode($respuesta);
}
else if($_POST['tipo']=="modificar"){   
    $modificar= new Doctor($_POST['dni'],$_POST['password-modificar'],$_POST['nombre-modificar'],$_POST['especialidad-modificar'],$_POST['mail-modificar'],$_POST['horarioDesde-modificar'],$_POST['horarioHasta-modificar'],$_POST['horarioEntrada-modificar'],$_POST['horarioSalida-modificar']);
    $respuesta= $modificar->modificarDoctor();
    echo json_encode($respuesta);
}
else if($_POST['tipo']=="eliminar"){
    $eliminar= new Doctor($_POST['dni']);
    $respuesta= $eliminar->eliminarDoctor();
    echo json_encode($respuesta);
}
else if($_POST['tipo']=="anadir"){
    $crear= new Doctor($_POST['dni-crear'],$_POST['nombre-crear'],$_POST['especialidad-crear'],$_POST['mail-crear'],$_POST['horarioDesde-anadir'],$_POST['horarioHasta-anadir'],$_POST['horarioEntrada-anadir'],$_POST['horarioSalida-anadir']);
    $respuesta= $crear->crearDoctor();
    echo json_encode($respuesta);
}

?>