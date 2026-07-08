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
