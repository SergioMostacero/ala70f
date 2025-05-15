import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Vuelo } from '../model/vuelo.model';

export type VueloCreate = Omit<Vuelo, 'id'> & {
  avionDTO:      { id: number };   // obligatorios
  misionDTO:     { id: number };
  itinerarioDTO: { id: number };
};

@Injectable({
  providedIn: 'root'
})
export class VueloService {
  private baseUrl = 'http://localhost:8000/api/vuelos';

  constructor(private http: HttpClient) {}
  
  createVuelo(vueloData: VueloCreate): Observable<Vuelo> {
  const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

  const payload = {
    ...vueloData,
    avionDTO:      { id: vueloData.avionDTO.id },
    misionDTO:     { id: vueloData.misionDTO.id },
    itinerarioDTO: { id: vueloData.itinerarioDTO.id },
    tripulantesDTO: vueloData.tripulantesDTO
  };

  return this.http.post<Vuelo>(this.baseUrl, payload, { headers });
}


  updateVuelo(id: number, vueloData: Partial<Vuelo>): Observable<Vuelo> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.put<Vuelo>(`${this.baseUrl}/${id}`, vueloData, { headers });
  }

  deleteVuelo(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
  
  // Obtener todos los vuelos
  getAllVuelos(): Observable<Vuelo[]> {
    return this.http.get<Vuelo[]>(this.baseUrl);
  }
  
  getVueloById(id: number): Observable<Vuelo> {
  return this.http.get<Vuelo>(`${this.baseUrl}/${id}`);
}

  
  getVuelosByUser(tripulanteId: number): Observable<Vuelo[]> {
    return this.http.get<Vuelo[]>(`${this.baseUrl}/user?tripulanteId=${tripulanteId}`);
  }
  
}
