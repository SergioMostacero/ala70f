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

  //rutas de navegacion
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
  goToEditMedallas() {
    this.router.navigate([this.encoder.encode('medallas')]);
  }

  crearItinerario() {
    this.router.navigate([this.encoder.encode('create-itinerary')]);
  }

  goToPlanes() {
    this.router.navigate([this.encoder.encode('plane')]);
  }

  goToMisiones(){
    this.router.navigate([this.encoder.encode('missions')]);
  }

  goBack(): void {
    this.router.navigate([ this.encoder.encode('homePermisos') ]);
  }
}
