import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BusService } from 'src/app/core/services/bus/bus.service';
import { BookingService } from 'src/app/core/services/booking/booking.service';
import { IBus } from 'src/app/core/interface/bus.interface';
import Swal from 'sweetalert2';
import { FareService } from 'src/app/core/services/fare/fare.service';

@Component({
  selector: 'app-booking',
  templateUrl: './booking.component.html',
  styleUrls: ['./booking.component.scss']
})
export class BookingFormComponent implements OnInit {
  bookingForm!: FormGroup;
  busId: string = '';
  bus: IBus | undefined;
  userId: string = '';
  routeId: string = '';
  seatNo: number = 0;

  stations: string[] = []; // Array to hold station names
  routeDistances: { [key: string]: number } = {};

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private busService: BusService,
    private bookingService: BookingService,
    private fareService: FareService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.userId = localStorage.getItem('userId') || '';
    this.busId = this.route.snapshot.paramMap.get('id') || '' ;
    const seatNumber = this.route.snapshot.paramMap.get('seatnumber');
    this.seatNo = seatNumber ? parseInt(seatNumber, 10) : 0;
    console.log(this.seatNo, this.busId, this.userId, "seat bus user");
    
    if (!this.busId) {
      console.error('Bus ID is missing from URL');
      return;
    }

    this.bookingForm = this.fb.group({
      fromStation: ['', Validators.required],
      toStation: ['', Validators.required],
      seatNumber: [this.seatNo, [Validators.required, Validators.min(1)]],
      fare:[{ value: '', disabled: true }],
      // paymentType: ['', Validators.required],
      // transactionId: ['', Validators.required]
    });

    this.fetchBusDetails();
  }

  fetchBusDetails(): void {
    this.busService.getBusById(this.busId).subscribe(
      data => {
        this.bus = data;
        this.routeId = this.bus.route;
        // let fare = 150;
        this.stations = this.bus.stops.map(stop => stop.station); // Extract station names
        this.calculateFare();
      },
      error => {
        console.error('Error fetching bus details:', error);
      }
    );
  }

  calculateFare(): void {
    const fromStation = this.bookingForm.get('fromStation')?.value;
    const toStation = this.bookingForm.get('toStation')?.value;    
    if (fromStation && toStation && this.bus) {
      const distance = this.calculateDistance(fromStation, toStation);
      console.log(distance, "distance");
      
      this.fareService.getFareByRoute(this.routeId).subscribe(
        fareDetails => {
          const baseFarePerKm = fareDetails.baseFarePerKm;
          const governmentTaxPercentage = fareDetails.governmentTaxPercentage;
          this.fareService.calculateFare(distance, baseFarePerKm, governmentTaxPercentage).subscribe(
            fare => {
              this.bookingForm.patchValue({
                fare: fare
              });
              console.log(fare);
              
            },
            error => {
              console.error('Error calculating fare:', error);
            }
          );
        },
        error => {
          console.error('Error fetching fare details:', error);
        }
      );
    }
  }


  calculateDistance(fromStation: string, toStation: string): number {
    let totalDistance = 0;
    let currentStation = fromStation;

    while (currentStation !== toStation) {
      for (const key in this.routeDistances) {
        const [startStation, endStation] = key.split('-');
        if (startStation === currentStation) {
          totalDistance += this.routeDistances[key];
          currentStation = endStation;
          break;
        }
      }
      if (currentStation === toStation) break;
    }
    console.log(totalDistance, "total distance");
    
    return totalDistance;
  }


  onSubmit(): void {
    if (this.bookingForm.invalid) {
      this.bookingForm.markAllAsTouched(); // Mark all controls as touched to display validation messages
      return;
    }

    const bookingDetails = {
      userId: this.userId,
      busId: this.busId,
      routeId: this.routeId,
      ...this.bookingForm.value,
      paymentDetails: {
        transactionId: this.bookingForm.value.transactionId,
        additionalCharges: 26.0 // Placeholder for additional charges
      }
      
    };
    
    this.bookingService.createBooking(bookingDetails).subscribe(
      () => {
        Swal.fire('Success!', 'Your seat has been booked.', 'success');
        this.router.navigate(['/home']);
      },
      error => {
        console.error('Error booking seat:', error);
        Swal.fire('Error!', 'There was an issue booking your seat.', 'error');
      }
    );
  }
}
