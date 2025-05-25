import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Medalla } from '../model/medalla.model';

@Injectable({
  providedIn: 'root'
})
export class MedallaService {
  private apiUrl = 'http://localhost:8000/api/medallas';

  constructor(private http: HttpClient) {}

  /** Obtiene todas las medallas disponibles */
  getAllMedallas(): Observable<Medalla[]> {return this.http.get<Medalla[]>(this.apiUrl);}

  /** Obtiene las medallas asignadas a un tripulante */
  getMedallasByTripulante(tripulanteId: number): Observable<Medalla[]> {return this.http.get<Medalla[]>(`${this.apiUrl}/tripulante/${tripulanteId}`);}

  /** Crea una nueva medalla */
  createMedalla(dto: Partial<Medalla>): Observable<Medalla> {return this.http.post<Medalla>(this.apiUrl, dto);}

  /** Actualiza los datos (nombre/descripcion) de una medalla existente */
  updateMedalla(id: number, dto: Partial<Medalla>): Observable<Medalla> {return this.http.put<Medalla>(`${this.apiUrl}/${id}`, dto);}

  /** Elimina una medalla */
  deleteMedalla(id: number): Observable<void> {return this.http.delete<void>(`${this.apiUrl}/${id}`);}

  /** Asigna una medalla a un tripulante */
  asignarMedalla(tripulanteId: number, medallaId: number): Observable<void> {return this.http.put<void>(`${this.apiUrl}/asignar-medalla/${tripulanteId}/${medallaId}`,{});}
}

