import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './authentication/login/login.component';
import { RegisterComponent } from './authentication/register/register.component';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';
import { HomeComponent } from './pages/home/home.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { NotfoundComponent } from './pages/notfound/notfound.component';
import { UserDetailComponent } from './pages/userdetail/userdetail.component';
import { EditUserComponent } from './pages/edit-user/edit-user.component';
import { RouteDetailComponent } from './pages/route-detail/route-detail.component';
import { BusDetailComponent } from './pages/bus-detail/bus-detail.component';
import { FareComponent } from './pages/fare-detail/fare-detail.component';
import { BusDataComponent } from './pages/bus-data/bus-data.component';
import { BookingFormComponent } from './pages/booking/booking.component';
import { AddRouteComponent } from './pages/add-route/add-route.component';
import { CouponComponent } from './pages/coupon/coupon.component';
import { AddBusComponent } from './pages/add-bus/add-bus.component';
import { AddFareComponent } from './pages/add-fare/add-fare.component';
// import { BookingFormComponent } from './pages/booking/booking.component';


const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'home', 
    component: HomeComponent, 
    canActivate: [authGuard] 
  },
  { path: 'home/busData/:id', 
    component: BusDataComponent, 
    canActivate: [authGuard] 
  },
  { path: 'home/book/:id', 
    component: BookingFormComponent, 
    canActivate: [authGuard] 
  },
  {
    path: 'admin',
    component: DashboardComponent,
    canActivate: [authGuard, roleGuard],
    data: { expectedRole: 'admin' },
  },
  {
    path: 'admin/addUser',
    component: EditUserComponent,
    canActivate: [authGuard, roleGuard],
    data: { expectedRole: 'admin' },
  },
  {
    path: 'admin/addRoute',
    component: AddRouteComponent,
    canActivate: [authGuard, roleGuard],
    data: { expectedRole: 'admin' },
  },
  {
    path: 'admin/addbus',
    component: AddBusComponent,
    canActivate: [authGuard, roleGuard],
    data: { expectedRole: 'admin' },
  },
  {
    path: 'admin/addfare',
    component: AddFareComponent,
    canActivate: [authGuard, roleGuard],
    data: { expectedRole: 'admin' },
  },
  {
    path: 'admin/edit-user/:id',
    component: EditUserComponent,
    canActivate: [authGuard, roleGuard],
    data: { expectedRole: 'admin' },
  },
  {
    path: 'admin/edit-route/:id',
    component: AddRouteComponent,
    canActivate: [authGuard, roleGuard],
    data: { expectedRole: 'admin' },
  },
  {
    path: 'admin/edit-bus/:id',
    component: AddBusComponent,
    canActivate: [authGuard, roleGuard],
    data: { expectedRole: 'admin' },
  },
  {
    path: 'admin/userList',
    component: UserDetailComponent,
    canActivate: [authGuard, roleGuard],
    data: { expectedRole: 'admin' },
  },
  {
    path: 'admin/routeList',
    component: RouteDetailComponent,
    canActivate: [authGuard, roleGuard],
    data: { expectedRole: 'admin' },
  },
  {
    path: 'admin/coupon',
    component: CouponComponent,
    canActivate: [authGuard, roleGuard],
    data: { expectedRole: 'admin' },
  },
  {
    path: 'admin/busList',
    component: BusDetailComponent,
    canActivate: [authGuard, roleGuard],
    data: { expectedRole: 'admin' },
  },
  {
    path: 'admin/fareList',
    component: FareComponent,
    canActivate: [authGuard, roleGuard],
    data: { expectedRole: 'admin' },
  },

  { path: 'not-found', component: NotfoundComponent },
  { path: '**', redirectTo: '/not-found' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
