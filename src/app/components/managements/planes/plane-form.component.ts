import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';

import { AvionService } from 'src/app/Services/avion.service';
import { NotificationService } from 'src/app/utils/notification.service';

@Component({
  selector: 'app-plane-form',
  templateUrl: './plane-form.component.html',
  styleUrls: ['./plane-form.component.scss']
})
export class PlaneFormComponent implements OnInit {
  planes: any[] = [];
  planeForm!: FormGroup;
  isEdit = false;
  private currentId?: number;

  constructor(
    private fb: FormBuilder,
    private avionService: AvionService,
    private notification: NotificationService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadPlanes();
  }

  private initForm(): void {
  this.planeForm = this.fb.group({
    nombre:        ['', Validators.required],
    maxCombustible:[null, [Validators.required, Validators.min(0)]]
  });

  }

  private loadPlanes(): void {
    this.avionService.getAll().subscribe({
      next: list => this.planes = list,
      error: () => this.notification.showMessage('Error al cargar aviones', 'error')
    });
  }

  /** Cuando clicas ✏️ Editar */
  editPlane(plane: any): void {
    this.isEdit = true;
    this.currentId = plane.id;
    this.planeForm.patchValue({
    nombre: plane.nombre,
    maxCombustible: plane.maxCombustible 
  });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  /** Crear o Guardar cambios */
  onSubmit(): void {
    if (this.planeForm.invalid) {
      this.notification.showMessage('Completa el formulario correctamente.', 'error');
      return;
    }
    const dto = this.planeForm.value;

    if (this.isEdit && this.currentId != null) {
      // ACTUALIZAR
      dto.id = this.currentId;
      this.avionService.update(dto).subscribe({
        next: () => {
          this.notification.showMessage('Avión actualizado.', 'success');
          this.afterSave();
        },
        error: () => this.notification.showMessage('Error al actualizar.', 'error')
      });
    } else {
      // CREAR
      this.avionService.create(dto).subscribe({
        next: () => {
          this.notification.showMessage('Avión creado.', 'success');
          this.afterSave();
        },
        error: () => this.notification.showMessage('Error al crear.', 'error')
      });
    }
  }

  /** Borrar con confirmación SweetAlert2 */
  deletePlane(id: number): void {
    Swal.fire({
      title: '¿Eliminar avión?',
      text: 'Esta acción no se puede deshacer',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, borrar',
      cancelButtonText: 'Cancelar',
      reverseButtons: true,
      confirmButtonColor: '#d33',
      customClass: { popup: 'dark' }
    }).then(res => {
      if (!res.isConfirmed) return;
      this.avionService.delete(id).subscribe({
        next: () => {
          this.planes = this.planes.filter(p => p.id !== id);
          Swal.fire('¡Borrado!', 'Avión eliminado.', 'success');
        },
        error: () => Swal.fire('Error', 'No se pudo eliminar.', 'error')
      });
    });
  }

  /** Reinicia formulario a modo “crear” y recarga lista */
  resetForm(): void {
    this.isEdit = false;
    this.currentId = undefined;
    this.planeForm.reset();
  }

  /** Tras crear/editar recarga lista y resetea */
  private afterSave(): void {
    this.loadPlanes();
    this.resetForm();
  }
}
