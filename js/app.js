
var url = window.location.href;
var swLocation = '/you-photo/sw.js';


if ( navigator.serviceWorker ) {


	if ( url.includes('localhost') ) {
		swLocation = 'sw.js';
	}


	navigator.serviceWorker.register( swLocation );
}

const secciones = ["inicio","tomar_foto","contacto","afiliados","about","terminos","politica","desarrollo"]
var clicks_desarrollo = 0;
var primer_click = 0;

$("#foto").change(function(){
	readURL(this);
});

$("#enviar_foto").click(function(){
	campos = ["nombre","grado","clave","foto"];
	if( mostrarCamposObligatorios(campos)){
		fetch("https://api.negociosweb.info/api/validarColegio/"+md5($("#clave").val()))
		.then(res => res.json())
		.then( res=>{
			if(res.valido){
				$('#clave_invalida').hide();
				var nombre = $("#nombre").val().trim()
				var data = $("#vista_previa").attr('src');
				data = data.split(",");
				var content_type = data[0].split(";")
				data = data[1];
				content_type = content_type[0].split("data:")
				content_type = content_type[1];
				var imagen = nombre.toLowerCase().replace(" ","_")+Date.now()+'.'+content_type.split("/")[1];
				var info = {
					nombre:nombre,
					id_grado:$("#grado").val().trim(),
					id_colegio:res.id_colegio,
					_attachments: {
						'fotografia.png' : {
							content_type: content_type,
							data: data
						}
					},
					foto: $("#vista_previa").attr('src')
				}
				fetch('https://api.negociosweb.info/api/responder',
				{
					method:'POST',
					headers:{
						'Content-Type':'application/json'
					},
					body: JSON.stringify(info)
				})
				.then(res => res.json())
				.then(res => {
					if(res.status==="ok"){
						if(res.offline){
							$("#tipo_grabacion").replaceWith('<span class="badge badge-danger" id="tipo_grabacion">Offline</span>');
						}else{
							$("#tipo_grabacion").replaceWith('<span class="badge badge-success" id="tipo_grabacion">Online</span>');
						}
						mostrar_seccion('inicio');
						$('#alerta_grabacion').fadeIn(1500);
						$("html, body").animate({ scrollTop: 0 }, "slow");
						setTimeout(function() { 
							$('#alerta_grabacion').fadeOut(1300); 
						}, 5000);
						resetearForm();
					}					
				})
				.catch(err => console.log('app js error: ', err));
			}else{			
				$('#alerta').fadeIn(500);
				$("html, body").animate({ scrollTop: 0 }, "slow");
				setTimeout(function() { 
					$('#alerta').fadeOut(1300); 
					$('#clave').focus();
				}, 5000);
				$('#clave_invalida').show();
			}
		});	
	}
});

$("#eliminar_foto").click(function(){
	$("#foto").val(null);
	$("#vista_previa").hide(100);
	$("#eliminar_foto").hide(150);
	setTimeout(function(){
		$("#vista_previa").attr('src','');
	},500);
});

$("#boton_desarrollador").click(function(){
	if(clicks_desarrollo > 2){
		if((primer_click - Date.now()) > 3000){
			clicks_desarrollo = 0;
			primer_click = 0;
		}else{
			imprimirImagenes();
			mostrar_seccion('desarrollo');
			clicks_desarrollo = 0;
			primer_click = 0;
		}
	}else{
		clicks_desarrollo++;
		primer_click = Date.now();
	}
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
			$("#eliminar_foto").show(150);
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

function mostrarCamposObligatorios(campos){
	var vacios = false;
	for(var k in campos){
		if($("#"+campos[k]).val().trim() == "" || $("#"+campos[k]).val().trim() == "0"){
			$("#alerta_"+campos[k]).show(100);
			vacios=true;
		}else{
			$("#alerta_"+campos[k]).hide(100);
		}
	}
	if(vacios){
		$('#alerta_campos').fadeIn(500);
		$("html, body").animate({ scrollTop: 0 }, "slow");
		setTimeout(function() { 
			$('#alerta_campos').fadeOut(1300); 
		}, 5000);	
		return false;
	}
	return true
}

function imprimirImagenes(){
	var db = new PouchDB('fotografias');
	db.allDocs({include_docs: true, descending: true}, function(err, doc) {
		doc.rows.forEach(element => {
			var html='<img src="'+element.doc.foto+'" alt="Fotografia del estudiante" width="100%">'
			html+='<br>'
			html+='<p class="g-font-size-16">'+element.doc.nombre+'<p>'
			var elem = $(document.createElement('div'))
			.attr('class',"mx-auto my-2")
			.html(html)
			.appendTo('#fotos');
		});	
	});
}

function resetearForm(){
	$("#foto").val(null);
	$("#vista_previa").hide(100);
	$("#eliminar_foto").hide(150);
	setTimeout(function(){
		$("#vista_previa").attr('src','');
	},500);
	$("#nombre").val('');
	$("#grado").val('');
	$("#clave").val('');
}


function estaConectado(){
	if(navigator.onLine){
		// SI estoy en safari enviar las cosas en las conexiones	
	}
}

window.addEventListener('online',estaConectado);
window.addEventListener('offline',estaConectado);

estaConectado();