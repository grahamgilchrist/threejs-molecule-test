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


    // ------------------------ MOUSE / TOUCH EVENTS ------------------------

    var ROTATION_VECTOR_INIT = [0, 0, 0]
    var ROTATION_ANGLE_INIT = 0
    var ROTATION_VECTOR = [0, 0, 0]
    var ROTATION_ANGLE = 0

    var IS_DRAGGING = false
    var START_X = 0
    var START_Y = 0

    var onmousedown = function(e) {
        e = e || window.event
        if(e.originalEvent && e.originalEvent.touches) e = e.originalEvent.touches[0]
        START_X = e.clientX
        START_Y = e.clientY
        IS_DRAGGING = true
    }

    var onmouseup = function(e) {
        IS_DRAGGING = false
        var rotation = Spin.get_rotation()
        ROTATION_VECTOR_INIT = rotation.vector
        ROTATION_ANGLE_INIT = rotation.angle
    }

    var onmousemove = function(e) {
        if(!IS_DRAGGING || ZOOMING) return

        e = e || window.event
        if(e.originalEvent && e.originalEvent.touches) e = e.originalEvent.touches[0]

        var vector = [START_Y - e.clientY, e.clientX - START_X, 0]
        var length = Math.sqrt(vector[0]*vector[0] + vector[1]*vector[1] + vector[2]*vector[2])

        ROTATION_VECTOR = [vector[0] / length, vector[1] / length, vector[2] / length]
        ROTATION_ANGLE = length / 250
            
        rotate_scene()
        return false
    }

    $(document).bind('mousedown', onmousedown)
    $(document).bind('touchstart', onmousedown)
    $(document).bind('mouseup', onmouseup)
    $(document).bind('touchend', onmouseup)
    $(document).bind('mousemove', onmousemove)
    $(document).bind('touchmove', onmousemove)

    function rotate_scene() {
        scene.rotation.x = 
    }

    var ZOOMING = false
    var ZOOM = 0
    var ZOOM_INIT = 0

    $(document).bind('gesturestart', function(e) {
        ZOOMING = true
    })

    $(document).bind('gesturechange', function(e) {
        var scale = e.originalEvent.scale
        var rotation = e.originalEvent.rotation
        ZOOM = ZOOM_INIT + 400 * (scale - 1)
        MOLECULE_CONTAINER_ELEM.css('webkitTransform', 'translateZ('+ZOOM+'px)')
        e.preventDefault()
    })

    $(document).bind('gestureend', function(e) {
        ZOOM_INIT = ZOOM
        ZOOMING = false
    })
  
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
    }
    function render() {
        renderer.render( scene, camera );
    }

    init();
});