<?php
require_once "../modelos/loginModelo.php";    
if(!empty($_SESSION['rol'])){
    if($_SESSION['rol']=="Paciente"){
        header("Location: ../vistas/paciente");

    } else if($_SESSION['rol']=='Admin'){
        header("Location: ../vistas/admin");
    } 
}