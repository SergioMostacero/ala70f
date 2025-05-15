import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { VueloService } from '../../../Services/vuelo.service';
import { ItinerarioService } from '../../../Services/itinerario.service';
import { MisionService } from '../../../Services/mision.service';
import { AvionService } from '../../../Services/avion.service';
import { TripulantesService } from '../../../Services/tripulantes.service';
import { NotificationService } from '../../../utils/notification.service';
import { RouteEncoderService } from '../../../Services/route-encoder.service';
import { Avion } from 'src/app/model/avion.model';
import { forkJoin } from 'rxjs';
import { Vuelo } from 'src/app/model/vuelo.model';


@Component({
  selector: 'app-editar-vuelo',
  templateUrl: './editar-vuelo.component.html',
  styleUrls: ['./editar-vuelo.component.scss']
})
export class EditarVueloComponent implements OnInit {
  vueloForm!: FormGroup;
  vueloId!: number;

  itinerarioList: any[] = [];
  avionList: Avion[] = [];
  misionList: any[] = [];
  pilotosList: any[] = [];
  copilotosList: any[] = [];
  mecanicosList: any[] = [];
  tecnicoComList: any[] = [];

  duracionItinerario = "";
  horaLlegada = '';
  maxCombustibleMessage = '';
  maxCombustible = 0;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private encoder: RouteEncoderService,
    private vueloService: VueloService,
    private itinerarioService: ItinerarioService,
    private misionService: MisionService,
    private avionService: AvionService,
    private tripulantesService: TripulantesService,
    private notification: NotificationService
  ) {}

  /* ------------------------ INIT ------------------------ */
  ngOnInit(): void {
    this.vueloId = Number(this.route.snapshot.paramMap.get('id'));
    if (!this.vueloId) {
      this.notification.showMessage('ID de vuelo no válido', 'error');
      this.goBack();
      return;
    }

    this.initForm();
    this.loadCatalogos();
    this.loadVuelo();
  }
  private setTripulanteSelects(tripus: any[]): void {
  this.vueloForm.patchValue({
    piloto:     tripus.find(t => t.oficioDTO.nombre === 'Piloto')?.id ?? null,
    copiloto:   tripus.find(t => t.oficioDTO.nombre === 'Copiloto')?.id ?? null,
    mecanico:   tripus.find(t => t.oficioDTO.nombre.includes('Mecánico'))?.id ?? null,
    tecnicoCom: tripus.find(t => t.oficioDTO.nombre.includes('Técnico'))?.id ?? null,
  }, { emitEvent: false });
}

  /* -------------------- Formulario --------------------- */
  private initForm(): void {
    this.vueloForm = this.fb.group({
      fecha_salida: ['', Validators.required],
      hora_salida: ['', Validators.required],
      hora_llegada: ['', Validators.required],
      fecha_llegada: ['', Validators.required],
      anticipo: ['', Validators.required],
      combustible: ['', Validators.required],

      avionDTO: this.fb.group({ id: [null] }),
      misionDTO: this.fb.group({ id: [null] }),
      itinerarioDTO: this.fb.group({ id: [null] }),

      piloto: [null, Validators.required],
      copiloto: [null],
      mecanico: [null],
      tecnicoCom: [null]
    });
  }

  private loadVuelo(): void {

  forkJoin({
    vuelo  : this.vueloService.getVueloById(this.vueloId),          // Observable<Vuelo>
    tripus : this.tripulantesService.getTripulantesByVuelo(this.vueloId) // Observable<any[]>
  }).subscribe({
    next: ({ vuelo, tripus }) => {

      // 1. Datos básicos del vuelo
      this.vueloForm.patchValue({
        ...vuelo,
        avionDTO     : { id: vuelo.avionDTO?.id },
        misionDTO    : { id: vuelo.misionDTO?.id },
        itinerarioDTO: { id: vuelo.itinerarioDTO?.id }
      }, { emitEvent: false });

      // 2. Distribuir tripulantes
      this.setTripulanteSelects(tripus);

      // 3. Resto de lógica
      this.duracionItinerario = vuelo.itinerarioDTO?.duracion ?? '00:00';
      this.onAvionChange();

      this.vueloForm.get('hora_salida')!
        .valueChanges.subscribe(() => this.updateHoraLlegada());

      this.itinerarioFormGroup.get('id')!
        .valueChanges.subscribe(() => this.onItinerarioChange());
    },
    error: () =>
      this.notification.showMessage('Error cargando datos del vuelo', 'error')
  });
}


  /* ------------------- Guardar cambios ------------------ */
  saveChanges(): void {
    if (this.vueloForm.invalid) {
      this.notification.showMessage('Complete todos los campos', 'error');
      return;
    }

    const pilotoId     = this.vueloForm.get('piloto')!.value;
    const copilotoId   = this.vueloForm.get('copiloto')!.value;
    const mecanicoId   = this.vueloForm.get('mecanico')!.value;
    const tecnicoComId = this.vueloForm.get('tecnicoCom')!.value;

    const tripulanteIds = new Set<number>([
      pilotoId, copilotoId, mecanicoId, tecnicoComId
    ].filter(Boolean) as number[]);            // filtra null/undefined

    const vueloData = {
      ...this.vueloForm.getRawValue(),
      tripulantesDTO: Array.from(tripulanteIds).map(id => ({ id }))
    };

    this.vueloService.updateVuelo(this.vueloId, vueloData).subscribe({
      next: () => {
        this.notification.showMessage('Vuelo actualizado', 'success');
        this.goBack();
      },
      error: () =>
        this.notification.showMessage('No se pudo actualizar', 'error')
    });
  }

  /* -------------------- UX Helpers ---------------------- */
  goBack(): void {
    this.router.navigate([this.encoder.encode('flights')]);
  }

  /* ---------- Eventos de select / input  ---------- */
  onAvionChange(): void {
    const avionId = this.avionFormGroup.get('id')?.value;
    const selectedAvion = this.avionList.find(a => a.id === avionId);

    this.maxCombustible = selectedAvion?.max_combustible || 0;
    this.maxCombustibleMessage = this.maxCombustible ? `${this.maxCombustible}` : '';
    this.validateCombustible();
  }

  onItinerarioChange(): void {
    const itiId = this.itinerarioFormGroup.get('id')?.value;
    if (itiId) {
      this.itinerarioService.getById(itiId).subscribe({
        next: data => {
          this.duracionItinerario = data.duracion;
          this.updateHoraLlegada();
        }
      });
    }
  }

  onHoraSalidaChange(): void {
    this.updateHoraLlegada();
  }

  updateHoraLlegada(): void {
    const horaSalida  = this.vueloForm.get('hora_salida')?.value;
    const fechaSalida = this.vueloForm.get('fecha_salida')?.value;
    const duracion    = this.duracionItinerario;

    if (horaSalida && fechaSalida && duracion) {
      const [durH, durM] = duracion.toString().split(':').map(Number);
      const salidaDate   = new Date(`${fechaSalida}T${horaSalida}:00`);

      salidaDate.setHours(salidaDate.getHours() + durH);
      salidaDate.setMinutes(salidaDate.getMinutes() + durM);

      const hours   = String(salidaDate.getHours()).padStart(2, '0');
      const minutes = String(salidaDate.getMinutes()).padStart(2, '0');
      const fechaLlegadaStr = salidaDate.toISOString().split('T')[0];

      this.vueloForm.patchValue({
        hora_llegada: `${hours}:${minutes}`,
        fecha_llegada: fechaLlegadaStr
      }, { emitEvent: false });
    }
  }

  validateCombustible(): void {
    const control    = this.vueloForm.get('combustible');
    const value      = Number(control?.value);
    const isTooMuch  = value > this.maxCombustible;

    control?.setErrors(isTooMuch ? { max: true } : null);
    if (isTooMuch) {
      this.notification.showMessage(
        `El combustible no puede exceder ${this.maxCombustible} toneladas.`,
        'error'
      );
    }
  }

  /* ----------------- Helpers de acceso ------------------ */
  get avionFormGroup(): FormGroup     { return this.vueloForm.get('avionDTO') as FormGroup; }
  get misionesFormGroup(): FormGroup  { return this.vueloForm.get('misionDTO') as FormGroup; }
  get itinerarioFormGroup(): FormGroup{ return this.vueloForm.get('itinerarioDTO') as FormGroup; }

  /* ------------------ Catálogos ------------------ */
  private loadCatalogos(): void {
    this.avionService.getAll().subscribe({
      next: data => this.avionList = data,
      error: ()  => this.notification.showMessage('Error cargando aviones', 'error')
    });
    this.misionService.getAll().subscribe({
      next: data => this.misionList = data
    });
    this.itinerarioService.getAll().subscribe({
      next: data => this.itinerarioList = data
    });
    this.tripulantesService.getPilotos().subscribe({ next: d => this.pilotosList   = d });
    this.tripulantesService.getCoPilotos().subscribe({ next: d => this.copilotosList = d });
    this.tripulantesService.getMecanicos().subscribe({ next: d => this.mecanicosList = d });
    this.tripulantesService.getTecnicosCom().subscribe({ next: d => this.tecnicoComList = d });
  }
}
