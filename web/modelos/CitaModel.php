<?php
if(is_dir("../modelos")){
    require_once "../modelos/loginModelo.php" ;
} else{
    require_once "../../modelos/loginModelo.php" ;
}
$rol=$_SESSION['rol'];
if($rol=='Paciente'||$rol=='Doctor'){
    require_once "../conexion/db.php";
}  else if($rol=='Admin'){
    require_once "../../conexion/db.php";
}



ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL & ~E_DEPRECATED & ~E_STRICT);


class Citas
{
    public $doctor;
    public $pref_desde;
    public $pref_hasta;
    public $citas_ocupadas=[];
    public $id;
    public $diagnostico;
    public $paciente1;
    public $doctor1;
    public $fecha1;
    public $diagnostico1;
    public $mysqli;
    public $accion="Citas";//es para identificarlo

    public function __construct($tipo='',$datepicker="", $diagnostico="", $paciente1='',
     $doctor1='', $fecha1='', $diagnostico1='')
    { 
        $this->diagnostico=$diagnostico;
        $this->doctor1=$doctor1;
        $this->paciente1=$paciente1;
        $this->fecha1=$fecha1;
        $this->diagnostico1=$diagnostico1;
        $con = new Connection();
        $dbcon = new mysqli('eu-cdbr-west-03.cleardb.net', 'b779dddf5208ba', 'c33f6bda', 'heroku_319148137defb00');
    if(isset($_POST['muestra'])){
        if($_POST['muestra']=='proxima'){
            $pref_desde=date("Y-m-d");
            $pref_hasta=date(("Y-m-d"),strtotime("$pref_desde 3 days"));
        } else if($_POST['muestra']=='personalizada'){
            $explode = explode(",", $datepicker);
            if (sizeof($explode) < 2) { // comprobamos que el array contenga mas de 1 numero
                $pref_desde = $explode[0];
                $pref_hasta= $explode[0];  
            } else {
                if ($explode[0] < $explode[1]) { //comprobamos cual es mayor, siempre son dos 
                    $pref_desde = $explode[0];
                    $pref_hasta = $explode[1];
                } else {
                    $pref_desde = $explode[1];
                    $pref_hasta = $explode[0];
                }
            }
                
        }
    }     
        if($_SESSION['rol']=='Paciente'){  //creamos el doctor solo cuando estemos en modo paciente y exista doctor en el post 
            if(isset($_POST['doctor'])){ //esto se hace para poder trabajar con los horarios de los doctores
                $este=new Doctor();
                $doctor= $este->mostrar1EspDoctor($_POST['doctor']);  
                $doctor=$doctor[0];
                $this->doctor= $doctor; 
                if(!empty($pref_desde)){
                    $this->pref_desde = $pref_desde;
                    $this->pref_hasta = date("Y-m-d",strtotime("$pref_hasta + 1 days"));
                } 
            }
        }
    }


    public function obtenerCitas()
    {
        $doctor=$this->doctor['dni'];
        $sql = "SELECT
                    *
                FROM
                    `cita`
                WHERE
                    fecha BETWEEN '{$this->pref_desde}'
                AND '{$this->pref_hasta} 23:59:59' AND doctor='$doctor';"; 
        $resultado = $this->mysqli->query($sql);
        
        if((mysqli_num_rows($resultado) == 0)){
            $citas_ocupadas=[];
        } else{
            while ($row = $resultado->fetch_assoc()) {
                $citas_ocupadas[] = $row;
            }
        }



        $this->citas_ocupadas =  $citas_ocupadas;
    }

