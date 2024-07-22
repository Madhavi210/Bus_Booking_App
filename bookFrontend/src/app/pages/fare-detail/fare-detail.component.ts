import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { FareService } from 'src/app/core/services/fare/fare.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-fare-detail',
  templateUrl: './fare-detail.component.html',
  styleUrls: ['./fare-detail.component.scss']
})
export class FareComponent implements OnInit {

  fareForm!: FormGroup;
  fareDetails: any;
  calculatedTotalFare: number | null = null;

  constructor(
    private fb: FormBuilder,
    private fareService: FareService
  ) { }

  ngOnInit(): void {
    this.fareForm = this.fb.group({
      routeId: [''],
      baseFarePerKm: [''],
      governmentTaxPercentage: [''],
      distance: [''],
      paymentMethod: ['cash']
    });
  }

  getFareByRoute(): void {
    const routeId = this.fareForm.value.routeId;
    this.fareService.getFareByRoute(routeId).subscribe(
      fare => {
        this.fareDetails = fare;
        this.fareForm.patchValue({
          baseFarePerKm: fare.baseFarePerKm,
          governmentTaxPercentage: fare.governmentTaxPercentage
        });
      },
      error => {
        console.error('Error fetching fare by route:', error);
        Swal.fire('Error', 'Error fetching fare details. Please try again.', 'error');
      }
    );
  }

  setFare(): void {
    const { routeId, baseFarePerKm, governmentTaxPercentage } = this.fareForm.value;
    this.fareService.setFare(routeId, baseFarePerKm, governmentTaxPercentage).subscribe(
      response => {
        Swal.fire('Success', 'Fare details updated successfully!', 'success');
        this.getFareByRoute(); // Refresh fare details
      },
      error => {
        console.error('Error setting fare:', error);
        Swal.fire('Error', 'Error setting fare. Please try again.', 'error');
      }
    );
  }

  calculateTotalFare(): void {
    const { distance, baseFarePerKm, governmentTaxPercentage, paymentMethod } = this.fareForm.value;
    this.fareService.calculateTotalFare(distance, baseFarePerKm, governmentTaxPercentage, paymentMethod).subscribe(
      response => {
        this.calculatedTotalFare = response.totalFare;
      },
      error => {
        console.error('Error calculating total fare:', error);
        Swal.fire('Error', 'Error calculating total fare. Please try again.', 'error');
      }
    );
  }
}
