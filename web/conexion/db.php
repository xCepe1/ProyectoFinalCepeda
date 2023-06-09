<?php

class Connection
{
    public $ip;
    public $usuario;
    public $password;
    public $bd;


    /**
     * Funcion De la conexionion con la base de datos
     * @param servidor $String es la direccion ip del servidor
     * @param usuario $String es el login de la base de datos
     * @param password $String es la contraseña del usuario
     * @param bd  $String es el nombre d ela base de datos
     */
    function __construct()
    {
        $this->ip = 'eu-cdbr-west-03.cleardb.net';
        $this->usuario = 'b779dddf5208ba';
        $this->password = 'c33f6bda';
        $this->bd = 'heroku_319148137defb00';
    }


    function con()
    {
        $mysqli = new mysqli($this->ip, $this->usuario, $this->password, $this->bd);

        // comprueba que no falle la conexion
        if ($mysqli->connect_error) {
            die("Connection failed: " . $mysqli->connect_error);
        }

        return $mysqli;
    }
}
?>
