import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { UsuarioService } from '../Services/usuario.service';
import { Usuario } from '../model/usuario.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],

})
export class HomeComponent implements OnInit {
  usuario: Usuario | null = null;
  isLoading = true;
  errorMessage: string | null = null;

  constructor(
    private router: Router,
    private usuarioService: UsuarioService
  ) {}

  ngOnInit(): void {
    this.usuario = this.usuarioService.getLoggedInUser();

    if (!this.usuario) {
      this.errorMessage = 'No hay usuario logueado. Redirigiendo...';
      setTimeout(() => {
        this.router.navigate(['/login']);
      }, 1500);
      return;
    }

    this.isLoading = false;
  }

  home() {
    this.router.navigate(['/register-flight']);
  }

  getNombreCompleto(): string {
    if (!this.usuario) return '';
    return `${this.usuario.apellido1} ${this.usuario.apellido2}, ${this.usuario.nombre}`;
  }

  getSafeRango(): string {
    return this.usuario?.rango?.nombre || 'No especificado';
  }

  getSafeDestino(): string {
    return this.usuario?.destino?.nombre || 'No especificado';
  }
}
