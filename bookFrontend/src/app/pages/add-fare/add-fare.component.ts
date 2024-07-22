import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FareService } from 'src/app/core/services/fare/fare.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-fare',
  templateUrl: './add-fare.component.html',
  styleUrls: ['./add-fare.component.scss']
})
export class AddFareComponent implements OnInit {
  fareForm!: FormGroup;
  
  constructor(
    private fb: FormBuilder,
    private fareService: FareService
  ) {}

  ngOnInit(): void {
    this.fareForm = this.fb.group({
      routeId: ['', Validators.required],
      baseFarePerKm: [0, [Validators.required, Validators.min(0)]],
      governmentTaxPercentage: [0, [Validators.required, Validators.min(0)]]
    });
  }

  onSubmit(): void {
    if (this.fareForm.valid) {
      const { routeId, baseFarePerKm, governmentTaxPercentage } = this.fareForm.value;
      this.fareService.setFare(routeId, baseFarePerKm, governmentTaxPercentage).subscribe({
        next: () => {
          Swal.fire('Success', 'Fare added successfully', 'success');
        },
        error: (error) => {
          console.error('Failed to add fare', error);
          Swal.fire('Error', 'Failed to add fare', 'error');
        }
      });
    } else {
      this.fareForm.markAllAsTouched();
    }
  }
}
