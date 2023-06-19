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


ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

class Aseguradora
{
    public $id;
    public $nombre;
    public $numero_contacto;
    public $email;
    public $mysqli;
    public $accion="Aseguradora";

    
    function __construct($id="", $nombre="", $numero_contacto="", $email="")
    {

        $this->id = $id;
        $this->nombre = $nombre;
        $this->numero_contacto = $numero_contacto;
        $this->email = $email;
        $con = new Connection();
        $this->mysqli = $con->con();
    }
    

        private function validarDatos( $nombre, $numero_contacto, $email) {
        // Realizar las comprobaciones necesarias
        
        if (empty($nombre)) {
            return "nombre";
        }
        
        if (!preg_match('/^[0-9]{1,9}$/', $numero_contacto)) {
            return "telefono";
        }
        
        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            return "email";
        }
        return true;
    }
    function crearAseguradora()
    {
        $validacion = $this->validarDatos($this->nombre, $this->numero_contacto, $this->email);
        if($validacion===true){
            $sql = "select * from aseguradora where id = '{$this->id}'";
            $resultado = $this->mysqli->query($sql);
            if (mysqli_num_rows($resultado) == 0) {
                $sql = "INSERT INTO aseguradora ( nombre, numero_contacto, email ) VALUES ('{$this->nombre}', '{$this->numero_contacto}', '{$this->email}');"; 
                $resultado = $this->mysqli->query($sql);
                return "exito";
            } else {
                return "la aseguradora ya existe";
            }
        }
        else {
            return $validacion;
        }

    }


    function borrarAseguradora() // TENGO QUE HACER LAS DOS FUNCIONES PARA MODIFICAR CITA
    {
        $sql = "select * from aseguradora where id = '{$this->id}'";
        $resultado = $this->mysqli->query($sql);
        if (mysqli_num_rows($resultado) != 0) {
            $sql = " SET FOREIGN_KEY_CHECKS=0;";
            $resultado = $this->mysqli->query($sql);
            $sql = "DELETE FROM aseguradora WHERE id = '{$this->id}'";
            $resultado = $this->mysqli->query($sql);
            $resultado = $this->mysqli->query($sql);
            $sql = " SET FOREIGN_KEY_CHECKS=1;";
            return "exito";
        }else{
            return "la aseguradora no existe";
        }
    }


    function modificarAseguradora(){
        $sql = "select * from aseguradora where id = '{$this->id}'";
        $resultado = $this->mysqli->query($sql);
        if (mysqli_num_rows($resultado) != 0) {
            $sql = "UPDATE aseguradora SET nombre = '{$this->nombre}', 
            numero_contacto = '{$this->numero_contacto}', email = '{$this->email}'
            WHERE id= '{$this->id}';";

            $resultado = $this->mysqli->query($sql);
            return "exito";
        }else{
            return "la asguradora no existe";
        }
    }


    function mostrarUnaAseguradora(){
        $sql="select * from aseguradora;";
        $resultado = $this->mysqli->query($sql);
        $datos = array();
        while ($row = $resultado->fetch_assoc()) {
            $datos[] = $row;
        }
        return $datos;
    }   


    function mostrarTodoAseguradora(){
        $sql="SELECT * from aseguradora ";
        $resultado=$this->mysqli->query($sql);
        $datos=array();
        while ($row = $resultado->fetch_assoc()) {
            $datos[] = $row;
        }
        foreach ($datos as $key => $value) {

            $editar = array("E" => "<button type='button' onclick='rellenarModal(this.id,`{$this->accion}`)' class='btn btn-sm btn-link edicion' id='{$value['id']}' data-bs-toggle='modal' data-bs-target='#editarModal'><i class='bx bxs-edit'></i></button>");
            $eliminar = array("B" => "<button type='button' onclick='eliminar(this.id,`{$this->accion}`)' class='btn btn-sm btn-link edicion' id='{$value['id']}' ><i class='bx bxs-trash' ></i></button>");
            $datos[$key] = array_merge($eliminar, $editar, $value);
        }  
        $columns = array_keys($datos[0]);
        

        $i = 0;

        $visibleColumns = ['nombre','id','numero_contacto','email','E','B'];
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
    function mostrarAseguradora(){
        $sql="SELECT * from aseguradora ";
        $resultado=$this->mysqli->query($sql);
        $datos=array();
        while ($row = $resultado->fetch_assoc()) {
            $datos[] = $row;
        }
        return $datos;
    }
}
?>
