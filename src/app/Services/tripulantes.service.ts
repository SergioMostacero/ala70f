import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Tripulantes } from '../model/tripulantes.model';

@Injectable({
  providedIn: 'root'
})
export class TripulantesService {
  private apiUrl = 'http://localhost:8000/api/tripulantes';
  private loggedInTripulante: Tripulantes | null = null;

  constructor(private http: HttpClient) {
    this.loadFromStorage();
  }

  // Login
  loginTripulantes(email: string, contrasena: string): Observable<Tripulantes> {
    return this.http.post<Tripulantes>(
      `${this.apiUrl}/login`,
      { email, contrasena }
    );
  }

  // Guardar usuario logueado
  setLoggedInUser(tripulante: Tripulantes): void {
    this.loggedInTripulante = tripulante;
    localStorage.setItem('tripulante', JSON.stringify(tripulante));
  }

  // Recuperar usuario logueado
  getLoggedInUser(): Tripulantes | null {
    if (!this.loggedInTripulante) {
      this.loadFromStorage();
    }
    return this.loggedInTripulante;
  }

  // Cargar desde localStorage
  private loadFromStorage(): void {
    const storedTripulante = localStorage.getItem('tripulante');
    if (storedTripulante) {
      this.loggedInTripulante = JSON.parse(storedTripulante);
    }
  }

  // Logout
  logout(): void {
    this.loggedInTripulante = null;
    localStorage.removeItem('tripulante');
  }

  // Otros métodos
  getTripulantess(): Observable<Tripulantes[]> {
    return this.http.get<Tripulantes[]>(this.apiUrl);
  }

  createTripulantes(tripulante: Tripulantes): Observable<Tripulantes> {
    return this.http.post<Tripulantes>(this.apiUrl, tripulante);
  }
}
