import { Injectable } from '@angular/core';
import { HttpClient , HttpParams} from '@angular/common/http';
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

  getAllBuses(page: number = 1, limit: number = 10): Observable<any> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());
    return this.http.get<any>(this.apiUrl, { params });
  }

  searchBuses(
    date: string, 
    startingStop: string, 
    endingStop: string, 
    page: number = 1, 
    limit: number = 10
  ): Observable<any> {
    const params = new HttpParams()
      .set('date', date)
      .set('startingStop', startingStop)
      .set('endingStop', endingStop)
      .set('page', page.toString())
      .set('limit', limit.toString());
    return this.http.get<any>(this.apiUrl, { params });
  }

  // getAllBuses(date?: string, startingStop?: string, endingStop?: string, page: number = 1, limit: number = 10): Observable<{ buses: IBus[], totalBuses: number }> {
  //   let params = new HttpParams()
  //     .set('page', page.toString())
  //     .set('limit', limit.toString());

  //   if (date) params = params.set('date', date);
  //   if (startingStop) params = params.set('startingStop', startingStop);
  //   if (endingStop) params = params.set('endingStop', endingStop);

  //   return this.http.get<{ buses: IBus[], totalBuses: number }>(this.apiUrl, { params }).pipe(
  //     catchError((error) => {
  //       console.error('Error fetching buses:', error);
  //       throw error;
  //     })
  //   );
  // }

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
