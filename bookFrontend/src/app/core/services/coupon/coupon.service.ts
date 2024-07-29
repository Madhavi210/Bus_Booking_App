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
    return this.http.post<ICoupon>(this.apiUrl, couponData)
  }

  getCouponByCode(code: string): Observable<ICoupon> {
    return this.http.get<ICoupon>(`${this.apiUrl}/${code}`)
  }

  getAllCoupons(): Observable<ICoupon[]> {
    return this.http.get<ICoupon[]>(this.apiUrl)
  }

  updateCoupon(code: string, updateData: Partial<ICoupon>): Observable<ICoupon> {
    return this.http.put<ICoupon>(`${this.apiUrl}/${code}`, updateData)
  }

  deleteCoupon(code: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${code}`)
  }

  applyCoupon(code: string): Observable<{ success: boolean; discount: number }> {
    return this.http.post<{ success: boolean; discount: number }>(`${this.apiUrl}/${code}`, {});
  }

}
