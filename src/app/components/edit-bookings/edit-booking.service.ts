import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { BookingModel, Locations } from "./EditBookingModel";
import { Book } from "../book/book";
import { environment } from "../../../environments/environment";

@Injectable({
    providedIn:'root'
})
export class EditBookingService {
    private apiUrl = environment.apiUrl;
    constructor(private http: HttpClient) {}

    editBooking(bookingId:number, requestBody: BookingModel):Observable<BookingModel> {
        return this.http.put<BookingModel>(`${this.apiUrl}/bookings/${bookingId}`, requestBody);
    }

    getLocations():Observable<Locations[]>{
        return this.http.get<Locations[]>(`${this.apiUrl}/locations`);
    }
    getBookingById(id:number): Observable<BookingModel> {
        return this.http.get<BookingModel>(`${this.apiUrl}/bookings/${id}`);
    }
}