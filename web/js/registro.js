
const formulario = document.getElementById('form-registro');
const inputs = document.querySelectorAll('#form-registro input');

let iniciar = $(".registro");


function getDatos() {
    let form = $("#form-registro").serialize();
    $.ajax({
        type: "POST",
        url: "../controladores/controllerRegistro.php",
        data: form,
        dataType: "JSON",
        success: function(response) {
            if (!response) {
                Swal.fire({
                    position: 'top-end',
                    icon: 'error',
                    title: 'El sevidor no responde',
                    showConfirmButton: true,
                    timer: 1500
                  })

            } else if (response !== 2) {
                Swal.fire({
                    position: 'top-end',
                    icon: 'success',
                    title: 'Usuario creado',
                    showConfirmButton: true,
                    timer: 1500
                  })
                window.location.href = 'login.html';
            } else {
                Swal.fire({
                    position: 'top-end',
                    icon: 'error',
                    title: 'Usuario ya existente',
                    showConfirmButton: true,
                    timer: 1500
                  })
            }


        }

    });
}

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
    console.log(expresion +' y ' + input + ' y '+ campo)
    var hola= document.getElementById('grupo__'+campo+" ' ")
    console.log(hola)
	if(expresion.test(input.value)){ //comprobamos que funciona la expresion
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

$(document).ready(function() {
    $(iniciar).click(function(e) {
        e.preventDefault();
        if(campos.dni && campos.nombre && campos.password && campos.email ){
            getDatos();
            formulario.reset();
        } 
    });
});