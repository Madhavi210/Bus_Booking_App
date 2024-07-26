import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ICoupon } from 'src/app/core/interface/coupon.interface';
import { CouponService } from 'src/app/core/services/coupon/coupon.service';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-coupon',
  templateUrl: './coupon.component.html',
  styleUrls: ['./coupon.component.scss']
})
export class CouponComponent {
  coupons: ICoupon[] = [];

  constructor(
    private couponService: CouponService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.couponService.getAllCoupons().subscribe(data => {
      this.coupons = data;
    });
  }

  goBack(){
    this.router.navigate(['/admin'])
  }


  deleteCoupon(couponId: string): void {
    console.log('View details for bus with ID:', couponId);
  
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        // Proceed with deletion if confirmed
        this.couponService.deleteCoupon(couponId).subscribe(
          response => {
            console.log(response);
            Swal.fire('Deleted!', 'Coupon has been deleted.', 'success');
          },
          error => {
            console.error('Error deleting Coupon:', error.message, error);
            Swal.fire('Error', 'There was an error deleting the Coupon.', 'error');
          }
        );
      }
    });
  }

}
