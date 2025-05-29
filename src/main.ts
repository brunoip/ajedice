// import { bootstrapApplication } from '@angular/platform-browser';
 import { appConfig } from './app/app.config';
 import { AppComponent } from './app/app.component';

// bootstrapApplication(AppComponent, appConfig)
//   .catch((err) => console.error(err));

import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter, RouterOutlet } from '@angular/router';
import { MenuComponent } from './app/components/menu/menu.component';
import { BoardComponent } from './app/components/board/board.component';
import { provideHttpClient } from '@angular/common/http';

const routes = [
	{ path: '', component: MenuComponent },
	{ path: 'game', component: BoardComponent }
];

bootstrapApplication(AppComponent, {
	providers: [provideRouter(routes), provideHttpClient()],
});