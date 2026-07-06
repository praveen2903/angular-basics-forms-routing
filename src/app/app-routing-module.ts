import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Home } from './components/home/home';
import { Book } from './components/book/book';

const routes: Routes = [
  {
    path: 'home',
    component: Home
  },
  {
    path: 'book/:locationId/:locationName',
    component: Book
  },
  {
    path: '**',
    redirectTo: 'home',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
