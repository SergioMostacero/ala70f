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
    /* ---------------- Animaciones de entrada/salida -------------- */
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
  /* -------------------------- Datos ----------------------------- */
  email = '';
  contrasena = '';
  loading = true;

  /* ---------- Huevo de pascua: 7 clics = fuego ------------------ */
  private logoClickCount = 0;
  fireEffect = false;

  constructor(
    private encoder: RouteEncoderService,
    private tripulantesService: TripulantesService,
    private router: Router,
    private notification: NotificationService
  ) {}

  /* ---------- Ciclo de vida ------------------------------------- */
  ngOnInit(): void {
    /* simulamos carga 2 s */
    setTimeout(() => (this.loading = false), 2000);
  }

  /* ---------- Click en el logo ---------------------------------- */
  handleLogoClick(): void {
    this.logoClickCount++;

    if (this.logoClickCount === 7) {
      this.fireEffect = true;            // enciende el fuego
      setTimeout(() => {
        this.fireEffect = false;         // lo apaga
        this.logoClickCount = 0;         // reinicia el contador
      }, 4000);                          // dura 4 s
    }
  }

  /* ---------- Login --------------------------------------------- */
  login(): void {
    this.tripulantesService
      .loginTripulantes(this.email, this.contrasena)
      .subscribe({
        next: (tripulante: Tripulantes) => {
          /* guardamos lo necesario */
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

          /* redirige después de 0.5 s */
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
