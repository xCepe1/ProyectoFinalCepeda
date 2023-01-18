<?php
require_once "../conexion/db.php";

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

class Registro
{
    
    public $dni;
    public $password;
    public $nombre;
    public $email;
    public $mysqli; 

    function __construct($dni, $password, $nombre, $email)
    {

        $this->dni = $dni;
        $this->password = $password;
        $this->nombre = $nombre;
        $this->email = $email;
        $con = new Connection();
        $this->mysqli = $con->con();
    }

    function registrar()
    {

        $sql = "select * from usuario where dni = '{$this->dni}'";
        $resultado = $this->mysqli->query($sql);
        if (mysqli_num_rows($resultado) == 0) {
            $sql = "INSERT INTO usuario (dni, nombre, password, email) VALUES ('{$this->dni}','{$this->nombre}','{$this->password}','{$this->email}')";
            $resultado = $this->mysqli->query($sql);
            $_SESSION['usuario'] = $_POST['nombre'];
            if($_POST['dni']=='30247579'){
                $_SESSION['rol']="Admin";
            }else{
                $_SESSION['rol']="Paciente";
            }
            $_SESSION['dni']=$_POST['dni']; 
            return 1;
        }
        else{
            return 2;
        }
    }
}
?>
