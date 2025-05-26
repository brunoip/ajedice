import { SquarePosition } from '../models/squarePosition.model';

export function isAvailablePositionOld(currentPosition: SquarePosition, newPosition: SquarePosition, diceValue: number): boolean { //old
    if( newPosition.x === currentPosition.x && newPosition.y === currentPosition.y)
        return false;
    if( ( newPosition.x <= currentPosition.x + diceValue && newPosition.x > currentPosition.x && newPosition.y === currentPosition.y) ||
        ( newPosition.x >= currentPosition.x - diceValue && newPosition.x < currentPosition.x && newPosition.y === currentPosition.y) ||

    ( newPosition.y <= currentPosition.y + diceValue && newPosition.y > currentPosition.y && newPosition.x === currentPosition.x) || 
    ( newPosition.y >= currentPosition.y - diceValue && newPosition.y < currentPosition.y && newPosition.x === currentPosition.x) )
    return true;
    return false
}

  export function isAvailablePositionPawn(currentPosition: SquarePosition, newPosition: SquarePosition, diceValue: number, obstacles: SquarePosition[], maxObstacles: number): boolean { //old
    const dx = 0; //newPosition.x - currentPosition.x;
    const dy = newPosition.y - currentPosition.y;
  
    const absDx = Math.abs(dx);
    const absDy = Math.abs(dy);

    if (diceValue < 1)
      return false;
  
    // Only allow movement in a straight line (horizontal or vertical)
    if (absDx !== 0 && absDy !== 0)
      return false;
  
    const distance = absDx + absDy;
    if (distance > 1)
      return false;
  
    // Determine direction of movement
    const stepX = dx === 0 ? 0 : dx / absDx; // -1, 0, or 1
    const stepY = dy === 0 ? 0 : dy / absDy; // -1, 0, or 1
  
    let cx = currentPosition.x;
    let cy = currentPosition.y;
  
    // Check each step until the destination
    for (let i = 1; i <= distance; i++) {
      cx += stepX;
      cy += stepY;
  
      // If blocked, can't proceed
      if (isThereAnObstacle({x: cx, y: cy},obstacles, maxObstacles )) {
        return false;
      }
  
      // If we've reached the target and no blocks found
      if (cx === newPosition.x && cy === newPosition.y) {
        return true;
      }
    }
  
    return false;
  }

  export function isAvailablePositionRook(currentPosition: SquarePosition, newPosition: SquarePosition, diceValue: number, obstacles: SquarePosition[], maxObstacles: number): boolean { //rect
    const dx = newPosition.x - currentPosition.x;
    const dy = newPosition.y - currentPosition.y;
  
    const absDx = Math.abs(dx);
    const absDy = Math.abs(dy);
  
    // Only allow movement in a straight line (horizontal or vertical)
    if (absDx !== 0 && absDy !== 0)
      return false;
  
    const distance = absDx + absDy;
    if (distance > diceValue)
      return false;
  
    // Determine direction of movement
    const stepX = dx === 0 ? 0 : dx / absDx; // -1, 0, or 1
    const stepY = dy === 0 ? 0 : dy / absDy; // -1, 0, or 1
  
    let cx = currentPosition.x;
    let cy = currentPosition.y;
  
    // Check each step until the destination
    for (let i = 1; i <= distance; i++) {
      cx += stepX;
      cy += stepY;
  
      // If blocked, can't proceed
      if (isThereAnObstacle({x: cx, y: cy},obstacles, maxObstacles )){
         return false;
      }
       
      // If we've reached the target and no blocks found
      if (cx === newPosition.x && cy === newPosition.y) {
        return true;
      }
    }
  
    return false;
  }

export function isAvailablePositionQueen(currentPosition: SquarePosition, newPosition: SquarePosition, diceValue: number, obstacles: SquarePosition[], maxObstacles: number): boolean { //rect and diagonal
    const dx = newPosition.x - currentPosition.x;
    const dy = newPosition.y - currentPosition.y;
  
    const absDx = Math.abs(dx);
    const absDy = Math.abs(dy);
  
    // Allow movement only in straight lines (horizontal, vertical, or diagonal)
    const isStraightLine = (absDx === 0 || absDy === 0 || absDx === absDy);
    if (!isStraightLine)
      return false;
  
    // Ensure the move is within dice range
    const distance = Math.max(absDx, absDy);
    if (distance > diceValue)
      return false;
  
    // Determine movement direction (-1, 0, or 1)
    const stepX = dx === 0 ? 0 : dx / absDx;
    const stepY = dy === 0 ? 0 : dy / absDy;
  
    let cx = currentPosition.x;
    let cy = currentPosition.y;
  
    // Walk step-by-step and check for trees
    for (let i = 1; i <= distance; i++) {
      cx += stepX;
      cy += stepY;
  
      if (isThereAnObstacle({x: cx, y: cy},obstacles, maxObstacles )){
        return false;
      }
      
  
      if (cx === newPosition.x && cy === newPosition.y)
        return true;
    }
  
    return false;
  }

   export function isAvailablePositionBishop(currentPosition: SquarePosition, newPosition: SquarePosition, diceValue: number, obstacles: SquarePosition[], maxObstacles: number): boolean { // only diagonal
    const dx = newPosition.x - currentPosition.x;
    const dy = newPosition.y - currentPosition.y;
  
    const absDx = Math.abs(dx);
    const absDy = Math.abs(dy);
  
    // Only allow perfect diagonal movement
    if (absDx !== absDy)
      return false;
  
    // Must be within dice range
    if (absDx > diceValue)
      return false;
  
    // Determine step direction (-1 or 1)
    const stepX = dx / absDx;
    const stepY = dy / absDy;
  
    let cx = currentPosition.x;
    let cy = currentPosition.y;
  
    // Check each step along the diagonal path
    for (let i = 1; i <= absDx; i++) {
      cx += stepX;
      cy += stepY;
  
      //if (this.isThereATree(cx, cy))
      if (isThereAnObstacle({x: cx, y: cy},obstacles, maxObstacles )){
        return false;
      }
  
      if (cx === newPosition.x && cy === newPosition.y)
        return true;
    }
  
    return false;
  }

export function isAvailablePositionKnight(currentPosition: SquarePosition, newPosition: SquarePosition, diceValue: number, obstacles: SquarePosition[], maxObstacles: number): boolean { //knight
    const dx = Math.abs(newPosition.x - currentPosition.x);
    const dy = Math.abs(newPosition.y - currentPosition.y);
    
    if (diceValue < 1)
      return false;
    
    // Check for valid knight move
    const isKnightMove = (dx === 2 && dy === 1) || (dx === 1 && dy === 2);
    if (!isKnightMove){
         return false;
    }
       
    // Check if the target square is blocked
    if (isThereAnObstacle({x: newPosition.x, y: newPosition.y},obstacles, maxObstacles )){
        return false;
    }

    return true;
}

export function isThereAnObstacle(position: SquarePosition, obstacles: SquarePosition[], maxObstacles: number): boolean {
    for (let i = 0; i < obstacles.length; i++) {
        if(obstacles[i].x === position.x && obstacles[i].y === position.y)
        return true;
    }
    return false
}
