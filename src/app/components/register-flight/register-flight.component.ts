import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { VueloService } from '../../Services/vuelo.service';
import { ItinerarioService } from '../../Services/itinerario.service';
import { MisionService } from '../../Services/mision.service';
import { AvionService } from '../../Services/avion.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register-flight',
  templateUrl: './register-flight.component.html',
  styleUrls: ['./register-flight.component.scss']
})
export class RegisterFlightComponent implements OnInit {
  vueloForm!: FormGroup;

  avionList: any[] = [];
  misionList: any[] = [];
  itinerarioList: any[] = [];

  constructor(
    private fb: FormBuilder,
    private vueloService: VueloService,
    private itinerarioService: ItinerarioService,
    private misionService: MisionService,
    private avionService: AvionService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadAviones();
    this.loadMisiones();
    this.loadItinerarios();
  }

  private initForm(): void {
    this.vueloForm = this.fb.group({
      fecha: ['', Validators.required],
      hora_salida: ['', Validators.required],
      hora_llegada: ['', Validators.required],
      anticipo: ['', Validators.required],
      gasolina: ['', Validators.required],
      avionDTO: this.fb.group({ id: [null] }),
      misionDTO: this.fb.group({ id: [null] }),
      itinerarioDTO: this.fb.group({ id: [null] })
    });
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
      const vueloData = this.vueloForm.value;
      this.vueloService.createVuelo(vueloData).subscribe({
        next: () => {
          alert('¡Vuelo creado con éxito!');
          this.vueloForm.reset();
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

  goBack(): void {
    this.router.navigate(['/flights']);
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
