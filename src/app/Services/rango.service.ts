import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Rango } from '../model/rango.model';

@Injectable({
  providedIn: 'root'
})
export class RangoService {
  private apiUrl = 'https://api.ala70tfg.com/api/rangos';

  constructor(private http: HttpClient) { }
  /* Obtiene todos los oficios */
  getRangos(): Observable<Rango[]> {return this.http.get<Rango[]>(this.apiUrl);}
  /* Obtiene oficios por id */
  getRangoById(id: number): Observable<Rango> {return this.http.get<Rango>(`${this.apiUrl}/${id}`);}
}
