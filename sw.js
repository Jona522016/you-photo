// imports
importScripts('js/pouchdb.min.js');
importScripts('js/sw-db.js');
importScripts('js/sw-utils.js');


const STATIC_CACHE    = 'static-v5';
const DYNAMIC_CACHE   = 'dynamic-v3';
const INMUTABLE_CACHE = 'inmutable-v2';


const APP_SHELL = [
    //  '/',
    'index.html',
    'ico/black_512.png',
    'img/promo_block_photo.jpg',
    'ico/large_512.png',
    'css/style.css',
    'js/app.js',
    'js/index.js',
    'js/sw-db.js',
    'js/sw-utils.js'
    ];

    const APP_SHELL_INMUTABLE = [
    'https://fonts.googleapis.com/css?family=Open+Sans%3A400%2C300%2C500%2C600%2C700%7CPlayfair+Display%7CRoboto%7CRaleway%7CSpectral%7CRubik',
    'assets/vendor/bootstrap/bootstrap.min.css',
    'assets/vendor/icon-awesome/fonts/fontawesome-webfont.woff2?v=4.7.0',
    'assets/vendor/icon-awesome/css/font-awesome.min.css',
    'assets/vendor/icon-line/css/simple-line-icons.css',
    'assets/vendor/icon-line-pro/style.css',
    'assets/vendor/icon-hs/style.css',
    'assets/vendor/animate.css',
    'assets/img-temp/100x100/img7.jpg',
    'assets/vendor/typedjs/typed.css',
    'assets/vendor/hamburgers/hamburgers.min.css',
    'assets/css/unify-core.css',
    'assets/css/unify-components.css',
    'assets/css/unify-globals.css',
    'assets/vendor/malihu-scrollbar/jquery.mCustomScrollbar.min.css',
    'assets/vendor/jquery/jquery.min.js',
    'assets/vendor/jquery-migrate/jquery-migrate.min.js',
    'assets/vendor/bootstrap/bootstrap.min.js',
    'assets/vendor/appear.js',
    'assets/js/hs.core.js',
    'assets/js/components/hs.header.js',
    'assets/js/helpers/hs.hamburgers.js',
    'assets/js/components/hs.tabs.js',
    'assets/js/components/text-animation/hs.text-slideshow.js',
    'assets/js/components/hs.go-to.js',
    'assets/vendor/malihu-scrollbar/jquery.mCustomScrollbar.concat.min.js',
    'assets/js/components/hs.scrollbar.js',
    'js/md5.min.js',
    'js/pouchdb.min.js'
    ];



    self.addEventListener('install', e => {


        const cacheStatic = caches.open( STATIC_CACHE ).then(cache => 
            cache.addAll( APP_SHELL ));

        const cacheInmutable = caches.open( INMUTABLE_CACHE ).then(cache => 
            cache.addAll( APP_SHELL_INMUTABLE ));


        e.waitUntil( Promise.all([ cacheStatic, cacheInmutable ])  );

    });


    self.addEventListener('activate', e => {

        const respuesta = caches.keys().then( keys => {

            keys.forEach( key => {

                if (  key !== STATIC_CACHE && key.includes('static') ) {
                    return caches.delete(key);
                }

                if (  key !== DYNAMIC_CACHE && key.includes('dynamic') ) {
                    return caches.delete(key);
                }

                if (  key !== INMUTABLE_CACHE && key.includes('inmutable') ) {
                    return caches.delete(key);
                }
            });

        });

        e.waitUntil( respuesta );

    });




    self.addEventListener( 'fetch', e => {

        let respuesta;

        if(e.request.url.includes('api.negociosweb.info')){

            respuesta = manejoWebService( DYNAMIC_CACHE, e.request);

        }else{

         respuesta = caches.match( e.request ).then( res => {

            if ( res ) {
                return res;
            } else {

                return fetch( e.request ).then( newRes => {

                    return actualizaCacheDinamico( DYNAMIC_CACHE, e.request, newRes );

                });

            }

        });     

     }

     e.respondWith( respuesta );

 });


// TAREA ASINCRONAS
self.addEventListener('sync',e=>{

    console.log('SW: Sync');

    if(e.tag==="nueva-foto"){

        const respuesta = subirFotografias();

        e.waitUntil( respuesta );
    }
});