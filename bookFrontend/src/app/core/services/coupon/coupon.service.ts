import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ICoupon } from 'src/app/core/interface/coupon.interface'; // Adjust path as needed

@Injectable({
  providedIn: 'root',
})
export class CouponService {
  private apiUrl = `/coupon`;

  constructor(private http: HttpClient) {}

  createCoupon(couponData: any): Observable<ICoupon> {
    return this.http.post<ICoupon>(this.apiUrl, couponData).pipe(
      catchError((error) => {
        console.error('Error creating coupon:', error);
        throw error;
      })
    );
  }

  getCouponByCode(code: string): Observable<ICoupon> {
    return this.http.get<ICoupon>(`${this.apiUrl}/${code}`).pipe(
      catchError((error) => {
        console.error('Error fetching coupon by code:', error);
        throw error;
      })
    );
  }

  getAllCoupons(): Observable<ICoupon[]> {
    return this.http.get<ICoupon[]>(this.apiUrl).pipe(
      catchError((error) => {
        console.error('Error fetching all coupons:', error);
        throw error;
      })
    );
  }

  updateCoupon(code: string, updateData: Partial<ICoupon>): Observable<ICoupon> {
    return this.http.put<ICoupon>(`${this.apiUrl}/${code}`, updateData).pipe(
      catchError((error) => {
        console.error('Error updating coupon:', error);
        throw error;
      })
    );
  }

  deleteCoupon(code: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${code}`).pipe(
      catchError((error) => {
        console.error('Error deleting coupon:', error);
        throw error;
      })
    );
  }
}
