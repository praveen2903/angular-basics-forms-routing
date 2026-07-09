import { ChangeDetectorRef, Component } from '@angular/core';
import { EditBookingService } from './edit-booking.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BookingModel, Locations } from './EditBookingModel';

@Component({
  selector: 'app-edit-bookings',
  standalone: false,
  templateUrl: './edit-bookings.html',
  styleUrl: './edit-bookings.css',
})
export class EditBookings {
  constructor(private editBookingService: EditBookingService, private activatedRoute: ActivatedRoute,
               private fb:FormBuilder, private router: Router, private cdr: ChangeDetectorRef){}

  editBookingForm!:FormGroup;
  passengerDetailsForm!:FormGroup;

  locations:Locations[]= [];
  bookingId!:number;
  errorMessage:string='';
  BookingDetails!:BookingModel;
  submitted:Boolean=false;

  preferencesDetails = ['Vegetarian', 'Wheelchair Assistance', 'Senior Citizen', 'Child','Travel Insurance']


  ngOnInit():void{


    this.activatedRoute.paramMap.subscribe((data)=>{
        this.bookingId= parseInt(data.get('bookingId')!);
    });


    this.editBookingService.getBookingById(this.bookingId).subscribe({
      next:(response:any) =>{
        this.BookingDetails=response;
        this.cdr.markForCheck();
      },
      error:(err)=>{
        this.errorMessage='Unable to fetch the details!'
      }
    });


    this.editBookingService.getLocations().subscribe({
      next:(response:any)=> {
        this.locations=response;
        this.cdr.markForCheck();
      },
      error:(err:any)=>{
        this.errorMessage ='Unable to fetch the details';
        this.cdr.detectChanges();
      }
    });

    this.editBookingForm=this.fb.group({
      locationName:[this.BookingDetails.locationName, Validators.required ],
      name: [this.BookingDetails.name, [Validators.required,Validators.minLength(3), Validators.maxLength(30)]],
      email: [this.BookingDetails.email, [Validators.required, this.validateEmail]],
      phoneNumber: [this.BookingDetails.phoneNumber, [Validators.required, Validators.minLength(10), Validators.maxLength(10)]],
      visitDate: [this.BookingDetails.visitDate, [Validators.required, this.validateDate]],
      packageType: [this.BookingDetails.packageType , Validators.required],
      requirements: this.fb.array(this.BookingDetails.requirements),
      noOfPeople: [this.BookingDetails.noOfPeople, [Validators.required, Validators.min(1), Validators.max(6)]],
      passengerDetails: this.fb.array([])
    });

    this.editBookingForm.get('noOfPeople')?.valueChanges.subscribe((value:any) => {
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
    return this.editBookingForm.controls;
  }
  get requirements(): FormArray {
    return this.editBookingForm.get('requirements') as FormArray;
  }

  addRequirements(): void {
    this.requirements.push(this.fb.control(''));
  }

  removeRequirements(index: number): void {
    this.requirements.removeAt(index);
  }

  get passengerDetails(): FormArray {
    return this.editBookingForm.get('passengerDetails') as FormArray;
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
    if(this.editBookingForm.invalid){
      return;
    }

    const payload = {
      id: this.BookingDetails.id,
      locationId: this.BookingDetails.locationId,
      ...this.editBookingForm.value
    };
    this.editBookingService.editBooking(this.bookingId, this.editBookingForm.value).subscribe({
      next:()=>{
        alert("Booking successful");
        this.router.navigate(['/'])  
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
