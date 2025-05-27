import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';

import { AvionService } from 'src/app/Services/avion.service';
import { NotificationService } from 'src/app/utils/notification.service';
import { Router } from '@angular/router';
import { RouteEncoderService } from 'src/app/Services/route-encoder.service';

@Component({
  selector: 'app-plane-form',
  templateUrl: './plane-form.component.html',
  styleUrls: ['./plane-form.component.scss']
})
export class PlaneFormComponent implements OnInit {
  planes: any[] = [];
  planeForm!: FormGroup;
  isEdit   = false;   
  showForm = false;
  private currentId?: number;
  @ViewChild('formSection') formSection!: ElementRef;

  constructor(
    private fb: FormBuilder,
    private avionService: AvionService,
    private notification: NotificationService,
    private router: Router,
    private encoder: RouteEncoderService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadPlanes();
  }

  private initForm(): void {
    this.planeForm = this.fb.group({
    nombre:         ['', Validators.required],
    maxCombustible: [null, [Validators.required, Validators.min(0)]]
  });
  }

  //carga todos los aviones
  private loadPlanes(): void {
    this.avionService.getAll().subscribe({
      next: list => this.planes = list,
      error: () => this.notification.showMessage('Error al cargar aviones', 'error')
    });
  }

  //edita el avion saca el form
  editPlane(plane: any): void {
    this.isEdit   = true;      
    this.showForm = true;      
    this.currentId = plane.id;

    this.planeForm.patchValue({
      nombre:         plane.nombre,
      maxCombustible: plane.max_combustible
    });

    setTimeout(() =>
      this.formSection.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'start' })
    );
  }

  //guarda los cambios del form
  onSubmit(): void {
    if (this.planeForm.invalid) return this.notification.showMessage('Completa el formulario correctamente.', 'error');

    const { nombre, maxCombustible } = this.planeForm.value;

    const dto = {
    id: this.currentId,
    nombre: nombre,
    max_combustible: Number(maxCombustible) 
  };

    if (this.isEdit && this.currentId != null) {
      this.avionService.update(dto).subscribe({
        next: () => {
          this.notification.showMessage('Avión actualizado.', 'success');
          this.afterSave();
        },
        error: () => this.notification.showMessage('Error al actualizar.', 'error')
      });
    } else {
      this.avionService.create(dto).subscribe({
        next: () => {
          this.notification.showMessage('Avión creado.', 'success');
          this.afterSave();
        },
        error: () => this.notification.showMessage('Error al crear.', 'error')
      });
    }
  }

  deletePlane(id: number): void {
    Swal.fire({
      title: '¿Eliminar avión?',
      text: 'Se borrarán todos los vuelos asociados a este avión',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, borrar',
      cancelButtonText: 'Cancelar',
      reverseButtons: true,
      confirmButtonColor: '#d33',
      customClass: { popup: 'dark' }     
    }).then(res => {
      if (!res.isConfirmed) { return; }

      this.avionService.delete(id).subscribe({
        next: () => {
          this.planes = this.planes.filter(p => p.id !== id);

          Swal.fire({
            title: '¡Borrado!',
            text: 'Avión eliminado correctamente.',
            icon: 'success',
            confirmButtonText: 'Aceptar',
            customClass: { popup: 'dark' }  
          });
        },
        error: err => {
          console.error(err);
          Swal.fire({
            title: 'Error',
            text: 'No se pudo eliminar el avión',
            icon: 'error',
            confirmButtonText: 'Cerrar',
            customClass: { popup: 'dark' }  
          });
        }
      });
    });
  }

  //resetea el form al darla a cancelar
  resetForm(): void {
    this.showForm = false;     
    this.isEdit   = false;
    this.currentId = undefined;
    this.planeForm.reset();
  }


  private afterSave(): void {
    this.loadPlanes();
    this.resetForm();
  }

  goBack(): void {
    this.router.navigate([ this.encoder.encode('management') ]);
  }

  newPlane(): void {
    this.isEdit   = false;      
    this.showForm = true;       
    this.currentId = undefined;

    this.planeForm.reset();   
    setTimeout(() =>
      this.formSection.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'start' })
    );
  }


}
