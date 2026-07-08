import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditBookings } from './edit-bookings';

describe('EditBookings', () => {
  let component: EditBookings;
  let fixture: ComponentFixture<EditBookings>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EditBookings],
    }).compileComponents();

    fixture = TestBed.createComponent(EditBookings);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
