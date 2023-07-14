import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import * as THREE from 'three';
import './style.css';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

const backgroundColor = new THREE.Color("rgba(224,202,173,255)");
scene.background = backgroundColor;

camera.position.z = 5;

const loader = new GLTFLoader();

loader.load(
  './assets/platforms.gltf',
  (gltf) =>{
    gltf.scene.scale.set(1.5, 1.5, 1.5);
    scene.add(gltf.scene);
  }
);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.update();

document.body.appendChild(renderer.domElement);

(function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
})();
