const body = document.querySelector('body'),
    sidebar = body.querySelector('nav'),
    toggle = body.querySelector(".toggle"),
    searchBtn = body.querySelector(".search-box"),
    modeSwitch = body.querySelector(".toggle-switch"),
    modeText = body.querySelector(".mode-text");

    toggle.addEventListener("click", () => {
        sidebar.classList.toggle("close");
    })
    
    searchBtn.addEventListener("click", () => {
        sidebar.classList.remove("close");
    })
$(document).ready(function () {

    // Eventos de click en categorías (Filtrar y mostrar, importar...etc)
    $(".accionador").click(function (e) {
        // e.preventDefault();
    

        let accion = $(this).text().trim();
        let isActive = $(this).hasClass('active');

        if (accion == 'Ver citas pasadas') {

            if (!isActive) {
                $('#contenido').empty();
                $('#contenido').hide().load('./historialCitas.html', (e) => {
                }).fadeIn('500');
                console.log('hola')

            }

        } else if (accion == 'Ver futuras citas') {
            if (!isActive) {
                $('#contenido').empty();
                $('#contenido').hide().load('./proximaCita.html', (e) => {
                }).fadeIn('500');

            }
        } else if (accion == 'Cita actual') {
            if (!isActive) {
                $('#contenido').empty();
                $('#contenido').hide().load('./citaActual.html', (e) => {
                    modificar(accion);
                }).fadeIn('500');

            }
        }

        $("#submit-log").click(function (e) {
            $('#contenido').empty();
            $('#contenido').load('./views/log.php');
            $('#contenido').hide();
        });

        $(".accionador").each(function (index, element) {
            $(element).removeClass('active');
        });

        $(this).addClass('active');







    });
});

    $(".futuro").click(function() {
        let datos="tipo=proximasCitas";
        $.ajax({
            type: "POST",
            url: "../../controladores/controllerDoctor.php",
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
    
    $(".pasado").click(function() {
        let datos = "tipo=pasadasCitas";
        $.ajax({
            type: "POST",
            url: "../../controladores/controllerDoctor.php",
            data: datos,
            dataType: "JSON",
            success: function(response) {
                if (response == "vacio") {
                    $('#contenido').empty();
                    $('#contenido').append("<div class='h1 mx-auto m-5 p-5'>No historial medico aqui</div>)");
                } else {
                    var tabla = $('#pasado').DataTable({
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
                            // ...
                        }
                    });
                    $('#buscador').empty();
                    $('#buscador').append('<input type="text" placeholder="Buscar..." class="search" id="search">');
                    $('#search').on('keyup', function() {
                        tabla.search(this.value).draw();
                    });
                }
            }
        });
    });

    $(".actual").click(function() {
        let datos="tipo=actualCita";
        $.ajax({
            type: "POST",
            url: "../../controladores/controllerDoctor.php",
            data: datos,
            dataType: "JSON",
            success: function(response) {
    
                if (response=="vacio"){
                    $('#contenido').empty();
                    $('#contenido').append("<div class=' h1 mx-auto m-5 p-5'>No tiene citas en el rango de 1 hora</div>)");
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

    function modificar() { 

        $("#Editar").click(function() {
            // Obtener el diagnóstico del textarea
            var diagnostico = $("#diagnostico1").val();
            
            // Cerrar el modal
            $("#modalDiagnostico").modal('hide');
            
            // Enviar el diagnóstico por AJAX a un archivo PHP
            $.ajax({
              url: "../../controladores/controllerDoctor.php",
              method: "POST",
              data: { diagnostico: diagnostico },
              success: function(response) {
                Swal.fire({
                    position: 'top-end',
                    icon: 'success',
                    title: 'Diagnostico modificado',
                    timer: 3000
                  });
              },
              error: function(xhr, status, error) {
                // Manejar los errores de la petición AJAX si es necesario
                console.log(error);
              }
            });
          });
        }      







