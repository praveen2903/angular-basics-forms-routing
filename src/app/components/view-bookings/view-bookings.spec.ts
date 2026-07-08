import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewBookings } from './view-bookings';

describe('ViewBookings', () => {
  let component: ViewBookings;
  let fixture: ComponentFixture<ViewBookings>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ViewBookings],
    }).compileComponents();

    fixture = TestBed.createComponent(ViewBookings);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
