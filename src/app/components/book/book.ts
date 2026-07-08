import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BookService } from './Book.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

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
  passengerDetails: any[] = [];

  
  ngOnInit() {
    this.bookingForm=this.fb.group({
      locationId:[this.locationId],
      locationName:[this.locationName],
      name: ['', [Validators.required,Validators.minLength(3), Validators.maxLength(30)]],
      email: ['', [Validators.required, this.validateEmail]],
      phoneNumber: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(10)]],
      visitDate: ['', [Validators.required, this.validateDate]],
      packageType: ['', Validators.required],
      requirements: ['', Validators.required],
      noOfPeople: ['', Validators.required],
    }),

    this.activatedRouter.paramMap.subscribe((data)=>{
      this.locationId=data.get("id")!;
      this.locationName=data.get("name")!;
    })
  }
  handleSubmit(data: any) {
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
