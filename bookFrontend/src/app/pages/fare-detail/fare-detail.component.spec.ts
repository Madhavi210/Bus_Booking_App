import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FareDetailComponent } from './fare-detail.component';

describe('FareDetailComponent', () => {
  let component: FareDetailComponent;
  let fixture: ComponentFixture<FareDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FareDetailComponent]
    });
    fixture = TestBed.createComponent(FareDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
