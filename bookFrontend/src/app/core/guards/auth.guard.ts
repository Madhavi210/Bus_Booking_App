
import { CanActivateFn, UrlTree } from '@angular/router';
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { LoginService } from '../services/login/login.service';

@Injectable({
  providedIn: 'root'
})

export class authGuard implements CanActivate {
  constructor(private loginService: LoginService, private router: Router){}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    if(this.loginService.isLoggedIn()) {
      console.log('redirecting');
      return true;
    }
    else{
      this.router.navigate(['/login']);
      console.log("not redirecting");
      return false;
    }

    
  }

}
