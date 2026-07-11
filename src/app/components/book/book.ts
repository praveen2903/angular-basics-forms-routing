import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BookService } from './Book.service';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-book',
  standalone: false,
  templateUrl: './book.html',
  styleUrl: './book.css',
})
export class Book {
  constructor(private activatedRouter: ActivatedRoute, private route: Router, private bookService: BookService, private fb: FormBuilder) {}

  locationId: string ='';
  locationName: string ='';
  bookingForm!: FormGroup;
  passengerDetailsForm!: FormGroup;
  submitted= false;
  preferencesDetails = ['Vegetarian', 'Wheelchair Assistance', 'Senior Citizen', 'Child','Travel Insurance']
  
  ngOnInit() {
    this.activatedRouter.paramMap.subscribe((data)=>{
      this.locationId=data.get("locationId")!;
      this.locationName=data.get("locationName")!;
    })
    
    this.bookingForm=this.fb.group({
      locationId:[this.locationId],
      locationName:[this.locationName],
      name: ['', [Validators.required,Validators.minLength(3), Validators.maxLength(30)]],
      email: ['', [Validators.required, this.validateEmail]],
      phoneNumber: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(10)]],
      visitDate: ['', [Validators.required, this.validateDate]],
      packageType: ['', Validators.required],
      requirements: this.fb.array([]),
      noOfPeople: ['', [Validators.required, Validators.min(1), Validators.max(6)]],
      passengerDetails: this.fb.array([])
    });

    this.bookingForm.get('noOfPeople')?.valueChanges.subscribe((value:any) => {
      const count = Number(value);
      if (count > 0) {
        this.generatePassengers(count);
      } else {
        this.passengerDetails.clear();
      }
    });
  }

  createPassenger(): FormGroup {
      return this.fb.group({
        passengerName: ['', Validators.required],
        age: ['', Validators.required],
        gender: ['', Validators.required],
        preferences: this.fb.array([this.fb.control('')])
    });
  }

  get f() {
    return this.bookingForm.controls;
  }
  get requirements(): FormArray {
    return this.bookingForm.get('requirements') as FormArray;
  }

  addRequirements(): void {
    this.requirements.push(this.fb.control(''));
  }

  removeRequirements(index: number): void {
    this.requirements.removeAt(index);
  }
  get passengerDetails(): FormArray {
    return this.bookingForm.get('passengerDetails') as FormArray;
  }

  get preferences(): FormArray {
    return this.passengerDetailsForm.get('preferences') as FormArray;
  }

  togglePreference(event: any, passengerIndex: number, preference: string) {
    const preferences = this.passengerDetails.at(passengerIndex).get('preferences');
    let values = preferences?.value || [];
    if (event.target.checked) {
      values = [...values, preference];
    } else {
      values = values.filter((x: string) => x !== preference);
    }
    preferences?.setValue(values);
  }
  
  generatePassengers(count: number) {
    this.passengerDetails.clear();
    if(count>0 && count>6) {
      return;
    }
    for (let i = 0; i < count; i++) {
      this.passengerDetails.push(this.createPassenger());
    }

  }
  handleSubmit() {
    this.submitted=true;
    if(this.bookingForm.invalid){
      return;
    }
    this.bookService.saveBooking(this.bookingForm.value).subscribe({
      next:()=>{
        alert("Booking successful");
        this.route.navigate(['/'])  
      },
      error:(err)=>{
        console.log(err);
      }
    })
  }

  validateEmail(c: any) {
    const pattern = /^[a-zA-Z0-9_.]+\@[a-zA-Z]+\.(com|in)$/
    if(pattern.test(c.value)){
      return null;
    }
    else{
      return {invalidEmail:{message:'Invalid email Format'}};
    }
  }

  validateDate(c: any) {
    const date = c.value;
    const today = new Date();
    const visitDate = new Date(date);
    if(visitDate>today){
      return null;
    }
    else{
      return {invalidDate:{message:'Date can\'t be past date'}};
    }
  }

  htmlCode = `
  <div class="page">
    <section class="card">
        <form [formGroup]="bookingForm" (ngSubmit)="handleSubmit()" class="booking-form">
            <h2>Book Your Trip</h2>

            <div class="form-group">
                <label>Location ID</label>
                <input type="text" formControlName="locationId" readonly>
            </div>

            <div class="form-group">
                <label>Location Name</label>
                <input type="text" formControlName="locationName" readonly>
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
            <button type="submit" [disabled]="bookingForm.invalid">Book Now</button>
        </form>
    </section>
</div>
`;
  tsCode = `
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BookService } from './Book.service';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-book',
  standalone: false,
  templateUrl: './book.html',
  styleUrl: './book.css',
})
export class Book {
  constructor(private activatedRouter: ActivatedRoute, private route: Router, private bookService: BookService, private fb: FormBuilder) {}

  locationId: string ='';
  locationName: string ='';
  bookingForm!: FormGroup;
  passengerDetailsForm!: FormGroup;
  submitted= false;
  preferencesDetails = ['Vegetarian', 'Wheelchair Assistance', 'Senior Citizen', 'Child','Travel Insurance']
  
  ngOnInit() {
    this.activatedRouter.paramMap.subscribe((data)=>{
      this.locationId=data.get("locationId")!;
      this.locationName=data.get("locationName")!;
    })
    
    this.bookingForm=this.fb.group({
      locationId:[this.locationId],
      locationName:[this.locationName],
      name: ['', [Validators.required,Validators.minLength(3), Validators.maxLength(30)]],
      email: ['', [Validators.required, this.validateEmail]],
      phoneNumber: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(10)]],
      visitDate: ['', [Validators.required, this.validateDate]],
      packageType: ['', Validators.required],
      requirements: this.fb.array([]),
      noOfPeople: ['', [Validators.required, Validators.min(1), Validators.max(6)]],
      passengerDetails: this.fb.array([])
    });

    this.bookingForm.get('noOfPeople')?.valueChanges.subscribe((value:any) => {
      const count = Number(value);
      if (count > 0) {
        this.generatePassengers(count);
      } else {
        this.passengerDetails.clear();
      }
    });
  }

  createPassenger(): FormGroup {
      return this.fb.group({
        passengerName: ['', Validators.required],
        age: ['', Validators.required],
        gender: ['', Validators.required],
        preferences: this.fb.array([this.fb.control('')])
    });
  }

  get f() {
    return this.bookingForm.controls;
  }
  get requirements(): FormArray {
    return this.bookingForm.get('requirements') as FormArray;
  }

  addRequirements(): void {
    this.requirements.push(this.fb.control(''));
  }

  removeRequirements(index: number): void {
    this.requirements.removeAt(index);
  }
  get passengerDetails(): FormArray {
    return this.bookingForm.get('passengerDetails') as FormArray;
  }

  get preferences(): FormArray {
    return this.passengerDetailsForm.get('preferences') as FormArray;
  }

  togglePreference(event: any, passengerIndex: number, preference: string) {
    const preferences = this.passengerDetails.at(passengerIndex).get('preferences');
    let values = preferences?.value || [];
    if (event.target.checked) {
      values = [...values, preference];
    } else {
      values = values.filter((x: string) => x !== preference);
    }
    preferences?.setValue(values);
  }
  
  generatePassengers(count: number) {
    this.passengerDetails.clear();
    if(count>0 && count>6) {
      return;
    }
    for (let i = 0; i < count; i++) {
      this.passengerDetails.push(this.createPassenger());
    }

  }
  handleSubmit() {
    this.submitted=true;
    if(this.bookingForm.invalid){
      return;
    }
    this.bookService.saveBooking(this.bookingForm.value).subscribe({
      next:()=>{
        alert("Booking successful");
        this.route.navigate(['/'])  
      },
      error:(err)=>{
        console.log(err);
      }
    })
  }

  validateEmail(c: any) {
    const pattern = /^[a-zA-Z0-9_.]+\\@[a-zA-Z]+\\.(com|in)\$/
    if(pattern.test(c.value)){
      return null;
    }
    else{
      return {invalidEmail:{message:'Invalid email Format'}};
    }
  }

  validateDate(c: any) {
    const date = c.value;
    const today = new Date();
    const visitDate = new Date(date);
    if(visitDate>today){
      return null;
    }
    else{
      return {invalidDate:{message:'Date can\\'t be past date'}};
    }
  }
}
`;

serviceCode = `
export interface BookingModel {
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
`;


  theoryCode = `Angular Forms Theory

1. dirty / pristine:
   - dirty: The user has interacted with the control and changed its value.
   - pristine: The user has not changed the control's value since it was initialized.

2. touched / untouched:
   - touched: The user has clicked into and blurred (left) the form control.
   - untouched: The user has not yet blurred the control.

3. valid / invalid:
   - valid: The form control passes all defined validators (e.g., required, minLength, pattern).
   - invalid: The form control fails at least one validator.

Usage Example:
*ngIf="f['name'].invalid && (f['name'].dirty || f['name'].touched)"

This means: "Show the error message ONLY IF the input is invalid AND the user has either typed something (dirty) or clicked in and out of the field (touched)." This prevents errors from showing before the user even tries to type!`;

  data = [
    { index: 'html', value: this.htmlCode },
    { index: 'ts', value: this.tsCode },
    { index:'service', value: this.serviceCode},
    { index: 'theory', value: this.theoryCode }
  ];
  setIndex = 'theory';
  setDataIndex(data: string) {
    this.setIndex = data;
  }
}
