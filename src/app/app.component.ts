import { Component, OnDestroy, OnInit  } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common'
import { isAvailablePositionOld, isAvailablePositionKnight, isAvailablePositionPawn, isAvailablePositionBishop, isAvailablePositionQueen, isAvailablePositionRook, isThereAnObstacle} from '../app/utils/math-utils';
import { AudioService } from '../app/services/audio.service';

interface SquarePosition {x: number, y:number}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})

export class AppComponent implements OnInit, OnDestroy {
  title = 'ajedice';
  square: any[][] = [];
  dices: number[] = [];
  currentStep: number = 0;

  trees: SquarePosition[] = []; 
  maxTrees = 32;

  coins: SquarePosition[] = []; 
  maxCoins = 10;

  score: number  = 0;

  tiles: string [] = [
    '                        ','tileset32x32/Sprite-0015','tileset32x32/Sprite-0013','tileset32x32/Sprite-0012',
    'tileset32x32/Sprite-0016','tileset32x32/Sprite-0010','tileset32x32/Sprite-0009','tileset32x32/Sprite-0014',
    'tileset32x32/Sprite-0011','tileset32x32/Sprite-0001','tileset32x32/Sprite-0006','tileset32x32/Sprite-0017',
    'tileset32x32/Sprite-0004','tileset32x32/Sprite-0002','tileset32x32/Sprite-0003','tileset32x32/Sprite-0005'];

  board: number[][] = [
    [1, 2, 2, 2, 2, 2, 4,11, 1, 2, 2, 2, 2, 2, 2, 4],
    [3,14,15,14,15,14, 8,11, 3,15,14,15,14,15,14, 8],
    [3,10, 9,10, 9,10, 8,11, 3,10, 9,10, 9,10, 9, 8],
    [3, 9,10, 9,10, 9,12, 2,13, 9,10, 9,10, 9,10, 8],
    [3,10, 9,10, 9,10, 9,10, 9,10, 9,10, 9,10, 9, 8],
    [3, 9,10, 9,10, 9,10, 9,10, 9,10, 9,10, 9,10, 8],
    [3,10, 9,10, 9,10, 9,10, 9,10, 9,10, 9,10, 9, 8],
    [3, 9,10, 9,10, 9,10, 9,10, 9,10, 9,10, 9,10, 8],
    [3,10, 9,10, 9,10, 9,10, 9,10, 9,10, 9,10, 9, 8],
    [3, 9,10, 9,10, 9,10, 9,10, 9,10, 9,10, 9,10, 8],
    [3,10, 9,10, 9,10, 9,10, 9,10, 9,10, 9,10, 9, 8],
    [3, 9,10, 9,10, 9,10, 9,10, 9,10, 9,10, 9,10, 8],
    [3,10, 9,10, 9,10, 9,10, 9,10, 9,10, 9,10, 9, 8],
    [3, 9,10, 9,10, 9,10, 9,10, 9,10, 9,10, 9,10, 8],
    [3,10, 9,10, 9,10, 9,10, 9,10, 9,10, 9,10, 9, 8],
    [6, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 5],
    
  ];
  currentPosition: SquarePosition = {x:3, y:4}

  characters = [
		{ name: 'Pawn', icon: 'fas fa-chess-pawn' },
		{ name: 'Knight', icon: 'fas fa-chess-knight' },
		{ name: 'Bishop', icon: 'fas fa-chess-bishop' },
		{ name: 'Rook', icon: 'fas fa-chess-rook' },
		{ name: 'Queen', icon: 'fas fa-chess-queen' }
	];

	selectedCharacterIndex: number | null = 0;

  private audio!: HTMLAudioElement;

  constructor( private audioService: AudioService ) {
		// Initialize the 16x16 matrix
		for (let y = 0; y < 16; y++) {
			const row = [];
			for (let x = 0; x < 16; x++) {
				row.push('');
			}
			this.square.push(row);
		}

    this.currentPosition = {x:8, y:11};
    this.dices.push(3);
    this.dices.push(6);
    this.dices.push(4);

    this.generateTrees();
    this.generateCoins();
	}

  ngOnInit() {
		this.audioService.init('assets/sounds/music.wav', true); // Enable looping
    this.playAudio()
	}

  getTile(x: number, y: number): string {
    const tileindex= this.board[y][x];
    const tileName = this.tiles[tileindex];
    return `assets/${tileName}.png`;
  }

  playAudio() {
		this.audioService.play();
	}

	stopAudio() {
		this.audioService.stop();
	}

