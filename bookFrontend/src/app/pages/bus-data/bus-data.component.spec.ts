import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BusDataComponent } from './bus-data.component';

describe('BusDataComponent', () => {
  let component: BusDataComponent;
  let fixture: ComponentFixture<BusDataComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BusDataComponent]
    });
    fixture = TestBed.createComponent(BusDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
