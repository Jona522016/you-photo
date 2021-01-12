
var url = window.location.href;
var swLocation = '/you-photo/sw.js';


if ( navigator.serviceWorker ) {


	if ( url.includes('localhost') ) {
		swLocation = 'sw.js';
	}


	navigator.serviceWorker.register( swLocation );
}

const secciones = ["inicio","tomar_foto","contacto","afiliados","about","terminos","politica"]

$("#foto").change(function(){
	readURL(this);
});

$("#enviar_foto").click(function(){

	/*fech("app.negociosweb.info/validarColegio/"+md5($("#clave").val()))
	.then( res=>{
		res = JSON.parse(res);
		if(res.valido){
			var info = {
				nombre:$("#nombre").val(),
				id_grado:$("#grado").val(),
				id_colegio:res.id_colegio,
			}
		}else{			
			$('#alerta').fadeIn(500);
			setTimeout(function() { 
				$('#alerta').fadeOut(1000); 
			}, 5000);
			$('#clave_invalida').show();
			return
		}
	});*/
	var info = {
		nombre:$("#nombre").val(),
		id_grado:$("#grado").val(),
		id_colegio:1,
	}

	fetch('https://app.negociosweb.info/fotografias/grabarFotografia',
	{
		method:'POST',
		headers:{
			'Content-Type':'application/json'
		},
		body: JSON.stringify(info)
	})
	.then(res => res.json())
	.then(res => console.log('app.js', res))
	.catch(err => console.log('app js error: ', err));
});

function mostrar_seccion(seccion){
	if(!$("#"+seccion).is(":visible")){
		secciones.forEach( element =>{
			if(element != seccion){
				$("#"+element).hide();
				$("#menu_"+element).removeClass("active");
			}
		});
		$("#"+seccion).show(300);
		$("#menu_"+seccion).addClass("active");
	}
	if($("#navBar").is(":visible")){
		$(".navbar-toggler").trigger("click");
		$("#hamburguesa").removeClass("is-active");
	}
}

function readURL(input) {
	if (input.files && input.files[0]) {
		var reader = new FileReader();

		reader.onload = function (e) {
			$('#vista_previa').attr('src', e.target.result);
			$("#vista_previa").show(100);
		}

		reader.readAsDataURL(input.files[0]);
	}
}

function verClave(){
	var x = document.getElementById("clave");
	if (x.type === "password") {
		x.type = "text";
		$("#ver_clave").removeClass('fa-eye-slash');
		$("#ver_clave").addClass('fa-eye g-color-green');
	} else {
		x.type = "password";
		$("#ver_clave").removeClass('fa-eye g-color-green');
		$("#ver_clave").addClass('fa-eye-slash');
	}
}

function mostrarAlerta(tipo,titulo,mensaje){
}