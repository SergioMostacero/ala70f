import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// Example interface if you want typed data
export interface FlightData {
  flightDate: string;
  merchandise: string;
  // ...
  crewMembers: { name: string; rank: string }[];
}

@Injectable({
  providedIn: 'root'
})
export class FlightService {
  private baseUrl = 'http://localhost:8080/api/vuelos'; // adapt to your backend

  constructor(private http: HttpClient) {}

  // POST /api/vuelos
  createFlight(flightData: FlightData): Observable<any> {
    return this.http.post<any>(this.baseUrl, flightData);
  }


}
