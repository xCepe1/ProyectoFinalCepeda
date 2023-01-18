const body = document.querySelector('body'),
    sidebar = body.querySelector('nav'),
    toggle = body.querySelector(".toggle"),
    searchBtn = body.querySelector(".search-box"),
    modeSwitch = body.querySelector(".toggle-switch"),
    modeText = body.querySelector(".mode-text");

let url = "../../controladores/controllerPaciente.php";

toggle.addEventListener("click", () => {
    sidebar.classList.toggle("close");
})

searchBtn.addEventListener("click", () => {
    sidebar.classList.remove("close");
})

$(document).ready(function() {

    // Eventos de click en categorías (Filtrar y mostrar, importar...etc)
    $(".accionador").click(function(e) {
        // e.preventDefault();
        
        let accion = $(this).text().trim();
        let isActive = $(this).hasClass('active');

        if (accion == 'Pedir cita') {
            if (!isActive) {
                $('#contenido').empty();

                $('#contenido').hide().load('./pedirCita.html', (e) => {
                    modificarFormulario();
                    mostrarPosiblesCitas();
                    $('#datepicker').datepicker({
                        format: 'yyyy-mm-dd',
                        startDate: '0d',
                        multidate: 2,
                        daysOfWeekDisabled: '06', 
                        language: 'es'
                    });
                }).fadeIn('500');
            } else{
                $('#citacion').show();
                $('#pedirCitas').parents('div.dataTables_wrapper').first().hide();
            }

        } else if (accion == 'Proximas citas') {

            if (!isActive) {
                $('#contenido').empty();
                $('#contenido').hide().load('./proximaCita.html', (e) => {
                    // mostrarProximaCita();

                }).fadeIn('500');

            }

        } else if (accion == 'Historial medico') {
            if (!isActive) {
                $('#contenido').empty();
                $('#contenido').hide().load('./historialMedico.html', (e) => {
                    // mostrarHistorial();
                }).fadeIn('500');

            }
        } else if (accion == 'Datos del usuario') {
            if (!isActive) {
                $('#contenido').empty();
                $('#contenido').hide().load('./pacienteUsuario.html', (e) => {
                    datosUsuario();
                }).fadeIn('500');

            }
        }

        $(".accionador").each(function(index, element) {
            $(element).removeClass('active');
        });

        $(this).addClass('active');







    });
})

function modificarFormulario() {
    $("#aseguradora").empty();
    $("#especialidad").empty();
    $("#doctor").empty();

    $.ajax({ //DAR OPCIONES A LAS ASEGURADORAS
        type: "POST",
        url: url,
        success: function(response) {
            respuestas= JSON.parse(response);
            respuestas.forEach(op => {
                $("#aseguradora").append(" <input type='radio' id='" + op.id + "' name='aseguradoras' value='" + op.id + "'> " + op.nombre );
            });
        }
    });


    $("#muestra").change(function(e) { //UTILIZAR O NO FECHA
        e.preventDefault();
        let opcion = $("#muestra").val();
        if (opcion == "personalizada") {
            $("#date").show();
            $("#datepicker").removeAttr('disabled');
        } else if (opcion == "proxima") {
            $("#datepicker").attr('disabled', 'disabled');
            $("#date").hide();

        }
    });



    $("#aseguradora").click(function() { //DAR OPCIONES A ESPECIALIDAD
        let datos ="id="+ document.querySelector('input[name=aseguradoras]:checked').value +"&tipo=especialidad";
        
        $.ajax({
            type: "POST",
            url: url,
            data: datos,
            success: function(response) {
                let opciones = JSON.parse(response);
                $('#especialidad').empty();
                opciones.forEach(op => {
                    $('#especialidad').append($('<option>', {
                        value: op.nombre,
                        text: op.nombre
                    }));
                });
            }
        });

    });

    $("#especialidad").change(function() { //DAR OPCIONES A DOCTOR
        let dato = "id="+$("#especialidad").val()+"&tipo=doctor";
        $.ajax({
            type: "POST",
            url: url,
            data: dato,
            success: function(response) {
                let opciones = JSON.parse(response);       
                opciones.forEach(op => {
                
                    $('#doctor').append($('<option>', {
                        value: op.nombre,
                        text: op.nombre
                    }));
                });
            }
        });
    });
}

