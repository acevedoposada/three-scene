export const rotateSquare = (clockwise = true, square) => {
    const angle = Math.PI / 2;
    const duration = 1000;
    const initialRotationY = square.rotation.y;
    const targetRotationY = clockwise ? initialRotationY - angle : initialRotationY + angle;
    const startTime = performance.now();
  
    
  
    function animateRotation(time) {
      const elapsedTime = time - startTime;
      if (elapsedTime >= duration) {
        square.rotation.y = targetRotationY;
        // refreshCamera();
      } else {
        const t = elapsedTime / duration;
        square.rotation.y = initialRotationY + (targetRotationY - initialRotationY) * t;
        // refreshCamera();
        requestAnimationFrame(animateRotation);
      }
    }
  
    requestAnimationFrame(animateRotation);
  }