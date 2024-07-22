import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './pages/home/home.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { NotfoundComponent } from './pages/notfound/notfound.component';
import { LoginComponent } from './authentication/login/login.component';
import { RegisterComponent } from './authentication/register/register.component';
import { SidebarComponent } from './layout/sidebar/sidebar.component';
import { FooterComponent } from './layout/footer/footer.component';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './core/interceptor/auth.interceptor';
import { ErrorHandlerInterceptor } from './core/interceptor/error-handler.interceptor';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { UserDetailComponent } from './pages/userdetail/userdetail.component';
import { EditUserComponent } from './pages/edit-user/edit-user.component';
import { AddRouteComponent } from './pages/add-route/add-route.component';
import { RouteDetailComponent } from './pages/route-detail/route-detail.component';
import { AddBusComponent } from './pages/add-bus/add-bus.component';
import { BusDetailComponent } from './pages/bus-detail/bus-detail.component';
import { FareComponent } from './pages/fare-detail/fare-detail.component';
import { BusDataComponent } from './pages/bus-data/bus-data.component';
import { BookingFormComponent } from './pages/booking/booking.component';
import { CouponComponent } from './pages/coupon/coupon.component';
import { AddFareComponent } from './pages/add-fare/add-fare.component';
import { SeatingArrangementComponent } from './pages/seating-arrangement/seating-arrangement.component';
// import { BookingFormComponentComponent } from './pages/booking-form-component/booking-form-component.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    DashboardComponent,
    LoginComponent,
    RegisterComponent,
    SidebarComponent,
    FooterComponent,
    EditUserComponent,
    NotfoundComponent,
    UserDetailComponent,
    AddRouteComponent,
    RouteDetailComponent,
    AddBusComponent,
    BusDetailComponent,
    FareComponent,
    BusDataComponent,
    BookingFormComponent,
    CouponComponent,
    AddFareComponent,
    SeatingArrangementComponent,
  ],
  imports: [
    BrowserModule,
    CommonModule,
    AppRoutingModule,
    NgbModalModule,
    NgbModule,
    ReactiveFormsModule,
    HttpClientModule,
    
  ],
  providers: [
    {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true},
    {provide: HTTP_INTERCEPTORS, useClass: ErrorHandlerInterceptor, multi: true},
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
