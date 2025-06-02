import { Component, OnDestroy, OnInit  } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common'
import { isAvailablePositionKing, isAvailablePositionOld, isAvailablePositionKnight, isAvailablePositionPawn, isAvailablePositionBishop, isAvailablePositionQueen, isAvailablePositionRook, isThereAnObstacle} from './../../utils/math-utils';
import { AudioService } from '../../services/audio.service';
import { DataService } from '../../services/data.service';
import { SquarePosition } from '../../models/squarePosition.model';
import { Level } from '../../models/level.model';
import { AvailableCharacter } from '../../models/availableCharacter.model';

@Component({
  selector: 'app-board',
  standalone: true,
  imports: [RouterOutlet, CommonModule],
  templateUrl: './board.component.html',
  styleUrl: './board.component.css',

})

export class BoardComponent implements OnInit, OnDestroy {
  title = 'cyberpawn';
  
  currentLevel: Level  = {
    name: '', 
    board: [], 
    trees: [], 
    coins: [],
    enemies: [],
    staritngPosition: {x:0, y:0},
    requiredPoints: 0,
    exitPosition: {x:0, y:0},
    availableDices: [],
    nextLevel: '',
    availableCharacters: [],
  };

  currentPosition: SquarePosition = {x:3, y:4}
  dices: number[] = [];
  square: any[][] = [];
  currentStep: number = 0;

  totalScore: number  = 0;
  currentScore: number = 0;

  totalMoves:number = 0;
  rows: number = 0;
  columns: number = 0;
	selectedCharacterIndex: number = 0;
	data: any;
  lives:number = 3;
  liveLostMessage:boolean = false;

  isPlayingMusic = false;


  tiles: string [] = [
        'tileset32x32/floor10','tileset32x32/Sprite-0015','tileset32x32/Sprite-0013','tileset32x32/Sprite-0012',
    'tileset32x32/Sprite-0016','tileset32x32/Sprite-0010','tileset32x32/Sprite-0009','tileset32x32/Sprite-0014',
    'tileset32x32/Sprite-0011','tileset32x32/Sprite-0001','tileset32x32/Sprite-0006','tileset32x32/Sprite-0017',
    'tileset32x32/Sprite-0004','tileset32x32/Sprite-0002','tileset32x32/Sprite-0003','tileset32x32/Sprite-0005',
    'tileset32x32/Sprite-0007','tileset32x32/Sprite-0008','tileset32x32/Sprite-0003','tileset32x32/Sprite-0005',
         'tileset32x32/floor1',     'tileset32x32/floor2',     'tileset32x32/floor3',    'tileset32x32/floor4'];
  brands: string [] = ['shcneider','brahma','quilmes','andes'];

  characters = [
		{ name: 'Pawn', icon: 'fas fa-chess-pawn' },
		{ name: 'Knight', icon: 'fas fa-chess-knight' },
		{ name: 'Bishop', icon: 'fas fa-chess-bishop' },
		{ name: 'Rook', icon: 'fas fa-chess-rook' },
		{ name: 'Queen', icon: 'fas fa-chess-queen' },
    { name: 'King', icon: 'fas fa-chess-king' },
	];

  availableCharacters: AvailableCharacter[] = [
		{ name: 'Pawn', count: 0 },
		{ name: 'Knight', count: 0 },
		{ name: 'Bishop', count: 0 },
		{ name: 'Rook', count: 0 },
		{ name: 'Queen', count: 0 },
    { name: 'King', count: 0 },
	];

  private audio!: HTMLAudioElement;
  hoveredCell: { x: number, y: number } | null = null;
	showDiv = false;

  constructor( private audioService: AudioService, private dataService: DataService ) {
	}

  isHovered(x: number, y: number): boolean {
    return this.hoveredCell?.x === x && this.hoveredCell?.y === y;
  }

  onHoverEnter(x: number, y: number) {
    this.hoveredCell = { x, y };
  }
  
  onHoverLeave() {
    this.hoveredCell = null;
  }

  toggleAudio() {
    if (this.isPlayingMusic) {
      this.audioService.stop();
      this.isPlayingMusic = false;
    } else {
      this.audioService.play();
      this.isPlayingMusic = true;
    }
  }

  ngOnInit() {
		this.audioService.init('assets/sounds/synth.mp3', true); // Enable looping
    this.playAudio();
    this.isPlayingMusic = true;

    this.loadLevel('level2');
    setTimeout(() => { this.showDiv = true; }, 100); // Wait 500 milliseconds
	}

  loadLevel(name: string){
    this.dataService.getLevelData(name).subscribe(result => {
			this.data = result;
      this.availableCharacters = result.availableCharacters;
			this.onDataLoaded();
		});
  }

  onDataLoaded() {
    this.currentLevel = this.data;
    this.currentPosition = this.data.staritngPosition;
    this.dices.push(3);
	}

  get columnCount(): number {
		return this.currentLevel.board[0]?.length ?? 0;
	}

