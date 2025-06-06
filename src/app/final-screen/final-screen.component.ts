import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { NgStyle } from '@angular/common';

@Component({
	selector: 'app-final-screen',
	standalone: true,
	imports: [RouterModule, NgStyle],
	templateUrl: './final-screen.component.html',
	styleUrls: ['./final-screen.component.css']
})
export class FinalScreenComponent{

	backgroundImage = 'assets/backs/fondo_ganaste.png';
	points = 0;
	moves = 0;
    condition = false;

	constructor(private router: Router) {
		const nav = this.router.getCurrentNavigation();
		const state = nav?.extras?.state as { points: number, moves: number , condition: boolean};

		this.points = state?.points ?? 0;
		this.moves = state?.moves ?? 0;
		this.condition = state?.condition ?? true;
		this.backgroundImage = this.condition
			? 'assets/backs/fondo_ganaste.png'
			: 'assets/backs/fondo_perdiste.png';
	}

	getResultTitle(): string{
		return this.condition
			? 'assets/backs/titulo_ganaste.png'
			: 'assets/backs/titulo_perdiste.png';
	}
}
