import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { Router , ActivatedRoute} from '@angular/router';
import { RouteService } from 'src/app/core/services/route/route.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-route',
  templateUrl: './add-route.component.html',
  styleUrls: ['./add-route.component.scss']
})
export class AddRouteComponent {
  createRouteForm!: FormGroup;
  isEdit: boolean = false;
  routeId: string | null = null;

  constructor(
    private fb: FormBuilder,
    private routeService: RouteService,
    private activatedRoute :ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.createRouteForm = this.fb.group({
      routeName: ['', Validators.required],
      stations: this.fb.array([this.createStation()])
    });

    this.routeId = this.activatedRoute.snapshot.paramMap.get('id');
    this.isEdit = !!this.routeId;
    
    if (this.isEdit) {
      this.loadRouteData();
    }
  }

  createStation(): FormGroup {
    return this.fb.group({
      name: ['', Validators.required],
      distanceFromPrevious: [0, [Validators.required, Validators.min(0)]],
      stationNumber: [1, Validators.required]  // Adding stationNumber
    });
  }

  loadRouteData(): void {
    if (this.routeId) {
      this.routeService.getRouteById(this.routeId).subscribe(route => {
        this.createRouteForm.patchValue({
          routeName: route.routeName
        });

        const stationsArray = this.createRouteForm.get('stations') as FormArray;
        stationsArray.clear();
        route.stations.forEach(station => {
          stationsArray.push(this.createStation().patchValue({
            name: station.name,
            distanceFromPrevious: station.distanceFromPrevious,
            stationNumber: station.stationNumber
          }));
        });
      });
    }
  }

  get stations(): FormArray {
    return this.createRouteForm.get('stations') as FormArray;
  }

  addStation(): void {
    this.stations.push(this.createStation());
  }

  removeStation(index: number): void {
    console.log(index,' index removed');
    
    if (index > 1) {
      this.stations.removeAt(index);
    } else {
      Swal.fire('Warning', 'At least one station is required.', 'warning');
    }
  }

  onSubmit(): void {
    if (this.createRouteForm.valid) {
      const routeData = this.createRouteForm.value;
      if (this.isEdit && this.routeId) {
        this.routeService.updateRoute(this.routeId, routeData).subscribe({
          next: () => {
            Swal.fire('Success', 'Route updated successfully', 'success');
            this.router.navigate(['/admin/routeList']);
          },
          error: (error) => {
            console.error('Route update failed', error);
            Swal.fire('Error', 'Route update failed', 'error');
          }
        });
      } else {
        this.routeService.createRoute(routeData).subscribe({
          next: () => {
            Swal.fire('Success', 'Route created successfully', 'success');
            this.router.navigate(['/admin/routeList']);
          },
          error: (error) => {
            console.error('Route creation failed', error);
            Swal.fire('Error', 'Route creation failed', 'error');
          }
        });
      }
    } else {
      this.createRouteForm.markAllAsTouched();
    }
  }
}

