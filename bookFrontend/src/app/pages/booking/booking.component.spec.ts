import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookingFormComponent } from './booking.component';

describe('BookingComponent', () => {
  let component: BookingFormComponent;
  let fixture: ComponentFixture<BookingFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BookingFormComponent]
    });
    fixture = TestBed.createComponent(BookingFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
