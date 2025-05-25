import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Tripulantes } from '../model/Tripulantes.model';

@Injectable({
  providedIn: 'root'
})
export class TripulantesService {
  private baseUrl = 'http://localhost:8000/api/tripulantes';
  private loggedInTripulante: Tripulantes | null = null;

  constructor(private http: HttpClient) {
    this.loadFromStorage();
  }
  /* Crea tripulantes teniendo en cuenta todas las relaciones y tablas intermedias */
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
  /* Obtiene todos los tripulantes */
  getAll(): Observable<any[]> {return this.http.get<any[]>(this.baseUrl);}

  /* Controla el login */
  loginTripulantes(email: string, contrasena: string): Observable<Tripulantes> {return this.http.post<Tripulantes>(`${this.baseUrl}/login`,{ email, contrasena });}

  /* Actualiza el uisuario que acaba de hacer login para futuras gestiones */
  setLoggedInUser(tripulante: Tripulantes): void {
    this.loggedInTripulante = tripulante;localStorage.setItem('tripulante', JSON.stringify(tripulante));
  }

   /* Guarda el uisuario que acaba de hacer login para futuras gestiones */
  getLoggedInUser(): Tripulantes | null {
    const raw = localStorage.getItem('usuarioLogeado');return raw ? JSON.parse(raw) as Tripulantes : null;
  }

   /* Carga el uisuario que acaba de hacer login para futuras gestiones */
  private loadFromStorage(): void {
    const storedTripulante = localStorage.getItem('tripulante');
    if (storedTripulante) {
      this.loggedInTripulante = JSON.parse(storedTripulante);
    }
  }

   /* Guarda el usuario que acaba de hacer login */
  logout(): void {
    this.loggedInTripulante = null;
    localStorage.removeItem('tripulante');
  }
  /* Obtiene todos los tripulantes */
  getTripulantess(): Observable<Tripulantes[]> {return this.http.get<Tripulantes[]>(this.baseUrl);}
  
  /* Obtiene tripulante por id*/
  getById(id: number): Observable<Tripulantes> {return this.http.get<Tripulantes>(`${this.baseUrl}/${id}`);}

  /* Obtiene todos los tripulantes con rol piloto */
  getPilotos(): Observable<Tripulantes[]> {return this.http.get<Tripulantes[]>(`${this.baseUrl}/pilotos`);}

  /* Obtiene todos los tripulantes con rol copiloto */
  getCoPilotos(): Observable<Tripulantes[]> {return this.http.get<Tripulantes[]>(`${this.baseUrl}/copilotos`);}
  
  /* Obtiene todos los tripulantes con rol mecanico */
  getMecanicos(): Observable<Tripulantes[]> {return this.http.get<Tripulantes[]>(`${this.baseUrl}/mecanicos`);}
  
  /* Obtiene todos los tripulantes con rol Tecnico de comunicaciones*/
  getTecnicosCom(): Observable<Tripulantes[]> {return this.http.get<Tripulantes[]>(`${this.baseUrl}/tecnicoscom`);}

  /* Actualiza un tripulante con todas sus relaciones */
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
  /* Obtiene todos los tripulantes asigandos a un vuelo */
  getTripulantesByVuelo(vueloId: number) {return this.http.get<Tripulantes[]>(`http://localhost:8000/api/tripulantes/vuelo/${vueloId}`);}
  
  /* Comprueba si el email existe para saber si se esta intentadno crear un usuario con el mismo email */
  emailExists(email: string): Observable<boolean> {return this.http.get<boolean>(`${this.baseUrl}/exists`, { params: { email } });}

  
}
