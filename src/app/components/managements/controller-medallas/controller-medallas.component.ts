import { Component, OnInit } from '@angular/core';
import { TripulantesService } from '../../../Services/tripulantes.service';
import { MedallaService } from '../../../Services/medalla.service';
import { Router } from '@angular/router';
import { Tripulantes } from '../../../model/Tripulantes.model';
import { NotificationService } from '../../../utils/notification.service';
import { RouteEncoderService } from '../../../Services/route-encoder.service';


@Component({
  selector: 'app-controller-medallas',
  templateUrl: './controller-medallas.component.html',
  styleUrls: ['./controller-medallas.component.scss']
})
export class ControllerMedallasComponent implements OnInit {
  tripulantes: Tripulantes[] = [];
  medallasDisponibles: any[] = [];
  selectedTripulanteId: number | null = null;
  selectedMedallaId: number | null = null;

  constructor(
    private encoder: RouteEncoderService,
    private tripulantesService: TripulantesService,
    private medallaService: MedallaService,
    private router: Router,
    private notification: NotificationService
  ) { }

  ngOnInit(): void {
    this.loadTripulantes();
    this.loadMedallas();
  }

  private loadTripulantes(): void {
    this.tripulantesService.getTripulantess().subscribe({
      next: (data: Tripulantes[]) => {
        this.tripulantes = data;
      },
      error: (err: any) => {
        const errorMessage = err.error?.message || 'Error al cargar la lista de tripulantes';
        this.notification.showMessage(`${errorMessage}`, 'error');
      }
    });
  }

  private loadMedallas(): void {
    this.medallaService.getAllMedallas().subscribe({
      next: (data: any[]) => {
        this.medallasDisponibles = data;
      },
      error: (err) => {
        const errorMessage = err.error?.message || 'Error al cargar el catálogo de medallas';
        this.notification.showMessage(`${errorMessage}`, 'error');
      }
    });
  }
  goBack(): void {
    this.router.navigate([ this.encoder.encode('management') ]);
  }
  asignarMedalla(): void {
    if (!this.selectedTripulanteId || !this.selectedMedallaId) {
      this.notification.showMessage('Debes seleccionar un tripulante y una medalla', 'error');
      return;
    }
  
    this.medallaService.asignarMedalla(this.selectedTripulanteId, this.selectedMedallaId)
      .subscribe({
        next: () => {
          this.notification.showMessage('Medalla asignada exitosamente', 'success');
          this.resetSelections();
        },
        error: (err) => {
          // Verificar el código de estado HTTP
          if (err.status === 409) {
            this.notification.showMessage('Este tripulante ya posee esta medalla', 'error');
          } else if (err.status === 200 || err.status === 201) {
            // Si el servidor responde con éxito, pero Angular lo interpreta como error
            this.notification.showMessage('Medalla asignada exitosamente', 'success');
            this.resetSelections();
          } else {
            const serverMessage = err.error?.message || 'Error inesperado al asignar la medalla';
            this.notification.showMessage(serverMessage, 'error');
          }
        }
      });
  }
  

  private resetSelections(): void {
    this.selectedTripulanteId = null;
    this.selectedMedallaId = null;
  }
}