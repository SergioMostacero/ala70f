import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, ValidatorFn, AbstractControl } from '@angular/forms';
import { ItinerarioService } from '../../../Services/itinerario.service';
import { UbicacionService } from '../../../Services/ubicacion.service';
import { Router } from '@angular/router';
import { RouteEncoderService } from '../../../Services/route-encoder.service';

@Component({
  selector: 'app-create-itinerary',
  templateUrl: './create-itinerary.component.html',
  styleUrls: ['./create-itinerary.component.scss']
})
export class CreateItineraryComponent implements OnInit {
  itineraryForm: FormGroup;
  ubicaciones: any[] = [];

  constructor(
    private encoder: RouteEncoderService,
    private fb: FormBuilder,
    private itinerarioService: ItinerarioService,
    private ubicacionService: UbicacionService,
    private router: Router
  ) {
    this.itineraryForm = this.fb.group({
      duracion: ['', Validators.required],
      pasos: this.fb.array([
        this.createPaso(1),  // Paso inicial 1
        this.createPaso(2)   // Paso inicial 2 (mínimo requerido)
      ], { validators: this.minPasosValidator(2) })
    });
  }

  ngOnInit(): void {
    this.ubicacionService.getAll().subscribe(data => {
      this.ubicaciones = data.map(ubicacion => ({
        ...ubicacion,
        ciudad: ubicacion.ciudad.split('/').pop() 
      }));
    });
  }

  createPaso(orden: number) {
    return this.fb.group({
      ubicacionId: [null, Validators.required],
      orden: [orden, [Validators.required, Validators.min(1)]]
    });
  }

  get pasos(): FormArray {
    return this.itineraryForm.get('pasos') as FormArray;
  }

  get pasosError() {
    return this.pasos.length < 2 ? 'Debe haber al menos 2 ciudades (origen y destino)' : '';
  }

  minPasosValidator(min: number): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const formArray = control as FormArray;
      return formArray.length >= min ? null : { minPasos: true };
    };
  }

  addPaso(): void {
    const nextOrder = this.pasos.length + 1;
    this.pasos.push(this.createPaso(nextOrder));
  }

  removePaso(i: number): void {
    if (this.pasos.length > 2) {  // No permitir eliminar si quedan solo 2
      this.pasos.removeAt(i);
      this.reindexarOrden();
    }
  }

  private reindexarOrden() {
    this.pasos.controls.forEach((ctrl, idx) => {
      ctrl.patchValue({ orden: idx + 1 });
    });
  }

  onSubmit(): void {
    if (this.itineraryForm.invalid || this.pasos.length < 2) return;

    const form = this.itineraryForm.value;
    const dto = {
      nombre: '',
      duracion: form.duracion,
      itinerarioUbicacionDTO: form.pasos.map((p: any) => ({
        ubicacionDTO: { id: p.ubicacionId },
        orden: p.orden
      }))
    };

    this.itinerarioService.create(dto)
      .subscribe(() => this.router.navigate([this.encoder.encode('management')]));
  }

  goBack(): void {
    this.router.navigate([ this.encoder.encode('management') ]);
  }

  // Dentro de la clase CreateItineraryComponent

  reverseItinerary(): void {
    const pasosArray = this.pasos;
    
    // Invertir el orden de los pasos
    pasosArray.controls.reverse();
    
    // Actualizar los números de orden
    pasosArray.controls.forEach((ctrl, index) => {
      ctrl.patchValue({ orden: index + 1 });
    });
  }
}