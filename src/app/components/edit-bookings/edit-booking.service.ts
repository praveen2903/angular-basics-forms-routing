import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { BookingModel, Locations } from "./EditBookingModel";
import { Book } from "../book/book";

@Injectable({
    providedIn:'root'
})
export class EditBookingService {
    constructor(private http: HttpClient) {}

    editBooking(bookingId:number, requestBody: BookingModel):Observable<BookingModel> {
        return this.http.put<BookingModel>(`http://localhost:4000/bookings/${bookingId}`, requestBody);
    }

    getLocations():Observable<Locations[]>{
        return this.http.get<Locations[]>('http://localhost:4000/locations');
    }
    getBookingById(id:number): Observable<BookingModel> {
        return this.http.get<BookingModel>(`http://localhost:4000/bookings/${id}`);
    }
}