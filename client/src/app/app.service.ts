import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AppService {
  API_HOST = 'http://localhost:5000';

  constructor(private httpClient: HttpClient) {}

  getData(date: string): Observable<any> {
    return this.httpClient.get<any>(`${this.API_HOST}/getData?date=${date}`);
  }
}
