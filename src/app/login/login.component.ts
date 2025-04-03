import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { TripulantesService } from '../Services/tripulantes.service';
import { Tripulantes } from '../model/Tripulantes.model';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  email: string = '';
  contrasena: string = '';

  constructor(
    private tripulantesService: TripulantesService,
    private router: Router
  ) {}

  login() {
    this.tripulantesService.loginTripulantes(this.email, this.contrasena).subscribe({
      next: (tripulantes: Tripulantes) => {
        console.log('Tripulantes logueado:', tripulantes);
        this.tripulantesService.setLoggedInUser(tripulantes);

        this.router.navigate(['/home']);
      },
      error: (error) => {
        console.error('Error al iniciar sesión', error);
        alert('Credenciales incorrectas o tripulantes no encontrado');
      }
    });
  }

  goToRegister() {
    this.router.navigate(['/register-tripulante']);
  }
  
}
