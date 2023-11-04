export const buildCameraSquare = (THREE, renderer, scene) => {
	const cameraOffset = new THREE.Vector3(1, 0, 1);
  const cameraSquare = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );

	cameraSquare.position.set(18, 2, 0);

  const refreshCameraSquare = (squarePosition) => {
		console.log({squarePosition});
    cameraSquare.position.copy(squarePosition).add(cameraOffset);
    cameraSquare.lookAt(squarePosition);
    renderer.render(scene, cameraSquare);
  };

  return { cameraSquare, refreshCameraSquare };
};
