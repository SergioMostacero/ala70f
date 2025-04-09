import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GrupoSanguineo } from '../model/grupo-sanguineo.model';

@Injectable({
  providedIn: 'root'
})
export class GrupoSanguineoService {
  private apiUrl = 'http://localhost:8000/api/grupoSanguineos';

  constructor(private http: HttpClient) { }

  getGruposSanguineos(): Observable<GrupoSanguineo[]> {
    return this.http.get<GrupoSanguineo[]>(this.apiUrl);
  }
}