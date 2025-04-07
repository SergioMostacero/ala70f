import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { TripulantesService } from '../Services/tripulantes.service';
import { Tripulantes } from '../model/tripulantes.model';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  email: string = '';
  contrasena: string = '';
  showRegister: boolean = false;

  constructor(
    private tripulantesService: TripulantesService,
    private router: Router
  ) {}

  login() {
    this.tripulantesService.loginTripulantes(this.email, this.contrasena)
      .subscribe({
        next: (tripulante: Tripulantes) => {
          this.tripulantesService.setLoggedInUser(tripulante);
          this.router.navigate(['/home']);
        },
        error: (error) => {
          console.error('Error:', error);
          alert('Credenciales incorrectas');
        }
      });
  }

}