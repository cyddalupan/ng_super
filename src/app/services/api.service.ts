import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = 'http://isuper.reviewcenterphil.com/api/';  // Your Slim API

  constructor(private http: HttpClient) {}

  login(credentials: { username: string; password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}login`, credentials);
  }

  getAgencies(): Observable<any> {
    return this.http.get(`${this.apiUrl}agencies`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });
  }
}