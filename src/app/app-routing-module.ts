import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Home } from './components/home/home';
import { Book } from './components/book/book';
import { ViewBookings } from './components/view-bookings/view-bookings';
import { EditBookings } from './components/edit-bookings/edit-bookings';

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
    path:'viewBookings',
    component: ViewBookings
  },
  {
    path:'editBooking/:locationName',
    component: EditBookings
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
