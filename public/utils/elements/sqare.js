export const buildSquare = (THREE) => {
	const squarePosition = new THREE.Vector3(16, 0.5, 0);
	const squareGeometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);
	const squareMaterials = [
		new THREE.MeshBasicMaterial({ color: 0xff0000 }),
		new THREE.MeshBasicMaterial({ color: 0x0000ff }),
		new THREE.MeshBasicMaterial({ color: 0xff0000 }),
		new THREE.MeshBasicMaterial({ color: 0xffff00 }),
		new THREE.MeshBasicMaterial({ color: 0xff00ff }),
		new THREE.MeshBasicMaterial({ color: 0x00ff00 }),
	];
	return {square: new THREE.Mesh(squareGeometry, squareMaterials), squarePosition};
}
