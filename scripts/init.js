$(document).ready(function() {
    var camera, 
        scene,
        renderer,
        geometry,
        objects = {};

    var animating = false;

    var SCREEN_WIDTH = window.innerWidth;
    var SCREEN_HEIGHT = window.innerHeight;

    function init() {
        scene = new THREE.Scene();

        camera = new THREE.PerspectiveCamera( 75, SCREEN_WIDTH / SCREEN_HEIGHT, 1, 10000 );
        camera.position.z = 1000;
        scene.add(camera);

        // RENDERER
        //var rendertype = 'canvas';
        var rendertype = 'webgl';
        if (rendertype == 'canvas') {
            renderer = new THREE.CanvasRenderer();
        } else {
            renderer = new THREE.WebGLRenderer();
        }
        renderer.setSize( SCREEN_WIDTH, SCREEN_HEIGHT );

        addObject('Nucleus', 'data/nucleus1.js', function(id) {
            this.mesh.rotation.x += 0.01;
            //this.mesh.rotation.y += 0.02;
        });
        // addObject('Walt', 'data/WaltHeadLo.js', function(id) {
        //     this.mesh.rotation.x += 0.01;
        //     this.mesh.rotation.y += 0.02;
        // });
        // addObject('Man', 'data/Male02_slim.js', function(id) {
        //     objects[id].mesh.rotation.x -= 0.01;
        //     objects[id].mesh.rotation.y -= 0.02;
        // });

        // LIGHTS

        var ambient = new THREE.AmbientLight( 0x221100 );
        scene.add( ambient );

        var directionalLight = new THREE.DirectionalLight( 0xffeedd );
        directionalLight.position.set( 0, -70, 100 ).normalize();
        scene.add( directionalLight );

        document.body.appendChild( renderer.domElement );
        setStatus();
        //loopAnimationFrame();
    }

    function addObject(id, url, frameCallback) {
        var x = document.createElement( "canvas" );
        var xc = x.getContext( "2d" );
        x.width = x.height = 128;
        xc.fillStyle = "orange";
        xc.fillRect(0, 0, 128, 128);

        // var x = document.createElement( "img" );
        // x.src = 'images/cell_outer.jpg';

        var material = new THREE.MeshBasicMaterial( { color: 0xff0000, map: new THREE.Texture( x ) } );
        //var material = new THREE.MeshBasicMaterial( { color: 0xff0000, transparent true );
        //var material = new THREE.MeshFaceMaterial();
        var loader = new THREE.JSONLoader();
        var meshCallback = function( geometry ) { 
            var currentMesh = new THREE.Mesh(geometry, material);

            //currentMesh.position.set( 90, -250, 50 );
            // currentMesh.scale.set( 10, 10, 10 );

            objects[id] = {
                'mesh': currentMesh,
                'frameCallback': frameCallback
            }
            scene.add(objects[id].mesh);
 
            //call animate once this is loaded
            render();
        };

        loader.load(
            url, 
            meshCallback
        );
    }

    //start stop animation controls
    $('#startStop').click(function(e) {
        toggleAnimation();
    });
    function toggleAnimation() {
        animating = !animating;
        setStatus();
        loopAnimationFrame();
    }
    function setStatus() {
        $('#status').html(animating.toString());
    }

    //mouse control
    var mouseX = 0, 
        mouseY = 0;
    var windowHalfX = window.innerWidth / 2;
    var windowHalfY = window.innerHeight / 2;
    $(document).bind('mousemove', function(e) {
        mouseX = ( e.clientX - windowHalfX );
        mouseY = ( e.clientY - windowHalfY );
    });

    function loopAnimationFrame() {
        // note: three.js includes requestAnimationFrame shim
        if (animating) {
            requestAnimationFrame( loopAnimationFrame );
            updateScene();
            render();
        }
    }

    function updateScene() {
        $.each(objects, function(index, value) {
            objects[index].frameCallback.call(objects[index], index)
        });

        camera.position.x += ( mouseX - camera.position.x ) * .05;
        camera.position.y += ( - mouseY - camera.position.y ) * .05;

        camera.lookAt( scene.position );
    }
    function render() {
        renderer.render( scene, camera );
    }

    init();
});