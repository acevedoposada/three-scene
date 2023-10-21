import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import * as THREE from 'three';
import './style.css';

const objectsToDetectCollisionWith = [];
const cameraOffset = new THREE.Vector3(0, 2, 5); // coordenadas camara


const scene = new THREE.Scene();
const cameraSquare = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

const cameraScene = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

const backgroundColor = new THREE.Color("rgba(224,202,173,255)");
scene.background = backgroundColor;

cameraSquare.position.z = 5;
cameraScene.position.copy(cameraSquare.position);


// Agregar un cuadrado al escenario
const squareGeometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);
const squareMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 });
const square = new THREE.Mesh(squareGeometry, squareMaterial);
scene.add(square);

const loader = new GLTFLoader();

loader.load(
  './assets/platforms.gltf',
  (gltf) => {
    gltf.scene.scale.set(1.5, 1.5, 1.5);
    objectsToDetectCollisionWith.push(gltf.scene)
    scene.add(gltf.scene);
    squarePosition.set(0, 0.5, 0);
  }
);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);

const controls = new OrbitControls(cameraSquare, renderer.domElement);
controls.enableDamping = true;
//controls.update();

const mouseControls = new OrbitControls(cameraScene, renderer.domElement);
mouseControls.enableDamping = true;
mouseControls.dampingFactor = 0.05;

document.body.appendChild(renderer.domElement);

// movimiento del cuadrado
const squareSpeed = 0.05;
const jumpSpeed = 0.15; // Velocidad de salto
const gravity = 0.1; // Gravedad
let isJumping = false; // Estado de salto
const squarePosition = new THREE.Vector3(0, 0.5, 0);

// Capturar eventos de teclado
const onKeyDown = (event) => {
  switch (event.key) {
    case 'ArrowUp':
      if (!checkCollisions()) {
        // squarePosition.z -= squareSpeed;
        advance();
      }
      break;
    case 'ArrowDown':
      if (!checkCollisions()) {
        advance(true);
      }
      break;
    case 'ArrowLeft':
      if (!checkCollisions()) {
        // squarePosition.x -= squareSpeed;
        advance(false, 'x');
      }
      break;
    case 'ArrowRight':
      if (!checkCollisions()) {
        // squarePosition.x += squareSpeed;
        advance(true, 'x');
      }
      break;
    case ' ':
      if (!isJumping) {
        isJumping = true;
        jump();
      }
      break;
  }
};

function advance(backLeft = false, axis = 'z') {
  let advanceLong = 0;
  const speed = 0.03;
  const advanceLimit = 2;
  const initial = squarePosition[axis];
  const advanceAnimation = () => {
    if (advanceLong < advanceLimit) {
      advanceLong += speed;
      squarePosition[axis] = (backLeft) ? initial + advanceLong : initial - advanceLong;
      refreshCamera();
      requestAnimationFrame(advanceAnimation);
    }
  };
  advanceAnimation();
}

function refreshCamera() {
  cameraScene.position.copy(cameraSquare.position);
  cameraSquare.position.copy(squarePosition).add(cameraOffset);
  renderer.render(scene, cameraSquare);
}

function jump() {
  let jumpHeight = 0;
  const jumpLimit = 2;
  const initialY = squarePosition.y;

  const jumpAnimation = () => {
    if (jumpHeight < jumpLimit) {
      jumpHeight += jumpSpeed;
      squarePosition.y = initialY + jumpHeight;
      refreshCamera();
      requestAnimationFrame(jumpAnimation);
    } else {
      fall();
    }
  };

  const fall = () => {
    if (jumpHeight > 0) {
      jumpHeight -= gravity;
      squarePosition.y = initialY + jumpHeight;
      refreshCamera();
      requestAnimationFrame(fall);
    } else {
      isJumping = false;
      squarePosition.y = initialY;
    }
  };

  jumpAnimation();
}

function checkCollisions() {
  // Clonar la posición actual del cuadrado
  const newPosition = squarePosition.clone();

  // Mover el cuadrado en la dirección deseada (ejemplo: hacia arriba)
  newPosition.y += squareSpeed;

  // Crear un rayo que parte de la posición actual del cuadrado
  const ray = new THREE.Raycaster(squarePosition, newPosition.sub(squarePosition).normalize());

  // Obtener todos los objetos en la dirección del rayo
  const intersects = ray.intersectObjects(objectsToDetectCollisionWith);

  if (intersects.length > 0) {
    // Si se detecta una colisión, no avanzar
    return true;
  }

  return false;
}


window.addEventListener('keydown', onKeyDown);


(function animate() {
  requestAnimationFrame(animate);
  square.position.copy(squarePosition);

  // validate square no fall
  if (squarePosition.y < 0.5) {
    squarePosition.y = 0.5;
  }

  // altura maxima
  if (squarePosition.y > 2.5) {
    squarePosition.y = 2.5;
  }

  renderer.render(scene, cameraSquare);
})();
