import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { animate, style, transition, trigger } from '@angular/animations';
import { TripulantesService } from '../../Services/tripulantes.service';
import { Tripulantes } from '../../model/Tripulantes.model';
import { NotificationService } from 'src/app/utils/notification.service';
import { RouteEncoderService } from '../../Services/route-encoder.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  animations: [
    /* ---------------- Animaciones -------------- */
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
export class LoginComponent implements OnInit {
  email = '';
  contrasena = '';
  loading = true;
  showPassword = false;


  /* - Easter Egg -> 7 clics, animación de fuego */
  private logoClickCount = 0;
  fireEffect = false;

  constructor(
    private encoder: RouteEncoderService,
    private tripulantesService: TripulantesService,
    private router: Router,
    private notification: NotificationService
  ) {}

  ngOnInit(): void {
    setTimeout(() => (this.loading = false), 2000);
  }

  handleLogoClick(): void {
    this.logoClickCount++;

    if (this.logoClickCount === 7) {
      this.fireEffect = true;            
      setTimeout(() => {
        this.fireEffect = false;         
        this.logoClickCount = 0;         
      }, 4000);                          
    }
  }

  login(): void {
    this.tripulantesService
      .loginTripulantes(this.email, this.contrasena)
      .subscribe({
        next: (tripulante: Tripulantes) => {
          const userData = {
            id: tripulante.id,
            permisos: tripulante.permisos,
            nombre: tripulante.nombre,
            apellidos: tripulante.apellidos,
            email: tripulante.email,
            contrasena: tripulante.contrasena,
            antiguedad: tripulante.antiguedad,
            horas_totales: tripulante.horas_totales,
            grupo_sanguineo: tripulante.grupoSanguineoDTO,
            rango: tripulante.rangoDTO,
            oficio: tripulante.oficioDTO,
            medallas: tripulante.medallasDTO,
            vuelos: tripulante.vuelosDTO
          };

          localStorage.setItem('usuarioLogeado', JSON.stringify(userData));
          localStorage.setItem('permisos', String(tripulante.permisos));

          setTimeout(
            () => this.router.navigate([this.encoder.encode('homePermisos')]),
            500
          );
        },
        error: () =>
          this.notification.showMessage('Credenciales incorrectas', 'error')
      });
  }
}
