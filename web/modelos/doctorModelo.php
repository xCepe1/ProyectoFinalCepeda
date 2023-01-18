<?php
if(is_dir("../modelos")){
    require_once "../modelos/loginModelo.php" ;
} else{
    require_once "../../modelos/loginModelo.php" ;
}
$rol=$_SESSION['rol'];
if($rol=='Paciente'){
    require_once "../conexion/db.php";
}  else if($rol=='Admin'){
    require_once "../../conexion/db.php";
}


ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

class Doctor
{
    public $dni;
    public $nombre;
    public $especialidad;
    public $email;
    public $horarioDesde;
    public $horarioHasta;
    public $horarioEntrada;
    public $horarioSalida;
    public $mysqli;
    public $accion="Doctor";

    function __construct($dni="", $nombre="", $especialidad="", $email="",$horarioDesde="",$horarioHasta="",$horarioEntrada="",$horarioSalida="")
    {

        $this->dni = $dni;
        $this->nombre = $nombre;
        $this->especialidad = $especialidad;
        $this->email = $email;   
        $this->horarioHasta=$horarioHasta;
        $this->horarioDesde=$horarioDesde;
        $this->horarioEntrada=$horarioEntrada;
        $this->horarioSalida=$horarioSalida;
        $con = new Connection();
        $this->mysqli = $con->con();
    }

    function crearDoctor()
    {
        $sql = "SELECT * from doctor where dni = '{$this->dni}'";
        $resultado = $this->mysqli->query($sql);
        if (mysqli_num_rows($resultado) == 0) {
            $sql = "INSERT INTO doctor (dni,nombre, especialidad, email,horarioDesde,horarioHasta,horarioEntrada,horarioSalida) VALUES ('{$this->dni}','{$this->nombre}','{$this->especialidad}','{$this->email}','{$this->horarioHasta}','{$this->horarioDesde}','{$this->horarioEntrada}','{$this->horarioSalida}')"; 
            $resultado = $this->mysqli->query($sql);
            if(!isset($_SESSION['usuario'])){
                session_start();
                $_SESSION['usuario'] = $this->nombre;
            }
            return "exito";
        } else {
            return 2;
        }
    }
    function modificarDoctor()
    {
        $sql = "select * from doctor where dni = '{$this->dni}'";
        $resultado = $this->mysqli->query($sql);
        if (mysqli_num_rows($resultado) != 0) {
            $sql = "UPDATE doctor SET nombre = '{$this->nombre}', 
            especialidad = '{$this->especialidad}', email = '{$this->email}', horarioHasta ='{$this->horarioHasta}',horarioDesde ='{$this->horarioDesde}', horarioEntrada ='{$this->horarioEntrada}', horarioSalida ='{$this->horarioSalida}'
            WHERE dni= '{$this->dni}'";  
            $resultado = $this->mysqli->query($sql);
            return "exito";
        } else {
            return "No existe el doctor";
        }
    }
    function eliminarDoctor()
    {
        $sql = "select * from doctor where dni = '{$this->dni}';";
        $resultado = $this->mysqli->query($sql); //COMPARAR CON LA SESION PARA NO PODER BORRARSE A SI MISMO
        if (mysqli_num_rows($resultado) != 0) {
            $sql = "DELETE FROM doctor WHERE dni = '{$this->dni}'"; 
            $resultado = $this->mysqli->query($sql);
            return "exito";
        } else {
            return "No existe el doctor";
        }
    }
    function mostrarDoctor(){
        $sql ="SELECT * from doctor where dni = '{$this->dni}'";
        $resultado=$this->mysqli->query($sql);
        if(mysqli_num_rows($resultado)==0){
            return "No existe el doctor";
        }
        $datos=array();
        while ($row = $resultado->fetch_assoc()) {
            $datos[] = $row;
        }
        return $datos;
    }
    function mostrarTodoDoctor(){
        $sql="SELECT * from doctor";
        $resultado=$this->mysqli->query($sql);
        $datos=array();
        while ($row = $resultado->fetch_assoc()) {
            $datos[] = $row;
        }   
        foreach ($datos as $key => $value) { 
            $editar = array("Editar" => "<button type='button' onclick='rellenarModal(this.id,`{$this->accion}`)' class='btn btn-sm btn-link edicion' id='{$value['dni']}' data-bs-toggle='modal' data-bs-target='#editarModal' accion='{$this->accion}'><i class='bx bxs-edit'></i></button>");
            $eliminar = array("Borrar" => "<button type='button' onclick='eliminar(this.id,`{$this->accion}`)' class='btn btn-sm btn-link edicion' id='{$value['dni']}' accion='{$this->accion}'><i class='bx bxs-trash' ></i></button>");
            if(empty($value['horarioDesde'])){
            $horario=array("Horario"=>"No definido");
            }else {
                $horario=array("Horario"=>"De ".$value['horarioDesde']." a ".$value['horarioHasta'] . " ". $value['horarioEntrada'].' Hasta '. $value['horarioSalida']);
            }

            $datos[$key] = array_merge($eliminar, $editar, $value,$horario);
        }  
        $columns = array_keys($datos[0]);
        

        $i = 0;

        $visibleColumns = ['dni','nombre','especialidad','email','Editar','Borrar','Horario'];
        $bool = false;

        foreach ($columns as $key => $value) {

            $bool = (in_array($value, $visibleColumns)) ? true : false;

            $columns[$key] = array('data' => $value);
            $columnsDefs[] = array('title' => $value, 'targets' => $i, 'visible' => $bool, 'searchable' => $bool);
            $i++;
        }

        $datos = array(
            'data' => $datos,
            'columns' => $columns,
            'columnsDefs' => $columnsDefs,
            // 'combos' => $this->combos
        );
        return $datos;
    }

    function mostrarEspDoctor($especialidad){
        $sql ="SELECT * from doctor where especialidad = '$especialidad'";
        $resultado=$this->mysqli->query($sql);
        if(mysqli_num_rows($resultado)==0){
            return "No existen doctores de la aseguradora";
        }
        $datos=array();
        while ($row = $resultado->fetch_assoc()) {
            $datos[] = $row;
        }
        return $datos;
    }
    function mostrar1EspDoctor($nombre){
        $sql ="SELECT * from doctor where nombre = '$nombre'";
        $resultado=$this->mysqli->query($sql);
        if(mysqli_num_rows($resultado)==0){
            return "No existen doctores de la aseguradora";
        }
        $datos=array();
        while ($row = $resultado->fetch_assoc()) {
            $datos[] = $row;
        }
        return $datos;
    }

}
