import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, retry } from 'rxjs';
import { LocationsModel } from './home.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class HomeService {
  private apiUrl = environment.apiUrl;
  constructor(private http: HttpClient) {}

  getLocations(): Observable<LocationsModel[]>{
    return this.http.get<LocationsModel[]>(`${this.apiUrl}/locations`).pipe(retry(2));
  }
}