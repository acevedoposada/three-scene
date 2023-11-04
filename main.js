import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import * as THREE from 'three';
import './style.css';
import { buildSquare } from './public/utils/elements/sqare';
import { onKeyDown } from './public/utils/actions/keyBoard';

const scene = new THREE.Scene();

const renderer = new THREE.WebGLRenderer();

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(18, 2, 0);

const {square, squarePosition} = buildSquare(THREE);
scene.add(square);

const backgroundColor = new THREE.Color("rgba(224,202,173,255)");
scene.background = backgroundColor;

const loader = new GLTFLoader();

loader.load('./assets/cementery.gltf', (gltf) => {
  console.log(gltf);
  gltf.scene.scale.set(1, 1, 1);
  scene.add(gltf.scene);
});

renderer.setSize(window.innerWidth, window.innerHeight);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.update();

document.body.appendChild(renderer.domElement);

const light = new THREE.PointLight(0xffffff);
light.position.set(0, 3, 3);
scene.add(light);

(function animate() {
  square.position.copy(squarePosition);
  camera.position.copy(squarePosition).add(new THREE.Vector3(3, 1, 0));
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
})();

const onKeyDownListener = (e) => {
  onKeyDown(e, square, squarePosition)
};


window.addEventListener('keydown', onKeyDownListener);
