import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-management',
  templateUrl: './management.component.html',
  styleUrls: ['./management.component.scss']
})
export class ManagementComponent {

  constructor(private router: Router) {}

  crearUsuario() {
    this.router.navigate(['/register']);
  }

  editarUsuario() {
    this.router.navigate(['/edit-user']);
  }

  crearOficio() {
    this.router.navigate(['/create-job']);
  }

  editarOficio() {
    this.router.navigate(['/edit-job']);
  }

  goToMedallas() {
    this.router.navigate(['/controller-medallas']);  
  }

  crearItinerario() {
    this.router.navigate(['/create-itinerary']);
  }
  goBack(): void {
    const tienePermisos = localStorage.getItem('permisos') === 'true';
    this.router.navigate([tienePermisos ? '/homePermisos' : '/home']);
  }
}
