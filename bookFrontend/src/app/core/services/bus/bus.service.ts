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

  createBus(busData: any): Observable<any> {
    return this.http.post<IBus>(this.apiUrl, busData)
  }

  getBusById(busId: string): Observable<IBus> {
    return this.http.get<IBus>(`${this.apiUrl}/${busId}`)
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


  updateBus(busId: string, updateData: Partial<IBus>): Observable<IBus> {
    return this.http.put<IBus>(`${this.apiUrl}/${busId}`, updateData)
  }

  deleteBus(busId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${busId}`)
  }
}
