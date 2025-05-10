import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common'

interface SquarePosition {x: number, y:number}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})

export class AppComponent {
  title = 'checkerboard';
  square: any[][] = [];
  dices: number[] = [];
  trees: SquarePosition[] = [];
  currentPosition: SquarePosition = {x:3, y:4}
  maxTrees = 20;

  constructor() {
		// Initialize the 16x16 matrix
		for (let y = 0; y < 16; y++) {
			const row = [];
			for (let x = 0; x < 16; x++) {
				row.push(''); // or new Square() if you have a class
			}
			this.square.push(row);
		}

    this.currentPosition = {x:8, y:11};
    this.dices.push(3);
    this.dices.push(6);
    this.dices.push(4);

    this.generateTrees();
	}

	squareClicked(x: number, y: number): void {
		console.log(`Button at (${x}, ${y}) clicked.`);
		// Your logic here
	}

  generateTrees(){

    for (let i = 0; i < this.maxTrees; i++) {
      const randomValueX = Math.floor(Math.random() * 14) + 1; 
      const randomValueY = Math.floor(Math.random() * 14) + 1;
      this.trees.push({x:randomValueX, y:randomValueY});
    }
  }

  maxDiceValue(): number{
    if (this.dices.length === 0) {
      return 0;
    }
    return Math.max(...this.dices);
  }

  isSamePosition(x: number, y: number): boolean {
    return this.currentPosition.x === x && this.currentPosition.y === y;
  }

  isThereATree(x: number, y: number): boolean {
    for (let i = 0; i < this.maxTrees; i++) {
      if(this.trees[i].x === x && this.trees[i].y === y)
        return true;
    }
    return false
  }
  
  isInList(x: number, y: number): boolean {
    return false;
  }

  // isAvailablePosition(x: number, y: number): boolean {
  //   if( x === this.currentPosition.x && y === this.currentPosition.y)
  //     return false;
  //   if( ( x <= this.currentPosition.x + this.maxDiceValue() && x > this.currentPosition.x && y === this.currentPosition.y) ||
  //       ( x >= this.currentPosition.x - this.maxDiceValue() && x < this.currentPosition.x && y === this.currentPosition.y) ||

  //   ( y <= this.currentPosition.y + this.maxDiceValue() && y > this.currentPosition.y && x === this.currentPosition.x) || 
  //   ( y >= this.currentPosition.y - this.maxDiceValue() && y < this.currentPosition.y && x === this.currentPosition.x) )
  //   return true;
  // return false
  // }

  isAvailablePosition(x: number, y: number): boolean {
    // Can't move to the current position
    if (x === this.currentPosition.x && y === this.currentPosition.y)
      return false;
  
    const dx = x - this.currentPosition.x;
    const dy = y - this.currentPosition.y;
  
    const absDx = Math.abs(dx);
    const absDy = Math.abs(dy);
  
    // Only allow movement in a straight line (horizontal or vertical)
    if (absDx !== 0 && absDy !== 0)
      return false;
  
    const distance = absDx + absDy;
    if (distance > this.maxDiceValue())
      return false;
  
    // Determine direction of movement
    const stepX = dx === 0 ? 0 : dx / absDx; // -1, 0, or 1
    const stepY = dy === 0 ? 0 : dy / absDy; // -1, 0, or 1
  
    let cx = this.currentPosition.x;
    let cy = this.currentPosition.y;
  
    // Check each step until the destination
    for (let i = 1; i <= distance; i++) {
      cx += stepX;
      cy += stepY;
  
      // If blocked, can't proceed
      if (this.isThereATree(cx, cy)) {
        return false;
      }
  
      // If we've reached the target and no blocks found
      if (cx === x && cy === y) {
        return true;
      }
    }
  
    return false;
  }

  moveToPosition(x: number, y: number){
    let distanceMoved = 0;
    if( this.isAvailablePosition(x,y) && !this.isSamePosition(x,y) ){
      if( x === this.currentPosition.x)
        distanceMoved = Math.abs( this.currentPosition.y - y);
      if( y === this.currentPosition.y)
        distanceMoved = Math.abs( this.currentPosition.x - x);
      this.currentPosition = {x:x, y:y};
    } 

    console.log(distanceMoved);
    if(distanceMoved>0){
      this.removeClosestGreaterOrEqual(distanceMoved);
      const audio = new Audio('assets/pieceMove.mp3');

      audio.onerror = () => {
        console.error('Audio error code:', audio.error?.code);
        console.error('Audio error message:', audio.error?.message || 'Unknown error');
      };
    
      audio.play().catch(err => {
        console.error('Playback failed:', err);
      });
    }
     
  }

  removeClosestGreaterOrEqual(target: number): void {
    let indexToRemove = -1;
    let minValue = Infinity;
  
    for (let i = 0; i < this.dices.length; i++) {
      const value = this.dices[i];
      if (value >= target && value < minValue) {
        minValue = value;
        indexToRemove = i;
      }
    }
  
    if (indexToRemove !== -1) {
      this.dices.splice(indexToRemove, 1);
    }
  }

  reRoll(){
    if(this.dices.length<6){
      for (let i = 0; i < 3; i++) {
      const randomValue = Math.floor(Math.random() * 6) + 1; // random number from 1 to 6
      this.dices.push(randomValue);
    }
    }
    
  }


}
