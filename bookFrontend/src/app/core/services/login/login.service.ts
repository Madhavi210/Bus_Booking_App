import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, tap } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private token?: string | null = null;
  private userId?: string | null = null;
  private userRole?: string | null = null; 
  private isAuthenticated: boolean = false;
  
  private readonly apiUrl = '/user';

  constructor(private http: HttpClient, private router: Router) { }

  login(email: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, { email, password }).pipe(
      tap((response: { id: string, token: string, role:string }) => {
        if (response) {          
          this.token = response.token;
          this.userId = response.id;
          this.userRole = response.role;          
          localStorage.setItem('token', this.token);
          localStorage.setItem('userId', this.userId);
          localStorage.setItem('role', this.userRole);
          this.isAuthenticated = true;
        }
      })
    );
  }

  getToken(): string | null {
    return localStorage.getItem("token");
  }

  getUserId(): string | null {
    return localStorage.getItem('useId')
  }

  getUserRole(): string | null {
    return localStorage.getItem('role')
  }

  isLoggedIn(): boolean {
    const token = localStorage.getItem('token');
    return !!token;
  }

  logout(): Observable<void> {
    this.token = null;
    this.userId = null;
    this.isAuthenticated = false;
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('role');
    this.router.navigate(['/login']);
    return of(undefined); 
  }
}

