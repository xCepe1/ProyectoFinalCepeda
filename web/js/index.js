if (usuario = sessionStorage.getItem('usuario')) {
    $(".acceso").empty().append("<li class='nav-item'> <a class='nav-link' href='' >"+usuario+" <span  class='visually-hidden'>(current)</span></a> </li>"
    +"<li class='nav-item'><a class='nav-item nav-link ' href='conexion/header.php'  >Citas</a></li>"
    +"<li class='nav-item'><a class='nav-item nav-link cerrar' id='cerrar' href='conexion/cerrar.php'  >Cerrar Sesion</a></li>");
} else {
    $.ajax({
        type: "POST",
        url: "conexion/cerrar.php",
        dataType: "dataType",
        success: function (response) {
            
        }
    });
}

$("#cerrar").click(function(e) {
    e.preventDefault();
    sessionStorage.clear();
    window.location.reload()
});