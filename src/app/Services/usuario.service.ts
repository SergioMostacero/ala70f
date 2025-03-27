import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Usuario } from '../model/usuario.model';

@Injectable({
  providedIn: 'root',
})
export class UsuarioService {
  //private apiUrl = 'http://localhost:8000/api/usuarios';
  private apiUrl = 'http://localhost:5432/api/usuarios';

  private loggedInUser: Usuario | null = null;

  constructor(private http: HttpClient) {}

  getUsuarios(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(this.apiUrl);
  }

  loginUsuario(email: string, password: string): Observable<Usuario> {
    return this.http.post<Usuario>(`${this.apiUrl}/login`, { email, password });
  }

  setLoggedInUser(user: Usuario) {
    this.loggedInUser = user;
  }

  getLoggedInUser(): Usuario | null {
    return this.loggedInUser;
  }

  getUsuario(id: number): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.apiUrl}/${id}`);
  }
  createUsuario(usuario: Usuario): Observable<Usuario> {
    // POST a /api/usuarios con el body del usuario
    return this.http.post<Usuario>(this.apiUrl, usuario);
  }

}
