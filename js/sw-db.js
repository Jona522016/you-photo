// Utilidades para POUCH-DB

const db = new PouchDB('fotografias');


function guardarFotografia( mensaje ){

	mensaje._id = new Date().toISOString();

	return db.put(mensaje)
	.then(()=>{

		self.registration.sync.register('nueva-fotografia');

		const newResp = {status: "ok", offline:true};		

		return new Response(JSON.stringify(newResp));
	});

}

function subirFotografias() {

	const fotografias = [];

	return db.allDocs({ include_docs: true }).then( docs => {


		docs.rows.forEach( row => {

			const doc = row.doc;

			const fetchProm =  fetch('https://camino-seguro.com/inventario/operacion_encabezado/responder', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify( doc )
			}).then( res => {
				doc.sincronizado=true;
				return db.put( doc );

			});

			fotografias.push( fetchProm );

        }); // fin del foreach

		return Promise.all( fotografias );

	});
}