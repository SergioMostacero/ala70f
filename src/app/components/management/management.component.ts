import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AppComponent } from 'src/app/app.component';

@Component({
  selector: 'app-management',
  templateUrl: './management.component.html',
  styleUrls: ['./management.component.scss']
})
export class ManagementComponent {

  constructor(
    private router: Router
  ) {}

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

  
  goBack() {
    const tienePermisos = localStorage.getItem('permisos') === 'true';
  
    if (tienePermisos) {
      this.router.navigate(['/homePermisos']);
    } else {
      this.router.navigate(['/home']);
    }
  }
  
  
}
