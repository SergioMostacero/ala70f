import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { VueloService } from '../Services/vuelo.service';

@Component({
  selector: 'app-vuelos',
  templateUrl: './vuelos.component.html',
  styleUrls: ['./vuelos.component.scss']
})
export class VuelosComponent implements OnInit {
  vueloForm!: FormGroup;

  // Listas para selects
  avionList: any[] = [];
  misionList: any[] = [];
  itinerarioList: any[] = [];

  constructor(
    private fb: FormBuilder,
    private vueloService: VueloService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadAviones();
    this.loadMisiones();
    this.loadItinerarios();
  }

  // Inicializa el formulario Reactivo
  private initForm(): void {
    this.vueloForm = this.fb.group({
      fecha: ['', Validators.required],
      hora_salida: ['', Validators.required],
      hora_llegada: ['', Validators.required],
      anticipo: ['', Validators.required],
      gasolina: ['', Validators.required],
      avionDTO: this.fb.group({ id: [null] }),
      misionesDTO: this.fb.group({ id: [null] }),
      itinerarioDTO: this.fb.group({ id: [null] })
    });
  }

  private loadAviones(): void {
    // Simulando datos; aquí llamarías a tu servicio real
    this.avionList = [
      { id: 1, nombre: 'Boeing 737' },
      { id: 2, nombre: 'Airbus A320' }
    ];
  }

  private loadMisiones(): void {
    this.misionList = [
      { id: 10, nombre: 'Misión de rescate' },
      { id: 11, nombre: 'Entrenamiento' }
    ];
  }

  private loadItinerarios(): void {
    this.itinerarioList = [
      { id: 100, nombre: 'Ruta A' },
      { id: 101, nombre: 'Ruta B' }
    ];
  }

  createVuelo(): void {
    if (this.vueloForm.valid) {
      const vueloData = this.vueloForm.value;
      this.vueloService.createVuelo(vueloData).subscribe({
        next: (created) => {
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
}