  getTile(x: number, y: number): string {
    const tileindex= this.currentLevel.board[y][x];
    const tileName = this.tiles[tileindex];
    return `assets/${tileName}.png`;
  }

  getCharacterCount(name: string): number {
    const match = this.availableCharacters.find(c => c.name === name);
    return match ? match.count : 0;
  }

  availableCharacter(name: string): boolean{
    const match = this.availableCharacters.find(c => c.name === name);
    return match ? Number(match.count) > 0 : false;
  }

  decreaseCharacterCount() {
    const selectedCharacter = this.getSelectedCharacter();
    const characterName = selectedCharacter.name;

    const match = this.availableCharacters.find(c => c.name === characterName);

    if (match) {
      let count = Number(match.count);
      if (count > 0) {
        count--;
        match.count = count;
      }

      if (count === 0) {
        for (let i = 0; i < this.characters.length; i++) {
          const c = this.characters[i];
          const available = this.availableCharacters.find(a => a.name === c.name);
          if (available && Number(available.count) > 0) {
            this.selectCharacter(i);
            return;
          }
        }
        // If no available characters found
        console.log('die for not moves');
        this.playSoundEffect('die');
        this.liveLostMessage = true;
        this.lives--;
      }
    }
  }

  hasAvailableCharacters(): boolean {
    return this.availableCharacters.some(c => Number(c.count) > 0);
  }

