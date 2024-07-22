import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LoginService } from './core/services/login/login.service';
import { Router , NavigationEnd, Event} from '@angular/router';
import { filter } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'quizFrontend';
  showElements: boolean = true;

  constructor(private router: Router, private activatedRoute: ActivatedRoute, private http: HttpClient, private loginService:LoginService) {}

  ngOnInit(): void {
  //  const role = localStorage.getItem('role');
  //   console.log(role, "Role");
   
  //   if (Array.isArray(role)) {
  //     this.permissionsService.loadPermissions(role);
  //   } else if (role) {
  //     this.permissionsService.loadPermissions([role]);
  //   } else {
  //     console.error('Role not found or invalid:', role);
  //   }

  this.router.events
  .pipe(
    filter((event: Event): event is NavigationEnd => event instanceof NavigationEnd)
  )
  .subscribe((event: NavigationEnd) => {
    const url = event.urlAfterRedirects;
    this.showElements = !(
      url === '/login' ||
      url === '/register' ||
      url === '/admin/addUser' ||
      url === '/admin/addRoute' ||
      url === '/admin/addbus' ||
      url === '/admin/addfare' ||
      url.match(/^\/admin\/edit-user\/\w+$/) || 
      url.match(/^\/admin\/edit-route\/\w+$/) || 
      url.match(/^\/admin\/edit-bus\/\w+$/) || 
      this.activatedRoute.snapshot.firstChild?.routeConfig?.path === 'not-found' // Check for Page Not Found route
    );
  });
    
  }
}
