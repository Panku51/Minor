import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { GUI } from 'dat.gui'
import Stats from 'three/examples/jsm/libs/stats.module'


const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
)
camera.position.z = 2

const renderer = new THREE.WebGLRenderer()
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)



const fov = 60;
const aspect = window.innerWidth / window.innerHeight;
const near = 0.1;
const far = 1000;

camera.position.z = 2;
scene.add(camera);



const controls = new OrbitControls(camera, renderer.domElement);

let materialArray = [];
let texture_ft = new THREE.TextureLoader().load('./texture/skybox/room/posx.jpg');
let texture_bk = new THREE.TextureLoader().load('./texture/skybox/room/negx.jpg');
let texture_up = new THREE.TextureLoader().load('./texture/skybox/room/posy.jpg');
let texture_dn = new THREE.TextureLoader().load('./texture/skybox/room/negy.jpg');
let texture_rt = new THREE.TextureLoader().load('./texture/skybox/room/posz.jpg');
let texture_lf = new THREE.TextureLoader().load('./texture/skybox/room/negz.jpg');

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
const ambientlight = new THREE.AmbientLight(0xffffff, 0.2);
scene.add(ambientlight);


const pointLight = new THREE.PointLight(0xffffff, 1)
pointLight.position.set(5, 3, -5);
scene.add(pointLight);
// const pointLightHelper = new THREE.PointLightHelper();
// pointLight.position.set(5, 3, -5);
// scene.add(pointLightHelper);
const pointLight2 = new THREE.PointLight(0xffffff, 1)
pointLight.position.set(5, 3, 5);
scene.add(pointLight2);

const group = new THREE.Group()

const loader = new GLTFLoader();
loader.load('./assets/statue.glb', function(glb) {
    console.log(glb);
    const root = glb.scene;
    root.scale.set(0.07, 0.07, 0.07);
    group.add(root);
    scene.add(group);

})
const group2 = new THREE.Group();

function createWheel(name:any, x:number, y:number, z:number, matColor:any) {
    const geometry = new THREE.CylinderGeometry(0.1, 0.1, 0.01, 6);
    const material = new THREE.MeshBasicMaterial({ color: matColor });
    const cylinder = new THREE.Mesh(geometry, material);
    cylinder.rotateX(Math.PI / 2);
    cylinder.position.set(x, y, z);
    return cylinder;
}
const wheel1 = createWheel('wheel1', -0.1, -0.05, 0.21, 0xffaaaa);
group2.add(wheel1);
const wheel2 = createWheel('wheel2', 0.11, -0.05, 0.21, 0xffffaa);
group2.add(wheel2);
const wheel3 = createWheel('wheel3', -0.1, -0.05, -0.21, 0xaaffff);
group2.add(wheel3);
const wheel4 = createWheel('wheel4', 0.11, -0.05, -0.21, 0xbbaaff);
group2.add(wheel4);
scene.add(group2);
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    render();
}, false);

window.addEventListener("keydown", function(event) {
    if (event.defaultPrevented) {
      return;
    }
    if (event.code === "ArrowDown"){
        // Handle "down"
        group.position.z-=0.05;
        group2.position.z-=0.05;
    } else if (event.code === "ArrowUp"){
        // Handle "up"
        group.position.z+=0.05;
        group2.position.z+=0.05;
    } else if (event.code === "ArrowLeft"){
        group.position.x-=0.05;
        group2.position.x-=0.05;
    } else if (event.code === "ArrowRight"){
        group.position.x+=0.05;
        group2.position.x+=0.05;
    }
    event.preventDefault();
  }, true);
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () => {
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

const animate = () => {
    requestAnimationFrame(animate);
    wheel1.rotation.y += 0.05;
    wheel2.rotation.y += 0.05;
    wheel3.rotation.y += 0.05;
    wheel4.rotation.y += 0.05;


    controls.update();
    render();
};

const render = () => {
    renderer.render(scene, camera);
}

animate();