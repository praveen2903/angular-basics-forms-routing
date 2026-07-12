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

homeTheory = `Then why does ChangeDetectorRef exist?

It allows you to manually control Angular's change detection when Angular cannot detect changes by itself or when you want to optimize performance.

1. markForCheck()

Used with:

changeDetection: ChangeDetectionStrategy.OnPush

Example:

@Component({
  selector: 'app-home',
  templateUrl: './home.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})

When using OnPush, Angular checks the component only when:

An @Input() changes
An event occurs
An observable emits through the async pipe
You call
this.cdr.markForCheck();

Without it, the UI may not update.

Example:

this.locations = response;
this.cdr.markForCheck();

This tells Angular:

"Please check this component in the next change detection cycle."

2. detectChanges()

Runs change detection immediately.

this.data = response;
this.cdr.detectChanges();

Angular instantly refreshes the component.

Useful when changes occur outside Angular's zone.

Example:

setTimeout(() => {
    this.name = "Praveen";
    this.cdr.detectChanges();
}, 1000);
3. detach()

Stops Angular from checking the component.

constructor(private cdr: ChangeDetectorRef) {
    this.cdr.detach();
}

Now Angular ignores this component completely.

Useful for huge tables or dashboards.

4. reattach()

Enables change detection again.

this.cdr.reattach();
Why wasn't it required in your HttpClient example?

HttpClient runs inside Angular's zone.

this.hs.getLocations().subscribe(res => {
    this.locations = res;
});

When the HTTP response arrives:

Response received.
Angular knows it happened.
Angular automatically runs change detection.
Template updates.

No manual call needed.

When is it actually needed?


Case 1: Using OnPush -- asyncronous data addition to our local variables
@Component({
    changeDetection: ChangeDetectionStrategy.OnPush
})

Example: axios.get() asynchronounsly data added 
this.locations = response;
this.cdr.markForCheck();


Case 2: Third-party libraries

Example:
new SomeLibrary().onData(data => {
    this.locations = data;
    this.cdr.detectChanges();
});
Angular doesn't know the callback happened.

Case 3: Native DOM events-- handles DOM changes events like timeouts, intervals, eventlisteners, errorMessages
document.addEventListener('click', () => {
    this.count++;
    this.cdr.detectChanges();
});



Case 4: NgZone.runOutsideAngular()
this.zone.runOutsideAngular(() => {
    setInterval(() => {
        this.count++;
        this.cdr.detectChanges();
    }, 1000);
});


Case 5: detach(): this.cdr.detach();
this.value = 100;   // UI won't update


this.cdr.detectChanges();
Why did many people use it for ExpressionChangedAfterItHasBeenCheckedError?

Older code examples often added but for new ones need to add this:
this.cdr.detectChanges();


to suppress errors like:

ExpressionChangedAfterItHasBeenCheckedError
This is usually not the correct fix. That error typically indicates that a bound value changed after Angular had already checked the component. The better solution is to adjust the timing of the update (for example, moving logic to the appropriate lifecycle hook or restructuring the code), rather than forcing change detection.

Summary
Method	                                    Purpose	                                Common Use
markForCheck()          Marks an OnPush component to be checked later	              OnPush strategy
detectChanges()          Runs change detection immediately	                      Third-party callbacks, DOM APIs, code outside Angular
detach()                Stops automatic change detection	                      Performance optimization
reattach()              Restores automatic change detection	                      After detach()`
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
  {
    index: 'theory',
    value: this.homeTheory,
  }
];

setIndex = 'ts'
setDataIndex(data: string){
  this.setIndex = data;
  this.cdr.detectChanges();
}
}
