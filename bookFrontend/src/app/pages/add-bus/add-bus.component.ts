// add-bus.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { BusService } from 'src/app/core/services/bus/bus.service';
import Swal from 'sweetalert2';
import { IRoute, IStation } from 'src/app/core/interface/route.interface';
import { RouteService } from 'src/app/core/services/route/route.service';

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
  routes: IRoute[] = [];
  stations: IStation[] = [];

  constructor(
    private fb: FormBuilder,
    private busService: BusService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private routeService: RouteService,
  ) {
    this.busForm = this.fb.group({
      busNumber: ['', Validators.required],
      seatingCapacity: [30, [Validators.required, Validators.min(1)]],
      amenities: this.fb.array([this.fb.control('')]),
      routeName: ['', Validators.required],
      stops: this.fb.array([]),
      busType: ['', Validators.required],
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
    this.loadRoutes();
  }

  loadRoutes(): void {
    this.routeService.getAllRoutes().subscribe({
      next: (response) => {
        this.routes = response.routes;
      },
      error: (error) => {
        console.error('Failed to load routes', error);
      }
    });
  }

  onRouteChange(): void {
    const selectedRouteName = this.busForm.get('routeName')?.value;
    
    if (selectedRouteName) {
      const selectedRoute = this.routes.find(route => route.routeName === selectedRouteName);
      if (selectedRoute) {
        this.stations = selectedRoute.stations.map((station, index) => ({
          name: station.name,
          timing: station.timing || '',
          distanceFromPrevious: station.distanceFromPrevious,
          stationNumber: station.stationNumber
        }));
        this.populateStops();
      }
    }
  }

  populateStops(): void {
    const stopsArray = this.busForm.get('stops') as FormArray;
    stopsArray.clear();
    this.stations.forEach(station => {
      stopsArray.push(this.fb.group({
        station: [station.name, Validators.required],
        departureTime: ['', Validators.required]
      }));
    });
  }

  loadBusData(): void {
    if (this.busId) {
      this.busService.getBusById(this.busId).subscribe(bus => {
        this.busForm.patchValue({
          busNumber: bus.busNumber,
          seatingCapacity: bus.seatingCapacity,
          // routeName: bus.routeName,
          busType: bus.busType,
          rows: bus.rows,
          columns: bus.columns,
          date: bus.date,
        });

        const amenitiesArray = this.busForm.get('amenities') as FormArray;
        amenitiesArray.clear();
        bus.amenities.forEach((amenity: string) => {
          amenitiesArray.push(this.fb.control(amenity));
        });

        const stopsArray = this.busForm.get('stops') as FormArray;
        stopsArray.clear();
        bus.stops.forEach((stop: any) => {
          stopsArray.push(this.fb.group({
            station: stop.station,
            departureTime: stop.departureTime
          }));
        });
      });
    }
  }

  addAmenity(): void {
    const amenities = this.busForm.get('amenities') as FormArray;
    amenities.push(this.fb.control(''));
  }

  removeAmenity(index: number): void {
    this.amenities.removeAt(index);
  }

  // removeStop(index: number): void {
  //   const stopsArray = this.busForm.get('stops') as FormArray;
  //   stopsArray.removeAt(index);
  // }

  // addStop(): void {
  //   const stopsArray = this.busForm.get('stops') as FormArray;
  //   stopsArray.push(this.fb.group({
  //     station: ['', Validators.required],
  //     departureTime: ['', Validators.required]
  //   }));
  // }

  onSubmit(): void {
    if (this.busForm.valid) {
      const busData = this.busForm.value;
      busData.routeName = busData.routeName.trim();
      console.log(busData, 'busdata');
      console.log(this.busForm.value, 'busform');
      
      if (this.isEdit && this.busId) {
        this.busService.updateBus(this.busId, busData).subscribe({
          next: (response) => {
            Swal.fire('Success', 'Bus updated successfully!', 'success');
            this.router.navigate(['/admin/busList']);
          },
          error: (error) => {
            Swal.fire('Error', 'Failed to update bus', 'error');
          }
        });
      } else {
        this.busService.createBus(busData).subscribe({
          next: (response) => {
            Swal.fire('Success', 'Bus added successfully!', 'success');
            this.router.navigate(['/admin/busList']);
          },
          error: (error) => {
            Swal.fire('Error', 'Failed to add bus', 'error');
          }
        });
      }
    }
  }

  get amenities(): FormArray {
    return this.busForm.get('amenities') as FormArray;
  }

  get stops(): FormArray {
    return this.busForm.get('stops') as FormArray;
  }

  
}
