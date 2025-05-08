import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, AbstractControl } from '@angular/forms';
import { ItinerarioService } from '../../../Services/itinerario.service';
import { UbicacionService } from '../../../Services/ubicacion.service';
import { Router } from '@angular/router';
import { RouteEncoderService } from '../../../Services/route-encoder.service';
import { NotificationService } from '../../../utils/notification.service';

@Component({
  selector: 'app-create-itinerary',
  templateUrl: './create-itinerary.component.html',
  styleUrls: ['./create-itinerary.component.scss']
})
export class CreateItineraryComponent implements OnInit {
  itineraryForm!: FormGroup; // Usamos el operador ! para evitar el error de inicialización
  ubicaciones: any[] = [];

  constructor(
    private encoder: RouteEncoderService,
    private fb: FormBuilder,
    private itinerarioService: ItinerarioService,
    private ubicacionService: UbicacionService,
    private router: Router,
    private notification: NotificationService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadUbicaciones();
  }

  private initForm(): void {
    this.itineraryForm = this.fb.group({
      duracion: ['', Validators.required],
      pasos: this.fb.array([this.createPaso(1), this.createPaso(2)])
    });
  }

  private loadUbicaciones(): void {
    this.ubicacionService.getAll().subscribe({
      next: (data) => {
        this.ubicaciones = data;
      },
      error: () => this.notification.showMessage('Error al cargar ubicaciones', 'error')
    });
  }

  get pasos(): FormArray {
    return this.itineraryForm.get('pasos') as FormArray;
  }

  get pasosError(): string {
    return this.pasos.length < 2 
      ? 'Debe haber al menos 2 ciudades (origen y destino)' 
      : '';
  }

  createPaso(orden: number): FormGroup {
    return this.fb.group({
      ubicacionId: [null, Validators.required],
      orden: [orden, [Validators.required, Validators.min(1)]]
    });
  }

  addPaso(): void {
    const nextOrder = this.pasos.length + 1;
    this.pasos.push(this.createPaso(nextOrder));
  }

  removePaso(i: number): void {
    if (this.pasos.length > 2) {
      this.pasos.removeAt(i);
      this.reindexarOrden();
    }
  }

  reindexarOrden(): void {
    this.pasos.controls.forEach((ctrl, idx) => {
      ctrl.patchValue({ orden: idx + 1 });
    });
  }

  onPasoChange(index: number): void {
    const pasosArray = this.pasos.controls;
    const pasoActual = pasosArray[index];
    
    if (index > 0) {
      const pasoAnterior = pasosArray[index - 1];
      if (pasoActual.get('ubicacionId')?.value === pasoAnterior.get('ubicacionId')?.value) {
        pasoActual.get('ubicacionId')?.setErrors({ repetido: true });
        this.notification.showMessage('No puedes repetir la misma ubicación consecutiva', 'error');
      } else {
        pasoActual.get('ubicacionId')?.setErrors(null);
      }
    }

    if (index < pasosArray.length - 1) {
      const pasoSiguiente = pasosArray[index + 1];
      if (pasoActual.get('ubicacionId')?.value === pasoSiguiente.get('ubicacionId')?.value) {
        pasoActual.get('ubicacionId')?.setErrors({ repetido: true });
        this.notification.showMessage('No puedes repetir la misma ubicación consecutiva', 'error');
      } else {
        pasoActual.get('ubicacionId')?.setErrors(null);
      }
    }
  }

  onSubmit(): void {
    if (this.itineraryForm.invalid || this.pasos.length < 2) {
      this.notification.showMessage('Completa el formulario correctamente.', 'error');
      return;
    }

    const form = this.itineraryForm.value;
    const dto = {
      nombre: '',
      duracion: form.duracion,
      itinerarioUbicacionDTO: form.pasos.map((p: any) => ({
        ubicacionDTO: { id: p.ubicacionId },
        orden: p.orden
      }))
    };

    this.itinerarioService.create(dto).subscribe({
      next: () => {
        this.notification.showMessage('Itinerario creado correctamente.', 'success');
        this.router.navigate([this.encoder.encode('management')]);
      },
      error: () => {
        this.notification.showMessage('Error al crear el itinerario.', 'error');
      }
    });
  }

  reverseItinerary(): void {
    const pasosArray = this.pasos;
    pasosArray.controls.reverse();
    this.reindexarOrden();
  }

  goBack(): void {
    this.router.navigate([this.encoder.encode('management')]);
  }
}
