import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Mision } from '../model/mision.model';// ajusta la ruta a tu DTO

@Injectable({
  providedIn: 'root'
})
export class MisionService {
  private apiUrl = 'http://localhost:8000/api/misiones';

  constructor(private http: HttpClient) {}

  /** Obtiene todas las misiones */
  getAll(): Observable<Mision[]> {
    return this.http.get<Mision[]>(this.apiUrl);
  }

  /** Obtiene una misión por su ID */
  getById(id: number): Observable<Mision> {
    return this.http.get<Mision>(`${this.apiUrl}/${id}`);
  }

  /** Crea una nueva misión */
  create(dto: Partial<Mision>): Observable<Mision> {
    return this.http.post<Mision>(this.apiUrl, dto);
  }

  /** Actualiza una misión existente */
  update(id: number, dto: Partial<Mision>): Observable<Mision> {
    return this.http.put<Mision>(`${this.apiUrl}/${id}`, dto);
  }

  /** Elimina una misión por su ID */
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
