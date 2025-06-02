import { SquarePosition } from './squarePosition.model';
import { Enemy } from './enemy.model';
import { AvailableCharacter } from './availableCharacter.model';

export interface Level {
    name: string, 
    board: number[][], 
    trees: SquarePosition[], 
    coins: SquarePosition[],
    enemies: Enemy[],
    staritngPosition:  SquarePosition,
    requiredPoints: number,
    exitPosition: SquarePosition,
    availableDices: number[],
    nextLevel: string,
    availableCharacters: AvailableCharacter[];
  }