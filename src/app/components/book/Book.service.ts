import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, retry } from "rxjs";
import { BookingModel } from "./BookingModel";

@Injectable({
    providedIn:'root'
})
export class BookService{
    constructor(private http:HttpClient){}

    saveBooking(bookingDetails:BookingModel):Observable<any>{
        return this.http.post('http://localhost:4000/bookings',bookingDetails).pipe(retry(2));
    }
}