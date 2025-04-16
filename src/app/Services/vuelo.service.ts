import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Vuelo } from '../model/vuelo.model';

@Injectable({
  providedIn: 'root'
})
export class VueloService {
  private baseUrl = 'http://localhost:8000/api/vuelos';

  constructor(private http: HttpClient) {}

  // Crear nuevo vuelo
  createVuelo(vueloData: Vuelo): Observable<Vuelo> {
    return this.http.post<Vuelo>(this.baseUrl, vueloData);
  }

  // Obtener todos los vuelos
  getAllVuelos(): Observable<Vuelo[]> {
    return this.http.get<Vuelo[]>(this.baseUrl);
  }

  getVuelosByUser(tripulanteId: number): Observable<Vuelo[]> {
    return this.http.get<Vuelo[]>(`${this.baseUrl}/user?tripulanteId=${tripulanteId}`);
  }
  
}
