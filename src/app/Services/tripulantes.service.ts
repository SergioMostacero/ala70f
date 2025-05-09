import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Tripulantes } from '../model/Tripulantes.model';

@Injectable({
  providedIn: 'root'
})
export class TripulantesService {
  private baseUrl = 'http://44.212.4.74:8080/api/tripulantes';
  private loggedInTripulante: Tripulantes | null = null;


  constructor(private http: HttpClient) {
    this.loadFromStorage();
  }

  createTripulantes(tripulantesData: Tripulantes): Observable<Tripulantes> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    const payload = {
      ...tripulantesData,
      grupoSanguineoDTO: { id: tripulantesData.grupoSanguineoDTO.id },
      rangoDTO: { id: tripulantesData.rangoDTO.id },
      oficioDTO: { id: tripulantesData.oficioDTO.id },
    }
    return this.http.post<Tripulantes>(this.baseUrl, payload, { headers });
  }
  
  getAll(): Observable<any[]> {
    return this.http.get<any[]>(this.baseUrl);
  }

  // login
  loginTripulantes(email: string, contrasena: string): Observable<Tripulantes> {
    return this.http.post<Tripulantes>(
      `${this.baseUrl}/login`,
      { email, contrasena }
    );
  }

  


  // Guardar usuario logueado
  setLoggedInUser(tripulante: Tripulantes): void {
    this.loggedInTripulante = tripulante;
    localStorage.setItem('tripulante', JSON.stringify(tripulante));
  }

  // Recuperar usuario logueado
  // tripulantes.service.ts
  getLoggedInUser(): Tripulantes | null {
    const raw = localStorage.getItem('usuarioLogeado');
    return raw ? JSON.parse(raw) as Tripulantes : null;
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
    return this.http.get<Tripulantes[]>(this.baseUrl);
  }

  getById(id: number): Observable<Tripulantes> {
    return this.http.get<Tripulantes>(`${this.baseUrl}/${id}`);
  }

  getPilotos(): Observable<Tripulantes[]> {
    return this.http.get<Tripulantes[]>(`${this.baseUrl}/pilotos`);
  }

  getCoPilotos(): Observable<Tripulantes[]> {
    return this.http.get<Tripulantes[]>(`${this.baseUrl}/copilotos`);
  }
  

  getMecanicos(): Observable<Tripulantes[]> {
    return this.http.get<Tripulantes[]>(`${this.baseUrl}/mecanicos`);
  }
  

  getTecnicosCom(): Observable<Tripulantes[]> {
    return this.http.get<Tripulantes[]>(`${this.baseUrl}/tecnicoscom`);
  }

  updateTripulante(id: number, tripulanteData: Tripulantes): Observable<Tripulantes> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const payload = {
      ...tripulanteData,
      grupoSanguineoDTO: { id: tripulanteData.grupoSanguineoDTO.id },
      rangoDTO:           { id: tripulanteData.rangoDTO.id },
      oficioDTO:          { id: tripulanteData.oficioDTO.id },
    };
    return this.http.put<Tripulantes>(
      `${this.baseUrl}/${id}`,
      payload,
      { headers }
    );
  }

  
  
}
