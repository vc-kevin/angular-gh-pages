import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class HttpClientService {

  constructor(private httpClient: HttpClient) {}

  getJsonFile(path, options = {}): Observable<any> {
    return this.httpClient.get(path, options);
  }

  get(path, options = {}): Observable<any> {
    return this.httpClient.get(path, options);
  }

  post(path, body, options = {}): Observable<any> {
    return this.httpClient.post(path, body, options);
  }

  put(path, body, options = {}): Observable<any> {
    return this.httpClient.put(path, body, options);
  }

  delete(path, options = {}): Observable<any> {
    return this.httpClient.delete(path, options);
  }

}
