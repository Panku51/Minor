import * as THREE from 'three';
import * as CANNON from 'cannon-es';
import CannonDebugger from 'cannon-es-debugger'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const physicsWorld = new CANNON.World({
    gravity: new CANNON.Vec3(0, -9.82, 0),
});

const cannonDebugger = new CannonDebugger(scene, physicsWorld, {

})

const groundBody = new CANNON.Body({
    type: CANNON.Body.STATIC,
    shape: new CANNON.Plane(),
});
groundBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0);
physicsWorld.addBody(groundBody);

const radius = 1;
const sphereBody = new CANNON.Body({
    mass: 5,
    shape: new CANNON.Sphere(radius),
});
sphereBody.position.set(0, 7, 0);
physicsWorld.addBody(sphereBody);

const boxBody = new CANNON.Body({
    mass: 5,
    shape: new CANNON.Box(new CANNON.Vec3(1, 1, 1)),
});
boxBody.position.set(1, 10, 8);
physicsWorld.addBody(boxBody);


const sphereGeometry = new THREE.SphereGeometry(radius);
const sphereMaterial = new THREE.MeshBasicMaterial({
    color: 0xffaaaa
});
const sphereMesh = new THREE.Mesh(sphereGeometry, sphereMaterial);
scene.add(sphereMesh);

const geometry = new THREE.BoxGeometry(2, 2, 2);
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

camera.position.z = 5;
const controls = new OrbitControls(camera, renderer.domElement);

function animate() {
    cannonDebugger.update();
    physicsWorld.fixedStep();
    sphereMesh.position.copy(sphereBody.position);
    sphereMesh.quaternion.copy(sphereBody.quaternion);
    cube.position.copy(boxBody.position);
    cube.quaternion.copy(boxBody.quaternion);
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}

animate();