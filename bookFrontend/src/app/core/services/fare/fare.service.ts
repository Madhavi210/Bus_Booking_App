import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class FareService {
  private apiUrl = '/fare';

  constructor(private http: HttpClient) {}

  // Get fare for a specific route
  getFareByRoute(routeId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${routeId}`).pipe(
      catchError((error) => {
        console.error('Error fetching fare by route:', error);
        throw error;
      })
    );
  }

  // Set fare for a specific route
  setFare(routeId: string, baseFarePerKm: number, governmentTaxPercentage: number): Observable<any> {
    return this.http.post<any>(this.apiUrl, { routeId, baseFarePerKm, governmentTaxPercentage }).pipe(
      catchError((error) => {
        console.error('Error setting fare:', error);
        throw error;
      })
    );
  }

  // Calculate fare based on distance and route
  calculateFare(distance: number, baseFarePerKm: number, governmentTaxPercentage: number): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/calculate-fare`, { distance, baseFarePerKm, governmentTaxPercentage }).pipe(
      catchError((error) => {
        console.error('Error calculating fare:', error);
        throw error;
      })
    );
  }

  // Calculate total fare including additional charges
  calculateTotalFare(distance: number, baseFarePerKm: number, governmentTaxPercentage: number, paymentMethod: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/calculate-total-fare`, { distance, baseFarePerKm, governmentTaxPercentage, paymentMethod }).pipe(
      catchError((error) => {
        console.error('Error calculating total fare:', error);
        throw error;
      })
    );
  }
}
