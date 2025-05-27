import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Mision } from '../model/mision.model';

@Injectable({
  providedIn: 'root'
})
export class MisionService {
  private apiUrl = 'https://api.ala70tfg.com/api/misiones';

  constructor(private http: HttpClient) {}
  /* Obtiene todas las misiones */
  getAll(): Observable<Mision[]> {return this.http.get<Mision[]>(this.apiUrl);}
  /* Obtiene mision por id */
  getById(id: number): Observable<Mision> {return this.http.get<Mision>(`${this.apiUrl}/${id}`);}
  /* Crea una mision*/
  create(dto: Partial<Mision>): Observable<Mision> {return this.http.post<Mision>(this.apiUrl, dto);}
  /* Actualiza una mision */
  update(id: number, dto: Partial<Mision>): Observable<Mision> {return this.http.put<Mision>(`${this.apiUrl}/${id}`, dto);}
  /* Borra una mision */
  delete(id: number): Observable<void> {return this.http.delete<void>(`${this.apiUrl}/${id}`);}
}
