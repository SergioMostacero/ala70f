import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ItinerarioService {
  private apiUrl = 'http://localhost:8000/api/itinerarios';

  constructor(private http: HttpClient) {}

  getAll(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  getById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  create(itinerario: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, itinerario);
  }

  update(id: number, itinerario: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, itinerario);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
