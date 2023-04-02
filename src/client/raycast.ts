import * as three from 'three';
import { FrontSide, Mesh, Raycaster, RectAreaLight } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
// basic functionalities
const scene = new three.Scene();
const camera = new three.PerspectiveCamera(75 , innerWidth/innerHeight, 0.1 , 1000);
const renderer = new three.WebGLRenderer();
renderer.setSize(innerWidth , innerHeight);
renderer.setPixelRatio(devicePixelRatio);
document.body.appendChild(renderer.domElement)
const controls = new OrbitControls(camera , renderer.domElement)
controls.update();
camera.position.z = 3;
var selectedBtn
const raycaster = new three.Raycaster();
const pointer = new three.Vector2();
var toggle : boolean = true
let onPointerMove = ( event: MouseEvent ) => {

	// calculate pointer position in normalized device coordinates
	// (-1 to +1) for both components
	pointer.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	pointer.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

}

let onPointerClick = (event : MouseEvent) => {
    
    if(toggle)
    {
        toggle = false
    }
    else
    {
        toggle = true
    }
    console.log(toggle)
    raycaster.setFromCamera(pointer, camera)
    let intersects = raycaster.intersectObjects(scene.children)
    if(intersects.length > 0) // intersects > 0 
    {
        selectedBtn = intersects[0];
        
        selectedBtn.object.scale.x += 0.05
    } 
    
    
    
}



let ResetScale = () =>
{
   let intersectObjects = raycaster.intersectObjects(scene.children)
   for(let i = 0 ; i < intersectObjects.length; i++)
   {
        // intersectObjects[i].object.scale.setX(0.25)
        // intersectObjects[i].object.scale.setY(0.25)
        // intersectObjects[i].object.scale.setZ(0.2)
   }
}

let hoverbtn = () => // for hovering btns
{
    raycaster.setFromCamera(pointer , camera)
    let intersects = raycaster.intersectObjects(scene.children)
    
    // for(let i = 0;i < intersects.length; i++)
    // {
    //     intersects[0].object.scale.x += 0.005;
        
    //     // console.log(intersects[0].object.name.toString)
    // }
    // console.log(typeof(selectedBtn))

    // if(selectedBtn == intersects[0] && intersects[0] != null && selectedBtn != null)
    // {
    //     console.log("YESS")
    // }
    // else if(selectedBtn != intersects[0]  && intersects[0] != null && selectedBtn != null)
    // {
    //     console.log("No")
    // }
    
}



// animate function
let animate = () =>
{   
    controls.update();
    renderer.render(scene,camera);
    ResetScale()
    hoverbtn();
    window.addEventListener('mousedown', onPointerClick)
    requestAnimationFrame(animate);

}
// UI Board
let cube_geo = new three.BoxGeometry(3,1,0.125);
let cube_mat = new three.MeshPhongMaterial({color: 0xff0000 , wireframe:false, side:three.FrontSide})
let cube_mesh = new three.Mesh(cube_geo , cube_mat);
cube_mesh.rotation.x-= Math.PI/6
scene.add(cube_mesh);
// UI Buttons
let btn_geo = new three.CylinderGeometry(0.25,0.25,0.2);
let btn_mat = new three.MeshPhongMaterial({color:0xB2FF00, side:FrontSide})
let btn_mesh = new three.Mesh(btn_geo , btn_mat)
btn_mesh.rotation.x += 1;
btn_mesh.position.x -= 0.5
scene.add(btn_mesh)
let btn_geo1 = new three.CylinderGeometry(0.25,0.25,0.2);
let btn_mat1 = new three.MeshPhongMaterial({color:0xA784F2, side:FrontSide})
let btn_mesh1 = new three.Mesh(btn_geo1 , btn_mat1)
btn_mesh1.rotation.x += 1;
btn_mesh1.position.x += 0.5
scene.add(btn_mesh1)
//Ground Plane
let plane_geo = new three.PlaneGeometry(12,12,12)
let plane_mat = new three.MeshPhongMaterial({color: 0xCBC3E3, wireframe: false , side:three.DoubleSide})
let plane_mesh = new three.Mesh(plane_geo , plane_mat)
plane_mesh.rotation.x += Math.PI/2;
plane_mesh.position.y -= 0.55
scene.add(plane_mesh)


window.addEventListener( 'pointermove', onPointerMove, false);
// Light Sources
const light1 = new three.DirectionalLight(0xffffff , 1)
light1.position.set(2, 1, 2)
scene.add(light1)
const light2 = new three.DirectionalLight(0xffffff , 1)
light2.position.set(-2, 1, -2)
scene.add(light2)
const light3 = new three.DirectionalLight(0xffffff , 1)
light3.position.y -= 2;
scene.add(light3)
animate()

