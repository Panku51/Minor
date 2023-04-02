import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { GUI } from 'dat.gui'
import Stats from 'three/examples/jsm/libs/stats.module'
import { CSS2DRenderer, CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer.js'
import * as dat from 'dat.gui'
// Scene and renderer
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xa0a0a0);
// const renderer = new THREE.WebGLRenderer();
// renderer.setSize(window.innerWidth, window.innerHeight);
// renderer.setPixelRatio(window.devicePixelRatio);
// renderer.outputEncoding = THREE.sRGBEncoding;
// renderer.shadowMap.enabled = true;
const canvas = document.querySelector('.webgl');
const canvas2 = document.querySelector('.webgl2');
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.shadowMap.enabled = true
    // const renderer2 = new THREE.WebGLRenderer({
    //     canvas: canvas2,
    //     antialias: true
    // });
    // renderer2.setSize(window.innerWidth / 3, window.innerHeight / 3);
    // renderer2.setPixelRatio(window.devicePixelRatio);
    // renderer2.shadowMap.enabled = true
    // Lights
const camera2 = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.01, 1000);
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
// basic texture
const grassBaseColor = textureLoader.load("texture/grass2/base.jpg", function(texture) {

    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    texture.offset.set(0, 0);
    texture.repeat.set(100, 100);

});
//define lighting
const grassNormalMap = textureLoader.load("texture/grass2/base.jpgNR.png", function(texture) {

    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    texture.offset.set(0, 0);
    texture.repeat.set(100, 100);

});
// 3d height feel
const grassHeightMap = textureLoader.load("texture/grass2/base.jpgHGT.png", function(texture) {

    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    texture.offset.set(0, 0);
    texture.repeat.set(100, 100);

});
// depth feel
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
const mesh = new THREE.Mesh(new THREE.PlaneGeometry(400, 400), material);
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
loader.load('assets/Xbot.glb', function(gltf) {
    model = gltf.scene;
    container.add(model);
    model.traverse(function(object) {
        if (object.isMesh) {
            object.castShadow = true;
        }
    });
    

    skeleton = new THREE.SkeletonHelper(model);
    skeleton.visible = false;
    container.add(skeleton);
    const animations = gltf.animations;
    mixer = new THREE.AnimationMixer(model);

    let a = animations.length;
    for (let i = 0; i < a; ++i) {
        let clip = animations[i];
        const name = clip.name;
        if (baseActions[name]) {
            const action = mixer.clipAction(clip);
            activateAction(action);
            baseActions[name].action = action;
            allActions.push(action);
            numAnimations += 1;
        }
    }
});
loader.load('./assets/Spiritual room.glb', function(glb) {
    console.log(glb);
    const root = glb.scene;
    root.scale.set(1, 1, 1);
    root.position.set(-20, 0.05, 80)
    root.add(sound);
    group.add(root);
    scene.add(root);

})
loader.load('./assets/walls.glb', function(glb) {
    console.log(glb);
    const root = glb.scene;
    root.scale.set(0.6, 0.6, 0.6);
    root.rotation.y = Math.PI / 2;
    root.position.x = 30;
    root.position.y = 0.1;
    root.position.z = 7;
    // root.position.set(-50, 0.15, 0)
    root.add(sound);
    //group.add(root);
    scene.add(root);

})


// container.visible = false;
var group = new THREE.Group();

// function createPlane(name, x, y, z, matColor) {
//     const geometry = new THREE.PlaneGeometry(0.5, 0.5);
//     const material = new THREE.MeshBasicMaterial({ color: matColor, side: THREE.DoubleSide });
//     const mesh = new THREE.Mesh(geometry, material);
//     mesh.position.set(x, y, z);
//     mesh.name = name;
//     return mesh;
// }
const geometry = new THREE.PlaneGeometry(1,1);
let img1 = new THREE.TextureLoader().load('assets/images/archerpose.png');
const mat1 = new THREE.MeshBasicMaterial({ map: img1 });
const plane1 = new THREE.Mesh(geometry, mat1);
group.add(plane1);
plane1.position.set(-2.5, 1.2, -2);

let img2 = new THREE.TextureLoader().load('assets/images/Balasana.png');
const mat2 = new THREE.MeshBasicMaterial({ map: img2 });
const plane2 = new THREE.Mesh(geometry, mat2);
group.add(plane2);
plane2.position.set(-1, 1.2, -2);

let img3 = new THREE.TextureLoader().load('assets/images/butterfly.png');
const mat3 = new THREE.MeshBasicMaterial({ map: img3 });
const plane3 = new THREE.Mesh(geometry, mat3);
group.add(plane3);
plane3.position.set(0.5, 1.2, -2);

let img4 = new THREE.TextureLoader().load('assets/images/downwardfacingdog.png');
const mat4 = new THREE.MeshBasicMaterial({ map: img4 });
const plane4 = new THREE.Mesh(geometry, mat4);
group.add(plane4);
plane4.position.set(2, 1.2, -2);

// const plane1 = createPlane("plane1", -1.5, 1.2, -2, 0xffaaaa);
// group.add(plane1);
// const plane2 = createPlane("plane2", -0.5, 1.2, -2, 0xbbaaff);
// group.add(plane2);
// const plane3 = createPlane("plane3", 0.5, 1.2, -2, 0xffffaa);
// group.add(plane3);
// const plane4 = createPlane("plane4", 1.5, 1.2, -2, 0xaaffaa);
// group.add(plane4);
scene.add(group);