  getCoinType(x: number, y: number) {
    const index = this.currentLevel.coins.findIndex(coin => coin.x === x && coin.y === y)
    if (index === -1) {
      return null;
    }
    const brand =  this.brands[index % this.brands.length];
    return `assets/beers/${brand}.gif`;
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

  generateMap(){
    this.rows = this.currentLevel.board.length;
    this.columns = this.currentLevel.board[0]?.length ?? 0;

    // Initialize the 16x16 matrix
		for (let y = 0; y < this.columns; y++) {
			const row = [];
			for (let x = 0; x < this.rows; x++) {
				row.push('');
			}
			this.square.push(row);
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

  isThereAnEnemy(x: number, y: number): boolean {
    return this.currentLevel.enemies.some(enemy => 
      enemy.position.x === x && enemy.position.y === y
    );  
  }

  getEnemyTypeAt(x: number, y: number): string | null {
    const enemy = this.currentLevel.enemies.find(e =>
      e.position.x === x && e.position.y === y
    );
    return enemy ? enemy.image : null;
  }

  moveToPosition(x: number, y: number){
    let distanceMoved = 0;
    let richier = false;
    let dead = false;

    if (this.isAvailablePosition(x, y) && !this.isSamePosition(x, y)) {
      const dx = Math.abs(this.currentPosition.x - x);
      const dy = Math.abs(this.currentPosition.y - y);

      if (x === this.currentPosition.x) {
        distanceMoved = dy; // Vertical move
      } else if (y === this.currentPosition.y) {
        distanceMoved = dx; // Horizontal move
      } else if (dx === dy) {
        distanceMoved = dx; // Diagonal move
      } else if ((dx === 2 && dy === 1) || (dx === 1 && dy === 2)) {
        distanceMoved = 1; // Knight move
      } else {
        distanceMoved = -1; // Invalid move or something else
      }
    
      this.currentPosition = { x, y };
      richier = this.removeCoin(x, y);
      dead = this.didPlayerDie();
      console.log('position: ', this.currentPosition);
      this.checkNextLevel(x, y);
    }

     if(distanceMoved>0){
      this.totalMoves++;
      const stepSounds = ['move squares-001', 'move squares-002', 'move squares-003'];
      this.currentStep = (this.currentStep + 1) % stepSounds.length;
      const audioFile = stepSounds[this.currentStep];
  
      this.removeClosestGreaterOrEqual(distanceMoved);
      this.decreaseCharacterCount();
      
      if(!dead && !richier){
         this.playSoundEffect(audioFile);
      }
    }
  }

  playSoundEffect(sound: string){
    let audio = new Audio(`assets/sounds/${sound}.wav`);
    if(this.isPlayingMusic){
      audio.onerror = () => {
        console.error('Audio error code:', audio.error?.code);
        console.error('Audio error message:', audio.error?.message || 'Unknown error');
      };
      audio.play().catch(err => {
        console.error('Playback failed:', err);
      });
    }
  }

  removeCoin(x: number, y: number): boolean {
    const index = this.currentLevel.coins.findIndex(coin => coin.x === x && coin.y === y);
    if (index !== -1) {
      this.currentLevel.coins.splice(index, 1);
      this.currentScore += 100;
      this.totalScore += 100;
      if(this.exitAvailable()){
        this.playSoundEffect('ready_to_end');
      } else {
        this.playSoundEffect('beer');
      }
    
      return true;
    }  
    return false;
  }

  removeClosestGreaterOrEqual(target: number): void {
    console.log('move: ',target);
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
    if(this.dices.length < 1){
      for (let i = 0; i < 1; i++) {
        const randomValue = Math.floor(Math.random() * 6) + 1;
        this.dices.push(randomValue);
        this.playSoundEffect('reroll')
      }
    }
  }

  tryAgain(){
    this.loadLevel(this.currentLevel.name);
    this.currentScore = 0;
    this.liveLostMessage = false;
  }

  gameOver(){
    this.loadLevel('level2');
    this.totalScore = 0;
    this.currentScore = 0;
    this.totalMoves=0;
    this.selectedCharacterIndex = 0;
    this.lives = 3;
    this.liveLostMessage = false;
  }

  selectCharacter(index: number): void {
		this.selectedCharacterIndex = index;
    this.playSoundEffect(this.getSelectedCharacter().name.toLocaleLowerCase());
	}

	getSelectedCharacter() {
		return this.characters[this.selectedCharacterIndex]
	}

  isAvailablePosition(x: number, y: number): boolean{
    if(x === this.currentPosition.x && y === this.currentPosition.y)
      return false;

    if(this.getEnemyTypeAt(x, y) != null)
       return false;

    if(this.currentLevel.board[y][x] != 9 && this.currentLevel.board[y][x] !=10)
      return false;

    const character = this.getSelectedCharacter().name;
    return this.isAvailablePositionForSomeone(character, this.currentPosition, {x:x, y:y}, this.maxDiceValue());
  }

  checkNextLevel(x: number, y: number): void{
    if(this.exitAvailable()){
      if (this.currentLevel.exitPosition.x === this.currentPosition.x &&
        this.currentLevel.exitPosition.y === this.currentPosition.y){
          this.currentScore = 0;
          this.selectedCharacterIndex = 0;
           this.showDiv = false; // optional: hide first if needed
          this.loadLevel(this.currentLevel.nextLevel);
          setTimeout(() => { this.showDiv = true; }, 500); // Delay before showing
      }
    }
  }

  exitAvailable(): boolean{
    if(this.currentScore/100 >= this.currentLevel.requiredPoints){
        return true;
    }
    return false;
  }

  isExitPosition(x: number, y: number): boolean{
    if(this.exitAvailable()){
      if (x === this.currentLevel.exitPosition.x && y === this.currentLevel.exitPosition.y)
        return true;
    }
    return false;
 }

  isDeathPosition(x: number, y: number): boolean{
    return this.currentLevel.enemies.some(enemy => {
      return this.isAvailablePositionForSomeone(enemy.type, enemy.position, {x:x, y:y}, 16);
    }); 
  }

  getDeathEnemyIndex(x: number, y: number): number {
    return this.currentLevel.enemies.findIndex(enemy =>
      this.isAvailablePositionForSomeone(enemy.type, enemy.position, { x, y }, 16)
    );
  }

  didPlayerDie(): boolean{
    if(this.isDeathPosition(this.currentPosition.x, this.currentPosition.y)){
      const killer = this.currentLevel.enemies[this.getDeathEnemyIndex(this.currentPosition.x, this.currentPosition.y)];
      killer.position = this.currentPosition;
      this.playSoundEffect('die');
      this.liveLostMessage = true;
      this.lives--;
      return true
    }
    return false
  }

  isAvailablePositionForSomeone( character: string, currentPosition: SquarePosition, newPosition: SquarePosition, diceValue: number): boolean { 
    switch (character)
      {
        case "Queen":
          return isAvailablePositionQueen(currentPosition, newPosition, diceValue, this.currentLevel.trees,  this.currentLevel.trees.length);
          break;
        case "Bishop":
          return isAvailablePositionBishop(currentPosition, newPosition, diceValue, this.currentLevel.trees,  this.currentLevel.trees.length);
          break;
        case "Rook": 
          return isAvailablePositionRook(currentPosition,newPosition, diceValue, this.currentLevel.trees,  this.currentLevel.trees.length);
          break;
        case "Knight": 
          return isAvailablePositionKnight(currentPosition, newPosition, diceValue, this.currentLevel.trees,  this.currentLevel.trees.length);
          break;
        case "Pawn": 
          return isAvailablePositionPawn(currentPosition, newPosition, diceValue, this.currentLevel.trees,  this.currentLevel.trees.length);
          break;
        case "King": 
          return isAvailablePositionKing(currentPosition, newPosition, diceValue, this.currentLevel.trees,  this.currentLevel.trees.length);
          break;
        default: 
          return isAvailablePositionOld(currentPosition, newPosition, diceValue);
          break;
      }
  }
  
  isThereATree(x: number, y: number): boolean {
    return isThereAnObstacle({x:x, y:y}, this.currentLevel.trees, this.currentLevel.trees.length);
  }

  isThereACoin(x: number, y: number): boolean {
    for (let i = 0; i < this.currentLevel.coins.length; i++) {
      if(this.currentLevel.coins[i].x === x && this.currentLevel.coins[i].y === y)
      return true;
    }
    return false
  }
}
