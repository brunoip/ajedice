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

	backgroundImage = 'assets/title_image_text.png';
	

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
			? 'assets/title_image.png'
			: 'assets/title_image_text.png';
	}
}
