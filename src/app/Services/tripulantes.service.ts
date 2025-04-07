import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Tripulantes } from '../model/tripulantes.model';

@Injectable({
  providedIn: 'root'
})
export class TripulantesService {
  private apiUrl = 'http://localhost:8000/api/tripulantes';
  private loggedInTripulante: Tripulantes | null = null;

  constructor(private http: HttpClient) {}

  loginTripulantes(email: string, contrasena: string): Observable<Tripulantes> {
    return this.http.post<Tripulantes>(
      `${this.apiUrl}/login`, 
      { email, contrasena } 
    );
  }
  
  setLoggedInUser(tripulante: Tripulantes): void {
    this.loggedInTripulante = tripulante;
    localStorage.setItem('tripulante', JSON.stringify(tripulante));
  }

  getLoggedInUser(): Tripulantes | null {
    return this.loggedInTripulante;
  }

  logout(): void {
    this.loggedInTripulante = null;
    localStorage.removeItem('tripulante');
  }

  // Resto de métodos permanecen igual
  getTripulantess(): Observable<Tripulantes[]> {
    return this.http.get<Tripulantes[]>(this.apiUrl);
  }

  createTripulantes(tripulante: Tripulantes): Observable<Tripulantes> {
    return this.http.post<Tripulantes>(this.apiUrl, tripulante); // URL correcta
  }
}

