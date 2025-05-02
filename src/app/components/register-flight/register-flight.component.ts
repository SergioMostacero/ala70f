import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { VueloService } from '../../Services/vuelo.service';
import { ItinerarioService } from '../../Services/itinerario.service';
import { MisionService } from '../../Services/mision.service';
import { AvionService } from '../../Services/avion.service';
import { TripulantesService } from '../../Services/tripulantes.service';
import { NotificationService } from '../../utils/notification.service';
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
    private notification: NotificationService,
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
      fecha_salida: ['', Validators.required],
      hora_salida: ['', [
        Validators.required,
        Validators.pattern(/^([01]\d|2[0-3]):([0-5]\d)$/)
      ]],
      hora_llegada: [{ value: '', disabled: true }, [
        Validators.pattern(/^([01]\d|2[0-3]):([0-5]\d)$/)
      ]],
      fecha_llegada: ['', Validators.required],
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
        error: () => {
          this.notification.showMessage('Error cargando itinerario', 'error');
        }
      });
    }
  }

  updateHoraLlegada(): void {
    const horaSalida = this.vueloForm.get('hora_salida')?.value;
    const fechaSalida = this.vueloForm.get('fecha_salida')?.value;
    const duracion = this.duracionItinerario; // ahora será un string tipo "HH:mm:ss"
  
    if (horaSalida && duracion && fechaSalida) {
      const [durH, durM] = duracion.toString().split(':').map(Number);
      const salidaDate = new Date(`${fechaSalida}T${horaSalida}:00`);
      salidaDate.setHours(salidaDate.getHours() + durH);
      salidaDate.setMinutes(salidaDate.getMinutes() + durM);
  
      const hours = String(salidaDate.getHours()).padStart(2, '0');
      const minutes = String(salidaDate.getMinutes()).padStart(2, '0');
      this.horaLlegada = `${hours}:${minutes}`;
      this.vueloForm.get('hora_llegada')?.setValue(this.horaLlegada);
  
      const fechaLlegadaStr = salidaDate.toISOString().split('T')[0];
      this.vueloForm.get('fecha_llegada')?.setValue(fechaLlegadaStr);
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
    const currentUserId = Number(localStorage.getItem('tripulanteId'));
    const pilotoId = this.vueloForm.get('piloto')!.value;
    const copilotoId = this.vueloForm.get('copiloto')!.value;
    const mecanicoId = this.vueloForm.get('mecanico')!.value;
    const tecnicoComId = this.vueloForm.get('tecnicoCom')!.value;

    const tripulanteIds = new Set<number>();
    if (currentUserId) tripulanteIds.add(currentUserId);
    if (pilotoId) tripulanteIds.add(pilotoId);
    if (copilotoId) tripulanteIds.add(copilotoId);
    if (mecanicoId) tripulanteIds.add(mecanicoId);
    if (tecnicoComId) tripulanteIds.add(tecnicoComId);

    this.vueloForm.get('fecha_llegada')?.enable();

    const vueloData = {
      ...this.vueloForm.getRawValue(),
      tripulantesDTO: Array.from(tripulanteIds).map(id => ({ id }))
    };

    this.vueloForm.get('fecha_llegada')?.disable();

    this.vueloService.createVuelo(vueloData).subscribe({
      next: () => {
        alert('¡Vuelo creado con éxito!');
        this.vueloForm.reset();
        this.router.navigate(['/flights']);
      },
      error: () => {
        this.notification.showMessage('No se pudo crear el vuelo', 'error');
      }
    });
  } else {
    alert('Por favor, completa todos los campos');
  }
}


  goBack(): void {
    const tienePermisos = localStorage.getItem('permisos') === 'true';
    this.router.navigate([tienePermisos ? '/homePermisos' : '/home']);
  }

  // Cargas de datos
  private loadAviones(): void {
    this.avionService.getAll().subscribe({
      next: (data) => this.avionList = data,
      error: () => this.notification.showMessage('No se pudieron cargar los aviones', 'error')
    });
  }

  private loadPilotos(): void {
    this.tripulantesService.getPilotos().subscribe({
      next: (data) => this.pilotosList = data,
      error: () => this.notification.showMessage('No se pudieron cargar los pilotos', 'error')
    });
  }

  private loadCopilotos(): void {
    this.tripulantesService.getCoPilotos().subscribe({
      next: (data) => this.copilotosList = data,
      error: () => this.notification.showMessage('No se pudieron cargar los copilotos', 'error')
    });
  }

  private loadMecanicos(): void {
    this.tripulantesService.getMecanicos().subscribe({
      next: (data) => this.mecanicosList = data,
      error: () => this.notification.showMessage('No se pudieron cargar los mecánicos', 'error')
    });
  }

  private loadTecnicosCom(): void {
    this.tripulantesService.getTecnicosCom().subscribe({
      next: (data) => this.tecnicoComList = data,
      error: () => this.notification.showMessage('No se pudieron cargar los técnicos', 'error')
    });
  }

  private loadMisiones(): void {
    this.misionService.getAll().subscribe({
      next: (data) => this.misionList = data,
      error: () => this.notification.showMessage('No se pudieron cargar las misiones', 'error')
    });
  }

  private loadItinerarios(): void {
    this.itinerarioService.getAll().subscribe({
      next: (data) => this.itinerarioList = data,
      error: () => this.notification.showMessage('No se pudieron cargar los itinerarios', 'error')
    });
  }
}
