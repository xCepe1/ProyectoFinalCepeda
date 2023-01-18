
const body = document.querySelector('body'),
    sidebar = body.querySelector('nav'),
    toggle = body.querySelector(".toggle"),
    searchBtn = body.querySelector(".search-box"),
    modeSwitch = body.querySelector(".toggle-switch"),
    modeText = body.querySelector(".mode-text");


let paciente = $(".paciente");
let editar = $(".Editar");
let doctor = $(".doctor");
let especialidad = $(".especialidad");
let aseguradora = $(".aseguradora");
let cita = $(".cita");
const formulario = document.getElementById('form-registro');
const inputs = document.querySelectorAll('#form-registro input');

const expresiones = {
    dni: /^[\d]{1,3}\.?[\d]{3,3}\.?[\d]{3,3}.?[A-Z]{1}$/,// expresion para dni
	usuario: /^[a-zA-ZÀ-ÿ\s]{1,40}$/, // Letras y espacios, pueden llevar acentos.
	password: /^.{4,12}$/, // 4 a 12 digitos.
	correo: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,//correo
}

const campos = {
    dni: false,
	usuario: false,
	password: false,
	correo: false
}

const validarFormulario = (e) => {
	switch (e.target.name) {
        case "dni":
			validarCampo(expresiones.dni, e.target, e.target.name);
		break;
		case "nombre":
			validarCampo(expresiones.usuario, e.target, e.target.name);
		break;
		case "password":
			validarCampo(expresiones.password, e.target, e.target.name);
		break;
		case "email":
			validarCampo(expresiones.correo, e.target, e.target.name);
		break;
	}
}

const validarCampo = (expresion, input, campo) => {
	if(expresion.test(input.value)){//comprobamos que fuciona la expresion
		campos[campo] = true;
	} else {
		campos[campo] = false;
	}
}

