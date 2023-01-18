<?php
if(is_dir("../conexion")){
    require_once "../conexion/db.php"; ;
} else{
    require_once "../../conexion/db.php"; ;
}
session_start();
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

class Login
{
    public $dni;
    public $password;
    public $mysqli;

    function __construct($dni, $password)
    {

        $this->dni = $dni;
        $this->password = $password;
        $this->mysqli;
        $con = new Connection();
        $this->mysqli = $con->con();
    }

    function inicio()
    { 
        $sql = "select dni, nombre, password from usuario where dni = '{$this->dni}'";
        $resultado = $this->mysqli->query($sql); 
        $users = $resultado->fetch_assoc();
        if (empty($users) || $users['password'] != $this->password) {
            return "No existe el usuario";
        } else {
          
            $_SESSION['usuario'] = $users['nombre'];
            if($users['dni']=='30247579A'){
                $_SESSION['rol']="Admin";
            }else{
                $_SESSION['rol']="Paciente";
            }
            $_SESSION['dni']=$users['dni'];   
            return $_SESSION['usuario'];
        }
    }
}
