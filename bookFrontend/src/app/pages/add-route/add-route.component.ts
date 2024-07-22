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
      totalDistance: [0, [Validators.required, Validators.min(1)]],
      stations: this.fb.array([
        this.createStation()
      ])
    });
    this.routeId = this.activatedRoute.snapshot.paramMap.get('id');
    this.isEdit = true
    this.initializeForm();
    console.log(this.isEdit);
    
    if (this.isEdit) {
      this.loadRouteData();
    }
  }

  initializeForm(): void {
    this.createRouteForm = this.fb.group({
      totalDistance: [0, [Validators.required, Validators.min(1)]],
      stations: this.fb.array([this.createStationGroup(), this.createStationGroup()]),
      
    });
  }
  createStationGroup(): FormGroup {
    return this.fb.group({
      name: ['', Validators.required],
      distanceFromPrevious: [0, [Validators.required, Validators.min(0)]],
      timing: [null, Validators.required]
    });
  }
  loadRouteData(): void {
    if (this.routeId) {
      this.routeService.getRouteById(this.routeId).subscribe(route => {
        this.createRouteForm.patchValue({
          totalDistance: route.totalDistance
        });
  
        const stationsArray = this.createRouteForm.get('stations') as FormArray;
        stationsArray.clear();
        route.stations.forEach(station => {
          console.log('Patching station:', station); // Debug line
          stationsArray.push(this.fb.group({
            name: [station.name, Validators.required],
            distanceFromPrevious: [station.distanceFromPrevious, [Validators.required, Validators.min(0)]],
            timing: [station.timing, Validators.required]  
          }));
        });
      });
    }
  }

  get stations(): FormArray {
    return this.createRouteForm.get('stations') as FormArray;
  }

  createStation(): FormGroup {
    return this.fb.group({
      name: ['', Validators.required],
      distanceFromPrevious: [0, [Validators.required, Validators.min(0)]],
      timing: ["", Validators.required]
    });
  }

  addStation(): void {
    this.stations.push(this.createStation());
  }

  removeStation(index: number): void {
    console.log(index);
    
    if (this.stations.length > 1) {
      this.stations.removeAt(index);
    } else {
      Swal.fire('Warning', 'At least one station is required.', 'warning');
    }
  }

  onSubmit(): void {
    if (this.createRouteForm.valid) {
      const routeData = this.createRouteForm.value;
      if (this.isEdit && this.routeId) {
        this.routeService.updateRoute(this.routeId!, routeData).subscribe({
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

