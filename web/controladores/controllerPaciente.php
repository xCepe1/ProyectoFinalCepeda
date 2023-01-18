<?php
require_once "../modelos/especialidadModelo.php";
require_once "../modelos/aseguradoraModelo.php";
require_once "../modelos/doctorModelo.php";
require_once "../modelos/CitaModel.php";


ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

if (empty($_POST)) {
    $mostrar = new Aseguradora();
    $respuesta = $mostrar->mostrarAseguradora();
    echo json_encode($respuesta);
} else if ($_POST['tipo'] == "especialidad") {
    $mostrar = new Especialidad();
    $respuesta = $mostrar->mostrarEspecialidad($_POST['id']);
    echo json_encode($respuesta);
} else if ($_POST['tipo'] == "doctor") {
    $mostrar = new Doctor();
    $respuesta = $mostrar->mostrarEspDoctor($_POST['id']);
    echo json_encode($respuesta);
} else if ($_POST['tipo'] == "posiblesCitas") {
    if (empty($_POST['fechas'])) {
        $cita = new citas($_POST['muestra']);
    } else {
        $cita = new citas($_POST['muestra'], $_POST['fechas']);
    }
    $dni=$cita->obtenerCitas();
    $respuesta = $cita->ofrecerCitas();  
    echo json_encode($respuesta);
} else if ($_POST['tipo'] == "proximasCitas") {
    $crear = new Citas();
    $respuesta = $crear->mostrarProxCitas(); 
    echo json_encode($respuesta);
} else if ($_POST['tipo'] == "pasadasCitas") {
    $crear = new Citas();
    $respuesta = $crear->mostrarPasCitas();
    echo json_encode($respuesta);
} else if($_POST['tipo']=='cogerCita'){
    $coger= new Citas($_POST['fecha'],$_POST['doctor']);
    $respuesta=$coger->insertarCita();
    echo json_encode($respuesta);
} else if($_POST['tipo']=='cancelarCita'){
    $cancelar= new Citas($_POST['fecha'],$_POST['doctor']);
    $respuesta=$cancelar->borrarCita();
    echo json_encode($respuesta);
}
