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
}
