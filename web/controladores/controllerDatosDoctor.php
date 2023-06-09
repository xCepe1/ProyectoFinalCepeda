<?php
require_once "../modelos/doctorModelo.php";

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

  
  
if(!isset($_POST['tipo'])){  
$mostrar = new Doctor();
$respuesta = $mostrar->mostrarDoctor();
echo json_encode($respuesta);
}
else{ 
    $modificar= new Doctor($_POST['password-modificarDoctor'],$_POST['nombre-modificarDoctor'],$_POST['especialidad-modificarDoctor'],$_POST['mail-modificarDoctor'],$_POST['horarioDesde-modificarDoctor'],$_POST['horarioHasta-modificarDoctor'],$_POST['horarioEntrada-modificarDoctor'],$_POST['horarioSalida-modificarDoctor']);
    $respuesta= $modificar->modificarDoctor();
    echo json_encode($respuesta);
}