// let planeTexture = new THREE.TextureLoader().load('assets/images/yoga.png');
// const material1 = new THREE.MeshBasicMaterial({ map: planeTexture });
// const plane5 = new THREE.Mesh(geometry, material1);
// group.add(plane5);
// plane5.position.set(3.5, 1.2, -2);

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
scene.add(cPointLabel);
const p2Container = document.createElement('div');
p2Container.appendChild(p2);
const cPointLabel2 = new CSS2DObject(p2Container);
scene.add(cPointLabel2);
const p3Container = document.createElement('div');
p3Container.appendChild(p3);
const cPointLabel3 = new CSS2DObject(p3Container);
scene.add(cPointLabel3);
const p4Container = document.createElement('div');
p4Container.appendChild(p4);
const cPointLabel4 = new CSS2DObject(p4Container);
scene.add(cPointLabel4);
cPointLabel.position.set(0, 0, -4);




p1.className = 'tooltip show';
cPointLabel.position.set(-2.5, 1.8, -2);
p1.textContent = "Archerpose";
p2.className = 'tooltip show';
cPointLabel2.position.set(-1, 1.8, -2);
p2.textContent = "Balasana Pose";
p3.className = 'tooltip show';
cPointLabel3.position.set(0.5, 1.8, -2);
p3.textContent = "Butterfly Pose";
p4.className = 'tooltip show';
cPointLabel4.position.set(2, 1.8, -2);
p4.textContent = "Downward facing dog pose";



var settings = {
    yoga:"Option 1",
  };
  var timeout = 0;
  function delayInit()
  { 
    clearTimeout(timeout);
    timeout = setTimeout(init,180);
  }

  var gui = new dat.GUI();  
  gui.add(settings, 'yoga', [ 'Viparita', 'Option 2', 'Option 3' ] );
  gui.open();
  
  
  // update display outside of gui
  // http://workshop.chromeexperiments.com/examples/gui/#10--Updating-the-Display-Manually
  function updateGUI (targetGui)
  {
    for (var i in targetGui.__controllers) 
    {
      targetGui.__controllers[i].updateDisplay();
    }
  }
  updateGUI(gui);
  
let fpsController = false;
let factor = 0.3;
window.addEventListener("keydown", (e) => {
    const { keyCode } = e;
    if (keyCode === 87 || keyCode === 38) {
        baseActions.idle.weight = 0;
        baseActions.run.weight = 5;
        activateAction(baseActions.run.action);
        activateAction(baseActions.idle.action);
        movingForward = true;
    }
    if (keyCode === 27) {
        if (fpsController) {}

        fpsController = !fpsController;
    }

});

window.addEventListener("keyup", (e) => {
    const { keyCode } = e;
    if (keyCode === 87 || keyCode === 38) {
        baseActions.idle.weight = 1;
        baseActions.run.weight = 0;
        activateAction(baseActions.run.action);
        activateAction(baseActions.idle.action);
        movingForward = false;
    }
});

window.addEventListener("pointerdown", (e) => {
    mousedown = true;
});

window.addEventListener("pointerup", (e) => {
    mousedown = false;
});

window.addEventListener("pointermove", (e) => {
    if (mousedown) {
        const { movementX, movementY } = e;
        const offset = new THREE.Spherical().setFromVector3(
            camera.position.clone().sub(cameraOrigin)
        );
        const phi = offset.phi - movementY * 0.02;
        offset.theta -= movementX * 0.02;
        offset.phi = Math.max(0.01, Math.min(0.35 * Math.PI, phi));
        camera.position.copy(
            cameraOrigin.clone().add(new THREE.Vector3().setFromSpherical(offset))
        );
        camera.lookAt(container.position.clone().add(cameraOrigin));
    }
});


camera2.position.set(2, 1, 2)
camera2.lookAt(-50, 0.15, 0)
const animate = function() {
    requestAnimationFrame(animate);
    for (let i = 0; i < numAnimations; i++) {
        const action = allActions[i];
        const clip = action.getClip();
        labelRenderer.render(scene, camera);
        const settings = baseActions[clip.name];
        // settings.weight = action.getEffectiveWeight();
    }
    // audioContext.resume();
    if (mixer) {
        const mixerUpdateDelta = clock.getDelta();
        mixer.update(mixerUpdateDelta);
    }

    if (movingForward) {
        // Get the X-Z plane in which camera is looking to move the player
        camera.getWorldDirection(tempCameraVector);
        const cameraDirection = tempCameraVector.setY(0).normalize();

        // Get the X-Z plane in which player is looking to compare with camera
        model.getWorldDirection(tempModelVector);
        const playerDirection = tempModelVector.setY(0).normalize();

        // Get the angle to x-axis. z component is used to compare if the angle is clockwise or anticlockwise since angleTo returns a positive value
        const cameraAngle = cameraDirection.angleTo(xAxis) * (cameraDirection.z > 0 ? 1 : -1);
        const playerAngle = playerDirection.angleTo(xAxis) * (playerDirection.z > 0 ? 1 : -1);

        // Get the angle to rotate the player to face the camera. Clockwise positive
        const angleToRotate = playerAngle - cameraAngle;

        // Get the shortest angle from clockwise angle to ensure the player always rotates the shortest angle
        let sanitisedAngle = angleToRotate;
        if (angleToRotate > Math.PI) {
            sanitisedAngle = angleToRotate - 2 * Math.PI
        }
        if (angleToRotate < -Math.PI) {
            sanitisedAngle = angleToRotate + 2 * Math.PI
        }

        // Rotate the model by a tiny value towards the camera direction
        model.rotateY(
            Math.max(-0.05, Math.min(sanitisedAngle, 0.05))
        );
        container.position.add(cameraDirection.multiplyScalar(0.05));
        camera.lookAt(container.position.clone().add(cameraOrigin));
    }

    // renderer2.render(scene, camera2);
    renderer.render(scene, camera);


};

animate();