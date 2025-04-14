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
    this.router.navigate(['/create-oficio']); // Recuerda generar este componente
  }

  editarOficio() {
    this.router.navigate(['/edit-oficio']); // Recuerda generar este componente
  }

  volver() {
    this.router.navigate(['/homePermisos']);
  }
}
