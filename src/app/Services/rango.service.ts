import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Rango } from '../model/rango.model';

@Injectable({
  providedIn: 'root'
})
export class RangoService {
  private apiUrl = 'http://44.212.4.74:8080/api/rangos';

  constructor(private http: HttpClient) { }

  getRangos(): Observable<Rango[]> {
    return this.http.get<Rango[]>(this.apiUrl);
  }

  getRangoById(id: number): Observable<Rango> {
    return this.http.get<Rango>(`${this.apiUrl}/${id}`);
  }
}
