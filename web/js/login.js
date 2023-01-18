const formulario = document.getElementById('form-login');
const inputs = document.querySelectorAll('#form-login input');

$(document).ready(function() {
    $("#form-login").submit(function(e) {
        e.preventDefault();
        if(campos.dni ){
            getDatos();
            formulario.reset();
        }
    });

});

function getDatos() {
    let form = $("#form-login").serialize();
    $.ajax({
        type: "POST",
        url: "../controladores/controllerLogin.php",
        data: form,
        dataType: "JSON",
        success: function(response) {

            if (!response) {
                Swal.fire({
                    position: 'top-end',
                    icon: 'error',
                    title: 'EL servidor no responde',
                    showConfirmButton: true,
                    timer: 1500
                  })
            } else if (response == "password incorrecta"||response == "No existe el usuario") {
                Swal.fire({
                    position: 'top-end',
                    icon: 'error',
                    title: 'Introduzca los datos correctamente',
                    showConfirmButton: true
                  })
            } else if (response != 1) {
                Swal.fire({
                    position: 'top-end',
                    icon: 'success',
                    title: 'Hola ' + response + ' bienvenido a Quiron Salud',
                    timer: 3000
                  });
                window.location.href = '../index.html';
                sessionStorage.setItem('usuario', response);
            } else {
                Swal.fire({
                    position: 'top-end',
                    icon: 'error',
                    title: 'Usted ya ha iniciado sesion',
                    showConfirmButton: true,
                    timer: 1500
                  })
                window.location.href = '../index.html';
            }

        }

    });
    
}
const expresiones = {
    dni: /^[\d]{1,3}\.?[\d]{3,3}\.?[\d]{3,3}.?[A-Z]{1}$/,// expresion para dni
}

const campos = {dni: false,
}

const validarFormulario = (e) => {
	switch (e.target.name) {
        case "dni":
			validarCampo(expresiones.dni, e.target, e.target.name);
		break;
	}
}

const validarCampo = (expresion, input, campo) => {
	if(expresion.test(input.value)){//comprobamos que fuciona la expresion
		document.getElementById(`grupo__${campo}`).classList.remove('formulario__grupo-incorrecto');
		document.getElementById(`grupo__${campo}`).classList.add('formulario__grupo-correcto');
		document.querySelector(`#grupo__${campo} .formulario__input-error`).classList.remove('formulario__input-error-activo');
		campos[campo] = true;
	} else {
		document.getElementById(`grupo__${campo}`).classList.add('formulario__grupo-incorrecto');
		document.getElementById(`grupo__${campo}`).classList.remove('formulario__grupo-correcto');
		document.querySelector(`#grupo__${campo} .formulario__input-error`).classList.add('formulario__input-error-activo');
		campos[campo] = false;
	}
}


inputs.forEach((input) => {
	input.addEventListener('keyup', validarFormulario); //cuando levantas la tecla
	input.addEventListener('blur', validarFormulario); //cuando se sale del input
});