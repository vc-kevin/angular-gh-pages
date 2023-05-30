import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_ROUTES } from '@core/constants/app.constants';
import { OrderDetail, UserDetails } from '@core/models/user.model';
import { HttpClientService } from '@core/services/http-client.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(
    private httpClientService: HttpClientService
  ) { }

  verifyCardCode(cardCode: string): Observable<[] | null> {
    return this.httpClientService.post(`${API_ROUTES.cardCodeVerifyApi}`, { cardCode });
  }

  redeemCardCode(params: Partial<UserDetails>): Observable<OrderDetail> {
    return this.httpClientService.post(API_ROUTES.cardCodeRedeemApi, params);
  }
}
