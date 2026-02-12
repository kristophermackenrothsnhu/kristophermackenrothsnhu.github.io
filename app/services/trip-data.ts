import { Inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Trip } from '../models/trip';
import { User } from '../models/user';
import { AuthResponse } from '../models/auth-response';
import { BROWSER_STORAGE } from '../storage';

@Injectable({
  providedIn: 'root',
})
export class TripDataService {

  baseUrl = 'http://localhost:3000/api';

  constructor(
    private http: HttpClient,
    @Inject(BROWSER_STORAGE) private storage: Storage
  ) {}

  /* =========================
     Trip Endpoints
     ========================= */

  // Automatically attach Bearer token from storage
  private getAuthHeaders(): HttpHeaders {
    const token = this.storage.getItem('travlr-token'); // match AuthenticationService
    return new HttpHeaders({
      'Authorization': token ? `Bearer ${token}` : ''
    });
  }

  getTrips(): Observable<Trip[]> {
    return this.http.get<Trip[]>(`${this.baseUrl}/trips`, {
      headers: this.getAuthHeaders()
    });
  }

  addTrip(formData: Trip): Observable<Trip> {
    return this.http.post<Trip>(`${this.baseUrl}/trips`, formData, {
      headers: this.getAuthHeaders()
    });
  }

  getTrip(tripCode: string): Observable<Trip[]> {
    return this.http.get<Trip[]>(`${this.baseUrl}/trips/${tripCode}`, {
      headers: this.getAuthHeaders()
    });
  }

  updateTrip(formData: Trip): Observable<Trip> {
    return this.http.put<Trip>(
      `${this.baseUrl}/trips/${formData.code}`,
      formData,
      { headers: this.getAuthHeaders() }
    );
  }

  /* =========================
     Authentication Endpoints
     ========================= */

  login(user: User, passwd: string): Observable<AuthResponse> {
    return this.handleAuthAPICall('login', user, passwd);
  }

  register(user: User, passwd: string): Observable<AuthResponse> {
    return this.handleAuthAPICall('register', user, passwd);
  }

  /* =========================
     Helper method
     ========================= */
  private handleAuthAPICall(
    endpoint: string,
    user: User,
    passwd: string
  ): Observable<AuthResponse> {
    const payload: any = {
      email: user.email,
      password: passwd
    };

    if (endpoint === 'register') {
      payload.name = user.name;
    }

    return this.http.post<AuthResponse>(
      `${this.baseUrl}/${endpoint}`,
      payload
    );
  }
}
