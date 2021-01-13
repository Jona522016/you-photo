

// Guardar
function actualizaCacheDinamico( dynamicCache, req, res ) {

	if ( res.ok ) {
		return caches.open( dynamicCache ).then( cache => {
			cache.put( req, res.clone() );
			return res.clone();
		});
	} else {
		return res;
	}

}

//Network with cache fallback / update
function manejoWebService(cacheName, req){

	if(req.clone().method === 'POST'){
		//Interceptar POST
		if( self.registration.sync ){

			return req.clone().text().then(body =>{
				const bodyObj = JSON.parse(body);
				return guardarFotografia(bodyObj);
			});

		}else{
			return fetch( req );
		}
	}
	else{
		if(req.clone().url.includes('validarColegio'))
		{
			var clave = req.clone().url.split("/");
			if(clave[6] != "3c33914f37a20d14fd12aeaa8e0352de"){
				const newResp ={
					status:"ok",
					valido:false
				};
			}else{
				const newResp ={
					status:"ok",
					valido:true,
					id_colegio:15
				};
			}		
			return new Response(JSON.stringify(newResp));
		}
		return fetch().then( res =>{
			if(res.ok){
				actualizaCacheDinamico(cacheName, req, res.clone());
				return res.clone();
			}else{
				return caches.match(req);
			}
		}).catch(err =>{

			return caches.match(req);

		});
	}	

}