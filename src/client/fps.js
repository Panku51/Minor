import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { GUI } from 'dat.gui'
import Stats from 'three/examples/jsm/libs/stats.module'
import { CSS2DRenderer, CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer.js'

// Scene and renderer
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xa0a0a0);
// const renderer = new THREE.WebGLRenderer();
// renderer.setSize(window.innerWidth, window.innerHeight);
// renderer.setPixelRatio(window.devicePixelRatio);
// renderer.outputEncoding = THREE.sRGBEncoding;
// renderer.shadowMap.enabled = true;
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.shadowMap.enabled = true
document.body.appendChild(renderer.domElement);
// Lights
const hemiLight = new THREE.HemisphereLight(0xffffff, 0x884844);
hemiLight.position.set(0, 20, 0);
// scene.add(hemiLight);

function light() {
    scene.add(new THREE.AmbientLight(0x666666, 0.7))

    const dirLight = new THREE.DirectionalLight(0xffffff, 1)
    dirLight.position.set(-60, 100, -10);
    dirLight.castShadow = true;
    dirLight.shadow.camera.top = 50;
    dirLight.shadow.camera.bottom = -50;
    dirLight.shadow.camera.left = -50;
    dirLight.shadow.camera.right = 50;
    dirLight.shadow.camera.near = 0.1;
    dirLight.shadow.camera.far = 200;
    dirLight.shadow.mapSize.width = 4096;
    dirLight.shadow.mapSize.height = 4096;
    scene.add(dirLight);
    // scene.add( new THREE.CameraHelper(dirLight.shadow.camera))
}
// const dirLight = new THREE.DirectionalLight(0xffffff);
// dirLight.position.set(3, 10, 10);
// dirLight.castShadow = true;
// dirLight.shadow.camera.top = 2;
// dirLight.shadow.camera.bottom = -2;
// dirLight.shadow.camera.left = -2;
// dirLight.shadow.camera.right = 2;
// dirLight.shadow.camera.near = 0.1;
// dirLight.shadow.camera.far = 40;
// scene.add(dirLight);
light();

let materialArray = [];
let texture_ft = new THREE.TextureLoader().load('texture/skybox/plain/sh_ft.png');
let texture_bk = new THREE.TextureLoader().load('texture/skybox/plain/sh_bk.png');
let texture_up = new THREE.TextureLoader().load('texture/skybox/plain/sh_up.png');
let texture_dn = new THREE.TextureLoader().load('texture/skybox/plain/sh_dn.png');
let texture_rt = new THREE.TextureLoader().load('texture/skybox/plain/sh_rt.png');
let texture_lf = new THREE.TextureLoader().load('texture/skybox/plain/sh_lf.png');

materialArray.push(new THREE.MeshBasicMaterial({ map: texture_ft }));
materialArray.push(new THREE.MeshBasicMaterial({ map: texture_bk }));
materialArray.push(new THREE.MeshBasicMaterial({ map: texture_up }));
materialArray.push(new THREE.MeshBasicMaterial({ map: texture_dn }));
materialArray.push(new THREE.MeshBasicMaterial({ map: texture_rt }));
materialArray.push(new THREE.MeshBasicMaterial({ map: texture_lf }));

for (let i = 0; i < 6; i++)
    materialArray[i].side = THREE.BackSide;

let skyboxGeo = new THREE.BoxGeometry(1000, 1000, 1000);
let skybox = new THREE.Mesh(skyboxGeo, materialArray);
scene.add(skybox);
// Ground plane
var textureLoader = new THREE.TextureLoader();
const grassBaseColor = textureLoader.load("texture/grass2/base.jpg", function(texture) {

    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    texture.offset.set(0, 0);
    texture.repeat.set(100, 100);

});
const grassNormalMap = textureLoader.load("texture/grass2/base.jpgNR.png", function(texture) {

    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    texture.offset.set(0, 0);
    texture.repeat.set(100, 100);

});
const grassHeightMap = textureLoader.load("texture/grass2/base.jpgHGT.png", function(texture) {

    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    texture.offset.set(0, 0);
    texture.repeat.set(100, 100);

});
const grassBumpMap = textureLoader.load("texture/grass2/base.jpgNR.png", function(texture) {

    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    texture.offset.set(0, 0);
    texture.repeat.set(100, 100);

});

const material = new THREE.MeshPhongMaterial({
    map: grassBaseColor,
    normalMap: grassNormalMap,
    bumpMap: grassBumpMap,
    bumpScale: 0.8,
    displacementMap: grassHeightMap,
    displacementScale: 0.5,
    side: THREE.DoubleSide
})
const mesh = new THREE.Mesh(new THREE.PlaneGeometry(100, 100), material);
mesh.rotation.x = -Math.PI / 2;
mesh.receiveShadow = true;
mesh.position.set(0, -0.27, 0);
scene.add(mesh);


// Container for both camera and person
const container = new THREE.Group();
scene.add(container);

// Camera and controls
const xAxis = new THREE.Vector3(1, 0, 0);
const tempCameraVector = new THREE.Vector3();
const tempModelVector = new THREE.Vector3();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.01, 1000);
camera.position.set(0, 2, -1);
const cameraOrigin = new THREE.Vector3(0, 1.5, 0);
camera.lookAt(cameraOrigin);
container.add(camera);

// Model and animation actions
let model, skeleton, mixer, clock, numAnimations = 0,
    movingForward = false,
    mousedown = false;
clock = new THREE.Clock();
const allActions = [];
const baseActions = {
    idle: { weight: 1 },
    walk: { weight: 0 },
    run: { weight: 0 }
};

