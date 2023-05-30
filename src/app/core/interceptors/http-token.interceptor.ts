import {
  HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from '@environment/environment';
import { LOCAL_STORAGE_CONSTANT } from '@core/constants/localstorage.constant';
import { LocalStorageService } from '@core/services/local-storage.service';

@Injectable()
export class HttpTokenInterceptor implements HttpInterceptor {

  constructor(
    private localStorageService: LocalStorageService
  ) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<void>> {
    const token = this.localStorageService.get(LOCAL_STORAGE_CONSTANT.LOGIN_TOKEN);
    if (token) {
      request = request.clone({
        setHeaders: {
          Authorization: token,
        }
      });
    }

    if (!request.url.includes('i18n')) {
      const requestUrl = `${environment.hostName}${environment.restAPI}${request.url}`;
      request = request.clone({
        url: requestUrl,
      });
    }

    return next.handle(request).pipe(map((event: HttpEvent<any>) => {
      if (event instanceof HttpResponse) {
        return event.clone({
          body: event.body.data
        });
      }
      return event;
    }));
  }
}
