import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Ubicacion } from '../model/ubicacion.model';

@Injectable({
  providedIn: 'root'
})
export class UbicacionService {
  private apiUrl = 'http://localhost:8000/api/ubicaciones';

  constructor(private http: HttpClient) {}

  getAll(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  getUbicacionesByItinerarioId(itinerarioId: number): Observable<Ubicacion[]> {
    return this.http.get<Ubicacion[]>(`${this.apiUrl}/itinerario/${itinerarioId}`);
  }
  // ubicacion.service.ts
  getUbicacionesByTripulanteId(tripulanteId: number): Observable<Ubicacion[]> {
    return this.http.get<Ubicacion[]>(`${this.apiUrl}/tripulante/${tripulanteId}`);
  }
}
