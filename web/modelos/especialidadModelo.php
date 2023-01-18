<?php
error_reporting(0);
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

class Especialidad
{
    public $nombre;
    public $aseguradora;
    public $accion="Especialidad";
    public $mysqli;

    function __construct( $nombre="", $aseguradora="")
    { 
        $this->nombre = $nombre;
        $this->aseguradora = $aseguradora; 
        $con = new Connection();
        $this->mysqli = $con->con();
    }

    function crearEspecialidad()
    {
        // $sql = "select * from especialidad where nombre = '{$this->nombre}' and aseguradora = '{$this->aseguradora}';";
        $sql = "select * from especialidad where nombre = '{$this->nombre}' and aseguradora = '{$this->aseguradora}';";
        $resultado = $this->mysqli->query($sql);
        if (mysqli_num_rows($resultado) == 0) {
            $sql = "INSERT INTO especialidad (nombre, aseguradora ) VALUES ('{$this->nombre}','{$this->aseguradora}');";
            $resultado = $this->mysqli->query($sql);
            return "exito";
        } else {
            return "la especialidad ya existe";
        }
    }
    function borrarEspecialidad() // TENGO QUE HACER LAS DOS FUNCIONES PARA MODIFICAR CITA
    {
        $sql = "select * from especialidad where nombre = '{$this->nombre}' and aseguradora = '{$this->aseguradora}';";
        $resultado = $this->mysqli->query($sql);
        if (mysqli_num_rows($resultado) != 0) {
            $sql = " SET FOREIGN_KEY_CHECKS=0;";
            $resultado = $this->mysqli->query($sql);
            $sql = " DELETE FROM especialidad WHERE nombre = '{$this->nombre}' and aseguradora = '{$this->aseguradora}';";
            $resultado = $this->mysqli->query($sql);
            $sql = " SET FOREIGN_KEY_CHECKS=1;";
            $resultado = $this->mysqli->query($sql);
            return "exito";
        }else{
            return "la especialidad no existe";
        }
    }
    function modificarEspecialidad(){
        $sql = "select * from especialidad where nombre = '{$this->nombre}' and aseguradora = '{$this->aseguradora}';";
        $resultado = $this->mysqli->query($sql);
        if (mysqli_num_rows($resultado) != 0) {
            $sql = "UPDATE aseguradora SET nombre = '{$this->nombre}', 
            aseguradora = '{$this->aseguradora}';";
            $resultado = $this->mysqli->query($sql);
            return 1;
        }else{
            return "la especialidad no existe";
        }
    }
    function mostrarUnoEspecialidad(){
        $sql="select * from especialidad where nombre = '{$this->nombre}' and aseguradora='{$this->aseguradora}';";   
        $resultado = $this->mysqli->query($sql);
        $datos = array();
        while ($row = $resultado->fetch_assoc()) {
            $datos[] = $row;
        }   
        return $datos;
    }   
    function mostrarTodoEspecialidad(){
        $sql="SELECT * from especialidad ";
        $resultado=$this->mysqli->query($sql);
        $datos=array();
        while ($row = $resultado->fetch_assoc()) {
            $datos[] = $row;
        }
        foreach ($datos as $key => $value) {

            $editar = array("Editar" => "<button type='button' onclick='rellenarModal(this.id,`{$this->accion}`,`{$value['aseguradora']}`)' class='btn btn-sm btn-link edicion' id='{$value['nombre']}' data-bs-toggle='modal' data-bs-target='#editarModal'><i class='bx bxs-edit'></i></button>");
            $eliminar = array("Borrar" => "<button type='button' onclick='eliminar(this.id,`{$this->accion}`,`{$value['aseguradora']}`)' class='btn btn-sm btn-link edicion' id='{$value['nombre']}' ><i class='bx bxs-trash' ></i></button>");
            $datos[$key] = array_merge($eliminar, $editar, $value);
        }  
        $columns = array_keys($datos[0]);
        

        $i = 0;

        $visibleColumns = ['aseguradora','nombre','email','Editar','Borrar'];
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
        );
        return $datos;
    }
    function mostrarEspecialidad($id){
        $sql="select * from especialidad where aseguradora = '{$id}';";
        $resultado = $this->mysqli->query($sql);
        $datos = array();
        while ($row = $resultado->fetch_assoc()) {
            $datos[] = $row;
        }     
        return $datos;
    }  
}
?>