	ngOnDestroy() {
		this.audioService.stop();
	}

  generateTrees(){
    for (let i = 0; i < this.maxTrees; i++) {
      const randomValueX = Math.floor(Math.random() * 14) + 1; 
      const randomValueY = Math.floor(Math.random() * 14) + 1;
      if(this.board[randomValueY][randomValueX]===9 || this.board[randomValueY][randomValueX]==10)
      this.trees.push({x:randomValueX, y:randomValueY});
    }
    //this.trees.push({x:1,y:1});
  }

  generateCoins(){
    for (let i = 0; i < this.maxCoins; i++) {
      const randomValueX = Math.floor(Math.random() * 14) + 1; 
      const randomValueY = Math.floor(Math.random() * 14) + 1;
      if(!this.isThereATree(randomValueX,randomValueY))
        if(this.board[randomValueY][randomValueX]===9 || this.board[randomValueY][randomValueX]==10)
          this.coins.push({x:randomValueX, y:randomValueY});
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

  moveToPosition(x: number, y: number){
    let distanceMoved = 0;

    if (this.isAvailablePosition(x, y) && !this.isSamePosition(x, y)) {
      const dx = Math.abs(this.currentPosition.x - x);
      const dy = Math.abs(this.currentPosition.y - y);
    
      if (x === this.currentPosition.x) {
        distanceMoved = dy; // Vertical move
      } else if (y === this.currentPosition.y) {
        distanceMoved = dx; // Horizontal move
      } else if (dx === dy) {
        distanceMoved = dx; // Diagonal move
      }
    
      this.currentPosition = { x, y };
      this.removeCoin(x, y);
    }

    if(distanceMoved>0){
      this.currentStep++;
      if(this.currentStep>=3)
        this.currentStep = 0;

    const stepSounds = ['assets/sounds/move squares-001.wav','assets/sounds/move squares-002.wav','assets/sounds/move squares-003.wav']

      this.removeClosestGreaterOrEqual(distanceMoved);
      const audio = new Audio(stepSounds[this.currentStep]);


      audio.onerror = () => {
        console.error('Audio error code:', audio.error?.code);
        console.error('Audio error message:', audio.error?.message || 'Unknown error');
      };
    
      audio.play().catch(err => {
        console.error('Playback failed:', err);
      });

    }
  }

  removeCoin(x: number, y: number): void {
    const index = this.coins.findIndex(coin => coin.x === x && coin.y === y);
    if (index !== -1) {
      this.coins.splice(index, 1); // Remove the coin
      this.score += 100; // Increase score
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

  selectCharacter(index: number): void {
		this.selectedCharacterIndex = index;
	}

	getSelectedCharacter() {
		return this.selectedCharacterIndex !== null
			? this.characters[this.selectedCharacterIndex]
			: null;
	}

  isAvailablePosition(x: number, y: number): boolean{
    // Can't move to the current position
    if (x === this.currentPosition.x && y === this.currentPosition.y)
      return false;

    if (this.board[y][x] != 9 && this.board[y][x] !=10)
      return false;

    const character = this.getSelectedCharacter()?.name;
    switch (character)
    {
      case "Queen":
        return isAvailablePositionQueen(this.currentPosition, {x,y}, this.maxDiceValue(), this.trees, this.maxTrees);
        break;
      case "Bishop":
        return isAvailablePositionBishop(this.currentPosition, {x,y}, this.maxDiceValue(), this.trees, this.maxTrees);
        break;
      case "Rook": 
        return isAvailablePositionRook(this.currentPosition, {x,y}, this.maxDiceValue(), this.trees, this.maxTrees);
        break;
      case "Knight": 
        return isAvailablePositionKnight(this.currentPosition, {x,y}, this.maxDiceValue(), this.trees, this.maxTrees);
        break;
      case "Pawn": 
        return isAvailablePositionPawn(this.currentPosition, {x,y}, this.maxDiceValue(), this.trees, this.maxTrees);
        break;
      default: 
        return isAvailablePositionOld(this.currentPosition, {x,y}, this.maxDiceValue());
        break;
    }
  }
  
  isThereATree(x: number, y: number): boolean {
    return isThereAnObstacle({x:x, y:y}, this.trees, this.maxTrees);
  }

  isThereACoin(x: number, y: number): boolean {
    for (let i = 0; i < this.coins.length; i++) {
      if(this.coins[i].x === x && this.coins[i].y === y)
      return true;
    }
    return false
  }
}