function mostrarPosiblesCitas(e) {

    $("#enviar").click(function(e) { //Recoger formulario para mostrar posibles citas
        e.preventDefault();
        let form = $("#citacion").serialize() + "&tipo=posiblesCitas";
        $.ajax({
            type: "POST",
            url: url,
            data: form,
            success: function(response) {
                $('#citacion').hide();
                respuesta= JSON.parse(response);
                var tabla=$('#pedirCitas').DataTable({
                    "dom": 'tp',
                    "destroy": true,
                    "data": respuesta.data,
                    "columns": respuesta.columns,
                    "columnDefs": respuesta.columnsDefs,
                    responsive: true,
                    "buttons": [{
                        // Botón para Excel
                        extend: 'excelHtml5',
                        footer: false,
                        header: false,
                        // className: 'btn btn-white form-control',
                        text: 'Exportar a Excel'
                    }],
                    "language": {
                        "decimal": ",",
                        "emptyTable": "No hay información",
                        "info": "Mostrando _START_ a _END_ de _TOTAL_ registros",
                        "infoEmpty": "Mostrando 0 a 0 de 0 Registros",
                        "infoFiltered": "(Filtrado de _MAX_ total registros)",
                        "infoPostFix": "",
                        "thousands": ",",
                        "lengthMenu": "Mostrar _MENU_ Registros",
                        "loadingRecords": "Cargando...",
                        "processing": "Procesando...",
                        "Add Condition": "Filtrar",
                        "search": "Buscar:",
                        "zeroRecords": "Sin resultados encontrados",
                        "paginate": {
                            "first": "Primero",
                            "last": "Ultimo",
                            "next": "Siguiente",
                            "previous": "Anterior"
                        },
                        "searchBuilder": {
                            "add": "Añadir condición",
                            "button": {
                                "0": "Constructor de búsqueda",
                                "_": "Constructor de búsqueda (%d)"
                            },
                            "clearAll": "Borrar todo",
                            "condition": "Condición",
                            "conditions": {
                                "date": {
                                    "after": "Despues",
                                    "before": "Antes",
                                    "between": "Entre",
                                    "empty": "Vacío",
                                    "equals": "Igual a",
                                    "notBetween": "No entre",
                                    "notEmpty": "No Vacio",
                                    "not": "Diferente de"
                                },
                                "number": {
                                    "between": "Entre",
                                    "empty": "Vacio",
                                    "equals": "Igual a",
                                    "gt": "Mayor a",
                                    "gte": "Mayor o igual a",
                                    "lt": "Menor que",
                                    "lte": "Menor o igual que",
                                    "notBetween": "No entre",
                                    "notEmpty": "No vacío",
                                    "not": "Diferente de"
                                },
                                "string": {
                                    "contains": "Contiene",
                                    "empty": "Vacío",
                                    "endsWith": "Termina en",
                                    "equals": "Igual a",
                                    "notEmpty": "No Vacio",
                                    "startsWith": "Empieza con",
                                    "not": "Diferente de",
                                    "notContains": "No Contiene",
                                    "notStarts": "No empieza con",
                                    "notEnds": "No termina con"
                                },
                                "array": {
                                    "not": "Diferente de",
                                    "equals": "Igual",
                                    "empty": "Vacío",
                                    "contains": "Contiene",
                                    "notEmpty": "No Vacío",
                                    "without": "Sin"
                                }
                            },
                            "data": "Data",
                            "deleteTitle": "Eliminar regla de filtrado",
                            "leftTitle": "Criterios anulados",
                            "logicAnd": "Y",
                            "logicOr": "O",
                            "rightTitle": "Criterios de sangría",
                            "title": {
                                "0": "Constructor de búsqueda",
                                "_": "Constructor de búsqueda (%d)"
                            },
                            "value": "Valor"
                        }
                    }
                });
                $('#buscador').empty();
                $('#buscador').append('<input type="text" placeholder="Buscar..." class="search" id="search">');
                $('#search').on( 'keyup', function () {
                    tabla.search( this.value ).draw();
                } );
            }
        });
    });
}

function cogerCita(id, doctor) {
    let data = { 'fecha': id, 'doctor': doctor ,'tipo': 'cogerCita'}
    $.ajax({
        type: "POST",
        url: url,
        data: data,
        success: function(response) {
            let respuesta= response;
            if(respuesta ="exito"){
                
                Swal.fire({
                    position: 'top-end',
                    icon: 'success',
                    title: 'Usted tiene una nueva cita',
                    showConfirmButton: true,
                    timer: 1500
                  })
            }
        }
    });
}

function anularCita(id, fecha) {
    let data = { 'doctor': id, 'fecha': fecha ,'tipo': 'cancelarCita'}
    $.ajax({
        type: "POST",
        url: url,
        data: data,
        success: function(response) {
            if(response='exito'){
                Swal.fire({
                    position: 'top-end',
                    icon: 'success',
                    title: 'cita anulada',
                    showConfirmButton: true,
                    timer: 1500
                  })
            } else{
                Swal.fire({
                    position: 'top-end',
                    icon: 'error',
                    title: 'Ups, algo salio mal',
                    showConfirmButton: true,
                    timer: 1500
                  })
            }
        }
    });
}

