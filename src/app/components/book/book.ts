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
}
