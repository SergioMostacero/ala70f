import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Tripulantes } from '../model/Tripulantes.model';

@Injectable({
  providedIn: 'root',
})
export class TripulantesService {
  private apiUrl = 'http://localhost:8000/api/tripulantes';

  private loggedInUser: Tripulantes | null = null;

  constructor(private http: HttpClient) {}

  getTripulantess(): Observable<Tripulantes[]> {
    return this.http.get<Tripulantes[]>(this.apiUrl);
  }

  loginTripulantes(email: string, contrasena: string): Observable<Tripulantes> {
    return this.http.post<Tripulantes>(`${this.apiUrl}/login`, { email, contrasena });
  }

  setLoggedInUser(user: Tripulantes) {
    this.loggedInUser = user;
  }

  getLoggedInUser(): Tripulantes | null {
    return this.loggedInUser;
  }

  getTripulantes(id: number): Observable<Tripulantes> {
    return this.http.get<Tripulantes>(`${this.apiUrl}/${id}`);
  }
  createTripulantes(Tripulantes: Tripulantes): Observable<Tripulantes> {
    // POST a /api/Tripulantess con el body del Tripulantes
    return this.http.post<Tripulantes>(this.apiUrl, Tripulantes);
  }

}
