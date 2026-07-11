import { ChangeDetectorRef, Component } from '@angular/core';
import { HomeService } from './home.service';
import { LocationsModel } from './home.model';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-home',
  standalone: false,
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  constructor(private hs: HomeService, private router: Router, private cdr: ChangeDetectorRef, public authService: AuthService) {}
  
  locations: LocationsModel[]=[];
  errorMessage:string='';

  ngOnInit(): void{
    this.fetchLocations();
  }

  fetchLocations(): void {
    this.hs.getLocations().subscribe({
      next: (response: any) => {
        this.locations = response;
        this.cdr.markForCheck();
      },
      error: (err) => {
        this.errorMessage = "something went wrong! retry";
        this.cdr.detectChanges();
      }
    });
  }
  
  book(location:LocationsModel): void {
    this.router.navigate(['/book', location.id, location.name]);
  }  


  homeTs= `
import { ChangeDetectorRef, Component } from '@angular/core';
import { HomeService } from './home.service';
import { LocationsModel } from './home.model';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-home',
  standalone: false,
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  constructor(private hs: HomeService, private router: Router, private cdr: ChangeDetectorRef, public authService: AuthService) {}
  
  locations: LocationsModel[]=[];
  errorMessage:string='';

  ngOnInit(): void{
    this.fetchLocations();
  }

  fetchLocations(): void {
    this.hs.getLocations().subscribe({
      next: (response: any) => {
        this.locations = response;
        this.cdr.markForCheck();
      },
      error: (err) => {
        this.errorMessage = "something went wrong! retry";
        this.cdr.detectChanges();
      }
    });
  }
  
  book(location:LocationsModel): void {
    this.router.navigate(['/book', location.id, location.name]);
  }  
}`;
homeHtml =`
<div style="padding: 20px; text-align: center; margin-bottom: 20px; background-color: white; border-radius: 8px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
    <h2 style="margin-bottom: 15px; color: #333;">Authentication-- Route Gaurd for View Bookings Demo</h2>
    <button *ngIf="!authService.isAuthenticated" (click)="authService.login()" style="padding: 10px 20px; background-color: #28a745; color: white; border: none; border-radius: 5px; cursor: pointer; font-size: 16px; margin-right: 10px;">
        Login to View Bookings
    </button>
    <button *ngIf="authService.isAuthenticated" (click)="authService.logout()" style="padding: 10px 20px; background-color: #dc3545; color: white; border: none; border-radius: 5px; cursor: pointer; font-size: 16px;">
        Logout
    </button>
    <p style="margin-top: 15px; color: #666;" *ngIf="authService.isAuthenticated">You are authenticated! You can now access <a routerLink="/viewBookings" style="color: #007bff; text-decoration: none; font-weight: bold;">View Bookings</a>.</p>
</div>

<div *ngIf="!errorMessage; else errorBlock" class="locations-container">
    <div *ngFor="let location of locations">
        <div class="location-card">
            <img [src]="location.image" [alt]="location.name">

            <div class="location-details">
                <div class="location-name">
                    {{ location.name }}
                </div>

                <div class="location-description">
                    {{ location.description }}
                </div>

                <button class="book-btn" type="button" (click)="book(location)">
                    Book Now
                </button>
            </div>
        </div>
    </div>
</div>

<ng-template #errorBlock>
    <div class="error-message">
        {{ errorMessage }}
    </div>
</ng-template>`;

routerModule = `
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Home } from './components/home/home';
import { Book } from './components/book/book';
import { ViewBookings } from './components/view-bookings/view-bookings';
import { EditBookings } from './components/edit-bookings/edit-bookings';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  {
    path: 'home',
    component: Home
  },
  {
    path: 'book/:locationId/:locationName',
    component: Book
  },
  {
    path:'viewBookings',
    component: ViewBookings,
    canActivate: [AuthGuard]        -- must be there if needed the routegaurd. it is an array can add more guard in it.
  },
  {
    path:'editBooking/:bookingId',
    component: EditBookings
  },

  {
    path: '**',  -- must always be last
    redirectTo: 'home',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}`;

authGaurd= `
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  isAuthenticated = false;

  login() {
    this.isAuthenticated = true;
  }

  logout() {
    this.isAuthenticated = false;
  }
}
`;

homeService = `
export interface LocationsModel {
    id:number;
    name: string;
    image: string;
    description: string;
}



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
    return this.http.get<LocationsModel[]>('http://localhost:4000/locations').pipe(retry(2));
  }
}`;

data = [
  {
    index: 'html',
    value: this.homeHtml,
  },
  {
    index: 'ts',
    value: this.homeTs,
  },
  {
    index: 'routerModule',
    value: this.routerModule,
  },
  {
    index: 'authGaurd',
    value: this.authGaurd,
  },
  {
    index: 'homeService',
    value: this.homeService,
  },
];

setIndex = 'ts'
setDataIndex(data: string){
  this.setIndex = data;
  this.cdr.detectChanges();
}
}
