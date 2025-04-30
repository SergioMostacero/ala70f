import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TripulantesService } from '../../Services/tripulantes.service';
import { Tripulantes } from '../../model/Tripulantes.model';
import { GrupoSanguineoService } from '../../Services/grupo-sanguineo.service';
import { OficioService } from '../../Services/oficio.service';
import { RangoService } from 'src/app/Services/rango.service';
import { NotificationService } from '../../utils/notification.service';
@Component({
  selector: 'app-homePermisos',
  templateUrl: './homePermisos.component.html',
  styleUrls: ['./homePermisos.component.scss'],
})
export class HomePermisosComponent implements OnInit {
  tripulante: Tripulantes | null = null;
  isLoading = true;
  errorMessage: string | null = null;

  constructor(
    private router: Router,
    private tripulantesService: TripulantesService,
    private grupoSanguineoService: GrupoSanguineoService,
    private rangoService: RangoService,
    private notification: NotificationService
  ) {}

  ngOnInit(): void {
    this.tripulante = this.tripulantesService.getLoggedInUser();
    if (!this.tripulante) {
      this.notification.showMessage('No hay tripulante logueado. Redirigiendo...', 'error');
      setTimeout(() => this.router.navigate(['/login']), 1500);
      return;
    }
    if (this.tripulante.grupoSanguineoDTO?.id) {
      this.grupoSanguineoService.getGrupoSanguineoById(this.tripulante.grupoSanguineoDTO.id)
        .subscribe(gs => {
          this.tripulante!.grupoSanguineoDTO = gs;
        });
    }

    // Cargar detalles del rango
    if (this.tripulante.rangoDTO?.id) {
      this.rangoService.getRangoById(this.tripulante.rangoDTO.id)
        .subscribe(rango => {
          this.tripulante!.rangoDTO = rango;
        });
    }

    this.isLoading = false;
  }

  
  irALogrosMedallas(): void {
    this.router.navigate(['/logros-medallas']);
  }
  irALogrosHistorial(): void {
    this.router.navigate(['/historial']);
  }


  getNombreCompleto(): string {
    return this.tripulante ? `${this.tripulante.nombre}` : '';
  }


  verGestion() {
    this.router.navigate(['/management']);
  }
  
  verVuelos() {
    this.router.navigate(['/flights']);
  }
  

  registrar() {
    this.router.navigate(['/register'], { 
      state: { 
        currentTripulante: this.tripulante 
      } 
    });
  }
}