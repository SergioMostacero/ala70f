import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Mision } from '../model/mision.model';

@Injectable({
  providedIn: 'root'
})
export class MisionService {
  private apiUrl = 'http://localhost:8000/api/misiones';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Mision[]> {
    return this.http.get<Mision[]>(this.apiUrl);
  }

  getById(id: number): Observable<Mision> {
    return this.http.get<Mision>(`${this.apiUrl}/${id}`);
  }

  create(dto: Partial<Mision>): Observable<Mision> {
    return this.http.post<Mision>(this.apiUrl, dto);
  }

  update(id: number, dto: Partial<Mision>): Observable<Mision> {
    return this.http.put<Mision>(`${this.apiUrl}/${id}`, dto);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
