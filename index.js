
var container, stats;
var camera, scene, renderer, particles, geometry, materials = [], parameters, i, h, color, size;
var mouseX = 0, mouseY = 0;

var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;

//[-0.8, -0.1, 0.7, -0.7, 0.1, -0.6, 1.2, -0.5, -1.1, 0.7, 0.7, -0.3]
//[-1.1, 1.1, 0.7, 0.8, 0.3, 0.8, -0.9, 0.8, -0.2, 0.9, -0.9, -0.3]
//[-0.3, -1, -0.6, -0.5, 0, 0.2, 0.7, -1.2, 0.2, -0.7, -0.1, -0.9]
const A = -1.2
const B = -1.1
const C = -1.0
const D = -0.9
const E = -0.8
const F = -0.7
const G = -0.6
const H = -0.5
const I = -0.4
const J = -0.3
const K = -0.2
const L = -0.1
const M = 0.0
const N = 0.1
const O = 0.2
const P = 0.3
const Q = 0.4
const R = 0.5
const S = 0.6
const T = 0.7
const U = 0.8
const V = 0.9
const W = 1.0
const X = 1.1
const Y = 1.2

const LETTERS = [A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U,V,W,X,Y]

function randInt(min,max) {
  return Math.floor(Math.random() * max) + min
}

function randLetterArray (l) {
  let a = []
  for(let i =0; i < 12; i++) {
    const letter = l[randInt(0,25)]
    a.push(letter)
  }
  return a
}

function quibicMapNext (x, y, a) {
  const x2 = pow(x,2)
  const y2 = pow(y,2)
  const nextX = a[0] + a[1] * x + a[2] * x2 + a[3] * x * y + a[4] * y + a[5] * y2
  const nextY = a[6] + a[7] * x + a[8] * x2 + a[9] * x * y + a[10] * y + a[11] * y2
  return [nextX, nextY]
}

function pow(x, n) {
  return Math.pow(x,n)
}

let a = 13
let b = 29
let c = 9.0 / 3.0

init();
animate();

function init() {

	container = document.createElement( 'div' );
	document.body.appendChild( container );

	camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 3000 );
	camera.position.z = 1000;

	scene = new THREE.Scene();
	//scene.fog = new THREE.FogExp2( 0x000000, 0.0007 );

	geometry = new THREE.Geometry();

  let x = 0.1
  let y = 0.1
  let z = 0.1
  let dt = 0.001
  let maxX = 0
  let maxY = 0
  const ZOOM = 200
	// for ( i = 0; i < 200000; i ++ ) {
  //   let dx = (a * (y-x)) * dt;
  //   let dy = (x * (b-z) - y) * dt;
  //   let dz = (x * y - c * z) * dt;
  //   x += dx
  //   y += dy
  //   z += dz
	// 	var vertex = new THREE.Vector3();
	// 	vertex.x = x * 10
	// 	vertex.y = y * 10
	// 	vertex.z = z * 10
	// 	geometry.vertices.push( vertex )
	// }
  const l = randLetterArray(LETTERS)
  console.log('L',l)
	for ( i = 0; i < 200000; i ++ ) {
    //let [nx, ny] = quibicMapNext(x,y, [G,I,I,E,T,P,I,Q,R,R,U,L])
    //let [nx, ny] = quibicMapNext(x,y, [0, 0, -0.5, -0.6, -0.4, 0.1, -1.1, 0.2, 0.1, -0.8, 0.9, 0.5])
    let [nx, ny] = quibicMapNext(x,y, l)
    x = nx
    y = ny
		var vertex = new THREE.Vector3();
		vertex.x = x * ZOOM
		vertex.y = y * ZOOM
		vertex.z = z
		geometry.vertices.push( vertex )
    if(y * ZOOM > maxY) maxY = y * ZOOM
    if(x * ZOOM > maxX) maxX = x * ZOOM
    if(maxX > 1e5 || maxY > 1e5) break;
	}

  console.log('MAX_X', maxX)
  console.log('MAX_Y', maxY)

  materials = new THREE.PointsMaterial( { size: 1 } );

  particles = new THREE.Points( geometry, materials );


  scene.add( particles );


	// for ( i = 0; i < parameters.length; i ++ ) {
  //
	// 	color = parameters[i][0];
	// 	size  = parameters[i][1];
  //
	// 	materials = new THREE.PointsMaterial( { size: size } );
  //
	// 	particles = new THREE.Points( geometry, materials );
  //
	// 	// particles.rotation.x = Math.random() * 6;
	// 	// particles.rotation.y = Math.random() * 6;
	// 	// particles.rotation.z = Math.random() * 6;
  //
	// 	scene.add( particles );
  //
	// }

	renderer = new THREE.WebGLRenderer();
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( window.innerWidth, window.innerHeight );
	container.appendChild( renderer.domElement );

	document.addEventListener( 'mousemove', onDocumentMouseMove, false );
	document.addEventListener( 'touchstart', onDocumentTouchStart, false );
	document.addEventListener( 'touchmove', onDocumentTouchMove, false );

	//

	window.addEventListener( 'resize', onWindowResize, false );

}

function onWindowResize() {

	windowHalfX = window.innerWidth / 2;
	windowHalfY = window.innerHeight / 2;

	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();

	renderer.setSize( window.innerWidth, window.innerHeight );

}

function onDocumentMouseMove( event ) {

	mouseX = event.clientX - windowHalfX;
	mouseY = event.clientY - windowHalfY;

}

function onDocumentTouchStart( event ) {

	if ( event.touches.length === 1 ) {

		event.preventDefault();

		mouseX = event.touches[ 0 ].pageX - windowHalfX;
		mouseY = event.touches[ 0 ].pageY - windowHalfY;

	}

}

function onDocumentTouchMove( event ) {

	if ( event.touches.length === 1 ) {

		event.preventDefault();

		mouseX = event.touches[ 0 ].pageX - windowHalfX;
		mouseY = event.touches[ 0 ].pageY - windowHalfY;

	}

}

//

function animate() {

	requestAnimationFrame( animate );

	render();

}

function render() {

	var time = Date.now() * 0.00005;

	camera.position.x += ( mouseX - camera.position.x ) * 0.05;
	camera.position.y += ( - mouseY - camera.position.y ) * 0.05;

	camera.lookAt( scene.position );

	for ( i = 0; i < scene.children.length; i ++ ) {

		var object = scene.children[ i ];

		if ( object instanceof THREE.Points ) {

			//object.rotation.y += 0.025;

		}

	}

	for ( i = 0; i < materials.length; i ++ ) {

		// color = parameters[i][0];
    //
		// h = ( 360 * ( color[0] + time ) % 360 ) / 360;
		// materials[i].color.setHSL( h, color[1], color[2] );

	}

	renderer.render( scene, camera );

}
