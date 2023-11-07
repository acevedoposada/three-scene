import { advance } from './advance'
import { rotateSquare } from './rotation';
export const onKeyDown = (event, square, squarePosition, refreshCameraSquare) => {
    switch (event.key) {
      case 'ArrowUp':
        advance(false, square, squarePosition, refreshCameraSquare);
        break;
      case 'ArrowDown':
        advance(true, square, squarePosition, refreshCameraSquare);
        break;
      case 'ArrowLeft':
        rotateSquare(false, square);
        break;
      case 'ArrowRight':
        rotateSquare(true, square);
        break;
      case ' ':
        if (!isJumping) {
          isJumping = true;
          jump();
        }
        break;
    }
  };