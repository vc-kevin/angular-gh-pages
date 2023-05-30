import {
  HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { LoggerService } from '@core/services/logger.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  constructor(
  ) { }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(catchError((error: HttpErrorResponse) => {
      const err = new HttpErrorResponse({
        error: error.error,
        statusText: error.message,
        status: error.status
      })
      LoggerService.error(err);
      throw err;
    })
    )
  }

}
