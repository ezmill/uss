var container;
var scene, renderer, camera;
var mouseX = 0, mouseY = 0, mx = 0, my = 0, flymouse = new THREE.Vector2();
var time = 0;

var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;
var butterfly;
var start = Date.now(); 
var renderSize = {w:0, h:0};
var butterflies = [];
init();
animate();
    
function init() {

    renderSize.w = window.innerWidth;
    renderSize.h = window.innerHeight;
    
    camera = new THREE.PerspectiveCamera(45, renderSize.w / renderSize.h, 1, 100000);
    // camera = new THREE.OrthographicCamera( window.innerWidth / - 2, window.innerWidth / 2, window.innerHeight / 2, window.innerHeight / - 2, -10000, 10000 );
    // camera.position.set(0,0,3650.445403598036);
    camera.position.set(0,0,750);
    controls = new THREE.OrbitControls(camera);
    
    scene = new THREE.Scene();

    renderer = new THREE.WebGLRenderer( {alpha: true, antialias: true} );
    renderer.setSize( renderSize.w, renderSize.h );
    // renderer.setClearColor(0xffffff);
    renderer.gammaInput = true;
    renderer.gammaOutput = true;
    renderer.physicallyBasedShading = true;
    shader = matcapShader;
    material = new THREE.ShaderMaterial( {

        uniforms: shader.uniforms,
        vertexShader: shader.vertexShader,
        fragmentShader: shader.fragmentShader,
        shading: THREE.FlatShading,
        side: THREE.DoubleSide
    
    } );

    material.uniforms.tNormal.value = THREE.ImageUtils.loadTexture( 'img/243-normal.jpg' );
    material.uniforms.tMatCap.value = THREE.ImageUtils.loadTexture( 'img/silver.jpg' );

    material.uniforms.tMatCap.value.wrapS = material.uniforms.tMatCap.value.wrapT = THREE.ClampToEdgeWrapping;
    
    material.uniforms.tNormal.value.wrapS = material.uniforms.tNormal.value.wrapT = THREE.RepeatWrapping;
    container = document.getElementById( 'webgl' );
    container.appendChild( renderer.domElement );
    
    window.addEventListener( 'resize', onWindowResize, false );

    // initCharacter();
    initTitle();
}
function initCharacter(){
    var loader = new THREE.JSONLoader();
    loader.load( 'js/butterfly3.json', function( geometry, materials ) {
        for(var i = 0; i < 10; i++){
            var butterfly = new Butterfly(i);
            butterfly.init(geometry);      
            butterflies.push(butterfly);      
        }
    });
}
function initTitle(){
    var loader = new THREE.JSONLoader();
    loader.load( 'js/unstoppable-logo.json', function( geometry, materials ) {
        // for(var i = 0; i < 10; i++){
            title = new Title(0);
            title.init(geometry);      
        // }
    });
}
function map(value,max,minrange,maxrange) {
    return ((max-value)/(max))*(maxrange-minrange)+minrange;
}
    
function onWindowResize( event ) {
    renderSize.w = window.innerWidth;
    renderSize.h = window.innerHeight;

    windowHalfX = renderSize.w / 2;
    windowHalfY = renderSize.h / 2;

    renderer.setSize( renderSize.w, renderSize.h );
    camera.aspect = renderSize.w/renderSize.h;
    camera.updateProjectionMatrix();
}

function animate() {
    requestAnimationFrame( animate );
    render();
}

function render() {
    for(var i = 0; i < butterflies.length; i++){
        butterflies[i].update();        
    }
    title.update();
    renderer.render( scene, camera );
}