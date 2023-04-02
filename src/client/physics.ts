import * as THREE from 'three'
import Stats from 'three/examples/jsm/libs/stats.module'
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls'
import {GUI} from 'dat.gui'
import * as CANNON from 'cannon-es'
import { MeshBasicMaterial } from 'three'

const scene = new THREE.Scene()
scene.add(new THREE.AxesHelper(5))

const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
)
camera.position.z = 4
camera.position.y = 6

const cubeGeometry = new THREE.BoxGeometry(1, 1, 1)
const cubeMesh = new THREE.Mesh(cubeGeometry, 
    new MeshBasicMaterial({color:0xFF0000}))
const cubeMesh2 = new THREE.Mesh(cubeGeometry, 
    new MeshBasicMaterial({color:0x0000FF}))

cubeMesh.position.x = -2.5
cubeMesh.position.y = 30
cubeMesh2.position.x = -3
cubeMesh2.position.y = 40
scene.add(cubeMesh)
scene.add(cubeMesh2)
const planeGeometry = new THREE.PlaneGeometry(10, 10)
const planeMesh = new THREE.Mesh(planeGeometry,
    new MeshBasicMaterial({color:0x00FF00}))
scene.add(planeMesh)
planeMesh.rotateX(-Math.PI/3)

const world = new CANNON.World()
world.gravity.set(0, -9.82, 0)
const cubeShape = new CANNON.Box(new CANNON.Vec3(0.5, 0.5, 0.5))
const cubeBody = new CANNON.Body({mass: .1})
const cubeBody2 = new CANNON.Body({mass: .1})
cubeBody.addShape(cubeShape)
cubeBody2.addShape(cubeShape)
cubeBody.position.x = cubeMesh.position.x
cubeBody.position.y = cubeMesh.position.y
cubeBody.position.z = cubeMesh.position.z
cubeBody2.position.x = cubeMesh2.position.x
cubeBody2.position.y = cubeMesh2.position.y
cubeBody2.position.z = cubeMesh2.position.z
world.addBody(cubeBody)
world.addBody(cubeBody2)
const planeShape = new CANNON.Plane()
const planeBody = new CANNON.Body({mass:0})
planeBody.addShape(planeShape)
planeBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1,0,0), -Math.PI/2)
world.addBody(planeBody)

const renderer = new THREE.WebGLRenderer()
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

const controls = new OrbitControls(camera, renderer.domElement)
controls.addEventListener('change', render) //this line is unnecessary if you are re-rendering within the animation loop

const light = new THREE.PointLight()
light.position.set(2.5, 7.5, 15)
scene.add(light)

window.addEventListener('resize', onWindowResize, false)
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
    render()
}
const gui = new GUI()
const cubeFolder = gui.addFolder('Cube Rotation')
cubeFolder.add(planeMesh.rotation, 'x', -Math.PI, Math.PI)
cubeFolder.add(planeMesh.rotation, 'y', -Math.PI, Math.PI)
cubeFolder.add(planeMesh.rotation, 'z', -Math.PI, Math.PI)
const cubeFolder2 = gui.addFolder('Cube Position')
cubeFolder2.add(cubeMesh2.position, 'x', -10, 10)
cubeFolder2.add(cubeMesh2.position, 'y', -10, 10)
cubeFolder2.add(cubeMesh2.position, 'z', -10, 10)
cubeFolder2.open()

const stats = Stats()
document.body.appendChild(stats.dom)

const clock = new THREE.Clock()
let delta

function animate() {
    requestAnimationFrame(animate)

    controls.update()
    delta = clock.getDelta()

    world.step(delta)
    cubeMesh.position.set(cubeBody.position.x, cubeBody.position.y, cubeBody.position.z)
    cubeMesh2.position.set(cubeBody2.position.x, cubeBody2.position.y, cubeBody2.position.z)
    cubeMesh.quaternion.set(
        cubeBody.quaternion.x,
        cubeBody.quaternion.y,
        cubeBody.quaternion.z,
        cubeBody.quaternion.w
    )
    cubeMesh2.quaternion.set(
        cubeBody2.quaternion.x,
        cubeBody2.quaternion.y,
        cubeBody2.quaternion.z,
        cubeBody2.quaternion.w
    )
    render()

    stats.update()
}

function render() {
    renderer.render(scene, camera)
}

animate()