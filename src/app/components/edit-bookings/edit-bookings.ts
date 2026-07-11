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
}