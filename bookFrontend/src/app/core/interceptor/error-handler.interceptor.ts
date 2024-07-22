import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable , throwError} from 'rxjs';
import { catchError } from 'rxjs';
import Swal from 'sweetalert2';

@Injectable()
export class ErrorHandlerInterceptor implements HttpInterceptor {

  constructor() {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        let errorMessage = 'unknown error occured!';
        if(error.error instanceof ErrorEvent){
          errorMessage = `client side Error: ${error.error.message}`
        } else {
          // Server-side errors
          switch (error.status) {
            case 0:
              errorMessage = 'No connection. Please check your internet.';
              break;
            case 400:
              errorMessage = 'Bad request. Please check the input data.';
              break;
            case 401:
              errorMessage = 'Unauthorized. Please log in again.';
              break;
            case 403:
              errorMessage = 'Forbidden. You do not have the required permissions.';
              break;
            case 404:
              errorMessage = 'Not found. The requested resource was not found.';
              break;
            case 409:
              errorMessage = 'Data already exists. Please use a different email.';
              break;
            case 500:
              errorMessage = 'Internal server error. Please try again later.';
              break;
            case 503:
              errorMessage = 'Service unavailable. Please try again later.';
              break;
            default:
              errorMessage = `Server-side error: Code ${error.status}\nMessage: ${error.message}`;
              break;
          }
        }

        Swal.fire({
          icon:'error',
          title: 'Ooops...',
          text: errorMessage 
        });
        return throwError(errorMessage)
      })
    )
  }
}