<?php

require_once "../modelos/pacienteModelo.php";
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);
 
if(!isset($_POST['tipo'])){  
    $mostrar = new Paciente();
    $respuesta = $mostrar->mostrarPaciente();  
    echo json_encode($respuesta);
}
else if($_POST['tipo']=='modificar'){
    $modificar= new Paciente($_POST['nombre-modificarPaciente'],$_POST['password-modificarPaciente'],$_POST['mail-modificarPaciente'],
    $_POST['fecha-modificarPaciente'],$_POST['telefono-modificarPaciente']);
    $respuesta= $modificar->modificarPaciente(); 
    echo json_encode($respuesta);
}


