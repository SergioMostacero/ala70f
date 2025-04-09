import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Oficio } from '../model/oficio.model';

@Injectable({
  providedIn: 'root'
})
export class OficioService {
  private apiUrl = 'http://localhost:8000/api/oficios';

  constructor(private http: HttpClient) { }

  getOficios(): Observable<Oficio[]> {
    return this.http.get<Oficio[]>(this.apiUrl);
  }
}