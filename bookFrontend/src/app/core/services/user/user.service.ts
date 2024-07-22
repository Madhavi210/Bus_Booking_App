import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IUser } from 'src/app/core/interface/user.interface';
import { catchError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private url = `/user`;

  constructor(private http: HttpClient) {}

  createUser(formData: any): Observable<IUser> {
    return this.http.post<IUser>(`/user`, formData);
  }

  getUserById(userId: string): Observable<IUser> {
    return this.http.get<IUser>(`${this.url}/${userId}`);
  }

  getAllUsers(): Observable<{ users: IUser[]; totalUser: number }> {
    return this.http.get<{ users: IUser[]; totalUser: number }>(this.url);
  }

  updateUser(id: string, formData: FormData): Observable<IUser> {
    return this.http.put<IUser>(`${this.url}/${id}`, formData);
  }

  deleteUser(userId: string): Observable<void> {
    const url = `${this.url}/${userId}`;
    return this.http.delete<void>(url).pipe(
      catchError((error) => {
        console.error('Error deleting user:', error);
        throw error; 
      })
    );
  }
}