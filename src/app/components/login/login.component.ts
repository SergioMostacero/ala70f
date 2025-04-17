import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { TripulantesService } from '../../Services/tripulantes.service';
import { Tripulantes } from '../../model/Tripulantes.model';
import { animate, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  animations: [
    trigger('routeAnimations', [
      transition('* => *', [
        style({ opacity: 0 }),
        animate('300ms ease-out', style({ opacity: 1 }))
      ])
    ])
  ]
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
          localStorage.setItem('tripulanteId', tripulante.id?.toString() || '');
          localStorage.setItem('permisos', tripulante.permisos ? 'true' : 'false');
          this.tripulantesService.setLoggedInUser(tripulante);

          // Redirigir dependiendo del permiso
          if (tripulante.permisos === true) {
            this.router.navigate(['/homePermisos']);
          } else {
            this.router.navigate(['/home']);
          }
        },
        error: (error) => {
          console.error('Error:', error);
          alert('Credenciales incorrectas');
        }
      });
  }
  

}