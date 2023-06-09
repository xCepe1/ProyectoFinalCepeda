
if ((usuario = sessionStorage.getItem('usuario'))&&sessionStorage.getItem('rol')!=='Doctor') {
    $(".acceso").empty().append("<li class='nav-item'> <a class='nav-link'id='editarPaciente' href='' data-toggle='modal' data-target='#editarModalPaciente' >"+usuario+" <span  class='visually-hidden'>(current)</span></a> </li>"
    +"<li class='nav-item'><a class='nav-item nav-link ' href='conexion/header.php'  >Citas</a></li>"
    +"<li class='nav-item'><a class='nav-item nav-link cerrar' id='cerrar' href='conexion/cerrar.php'  >Cerrar Sesion</a></li>");
    $.ajax({
        type: "POST",
        url: "controladores/controllerDatosPaciente.php",
        dataType: "JSON",
        success: function (response) {
            let datos = response[0];
                $(".dni-modificarPaciente").val(datos.dni);
                $(".nombre-modificarPaciente").val(datos.nombre);
                $(".password-modificarPaciente").val(datos.password);
                $(".mail-modificarPaciente").val(datos.email);
                $(".telefono-modificarPaciente").val(datos.telefono_movil);
                $(".fecha-modificarPaciente").val(datos.fecha_nacimiento);
        }
    });
}
else if((usuario = sessionStorage.getItem('usuario'))&&sessionStorage.getItem('rol')=='Doctor'){
    var formulario = document.getElementById("editar-formDoctor");
    formulario.reset();
    $(".acceso").empty().append("<li class='nav-item'> <a class='nav-link' id='editarDoctor' href='' data-toggle='modal' data-target='#editarModalDoctor' >"+usuario+" <span  class='visually-hidden'>(current)</span></a> </li>"
    +"<li class='nav-item'><a class='nav-item nav-link ' href='conexion/header.php'  >Citas</a></li>"
    +"<li class='nav-item'><a class='nav-item nav-link cerrar' id='cerrar' href='conexion/cerrar.php'  >Cerrar Sesion</a></li>");
    $.ajax({
        type: "POST",
        url: "controladores/controllerDatosDoctor.php",
        dataType: "JSON",
        success: function (response) {
            let datos = response[0];
                $(".dni-modificarDoctor").val(datos.dni);
                $(".nombre-modificarDoctor").val(datos.nombre);
                $(".especialidad-modificarDoctor").val(datos.especialidad);
                $(".mail-modificarDoctor").val(datos.email);
                $(".password-modificarDoctor").val(datos.password);
                $("#horarioDesde-modificarDoctor option[value='" + datos.horarioDesde + "']").prop("selected", true);
                $("#horarioHasta-modificarDoctor option[value='" + datos.horarioHasta + "']").prop("selected", true);
                $(".horarioEntrada-modificarDoctor").val(datos.horarioEntrada);
                $(".horarioSalida-modificarDoctor").val(datos.horarioSalida);
        }
    });
}
else {
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



    $('#botonPaciente').click(function(e) {
      e.preventDefault();
  
      var datos=$('#editar-formPaciente').serializeArray();


      datos=datos.concat({
      name:'tipo',
      value:'modificar'
      })
  
  
      $.ajax({
        url: './controladores/controllerDatosPaciente.php',
        method: 'POST',
        data: datos,
        dataType: "JSON", 
        success: function(response) {
          Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: 'Datos modificados',
            timer: 3000
          });
        }
      });
    });
  
    $('#botonDoctor').click(function(e) {
      e.preventDefault();
  
      var datos=$('#editar-formDoctor').serializeArray();


      datos=datos.concat({
      name:'tipo',
      value:'modificar'
      })
  

  
      $.ajax({
        url: './controladores/controllerDatosDoctor.php',
        method: 'POST',
        data: datos,                     
        dataType: "JSON",        
        success: function(response) {
            Swal.fire({
                position: 'top-end',
                icon: 'success',
                title: 'Datos modificados',
                timer: 3000
              });
        }
      });
    });

  





