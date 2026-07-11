import { ChangeDetectorRef, Component } from '@angular/core';
import { ViewBookingService } from './view-booking.service';
import { BookingModel } from './ViewBookingModel';
import { Router } from '@angular/router';

@Component({
  selector: 'app-view-bookings',
  standalone: false,
  templateUrl: './view-bookings.html',
  styleUrl: './view-bookings.css',
})
export class ViewBookings {
  bookings:BookingModel[] = [];
  errorMessage:string = '';

  constructor(private viewBookings: ViewBookingService, private cdr: ChangeDetectorRef, private router: Router){}

  ngOnInit() {
      this.viewBookings.getAllBookings().subscribe({
        next: (response:any) => {
          this.bookings = response;
          this.cdr.markForCheck();
        },
        error: () => {
          this.errorMessage = 'Server has not started, please retry!';
          this.cdr.detectChanges();
        }
    });
  }

  editButton(bookingId: number):void {
    this.router.navigate(['/editBooking', bookingId]);
  }

  deleteButton(id: number):void {
    this.viewBookings.deleteBooking(id).subscribe({
      next: () => {
        this.bookings = this.bookings.filter(booking => booking.id !== id);
        this.cdr.markForCheck();
      },
      error: () => {
        this.errorMessage = 'Server has not started, please retry!';
        this.cdr.detectChanges();
      }
    });
  }

  htmlCode = `
  <div class="view-booking-container">
    <table class="booking-table">
        <thead>
        <tr>
            <th>Name</th>
            <th>Location</th>
            <th>Phone Number</th>
            <th>Passengers</th>
            <th>Visit Date</th>
            <th>Package</th>
            <th colspan="2">Actions</th>
          </tr>
          </thead>
          <tbody>
          <tr *ngFor="let booking of bookings">
            <td>{{booking.name}}</td>
            <td>{{booking.locationName}}</td>
            <td>{{booking.phoneNumber}}</td>
            <td>{{booking.noOfPeople}}</td>
            <td>{{booking.visitDate}}</td>
            <td>{{booking.packageType}}</td>
            <td><button class="edit-btn" (click)="editButton(booking.id)">Edit</button></td>
            <td><button class="delete-btn" (click)="deleteButton(booking.id)">Delete</button></td>
          </tr>
        </tbody>
    </table>
</div>`;
  tsCode = `
import { ChangeDetectorRef, Component } from '@angular/core';
import { ViewBookingService } from './view-booking.service';
import { BookingModel } from './ViewBookingModel';
import { Router } from '@angular/router';

@Component({
  selector: 'app-view-bookings',
  standalone: false,
  templateUrl: './view-bookings.html',
  styleUrl: './view-bookings.css',
})
export class ViewBookings {
  bookings:BookingModel[] = [];
  errorMessage:string = '';

  constructor(private viewBookings: ViewBookingService, private cdr: ChangeDetectorRef, private router: Router){}

  ngOnInit() {
      this.viewBookings.getAllBookings().subscribe({
        next: (response:any) => {
          this.bookings = response;
          this.cdr.markForCheck();
        },
        error: () => {
          this.errorMessage = 'Server has not started, please retry!';
          this.cdr.detectChanges();
        }
    });
  }

  editButton(bookingId: number):void {
    this.router.navigate(['/editBooking', bookingId]);
  }

  deleteButton(id: number):void {
    this.viewBookings.deleteBooking(id).subscribe({
      next: () => {
        this.bookings = this.bookings.filter(booking => booking.id !== id);
        this.cdr.markForCheck();
      },
      error: () => {
        this.errorMessage = 'Server has not started, please retry!';
        this.cdr.detectChanges();
      }
    });
  }
}
`;

servicecode = `
export interface BookingModel {
    id: number;
    locationId: number;
    locationName:string;
    name: string;
    email:string;
    phoneNumber: string;
    visitDate: string;
    packageType: string;
    requirements: string[];
    noOfPeople: number;
    passengerDetails: Passengers[];
}

export interface Passengers {
    passengerName:string;
    gender:string;
    age:number;
    preferences:string[];
}



import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { BookingModel } from "./ViewBookingModel";

@Injectable({
    providedIn:'root'
})
export class ViewBookingService{
    constructor(private http:HttpClient){}

    getAllBookings(): Observable<BookingModel[]>{
        return this.http.get<BookingModel[]>('http://localhost:4000/bookings');
    }

    deleteBooking(id: number): Observable<BookingModel[]>{
        return this.http.delete<BookingModel[]>(\`http://localhost:4000/bookings/\${id}\`);
    }
}`;
  
  data = [
    { index: 'html', value: this.htmlCode },
    { index: 'ts', value: this.tsCode },
    { index: 'service', value: this.servicecode}
  ];
  setIndex = 'ts';
  setDataIndex(data: string) {
    this.setIndex = data;
  }
}
