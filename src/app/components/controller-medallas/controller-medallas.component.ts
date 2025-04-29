import { Component, OnInit } from '@angular/core';
import { TripulantesService } from '../../Services/tripulantes.service';
import { MedallaService } from '../../Services/medalla.service';
import { Router } from '@angular/router';
import { Tripulantes } from '../../model/Tripulantes.model';

@Component({
  selector: 'app-controller-medallas',
  templateUrl: './controller-medallas.component.html',
  styleUrls: ['./controller-medallas.component.scss']
})
export class ControllerMedallasComponent implements OnInit {
  tripulantes: Tripulantes[] = [];  // Tipamos 'tripulantes' como un array de 'Tripulantes'
  medallasDisponibles: any[] = [];  // Puedes ajustar el tipo 'any' a un tipo más específico si lo prefieres
  selectedTripulanteId: number | null = null;
  selectedMedallaId: number | null = null;

  constructor(
    private tripulantesService: TripulantesService,
    private medallaService: MedallaService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadTripulantes();
    this.loadMedallas();
  }

  private loadTripulantes(): void {
    this.tripulantesService.getTripulantess().subscribe({
      next: (data: Tripulantes[]) => {  // Especificamos el tipo de 'data' como 'Tripulantes[]'
        this.tripulantes = data;
      },
      error: (err: any) => {  // Especificamos el tipo de 'err' como 'any', puedes mejorarlo si conoces la estructura del error
        console.error('Error cargando tripulantes', err);
      }
    });
  }

  private loadMedallas(): void {
    this.medallaService.getAllMedallas().subscribe({
      next: (data: any[]) => {  // Puedes mejorar el tipo de 'data' con un tipo más específico si tienes un modelo de medalla
        this.medallasDisponibles = data;
      },
      error: (err: any) => {
        console.error('Error cargando medallas', err);
      }
    });
  }

  asignarMedalla(): void {
    if (this.selectedTripulanteId && this.selectedMedallaId) {
      this.medallaService.asignarMedalla(this.selectedTripulanteId, this.selectedMedallaId).subscribe({
        next: () => {
          alert('Medalla asignada con éxito');
          // Podrías recargar los datos o hacer algo más
        },
        error: (err: any) => {
          console.error('Error al asignar medalla', err);
          alert('No se pudo asignar la medalla');
        }
      });
    } else {
      alert('Por favor, selecciona un tripulante y una medalla');
    }
  }
}
