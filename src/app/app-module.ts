import { NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';
import { BrowserModule, provideClientHydration, withEventReplay } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing-module';
import { App } from './app';
import { Home } from './components/home/home';
import { Book } from './components/book/book';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { provideHttpClient, withFetch } from '@angular/common/http';
import { ViewBookings } from './components/view-bookings/view-bookings';
import { EditBookings } from './components/edit-bookings/edit-bookings';

@NgModule({
  declarations: [App, Home, Book, ViewBookings, EditBookings],
  imports: [BrowserModule, AppRoutingModule, CommonModule, FormsModule, ReactiveFormsModule],
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideClientHydration(withEventReplay()),
    provideHttpClient(withFetch()),
  ],
  bootstrap: [App],
})
export class AppModule {}
