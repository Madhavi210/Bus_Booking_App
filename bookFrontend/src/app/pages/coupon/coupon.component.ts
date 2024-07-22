import { Component, OnInit } from '@angular/core';
import { CouponService } from 'src/app/core/services/coupon/coupon.service';
@Component({
  selector: 'app-coupon',
  templateUrl: './coupon.component.html',
  styleUrls: ['./coupon.component.scss']
})
export class CouponComponent {
  coupons: any[] = [];

  constructor(private couponService: CouponService) {}

  ngOnInit(): void {
    this.couponService.getAllCoupons().subscribe(data => {
      this.coupons = data;
    });
  }
}
