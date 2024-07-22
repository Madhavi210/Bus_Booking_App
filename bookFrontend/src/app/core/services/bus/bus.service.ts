import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { IBus } from 'src/app/core/interface/bus.interface'; // Adjust path as needed

@Injectable({
  providedIn: 'root',
})
export class BusService {
  private apiUrl = `/bus`;

  constructor(private http: HttpClient) {}

  createBus(busData: any): Observable<IBus> {
    return this.http.post<IBus>(this.apiUrl, busData).pipe(
      catchError((error) => {
        console.error('Error creating bus:', error);
        throw error;
      })
    );
  }

  getBusById(busId: string): Observable<IBus> {
    return this.http.get<IBus>(`${this.apiUrl}/${busId}`).pipe(
      catchError((error) => {
        console.error('Error fetching bus by ID:', error);
        throw error;
      })
    );
  }

  getAllBuses(): Observable<{ buses: IBus[]; totalBuses: number }> {
    return this.http.get<{ buses: IBus[]; totalBuses: number }>(this.apiUrl).pipe(
      catchError((error) => {
        console.error('Error fetching all buses:', error);
        throw error;
      })
    );
  }

  updateBus(busId: string, updateData: Partial<IBus>): Observable<IBus> {
    return this.http.put<IBus>(`${this.apiUrl}/${busId}`, updateData).pipe(
      catchError((error) => {
        console.error('Error updating bus:', error);
        throw error;
      })
    );
  }

  deleteBus(busId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${busId}`).pipe(
      catchError((error) => {
        console.error('Error deleting bus:', error);
        throw error;
      })
    );
  }
}
