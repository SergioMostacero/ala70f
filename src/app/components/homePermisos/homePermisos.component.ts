import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TripulantesService } from '../../Services/tripulantes.service';
import { Tripulantes } from '../../model/Tripulantes.model';
import { GrupoSanguineoService } from '../../Services/grupo-sanguineo.service';
import { RangoService } from 'src/app/Services/rango.service';
import { NotificationService } from '../../utils/notification.service';
import { RouteEncoderService } from '../../Services/route-encoder.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-homePermisos',
  templateUrl: './homePermisos.component.html',
  styleUrls: ['./homePermisos.component.scss'],
})
export class HomePermisosComponent implements OnInit {
  tripulante: Tripulantes | null = null;
  isLoading = true;
  errorMessage: string | null = null;


  tienePermisos = false;

  constructor(
    private encoder: RouteEncoderService,
    private router: Router,
    private tripulantesService: TripulantesService,
    private grupoSanguineoService: GrupoSanguineoService,
    private rangoService: RangoService,
    private notification: NotificationService
  ) {}

  ngOnInit(): void {
    const stub = this.tripulantesService.getLoggedInUser();

    if (!stub || stub.id == null) {
    Swal.fire({
      title: 'Redirigiendo...',
      text: 'No hay tripulante logueado, volviendo al login...',
      icon: 'warning',
      timer: 3000,
      timerProgressBar: true,
      showConfirmButton: false,
      customClass: { popup: 'dark' }
      });

      this.notification.showMessage(
        'No hay tripulante logueado. Redirigiendo…',
        'error'
      );
      setTimeout(() => {
        this.router.navigate([this.encoder.encode('login')]);
      }, 1500);
      return;
    }

    this.tripulantesService.getById(stub.id).subscribe({
      next: full => {
        this.tripulante = full;
        this.isLoading = false;

        this.tienePermisos =
          full.rangoDTO?.nombre === 'Administrador' ||
          (Array.isArray(full.permisos) && full.permisos.includes('GESTION')) ||
          full.permisos === true ||
          (full as any).esAdministrador === true;
      },
      error: () => {
        this.notification.showMessage(
          'No se pudo cargar datos de usuario',
          'error'
          
        );
        this.router.navigate([this.encoder.encode('login')]);
      }
    });
  }
  //ajustes y botones del home
  getNombreCompleto(): string {
    return this.tripulante ? `${this.tripulante.nombre}` : '';
  }

  verGestion()         { this.router.navigate([this.encoder.encode('management')]); }
  verVuelos()          { this.router.navigate([this.encoder.encode('flights')]); }
  irALogrosMedallas()  { this.router.navigate([this.encoder.encode('logros-medallas')]); }
  irALogrosHistorial() { this.router.navigate([this.encoder.encode('historial')]); }
  irADestinos()        { this.router.navigate([this.encoder.encode('destinos')]); }

  registrar(): void {
    this.router.navigate(
      [this.encoder.encode('register')],
      { state: { currentTripulante: this.tripulante } }
    );
  }
}