function setWeight(action, weight) {
    action.enabled = true;
    action.setEffectiveTimeScale(1);
    action.setEffectiveWeight(weight);
}

function activateAction(action) {
    const clip = action.getClip();
    const settings = baseActions[clip.name];
    setWeight(action, settings.weight);
    action.play();
}

const listener = new THREE.AudioListener();
camera.add(listener);

// create the PositionalAudio object (passing in the listener)
const sound = new THREE.PositionalAudio(listener);

// load a sound and set it as the PositionalAudio object's buffer
var audioContext = new AudioContext();
window.addEventListener('mousedown', () => {

    audioContext.resume();
});
const audioLoader = new THREE.AudioLoader();
audioLoader.load('sounds/track1.mp3', function(buffer) {
    sound.setBuffer(buffer);
    sound.setRefDistance(20);
    sound.play();
});
const loader = new GLTFLoader();
loader.load('./assets/Spiritual room.glb', function(glb) {
    console.log(glb);
    const root = glb.scene;
    root.scale.set(1, 1, 1);
    root.position.set(-50, 0.15, 0)
    root.add(sound);
    group.add(root);
    scene.add(root);

})



const controls = new PointerLockControls(camera, renderer.domElement)

const onKeyDown = function(event) {


    switch (event.code) {
        case 27:
            console.log("lock")
            controls.lock();
            break
        case 'KeyW':
            controls.moveForward(0.25)
            break
        case 'KeyA':
            controls.moveRight(-0.25)
            break
        case 'KeyS':
            controls.moveForward(-0.25)
            break
        case 'KeyD':
            controls.moveRight(0.25)
            break
    }
}
document.addEventListener('keydown', onKeyDown, false)
document.addEventListener('mousedown', () => {
    controls.lock();
})
const animate = function() {
    requestAnimationFrame(animate);

    // labelRenderer.render(scene, camera);

    renderer.render(scene, camera);
};

animate();


var group = new THREE.Group();

function createPlane(name, x, y, z, matColor) {
    const geometry = new THREE.PlaneGeometry(0.5, 0.5);
    const material = new THREE.MeshBasicMaterial({ color: matColor, side: THREE.DoubleSide });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(x, y, z);
    mesh.name = name;
    return mesh;
}

const plane1 = createPlane("plane1", -1.5, 1.2, -2, 0xffaaaa);
group.add(plane1);

const plane2 = createPlane("plane2", -0.5, 1.2, -2, 0xbbaaff);
group.add(plane2);
const plane3 = createPlane("plane3", 0.5, 1.2, -2, 0xffffaa);
group.add(plane3);
const plane4 = createPlane("plane4", 1.5, 1.2, -2, 0xaaffaa);
group.add(plane4);
const geometry = new THREE.PlaneGeometry(0.5, 0.5);

let planeTexture = new THREE.TextureLoader().load('texture/Plane.png');
const material1 = new THREE.MeshBasicMaterial({ map: planeTexture });
const plane5 = new THREE.Mesh(geometry, material1);
group.add(plane5);
plane5.position.set(2.5, 1.2, -2);

// scene.add(group);
const labelRenderer = new CSS2DRenderer();
labelRenderer.setSize(window.innerWidth, window.innerHeight);
labelRenderer.domElement.style.position = 'absolute';
labelRenderer.domElement.style.top = '0px';
labelRenderer.domElement.style.pointerEvents = 'none';
document.body.appendChild(labelRenderer.domElement);

const p1 = document.createElement('p');
p1.className = 'tooltip';
const p2 = document.createElement('p');
p2.className = 'tooltip';
const p3 = document.createElement('p');
p3.className = 'tooltip';
const p4 = document.createElement('p');
p4.className = 'tooltip';
// p.textContent = 'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Excepturi, animi numquam. Laudantium';
// const cPointLabel = new CSS2DObject(p);
// scene.add(cPointLabel);
// cPointLabel.position.set(0, 0, -4);

// const div = document.createElement('div');
// div.appendChild(p);
// const divContainer = new CSS2DObject(div);
// scene.add(divContainer);
// divContainer.position.set(0, 0, -4);

const pContainer = document.createElement('div');
pContainer.appendChild(p1);
const cPointLabel = new CSS2DObject(pContainer);
// scene.add(cPointLabel);
const p2Container = document.createElement('div');
p2Container.appendChild(p2);
const cPointLabel2 = new CSS2DObject(p2Container);
// scene.add(cPointLabel2);
const p3Container = document.createElement('div');
p3Container.appendChild(p3);
const cPointLabel3 = new CSS2DObject(p3Container);
// scene.add(cPointLabel3);
const p4Container = document.createElement('div');
p4Container.appendChild(p4);
const cPointLabel4 = new CSS2DObject(p4Container);
// scene.add(cPointLabel4);
// cPointLabel.position.set(0, 0, -4);




p1.className = 'tooltip show';
cPointLabel.position.set(-1.5, 1.5, -2);
p1.textContent = " This is Plane N0. 1";
p2.className = 'tooltip show';
cPointLabel2.position.set(-0.5, 1.5, -2);
p2.textContent = " This is Plane N0. 2";
p3.className = 'tooltip show';
cPointLabel3.position.set(0.5, 1.5, -2);
p3.textContent = " This is Plane N0. 3";
p4.className = 'tooltip show';
cPointLabel4.position.set(1.5, 1.5, -2);
p4.textContent = " This is Plane N0. 4";