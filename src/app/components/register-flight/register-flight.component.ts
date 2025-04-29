import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { VueloService } from '../../Services/vuelo.service';
import { ItinerarioService } from '../../Services/itinerario.service';
import { MisionService } from '../../Services/mision.service';
import { AvionService } from '../../Services/avion.service';
import { TripulantesService } from '../../Services/tripulantes.service'; 
import { Router } from '@angular/router';

@Component({
  selector: 'app-register-flight',
  templateUrl: './register-flight.component.html',
  styleUrls: ['./register-flight.component.scss']
})
export class RegisterFlightComponent implements OnInit {
  vueloForm!: FormGroup;
  itinerarioList: any[] = [];
  avionList: any[] = [];
  misionList: any[] = [];
  pilotosList: any[] = [];
  copilotosList: any[] = [];
  mecanicosList: any[] = [];
  tecnicoComList: any[] = [];
  duracionItinerario: number = 0;  
  horaLlegada: string = '';  

  constructor(
    private fb: FormBuilder,
    private vueloService: VueloService,
    private itinerarioService: ItinerarioService,
    private misionService: MisionService,
    private avionService: AvionService,
    private tripulantesService: TripulantesService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadAviones();
    this.loadMisiones();
    this.loadItinerarios();
    this.loadPilotos();
    this.loadCopilotos();
    this.loadMecanicos();
    this.loadTecnicosCom();
  }

  private initForm(): void {
    this.vueloForm = this.fb.group({
      fecha: ['', Validators.required],
      hora_salida: ['', Validators.required],
      hora_llegada: [{ value: '', disabled: true }],
      anticipo: ['', Validators.required],
      gasolina: ['', Validators.required],
      avionDTO: this.fb.group({ id: [null] }),
      misionDTO: this.fb.group({ id: [null] }),
      itinerarioDTO: this.fb.group({ id: [null] }),
      piloto: [null, Validators.required],
      copiloto: [null],
      mecanico: [null],
      tecnicoCom: [null],
    });
  }

  onItinerarioChange(): void {
    const itinerarioId = this.vueloForm.get('itinerarioDTO')?.value.id;
    if (itinerarioId) {
      this.itinerarioService.getById(itinerarioId).subscribe({
        next: (data: any) => {
          this.duracionItinerario = data.duracion;  
          this.updateHoraLlegada();
        },
        error: (err: any) => {
          console.error('Error cargando itinerario:', err);
        }
      });
    }
  }

  updateHoraLlegada(): void {
    const horaSalida = this.vueloForm.get('hora_salida')?.value;
    if (horaSalida && this.duracionItinerario) {
      const horaSalidaDate = new Date(`1970-01-01T${horaSalida}:00`);
      horaSalidaDate.setHours(horaSalidaDate.getHours() + this.duracionItinerario);

      const hours = String(horaSalidaDate.getHours()).padStart(2, '0');
      const minutes = String(horaSalidaDate.getMinutes()).padStart(2, '0');
      this.horaLlegada = `${hours}:${minutes}`;

      this.vueloForm.get('hora_llegada')?.setValue(this.horaLlegada);
    }
  }

  onHoraSalidaChange(): void {
    this.updateHoraLlegada();
  }

  get avionFormGroup(): FormGroup {
    return this.vueloForm.get('avionDTO') as FormGroup;
  }

  get misionesFormGroup(): FormGroup {
    return this.vueloForm.get('misionDTO') as FormGroup;
  }

  get itinerarioFormGroup(): FormGroup {
    return this.vueloForm.get('itinerarioDTO') as FormGroup;
  }

  createVuelo(): void {
    if (this.vueloForm.valid) {
      // Obtener ID del usuario logueado
      const currentUserId = Number(localStorage.getItem('tripulanteId'));
      
      // Obtener IDs de los tripulantes seleccionados
      const pilotoId = this.vueloForm.get('piloto')!.value; // Usar ! para indicar que no es null
      const copilotoId = this.vueloForm.get('copiloto')!.value;
      const mecanicoId = this.vueloForm.get('mecanico')!.value;
      const tecnicoComId = this.vueloForm.get('tecnicoCom')!.value;
  
      // Agrupar IDs únicos (incluyendo al usuario actual)
      const tripulanteIds = new Set<number>();
      if (currentUserId) tripulanteIds.add(currentUserId);
      if (pilotoId) tripulanteIds.add(pilotoId);
      if (copilotoId) tripulanteIds.add(copilotoId);
      if (mecanicoId) tripulanteIds.add(mecanicoId);
      if (tecnicoComId) tripulanteIds.add(tecnicoComId);
  
      // Construir el payload con tripulantesDTO
      const vueloData = {
        ...this.vueloForm.value,
        tripulantesDTO: Array.from(tripulanteIds).map(id => ({ id })) 
      };
  
      this.vueloService.createVuelo(vueloData).subscribe({
        next: () => {
          alert('¡Vuelo creado con éxito!');
          this.vueloForm.reset();
          this.router.navigate(['/flights']); 
        },
        error: (err) => {
          console.error('Error al crear el vuelo:', err);
          alert('No se pudo crear el vuelo');
        }
      });
    } else {
      alert('Por favor, completa todos los campos');
    }
  }

  
  goBack() {
    const tienePermisos = localStorage.getItem('permisos') === 'true';
  
    if (tienePermisos) {
      this.router.navigate(['/homePermisos']);
    } else {
      this.router.navigate(['/home']);
    }
  }
  

  private loadAviones(): void {
    this.avionService.getAll().subscribe({
      next: (data) => this.avionList = data,
      error: (err) => {
        console.error('Error cargando aviones:', err);
        alert('No se pudieron cargar los aviones');
      }
    });
  }

  private loadPilotos(): void {
  this.tripulantesService.getPilotos().subscribe({
    next: (data) => this.pilotosList = data,
    error: (err) => {
      console.error('Error cargando pilotos:', err);
      alert('No se pudieron cargar los pilotos');
    }
  });
}

private loadCopilotos(): void {
  this.tripulantesService.getCoPilotos().subscribe({
    next: (data) => this.copilotosList = data,
    error: (err) => {
      console.error('Error cargando copilotos:', err);
      alert('No se pudieron cargar los copilotos');
    }
  });
}

private loadMecanicos(): void {
  this.tripulantesService.getMecanicos().subscribe({
    next: (data) => this.mecanicosList = data,
    error: (err) => {
      console.error('Error cargando mecanicos:', err);
      alert('No se pudieron cargar los mecanicos');
    }
  });
}

private loadTecnicosCom(): void {
  this.tripulantesService.getTecnicosCom().subscribe({
    next: (data) => this.tecnicoComList = data,
    error: (err) => {
      console.error('Error cargando tecnicos de comunicaciones y navegación:', err);
      alert('No se pudieron cargar los tecnicos de comunicaciones y navegación');
    }
  });
}

  private loadMisiones(): void {
    this.misionService.getAll().subscribe({
      next: (data) => this.misionList = data,
      error: (err) => {
        console.error('Error cargando misiones:', err);
        alert('No se pudieron cargar las misiones');
      }
    });
  }

  private loadItinerarios(): void {
    this.itinerarioService.getAll().subscribe({
      next: (data) => this.itinerarioList = data,
      error: (err) => {
        console.error('Error cargando itinerarios:', err);
        alert('No se pudieron cargar los itinerarios');
      }
    });
  }
}
