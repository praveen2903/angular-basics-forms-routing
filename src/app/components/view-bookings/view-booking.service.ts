import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { BookingModel } from "./ViewBookingModel";
import { environment } from "../../../environments/environment";

@Injectable({
    providedIn:'root'
})
export class ViewBookingService{
    private apiUrl = environment.apiUrl;
    constructor(private http:HttpClient){}

    getAllBookings(): Observable<BookingModel[]>{
        return this.http.get<BookingModel[]>(`${this.apiUrl}/bookings`);
    }

    deleteBooking(id: number): Observable<BookingModel[]>{
        return this.http.delete<BookingModel[]>(`${this.apiUrl}/bookings/${id}`);
    }
}