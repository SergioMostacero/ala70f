import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { TripulantesService } from '../../Services/tripulantes.service';
import { Tripulantes } from '../../model/Tripulantes.model';
import { animate, style, transition, trigger } from '@angular/animations';
import { NotificationService } from 'src/app/utils/notification.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  animations: [
    trigger('fadeSlide', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('600ms cubic-bezier(0.23, 1, 0.32, 1)', 
          style({ opacity: 1, transform: 'translateY(0)' })
        )
      ]),
      transition(':leave', [
        animate('500ms cubic-bezier(0.23, 1, 0.32, 1)', 
          style({ opacity: 0, transform: 'translateY(-20px)' })
        )
      ])
    ]),
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
  loading: boolean = true;

  constructor(
    private tripulantesService: TripulantesService,
    private router: Router,
    private notification: NotificationService
  ) {}

  ngOnInit() {
    setTimeout(() => {
      this.loading = false;
    }, 2000);
  }
  
  // Modificar el éxito del login
login() {
  this.tripulantesService.loginTripulantes(this.email, this.contrasena)
      .subscribe({
          next: (tripulante: Tripulantes) => {
              // Guardar todos los datos necesarios
              const userData = {
                  idTripulante: tripulante.id,
                  permisos: tripulante.permisos,
                  nombre: tripulante.nombre
              };
              
              localStorage.setItem('usuarioLogeado', JSON.stringify(userData));
              
              // Redirección después de 500ms para asegurar persistencia
              setTimeout(() => {
                  if (tripulante.permisos) {
                      this.router.navigate(['/homePermisos']);
                  } else {
                      this.router.navigate(['/home']);
                  }
              }, 500);
          },
          error: (error) => {
              this.notification.showMessage('Credenciales incorrectas', 'error');
          }
      });
}
}