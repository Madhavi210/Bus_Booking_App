import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BookingService } from 'src/app/core/services/booking/booking.service';
import { FareService } from 'src/app/core/services/fare/fare.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss']
})
export class PaymentComponent implements OnInit{
  paymentForm!: FormGroup;
  totalFare: number | undefined;
  bookingId: string = '';

  constructor(
    private fb: FormBuilder,
    private bookingService: BookingService,
    private fareService: FareService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Get booking details and calculate total fare
    this.bookingId = localStorage.getItem('bookingId') || '';

    if (!this.bookingId) {
      console.error('Booking ID is missing from local storage');
      return;
    }

    this.paymentForm = this.fb.group({
      paymentMethod: ['', Validators.required],
      totalFare: [{ value: '', disabled: true }],
      transactionId: ['']
    });

    this.fetchBookingDetails();
  }

  fetchBookingDetails(): void {
    this.bookingService.getBookingById(this.bookingId).subscribe(
      booking => {
        this.totalFare = booking.fare; // Update with the actual fare calculation if needed
        this.paymentForm.patchValue({
          totalFare: this.totalFare
        });
      },
      error => {
        console.error('Error fetching booking details:', error);
      }
    );
  }

  onSubmit(): void {
    if (this.paymentForm.invalid) {
      this.paymentForm.markAllAsTouched();
      return;
    }

    const paymentDetails = {
      ...this.paymentForm.value,
      bookingId: this.bookingId
    };

    this.bookingService.updateBooking(this.bookingId, { paymentDetails }).subscribe(
      () => {
        Swal.fire('Success!', 'Payment has been processed successfully.', 'success');
        this.router.navigate(['/home']);
      },
      error => {
        console.error('Error processing payment:', error);
        Swal.fire('Error!', 'There was an issue processing your payment.', 'error');
      }
    );
  }
}
