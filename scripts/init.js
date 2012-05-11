$(document).ready(function() {
    var camera, 
        scene,
        renderer,
        geometry,
        material,
        mesh;

    var SCREEN_WIDTH = window.innerWidth;
    var SCREEN_HEIGHT = window.innerHeight;

    function init() {
        scene = new THREE.Scene();

        camera = new THREE.PerspectiveCamera( 75, SCREEN_WIDTH / SCREEN_HEIGHT, 1, 10000 );
        camera.position.z = 100;
        scene.add(camera);

        // RENDERER
        renderer = new THREE.CanvasRenderer();
        renderer.setSize( SCREEN_WIDTH, SCREEN_HEIGHT );

        material = new THREE.MeshBasicMaterial( { color: 0xff0000, wireframe: false } );
        //material = new THREE.MeshFaceMaterial();
        var loader = new THREE.JSONLoader();
        var callbackMale = function( geometry ) { 
            mesh = new THREE.Mesh(geometry, material);
            scene.add(mesh);

            //call animate once this is loaded
            animate();
        };

        //"data/Male02_slim.js", 
        loader.load(
            "data/WaltHeadLo.js", 
            callbackMale 
        );

        document.body.appendChild( renderer.domElement );
    }

    function animate() {
        // note: three.js includes requestAnimationFrame shim
        requestAnimationFrame( animate );
        render();
    }

    function render() {
        mesh.rotation.x += 0.01;
        mesh.rotation.y += 0.02;
        renderer.render( scene, camera );
    }

    init();
});