function datosUsuario(e) {

    e.preventDefault();
    let data = { "tipo": "mostrarUsuario" };
    $.ajax({
        type: "POST",
        url: url,
        data: data,
        success: function(response) { //rellenar campos de usuario

        }
    });
    $("#cambiar").click(function() {
        let datos = $('#modificarUsuario').serialize();
        datos.push({ "tipo": "modificar" });
        $.ajax({
            type: "POST",
            url: url,
            data: datos,
            success: function(response) { //modificar los campos del usuario
                Swal.fire({
                    position: 'top-end',
                    icon: 'success',
                    title: 'Usuario modificado',
                    showConfirmButton: true,
                    timer: 1500
                  })
            }
        });
    });
}
$(".futuro").click(function() {
    let datos="tipo=proximasCitas";
    $.ajax({
        type: "POST",
        url: "../../controladores/controllerPaciente.php",
        data: datos,
        dataType: "JSON",
        success: function(response) {
            if (response=="vacio"){
                $('#contenido').empty();
                $('#contenido').append("<div class=' h1 mx-auto m-5 p-5'>No tiene futuras citas</div>)");
            }
            else{
                var tabla=$('#proximasCitas').DataTable({
                    "dom": 'tp',
                    "destroy": true,
                    "data": response.data,
                    "columns": response.columns,
                    "columnDefs": response.columnsDefs,
                    responsive: true,
                    "buttons": [{
                        // Botón para Excel
                        extend: 'excelHtml5',
                        footer: false,
                        header: false,
                        // className: 'btn btn-white form-control',
                        text: 'Exportar a Excel'
                    }],
                    "language": {
                        "decimal": ",",
                        "emptyTable": "No hay información",
                        "info": "Mostrando _START_ a _END_ de _TOTAL_ registros",
                        "infoEmpty": "Mostrando 0 a 0 de 0 Registros",
                        "infoFiltered": "(Filtrado de _MAX_ total registros)",
                        "infoPostFix": "",
                        "thousands": ",",
                        "lengthMenu": "Mostrar _MENU_ Registros",
                        "loadingRecords": "Cargando...",
                        "processing": "Procesando...",
                        "Add Condition": "Filtrar",
                        "search": "Buscar:",
                        "zeroRecords": "Sin resultados encontrados",
                        "paginate": {
                            "first": "Primero",
                            "last": "Ultimo",
                            "next": "Siguiente",
                            "previous": "Anterior"
                        },
                        "searchBuilder": {
                            "add": "Añadir condición",
                            "button": {
                                "0": "Constructor de búsqueda",
                                "_": "Constructor de búsqueda (%d)"
                            },
                            "clearAll": "Borrar todo",
                            "condition": "Condición",
                            "conditions": {
                                "date": {
                                    "after": "Despues",
                                    "before": "Antes",
                                    "between": "Entre",
                                    "empty": "Vacío",
                                    "equals": "Igual a",
                                    "notBetween": "No entre",
                                    "notEmpty": "No Vacio",
                                    "not": "Diferente de"
                                },
                                "number": {
                                    "between": "Entre",
                                    "empty": "Vacio",
                                    "equals": "Igual a",
                                    "gt": "Mayor a",
                                    "gte": "Mayor o igual a",
                                    "lt": "Menor que",
                                    "lte": "Menor o igual que",
                                    "notBetween": "No entre",
                                    "notEmpty": "No vacío",
                                    "not": "Diferente de"
                                },
                                "string": {
                                    "contains": "Contiene",
                                    "empty": "Vacío",
                                    "endsWith": "Termina en",
                                    "equals": "Igual a",
                                    "notEmpty": "No Vacio",
                                    "startsWith": "Empieza con",
                                    "not": "Diferente de",
                                    "notContains": "No Contiene",
                                    "notStarts": "No empieza con",
                                    "notEnds": "No termina con"
                                },
                                "array": {
                                    "not": "Diferente de",
                                    "equals": "Igual",
                                    "empty": "Vacío",
                                    "contains": "Contiene",
                                    "notEmpty": "No Vacío",
                                    "without": "Sin"
                                }
                            },
                            "data": "Data",
                            "deleteTitle": "Eliminar regla de filtrado",
                            "leftTitle": "Criterios anulados",
                            "logicAnd": "Y",
                            "logicOr": "O",
                            "rightTitle": "Criterios de sangría",
                            "title": {
                                "0": "Constructor de búsqueda",
                                "_": "Constructor de búsqueda (%d)"
                            },
                            "value": "Valor"
                        }
                    }
                });
                $('#buscador').empty();
                $('#buscador').append('<input type="text" placeholder="Buscar..." class="search" id="search">');
                $('#search').on( 'keyup', function () {
                    tabla.search( this.value ).draw();
                } );
            }
            
        }
    });
});

