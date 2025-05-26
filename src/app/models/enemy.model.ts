import { SquarePosition } from './squarePosition.model';

export interface Enemy {
    type: string, 
    image: string, 
    position: SquarePosition
}
