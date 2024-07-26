import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { IBooking } from 'src/app/core/interface/booking.interface'; // Adjust path as needed
import { HttpErrorResponse } from '@angular/common/http';
@Injectable({
  providedIn: 'root',
})
export class BookingService {
  private apiUrl = `/book`;

  constructor(private http: HttpClient) {}

  createBooking(bookingData: any): Observable<IBooking> {
    return this.http.post<IBooking>('/book', bookingData)
  }

  getBookingById(bookingId: string): Observable<IBooking> {
    return this.http.get<IBooking>(`${this.apiUrl}/${bookingId}`)
  }

  getAllBookings(): Observable<{ bookings: IBooking[] }> {
    return this.http.get<{ bookings: IBooking[] }>(this.apiUrl)
  }

  updateBooking(bookingId: string, updateData: Partial<IBooking>): Observable<IBooking> {
    return this.http.put<IBooking>(`${this.apiUrl}/${bookingId}`, updateData)
  }

  deleteBooking(bookingId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${bookingId}`)
  }

  getBookedSeats(busId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/booked-seats/${busId}`)
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    console.error('An error occurred:', error);
    return throwError(error);
  }
}
