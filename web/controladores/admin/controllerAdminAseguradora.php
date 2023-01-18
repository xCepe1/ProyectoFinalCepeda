<?php
require_once "../../modelos/aseguradoraModelo.php";

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);


if(empty($_POST['tipo'])){
    $mostrar = new Aseguradora();
    $respuesta = $mostrar->mostrarTodoAseguradora();
    echo json_encode($respuesta);
}
else if($_POST['tipo']=="mostrarUno"){
    $mostrar = new Aseguradora($_POST["id"]);
    $respuesta = $mostrar->mostrarUnaAseguradora();
    echo json_encode($respuesta);
}
else if($_POST['tipo']=="modificar"){
    $modificar= new Aseguradora($_POST['id-modificar'],$_POST['nombre-modificar'],$_POST['numero-modificar'],$_POST['email-modificar']);
    $respuesta= $modificar->modificarAseguradora();
    echo json_encode($respuesta);
}
else if($_POST['tipo']=="eliminar"){ 
    $eliminar= new Aseguradora($_POST['id']);
    $respuesta= $eliminar->borrarAseguradora();
    echo json_encode($respuesta);
}
else if($_POST['tipo']=="anadir"){ 
    $crear= new Aseguradora(' ',$_POST['nombre-crear'],$_POST['numero-crear'],$_POST['mail-crear']);
    $respuesta= $crear->crearAseguradora();
    echo json_encode($respuesta);
}

?>