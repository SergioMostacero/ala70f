import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Rango } from '../model/rango.model';

@Injectable({
  providedIn: 'root'
})
export class RangoService {
  private apiUrl = 'http://localhost:8000/api/rangos';

  constructor(private http: HttpClient) { }

  getRangos(): Observable<Rango[]> {
    return this.http.get<Rango[]>(this.apiUrl);
  }
}
