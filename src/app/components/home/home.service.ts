import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, retry } from 'rxjs';
import { LocationsModel } from './home.model';

@Injectable({
  providedIn: 'root',
})
export class HomeService {
  constructor(private http: HttpClient) {}

  getLocations(): Observable<LocationsModel[]>{
    return this.http.get<LocationsModel[]>('http://localhost:3000/locations').pipe(retry(2));
  }
}