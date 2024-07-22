import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LoginService } from '../services/login/login.service';

@Injectable({
  providedIn: 'root'
})

export class roleGuard implements CanActivate {
  constructor(private loginService:LoginService, private router:Router){}

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    const expectedRole = next.data['expectedRole'] as string;
    if( this.loginService.getUserRole() !== expectedRole){
      this.router.navigate(['/login']);
      return false;
    }
    return true;
  }
}
