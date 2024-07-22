import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { IBooking } from 'src/app/core/interface/booking.interface'; // Adjust path as needed

@Injectable({
  providedIn: 'root',
})
export class BookingService {
  private apiUrl = `/book`;

  constructor(private http: HttpClient) {}

  createBooking(bookingData: any): Observable<IBooking> {
    return this.http.post<IBooking>(this.apiUrl, bookingData).pipe(
      catchError((error) => {
        console.error('Error creating booking:', error);
        throw error;
      })
    );
  }

  getBookingById(bookingId: string): Observable<IBooking> {
    return this.http.get<IBooking>(`${this.apiUrl}/${bookingId}`).pipe(
      catchError((error) => {
        console.error('Error fetching booking by ID:', error);
        throw error;
      })
    );
  }

  getAllBookings(): Observable<{ bookings: IBooking[] }> {
    return this.http.get<{ bookings: IBooking[] }>(this.apiUrl).pipe(
      catchError((error) => {
        console.error('Error fetching all bookings:', error);
        throw error;
      })
    );
  }

  updateBooking(bookingId: string, updateData: Partial<IBooking>): Observable<IBooking> {
    return this.http.put<IBooking>(`${this.apiUrl}/${bookingId}`, updateData).pipe(
      catchError((error) => {
        console.error('Error updating booking:', error);
        throw error;
      })
    );
  }

  deleteBooking(bookingId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${bookingId}`).pipe(
      catchError((error) => {
        console.error('Error deleting booking:', error);
        throw error;
      })
    );
  }

  getBookedSeats(busId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/booked-seats/${busId}`).pipe(
      catchError((error) => {
        console.error('Error fetching booked seats:', error);
        throw error;
      })
    );
  }
}