$(".historial").click(function() {
    let datos="tipo=pasadasCitas";
    $.ajax({
        type: "POST",
        url: "../../controladores/controllerPaciente.php",
        data: datos,
        dataType: "JSON",
        success: function(response) {

            if (response=="vacio"){
                $('#contenido').empty();
                $('#contenido').append("<div class=' h1 mx-auto m-5 p-5'>No historial medico aqui</div>)");
            }
            else{
                var tabla= $('#historialMedico').DataTable({
                    "dom": 'tp',
                    "destroy": true,
                    "data": response.data,
                    "columns": response.columns,
                    "columnDefs": response.columnsDefs,
                    responsive: true,
                    "buttons": [{
                        // Botón para Excel
                        extend: 'excelHtml5',
                        footer: false,
                        header: false,
                        // className: 'btn btn-white form-control',
                        text: 'Exportar a Excel'
                    }],
                    "language": {
                        "decimal": ",",
                        "emptyTable": "No hay información",
                        "info": "Mostrando _START_ a _END_ de _TOTAL_ registros",
                        "infoEmpty": "Mostrando 0 a 0 de 0 Registros",
                        "infoFiltered": "(Filtrado de _MAX_ total registros)",
                        "infoPostFix": "",
                        "thousands": ",",
                        "lengthMenu": "Mostrar _MENU_ Registros",
                        "loadingRecords": "Cargando...",
                        "processing": "Procesando...",
                        "Add Condition": "Filtrar",
                        "search": "Buscar:",
                        "zeroRecords": "Sin resultados encontrados",
                        "paginate": {
                            "first": "Primero",
                            "last": "Ultimo",
                            "next": "Siguiente",
                            "previous": "Anterior"
                        },
                        "searchBuilder": {
                            "add": "Añadir condición",
                            "button": {
                                "0": "Constructor de búsqueda",
                                "_": "Constructor de búsqueda (%d)"
                            },
                            "clearAll": "Borrar todo",
                            "condition": "Condición",
                            "conditions": {
                                "date": {
                                    "after": "Despues",
                                    "before": "Antes",
                                    "between": "Entre",
                                    "empty": "Vacío",
                                    "equals": "Igual a",
                                    "notBetween": "No entre",
                                    "notEmpty": "No Vacio",
                                    "not": "Diferente de"
                                },
                                "number": {
                                    "between": "Entre",
                                    "empty": "Vacio",
                                    "equals": "Igual a",
                                    "gt": "Mayor a",
                                    "gte": "Mayor o igual a",
                                    "lt": "Menor que",
                                    "lte": "Menor o igual que",
                                    "notBetween": "No entre",
                                    "notEmpty": "No vacío",
                                    "not": "Diferente de"
                                },
                                "string": {
                                    "contains": "Contiene",
                                    "empty": "Vacío",
                                    "endsWith": "Termina en",
                                    "equals": "Igual a",
                                    "notEmpty": "No Vacio",
                                    "startsWith": "Empieza con",
                                    "not": "Diferente de",
                                    "notContains": "No Contiene",
                                    "notStarts": "No empieza con",
                                    "notEnds": "No termina con"
                                },
                                "array": {
                                    "not": "Diferente de",
                                    "equals": "Igual",
                                    "empty": "Vacío",
                                    "contains": "Contiene",
                                    "notEmpty": "No Vacío",
                                    "without": "Sin"
                                }
                            },
                            "data": "Data",
                            "deleteTitle": "Eliminar regla de filtrado",
                            "leftTitle": "Criterios anulados",
                            "logicAnd": "Y",
                            "logicOr": "O",
                            "rightTitle": "Criterios de sangría",
                            "title": {
                                "0": "Constructor de búsqueda",
                                "_": "Constructor de búsqueda (%d)"
                            },
                            "value": "Valor"
                        }
                    }
                });
                $('#buscador').empty();
                $('#buscador').append('<input type="text" placeholder="Buscar..." class="search" id="search">');
                $('#search').on( 'keyup', function () {
                    tabla.search( this.value ).draw();
                } );
            }
            
        }
    });
});

$(".ajustes").click(function() {
    let datos="tipo=ajustes";
    $.ajax({
        type: "POST",
        url: "../../controladores/controllerPaciente.php",
        data: datos,
        dataType: "JSON",
        success: function(response) {
        }
    });
});

