import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Vuelo } from '../model/vuelo.model';

@Injectable({
  providedIn: 'root'
})
export class VueloService {
  private baseUrl = 'http://localhost:8000/api/vuelos';

  constructor(private http: HttpClient) {}

  createVuelo(vueloData: Vuelo): Observable<Vuelo> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
  
    const payload = {
      ...vueloData,
      avionDTO: { id: vueloData.avionDTO.id },
      misionDTO: { id: vueloData.misionDTO.id },
      itinerarioDTO: { id: vueloData.itinerarioDTO.id },
      tripulantesDTO: vueloData.tripulantesDTO
    };
  
    return this.http.post<Vuelo>(this.baseUrl, payload, { headers });
  }

  // Obtener todos los vuelos
  getAllVuelos(): Observable<Vuelo[]> {
    return this.http.get<Vuelo[]>(this.baseUrl);
  }

  getVuelosByUser(tripulanteId: number): Observable<Vuelo[]> {
    return this.http.get<Vuelo[]>(`${this.baseUrl}/user?tripulanteId=${tripulanteId}`);
  }
  
}
