import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { ItinerarioService } from '../../../Services/itinerario.service';
import { UbicacionService } from '../../../Services/ubicacion.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-itinerary',
  templateUrl: './create-itinerary.component.html',
  styleUrls: ['./create-itinerary.component.scss']
})
export class CreateItineraryComponent implements OnInit {
  itineraryForm: FormGroup;
  ubicaciones: any[] = [];

  constructor(
    private fb: FormBuilder,
    private itinerarioService: ItinerarioService,
    private ubicacionService: UbicacionService,
    private router: Router
  ) {
    this.itineraryForm = this.fb.group({
      duracion: ['', Validators.required],
      pasos: this.fb.array([
        this.fb.group({
          ubicacionId: [null, Validators.required],
          orden: [1, [Validators.required, Validators.min(1)]]
        })
      ])
    });
  }

  ngOnInit(): void {
    this.ubicacionService.getAll()
      .subscribe(data => this.ubicaciones = data);
  }

  get pasos(): FormArray {
    return this.itineraryForm.get('pasos') as FormArray;
  }

  addPaso(): void {
    const nextOrder = this.pasos.length + 1;
    this.pasos.push(this.fb.group({
      ubicacionId: [null, Validators.required],
      orden: [nextOrder, [Validators.required, Validators.min(1)]]
    }));
  }

  removePaso(i: number): void {
    if (this.pasos.length > 1) {
      this.pasos.removeAt(i);
      // reindexar orden
      this.pasos.controls.forEach((ctrl, idx) => {
        ctrl.patchValue({ orden: idx + 1 });
      });
    }
  }

  onSubmit(): void {
    if (this.itineraryForm.invalid) return;

    const form = this.itineraryForm.value;
    const dto = {
      nombre: '',    // el backend lo reconstruye a partir de ciudades y orden
      duracion: form.duracion,
      itinerarioUbicacionDTO: form.pasos.map((p: any) => ({
        ubicacionDTO: { id: p.ubicacionId },
        orden: p.orden
      }))
    };

    this.itinerarioService.create(dto)
      .subscribe(() => this.router.navigate(['/itinerarios']));
  }
}
