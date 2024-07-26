import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BusService } from 'src/app/core/services/bus/bus.service';
import { BookingService } from 'src/app/core/services/booking/booking.service';
import { RouteService } from 'src/app/core/services/route/route.service';
import { IRoute } from 'src/app/core/interface/route.interface';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-booking',
  templateUrl: './booking.component.html',
  styleUrls: ['./booking.component.scss']
})
export class BookingFormComponent implements OnInit {
  bookingForm!: FormGroup;
  paymentTypes = ['cash', 'card', 'upi'];
  farePerKm = 10; // Example fare per km, adjust as needed
  routeId!: string;
  busId!: string;
  seatNumber!: number;
  routes!: IRoute;
  date!: Date;
  bookingData!: any;
  fare = 0;

  constructor(
    private fb: FormBuilder, 
    private route: ActivatedRoute,
    private busService: BusService,
    private bookingService: BookingService,
    private routeService: RouteService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.busId = params.get('id')!;
      this.seatNumber = +params.get('seatNumber')!;
      this.initializeForm();
      this.fetchRouteId();
    });    
  }

  initializeForm(): void {
    this.bookingForm = this.fb.group({
      userName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      mobileNumber: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      age: ['', [Validators.required, Validators.min(0)]],
      busId: [this.busId],
      routeId: [''],
      fromStation: ['', [Validators.required]],
      toStation: ['', [Validators.required]],
      seatNumber: [this.seatNumber, [Validators.required]],
      fare: [{ value: '', disabled: true }],
      paymentType: ['cash', [Validators.required]],
      paymentDetails: this.fb.group({
        cardNumber: [''],
        upiId: ['']
      }),
      isSingleLady: [false],
      passengerType: ['']
    });

    this.bookingForm.get('paymentType')?.valueChanges.subscribe(value => {
      this.onPaymentTypeChange(value);
    });

    this.bookingForm.get('fromStation')?.valueChanges.subscribe(() => this.calculateFare());
    this.bookingForm.get('toStation')?.valueChanges.subscribe(() => this.calculateFare());
  }

  fetchRouteId(): void {
    this.busService.getBusById(this.busId).subscribe((data: any) => {
      this.routeId = data.bus.route;
      this.bookingForm.patchValue({ routeId: this.routeId });
      this.fetchRouteDetails(this.routeId);
    });
  }

  fetchRouteDetails(routeId: string): void {
    this.routeService.getRouteById(routeId).subscribe(route => {
      this.routes = route;
    });
  }

  calculateDistance(fromStation: string, toStation: string): number {
    if (!this.routes) {
      console.error('Route not loaded');
      return 0;
    }

    let totalDistance = 0;
    let startIndex = this.routes.stations.findIndex(station => station.name === fromStation);
    let endIndex = this.routes.stations.findIndex(station => station.name === toStation);

    if (startIndex === -1 || endIndex === -1 || startIndex > endIndex) {
      console.error('Invalid stations');
      return 0;
    }

    for (let i = startIndex; i < endIndex; i++) {
      totalDistance += this.routes.stations[i].distanceFromPrevious;
    }

    return totalDistance;
  }

  calculateFare(): void {
    const fromStation = this.bookingForm.get('fromStation')?.value;
    const toStation = this.bookingForm.get('toStation')?.value;

    if (fromStation && toStation) {
      const distance = this.calculateDistance(fromStation, toStation);
      this.fare = distance * this.farePerKm;
      this.bookingForm.get('fare')?.setValue(this.fare);
    }
  }

  onPaymentTypeChange(paymentType: string): void {
    const paymentDetails = this.bookingForm.get('paymentDetails');
    if (paymentType === 'card') {
      paymentDetails?.get('cardNumber')?.setValidators([Validators.required]);
      paymentDetails?.get('upiId')?.clearValidators();
    } else if (paymentType === 'upi') {
      paymentDetails?.get('upiId')?.setValidators([Validators.required]);
      paymentDetails?.get('cardNumber')?.clearValidators();
    } else {
      paymentDetails?.get('cardNumber')?.clearValidators();
      paymentDetails?.get('upiId')?.clearValidators();
    }
    paymentDetails?.get('cardNumber')?.updateValueAndValidity();
    paymentDetails?.get('upiId')?.updateValueAndValidity();
  }

  onSubmit(): void {
    if (this.bookingForm.valid) {
      const formData = this.bookingForm.getRawValue();
      const totalFare = this.calculateTotalFare();

      this.bookingData = {
        userName: formData.userName,
        email: formData.email,
        mobileNumber: formData.mobileNumber,
        age: formData.age,
        busId: this.busId,
        routeId: this.routeId,
        fromStation: formData.fromStation,
        toStation: formData.toStation,
        seatNumber: formData.seatNumber,
        fare: this.fare,
        paymentType: formData.paymentType,
        paymentDetails: {
          cardNumber: formData.paymentDetails.cardNumber,
          upiId: formData.paymentDetails.upiId
        },
        isSingleLady: formData.isSingleLady,
        passengerType: 'adult'
      };

      // Submit form data to the server
      this.bookingService.createBooking(this.bookingData).subscribe(
        (response: any) => {
          console.log(response);
          
          Swal.fire('Success', 'Booking successful!', 'success');
          this.router.navigate(['/booking-success']);
        },
        (error) => {
          console.error(error);
          Swal.fire('Error', 'Booking failed!', 'error');
        }
      );
    } else {
      console.log('Form is invalid');
    }
  }

  calculateTotalFare(): number {
    const totalFare = this.bookingForm.get('fare')?.value || 0;
    return totalFare + 26; // Adding fixed additional fare of 26
  }
}

