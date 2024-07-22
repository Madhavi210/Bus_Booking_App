import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeatingArrangementComponent } from './seating-arrangement.component';

describe('SeatingArrangementComponent', () => {
  let component: SeatingArrangementComponent;
  let fixture: ComponentFixture<SeatingArrangementComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SeatingArrangementComponent]
    });
    fixture = TestBed.createComponent(SeatingArrangementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
