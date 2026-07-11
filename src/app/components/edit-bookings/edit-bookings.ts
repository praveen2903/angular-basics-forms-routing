import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { EditBookingService } from './edit-booking.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import { BookingModel, Locations } from './EditBookingModel';

@Component({
  selector: 'app-edit-bookings',
  standalone: false,
  templateUrl: './edit-bookings.html',
  styleUrl: './edit-bookings.css',
})
export class EditBookings implements OnInit {

  constructor( private editBookingService: EditBookingService, private activatedRoute: ActivatedRoute, private fb: FormBuilder,
    private router: Router, private cdr: ChangeDetectorRef ) {}

  editBookingForm!: FormGroup;

  locations: Locations[] = [];
  bookingId!: number;
  errorMessage = '';
  BookingDetails!: BookingModel;
  submitted = false;

  preferencesDetails = ['Vegetarian', 'Wheelchair Assistance', 'Senior Citizen', 'Child', 'Travel Insurance'];

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe(params => {
      this.bookingId = Number(params.get('bookingId'));
      this.loadLocations();
      this.loadBooking();
    });
  }

  loadLocations() {
    this.editBookingService.getLocations().subscribe({
      next: (response: any) => {
        this.locations = response;
      },
      error: () => {
        this.errorMessage = 'Unable to fetch locations';
      }
    });
  }

  loadBooking() {
    this.editBookingService.getBookingById(this.bookingId).subscribe({
      next: (response: BookingModel) => {
        this.BookingDetails = response;
        this.createForm();
      },
      error: () => {
        this.errorMessage = 'Unable to fetch booking details';
      }
    });
  }

  createForm() {
    this.editBookingForm = this.fb.group({
      locationName: [this.BookingDetails.locationName, Validators.required],
      name: [this.BookingDetails.name,[ Validators.required, Validators.minLength(3), Validators.maxLength(30)]],
      email: [this.BookingDetails.email, [ Validators.required, this.validateEmail]],
      phoneNumber: [ this.BookingDetails.phoneNumber, [ Validators.required, Validators.minLength(10), Validators.maxLength(10)]],
      visitDate: [this.BookingDetails.visitDate,[ Validators.required, this.validateDate]],
      packageType: [ this.BookingDetails.packageType, Validators.required ],
      requirements: this.fb.array([]),
      noOfPeople: [ this.BookingDetails.noOfPeople, [ Validators.required, Validators.min(1), Validators.max(6)]],
      passengerDetails: this.fb.array([])
    });

    // Requirements
    this.BookingDetails.requirements.forEach(req => {
      this.requirements.push(this.fb.control(req));
    });

    // Passenger Details
    if (this.BookingDetails.passengerDetails) {
      this.BookingDetails.passengerDetails.forEach((passenger: any) => {
        this.passengerDetails.push(this.createPassenger(passenger));
      });
    }

    this.editBookingForm.get('noOfPeople')?.valueChanges.subscribe(value => {
        this.generatePassengers(Number(value));
      });
    this.cdr.detectChanges();
  }

  createPassenger(passenger?: any): FormGroup {
    return this.fb.group({
      passengerName: [ passenger?.passengerName || '', Validators.required ],
      age: [ passenger?.age || '', Validators.required],
      gender: [passenger?.gender || '', Validators.required],
      preferences: [passenger?.preferences || []]
    });
  }

  get f() {
    return this.editBookingForm.controls;
  }

  get requirements(): FormArray {
    return this.editBookingForm.get('requirements') as FormArray;
  }

  get passengerDetails(): FormArray {
    return this.editBookingForm.get('passengerDetails') as FormArray;
  }

  addRequirements() {
    this.requirements.push(this.fb.control(''));
  }

  removeRequirements(index: number) {
    this.requirements.removeAt(index);
  }

  togglePreference(event: any, passengerIndex: number, preference: string) {

    const control = this.passengerDetails.at(passengerIndex).get('preferences');
    let values = control?.value || [];

    if (event.target.checked) {
      values = [...values, preference];
    } else {
      values = values.filter((x: string) => x !== preference);
    }

    control?.setValue(values);
  }

  generatePassengers(count: number) {

    if (count < 1 || count > 6) {
      return;
    }

    while (this.passengerDetails.length < count) {
      this.passengerDetails.push(this.createPassenger());
    }

    while (this.passengerDetails.length > count) {
      this.passengerDetails.removeAt(this.passengerDetails.length - 1);
    }
  }

  handleSubmit() {
    this.submitted = true;
    if (this.editBookingForm.invalid) {
      return;
    }

    const payload = {
      id: this.BookingDetails.id,
      locationId: this.BookingDetails.locationId,
      ...this.editBookingForm.value};

    this.editBookingService.editBooking(this.bookingId, payload).subscribe({
        next: () => {
          alert('Booking Updated Successfully');
          this.router.navigate(['/viewBookings']);
        },
        error: err => {
          console.log(err);
        }
      });
  }

  validateEmail(c: any) {
    const pattern = /^[a-zA-Z0-9_.]+@[a-zA-Z]+\.(com|in)$/;
    return pattern.test(c.value) ? null : { invalidEmail: { message: 'Invalid email format'} };
  }

  validateDate(c: any) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const visitDate = new Date(c.value);

    return visitDate >= today ? null : { invalidDate: { message: 'Date cannot be in the past'}};
  }

  htmlCode = `
  <div class="page">
    <section class="card">
        <form [formGroup]="editBookingForm" (ngSubmit)="handleSubmit()" class="booking-form" *ngIf="editBookingForm">
            <h2>Edit Your Trip</h2>

            <div class="form-group">
                <label>Location Name</label>
                <select formControlName="locationName">
                    <option *ngFor="let location of locations" [value]="location.name">{{location.name}}</option>
                </select>
            </div>

            <div class="form-group">
                <label>Name</label>
                <input type="text" formControlName="name" placeholder="Enter your name">
                <small class="error" *ngIf="f['name'].invalid && (f['name'].dirty || f['name'].touched) && f['name'].errors?.['required']">
                    Name is required.
                </small>
                <small class="error" *ngIf="f['name'].invalid && (f['name'].dirty || f['name'].touched) && f['name'].errors?.['minlength']">
                    Minimum 3 characters required.
                </small>
                <small class="error" *ngIf="f['name'].invalid && (f['name'].dirty || f['name'].touched) && f['name'].errors?.['maxlength']">
                    Maximum 30 characters allowed.
                </small>
            </div>

            <!-- Email -->
            <div class="form-group">
                <label>Email</label>
                <input type="email" formControlName="email" placeholder="Enter your email">
                <small class="error" *ngIf="f['email'].invalid && (f['email'].dirty || f['email'].touched) && f['email'].errors?.['required']">
                    Email is required.
                </small>
                <small class="error" *ngIf="f['email'].invalid && (f['email'].dirty || f['email'].touched) && f['email'].errors?.['invalidEmail']">
                    Invalid email format.
                </small>
            </div>

            <div class="form-group">
                <label>Phone Number</label>
                <input type="tel" formControlName="phoneNumber" placeholder="Enter Phone Number... ">
                <small class="error" *ngIf="f['phoneNumber'].invalid && (f['phoneNumber'].dirty || f['phoneNumber'].touched) && f['phoneNumber'].errors?.['required']">
                    Phone number is required.
                </small>
                <small class="error" *ngIf="f['phoneNumber'].invalid && (f['phoneNumber'].dirty || f['phoneNumber'].touched) && (f['phoneNumber'].errors?.['pattern'] || f['phoneNumber'].errors?.['minlength'] || f['phoneNumber'].errors?.['maxlength'])">
                    Enter a valid 10-digit phone number.
                </small>
            </div>

            <!-- Visit Date -->
            <div class="form-group">
                <label>Visit Date</label>
                <input type="date" formControlName="visitDate">
                <small class="error" *ngIf="f['visitDate'].invalid && (f['visitDate'].dirty || f['visitDate'].touched) && f['visitDate'].errors?.['required']">
                    Visit date is required.
                </small>
                <small class="error" *ngIf="f['visitDate'].invalid && (f['visitDate'].dirty || f['visitDate'].touched) && f['visitDate'].errors?.['invalidDate']">
                    Date must be after today.
                </small>
            </div>

            <!-- Package -->
            <div class="form-group">
                <label>Package Type</label>
                <select formControlName="packageType">
                    <option value="">Select Package</option>
                    <option value="Standard">Standard</option>
                    <option value="Premium">Premium</option>
                    <option value="Luxury">Luxury</option>
                </select>
                <small class="error" *ngIf="f['packageType'].invalid && (f['packageType'].dirty || f['packageType'].touched) && f['packageType'].errors?.['required']">
                    Please select a package.
                </small>
            </div>

            <!-- Requirements -->
            <div class="form-group">
                <label>Special Requirements</label>
                <div formArrayName="requirements">
                    <div *ngFor="let requirement of requirements.controls; let i=index" style="display: flex; gap: 20px;">
                        <input [type]="'text'" [formControlName]="i"/>
                        <button class="requirementButton" type="button" (click)="removeRequirements(i)">Remove</button>
                    </div>
                </div>
                <button class="requirementButton" type="button" (keydown.enter)="addRequirements()" (click)="addRequirements()">Add Requirement</button>
            </div>

            <!-- Number of People -->
            <div class="form-group">
                <label>Number of People</label>
                <input type="number" min="1" formControlName="noOfPeople">

                <small class="error" *ngIf="f['noOfPeople'].invalid && (f['noOfPeople'].dirty || f['noOfPeople'].touched) && f['noOfPeople'].errors?.['required']">
                    Enter the number of people.
                </small>

                <small class="error" *ngIf="f['noOfPeople'].invalid && (f['noOfPeople'].dirty || f['noOfPeople'].touched) && f['noOfPeople'].errors?.['min']">
                    Minimum 1 person required.
                </small>

                <small class="error" *ngIf="f['noOfPeople'].invalid && (f['noOfPeople'].dirty || f['noOfPeople'].touched) && f['noOfPeople'].errors?.['max']">
                    Maximum 6 people allowed.
                </small>
            </div>

            <!-- Passenger Details -->
            <div formArrayName="passengerDetails" *ngIf="passengerDetails.controls.length">
                <h3>Passenger Details</h3>
                <div class="passenger-card" *ngFor="let passenger of passengerDetails.controls; let i = index" [formGroupName]="i">
                    <h4>Passenger {{ i + 1 }}</h4>
                    <div class="form-group">
                        <label>Passenger Name</label>
                        <input type="text" formControlName="passengerName">

                        <small class="error" *ngIf="passenger.get('passengerName')?.invalid && (passenger.get('passengerName')?.dirty || passenger.get('passengerName')?.touched) && passenger.get('passengerName')?.errors?.['required']">
                            Passenger name is required.
                        </small>
                    </div>

                    <div class="form-group">
                        <label>Age</label>
                        <input type="number" formControlName="age">
                        <small class="error" *ngIf="passenger.get('age')?.invalid && (passenger.get('age')?.dirty || passenger.get('age')?.touched) && passenger.get('age')?.errors?.['required']">
                            Age is required.
                        </small>
                    </div>

                    <div class="form-group">
                        <label>Gender</label>
                        <div class="radio-group" style="display: flex; align-items: center; justify-content: left; gap: 20px;">
                            <label class="radio-option" style="display: flex;">
                                <input type="radio" formControlName="gender" value="Male">
                                Male
                            </label>

                            <label class="radio-option" style="display: flex;">
                                <input type="radio" formControlName="gender" value="Female">
                                Female
                            </label>

                            <label class="radio-option" style="display: flex;">
                                <input type="radio" formControlName="gender" value="Other">
                                Other
                            </label>
                        </div>
                        <small class="error" *ngIf="passenger.get('gender')?.invalid && (passenger.get('gender')?.dirty || passenger.get('gender')?.touched) && passenger.get('gender')?.errors?.['required']">
                            Select gender.
                        </small>
                    </div>
                    <div class="form-group">

    <label>Preferences</label>

    <div style="display: grid; grid-template-columns: repeat(3,1fr); gap: 20px 40px;">
        <div class="checkbox-group" *ngFor="let preference of preferencesDetails" style="background-color: lightgray; padding: 10px; border-radius: 5px;">
            <label class="checkbox-option" style="display: flex; justify-content: left;"> 
                <input type="checkbox" [checked]="passenger.get('preferences')?.value?.includes(preference)" (change)="togglePreference(\$event, i, preference)">
                {{ preference }}
            </label>
        </div>
    </div>

</div>
                </div>
            </div>
            <button type="submit" [disabled]="editBookingForm.invalid">Update Booking</button>
        </form>
    </section>
</div>
`;
  tsCode = `
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { EditBookingService } from './edit-booking.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import { BookingModel, Locations } from './EditBookingModel';

@Component({
  selector: 'app-edit-bookings',
  standalone: false,
  templateUrl: './edit-bookings.html',
  styleUrl: './edit-bookings.css',
})
export class EditBookings implements OnInit {

  constructor( private editBookingService: EditBookingService, private activatedRoute: ActivatedRoute, private fb: FormBuilder,
    private router: Router, private cdr: ChangeDetectorRef ) {}

  editBookingForm!: FormGroup;

  locations: Locations[] = [];
  bookingId!: number;
  errorMessage = '';
  BookingDetails!: BookingModel;
  submitted = false;

  preferencesDetails = ['Vegetarian', 'Wheelchair Assistance', 'Senior Citizen', 'Child', 'Travel Insurance'];

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe(params => {
      this.bookingId = Number(params.get('bookingId'));
      this.loadLocations();
      this.loadBooking();
    });
  }

  loadLocations() {
    this.editBookingService.getLocations().subscribe({
      next: (response: any) => {
        this.locations = response;
      },
      error: () => {
        this.errorMessage = 'Unable to fetch locations';
      }
    });
  }

  loadBooking() {
    this.editBookingService.getBookingById(this.bookingId).subscribe({
      next: (response: BookingModel) => {
        this.BookingDetails = response;
        this.createForm();
      },
      error: () => {
        this.errorMessage = 'Unable to fetch booking details';
      }
    });
  }

  createForm() {
    this.editBookingForm = this.fb.group({
      locationName: [this.BookingDetails.locationName, Validators.required],
      name: [this.BookingDetails.name,[ Validators.required, Validators.minLength(3), Validators.maxLength(30)]],
      email: [this.BookingDetails.email, [ Validators.required, this.validateEmail]],
      phoneNumber: [ this.BookingDetails.phoneNumber, [ Validators.required, Validators.minLength(10), Validators.maxLength(10)]],
      visitDate: [this.BookingDetails.visitDate,[ Validators.required, this.validateDate]],
      packageType: [ this.BookingDetails.packageType, Validators.required ],
      requirements: this.fb.array([]),
      noOfPeople: [ this.BookingDetails.noOfPeople, [ Validators.required, Validators.min(1), Validators.max(6)]],
      passengerDetails: this.fb.array([])
    });

    // Requirements
    this.BookingDetails.requirements.forEach(req => {
      this.requirements.push(this.fb.control(req));
    });

    // Passenger Details
    if (this.BookingDetails.passengerDetails) {
      this.BookingDetails.passengerDetails.forEach((passenger: any) => {
        this.passengerDetails.push(this.createPassenger(passenger));
      });
    }

    this.editBookingForm.get('noOfPeople')?.valueChanges.subscribe(value => {
        this.generatePassengers(Number(value));
      });
    this.cdr.detectChanges();
  }

  createPassenger(passenger?: any): FormGroup {
    return this.fb.group({
      passengerName: [ passenger?.passengerName || '', Validators.required ],
      age: [ passenger?.age || '', Validators.required],
      gender: [passenger?.gender || '', Validators.required],
      preferences: [passenger?.preferences || []]
    });
  }

  get f() {
    return this.editBookingForm.controls;
  }

  get requirements(): FormArray {
    return this.editBookingForm.get('requirements') as FormArray;
  }

  get passengerDetails(): FormArray {
    return this.editBookingForm.get('passengerDetails') as FormArray;
  }

  addRequirements() {
    this.requirements.push(this.fb.control(''));
  }

  removeRequirements(index: number) {
    this.requirements.removeAt(index);
  }

  togglePreference(event: any, passengerIndex: number, preference: string) {

    const control = this.passengerDetails.at(passengerIndex).get('preferences');
    let values = control?.value || [];

    if (event.target.checked) {
      values = [...values, preference];
    } else {
      values = values.filter((x: string) => x !== preference);
    }

    control?.setValue(values);
  }

  generatePassengers(count: number) {

    if (count < 1 || count > 6) {
      return;
    }

    while (this.passengerDetails.length < count) {
      this.passengerDetails.push(this.createPassenger());
    }

    while (this.passengerDetails.length > count) {
      this.passengerDetails.removeAt(this.passengerDetails.length - 1);
    }
  }

  handleSubmit() {
    this.submitted = true;
    if (this.editBookingForm.invalid) {
      return;
    }

    const payload = {
      id: this.BookingDetails.id,
      locationId: this.BookingDetails.locationId,
      ...this.editBookingForm.value};

    this.editBookingService.editBooking(this.bookingId, payload).subscribe({
        next: () => {
          alert('Booking Updated Successfully');
          this.router.navigate(['/viewBookings']);
        },
        error: err => {
          console.log(err);
        }
      });
  }

  validateEmail(c: any) {
    const pattern = /^[a-zA-Z0-9_.]+@[a-zA-Z]+\\.(com|in)\$/;
    return pattern.test(c.value) ? null : { invalidEmail: { message: 'Invalid email format'} };
  }

  validateDate(c: any) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const visitDate = new Date(c.value);

    return visitDate >= today ? null : { invalidDate: { message: 'Date cannot be in the past'}};
  }
}`;

servicecode = `
export interface BookingModel {
    id:number;
    locationId:number;
    locationName:string;
    name: string;
    email:string;
    phoneNumber: string;
    visitDate: string;
    packageType: string;
    requirements: string[];
    noOfPeople: number;
    passengerDetails: Passengers[];
}

export interface Passengers {
    passengerName:string;
    gender:string;
    age:number;
    preferences:string[];
}

export interface Locations {
    id:number;
    name:string;
    image: string;
    description:string
}
    

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
        return this.http.put<BookingModel>(\`http://localhost:4000/bookings/\${bookingId}\`, requestBody);
    }

    getLocations():Observable<Locations[]>{
        return this.http.get<Locations[]>('http://localhost:4000/locations');
    }
    getBookingById(id:number): Observable<BookingModel> {
        return this.http.get<BookingModel>(\`http://localhost:4000/bookings/\${id}\`);
    }
}
`
  
  data = [
    { index: 'html', value: this.htmlCode },
    { index: 'ts', value: this.tsCode },
    { index: 'service', value: this.servicecode}
  ];
  setIndex = 'ts';
  setDataIndex(data: string) {
    this.setIndex = data;
  }
}