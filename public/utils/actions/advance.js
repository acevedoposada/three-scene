import * as THREE from 'three';

export const advance = (backwards = false, square, squarePosition) => {
  const speed = 0.01;
  const advanceLimit = 0.5;
  const initialPosition = squarePosition.clone();

  const direction = new THREE.Vector3(-100, 0, -1);
  direction.applyAxisAngle(new THREE.Vector3(0, 1, 0), square.rotation.y);
  direction.normalize();

  const advanceAnimation = () => {
      if (initialPosition.distanceTo(squarePosition) < advanceLimit) {
      squarePosition.addScaledVector(direction, (backwards ? -1 : 1) * speed);
      requestAnimationFrame(advanceAnimation);
      }
  };

  advanceAnimation();
}
