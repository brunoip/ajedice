import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MenuComponent } from './components/menu/menu.component';
import { BoardComponent } from './components/board/board.component';

const routes: Routes = [
	{ path: '', component: MenuComponent },
	{ path: 'game', component: BoardComponent }
];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule]
})
export class AppRoutingModule {}
