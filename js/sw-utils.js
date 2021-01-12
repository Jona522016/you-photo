

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

		req.clone().text().then(body =>{

			console.log(body);

		});

		return fetch( req );
	}
	else if(req.clone().url.includes('validarClave'))
	{
		return fetch( req );

	}else{
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