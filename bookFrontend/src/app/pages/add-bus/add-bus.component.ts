import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { BusService } from 'src/app/core/services/bus/bus.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-bus',
  templateUrl: './add-bus.component.html',
  styleUrls: ['./add-bus.component.scss']
})
export class AddBusComponent implements OnInit {
  busForm: FormGroup;
  isEdit: boolean = false;
  busId: string | null = null;
  seatingCapacities: number[] = [20, 32, 40, 56, 60];

  constructor(
    private fb: FormBuilder,
    private busService: BusService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {
    this.busForm = this.fb.group({
      busNumber: ['', Validators.required],
      seatingCapacity: [30, [Validators.required, Validators.min(1)]],
      amenities: this.fb.array([this.fb.control('')]),
      routeName: ['', Validators.required],
      stops: this.fb.array([]),
      busType: ['', Validators.required],
      seatsLayout: ['2x2', Validators.required],
      rows: [0, [Validators.required, Validators.min(1)]],
      columns: [0, [Validators.required, Validators.min(1)]],
      date: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.busId = this.activatedRoute.snapshot.paramMap.get('id');
    this.isEdit = !!this.busId;
    if (this.isEdit) {
      this.loadBusData();
    }
  }

  createStopGroup(): FormGroup {
    return this.fb.group({
      station: ['', Validators.required],
      departureTime: ['', Validators.required]  // Changed to departureTime
    });
  }

  loadBusData(): void {
    if (this.busId) {
      this.busService.getBusById(this.busId).subscribe(bus => {
        this.busForm.patchValue({
          busNumber: bus.busNumber,
          seatingCapacity: bus.seatingCapacity,
          busType: bus.busType,
          rows: bus.rows,
          columns: bus.columns,
          date: bus.date
        });

        const stopsArray = this.busForm.get('stops') as FormArray;
        stopsArray.clear();
        bus.stops.forEach(stop => {
          stopsArray.push(this.fb.group({
            station: [stop.station, Validators.required],
            departureTime: [stop.departureTime, Validators.required]
          }));
        });

        const amenitiesArray = this.busForm.get('amenities') as FormArray;
        amenitiesArray.clear();
        bus.amenities.forEach(amenity => {
          amenitiesArray.push(this.fb.control(amenity));
        });
      });
    }
  }

  get amenities() {
    return this.busForm.get('amenities') as FormArray;
  }

  get stops() {
    return this.busForm.get('stops') as FormArray;
  }

  addStop() {
    this.stops.push(this.createStopGroup());
  }

  removeStop(index: number) {
    this.stops.removeAt(index);
  }

  addAmenity() {
    this.amenities.push(this.fb.control(''));
  }

  onSubmit(): void {
    if (this.busForm.valid) {
      const busData = this.busForm.value;
      if (this.isEdit && this.busId) {
        this.busService.updateBus(this.busId, busData).subscribe({
          next: () => {
            Swal.fire('Success', 'Bus updated successfully', 'success');
            this.router.navigate(['/admin/busList']);
          },
          error: (error) => {
            console.error('Bus update failed', error);
            Swal.fire('Error', 'Bus update failed', 'error');
          }
        });
      } else {
        this.busService.createBus(busData).subscribe({
          next: (response) => {
            console.log(response);
            
            Swal.fire('Success', 'Bus created successfully', 'success');
            this.router.navigate(['/admin/busList']);
          },
          error: (error) => {
            console.error('Bus creation failed', error);
            Swal.fire('Error', 'Bus creation failed', 'error');
          }
        });
      }
    } else {
      this.busForm.markAllAsTouched();
    }
  }
}
