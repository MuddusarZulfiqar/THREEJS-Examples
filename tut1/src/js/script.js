import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import * as dat from 'dat.gui';
// import WebGL from 'three/addons/capabilities/WebGL.js';
import starsTexture from '../images/soler-system/stars.jpg';
import sunTexture from '../images/soler-system/sun.jpg';
import mercuryTexture from '../images/soler-system/mercury.jpg';
import venusTexture from '../images/soler-system/venus.jpg';
import earthTexture from '../images/soler-system/earth.jpg';
import marsTexture from '../images/soler-system/mars.jpg';
import jupiterTexture from '../images/soler-system/jupiter.jpg';
import saturnTexture from '../images/soler-system/saturn.jpg';
import saturnRingTexture from '../images/soler-system/saturn ring.png';
import uranusTexture from '../images/soler-system/uranus.jpg';
import uranusRingTexture from '../images/soler-system/uranus ring.png';
import neptuneTexture from '../images/soler-system/neptune.jpg';
import plutoTexture from '../images/soler-system/pluto.jpg';
import { createPlanet } from './helpers';

// Renderer setup
const renderer = new THREE.WebGLRenderer();
renderer.shadowMap.enabled = true;

renderer.setSize(
    window.innerWidth,window.innerHeight
);

document.body.appendChild(renderer.domElement)

// Scene setup

const scene = new THREE.Scene();
// Camera setup
const camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);

camera.position.set(0,0,250);
// Light setup

const ambientLight = new THREE.AmbientLight(0x404040);
scene.add(ambientLight);


// Cube setup
const cubeTexture = new THREE.CubeTextureLoader();
scene.background = cubeTexture.load([
    starsTexture,
    starsTexture,
    starsTexture,
    starsTexture,
    starsTexture,
    starsTexture
]);

// Texture Loader
const textureLoader = new THREE.TextureLoader();
// Geometry
const sunMap = textureLoader.load(sunTexture);
sunMap.colorSpace = THREE.SRGBColorSpace;
const sunGeo = new THREE.SphereGeometry(16, 30, 30);
const sunMat = new THREE.MeshBasicMaterial({
    map: sunMap
});
const sun = new THREE.Mesh(sunGeo, sunMat);
scene.add(sun);
const pointLight = new THREE.PointLight(0xFFFFFF,30000, 300);
pointLight.position.copy(sun.position);
scene.add(pointLight);

// Point Light Helper
const pointLightHelper = new THREE.PointLightHelper(pointLight,1);
scene.add(pointLightHelper);

// Planets
const planets = [
    {size: 3.2, texture: mercuryTexture, position: 28, ring: null},
    {size: 7.5, texture: venusTexture, position: 48, ring: null},
    {size: 8, texture: earthTexture, position: 68, ring: null},
    {size: 4, texture: marsTexture, position: 88, ring: null},
    {size: 10, texture: jupiterTexture, position: 108, ring: null},
    {size: 10, texture: saturnTexture, position: 138, ring: {texture: saturnRingTexture, innerRadius: 10, outerRadius: 20}},
    {size: 8, texture: uranusTexture, position: 168, ring: {texture: uranusRingTexture, innerRadius: 10, outerRadius: 20}},
    {size: 7, texture: neptuneTexture, position: 188, ring: null},
    {size: 3, texture: plutoTexture, position: 200, ring: null},
];


const planetsMeshes = planets.map(planet => createPlanet(scene,planet.size, planet.texture, planet.position, planet.ring));

// Controls
const orbit = new OrbitControls(
    camera,
    renderer.domElement
);

orbit.update()

// Animation

let step = 0;
function animate() {
    requestAnimationFrame(animate);
    step += 0.05;
    sun.rotateY(0.004)
    // Rotate the planets
    planetsMeshes.forEach(planet => {
        planet.mesh.rotateY(0.01);
    });
    // Rotate the planets around the sun
    planetsMeshes.forEach((planet, index) => {
        const speed = 0.01 * (index + 1);
        planet.obj.rotation.y = step * speed;
    });

    renderer.render(
        scene,
        camera
    )
}

animate();

// Resize

window.addEventListener('resize',()=>{
    renderer.setSize(
        window.innerWidth,window.innerHeight
    );
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
});

// On dullbe click trigger fullscreen

window.addEventListener('dblclick',()=> {
    const fullscreenElement = document.fullscreenElement || document.webkitFullscreenElement;
    if (!fullscreenElement) {
        const requestFullscreen = renderer.domElement.requestFullscreen || renderer.domElement.webkitRequestFullscreen;
        requestFullscreen.call(renderer.domElement);
    } else {
        const exitFullscreen = document.exitFullscreen || document.webkitExitFullscreen;
        exitFullscreen.call(document);
    }
});