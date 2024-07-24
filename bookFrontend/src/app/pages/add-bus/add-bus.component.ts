
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { Router } from '@angular/router';
import { BusService } from 'src/app/core/services/bus/bus.service';
import { ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-bus',
  templateUrl: './add-bus.component.html',
  styleUrls: ['./add-bus.component.scss']
})
export class AddBusComponent {
  busForm: FormGroup;
  isEdit: boolean = false;
  busId: string | null = null;

  constructor(
    private fb: FormBuilder,
    private busService: BusService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {
    this.busForm = this.fb.group({
      busNumber: ['', Validators.required],
      seatingCapacity: [40, [Validators.required, Validators.min(1)]],
      amenities: this.fb.array([
        this.fb.control('WiFi'),
        this.fb.control('AC'),
        this.fb.control('Charging Ports')
      ]),
      route: ['', Validators.required],
      stops: this.fb.array([]),
      totalTiming: [0, Validators.required],
      // Seats are set directly, not included in the form
    });
  }

  ngOnInit(): void {
    this.addDefaultSeats(); // Initialize default seats but not in the form
    this.busId = this.activatedRoute.snapshot.paramMap.get('id');
    this.isEdit = !!this.busId;
    if (this.isEdit) {
      this.loadBusData();
    }
  }

  createStopGroup(): FormGroup {
    return this.fb.group({
      station: ['', Validators.required],
      timing: ['', Validators.required]
    });
  }

  loadBusData(): void {
    if (this.busId) {
      this.busService.getBusById(this.busId).subscribe(bus => {
        this.busForm.patchValue({
          busNumber: bus.busNumber,
          seatingCapacity: bus.seatingCapacity,
          route: bus.route,
          totalTiming: bus.date
        });

        const stopsArray = this.busForm.get('stops') as FormArray;
        stopsArray.clear();
        bus.stops.forEach(stop => {
          stopsArray.push(this.fb.group({
            station: [stop.station, Validators.required],
            timing: [stop.departureTime, Validators.required]
          }));
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
    this.stops.push(this.fb.group({
      station: ['', Validators.required],
      timing: ['', Validators.required]
    }));
  }

  removeStop(index: number) {
    this.stops.removeAt(index);
  }

  addDefaultSeats() {
    // Default seat initialization for backend
    const seats = Array.from({ length: 40 }, (_, i) => ({
      seatNumber: i + 1,
      isBooked: false
    }));

    // Send seats data to backend or use it as needed
    console.log(seats);
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
          next: () => {
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
