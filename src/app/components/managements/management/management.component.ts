import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { RouteEncoderService } from '../../../Services/route-encoder.service';

@Component({
  selector: 'app-management',
  templateUrl: './management.component.html',
  styleUrls: ['./management.component.scss']
})
export class ManagementComponent {

  constructor(
    private router: Router,
    private encoder: RouteEncoderService
  ) {}

  crearUsuario() {
    this.router.navigate([this.encoder.encode('register')]);
  }

  editarUsuario() {
    this.router.navigate([this.encoder.encode('edit-user')]);
  }

  crearOficio() {
    this.router.navigate([this.encoder.encode('create-job')]);
  }

  editarOficio() {
    this.router.navigate([this.encoder.encode('edit-job')]);
  }

  goToMedallas() {
    this.router.navigate([this.encoder.encode('controller-medallas')]);
  }

  crearItinerario() {
    this.router.navigate([this.encoder.encode('create-itinerary')]);
  }
  goBack(): void {
    const encoder = new RouteEncoderService();
    const tienePermisos = localStorage.getItem('permisos') === 'true';
    
    const ruta = tienePermisos 
      ? encoder.encode('homePermisos') 
      : encoder.encode('home');
  
    this.router.navigate([ruta]);
  }
}