$(document).ready(function () {

    // Eventos de click en categorías (Filtrar y mostrar, importar...etc)
    $(".accionador").click(function (e) {
        // e.preventDefault();

        let accion = $(this).text().trim();
        let isActive = $(this).hasClass('active');

        if (accion == 'Paciente') {

            if (!isActive) {
                $('#contenido').empty();
                $('#contenido').hide().load('./adminUsuario.html', (e) => {
                    modificar(accion);
                    anadir(accion);
                }).fadeIn('500');

            }

        } else if (accion == 'Doctor') {
            if (!isActive) {
                $('#contenido').empty();
                $('#contenido').hide().load('./adminDoctor.html', (e) => {
                    modificar(accion);
                    anadir(accion);
                }).fadeIn('500');

            }
        } else if (accion == 'Especialidad') {
            if (!isActive) {
                $('#contenido').empty();
                $('#contenido').hide().load('./adminEspecialidad.html', (e) => {
                    modificar(accion);
                    anadir(accion);
                }).fadeIn('500');

            }
        } else if (accion == 'Aseguradora') {
            if (!isActive) {
                $('#contenido').empty();
                $('#contenido').hide().load('./adminAseguradora.html', (e) => {
                    modificar(accion);
                    anadir(accion);
                }).fadeIn('500');
            }
        } else if (accion == 'Citas') {
            if (!isActive) {
                $('#contenido').empty();
                $('#contenido').hide().load('./adminCita.html', (e) => {
                    modificar(accion);
                    anadir(accion);
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

function modificar(accion) {
    const editar_form = document.getElementById('Editar');
    editar_form.addEventListener('click', (e) => {
        let data = $('#editar-form').serializeArray();
        if (accion == "Paciente" || accion == "Doctor") {
            let dni = $(".dni-modificar").val();
            data = data.concat({
                name: "dni",
                value: dni,
            });
        } else if (accion == "Especialidad") {
            let nombre = $(".nombre-modificar").val();
            let aseguradora = $(".aseguradora-modificar").val();
            data = data.concat({
                name: "nombre",
                value: nombre,
            });
            data = data.concat({
                name: "aseguradora",
                value: aseguradora,
            });
        } else if (accion == "Citas") {
            let id = $(".id-modificar").val();
            data = data.concat({
                name: "id",
                value: id,
            });

        }
        data = data.concat({
            name: "tipo",
            value: "modificar"
        })


        $.ajax({
            type: "POST",
            url: "../../controladores/admin/controllerAdmin" + accion + ".php",
            data: data,
            dataType: "JSON",
            success: function (response) {

                if (response == "exito") {
                    Swal.fire({
                        position: 'top-end',
                        icon: 'success',
                        title: "Modificacion realizada correctamente",
                      });
                    $('#editarModal').modal('hide');
                    if (accion == "Paciente") {
                        $(paciente).removeClass('active');
                        $(paciente).click();
                    } else if (accion == "Doctor") {
                        $(doctor).removeClass('active');
                        $(doctor).click();
                    } else if (accion == "Especialidad") {
                        $(especialidad).removeClass('active');
                        $(especialidad).click();
                    } else if (accion == "Citas") {
                        $(cita).removeClass('active');
                        $(cita).click();
                    }


                } else {
                    Swal.fire({
                        position: 'top-end',
                        icon: 'error',
                        title: "No se puede modificar",
                      });
                }
            }
        });

    })
};

function anadir(accion) {
    const anadir = document.getElementById('Anadir-boton');
    anadir.addEventListener('click', (e) => {
        let data = $('#anadir-form').serializeArray();
        data = data.concat({
            name: "tipo",
            value: "anadir"
        });

        $.ajax({
            type: "POST",
            url: "../../controladores/admin/controllerAdmin" + accion + ".php",
            data: data,
            dataType: "JSON",
            success: function (response) {

                if (response == "exito") {
                    Swal.fire({
                        position: 'top-end',
                        icon: 'success',
                        title: "Creado correctamente",
                      });
                    $('#anadirModal').modal('hide');
                    if (accion == "Paciente") {
                        $(paciente).removeClass('active');
                        $(paciente).click();
                    } else if (accion == "Doctor") {
                        $(doctor).removeClass('active');
                        $(doctor).click();
                    } else if (accion == "Especialidad") {
                        $(especialidad).removeClass('active');
                        $(especialidad).click();
                    } else if (accion == "Citas") {
                        $(cita).removeClass('active');
                        $(cita).click();
                    }



                } else {
                    Swal.fire({
                        position: 'top-end',
                        icon: 'error',
                        title: "Error, el " + accion + " ya existe",
                      });
                }
            }
        });

    })
};




$(paciente).click(function (e) {
    e.preventDefault();
    $.ajax({
        type: "POST",
        url: "../../controladores/admin/controllerAdminPaciente.php",
        dataType: "JSON",
        success: function (response) {
            var tabla=$('#mostrarPacientes').DataTable({
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
    });
});

$(doctor).click(function (e) {
    e.preventDefault();

    $.ajax({
        type: "POST",
        url: "../../controladores/admin/controllerAdminDoctor.php",
        dataType: "JSON",
        success: function (response) {
            var tabla=$('#mostrarDoctor').DataTable({
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
    });
});

$(especialidad).click(function (e) {
    e.preventDefault();

    $.ajax({
        type: "POST",
        url: "../../controladores/admin/controllerAdminEspecialidad.php",
        dataType: "JSON",
        success: function (response) {
            var tabla=$('#mostrarEspecialidad').DataTable({
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
    });
});

$(aseguradora).click(function (e) {
    e.preventDefault();

    $.ajax({
        type: "POST",
        url: "../../controladores/admin/controllerAdminAseguradora.php",
        dataType: "JSON",
        success: function (response) {
            var tabla=$('#mostrarAseguradora').DataTable({
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
    });
});

$(cita).click(function (e) {
    e.preventDefault();

    $.ajax({
        type: "POST",
        url: "../../controladores/admin/controllerAdminCitas.php",
        dataType: "JSON",
        success: function (response) {
            var tabla=$('#mostrarCita').DataTable({
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
    });
});




toggle.addEventListener("click", () => {
    sidebar.classList.toggle("close");
})

searchBtn.addEventListener("click", () => {
    sidebar.classList.remove("close");
})


function rellenarModal(id, accion, segundo) {
    let data;
    if (accion == "Paciente" || accion == "Doctor") {
        data = "dni=" + id + "&tipo=mostrarUno";
    } else if (accion == "Especialidad") {
        data = "nombre=" + id + "&aseguradora=" + segundo + "&tipo=mostrarUno";
    } else if (accion == "Aseguradora") {
        data = "id=" + id + "&tipo=mostrarUno";
    } else if (accion == "Citas") {
        data = "id=" + id + "&tipo=mostrarUno";
    }

    $.ajax({
        type: "POST",
        url: "../../controladores/admin/controllerAdmin" + accion + ".php",
        data: data,
        dataType: "JSON",
        success: function (response) {
            let datos = response[0];
            if (accion == "Paciente") {
                $(".dni-modificar").val(datos.dni);
                $(".nombre-modificar").val(datos.nombre);
                $(".password-modificar").val(datos.password);
                $(".mail-modificar").val(datos.email);
            } else if (accion == "Doctor") {
                $(".dni-modificar").val(datos.dni);
                $(".nombre-modificar").val(datos.nombre);
                $(".especialidad-modificar").val(datos.especialidad);
                $(".mail-modificar").val(datos.email);
                $("#horarioDesde-modificar option[value='" + datos.horarioDesde + "']").prop("selected", true);
                $("#horarioHasta-modificar option[value='" + datos.horarioHasta + "']").prop("selected", true);
                $(".horarioEntrada-modificar").val(datos.horarioEntrada);
                $(".horarioSalida-modificar").val(datos.horarioSalida);
            } else if (accion == "Especialidad") {
                $(".aseguradora-modificar").val(datos.aseguradora);
                $(".nombre-modificar").val(datos.nombre);
            } else if (accion == "Aseguradora") {
                $(".id-modificar").val(datos.id);
                $(".nombre-modificar").val(datos.nombre);
                $(".numero-modificar").val(datos.numero_contacto);
                $(".email-modificar").val(datos.email);
            } else if (accion == "Citas") {
                let fecha= datos.fecha;
                fecha=fecha.split(" ");
                let fechas= fecha[0]+"T"+fecha[1]; 
                $(".id-modificar").val(datos.id);
                $(".paciente-modificar").val(datos.paciente);
                $(".doctor-modificar").val(datos.doctor);
                $(".fecha-modificar").val(fechas);
            }
        }
    });
}

function eliminar(id, accion, segundo) {
    console.log(id+' y ' +accion +' y ' +segundo)
    let data;
    if (accion == "Paciente" || accion == "Doctor") {
        data = "dni=" + id + "&tipo=eliminar";
    } else if (accion == "Especialidad") {
        data = "nombre=" + id + "&aseguradora=" + segundo + "&tipo=eliminar";
    }
    else if(accion=='Aseguradora'){
        data='id=' + id+ '&tipo=eliminar';
    } else if (accion == "Citas") {
        let datos=id.split(',');
        data = "paciente=" + datos[0] +"&doctore=" + datos[1] +"&fecha=" + datos[2] + "&tipo=eliminar";
    
    }
    $.ajax({
        type: "POST",
        url: "../../controladores/admin/controllerAdmin" + accion + ".php",
        data: data,
        dataType: "JSON",
        success: function (response) {
            let datos = response[0];
            if (response == "exito") {
                Swal.fire({
                    position: 'top-end',
                    icon: 'success',
                    title: accion + " eliminado correctamente",
                  });
                if (accion == "Paciente") {
                    $(paciente).removeClass('active');
                    $(paciente).click();
                } else if (accion == "Doctor") {
                    $(doctor).removeClass('active');
                    $(doctor).click();
                } else if (accion == "Especialidad") {
                    $(especialidad).removeClass('active');
                    $(especialidad).click();
                }
            } else {
                Swal.fire({
                    position: 'top-end',
                    icon: 'error',
                    title: "No se ha podido realizar el borrado del/a " + accion,
                  });
            }
        }
    });

}