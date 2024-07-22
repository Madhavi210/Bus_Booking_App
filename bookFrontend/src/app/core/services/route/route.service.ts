import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IRoute } from 'src/app/core/interface/route.interface';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class RouteService {
  private url = '/route';

  constructor(private http: HttpClient) {}

  // Create a new route
  createRoute(routeData: {  totalDistance: number; stations: Array<{ name: string; distanceFromPrevious: number }> }): Observable<IRoute> {
    return this.http.post<IRoute>(this.url, routeData).pipe(
      catchError((error) => {
        console.error('Error creating route:', error);
        throw error;
      })
    );
  }

  // Get route by ID
  getRouteById(routeId: string): Observable<IRoute> {
    return this.http.get<IRoute>(`${this.url}/${routeId}`).pipe(
      catchError((error) => {
        console.error('Error fetching route by ID:', error);
        throw error;
      })
    );
  }

  // Get all routes
  getAllRoutes(): Observable<{ routes: IRoute[]; totalRoutes: number }> {
    return this.http.get<{ routes: IRoute[]; totalRoutes: number }>(this.url).pipe(
      catchError((error) => {
        console.error('Error fetching all routes:', error);
        throw error;
      })
    );
  }

  // Update route by ID
  updateRoute(routeId: string, updateData: Partial<IRoute>): Observable<IRoute> {
    return this.http.put<IRoute>(`${this.url}/${routeId}`, updateData).pipe(
      catchError((error) => {
        console.error('Error updating route:', error);
        throw error;
      })
    );
  }

  // Delete route by ID
  deleteRoute(routeId: string): Observable<void> {
    return this.http.delete<void>(`${this.url}/${routeId}`).pipe(
      catchError((error) => {
        console.error('Error deleting route:', error);
        throw error;
      })
    );
  }
}
