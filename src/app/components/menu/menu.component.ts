import { Component, HostListener, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NgStyle } from '@angular/common';

@Component({
	selector: 'app-menu',
	standalone: true,
	imports: [RouterModule, NgStyle],
	templateUrl: './menu.component.html',
	styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit  {

	backgroundImage = 'assets/backs/fondo_menu.png';
	

		ngOnInit() {
		this.updateBackgroundImage();
	}

	@HostListener('window:resize')
	onResize() {
		this.updateBackgroundImage();
	}

	updateBackgroundImage() {
		const isPortraitMobile = window.innerWidth <= 768 && window.innerHeight > window.innerWidth;
		this.backgroundImage = isPortraitMobile
			? 'assets/backs/fondo_menu.png'
			: 'assets/backs/fondo_menu.png';
	}
}
