import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TicketService {
  private apiUrl = `/ticket`;

  constructor(private http: HttpClient) { }

  createTicket(ticketData: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, ticketData);
  }

  getTicket(bookingId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${bookingId}`);
  }
}