    public function ofrecerCitas()
    {
        
        $horarioEntrada = $this->doctor['horarioEntrada'];
        $horarioSalida = $this->doctor['horarioSalida'];
        $horario_desde=$this->doctor['horarioDesde'];
        $horario_hasta=$this->doctor['horarioHasta'];
        $fechas=['lunes','martes','miercoles','jueves','viernes','sabado','domingo'];
        $fechasEn=['Monday','Tuesday','Wednesday','Thursday','Friday','Sunday','Saturday'];
        for ($i=0; $i < count($fechas) ; $i++) { 
            if($fechas[$i]==$horario_desde){//  ponemos las fechas en ingles para que php las entienda
                $horario_desde=$fechasEn[$i];
                $j=$i;
            }
            if($fechas[$i]==$horario_hasta){
                $horario_hasta=$fechasEn[$i];
                $h=$i;
            }
        };     
        $diasSemana=[];
        foreach ($fechasEn as $key => $value ) {
            if($key==$j&&$j!=$h+1){
                $diasSemana[]=$fechasEn[$j];
                $j++;
            }
        };
        $contador=0;
        $i = $this->pref_desde;  

        while ($i != $this->pref_hasta) {
            $j = $horarioEntrada; 
            if (in_array(date("l", strtotime($i)),$diasSemana)) {
                
                while ($j <= $horarioSalida) { 
                    $citas_completas = array_column($this->citas_ocupadas, "fecha");//quitamos las citas ocupadas
                    $target = "$i $j";   

                    if (!in_array($target, $citas_completas) and $target>date("Y-m-d H:i:s")) {  
                        $fechas_disponibles[$contador]=['Fecha' =>$target ] ;
                    } 
                    $contador++;
                    $j = date("H:i:s", strtotime("$j + 1 hours"));
                }

            }  
            $i = date("Y-m-d", strtotime("$i + 1 day") );
        }     
        $dni=$this->doctor['dni'];
        $i=0;
        foreach ($fechas_disponibles as $key => $value) {
            if(!empty(($value['Fecha']))){
                $fecha=$value['Fecha'];
                $cogerCita = array("Reservar" => "<button type='button' onclick='cogerCita(this.id, `$dni`)' class='btn btn-sm btn-link reservar' id='{$fecha}' ><i class='bx bx-checkbox-checked'></i></i></button>");   
                $datos[$i] = array_merge($cogerCita, $value);

            $i++;
            }
        }  
        $columns = array_keys($datos[1]);
        

        $i = 0;

        $visibleColumns = ['Reservar','Fecha'];
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
    public function insertarCita(){
        $dniPaciente=$_SESSION['dni'];
        $dniDoctor=$_POST['doctor'];
        $fecha=$_POST['fecha'];
        $diagnostico=$_POST['diagnostico'];

        $sql="INSERT INTO cita (paciente,doctor,fecha,diagnostico) VALUES ('$dniPaciente','$dniDoctor','$fecha','$diagnostico')";  
        $respuesta=$this->mysqli->query($sql); 
        return "exito";
    }
    public function borrarCita(){
        if($_SESSION['rol']=='Admin'){
            $dniDoctor=$_POST['doctore'];
            $dniPaciente=$_POST['paciente'];
        } else{
            $dniDoctor=$_POST['doctor'];
            $dniDoctor=str_replace('`', '', $dniDoctor);
            $dniPaciente=$_SESSION['dni'];
        }
        $fecha=$_POST['fecha'];
        $sql="DELETE FROM cita where doctor='$dniDoctor' and paciente='$dniPaciente' and fecha='$fecha'";
        $this->mysqli->query($sql);   
        return "exito";
    }
    function mostrarUnaCita()
    {
        $sql = "SELECT * FROM cita where id = '{$this->id}';";
        $resultado = $this->mysqli->query($sql);
        $datos = array();
        while ($row = $resultado->fetch_assoc()) {
            $datos[] = $row;
        }
        return $datos;
    }
    function mostrarCitas()
    {
        $sql = "SELECT * FROM cita;";
        $resultado = $this->mysqli->query($sql);
        $datos = array();
        while ($row = $resultado->fetch_assoc()) {
            $datos[] = $row;
        }
        foreach ($datos as $key => $value) {

            $eliminar = array("B" => "<button type='button' onclick='eliminar(this.id,`{$this->accion}`)' class='btn btn-sm btn-link edicion' id='{$value['paciente']},{$value['doctor']},{$value['fecha']}' accion='{$this->accion}'><i class='bx bxs-trash' ></i></button>");
            $datos[$key] = array_merge($eliminar, $value);
        }  
        $columns = array_keys($datos[0]);
        

        $i = 0;

        $visibleColumns = ['paciente','doctor','fecha','E','B'];
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
    function mostrarProxCitas()
    {   
        $dni=$_SESSION['dni'];
        $dia=date("Y-m-d H:i:s");
        if($_SESSION['rol']=='Paciente'){
            $sql = "SELECT
            cita.paciente AS paciente_dni,
            usuario.nombre AS paciente,
            cita.doctor AS doctor_dni,
            doctor.nombre AS doctor,
            cita.diagnostico AS diagnostico,
            cita.fecha As fecha
          FROM
            cita
            INNER JOIN usuario ON cita.paciente = usuario.dni
            INNER JOIN doctor ON cita.doctor = doctor.dni
          where cita.paciente='$dni' and fecha>'$dia'"; 
        } 
        else if($_SESSION['rol']=='Doctor'){
            $_SESSION['rol']='Doctor';
            $sql = "SELECT
            cita.paciente AS paciente_dni,
            usuario.nombre AS paciente,
            cita.doctor AS doctor_dni,
            doctor.nombre AS doctor,
            cita.diagnostico AS diagnostico,
            cita.fecha As fecha
          FROM
            cita
            INNER JOIN usuario ON cita.paciente = usuario.dni
            INNER JOIN doctor ON cita.doctor = doctor.dni
          where cita.doctor='$dni' and fecha>'$dia'"; 
        }
        $resultado = $this->mysqli->query($sql);  
        if (mysqli_num_rows($resultado) == 0){
            return "vacio";
        }
        else{
            $datos = array();
            while ($row = $resultado->fetch_assoc()) {
                if(strtotime($row['fecha']) > strtotime(date("Y-m-d H:i:s"))){
                        $datos[]=$row;               
                }
            } 
            foreach ($datos as $key => $value) { 
                $fecha= $value['fecha'];
                $doctor=$value['doctor'];
                $anular = array("Anular" => "<button type='button' onclick='anularCita(this.id,`$fecha`)' class='btn btn-sm btn-link edicion' id=`$doctor` '><i class='bx bxs-checkbox-minus'></i></button>");
    
                $datos[$key] = array_merge($anular, $value);
            }  
            $columns = array_keys($datos[0]);
            
    
            $i = 0;
    
            $visibleColumns = ['doctor','paciente','fecha', 'diagnostico'];
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

    }
    function mostrarPasCitas()
    {   
        $dia=date("Y-m-d H:i:s");
        $dni=$_SESSION['dni']; 
        if($_SESSION['rol']=='Paciente'){
            $sql = "SELECT
            cita.paciente AS paciente_dni,
            usuario.nombre AS paciente,
            cita.doctor AS doctor_dni,
            doctor.nombre AS doctor,
            cita.diagnostico AS diagnostico,
            cita.fecha As fecha
          FROM
            cita
            INNER JOIN usuario ON cita.paciente = usuario.dni
            INNER JOIN doctor ON cita.doctor = doctor.dni
          where cita.usuario='$dni' and fecha<'$dia'"; 
        } 
        else if($_SESSION['rol']=='Doctor'){
            $sql = "SELECT
            cita.paciente AS paciente_dni,
            usuario.nombre AS paciente,
            cita.doctor AS doctor_dni,
            doctor.nombre AS doctor,
            cita.diagnostico AS diagnostico,
            cita.fecha AS fecha
          FROM
            cita
            INNER JOIN usuario ON cita.paciente = usuario.dni
            INNER JOIN doctor ON cita.doctor = doctor.dni
          where cita.doctor='$dni' and fecha<'$dia'"; 
        } 
        $resultado = $this->mysqli->query($sql);
        if (mysqli_num_rows($resultado) == 0){
            return "vacio";
        }
        $datos = array();
        while ($row = $resultado->fetch_assoc()) {
            if(strtotime($row['fecha']) < strtotime(date("Y-m-d H:i:s"))){
                $datos[]=$row;
            }
        }  
        $columns = array_keys($datos[0]);
        

        $i = 0;

        $visibleColumns = ['paciente','doctor','fecha','diagnostico'];
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
    function citaActual(){
            $dia=date("Y-m-d H:i:s");
            $dia1=date("Y-m-d H:i:s", strtotime('-30 minutes', strtotime($dia)));
            $dia2=date("Y-m-d H:i:s", strtotime('+30 minutes', strtotime($dia)));
            $dni=$_SESSION['dni'];
            $sql = "SELECT
            cita.paciente AS paciente_dni,
            usuario.nombre AS paciente,
            cita.doctor AS doctor_dni,
            doctor.nombre AS doctor,
            cita.diagnostico AS diagnostico,
            cita.fecha AS fecha
          FROM
            cita
            INNER JOIN usuario ON cita.paciente = usuario.dni
            INNER JOIN doctor ON cita.doctor = doctor.dni
          where cita.doctor='$dni' and fecha between '$dia1' and '$dia2';";    
            $resultado = $this->mysqli->query($sql);
            if (mysqli_num_rows($resultado) == 0){
                return "vacio";
            }
            $datos = array();
            while ($row = $resultado->fetch_assoc()) {
                if(strtotime($row['fecha']) < strtotime(date("Y-m-d H:i:s"))){
                    $datos[]=$row;
                }
            }  
            $columns = array_keys($datos[0]);
            foreach ($datos as $key => $value) { 
                $editar = array("Escribir diagnostico" => "<button type='button' class='btn btn-sm btn-link edicion' id='{$value['dni']}' data-bs-toggle='modal' data-bs-target='#modalDiagnostico' ><i class='bx bxs-edit'></i></button>");
                $datos[$key] = array_merge( $editar, $value);
            }  
            $columns = array_keys($datos[0]);
            
           
    
            $i = 0;
    
            $visibleColumns = ['Escribir diagnostico','paciente','doctor','fecha','diagnostico'];
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
    
    function cambiarCita()//Antes hay que mostrar citas disponibles 
    {
        $sql = "UPDATE cita SET paciente = '{$this->paciente}'
            WHERE fecha= '{$this->fecha}' and doctor = '{$this->doctor}'";
        $this->mysqli->query($sql);
        return "exito";
    }
    function modificarCita()//tengo que pasarle un parametro anterior
    {
            $sql = "UPDATE cita SET paciente = '{$this->paciente}', 
            doctor = '{$this->doctor}', fecha = '{$this->fecha}'}', diagnostico='{$this->diagnostico}'
            WHERE  paciente = '{$this->paciente1}' and doctor='{$this->doctor1}' and fecha='{$this->fecha1}'
            and diagnostico='$this->diagnostico1'";  
            $resultado = $this->mysqli->query($sql);
            return "exito";
    }
}
