import { Component, OnInit } from '@angular/core';
import { TripulantesService } from '../../Services/tripulantes.service';
import { MedallaService } from '../../Services/medalla.service';
import { Tripulantes } from '../../model/Tripulantes.model';
import { Medalla } from '../../model/medalla.model';
import { Router } from '@angular/router';
import { RouteEncoderService } from '../../Services/route-encoder.service';

@Component({
  selector: 'app-logros-medallas',
  templateUrl: './logrosMedallas.component.html',
  styleUrls: ['./logrosMedallas.componet.scss']
})
export class LogrosMedallasComponent implements OnInit {
    tripulante: Tripulantes | null = null; 
    medallas: Medalla[] = [];
    todasMedallas: Medalla[] = [];

  constructor(
    private encoder: RouteEncoderService,
    private tripulantesService: TripulantesService,
    private medallaService: MedallaService,
    private router: Router
    
  ) { }

  ngOnInit(): void {
    this.loadTripulante();
    this.loadAllMedallas();
  }

  private loadTripulante(): void {
    this.tripulante = this.tripulantesService.getLoggedInUser();
  
    if (!this.tripulante) {
      this.router.navigate([this.encoder.encode('login')]);
      return;
    }
  
    if (this.tripulante.id) {
      this.medallaService.getMedallasByTripulante(this.tripulante.id)
        .subscribe(medallas => this.medallas = medallas);
    }
  }

  


  private loadAllMedallas(): void {
    this.medallaService.getAllMedallas()
      .subscribe(medallas => this.todasMedallas = medallas);
  }

  tieneMedalla(medallaId: number): boolean {
    return this.medallas.some(m => m.id === medallaId);
  }

  
  goBack(): void {
    this.router.navigate([ this.encoder.encode('homePermisos') ]);
  }
  
}