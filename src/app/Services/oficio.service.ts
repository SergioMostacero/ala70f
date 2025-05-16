import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Oficio } from '../model/oficio.model';

@Injectable({
  providedIn: 'root'
})
export class OficioService {
  private apiUrl = 'http://44.212.4.74:8080/api/oficios';
  private headers = new HttpHeaders({ 'Content-Type': 'application/json' });

  constructor(private http: HttpClient) { }

  getOficios(): Observable<Oficio[]> {
    return this.http.get<Oficio[]>(this.apiUrl);
  }
  createOficio(oficio: Oficio): Observable<Oficio> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<Oficio>(this.apiUrl, oficio, { headers });
  }

  updateOficio(oficio: Oficio): Observable<Oficio> {
    const url = `${this.apiUrl}/${oficio.id}`;
    return this.http.put<Oficio>(url, oficio, { headers: this.headers });
  }
}