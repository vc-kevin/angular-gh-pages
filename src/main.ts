import { registerLocaleData } from '@angular/common';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import localeDe from '@angular/common/locales/de';
import localeDeCH from '@angular/common/locales/de-CH';
import { importProvidersFrom, LOCALE_ID } from '@angular/core';
import { bootstrapApplication, BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { ErrorInterceptor } from '@core/interceptors/error.interceptor';
import { HttpTokenInterceptor } from '@core/interceptors/http-token.interceptor';
import { CardsWidgetComponent } from '@app/cp-cards-widget.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { Observable, of } from 'rxjs';
import { de_CH } from 'assets/i18n/de_CH';
import { en_US } from 'assets/i18n/en_US';

export class createTranslateLoader implements TranslateLoader  {
  getTranslation(lang: string): Observable<any> {
    switch(lang) {
      case 'de_CH': return of(de_CH);
      case 'en_US': return of(en_US);
      default: return of(de_CH);
    }
  }
}

registerLocaleData(localeDe, 'de');
registerLocaleData(localeDeCH, 'de_CH');

bootstrapApplication(CardsWidgetComponent,
  {
    providers: [
      importProvidersFrom(
        BrowserModule,
        BrowserAnimationsModule,
        HttpClientModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: createTranslateLoader,
          }
        }),
        MatSnackBarModule
      ),
      { provide: HTTP_INTERCEPTORS, useClass: HttpTokenInterceptor, multi: true },
      { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
      { provide: 'LOCALSTORAGE', useFactory: getLocalStorage },
      {
        provide: LOCALE_ID, useValue: 'de-ch'
      }
    ], 
  }).catch(err => console.log(err));

export function getLocalStorage() {
  return typeof window !== 'undefined' ? window.localStorage : null;
}