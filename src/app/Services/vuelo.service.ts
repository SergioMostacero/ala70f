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

  createVuelo(vueloData: Vuelo): Observable<Vuelo> {
    return this.http.post<Vuelo>(this.baseUrl, vueloData);
  }

  getAllVuelos(): Observable<Vuelo[]> {
    return this.http.get<Vuelo[]>(this.baseUrl);
  }
}
