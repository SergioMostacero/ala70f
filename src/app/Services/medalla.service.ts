import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Medalla } from '../model/medalla.model';

@Injectable({
  providedIn: 'root'
})
export class MedallaService {
  private apiUrl = 'http://localhost:8000/api/medallas';

  constructor(private http: HttpClient) { }

  getMedallasByTripulante(tripulanteId: number): Observable<Medalla[]> {
    return this.http.get<Medalla[]>(`${this.apiUrl}/tripulante/${tripulanteId}`);
  }

  getAllMedallas(): Observable<Medalla[]> {
    return this.http.get<Medalla[]>(this.apiUrl);
  }

    // Método para asignar medalla a un tripulante
  asignarMedalla(tripulanteId: number, medallaId: number): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/asignar-medalla/${tripulanteId}/${medallaId}`, {});
  }
}