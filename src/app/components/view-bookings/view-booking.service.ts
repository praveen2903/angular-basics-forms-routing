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
        return this.http.delete<BookingModel[]>(`http://localhost:4000/bookings/${id}`);
    }
}