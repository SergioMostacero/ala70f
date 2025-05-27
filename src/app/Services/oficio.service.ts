import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Oficio } from '../model/oficio.model';

@Injectable({
  providedIn: 'root'
})
export class OficioService {
  private apiUrl = 'https://api.ala70tfg.com/api/oficios';
  private headers = new HttpHeaders({ 'Content-Type': 'application/json' });

  constructor(private http: HttpClient) { }
  /* Obtiene todas los oficios */
  getOficios(): Observable<Oficio[]> {return this.http.get<Oficio[]>(this.apiUrl);}
  /* Crear un oficio */
  createOficio(oficio: Oficio): Observable<Oficio> {return this.http.post<Oficio>(this.apiUrl, oficio, { headers: this.headers });}
  /* Actualiza un oficio */
  updateOficio(oficio: Oficio): Observable<Oficio> {const url = `${this.apiUrl}/${oficio.id}`;return this.http.put<Oficio>(url, oficio, { headers: this.headers });}
  /* Elimina un oficio */
  deleteOficio(id: number): Observable<any> {const url = `${this.apiUrl}/${id}`;return this.http.delete(url, { headers: this.headers });}
}