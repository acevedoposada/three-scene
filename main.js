import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import * as THREE from 'three';
import './style.css';

const objectsToDetectCollisionWith = [];
const cameraOffset = new THREE.Vector3(0, 2, 5);

// luz rojita 
const redLaserLight = new THREE.SpotLight(0xff0000, 5, 1000);
const lightOffset = new THREE.Vector3(0, 0, 0);

// Definir un rayo desde la posición de la luz roja en la dirección de la luz
const raycaster = new THREE.Raycaster();
raycaster.set(redLaserLight.position, redLaserLight.target.position.clone().sub(redLaserLight.position).normalize());

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
const squareMaterials = [
  new THREE.MeshBasicMaterial({ color: 0x000000 }),  // Negro (lados)
  new THREE.MeshBasicMaterial({ color: 0x000000 }),  // Azul (frente)
  new THREE.MeshBasicMaterial({ color: 0x000000 }),  // Negro (arriba)
  new THREE.MeshBasicMaterial({ color: 0x000000 }),  // Negro (abajo)
  new THREE.MeshBasicMaterial({ color: 0x000000 }),  // Negro (izquierda)
  new THREE.MeshBasicMaterial({ color: 0x0000ff }),  // Negro (derecha)
];
const square = new THREE.Mesh(squareGeometry, squareMaterials);

scene.add(square);

const loader = new GLTFLoader();

loader.load(
  './assets/platforms.gltf',
  (gltf) => {
    gltf.scene.scale.set(1.5, 1.5, 1.5);
    objectsToDetectCollisionWith.push(gltf.scene);
    scene.add(gltf.scene);
    squarePosition.set(0, 0.5, 0);

    // configurar lucecita roja
    redLaserLight.target = square;
    redLaserLight.angle = 0.1;
    redLaserLight.penumbra = 0.5;
    scene.add(redLaserLight);
  }
);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);

const controls = new OrbitControls(cameraSquare, renderer.domElement);
controls.enableDamping = true;

const mouseControls = new OrbitControls(cameraScene, renderer.domElement);
mouseControls.enableDamping = true;
mouseControls.dampingFactor = 0.05;

document.body.appendChild(renderer.domElement);

const squareSpeed = 0.05;
const jumpSpeed = 0.15;
const gravity = 0.1;
let isJumping = false;
const squarePosition = new THREE.Vector3(0, 0.5, 0);

const onKeyDown = (event) => {
  switch (event.key) {
    case 'ArrowUp':
      if (!checkCollisions()) {
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
        rotateSquare(false);
      }
      break;
    case 'ArrowRight':
      if (!checkCollisions()) {
        rotateSquare(true);
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

function advance(backwards = false) {
  const speed = 0.03;
  const advanceLimit = 0.5;
  const initialPosition = squarePosition.clone();
  console.log(redLaserLight);
  const intersections = raycaster.intersectObjects(objectsToDetectCollisionWith);
  if (intersections) {
    console.log({intersections});
    const collisionPoint = intersections[0].point;
    const distanceToCollision = redLaserLight.position.distanceTo(collisionPoint);

    // Aquí puedes hacer lo que necesites con la colisión y la distancia, como identificar el obstáculo.
    console.log('Colisión con objeto a una distancia de:', distanceToCollision);
  }
  
  const direction = new THREE.Vector3(0, 0, -1);
  direction.applyAxisAngle(new THREE.Vector3(0, 1, 0), square.rotation.y);
  direction.normalize();

  const advanceAnimation = () => {
    if (initialPosition.distanceTo(squarePosition) < advanceLimit) {
      squarePosition.addScaledVector(direction, (backwards ? -1 : 1) * speed);
      refreshCamera();
      requestAnimationFrame(advanceAnimation);
    }
  };

  advanceAnimation();
  setDirectionOriginLight();
}

function setDirectionOriginLight() {
  // Guardar la dirección de la luz al inicio de la rotación
  const initialLightDirection = new THREE.Vector3();
  initialLightDirection.copy(redLaserLight.position).sub(squarePosition).normalize();
  // Calcular la nueva dirección de la luz
  const newLightDirection = new THREE.Vector3();
  newLightDirection.copy(initialLightDirection);
  newLightDirection.applyAxisAngle(new THREE.Vector3(0, 1, 0), square.rotation.y);
  // Actualizar la posición y dirección de la luz
  redLaserLight.position.copy(lightOffset);
  redLaserLight.position.add(squarePosition);
}

function rotateSquare(clockwise = true) {
  const angle = Math.PI / 2;
  const duration = 1000;
  const initialRotationY = square.rotation.y;
  const targetRotationY = clockwise ? initialRotationY - angle : initialRotationY + angle;
  const startTime = performance.now();

  

  function animateRotation(time) {
    const elapsedTime = time - startTime;
    if (elapsedTime >= duration) {
      square.rotation.y = targetRotationY;
      setDirectionOriginLight();
      refreshCamera();
    } else {
      const t = elapsedTime / duration;
      square.rotation.y = initialRotationY + (targetRotationY - initialRotationY) * t;
      refreshCamera();
      requestAnimationFrame(animateRotation);
    }
  }

  requestAnimationFrame(animateRotation);
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
  const newPosition = squarePosition.clone();
  newPosition.z += squareSpeed;
  const ray = new THREE.Raycaster(squarePosition, newPosition.sub(squarePosition).normalize());
  const intersects = ray.intersectObjects(objectsToDetectCollisionWith);

  if (intersects.length > 0) {
    return false;
  }

  return false;
}

window.addEventListener('keydown', onKeyDown);

(function animate() {
  requestAnimationFrame(animate);
  
  square.position.copy(squarePosition);
  if (squarePosition.y < 0.5) {
    squarePosition.y = 0.5;
  }
  if (squarePosition.y > 2.5) {
    squarePosition.y = 2.5;
  }

  renderer.render(scene, cameraSquare);
})();
