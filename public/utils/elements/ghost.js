export const buildGhost = (THREE) => {
  const ghost = new THREE.Group();

	const textureLoader = new THREE.TextureLoader();
	const ghostTexture = textureLoader.load('./assets/texture.avif');
	const eyeMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 });
	const ghostMaterial = new THREE.MeshBasicMaterial({ map: ghostTexture });

	const headGhostGeometry = new THREE.SphereGeometry(0.7, 50, 50);
	const bodyGhostGeometry = new THREE.ConeGeometry(1, 2, 100);
	const eyeGeometry = new THREE.SphereGeometry(0.11, 32, 32);

	const leftEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
	const rightEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
	const headGhost = new THREE.Mesh(headGhostGeometry, ghostMaterial);
	const bodyGhost = new THREE.Mesh(bodyGhostGeometry, ghostMaterial);

	headGhost.position.y = 0.28
	leftEye.position.set(-0.4, 0.4, 0.3);
	rightEye.position.set(-0.4, 0.4, -0.3);

	headGhost.add(leftEye, rightEye);
	ghost.add(headGhost, bodyGhost);
	ghost.scale.set(0.3,0.3,0.3)

	const ghostPosition = new THREE.Vector3(16, 0.5, 0);

	return { ghost, ghostPosition }
}