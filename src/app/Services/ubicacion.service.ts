import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Ubicacion } from '../model/ubicacion.model';

@Injectable({
  providedIn: 'root'
})
export class UbicacionService {
  private apiUrl = 'https://api.ala70tfg.com/api/ubicaciones';

  constructor(private http: HttpClient) {}

  /* Obtiene todas las ubicaciones */
  getAll(): Observable<any[]> {return this.http.get<any[]>(this.apiUrl);}

  /* Obtiene la ubicacion por id*/
  getUbicacionesByItinerarioId(itinerarioId: number): Observable<Ubicacion[]> {return this.http.get<Ubicacion[]>(`${this.apiUrl}/itinerario/${itinerarioId}`);}

  /* Obtiene la ubicacion por id del tripulante */
  getUbicacionesByTripulanteId(tripulanteId: number): Observable<Ubicacion[]> {return this.http.get<Ubicacion[]>(`${this.apiUrl}/tripulante/${tripulanteId}`);}
}
