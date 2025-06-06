import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter, RouterOutlet } from '@angular/router';
import { MenuComponent } from './app/components/menu/menu.component';
import { BoardComponent } from './app/components/board/board.component';
import { provideHttpClient } from '@angular/common/http';
import { FinalScreenComponent } from './app/final-screen/final-screen.component';

const routes = [
	{ path: '', component: MenuComponent },
	{ path: 'game', component: BoardComponent },
	{ path: 'final-screen', component: FinalScreenComponent,}
];

bootstrapApplication(AppComponent, {
	providers: [provideRouter(routes), provideHttpClient()],
});