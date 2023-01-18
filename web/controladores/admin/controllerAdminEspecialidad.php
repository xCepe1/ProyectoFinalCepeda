<?php
require_once "../../modelos/especialidadModelo.php";

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

 
if(empty($_POST)){
    $mostrar = new Especialidad();
    $respuesta = $mostrar->mostrarTodoEspecialidad();
    echo json_encode($respuesta);
}
else if($_POST['tipo']=="mostrarUno"){
    $mostrar = new Especialidad($_POST["nombre"],$_POST['aseguradora']);
    $respuesta = $mostrar->mostrarUnoEspecialidad();
    echo json_encode($respuesta);
}
else if($_POST['tipo']=="modificar"){
    $modificar= new Especialidad($_POST['nombre-modificar'],$_POST['aseguradora-modificar']);
    $respuesta= $modificar->modificarEspecialidad();
    echo json_encode($respuesta);
}
else if($_POST['tipo']=="eliminar"){
    $eliminar= new Especialidad($_POST['nombre'],$_POST['aseguradora']);
    $respuesta= $eliminar->borrarEspecialidad();
    echo json_encode($respuesta);
}
else if($_POST['tipo']=="anadir"){
    $crear= new Especialidad($_POST['nombre-crear'],$_POST['aseguradora-crear']);
    $respuesta= $crear->crearEspecialidad();
    echo json_encode($respuesta);
}

?>