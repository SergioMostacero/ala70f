import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Vuelo } from '../model/vuelo.model'; // Ajusta el path según tu estructura

@Injectable({
  providedIn: 'root'
})
export class VueloService {
  private baseUrl = 'http://localhost:8080/api/vuelos';

  constructor(private http: HttpClient) {}

  createVuelo(vueloData: Vuelo): Observable<Vuelo> {
    return this.http.post<Vuelo>(this.baseUrl, vueloData);
  }

  // Otros métodos si lo necesitas...
}
