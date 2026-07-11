import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, retry } from "rxjs";
import { BookingModel } from "./BookingModel";
import { environment } from "../../../environments/environment";

@Injectable({
    providedIn:'root'
})
export class BookService{
    private apiUrl = environment.apiUrl;
    constructor(private http:HttpClient){}

    saveBooking(bookingDetails:BookingModel):Observable<any>{
        return this.http.post(`${this.apiUrl}/bookings`,bookingDetails).pipe(retry(2));
    }
}