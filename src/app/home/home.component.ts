import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TripulantesService } from '../Services/tripulantes.service';
import { Tripulantes } from '../model/Tripulantes.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],

})
export class HomeComponent implements OnInit {
  tripulantes: Tripulantes | null = null;
  isLoading = true;
  errorMessage: string | null = null;

  constructor(
    private router: Router,
    private tripulantesService: TripulantesService
  ) {}

  ngOnInit(): void {
    this.tripulantes = this.tripulantesService.getLoggedInUser();

    if (!this.tripulantes) {
      this.errorMessage = 'No hay tripulantes logueado. Redirigiendo...';
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
    if (!this.tripulantes) return '';
    return `${this.tripulantes.apellidos}, ${this.tripulantes.nombre}`;
  }

  getSafeRango(): string {
    return this.tripulantes?.rango?.nombre || 'No especificado';
  }

}
