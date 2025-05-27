import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AvionService {
  private apiUrl = 'https://api.ala70tfg.com/api/aviones';

  constructor(private http: HttpClient) {}
  /* Obtiene todos los aviones */
  getAll():     Observable<any[]> { return this.http.get<any[]>(this.apiUrl); }
  /* Obtiene un avion por id */
  getById(id: number): Observable<any> { return this.http.get<any>(`${this.apiUrl}/${id}`); }
  /* Crea un avion */
  create(dto: any):   Observable<any> { return this.http.post<any>(this.apiUrl, dto); }
  /* Actualiza un avion */
  update(dto: any):   Observable<any> { return this.http.put<any>(`${this.apiUrl}/${dto.id}`, dto); }
  /* Elimina un avion*/
  delete(id: number): Observable<void> { return this.http.delete<void>(`${this.apiUrl}/${id}`); }


}
